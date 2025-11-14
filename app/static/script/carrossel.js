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

// Carrossel Principal
document.addEventListener('DOMContentLoaded', function() {
    const carrosselInner = document.querySelector('.carrossel-inner-principal');
    const slides = document.querySelectorAll('.slide-item');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!carrosselInner || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    // Função para ir para um slide específico
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        
        // Move o carrossel
        const slideWidth = carrosselInner.parentElement.offsetWidth;
        const offset = -currentSlide * slideWidth;
        carrosselInner.style.transform = `translateX(${offset}px)`;
        
        // Atualiza os indicadores
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Função para ir para o próximo slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }

    // Função para ir para o slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    }

    // Auto-play do carrossel (muda a cada 5 segundos)
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    // Para o auto-play
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Event listeners para os indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoPlay();
            goToSlide(index);
            startAutoPlay();
        });
    });

    // Navegação por teclado (opcional)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        }
    });

    // Pausa o auto-play quando o mouse está sobre o carrossel
    const carrosselPrincipal = document.getElementById('carrossel-principal');
    carrosselPrincipal.addEventListener('mouseenter', stopAutoPlay);
    carrosselPrincipal.addEventListener('mouseleave', startAutoPlay);

    // Suporte para touch/swipe em dispositivos móveis
    let touchStartX = 0;
    let touchEndX = 0;

    carrosselPrincipal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    });

    carrosselPrincipal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe para a esquerda - próximo slide
                nextSlide();
            } else {
                // Swipe para a direita - slide anterior
                prevSlide();
            }
        }
    }

    // Recalcula o carrossel ao redimensionar a janela
    window.addEventListener('resize', () => {
        goToSlide(currentSlide);
    });

    // Inicia o auto-play
    startAutoPlay();
});

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