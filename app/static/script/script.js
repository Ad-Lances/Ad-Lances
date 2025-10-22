const formulario = document.getElementById('formulario');
const nomeInput = document.getElementById('nome');
const estadoInput = document.getElementById('estado');
const cidadeInput = document.getElementById('cidade');
const ruaInput = document.getElementById('rua');
const numeroCasaInput = document.getElementById('numero_casa');
const complementoInput = document.getElementById('complemento');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('password');
const mensagem = document.getElementById('mensagem');
const botao = document.getElementById('botao-enviar');
const cpf = document.getElementById('cpf');
const cnpj = document.getElementById('cnpj');
const tipo_pessoa = document.getElementById('tipo-de-conta');
const datanascInput = document.getElementById('datanasc');

function exibirCampo(){
    const tipoDeConta = document.getElementById('tipo-de-conta');
    const campoCPF = document.getElementById('campoCpf');
    const campoCNPJ = document.getElementById('campoCnpj');
    
    if (tipoDeConta.value === 'Pessoa Física'){
        campoCNPJ.style.display = 'none';
        campoCPF.style.display = 'block';
        campoCPF.style.width = '50%';
    } else if(tipoDeConta.value === 'Pessoa Jurídica'){
        campoCPF.style.display = 'none';
        campoCNPJ.style.display = 'block';
        campoCNPJ.style.width = '50%';
    } else{
        campoCPF.style.display = 'none';
        campoCNPJ.style.display = 'none';
    }
}

function verificar_idade(){
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    const dataNascInput = document.getElementById('datanasc');
    const dataNasc = new Date(dataNascInput.value);
    const anoDataNasc = dataNasc.getFullYear();

    if(!dataNascInput.value){
        mensagem.innerHTML = 'Insira uma data de nascimento válida';
        return false;
    }

    let idade = anoAtual-anoDataNasc;

    if (idade<18){
        mensagem.style.color = 'Red';
        mensagem.innerHTML = 'Você deve ter mais de 18 anos para se cadastrar';
        return false;
    } else{
        mensagem.innerHTML = '';
        return true;
    }
}

