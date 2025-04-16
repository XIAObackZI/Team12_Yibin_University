// 主题切换功能实现

// 可用的主题列表
const themes = {
    blue: '蓝色主题',
    purple: '紫色主题',
    dark: '暗黑主题',
    red: '红色主题',
    green: '绿色主题'
};

// 初始化主题
function initTheme() {
    // 从localStorage获取已保存的主题，如果没有则使用默认主题
    const savedTheme = localStorage.getItem('selected-theme') || 'blue';
    applyTheme(savedTheme);
    
    // 标记当前活跃的主题按钮
    const activeButton = document.querySelector(`.theme-${savedTheme}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// 应用主题到文档
function applyTheme(theme) {
    // 如果是默认主题，则移除data-theme属性
    if (theme === 'blue') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    // 保存用户选择
    localStorage.setItem('selected-theme', theme);
    
    // 更新所有主题按钮的活跃状态
    const themeButtons = document.querySelectorAll('.theme-button');
    themeButtons.forEach(button => {
        button.classList.remove('active');
        if (button.classList.contains(`theme-${theme}`)) {
            button.classList.add('active');
        }
    });
}

// 创建主题切换器UI
function createThemeSwitcher() {
    const switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    
    Object.keys(themes).forEach(theme => {
        const button = document.createElement('button');
        button.className = `theme-button theme-${theme}`;
        button.title = themes[theme];
        button.setAttribute('aria-label', themes[theme]);
        button.onclick = () => applyTheme(theme);
        switcher.appendChild(button);
    });
    
    return switcher;
}

// 在页面加载完成后初始化主题切换器
document.addEventListener('DOMContentLoaded', () => {
    // 创建主题切换器并添加到导航栏
    const themeSwitcherContainer = document.getElementById('theme-switcher-container');
    if (themeSwitcherContainer) {
        themeSwitcherContainer.appendChild(createThemeSwitcher());
    }
    
    // 初始化主题
    initTheme();
});

// 以下是辅助功能，增加更多交互
// 添加主题切换的过渡效果
function addThemeTransition() {
    const transitionElements = [
        'body', 
        '.article-card', 
        '.sidebar-card', 
        'nav', 
        '.hero-pattern', 
        'button',
        'a'
    ];
    
    const transitionCSS = 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease';
    
    transitionElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.style.transition = transitionCSS;
        });
    });
}

// 主题预览功能：鼠标悬停在主题按钮上时预览主题
function enableThemePreview() {
    let currentTheme = localStorage.getItem('selected-theme') || 'blue';
    
    const themeButtons = document.querySelectorAll('.theme-button');
    themeButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            const theme = button.classList[1].replace('theme-', '');
            applyTheme(theme);
        });
        
        button.addEventListener('mouseleave', () => {
            applyTheme(currentTheme);
        });
        
        button.addEventListener('click', () => {
            currentTheme = button.classList[1].replace('theme-', '');
        });
    });
}

// 在页面完全加载后添加增强功能
window.addEventListener('load', () => {
    addThemeTransition();
    // 取消预览功能，因为可能会导致用户体验不佳
    // enableThemePreview();
}); 