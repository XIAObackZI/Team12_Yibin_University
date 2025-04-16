// 组件加载器
function loadComponent(containerId, componentPath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    fetch(componentPath)
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            // 执行组件内的脚本 (如果有的话 - 已从Navbar.html移除主要逻辑)
            const scripts = container.getElementsByTagName('script');
            Array.from(scripts).forEach(script => {
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                newScript.textContent = script.textContent;
                script.parentNode.replaceChild(newScript, script);
            });

            // 导航栏交互逻辑 (移到这里执行，确保元素已加载)
            initializeNavbarInteractions(container);

            // 初始化主题切换器 (REMOVING - Theme switcher functionality deleted)
            /*
            if (typeof initThemeSwitcher === 'function') { 
                initThemeSwitcher(); 
            }
            */

        })
        .catch(error => console.error('Error loading component:', error));
}

// 初始化导航栏交互 (确保只在组件加载后调用)
function initializeNavbarInteractions(navbarContainer) {
    // 移动端菜单切换
    const mobileMenuButton = navbarContainer.querySelector('#mobile-menu-button');
    const mobileMenu = navbarContainer.querySelector('#mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.classList.toggle('hidden');

            if (!isExpanded) {
                mobileMenuButton.innerHTML = '<i class="fas fa-times text-xl"></i>';
            } else {
                mobileMenuButton.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            }
        });
    }

    // 用户下拉菜单
    const userMenuButton = navbarContainer.querySelector('#user-menu');
    const dropdownMenu = navbarContainer.querySelector('#dropdown-menu');

    if (userMenuButton && dropdownMenu) {
        userMenuButton.addEventListener('click', () => {
            const isExpanded = userMenuButton.getAttribute('aria-expanded') === 'true';
            userMenuButton.setAttribute('aria-expanded', !isExpanded);
            dropdownMenu.classList.toggle('hidden');
        });

        // 点击外部关闭下拉菜单 (需要注意事件冒泡)
        // 改进：只在下拉菜单展开时监听 document 点击
        document.addEventListener('click', (event) => {
            if (dropdownMenu.classList.contains('hidden')) return; // 如果菜单已隐藏，则不处理
            if (userMenuButton && !userMenuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                userMenuButton.setAttribute('aria-expanded', 'false');
                dropdownMenu.classList.add('hidden');
            }
        });
    }

    // 滚动触发导航栏固定 (可选，可以保留在主页面脚本或移到这里)
    // const navbar = navbarContainer.querySelector('#navbar'); // 或者直接用 container
    // if (navbar) {
    //     let lastScrollTop = 0;
    //     const scrollThreshold = 100;
    //     window.addEventListener('scroll', () => {
    //         const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    //         if (scrollTop > scrollThreshold) {
    //             navbar.classList.add('navbar-fixed');
    //         } else {
    //             navbar.classList.remove('navbar-fixed');
    //         }
    //         lastScrollTop = scrollTop;
    //     });
    // }
}

// 当DOM加载完成后初始化组件
document.addEventListener('DOMContentLoaded', () => {
    // 加载导航栏组件
    loadComponent('navbar-container', 'components/layout/Navbar.html');
    // 加载热门推荐组件
    loadComponent('hot-recommendations-container', 'components/sections/hot-recommendations.html');
    // 注意：此时导航栏交互逻辑将在 loadComponent 的 then 回调中初始化

    // 加载热门文章轮播
    if (document.getElementById('hot-articles-container')) {
        loadComponent('hot-articles-container', 'components/cards/hot-articles.html');
    }
    
    // 加载页脚
    if (document.getElementById('footer-container')) {
        loadComponent('footer-container', 'components/footer/footer.html');
    }
}); 