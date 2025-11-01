function verificarCamposLeilao(img_produto_input, nome_produto_input, lance_inicial, descricao_produto, categoria_produto, subcategoria_produto, data_inicio, data_fim, pagamentoCartao, pagamentoPIX, pagamentoFGTS, pagamentoFinanciamento, parcelas, uf_leilao, cidade_leilao, cep_leilao, rua_leilao, numero_leilao, termo_veracidade, termos_condicoes, mensagem){
    const temFormaPagamento = pagamentoCartao || pagamentoPIX || pagamentoFGTS || pagamentoFinanciamento;

    if(!img_produto_input || img_produto_input.trim() === '' || 
    !nome_produto_input || nome_produto_input.trim() === ''||
    !lance_inicial || lance_inicial.trim() === '' ||
    !descricao_produto || descricao_produto.trim() === '' ||
    !categoria_produto || categoria_produto.trim() === '' ||
    !subcategoria_produto || subcategoria_produto.trim() === '' ||
    !data_inicio || data_inicio.trim() === '' ||
    !data_fim || data_fim.trim() === '' ||
    !temFormaPagamento ||
    !parcelas || parcelas.trim() === '' ||
    !uf_leilao || uf_leilao.trim() === '' || uf_leilao === 'Selecione um estado' ||
    !cidade_leilao || cidade_leilao.trim() === ''|| 
    !cep_leilao || cep_leilao.trim() === '' ||
    !rua_leilao || rua_leilao.trim() === '' ||
    !numero_leilao || numero_leilao.trim() === '' ||
    !termo_veracidade || !termos_condicoes){
        mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> Por favor, preencha todos os campos obrigatórios';
        return false;
    }
}

function verificarLanceInicial(lance_inicial, mensagem){
    const lance = parseFloat(lance_inicial)
    if(lance<0.00){
        mensagem.innerHTML = 'Insira um lance inicial válido';
        return false;
    }
    
    return true;
}

function verificarCategoria(categoria_produto, subcategoria_produto, mensagem){
    if(categoria_produto === 'none' || subcategoria_produto === 'none'){
        mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i>Insira a categoria/subcategoria do produto';
        return false;
    }

    return true;
}

function verificarDatas(data_inicio, data_fim, mensagem){
    const data_inicioObj = new Date(data_inicio);
    const data_fimObj = new Date(data_fim);
    
    const diferenca = data_fimObj.getTime() - data_inicioObj.getTime();

    if(diferenca <= 0){
        mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i>Insira datas de início e fim válidas';
        return false;
    }

    return true;
}