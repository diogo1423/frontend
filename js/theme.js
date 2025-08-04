import { themeConfig } from './config.js';

// Configuração inicial do tema
export const setupTheme = () => {
    const savedTheme = localStorage.getItem(themeConfig.storageKey);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (savedTheme === null && prefersDark)) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
    }
};

// Atualiza ícones do tema
const updateThemeIcons = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    
    if (!darkIcon || !lightIcon) return;
    
    if (isDark) {
        lightIcon.classList.remove('hidden');
        darkIcon.classList.add('hidden');
    } else {
        darkIcon.classList.remove('hidden');
        lightIcon.classList.add('hidden');
    }
};

// Gerencia toggle do tema
export const handleThemeToggle = () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    // Remove listener anterior se existir
    themeToggleBtn.replaceWith(themeToggleBtn.cloneNode(true));
    const newButton = document.getElementById('theme-toggle');

    newButton.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            // Muda para claro
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
            localStorage.setItem(themeConfig.storageKey, 'light');
        } else {
            // Muda para escuro
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
            localStorage.setItem(themeConfig.storageKey, 'dark');
        }
        
        // Atualiza os ícones imediatamente
        updateThemeIcons();
    });

    // Configura os ícones iniciais
    updateThemeIcons();
};