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
    
    // 初始化返回顶部按钮
    initBackToTop();
    
    // 移动菜单切换功能
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        // 点击切换菜单显示状态
        mobileMenuButton.addEventListener('click', function() {
            mobileMenuButton.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // 设置aria-expanded状态
            const isExpanded = mobileMenuButton.classList.contains('active');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            
            // 防止菜单打开时背景滚动
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // 点击菜单项后自动关闭菜单
        const menuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                mobileMenuButton.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        
        // 点击菜单以外区域关闭菜单
        document.addEventListener('click', function(event) {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(event.target) && 
                !mobileMenuButton.contains(event.target)) {
                
                mobileMenuButton.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }
    
    // 监听滚动事件，当页面滚动时收起移动菜单
    window.addEventListener('scroll', function() {
        if (mobileMenu && mobileMenuButton && mobileMenu.classList.contains('active')) {
            mobileMenuButton.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
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

// 初始化返回顶部按钮
function initBackToTop() {
    // 创建返回顶部按钮
    const backToTopBtn = document.createElement('div');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', '返回顶部');
    document.body.appendChild(backToTopBtn);
    
    // 监听滚动事件，显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) { // 滚动超过300px显示按钮
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // 点击按钮返回顶部
    backToTopBtn.addEventListener('click', function() {
        // 平滑滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 针对iOS设备，增加触摸事件支持
    backToTopBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 确保按钮不会和音乐播放器按钮重叠
    const musicPlayerButton = document.querySelector('.music-player-button');
    if (musicPlayerButton) {
        // 调整返回顶部按钮的位置
        backToTopBtn.style.bottom = '80px';
    }
}