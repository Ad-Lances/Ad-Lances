document.addEventListener("DOMContentLoaded", () => {
    const botaoTema = document.getElementById("btntema");
    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "dark") {
        document.body.classList.add("tema-escuro");
    }

    botaoTema.addEventListener("click", () => {

        const modoEscuroAtivo = document.body.classList.toggle("tema-escuro");

        // Salvar preferência
        if (modoEscuroAtivo) {
            localStorage.setItem("tema", "dark");
        } else {
            localStorage.setItem("tema", "light");
        }
    });
});
