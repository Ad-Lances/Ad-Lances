function verificarCamposLeilao(img_produto, nome_produto, lance_inicial, descricao_produto, categoria_produto, subcategoria_produto,
    data_inicio, data_fim,
    pagamentoCartao, pagamentoPIX, pagamentoFGTS, pagamentoFinanciamento, parcelas,
    uf_leilao, cidade_leilao, cep_leilao, rua_leilao, numero_leilao,
    termo_veracidade, termos_condicoes){
   
    const temFormaPagamento = pagamentoCartao || pagamentoPIX || pagamentoFGTS || pagamentoFinanciamento;


    if(!img_produto ||
       !nome_produto || nome_produto.trim() === '' ||
       !lance_inicial || lance_inicial.trim() === '' ||
       !descricao_produto || descricao_produto.trim() === '' ||
       !categoria_produto || categoria_produto === 'none' ||
       !subcategoria_produto || subcategoria_produto === 'none' ||
       !data_inicio || data_inicio.trim() === '' ||
       !data_fim || data_fim.trim() === '' ||
       !temFormaPagamento ||
       !parcelas || parcelas === 'none' ||
       !uf_leilao.trim() === "" ||
       !cidade_leilao || cidade_leilao.trim() === ''||
       !cep_leilao || cep_leilao.trim() === '' ||
       !rua_leilao || rua_leilao.trim() === '' ||
       !numero_leilao || numero_leilao.trim() === '' ||
       !termo_veracidade || !termos_condicoes){
        return 'Preencha todos os campos obrigatórios';
    }


    return null;
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
    const dataAtual = new Date();
    
    if(isNaN(data_inicioObj.getTime()) || isNaN(data_fimObj.getTime())){
        mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i>Datas inválidas';
        return false;
    }

    if(data_fimObj <= data_inicioObj){
        mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i>A data de término deve ser posterior ao início';
        return false;
    }

    return true;
}

function limpa_formulario_cep() {
    const rua_leilao = document.getElementById('rua-leilao-input');
    const bairro_leilao = document.getElementById('bairro-leilao-input');
    const cidade_leilao = document.getElementById('cidade-leilao-input');
    const estado_leilao = document.getElementById('estado-leilao-input');
    
    if (rua_leilao) rua_leilao.value = "";
    if (bairro_leilao) bairro_leilao.value = "";
    if (cidade_leilao) cidade_leilao.value = "";
    if (estado_leilao) estado_leilao.value = "";
}

// Variável global para armazenar erros do CEP
let cepErro = null;

function meu_callback(conteudo) {
    const rua_leilao = document.getElementById('rua-leilao-input');
    const bairro_leilao = document.getElementById('bairro-leilao-input');
    const cidade_leilao = document.getElementById('cidade-leilao-input');
    const estado_leilao = document.getElementById('estado-leilao-input');
    
    if (!("erro" in conteudo)) {
        // Atualiza os campos com os valores
        if (rua_leilao) rua_leilao.value = conteudo.logradouro || "";
        if (bairro_leilao) bairro_leilao.value = conteudo.bairro || "";
        if (cidade_leilao) cidade_leilao.value = conteudo.localidade || "";
        if (estado_leilao) estado_leilao.value = conteudo.uf || "";
        
        // Limpa qualquer erro anterior
        cepErro = null;
        
        // Foca automaticamente no campo número
        const numero_leilao = document.getElementById('numero-leilao-input');
        if (numero_leilao) {
            numero_leilao.focus();
        }
    } else {
        // CEP não Encontrado
        limpa_formulario_cep();
        cepErro = 'CEP não encontrado. Verifique o número digitado.';
    }
    
    return cepErro;
}

function pesquisacep(valor) {
    // Nova variável "cep" somente com dígitos
    var cep = valor.replace(/\D/g, '');
    
    // Limpa erro anterior
    cepErro = null;

    // Verifica se campo cep possui valor informado e está completo
    if (cep !== "" && cep.length === 8) {
        // Expressão regular para validar o CEP
        var validacep = /^[0-9]{8}$/;

        // Valida o formato do CEP
        if (validacep.test(cep)) {
            // Preenche os campos com "..." enquanto consulta webservice
            const rua_leilao = document.getElementById('rua-leilao-input');
            const bairro_leilao = document.getElementById('bairro-leilao-input');
            const cidade_leilao = document.getElementById('cidade-leilao-input');
            const estado_leilao = document.getElementById('estado-leilao-input');
            
            if (rua_leilao) rua_leilao.value = "Buscando...";
            if (bairro_leilao) bairro_leilao.value = "Buscando...";
            if (cidade_leilao) cidade_leilao.value = "Buscando...";
            if (estado_leilao) estado_leilao.value = "Buscando...";

            // Cria um elemento javascript
            var script = document.createElement('script');

            // Sincroniza com o callback
            script.src = 'https://viacep.com.br/ws/' + cep + '/json/?callback=meu_callback';

            // Insere script no documento e carrega o conteúdo
            document.body.appendChild(script);
        } else {
            // cep é inválido
            cepErro = 'Formato de CEP inválido. Digite 8 números.';
        }
    } else if (cep !== "" && cep.length < 8) {
        // CEP incompleto
        cepErro = 'CEP incompleto. Digite os 8 números.';
    } else if (cep !== "" && cep.length > 8) {
        // CEP com mais dígitos
        cepErro = 'CEP muito longo. Digite apenas 8 números.';
    }
    
    return cepErro;
}

// Função para validar CEP que será chamada no submit
function validarCEP(mensagem) {
    const cepInput = document.getElementById('cep-leilao-input');
    if (!cepInput) return true;
    
    const cep = cepInput.value.replace(/\D/g, '').trim();
    
    if (cep.length !== 8) {
        if (mensagem) {
            mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i>CEP deve conter 8 números';
        }
        return false;
    }
    
    // Retorna qualquer erro que ocorreu durante a busca
    if (cepErro) {
        if (mensagem) {
            mensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i>' + cepErro;
        }
        return false;
    }
    
    return true;
}

// Inicializar funcionalidade do CEP
document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep-leilao-input');
    
    if (cepInput) {
        // Buscar CEP automaticamente quando o usuário terminar de digitar
        cepInput.addEventListener('input', function() {
            // Remove qualquer traço existente para contar apenas números
            const cepNumeros = this.value.replace(/\D/g, '');
            
            // Se já digitou 8 números, busca automaticamente
            if (cepNumeros.length === 8) {
                // Adiciona um pequeno delay para o usuário terminar de digitar
                setTimeout(() => {
                    pesquisacep(this.value);
                }, 800);
            }
        });
        
        // Também busca quando o campo perde o foco (caso o usuário tabule)
        cepInput.addEventListener('blur', function() {
            const cepNumeros = this.value.replace(/\D/g, '');
            if (cepNumeros.length === 8) {
                pesquisacep(this.value);
            }
        });
        
        // Formata o CEP automaticamente enquanto digita
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            if (value.length > 9) {
                value = value.substring(0, 9);
            }
            e.target.value = value;
        });
    }
});