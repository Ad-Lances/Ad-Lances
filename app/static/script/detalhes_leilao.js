document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-lance');
    const formEdicao = document.getElementById('form-editar-leilao');
    const enviarLanceBtn = document.getElementById('botao-lance');
    const encerrarBtn = document.getElementById('botao-encerrar-leilao')
    const mensagem = document.getElementById('mensagem');
    const cepInput = document.getElementById('input-editar-cep-leilao');
    const lanceInput = document.getElementById('novo-lance-input');
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

    if (formEdicao){
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
    }
    
    if (encerrarBtn) {
    encerrarBtn.addEventListener("click", async () => {
        const resposta = await fetch(window.location.pathname + '/encerrar_leilao')
        const resultado = await resposta.json();
        if (resultado.sucesso) {
            mensagem.innerHTML = resultado.sucesso;
        } else {
            mensagem.innerHTML = 'Erro no banco de dados.';
        }
    })}

    enviarLanceBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        enviarLanceBtn.disabled = true
        enviarLanceBtn.innerText = 'Lançando...'
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

const socketio = io.connect("/")
const lanceatual = document.getElementById('lance-atual')
const totallances = document.getElementById('total-lances')
const temp = document.getElementById('temp')
socketio.on("novo_lance", (lance_atual, total_lances) => {
    const valor = Number(lance_atual);
    lanceatual.innerHTML = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    totallances.innerHTML = 'Total de lances: ' + total_lances
})

let horaapi = null;
let ultsinc = null;
const data_fim = new Date(document.getElementById('temporizador').dataset.fim)
const temporizador = document.getElementById('temporizador')
async function sincron() {
    const resposta = await fetch('/api/horas');
    const resultado = await resposta.json();
    horaapi = new Date(resultado.horas);
    ultsinc = new Date();
}
sincron();
function getHora() {
    if (!horaapi) return null;
    const horapc = Date.now();
    const timestamp = horapc - ultsinc
    return new Date(horaapi.getTime() + timestamp)
}
function temporiz() {
    const exactum = getHora()
    if (!exactum) return;
    const diff = data_fim - exactum;
    if (diff <= 0) {
        temporizador.innerText = 'Leilão encerrado.';
        return;
    }
    const s = Math.floor(diff / 1000) % 60;
    const m = Math.floor(diff / 1000 / 60) % 60;
    const h = Math.floor(diff / 1000 / 60 / 60) % 24;
    const d = Math.floor(diff / 1000 / 60 / 60 / 24);
    temp.innerHTML = `${d}d ${h}h ${m}m ${s}s`;
    
}
setInterval(temporiz, 1000);
setInterval(sincron, 300000);