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
let captchavisible = false;
let btnCaptcha = null;
function mostrarCaptcha() {
    if (!captchavisible) {
        captchavisible = true;
        document.getElementById("captcha-area").style.display = "block";
        btnCaptcha = grecaptcha.render("g-recaptcha", {
            sitekey: "6LfyOxYsAAAAAJnowmln6KG34CtnAooeHKMbDcsY"
        })
    }
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
        if (captchavisible) {
            const g_recaptcha = grecaptcha.getResponse();
            if (!g_recaptcha) {
                mensagem.innerHTML = "Faça o captcha.";
                return;
            }
            dados.captcha = g_recaptcha   
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
            grecaptcha.reset();
            captchavisible = false;
            document.getElementById('captcha-area').style.display = "none";
            setTimeout(() => {
               window.location.href = '/';
            }, 1500); 
        } 
        if (resultado.erro === "Faça o captcha.") {
            mensagem.innerHTML = resultado.erro
            mostrarCaptcha()
            return;
        }
        
});
    }
})
