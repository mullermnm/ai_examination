<template>
  <div 
    class="exam-container" 
    tabindex="0" 
    ref="examContainer"
    @keydown="handleKeyDown"
  >
    <!-- Exam Header -->
    <header class="exam-header high-contrast">
      <h1 class="visually-hidden">{{ exam?.title || 'Exam' }}</h1>
      <div class="timer" aria-live="polite">
        Time Remaining: {{ formatTime(remainingTime) }}
      </div>
    </header>

    <!-- Main Exam Content -->
    <main class="exam-content">
      <!-- Question Navigation -->
      <nav class="question-nav" aria-label="Question Navigation">
        <button 
          @click="previousQuestion" 
          :disabled="currentQuestionIndex === 0"
          class="nav-button"
        >
          Previous Question
        </button>
        <span class="question-counter">
          Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
        </span>
        <button 
          @click="nextQuestion" 
          :disabled="currentQuestionIndex === totalQuestions - 1"
          class="nav-button"
        >
          Next Question
        </button>
      </nav>

      <!-- Current Question -->
      <section 
        v-if="currentQuestion" 
        class="question-section"
        aria-live="polite"
      >
        <h2 class="visually-hidden">Current Question</h2>
        <div class="question-text">
          {{ currentQuestion.text }}
        </div>

        <!-- Multiple Choice Questions -->
        <div 
          v-if="currentQuestion.type === 'multiple_choice'"
          class="options-container"
        >
          <div 
            v-for="(option, index) in currentQuestion.options" 
            :key="index"
            class="option-item"
          >
            <input 
              :id="'option-' + index"
              type="radio"
              :name="'question-' + currentQuestionIndex"
              :value="option"
              v-model="answers[currentQuestionIndex]"
              @change="handleOptionSelect(option)"
            >
            <label :for="'option-' + index">{{ option }}</label>
          </div>
        </div>

        <!-- Essay Questions -->
        <div 
          v-else-if="currentQuestion.type === 'essay'"
          class="essay-container"
        >
          <div class="input-methods">
            <!-- Text Input -->
            <textarea
              v-model="answers[currentQuestionIndex]"
              :placeholder="'Type your answer here...'"
              rows="6"
              class="essay-input"
              @input="handleTextInput"
            ></textarea>

            <!-- Voice Input -->
            <button 
              @click="toggleVoiceInput"
              class="voice-input-button"
              :class="{ 'recording': isRecording }"
            >
              <span class="visually-hidden">
                {{ isRecording ? 'Stop Recording' : 'Start Voice Input' }}
              </span>
              <i class="fas fa-microphone"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- Submit Section -->
      <section class="submit-section">
        <button 
          @click="confirmSubmit"
          class="submit-button"
          :disabled="!canSubmit"
        >
          Submit Exam
        </button>
      </section>
    </main>

    <!-- Confirmation Modal -->
    <div 
      v-if="showConfirmation"
      class="modal"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div class="modal-content">
        <h2 id="modal-title">Confirm Submission</h2>
        <p>Are you sure you want to submit your exam?</p>
        <p>Answered Questions: {{ answeredQuestions }} of {{ totalQuestions }}</p>
        <div class="modal-actions">
          <button @click="submitExam" class="confirm-button">
            Yes, Submit
          </button>
          <button @click="cancelSubmit" class="cancel-button">
            No, Continue Exam
          </button>
        </div>
      </div>
    </div>
    <div v-if="commandFeedback" class="command-feedback">{{ commandFeedback }}</div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
import studentService from '../service'
import { get } from '@vueuse/core';

