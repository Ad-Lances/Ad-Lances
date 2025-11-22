document.addEventListener("DOMContentLoaded", () => {
    const barra_pesquisa = document.getElementById("barra-pesquisa");
    const leiloes = document.getElementById("leiloes");

    function carregar(lista) {
        leiloes.innerHTML = "";
        
        if (lista.length === 0) {
            leiloes.innerHTML = "<h2>Nenhum leilão encontrado.</h2>";
            return;
        }
        lista.forEach(leilao => {
            const div = document.createElement("div");
            div.textContent = `${leilao.nome} - ${leilao.descricao}`;
            leiloes.appendChild(div)
        });
    }
    if (barra_pesquisa) {
    barra_pesquisa.addEventListener("input", async (e) => {
        e.preventDefault();
        const pesquisa = barra_pesquisa.value.trim();
        if (pesquisa === "") {
            leiloes.innerHTML = "";
            return;
        }
        
        const resposta = await fetch(`/pesquisar?p=${encodeURIComponent(pesquisa)}`);
        const resultado = await resposta.json();
        carregar(resultado)
        
    })
    }

})