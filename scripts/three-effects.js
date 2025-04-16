// Three.js效果脚本 - 优化版

document.addEventListener('DOMContentLoaded', function() {
    // 不再创建性能控制开关，已移动到导航栏设置中
    // createPerformanceControl();
    
    // 检查是否已禁用效果
    if (localStorage.getItem('disableThreeEffects') === 'true') {
        console.log('Three.js效果已被用户禁用');
        addStaticBackground();
        return;
    }
    
    // 初始化Three.js背景
    initThreeBackground();
    
    // 初始化3D模型
    initAbout3DModel();
});

// 添加性能控制开关 - 已不再使用，但保留代码作为参考
/*
function createPerformanceControl() {
    const controlDiv = document.createElement('div');
    controlDiv.className = 'performance-control';
    controlDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        color: white;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    // 检查当前状态
    const isDisabled = localStorage.getItem('disableThreeEffects') === 'true';
    controlDiv.textContent = isDisabled ? '✓ 标准模式 (无特效)' : '⚡ 切换到标准模式';
    
    // 点击切换特效
    controlDiv.addEventListener('click', function() {
        const currentSetting = localStorage.getItem('disableThreeEffects') === 'true';
        localStorage.setItem('disableThreeEffects', !currentSetting);
        // 提示用户刷新页面
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 10000;
        `;
        message.innerHTML = `
            <p>设置已更改</p>
            <p>正在刷新页面应用新设置...</p>
        `;
        document.body.appendChild(message);
        
        // 短暂延迟后刷新页面
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    });
    
    document.body.appendChild(controlDiv);
}
*/

// 禁用效果时添加简单的静态背景
function addStaticBackground() {
    const backgroundContainer = document.querySelector('.three-js-background');
    if (!backgroundContainer) return;
    
    backgroundContainer.style.cssText = `
        background: linear-gradient(135deg, #1a2a3a, #0f172a);
        position: relative;
        overflow: hidden;
    `;
    
    // 添加一些简单的装饰元素
    for (let i = 0; i < 10; i++) {
        const decoration = document.createElement('div');
        const size = Math.random() * 30 + 10;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        decoration.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255,255,255,0.05);
            top: ${posY}%;
            left: ${posX}%;
        `;
        
        backgroundContainer.appendChild(decoration);
    }
}

// 初始化Three.js背景
function initThreeBackground() {
    // 检查是否存在背景容器
    const backgroundContainer = document.querySelector('.three-js-background');
    if (!backgroundContainer) return;
    
    // 动态加载Three.js库
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = function() {
        createWaveBackground(backgroundContainer);
    };
    document.head.appendChild(script);
}

// 创建波浪背景 - 优化版
function createWaveBackground(container) {
    // 创建场景
    const scene = new THREE.Scene();
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // 创建渲染器 - 禁用抗锯齿提高性能
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: false 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // 限制像素比以提高性能
    container.appendChild(renderer.domElement);
    
    // 创建波浪平面 - 降低分段数
    const geometry = new THREE.PlaneGeometry(15, 15, 20, 20); // 进一步降低分段
    const material = new THREE.MeshBasicMaterial({
        color: 0x3498db,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    const wave = new THREE.Mesh(geometry, material);
    scene.add(wave);
    
    // 添加粒子 - 减少数量
    const particlesCount = 300; // 从500减少至300
    const particlesGeometry = new THREE.BufferGeometry();
    
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03, // 增加粒子大小使其更明显
        color: 0x2ecc71,
        transparent: true,
        opacity: 0.6
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // 设置动画更新频率
    let lastTime = 0;
    const updateInterval = 50; // 毫秒，降低更新频率到约20fps
    
    // 动画函数 - 优化更新
    function animate(timestamp) {
        requestAnimationFrame(animate);
        
        // 限制更新频率
        if (timestamp && lastTime && timestamp - lastTime < updateInterval) {
            renderer.render(scene, camera);
            return;
        }
        
        lastTime = timestamp || 0;
        
        // 波浪动画 - 优化计算
        const positions = wave.geometry.attributes.position.array;
        const time = Date.now() * 0.0008; // 减慢时间流逝速度
        
        // 每隔2个顶点更新1个，减少计算量
        for (let i = 0; i < positions.length; i += 6) {
            const x = positions[i];
            const y = positions[i + 1];
            const waveScale = 0.4; // 降低波浪幅度
            positions[i + 2] = Math.sin(x * waveScale + time) * waveScale + 
                             Math.sin(y * waveScale + time) * waveScale;
        }
        
        wave.geometry.attributes.position.needsUpdate = true;
        
        // 粒子动画 - 减慢旋转速度
        particlesMesh.rotation.x += 0.0003;
        particlesMesh.rotation.y += 0.0003;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // 响应窗口大小变化 - 添加防抖
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, 250); // 250ms防抖延迟
    });
}

// 初始化关于我们区域的3D模型
function initAbout3DModel() {
    const modelContainer = document.querySelector('.about-3d');
    if (!modelContainer) return;
    
    // 确保Three.js已加载
    if (typeof THREE === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = function() {
            createSimple3DModel(modelContainer);
        };
        document.head.appendChild(script);
    } else {
        createSimple3DModel(modelContainer);
    }
}

// 创建简单的3D模型 - 优化版
function createSimple3DModel(container) {
    // 创建场景
    const scene = new THREE.Scene();
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // 创建渲染器 - 禁用抗锯齿
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // 创建一个简单的3D对象（立方体） - 减少面数
    const geometry = new THREE.IcosahedronGeometry(2, 0); // 降低细分级别
    const material = new THREE.MeshBasicMaterial({
        color: 0x3498db,
        wireframe: true
    });
    
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // 简化光源 - 只使用环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    // 去掉方向光源
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    // directionalLight.position.set(0, 1, 1);
    // scene.add(directionalLight);
    
    // 限制更新频率
    let lastTime = 0;
    const updateInterval = 50; // 约20fps
    
    // 动画函数 - 优化更新
    function animate(timestamp) {
        requestAnimationFrame(animate);
        
        // 限制更新频率
        if (timestamp && lastTime && timestamp - lastTime < updateInterval) {
            return;
        }
        
        lastTime = timestamp || 0;
        
        // 减慢旋转速度
        cube.rotation.x += 0.004;
        cube.rotation.y += 0.008;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // 响应窗口大小变化 - 添加防抖
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }, 250); // 250ms防抖延迟
    });
}