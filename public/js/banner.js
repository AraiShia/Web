// Banner management - shared across all pages

function closeBanner() {
    const banner = document.getElementById('discountBanner');
    if (banner) {
        banner.style.display = 'none';
        const header = document.querySelector('.site-header');
        if (header) {
            header.style.top = '0';
        }
        sessionStorage.setItem('bannerClosed', 'true');
    }
}

// Load Banner
async function loadBanner() {
    const banner = document.getElementById('discountBanner');
    if (!banner) return;

    try {
        const response = await fetch('/api/banner');
        const data = await response.json();
        const bannerData = data.banner || {};

        if (bannerData.enabled === false) {
            banner.style.display = 'none';
            return;
        }

        const badgeEl = document.getElementById('banner-badge');
        const textEl = document.getElementById('banner-text');
        const codeEl = document.getElementById('banner-code');

        if (badgeEl) badgeEl.textContent = bannerData.badge || '';
        if (textEl) textEl.textContent = bannerData.text || '';
        if (codeEl) codeEl.textContent = bannerData.code || '';

        // 隐藏空字段
        ['banner-badge', 'banner-text', 'banner-code'].forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.textContent.trim()) {
                el.style.display = 'none';
            } else if (el) {
                el.style.display = '';
            }
        });

        // 检查是否已关闭过banner
        if (sessionStorage.getItem('bannerClosed') === 'true') {
            banner.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading banner:', error);
    }
}

// Auto-load banner on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBanner);
} else {
    loadBanner();
}
