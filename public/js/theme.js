// 从 localStorage 同步读取上次主题（避免页面闪烁），再异步从服务器同步最新值
(function() {
    // 1) 立即应用本地缓存的主题（同步，避免 FOUC）
    try {
        const cached = localStorage.getItem('soinp-theme');
        if (cached === 'light' || cached === 'dark') {
            document.documentElement.setAttribute('data-theme', cached);
        }
    } catch (e) {
        // localStorage 可能被禁用，忽略
    }

    // 2) 异步从服务器拉取最新主题并同步本地缓存
    (async function() {
        try {
            const response = await fetch('/api/theme');
            if (!response.ok) throw new Error('Theme API error');
            const data = await response.json();
            const theme = data.theme || 'dark';
            document.documentElement.setAttribute('data-theme', theme);
            try {
                localStorage.setItem('soinp-theme', theme);
            } catch (e) {
                // ignore
            }
        } catch (error) {
            // 服务器不可达时保留 localStorage 的值；若没有缓存则使用 'dark' 默认
            if (!document.documentElement.getAttribute('data-theme')) {
                document.documentElement.setAttribute('data-theme', 'dark');
            }
            console.error('Error applying theme:', error);
        }
    })();
})();
