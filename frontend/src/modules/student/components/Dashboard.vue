<template>
  <div
    class="dashboard-container"
    tabindex="0"
    ref="dashboardContainer"
    @keydown="handleKeyDown"
    aria-labelledby="dashboard-title"
  >
    <!-- Header -->
    <header class="header high-contrast" role="banner">
      <h1 id="dashboard-title" class="visually-hidden">Student Dashboard</h1>
    </header>

    <!-- Main -->
    <main class="main-content" role="main" aria-live="polite">
      <!-- Welcome -->
      <section
        ref="welcomeMessage"
        class="welcome-section"
        tabindex="0"
        aria-label="Welcome message"
      >
        <h2 class="visually-hidden">Welcome Message</h2>
        <p v-if="!hasInteracted">Hello, {{ studentName }} — say "Take Exam" to start, or press Enter.</p>
      </section>

      <!-- Loading / Error -->
      <div v-if="loading" class="loading" aria-live="polite">Loading exams...</div>
      <div v-if="error" class="error" role="alert">{{ error }}</div>

      <!-- Exams list -->
      <section v-if="showExams" class="exam-list" aria-label="Published exams" aria-live="polite">
        <div
          v-for="(exam, index) in publishedExams"
          :key="exam.id || index"
          :class="['exam-item', { current: index === currentExamIndex }]"
          tabindex="0"
          :aria-current="index === currentExamIndex ? 'true' : 'false'"
        >
          <h3>{{ exam.title }}</h3>
          <p>Course: {{ exam.courseName || '—' }}</p>
          <p>Duration: {{ exam.duration ?? '—' }} minutes</p>
          <p>Total Marks: {{ exam.totalMarks ?? '—' }}</p>
        </div>

        <div v-if="publishedExams.length === 0" class="no-exams">No published exams available at the moment</div>
      </section>
    </main>

    <!-- Voice / mic -->
    <div class="voice-commands" aria-hidden="false">
      <button
        ref="micButton"
        class="mic-button"
        :class="{ active: isListening }"
        @click="toggleVoiceInput"
        :aria-pressed="isListening.toString()"
        aria-label="Toggle voice input"
      >
        <span class="visually-hidden">Toggle Voice Input</span>
        <i class="fas fa-microphone" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
/*
  Rewritten StudentDashboard
  - Robust speech recognition (SpeechRecognition / webkitSpeechRecognition)
  - speak queue/guard
  - safe fetch with injected getRequest fallback to api.getPublishedExams.url
  - cleans up handlers & timers on unmount
  - keyboard handling
*/

import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import api from '../api' // used as a fallback if getRequest not injected

// Router & store
const router = useRouter()
const userStore = useUserStore()
const studentName = computed(() => userStore.user?.fullName || 'Student')

// Optional injected network helpers (from parent / app)
const getRequest = inject('getRequest', null)
const postRequest = inject('postRequest', null)

// DOM refs & reactive state
const dashboardContainer = ref(null)
const welcomeMessage = ref(null)
const micButton = ref(null)

const hasInteracted = ref(false)
const showExams = ref(false)
const publishedExams = ref([])
const currentExamIndex = ref(0)
const loading = ref(false)
const error = ref(null)
const wantsToReload = ref(false)
const isListening = ref(false)
const tutorialMode = ref(false)

// timers & recognition
let welcomeInterval = null
let welcomeTimeout = null
let recognition = null

// computed current exam - defined before use
const currentExam = computed(() => publishedExams.value[currentExamIndex.value] || null)

// TTS guard to prevent overlapping utterances
let speaking = false
const speak = (text) => {
  try {
    // If SpeechSynthesis is not supported, just console.log
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      // graceful fallback
      console.info('TTS not supported; text:', text)
      return
    }

    // cancel existing only if queueing would be a problem; we use guard instead
    if (speaking) {
      // optionally cancel current and speak new one. For now, ignore new if speaking.
      return
    }

    speaking = true
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.onend = () => { speaking = false }
    u.onerror = () => { speaking = false }
    window.speechSynthesis.speak(u)
  } catch (err) {
    console.warn('speak() failed:', err)
    speaking = false
  }
}

