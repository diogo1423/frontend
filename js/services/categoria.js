import { MainLayout } from '../components/layout.js';
import { categoriaService } from '../services/categoria.js';

export const CategoriasPage = {
    render: () => MainLayout(`
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">Minhas Categorias</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Formulário de nova categoria -->
            <div class="md:col-span-1">
                <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 class="text-2xl font-bold mb-4">Nova Categoria</h2>
                    <form id="form-categoria" class="space-y-4">
                        <div>
                            <label for="nome-categoria" class="block text-sm font-medium">Nome</label>
                            <input type="text" id="nome-categoria" required 
                                class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                        </div>
                        
                        <div>
                            <label for="tipo-categoria" class="block text-sm font-medium">Tipo</label>
                            <select id="tipo-categoria" required 
                                class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                                <option value="DESPESA">Despesa</option>
                                <option value="RECEITA">Receita</option>
                            </select>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Ícone</label>
                            <div class="grid grid-cols-6 gap-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg max-h-40 overflow-y-auto">
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="💰">💰</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="🏠">🏠</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="🚗">🚗</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="🍔">🍔</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="⚕️">⚕️</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="🎓">🎓</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="✈️">✈️</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="🛒">🛒</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="💡">💡</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="📱">📱</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="👕">👕</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="🎮">🎮</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="💊">💊</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="🏋️">🏋️</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="📚">📚</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="🎵">🎵</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="🔧">🔧</button>
                                <button type="button" class="icone-btn p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-600 text-xl transition-colors" data-icone="📊">📊</button>
                            </div>
                            <input type="hidden" id="icone-selecionado" value="💰">
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Ícone selecionado: <span id="preview-icone">💰</span></p>
                        </div>
                        
                        <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                            Salvar
                        </button>
                    </form>
                </div>
            </div>
            
            <!-- Lista de categorias -->
            <div class="md:col-span-2">
                <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 class="text-2xl font-bold mb-4">Categorias Salvas</h2>
                    <div id="lista-categorias" class="space-y-3">Carregando...</div>
                </div>
            </div>
        </div>
    `),
    
    after_render: async () => {
        const form = document.getElementById('form-categoria');
        const listaEl = document.getElementById('lista-categorias');
        let iconeSelecionado = '💰';
        
        // Seleção de ícones
        document.querySelectorAll('.icone-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                // Remove seleção anterior
                document.querySelectorAll('.icone-btn').forEach(b => 
                    b.classList.remove('bg-indigo-500', 'text-white')
                );
                // Adiciona seleção atual
                btn.classList.add('bg-indigo-500', 'text-white');
                iconeSelecionado = btn.dataset.icone;
                document.getElementById('icone-selecionado').value = iconeSelecionado;
                document.getElementById('preview-icone').textContent = iconeSelecionado;
            });
        });
        
        // Seleciona o primeiro ícone por padrão
        document.querySelector('.icone-btn').classList.add('bg-indigo-500', 'text-white');
        
        const fetchAndRenderCategorias = async () => {
            try {
                listaEl.innerHTML = '<p class="text-slate-500">Carregando...</p>';
                const categorias = await categoriaService.listar();
                listaEl.innerHTML = '';
                
                if (categorias.length === 0) {
                    listaEl.innerHTML = '<p class="text-slate-500">Nenhuma categoria cadastrada.</p>';
                    return;
                }
                
                categorias.forEach(cat => {
                    const tipoCor = cat.tipo === 'RECEITA' ? 'text-green-500' : 'text-red-500';
                    const icone = cat.icone || '📁';
                    
                    listaEl.innerHTML += `
                        <div class="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-3 rounded-md">
                            <div class="flex items-center gap-3">
                                <span class="text-2xl">${icone}</span>
                                <span class="font-medium">${cat.nome}</span>
                            </div>
                            <span class="font-bold text-sm ${tipoCor}">${cat.tipo}</span>
                        </div>
                    `;
                });
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
                listaEl.innerHTML = '<p class="text-red-500">Erro ao carregar categorias.</p>';
            }
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const nomeInput = document.getElementById('nome-categoria');
                const tipoSelect = document.getElementById('tipo-categoria');
                
                await categoriaService.criar({
                    nome: nomeInput.value,
                    tipo: tipoSelect.value,
                    icone: iconeSelecionado
                });
                
                // Limpa o formulário
                nomeInput.value = '';
                iconeSelecionado = '💰';
                document.getElementById('icone-selecionado').value = '💰';
                document.getElementById('preview-icone').textContent = '💰';
                
                // Reset seleção de ícones
                document.querySelectorAll('.icone-btn').forEach(b => 
                    b.classList.remove('bg-indigo-500', 'text-white')
                );
                document.querySelector('.icone-btn').classList.add('bg-indigo-500', 'text-white');
                
                await fetchAndRenderCategorias();
            } catch (error) {
                console.error('Erro ao salvar categoria:', error);
                alert('Erro ao salvar categoria');
            }
        });
        
        await fetchAndRenderCategorias();
    }
};