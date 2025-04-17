// 组件加载器
function loadComponent(containerId, componentPath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 检查当前页面是否在子目录中，并调整组件路径
    let adjustedPath = componentPath;
    
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    
    // 检测是否在子目录中，需要调整路径
    // 处理所有子目录情况，包括/other_pages/和/assets/Article_detail_page/等
    if (currentPath.split('/').length > 2) {
        // 计算需要返回的层级数
        const pathSegments = currentPath.split('/').filter(segment => segment.length > 0);
        // 如果在子目录中，需要根据子目录层级返回上级
        const levelsUp = pathSegments.length;
        
        // 创建正确的相对路径前缀
        const prefix = Array(levelsUp).fill('..').join('/');
        adjustedPath = `${prefix}/${componentPath}`;
        
        console.log(`检测到子目录: ${currentPath}, 调整组件路径:`, adjustedPath);
    }

    fetch(adjustedPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`组件加载失败: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            // 创建一个临时容器来解析HTML
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = html;
            
            // 提取所有脚本元素
            const scripts = tempContainer.querySelectorAll('script');
            const scriptContents = [];
            
            // 收集脚本内容并从临时容器中移除脚本
            scripts.forEach(script => {
                // 保存脚本内容
                if (script.textContent) {
                    scriptContents.push(script.textContent);
                }
                // 从DOM中移除脚本元素
                script.parentNode.removeChild(script);
            });
            
            // 将处理后的HTML设置到目标容器
            container.innerHTML = tempContainer.innerHTML;
            
            // 执行导航栏交互逻辑
            initializeNavbarInteractions(container);
            
            // 执行所有提取的脚本
            scriptContents.forEach((content, index) => {
                try {
                    console.log(`执行组件脚本 #${index+1}`);
                    // 使用new Function将脚本内容包装在函数中以获得全局作用域
                    const scriptFunction = new Function(content);
                    scriptFunction.call(window); // 在全局作用域中执行脚本
                } catch (error) {
                    console.error(`执行组件脚本 #${index+1} 时出错:`, error);
                    console.log('脚本内容:', content.substring(0, 100) + '...');
                }
            });
        })
        .catch(error => {
            console.error('Error loading component:', error);
            container.innerHTML = `<div class="p-4 text-red-500">组件加载失败: ${adjustedPath}</div>`;
        });
}

// 初始化导航栏交互 (确保只在组件加载后调用)
function initializeNavbarInteractions(navbarContainer) {
    // 移动端菜单切换
    const mobileMenuButton = navbarContainer.querySelector('#mobile-menu-button');
    const mobileMenu = navbarContainer.querySelector('#mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenuButton.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // 设置aria-expanded状态
            const isExpanded = mobileMenuButton.classList.contains('active');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            
            // 防止菜单打开时背景滚动
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // 点击菜单项后自动关闭菜单
        const menuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                mobileMenuButton.classList.remove('active');
                mobileMenu.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
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
    // 检测当前页面位置
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment.length > 0);
    const inSubdirectory = pathSegments.length > 1;
    
    console.log('当前页面路径:', currentPath, '在子目录中:', inSubdirectory, '层级:', pathSegments.length);
    
    // 加载导航栏组件
    if (document.getElementById('navbar-container')) {
        loadComponent('navbar-container', 'components/layout/Navbar.html');
    }
    
    // 加载热门推荐组件
    if (document.getElementById('hot-recommendations-container')) {
        loadComponent('hot-recommendations-container', 'components/sections/hot-recommendations.html');
    }

    // 加载热门文章轮播
    if (document.getElementById('hot-articles-container')) {
        loadComponent('hot-articles-container', 'components/cards/hot-articles.html');
    }
    
    // 加载页脚
    if (document.getElementById('footer-container')) {
        loadComponent('footer-container', 'components/footer/footer.html');
    }
}); 