function verificar_email_senha(email, senha){
    if((!email) || (!senha)){
        scrollerro();
        estilizarmensagem();
        mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> Por favor, preencha todos os campos obrigatórios'
        return false
    }

    return true;
}

function verificar_email(email){
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}