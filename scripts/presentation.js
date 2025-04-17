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

// 初始化幻灯片控制 - 新版
function initSlideControls() {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.querySelector('.progress-bar');
    const slideCounter = document.querySelector('.slide-counter');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const indicatorDotsContainer = document.querySelector('.slide-indicators'); // 获取指示点容器
    const slideJumperInput = document.getElementById('slide-jumper');
    const jumpToSlideButton = document.getElementById('jump-to-slide');
    const totalSlides = slides.length;
    let currentSlide = 0;

    // 检查必要的元素是否存在
    if (!slides.length || !progressBar || !slideCounter || !prevButton || !nextButton || !indicatorDotsContainer || !slideJumperInput || !jumpToSlideButton) {
        console.error('Presentation controls initialization failed: One or more required elements not found.');
        return; // 如果缺少关键元素，则停止初始化
    }

    // 动态生成指示点
    indicatorDotsContainer.innerHTML = ''; // 清空现有指示点
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('indicator-dot');
        dot.dataset.slide = i;
        // 添加 Tailwind 类以应用基础样式，如果CSS中没有定义的话
        dot.classList.add('w-2.5', 'h-2.5', 'bg-gray-300', 'dark:bg-gray-600', 'rounded-full', 'cursor-pointer', 'transition-all', 'duration-300', 'hover:bg-gray-400', 'dark:hover:bg-gray-500');
        indicatorDotsContainer.appendChild(dot);
    }
    const indicatorDots = indicatorDotsContainer.querySelectorAll('.indicator-dot'); // 获取新生成的指示点

    // 更新幻灯片状态
    function updateSlideState() {
        // 更新活动幻灯片
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        // 更新进度条
        const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = `${progressPercentage}%`;

        // 更新导航计数器
        slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;

        // 更新指示点激活状态
        indicatorDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
            // 更新 Tailwind 类以反映激活状态
            dot.classList.toggle('bg-blue-500', index === currentSlide);
            dot.classList.toggle('dark:bg-blue-400', index === currentSlide);
            dot.classList.toggle('scale-125', index === currentSlide);
            dot.classList.toggle('bg-gray-300', index !== currentSlide);
            dot.classList.toggle('dark:bg-gray-600', index !== currentSlide);
        });

        // 更新按钮禁用状态
        prevButton.disabled = currentSlide === 0;
        nextButton.disabled = currentSlide === totalSlides - 1;

        // 更新跳转输入框的最大值
        slideJumperInput.max = totalSlides;
        // 设置跳转输入框为当前页码
        slideJumperInput.value = currentSlide + 1;

        // 更新原型预览区域
        updatePrototypePreview(currentSlide);
    }

    // 跳转到指定幻灯片
    function goToSlide(slideIndex) {
        // 确保 slideIndex 在有效范围内
        const newIndex = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        if (newIndex !== currentSlide) {
            currentSlide = newIndex;
            updateSlideState();
        }
        // 更新输入框的值，即使没有跳转也同步
        slideJumperInput.value = currentSlide + 1;
    }

    // 下一张幻灯片
    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    // 上一张幻灯片
    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // 添加事件监听器
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // 添加指示点点击事件
    indicatorDots.forEach((dot) => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide, 10));
        });
    });

    // 添加跳转按钮点击事件
    jumpToSlideButton.addEventListener('click', () => {
        const targetSlide = parseInt(slideJumperInput.value, 10) - 1; // 转为0索引
        if (!isNaN(targetSlide)) {
            goToSlide(targetSlide);
        } else {
             // 如果输入无效，可以重置为当前页码
             slideJumperInput.value = currentSlide + 1;
        }
    });

    // 添加跳转输入框回车事件
    slideJumperInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            jumpToSlideButton.click(); // 触发跳转按钮的点击事件
            e.preventDefault(); // 阻止可能的表单提交行为
        }
    });
    
    // 添加跳转输入框输入验证 (可选，限制输入范围)
    slideJumperInput.addEventListener('input', () => {
        let value = parseInt(slideJumperInput.value, 10);
        if (isNaN(value)) {
           // 允许暂时为空或无效，在跳转时处理
        } else if (value < 1) {
            // slideJumperInput.value = 1; // 可以强制设为1
        } else if (value > totalSlides) {
            slideJumperInput.value = totalSlides; // 强制设为最大值
        }
    });

    // 初始状态设置
    updateSlideState();
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
    // 根据当前幻灯片内容，高亮或滚动到原型预览中的相关部分
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
    
    const targetSelector = highlightMap[slideIndex];
    
    // 检查 iframe 是否加载完成且内容可访问
    if (previewFrame && previewFrame.contentWindow && targetSelector) {
        // 尝试发送滚动消息
        previewFrame.contentWindow.postMessage({
            action: 'scrollToElement',
            selector: targetSelector
        }, '*');
        
        // 如果高亮按钮是激活状态，也发送高亮消息
        const highlightBtn = document.querySelector('.highlight-btn');
        if (highlightBtn && highlightBtn.classList.contains('active')) {
            previewFrame.contentWindow.postMessage({
                action: 'highlight',
                selector: targetSelector
            }, '*');
        } else {
             // 如果不高亮，确保移除之前的高亮
             previewFrame.contentWindow.postMessage({ action: 'removeHighlight' }, '*');
        }
    } else {
        console.warn('Preview frame or target selector not available for slide:', slideIndex);
        // 如果 iframe 不可用或没有目标选择器，确保移除高亮
        if (previewFrame && previewFrame.contentWindow) {
             previewFrame.contentWindow.postMessage({ action: 'removeHighlight' }, '*');
        }
    }
}

// 初始化键盘控制
function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        // 防止在输入框内按左右键或空格时切换幻灯片
        if (e.target === document.getElementById('slide-jumper')) {
            // 允许在输入框内使用左右箭头
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                 return;
            }
            // 如果按空格，阻止默认行为（切换幻灯片）
            if (e.key === ' ') {
                // 可以选择阻止空格输入或允许输入
                // e.preventDefault(); // 如果不想在输入框输入空格
                return; // 允许输入空格，但不切换幻灯片
            }
        }

        const prevButton = document.querySelector('.prev-slide');
        const nextButton = document.querySelector('.next-slide');
        
        switch (e.key) {
            case 'ArrowLeft':
                // 检查按钮是否存在且未被禁用
                if (prevButton && !prevButton.disabled) {
                    prevButton.click(); // 模拟点击
                }
                break;
            case 'ArrowRight':
            case ' ': // 保留空格键翻页功能，但在输入框聚焦时已阻止
                // 检查按钮是否存在且未被禁用
                if (nextButton && !nextButton.disabled) {
                    nextButton.click(); // 模拟点击
                }
                break;
        }
    });
}