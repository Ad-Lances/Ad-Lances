const slides = document.querySelectorAll("#carrossel img");
const prevBtn = document.querySelector("#carrossel .prev");
const nextBtn = document.querySelector("#carrossel .next");
let index = 0;
let interval;

function showSlide(i) {
    slides.forEach(slide => slide.classList.remove("active"));
    slides[i].classList.add("active");
}

function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
}

function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
}

function startAutoSlide() {
    interval = setInterval(nextSlide, 4000); // muda a cada 4s
}

function stopAutoSlide() {
    clearInterval(interval);
}

prevBtn.addEventListener("click", () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
});

nextBtn.addEventListener("click", () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
});

// inicia
showSlide(index);
    startAutoSlide();
