import { verificar_email, verificar_senha } from '.script/validacao_cadastro.js';
import { estilizarmensagem } from '.script/style.js';

document.addEventListener('DOMContentLoaded', function(){

    const inputNovoNome = document.getElementById('input-nome');
    const inputNovoEmail = document.getElementById('input-email');
    const inputNovoTelefone = document.getElementById('input-telefone');
    const inputNovoCEP = document.getElementById('input-cep');
    const inputNovaRua = document.getElementById('input-rua');
    const inputNovoNumero = document.getElementById('input-numero');
    const inputNovaSenha = document.getElementById('input-nova-senha');
    const btnSair = document.getElementById('btn-sair');
    const btnSalvar = document.getElementById('btn-salvar');
    const mensagem = document.getElementById('mensagem');

    btnSair.addEventListener('click', async() => {
        const resposta = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resultado = await resposta.json();
        if (resultado.sucesso) {
            mensagem.innerHTML = resultado.sucesso;
            estilizarmensagem(mensagem);
            setTimeout(() => {
                window.location.href = '/';
            }, 5000);   
        } else {
            mensagem.innerHTML = resultado.erro;
            estilizarmensagem(mensagem);
        }
    });

    btnSalvar.addEventListener('click', function(){
        const novoNome = inputNovoNome.value.trim();
        const novoEmail = inputNovoEmail.value.trim();
        const novoTelefone = inputNovoTelefone.value.trim();
        const novoCEP = inputNovoCEP.value.trim();
        const novaRua = inputNovaRua.value.trim();
        const novoNumero = inputNovoNumero.value.trim();
        const novaSenha = inputNovaSenha.value.trim();

        const novoEmailValido = verificar_email(novoEmail)
        if(!novoEmailValido){
            estilizarmensagem(mensagem);
            return false;
        }

        const novaSenhaValida = verificar_senha(novaSenha);
        if(!novaSenhaValida){
            estilizarmensagem(mensagem);
            return false;
        }

        if (novoEmailValido && novaSenhaValida){
            
        }
    })
})