function verificar_email(email){
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

function verificar_senha(senha){
    const maiuscula = /[A-Z]/.test(senha);
    const especiais = /[#_@]/.test(senha);

   if (especiais === false){
        mensagem.style.color = 'red';
        mensagem.innerHTML = 'A senha precisa ter ao menos um caractere especial';
        return false;
   } else if(senha.length<6){
        mensagem.innerHTML = 'A senha precisa ter mais de 6 caracteres';
        return false;
   } else if(maiuscula === false){
        mensagem.innerHTML = 'A senha precisa ter ao menos uma letra maiúscula';
        return false;
   } else{
        mensagem.innerHTML = '';
        return true;
   }
}

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const nome = nomeInput.value.trim();
    const estado = estadoInput.value.trim();
    const cidade = cidadeInput.value.trim();
    const rua = ruaInput.value.trim();
    const numeroCasa = numeroCasaInput.value.trim();
    const complemento = complementoInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    const ccpf = cpf.value.trim();
    const ccnpj = cnpj.value.trim();
    const tipopessoa = tipo_pessoa.value.trim();
    const data_nasc = datanascInput.value.trim();
    const botao = document.getElementById('botao-enviar');


    mensagem.innerHTML = '';

    if (!nome || !estado || !cidade || !rua || !numeroCasa || !complemento || !email || !senha) {
        mensagem.style.color = 'red';
        mensagem.innerHTML = 'Por favor, preencha todos os campos obrigatórios';
        return;
    } 

    const idadeValida = verificar_idade();
    if(!idadeValida) return;

    const emailValido = verificar_email(email);
    if(!emailValido){
        mensagem.innerHTML = 'Insira um email válido';
        return;
    }

    const senhaValida = verificar_senha(senha);
    if(!senhaValida) return;

    const dados = {
        nome: nome,
        unid_federativa: estado,
        cidade: cidade,
        rua: rua,
        numero_casa: numeroCasa,
        complemento: complemento,
        email: email,
        senha: senha,
        cpf: ccpf,
        cnpj: ccnpj,
        tipo_pessoa: tipopessoa,
        datanasc: data_nasc
    }

    const resposta = await fetch('/cadastrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    const resultado = await resposta.json()

    mensagem.innerHTML = resultado.mensagem;

    formulario.reset();
})

//carrossel
function initCarousel() {
    console.log('=== INICIANDO CARROSSEL RESPONSIVO ===');
    
    const sections = [
        'encerrando-em-breve',
        'maquinas-equipamentos-pesados', 'materiais-e-insumos', 'ferramentas-equipamentos',
        'mais-recentes',
        'casas', 'apartamentos', 'comerciais', 'industriais-e-galpoes', 'terrenos',
        'carros', 'motos', 'caminhoes',
        'cozinha', 'limpeza', 'eletroportateis',
        'computadores', 'audio-e-video', 'videogames', 'componentes',
        'sala-de-estar', 'cozinha', 'banheiro', 'quarto', 'escritorio'
    ];

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Configuração base responsiva
        section.style.display = 'flex';
        section.style.alignItems = 'center';
        section.style.gap = '15px';
        section.style.overflow = 'hidden';
        section.style.position = 'relative';
        section.style.width = '100%';
        section.style.maxWidth = '1200px';
        section.style.margin = '30px auto';
        section.style.padding = '10px 0';

        const arrows = section.querySelectorAll('#arrow-img');
        const items = section.querySelectorAll('#item');
        
        if (arrows.length < 2) {
            console.log(`Atenção: ${sectionId} tem apenas ${arrows.length} setas`);
            return;
        }

        const leftArrow = arrows[0];
        const rightArrow = arrows[1];

        let itemsContainer = section.querySelector('.items-container');
        if (!itemsContainer) {
            itemsContainer = document.createElement('div');
            itemsContainer.className = 'items-container';
            itemsContainer.style.display = 'flex';
            itemsContainer.style.gap = '15px';
            itemsContainer.style.transition = 'transform 0.4s ease';
            
            items.forEach(item => {
                itemsContainer.appendChild(item.cloneNode(true));
            });
            
            section.innerHTML = '';
            section.appendChild(leftArrow);
            section.appendChild(itemsContainer);
            section.appendChild(rightArrow);
        }

        function setupArrows() {
            const isMobile = window.innerWidth < 768;
            const arrowSize = isMobile ? '35px' : '40px';
            const iconSize = isMobile ? '16px' : '20px';
            const arrowPosition = isMobile ? '5px' : '10px';

            leftArrow.style.cssText = `
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: ${arrowSize} !important;
                height: ${arrowSize} !important;
                background: white !important;
                border-radius: 50% !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
                cursor: pointer !important;
                z-index: 10 !important;
                position: absolute !important;
                left: ${arrowPosition} !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                transition: all 0.3s ease !important;
            `;

            rightArrow.style.cssText = `
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: ${arrowSize} !important;
                height: ${arrowSize} !important;
                background: white !important;
                border-radius: 50% !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important;
                cursor: pointer !important;
                z-index: 10 !important;
                position: absolute !important;
                right: ${arrowPosition} !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                transition: all 0.3s ease !important;
            `;

            [leftArrow, rightArrow].forEach(arrow => {
                const img = arrow.querySelector('img');
                if (img) {
                    img.style.width = iconSize;
                    img.style.height = iconSize;
                }
            });
        }

        function setupItems() {
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth < 1024;
            
            let itemWidth;
            if (isMobile) {
                itemWidth = '250px'; 
            } else if (isTablet) {
                itemWidth = '280px'; 
            } else {
                itemWidth = '300px';
            }

            const currentItems = itemsContainer.querySelectorAll('#item');
            currentItems.forEach(item => {
                item.style.flex = '0 0 auto';
                item.style.width = itemWidth;
                item.style.minHeight = 'auto';

                item.style.padding = isMobile ? '12px' : '15px';

                const img = item.querySelector('img');
                if (img) {
                    img.style.height = isMobile ? '150px' : '180px';
                }
                
                const title = item.childNodes[2];
                if (title && title.style) {
                    title.style.fontSize = isMobile ? '13px' : '14px';
                }
                
                const local = item.querySelector('#local');
                if (local) {
                    local.style.fontSize = isMobile ? '11px' : '12px';
                }
                
                const viewsCount = item.querySelector('#views-count');
                if (viewsCount) {
                    viewsCount.style.fontSize = isMobile ? '11px' : '12px';
                }
            });
        }

        let currentPosition = 0;
        
        function updateCarousel() {
            setupArrows();
            setupItems();
            
            const itemWidth = parseInt(itemsContainer.querySelector('#item').style.width) + 15; // width + gap
            const visibleItems = Math.max(1, Math.floor(section.offsetWidth / itemWidth));
            const totalItems = itemsContainer.querySelectorAll('#item').length;
            const maxPosition = Math.max(0, (totalItems - visibleItems) * itemWidth);
            
            currentPosition = Math.max(0, Math.min(currentPosition, maxPosition));
            
            itemsContainer.style.transform = `translateX(-${currentPosition}px)`;
            
            // Atualizar visibilidade das setas
            leftArrow.style.opacity = currentPosition === 0 ? '0.4' : '1';
            rightArrow.style.opacity = currentPosition >= maxPosition ? '0.4' : '1';
            leftArrow.style.pointerEvents = currentPosition === 0 ? 'none' : 'auto';
            rightArrow.style.pointerEvents = currentPosition >= maxPosition ? 'none' : 'auto';
        }

        function moveLeft() {
            const itemWidth = parseInt(itemsContainer.querySelector('#item').style.width) + 15;
            const visibleItems = Math.max(1, Math.floor(section.offsetWidth / itemWidth));
            const moveBy = visibleItems * itemWidth;
            
            currentPosition = Math.max(0, currentPosition - moveBy);
            updateCarousel();
        }

        function moveRight() {
            const itemWidth = parseInt(itemsContainer.querySelector('#item').style.width) + 15;
            const visibleItems = Math.max(1, Math.floor(section.offsetWidth / itemWidth));
            const totalItems = itemsContainer.querySelectorAll('#item').length;
            const maxPosition = Math.max(0, (totalItems - visibleItems) * itemWidth);
            const moveBy = visibleItems * itemWidth;
            
            currentPosition = Math.min(maxPosition, currentPosition + moveBy);
            updateCarousel();
        }

        // Event listeners
        leftArrow.addEventListener('click', moveLeft);
        rightArrow.addEventListener('click', moveRight);

        // Swipe para mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        itemsContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            itemsContainer.style.transition = 'none';
        });

        itemsContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            itemsContainer.style.transform = `translateX(-${currentPosition + diff}px)`;
        });

        itemsContainer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            itemsContainer.style.transition = 'transform 0.4s ease';
            
            const diff = startX - currentX;
            const swipeThreshold = 50;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    moveRight();
                } else {
                    moveLeft();
                }
            } else {
                updateCarousel();
            }
        });

        // Inicializar
        updateCarousel();
        
        // Atualizar no resize com debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateCarousel, 250);
        });
    });
}

