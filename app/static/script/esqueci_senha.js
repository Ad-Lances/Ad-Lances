

const formularioRedefinir = document.getElementById('formulario-redefinir');
const mensagem = document.getElementById('mensagem');

formularioRedefinir.addEventListener('submit', async (event) => {
    event.preventDefault();
    let mensagem_erros = [];

    const redefinirSenha = document.getElementById('nova_senha_input').value.trim();
    const redefinirSenhaConfirmar = document.getElementById('confirmar_ns_input').value.trim();

    if ((!redefinirSenha) || (!redefinirSenhaConfirmar)){
        mensagem_erros.push('Por favor, preencha todos os campos');
    }

    if (redefinirSenha !== redefinirSenhaConfirmar) {
        mensagem_erros.push('As senhas não coincidem');
    }

    const erroSenha = verificar_senha(redefinirSenha);
    if (erroSenha){
        mensagem_erros.push(erroSenha);
    }


    if (mensagem_erros.length > 0) {
            let errosHTML = `
                <div style="
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 10px; 
                    margin-bottom: 16px; 
                    padding-bottom: 12px; 
                    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                    font-size: 16px;
                    color: #000000ff;
                ">
                    <i class="fa-solid fa-triangle-exclamation" style="color: #FF6B6B;"></i>
                    <strong>Corrija os seguintes erros:</strong>
                </div>
                <ul style="
                    list-style: none; 
                    padding: 0; 
                    margin: 0; 
                    text-align: left;
                ">
            `;

            mensagem_erros.forEach(erro => {
                errosHTML += `
                    <li style="
                        padding: 12px 16px;
                        margin: 8px 0;
                        background: rgba(255, 107, 107, 0.1);
                        border-radius: 8px;
                        border-left: 4px solid #FF6B6B;
                        border: 1px solid rgba(255, 107, 107, 0.3);
                        position: relative;
                        padding-left: 50px;
                        transition: all 0.2s ease;
                        font-size: 14px;
                        line-height: 1.4;
                        color: #262626;
                        background-color: #FFFFFF;
                    ">
                        <span style="
                            position: absolute;
                            left: 18px;
                            top: 50%;
                            transform: translateY(-50%);
                            color: #FF6B6B;
                            font-weight: bold;
                            font-size: 16px;
                            width: 24px;
                            height: 24px;
                            background: rgba(255, 107, 107, 0.1);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">!</span>
                        ${erro}
                    </li>`;
            });

            errosHTML += '</ul>';

            mensagem.innerHTML = errosHTML;
            mensagem.style.cssText = `
                color: #262626;
                background: #FFFFFF;
                border-radius: 12px;
                padding: 20px 24px;
                margin: 20px auto;
                text-align: center;
                font-weight: 500;
                font-size: 15px;
                box-shadow: 0 4px 20px rgba(255, 107, 107, 0.25);
                border: 2px solid #FF6B6B;
                width: fit-content;
                max-width: 90%;
                backdrop-filter: blur(10px);
                animation: slideIn 0.3s ease-out;
                position: relative;
                overflow: hidden;
            `;
            scrollerro();
            return;
        }
})