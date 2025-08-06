import { MainLayout } from '../components/layout.js';
import { categoriaService } from '../services/categoria.js';

export const CategoriasPage = {
    render: () => MainLayout(`
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">Minhas Categorias</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Formulário de nova categoria -->
            <div class="md:col-span-1">
                <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 id="form-titulo" class="text-2xl font-bold mb-4">Nova Categoria</h2>
                    <form id="form-categoria" class="space-y-4">
                        <input type="hidden" id="categoria-id" value="">
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
                        
                        <button type="submit" id="btn-salvar" class="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                            Salvar
                        </button>
                        <button type="button" id="btn-cancelar" class="hidden w-full bg-gray-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-500">
                            Cancelar
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
        const btnCancelar = document.getElementById('btn-cancelar');
        const btnSalvar = document.getElementById('btn-salvar');
        const formTitulo = document.getElementById('form-titulo');
        const categoriaIdInput = document.getElementById('categoria-id');
        let iconeSelecionado = '💰';
        let categorias = [];
        
        // Função para resetar o formulário
        const resetarFormulario = () => {
            form.reset();
            categoriaIdInput.value = '';
            formTitulo.textContent = 'Nova Categoria';
            btnSalvar.textContent = 'Salvar';
            btnCancelar.classList.add('hidden');
            iconeSelecionado = '💰';
            document.getElementById('icone-selecionado').value = '💰';
            document.getElementById('preview-icone').textContent = '💰';
            document.querySelectorAll('.icone-btn').forEach(b => 
                b.classList.remove('bg-indigo-500', 'text-white')
            );
            document.querySelector('.icone-btn').classList.add('bg-indigo-500', 'text-white');
        };
        
        // Seleção de ícones
        document.querySelectorAll('.icone-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.icone-btn').forEach(b => 
                    b.classList.remove('bg-indigo-500', 'text-white')
                );
                btn.classList.add('bg-indigo-500', 'text-white');
                iconeSelecionado = btn.dataset.icone;
                document.getElementById('icone-selecionado').value = iconeSelecionado;
                document.getElementById('preview-icone').textContent = iconeSelecionado;
            });
        });
        
        // Seleciona o primeiro ícone por padrão
        document.querySelector('.icone-btn').classList.add('bg-indigo-500', 'text-white');
        
        // Função para editar categoria
        const editarCategoria = (categoria) => {
            categoriaIdInput.value = categoria.id;
            document.getElementById('nome-categoria').value = categoria.nome;
            document.getElementById('tipo-categoria').value = categoria.tipo;
            
            // Selecionar o ícone correto
            iconeSelecionado = categoria.icone || '💰';
            document.getElementById('icone-selecionado').value = iconeSelecionado;
            document.getElementById('preview-icone').textContent = iconeSelecionado;
            
            // Atualizar visual do ícone selecionado
            document.querySelectorAll('.icone-btn').forEach(b => {
                b.classList.remove('bg-indigo-500', 'text-white');
                if (b.dataset.icone === iconeSelecionado) {
                    b.classList.add('bg-indigo-500', 'text-white');
                }
            });
            
            formTitulo.textContent = 'Editar Categoria';
            btnSalvar.textContent = 'Atualizar';
            btnCancelar.classList.remove('hidden');
            
            // Scroll para o formulário
            document.querySelector('.bg-white').scrollIntoView({ behavior: 'smooth' });
        };
        
        // Função para excluir categoria
        const excluirCategoria = async (id, nome) => {
            if (confirm(`Tem certeza que deseja excluir a categoria "${nome}"?\n\nAtenção: Transações com esta categoria não serão excluídas.`)) {
                try {
                    await categoriaService.excluir(id);
                    await fetchAndRenderCategorias();
                } catch (error) {
                    console.error('Erro ao excluir categoria:', error);
                    alert('Erro ao excluir categoria. Verifique se não há transações usando esta categoria.');
                }
            }
        };
        
        const fetchAndRenderCategorias = async () => {
            try {
                listaEl.innerHTML = '<p class="text-slate-500">Carregando...</p>';
                categorias = await categoriaService.listar();
                listaEl.innerHTML = '';
                
                if (categorias.length === 0) {
                    listaEl.innerHTML = '<p class="text-slate-500">Nenhuma categoria cadastrada.</p>';
                    return;
                }
                
                categorias.forEach(cat => {
                    const tipoCor = cat.tipo === 'RECEITA' ? 'text-green-500' : 'text-red-500';
                    const icone = cat.icone || '📁';
                    
                    listaEl.innerHTML += `
                        <div class="flex justify-between items-center bg-slate-100 dark:bg-slate-700 p-3 rounded-md group">
                            <div class="flex items-center gap-3">
                                <span class="text-2xl">${icone}</span>
                                <div>
                                    <span class="font-medium">${cat.nome}</span>
                                    <span class="font-bold text-sm ${tipoCor} ml-2">${cat.tipo}</span>
                                </div>
                            </div>
                            <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button class="editar-btn p-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600" data-id="${cat.id}">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                                        <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                                <button class="excluir-btn p-1 rounded hover:bg-red-200 dark:hover:bg-red-900 text-red-600" data-id="${cat.id}" data-nome="${cat.nome}">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    `;
                });
                
                // Adicionar event listeners para editar e excluir
                document.querySelectorAll('.editar-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const categoria = categorias.find(c => c.id == btn.dataset.id);
                        if (categoria) editarCategoria(categoria);
                    });
                });
                
                document.querySelectorAll('.excluir-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        excluirCategoria(btn.dataset.id, btn.dataset.nome);
                    });
                });
                
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
                listaEl.innerHTML = '<p class="text-red-500">Erro ao carregar categorias.</p>';
            }
        };

        // Submissão do formulário
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const nome = document.getElementById('nome-categoria').value;
                const tipo = document.getElementById('tipo-categoria').value;
                const id = categoriaIdInput.value;
                
                const dados = {
                    nome,
                    tipo,
                    icone: iconeSelecionado
                };
                
                if (id) {
                    // Atualizar categoria existente
                    await categoriaService.atualizar(id, dados);
                } else {
                    // Criar nova categoria
                    await categoriaService.criar(dados);
                }
                
                resetarFormulario();
                await fetchAndRenderCategorias();
            } catch (error) {
                console.error('Erro ao salvar categoria:', error);
                alert('Erro ao salvar categoria');
            }
        });
        
        // Botão cancelar
        btnCancelar.addEventListener('click', resetarFormulario);
        
        await fetchAndRenderCategorias();
    }
};