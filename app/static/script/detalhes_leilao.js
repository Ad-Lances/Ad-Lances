document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-lance');
    const enviarLanceBtn = document.getElementById('botao-lance');
    
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

const socketio = io.connect("https://ad-lances.onrender.com")
const lanceatual = document.getElementById('lance-atual')
const totallances = document.getElementById('total-lances')

socketio.on("novo_lance", (lance_atual, total_lances) => {
    const valor = Number(lance_atual);
    lanceatual.innerHTML = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    totallances.innerHTML = 'Total de lances: ' + total_lances
})
