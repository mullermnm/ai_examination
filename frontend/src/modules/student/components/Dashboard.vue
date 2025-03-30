<template>
  <div 
    class="dashboard-container" 
    tabindex="0" 
    @keydown="handleKeyDown"
    ref="dashboardContainer"
  >
    <!-- High Contrast Header -->
    <header class="header high-contrast">
      <h1 class="visually-hidden">Student Dashboard</h1>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Welcome Message -->
      <div 
        ref="welcomeMessage" 
        class="welcome-section" 
        tabindex="0" 
        aria-live="polite"
      >
        <h2 class="visually-hidden">Welcome Message</h2>
      </div>

      <!-- Exam List -->
      <div 
        v-if="showExams" 
        class="exam-list" 
        aria-live="polite"
      >
        <div v-for="(exam, index) in publishedExams" 
          :key="exam.id"
          :class="['exam-item', { 'current': index === currentExamIndex }]"
          tabindex="0"
        >
          <h3>{{ exam.title }}</h3>
          <p>Course: {{ exam.courseName }}</p>
          <p>Duration: {{ exam.duration }} minutes</p>
          <p>Total Marks: {{ exam.totalMarks }}</p>
        </div>
        
        <div v-if="publishedExams.length === 0" class="no-exams">
          No published exams available at the moment
        </div>
      </div>

      <!-- Loading and Error States -->
      <div v-if="loading" class="loading" aria-live="polite">
        Loading exams...
      </div>
      <div v-if="error" class="error" aria-live="assertive">
        {{ error }}
      </div>
    </main>

    <!-- Voice Commands Guide -->
    <div class="voice-commands" aria-hidden="true">
      <button 
        ref="micButton"
        class="mic-button"
        @click="toggleVoiceInput"
        :class="{ 'active': isListening }"
      >
        <span class="visually-hidden">Toggle Voice Input</span>
        <i class="fas fa-microphone"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import api from '../api'

