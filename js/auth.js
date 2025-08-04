import { authConfig } from './config.js';
import { authService } from './services/api.js';

// Verifica se usuário está autenticado
export const isAuthenticated = () => {
    return !!localStorage.getItem(authConfig.tokenKey);
};

// Salva token no localStorage
export const saveToken = (token) => {
    localStorage.setItem(authConfig.tokenKey, token);
};

// Remove token e faz logout
export const logout = () => {
    localStorage.removeItem(authConfig.tokenKey);
    window.location.hash = `#${authConfig.loginRoute}`;
};

// Setup do botão de logout
export const setupLogout = () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
};

// Redireciona para login se não autenticado
export const requireAuth = () => {
    if (!isAuthenticated()) {
        window.location.hash = `#${authConfig.loginRoute}`;
        return false;
    }
    return true;
};

// Redireciona para dashboard se já autenticado
export const redirectIfAuthenticated = () => {
    if (isAuthenticated()) {
        window.location.hash = `#${authConfig.defaultRoute}`;
        return true;
    }
    return false;
};