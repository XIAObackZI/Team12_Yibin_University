// page-transitions.js - 页面过渡动画效果

class PageTransition {
    constructor() {
        this.initialized = false;
        this.preloadedPages = new Map();
        this.currentAnimation = null;
        this.loadingUrls = new Set(); // 添加loadingUrls集合
        this.pageCache = new Map(); // 添加pageCache映射
        this.init();
    }
    
    init() {
        if (this.initialized) return;
        
        // 创建过渡动画容器
        this.createTransitionContainer();
        
        // 监听团队链接点击
        this.attachTeamLinkListeners();
        
        // 预加载团队页面
        this.preloadPage('other_pages/team.html', 'team-page');
        
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
        
        // 创建一个内部容器，确保内容完美居中
        const innerContainer = document.createElement('div');
        innerContainer.className = 'transition-inner-container';
        innerContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            max-width: 320px; /* 限制最大宽度确保在大屏幕上不会过宽 */
            margin: 0 auto;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); /* 绝对定位的完美居中方式 */
        `;
        
        // 创建中央Logo区域
        const logoContainer = document.createElement('div');
        logoContainer.className = 'logo-container';
        logoContainer.style.cssText = `
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(79, 70, 229, 0.8) 0%, rgba(45, 38, 183, 0.5) 70%, transparent 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 30px rgba(79, 70, 229, 0.6);
            animation: pulseGlow 2s infinite alternate;
            transform: scale(0);
            transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            margin: 0 auto 20px auto;
        `;
        
        // 创建Logo内部
        const logoInner = document.createElement('div');
        logoInner.className = 'logo-inner';
        logoInner.style.cssText = `
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            font-weight: bold;
            color: #3b82f6;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
            box-shadow: 0 0 15px rgba(255,255,255,0.5);
            position: relative;
            overflow: hidden;
        `;
        
        // 创建Logo文字/图标
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
        logoText.innerHTML = `<i class="fas fa-pen-fancy" style="font-size: 24px;"></i>`;
        
        logoInner.appendChild(logoText);
        logoContainer.appendChild(logoInner);
        
        // 创建进度条容器
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.style.cssText = `
            width: 200px;
            height: 6px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            overflow: hidden;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
            margin: 0 auto;
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
            transition: opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s;
            text-align: center;
            width: 100%;
        `;
        loadingText.textContent = '探索团队中...';
        
        // 添加关键帧动画
        const keyframes = document.createElement('style');
        keyframes.textContent = `
            @keyframes pulseGlow {
                0% { box-shadow: 0 0 20px rgba(79, 70, 229, 0.6); }
                100% { box-shadow: 0 0 35px rgba(99, 102, 241, 0.8), 0 0 5px rgba(255,255,255,0.3); }
            }
        `;
        document.head.appendChild(keyframes);
        
        // 将所有元素添加到内部容器
        innerContainer.appendChild(logoContainer);
        innerContainer.appendChild(progressContainer);
        innerContainer.appendChild(loadingText);
        
        // 将内部容器添加到主容器
        transitionContainer.appendChild(innerContainer);
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
            // 检查URL是否合法
            if (!url || typeof url !== 'string') {
                console.error('无效的URL:', url);
                return null;
            }
            
            // 防止循环请求当前页面
            if (url === window.location.href || url === window.location.pathname) {
                console.warn('跳过预加载当前页面');
                return null;
            }
            
            // 移除URL中的锚点
            const cleanUrl = url.split('#')[0];
            
            // 非HTML页面不预加载
            if (!cleanUrl.endsWith('.html') && !cleanUrl.endsWith('/')) {
                console.warn('非HTML页面不预加载:', cleanUrl);
                return null;
            }
            
            // 如果正在加载或已存在缓存，不重复加载
            if (this.loadingUrls.has(cleanUrl) || this.pageCache.has(cacheKey || cleanUrl)) {
                console.warn('已在加载或已有缓存, 跳过预加载:', cleanUrl);
                return this.pageCache.get(cacheKey || cleanUrl);
            }
            
            // 标记为正在加载
            this.loadingUrls.add(cleanUrl);
            
            console.log('预加载页面:', cleanUrl);
            
            // 请求页面
            const response = await fetch(cleanUrl, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'text/html'
                },
                // cache: 'no-store' // 使用 no-store 可以强制刷新但会降低性能
            });
            
            if (!response.ok) {
                throw new Error(`预加载失败: ${response.status} ${response.statusText}`);
            }
            
            const html = await response.text();
            
            // 缓存页面
            this.pageCache.set(cacheKey || cleanUrl, html);
            this.loadingUrls.delete(cleanUrl);
            
            console.log('预加载完成:', cleanUrl);
            return html;
        } catch (error) {
            console.error('预加载出错:', error);
            this.loadingUrls.delete(url);
            return null;
        }
    }
    
    initializePreloads() {
        // 预加载可能会跳转到的页面
        this.preloadPage('other_pages/team.html', 'team-page');
    }
    
    attachTeamLinkListeners() {
        // 监听3D Pin组件的团队链接点击
        document.addEventListener('click', async (e) => {
            // 查找符合条件的目标元素 - 比如3D Pin链接
            const pinLink = e.target.closest('[data-pin-href="other_pages/team.html"]');
            if (pinLink) {
                e.preventDefault();
                await this.animateTransition('other_pages/team.html');
                return;
            }
            
            // 普通团队链接
            const teamLinks = document.querySelectorAll('a[href="other_pages/team.html"], a[href="/other_pages/team.html"], a[href*="other_pages/team.html"]');
            for (const link of teamLinks) {
                if (link.contains(e.target)) {
                    e.preventDefault();
                    await this.animateTransition('other_pages/team.html');
                    return;
                }
            }
            
            // 查找包含"团队"文本的链接
            const allLinks = document.querySelectorAll('a');
            for (const link of allLinks) {
                if (link.textContent.includes('团队') && link.contains(e.target)) {
                    e.preventDefault();
                    await this.animateTransition('other_pages/team.html');
                    return;
                }
            }
        });
    }
    
    async animateTransition(targetUrl) {
        if (this.currentAnimation) return;
        this.currentAnimation = true;
        
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        const scrollPosition = window.scrollY;
        
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollBarWidth}px`;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';

