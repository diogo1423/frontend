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

// Força atualização do tema
export const forceThemeUpdate = () => {
    const isDark = document.documentElement.classList.contains('dark');
    
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    
    // Força um reflow
    document.body.offsetHeight;
    
    if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
    }
    
    // Atualiza transições
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
        el.style.transition = 'all 0.3s ease';
    });
};

// Atualiza ícones do tema
const updateThemeIcons = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    
    if (!darkIcon || !lightIcon) return;
    
    if (isDark) {
        lightIcon.style.display = 'block';
        lightIcon.style.opacity = '1';
        lightIcon.classList.remove('hidden');
        
        darkIcon.style.display = 'none';
        darkIcon.style.opacity = '0';
        darkIcon.classList.add('hidden');
    } else {
        darkIcon.style.display = 'block';
        darkIcon.style.opacity = '1';
        darkIcon.classList.remove('hidden');
        
        lightIcon.style.display = 'none';
        lightIcon.style.opacity = '0';
        lightIcon.classList.add('hidden');
    }
};

// Gerencia toggle do tema
export const handleThemeToggle = () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const newButton = themeToggleBtn.cloneNode(true);
    themeToggleBtn.parentNode.replaceChild(newButton, themeToggleBtn);

    newButton.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('dark');
            localStorage.setItem(themeConfig.storageKey, 'light');
        } else {
            document.documentElement.classList.add('dark');
            document.body.classList.add('dark');
            localStorage.setItem(themeConfig.storageKey, 'dark');
        }
        
        forceThemeUpdate();
        
        setTimeout(() => {
            updateThemeIcons();
            // Re-renderiza a página para aplicar as mudanças
            import('./router.js').then(module => {
                module.router();
            });
        }, 100);
    });

    updateThemeIcons();
};