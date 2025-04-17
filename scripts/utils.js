// 合并多个类名
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
} 

// 提供通用工具函数

// 本地存储工具函数
const storageUtils = {
    // 获取存储的文章交互数据
    getArticlesData() {
        const storedData = localStorage.getItem('articlesInteraction');
        return storedData ? JSON.parse(storedData) : {
            likes: {},      // 存储点赞数据，格式: {articleId: count}
            favorites: {},  // 存储收藏数据，格式: {articleId: true/false}
            views: {},      // 存储浏览量，格式: {articleId: count}
            userLikes: {},  // 存储用户点赞状态，格式: {articleId: true/false}
            userFavorites: {} // 存储用户收藏状态，格式: {articleId: true/false}
        };
    },
    
    // 保存文章交互数据
    saveArticlesData(data) {
        localStorage.setItem('articlesInteraction', JSON.stringify(data));
    },
    
    // 更新文章点赞数
    toggleLike(articleId) {
        const data = this.getArticlesData();
        
        // 如果用户已点赞，则取消点赞
        if (data.userLikes[articleId]) {
            data.userLikes[articleId] = false;
            data.likes[articleId] = (data.likes[articleId] || 1) - 1;
        } else {
            // 否则添加点赞
            data.userLikes[articleId] = true;
            data.likes[articleId] = (data.likes[articleId] || 0) + 1;
        }
        
        this.saveArticlesData(data);
        return {
            count: data.likes[articleId] || 0,
            isLiked: data.userLikes[articleId]
        };
    },
    
    // 更新文章收藏状态
    toggleFavorite(articleId) {
        const data = this.getArticlesData();
        
        // 切换收藏状态
        data.userFavorites[articleId] = !data.userFavorites[articleId];
        
        this.saveArticlesData(data);
        return {
            isFavorited: data.userFavorites[articleId]
        };
    },
    
    // 增加文章浏览量
    incrementView(articleId) {
        const data = this.getArticlesData();
        data.views[articleId] = (data.views[articleId] || 0) + 1;
        this.saveArticlesData(data);
        return {
            count: data.views[articleId]
        };
    },
    
    // 获取文章交互状态
    getArticleInteractionStatus(articleId) {
        const data = this.getArticlesData();
        return {
            likeCount: data.likes[articleId] || 0,
            viewCount: data.views[articleId] || 0,
            isLiked: !!data.userLikes[articleId],
            isFavorited: !!data.userFavorites[articleId]
        };
    }
};

export { storageUtils }; 