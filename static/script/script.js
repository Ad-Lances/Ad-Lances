const formulario = document.getElementById('formulario');
const nomeInput = document.getElementById('nome');
const dataNascInput = document.getElementById('datanasc');
const estadoInput = document.getElementById('estado');
const cidadeInput = document.getElementById('cidade');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('password');
let mensagem = document.getElementById('mensagem');

function verificar_idade(){
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear;
    let datanasc = dataNascInput.value;

    let idade = anoAtual-datanasc;

    if (idade<18){
        mensagem.style.color = 'Red';
        mensagem.innerHTML = 'Você deve ter mais de 18 anos para se cadastrar';
    }
}

function verificar_email(){
    let email = mensagemInput.value;

    if(!email.includes('@gmail.com') && !email.includes('@hotmail.com') && !email.includes('@yahoo.com')){
        mensagem.style.color = 'Red';
        mensagem.innerHTML = 'Por favor, insira um e-mail válido';
        return false;
    }
    return true;
}

function verificar_senha(){
    let senha = senhaInput.value;
    let temMaiuscula = false;
    let temCaractere = false;
    
    for(let i=0; i < senha.length(); i++){
        const caractere = senha[i];

        if(caractere>='A' && caractere <= 'Z'){
            temMaiuscula = true;
        }

        if (!caractere.includes('#') && !caractere.includes('_') && caractere.includes('#')){
            temCaractere = false;
        }

        if(temMaiuscula === true && temCaractere === true && senha.length >=6){
            return true
        } else{
            mensagem.style.color = 'Red';
            mensagem.innerHTML = 'A senha deve ter mais de 6 caracteres e incluir uma letra maiúscula, uma minúscula e um caractere especial';
            return false;
        }
    }
}
//formulario.addEventListener('submit', function(event){
//    event.preventDefault();
//    verificar_email();
//    verificar_idade();
  //  verificar_senha();
//})

// script.js

