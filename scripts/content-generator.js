// 内容生成器 - 用于模拟网站内容的生成

// 随机数据生成辅助函数
const randomGenerator = {
    // 从数组中随机选择一个元素
    fromArray: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    // 生成指定范围内的随机数
    numberBetween: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    
    // 生成随机日期（最近三个月内）
    recentDate: function() {
        const now = new Date();
        const pastDate = new Date(now.getTime() - randomGenerator.numberBetween(1, 90) * 24 * 60 * 60 * 1000);
        return pastDate.toISOString().split('T')[0];
    }
};

// 模拟数据库
const mockDatabase = {
    // 文章分类
    categories: [
        { id: 1, name: '前端开发', icon: 'fa-code', color: 'blue' },
        { id: 2, name: '后端开发', icon: 'fa-server', color: 'purple' },
        { id: 3, name: '人工智能', icon: 'fa-robot', color: 'green' },
        { id: 4, name: '移动开发', icon: 'fa-mobile-alt', color: 'yellow' },
        { id: 5, name: 'DevOps', icon: 'fa-cogs', color: 'red' },
        { id: 6, name: '区块链', icon: 'fa-link', color: 'indigo' },
        { id: 7, name: '数据科学', icon: 'fa-chart-bar', color: 'teal' }
    ],
    
    // 文章标签
    tags: [
        'JavaScript', 'Python', 'React', 'Vue', 'Angular', 'Node.js', 
        'Django', 'Flask', 'Express', 'TensorFlow', 'PyTorch', 'Swift',
        'Kotlin', 'Flutter', 'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure',
        'GCP', 'GraphQL', 'REST API', 'Microservices', 'MongoDB', 'PostgreSQL',
        'MySQL', 'Redis', 'Elasticsearch', 'WebSockets', 'PWA', 'Web3'
    ],
    
    // 用户数据
    users: [
        { id: 1, name: '李明', role: '前端技术专家', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', email: 'liming@example.com' },
        { id: 2, name: '张雪', role: 'AI研究员', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', email: 'zhangxue@example.com' },
        { id: 3, name: '王刚', role: '架构师', avatar: 'https://randomuser.me/api/portraits/men/68.jpg', email: 'wanggang@example.com' },
        { id: 4, name: '陈静', role: '移动开发专家', avatar: 'https://randomuser.me/api/portraits/women/28.jpg', email: 'chenjing@example.com' },
        { id: 5, name: '赵伟', role: 'DevOps工程师', avatar: 'https://randomuser.me/api/portraits/men/45.jpg', email: 'zhaowei@example.com' },
        { id: 6, name: '刘芳', role: '数据科学家', avatar: 'https://randomuser.me/api/portraits/women/17.jpg', email: 'liufang@example.com' }
    ],
    
    // 文章标题库
    articleTitles: [
        '深入理解React Hooks：从原理到实践',
        'Python异步编程最佳实践',
        '微服务架构设计模式与实现',
        'Flutter vs React Native：2023年跨平台开发对比',
        'Docker容器化部署全流程指南',
        'GraphQL与REST API的性能对比',
        '大规模分布式系统的设计挑战',
        'TensorFlow 2.0深度学习实战',
        'Vue 3组合式API完全指南',
        'Kubernetes集群管理与优化',
        '现代JavaScript异步编程技术',
        'Spring Boot微服务开发实践',
        '移动应用UI/UX设计原则',
        '高性能Web前端优化策略',
        'NoSQL数据库选型对比',
        '区块链应用开发实战',
        'CI/CD流水线搭建教程',
        '云原生应用架构设计',
        'Web3开发入门与实践',
        'AI在软件开发中的应用'
    ],
    
    // 文章摘要库
    articleSummaries: [
        '探索React Hooks背后的设计理念和实现原理，掌握函数式组件的状态管理技巧。',
        '深入了解Python的异步编程模型，使用asyncio和aiohttp构建高性能应用。',
        '分析微服务架构的优缺点，以及如何解决分布式系统中的常见问题。',
        '全面对比两大主流跨平台开发框架的性能、生态和开发体验。',
        '从基础概念到实际部署，全面掌握Docker容器化应用的开发流程。',
        '通过实际项目比较GraphQL和REST API的查询效率、灵活性和开发体验。',
        '探讨大型分布式系统的设计挑战，包括一致性、可用性和分区容错性。',
        '使用TensorFlow 2.0构建深度学习模型，从理论到实践的全方位指南。',
        '详解Vue 3的组合式API，以及如何利用它提高代码复用性和可维护性。',
        '学习Kubernetes的高级特性和最佳实践，优化容器编排和资源管理。',
        '掌握JavaScript中的Promise、async/await等异步编程技术和模式。',
        '使用Spring Boot构建微服务，实现服务发现、配置管理和负载均衡。',
        '研究移动应用设计原则，创造出用户体验出色的应用界面。',
        '优化Web前端性能，提高加载速度、渲染效率和用户交互体验。',
        '对比MongoDB、Redis、Cassandra等NoSQL数据库的特点和适用场景。',
        '从理论到实践，学习区块链应用的开发流程和技术栈。',
        '搭建自动化CI/CD流水线，提高团队开发效率和产品质量。',
        '学习云原生应用的设计原则和最佳实践，包括服务网格和无服务器架构。',
        '了解Web3开发的基础知识，包括智能合约、DApp和去中心化服务。',
        '探索AI技术在软件开发各个环节的应用，从需求分析到代码生成。'
    ],
    
    // 文章图片库（使用Unsplash的随机图像）
    articleImages: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        'https://images.unsplash.com/photo-1573164713988-8665fc963095',
        'https://images.unsplash.com/photo-1607799279861-4dd421887fb3',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8',
        'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
        'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f'
    ]
};

// 内容生成函数
const contentGenerator = {
    // 生成随机文章
    generateArticle: function() {
        const category = randomGenerator.fromArray(mockDatabase.categories);
        const tags = Array.from(
            { length: randomGenerator.numberBetween(1, 3) }, 
            () => randomGenerator.fromArray(mockDatabase.tags)
        );
        const author = randomGenerator.fromArray(mockDatabase.users);
        
        return {
            id: randomGenerator.numberBetween(1, 1000),
            title: randomGenerator.fromArray(mockDatabase.articleTitles),
            summary: randomGenerator.fromArray(mockDatabase.articleSummaries),
            content: '这里是文章的详细内容...',
            image: `${randomGenerator.fromArray(mockDatabase.articleImages)}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80`,
            category: category,
            tags: tags,
            author: author,
            date: randomGenerator.recentDate(),
            views: randomGenerator.numberBetween(100, 5000),
            comments: randomGenerator.numberBetween(0, 100)
        };
    },
    
    // 生成多篇文章
    generateArticles: function(count) {
        return Array.from({ length: count }, () => this.generateArticle());
    },
    
    // 生成随机评论
    generateComment: function() {
        const user = randomGenerator.fromArray(mockDatabase.users);
        const commentTexts = [
            '非常实用的文章，学到了很多！',
            '这篇内容讲解得很清晰，感谢分享。',
            '我在项目中尝试了这个方法，效果很好。',
            '有没有更多关于这个主题的资料推荐？',
            '文章内容有点深奥，希望能有更多示例。',
            '这个技术解决了我一直困扰的问题，太感谢了。',
            '内容很棒，但是有些地方还可以更详细。',
            '期待作者的后续文章！',
            '我觉得这个方案还有优化空间，建议考虑...',
            '简洁明了，代码示例很有帮助。'
        ];
        
        return {
            id: randomGenerator.numberBetween(1, 5000),
            user: user,
            text: randomGenerator.fromArray(commentTexts),
            date: randomGenerator.recentDate(),
            likes: randomGenerator.numberBetween(0, 50)
        };
    },
    
    // 生成多条评论
    generateComments: function(count) {
        return Array.from({ length: count }, () => this.generateComment());
    },
    
    // 生成最新文章列表
    generateLatestArticles: function(count) {
        const articles = this.generateArticles(count);
        // 按日期排序，最新的在前
        return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    
    // 生成热门文章列表
    generatePopularArticles: function(count) {
        const articles = this.generateArticles(count);
        // 按浏览量排序
        return articles.sort((a, b) => b.views - a.views);
    }
};

// 页面内容填充函数
function populatePageContent() {
    // 填充热门文章区域
    populatePopularArticles();
    
    // 填充最新文章区域
    populateLatestArticles();
    
    // 填充侧边栏内容
    populateSidebar();
    
    // 模拟搜索功能
    setupSearchFunctionality();
}

// 填充热门文章区域
function populatePopularArticles() {
    const popularArticlesContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
    if (!popularArticlesContainer) return;
    
    // 清空现有内容
    popularArticlesContainer.innerHTML = '';
    
    // 生成两篇热门文章
    const articles = contentGenerator.generatePopularArticles(2);
    
    articles.forEach(article => {
        const articleHTML = `
            <div class="article-card bg-white rounded-xl overflow-hidden shadow-md">
                <div class="relative pb-48 overflow-hidden">
                    <img class="absolute inset-0 h-full w-full object-cover" src="${article.image}" alt="${article.title}">
                </div>
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <span class="tag bg-${article.category.color}-100 text-${article.category.color}-800 text-xs font-medium px-2.5 py-0.5 rounded">${article.category.name}</span>
                        <span class="text-gray-500 text-sm ml-auto">${article.date}</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3 title-font">${article.title}</h3>
                    <p class="text-gray-600 mb-4">${article.summary}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <img class="w-8 h-8 rounded-full mr-2" src="${article.author.avatar}" alt="${article.author.name}">
                            <span class="text-sm font-medium">${article.author.name}</span>
                        </div>
                        <div class="flex items-center text-gray-500 text-sm">
                            <span class="mr-3"><i class="far fa-eye mr-1"></i> ${article.views}</span>
                            <span><i class="far fa-comment mr-1"></i> ${article.comments}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        popularArticlesContainer.innerHTML += articleHTML;
    });
}

// 填充最新文章区域
function populateLatestArticles() {
    const latestArticlesContainer = document.querySelector('.space-y-6');
    if (!latestArticlesContainer) return;
    
    // 清空现有内容
    latestArticlesContainer.innerHTML = '';
    
    // 生成三篇最新文章
    const articles = contentGenerator.generateLatestArticles(3);
    
    articles.forEach(article => {
        const articleHTML = `
            <div class="article-card bg-white rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row">
                <div class="md:w-1/3 relative">
                    <img class="h-48 md:h-full w-full object-cover" src="${article.image}" alt="${article.title}">
                </div>
                <div class="md:w-2/3 p-6">
                    <div class="flex items-center mb-2">
                        <span class="tag bg-${article.category.color}-100 text-${article.category.color}-800 text-xs font-medium px-2.5 py-0.5 rounded">${article.category.name}</span>
                        <span class="text-gray-500 text-sm ml-auto">${article.date}</span>
                    </div>
                    <h3 class="text-xl font-bold mb-3 title-font">${article.title}</h3>
                    <p class="text-gray-600 mb-4">${article.summary}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <img class="w-8 h-8 rounded-full mr-2" src="${article.author.avatar}" alt="${article.author.name}">
                            <span class="text-sm font-medium">${article.author.name}</span>
                        </div>
                        <div class="flex items-center text-gray-500 text-sm">
                            <span class="mr-3"><i class="far fa-eye mr-1"></i> ${article.views}</span>
                            <span><i class="far fa-comment mr-1"></i> ${article.comments}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        latestArticlesContainer.innerHTML += articleHTML;
    });
}

// 填充侧边栏内容
function populateSidebar() {
    // 填充推荐作者
    const authorsContainer = document.querySelector('.sidebar-card .space-y-4');
    if (authorsContainer) {
        // 清空现有内容
        authorsContainer.innerHTML = '';
        
        // 随机选择4位作者
        const selectedUsers = [];
        while (selectedUsers.length < 4) {
            const user = randomGenerator.fromArray(mockDatabase.users);
            if (!selectedUsers.some(u => u.id === user.id)) {
                selectedUsers.push(user);
            }
        }
        
        selectedUsers.forEach(user => {
            const userHTML = `
                <div class="flex items-center">
                    <img class="w-10 h-10 rounded-full mr-3" src="${user.avatar}" alt="${user.name}">
                    <div>
                        <h4 class="font-medium">${user.name}</h4>
                        <p class="text-sm text-gray-500">${user.role}</p>
                    </div>
                    <button class="ml-auto text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-md">关注</button>
                </div>
            `;
            
            authorsContainer.innerHTML += userHTML;
        });
    }
}

// 设置搜索功能
function setupSearchFunctionality() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
            // 模拟搜索响应
            alert(`搜索"${searchInput.value}"的结果将在此显示（前端模拟）`);
            searchInput.value = '';
        }
    });
}

// 在页面加载完成后填充内容
document.addEventListener('DOMContentLoaded', function() {
    // 填充页面内容
    populatePageContent();
    
    // 为所有按钮添加点击事件
    addButtonEventListeners();
});

// 添加按钮事件监听器
function addButtonEventListeners() {
    const buttons = document.querySelectorAll('button:not([id]):not(.theme-button)');
    
    buttons.forEach(button => {
        if (!button.hasAttribute('data-has-event')) {
            button.setAttribute('data-has-event', 'true');
            button.addEventListener('click', function(e) {
                // 阻止实际的表单提交
                e.preventDefault();
                
                // 根据按钮类型显示不同的反馈
                if (button.textContent.includes('订阅')) {
                    alert('订阅成功！感谢您的支持（前端模拟）');
                } else if (button.textContent.includes('关注')) {
                    button.textContent = button.textContent === '关注' ? '已关注' : '关注';
                    button.classList.toggle('bg-gray-100');
                    button.classList.toggle('bg-blue-100');
                } else {
                    // alert(`您点击了"${button.textContent.trim()}"按钮（前端模拟）`); // 移除通用按钮点击提示
                }
            });
        }
    });
}