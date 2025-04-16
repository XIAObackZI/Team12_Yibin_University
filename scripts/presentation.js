// 演示页面脚本

document.addEventListener('DOMContentLoaded', function() {
    // 初始化幻灯片控制
    initSlideControls();
    
    // 初始化原型预览区域
    initPrototypePreview();
    
    // 初始化键盘控制
    initKeyboardControls();
});

// 初始化幻灯片控制
function initSlideControls() {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.querySelector('.progress-bar');
    const slideCounter = document.querySelector('.slide-counter');
    const totalSlides = slides.length;
    let currentSlide = 0;
    
    // 添加控制区域到DOM
    const controlsHTML = `
        <div class="presentation-controls">
            <button class="prev-slide"><i class="fas fa-chevron-left"></i></button>
            <div class="slide-indicators">
                ${Array(totalSlides).fill().map((_, i) => 
                    `<span class="indicator ${i === 0 ? 'active' : ''}"></span>`
                ).join('')}
            </div>
            <button class="next-slide"><i class="fas fa-chevron-right"></i></button>
        </div>
    `;
    
    document.querySelector('.presentation-container').insertAdjacentHTML('afterend', controlsHTML);
    
    // 获取控制元素
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    // 更新幻灯片状态
    function updateSlideState() {
        // 更新活动幻灯片
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // 更新进度条
        const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        
        // 更新计数器
        slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        
        // 更新指示器
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // 更新原型预览区域
        updatePrototypePreview(currentSlide);
    }
    
    // 下一张幻灯片
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlideState();
        }
    }
    
    // 上一张幻灯片
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlideState();
        }
    }
    
    // 添加事件监听器
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);
    
    // 指示器点击事件
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            updateSlideState();
        });
    });
}

// 初始化原型预览区域
function initPrototypePreview() {
    // 创建原型预览区域
    const previewHTML = `
        <div class="prototype-preview">
            <div class="preview-header">
                <h3>网页原型预览</h3>
                <div class="preview-controls">
                    <button class="highlight-btn"><i class="fas fa-highlighter"></i></button>
                    <button class="fullscreen-btn"><i class="fas fa-expand"></i></button>
                </div>
            </div>
            <div class="preview-content">
                <iframe src="index.html" title="网页原型预览"></iframe>
            </div>
        </div>
    `;
    
    document.querySelector('.presentation-container').insertAdjacentHTML('beforeend', previewHTML);
    
    // 全屏按钮功能
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    const previewContent = document.querySelector('.preview-content');
    
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            previewContent.requestFullscreen().catch(err => {
                console.error(`全屏错误: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
    
    // 高亮功能
    const highlightBtn = document.querySelector('.highlight-btn');
    const previewFrame = document.querySelector('.preview-content iframe');
    
    highlightBtn.addEventListener('click', () => {
        highlightBtn.classList.toggle('active');
        if (highlightBtn.classList.contains('active')) {
            // 添加高亮模式
            previewFrame.contentWindow.postMessage('enableHighlight', '*');
        } else {
            // 取消高亮模式
            previewFrame.contentWindow.postMessage('disableHighlight', '*');
        }
    });
}

// 更新原型预览区域
function updatePrototypePreview(slideIndex) {
    // 根据当前幻灯片内容，高亮原型预览中的相关部分
    const previewFrame = document.querySelector('.preview-content iframe');
    if (!previewFrame || !previewFrame.contentWindow) return;
    
    // 定义每个幻灯片对应的高亮元素
    const highlightMap = [
        '#hero', // 幻灯片1对应的高亮元素
        'nav', // 幻灯片2对应的高亮元素
        '#projects', // 幻灯片3对应的高亮元素
        '#team', // 幻灯片4对应的高亮元素
        '#contact', // 幻灯片5对应的高亮元素
        'footer' // 幻灯片6对应的高亮元素
    ];
    
    // 发送高亮消息
    if (highlightMap[slideIndex]) {
        previewFrame.contentWindow.postMessage({
            action: 'highlight',
            selector: highlightMap[slideIndex]
        }, '*');
    }
}

// 初始化键盘控制
function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        const prevButton = document.querySelector('.prev-slide');
        const nextButton = document.querySelector('.next-slide');
        
        switch (e.key) {
            case 'ArrowLeft':
                prevButton.click();
                break;
            case 'ArrowRight':
            case ' ':
                nextButton.click();
                break;
        }
    });
}