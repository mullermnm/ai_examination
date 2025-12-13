// import termService from "../../services/userService";
import { defineStore } from "pinia"
import { ref } from "vue"

export default defineStore("useSocketStore", {
  state: () => ({
    sioClient: ref(null),
    clientConnected: ref(false),
    socketId: ref(""),
  }),
  actions: {
    setUser(_user) {
      this.user = _user
    },
  },
})
