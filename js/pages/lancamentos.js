import { MainLayout } from '../components/layout.js';
import { transacaoService } from '../services/transacao.js';
import { categoriaService } from '../services/categoria.js';
import { openEditModal } from '../components/modal.js';
import { formatCurrency, formatDate } from '../utils.js';

export const LancamentosPage = {
    render: () => MainLayout(`
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">Meus Lançamentos</h1>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Formulário de novo lançamento -->
            <div class="lg:col-span-1">
                <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <h2 class="text-2xl font-bold mb-4">Novo Lançamento</h2>
                    <form id="form-lancamento" class="space-y-4">
                        <div>
                            <label for="desc" class="block text-sm font-medium">Descrição</label>
                            <input type="text" id="desc" required class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                        </div>
                        <div>
                            <label for="val" class="block text-sm font-medium">Valor (R$)</label>
                            <input type="number" id="val" step="0.01" required class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                        </div>
                        <div>
                            <label for="tip" class="block text-sm font-medium">Tipo</label>
                            <select id="tip" required class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                                <option value="DESPESA">Despesa</option>
                                <option value="RECEITA">Receita</option>
                            </select>
                        </div>
                        <div>
                            <label for="cat" class="block text-sm font-medium">Categoria</label>
                            <select id="cat" required class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                                <option value="">Carregando...</option>
                            </select>
                        </div>
                        <div>
                            <label for="dat" class="block text-sm font-medium">Data</label>
                            <input type="date" id="dat" required class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                        </div>
                        <div>
                            <label for="tags" class="block text-sm font-medium">Tags (opcional)</label>
                            <input type="text" id="tags" placeholder="trabalho, urgente, mensal..." class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                            <p class="text-xs text-slate-500 mt-1">Separe as tags com vírgula</p>
                        </div>
                        <div class="flex items-center">
                            <input type="checkbox" id="parcelado" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                            <label for="parcelado" class="ml-2 block text-sm">É parcelado?</label>
                        </div>
                        <div id="campo-parcelas" class="hidden">
                            <label for="num-parcelas" class="block text-sm font-medium">Nº de Parcelas</label>
                            <input type="number" id="num-parcelas" value="2" min="2" class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                        </div>
                        <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">Lançar</button>
                    </form>
                </div>
            </div>
            
            <!-- Histórico de lançamentos -->
            <div class="lg:col-span-2">
                <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold">Histórico do Mês</h2>
                        <div class="flex items-center gap-2">
                            <button id="prev-month" class="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">&lt;</button>
                            <span id="mes-ano-atual" class="font-semibold text-lg"></span>
                            <button id="next-month" class="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">&gt;</button>
                        </div>
                    </div>
                    
                    <!-- Filtros avançados -->
                    <div class="mb-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label for="filtro-busca" class="block text-xs font-medium mb-1">Buscar por descrição</label>
                                <input type="text" id="filtro-busca" placeholder="Digite para buscar..." class="input-style w-full px-2 py-1 text-sm bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded">
                            </div>
                            <div>
                                <label for="filtro-categoria" class="block text-xs font-medium mb-1">Filtrar por categoria</label>
                                <select id="filtro-categoria" class="input-style w-full px-2 py-1 text-sm bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded">
                                    <option value="">Todas as categorias</option>
                                </select>
                            </div>
                            <div>
                                <label for="filtro-status" class="block text-xs font-medium mb-1">Status</label>
                                <select id="filtro-status" class="input-style w-full px-2 py-1 text-sm bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded">
                                    <option value="">Todos</option>
                                    <option value="pago">Pago</option>
                                    <option value="pendente">Pendente</option>
                                </select>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                            <div>
                                <label for="filtro-valor-min" class="block text-xs font-medium mb-1">Valor mínimo</label>
                                <input type="number" id="filtro-valor-min" step="0.01" placeholder="R$ 0,00" class="input-style w-full px-2 py-1 text-sm bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded">
                            </div>
                            <div>
                                <label for="filtro-valor-max" class="block text-xs font-medium mb-1">Valor máximo</label>
                                <input type="number" id="filtro-valor-max" step="0.01" placeholder="R$ 999,99" class="input-style w-full px-2 py-1 text-sm bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded">
                            </div>
                            <div class="flex items-end">
                                <button id="limpar-filtros" class="w-full px-3 py-1 text-sm bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded hover:bg-slate-300 dark:hover:bg-slate-500">Limpar Filtros</button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="lista-lancamentos" class="space-y-3">Carregando...</div>
                </div>
            </div>
        </div>
    `),
    
    after_render: async () => {
        let dataAtual = new Date();
        const form = document.getElementById('form-lancamento');
        const listaEl = document.getElementById('lista-lancamentos');
        const mesAnoEl = document.getElementById('mes-ano-atual');
        const catSelect = document.getElementById('cat');
        const tipoSelect = document.getElementById('tip');

        const popularCategorias = async () => {
            try {
                const tipo = tipoSelect.value;
                const categorias = await categoriaService.listarPorTipo(tipo);
                catSelect.innerHTML = '<option value="">Selecione...</option>';
                categorias.forEach(c => {
                    const icone = c.icone || '📁';
                    catSelect.innerHTML += `<option value="${c.nome}">${icone} ${c.nome}</option>`;
                });
                
                // Popular filtro de categorias também
                const filtroCategoria = document.getElementById('filtro-categoria');
                if (filtroCategoria) {
                    const opcaoAtual = filtroCategoria.value;
                    filtroCategoria.innerHTML = '<option value="">Todas as categorias</option>';
                    categorias.forEach(c => {
                        const icone = c.icone || '📁';
                        filtroCategoria.innerHTML += `<option value="${c.nome}" ${opcaoAtual === c.nome ? 'selected' : ''}>${icone} ${c.nome}</option>`;
                    });
                }
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
                catSelect.innerHTML = '<option value="">Erro ao carregar</option>';
            }
        };

        let todosLancamentos = [];
        let lancamentosFiltrados = [];

        const aplicarFiltros = () => {
            const busca = document.getElementById('filtro-busca').value.toLowerCase();
            const categoria = document.getElementById('filtro-categoria').value;
            const status = document.getElementById('filtro-status').value;
            const valorMin = parseFloat(document.getElementById('filtro-valor-min').value) || 0;
            const valorMax = parseFloat(document.getElementById('filtro-valor-max').value) || Infinity;

            lancamentosFiltrados = todosLancamentos.filter(l => {
                const matchBusca = !busca || l.descricao.toLowerCase().includes(busca);
                const matchCategoria = !categoria || l.categoria === categoria;
                const matchStatus = !status || (status === 'pago' && l.pago) || (status === 'pendente' && !l.pago);
                const matchValor = l.valor >= valorMin && l.valor <= valorMax;
                
                return matchBusca && matchCategoria && matchStatus && matchValor;
            });

            renderizarLancamentosFiltrados();
        };

        const renderizarLancamentosFiltrados = () => {
            if (lancamentosFiltrados.length === 0) {
                listaEl.innerHTML = '<p class="text-slate-500">Nenhum lançamento encontrado com os filtros aplicados.</p>';
                return;
            }

            listaEl.innerHTML = '';
            lancamentosFiltrados.forEach(l => {
                const item = document.createElement('div');
                const eReceita = l.tipo === 'RECEITA';
                const corValor = eReceita ? 'text-green-500' : 'text-red-500';
                const statusCor = l.pago ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black';
                
                // Renderizar tags se existirem
                const tagsHtml = l.tags && l.tags.length > 0 ? 
                    `<div class="flex flex-wrap gap-1 mt-1">${l.tags.split(',').map(tag => 
                        `<span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 py-0.5 rounded">${tag.trim()}</span>`
                    ).join('')}</div>` : '';
                
                item.className = 'flex items-center justify-between p-3 rounded-md bg-slate-100 dark:bg-slate-700';
                item.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-bold ${statusCor} px-2 py-1 rounded-full cursor-pointer" data-id="${l.id}" data-pago="${l.pago}" title="Clique para alterar status">${l.pago ? 'Pago' : 'Pendente'}</span>
                        <div>
                            <p class="font-bold">${l.descricao}</p>
                            <p class="text-sm text-slate-500 dark:text-slate-400">${l.categoria} - ${formatDate(l.data)}</p>
                            ${tagsHtml}
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="font-bold text-lg ${corValor}">${formatCurrency(l.valor)}</span>
                        <button data-id="${l.id}" class="editar-btn p-1 rounded hover:bg-slate-300 dark:hover:bg-slate-600">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                                <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                `;
                listaEl.appendChild(item);
            });
        };

        const renderizarLancamentos = async () => {
            try {
                const ano = dataAtual.getFullYear();
                const mes = dataAtual.getMonth() + 1;
                mesAnoEl.textContent = dataAtual.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                listaEl.innerHTML = '<p class="text-slate-500">Carregando...</p>';
                
                todosLancamentos = await transacaoService.listarPorMes(ano, mes);
                lancamentosFiltrados = [...todosLancamentos];

                if (todosLancamentos.length === 0) {
                    listaEl.innerHTML = '<p class="text-slate-500">Nenhum lançamento neste mês.</p>';
                    return;
                }

                renderizarLancamentosFiltrados();
            } catch (error) {
                console.error('Erro ao carregar lançamentos:', error);
                listaEl.innerHTML = '<p class="text-red-500">Erro ao carregar lançamentos.</p>';
            }
        };

        // Event listener para parcelas
        document.getElementById('parcelado').addEventListener('change', (e) => {
            document.getElementById('campo-parcelas').classList.toggle('hidden', !e.target.checked);
        });
        
        // Submissão do formulário
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const isParcelado = document.getElementById('parcelado').checked;
                const tags = document.getElementById('tags').value;
                
                const lancamento = {
                    descricao: document.getElementById('desc').value,
                    valor: parseFloat(document.getElementById('val').value),
                    categoria: document.getElementById('cat').value,
                    data: document.getElementById('dat').value,
                    tipo: document.getElementById('tip').value,
                    tags: tags || null,
                    parcelado: isParcelado,
                    numeroParcelas: isParcelado ? parseInt(document.getElementById('num-parcelas').value) : null
                };
                
                await transacaoService.criar(lancamento);
                form.reset();
                document.getElementById('campo-parcelas').classList.add('hidden');
                await renderizarLancamentos();
            } catch (error) {
                console.error('Erro ao salvar lançamento:', error);
                alert('Erro ao salvar lançamento');
            }
        });

        // Event listeners para filtros
        document.getElementById('filtro-busca').addEventListener('input', aplicarFiltros);
        document.getElementById('filtro-categoria').addEventListener('change', aplicarFiltros);
        document.getElementById('filtro-status').addEventListener('change', aplicarFiltros);
        document.getElementById('filtro-valor-min').addEventListener('input', aplicarFiltros);
        document.getElementById('filtro-valor-max').addEventListener('input', aplicarFiltros);
        
        document.getElementById('limpar-filtros').addEventListener('click', () => {
            document.getElementById('filtro-busca').value = '';
            document.getElementById('filtro-categoria').value = '';
            document.getElementById('filtro-status').value = '';
            document.getElementById('filtro-valor-min').value = '';
            document.getElementById('filtro-valor-max').value = '';
            aplicarFiltros();
        });
        
        // Event listener para lista de lançamentos
        listaEl.addEventListener('click', async (e) => {
            // Alternar status pago/pendente
            const statusBtn = e.target.closest('span[data-id]');
            if (statusBtn && statusBtn.dataset.id) {
                try {
                    const isPago = statusBtn.dataset.pago === 'true';
                    
                    if (!isPago) {
                        await transacaoService.marcarComoPaga(statusBtn.dataset.id);
                    } else {
                        await transacaoService.desmarcarComoPaga(statusBtn.dataset.id);
                    }
                    
                    await renderizarLancamentos();
                } catch (error) {
                    console.error('Erro ao alterar status:', error);
                    alert('Erro ao alterar status');
                }
                return;
            }
            
            // Botão de editar
            const editarBtn = e.target.closest('.editar-btn');
            if (editarBtn) {
                openEditModal(editarBtn.dataset.id, renderizarLancamentos);
            }
        });
        
        // Navegação de meses
        document.getElementById('prev-month').addEventListener('click', () => {
            dataAtual.setMonth(dataAtual.getMonth() - 1);
            renderizarLancamentos();
        });
        
        document.getElementById('next-month').addEventListener('click', () => {
            dataAtual.setMonth(dataAtual.getMonth() + 1);
            renderizarLancamentos();
        });

        // Mudança de tipo
        tipoSelect.addEventListener('change', popularCategorias);
        
        // Inicialização
        document.getElementById('dat').valueAsDate = new Date();
        await popularCategorias();
        await renderizarLancamentos();
    }
};