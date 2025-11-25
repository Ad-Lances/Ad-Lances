document.addEventListener("DOMContentLoaded", () => {
    const barra_pesquisa = document.getElementById("barra-pesquisa");
    const form_pesquisa = document.getElementById("form-pesquisa")
    if (form_pesquisa) {
    form_pesquisa.addEventListener("submit", async (e) => {
        e.preventDefault();
        const pesquisa = barra_pesquisa.value.trim();
        
        window.location.href = `/pesquisar?p=${encodeURIComponent(pesquisa)}`;        
    })
    }

})