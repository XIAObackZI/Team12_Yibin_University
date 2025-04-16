// page-transitions.js - 页面过渡动画效果 (优化版)

class PageTransition {
    constructor() {
        this.initialized = false;
        this.preloadedPages = new Map();
        this.currentAnimation = null;
        this.init();
    }
    
    init() {
        if (this.initialized) return;
        
        // 创建过渡动画容器
        this.createTransitionContainer();
        
        // 监听团队链接点击
        this.attachTeamLinkListeners();
        
        // 预加载团队页面
        this.preloadPage('team.html', 'team-page');
        
        this.initialized = true;
        console.log('页面过渡效果初始化完成');
    }
    
    createTransitionContainer() {
        // 创建CSS样式 - 使用一次性插入样式表的方式，减少DOM操作
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            #page-transition-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                background: linear-gradient(135deg, #0f172a, #1e293b);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                will-change: opacity, transform;
            }
            
            .logo-container {
                position: relative;
                width: 150px;
                height: 150px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(79, 70, 229, 0.8) 0%, rgba(45, 38, 183, 0.5) 70%, transparent 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                box-shadow: 0 0 30px rgba(79, 70, 229, 0.6);
                transform: scale(0);
                transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                will-change: transform, opacity;
            }
            
            .logo-halo {
                position: absolute;
                border-radius: 50%;
                will-change: transform;
            }
            
            .logo-halo-1 {
                top: -10px;
                left: -10px;
                right: -10px;
                bottom: -10px;
                border: 2px dashed rgba(255, 255, 255, 0.4);
                animation: rotateSlow 10s linear infinite;
            }
            
            .logo-halo-2 {
                top: -20px;
                left: -20px;
                right: -20px;
                bottom: -20px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: rotateReverse 15s linear infinite;
            }
            
            .logo-inner {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 24px;
                font-weight: bold;
                color: #3b82f6;
                box-shadow: 0 0 20px rgba(255,255,255,0.5);
                position: relative;
                overflow: hidden;
                will-change: transform;
            }
            
            .logo-text {
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                animation: spinOpp 5s linear infinite;
                will-change: transform;
            }
            
            .logo-flare {
                position: absolute;
                top: -50%;
                left: -50%;
                width: 80px;
                height: 200%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
                transform: rotate(45deg);
                animation: flareAnim 3s infinite;
                pointer-events: none;
                will-change: transform;
            }
            
            .progress-container {
                width: 300px;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                margin-top: 30px;
                overflow: hidden;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
                will-change: opacity, transform;
            }
            
