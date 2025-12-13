import { ref, } from "vue"
import { defineStore } from "pinia"

export const useDtRefresh = defineStore("dtRefresh", () => {
  const refresh = ref("")
  function refreshDt(id) {
    refresh.value = id
    setTimeout(() => {
        refresh.value = ""
    }, 2000)
  }

  return { refreshDt, refresh }
})
