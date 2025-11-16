function verificarCamposLeilao(img_produto, nome_produto, lance_inicial, descricao_produto, categoria_produto, subcategoria_produto,
    data_inicio, data_fim,
    pagamentoCartao, pagamentoPIX, pagamentoFGTS, pagamentoFinanciamento, parcelas,
    uf_leilao, cidade_leilao, cep_leilao, rua_leilao, numero_leilao,
    termo_veracidade, termos_condicoes){
     console.log(rua_leilao, numero_leilao, termo_veracidade, termos_condicoes);
     console.log(img_produto, nome_produto, lance_inicial, descricao_produto, categoria_produto, subcategoria_produto,
        data_inicio, data_fim,
        pagamentoCartao, pagamentoPIX, pagamentoFGTS, pagamentoFinanciamento, parcelas,
        uf_leilao, cidade_leilao, cep_leilao, rua_leilao, numero_leilao,
        termo_veracidade, termos_condicoes);   
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
       !uf_leilao || uf_leilao.trim() === "" ||
       !cidade_leilao || cidade_leilao.trim() === ''||
       !cep_leilao || cep_leilao.trim() === '' ||
       !rua_leilao || rua_leilao.trim() === '' ||
       !numero_leilao || numero_leilao.trim() === '' ||
       !termo_veracidade || !termos_condicoes){
        return 'Preencha todos os campos obrigatórios';
    }


    return null;
}


function verificarCategoria(categoria_produto, subcategoria_produto, mensagem){
    if(categoria_produto === 'none' || subcategoria_produto === 'none'){
        return 'Insira a qual categoria/subcategoria o produto pertence'
    }

    return null;
}

function verificarDatas(dataInicio, dataFim) {
        const inicio = new Date(dataInicio);
        const fim = new Date(dataFim);
        const dataAtual = new Date();

        if (inicio >= fim) {
            return 'A data de início deve ser anterior à data de fim.';
        } else if(inicio <= dataAtual){
            return 'Insira uma data de início válida';
        }
        return null;
}

function verificarLanceInicial(lance_inicial){
    const lance = parseFloat(lance_inicial)
    if(lance<0.00){
        return 'Insira um lance inicial válido'
    }
   
    return null;
}

function inicializarUploadArquivos() {
    const fileInput = document.getElementById('img-produto-input');
    const fileUploadArea = document.querySelector('.file-upload-area');
    
    if (!fileInput || !fileUploadArea) {
        console.error('Elementos de upload não encontrados');
        return;
    }

    // Criar container para exibir os arquivos selecionados
    const fileListContainer = document.createElement('div');
    fileListContainer.className = 'file-list-container';
    fileListContainer.style.cssText = `
        margin-top: 15px;
        width: 100%;
    `;
    
    // Inserir o container após a área de upload
    fileUploadArea.parentNode.insertBefore(fileListContainer, fileUploadArea.nextSibling);

    // Event listener para quando arquivos são selecionados
    fileInput.addEventListener('change', function(e) {
        exibirArquivosSelecionados(this.files, fileListContainer);
    });

    // Drag and drop functionality
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '#f0f8ff';
        this.style.borderColor = '#034660';
    });

    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '';
        this.style.borderColor = '';
    });

    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.backgroundColor = '';
        this.style.borderColor = '';
        
        const files = e.dataTransfer.files;
        fileInput.files = files;
        exibirArquivosSelecionados(files, fileListContainer);
    });
}

function exibirArquivosSelecionados(files, container) {
    // Limpar lista anterior
    container.innerHTML = '';
    
    if (!files || files.length === 0) {
        // Restaurar texto padrão se não há arquivos
        const uploadArea = document.querySelector('.file-upload-area');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <i class="fa-solid fa-cloud-arrow-up"></i>
                <div class="file-upload-text">Clique para adicionar imagens do produto</div>
                <div class="file-upload-subtext">Arraste ou clique para fazer upload</div>
            `;
        }
        return;
    }

    // Atualizar texto da área de upload
    const uploadArea = document.querySelector('.file-upload-area');
    if (uploadArea) {
        uploadArea.innerHTML = `
            <i class="fa-solid fa-check" style="color: #75cc52;"></i>
            <div class="file-upload-text">${files.length} arquivo(s) selecionado(s)</div>
            <div class="file-upload-subtext">Clique para alterar</div>
        `;
    }

    // Criar lista de arquivos
    const fileList = document.createElement('div');
    fileList.className = 'file-list';
    fileList.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-height: 200px;
        overflow-y: auto;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    `;

    // Adicionar cada arquivo à lista
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileItem = criarItemArquivo(file, i);
        fileList.appendChild(fileItem);
    }

    container.appendChild(fileList);
}

function criarItemArquivo(file, index) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    fileItem.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 12px;
        background: white;
        border-radius: 6px;
        border: 1px solid #dee2e6;
        font-size: 14px;
    `;

    // Informações do arquivo
    const fileInfo = document.createElement('div');
    fileInfo.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
    `;

    // Ícone baseado no tipo de arquivo
    const fileIcon = document.createElement('i');
    if (file.type.startsWith('image/')) {
        fileIcon.className = 'fa-solid fa-image';
        fileIcon.style.color = '#034660';
    } else {
        fileIcon.className = 'fa-solid fa-file';
        fileIcon.style.color = '#6c757d';
    }

    // Detalhes do arquivo
    const fileDetails = document.createElement('div');
    fileDetails.style.cssText = `
        display: flex;
        flex-direction: column;
    `;

    const fileName = document.createElement('span');
    fileName.textContent = file.name;
    fileName.style.cssText = `
        font-weight: 500;
        color: #034660;
    `;

    const fileSize = document.createElement('span');
    fileSize.textContent = formatarTamanhoArquivo(file.size);
    fileSize.style.cssText = `
        font-size: 12px;
        color: #6c757d;
    `;

    // Botão de remover
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.innerHTML = '<i class="fa-solid fa-times"></i>';
    removeBtn.style.cssText = `
        background: none;
        border: none;
        color: #dc3545;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
    `;

    removeBtn.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f8d7da';
    });

    removeBtn.addEventListener('mouseleave', function() {
        this.style.backgroundColor = 'transparent';
    });

    removeBtn.addEventListener('click', function() {
        removerArquivo(index);
    });

    // Montar estrutura
    fileDetails.appendChild(fileName);
    fileDetails.appendChild(fileSize);
    fileInfo.appendChild(fileIcon);
    fileInfo.appendChild(fileDetails);
    fileItem.appendChild(fileInfo);
    fileItem.appendChild(removeBtn);

    return fileItem;
}

function formatarTamanhoArquivo(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removerArquivo(index) {
    const fileInput = document.getElementById('img-produto-input');
    if (!fileInput) return;

    const files = Array.from(fileInput.files);
    files.splice(index, 1);
    
    // Criar nova FileList
    const dataTransfer = new DataTransfer();
    files.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;

    // Atualizar exibição
    const fileListContainer = document.querySelector('.file-list-container');
    exibirArquivosSelecionados(fileInput.files, fileListContainer);
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