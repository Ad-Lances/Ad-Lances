document.addEventListener('DOMContentLoaded', function(){
    adicionarToggleSenha();
    exibirCampo();

    const formularioCadastro = document.getElementById('formularioCadastro');
    const nomeInput = document.getElementById('nome');
    const cpf = document.getElementById('cpf');
    const cnpj = document.getElementById('cnpj');
    const tipo_pessoa = document.getElementById('tipo-de-conta');
    const datanascInput = document.getElementById('datanasc');

    const estadoInput = document.getElementById('estado');
    const cidadeInput = document.getElementById('cidade');
    const logradouroInput = document.getElementById('logradouro');
    const cepInput = document.getElementById('cep');
    const numeroCasaInput = document.getElementById('numero_casa');
    const complementoInput = document.getElementById('complemento');

    const telefoneCelInput = document.getElementById('telefone_celular');
    const telefoneResInput = document.getElementById('telefone_residencial');
    const emailCadastroInput = document.getElementById('email');
    const senhaCadastroInput = document.getElementById('password');
    const confirmar_senhaInput = document.getElementById('confirmar-senha');

    const mensagem = document.getElementById('mensagem');
    if (mensagem) mensagem.innerHTML = '';

    formularioCadastro.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = nomeInput.value.trim();
        const estado = estadoInput.value.trim();
        const cidade = cidadeInput.value.trim();
        const logradouro = logradouroInput.value.trim();
        const cep = cepInput.value.trim();
        const numeroCasa = numeroCasaInput.value.trim();
        const complemento = complementoInput.value.trim();
        const telefone_celular = telefoneCelInput.value.trim();
        const telefone_residencial = telefoneResInput.value.trim();

        const emailCadastro = emailCadastroInput.value.trim();
        const senhaCadastro = senhaCadastroInput.value.trim();
        const confirmarSenha = confirmar_senhaInput.value.trim();
        const ccpf = cpf.value.trim();
        const ccnpj = cnpj.value.trim();
        const tipopessoa = tipo_pessoa.value.trim();
        const data_nasc = datanascInput.value.trim();

        const camposPreenchidos = verificar_campos(nome, estado, cidade, logradouro, cep, numeroCasa, emailCadastro, senhaCadastro, telefone_celular, tipopessoa, ccpf, ccnpj);
        if (!camposPreenchidos) {
            estilizarmensagem(mensagem);
            scrollerro();
            return;
        }

        const idadeValida = verificar_idade(data_nasc);
        if(!idadeValida) return;

        const emailValido = verificar_email(emailCadastro);
        if(!emailValido){
            scrollerro();
            estilizarmensagem(mensagem);
            mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> Insira um email válido';
            return;
        }

        const senhaValida = verificar_senha(senhaCadastro);
        if(!senhaValida){
            scrollerro();
            estilizarmensagem(mensagem);
        } else if (senhaCadastro !== confirmarSenha) {
            scrollerro();
            estilizarmensagem(mensagem);
            mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> As senhas não coincidem';
            return;
        }

        if (emailValido && senhaValida && idadeValida && camposPreenchidos){
            const dados = {
                nome: nome,
                unid_federativa: estado,
                cidade: cidade,
                rua: logradouro,
                cep: cep,
                numero_casa: numeroCasa,
                complemento: complemento,
                email: emailCadastro,
                senha: senhaCadastro,
                telefone: telefoneCelInput,
                telefone_res: telefoneResInput,
                cpf: ccpf,
                cnpj: ccnpj,
                tipo_pessoa: tipopessoa,
                datanasc: data_nasc
            }

            const resposta = await fetch('/cadastrar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            })
            const resultado = await resposta.json();

            if (resultado.sucesso) {
                mensagem.innerHTML = resultado.sucesso;
                mensagem.style.color = 'green';
                scrollerro();
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            } else {
                estilizarmensagem(mensagem);
                mensagem.innerHTML = resultado.erro;
                scrollerro();
            }
        }
    })
})


