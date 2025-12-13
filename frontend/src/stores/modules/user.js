import { userService } from "../../services/userService"
import { defineStore } from "pinia"
import { ref } from "vue"
import { userTokenService } from "../../services/storageService"
import { userInfoService } from "../../services/userInfoService"
import { setHeaderAuthToken } from "../../plugins/axios"

export default defineStore("userStore", {
  state: () => ({
    isLoading: ref(false),
    user: ref({}),
    error: ref("")
  }),
  actions: {
    setUser(_user) {
      this.user = _user
    },
    async signin(user, access_token) {
      try {
        if (access_token) {
          userTokenService.saveToken(access_token)
          setHeaderAuthToken(access_token)
        }
        this.setUser(user)
        userInfoService.saveUser(user)
        return true
      } catch (e) {
        this.error = { code: e.errorCode, message: e.message }
        return false
      }
    },
    async logout() {
      try {
        this.user = {}
        userTokenService.removeToken()
        userInfoService.removeUser()
        return true
      } catch (e) {
        return false
      }
    }
  },
  getters: {
    isAuthenticated: (state) => Object.keys(state.user).length > 0,
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.userRole
  }
})
