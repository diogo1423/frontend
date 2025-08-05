<<<<<<< HEAD
// Configurações globais da aplicação
export const config = {
    // A URL base da sua API que está no ar no Render
    API_URL: 'https://financeiro-api-0rsx.onrender.com/api',
=======
// js/config.js

// Configurações globais da aplicação
export const config = {
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:8080/api' 
        : 'https://financeiro-api-0rsx.onrender.com', // Substitua pela URL real do seu backend
>>>>>>> f01935fa4c1bc9284a9abda8311d5b04a0f3815f
    DATE_FORMAT: 'pt-BR',
    CURRENCY: 'BRL',
    TIMEZONE: 'UTC'
};

<<<<<<< HEAD
// Configurações de autenticação
export const authConfig = {
    // Chave usada para guardar o token no localStorage do navegador
    tokenKey: 'authToken',
    // Rota para onde o usuário é redirecionado ao deslogar ou ter a sessão expirada
    loginRoute: '/login',
    // Rota padrão após login
    defaultRoute: '/dashboard'
};

// Configurações de tema
export const themeConfig = {
    // Chave usada para guardar o tema no localStorage
    storageKey: 'theme',
    // Tema padrão
    defaultTheme: 'light'
};
=======
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
>>>>>>> f01935fa4c1bc9284a9abda8311d5b04a0f3815f
