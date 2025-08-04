import { authFetch } from './api.js';
import { config } from '../config.js';

export const transacaoService = {
    // Criar nova transação
    criar: async (dados) => {
        const response = await authFetch(`${config.API_URL}/transacoes`, {
            method: 'POST',
            body: JSON.stringify(dados)
        });
        return response.json();
    },

    // Listar transações por mês
    listarPorMes: async (ano, mes) => {
        const response = await authFetch(`${config.API_URL}/transacoes?ano=${ano}&mes=${mes}`);
        return response.json();
    },

    // Buscar transação por ID
    buscarPorId: async (id) => {
        const response = await authFetch(`${config.API_URL}/transacoes/${id}`);
        return response.json();
    },

    // Atualizar transação
    atualizar: async (id, dados) => {
        const response = await authFetch(`${config.API_URL}/transacoes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        });
        return response.json();
    },

    // Marcar como paga
    marcarComoPaga: async (id) => {
        const response = await authFetch(`${config.API_URL}/transacoes/${id}/pagar`, {
            method: 'PUT'
        });
        return response.json();
    },

    // Desmarcar como paga
    desmarcarComoPaga: async (id) => {
        const response = await authFetch(`${config.API_URL}/transacoes/${id}/desmarcar-pago`, {
            method: 'PUT'
        });
        return response.json();
    },

    // Obter saldo
    obterSaldo: async () => {
        const response = await authFetch(`${config.API_URL}/transacoes/saldo`);
        return response.json();
    },

    // Obter estatísticas do dashboard
    obterEstatisticas: async () => {
        const response = await authFetch(`${config.API_URL}/transacoes/dashboard-stats`);
        return response.json();
    },

    // Obter gastos por categoria
    obterGastosPorCategoria: async () => {
        const response = await authFetch(`${config.API_URL}/transacoes/gastos-por-categoria`);
        return response.json();
    },

    // Gerar relatório
    gerarRelatorio: async (dataInicio, dataFim, categoria) => {
        const response = await authFetch(
            `${config.API_URL}/relatorios/transacoes?dataInicio=${dataInicio}&dataFim=${dataFim}&categoria=${categoria}`
        );
        return response.json();
    }
};