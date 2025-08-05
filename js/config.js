// js/config.js

// Configurações globais da aplicação
export const config = {
    // Lógica que alterna a URL da API com base no ambiente (local ou produção)
    API_URL: window.location.hostname === 'localhost'
        ? 'http://localhost:8080/api' // URL para desenvolvimento local
        : 'https://financeiro-api-0rsx.onrender.com/api', // URL da sua API em produção no Render

    DATE_FORMAT: 'pt-BR',
    CURRENCY: 'BRL',
    TIMEZONE: 'UTC'
};

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