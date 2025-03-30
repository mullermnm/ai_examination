<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-4 relative p-2">
    <div class="flex justify-between items-start mb-4 p-4">
      <h3 class="text-xl font-semibold">Question #{{ index + 1 }}</h3>
      <div class="flex space-x-4">
        <button @click="$emit('edit', index)" class="text-blue-600 hover:text-blue-800">
          <i class="fas fa-edit"></i>
        </button>
        <button @click="$emit('delete', index)" class="text-red-600 hover:text-red-800">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    
    <div class="px-4">
      <p class="text-gray-800 mb-4">{{ question.text }}</p>
      
      <div class="ml-4 p-4">
        <template v-if="question.type === 'multiple-choice'">
          <div v-for="(option, idx) in question.options" :key="idx" class="mb-2">
            <span class="mr-2">{{ String.fromCharCode(65 + idx) }}.</span>
            <span :class="{ 'font-semibold text-green-600': idx === question.correctAnswer }">
              {{ option }}
            </span>
          </div>
        </template>
        
        <template v-else-if="question.type === 'true-false'">
          <div class="mb-2">
            <span :class="{ 'font-semibold text-green-600': question.correctAnswer === true }">True</span>
          </div>
          <div class="mb-2">
            <span :class="{ 'font-semibold text-green-600': question.correctAnswer === false }">False</span>
          </div>
        </template>
        
        <template v-else-if="question.type === 'short-answer'">
          <div class="mb-2">
            <p class="text-gray-600">Model Answer:</p>
            <p class="ml-4 text-green-600">{{ question.correctAnswer }}</p>
          </div>
        </template>
      </div>
      
      <div class="mt-4 text-right text-gray-600">
        <span class="font-medium">Marks: {{ question.weight }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionPreview',
  props: {
    question: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete']
}
</script>
