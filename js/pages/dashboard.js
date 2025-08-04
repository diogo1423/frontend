import { MainLayout } from '../components/layout.js';
import { transacaoService } from '../services/transacao.js';
import { formatCurrency } from '../utils.js';

export const DashboardPage = {
    render: () => MainLayout(`
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
            <div class="text-right">
                <div id="data-atual" class="text-lg font-semibold text-slate-700 dark:text-slate-300"></div>
                <div id="hora-atual" class="text-sm text-slate-500 dark:text-slate-400"></div>
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
        
        <!-- Seção de últimos lançamentos e gráfico -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 class="text-2xl font-bold mb-4">Últimos Lançamentos (Mês Atual)</h2>
                <div id="ultimos-lancamentos">Carregando...</div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 class="text-2xl font-bold mb-4">Gastos Pagos por Categoria (Geral)</h2>
                <div id="container-grafico" class="mx-auto" style="max-width: 400px;">
                    <canvas id="grafico-gastos"></canvas>
                </div>
            </div>
        </div>
    `),
    
    after_render: async () => {
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
        
        try {
            // Carregar saldo
            const saldo = await transacaoService.obterSaldo();
            document.getElementById('saldo-geral').textContent = formatCurrency(saldo);

            // Carregar estatísticas
            const stats = await transacaoService.obterEstatisticas();
            document.getElementById('receitas-mes').textContent = formatCurrency(stats.receitasMes || 0);
            document.getElementById('despesas-mes').textContent = formatCurrency(stats.despesasPagasMes || 0);
            document.getElementById('balanco-mes').textContent = formatCurrency(stats.balancoMes || 0);

            // Carregar últimos lançamentos
            const hoje = new Date();
            const ultimosLancamentos = await transacaoService.listarPorMes(hoje.getFullYear(), hoje.getMonth() + 1);
            const ultimosEl = document.getElementById('ultimos-lancamentos');
            
            if (ultimosLancamentos.length === 0) {
                ultimosEl.innerHTML = '<p class="text-slate-500">Nenhum lançamento este mês.</p>';
            } else {
                ultimosEl.innerHTML = '';
                ultimosLancamentos.slice(0, 5).forEach(l => {
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

            // Carregar gráfico
            const gastosPorCategoria = await transacaoService.obterGastosPorCategoria();
            const labels = Object.keys(gastosPorCategoria);
            const valores = Object.values(gastosPorCategoria);
            const containerGraficoEl = document.getElementById('container-grafico');
            
            if (labels.length === 0) {
                containerGraficoEl.innerHTML = '<p class="text-slate-500 text-center py-8">Sem despesas pagas para exibir.</p>';
            } else {
                new Chart(document.getElementById('grafico-gastos').getContext('2d'), {
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
                            }
                        }
                    }
                });
            }
            
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error);
            document.getElementById('saldo-geral').textContent = 'Erro ao carregar';
            document.getElementById('receitas-mes').textContent = 'Erro ao carregar';
            document.getElementById('despesas-mes').textContent = 'Erro ao carregar';
            document.getElementById('balanco-mes').textContent = 'Erro ao carregar';
        }
    }
};