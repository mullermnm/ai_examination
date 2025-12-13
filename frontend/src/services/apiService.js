import axios from "axios"
import { userTokenService } from "./storageService"
import { userInfoService } from "./userInfoService"
import { BASE_URL } from "../config/config"
import { handleError } from "./handleErrorService"

const loggerInterceptor = (config) => {
  /** Add logging here */
  return config
}

const apiService = {
  interceptor: null, // Mark: - 401 interceptor

  init(baseURL) {
    axios.defaults.baseURL = baseURL
  },

  setHeader() {
    axios.defaults.headers.common["Authorization"] = `Bearer ${userTokenService.getToken()}`
  },

  removeHeader() {
    axios.defaults.headers.common = {}
  },

  get(resource) {
    return axios.get(resource)
  },

  post(resource, data) {
    return axios.post(resource, data)
  },

  put(resource, data) {
    return axios.put(resource, data)
  },

  delete(resource) {
    return axios.delete(resource)
  },

  customRequest(data) {
    const socket = userInfoService.getUserSocket()
    if (socket) axios.defaults.headers.common["socket"] = socket
    return axios(data)
  },

  replayRequest(error) {
    const { config, response: { status } } = error
    if (status === 401) {
      return this.customRequest(config)
    }
    return Promise.reject(error)
  },

  mount401Interceptor() {
    this.interceptor = axios.interceptors.response.use(
      response => response,
      async (error) => {
        const { response: { status } } = error
        if (status === 401) {
          try {
            await this.replayRequest(error)
          } catch (e) {
            handleError(e)
          }
        }
        return Promise.reject(error)
      }
    )
  },

  getBaseUrl() {
    return BASE_URL
  }
}

export default apiService
