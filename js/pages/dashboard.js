import { MainLayout } from '../components/layout.js';
import { transacaoService } from '../services/transacao.js';
import { formatCurrency } from '../utils.js';

export const DashboardPage = {
    render: () => MainLayout(`
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <div class="flex items-center gap-4">
                <!-- Seletor de mês/ano -->
                <div class="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow">
                    <button id="prev-month-dash" class="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    <span id="mes-ano-dashboard" class="font-semibold text-lg min-w-[150px] text-center"></span>
                    <button id="next-month-dash" class="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>
                <div class="text-right">
                    <div id="data-atual" class="text-sm font-medium text-slate-700 dark:text-slate-300"></div>
                    <div id="hora-atual" class="text-xs text-slate-500 dark:text-slate-400"></div>
                </div>
            </div>
        </div>
        
        <!-- Cards de estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400">Saldo Geral</h2>
                <p id="saldo-geral" class="text-3xl font-bold">Carregando...</p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400">Receitas no Mês</h2>
                <p id="receitas-mes" class="text-3xl font-bold text-green-500">Carregando...</p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400">Despesas Pagas no Mês</h2>
                <p id="despesas-mes" class="text-3xl font-bold text-red-500">Carregando...</p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 class="text-lg font-semibold text-slate-500 dark:text-slate-400">Balanço do Mês</h2>
                <p id="balanco-mes" class="text-3xl font-bold">Carregando...</p>
            </div>
        </div>
        
        <!-- Seção de últimos lançamentos e gráficos -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 class="text-2xl font-bold mb-4">Lançamentos do Mês Selecionado</h2>
                <div id="ultimos-lancamentos">Carregando...</div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 class="text-2xl font-bold mb-4">Gastos Pagos por Categoria</h2>
                <div id="container-grafico" class="mx-auto" style="max-width: 400px;">
                    <canvas id="grafico-gastos"></canvas>
                </div>
            </div>
        </div>
        
        <!-- Nova seção com gráfico de despesas pendentes -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 class="text-2xl font-bold mb-4">Despesas Pendentes por Categoria</h2>
                <div id="container-grafico-pendentes" class="mx-auto" style="max-width: 400px;">
                    <canvas id="grafico-pendentes"></canvas>
                </div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 class="text-2xl font-bold mb-4">Resumo de Despesas</h2>
                <div id="resumo-despesas" class="space-y-4">
                    <div class="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <span class="font-medium">Despesas Pagas</span>
                        <span id="total-despesas-pagas" class="font-bold text-green-600 dark:text-green-400">R$ 0,00</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                        <span class="font-medium">Despesas Pendentes</span>
                        <span id="total-despesas-pendentes" class="font-bold text-yellow-600 dark:text-yellow-400">R$ 0,00</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                        <span class="font-medium">Total de Despesas</span>
                        <span id="total-despesas-geral" class="font-bold text-red-600 dark:text-red-400">R$ 0,00</span>
                    </div>
                </div>
            </div>
        </div>
    `),
    
    after_render: async () => {
        let mesAtual = new Date();
        let graficoPagos = null;
        let graficoPendentes = null;
        
        // Função para atualizar data e hora
        const atualizarDataHora = () => {
            const agora = new Date();
            const dataEl = document.getElementById('data-atual');
            const horaEl = document.getElementById('hora-atual');
            
            if (dataEl && horaEl) {
                dataEl.textContent = agora.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                horaEl.textContent = agora.toLocaleTimeString('pt-BR');
            }
        };
        
        // Atualiza imediatamente e depois a cada segundo
        atualizarDataHora();
        const intervalId = setInterval(atualizarDataHora, 1000);
        
        // Salva o intervalo para limpar depois
        window.dashboardInterval = intervalId;
        
        // Função para carregar dados do mês selecionado
        const carregarDadosDoMes = async () => {
            try {
                const ano = mesAtual.getFullYear();
                const mes = mesAtual.getMonth() + 1;
                
                // Atualizar display do mês/ano
                document.getElementById('mes-ano-dashboard').textContent = 
                    mesAtual.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                
                // Carregar saldo (sempre geral, não por mês)
                const saldo = await transacaoService.obterSaldo();
                document.getElementById('saldo-geral').textContent = formatCurrency(saldo);

                // Carregar estatísticas do mês específico
                const todasTransacoes = await transacaoService.listarPorMes(ano, mes);
                
                // Calcular estatísticas
                const receitasMes = todasTransacoes
                    .filter(t => t.tipo === 'RECEITA')
                    .reduce((sum, t) => sum + t.valor, 0);
                    
                const despesasPagasMes = todasTransacoes
                    .filter(t => t.tipo === 'DESPESA' && t.pago)
                    .reduce((sum, t) => sum + t.valor, 0);
                    
                const balancoMes = receitasMes - despesasPagasMes;
                
                document.getElementById('receitas-mes').textContent = formatCurrency(receitasMes);
                document.getElementById('despesas-mes').textContent = formatCurrency(despesasPagasMes);
                document.getElementById('balanco-mes').textContent = formatCurrency(balancoMes);

                // Carregar lançamentos do mês
                const ultimosEl = document.getElementById('ultimos-lancamentos');
                
                if (todasTransacoes.length === 0) {
                    ultimosEl.innerHTML = '<p class="text-slate-500">Nenhum lançamento neste mês.</p>';
                } else {
                    ultimosEl.innerHTML = '';
                    // Mostrar todos os lançamentos do mês, não apenas os últimos 5
                    todasTransacoes.forEach(l => {
                        const eReceita = l.tipo === 'RECEITA';
                        const corValor = eReceita ? 'text-green-500' : 'text-red-500';
                        const statusCor = l.pago ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black';
                        
                        ultimosEl.innerHTML += `
                            <div class="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                                <div>
                                    <p class="font-semibold">${l.descricao}</p>
                                    <p class="text-sm text-slate-500 dark:text-slate-400">${l.categoria}</p>
                                </div>
                                <div class="flex items-center gap-4">
                                    <span class="text-xs font-bold ${statusCor} px-2 py-1 rounded-full">
                                        ${l.pago ? 'Pago' : 'Pendente'}
                                    </span>
                                    <p class="font-semibold ${corValor}">${formatCurrency(l.valor)}</p>
                                </div>
                            </div>
                        `;
                    });
                }

                // Calcular gastos por categoria (apenas pagos)
                const gastosPorCategoria = {};
                todasTransacoes
                    .filter(t => t.tipo === 'DESPESA' && t.pago)
                    .forEach(t => {
                        if (!gastosPorCategoria[t.categoria]) {
                            gastosPorCategoria[t.categoria] = 0;
                        }
                        gastosPorCategoria[t.categoria] += t.valor;
                    });

                // Atualizar gráfico de gastos pagos
                const labels = Object.keys(gastosPorCategoria);
                const valores = Object.values(gastosPorCategoria);
                const containerGraficoEl = document.getElementById('container-grafico');
                
                if (labels.length === 0) {
                    containerGraficoEl.innerHTML = '<p class="text-slate-500 text-center py-8">Sem despesas pagas para exibir.</p>';
                } else {
                    // Destruir gráfico anterior se existir
                    if (graficoPagos) {
                        graficoPagos.destroy();
                    }
                    
                    containerGraficoEl.innerHTML = '<canvas id="grafico-gastos"></canvas>';
                    graficoPagos = new Chart(document.getElementById('grafico-gastos').getContext('2d'), {
                        type: 'pie',
                        data: {
                            labels,
                            datasets: [{
                                data: valores,
                                backgroundColor: ['#4f46e5', '#7c3aed', '#db2777', '#f97316', '#eab308', '#22c55e'],
                                borderColor: '#fff',
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top'
                                },
                                title: {
                                    display: false
                                }
                            }
                        }
                    });
                }
                
                // Carregar dados de despesas pendentes
                const despesasPendentes = todasTransacoes.filter(t => t.tipo === 'DESPESA' && !t.pago);
                const despesasPagas = todasTransacoes.filter(t => t.tipo === 'DESPESA' && t.pago);
                
                // Calcular despesas pendentes por categoria
                const pendentesPorCategoria = {};
                despesasPendentes.forEach(t => {
                    if (!pendentesPorCategoria[t.categoria]) {
                        pendentesPorCategoria[t.categoria] = 0;
                    }
                    pendentesPorCategoria[t.categoria] += t.valor;
                });
                
                // Renderizar gráfico de pendentes
                const labelsPendentes = Object.keys(pendentesPorCategoria);
                const valoresPendentes = Object.values(pendentesPorCategoria);
                const containerPendentesEl = document.getElementById('container-grafico-pendentes');
                
                if (labelsPendentes.length === 0) {
                    containerPendentesEl.innerHTML = '<p class="text-slate-500 text-center py-8">Sem despesas pendentes.</p>';
                } else {
                    // Destruir gráfico anterior se existir
                    if (graficoPendentes) {
                        graficoPendentes.destroy();
                    }
                    
                    containerPendentesEl.innerHTML = '<canvas id="grafico-pendentes"></canvas>';
                    graficoPendentes = new Chart(document.getElementById('grafico-pendentes').getContext('2d'), {
                        type: 'doughnut',
                        data: {
                            labels: labelsPendentes,
                            datasets: [{
                                data: valoresPendentes,
                                backgroundColor: ['#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981'],
                                borderColor: '#fff',
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top'
                                }
                            }
                        }
                    });
                }
                
                // Calcular totais
                const totalDespesasPagas = despesasPagas.reduce((sum, t) => sum + t.valor, 0);
                const totalDespesasPendentes = despesasPendentes.reduce((sum, t) => sum + t.valor, 0);
                const totalDespesasGeral = totalDespesasPagas + totalDespesasPendentes;
                
                // Atualizar resumo
                document.getElementById('total-despesas-pagas').textContent = formatCurrency(totalDespesasPagas);
                document.getElementById('total-despesas-pendentes').textContent = formatCurrency(totalDespesasPendentes);
                document.getElementById('total-despesas-geral').textContent = formatCurrency(totalDespesasGeral);
                
            } catch (error) {
                console.error('Erro ao carregar dashboard:', error);
                document.getElementById('saldo-geral').textContent = 'Erro ao carregar';
                document.getElementById('receitas-mes').textContent = 'Erro ao carregar';
                document.getElementById('despesas-mes').textContent = 'Erro ao carregar';
                document.getElementById('balanco-mes').textContent = 'Erro ao carregar';
            }
        };
        
        // Navegação entre meses
        document.getElementById('prev-month-dash').addEventListener('click', () => {
            mesAtual.setMonth(mesAtual.getMonth() - 1);
            carregarDadosDoMes();
        });
        
        document.getElementById('next-month-dash').addEventListener('click', () => {
            mesAtual.setMonth(mesAtual.getMonth() + 1);
            carregarDadosDoMes();
        });
        
        // Carregar dados iniciais
        await carregarDadosDoMes();
    }
};