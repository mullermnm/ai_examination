class UserInfoService {
    constructor() {
        this.userKey = 'user_info';
    }

    saveUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    getUser() {
        const user = localStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    removeUser() {
        localStorage.removeItem(this.userKey);
    }

    getUserRole() {
        const user = this.getUser();
        return user ? user.userRole : null;
    }
}

export const userInfoService = new UserInfoService();
