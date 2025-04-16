// 合并多个类名
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
} 