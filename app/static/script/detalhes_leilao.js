document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-lance');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const lanceInput = document.getElementById('novo-lance-input').value;
        const enviarLanceBtn = document.getElementById('botao-lance');
        const mensagem = document.getElementById('mensagem');
        const lancevalor = parseFloat(lanceInput);

        const resposta = await fetch(window.location.pathname + '/novolance', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({lance: lancevalor})
        });

        const resultado = await resposta.json();
        if (resultado.sucesso) {
            mensagem.innerHTML = resultado.sucesso;
        } else if (resultado.erro) {
            mensagem.innerHTML = resultado.erro;
        }
    });
});
