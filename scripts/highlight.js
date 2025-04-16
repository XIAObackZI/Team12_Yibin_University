// 高亮功能脚本

// 监听来自presentation.js的消息
window.addEventListener('message', function(event) {
    // 检查消息来源
    if (event.data === 'enableHighlight') {
        // 启用高亮模式
        enableHighlightMode();
    } else if (event.data === 'disableHighlight') {
        // 禁用高亮模式
        disableHighlightMode();
    } else if (typeof event.data === 'object' && event.data.action === 'highlight') {
        // 高亮特定元素
        highlightElement(event.data.selector);
    }
});

// 启用高亮模式
function enableHighlightMode() {
    // 添加高亮模式样式
    const style = document.createElement('style');
    style.id = 'highlight-mode-style';
    style.textContent = `
        body {
            position: relative;
        }
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            pointer-events: none;
        }
        .highlight-element {
            position: relative;
            z-index: 1001;
            box-shadow: 0 0 0 2px #f39c12, 0 0 10px 5px rgba(243, 156, 18, 0.5);
            transition: box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// 禁用高亮模式
function disableHighlightMode() {
    // 移除高亮模式样式
    const style = document.getElementById('highlight-mode-style');
    if (style) {
        style.remove();
    }
    
    // 移除所有高亮元素的类
    const highlightedElements = document.querySelectorAll('.highlight-element');
    highlightedElements.forEach(element => {
        element.classList.remove('highlight-element');
    });
}

// 高亮特定元素
function highlightElement(selector) {
    // 首先移除之前的高亮
    const highlightedElements = document.querySelectorAll('.highlight-element');
    highlightedElements.forEach(element => {
        element.classList.remove('highlight-element');
    });
    
    // 高亮新元素
    const element = document.querySelector(selector);
    if (element) {
        element.classList.add('highlight-element');
        
        // 滚动到该元素
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}