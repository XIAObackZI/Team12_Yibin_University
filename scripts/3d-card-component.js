// 3D Card Component - 基于Aceternity UI的3D卡片效果
// https://ui.aceternity.com/components/3d-card-effect

class ThreeDCard {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) {
      console.error('无法找到3D卡片容器元素');
      return;
    }

    // 默认选项
    this.options = {
      rotationIntensity: options.rotationIntensity || 15,
      floatIntensity: options.floatIntensity || 30,
      shadowIntensity: options.shadowIntensity || 0.5,
      className: options.className || ''
    };

    // 用于平滑处理的状态
    this.currentRotateX = 0;
    this.currentRotateY = 0;
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    this.frameId = null;

    this.init();
  }

  init() {
    // 创建卡片容器
    const cardContainer = document.createElement('div');
    cardContainer.className = `card-container ${this.options.className}`;
    cardContainer.style.perspective = '1500px';
    cardContainer.style.width = '100%';
    cardContainer.style.height = '100%';
    cardContainer.style.display = 'flex';
    cardContainer.style.justifyContent = 'center';
    cardContainer.style.alignItems = 'center';
    cardContainer.style.transformStyle = 'preserve-3d';
    
    // 创建卡片主体
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body relative group/card bg-gray-50 dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto h-auto rounded-xl p-6 border';
    cardBody.style.transformStyle = 'preserve-3d';
    cardBody.style.transition = 'transform 0.15s ease';
    cardBody.style.willChange = 'transform';
    
    // 转换原始内容为卡片项
    const originalContent = this.element.innerHTML;
    
    // 查找具有data-translatez属性的元素并设置z轴位置
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalContent;
    
    const translateZElements = tempDiv.querySelectorAll('[data-translatez]');
    translateZElements.forEach(el => {
      const zValue = el.dataset.translatez;
      if (zValue) {
        el.style.transform = `translateZ(${zValue}px)`;
        el.style.transformStyle = 'preserve-3d';
        // 添加will-change优化
        el.style.willChange = 'transform';
        el.style.transition = 'transform 0.15s ease';
      }
    });
    
    cardBody.innerHTML = tempDiv.innerHTML;
    
    // 清空原始容器
    this.element.innerHTML = '';
    
    // 构建组件结构
    cardContainer.appendChild(cardBody);
    this.element.appendChild(cardContainer);
    
    // 存储引用
    this.cardBody = cardBody;
    this.cardContainer = cardContainer;
    
    // 添加事件监听
    this.addEventListeners();
  }
  
  addEventListeners() {
    // 鼠标移动事件，实现3D旋转效果
    this.cardContainer.addEventListener('mousemove', this.handleMouseMove.bind(this));
    
    // 鼠标离开事件，重置卡片旋转
    this.cardContainer.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    
    // 鼠标进入事件
    this.cardContainer.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    
    // 开始帧动画
    this.startAnimation();
  }
  
  handleMouseMove(e) {
    const rect = this.cardContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // 计算目标旋转角度
    this.targetRotateX = (this.options.rotationIntensity * (mouseY - centerY)) / (rect.height / 2) * -1;
    this.targetRotateY = (this.options.rotationIntensity * (mouseX - centerX)) / (rect.width / 2);
    
    // 计算内部元素的变换
    const translateZElements = this.cardBody.querySelectorAll('[data-translatez]');
    translateZElements.forEach(el => {
      const zValue = parseInt(el.dataset.translatez) || 0;
      const intensity = this.options.floatIntensity * 0.03;
      
      const translateX = (intensity * (mouseX - centerX));
      const translateY = (intensity * (mouseY - centerY) * -1);
      
      el.style.transform = `translateZ(${zValue}px) translateX(${translateX}px) translateY(${translateY}px)`;
    });
  }
  
  handleMouseLeave() {
    this.targetRotateX = 0;
    this.targetRotateY = 0;
    
    // 重置卡片内部元素位置
    const translateZElements = this.cardBody.querySelectorAll('[data-translatez]');
    translateZElements.forEach(el => {
      const zValue = parseInt(el.dataset.translatez) || 0;
      el.style.transform = `translateZ(${zValue}px)`;
    });
  }
  
  handleMouseEnter() {
    // 鼠标进入时保持当前旋转角度作为起点
    const style = window.getComputedStyle(this.cardBody);
    const transform = style.transform || style.webkitTransform;
    
    if (transform !== 'none') {
      const matrix = new DOMMatrix(transform);
      // 重置当前角度为初始状态
      this.currentRotateX = 0;
      this.currentRotateY = 0;
    }
  }
  
  startAnimation() {
    // 使用requestAnimationFrame进行平滑动画
    const animate = () => {
      // 平滑过渡到目标角度
      this.currentRotateX += (this.targetRotateX - this.currentRotateX) * 0.1;
      this.currentRotateY += (this.targetRotateY - this.currentRotateY) * 0.1;
      
      // 应用变换
      this.cardBody.style.transform = `rotateX(${this.currentRotateX}deg) rotateY(${this.currentRotateY}deg)`;
      
      // 继续下一帧
      this.frameId = requestAnimationFrame(animate);
    };
    
    // 开始动画循环
    this.frameId = requestAnimationFrame(animate);
  }
  
  // 清理方法，防止内存泄漏
  destroy() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    
    this.cardContainer.removeEventListener('mousemove', this.handleMouseMove);
    this.cardContainer.removeEventListener('mouseleave', this.handleMouseLeave);
    this.cardContainer.removeEventListener('mouseenter', this.handleMouseEnter);
  }
}

// 自动初始化所有具有data-aceternity-card属性的元素
document.addEventListener('DOMContentLoaded', () => {
  const cardElements = document.querySelectorAll('[data-aceternity-card]');
  cardElements.forEach(element => {
    // 解析自定义选项
    const options = {};
    
    if (element.dataset.rotationIntensity) {
      options.rotationIntensity = parseFloat(element.dataset.rotationIntensity);
    }
    
    if (element.dataset.floatIntensity) {
      options.floatIntensity = parseFloat(element.dataset.floatIntensity);
    }
    
    if (element.dataset.shadowIntensity) {
      options.shadowIntensity = parseFloat(element.dataset.shadowIntensity);
    }
    
    // 创建3D卡片实例
    const card = new ThreeDCard(element, options);
    
    // 保存实例到元素上，以便可能的后续清理
    element._card = card;
  });
  
  // 添加页面可见性变化监听，优化性能
  document.addEventListener('visibilitychange', () => {
    cardElements.forEach(element => {
      if (element._card) {
        if (document.hidden) {
          cancelAnimationFrame(element._card.frameId);
        } else {
          element._card.startAnimation();
        }
      }
    });
  });
}); 