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
        this.preloadPage('team.html', 'team-page');
        
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
        
        // 添加旋转光环效果
        const halo1 = document.createElement('div');
        halo1.className = 'logo-halo';
        halo1.style.cssText = `
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
            border: 2px dashed rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            animation: rotateSlow 10s linear infinite;
        `;
        
        const halo2 = document.createElement('div');
        halo2.className = 'logo-halo';
        halo2.style.cssText = `
            position: absolute;
            top: -20px;
            left: -20px;
            right: -20px;
            bottom: -20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            animation: rotateReverse 15s linear infinite;
        `;
        
        const halo3 = document.createElement('div');
        halo3.className = 'logo-halo';
        halo3.style.cssText = `
            position: absolute;
            top: -30px;
            left: -30px;
            right: -30px;
            bottom: -30px;
            border: 3px dotted rgba(99, 102, 241, 0.3);
            border-radius: 50%;
            animation: rotateSlow 20s linear infinite;
        `;
        
        logoContainer.appendChild(halo1);
        logoContainer.appendChild(halo2);
        logoContainer.appendChild(halo3);
        
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
            animation: spin 3s ease-in-out infinite alternate;
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
            animation: spinOpp 5s linear infinite;
            transform-style: preserve-3d;
        `;
        logoText.innerHTML = `<i class="fas fa-pen-fancy" style="font-size: 36px;"></i>`;
        
        // 新增闪光效果
        const logoFlare = document.createElement('div');
        logoFlare.className = 'logo-flare';
        logoFlare.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 80px;
            height: 200%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
            transform: rotate(45deg);
            animation: flareAnim 3s infinite;
            pointer-events: none;
        `;
        
        logoInner.appendChild(logoText);
        logoInner.appendChild(logoFlare);
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
            transition: width 0.1s ease-out;
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
            
            @keyframes pulseGlow {
                0% { box-shadow: 0 0 30px rgba(79, 70, 229, 0.6); }
                100% { box-shadow: 0 0 50px rgba(99, 102, 241, 0.8); }
            }
            
            @keyframes fadeScale {
                0% { opacity: 0; transform: scale(0.8); }
                100% { opacity: 0.8; transform: scale(1); }
            }
            
            @keyframes flareAnim {
                0% { left: -50%; }
                20% { left: 120%; }
                100% { left: 120%; }
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(10deg); }
            }
            
            @keyframes twinkle {
                0%, 100% { opacity: 0.2; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.2); }
            }
            
            @keyframes shakeEffect {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
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
        
        // 创建粒子效果
        this.createParticles();
        
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
        
        // 进度条真实加载动画
        this.animateProgressBar(targetUrl);
    }
    
    animateProgressBar(targetUrl) {
        let progress = 0;
        let loadTime = Math.random() * 1000 + 2000; // 2-3秒的加载时间
        const startTime = Date.now();
        const endTime = startTime + loadTime;
        
        const updateProgress = () => {
            const now = Date.now();
            if (now >= endTime) {
                this.progress.bar.style.width = '100%';
                setTimeout(() => {
                    this.completeFinalAnimation(targetUrl);
                }, 400);
                return;
            }
            
            // 使用缓动函数使进度更自然
            const timeProgress = (now - startTime) / loadTime;
            // 使用缓动函数 - 开始慢，中间快，结束慢
            progress = this.easeInOutQuad(timeProgress) * 100;
            
            this.progress.bar.style.width = `${progress}%`;
            requestAnimationFrame(updateProgress);
        };
        
        requestAnimationFrame(updateProgress);
    }
    
    // 缓动函数
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
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
    
    createParticles() {
        // 粒子数量
        const count = 200; // 增加粒子数量
        this.container.innerHTML = '';
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            
            // 创建不同类型的粒子: 圆形、方形和星形
            const particleType = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'square' : 'star') : 'circle';
            
            // 随机大小、位置和速度
            const size = Math.random() * 6 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            const opacity = Math.random() * 0.5 + 0.3;
            
            // 基础粒子样式
            let particleStyle = `
                position: absolute;
                top: ${posY}%;
                left: ${posX}%;
                width: ${size}px;
                height: ${size}px;
                background-color: ${Math.random() > 0.5 ? 'rgba(255, 255, 255, ' + opacity + ')' : 'rgba(79, 70, 229, ' + opacity + ')'};
                opacity: 0;
                animation: fadeScale ${duration}s ease-in-out ${delay}s infinite alternate;
                z-index: 1;
            `;
            
            // 根据类型设置特殊样式
            if (particleType === 'circle') {
                particleStyle += 'border-radius: 50%;';
            } else if (particleType === 'square') {
                particleStyle += `
                    transform: rotate(${Math.random() * 45}deg);
                    box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.5);
                `;
            } else if (particleType === 'star') {
                // 星形粒子
                particle.innerHTML = `<i class="fas fa-star" style="font-size: ${size * 1.5}px; color: rgba(255, 223, 0, ${opacity});"></i>`;
                particleStyle += `
                    animation: twinkle ${duration * 0.7}s ease-in-out ${delay}s infinite;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: auto;
                    height: auto;
                `;
            }
            
            particle.style.cssText = particleStyle;
            this.container.appendChild(particle);
        }
        
        // 创建几个特殊的大型粒子
        const specialCount = 5;
        for (let i = 0; i < specialCount; i++) {
            const specialParticle = document.createElement('div');
            const size = Math.random() * 40 + 20;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const opacity = Math.random() * 0.15 + 0.05;
            
            specialParticle.style.cssText = `
                position: absolute;
                top: ${posY}%;
                left: ${posX}%;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(79, 70, 229, ${opacity * 2}), rgba(79, 70, 229, ${opacity}) 70%, transparent);
                border-radius: 50%;
                filter: blur(${size * 0.3}px);
                opacity: 0;
                animation: fadeScale ${Math.random() * 15 + 20}s ease-in-out infinite alternate;
                z-index: 0;
            `;
            
            this.container.appendChild(specialParticle);
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