// 从服务器获取并应用当前主题，避免页面闪烁
(async function() {
    try {
        const response = await fetch('/api/theme');
        const data = await response.json();
        document.documentElement.setAttribute('data-theme', data.theme || 'dark');
    } catch (error) {
        console.error('Error applying theme:', error);
        document.documentElement.setAttribute('data-theme', 'dark');
    }
})();
