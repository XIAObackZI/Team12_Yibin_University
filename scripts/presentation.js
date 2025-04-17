// 演示页面脚本

document.addEventListener('DOMContentLoaded', function() {
    // 初始化幻灯片控制
    initSlideControls();
    
    // 初始化原型预览区域
    initPrototypePreview();
    
    // 初始化键盘控制
    initKeyboardControls();
    
    // 初始化设备选择器
    initDeviceSelector();
});

// 初始化设备选择器
function initDeviceSelector() {
    const deviceButtons = document.querySelectorAll('.device-btn');
    const previewFrame = document.querySelector('.preview-frame');
    
    deviceButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的激活状态
            deviceButtons.forEach(btn => btn.classList.remove('active'));
            
            // 激活当前按钮
            button.classList.add('active');
            
            // 获取设备类型
            const deviceType = button.getAttribute('data-device');
            
            // 移除所有设备类
            previewFrame.classList.remove('desktop', 'tablet', 'mobile');
            
            // 添加选定的设备类
            previewFrame.classList.add(deviceType);
        });
    });
}

// 初始化幻灯片控制
function initSlideControls() {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.querySelector('.progress-bar');
    const slideCounter = document.querySelector('.slide-counter');
    const totalSlides = slides.length;
    let currentSlide = 0;
    
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
        
        // 更新缩略图激活状态
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            if (index === currentSlide) {
                thumbnail.classList.add('active');
            } else {
                thumbnail.classList.remove('active');
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
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // 添加缩略图点击事件
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentSlide = index;
            updateSlideState();
        });
    });
}

// 初始化原型预览区域
function initPrototypePreview() {
    // 高亮按钮功能
    const highlightBtn = document.querySelector('.highlight-btn');
    const previewFrame = document.querySelector('.preview-frame iframe');
    
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
    
    // 全屏按钮功能
    const fullscreenBtn = document.querySelector('.fullscreen-btn');
    
    fullscreenBtn.addEventListener('click', () => {
        const previewContainer = document.querySelector('.prototype-preview');
        if (!document.fullscreenElement) {
            previewContainer.requestFullscreen().catch(err => {
                console.error(`全屏错误: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });
}

// 更新原型预览区域
function updatePrototypePreview(slideIndex) {
    // 根据当前幻灯片内容，高亮原型预览中的相关部分
    const previewFrame = document.querySelector('.preview-frame iframe');
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