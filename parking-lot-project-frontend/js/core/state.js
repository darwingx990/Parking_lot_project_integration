export const state = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    currentModule: 'dashboard',

    setUser(userData, token) {
        this.user = userData;
        this.token = token;
        localStorage.setItem('user', JSON.stringify(userData));
        if (token) {
            localStorage.setItem('token', token);
        }
    },

    getToken() {
        return this.token;
    },

    isAuthenticated() {
        return !!this.token && !!this.user;
    },

    logout() {
        this.user = null;
        this.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    },

    setModule(moduleName) {
        this.currentModule = moduleName;
    }
};
