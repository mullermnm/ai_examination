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
      <!-- RIVE AVATAR CENTER -->
      <section class="avatar-wrapper">
        <RiveAvatar />
      </section>
      <!-- Welcome -->
      <section
        ref="welcomeMessage"
        class="welcome-section"
        tabindex="0"
        aria-label="Welcome message"
      >
        <h2 class="visually-hidden">Welcome Message</h2>
        <p v-if="!hasInteracted">
          <span class="highlight-text" :data-text="'Hello'">Hello</span>, 
          {{ studentName }} — say "Take Exam" to start, or press Enter.
        </p>
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
        :aria-pressed="isListening ? 'true' : 'false'"
        aria-label="Toggle voice input"
      >
        <span class="visually-hidden">Toggle Voice Input</span>
        <i class="fas fa-microphone" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { useVoskVoice } from '@/utils/useVoskVoice'
import { initTTS, speak, cancel as cancelTTS } from '@/utils/tts'
import api from '../api'
import RiveAvatar from '../../../components/app/RiveAvatar.vue'

// TTS is provided by the utils module (initTTS, speak, cancel)

// ----------------------------
// Voice Command Handler
// ----------------------------
const handleVoiceCommand = (command) => {
  hasInteracted.value = true
  const cmd = command.toLowerCase()

  if (cmd.includes('take exam')) {
    if (currentExam.value?.id) {
      goToExam(currentExam.value.id)
    } else {
      showExams.value = true
      fetchExams()
    }
  }

  else if (cmd.includes('view progress')) {
    speak('Opening progress view')
    router.push('/student/progress')
  }

  else if (cmd.includes('help')) {
    showTutorial()
  }

  else if (cmd.includes('log out') || cmd.includes('logout')) {
    speak('Logging out')
    userStore.logout?.()
    router.push('/login')
  }

  else if (cmd.includes('next exam')) {
    if (currentExamIndex.value < publishedExams.value.length - 1) {
      currentExamIndex.value++
      announceExam()
    } else speak('This is the last exam.')
  }

  else if (cmd.includes('previous exam') || cmd.includes('prev exam')) {
    if (currentExamIndex.value > 0) {
      currentExamIndex.value--
      announceExam()
    } else speak('This is the first exam.')
  }

  else if (cmd.includes('repeat')) {
    announceExam()
  }
}

// ----------------------------
// Vosk Voice Recognition
// ----------------------------
const lastTranscript = ref("")

const {
  isListening: voskIsListening,
  transcript,
  start,
  stop
} = useVoskVoice()

watch(transcript, (text) => {
  if (text) handleVoiceCommand(text)
})

// expose listening state for the template
const isListening = voskIsListening

// ============================
// Dashboard State
// ============================
const router = useRouter()
const userStore = useUserStore()
// optional injected network helper (axios wrapper)
const getRequest = inject('getRequest', null)

const dashboardContainer = ref(null)
const showExams = ref(false)
const publishedExams = ref([])
const currentExamIndex = ref(0)
const hasInteracted = ref(false)
const loading = ref(false)
const error = ref(null)

// computed
const studentName = computed(() => userStore.user?.fullName || 'Student')
const currentExam = computed(() => publishedExams.value[currentExamIndex.value] || null)

// ----------------------------
// Exam Announcement
// ----------------------------
const announceExam = () => {
  if (!currentExam.value) return
  const e = currentExam.value

  speak(
    `${e.title}. Course ${e.courseName}. Duration ${e.duration} minutes. 
     Total marks ${e.totalMarks}. Say "Take Exam" to begin.`
  )
}

// ----------------------------
// Toggle Mic
// ----------------------------
const toggleVoiceInput = async () => {
  if (voskIsListening.value) {
    stop()
    speak("Voice commands off")
  } else {
    await start()
    speak("Voice commands activated")
  }
}

// ----------------------------
// Fetch Exams
// ----------------------------
const fetchExams = async () => {
  loading.value = true
  error.value = null

  try {
    const res = await fetch(api.getPublishedExams.url)
    const data = await res.json()

    publishedExams.value = data.items || []
    loading.value = false

    if (publishedExams.value.length === 0) {
      speak("No exams available.")
      return
    }

    announceExam()
  } catch (err) {
    error.value = "Failed to load exams"
    speak("Error loading exams.")
    loading.value = false
  }
}

// ----------------------------
// Navigation
// ----------------------------
const goToExam = (id) => {
  speak("Starting exam. Good luck.")
  router.push(`/student/exam/${id}`)
}

// Handle keyboard input (Enter to open/start exam)
const handleKeyDown = async (e) => {
  if (!e) return
  if (e.key !== 'Enter') return
  e.preventDefault()

  hasInteracted.value = true

  // if exams not shown yet, open list and fetch
  if (!showExams.value) {
    showExams.value = true
    await fetchExams()
    return
  }

  // if an exam is selected, try to fetch it (preload) then navigate
  if (currentExam.value && currentExam.value.id) {
    const examId = currentExam.value.id
    try {
      if (getRequest && api.getExam && api.getExam.url) {
        const apiDef = { ...(api.getExam || {}), url: api.getExam.url.replace(':id', examId) }
        await getRequest(apiDef)
      } else if (api.getExam && api.getExam.url) {
        const url = api.getExam.url.replace(':id', examId)
        await fetch(url)
      } else {
        await fetch(`/exams/${examId}`)
      }
    } catch (err) {
      console.error('Failed to preload exam:', err)
      speak('Unable to load the selected exam. Please try again.')
      return
    }

    goToExam(examId)
    return
  }

  speak('No exam selected. Use arrow keys or say Take Exam to select one.')
}

// ----------------------------
// Lifecycle
// ----------------------------
onMounted(() => {
  // autofocus keyboard events
  dashboardContainer.value?.focus()
  // initialize TTS and speak welcome message (only if user hasn't interacted yet)
  initTTS().then(() => {
    if (!hasInteracted.value) {
      speak(`Hello, ${studentName.value} — say \"Take Exam\" to start, or press Enter.`)
    }
  })
})

onUnmounted(() => {
  stop()
  // stop any speaking
  try { cancelTTS() } catch (e) {}
})

// Expose to template
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

.avatar-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 10px;
}


.welcome-section {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  outline: none;
  justify-content: center;
  text-align: center;
  font-weight: bold;
}
.highlight-text {
  font-weight: 700;
  background: linear-gradient(
    90deg,
    #ff0040,
    #ff7a00,
    #ffee00,
    #00ff6a,
    #00c8ff,
    #8a2cff,
    #ff00e1
  );
  background-size: 400%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbowFlow 6s linear infinite;
  position: relative;
}
/* Optional glowing halo */
.highlight-text::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  filter: blur(8px);
  opacity: 0.6;
  background: inherit;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}


@keyframes rainbowFlow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 400% 50%;
  }
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
