import apiService from "./apiService"
import { handleError } from "./handleErrorService"
import { userTokenService } from "./storageService"
import { userInfoService } from "./userInfoService"

class AuthenticationError extends Error {
  constructor(errorCode, message) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.errorCode = errorCode
  }
}

const userService = {
  signin: async function (signin) {
    const requestData = {
      method: "post",
      url: "credential/login",
      data: signin,
    }

    try {
      const { data } = await apiService.customRequest(requestData)
      const { access_token, ...user } = data
      userTokenService.saveToken(access_token)
      userInfoService.saveUser(user)
      apiService.setHeader()

      return {
        token: access_token,
        user,
      }
    } catch (error) {
      if (error.response)
        error.response.data.errors = error.response.data.message
      return handleError(error)
    }
  },
  getUser: async function () {
    const requestData = {
      method: "get",
      url: "api/user",
      data: {},
    }

    try {
      const { data } = await apiService.customRequest(requestData)
      return data
    } catch (error) {
      return handleError(error)
    }
  },
  logout() {
    userTokenService.removeToken()
    apiService.removeHeader()
    userInfoService.removeUser()
  },
}

export { userService, AuthenticationError }
