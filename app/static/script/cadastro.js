document.addEventListener('DOMContentLoaded', function () {
    adicionarToggleSenha();
    exibirCampo();
    

    const formularioCadastro = document.getElementById('formularioCadastro');
    const nomeInput = document.getElementById('nome');
    const cpf = document.getElementById('cpf');
    const cnpj = document.getElementById('cnpj');
    const nome_empresa = document.getElementById("nome-empresa");
    const tipo_pessoa = document.getElementById('tipo-de-conta');
    const datanascInput = document.getElementById('datanasc');

    const estadoInput = document.getElementById('estado');
    const cidadeInput = document.getElementById('cidade');
    const logradouroInput = document.getElementById('logradouro');
    const cepInput = document.getElementById('cep');
    const bairroInput = document.getElementById('bairro');

    const numeroCasaInput = document.getElementById('numero_casa');
    const complementoInput = document.getElementById('complemento');

    const telefoneCelInput = document.getElementById('telefone_celular');
    const telefoneResInput = document.getElementById('telefone_residencial');
    const emailCadastroInput = document.getElementById('email');
    const senhaCadastroInput = document.getElementById('senha');
    const confirmar_senhaInput = document.getElementById('confirmar-senha');

    const mensagem = document.getElementById('mensagem');
    const erroNome = document.getElementById('erro-nome');

    const camposObrigatorios = [nomeInput, estadoInput, cidadeInput, logradouroInput, cepInput, bairroInput,
    numeroCasaInput, emailCadastroInput, senhaCadastroInput, confirmar_senhaInput,
    telefoneCelInput, cpf, cnpj, datanascInput, tipo_pessoa];

    camposObrigatorios.forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                validar_input(this);
            });
        }
    });


    
    formularioCadastro.addEventListener('submit', async (event) => {
        event.preventDefault();

        let mensagem_erros = [];


        const cep = cepInput.value.replace(/\D/g, '').trim();
        const emailCadastro = emailCadastroInput.value.trim();
        const senhaCadastro = senhaCadastroInput.value.trim();
        const confirmarSenha = confirmar_senhaInput.value.trim();
        const data_nasc = datanascInput.value.trim(); 

        const erroCEP = validarCEP();
        if (erroCEP) {
            console.log(erroCEP);
            mensagem_erros.push(erroCEP);
        }

        const erroIdade = verificar_idade(data_nasc);
        if (erroIdade) {
            console.log(erroIdade);
            mensagem_erros.push(erroIdade);
        }

        const erroEmail = verificar_email(emailCadastro);
        if (erroEmail) {
            console.log(erroEmail)
            mensagem_erros.push(erroEmail);
        }

        const erroSenha = verificar_senha(senhaCadastro);
        if (erroSenha) {
            console.log(erroSenha);
            mensagem_erros.push(erroSenha);
        } else if (senhaCadastro !== confirmarSenha) {
            mensagem_erros.push('As senhas não coincidem');
        }

        if (mensagem_erros.length > 0) {
            let errosHTML = `
                <div style="
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 10px; 
                    margin-bottom: 16px; 
                    padding-bottom: 12px; 
                    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                    font-size: 16px;
                    color: var(--cor-texto);
                ">
                    <i class="fa-solid fa-triangle-exclamation" style="color: #FF6B6B;"></i>
                    <strong>Corrija os seguintes erros:</strong>
                </div>
                <ul style="
                    list-style: none; 
                    padding: 0; 
                    margin: 0; 
                    text-align: left;
                ">
            `;

            mensagem_erros.forEach(erro => {
                errosHTML += `
                    <li style="
                        padding: 12px 16px;
                        margin: 8px 0;
                        background: var(--cor-card);
                        border-radius: 8px;
                        border-left: 4px solid #FF6B6B;
                        border: 1px solid rgba(255, 107, 107, 0.3);
                        position: relative;
                        padding-left: 50px;
                        transition: all 0.2s ease;
                        font-size: 14px;
                        line-height: 1.4;
                        color: var(--cor-texto);
                        background-color: var(--cor-borda);
                    ">
                        <span style="
                            position: absolute;
                            left: 18px;
                            top: 50%;
                            transform: translateY(-50%);
                            color: #FF6B6B;
                            font-weight: bold;
                            font-size: 16px;
                            width: 24px;
                            height: 24px;
                            background: var(--cor-card);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">!</span>
                        ${erro}
                    </li>`;
            });

            errosHTML += '</ul>';

            mensagem.innerHTML = errosHTML;
            mensagem.style.cssText = `
                color: var(--cor-texto);
                background: var(--cor-card);
                border-radius: 12px;
                padding: 20px 24px;
                margin: 20px auto;
                text-align: center;
                font-weight: 500;
                font-size: 15px;
                box-shadow: 0 4px 20px rgba(255, 107, 107, 0.25);
                border: 2px solid #FF6B6B;
                width: fit-content;
                max-width: 90%;
                backdrop-filter: blur(10px);
                animation: slideIn 0.3s ease-out;
                position: relative;
                overflow: hidden;
            `;
            scrollerro();
            return;
        }

        const dados = {
            nome: nomeInput.value,
            unid_federativa: estadoInput.value,
            cidade: cidadeInput.value,
            rua: logradouroInput.value,
            bairro: bairroInput.value,
            cep: cep,
            numero_casa: numeroCasaInput.value,
            complemento: complemento,
            email: emailCadastro,
            senha: senhaCadastro,
            telefone: telefoneCelInput.value.trim(),
            ...(telefoneResInput.value.trim() && { telefone_res: telefoneResInput.value.trim() }),
            ...(cpf && { cpf: cpf.value.replace(".", "").replace("-", "").replace(".", "") }),
            ...(cnpj && { cnpj: cnpj.value }),
            ...(nomeEmpresa && { nome_empresa: nomeEmpresa }),
            tipo_pessoa: tipo_pessoa.value,
            datanasc: data_nasc
        };

        const resposta = await fetch('/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {
            estilizarMensagemSucesso();
            mensagem.innerHTML = resultado.sucesso;
            scrollerro();
            setTimeout(() => {
               window.location.href = '/';
            }, 1500); 
        } else {
            scrollerro();
            estilizarmensagem(mensagem);
            mensagem.innerHTML = resultado.erro;
        }
    });
});