// Função para inicializar os carrosseis
function initCarousels() {
    // IDs das seções que têm carrossel
    const carouselSections = [
        'acontecendo-agora',
        'casas', 
        'apartamentos',
        'comerciais',
        'industriais-e-galpoes',
        'terrenos'
    ];

    carouselSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Verificar se já foi inicializado
        if (section.classList.contains('carousel-initialized')) return;
        section.classList.add('carousel-initialized');

        // Encontrar as setas dentro da seção
        const arrows = section.querySelectorAll('#arrow-img');
        if (arrows.length < 2) return;
        
        const leftArrow = arrows[0];
        const rightArrow = arrows[1];
        
        // Encontrar todos os itens da seção
        const items = section.querySelectorAll('#item');
        if (items.length === 0) return;

        // Salvar os itens originais antes de modificar
        const originalItems = Array.from(items).map(item => item.cloneNode(true));

        // Criar container principal do carrossel com posicionamento absoluto para as setas
        const carouselContainer = document.createElement('div');
        carouselContainer.className = 'carousel-main-container';
        carouselContainer.style.position = 'relative';
        carouselContainer.style.width = '100%';
        carouselContainer.style.overflow = 'hidden';

        // Criar container interno para alinhamento
        const innerContainer = document.createElement('div');
        innerContainer.className = 'carousel-inner-container';
        innerContainer.style.display = 'flex';
        innerContainer.style.alignItems = 'center';
        innerContainer.style.justifyContent = 'center';
        innerContainer.style.width = '100%';
        innerContainer.style.position = 'relative';
        innerContainer.style.padding = '0 50px'; // Espaço para as setas

        // Criar wrapper para os itens
        const itemsWrapper = document.createElement('div');
        itemsWrapper.className = 'carousel-items-wrapper';
        itemsWrapper.style.display = 'flex';
        itemsWrapper.style.gap = '20px';
        itemsWrapper.style.transition = 'transform 0.5s ease';
        itemsWrapper.style.flex = '1';
        itemsWrapper.style.maxWidth = '100%';
        itemsWrapper.style.overflow = 'visible';

        // Restaurar os itens originais
        originalItems.forEach(item => {
            item.style.flex = '0 0 auto';
            item.style.width = '300px';
            item.style.minHeight = 'auto';
            
            // Garantir que os ícones de visualização mantenham o tamanho original
            const viewsImg = item.querySelector('#views-img');
            if (viewsImg) {
                const viewIcon = viewsImg.querySelector('img');
                if (viewIcon) {
                    viewIcon.style.width = '20px';
                    viewIcon.style.height = '20px';
                }
            }
            
            itemsWrapper.appendChild(item);
        });

        // Configurar as setas com posicionamento absoluto
        leftArrow.style.position = 'absolute';
        leftArrow.style.left = '10px';
        leftArrow.style.top = '50%';
        leftArrow.style.transform = 'translateY(-50%)';
        leftArrow.style.zIndex = '20';

        rightArrow.style.position = 'absolute';
        rightArrow.style.right = '10px';
        rightArrow.style.top = '50%';
        rightArrow.style.transform = 'translateY(-50%)';
        rightArrow.style.zIndex = '20';

        // Limpar a seção e construir a nova estrutura
        section.innerHTML = '';
        section.appendChild(carouselContainer);
        carouselContainer.appendChild(innerContainer);
        innerContainer.appendChild(itemsWrapper);
        innerContainer.appendChild(leftArrow);
        innerContainer.appendChild(rightArrow);

        // Configurar variáveis do carrossel
        let currentPosition = 0;
        const itemWidth = 300;
        const gap = 20;
        const totalItemWidth = itemWidth + gap;
        
        // Calcular dimensões
        const containerWidth = innerContainer.offsetWidth - 100; // Descontar espaço das setas
        const visibleItemsCount = Math.max(1, Math.floor(containerWidth / totalItemWidth));
        const totalItemsWidth = (originalItems.length * totalItemWidth) - gap;
        const maxPosition = Math.min(0, containerWidth - totalItemsWidth);

        console.log(`Carrossel ${sectionId}:`, {
            containerWidth,
            visibleItemsCount,
            totalItems: originalItems.length,
            maxPosition
        });

        // Função para atualizar a posição do carrossel
        function updateCarousel() {
            // Limitar a posição dentro dos limites
            if (currentPosition > 0) currentPosition = 0;
            if (currentPosition < maxPosition) currentPosition = maxPosition;
            
            itemsWrapper.style.transform = `translateX(${currentPosition}px)`;
            
            // Atualizar estado das setas
            const leftDisabled = currentPosition === 0;
            const rightDisabled = currentPosition <= maxPosition || Math.abs(maxPosition) < 10; // Tolerância para arredondamento
            
            leftArrow.style.opacity = leftDisabled ? '0.3' : '1';
            rightArrow.style.opacity = rightDisabled ? '0.3' : '1';
            leftArrow.style.cursor = leftDisabled ? 'not-allowed' : 'pointer';
            rightArrow.style.cursor = rightDisabled ? 'not-allowed' : 'pointer';
            leftArrow.style.pointerEvents = leftDisabled ? 'none' : 'auto';
            rightArrow.style.pointerEvents = rightDisabled ? 'none' : 'auto';
        }

        // Função para mover para a direita
        function moveRight() {
            if (currentPosition > maxPosition) {
                const moveBy = totalItemWidth * Math.min(visibleItemsCount, 2);
                currentPosition = Math.max(maxPosition, currentPosition - moveBy);
                updateCarousel();
            }
        }

        // Função para mover para a esquerda
        function moveLeft() {
            if (currentPosition < 0) {
                const moveBy = totalItemWidth * Math.min(visibleItemsCount, 2);
                currentPosition = Math.min(0, currentPosition + moveBy);
                updateCarousel();
            }
        }

        // Adicionar eventos de clique
        leftArrow.addEventListener('click', moveLeft);
        rightArrow.addEventListener('click', moveRight);

        // Função de redimensionamento
        function handleResize() {
            const newContainerWidth = innerContainer.offsetWidth - 100;
            const newVisibleItemsCount = Math.max(1, Math.floor(newContainerWidth / totalItemWidth));
            const newMaxPosition = Math.min(0, newContainerWidth - totalItemsWidth);
            
            // Ajustar posição atual se necessário
            if (currentPosition < newMaxPosition) {
                currentPosition = newMaxPosition;
            }
            
            updateCarousel();
        }

        // Debounce para resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(handleResize, 250);
        });

        // Inicializar
        setTimeout(() => {
            handleResize();
            updateCarousel();
        }, 100);
    });

    // Adicionar estilos CSS
    if (!document.querySelector('#carousel-styles')) {
        const style = document.createElement('style');
        style.id = 'carousel-styles';
        style.textContent = `
            .carousel-main-container {
                position: relative;
                width: 100%;
                overflow: hidden;
            }
            
            .carousel-inner-container {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                position: relative;
                padding: 0 60px;
                box-sizing: border-box;
            }
            
            .carousel-items-wrapper {
                display: flex;
                gap: 20px;
                transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                flex: 1;
                max-width: 100%;
            }
            
            /* Setas com posicionamento absoluto FIXO */
            #arrow-img {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 50%;
                box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
                z-index: 20;
                border: none;
                cursor: pointer;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
            }
            
            #arrow-img:hover {
                background: #ffffff;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                transform: translateY(-50%) scale(1.1);
            }
            
            #arrow-img:active {
                transform: translateY(-50%) scale(0.95);
            }
            
            #arrow-img img {
                width: 25px;
                height: 25px;
                object-fit: contain;
            }
            
            /* Garantir que as setas fiquem sempre visíveis */
            #arrow-img:first-child {
                left: 10px !important;
            }
            
            #arrow-img:last-child {
                right: 10px !important;
            }
            
            /* Itens do carrossel */
            .carousel-items-wrapper #item {
                flex-shrink: 0;
                width: 300px !important;
            }
            
            /* Ícones de visualização */
            #views-img img {
                width: 20px !important;
                height: 20px !important;
            }
            
            /* Responsivo */
            @media (max-width: 768px) {
                .carousel-inner-container {
                    padding: 0 50px;
                }
                
                #arrow-img {
                    width: 40px;
                    height: 40px;
                }
                
                #arrow-img img {
                    width: 20px;
                    height: 20px;
                }
                
                .carousel-items-wrapper #item {
                    width: 280px !important;
                }
            }
            
            @media (max-width: 480px) {
                .carousel-inner-container {
                    padding: 0 40px;
                }
                
                #arrow-img {
                    width: 35px;
                    height: 35px;
                }
                
                #arrow-img img {
                    width: 18px;
                    height: 18px;
                }
                
                .carousel-items-wrapper #item {
                    width: 260px !important;
                }
                
                #arrow-img:first-child {
                    left: 5px !important;
                }
                
                #arrow-img:last-child {
                    right: 5px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        console.log('Inicializando carrosseis...');
        initCarousels();
    }, 500);
});

window.addEventListener('resize', function() {
    setTimeout(initCarousels, 300);
});

// Apenas se quiser controle mais preciso via JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('track-empresas');
    if (!track) return;
    
    // Clona os itens para efeito contínuo infinito
    const items = track.querySelectorAll('.empresa-item-auto');
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
});

// Carrossel Principal Automático
function initMainCarousel() {
    const carousel = document.getElementById('carrossel-principal');
    if (!carousel) return;

    const inner = carousel.querySelector('.carrossel-inner-principal');
    const slides = carousel.querySelectorAll('.slide-item');
    const indicators = carousel.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;

    let currentSlide = 0;
    let autoPlayInterval;

    // Função para mostrar slide específico
    function showSlide(index) {
        // Remove classe active de todos os slides e indicadores
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Adiciona classe active ao slide e indicador atual
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        
        currentSlide = index;
    }

    // Função para próximo slide
    function nextSlide() {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        showSlide(nextIndex);
    }

    // Função para iniciar autoplay
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // Muda a cada 5 segundos
    }

    // Função para parar autoplay
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Event listeners para os indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoPlay();
            showSlide(index);
            startAutoPlay();
        });
    });

    // Pausar autoplay quando o mouse estiver sobre o carrossel
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Inicializar
    showSlide(0);
    startAutoPlay();

    // Limpar intervalo quando a página for fechada
    window.addEventListener('beforeunload', () => {
        clearInterval(autoPlayInterval);
    });
}

// Se preferir uma versão mais simples sem JavaScript, use esta alternativa CSS-only:

function initMainCarouselCSSOnly() {
    const carousel = document.getElementById('carrossel-principal');
    if (!carousel) return;

    const inner = carousel.querySelector('.carrossel-inner-principal');
    const slides = carousel.querySelectorAll('.slide-item');
    
    if (slides.length === 0) return;

    // Adiciona classes para animação CSS
    inner.classList.add('css-carousel');
    slides.forEach(slide => slide.classList.add('css-slide'));
}

// Adicione este CSS alternativo se quiser versão apenas CSS:

const cssCarouselStyles = `
/* Versão CSS-only do carrossel (alternativa) */
.css-carousel {
    display: flex;
    animation: slideCarousel 15s infinite;
}

.css-slide {
    flex: 0 0 100%;
}

@keyframes slideCarousel {
    0%, 25% {
        transform: translateX(0%);
    }
    33%, 58% {
        transform: translateX(-100%);
    }
    66%, 91% {
        transform: translateX(-200%);
    }
    100% {
        transform: translateX(0%);
    }
}

/* Para 4 slides */
.css-carousel[data-slides="4"] {
    animation: slideCarousel4 20s infinite;
}

@keyframes slideCarousel4 {
    0%, 20% { transform: translateX(0%); }
    25%, 45% { transform: translateX(-100%); }
    50%, 70% { transform: translateX(-200%); }
    75%, 95% { transform: translateX(-300%); }
    100% { transform: translateX(0%); }
}
`;

// Adicione os estilos CSS-only se necessário
function addCSSCarouselStyles() {
    if (!document.querySelector('#css-carousel-styles')) {
        const style = document.createElement('style');
        style.id = 'css-carousel-styles';
        style.textContent = cssCarouselStyles;
        document.head.appendChild(style);
    }
}

// Inicialização principal
document.addEventListener('DOMContentLoaded', function() {
    // Use a versão com JavaScript para mais controle
    initMainCarousel();
    
    // Ou use a versão CSS-only (comente a linha acima e descomente a abaixo)
    // initMainCarouselCSSOnly();
    // addCSSCarouselStyles();
});