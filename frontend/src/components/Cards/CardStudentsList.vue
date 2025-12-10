<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3 class="font-semibold text-base text-blueGray-700">
            Recent Students
          </h3>
        </div>
        <div
          class="relative w-full px-4 max-w-full flex-grow flex-1 text-right"
        >
          <button
            class="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            See all
          </button>
        </div>
      </div>
    </div>
    <div class="block w-full overflow-x-auto">
      <!-- Students table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
          <tr>
            <th
              class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Student Name
            </th>
            <th
              class="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="2" class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">Loading students...</td>
          </tr>
          <tr v-else-if="students.length === 0">
            <td colspan="2" class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">No recent students</td>
          </tr>
          <tr v-else v-for="(s, idx) in students" :key="s._id || s.id || idx">
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ s.fullName || s.name || s.userId || 'Unknown' }}
            </td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <i :class="['fas fa-circle mr-2', (s.online || s.status === 'online') ? 'text-emerald-500' : 'text-gray-500']" aria-hidden="true"></i>
              {{ (s.online || s.status === 'online') ? 'Online' : (s.status || 'Offline') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import teacherApi from '@/modules/teacher/api'

const students = ref([])
const loading = ref(false)
const error = ref(null)

const getRequest = inject('getRequest', null)

const fetchStudents = async () => {
  loading.value = true
  error.value = null
  try {
    if (getRequest && teacherApi && teacherApi.getStudents) {
      // expected signature getRequest(api)
      const resp = await getRequest({ ...(teacherApi.getStudents || {}) })
      // normalize to items/array
      students.value = resp?.items || resp?.data || resp || []
    } else if (teacherApi && teacherApi.getStudents && teacherApi.getStudents.url) {
      const method = (teacherApi.getStudents.method || 'GET').toUpperCase()
      const res = await fetch(teacherApi.getStudents.url, { method })
      const json = await res.json()
      students.value = json.items || json || []
    } else {
      const res = await fetch('/users')
      const json = await res.json()
      students.value = json.items || json || []
    }
  } catch (e) {
    console.error('Failed to load students', e)
    error.value = 'Failed to load students'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStudents()
})
</script>
