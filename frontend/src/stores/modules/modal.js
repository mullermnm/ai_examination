import { defineStore } from "pinia"

export default defineStore("modalStore", {
  state: () => ({
    openedModals: [],
  }),
  actions: {
    openModal(modal) {
      this.openedModals.push(modal)
    },
  },
})
