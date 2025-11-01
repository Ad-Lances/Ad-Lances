document.addEventListener('DOMContentLoaded', function(){
    estilizarmensagem();

    const formularioProduto = document.getElementById('form-produto');
    const mensagem = document.getElementById('mensagem');

    formularioProduto.addEventListener('submit', async(event)=>{
        event.preventDefault();

        const imgProduto = document.getElementById('img-produto-input').value;
        const nomeProduto = document.getElementById('nome-produto-input').value;
        const lanceInicial = document.getElementById('lance-inicial-input').value;
        const descricaoProduto = document.getElementById('descricao-produto-input').value;
        const categoriaProduto = document.getElementById('categoria-produto-select').value;
        const subcategoriaProduto = document.getElementById('subcategoria-produto-select').value;
        const dataInicio = document.getElementById('data-inicio-input').value;
        const dataFim = document.getElementById('data-fim-input').value;

        const pagamentoCartao = document.getElementById('checkbox-cartao').checked;
        const pagamentoPIX = document.getElementById('checkbox-pix').checked;
        const pagamentoFGTS = document.getElementById('checkbox-fgts').checked;
        const pagamentoFinanciamento = document.getElementById('checkbox-financiamento').checked;
        const parcelasPermitidas = document.getElementById('parcelas-permitidas-input').value;

        const UFLeilao = document.getElementById('estado-leilao-select').value;
        const cidadeLeilao = document.getElementById('cidade-leilao-input').value;
        const CEPLeilao = document.getElementById('cep-leilao-input').value;
        const ruaLeilao = document.getElementById('rua-leilao-input').value;
        const numeroLeilao = document.getElementById('numero-leilao-input').value;
        const complementoLeilao = document.getElementById('complemento-leilao-input').value;

        const termosVeracidade = document.getElementById('termo-veracidade').checked;
        const termosCondicoes = document.getElementById('termo-condicoes').checked;

        const camposPreenchidos = verificarCamposLeilao(imgProduto, nomeProduto, lanceInicial, descricaoProduto, categoriaProduto, subcategoriaProduto, dataInicio, dataFim, pagamentoCartao, pagamentoFGTS, pagamentoFinanciamento, pagamentoPIX, parcelasPermitidas, UFLeilao, cidadeLeilao, CEPLeilao, ruaLeilao, numeroLeilao, complementoLeilao, termosCondicoes, termosVeracidade, mensagem);
            if (!camposPreenchidos){
                estilizarmensagem(mensagem);
                scrollerro();
                mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> Por favor, preencha todos os campos obrigatórios';
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
    })
})