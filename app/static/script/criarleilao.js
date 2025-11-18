document.addEventListener('DOMContentLoaded', function(){
    // Inicializar upload de arquivos
    inicializarUploadArquivos();

    const imgProdutoInput = document.getElementById('img-produto-input');
    const nomeProdutoInput = document.getElementById('nome-produto-input');
    const lanceInicialInput = document.getElementById('lance-inicial-input');
    const descricaoProdutoInput = document.getElementById('descricao-produto-input');
    const categoriaProdutoInput = document.getElementById('categoria-produto-select');
    const subcategoriaProdutoInput = document.getElementById('subcategoria-produto-select');
    const dataInicioInput = document.getElementById('data-inicio-input');
    const dataFimInput = document.getElementById('data-fim-input');

    const pagamentoCartaoInput = document.getElementById('checkbox-cartao');
    const pagamentoPIXInput = document.getElementById('checkbox-pix');
    const pagamentoFGTSInput = document.getElementById('checkbox-fgts');
    const pagamentoFinanciamentoInput = document.getElementById('checkbox-financiamento');
    const parcelasPermitidasInput = document.getElementById('parcelas-permitidas-input');
    const formasPagamento = document.getElementById('checkboxes-pagamento');

    const UFLeilaoInput = document.getElementById('estado-leilao-input');
    const cidadeLeilaoInput = document.getElementById('cidade-leilao-input');
    const bairroLeilaoInput = document.getElementById('bairro-leilao-input')
    const CEPLeilaoInput = document.getElementById('cep-leilao-input');
    const ruaLeilaoInput = document.getElementById('rua-leilao-input');
    const numeroLeilaoInput = document.getElementById('numero-leilao-input');
    const complementoLeilaoInput = document.getElementById('complemento-leilao-input');
    const termosVeracidadeInput = document.getElementById('termo-veracidade');
    const termosCondicoesInput = document.getElementById('termo-condicoes');

    const formularioProduto = document.getElementById('form-produto');
    const mensagem = document.getElementById('mensagem');
    
    formularioProduto.addEventListener('submit', async(event) =>{
        event.preventDefault();
       
        let mensagem_erros = [];
        let forma_pagamento = [];

        const imgProduto = imgProdutoInput.files.length > 0 ? imgProdutoInput.files[0] : null;        
        const nomeProduto = nomeProdutoInput.value.trim();
        const lanceInicial = lanceInicialInput.value.trim();
        const descricaoProduto = descricaoProdutoInput.value.trim();
        const categoriaProduto = categoriaProdutoInput.value.trim();
        const subcategoriaProduto = subcategoriaProdutoInput.value.trim();
        const dataInicio = dataInicioInput.value.trim();
        const dataFim = dataFimInput.value.trim();

        const pagamentoCartao = pagamentoCartaoInput.checked;
        const pagamentoPIX = pagamentoPIXInput.checked;
        const pagamentoFGTS = pagamentoFGTSInput.checked;
        const pagamentoFinanciamento = pagamentoFinanciamentoInput.checked;
        const parcelasPermitidas = parcelasPermitidasInput.value.trim();

        const UFLeilao = UFLeilaoInput.value.trim();
        const cidadeLeilao = cidadeLeilaoInput.value.trim();
        const bairroLeilao = bairroLeilaoInput.value.trim();
        const CEPLeilao = CEPLeilaoInput.value.trim();
        const ruaLeilao = ruaLeilaoInput.value.trim();
        const numeroLeilao = numeroLeilaoInput.value.trim();
        const complementoLeilao = complementoLeilaoInput.value.trim();
        
        const termosVeracidade = termosVeracidadeInput.checked;
        const termosCondicoes = termosCondicoesInput.checked;
        console.log(ruaLeilao, numeroLeilao, termosVeracidade, termosCondicoes);
        const erroCamposLeilao = verificarCamposLeilao(
            imgProduto, nomeProduto, lanceInicial, descricaoProduto,
            categoriaProduto, subcategoriaProduto, dataInicio, dataFim, pagamentoCartao, pagamentoPIX, pagamentoFGTS,pagamentoFinanciamento, parcelasPermitidas,
            UFLeilao, cidadeLeilao, CEPLeilao, ruaLeilao, numeroLeilao,
            termosVeracidade, termosCondicoes
        );
        if (erroCamposLeilao){
            mensagem_erros.push(erroCamposLeilao);
        }

        if (pagamentoCartao) forma_pagamento.push("Cartão de crédito");
        if (pagamentoPIX) forma_pagamento.push("PIX");
        if (pagamentoFGTS) forma_pagamento.push("FGTS");
        if (pagamentoFinanciamento) forma_pagamento.push("Financiamento");

        if (forma_pagamento.length === 0){
            mensagem_erros.push("Selecione ao menos uma forma de pagamento");
        }


        const erroLanceInicial = verificarLanceInicial(lanceInicial)
        if(erroLanceInicial){
            mensagem_erros.push(erroLanceInicial);
        }

        const erroCategoriaLeilao = verificarCategoria(categoriaProduto, subcategoriaProduto)
        if(erroCategoriaLeilao){
            mensagem_erros.push(erroCategoriaLeilao);
        }

        const datasValidas = verificarDatas(dataInicio, dataFim, mensagem)
        if (datasValidas){
            mensagem_erros.push(datasValidas);
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

        const formData = new FormData()
        formData.append("nome", nomeProduto)
        formData.append("descricao", descricaoProduto)
        formData.append("categoria", categoriaProduto)
        formData.append("id_subcategoria", subcategoriaProduto)
        formData.append("data_inicio", dataInicio)
        formData.append("data_fim", dataFim)
        formData.append("lance_inicial", lanceInicial)
        formData.append("min_incremento", min_incremento)
        formData.append("pagamento", forma_pagamento)
        formData.append("parcelas", parcelasPermitidas)
        formData.append("foto", imgProduto)
        formData.append("cep", CEPLeilao)
        formData.append("uf", UFLeilao)
        formData.append("cidade", cidadeLeilao)
        formData.append("bairro", bairroLeilao)
        formData.append("logradouro", ruaLeilao)
        formData.append("numero_morada", numeroLeilao)
        formData.append("complemento", complementoLeilao)

        const resposta = await fetch('/criarleilao', {
            method: 'POST',
            body: formData
        })
        const resultado = await resposta.json()
        if (resultado.sucesso){
            mensagem.innerHTML = resultado.sucesso;
            scrollerro();
            setTimeout(() => {
                window.location.href = '/'
            }, 2000);
        } else {
            mensagem.innerHTML = resultado.erro;
            scrollerro();
        }
    })
})