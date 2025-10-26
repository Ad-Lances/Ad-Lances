const form = document.getElementById('form');
const mensagem = document.getElementById('mensagem');

function inicializarToggleSenha() {
    const toggleBtn = document.querySelector('.toggle-password');
    const senhaInput = document.getElementById('password');
    
    if (toggleBtn && senhaInput) {
        toggleBtn.addEventListener('click', function() {
            const type = senhaInput.type === 'password' ? 'text' : 'password';
            senhaInput.type = type;
            
            const icon = toggleBtn.querySelector('i');
            icon.className = type === 'password' 
                ? 'fa-solid fa-eye' 
                : 'fa-solid fa-eye-slash';
                
            toggleBtn.setAttribute('aria-label', type === 'password' ? 'Mostrar senha' : 'Ocultar senha');
        });
    }
}

document.addEventListener('DOMContentLoaded', inicializarToggleSenha);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('password').value.trim();

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
    const resultado = await resposta.json();

    if (resultado.sucesso) {
        mensagem.innerHTML = resultado.sucesso;
        mensagem.style.color = 'green';
        setTimeout(() => {
            window.location.href = '/';
        }, 1500); 
    } else {
        mensagem.innerHTML = resultado.erro;
        mensagem.style.color = 'red';
    }
    
});