            .progress-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                border-radius: 2px;
                transition: width 0.1s linear;
                will-change: width;
            }
            
            .loading-text {
                color: rgba(255, 255, 255, 0.8);
                margin-top: 15px;
                font-size: 14px;
                font-weight: 500;
                letter-spacing: 1px;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
                will-change: opacity, transform;
            }
            
            /* 关键帧动画 */
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes spinOpp {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(-360deg); }
            }
            
            @keyframes rotateSlow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes rotateReverse {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(-360deg); }
            }
            
            @keyframes flareAnim {
                0% { transform: rotate(45deg) translateX(-100%); }
                20%, 100% { transform: rotate(45deg) translateX(100%); }
            }
            
            /* 优化后的粒子动画 */
            .transition-particle {
                position: absolute;
                background-color: rgba(255, 255, 255, 0.3);
                opacity: 0;
                border-radius: 50%;
                will-change: transform, opacity;
                animation: fadeScale 2s ease-in-out infinite alternate;
            }
            
            @keyframes fadeScale {
                0% { opacity: 0; transform: scale(0.8) translateY(0); }
                100% { opacity: 0.6; transform: scale(1) translateY(-20px); }
            }
            
            /* 闪光效果 */
            .transition-flash {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: white;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                will-change: opacity;
            }
        `;
        document.head.appendChild(styleSheet);
        
        // 创建主容器
        const transitionContainer = document.createElement('div');
        transitionContainer.id = 'page-transition-container';
        
        // 使用HTML模板字符串一次性插入内容
        transitionContainer.innerHTML = `
            <div class="logo-container">
                <div class="logo-halo logo-halo-1"></div>
                <div class="logo-halo logo-halo-2"></div>
                <div class="logo-inner">
                    <div class="logo-text">
                        <i class="fas fa-pen-fancy" style="font-size: 36px;"></i>
                    </div>
                    <div class="logo-flare"></div>
                </div>
            </div>
            <div class="progress-container">
                <div class="progress-bar"></div>
            </div>
            <div class="loading-text">正在前往探索之旅...</div>
            <div class="transition-flash"></div>
        `;
        
        document.body.appendChild(transitionContainer);
        
        // 存储DOM引用
        this.container = transitionContainer;
        this.logo = transitionContainer.querySelector('.logo-container');
        this.progress = {
            container: transitionContainer.querySelector('.progress-container'),
            bar: transitionContainer.querySelector('.progress-bar')
        };
        this.text = transitionContainer.querySelector('.loading-text');
        this.flash = transitionContainer.querySelector('.transition-flash');
    }
    
    async preloadPage(url, cacheKey) {
        try {
            console.log(`预加载页面: ${url}`);
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`无法加载页面: ${response.statusText}`);
            
            const html = await response.text();
            this.preloadedPages.set(cacheKey, html);
            
            // 解析HTML并预加载关键资源
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // 预加载关键CSS资源
            const cssLinks = Array.from(tempDiv.querySelectorAll('link[rel="stylesheet"]')).slice(0, 3);
            if (cssLinks.length > 0) {
                await Promise.all(cssLinks.map(link => {
                    return new Promise((resolve) => {
                        const preloadLink = document.createElement('link');
                        preloadLink.href = link.href;
                        preloadLink.rel = 'preload';
                        preloadLink.as = 'style';
                        preloadLink.onload = resolve;
                        preloadLink.onerror = resolve;
                        document.head.appendChild(preloadLink);
                    });
                }));
            }
            
            console.log(`页面 ${url} 预加载完成`);
        } catch (error) {
            console.error('预加载页面失败:', error);
        }
    }
    
    attachTeamLinkListeners() {
        // 使用事件委托减少事件监听器数量
        document.addEventListener('click', async (e) => {
            // 查找目标元素
            const teamLink = e.target.closest('[data-pin-href="team.html"], a[href="team.html"], a[href="/team.html"], a[href*="team.html"]');
            if (teamLink) {
                e.preventDefault();
                await this.animateTransition('team.html');
                return;
            }
            
            // 查找包含"团队"文本的链接
            const textLink = e.target.closest('a');
            if (textLink && textLink.textContent.includes('团队')) {
                e.preventDefault();
                await this.animateTransition('team.html');
                return;
            }
        });
    }
    
    async animateTransition(targetUrl) {
        // 防止重复触发
        if (this.currentAnimation) return;
        this.currentAnimation = true;
        
        // 记录滚动位置
        const scrollPosition = window.scrollY;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
        
        // 显示过渡容器
        this.container.style.pointerEvents = 'auto';
        this.container.style.opacity = '1';
        
        // 创建优化后的粒子效果
        this.createOptimizedParticles();
        
        // 中心Logo动画
        setTimeout(() => {
            this.logo.style.transform = 'scale(1)';
        }, 100);
        
        // 文字渐入
        setTimeout(() => {
            this.text.style.opacity = '1';
            this.text.style.transform = 'translateY(0)';
            this.progress.container.style.opacity = '1';
            this.progress.container.style.transform = 'translateY(0)';
        }, 300);
        
        // 进度条真实加载动画
        this.animateProgressBar(targetUrl);
    }
    
    animateProgressBar(targetUrl) {
        let progress = 0;
        let loadTime = Math.random() * 800 + 1200; // 减少加载时间到1.2-2秒
        const startTime = performance.now();
        const endTime = startTime + loadTime;
        
        // 使用requestAnimationFrame优化动画性能
        const updateProgress = (timestamp) => {
            if (timestamp >= endTime) {
                this.progress.bar.style.width = '100%';
                setTimeout(() => {
                    this.completeFinalAnimation(targetUrl);
                }, 300);
                return;
            }
            
            // 使用线性函数替代缓动函数，减少计算量
            progress = ((timestamp - startTime) / loadTime) * 100;
            this.progress.bar.style.width = `${progress}%`;
            requestAnimationFrame(updateProgress);
        };
        
        requestAnimationFrame(updateProgress);
    }
    
    createOptimizedParticles() {
        // 清除容器内现有内容，除了关键元素
        const elementsToKeep = [this.logo, this.progress.container, this.text, this.flash];
        Array.from(this.container.children).forEach(child => {
            if (!elementsToKeep.includes(child) && child.classList.contains('transition-particle')) {
                this.container.removeChild(child);
            }
        });
        
        // 减少粒子数量，从200个减少到30个
        const count = 30;
        const fragment = document.createDocumentFragment(); // 使用文档片段一次性添加所有粒子
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'transition-particle';
            
            // 使用CSS变量设置随机属性，减少内联样式
            const size = Math.random() * 5 + 2;
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation-duration: ${Math.random() * 3 + 2}s;
                animation-delay: ${Math.random() * 0.5}s;
            `;
            
            fragment.appendChild(particle);
        }
        
        this.container.appendChild(fragment);
    }
    
    completeFinalAnimation(targetUrl) {
        // 显示白色闪光效果
        this.flash.style.opacity = '1';
        
        // 直接跳转，简化动画序列
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 300);
    }
}

// 在页面加载时初始化过渡效果
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransition = new PageTransition();
}); 