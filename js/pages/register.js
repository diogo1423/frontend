import { authService } from '../services/api.js';
import { redirectIfAuthenticated } from '../auth.js';
import { config } from '../config.js';

export const RegisterPage = {
    isPublic: true,
    
    render: () => `
        <div class="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div class="text-center">
                    <h1 class="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">💰 Financeiro</h1>
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
                        Criar nova conta
                    </h2>
                    <p class="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                        Preencha seus dados para começar a controlar suas finanças
                    </p>
                </div>
                <div class="bg-white dark:bg-slate-800 py-8 px-6 shadow-lg rounded-lg border border-slate-200 dark:border-slate-700">
                    <form id="register-form" class="space-y-6">
                        <div>
                            <label for="reg-nome" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Nome completo
                            </label>
                            <input id="reg-nome" name="nome" type="text" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Digite seu nome completo">
                        </div>
                        <div>
                            <label for="reg-email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                E-mail
                            </label>
                            <input id="reg-email" name="email" type="email" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="seuemail@exemplo.com">
                        </div>
                        <div>
                            <label for="reg-telefone" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Telefone
                            </label>
                            <input id="reg-telefone" name="telefone" type="tel" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="(11) 99999-9999"
                                maxlength="15">
                        </div>
                        <div>
                            <label for="reg-usuario" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Usuário
                            </label>
                            <input id="reg-usuario" name="usuario" type="text" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Digite um nome de usuário">
                        </div>
                        <div>
                            <label for="reg-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Senha
                            </label>
                            <input id="reg-password" name="password" type="password" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Digite uma senha forte">
                        </div>
                        <div>
                            <label for="reg-confirm-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Confirmar senha
                            </label>
                            <input id="reg-confirm-password" name="confirmPassword" type="password" required 
                                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                                placeholder="Digite a senha novamente">
                        </div>
                        <div class="flex items-center">
                            <input id="aceitar-termos" name="aceitarTermos" type="checkbox" required
                                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                            <label for="aceitar-termos" class="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                                Aceito os termos de uso e política de privacidade
                            </label>
                        </div>
                        <div>
                            <button type="submit" 
                                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Cadastrar
                            </button>
                        </div>
                        <div class="text-center">
                            <p class="text-sm text-slate-600 dark:text-slate-400">
                                Já tem conta? 
                                <a href="#/login" class="font-medium text-indigo-600 hover:text-indigo-500">
                                    Faça login
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
        
        // Máscara para telefone
        const telefoneInput = document.getElementById('reg-telefone');
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
                value = !value[2] ? value[1] : `(${value[1]}) ${value[2]}${value[3] ? '-' + value[3] : ''}`;
            }
            e.target.value = value;
        });
        
        // Validação de email
        const emailInput = document.getElementById('reg-email');
        const validateEmail = (email) => {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        };
        
        const form = document.getElementById('register-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('reg-nome').value;
            const email = document.getElementById('reg-email').value;
            const telefone = document.getElementById('reg-telefone').value;
            const username = document.getElementById('reg-usuario').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            const aceitarTermos = document.getElementById('aceitar-termos').checked;
            
            // Validações
            if (!validateEmail(email)) {
                alert('Por favor, insira um email válido');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('As senhas não coincidem');
                return;
            }
            
            if (password.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres');
                return;
            }
            
            if (!aceitarTermos) {
                alert('Você deve aceitar os termos de uso');
                return;
            }
            
            try {
                // Por enquanto, vamos enviar apenas username e password para o backend
                // Você pode atualizar o backend para aceitar os campos adicionais
                const response = await fetch(`${config.API_URL}/auth/registrar`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        username, 
                        password,
                        // Quando o backend estiver pronto, adicione:
                        // nome,
                        // email,
                        // telefone
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });
                
                // Tenta parsear como JSON, se falhar usa o texto
                let data;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    data = await response.json();
                } else {
                    data = await response.text();
                }
                
                if (response.ok) {
                    // Simulação de envio de email de confirmação
                    alert(`Cadastro realizado com sucesso! Um email de confirmação foi enviado para ${email}. Por favor, verifique sua caixa de entrada.`);
                    
                    // Salvar dados temporariamente (em produção, isso seria feito no backend)
                    localStorage.setItem('tempUserData', JSON.stringify({
                        nome,
                        email,
                        telefone,
                        username
                    }));
                    
                    window.location.hash = '#/login';
                } else {
                    throw new Error(typeof data === 'string' ? data : data.message || 'Erro ao cadastrar');
                }
            } catch (error) {
                console.error('Erro ao cadastrar:', error);
                alert(error.message || 'Erro ao cadastrar');
            }
        });
    }
};