export default {
  name: 'StudentDashboard',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const studentName = computed(() => userStore.user?.fullName || 'Student')
    const getRequest = inject('getRequest')
    const postRequest = inject('postRequest')

    // Refs for DOM elements and state
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
    let welcomeInterval = null
    let recognition = null
    let welcomeTimeout = null

    // Reset to welcome state
    const resetToWelcome = () => {
      showExams.value = false
      hasInteracted.value = false
      startWelcomeInterval()
    }

    // Initialize speech recognition
    const initSpeechRecognition = () => {
      if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true

        recognition.onresult = (event) => {
          const command = event.results[event.results.length - 1][0].transcript.toLowerCase()
          handleVoiceCommand(command)
        }

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          speak('Voice recognition error. Please try again or use keyboard.')
          isListening.value = false
        }

        // Start recognition automatically
        recognition.start()
        isListening.value = true
      }
    }

    // Handle voice commands
    const handleVoiceCommand = (command) => {
      if (command.includes('take exam')) {
        if (currentExam.value) {
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
      } else if (command.includes('log out')) {
        speak('Logging out')
        userStore.logout()
        router.push('/login')
      } else if (command.includes('next exam')) {
        if (currentExamIndex.value < publishedExams.value.length - 1) {
          currentExamIndex.value++
          announceExam()
        }
      } else if (command.includes('repeat')) {
        if (tutorialMode.value) {
          showTutorial()
        } else {
          announceExam()
        }
      }
    }

    // Show tutorial
    const showTutorial = () => {
      tutorialMode.value = true
      const tutorial = `
        Welcome to the exam platform tutorial.
        You can use the following voice commands:
        - Say "Take Exam" to start an exam
        - Say "View Progress" to check your past performance
        - Say "Help" to hear this tutorial again
        - Say "Log Out" to exit the application
        During exams, you can use:
        - "Next Question" to move forward
        - "Previous Question" to go back
        - "Repeat Question" to hear it again
        Say "Repeat" to hear this tutorial again, or "Take Exam" to get started.
      `
      speak(tutorial)
    }

    // Toggle voice input
    const toggleVoiceInput = () => {
      if (!recognition) return

      if (isListening.value) {
        recognition.stop()
        isListening.value = false
        speak('Voice commands deactivated')
      } else {
        recognition.start()
        isListening.value = true
        speak('Voice commands activated. Say "Help" for available commands.')
      }
    }

    // Speech synthesis helper
    const speak = (text) => {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    }

    // Announce welcome message
    const announceWelcome = () => {
      if (!hasInteracted.value && !welcomeTimeout) {
        const message = `${studentName.value}, Welcome to the exam platform. 
          Say "Take Exam" to start an exam, "View Progress" to check your performance, 
          or "Help" for a tutorial on how to use the platform.`
        speak(message)
        
        // Set a timeout to prevent immediate repetition
        welcomeTimeout = setTimeout(() => {
          welcomeTimeout = null
        }, 10000)
      }
    }

    // Start welcome interval
    const startWelcomeInterval = () => {
      if (welcomeInterval) {
        clearInterval(welcomeInterval)
      }
      setTimeout(announceWelcome, 1000)
      welcomeInterval = setInterval(() => {
        if (!hasInteracted.value) {
          announceWelcome()
        } else {
          clearInterval(welcomeInterval)
        }
      }, 15000)
    }

    // Handle beforeunload event
    const handleBeforeUnload = (e) => {
      if (!wantsToReload.value) {
        e.preventDefault()
        e.returnValue = ''
        speak('Warning: You are about to leave the exam platform. Press Enter if you want to reload, or any other key to stay.')
        wantsToReload.value = true
        return e.returnValue
      }
    }

    // Handle keydown events
    const handleKeyDown = (e) => {
      if (wantsToReload.value) {
        e.preventDefault()
        if (e.key === 'Enter') {
          window.removeEventListener('beforeunload', handleBeforeUnload)
          window.location.reload()
        } else {
          wantsToReload.value = false
          speak('Reload cancelled. Continuing with the exam.')
        }
        return
      }

      if (e.key === 'Enter') {
        handleEnter()
      }
    }

    // Handle enter key press
    const handleEnter = async () => {
      window.speechSynthesis.cancel()
      hasInteracted.value = true
      
      if (welcomeInterval) {
        clearInterval(welcomeInterval)
      }
      
      if (error.value || (!showExams.value && publishedExams.value.length === 0)) {
        error.value = null
        showExams.value = false
        await fetchExams()
      } else if (!showExams.value) {
        showExams.value = true
        await fetchExams()
      } else if (currentExam.value) {
        goToExam(currentExam.value.id)
      }
    }

    // Fetch published exams
    const fetchExams = async () => {
      loading.value = true
      error.value = null
      try {
        const response = await getRequest({
          ...api.getPublishedExams,
        })
        
        if (response.error) {
          throw new Error(response.error)
        }
        
        publishedExams.value = response.items || []
        loading.value = false
        
        if (publishedExams.value.length > 0) {
          readAllExams()
        } else {
          speak('No published exams available at the moment. Please try again later.')
          resetToWelcome()
        }
      } catch (err) {
        console.error('Error fetching exams:', err)
        error.value = 'Failed to load exams. Please try again.'
        loading.value = false
        speak('Error loading exams. Please check your internet connection or try again later. Returning to the main menu.')
        resetToWelcome()
      }
    }

    // Read all exams sequentially
    const readAllExams = async () => {
      for (let i = 0; i < publishedExams.value.length; i++) {
        currentExamIndex.value = i
        await announceExam()
        // Wait for potential user input
        await new Promise(resolve => setTimeout(resolve, 10000))
      }
      speak('Those are all available exams. Say "Take Exam" to start the current exam, "Next Exam" to hear the next one, or "Help" for more options.')
    }

    // Announce current exam
    const announceExam = () => {
      if (currentExam.value) {
        const message = `${currentExam.value.title} for ${currentExam.value.courseName}. 
          Duration: ${currentExam.value.duration} minutes. 
          Total Marks: ${currentExam.value.totalMarks}. 
          Say "Take Exam" to start, or wait to hear the next exam.`
        speak(message)
      }
    }

    // Navigate to exam
    const goToExam = (examId) => {
      speak('Starting exam. Good luck!')
      router.push(`/student/exam/${examId}`)
    }

    onMounted(() => {
      initSpeechRecognition()
      window.addEventListener('beforeunload', handleBeforeUnload)
      startWelcomeInterval()
      
      // Set initial focus
      if (dashboardContainer.value) {
        dashboardContainer.value.focus()
      }

      // Add vibration feedback for mobile devices
      if ('vibrate' in navigator) {
        document.addEventListener('click', () => navigator.vibrate(50))
      }
    })

    onUnmounted(() => {
      if (recognition) {
        recognition.stop()
      }
      window.removeEventListener('beforeunload', handleBeforeUnload)
      if (welcomeInterval) {
        clearInterval(welcomeInterval)
      }
      if (welcomeTimeout) {
        clearTimeout(welcomeTimeout)
      }
    })

    return {
      dashboardContainer,
      welcomeMessage,
      micButton,
      studentName,
      hasInteracted,
      showExams,
      publishedExams,
      currentExamIndex,
      currentExam: computed(() => publishedExams.value[currentExamIndex.value] || null),
      loading,
      error,
      isListening,
      handleKeyDown,
      toggleVoiceInput
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
  color: #212529;
}

.high-contrast {
  background-color: #000;
  color: #fff;
}

.welcome-section {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.exam-item {
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.exam-item.current {
  border: 3px solid #007bff;
}

.exam-item:focus {
  outline: 3px solid #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.5);
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
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
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .exam-item {
    padding: 1rem;
  }
}
</style>