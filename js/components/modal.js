import { authFetch } from '../services/api.js';
import { config } from '../config.js';

// Modal de edição de transação
export const openEditModal = async (id, onSaveCallback) => {
    const modalContainer = document.getElementById('modal-container');
    
    try {
        const response = await authFetch(`${config.API_URL}/transacoes/${id}`);
        const transacao = await response.json();

        modalContainer.innerHTML = `
            <div id="modal-backdrop" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg w-full max-w-md">
                    <h2 class="text-2xl font-bold mb-4">Editar Lançamento</h2>
                    <form id="form-edit-lancamento" class="space-y-4">
                        <div>
                            <label for="edit-desc" class="block text-sm font-medium">Descrição</label>
                            <input type="text" id="edit-desc" required 
                                class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" 
                                value="${transacao.descricao}">
                        </div>
                        <div>
                            <label for="edit-val" class="block text-sm font-medium">Valor (R$)</label>
                            <input type="number" id="edit-val" step="0.01" required 
                                class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" 
                                value="${transacao.valor}">
                        </div>
                        <div>
                            <label for="edit-cat" class="block text-sm font-medium">Categoria</label>
                            <select id="edit-cat" required 
                                class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                            </select>
                        </div>
                        <div>
                            <label for="edit-dat" class="block text-sm font-medium">Data</label>
                            <input type="date" id="edit-dat" required 
                                class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" 
                                value="${transacao.data}">
                        </div>
                        <div>
                            <label for="edit-tags" class="block text-sm font-medium">Tags (opcional)</label>
                            <input type="text" id="edit-tags" 
                                placeholder="trabalho, urgente, mensal..." 
                                class="input-style mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                                value="${transacao.tags || ''}">
                            <p class="text-xs text-slate-500 mt-1">Separe as tags com vírgula</p>
                        </div>
                        <div class="flex gap-4">
                            <button type="submit" 
                                class="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                                Salvar
                            </button>
                            <button type="button" id="cancel-edit" 
                                class="w-full bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // Carregar categorias
        const catSelect = document.getElementById('edit-cat');
        const catResponse = await authFetch(`${config.API_URL}/categorias?tipo=${transacao.tipo}`);
        const categorias = await catResponse.json();
        
        categorias.forEach(c => {
            const icone = c.icone || '📁';
            catSelect.innerHTML += `<option value="${c.nome}" ${c.nome === transacao.categoria ? 'selected' : ''}>${icone} ${c.nome}</option>`;
        });

        // Event listeners
        document.getElementById('form-edit-lancamento').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const updatedLancamento = {
                    descricao: document.getElementById('edit-desc').value,
                    valor: parseFloat(document.getElementById('edit-val').value),
                    categoria: document.getElementById('edit-cat').value,
                    data: document.getElementById('edit-dat').value,
                    tipo: transacao.tipo,
                    tags: document.getElementById('edit-tags').value || null
                };
                
                await authFetch(`${config.API_URL}/transacoes/${id}`, { 
                    method: 'PUT', 
                    body: JSON.stringify(updatedLancamento) 
                });
                
                modalContainer.innerHTML = '';
                if (onSaveCallback) await onSaveCallback();
            } catch (error) {
                console.error('Erro ao salvar edição:', error);
                alert('Erro ao salvar alterações');
            }
        });

        document.getElementById('cancel-edit').addEventListener('click', () => {
            modalContainer.innerHTML = '';
        });
        
        document.getElementById('modal-backdrop').addEventListener('click', (e) => {
            if (e.target.id === 'modal-backdrop') {
                modalContainer.innerHTML = '';
            }
        });
        
    } catch (error) {
        console.error('Erro ao abrir modal:', error);
        alert('Erro ao carregar dados para edição');
    }
};