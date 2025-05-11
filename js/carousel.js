export { InfiniteCarousel };

class InfiniteCarousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.carousel__track');
    this.slides = Array.from(container.querySelectorAll('.carousel__slide'));
    this.indicatorsContainer = container.querySelector('.carousel__indicators');
    this.currentIndex = 1;
    this.autoPlayInterval = null;
    this.swipeStartX = 0;
    this.isTransitioning = false;
    this.totalRealSlides = this.slides.length - 2; // Количество основных слайдов

    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    
    // Включаем анимацию после первого рендера
    requestAnimationFrame(() => {
      this.track.classList.add('animated');
    });

    this.init();

    setTimeout(() => {
      container.classList.add('initialized');
    }, 50);
  }

  init() {
    // Создание индикаторов для основных слайдов
    for(let i = 0; i < this.totalRealSlides; i++) {
		const indicator = document.createElement('div');
		indicator.classList.add('carousel__indicator');
		if(i === 0) indicator.classList.add('active');
		indicator.addEventListener('click', () => this.goToSlide(i));
		this.indicatorsContainer.appendChild(indicator);
	  }

    // Навигационные кнопки
    this.container
      .querySelector(".carousel__btn_prev")
      .addEventListener("click", () => this.prevSlide());
    this.container
      .querySelector(".carousel__btn_next")
      .addEventListener("click", () => this.nextSlide());

    // Свайпы
    this.container.addEventListener("touchstart", (e) =>
      this.handleTouchStart(e)
    );
    this.container.addEventListener("touchmove", (e) =>
      this.handleTouchMove(e)
    );
    this.container.addEventListener("touchend", (e) => this.handleTouchEnd(e));

    // Обработчик завершения анимации
    this.track.addEventListener("transitionend", () => this.checkInfinite());

    // Автоплей
    this.startAutoPlay();
  }

  updateSlide() {
    this.track.style.transition = "transform 0.5s ease-in-out";
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    this.updateIndicators();
    // Обновление индикаторов (игнорируем клоны)
    if (this.currentIndex >= 1 && this.currentIndex <= this.slides.length - 2) {
      const indicators =
        this.indicatorsContainer.querySelectorAll(".carousel__indicator");
      indicators.forEach((indicator, i) => {
        indicator.classList.toggle("active", i === this.currentIndex - 1);
      });
    }
    // this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    // this.updateIndicators();
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.currentIndex++;
    this.updateSlide();
  }

  prevSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.currentIndex--;
    this.updateSlide();
  }

  checkInfinite() {
    this.isTransitioning = false;
    
    if(this.currentIndex === this.slides.length - 1) {
      this.track.classList.remove('animated'); // Отключаем анимацию
      this.currentIndex = 1;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      
      requestAnimationFrame(() => {
        this.track.classList.add('animated'); // Включаем обратно
      });
    }
    // Аналогично для случая currentIndex === 0
  }

  goToSlide(index) {
    this.currentIndex = index + 1; // Корректируем индекс для трека
    this.updateSlide();
    this.resetAutoPlay();
  }

  handleTouchStart(e) {
    this.swipeStartX = e.touches[0].clientX;
    this.track.style.transition = "none";
  }

  handleTouchMove(e) {
    if (!this.swipeStartX) return;

    const currentX = e.touches[0].clientX;
    const diff = this.swipeStartX - currentX;

    // Временно смещаем трек для эффекта перетаскивания
    this.track.style.transform = `translateX(calc(-${
      this.currentIndex * 100
    }% - ${diff}px))`;
  }

  handleTouchEnd(e) {
    if (!this.swipeStartX) return;

    const endX = e.changedTouches[0].clientX;
    const diff = this.swipeStartX - endX;

    if (Math.abs(diff) > 50) {
      diff > 0 ? this.nextSlide() : this.prevSlide();
    } else {
      // Если свайп был слишком коротким, возвращаем на место
      this.track.style.transition = "transform 0.5s ease-in-out";
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    this.swipeStartX = null;
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
  }

  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }

  updateIndicators() {
	const realIndex = this.getRealIndex();
    const indicators = this.indicatorsContainer.querySelectorAll('.carousel__indicator');
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === realIndex);
    });
  }

  getRealIndex() {
    if(this.currentIndex === 0) return this.totalRealSlides - 1;
    if(this.currentIndex === this.slides.length - 1) return 0;
    return this.currentIndex - 1;
  }

  checkInfinite() {
    this.isTransitioning = false;

    if (this.currentIndex === this.slides.length - 1) {
      this.track.style.transition = "none";
      this.currentIndex = 1;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      this.updateIndicators(); // Явное обновление индикаторов
    } else if (this.currentIndex === 0) {
      this.track.style.transition = "none";
      this.currentIndex = this.slides.length - 2;
      this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
      this.updateIndicators(); // Явное обновление индикаторов
    }

    this.resetAutoPlay();
  }
}
