import { authService } from '../services/api.js';
import { saveToken, redirectIfAuthenticated } from '../auth.js';

export const LoginPage = {
    isPublic: true,
    
    render: () => `
        <div class="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">💰 Financeiro</h1>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
                        Faça login em sua conta
                    </h2>
                    <p class="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                        Controle suas finanças pessoais
                    </p>
                </div>
                <div class="bg-white dark:bg-slate-800 py-8 px-6 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
                    <form id="login-form" class="space-y-6">
                        <div>
                            <label for="usuario" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Usuário
                            </label>
                            <input id="usuario" name="usuario" type="text" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Digite seu usuário">
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Senha
                            </label>
                            <input id="password" name="password" type="password" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Digite sua senha">
                        </div>
                        <div>
                            <button type="submit" 
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Entrar
                            </button>
                        </div>
                        <div class="text-center">
                            <p class="text-sm text-slate-600 dark:text-slate-400">
                                Não tem conta? 
                                <a href="#/registrar" class="font-medium text-indigo-600 hover:text-indigo-500">
                                    Cadastre-se
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    
    after_render: async () => {
        // Redireciona se já estiver autenticado
        if (redirectIfAuthenticated()) return;
        
        const form = document.getElementById('login-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('usuario').value;
            const password = document.getElementById('password').value;
            
            try {
                const data = await authService.login(username, password);
                saveToken(data.token);
                window.location.hash = '#/dashboard';
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert(error.message || 'Erro ao fazer login');
            }
        });
    }
};