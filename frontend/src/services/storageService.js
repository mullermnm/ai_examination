import { TOKEN_KEY, USER_KEY, SOCKET_KEY } from "../config/config"
const CURRENT_LANGUAGE_KEY = "__current_language__"
const ACTIVE_NAV = "__active_nav__"
import { jwtDecode } from 'jwt-decode';

class StorageService {
  constructor(storage) {
    this.storage = storage || window.localStorage

    if (!this.isSupported()) {
      throw new Error("Storage is not supported by browser!")
    }
  }

  setItem(key, value) {
    this.storage.setItem(key, JSON.stringify(value))
  }

  getItem(key) {
    return JSON.parse(this.storage.getItem(key))
  }

  removeItem(key) {
    this.storage.removeItem(key)
  }

  clear() {
    this.storage.clear()
  }

  isSupported() {
    return !!this.storage
  }
}

const appStorage = new StorageService()

const userTokenService = {
  getToken() {
    return appStorage.getItem(TOKEN_KEY)
  },
  saveToken(token) {
    appStorage.setItem(TOKEN_KEY, token)
  },
  removeToken() {
    appStorage.removeItem(TOKEN_KEY)
  },
  getUserRole() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.userRole || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }
}

const userService = {
  getUser() {
    return appStorage.getItem(USER_KEY)
  },
  saveUser(user) {
    appStorage.setItem(USER_KEY, user)
  },
  removeUser() {
    appStorage.removeItem(USER_KEY)
  }
}

const socketService = {
  getSocket() {
    return appStorage.getItem(SOCKET_KEY)
  },
  saveSocket(socket) {
    appStorage.setItem(SOCKET_KEY, socket)
  },
  removeSocket() {
    appStorage.removeItem(SOCKET_KEY)
  }
}

const navService = {
  getActiveNav() {
    return appStorage.getItem(ACTIVE_NAV)
  },
  saveActiveNav(nav) {
    appStorage.setItem(ACTIVE_NAV, nav)
  },
  removeActiveNav() {
    appStorage.removeItem(ACTIVE_NAV)
  }
}

const LanguageService = {
  getCurrentLanguage() {
    return localStorage.getItem(CURRENT_LANGUAGE_KEY)
  },
  setCurrentLanguage(currentLanguage) {
    localStorage.setItem(CURRENT_LANGUAGE_KEY, currentLanguage)
  }
}

export {
  appStorage,
  userTokenService,
  userService,
  socketService,
  navService,
  LanguageService
}
