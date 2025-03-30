import apiService from "./apiService"
import { handleError } from "./handleErrorService"

export default {
  async sendEmail(emailAddress) {
    const requestData = {
      method: "post",
      data: {
        query: `mutation sendResetCode($email: String!) {
          sendResetCode(email: $email)
        }`,
        variables: {
          email: emailAddress,
        },
      },
    }

    try {
      const { data } = await apiService.customRequest(requestData)
      return data
    } catch (error) {
      return handleError(error)
    }
  },

  async verifyCode(request) {
    const requestData = {
      method: "post",
      url: "api/token/verify",
      data: {
        query: `mutation sendResetCode($email: String!) {
          sendResetCode(email: $email)
        }`,
        variables: {
          email: request,
        },
      },
    }

    try {
      const { data } = await apiService.customRequest(requestData)
      return data
    } catch (error) {
      return handleError(error)
    }
  },
  async changePassword(request) {
    const requestData = {
      method: "post",
      data: {
        query: `mutation reset($password: String!,$confirm_password: String!,
          $token: String!) {
          reset(password: $password,
            confirm_password: $confirm_password,token:$token) 
        }`,
        variables: request,
      },
    }

    try {
      const {
        data: {
          data: { reset },
        },
      } = await apiService.customRequest(requestData)
      return reset
    } catch (error) {
      return handleError(error)
    }
  },
}
