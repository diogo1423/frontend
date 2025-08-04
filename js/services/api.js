import { config, authConfig } from '../config.js';

// Função base para requisições autenticadas
export const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem(authConfig.tokenKey);
    const headers = { 
        'Content-Type': 'application/json', 
        ...options.headers 
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem(authConfig.tokenKey);
        window.location.hash = `#${authConfig.loginRoute}`;
        throw new Error('Sessão expirada. Faça o login novamente.');
    }
    
    return response;
};

// Serviços de autenticação
export const authService = {
    login: async (username, password) => {
        const response = await fetch(`${config.API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Erro ao fazer login');
        }
        
        return response.json();
    },
    
    register: async (username, password) => {
        const response = await fetch(`${config.API_URL}/auth/registrar`, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Erro ao cadastrar');
        }
        
        return response.json();
    },
    
    logout: () => {
        localStorage.removeItem(authConfig.tokenKey);
        window.location.hash = `#${authConfig.loginRoute}`;
    },
    
    isAuthenticated: () => {
        return !!localStorage.getItem(authConfig.tokenKey);
    }
};