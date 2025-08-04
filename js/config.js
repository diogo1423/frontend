// js/config.js

// Configurações globais da aplicação
export const config = {
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8080/api' 
        : 'https://financeiro-api-0rsx.onrender.com', // Substitua pela URL real do seu backend
    DATE_FORMAT: 'pt-BR',
    CURRENCY: 'BRL',
    TIMEZONE: 'UTC'
};

// Configurações de tema
export const themeConfig = {
    defaultTheme: 'light',
    storageKey: 'theme'
};

// Configurações de autenticação
export const authConfig = {
    tokenKey: 'authToken',
    loginRoute: '/login',
    defaultRoute: '/dashboard'
};
