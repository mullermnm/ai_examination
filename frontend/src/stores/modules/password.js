import passwordService from "../../services/passwordService"
import apiService from "../../services/apiService"
import apiRequest from "../../services/apiRequest"
import { appStorage } from "../../services/storageService"
import { defineStore } from "pinia"

const state = {
  error: null,
  message: null,
}

const mutations = {
  setError: (state, msg) => {
    state.error = msg
  },
  setMessage: (state, msg) => {
    state.message = msg
  },
}
const actions = {
  async setErrorEmpty({ commit }) {
    commit("setError", "")
  },
  async sendEmail({ commit }, params) {
    try {
      const data = await apiRequest.request(params)
      commit("setMessage", data.message)
      return true
    } catch (e) {
      commit("setError", e.message)
      return false
    }
  },
  async changePassword({ commit }, userInfo) {
    try {
      const data = await passwordService.changePassword(userInfo)
      apiService.removeHeader()
      appStorage.removeItem("email")
      commit("setMessage", data.message)
      return true
    } catch (e) {
      commit("setError", e.message)
      return false
    }
  },
  async verifyEmail({ commit }, params) {
    try {
      await apiRequest.request(params)
      return true
    } catch (e) {
      commit("setError", e.message)
      return false
    }
  },
  async sendCode({ commit }, data) {
    try {
      const result = await passwordService.verifyCode(data)
      commit("setMessage", result.message)
      this.$router.push("/change-password")
      return true
    } catch (e) {
      commit("setError", e.message)
      return ""
    }
  },
}
const getters = {
  error: (state) => state.error,
  message: (state) => state.message,
}

const passwordStore = {
  namespaced: true,
  mutations,
  getters,
  actions,
  state,
}
export default defineStore("passwordStore", passwordStore)
