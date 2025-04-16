// Three.js效果脚本

document.addEventListener('DOMContentLoaded', function() {
    // 初始化Three.js背景
    initThreeBackground();
    
    // 初始化3D模型
    initAbout3DModel();
});

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

// 创建波浪背景
function createWaveBackground(container) {
    // 创建场景
    const scene = new THREE.Scene();
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // 创建波浪平面
    const geometry = new THREE.PlaneGeometry(15, 15, 50, 50);
    const material = new THREE.MeshBasicMaterial({
        color: 0x3498db,
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    
    const wave = new THREE.Mesh(geometry, material);
    scene.add(wave);
    
    // 添加粒子
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 15;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: 0x2ecc71,
        transparent: true,
        opacity: 0.8
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // 动画函数
    function animate() {
        requestAnimationFrame(animate);
        
        // 波浪动画
        const positions = wave.geometry.attributes.position.array;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            positions[i + 2] = Math.sin(x * 0.5 + time) * 0.5 + Math.sin(y * 0.5 + time) * 0.5;
        }
        
        wave.geometry.attributes.position.needsUpdate = true;
        
        // 粒子动画
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
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

// 创建简单的3D模型
function createSimple3DModel(container) {
    // 创建场景
    const scene = new THREE.Scene();
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // 创建一个简单的3D对象（立方体）
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({
        color: 0x3498db,
        wireframe: true
    });
    
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    // 动画函数
    function animate() {
        requestAnimationFrame(animate);
        
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}