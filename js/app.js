// Arquivo principal da aplicação
import { setupTheme } from './theme.js';
import { setupRouter } from './router.js';

// Inicialização da aplicação
const initApp = () => {
    console.log('Iniciando aplicação...');
    
    // Configura o tema
    setupTheme();
    
    // Configura o roteador
    setupRouter();
    
    console.log('Aplicação iniciada com sucesso!');
};

// Inicia a aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}