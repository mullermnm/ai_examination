<template>
  <transition appear>
    <printer v-if="false" class="w-full h-screen"></printer>
    <div
      v-else
      class="font-sans flex flex-col h-full w-full bg-primaryBg dark:bg-gray-900 text-textMedium overflow-auto"
    >
      <div v-if="userStore.isLoading">...</div>
      <protected v-else-if="isStudent" class=""></protected>
      <Teacher v-else-if="isTeacher" class=""></Teacher>
      <open v-else></open>
      <dynamic-modal />
      <!-- <socket /> -->
      <Toast />
      <keyboard-shortcuts/>
      <!-- <utils /> -->
    </div>
  </transition>
</template>
<script setup>

import { useUserStore } from "@/stores"
import Protected from "./views/Protected.vue"
import Teacher from "./views/Teacher.vue"
import Open from "./views/Open.vue"
import { userInfoService } from "./services/userInfoService"
// import DynamicModal from "./components/app/DynamicModal.vue"
import { onMounted, computed, watchEffect } from "vue"
import Toast from "./components/app/Toast.vue"
import KeyboardShortcuts from "./components/app/KeyboardShortcuts.vue"


import { useFavicon } from "@vueuse/core"
const icon = useFavicon()

const userStore = useUserStore()

// Computed properties for role checks
const isStudent = computed(() => userStore.user && userStore.user.userRole === 'student')
const isTeacher = computed(() => userStore.user && userStore.user.userRole === 'teacher')

onMounted(() => {
  // Load user from storage
  const user = userInfoService.getUser()
  if (user) {
    console.log('Loaded user from storage:', user)
    userStore.setUser(user)
  }
})

// Debug logging
watchEffect(() => {
  console.log('Current user state:', {
    user: userStore.user,
    isStudent: isStudent.value,
    isTeacher: isTeacher.value
  })
})
</script>
