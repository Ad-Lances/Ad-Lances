mensagem = document.getElementById('mensagem');

document.addEventListener('DOMContentLoaded', function() {
    adicionarToggleSenha();
});

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

function adicionarToggleSenha() {
    const senhaInputCadastro = document.getElementById('password');
    const confirmarSenhaInput = document.getElementById('confirmar-senha');
    
    const senhaInputLogin = document.getElementById('password');
    
    if (senhaInputCadastro && confirmarSenhaInput) {
        const senhaContainer = senhaInputCadastro.parentElement;
        const confirmarContainer = confirmarSenhaInput.parentElement;
        
        if (senhaContainer && !senhaContainer.querySelector('.toggle-password')) {
            senhaContainer.style.position = 'relative';
            adicionarBotaoToggle(senhaContainer, senhaInputCadastro);
        }
        
        if (confirmarContainer && !confirmarContainer.querySelector('.toggle-password')) {
            confirmarContainer.style.position = 'relative';
            adicionarBotaoToggle(confirmarContainer, confirmarSenhaInput);
        }
    }
    
    else if (senhaInputLogin && !confirmarSenhaInput) {
        const senhaContainer = senhaInputLogin.parentElement;
        
        if (senhaContainer && !senhaContainer.querySelector('.toggle-password')) {
            senhaContainer.style.position = 'relative';
            adicionarBotaoToggle(senhaContainer, senhaInputLogin);
        }
    }
}

function adicionarBotaoToggle(container, input) {
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'toggle-password';
    toggleBtn.innerHTML = '<i class="fa-solid fa-eye" style="color: #034660;"></i>';
    toggleBtn.setAttribute('aria-label', 'Mostrar senha');
    
    toggleBtn.addEventListener('click', function() {
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        
        toggleBtn.innerHTML = type === 'password' 
            ? '<i class="fa-solid fa-eye" style="color: #034660;"></i>' 
            : '<i class="fa-solid fa-eye-slash" style="color: #034660;"></i>';
            
        toggleBtn.setAttribute('aria-label', type === 'password' ? 'Mostrar senha' : 'Ocultar senha');
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
    const tipo = document.getElementById('tipo_pessoa').value;
    const campoCpf = document.getElementById('campoCpf');
    const campoCnpj = document.getElementById('campoCnpj');
    const campoEmpresa = document.getElementById('nomeEmpresa');
    const avisosjs = document.getElementById('avisojs');

    campoCpf.classList.add("hidden");
    campoCnpj.classList.add("hidden");
    campoEmpresa.classList.add("hidden");
    avisosjs.classList.add("hidden")

    if (tipo === "fisica") {
        campoCpf.classList.remove("hidden");
    } 
    else if (tipo === "juridica") {
        campoCnpj.classList.remove("hidden");
        campoEmpresa.classList.remove("hidden");
    }
}

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
                new Option('Carros', 'carros'),
                new Option('Motocicletas', 'motos'),
                new Option('Caminhões', 'caminhoes')
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
            new Option('Computadores', 'computadores'),
            new Option('Áudio e Vídeo', 'audio_e_video'),
            new Option('Videogames', 'videogames'),
            new Option('Componentes Eletrônicos', 'componentes_eletronicos')
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
            new Option('Cozinha', 'cozinha'),
            new Option('Limpeza', 'limpeza'),
            new Option('Eletroportáteis', 'eletroportateis')
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
            new Option('Sala de Estar', 'sala_de_estar'),
            new Option('Cozinha', 'cozinha'),
            new Option('Quarto', 'quarto'),
            new Option('Banheiro', 'banheiro'),
            new Option('Escritório', 'escritorio')
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
            new Option('Máquinas e Equipamentos Pesados', 'maquinas_pesados'),
            new Option('Materiais e Insumos Industriais', 'materiais_insumos'),
            new Option('Ferramentas e Equipamentos de Oficina', 'ferramentas_oficina'),
            new Option('Acessórios de Máquinas', 'acessorios_maquinas'),
            new Option('Automação, Robótica e Controle', 'automacao_robotica_controle')
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