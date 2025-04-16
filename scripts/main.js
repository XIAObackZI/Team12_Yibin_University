// 主脚本文件

document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏滚动效果
    initNavScroll();
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 初始化鼠标跟随效果
    // initCustomCursor();
    addClickEffectListener();
    
    // 初始化按钮波纹效果
    initRippleEffect();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 移动菜单切换功能
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        // 初始化隐藏菜单
        mobileMenu.style.display = 'none';
        mobileMenu.style.opacity = '0';
        mobileMenu.style.transform = 'translateY(-10px)';
        
        // 点击切换菜单显示状态
        mobileMenuButton.addEventListener('click', function() {
            if (mobileMenu.style.display === 'none') {
                // 显示菜单
                mobileMenu.style.display = 'block';
                setTimeout(() => {
                    mobileMenu.style.opacity = '1';
                    mobileMenu.style.transform = 'translateY(0)';
                }, 10);
            } else {
                // 隐藏菜单
                mobileMenu.style.opacity = '0';
                mobileMenu.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    mobileMenu.style.display = 'none';
                }, 300);
            }
        });
        
        // 点击菜单以外区域关闭菜单
        document.addEventListener('click', function(event) {
            if (mobileMenu.style.display !== 'none' && 
                !mobileMenu.contains(event.target) && 
                !mobileMenuButton.contains(event.target)) {
                
                mobileMenu.style.opacity = '0';
                mobileMenu.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    mobileMenu.style.display = 'none';
                }, 300);
            }
        });
    }
});

// 导航栏滚动效果
function initNavScroll() {
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// 滚动动画
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// 添加点击效果监听器函数
function addClickEffectListener() {
    document.body.addEventListener('click', function(e) {
        // 创建涟漪元素
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        document.body.appendChild(ripple);
        
        // 设置涟漪位置和初始状态
        // 将涟漪中心放在点击位置
        const size = 50; // 初始涟漪较小，方便定位
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - size / 2}px`;
        ripple.style.top = `${e.clientY - size / 2}px`;
        
        // 触发动画 (通过添加/移除类或直接设置样式)
        // 这里使用 requestAnimationFrame 确保样式应用后再添加动画类
        requestAnimationFrame(() => {
            ripple.classList.add('animate');
        });

        // 动画结束后移除元素
        ripple.addEventListener('animationend', function() {
            ripple.remove();
        });
    });

    // 添加必要的 CSS (可以在 CSS 文件中定义，这里为了方便演示)
    const style = document.createElement('style');
    style.textContent = `
        .click-ripple {
            position: fixed;
            border-radius: 50%;
            background-color: rgba(79, 70, 229, 0.6); /* 使用主题色或醒目颜色 */
            transform: scale(0);
            opacity: 1;
            pointer-events: none; /* 确保不影响下方元素交互 */
            z-index: 99999; /* 确保在最顶层 */
        }
        .click-ripple.animate {
            animation: ripple-effect 0.6s ease-out forwards;
        }
        @keyframes ripple-effect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 按钮波纹效果
function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn, .cta-button, .presentation-btn');
    
    buttons.forEach(button => {
        button.classList.add('ripple');
    });
}

// 平滑滚动
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}