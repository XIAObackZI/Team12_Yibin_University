# TechBlog 技术博客平台

## 项目结构

```
├── components/
│   ├── cards/
│   │   ├── hot-articles.html      # 热门文章卡片组件
│   │   └── article-card.html      # 文章卡片基础组件
│   ├── navbar/
│   │   └── navbar.html            # 导航栏组件
│   └── footer/
│       └── footer.html            # 页脚组件
├── styles/
│   ├── main.css                   # 主要样式
│   ├── components.css             # 组件样式
│   ├── animations.css             # 动画效果
│   └── themes.css                 # 主题样式
├── scripts/
│   ├── component-loader.js        # 组件加载器
│   └── content-generator.js       # 内容生成脚本
├── index.html                     # 首页
├── recommendations-all.html       # 推荐详情页
└── README.md                      # 项目说明文档
```

## 最新更新

### 2024-03-XX 团队介绍页面优化
- 优化文本颜色和对比度，提升可读性
- 添加文本阴影效果，增强视觉层次
- 调整背景渐变透明度，减少视觉干扰
- 改进响应式布局适配

### 2024-03-XX 推荐详情页优化
- 重新设计了推荐详情页面布局
- 添加了文章卡片动画效果
- 优化了分类筛选功能
- 改进了页面响应式设计
- 优化了页脚组件

### 2024-03-XX
- 新增统一文章数据管理系统
  - 创建 `scripts/data/articles.js` 文件，统一管理所有文章数据
  - 支持热门文章、最新文章和分类文章的数据结构
  - 优化文章加载逻辑，实现分页加载
- 优化文章列表页面
  - 重构文章卡片渲染逻辑，使用模块化的数据管理
  - 添加文章加载动画和过渡效果
  - 优化标签展示和交互体验

### 2024-03-XX 文章数据更新
- 新增8篇高质量技术文章
  - JavaScript相关文章：原型链和异步编程
  - Python和机器学习文章：图像识别和算法实践
  - 前端框架文章：React性能优化和Vue3源码解析
  - 后端开发文章：Node.js微服务架构
  - AI相关文章：自然语言处理应用
- 完善文章数据结构
  - 添加文章封面图片
  - 添加作者头像
  - 添加互动数据（浏览量、点赞数、评论数）
  - 优化文章标签系统

## 功能说明

#### 1. 导航栏组件 (navbar.html)
- 响应式导航菜单
- 现代化搜索框设计
  - 圆角设计和过渡动画
  - 支持标签拖拽
  - 已选标签显示
  - 标签快速删除
- 用户登录/注册入口

#### 2. 文章卡片组件 (hot-articles.html)
- 动态加载文章内容
- 3D翻转和阴影效果
- 粒子动画效果
- 文章标签和分类展示
- 阅读量和评论数统计

#### 3. 推荐详情页 (recommendations-all.html)
- 高级分类筛选功能
- 多维度排序功能
- 现代化分页控件
- 响应式网格布局
- 优雅的过渡动画

#### 4. 团队介绍页面 (team.html)
- 优化的文本可读性
- 渐变背景效果
- 响应式布局
- 团队成员卡片展示

#### 5. 页脚组件 (footer.html)
- 社交媒体链接
- 快速导航
- 联系信息
- 订阅功能

## 开发说明

### 样式指南
- 使用Tailwind CSS框架
- 遵循移动优先的响应式设计原则
- 使用CSS变量实现主题切换

### JavaScript规范
- 使用ES6+语法
- 组件化开发
- 事件委托优化性能

### 性能优化
- 延迟加载非关键资源
- 使用CSS transform实现动画
- 优化图片加载
- 减少DOM操作

## 待办事项
- [ ] 添加文章详情页
- [ ] 实现评论功能
- [ ] 添加用户个人中心
- [ ] 优化移动端体验

## 贡献指南
1. Fork 本仓库
2. 创建新的功能分支
3. 提交更改
4. 发起 Pull Request

## 许可证
MIT License

## 文件结构

### 数据文件
- `scripts/data/articles.js`: 统一的文章数据管理文件
  - `hotArticles`: 热门文章数据
  - `latestArticles`: 最新文章数据
  - `categoryArticles`: 分类文章数据

### 主要功能文件
- `articles.html`: 文章列表页面
  - 支持分页加载文章
  - 文章卡片动画效果
  - 标签筛选功能
  - 布局切换功能

## 文章数据结构
```javascript
{
  id: Number,          // 文章唯一标识
  title: String,       // 文章标题
  description: String, // 文章描述
  author: String,      // 作者名称
  avatar: String,      // 作者头像URL
  cover: String,       // 文章封面图URL
  tags: Array,         // 文章标签
  views: Number,       // 浏览量
  likes: Number,       // 点赞数
  comments: Number,    // 评论数
  date: String        // 发布日期
}
```
