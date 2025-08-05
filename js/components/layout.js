// Layout principal da aplicação
export const MainLayout = (pageContent) => `
    <div class="flex h-screen bg-slate-100 dark:bg-slate-900">
        <!-- Sidebar -->
        <aside class="w-64 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
            <div class="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
                <h1 class="text-xl font-bold text-indigo-600 dark:text-indigo-400">💰 Financeiro</h1>
            </div>
            <nav class="flex-1 px-4 py-4 space-y-2">
                <a href="#/dashboard" class="flex items-center px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                    📊 Dashboard
                </a>
                <a href="#/lancamentos" class="flex items-center px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                    💸 Lançamentos
                </a>
                <a href="#/categorias" class="flex items-center px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                    📁 Categorias
                </a>
                <a href="#/relatorios" class="flex items-center px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors">
                    📈 Relatórios
                </a>
            </nav>
            <div class="px-4 py-4 border-t border-slate-200 dark:border-slate-700">
                <button id="logout-btn" class="w-full flex items-center justify-center px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md">
                    🚪 Sair
                </button>
            </div>
        </aside>
        
        <!-- Main Content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <!-- Header -->
            <header class="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-end px-6">
                <button id="theme-toggle" class="p-2 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300" title="Alternar tema">
                    <!-- Ícone do Sol (Tema Claro) -->
                    <svg id="theme-toggle-dark-icon" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
                    </svg>
                    <!-- Ícone da Lua (Tema Escuro) -->
                    <svg id="theme-toggle-light-icon" class="w-6 h-6 hidden" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </header>
            
            <!-- Page Content -->
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-6">
                ${pageContent}
            </main>
        </div>
    </div>
`;