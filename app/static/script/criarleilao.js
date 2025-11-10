document.addEventListener('DOMContentLoaded', function(){
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

    const UFLeilaoInput = document.getElementById('estado-leilao-select');
    const cidadeLeilaoInput = document.getElementById('cidade-leilao-input');
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
        const CEPLeilao = CEPLeilaoInput.value.trim();
        const ruaLeilao = ruaLeilaoInput.value.trim();
        const numeroLeilao = numeroLeilaoInput.value.trim();
        const complementoLeilao = complementoLeilaoInput.value.trim();

        const termosVeracidade = termosVeracidadeInput.checked;
        const termosCondicoes = termosCondicoesInput.checked;

        const camposPreenchidos = verificarCamposLeilao(
        imgProduto, nomeProduto, lanceInicial, descricaoProduto, 
        categoriaProduto, subcategoriaProduto, dataInicio, dataFim, 
        pagamentoCartao, pagamentoPIX, pagamentoFGTS, pagamentoFinanciamento, parcelasPermitidas, 
        UFLeilao, cidadeLeilao, CEPLeilao, ruaLeilao, numeroLeilao, 
        termosVeracidade, termosCondicoes
        );
            if (!camposPreenchidos){
                mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> Por favor, preencha todos os campos obrigatórios';
                estilizarmensagem(mensagem);
                scrollerro();
                return;
            }

        const lanceInicialValido = verificarLanceInicial(lanceInicial, mensagem)
            if(!lanceInicialValido){
                estilizarmensagem(mensagem);
                scrollerro();
                return;
            }

        const categoriaValida = verificarCategoria(categoriaProduto, subcategoriaProduto, mensagem)
            if(!categoriaValida){
                estilizarmensagem(mensagem);
                scrollerro();
                return;
            }

        const datasValidas = verificarDatas(dataInicio, dataFim, mensagem)
            if (!datasValidas){
                estilizarmensagem(mensagem);
                scrollerro();
                return;
            }

        const formData = new FormData()
        formData.append("nome", nomeProduto)
        formData.append("descricao", descricaoProduto)
        formData.append("categoria", categoriaProduto)
        formData.append("subcategoria", subcategoriaProduto)
        formData.append("data_inicio", dataInicio)
        formData.append("data_fim", dataFim)
        formData.append("lance_inicial", lanceInicial)
        formData.append("pagamento", pagamentoCartao)
        formData.append("parcelas", parcelasPermitidas)
        formData.append("foto", imgProduto)

        const resposta = await fetch('/criarleilao', {
            method: 'POST',
            body: formData
        }
        )
        const resultado = await resposta.json()

    })
})