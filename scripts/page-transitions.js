// page-transitions.js - 页面过渡动画效果

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
        // this.preloadPage('team.html', 'team-page'); // 暂时禁用预加载，排查问题
        
        this.initialized = true;
        console.log('页面过渡效果初始化完成');
    }
    
    createTransitionContainer() {
        // 创建主容器
        const transitionContainer = document.createElement('div');
        transitionContainer.id = 'page-transition-container';
        transitionContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease;
            background: linear-gradient(135deg, #0f172a, #1e293b);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        `;
        
        // 创建中央Logo区域
        const logoContainer = document.createElement('div');
        logoContainer.className = 'logo-container';
        logoContainer.style.cssText = `
            position: relative;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(79, 70, 229, 0.8) 0%, rgba(45, 38, 183, 0.5) 70%, transparent 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 30px rgba(79, 70, 229, 0.6);
            animation: pulseGlow 2s infinite alternate;
            transform: scale(0);
            transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        `;
        
        // 创建Logo内部
        const logoInner = document.createElement('div');
        logoInner.className = 'logo-inner';
        logoInner.style.cssText = `
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            box-shadow: 0 0 20px rgba(255,255,255,0.5);
            position: relative;
            overflow: hidden;
        `;
        
        // 创建旋转Logo文字
        const logoText = document.createElement('div');
        logoText.className = 'logo-text';
        logoText.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            transform-style: preserve-3d;
        `;
        logoText.innerHTML = `<i class="fas fa-pen-fancy" style="font-size: 36px;"></i>`;
        
        logoInner.appendChild(logoText);
        logoContainer.appendChild(logoInner);
        
        // 创建进度条容器
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.style.cssText = `
            width: 300px;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            margin-top: 40px;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        `;
        
        // 创建进度条
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.cssText = `
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #3b82f6, #8b5cf6);
            border-radius: 3px;
            transition: width 0.5s ease-out;
            box-shadow: 0 0 10px rgba(79, 70, 229, 0.8);
        `;
        
        progressContainer.appendChild(progressBar);
        
        // 创建文字提示
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.style.cssText = `
            color: rgba(255, 255, 255, 0.8);
            margin-top: 15px;
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 1px;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        `;
        loadingText.textContent = '正在前往探索之旅...';
        
        // 添加关键帧动画
        const keyframes = document.createElement('style');
        keyframes.textContent = `
            @keyframes rotateSlow {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes rotateReverse {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(-360deg); }
            }
            
            @keyframes pulseGlow {
                0% { box-shadow: 0 0 30px rgba(79, 70, 229, 0.6); }
                100% { box-shadow: 0 0 50px rgba(99, 102, 241, 0.8); }
            }
        `;
        
        // 将所有元素添加到容器中
        transitionContainer.appendChild(logoContainer);
        transitionContainer.appendChild(progressContainer);
        transitionContainer.appendChild(loadingText);
        document.head.appendChild(keyframes);
        document.body.appendChild(transitionContainer);
        
        this.container = transitionContainer;
        this.logo = logoContainer;
        this.progress = {
            container: progressContainer,
            bar: progressBar
        };
        this.text = loadingText;
    }
    
    async preloadPage(url, cacheKey) {
        try {
            // 显示预加载开始
            console.log(`预加载页面: ${url}`);
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`无法加载页面: ${response.statusText}`);
            
            const html = await response.text();
            
            // 缓存预加载的HTML
            this.preloadedPages.set(cacheKey, html);
            
            // 解析HTML并预加载重要资源
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            
            // 预加载CSS
            const cssLinks = tempDiv.querySelectorAll('link[rel="stylesheet"]');
            const cssPromises = Array.from(cssLinks).map(link => {
                return new Promise((resolve) => {
                    const preloadLink = document.createElement('link');
                    preloadLink.href = link.href;
                    preloadLink.rel = 'preload';
                    preloadLink.as = 'style';
                    preloadLink.onload = resolve;
                    preloadLink.onerror = resolve; // 即使加载失败也继续
                    document.head.appendChild(preloadLink);
                });
            });
            
            // 预加载JS
            const scripts = tempDiv.querySelectorAll('script[src]');
            const scriptPromises = Array.from(scripts).map(script => {
                return new Promise((resolve) => {
                    const preloadScript = document.createElement('link');
                    preloadScript.href = script.src;
                    preloadScript.rel = 'preload';
                    preloadScript.as = 'script';
                    preloadScript.onload = resolve;
                    preloadScript.onerror = resolve; // 即使加载失败也继续
                    document.head.appendChild(preloadScript);
                });
            });
            
            // 预加载重要图片
            const images = tempDiv.querySelectorAll('img[src]');
            const imagePromises = Array.from(images).map(img => {
                return new Promise((resolve) => {
                    const imgLoader = new Image();
                    imgLoader.onload = resolve;
                    imgLoader.onerror = resolve; // 即使加载失败也继续
                    imgLoader.src = img.src;
                });
            });
            
            // 等待所有资源预加载完成
            await Promise.all([...cssPromises, ...scriptPromises, ...imagePromises]);
            
            console.log(`页面 ${url} 预加载完成`);
        } catch (error) {
            console.error('预加载页面失败:', error);
        }
    }
    
    attachTeamLinkListeners() {
        // 监听3D Pin组件的团队链接点击
        document.addEventListener('click', async (e) => {
            // 查找符合条件的目标元素 - 比如3D Pin链接
            const pinLink = e.target.closest('[data-pin-href="team.html"]');
            if (pinLink) {
                e.preventDefault();
                await this.animateTransition('team.html');
                return;
            }
            
            // 普通团队链接
            const teamLinks = document.querySelectorAll('a[href="team.html"], a[href="/team.html"], a[href*="team.html"]');
            for (const link of teamLinks) {
                if (link.contains(e.target)) {
                    e.preventDefault();
                    await this.animateTransition('team.html');
                    return;
                }
            }
            
            // 查找包含"团队"文本的链接
            const allLinks = document.querySelectorAll('a');
            for (const link of allLinks) {
                if (link.textContent.includes('团队') && link.contains(e.target)) {
                    e.preventDefault();
                    await this.animateTransition('team.html');
                    return;
                }
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
        
        // 背景渐变和模糊效果
        setTimeout(() => {
            this.container.style.background = 'rgba(0,0,0,0.9)';
            this.container.style.backdropFilter = 'blur(10px)';
        }, 50);
        
        // 播放声音效果 (可选)
        this.playTransitionSound();
        
        // 中心Logo动画
        setTimeout(() => {
            this.logo.style.transform = 'scale(1) rotate(360deg)';
            this.logo.style.opacity = '1';
        }, 200);
        
        // 文字渐入
        setTimeout(() => {
            this.text.style.opacity = '1';
            this.text.style.transform = 'translateY(0)';
        }, 400);
        
        // 使用 CSS 过渡动画代替 JS 驱动的进度条
        const progressBar = document.querySelector('#page-transition-container .progress-bar');
        if (progressBar) {
            progressBar.style.width = '100%'; // 直接设置目标宽度，让 CSS 过渡生效
        }
        
        // 等待动画和页面加载 (需要调整时间或使用其他机制)
        // 这里的延迟需要基于 CSS 动画时间和页面加载预估，或者更可靠的事件监听
        await new Promise(resolve => setTimeout(resolve, 1000)); // 简化延迟，可能需要调整
        
        // 导航到新页面
        window.location.href = targetUrl; 
    }
    
    playTransitionSound() {
        try {
            const audio = new Audio();
            audio.volume = 0.2; // 低音量
            audio.src = 'assets/sounds/transition.mp3';
            audio.play().catch(e => {
                // 大多数浏览器要求用户交互后才能播放声音
                console.log('音效需要用户交互才能播放', e);
            });
        } catch (e) {
            console.log('不支持音效播放', e);
        }
    }
    
    completeFinalAnimation(targetUrl) {
        // 添加震感效果
        this.container.style.animation = 'shakeEffect 0.5s forwards';
        
        // 添加震感动画
        const shakeStyle = document.createElement('style');
        shakeStyle.textContent = `
            @keyframes shakeEffect {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(shakeStyle);
        
        // 添加声音效果
        const transitionSound = new Audio('assets/sounds/transition.mp3');
        try {
            transitionSound.volume = 0.4;
            transitionSound.play().catch(e => console.log('声音播放被浏览器阻止，需要用户交互'));
        } catch(e) {
            console.log('声音播放失败:', e);
        }
        
        // 显示震感效果然后跳转
        setTimeout(() => {
            this.logo.style.transform = 'scale(20)';
            this.logo.style.opacity = '0.2';
            this.text.style.opacity = '0';
            
            // 白闪效果
            const flash = document.createElement('div');
            flash.className = 'absolute inset-0 bg-white';
            flash.style.opacity = '0';
            this.container.appendChild(flash);
            
            setTimeout(() => {
                flash.style.transition = 'opacity 0.5s ease-in-out';
                flash.style.opacity = '1';
                
                // 页面跳转
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 400);
            }, 400);
        }, 400);
    }
}

// 在页面加载时初始化过渡效果
document.addEventListener('DOMContentLoaded', () => {
    window.pageTransition = new PageTransition();
}); 