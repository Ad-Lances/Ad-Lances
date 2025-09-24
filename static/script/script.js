const formulario = document.getElementById('formulario');
const nomeInput = document.getElementById('nome');
const dataNascInput = document.getElementById('datanasc');
const estadoInput = document.getElementById('estado');
const cidadeInput = document.getElementById('cidade');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('password');
let mensagem = document.getElementById('mensagem');

function verificar_idade(){
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear;
    let datanasc = dataNascInput.value;

    let idade = anoAtual-datanasc;

    if (idade<18){
        mensagem.style.color = 'Red';
        mensagem.innerHTML = 'Você deve ter mais de 18 anos para se cadastrar';
    }
}

function verificar_email(){
    let email = mensagemInput.value;

    if(!email.includes('@gmail.com') && !email.includes('@hotmail.com') && !email.includes('@yahoo.com')){
        mensagem.style.color = 'Red';
        mensagem.innerHTML = 'Por favor, insira um e-mail válido';
        return false;
    }
    return true;
}

function verificar_senha(){
    let senha = senhaInput.value;
    let temMaiuscula = false;
    let temCaractere = false;
    
    for(let i=0; i < senha.length(); i++){
        const caractere = senha[i];

        if(caractere>='A' && caractere <= 'Z'){
            temMaiuscula = true;
        }

        if (!caractere.includes('#') && !caractere.includes('_') && caractere.includes('#')){
            temCaractere = false;
        }

        if(temMaiuscula === true && temCaractere === true && senha.length >=6){
            return true
        } else{
            mensagem.style.color = 'Red';
            mensagem.innerHTML = 'A senha deve ter mais de 6 caracteres e incluir uma letra maiúscula, uma minúscula e um caractere especial';
            return false;
        }
    }
}
formulario.addEventListener('submit', function(event){
    event.preventDefault();
    verificar_email();
    verificar_idade();
    verificar_senha();
})