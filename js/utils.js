import { config } from './config.js';

// Formata valores monetários
export const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return value.toLocaleString(config.DATE_FORMAT, { 
        style: 'currency', 
        currency: config.CURRENCY 
    });
};

// Formata datas
export const formatDate = (date, options = {}) => {
    return new Date(date).toLocaleDateString(config.DATE_FORMAT, {
        timeZone: config.TIMEZONE,
        ...options
    });
};

// Obtém o primeiro e último dia do mês
export const getMonthBounds = (date = new Date()) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    return {
        firstDay: firstDay.toISOString().split('T')[0],
        lastDay: lastDay.toISOString().split('T')[0]
    };
};

// Debounce para otimizar buscas
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};