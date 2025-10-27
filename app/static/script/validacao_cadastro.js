function verificar_idade(dataNasc){ 
    const dataNascObj = new Date(dataNasc);
    const anoDataNasc = dataNascObj.getFullYear();
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();

    let idade = anoAtual - anoDataNasc;

    if (idade < 18) {
        scrollerro();
        if (mensagem) {
            estilizarmensagem(mensagem);
            mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> Você deve ter mais de 18 anos para criar uma conta';
        }
        return false;
    } else {
        if (mensagem) mensagem.innerHTML = '';
        return true;
    }
}

function verificar_email(email){
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

function verificar_senha(senha){
    const maiuscula = /[A-Z]/.test(senha);
    const especiais = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);

   if(senha.length<6){
        scrollerro();
        estilizarmensagem();
        mensagem.innerHTML ='<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> A senha deve ter mais de 6 caracteres';
        return false;
   } else if (!especiais){
        scrollerro();
        estilizarmensagem();
        mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> A senha deve conter ao menos um caractere especial';
        return false;
   } else if(!maiuscula){
        scrollerro();
        estilizarmensagem();
        mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> A senha deve conter ao menos um caractere maiúsculo';
        return false;
   } 
        
   return true;
}

function verificar_campos(nome, estado, cidade, logradouro, cep, numeroCasa, email, senha, telefone_celular, tipopessoa, ccpf, ccnpj){
    if (!nome || !estado || !cidade || !logradouro || !cep || !numeroCasa || !email || !senha || !telefone_celular || !tipopessoa) {
        estilizarmensagem()
        mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> Por favor, preencha todos os campos obrigatórios'
        return false;
    }

    if (tipopessoa === 'Pessoa Física') {
        if (!ccpf) {
            scrollerro();
            estilizarmensagem();
            mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> O CPF é obrigatório para contas do tipo pessoa física';
            return false;
        }
    } else if (tipopessoa === 'Pessoa Jurídica') {
        if (!ccnpj) {
            scrollerro();
            estilizarmensagem();
            mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> O CNPJ é obrigatório para contas do tipo Pessoa Jurídica';
            return false;
        }
        if (!document.getElementById('nome-empresa').value.trim()) {
            scrollerro();
            estilizarmensagem();
            mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> Nome da Empresa é obrigatório para Pessoa Jurídica';
            return false;
        }
    } else {
        scrollerro();
        estilizarmensagem();
        mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> Por favor, preencha todos os campos obrigatórios';
        return false;
    }

    return true;
}
