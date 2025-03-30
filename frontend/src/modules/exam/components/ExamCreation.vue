<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Progress Bar -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-2">
        <template v-for="(step, index) in steps" :key="index">
          <div 
            class="flex-1 text-center cursor-pointer relative flex flex-col items-center" 
            @click="handleStepClick(index)"
            :class="{ 'opacity-50': index > currentStep }"
          >
            <!-- Number Circle -->
            <div 
              class="w-8 h-8 rounded-full mb-2 flex items-center justify-center"
              :class="[
                currentStep >= index ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'
              ]"
            >
              {{ index + 1 }}
            </div>
            <!-- Progress Bar -->
            <div :class="[
              'h-2 w-full rounded-full',
              currentStep >= index ? 'bg-emerald-500' : 'bg-gray-200'
            ]"></div>
            <span class="text-sm mt-2" :class="currentStep >= index ? 'text-emerald-500' : 'text-gray-500'">
              {{ step }}
            </span>
          </div>
          <div 
            v-if="index < steps.length - 1" 
            class="flex-1 h-2 mx-2 mt-3"
            :class="{
              'bg-emerald-500': currentStep > index,
              'bg-gray-300': currentStep <= index
            }"
          ></div>
        </template>
      </div>
    </div>

    <!-- Step Content -->
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- Error Message for Questions Overview -->
      <div 
        v-if="currentStep === 2 && validationErrors.questions" 
        class="mx-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start space-x-3"
      >
        <div class="text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-red-800 font-medium">Validation Error</p>
          <p class="text-red-600 mt-1">{{ validationErrors.questions }}</p>
        </div>
      </div>
      <!-- Step 1: Exam Information -->
      <div v-if="currentStep === 0">
        <h2 class="text-2xl font-bold mb-6 px-4">Exam Information</h2>
        <div class="space-y-4 p-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Exam Title</label>
            <input v-model="examInfo.title" type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
            <div v-if="validationErrors.title" class="text-red-500 text-sm">{{ validationErrors.title }}</div>
          </div>
          <div class="py-4">
            <label class="block text-sm font-medium text-gray-700">Description & Instructions</label>
            <textarea v-model="examInfo.description"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              rows="8"></textarea>
            <div v-if="validationErrors.description" class="text-red-500 text-sm">{{ validationErrors.description }}</div>
          </div>
          <div class="grid py-4 grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Total Marks</label>
              <input v-model.number="examInfo.totalMarks" type="number"
                class="mt-1 block w-10/12 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
              <div v-if="validationErrors.totalMarks" class="text-red-500 text-sm">{{ validationErrors.totalMarks }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Time (minutes)</label>
              <input v-model.number="examInfo.timeLimit" type="number"
                class="mt-1 block w-10/12 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
              <div v-if="validationErrors.timeLimit" class="text-red-500 text-sm">{{ validationErrors.timeLimit }}</div>
            </div>
          </div>
          <div class="grid py-4 grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Course Name</label>
              <input v-model="examInfo.courseName" type="text"
                class="mt-1 block w-10/12 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
              <div v-if="validationErrors.courseName" class="text-red-500 text-sm">{{ validationErrors.courseName }}</div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Course Code</label>
              <input v-model="examInfo.courseCode" type="text"
                class="mt-1 block w-10/12 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
              <div v-if="validationErrors.courseCode" class="text-red-500 text-sm">{{ validationErrors.courseCode }}</div>
            </div>
          </div>
          <div class="grid py-4 grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Exam Code</label>
              <input v-model="examInfo.examCode" type="text"
                class="mt-1 block w-10/12 rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500">
              <div v-if="validationErrors.examCode" class="text-red-500 text-sm">{{ validationErrors.examCode }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Question Creation -->
      <div v-else-if="currentStep === 1">
        <question-form 
          v-model="currentQuestion"
          @save="saveQuestion"
          @back="previousStep"
          @edit="editQuestion"
          :question-number="questions.length + 1"
          :used-marks="totalQuestionMarks"
          :total-marks="examInfo.totalMarks"
          :saved-questions="questions"
        />
      </div>

      <!-- Step 3: Questions Overview -->
      <div v-else-if="currentStep === 2" class="space-y-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold px-4">Questions Overview</h2>
          <div class="flex items-center space-x-3">
            <!-- Marks Summary Box -->
            <div class="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
              <div class="flex items-center space-x-4">
                <!-- Marks Info -->
                <div class="space-y-1.5">
                  <div class="flex items-center space-x-2">
                    <div 
                      class="w-2 h-2 rounded-full" 
                      :class="{'bg-green-500': totalQuestionMarks === Number(examInfo.totalMarks), 'bg-red-500': totalQuestionMarks !== Number(examInfo.totalMarks)}"
                    ></div>
                    <div>
                      <span class="text-xs text-gray-500">Current:</span>
                      <span class="text-sm font-semibold ml-1">{{ totalQuestionMarks }}</span>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                    <div>
                      <span class="text-xs text-gray-500">Required:</span>
                      <span class="text-sm font-semibold ml-1">{{ examInfo.totalMarks }}</span>
                    </div>
                  </div>
                </div>

                <!-- Status Icon -->
                <div class="p-4 border-l border-gray-200">
                  <div 
                    v-if="totalQuestionMarks === Number(examInfo.totalMarks)" 
                    class="bg-green-50 p-1.5 rounded"
                  >
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div 
                    v-else 
                    class="bg-red-50 p-1.5 rounded"
                  >
                    <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <button 
              @click="currentStep = 1"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 text-sm"
            >
              <i class="fas fa-arrow-left"></i>
              <span>Back</span>
            </button>
          </div>
        </div>

        <question-preview
          v-for="(question, index) in questions"
          :key="index"
          :question="question"
          :index="index"
          @edit="editQuestion(index)"
          @delete="deleteQuestion(index)"
        />
      </div>

      <!-- Step 4: Review and Submit -->
      <div v-else-if="currentStep === 3">
        <h2 class="text-xl font-bold mb-4 px-4">Review Exam</h2>
        
        <!-- Exam Details Card -->
        <div class="bg-white rounded-lg shadow-sm p-5 mb-5">
          <!-- Title as Header -->
          <h3 class="text-lg font-semibold text-gray-800 mb-2.5">
            {{ examInfo.title }}
          </h3>
          
          <!-- Description -->
          <p class="text-sm text-gray-600 mb-6">
            {{ examInfo.description }}
          </p>
          
          <!-- Course Information -->
          <div class="flex items-center space-x-4 mb-4 text-sm">
            <div class="flex items-center text-gray-600">
              <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>{{ examInfo.courseName }}</span>
            </div>
            <div class="flex items-center text-gray-600">
              <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span>{{ examInfo.courseCode }}</span>
            </div>
            <div class="flex items-center text-gray-600">
              <svg class="w-1.5 h-1.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>Exam Code: {{ examInfo.examCode }}</span>
            </div>
          </div>
          
          <!-- Marks and Time -->
          <div class="flex justify-end space-x-5 text-xs">
            <div class="flex items-center text-gray-600">
              <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ examInfo.timeLimit }} minutes</span>
            </div>
            <div class="flex items-center text-gray-600">
              <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>{{ examInfo.totalMarks }} marks</span>
            </div>
          </div>
        </div>

        <!-- Questions List -->
        <div class="space-y-3">
          <question-preview
            v-for="(question, index) in questions"
            :key="index"
            :question="question"
            :index="index"
            readonly
          />
        </div>

        <div class="flex justify-between mt-6">
          <button 
            @click="currentStep = 2"
            class="px-4 py-1.5 text-blue-600 hover:text-blue-800 flex items-center space-x-1.5 text-sm"
          >
            <i class="fas fa-arrow-left text-xs"></i>
            <span>Back</span>
          </button>
          <button 
            @click="submitExam"
            :disabled="!canSubmit || loading"
            class="px-4 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="animate-spin mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v4m0 4v4m0 4v4m4-4h4m-4 0H8m4 0H4" />
              </svg>
            </span>
            <span>Submit Exam</span>
          </button>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex flex-col mt-8">
        <!-- Error Message Display -->
        <div v-if="errorMessage" class="text-red-500 text-sm mb-4 px-4 py-2 bg-red-50 rounded">
          {{ errorMessage }}
        </div>
        
        <div class="flex justify-between">
          <button
            v-if="currentStep > 0"
            @click="previousStep"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Previous
          </button>
          <div v-if="Object.keys(validationErrors).length" class="text-red-500 text-sm mb-4">
            <ul>
              <li v-for="(error, key) in validationErrors" :key="key">{{ error }}</li>
            </ul>
          </div>
          <button
            v-if="currentStep < steps.length - 1"
            @click="nextStep"
            class="px-4 py-2 m-8 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            :disabled="!canProceed"
          >
            Next
          </button>
          <button
            v-if="currentStep === steps.length - 1"
            @click="submitExam"
            class="px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
            :disabled="!canSubmit || loading"
          >
            <span v-if="loading" class="animate-spin mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v4m0 4v4m0 4v4m4-4h4m-4 0H8m4 0H4" />
              </svg>
            </span>
            <span>Submit Exam</span>
          </button>
          <button
            @click="goBack"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
          <i class="fas fa-arrow-left mr-2"></i>
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import QuestionForm from './QuestionForm.vue'
import QuestionPreview from './QuestionPreview.vue'
import api from '../api'

