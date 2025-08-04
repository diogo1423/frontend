import { MainLayout } from '../components/layout.js';
import { transacaoService } from '../services/transacao.js';
import { categoriaService } from '../services/categoria.js';
import { formatCurrency, formatDate, getMonthBounds } from '../utils.js';

export const RelatoriosPage = {
    render: () => MainLayout(`
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-6">Relatórios</h1>
        
        <!-- Filtros -->
        <div class="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-md mb-6">
            <form id="form-relatorio" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                <div>
                    <label for="data-inicio" class="block text-sm font-medium">Data Início</label>
                    <input type="date" id="data-inicio" required 
                        class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                </div>
                <div>
                    <label for="data-fim" class="block text-sm font-medium">Data Fim</label>
                    <input type="date" id="data-fim" required 
                        class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                </div>
                <div>
                    <label for="tipo-transacao" class="block text-sm font-medium">Tipo</label>
                    <select id="tipo-transacao" 
                        class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                        <option value="TODAS">Todas</option>
                        <option value="RECEITA">Apenas Receitas</option>
                        <option value="DESPESA">Apenas Despesas</option>
                    </select>
                </div>
                <div>
                    <label for="rel-categoria" class="block text-sm font-medium">Categoria</label>
                    <select id="rel-categoria" 
                        class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                        <option value="TODAS">Todas as Categorias</option>
                    </select>
                </div>
                <button type="submit" 
                    class="w-full md:w-auto bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                    Gerar Relatório
                </button>
                <button type="button" id="exportar-pdf" 
                    class="w-full md:w-auto bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled>
                    📄 Exportar PDF
                </button>
            </form>
        </div>
        
        <!-- Container de resultados -->
        <div id="container-resultados" class="space-y-6"></div>
    `),
    
    after_render: async () => {
        let dadosRelatorio = null;
        const form = document.getElementById('form-relatorio');
        const catSelect = document.getElementById('rel-categoria');
        const tipoSelect = document.getElementById('tipo-transacao');
        const resultadosEl = document.getElementById('container-resultados');
        const dataInicioEl = document.getElementById('data-inicio');
        const dataFimEl = document.getElementById('data-fim');
        const exportarPdfBtn = document.getElementById('exportar-pdf');

        const popularCategorias = async () => {
            try {
                const tipo = tipoSelect.value;
                let categorias;
                
                if (tipo === 'TODAS') {
                    categorias = await categoriaService.listar();
                } else {
                    categorias = await categoriaService.listarPorTipo(tipo);
                }
                
                const categoriaAtual = catSelect.value;
                catSelect.innerHTML = '<option value="TODAS">Todas as Categorias</option>';
                
                categorias.forEach(c => {
                    const icone = c.icone || '📁';
                    catSelect.innerHTML += `<option value="${c.nome}" ${c.nome === categoriaAtual ? 'selected' : ''}>${icone} ${c.nome}</option>`;
                });
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
                catSelect.innerHTML = '<option value="TODAS">Erro ao carregar</option>';
            }
        };

        // Atualizar categorias quando mudar o tipo
        tipoSelect.addEventListener('change', popularCategorias);

        const renderizarResultados = (transacoes) => {
            let totalReceitas = 0;
            let totalDespesas = 0;
            
            // Filtrar por tipo se necessário
            const tipoFiltro = tipoSelect.value;
            if (tipoFiltro !== 'TODAS') {
                transacoes = transacoes.filter(t => t.tipo === tipoFiltro);
            }
            
            let tabelaHtml = `
                <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md overflow-x-auto" id="tabela-relatorio">
                    <table class="w-full text-left">
                        <thead class="border-b-2 border-slate-200 dark:border-slate-700">
                            <tr>
                                <th class="p-2">Data</th>
                                <th class="p-2">Descrição</th>
                                <th class="p-2">Categoria</th>
                                <th class="p-2">Tags</th>
                                <th class="p-2">Status</th>
                                <th class="p-2 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            if (transacoes.length === 0) {
                tabelaHtml += `
                    <tr>
                        <td colspan="6" class="p-4 text-center text-slate-500">
                            Nenhum resultado encontrado.
                        </td>
                    </tr>
                `;
            } else {
                transacoes.forEach(t => {
                    const eReceita = t.tipo === 'RECEITA';
                    if (eReceita) {
                        totalReceitas += t.valor;
                    } else {
                        totalDespesas += t.valor;
                    }
                    
                    const tagsHtml = t.tags ? 
                        t.tags.split(',').map(tag => 
                            `<span class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 py-0.5 rounded mr-1">${tag.trim()}</span>`
                        ).join('') 
                        : '<span class="text-slate-400">-</span>';
                    
                    const statusHtml = t.pago ? 
                        '<span class="text-xs bg-green-600 text-white px-2 py-1 rounded">Pago</span>' : 
                        '<span class="text-xs bg-yellow-500 text-black px-2 py-1 rounded">Pendente</span>';
                    
                    tabelaHtml += `
                        <tr class="border-b border-slate-200 dark:border-slate-700">
                            <td class="p-2 whitespace-nowrap">${formatDate(t.data)}</td>
                            <td class="p-2">${t.descricao}</td>
                            <td class="p-2">${t.categoria}</td>
                            <td class="p-2">${tagsHtml}</td>
                            <td class="p-2">${statusHtml}</td>
                            <td class="p-2 text-right font-semibold ${eReceita ? 'text-green-500' : 'text-red-500'}">
                                ${formatCurrency(t.valor)}
                            </td>
                        </tr>
                    `;
                });
            }
            
            tabelaHtml += `
                        </tbody>
                    </table>
                </div>
            `;
            
            const saldoPeriodo = totalReceitas - totalDespesas;
            
            const resumoHtml = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" id="resumo-relatorio">
                    <div class="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 p-4 rounded-lg">
                        <p class="text-sm text-slate-900 dark:text-slate-100 font-medium">Total Receitas</p>
                        <p class="text-2xl font-bold text-green-600 dark:text-green-400">${formatCurrency(totalReceitas)}</p>
                    </div>
                    <div class="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 p-4 rounded-lg">
                        <p class="text-sm text-slate-900 dark:text-slate-100 font-medium">Total Despesas</p>
                        <p class="text-2xl font-bold text-red-600 dark:text-red-400">${formatCurrency(totalDespesas)}</p>
                    </div>
                    <div class="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
                        <p class="text-sm text-slate-900 dark:text-slate-100 font-medium">Saldo do Período</p>
                        <p class="text-2xl font-bold ${saldoPeriodo >= 0 ? 'text-slate-900 dark:text-slate-100' : 'text-red-600 dark:text-red-400'}">
                            ${formatCurrency(saldoPeriodo)}
                        </p>
                    </div>
                </div>
            `;
            
            resultadosEl.innerHTML = resumoHtml + tabelaHtml;
            exportarPdfBtn.disabled = false;
            
            // Salvar dados para exportação
            dadosRelatorio = {
                transacoes,
                totalReceitas,
                totalDespesas,
                saldoPeriodo,
                dataInicio: dataInicioEl.value,
                dataFim: dataFimEl.value,
                categoria: catSelect.value,
                tipo: tipoSelect.value
            };
        };

        const exportarParaPDF = () => {
            if (!dadosRelatorio) return;
            
            const dataAtual = new Date().toLocaleDateString('pt-BR');
            const periodo = `${formatDate(dadosRelatorio.dataInicio)} até ${formatDate(dadosRelatorio.dataFim)}`;
            const tipoTexto = dadosRelatorio.tipo === 'TODAS' ? 'Todas as Transações' : 
                            dadosRelatorio.tipo === 'RECEITA' ? 'Apenas Receitas' : 'Apenas Despesas';
            
            let htmlContent = `
                <html>
                <head>
                    <title>Relatório Financeiro</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
                        .info { margin-bottom: 20px; }
                        .resumo { display: flex; justify-content: space-around; margin-bottom: 30px; }
                        .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; min-width: 150px; }
                        .receitas { border-color: #22c55e; background-color: #f0fdf4; }
                        .despesas { border-color: #ef4444; background-color: #fef2f2; }
                        .saldo { border-color: #3b82f6; background-color: #eff6ff; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f3f4f6; font-weight: bold; }
                        .valor-receita { color: #22c55e; font-weight: bold; }
                        .valor-despesa { color: #ef4444; font-weight: bold; }
                        .tag { background-color: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-size: 11px; margin-right: 4px; }
                        .status-pago { background-color: #22c55e; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; }
                        .status-pendente { background-color: #eab308; color: black; padding: 2px 8px; border-radius: 4px; font-size: 11px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>📊 Relatório Financeiro</h1>
                        <p><strong>Período:</strong> ${periodo}</p>
                        <p><strong>Tipo:</strong> ${tipoTexto}</p>
                        <p><strong>Categoria:</strong> ${dadosRelatorio.categoria === 'TODAS' ? 'Todas as Categorias' : dadosRelatorio.categoria}</p>
                        <p><strong>Gerado em:</strong> ${dataAtual}</p>
                    </div>
                    
                    <div class="resumo">
                        <div class="card receitas">
                            <h3>💰 Total Receitas</h3>
                            <p style="font-size: 24px; color: #22c55e; margin: 10px 0;">${formatCurrency(dadosRelatorio.totalReceitas)}</p>
                        </div>
                        <div class="card despesas">
                            <h3>💸 Total Despesas</h3>
                            <p style="font-size: 24px; color: #ef4444; margin: 10px 0;">${formatCurrency(dadosRelatorio.totalDespesas)}</p>
                        </div>
                        <div class="card saldo">
                            <h3>📈 Saldo do Período</h3>
                            <p style="font-size: 24px; color: ${dadosRelatorio.saldoPeriodo >= 0 ? '#22c55e' : '#ef4444'}; margin: 10px 0;">${formatCurrency(dadosRelatorio.saldoPeriodo)}</p>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Descrição</th>
                                <th>Categoria</th>
                                <th>Tags</th>
                                <th>Status</th>
                                <th style="text-align: right;">Valor</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            if (dadosRelatorio.transacoes.length === 0) {
                htmlContent += '<tr><td colspan="6" style="text-align: center; color: #666;">Nenhuma transação encontrada</td></tr>';
            } else {
                dadosRelatorio.transacoes.forEach(t => {
                    const eReceita = t.tipo === 'RECEITA';
                    const tagsText = t.tags ? 
                        t.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('') 
                        : '-';
                    const statusText = t.pago ? 
                        '<span class="status-pago">Pago</span>' : 
                        '<span class="status-pendente">Pendente</span>';
                    
                    htmlContent += `
                        <tr>
                            <td>${formatDate(t.data)}</td>
                            <td>${t.descricao}</td>
                            <td>${t.categoria}</td>
                            <td>${tagsText}</td>
                            <td>${statusText}</td>
                            <td style="text-align: right;" class="${eReceita ? 'valor-receita' : 'valor-despesa'}">
                                ${formatCurrency(t.valor)}
                            </td>
                        </tr>
                    `;
                });
            }
            
            htmlContent += `
                        </tbody>
                    </table>
                    
                    <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
                        <p>Relatório gerado automaticamente pelo Sistema de Controle Financeiro</p>
                    </div>
                </body>
                </html>
            `;
            
            // Abrir em nova janela para impressão/PDF
            const novaJanela = window.open('', '_blank');
            novaJanela.document.write(htmlContent);
            novaJanela.document.close();
            
            // Aguardar carregamento e imprimir
            setTimeout(() => {
                novaJanela.print();
            }, 500);
        };

        // Event listeners
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                resultadosEl.innerHTML = '<p class="text-slate-500 text-center">Gerando relatório...</p>';
                exportarPdfBtn.disabled = true;
                
                const dataInicio = dataInicioEl.value;
                const dataFim = dataFimEl.value;
                const categoria = catSelect.value;
                
                const transacoes = await transacaoService.gerarRelatorio(dataInicio, dataFim, categoria);
                renderizarResultados(transacoes);
            } catch (error) {
                console.error('Erro ao gerar relatório:', error);
                resultadosEl.innerHTML = '<p class="text-red-500 text-center">Erro ao gerar relatório.</p>';
                exportarPdfBtn.disabled = true;
            }
        });

        exportarPdfBtn.addEventListener('click', exportarParaPDF);

        // Configurar datas padrão (mês atual)
        const { firstDay, lastDay } = getMonthBounds();
        dataInicioEl.value = firstDay;
        dataFimEl.value = lastDay;
        
        // Carregar categorias e gerar relatório inicial
        await popularCategorias();
        form.dispatchEvent(new Event('submit'));
    }
};