        // 创建粒子动画容器
        const transitionOverlay = document.createElement('div');
        transitionOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.95);
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transform: translateZ(0);
            will-change: opacity;
            overflow: hidden;
        `;

        // 添加粒子动画样式
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes particleFloat {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                20% { opacity: 1; }
                80% { opacity: 1; }
                100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)); opacity: 0; }
            }
            
            @keyframes iconPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            @keyframes particleWave {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
                100% { transform: translateY(0px); }
            }
        `;
        document.head.appendChild(particleStyle);

        const animationContainer = document.createElement('div');
        animationContainer.style.cssText = `
            text-align: center;
            transform: translateY(20px) scale(0.98);
            opacity: 0;
            transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            will-change: transform, opacity;
            position: relative;
            width: 300px;
            height: 300px;
        `;

        // 创建粒子
        const createParticle = (x, y, color) => {
            const particle = document.createElement('div');
            const angle = Math.random() * 360;
            const distance = 100 + Math.random() * 100;
            const tx = Math.cos(angle * Math.PI / 180) * distance;
            const ty = Math.sin(angle * Math.PI / 180) * distance;
            const rot = Math.random() * 720 - 360;
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 8px;
                height: 8px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                --tx: ${tx}px;
                --ty: ${ty}px;
                --rot: ${rot}deg;
                animation: particleFloat 2s cubic-bezier(0.4, 0, 0.2, 1) forwards,
                           particleWave 3s ease-in-out infinite;
                animation-delay: ${Math.random() * 0.5}s;
                box-shadow: 0 0 10px ${color};
                will-change: transform, opacity;
            `;
            return particle;
        };

        // 创建团队图标容器
        const teamIconContainer = document.createElement('div');
        teamIconContainer.style.cssText = `
            width: 150px;
            height: 150px;
            margin: 0 auto 20px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: iconPulse 2s ease-in-out infinite;
        `;

        const teamIcon = document.createElement('div');
        teamIcon.style.cssText = `
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 0 30px rgba(99, 102, 241, 0.5);
            position: relative;
            z-index: 2;
        `;

        teamIcon.innerHTML = `
            <i class="fas fa-users" style="
                font-size: 40px;
                color: white;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
            "></i>
        `;

        // 添加粒子效果
        const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#3b82f6'];
        for (let i = 0; i < 40; i++) {
            const x = 150 + (Math.random() - 0.5) * 20;
            const y = 150 + (Math.random() - 0.5) * 20;
            const particle = createParticle(x, y, colors[i % colors.length]);
            animationContainer.appendChild(particle);
        }

        teamIconContainer.appendChild(teamIcon);
        animationContainer.appendChild(teamIconContainer);

        const loadingText = document.createElement('div');
        loadingText.style.cssText = `
            color: #fff;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
            will-change: transform, opacity;
            text-shadow: 0 0 10px rgba(99, 102, 241, 0.5);
            position: relative;
            z-index: 2;
        `;
        loadingText.textContent = '探索我们的团队...';

        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            width: 300px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
            will-change: transform, opacity;
            position: relative;
            z-index: 2;
        `;

        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #6366f1, #8b5cf6);
            border-radius: 4px;
            transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
            will-change: width;
            transform: translateZ(0);
            position: relative;
            overflow: hidden;
        `;

        // 添加进度条光效
        const progressGlow = document.createElement('div');
        progressGlow.style.cssText = `
            position: absolute;
            top: 0;
            left: -50%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: progressGlow 1.5s linear infinite;
        `;

        const glowKeyframes = document.createElement('style');
        glowKeyframes.textContent = `
            @keyframes progressGlow {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(400%); }
            }
        `;
        document.head.appendChild(glowKeyframes);

        progressBar.appendChild(progressGlow);
        progressContainer.appendChild(progressBar);
        animationContainer.appendChild(loadingText);
        animationContainer.appendChild(progressContainer);
        transitionOverlay.appendChild(animationContainer);
        document.body.appendChild(transitionOverlay);

        // 第一阶段动画
        await new Promise(resolve => {
            requestAnimationFrame(() => {
                transitionOverlay.style.opacity = '1';
                
                requestAnimationFrame(() => {
                    animationContainer.style.transform = 'translateY(0) scale(1)';
                    animationContainer.style.opacity = '1';
                    loadingText.style.opacity = '1';
                    loadingText.style.transform = 'translateY(0)';
                    progressContainer.style.opacity = '1';
                    progressContainer.style.transform = 'translateY(0)';
                    
                    setTimeout(() => {
                        progressBar.style.width = '100%';
                    }, 100);
                });
            });
            
            setTimeout(resolve, 2000);
        });

        // 优化第二阶段过渡
        const finalOverlay = document.createElement('div');
        finalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            z-index: 10000;
            transform: scale3d(1, 0, 1);
            transform-origin: top;
            transition: transform 1s cubic-bezier(0.645, 0.045, 0.355, 1);
            will-change: transform;
            backface-visibility: hidden;
        `;
        document.body.appendChild(finalOverlay);

        // 第二阶段动画
        await new Promise(resolve => {
            requestAnimationFrame(() => {
                // 先淡出第一阶段动画
                transitionOverlay.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                transitionOverlay.style.opacity = '0';
                
                // 延迟启动第二阶段动画
                setTimeout(() => {
                    finalOverlay.style.transform = 'scale3d(1, 1, 1)';
                    
                    // 添加渐变过渡
                    finalOverlay.style.transition = 'transform 1s cubic-bezier(0.645, 0.045, 0.355, 1), background 0.8s ease';
                    
                    setTimeout(() => {
                        finalOverlay.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
                    }, 500);
                }, 300);
            });
            
            setTimeout(resolve, 1200);
        });

        // 存储过渡状态
        localStorage.setItem('fromPageTransition', 'true');
        localStorage.setItem('scrollBarWidth', scrollBarWidth);

        // 跳转到目标页面
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
    
    // 检查是否从页面过渡进入，如果是则恢复滚动条状态
    if (localStorage.getItem('fromPageTransition') === 'true') {
        const scrollBarWidth = parseInt(localStorage.getItem('scrollBarWidth') || '0', 10);
        
        // 设置临时填充以防止页面左移
        document.body.style.paddingRight = `${scrollBarWidth}px`;
        
        // 短暂延迟后恢复正常
        setTimeout(() => {
            document.body.style.paddingRight = '';
            localStorage.removeItem('fromPageTransition');
            localStorage.removeItem('scrollBarWidth');
        }, 50);
    }
}); 