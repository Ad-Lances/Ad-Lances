mensagem = document.getElementById('mensagem');

function estilizarmensagem(mensagem){
    if (!mensagem) {
        console.error('Elemento mensagem não encontrado!');
        return;
    }
    
    mensagem.style.cssText = `
            color: #ffffff;
            background: #d65050ff;
            border-radius: 12px;
            padding: 16px 24px;
            margin: 20px auto;
            text-align: center;
            font-weight: 500;
            font-size: 15px;
            box-shadow: 0 4px 15px rgba(194, 74, 74, 0.3);
            border: 1px solid #b84545;
            width: fit-content;
            max-width: 90%;
            backdrop-filter: blur(10px);
            animation: slideIn 0.3s ease-out;
            position: relative;
            overflow: hidden;
        `;
}

function estilizarMensagemSucesso(){
    mensagem.style.cssText = `
            color: #ffffff;
            background: #75cc52ff;
            border-radius: 12px;
            padding: 16px 24px;
            margin: 20px auto;
            text-align: center;
            font-weight: 500;
            font-size: 15px;
            box-shadow: 0 4px 15px rgba(121, 250, 125, 0.3);
            border: 1px solid #014006ff;
            width: fit-content;
            max-width: 90%;
            backdrop-filter: blur(10px);
            animation: slideIn 0.3s ease-out;
            position: relative;
            overflow: hidden;
        `;
}

function estilizar_mensagem(mensagem_erros){
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
}
function adicionarToggleSenha() {
    // IDs de todos os campos de senha possíveis
    const camposSenha = [
        'password',
        'senha',          
        'confirmar-senha',    // Cadastro
        'nova_senha_input',   // Redefinir Senha
        'confirmar_ns_input'  // Redefinir Senha
    ];
    
    camposSenha.forEach(id => {
        const input = document.getElementById(id);
        if (input && input.type === 'password') {
            const container = input.parentElement;
            
            // Verificar se já existe toggle button
            if (container && !container.querySelector('.toggle-password')) {
                container.style.position = 'relative';
                adicionarBotaoToggle(container, input);
            }
        }
    });
}

function adicionarBotaoToggle(container, input) {
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'toggle-password';
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
    toggleBtn.setAttribute('aria-label', 'Mostrar senha');
    
    toggleBtn.addEventListener('click', function() {
        if (input.type === 'password') {
            input.type = 'text';
            toggleBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
            toggleBtn.setAttribute('aria-label', 'Ocultar senha');
        } else {
            input.type = 'password';
            toggleBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
            toggleBtn.setAttribute('aria-label', 'Mostrar senha');
        }
    });
    
    container.appendChild(toggleBtn);
}