// --- Welcome message / interval logic ---
const announceWelcome = () => {
  if (!hasInteracted.value && !welcomeTimeout) {
    const message = `${studentName.value}, welcome to the exam platform. Say "Take Exam" to start an exam, "View Progress" to check your performance, or "Help" for a tutorial.`
    speak(message)
    // block immediate repeats for 10s
    welcomeTimeout = setTimeout(() => { welcomeTimeout = null }, 10000)
  }
}

const startWelcomeInterval = () => {
  // clear any existing
  if (welcomeInterval) {
    clearInterval(welcomeInterval)
    welcomeInterval = null
  }
  // initial announcement shortly after mount
  setTimeout(announceWelcome, 1000)
  welcomeInterval = setInterval(() => {
    if (!hasInteracted.value) {
      announceWelcome()
    } else {
      clearInterval(welcomeInterval)
      welcomeInterval = null
    }
  }, 15000)
}

const resetToWelcome = () => {
  showExams.value = false
  hasInteracted.value = false
  currentExamIndex.value = 0
  // clear timers and restart welcome
  if (welcomeTimeout) { clearTimeout(welcomeTimeout); welcomeTimeout = null }
  if (welcomeInterval) { clearInterval(welcomeInterval); welcomeInterval = null }
  startWelcomeInterval()
}

