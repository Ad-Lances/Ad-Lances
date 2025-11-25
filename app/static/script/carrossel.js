document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".carrossel-leiloes").forEach(carrossel => {
        const container = carrossel.querySelector(".carrossel-container");
        const track = carrossel.querySelector(".carrossel-track");
        const items = Array.from(track.querySelectorAll(".carrossel-item"));
        const prevBtn = carrossel.querySelector(".prev-btn");
        const nextBtn = carrossel.querySelector(".next-btn");
        const currentSlideEl = carrossel.querySelector('.current-slide');
        const totalSlidesEl = carrossel.querySelector('.total-slides');

        if (!track || items.length === 0) return;

        let currentIndex = 0;
        let autoPlayInterval;
        let itemsPerSlide = 1;

        const getItemsPerSlide = () => {
            if (!container) return 1;
            
            const containerWidth = container.offsetWidth;
            const itemWidth = items[0].offsetWidth;
            const gap = 20;
            const calculatedItems = Math.floor(containerWidth / (itemWidth + gap));
            return Math.max(1, calculatedItems);
        };

        const updateCarrossel = () => {
            itemsPerSlide = getItemsPerSlide();
            const itemWidth = items[0].offsetWidth;
            const gap = 20;
            const translateX = -currentIndex * (itemWidth + gap) * itemsPerSlide;
            
            track.style.transform = `translateX(${translateX}px)`;
            
            if (currentSlideEl && totalSlidesEl) {
                currentSlideEl.textContent = currentIndex + 1;
                totalSlidesEl.textContent = Math.ceil(items.length / itemsPerSlide);
            }
            
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) {
                const maxIndex = Math.ceil(items.length / itemsPerSlide) - 1;
                nextBtn.disabled = currentIndex >= maxIndex;
            }
        };

        const nextSlide = () => {
            const maxIndex = Math.ceil(items.length / itemsPerSlide) - 1;
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarrossel();
        };

        const prevSlide = () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                const maxIndex = Math.ceil(items.length / itemsPerSlide) - 1;
                currentIndex = maxIndex;
            }
            updateCarrossel();
        };

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(nextSlide, 5000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        carrossel.addEventListener('mouseenter', stopAutoPlay);
        carrossel.addEventListener('mouseleave', startAutoPlay);

        const handleResize = () => {
            currentIndex = 0; // Reset para primeira página ao redimensionar
            updateCarrossel();
        };

        window.addEventListener('resize', handleResize);

        // Inicialização
        updateCarrossel();
        startAutoPlay();
    });
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