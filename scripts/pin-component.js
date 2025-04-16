// 3D Pin 组件实现

class PinComponent {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.options = {
            title: options.title || '查看详情',
            href: options.href || '#',
            className: options.className || '',
            containerClassName: options.containerClassName || '',
            width: options.width || 300,
            height: options.height || 300,
            bgColor: options.bgColor || 'bg-black',
            borderColor: options.borderColor || 'border-white/[0.1]',
            hoverBorderColor: options.hoverBorderColor || 'border-white/[0.2]',
            glowColor: options.glowColor || 'cyan',
            titleStyle: options.titleStyle || '',
        };
        
        if (!this.container) {
            console.error('无法找到Pin组件容器');
            return;
        }
        
        this.transform = "translate(-50%,-50%) rotateX(0deg)";
        this.init();
    }
    
    init() {
        // 创建主容器
        const linkElement = document.createElement('a');
        linkElement.href = this.options.href;
        linkElement.className = cn(
            "relative group/pin z-50 cursor-pointer",
            this.options.containerClassName
        );
        
        // 创建3D内容容器
        const perspectiveDiv = document.createElement('div');
        perspectiveDiv.style.perspective = "1000px";
        perspectiveDiv.style.transform = "rotateX(70deg) translateZ(0deg)";
        perspectiveDiv.className = "absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2";
        
        // 调整容器尺寸
        const contentWidth = this.options.width;
        const contentHeight = this.options.height;
        
        // 创建内容框
        const contentDiv = document.createElement('div');
        contentDiv.className = `absolute left-1/2 p-4 top-1/2 flex justify-start items-start rounded-2xl shadow-[0_8px_16px_rgb(0_0_0/0.4)] ${this.options.bgColor} border ${this.options.borderColor} group-hover/pin:${this.options.hoverBorderColor} transition duration-700 overflow-hidden`;
        contentDiv.style.transform = this.transform;
        contentDiv.style.width = `${contentWidth}px`;
        contentDiv.style.height = `${contentHeight}px`;
        contentDiv.style.maxWidth = 'calc(100vw - 32px)';
        
        // 创建内容
        const innerContentDiv = document.createElement('div');
        innerContentDiv.className = cn("relative z-50 w-full h-full", this.options.className);
        innerContentDiv.innerHTML = this.container.innerHTML;
        
        // 清空原容器内容
        this.container.innerHTML = '';
        
        // 添加透视效果
        this.createPerspective(linkElement, this.options.title, this.options.href);
        
        // 构建组件结构
        contentDiv.appendChild(innerContentDiv);
        perspectiveDiv.appendChild(contentDiv);
        linkElement.appendChild(perspectiveDiv);
        
        // 添加到容器
        this.container.appendChild(linkElement);
        
        // 添加事件监听
        linkElement.addEventListener('mouseenter', () => {
            contentDiv.style.transform = "translate(-50%,-50%) rotateX(40deg) scale(0.9)";
        });
        
        linkElement.addEventListener('mouseleave', () => {
            contentDiv.style.transform = "translate(-50%,-50%) rotateX(0deg) scale(1)";
        });
    }
    
    createPerspective(container, title, href) {
        const pinPerspective = document.createElement('div');
        pinPerspective.className = "pointer-events-none w-full h-full flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition duration-500";
        
        const innerDiv = document.createElement('div');
        innerDiv.className = "w-full h-full -mt-7 flex-none inset-0";
        
        // 创建标题
        const titleContainer = document.createElement('div');
        titleContainer.className = "absolute top-0 inset-x-0 flex justify-center";
        
        const titleLink = document.createElement('a');
        titleLink.href = href;
        titleLink.className = cn("relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-1 px-4 ring-1 ring-white/10", this.options.titleStyle);
        
        const titleSpan = document.createElement('span');
        titleSpan.className = "relative z-20 text-white text-sm font-bold inline-block py-0.5";
        titleSpan.textContent = title;
        
        const titleBottomBorder = document.createElement('span');
        titleBottomBorder.className = `absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-${this.options.glowColor}-400/0 via-${this.options.glowColor}-400/90 to-${this.options.glowColor}-400/0 transition-opacity duration-500 group-hover/btn:opacity-40`;
        
        titleLink.appendChild(titleSpan);
        titleLink.appendChild(titleBottomBorder);
        titleContainer.appendChild(titleLink);
        
        // 创建透视容器
        const perspectiveContainer = document.createElement('div');
        perspectiveContainer.style.perspective = "1000px";
        perspectiveContainer.style.transform = "rotateX(70deg) translateZ(0)";
        perspectiveContainer.className = "absolute left-1/2 top-1/2 ml-[0.09375rem] mt-4 -translate-x-1/2 -translate-y-1/2";
        
        // 创建动画圆
        for (let i = 0; i < 3; i++) {
            const circle = document.createElement('div');
            circle.className = `absolute left-1/2 top-1/2 h-[11.25rem] w-[11.25rem] rounded-[50%] bg-${this.options.glowColor}-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]`;
            
            // 设置动画
            this.animateElement(circle, 6, i * 2);
            
            perspectiveContainer.appendChild(circle);
        }
        
        // 创建光线效果
        const gradientLine1 = document.createElement('div');
        gradientLine1.className = `absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-${this.options.glowColor}-500 translate-y-[14px] w-px h-20 group-hover/pin:h-40 blur-[2px]`;
        
        const gradientLine2 = document.createElement('div');
        gradientLine2.className = `absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-${this.options.glowColor}-500 translate-y-[14px] w-px h-20 group-hover/pin:h-40`;
        
        const dot1 = document.createElement('div');
        dot1.className = `absolute right-1/2 translate-x-[1.5px] bottom-1/2 bg-${this.options.glowColor}-600 translate-y-[14px] w-[4px] h-[4px] rounded-full z-40 blur-[3px]`;
        
        const dot2 = document.createElement('div');
        dot2.className = `absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-${this.options.glowColor}-300 translate-y-[14px] w-[2px] h-[2px] rounded-full z-40`;
        
        innerDiv.appendChild(titleContainer);
        innerDiv.appendChild(perspectiveContainer);
        innerDiv.appendChild(gradientLine1);
        innerDiv.appendChild(gradientLine2);
        innerDiv.appendChild(dot1);
        innerDiv.appendChild(dot2);
        
        pinPerspective.appendChild(innerDiv);
        container.appendChild(pinPerspective);
    }
    
    animateElement(element, duration, delay) {
        // 初始状态
        element.style.opacity = '0';
        element.style.transform = 'translate(-50%, -50%) scale(0)';
        
        // 动画
        setTimeout(() => {
            this.fadeInOut(element, duration);
        }, delay * 1000);
    }
    
    fadeInOut(element, duration) {
        let startTime;
        
        function animate(time) {
            if (!startTime) startTime = time;
            const elapsed = (time - startTime) / 1000; // 转换为秒
            
            let opacity;
            if (elapsed < duration / 3) {
                // 淡入
                opacity = elapsed / (duration / 3);
            } else if (elapsed < duration * 2 / 3) {
                // 保持
                opacity = 1;
            } else if (elapsed < duration) {
                // 淡出
                opacity = 1 - (elapsed - duration * 2 / 3) / (duration / 3);
            } else {
                // 重置
                opacity = 0;
                startTime = time;
            }
            
            element.style.opacity = opacity;
            element.style.transform = `translate(-50%, -50%) scale(${Math.min(opacity * 1.5, 1)})`;
            
            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
    }
}

// 辅助函数
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

// 自动初始化所有Pin组件
window.addEventListener('DOMContentLoaded', () => {
    const pinContainers = document.querySelectorAll('[data-pin-container]');
    pinContainers.forEach(container => {
        const options = {
            title: container.getAttribute('data-pin-title') || '查看详情',
            href: container.getAttribute('data-pin-href') || '#',
            className: container.getAttribute('data-pin-class') || '',
            containerClassName: container.getAttribute('data-pin-container-class') || '',
            width: parseInt(container.getAttribute('data-pin-width') || 300),
            height: parseInt(container.getAttribute('data-pin-height') || 300),
            bgColor: container.getAttribute('data-pin-bg') || 'bg-black',
            borderColor: container.getAttribute('data-pin-border') || 'border-white/[0.1]',
            hoverBorderColor: container.getAttribute('data-pin-hover-border') || 'border-white/[0.2]',
            glowColor: container.getAttribute('data-pin-glow') || 'cyan',
            titleStyle: container.getAttribute('data-pin-title-style') || '',
        };
        
        new PinComponent(container, options);
    });
}); 