// --- Safe SpeechRecognition initialization ---
const getSpeechRecognitionConstructor = () => {
  // handles non-standard vendor prefix
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

const initSpeechRecognition = () => {
  const SR = getSpeechRecognitionConstructor()
  if (!SR) {
    console.info('Speech recognition not supported in this browser')
    return
  }

  try {
    // create a new one each init to avoid reusing stale instance
    recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = false // only final results
    recognition.lang = navigator.language || 'en-US'

    // ensure previous handlers are not attached (defensive)
    recognition.onresult = null
    recognition.onerror = null
    recognition.onend = null

    recognition.onresult = (event) => {
      // Take the last final result
      try {
        const results = event.results
        const last = results[results.length - 1]
        const transcript = (last[0]?.transcript || '').trim().toLowerCase()
        if (transcript) {
          handleVoiceCommand(transcript)
        }
      } catch (e) {
        console.warn('onresult handling failed', e)
      }
    }

    recognition.onerror = (ev) => {
      console.error('Speech recognition error:', ev)
      speak('Voice recognition encountered an error. Try again or use the keyboard.')
      isListening.value = false
    }

    recognition.onend = () => {
      // if we expected it to be running and it stopped unexpectedly, update state
      if (isListening.value) {
        // do not auto-restart here to avoid loops; user can toggle again
        isListening.value = false
      }
    }

    // start automatically if user has not disabled voice
    // wrap start in try/catch — starting may throw (e.g. permission denied)
    try {
      recognition.start()
      isListening.value = true
    } catch (err) {
      console.warn('Recognition start failed:', err)
      isListening.value = false
    }
  } catch (err) {
    console.error('initSpeechRecognition failed', err)
  }
}

const stopRecognition = () => {
  try {
    if (recognition) {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      recognition.stop()
      isListening.value = false
    }
  } catch (e) {
    console.warn('stopRecognition failed', e)
  }
}

// Toggle mic button
const toggleVoiceInput = () => {
  if (!recognition) {
    // Try to initialize then start if possible
    initSpeechRecognition()
    if (!recognition) {
      speak('Voice commands are not supported in this browser.')
      return
    }
  }

  try {
    if (isListening.value) {
      stopRecognition()
      speak('Voice commands deactivated')
    } else {
      try {
        recognition.start()
        isListening.value = true
        speak('Voice commands activated. Say "Help" for available commands.')
      } catch (e) {
        console.warn('Failed to start recognition:', e)
        speak('Unable to start voice recognition. Please check microphone permissions.')
      }
    }
  } catch (e) {
    console.warn('toggleVoiceInput error', e)
  }
}

// --- Voice command handler ---
const handleVoiceCommand = (command) => {
  // mark user interaction so welcome stops
  hasInteracted.value = true
  // basic commands
  if (command.includes('take exam')) {
    if (currentExam.value && currentExam.value.id) {
      goToExam(currentExam.value.id)
    } else {
      showExams.value = true
      fetchExams()
    }
  } else if (command.includes('view progress')) {
    speak('Opening progress view')
    router.push('/student/progress')
  } else if (command.includes('help')) {
    showTutorial()
  } else if (command.includes('log out') || command.includes('logout')) {
    speak('Logging out')
    // assume userStore has logout
    if (typeof userStore.logout === 'function') userStore.logout()
    router.push('/login')
  } else if (command.includes('next exam')) {
    if (currentExamIndex.value < publishedExams.value.length - 1) {
      currentExamIndex.value++
      announceExam()
    } else {
      speak('This is the last exam.')
    }
  } else if (command.includes('previous exam') || command.includes('prev exam')) {
    if (currentExamIndex.value > 0) {
      currentExamIndex.value--
      announceExam()
    } else {
      speak('This is the first exam.')
    }
  } else if (command.includes('repeat')) {
    if (tutorialMode.value) {
      showTutorial()
    } else {
      announceExam()
    }
  } else {
    // unknown command - friendly feedback
    console.info('Unrecognized voice command:', command)
  }
}

// --- Tutorial ---
const showTutorial = () => {
  tutorialMode.value = true
  const tutorial = `Welcome to the exam platform tutorial.
  Say "Take Exam" to start an exam.
  Say "View Progress" to check your past performance.
  Say "Help" to hear this tutorial again.
  Say "Log Out" to exit the application.
  During exams use "Next Question" or "Previous Question" and "Repeat Question" to hear the question again.`
  speak(tutorial)
}

// --- Navigation / Enter handling ---
const handleEnterAction = async () => {
  window.speechSynthesis?.cancel()
  hasInteracted.value = true

  // clear welcome timers
  if (welcomeInterval) { clearInterval(welcomeInterval); welcomeInterval = null }
  if (welcomeTimeout) { clearTimeout(welcomeTimeout); welcomeTimeout = null }

  // if error -> try reload exams
  if (error.value) {
    error.value = null
    await fetchExams()
    return
  }

  if (!showExams.value) {
    showExams.value = true
    await fetchExams()
    return
  }

  if (currentExam.value && currentExam.value.id) {
    goToExam(currentExam.value.id)
  } else {
    // nothing to start
    speak('No exam selected. Use arrow keys to select an exam or say "Take Exam".')
  }
}

const handleKeyDown = (e) => {
  // Prevent key events while confirmation for leaving is active
  if (wantsToReload.value) {
    e.preventDefault()
    if (e.key === 'Enter') {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.location.reload()
    } else {
      wantsToReload.value = false
      speak('Reload cancelled. Continuing.')
    }
    return
  }

  switch (e.key) {
    case 'Enter':
      e.preventDefault()
      handleEnterAction()
      break
    case 'ArrowDown':
    case 'ArrowRight':
      if (publishedExams.value.length > 0) {
        currentExamIndex.value = Math.min(currentExamIndex.value + 1, publishedExams.value.length - 1)
        announceExam()
      }
      break
    case 'ArrowUp':
    case 'ArrowLeft':
      if (publishedExams.value.length > 0) {
        currentExamIndex.value = Math.max(currentExamIndex.value - 1, 0)
        announceExam()
      }
      break
    case 'h':
    case 'H':
      showTutorial()
      break
    default:
      // ignore others
      break
  }
}

// --- Beforeunload handling ---
const handleBeforeUnload = (e) => {
  if (!wantsToReload.value) {
    // Modern browsers ignore custom messages, but setting returnValue prompts user
    e.preventDefault()
    e.returnValue = 'Are you sure you want to leave?'
    speak('Warning: You are about to leave the exam platform. Press Enter to reload or any other key to stay.')
    wantsToReload.value = true
    return e.returnValue
  }
}

// --- Fetch exams ---
const fetchExams = async () => {
  loading.value = true
  error.value = null
  try {
    let response = null

    if (getRequest && typeof getRequest === 'function') {
      // expected signature: getRequest({ ...api.getPublishedExams })
      response = await getRequest({ ...(api.getPublishedExams || {}) })
    } else if (api && api.getPublishedExams && api.getPublishedExams.url) {
      // fallback fetch if api exposes a url
      const method = (api.getPublishedExams.method || 'GET').toUpperCase()
      const res = await fetch(api.getPublishedExams.url, { method })
      response = await res.json()
    } else {
      // last-resort: try hitting a conventional endpoint
      const res = await fetch('/api/published-exams')
      response = await res.json()
    }

    // normalize response shape used previously
    if (response?.error) {
      throw new Error(response.error || 'Server reported an error')
    }

    publishedExams.value = response.items || response.data || response.exams || []
    loading.value = false

    if (publishedExams.value.length > 0) {
      // start from current index and announce
      currentExamIndex.value = 0
      await announceExam()
    } else {
      speak('No published exams available at the moment. Please try again later.')
      resetToWelcome()
    }
  } catch (err) {
    console.error('Error fetching exams:', err)
    error.value = 'Failed to load exams. Please try again.'
    loading.value = false
    speak('Error loading exams. Please check your internet connection or try again later.')
    resetToWelcome()
  }
}

// announce current exam (returns promise only to allow awaiting in some flows)
const announceExam = () => {
  if (!currentExam.value) return
  const exam = currentExam.value
  const message = `${exam.title || 'Untitled exam'} for ${exam.courseName || 'unknown course'}. Duration: ${exam.duration ?? 'unknown'} minutes. Total marks: ${exam.totalMarks ?? 'unknown'}. Say "Take Exam" to start this exam.`
  speak(message)
}

// sequentially read exams (keeps 10s gap by default)
const readAllExams = async (gapMs = 10000) => {
  for (let i = 0; i < publishedExams.value.length; i++) {
    currentExamIndex.value = i
    announceExam()
    // wait gapMs (but allow early exit if user interacted)
    const wait = ms => new Promise(res => {
      const t = setTimeout(() => { clearTimeout(t); res() }, ms)
    })
    await wait(gapMs)
    if (hasInteracted.value) break
  }
  speak('Those are all available exams. Say "Take Exam" to start the current exam, or say "Next Exam" to hear the next one.')
}

// navigate to exam view
const goToExam = (examId) => {
  speak('Starting exam. Good luck!')
  router.push(`/student/exam/${examId}`)
}

// --- Lifecycle hooks ---
onMounted(() => {
  // init recognition (if available)
  initSpeechRecognition()

  // attach beforeunload
  window.addEventListener('beforeunload', handleBeforeUnload)

  // start welcome announcements
  startWelcomeInterval()

  // focus container for keyboard input
  if (dashboardContainer.value && dashboardContainer.value.focus) {
    dashboardContainer.value.focus()
  }

  // small vibration for taps on mobile
  if ('vibrate' in navigator) {
    const clickHandler = () => navigator.vibrate(50)
    document.addEventListener('click', clickHandler)
    // store a reference for removal on unmount - reuse named function closure not needed here
    // we'll remove all click listeners on unmount by referencing this same handler via variable
    // but since we created it inside here, keep it as property
    dashboardContainer._mobileVibrateHandler = clickHandler
  }
})

onUnmounted(() => {
  // stop recognition & remove handlers
  try { stopRecognition() } catch (e) { /* ignore */ }

  window.removeEventListener('beforeunload', handleBeforeUnload)

  if (welcomeInterval) { clearInterval(welcomeInterval); welcomeInterval = null }
  if (welcomeTimeout) { clearTimeout(welcomeTimeout); welcomeTimeout = null }

  // remove mobile vibration handler if present
  if (dashboardContainer._mobileVibrateHandler) {
    document.removeEventListener('click', dashboardContainer._mobileVibrateHandler)
    delete dashboardContainer._mobileVibrateHandler
  }
})

// Expose to template
const apiState = {
  dashboardContainer,
  welcomeMessage,
  micButton,
  studentName,
  hasInteracted,
  showExams,
  publishedExams,
  currentExamIndex,
  currentExam,
  loading,
  error,
  isListening,
  handleKeyDown,
  toggleVoiceInput
}

Object.assign({}, apiState) // no-op to satisfy linter in some setups

// return refs for template usage
// In <script setup> everything is directly available, so ensure names exist
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
  color: #212529;
  display: flex;
  flex-direction: column;
}

.high-contrast {
  background-color: #000;
  color: #fff;
}

.welcome-section {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  outline: none;
}

.exam-item {
  padding: 1.25rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  transition: all 0.2s ease;
}

.exam-item.current {
  border: 3px solid #007bff;
}

.exam-item:focus {
  outline: 3px solid #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.12);
}

.mic-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 6px 12px rgba(0,0,0,0.12);
}

.mic-button.active {
  background-color: #dc3545;
  animation: pulse 1.5s infinite;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

.loading, .error, .no-exams {
  margin-top: 1rem;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .dashboard-container { padding: 1rem; }
  .exam-item { padding: 0.8rem; }
}
</style>
