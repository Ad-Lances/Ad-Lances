document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-lance');
    const formEdicao = document.getElementById('form-editar-leilao');
    const enviarLanceBtn = document.getElementById('botao-lance');

    const cepInput = document.getElementById('input-editar-cep-leilao');
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            const cepNumeros = this.value.replace(/\D/g, '');
            if (cepNumeros.length === 8) {
                setTimeout(() => {
                    pesquisacep(this.value);
                }, 800);
            }
        });
        
        cepInput.addEventListener('blur', function() {
            const cepNumeros = this.value.replace(/\D/g, '');
            if (cepNumeros.length === 8) {
                pesquisacep(this.value);
            }
        });
        
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            if (value.length > 9) {
                value = value.substring(0, 9);
            }
            e.target.value = value;
        });
    }

    formEdicao.addEventListener('submit', async(event) =>{
        event.preventDefault();
        
        const cepErro = validarCEP();
        if (cepErro) {
            alert(cepErro);
            return;
        }
        
        const formData = new FormData(formEdicao);
        const dados = Object.fromEntries(formData);
        
        const resposta = await fetch(window.location.pathname + '/editar', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)
        });
        
        const resultado = await resposta.json();
        const mensagem = document.getElementById('mensagem');
        
        if (resultado.sucesso) {
            mensagem.innerHTML = resultado.sucesso;
            setTimeout(() => {
                mensagem.innerHTML = '';
                document.getElementById('campos-edicao').style.display = 'none';
            }, 3000);
        } else if (resultado.erro) {
            mensagem.innerHTML = resultado.erro;
        }
    });
    
    enviarLanceBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        enviarLanceBtn.disabled = true
        enviarLanceBtn.innerText = 'Lançando...'
        const lanceInput = document.getElementById('novo-lance-input');
        const mensagem = document.getElementById('mensagem');
        const lancevalor = parseFloat(lanceInput.value);
        
        if (lanceInput.value === '' || isNaN(lancevalor) || lancevalor <= 0) {
            mensagem.innerHTML = 'Por favor, insira um valor de lance válido.';
        } else {
            const resposta = await fetch(window.location.pathname + '/novolance', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({lance: lancevalor})
            });
            lanceInput.value = ''
            const resultado = await resposta.json();
            if (resultado.sucesso) {
                mensagem.innerHTML = resultado.sucesso;
                setTimeout(()=>{
                    mensagem.innerHTML = ''
                }, 3000)
            } else if (resultado.erro) {
                mensagem.innerHTML = resultado.erro;
            }
        }
        enviarLanceBtn.disabled = false
        enviarLanceBtn.innerText = 'Lançar'
    });
});

let cepErro = null;

function meu_callback(conteudo) {
    const logradouro = document.getElementById('input-editar-logradouro-leilao');
    const bairro = document.getElementById('input-editar-bairro-leilao');
    
    if (!("erro" in conteudo)) {
        if (logradouro) logradouro.value = conteudo.logradouro || "";
        if (bairro) bairro.value = conteudo.bairro || "";
        cepErro = null;
        const numeroLeilao = document.getElementById('input-editar-numero-leilao');
        if (numeroLeilao) {
            numeroLeilao.focus();
        }
    } else {
        limpa_formulario_cep();
        cepErro = 'CEP não encontrado. Verifique o número digitado.';
    }
    
    return cepErro;
}

function limpa_formulario_cep() {
    const logradouro = document.getElementById('input-editar-logradouro-leilao');
    const bairro = document.getElementById('input-editar-bairro-leilao');
    
    if (logradouro) logradouro.value = "";
    if (bairro) bairro.value = "";
}

function pesquisacep(valor) {
    var cep = valor.replace(/\D/g, '');
    cepErro = null;

    if (cep !== "" && cep.length === 8) {
        var validacep = /^[0-9]{8}$/;

        if (validacep.test(cep)) {
            const logradouro = document.getElementById('input-editar-logradouro-leilao');
            const bairro = document.getElementById('input-editar-bairro-leilao');
            
            if (logradouro) logradouro.value = "Buscando...";
            if (bairro) bairro.value = "Buscando...";

            var script = document.createElement('script');
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';
            document.body.appendChild(script);
        } else {
            cepErro = 'Formato de CEP inválido. Digite 8 números.';
        }
    } else if (cep !== "" && cep.length < 8) {
        cepErro = 'CEP incompleto. Digite os 8 números.';
    } else if (cep !== "" && cep.length > 8) {
        cepErro = 'CEP muito longo. Digite apenas 8 números.';
    }
    
    return cepErro;
}

function validarCEP() {
    const cepInput = document.getElementById('input-editar-cep-leilao');
    if (!cepInput) return null;
    
    const cep = cepInput.value.replace(/\D/g, '').trim();
    
    if (cep.length !== 8) {
        return 'CEP deve conter 8 números';
    }
    
    return cepErro;
}

const socketio = io.connect("https://ad-lances.onrender.com")
const lanceatual = document.getElementById('lance-atual')
const totallances = document.getElementById('total-lances')

socketio.on("novo_lance", (lance_atual, total_lances) => {
    const valor = Number(lance_atual);
    lanceatual.innerHTML = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    totallances.innerHTML = 'Total de lances: ' + total_lances
})