function scrollerro(){
    if (mensagem) {
        mensagem.scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
        });
    } else {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


function exibirCampo() {
    const tipo = document.getElementById('tipo-de-conta').value;
    const campoCpf = document.getElementById('campoCpf');
    const campoCnpj = document.getElementById('campoCnpj');
    const campoEmpresa = document.getElementById('nomeEmpresa');
    const avisosjs = document.getElementById('avisojs');

    avisosjs.classList.add("hidden")

    if (tipo === "Pessoa Física") {
        campoCpf.style.display = 'block';
        campoCnpj.style.display = 'none';
    } 
    else if (tipo === "Pessoa Jurídica") {
        campoCnpj.style.display = 'block';
        campoEmpresa.style.display = 'block';
        campoCpf.style.display = 'none';
    } else{
        campoCpf.style.display = 'none';
        campoCnpj.style.display = 'none';
        campoEmpresa.style.display = 'none';
    }
}

// função para aplicar o formato nos campos
document.addEventListener('DOMContentLoaded', () => {
    function aplicarMascara(input, tipo) {
        let valor = input.value.replace(/\D/g, '');

        switch (tipo) {
            case 'cpf':
                valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
                valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
                valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                break;

            case 'cnpj':
                valor = valor.replace(/^(\d{2})(\d)/, '$1.$2');
                valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
                valor = valor.replace(/\.(\d{3})(\d)/, '.$1/$2');
                valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
                break;

            case 'cep':
                valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
                break;

            case 'celular':
                valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
                valor = valor.replace(/(\d{5})(\d{4})$/, '$1-$2');
                break;

            case 'residencial':
                valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
                valor = valor.replace(/(\d{4})(\d{4})$/, '$1-$2');
                break;
        }

        input.value = valor;
    }

    // Ativa automaticamente as máscaras com base no atributo data-mask
    document.querySelectorAll('[data-mask]').forEach(input => {
        input.addEventListener('input', () => {
            aplicarMascara(input, input.dataset.mask);
        });
    });
});



// função de exibirsubcategorias na página de criar leilão
function exibirCampoSubcategorias(){
    const subcategoriaCampo = document.getElementById('subcategoria-produto');
    const categoriaSelect = document.getElementById('categoria-produto-select');
    const subcategoriaSelect = document.getElementById('subcategoria-produto-select');

    if(categoriaSelect.value === '1'){
        subcategoriaSelect.length = 0;

        const options = [
            new Option('Selecione', 'block'),
            new Option('Casas', '1'),
            new Option('Apartamentos', '2'),
            new Option('Salas comerciais', '3'),
            new Option('Industriais e Galpões', '4'),
            new Option('Terrenos', '5')
        ];

        options.forEach(option => {
            subcategoriaSelect.add(option);
        });

        subcategoriaCampo.style.display = 'block';
        subcategoriaSelect.style.display = 'block';

    } else if(categoriaSelect.value === '2'){
        subcategoriaSelect.length = 0;

        const options = [
                new Option('Selecione', 'block'),
                new Option('Carros', '6'),
                new Option('Motocicletas', '7'),
                new Option('Caminhões', '8')
            ];

            options.forEach(option => {
                subcategoriaSelect.add(option);
            });

            subcategoriaCampo.style.display = 'block';
            subcategoriaSelect.style.display = 'block';

    } else if(categoriaSelect.value === '3'){
        subcategoriaSelect.length = 0;

        const options = [
            new Option('Selecione', 'block'),
            new Option('Computadores', '9'),
            new Option('Áudio e Vídeo', '10'),
            new Option('Videogames', '11'),
            new Option('Componentes Eletrônicos', '12')
        ];

        options.forEach(option => {
            subcategoriaSelect.add(option)
        });

        subcategoriaCampo.style.display = 'block';
        subcategoriaSelect.style.display = 'block';

    } else if(categoriaSelect.value === '4'){
        subcategoriaSelect.length = 0;

        const options = [
            new Option('Selecione', 'block'),
            new Option('Cozinha', '13'),
            new Option('Limpeza', '14'),
            new Option('Eletroportáteis', '15')
        ];

        options.forEach(option => {
            subcategoriaSelect.add(option);
        });

        subcategoriaCampo.style.display = 'block';
        subcategoriaSelect.style.display = 'block';

    } else if(categoriaSelect.value === '5'){
        subcategoriaSelect.length = 0;

        const options = [
            new Option('Selecione', 'block'),
            new Option('Sala de Estar', '16'),
            new Option('Cozinha', '17'),
            new Option('Quarto', '18'),
            new Option('Banheiro', '19'),
            new Option('Escritório', '20')
        ];

        options.forEach(option =>{
            subcategoriaSelect.add(option);
        });

        subcategoriaCampo.style.display = 'block';
        subcategoriaSelect.style.display = 'block';

    } else if(categoriaSelect.value === '6'){
        subcategoriaSelect.length = 0;

        const options = [
            new Option('Selecione', 'block'),
            new Option('Máquinas e Equipamentos Pesados', '21'),
            new Option('Materiais e Insumos Industriais', '22'),
            new Option('Ferramentas e Equipamentos de Oficina', '23'),
            new Option('Acessórios de Máquinas', '24'),
            new Option('Automação, Robótica e Controle', '25')
        ];

        options.forEach(option =>{
            subcategoriaSelect.add(option)
        });

        subcategoriaCampo.style.display = 'block';
        subcategoriaSelect.style.display = 'block';
    } else{
        subcategoriaCampo.style.display = 'block';
        subcategoriaSelect.style.display = 'block';
    }
}

// Função de exibir os campos para editar dados na página de perfil
function exibirCampoDados(){
    const editarBotao = document.getElementById('btn-editar');

    const spanNome = document.getElementById('nome-completo');
    const spanEmail = document.getElementById('email');
    const spanTelefone = document.getElementById('telefone');
    const spanEndereco = document.getElementById('endereco');
    const dadoSenha = document.getElementById('dado-senha');

    const inputNovoNome = document.getElementById('input-nome');
    const inputNovoEmail = document.getElementById('input-email');
    const inputNovoTelefone = document.getElementById('input-telefone');
    const inputNovoCEP = document.getElementById('input-cep');
    const inputNovaRua = document.getElementById('input-rua');
    const inputNovoNumero = document.getElementById('input-numero');
    const inputNovaSenha = document.getElementById('input-nova-senha');
    const divBotoes = document.getElementById('botoes-salvar');
    const btnCancelar = document.getElementById('btn-cancelar');

    editarBotao.addEventListener('click', function(){
        divBotoes.style.display = 'flex';
        spanNome.style.display = 'block';
        spanEmail.style.display = 'block';
        spanTelefone.style.display = 'block';
        spanEndereco.style.display = 'block';

        dadoSenha.style.display = 'flex';
        inputNovoNome.style.display = 'block';
        inputNovoEmail.style.display = 'block';
        inputNovoTelefone.style.display = 'block';
        inputNovoCEP.style.display = 'block';
        inputNovaRua.style.display = 'block';
        inputNovoNumero.style.display = 'block';
        inputNovaSenha.style.display = 'block';

        const novaSenhaInput = document.createElement('input');
        novaSenhaInput.type = 'password';
        novaSenhaInput.style.cssText = `
        font-size: 0.95em;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: white;
        width: 100%;
        text-align: left;
        max-width: 250px;`;
    })

    btnCancelar.addEventListener('click', function(){
        spanNome.style.display = 'block';
        spanEmail.style.display = 'block';
        spanTelefone.style.display = 'block';
        spanEndereco.style.display = 'block';

        dadoSenha.style.display = 'none';
        inputNovoNome.style.display = 'none';
        inputNovoEmail.style.display = 'none';
        inputNovoTelefone.style.display = 'none';
        inputNovoCEP.style.display = 'none';
        inputNovaRua.style.display = 'none';
        inputNovoNumero.style.display = 'none';
        inputNovaSenha.style.display = 'none';
        divBotoes.style.display = 'none';
    })
}

// função para exibir os campos de editar leilão na página de detalhes
function exibir_campos_edicao(){
    const editarLeilaoBotao = document.getElementById('botao-editar-leilao');
    const camposParaEditar = document.getElementById('campos-edicao');
    const botaoCancelarEdicao = document.getElementById('btn-cancelar');

    editarLeilaoBotao.addEventListener('click', function(){
            camposParaEditar.style.display = 'flex';
    })

    botaoCancelarEdicao.addEventListener('click', function(){
        camposParaEditar.style.display = 'none';
    })
}

function esconder_campos_edicao(){
    
}
