function validarEmail(email) {
    const dominiosPermitidos = ["gmail.com", "hotmail.com", "ig.com"];
    const partesEmail = email.split('@');
    
    if (partesEmail.length !== 2) {
        return false;
    }
    
    const dominio = partesEmail[1].toLowerCase();
    return dominiosPermitidos.includes(dominio);
}

function validarSenha(senha) {
    const caracteresEspeciais = ['@', '#', '_'];
    let temMaiuscula = false;
    let temEspecial = false;

for (let i = 0; i < senha.length; i++) {
    const caractere = senha[i];
        
    if (caractere >= 'A' && caractere <= 'Z') {
        temMaiuscula = true;
    }

    if (caracteresEspeciais.includes(caractere)) {
        temEspecial = true;
    }
}
    
    return senha.length >= 6 && temMaiuscula && temEspecial;
}


function calcularIdade(dataNascimento) {
    if (!dataNascimento) return 0;
    
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    
    return idade;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - script.js funcionando!');
    
    const form = document.querySelector('#formulario form');
    const mensagem = document.getElementById('mensagem');
    let usuarios = [];

    if (!form) {
        console.error('Formulário não encontrado!');
        return;
    }

    if (!mensagem) {
        console.error('Elemento de mensagem não encontrado!');
        return;
    }

form.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Formulário submetido!');
    
    let isValid = true;
    mensagem.innerHTML = '';
    mensagem.style.color = 'red';
    const nome = document.getElementById('nome').value.trim();
    const dataNasc = document.getElementById('datanasc').value;
    const cpf = document.querySelector('input[name="cpf"]').value.trim();
    const estado = document.getElementById('estado').value;
    const cidade = document.querySelector('input[name="cidade"]').value.trim();
    const emailInput = document.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value.trim() : '';
    const senha = document.querySelector('input[name="password"]').value;
    console.log('Valores capturados:', {nome, dataNasc, email, senha});

        if (!nome) {
            mensagem.innerHTML += 'Nome completo é obrigatório.<br>';
            isValid = false;
        }

        if (!dataNasc) {
            mensagem.innerHTML += 'Data de nascimento é obrigatória.<br>';
            isValid = false;
        } else if (calcularIdade(dataNasc) < 18) {
            mensagem.innerHTML += 'Você deve ser maior de 18 anos.<br>';
            isValid = false;
        }

        if (!cpf) {
            mensagem.innerHTML += 'CPF é obrigatório.<br>';
            isValid = false;
        }

        if (estado === 'Selecione um estado') {
            mensagem.innerHTML += 'Selecione um estado.<br>';
            isValid = false;
        }

        if (!cidade) {
            mensagem.innerHTML += 'Cidade é obrigatória.<br>';
            isValid = false;
        }

        if (!email) {
            mensagem.innerHTML += 'Email é obrigatório.<br>';
            isValid = false;
        } else if (!validarEmail(email)) {
            mensagem.innerHTML += 'Email deve ser @gmail.com, @hotmail.com ou @ig.com.<br>';
            isValid = false;
        }

        if (!senha) {
            mensagem.innerHTML += 'Senha é obrigatória.<br>';
            isValid = false;
        } else if (!validarSenha(senha)) {
            mensagem.innerHTML += 'Senha deve ter: mínimo 6 caracteres, 1 maiúscula, 1 caractere especial (@, #, _).<br>';
            isValid = false;
        }

        if (isValid) {
            const usuario = {
                nome: nome,
                dataNasc: dataNasc,
                cpf: cpf,
                estado: estado,
                cidade: cidade,
                email: email,
                senha: senha
            };
            
            usuarios.push(usuario);
            mensagem.style.color = 'green';
            mensagem.innerHTML = 'Cadastro realizado com sucesso!';
            form.reset();
            
            console.log('Usuários cadastrados:', usuarios);
        }
    });
});

const slides = document.querySelectorAll("#carrossel img");
const prevBtn = document.querySelector("#carrossel .prev");
const nextBtn = document.querySelector("#carrossel .next");
let index = 0;
let interval;

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
}

function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
}

function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
}

function startAutoSlide() {
    interval = setInterval(nextSlide, 4000);
}

function stopAutoSlide() {
    clearInterval(interval);
}

prevBtn.addEventListener("click", () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
});

nextBtn.addEventListener("click", () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
});

showSlide(index);
    startAutoSlide();