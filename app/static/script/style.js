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

function exibirCampo(){
    const tipoDeConta = document.getElementById('tipo-de-conta');
    const campoCPF = document.getElementById('campoCpf');
    const campoCNPJ = document.getElementById('campoCnpj');
    const campoNomeEmpresa = document.getElementById('nomeEmpresa');
    
    if (tipoDeConta.value === 'Pessoa Física'){
        campoCNPJ.style.display = 'none';
        campoNomeEmpresa.style.display = 'none';
        campoCPF.style.display = 'block';
        campoCPF.style.width = '50%';
    } else if(tipoDeConta.value === 'Pessoa Jurídica'){
        campoCPF.style.display = 'none';
        campoCNPJ.style.display = 'block';
        campoNomeEmpresa.style.display = 'block';
        campoNomeEmpresa.style.width = '50%';
        campoCNPJ.style.width = '50%';
    } else{
        campoCPF.style.display = 'none';
        campoCNPJ.style.display = 'none';
        campoNomeEmpresa.style.display = 'none';
    }
}