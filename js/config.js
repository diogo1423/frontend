// Configurações globais da aplicação
export const config = {
    API_URL: 'http://localhost:8080/api',
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