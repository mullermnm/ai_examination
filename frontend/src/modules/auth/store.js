import { defineStore } from 'pinia';
import userService from '../../services/userService';
import tokenService from '../../services/tokenService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        isAuthenticated: false
    }),

    actions: {
        async login(credentials) {
            try {
                const response = await userService.login(credentials);
                this.setAuth(response.data);
                return response;
            } catch (error) {
                throw error;
            }
        },

        async register(userData) {
            try {
                const response = await userService.register(userData);
                this.setAuth(response.data);
                return response;
            } catch (error) {
                throw error;
            }
        },

        async logout() {
            try {
                await userService.logout();
                this.clearAuth();
            } catch (error) {
                console.error('Logout error:', error);
                this.clearAuth();
            }
        },

        setAuth(data) {
            const { token, user } = data;
            this.user = user;
            this.isAuthenticated = true;
            tokenService.setToken(token);
        },

        clearAuth() {
            this.user = null;
            this.isAuthenticated = false;
            tokenService.removeToken();
        }
    },

    getters: {
        currentUser: (state) => state.user,
        isAdmin: (state) => state.user?.role === 'admin',
        isStudent: (state) => state.user?.role === 'student'
    }
});
