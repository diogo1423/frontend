import { authFetch } from './api.js';
import { config } from '../config.js';

export const categoriaService = {
    // Listar todas as categorias
    listar: async () => {
        const response = await authFetch(`${config.API_URL}/categorias`);
        return response.json();
    },

    // Listar categorias por tipo
    listarPorTipo: async (tipo) => {
        const response = await authFetch(`${config.API_URL}/categorias?tipo=${tipo}`);
        return response.json();
    },

    // Criar nova categoria
    criar: async (dados) => {
        const response = await authFetch(`${config.API_URL}/categorias`, {
            method: 'POST',
            body: JSON.stringify(dados)
        });
        return response.json();
    }
};