// Adicionar seta faltante
function addMissingArrow() {
    const section = document.getElementById('ferramentas-equipamentos');
    if (!section) return;

    const arrows = section.querySelectorAll('#arrow-img');
    if (arrows.length === 1) {
        const rightArrow = document.createElement('div');
        rightArrow.id = 'arrow-img';
        rightArrow.innerHTML = '<img src="{{ url_for("static", filename="img/icons-img/seta-direita.png") }}">';
        section.appendChild(rightArrow);
    }
}

function addResponsiveStyles() {
    if (!document.querySelector('#carousel-responsive-styles')) {
        const style = document.createElement('style');
        style.id = 'carousel-responsive-styles';
        style.textContent = `
            /* Estilos responsivos do carrossel */
            
            /* Mobile */
            @media (max-width: 767px) {
                #encerrando-em-breve, #maquinas-equipamentos-pesados, #materiais-e-insumos, #ferramentas-equipamentos,
                #mais-recentes,
                #casas, #apartamentos#, #comerciais, #industriais-e-galpoes, #terrenos,
                #carros, #motos, #caminhoes,
                #cozinha, #limpeza, #eletroportateis,
                #computadores, #audio-e-video, #videogames, #componentes,
                #sala-de-estar, #cozinha, #banheiro, #quarto, #escritorio{
                    gap: 12px !important;
                    margin: 12px auto !important;
                    padding: 5px 0 !important;
                }
                
                .items-container {
                    gap: 12px !important;
                }
                
                #item {
                    padding: 12px !important;
                }
                
                #item img {
                    height: 150px !important;
                }
                
                /* Texto responsivo */
                #item > div:first-of-type {
                    font-size: 13px !important;
                    line-height: 1.3 !important;
                }
                
                #local {
                    font-size: 13px !important;
                }
                
                #views-count {
                    font-size: 13px !important;
                }
                
                #lance, #temporizador {
                    font-size: 13px !important;
                }
            }
            
            /* Tablet */
            @media (min-width: 768px) and (max-width: 1023px) {
                 #encerrando-em-breve, #maquinas-equipamentos-pesados, #materiais-e-insumos, #ferramentas-equipamentos,
                #mais-recentes,
                #casas, #apartamentos#, #comerciais, #industriais-e-galpoes, #terrenos,
                #carros, #motos, #caminhoes,
                #cozinha, #limpeza, #eletroportateis,
                #computadores, #audio-e-video, #videogames, #componentes,
                #sala-de-estar, #cozinha, #banheiro, #quarto, #escritorio{
                    gap: 15px !important;
                    margin: 25px auto !important;
                    margin-top: 25px;
                    margin-bottom: 20px;
                }
                
                .items-container {
                    gap: 15px !important;
                }
                
                #item {
                    padding: 14px !important;
                }
            }
            
            /* Desktop */
            @media (min-width: 1024px) {
                #encerrando-em-breve, #maquinas-equipamentos-pesados, #materiais-e-insumos, #ferramentas-equipamentos,
                #mais-recentes,
                #casas, #apartamentos#, #comerciais, #industriais-e-galpoes, #terrenos,
                #carros, #motos, #caminhoes,
                #cozinha, #limpeza, #eletroportateis,
                #computadores, #audio-e-video, #videogames, #componentes,
                #sala-de-estar, #cozinha, #banheiro, #quarto, #escritorio{
                    gap: 30px !important;
                }
                
                .items-container {
                    gap: 20px !important;
                }
            }
            
            /* Setas sempre visíveis */
            #arrow-img {
                z-index: 100 !important;
            }
            
            /* Hover effects apenas para desktop */
            @media (hover: hover) {
                #arrow-img:hover {
                    background: #f8f8f8 !important;
                    transform: translateY(-50%) scale(1.1) !important;
                }
                
                #item:hover {
                    transform: translateY(-5px) !important;
                }
            }
            
            /* Garantir que o carrossel funcione em telas muito pequenas */
            @media (max-width: 480px) {
                 #encerrando-em-breve, #maquinas-equipamentos-pesados, #materiais-e-insumos, #ferramentas-equipamentos,
                #mais-recentes,
                #casas, #apartamentos#, #comerciais, #industriais-e-galpoes, #terrenos,
                #carros, #motos, #caminhoes,
                #cozinha, #limpeza, #eletroportateis,
                #computadores, #audio-e-video, #videogames, #componentes,
                #sala-de-estar, #cozinha, #banheiro, #quarto, #escritorio{
                    max-width: 95% !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando carrossel responsivo...');
    
    addResponsiveStyles();
    
    setTimeout(addMissingArrow, 100);
    
    setTimeout(initCarousel, 200);
});

window.addEventListener('resize', function() {
    setTimeout(initCarousel, 300);
});

window.addEventListener('orientationchange', function() {
    setTimeout(initCarousel, 500);
});

// script-carrosseis.js

// ===== CARROSSEL PRINCIPAL DE BANNERS =====
function initMainCarousel() {
    const carousel = document.getElementById('carrossel-principal');
    if (!carousel) return;

    const track = carousel.querySelector('.carrossel-track-principal');
    const inner = carousel.querySelector('.carrossel-inner-principal');
    const slides = carousel.querySelectorAll('.slide-item');
    const indicators = carousel.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    let autoPlayInterval;

    // Configurar para imagens completas sem distorção
    carousel.style.cssText = `
        width: 100%;
        position: relative;
        overflow: hidden;
        margin: 20px 0;
        background: #f5f5f5;
    `;

    track.style.cssText = `
        width: 100%;
        overflow: hidden;
    `;

    inner.style.cssText = `
        display: flex;
        transition: transform 0.8s ease-in-out;
        width: 100%;
    `;

    // Configurar slides para mostrar imagens completas
    slides.forEach((slide, index) => {
        slide.style.cssText = `
            flex: 0 0 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
            min-height: 500px;
        `;

        const img = slide.querySelector('img');
        if (img) {
            img.style.cssText = `
                width: auto;
                max-width: 100%;
                max-height: 500px;
                height: auto;
                object-fit: contain;
                display: block;
            `;
        }
    });

    function showSlide(index) {
        // Remove classe active de todos os slides
        slides.forEach(slide => {
            slide.style.display = 'none';
            slide.classList.remove('active');
        });
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Mostra apenas o slide ativo
        slides[index].style.display = 'flex';
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(index);
            startAutoPlay();
        });
    });

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Inicializar mostrando o primeiro slide
    showSlide(0);
    startAutoPlay();

    window.addEventListener('beforeunload', () => {
        clearInterval(autoPlayInterval);
    });
}

// ===== CARROSSEL AUTOMÁTICO DE EMPRESAS =====
function initCompaniesCarousel() {
    const carousel = document.getElementById('carrossel-empresas-automatico');
    if (!carousel) return;

    const track = carousel.querySelector('.carrossel-track');
    const inner = carousel.querySelector('.carrossel-inner');
    const items = carousel.querySelectorAll('.empresa-item');
    
    if (items.length === 0) return;

    // Configurar para logos grandes e visíveis
    carousel.style.cssText = `
        width: 100%;
        overflow: hidden;
        position: relative;
        margin: 60px 0;
        padding: 50px 0;
        background: #f8f9fa;
    `;

    track.style.cssText = `
        width: 100%;
        overflow: hidden;
    `;
    
    // Configurar animação
    inner.style.cssText = `
        display: flex;
        align-items: center;
        gap: 80px;
        animation: scrollCompanies 40s linear infinite;
        padding: 20px 0;
    `;

    // Configurar itens com logos grandes
    items.forEach(item => {
        item.style.cssText = `
            flex: 0 0 auto;
            width: 250px;
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        `;

        const img = item.querySelector('img');
        if (img) {
            img.style.cssText = `
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
                object-fit: contain;
                filter: grayscale(20%);
                opacity: 0.9;
                transition: all 0.3s ease;
            `;
        }

        // Hover effect
        item.addEventListener('mouseenter', () => {
            if (img) {
                img.style.filter = 'grayscale(0%)';
                img.style.opacity = '1';
                img.style.transform = 'scale(1.1)';
            }
            item.style.transform = 'translateY(-8px)';
            item.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });

        item.addEventListener('mouseleave', () => {
            if (img) {
                img.style.filter = 'grayscale(20%)';
                img.style.opacity = '0.9';
                img.style.transform = 'scale(1)';
            }
            item.style.transform = 'translateY(0)';
            item.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        });
    });

    // Adicionar estilos CSS
    if (!document.querySelector('#companies-carousel-styles')) {
        const style = document.createElement('style');
        style.id = 'companies-carousel-styles';
        style.textContent = `
            /* Carrossel Principal - Imagens completas */
            .slide-item {
                opacity: 0;
                transition: opacity 0.8s ease-in-out;
            }
            
            .slide-item.active {
                opacity: 1;
            }
            
            /* Carrossel de Empresas */
            @keyframes scrollCompanies {
                0% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(calc(-250px * 9 - 80px * 9));
                }
            }
            
            #carrossel-empresas-automatico:hover .carrossel-inner {
                animation-play-state: paused;
            }
            
            /* Responsividade */
            @media (max-width: 1200px) {
                .slide-item img {
                    max-height: 450px !important;
                }
                
                .empresa-item {
                    width: 220px !important;
                    height: 110px !important;
                }
                
                .carrossel-inner {
                    gap: 70px !important;
                }
                
                @keyframes scrollCompanies {
                    100% {
                        transform: translateX(calc(-220px * 9 - 70px * 9));
                    }
                }
            }
            
            @media (max-width: 768px) {
                .slide-item img {
                    max-height: 350px !important;
                }
                
                .empresa-item {
                    width: 180px !important;
                    height: 90px !important;
                    padding: 15px !important;
                }
                
                .carrossel-inner {
                    gap: 50px !important;
                }
                
                #carrossel-empresas-automatico {
                    padding: 40px 0 !important;
                    margin: 40px 0 !important;
                }
                
                @keyframes scrollCompanies {
                    100% {
                        transform: translateX(calc(-180px * 9 - 50px * 9));
                    }
                }
            }
            
            @media (max-width: 480px) {
                .slide-item img {
                    max-height: 250px !important;
                }
                
                .empresa-item {
                    width: 140px !important;
                    height: 70px !important;
                    padding: 12px !important;
                }
                
                .carrossel-inner {
                    gap: 40px !important;
                }
                
                #carrossel-empresas-automatico {
                    padding: 30px 0 !important;
                    margin: 30px 0 !important;
                }
                
                @keyframes scrollCompanies {
                    100% {
                        transform: translateX(calc(-140px * 9 - 40px * 9));
                    }
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== INICIALIZAÇÃO =====
function initImageCarousels() {
    console.log('Iniciando carrosseis...');
    initMainCarousel();
    initCompaniesCarousel();
}

document.addEventListener('DOMContentLoaded', initImageCarousels);