<template>
  <div class="space-y-8">
    <!-- Saved Questions List -->
    <div v-if="savedQuestions && savedQuestions.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Saved Questions</h3>
      </div>
      <div class="divide-y divide-gray-200">
        <div v-for="(question, index) in savedQuestions" :key="index" 
          class="px-6 py-4 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between">
          <div class="flex-1">
            <div class="text-sm text-gray-500 mb-1">Question {{ index + 1 }} • {{ question.type }} • {{ question.weight }} marks</div>
            <div class="text-gray-800">{{ question.text }}</div>
          </div>
          <button @click="editSavedQuestion(index)" 
            class="ml-4 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center">
            <i class="fas fa-edit mr-2"></i>
            Edit
          </button>
        </div>
      </div>
    </div>

    <!-- Current Question Form -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-bold mb-4">Question #{{ questionNumber }}</h2>
          <p class="text-gray-500 mt-1">Total Marks Available: {{ remainingMarks }}</p>
        </div>
        <button @click="goBack" 
          class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center">
          <i class="fas fa-arrow-left mr-2"></i>
          Back
        </button>
      </div>

      <!-- Question Type Selection -->
      <div class="bg-gray-50 p-6 rounded-xl mb-8">
        <label class="block text-sm font-medium text-gray-700 mb-4">Question Type</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            v-for="type in questionTypes"
            :key="type.value"
            @click="localQuestion.type = type.value"
            :class="[
              'p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center',
              localQuestion.type === type.value
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md'
                : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50'
            ]"
          >
            <i :class="['fas text-2xl mb-3', type.icon]"></i>
            <span class="font-medium">{{ type.label }}</span>
          </button>
        </div>
      </div>

      <!-- Question Content -->
      <div class="space-y-8">
        <!-- Question Text -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
          <div class="relative">
            <textarea
              v-model="localQuestion.text"
              rows="4"
              class="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors duration-200 px-4 py-3 resize-none"
              :class="{'border-red-300 ring-red-200': validationErrors?.text}"
              placeholder="Enter your question here..."
            ></textarea>
            <div class="absolute right-3 bottom-3 text-sm text-gray-400">
              {{ localQuestion.text?.length || 0 }}/500
            </div>
          </div>
          <p v-if="validationErrors?.text" class="mt-2 text-sm text-red-600">
            <i class="fas fa-exclamation-circle mr-1"></i>
            {{ validationErrors.text }}
          </p>
        </div>

        <!-- Question Weight -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Marks for this Question</label>
          <div class="relative w-full sm:w-1/3">
            <input
              v-model.number="localQuestion.weight"
              type="number"
              min="0"
              :max="remainingMarks + (localQuestion.editIndex !== undefined ? localQuestion.weight : 0)"
              class="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors duration-200 px-4 py-3 pr-16"
              :class="{'border-red-300 ring-red-200': validationErrors?.weight}"
            >
            <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">points</span>
            </div>
          </div>
          <p v-if="validationErrors?.weight" class="mt-2 text-sm text-red-600">
            <i class="fas fa-exclamation-circle mr-1"></i>
            {{ validationErrors.weight }}
          </p>
        </div>

        <!-- Multiple Choice Options -->
        <div v-if="localQuestion.type === 'multiple-choice'" class="space-y-4 mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-4">Answer Options</label>
          <div v-for="(option, index) in localQuestion.options" :key="index" 
            class="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
            <input
              type="radio"
              :name="'correct-answer'"
              :value="index"
              v-model="localQuestion.correctAnswer"
              class="h-5 w-5 text-emerald-600 border-gray-300 focus:ring-emerald-500"
            >
            <input
              v-model="localQuestion.options[index]"
              type="text"
              :placeholder="'Option ' + (index + 1)"
              class="flex-1 rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors duration-200 px-4 py-3"
            >
            <button
              v-if="localQuestion.options.length > 2"
              @click="removeOption(index)"
              class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <button
            v-if="localQuestion.options.length < 6"
            @click="addOption"
            class="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-emerald-50"
          >
            <i class="fas fa-plus mr-2"></i>
            Add Option
          </button>
          <p v-if="validationErrors?.options" class="mt-2 text-sm text-red-600">
            <i class="fas fa-exclamation-circle mr-1"></i>
            {{ validationErrors.options }}
          </p>
        </div>

        <!-- True/False Options -->
        <div v-if="localQuestion.type === 'true-false'" class="space-y-4 mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-4">Correct Answer</label>
          <div class="flex space-x-6">
            <label class="inline-flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200"
              :class="localQuestion.correctAnswer === true ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'">
              <input
                type="radio"
                :value="true"
                v-model="localQuestion.correctAnswer"
                class="h-5 w-5 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              >
              <span class="ml-3 font-medium" :class="localQuestion.correctAnswer === true ? 'text-emerald-700' : 'text-gray-700'">True</span>
            </label>
            <label class="inline-flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200"
              :class="localQuestion.correctAnswer === false ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'">
              <input
                type="radio"
                :value="false"
                v-model="localQuestion.correctAnswer"
                class="h-5 w-5 text-emerald-600 border-gray-300 focus:ring-emerald-500"
              >
              <span class="ml-3 font-medium" :class="localQuestion.correctAnswer === false ? 'text-emerald-700' : 'text-gray-700'">False</span>
            </label>
          </div>
          <p v-if="validationErrors?.correctAnswer" class="mt-2 text-sm text-red-600">
            <i class="fas fa-exclamation-circle mr-1"></i>
            {{ validationErrors.correctAnswer }}
          </p>
        </div>

        <!-- Short Answer -->
        <div v-if="localQuestion.type === 'short-answer'" class="space-y-4 mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Model Answer (for reference)</label>
          <textarea
            v-model="localQuestion.correctAnswer"
            rows="3"
            class="w-full rounded-xl border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 transition-colors duration-200 px-4 py-3 resize-none"
            :class="{'border-red-300 ring-red-200': validationErrors?.correctAnswer}"
            placeholder="Enter the expected answer..."
          ></textarea>
          <p v-if="validationErrors?.correctAnswer" class="mt-2 text-sm text-red-600">
            <i class="fas fa-exclamation-circle mr-1"></i>
            {{ validationErrors.correctAnswer }}
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4 mt-8 pt-8 border-t">
        <button
          @click="$emit('cancel')"
          class="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          @click="saveQuestion"
          class="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors duration-200 flex items-center shadow-sm"
          :disabled="!isValid"
          :class="{'opacity-50 cursor-not-allowed': !isValid}"
        >
          <i class="fas fa-save mr-2"></i>
          Save Question
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'QuestionForm',
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    questionNumber: {
      type: Number,
      required: true
    },
    totalMarks: {
      type: Number,
      required: true
    },
    usedMarks: {
      type: Number,
      required: true
    },
    validationErrors: {
      type: Object,
      default: () => ({})
    },
    savedQuestions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'save', 'cancel', 'back', 'edit'],
  setup(props, { emit }) {
    const questionTypes = [
      { value: 'multiple-choice', label: 'Multiple Choice', icon: 'fa-list-ul' },
      { value: 'true-false', label: 'True/False', icon: 'fa-toggle-on' },
      { value: 'short-answer', label: 'Short Answer', icon: 'fa-pen' }
    ]

    const localQuestion = ref({ ...props.modelValue })

    watch(() => props.modelValue, (newVal) => {
      localQuestion.value = { ...newVal }
    })

    const remainingMarks = computed(() => {
      const currentMarks = props.modelValue.editIndex !== undefined ? props.modelValue.weight : 0
      return props.totalMarks - props.usedMarks + currentMarks
    })

    const questionNumber = computed(() => {
      if (localQuestion.value.editIndex !== undefined) {
        return localQuestion.value.editIndex + 1
      }
      return (props.savedQuestions?.length || 0) + 1
    })

    const isValid = computed(() => {
      if (!localQuestion.value.text?.trim()) return false
      if (!localQuestion.value.weight || localQuestion.value.weight <= 0) return false
      if (localQuestion.value.weight > remainingMarks.value) return false

      switch (localQuestion.value.type) {
        case 'multiple-choice':
          return localQuestion.value.options.filter(o => o.trim()).length >= 2 && 
                 localQuestion.value.correctAnswer !== null
        case 'true-false':
          return localQuestion.value.correctAnswer !== null
        case 'short-answer':
          return localQuestion.value.correctAnswer?.trim()
        default:
          return false
      }
    })

    const addOption = () => {
      if (localQuestion.value.options.length < 6) {
        localQuestion.value.options.push('')
      }
    }

    const removeOption = (index) => {
      localQuestion.value.options.splice(index, 1)
      if (localQuestion.value.correctAnswer === index) {
        localQuestion.value.correctAnswer = null
      } else if (localQuestion.value.correctAnswer > index) {
        localQuestion.value.correctAnswer--
      }
    }

    const editSavedQuestion = (index) => {
      emit('edit', index)
    }

    const goBack = () => {
      if (props.savedQuestions && props.savedQuestions.length > 0) {
        // If we're editing a question, go back to that question
        if (localQuestion.value.editIndex !== undefined) {
          emit('edit', localQuestion.value.editIndex)
        } else {
          // Otherwise, go back to the last question
          emit('edit', props.savedQuestions.length - 1)
        }
      } else {
        emit('back')
      }
    }

    const saveQuestion = () => {
      if (isValid.value) {
        emit('save', { ...localQuestion.value })
      }
    }

    return {
      questionTypes,
      localQuestion,
      remainingMarks,
      questionNumber,
      isValid,
      addOption,
      removeOption,
      editSavedQuestion,
      goBack,
      saveQuestion
    }
  }
}
</script>