export default {
  name: 'ExamCreation',
  components: {
    QuestionForm,
    QuestionPreview
  },
  setup() {
    const router = useRouter()
    const steps = ['Exam Information', 'Create Questions', 'Overview', 'Review']
    const currentStep = ref(0)
    const validationErrors = ref({})
    const postRequest = inject('postRequest')
    const toast = inject('toast')
    const loading = ref(false)
    
    // Load saved state from localStorage or use defaults
    const savedState = JSON.parse(localStorage.getItem('examCreationState') || 'null')
    
    const examInfo = ref(savedState?.examInfo || {
      title: '',
      description: '',
      totalMarks: 100,
      timeLimit: 120,
      courseName: '',
      courseCode: '',
      examCode: ''
    })

    const questions = ref(savedState?.questions || [])
    const currentQuestion = ref(savedState?.currentQuestion || {
      type: 'multiple-choice',
      text: '',
      weight: 0,
      options: ['', '', '', ''],
      correctAnswer: null
    })

    // Save state to localStorage whenever it changes
    watch([examInfo, questions, currentQuestion], () => {
      localStorage.setItem('examCreationState', JSON.stringify({
        examInfo: examInfo.value,
        questions: questions.value,
        currentQuestion: currentQuestion.value,
        currentStep: currentStep.value
      }))
    }, { deep: true })

    // Computed total marks from questions
    const totalQuestionMarks = computed(() => {
      return questions.value.reduce((sum, q) => sum + q.weight, 0)
    })

    const validateExamInfo = () => {
      const errors = {}
      
      if (!examInfo.value.title?.trim()) {
        errors.title = 'Title is required'
      }
      if (!examInfo.value.description?.trim()) {
        errors.description = 'Description is required'
      }
      if (!examInfo.value.totalMarks || examInfo.value.totalMarks <= 0) {
        errors.totalMarks = 'Total marks must be greater than 0'
      }
      if (!examInfo.value.timeLimit || examInfo.value.timeLimit <= 0) {
        errors.timeLimit = 'Time limit must be greater than 0'
      }
      if (!examInfo.value.courseName?.trim()) {
        errors.courseName = 'Course name is required'
      }
      if (!examInfo.value.courseCode?.trim()) {
        errors.courseCode = 'Course code is required'
      }
      if (!examInfo.value.examCode?.trim()) {
        errors.examCode = 'Exam code is required'
      }
      
      validationErrors.value = errors
      return Object.keys(errors).length === 0
    }

    const nextStep = () => {
      console.log('Current Step:', currentStep.value);
      
      // Clear previous validation errors
      validationErrors.value = {};

      if (currentStep.value < steps.length - 1) {
        // Step 0: Validate exam info
        if (currentStep.value === 0) {
          if (!validateExamInfo()) return;
        }
        
        // Step 2: Validate questions overview
        if (currentStep.value === 2) {
          const totalMarks = totalQuestionMarks.value;
          const targetMarks = examInfo.value.totalMarks;
          
          console.log('Validating marks:', { totalMarks, targetMarks });

          // Check if there are questions
          if (questions.value.length === 0) {
            validationErrors.value = {
              questions: 'Please add at least one question before proceeding.'
            };
            console.log('Setting validation error:', validationErrors.value);
            return;
          }
          
          // Check if marks match
          if (totalMarks !== targetMarks) {
            validationErrors.value = {
              questions: `Question marks (${totalMarks}) don't match the exam total marks (${targetMarks}). Please adjust the marks to proceed.`
            };
            console.log('Setting validation error:', validationErrors.value);
            return;
          }
        }

        // If all validations pass, proceed to next step
        currentStep.value++;
      }
    }

    const canProceed = computed(() => {
      if (currentStep.value === 0) {
        return examInfo.value.title?.trim() && 
               examInfo.value.description?.trim() && 
               examInfo.value.totalMarks > 0 && 
               examInfo.value.timeLimit > 0 &&
               examInfo.value.courseName?.trim() &&
               examInfo.value.courseCode?.trim() &&
               examInfo.value.examCode?.trim()
      }
      
      if (currentStep.value === 2) {
        const marksMatch = totalQuestionMarks.value === examInfo.value.totalMarks
        console.log('Can proceed check - Marks match:', marksMatch)
        console.log('Total marks:', examInfo.value.totalMarks)
        console.log('Question marks:', totalQuestionMarks.value)
        return questions.value.length > 0 && marksMatch
      }
      
      return true
    })

    const canSubmit = computed(() => {
      return questions.value.length > 0 && totalQuestionMarks.value === examInfo.value.totalMarks
    })

    const saveQuestion = (question) => {
      if (question.editIndex !== undefined) {
        questions.value[question.editIndex] = { ...question }
        delete questions.value[question.editIndex].editIndex
      } else {
        questions.value.push({ ...question })
      }
      clearCurrentQuestion()
    }

    const editQuestion = (index) => {
      // Save the current state if we're in the middle of creating a new question
      if (currentStep.value === 1 && !currentQuestion.value.editIndex) {
        const questionIsValid = Object.keys(validateQuestion(currentQuestion.value)).length === 0
        if (questionIsValid) {
          saveQuestion(currentQuestion.value)
        }
      }
      currentQuestion.value = { ...questions.value[index], editIndex: index }
      currentStep.value = 1
    }

    const validateQuestion = (question) => {
      const errors = {}
      if (!question.text?.trim()) {
        errors.text = 'Question text is required'
      }
      if (!question.weight || question.weight <= 0) {
        errors.weight = 'Weight must be greater than 0'
      }
      if (question.weight > examInfo.value.totalMarks) {
        errors.weight = 'Weight cannot exceed total marks'
      }
      
      switch (question.type) {
        case 'multiple-choice':
          if (!question.options?.filter(o => o.trim()).length >= 2) {
            errors.options = 'At least 2 options are required'
          }
          if (question.correctAnswer === null) {
            errors.correctAnswer = 'Please select the correct answer'
          }
          break
        case 'true-false':
          if (question.correctAnswer === null) {
            errors.correctAnswer = 'Please select the correct answer'
          }
          break
        case 'short-answer':
          if (!question.correctAnswer?.trim()) {
            errors.correctAnswer = 'Model answer is required'
          }
          break
      }
      return errors
    }

    const deleteQuestion = (index) => {
      if (confirm('Are you sure you want to delete this question?')) {
        questions.value.splice(index, 1)
      }
    }

    const clearCurrentQuestion = () => {
      currentQuestion.value = {
        type: 'multiple-choice',
        text: '',
        weight: 0,
        options: ['', '', '', ''],
        correctAnswer: null
      }
    }

    const previousStep = () => {
      if (currentStep.value > 0) {
        currentStep.value--
      }
    }

    const goBack = () => {
      if (confirm('Are you sure you want to leave? Your progress will be saved.')) {
        router.push('/teacher/dashboard')
      }
    }

    const submitExam = async () => {
      loading.value = true
      try {
        if (!canSubmit.value) {
          return
        }

        const examData = {
          examInfo: examInfo.value,
          questions: questions.value.map(q => ({
            ...q,
            number: questions.value.indexOf(q) + 1
          }))
        }
        
        const response = await postRequest({
          ...api.createExam,
          data: examData,
        })

        if (!response || response.error) {
          console.error('Failed to create exam:', response?.error || 'No response')
          toast.error(response?.error?.message || 'Failed to create exam. Please try again.')
        } else {
          // toast.success('Exam created successfully!')
          localStorage.removeItem('examCreationState')
          router.push('/teacher/exams')
        }
      } catch (error) {
        console.error('Error creating exam:', error)
        if (error.response?.status === 401) {
          // toast.error('Session expired. Please log in again.')
          router.push('/login')
        } else {
          toast.error(error.message || 'An unexpected error occurred. Please try again.')
        }
      } finally {
        loading.value = false
      }
    }

    const handleStepClick = (stepIndex) => {
      // Only allow going backward or editing current step
      if (stepIndex <= currentStep.value) {
        currentStep.value = stepIndex
      }
    }

    // Create a computed property for the error message
    const errorMessage = computed(() => {
      return validationErrors.value.questions || '';
    });

    // Restore current step from localStorage if available
    onMounted(() => {
      if (router.currentRoute.value.query.new) {
        // Only clear exam creation state, not user data
        localStorage.removeItem('examCreationState')
        examInfo.value = {
          title: '',
          description: '',
          totalMarks: 100,
          timeLimit: 120,
          courseName: '',
          courseCode: '',
          examCode: ''
        }
        questions.value = []
        currentQuestion.value = {
          type: 'multiple-choice',
          text: '',
          weight: 0,
          options: ['', '', '', ''],
          correctAnswer: null
        }
      } else if (savedState?.currentStep) {
        currentStep.value = savedState.currentStep
      }
    })

    // Make validationErrors reactive
    watch(validationErrors, (newVal) => {
      console.log('Validation Errors Changed:', newVal);
    }, { deep: true });

    return {
      steps,
      currentStep,
      examInfo,
      questions,
      currentQuestion,
      validationErrors,
      errorMessage,
      totalQuestionMarks,
      canProceed,
      canSubmit,
      nextStep,
      previousStep,
      saveQuestion,
      editQuestion,
      deleteQuestion,
      submitExam,
      handleStepClick,
      loading
    }
  }
}
</script>
