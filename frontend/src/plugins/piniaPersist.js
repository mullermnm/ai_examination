import { userInfoService } from '../services/userInfoService'
import { userTokenService } from '../services/storageService'
import { setHeaderAuthToken } from './axios'

export function piniaUserPersist({ store }) {
  // Initialize store from localStorage if data exists
  const user = userInfoService.getUser()
  const token = userTokenService.getToken()

  if (user && token) {
    // Set the token in axios headers
    setHeaderAuthToken(token)
    
    // Initialize store state
    store.$patch((state) => {
      state.user = user
    })
  }
}