export default {
  name: 'TakingExam',
  props: {
    examId: {
      type: String,
      required: true
    }
  },

  setup(props) {
    const router = useRouter()
    const examContainer = ref(null)
    const exam = ref(null)
    const currentQuestionIndex = ref(0)
    const answers = ref({})
    const remainingTime = ref(0)
    const showConfirmation = ref(false)
    const isRecording = ref(false)
    let timerInterval = null
    let recognition = null
    let lastTimeAnnouncement = 0
    const getRequest = inject('getRequest')
    const postRequest = inject('postRequest')
    const commandFeedback = ref(null)
    const isListening = ref(false)

    // Speech Recognition Setup
    const initSpeechRecognition = () => {
      try {
        if ('webkitSpeechRecognition' in window) {
          recognition = new webkitSpeechRecognition()
          recognition.continuous = true
          recognition.interimResults = true

          recognition.onstart = () => {
            isListening.value = true
            commandFeedback.value = 'Voice recognition active'
          }

          recognition.onend = () => {
            if (isListening.value) {
              try {
                recognition.start()
              } catch (error) {
                console.error('Error restarting recognition:', error)
                handleVoiceError('Voice recognition stopped. Trying to restart...')
              }
            }
          }

          recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.toLowerCase()
            handleVoiceCommand(command)
          }

          recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error)
            handleVoiceError('Voice recognition error. Please try again.')
          }

          recognition.start()
        } else {
          handleVoiceError('Voice recognition not supported. Please use keyboard navigation.')
        }
      } catch (error) {
        console.error('Error initializing speech recognition:', error)
        handleVoiceError('Failed to initialize voice recognition')
      }
    }

    // Voice command handling
    const handleVoiceCommand = (command) => {
      commandFeedback.value = `Voice Command Received: "${command}"`
      
      if (command.includes('next question')) {
        if (currentQuestionIndex.value < exam.value.questions.length - 1) {
          nextQuestion()
          speak('Moving to next question')
        } else {
          speak('This is the last question')
        }
      } else if (command.includes('previous question')) {
        if (currentQuestionIndex.value > 0) {
          previousQuestion()
          speak('Moving to previous question')
        } else {
          speak('This is the first question')
        }
      } else if (command.includes('repeat question')) {
        announceCurrentQuestion()
      } else if (command.includes('submit answer')) {
        if (currentAnswer.value) {
          submitAnswer()
          speak('Answer submitted')
        } else {
          speak('Please provide an answer before submitting')
        }
      } else if (command.includes('finish exam')) {
        confirmFinishExam()
      } else if (command.includes('help')) {
        showTutorial()
      } else {
        speak("Command not recognized. Say 'Help' for available commands")
      }
    }

    // Handle voice errors
    const handleVoiceError = (message) => {
      isListening.value = false
      commandFeedback.value = `Error: ${message}`
      speak(message)
      
      setTimeout(() => {
        if (!isListening.value) {
          initSpeechRecognition()
        }
      }, 5000)
    }

    // Show tutorial
    const showTutorial = () => {
      const tutorial = `
        Available voice commands during the exam:
        - Say "Next Question" to move forward
        - Say "Previous Question" to go back
        - Say "Repeat Question" to hear it again
        - Say "Submit Answer" to submit your response
        - Say "Finish Exam" to complete the exam
        - Say "Help" to hear this tutorial again
      `
      speak(tutorial)
      commandFeedback.value = 'Showing exam tutorial...'
    }

    // Announce current question
    const announceCurrentQuestion = () => {
      const question = currentQuestion.value
      if (question) {
        const message = `Question ${currentQuestionIndex.value + 1} of ${exam.value.questions.length}: ${question.text}`
        speak(message)
        commandFeedback.value = `Reading question ${currentQuestionIndex.value + 1}`
      }
    }

    // Speech synthesis helper
    const speak = (text) => {
      try {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(utterance)
      } catch (error) {
        console.error('Speech synthesis error:', error)
        commandFeedback.value = 'Error: Speech synthesis failed'
      }
    }

    // Time Management
    const startTimer = () => {
      const endTime = Date.now() + exam.value.duration * 60 * 1000
      timerInterval = setInterval(() => {
        const now = Date.now()
        remainingTime.value = Math.max(0, endTime - now)

        // Announce time at regular intervals
        const minutesLeft = Math.floor(remainingTime.value / (60 * 1000))
        if (minutesLeft !== lastTimeAnnouncement) {
          if (minutesLeft === 15 || minutesLeft === 5 || minutesLeft === 1) {
            speak(`${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''} remaining`)
          }
          lastTimeAnnouncement = minutesLeft
        }

        if (remainingTime.value === 0) {
          clearInterval(timerInterval)
          speak('Time is up. The exam will be submitted automatically.')
          submitExam()
        }
      }, 1000)
    }

    const formatTime = (ms) => {
      const minutes = Math.floor(ms / (60 * 1000))
      const seconds = Math.floor((ms % (60 * 1000)) / 1000)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    // Question Navigation
    const nextQuestion = () => {
      if (currentQuestionIndex.value < totalQuestions.value - 1) {
        currentQuestionIndex.value++
        announceQuestion()
      }
    }

    const previousQuestion = () => {
      if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--
        announceQuestion()
      }
    }

    const announceQuestion = () => {
      const question = currentQuestion.value
      if (question) {
        let announcement = `Question ${currentQuestionIndex.value + 1} of ${totalQuestions.value}. ${question.text}`
        if (question.type === 'multiple_choice') {
          announcement += ' Options are: ' + question.options.join(', ')
        } else {
          announcement += ' This is an essay question. You can type or use voice input to answer.'
        }
        speak(announcement)
      }
    }

    // Answer Handling
    const handleOptionSelect = (option) => {
      answers.value[currentQuestionIndex.value] = option
      speak(`Selected option: ${option}`)
    }

    const handleTextInput = () => {
      // Provide feedback for long answers
      const answer = answers.value[currentQuestionIndex.value]
      if (answer && answer.length % 100 === 0) {
        speak(`You have written ${answer.length} characters`)
      }
    }

    const toggleVoiceInput = () => {
      if (!recognition) return

      if (isRecording.value) {
        recognition.stop()
        isRecording.value = false
        speak('Voice input stopped')
      } else {
        recognition.start()
        isRecording.value = true
        speak('Voice input started. Speak your answer.')
      }
    }

    // Exam Submission
    const confirmSubmit = () => {
      const unanswered = totalQuestions.value - answeredQuestions.value
      speak(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)
      showConfirmation.value = true
    }

    const submitExam = async () => {
      try {
        const response = await studentService.submitExam(postRequest, {
          examId: props.examId,
          answers: answers.value
        })
        if (response.error) throw new Error(response.message || 'Submit failed')
        speak('Exam submitted successfully')
        router.push('/student/dashboard')
      } catch (error) {
        console.error('Error submitting exam:', error)
        speak('Error submitting exam. Please try again.')
      }
    }

    const cancelSubmit = () => {
      showConfirmation.value = false
      speak('Submission cancelled. Continuing exam.')
    }

    // Keyboard Navigation
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          previousQuestion()
          break
        case 'ArrowRight':
          nextQuestion()
          break
        case 'r':
          if (e.ctrlKey) {
            e.preventDefault()
            announceQuestion()
          }
          break
        case 't':
          if (e.ctrlKey) {
            e.preventDefault()
            speak(`${formatTime(remainingTime.value)} remaining`)
          }
          break
      }
    }

    // Computed Properties
    const currentQuestion = computed(() => 
      exam.value?.questions[currentQuestionIndex.value]
    )

    const totalQuestions = computed(() => 
      exam.value?.questions.length || 0
    )

    const answeredQuestions = computed(() => 
      Object.keys(answers.value).length
    )

    const canSubmit = computed(() => 
      answeredQuestions.value > 0
    )

    // Lifecycle Hooks
    onMounted(async () => {
      try {
        // Initialize exam via helper service
        const response = await studentService.getExam(getRequest, props.examId)
        if (response.error) {
          throw new Error(response.message || 'Failed to load exam')
        }
        exam.value = response
        initSpeechRecognition()
        startTimer()

        // Announce exam start
        const startMessage = `Starting ${exam.value.title}. Duration: ${exam.value.duration} minutes. 
          Use voice commands like "Next Question", "Previous Question", or say "Help" for more options.`
        speak(startMessage)

        // Set initial focus
        if (examContainer.value) {
          examContainer.value.focus()
        }

        // Start with first question
        announceCurrentQuestion()
      } catch (error) {
        console.error('Error initializing exam:', error)
        const errorMessage = 'Failed to load exam. Returning to dashboard.'
        speak(errorMessage)
        router.push('/student/dashboard')
      }
    })

    onUnmounted(() => {
      if (recognition) {
        recognition.stop()
      }
      if (timerInterval) {
        clearInterval(timerInterval)
      }
      window.speechSynthesis.cancel()
    })

    return {
      exam,
      currentQuestion,
      currentQuestionIndex,
      answers,
      remainingTime,
      showConfirmation,
      isRecording,
      totalQuestions,
      answeredQuestions,
      canSubmit,
      formatTime,
      nextQuestion,
      previousQuestion,
      handleOptionSelect,
      handleTextInput,
      toggleVoiceInput,
      confirmSubmit,
      submitExam,
      cancelSubmit,
      handleKeyDown,
      handleVoiceCommand,
      initSpeechRecognition,
      handleVoiceError,
      showTutorial,
      announceCurrentQuestion,
      speak,
      commandFeedback,
      isListening
    }
  }
}
</script>

<style scoped>
.exam-container {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
  color: #212529;
}

.high-contrast {
  background-color: #000;
  color: #fff;
  padding: 1rem;
}

.exam-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.timer {
  font-size: 1.25rem;
  font-weight: bold;
}

.question-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.nav-button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nav-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.question-section {
  margin-bottom: 2rem;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.question-text {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
}

.options-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
}

.option-item:hover {
  background-color: #f8f9fa;
}

.essay-container {
  margin-top: 1rem;
}

.essay-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  resize: vertical;
  font-size: 1rem;
}

.voice-input-button {
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

.voice-input-button.recording {
  background-color: #dc3545;
  animation: pulse 1.5s infinite;
}

.submit-section {
  margin-top: 2rem;
  text-align: center;
}

.submit-button {
  padding: 1rem 2rem;
  font-size: 1.25rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
}

.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.confirm-button {
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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

.command-feedback {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  padding: 1rem;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .exam-container {
    padding: 1rem;
  }

  .question-nav {
    flex-direction: column;
    gap: 1rem;
  }

  .modal-content {
    width: 95%;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
