document.addEventListener('DOMContentLoaded', function(){
    adicionarToggleSenha();

    const formularioLogin = document.getElementById('formularioLogin');
    const mensagem = document.getElementById('mensagem');
    
    
    formularioLogin.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('password').value.trim();

        const camposPreenchidos = verificar_email_senha(email, senha);
        if (!camposPreenchidos) {
            estilizarmensagem(mensagem);
            scrollerro();
            return;
        }
    
        const dados = {
            email: email,
            senha: senha
        }
    
        const resposta = await fetch('/logar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });
        const resultado = await resposta.json();
    
        if (resultado.sucesso) {
            estilizarMensagemSucesso(mensagem);
            mensagem.innerHTML = resultado.sucesso;
            setTimeout(() => {
               window.location.href = '/';
            }, 1500); 
        } else {
            scrollerro();
            estilizarmensagem(mensagem);
            mensagem.innerHTML = resultado.erro;
        }
        
});
})
