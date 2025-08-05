// DENTRO DO after_render, ENCONTRE O 'form.addEventListener('submit', ...)' E SUBSTITUA-O POR ISTO:

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Captura todos os dados do formulário
    const nome = document.getElementById('reg-nome').value;
    const email = document.getElementById('reg-email').value;
    const telefone = document.getElementById('reg-telefone').value;
    const username = document.getElementById('reg-usuario').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const aceitarTermos = document.getElementById('aceitar-termos').checked;
    
    // Validações (já existentes no seu código, mantidas aqui)
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
    
    // Objeto com todos os dados para enviar ao backend
    const dadosCadastro = {
        nome,
        email,
        telefone,
        username,
        password
    };
    
    try {
        // A URL da API já vem do seu config.js
        const response = await fetch(`${config.API_URL}/auth/registrar`, {
            method: 'POST',
            body: JSON.stringify(dadosCadastro), // Envia o objeto completo
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(data.message || 'Cadastro realizado com sucesso! Verifique seu e-mail.');
            window.location.hash = '#/login';
        } else {
            // Mostra a mensagem de erro específica vinda do backend
            throw new Error(data.message || 'Erro ao cadastrar');
        }
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        alert(error.message);
    }
	//
});