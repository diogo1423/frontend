form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nome = document.getElementById('reg-nome').value;
            const email = document.getElementById('reg-email').value;
            const telefone = document.getElementById('reg-telefone').value;
            const username = document.getElementById('reg-usuario').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            const aceitarTermos = document.getElementById('aceitar-termos').checked;
            
            // ... (as validações de senha e termos continuam aqui)
            if (password !== confirmPassword) {
                alert('As senhas não coincidem');
                return;
            }
            if (password.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres');
                return;
            }
            if (!aceitarTermos) {
                alert('Você deve aceitar os termos de uso');
                return;
            }
            
            const dadosCadastro = {
                nome,
                email,
                telefone,
                username,
                password
            };
            
            try {
                const response = await fetch(`${config.API_URL}/auth/registrar`, {
                    method: 'POST',
                    body: JSON.stringify(dadosCadastro),
                    headers: { 'Content-Type': 'application/json' }
                });
                
                // Tenta ler a resposta como JSON, independentemente do status
                const data = await response.json();
                
                if (response.ok) {
                    alert(data.message || 'Cadastro realizado com sucesso! Verifique seu e--mail.');
                    window.location.hash = '#/login';
                } else {
                    // SE A RESPOSTA NÃO FOR OK, IMPRIME O ERRO DETALHADO NO CONSOLE
                    console.error("DEBUG: Resposta completa de erro do servidor:", data);
                    
                    // Tenta encontrar uma mensagem de erro mais específica
                    let errorMessage = data.message || "Erro desconhecido no cadastro.";
                    if (data.errors && Array.isArray(data.errors)) {
                        errorMessage = data.errors.map(err => err.defaultMessage).join(', ');
                    }

                    throw new Error(errorMessage);
                }
            } catch (error) {
                console.error('Erro ao cadastrar:', error);
                alert(`Erro: ${error.message}`);
            }
        });