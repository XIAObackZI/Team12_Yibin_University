class Carousel {
    constructor(container) {
        this.container = container;
        this.slides = container.querySelector('.carousel-slides');
        this.slideItems = container.querySelectorAll('.carousel-slide');
        this.prevBtn = container.querySelector('#prevBtn');
        this.nextBtn = container.querySelector('#nextBtn');
        
        this.currentIndex = 0;
        this.slideCount = this.slideItems.length;
        
        this.init();
    }
    
    init() {
        // 创建指示器
        this.createIndicators();
        
        // 绑定事件
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // 自动播放
        this.startAutoPlay();
        
        // 鼠标悬停时暂停自动播放
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // 触摸事件支持
        this.initTouchEvents();
    }
    
    createIndicators() {
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';
        
        for (let i = 0; i < this.slideCount; i++) {
            const indicator = document.createElement('div');
            indicator.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
            indicator.addEventListener('click', () => this.goToSlide(i));
            indicators.appendChild(indicator);
        }
        
        this.container.appendChild(indicators);
        this.indicators = indicators.children;
    }
    
    updateIndicators() {
        Array.from(this.indicators).forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.slides.style.transform = `translateX(-${index * 100}%)`;
        this.updateIndicators();
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.slideCount;
        this.goToSlide(this.currentIndex);
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
        this.goToSlide(this.currentIndex);
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.next(), 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
    
    initTouchEvents() {
        let startX = 0;
        let currentX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.stopAutoPlay();
        });
        
        this.container.addEventListener('touchmove', (e) => {
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            
            if (Math.abs(diff) > 50) {
                e.preventDefault();
            }
        });
        
        this.container.addEventListener('touchend', (e) => {
            const diff = currentX - startX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.prev();
                } else {
                    this.next();
                }
            }
            
            this.startAutoPlay();
        });
    }
}

// 初始化所有轮播
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(container => new Carousel(container));
}); 