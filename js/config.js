// js/config.js

export const config = {
    // A URL base da sua API que está no ar no Render
    API_URL: 'https://financeiro-api-0rsx.onrender.com/api' 
};

export const authConfig = {
    // Chave usada para guardar o token no localStorage do navegador
    tokenKey: 'authToken',
    // Rota para onde o usuário é redirecionado ao deslogar ou ter a sessão expirada
    loginRoute: '/login' 
};

// ===============================================
// === ADICIONE ESTE NOVO BLOCO DE CÓDIGO ABAIXO ===
// ===============================================
export const themeConfig = {
    // Chave usada para guardar o tema no localStorage
    storageKey: 'theme'
};