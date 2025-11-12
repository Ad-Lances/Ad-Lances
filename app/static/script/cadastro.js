document.addEventListener('DOMContentLoaded', function () {
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
    const bairroInput = document.getElementById('bairro');

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

        let mensagem_erros = [];

        const nome = nomeInput.value.trim();
        const estado = estadoInput.value.trim();
        const cidade = cidadeInput.value.trim();
        const logradouro = logradouroInput.value.trim();
        const cep = cepInput.value.replace(/\D/g, '').trim();
        const numeroCasa = numeroCasaInput.value.trim();
        const complemento = complementoInput.value.trim();
        const bairro = bairroInput.value.trim();
        const telefone_celular = telefoneCelInput.value.replace(/\D/g, '').trim();
        const telefone_residencial = telefoneResInput.value.replace(/\D/g, '').trim();
        const emailCadastro = emailCadastroInput.value.trim();
        const senhaCadastro = senhaCadastroInput.value.trim();
        const confirmarSenha = confirmar_senhaInput.value.trim();
        const ccpf = cpf.value.replace(/\D/g, '').trim();
        const ccnpj = cnpj.value.replace(/\D/g, '').trim();
        const tipopessoa = tipo_pessoa.value.trim();
        const data_nasc = datanascInput.value.trim();

        const erroCampos = verificar_campos(
            nome, estado, cidade, logradouro, cep, bairro,
            numeroCasa, emailCadastro, senhaCadastro,
            telefone_celular, tipopessoa, ccpf, ccnpj
        );
        if (erroCampos) {
            mensagem_erros.push(erroCampos);
        }

        const erroCEP = validarCEP();
        if (erroCEP) {
            mensagem_erros.push(erroCEP);
        }

        const erroIdade = verificar_idade(data_nasc);
        if (erroIdade) {
            mensagem_erros.push(erroIdade);
        }

        const erroEmail = verificar_email(emailCadastro);
        if (erroEmail) {
            mensagem_erros.push(erroEmail);
        }

        const erroSenha = verificar_senha(senhaCadastro);
        if (erroSenha) {
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
                    color: #000000ff;
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
                        background: rgba(255, 107, 107, 0.1);
                        border-radius: 8px;
                        border-left: 4px solid #FF6B6B;
                        border: 1px solid rgba(255, 107, 107, 0.3);
                        position: relative;
                        padding-left: 50px;
                        transition: all 0.2s ease;
                        font-size: 14px;
                        line-height: 1.4;
                        color: #262626;
                        background-color: #FFFFFF;
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
                            background: rgba(255, 107, 107, 0.1);
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
                color: #262626;
                background: #FFFFFF;
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
            nome: nome,
            unid_federativa: estado,
            cidade: cidade,
            rua: logradouro,
            bairro: bairro,
            cep: cep,
            numero_casa: numeroCasa,
            complemento: complemento,
            email: emailCadastro,
            senha: senhaCadastro,
            telefone: telefoneCelInput.value.trim(),
            telefone_res: telefoneResInput.value.trim(),
            cpf: ccpf,
            cnpj: ccnpj,
            tipo_pessoa: tipopessoa,
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
    });
});
