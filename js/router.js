import { LoginPage } from './pages/login.js';
import { RegisterPage } from './pages/register.js';
import { DashboardPage } from './pages/dashboard.js';
import { LancamentosPage } from './pages/lancamentos.js';
import { CategoriasPage } from './pages/categorias.js';
import { RelatoriosPage } from './pages/relatorios.js';
import { isAuthenticated } from './auth.js';
import { setupLogout } from './auth.js';
import { handleThemeToggle } from './theme.js';

// Definição das rotas
const routes = {
    '/login': LoginPage,
    '/registrar': RegisterPage,
    '/dashboard': DashboardPage,
    '/lancamentos': LancamentosPage,
    '/categorias': CategoriasPage,
    '/relatorios': RelatoriosPage,
};

// Função do roteador
export const router = async () => {
    try {
        // Limpa intervalos anteriores (dashboard)
        if (window.dashboardInterval) {
            clearInterval(window.dashboardInterval);
            window.dashboardInterval = null;
        }
        
        // Obtém a rota atual
        const request = window.location.hash.slice(1).split('/')[1] || '';
        const parsedURL = '/' + (request || 'login');
        const page = routes[parsedURL] || routes['/login'];

        const app = document.getElementById('app');
        const hasToken = isAuthenticated();

        // Se não tem token e a página não é pública, redireciona para login
        if (!page.isPublic && !hasToken) {
            window.location.hash = '#/login';
            app.innerHTML = await routes['/login'].render();
            if (routes['/login'].after_render) {
                await routes['/login'].after_render();
            }
            return;
        }

        // Se tem token e está tentando acessar páginas públicas, redireciona para dashboard
        if (hasToken && page.isPublic) {
            window.location.hash = '#/dashboard';
            app.innerHTML = await routes['/dashboard'].render();
            if (routes['/dashboard'].after_render) {
                await routes['/dashboard'].after_render();
            }
            setTimeout(() => {
                handleThemeToggle();
                setupLogout();
            }, 100);
            return;
        }

        // Renderiza a página
        app.innerHTML = await page.render();
        if (page.after_render) {
            await page.after_render();
        }

        // Se não é página pública, configura logout e tema
        if (!page.isPublic) {
            setTimeout(() => {
                setupLogout();
                handleThemeToggle();
            }, 100);
        }
        
    } catch (error) {
        console.error('Erro no roteamento:', error);
        document.getElementById('app').innerHTML = `
            <div class="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                <div class="text-center">
                    <h1 class="text-red-500 text-xl mb-2">Erro ao carregar a página</h1>
                    <p class="text-slate-600 dark:text-slate-400">${error.message}</p>
                    <a href="#/login" class="mt-4 inline-block text-indigo-600 hover:text-indigo-500">
                        Voltar ao login
                    </a>
                </div>
            </div>
        `;
    }
};

// Configura listeners de navegação
export const setupRouter = () => {
    // Listener para mudanças de hash
    window.addEventListener('hashchange', router);
    
    // Listener para carregamento inicial
    window.addEventListener('load', () => {
        if (!window.location.hash) {
            window.location.hash = '#/login';
        }
        router();
    });
    
    // Se não há hash na URL, define o padrão
    if (!window.location.hash) {
        window.location.hash = '#/login';
    }
    
    // Executa o router imediatamente
    router();
};