function verificar_email_senha(email, senha){
    if((!email) || (!senha)){
        return 'Por favor, preencha todos os campos obrigatórios';
    }

    return null;
}

function verificar_email(email){
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if(regex.test(email) === false){
        return 'Insira um e-mail válido';
    }

    return null;
}

document.addEventListener('DOMContentLoaded', function(){
    adicionarToggleSenha();

    const formularioLogin = document.getElementById('formularioLogin');
    const mensagem = document.getElementById('mensagem');
    
    if (formularioLogin) {
    formularioLogin.addEventListener('submit', async (event) => {
        event.preventDefault();

        let mensagem_erros = []
    
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('password').value.trim();

        const erroCampos = verificar_email_senha(email, senha);
        if (erroCampos) {
            mensagem_erros.push(erroCampos);
        }

        const erroEmail = verificar_email(email);
        if(erroEmail){
            mensagem_erros.push(erroEmail);
        }

        estilizar_mensagem(mensagem_erros);
    
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
        const textoBruto = await resposta.text();


        let resultado = {};
        try {
            resultado = JSON.parse(textoBruto);
        } catch (e) {
            console.error("DEU ERRO AO PARSEAR JSON:", e);
            mensagem.innerHTML = "Erro inesperado. Tente novamente.";
            return;
        }
        if (resultado.sucesso) {
            estilizarMensagemSucesso();
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
    }
})
