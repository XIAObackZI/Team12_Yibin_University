// 主脚本文件

document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏滚动效果
    initNavScroll();
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 初始化鼠标跟随效果
    initCustomCursor();
    
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

// 鼠标跟随效果
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // 创建粒子效果
        createParticle(e.clientX, e.clientY);
    });
    
    // 鼠标悬停在链接和按钮上时的效果
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'rgba(52, 152, 219, 0.2)';
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.style.width = '20px';
            cursor.style.height = '20px';
            cursor.style.backgroundColor = 'rgba(52, 152, 219, 0.5)';
        });
    });
}

// 创建粒子效果
function createParticle(x, y) {
    // 限制粒子数量，避免性能问题
    if (Math.random() > 0.9) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // 随机移动方向
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30 + 10;
        particle.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
        
        document.body.appendChild(particle);
        
        // 粒子动画结束后移除
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
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