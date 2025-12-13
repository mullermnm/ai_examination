import { defineStore } from "pinia"
import apiRequest from "../../services/apiRequest"
import { navService } from "../../services/storageService"
let nav = navService.getActiveNav()

const state = () => ({
  activeNav: nav || "DASHBOARD",
  refreshDt: '',
  navExpanded: true,
  authCodes: [
    "CUR300",
    "CUR102",
    "CUR200",
    "CUR201",
    "CUR202",
    "CUR400",
    "GC300",
    "GC102",
    "GC200",
    "GC201",
    "GC202",
    "GC400",
    "GL300",
    "GL104",
    "GL200",
    "GL201",
    "GL105",
    "GL400",
    "IBR100",
    "APJ100",
    "OUPJ100",
  ], // ? authorized codes
  currencies: [],
  showPrinter: false,
  downloading: false,
  reports: [],
  error: "",
})

const actions = {
  setErrorEmpty() {
    this.setError({
      message: "",
    })
  },
  refreshDataTable({ commit }, data) {
    commit('SMART_SET', {
      stateKey: 'refreshDt',
      data,
    });
    setTimeout(() => {
                commit('SMART_SET', {
                  stateKey: 'refreshDt',
                  data: '',
                });            
    }, 2000);
},

  setData({ stateKey, data }) {
    this[stateKey] = data
  },
  async requestMutate({ stateKey, ...params }) {
    try {
      const { data } = await apiRequest.request(params)
      this.setData({
        stateKey,
        data: data.items,
      })
      return true
    } catch (e) {
      this.error = {
        error: e.errorCode,
        message: e.message,
      }
      return false
    }
  },
  async request(params) {
    try {
      const response = await apiRequest.request(params)
      return response ? response.data : true
    } catch (e) {
      console.log(e)
      this.error = {
        error: e.errorCode,
        message: e.message,
      }
      return false
    }
  },
  async streamRequest(params) {
    try {
      const response = await apiRequest.streamRequest(params)
      return response ? response.data : true
    } catch (e) {
      console.log(e)
      this.error = {
        error: e.errorCode,
        message: e.message,
      }
      return false
    }
  },
  async upload(data) {
    try {
      const response = await apiRequest.upload(data)
      return response
    } catch (e) {
      this.error = {
        error: e.errorCode,
        message: e.message,
      }
      return false
    }
  },
  async getApplication(params) {
    try {
      const { data } = await apiRequest.getApplication(params)
      return data
    } catch (e) {
      this.error = {
        error: e.errorCode,
        message: e.message,
      }
      return false
    }
  },
  async expandNav() {
    this.setData({
      stateKey: "navExpanded",
      data: true,
    })
  },
  async collapseNav() {
    this.setData({
      stateKey: "navExpanded",
      data: false,
    })
  },
}

const main = {
  namespaced: true,
  state,
  actions,
}

export default defineStore("mainStore", main)
