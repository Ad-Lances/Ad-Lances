function verificar_idade(dataNasc){ 
    const dataNascObj = new Date(dataNasc);
    const anoDataNasc = dataNascObj.getFullYear();
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();

    let idade = anoAtual - anoDataNasc;

    if (idade < 18) {
        return 'Você deve ter mais de 18 anos para criar uma conta'
    }
        return null;
}

function verificar_email(email){
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regex.test(email)) {
        return 'Insira um e-mail válido';
    }
    return null;
}

function verificar_senha(senha){
    const maiuscula = /[A-Z]/.test(senha);
    const especiais = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha);

   if(senha.length<6){
        return 'A senha deve ter mais de 6 caracteres';
   } else if (!especiais){
        return 'A senha deve conter ao menos um caractere especial';
   } else if(!maiuscula){
        return 'A senha deve conter ao menos um caractere maiúsculo';
   } 
        
   return null;
}

function verificar_campos(nome, estado, cidade, logradouro, cep, bairro, numeroCasa, email, senha, telefone_celular, tipopessoa, ccpf, ccnpj){
    if (!nome || !estado || !cidade || !logradouro || !cep || !numeroCasa || !bairro || !email || !senha || !telefone_celular || !tipopessoa) {
        return 'Por favor, preencha todos os campos obrigatórios';
    }

    if (tipopessoa === 'Pessoa Física') {
        if (!ccpf) {
            return 'O CPF é obrigatório para contas do tipo pessoa física';
        }
    } else if (tipopessoa === 'Pessoa Jurídica') {
        if (!ccnpj) {
            return 'O CNPJ é obrigatório para contas do tipo Pessoa Jurídica';
        }
        if (!document.getElementById('nome-empresa').value.trim()) {
            return 'Nome da Empresa é obrigatório para Pessoa Jurídica';
        }
    } else {
        return 'Por favor, preencha todos os campos obrigatórios';
    }

    return null;
}

// Funções para busca automática de CEP
function limpa_formulario_cep() {
    // Limpa valores do formulário de cep
    const logradouro = document.getElementById('logradouro');
    const bairro = document.getElementById('bairro');
    const cidade = document.getElementById('cidade');
    const estado = document.getElementById('estado');
    
    if (logradouro) logradouro.value = "";
    if (bairro) bairro.value = "";
    if (cidade) cidade.value = "";
    if (estado) estado.value = "";
}

// Variável global para armazenar erros do CEP
let cepErro = null;

function meu_callback(conteudo) {
    const logradouro = document.getElementById('logradouro');
    const bairro = document.getElementById('bairro');
    const cidade = document.getElementById('cidade');
    const estado = document.getElementById('estado');
    
    if (!("erro" in conteudo)) {
        // Atualiza os campos com os valores
        if (logradouro) logradouro.value = conteudo.logradouro || "";
        if (bairro) bairro.value = conteudo.bairro || "";
        if (cidade) cidade.value = conteudo.localidade || "";
        if (estado) estado.value = conteudo.uf || "";
        
        // Limpa qualquer erro anterior
        cepErro = null;
        
        // Foca automaticamente no campo número
        const numeroCasa = document.getElementById('numero_casa');
        if (numeroCasa) {
            numeroCasa.focus();
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
            const logradouro = document.getElementById('logradouro');
            const bairro = document.getElementById('bairro');
            const cidade = document.getElementById('cidade');
            const estado = document.getElementById('estado');
            
            if (logradouro) logradouro.value = "Buscando...";
            if (bairro) bairro.value = "Buscando...";
            if (cidade) cidade.value = "Buscando...";
            if (estado) estado.value = "Buscando...";

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
function validarCEP() {
    const cepInput = document.getElementById('cep');
    if (!cepInput) return null;
    
    const cep = cepInput.value.replace(/\D/g, '').trim();
    
    if (cep.length !== 8) {
        return 'CEP deve conter 8 números';
    }
    
    // Retorna qualquer erro que ocorreu durante a busca
    return cepErro;
}

// Inicializar funcionalidade do CEP
document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('cep');
    
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