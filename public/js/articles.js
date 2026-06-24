document.addEventListener('DOMContentLoaded', function() {
    init();
});

function getParam(name) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function getCurrentCategory() {
    var category = getParam('category');
    return category || 'all';
}

function getSearchQuery() {
    return getParam('search') || '';
}

function getCurrentPage() {
    return parseInt(getParam('page')) || 1;
}

// Fetch articles from API
async function fetchArticles(category, search, page) {
    var params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', 9);

    var response = await fetch('/api/articles?' + params.toString());
    return response.json();
}

// Create article card HTML
function createArticleCard(article) {
    var categoryLabels = {
        'news': 'NEWS',
        'guide': 'GUIDE',
        'blog': 'BLOG',
        'case': 'CASE STUDY'
    };
    
    var badgeHtml = '';
    if (article.isFeatured) {
        badgeHtml = '<span class="article-badge">FEATURED</span>';
    }

    return '<article class="article-card" onclick="navigateToArticle(\'' + article.slug + '\')">' +
        '<div class="article-image">' +
        (article.coverImage ? '<img src="' + article.coverImage + '" alt="' + article.title + '">' : '<span class="article-emoji">📰</span>') +
        badgeHtml +
        '</div>' +
        '<div class="article-content">' +
        '<span class="article-category">' + (categoryLabels[article.category] || article.category) + '</span>' +
        '<h3 class="article-title">' + article.title + '</h3>' +
        '<p class="article-excerpt">' + article.excerpt + '</p>' +
        '<div class="article-meta">' +
        '<span class="article-author">' + article.author + '</span>' +
        '<span class="article-date">' + article.publishedAt + '</span>' +
        '<span class="article-views">👁 ' + article.views + '</span>' +
        '</div>' +
        '</div>' +
        '</article>';
}

// Render articles grid
function renderArticles(articles) {
    var grid = document.getElementById('articles-grid');
    
    if (articles.length === 0) {
        grid.innerHTML = '<div class="no-results">No articles found</div>';
        return;
    }

    grid.innerHTML = articles.map(createArticleCard).join('');
}

// Render pagination
function renderPagination(currentPage, totalPages) {
    var pagination = document.getElementById('pagination');
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    var html = '';
    
    // Previous button
    if (currentPage > 1) {
        html += '<button class="page-btn" onclick="goToPage(' + (currentPage - 1) + ')">←</button>';
    }

    // Page numbers
    for (var i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += '<button class="page-btn ' + (i === currentPage ? 'active' : '') + '" onclick="goToPage(' + i + ')">' + i + '</button>';
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span class="page-ellipsis">...</span>';
        }
    }

    // Next button
    if (currentPage < totalPages) {
        html += '<button class="page-btn" onclick="goToPage(' + (currentPage + 1) + ')">→</button>';
    }

    pagination.innerHTML = html;
}

// Navigate to article
function navigateToArticle(slug) {
    window.location.href = '/article.html?slug=' + slug;
}

// Go to specific page
function goToPage(page) {
    var url = new URL(window.location);
    url.searchParams.set('page', page);
    window.location.href = url.toString();
}

// Update page info
function updatePageInfo(category, search) {
    var titleEl = document.getElementById('page-title');
    var descEl = document.getElementById('page-description');
    
    var titles = {
        'all': 'ARTICLES',
        'news': 'NEWS',
        'guide': 'GUIDES',
        'blog': 'BLOG',
        'case': 'CASE STUDIES'
    };

    var descriptions = {
        'all': 'News, guides, and stories from the gaming world',
        'news': 'Latest news and updates from Soinp Gaming',
        'guide': 'Expert guides and tutorials',
        'blog': 'Insights and stories from the gaming community',
        'case': 'Success stories from our customers'
    };

    titleEl.textContent = search ? 'Search Results' : (titles[category] || 'ARTICLES');
    descEl.textContent = search ? 'Showing results for: ' + search : (descriptions[category] || descriptions.all);
}

// Update category tabs
function updateCategoryTabs(category) {
    document.querySelectorAll('.category-tab').forEach(function(tab) {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });
}

// Update search input
function updateSearchInput(search) {
    var searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = search || '';
    }
}

// Initialize
async function init() {
    var category = getCurrentCategory();
    var search = getSearchQuery();
    var page = getCurrentPage();

    updatePageInfo(category, search);
    updateCategoryTabs(category);
    updateSearchInput(search);

    try {
        var data = await fetchArticles(category, search, page);
        renderArticles(data.articles);
        renderPagination(page, data.totalPages);
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articles-grid').innerHTML = '<div class="error">Failed to load articles</div>';
    }

    // Category tab click handlers
    document.querySelectorAll('.category-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var cat = this.dataset.category;
            var url = new URL(window.location);
            url.searchParams.set('category', cat);
            url.searchParams.delete('search');
            url.searchParams.set('page', 1);
            window.location.href = url.toString();
        });
    });

    // Search handlers
    var searchInput = document.getElementById('search-input');
    var searchBtn = document.getElementById('search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            var query = searchInput.value.trim();
            var url = new URL(window.location);
            if (query) {
                url.searchParams.set('search', query);
            } else {
                url.searchParams.delete('search');
            }
            url.searchParams.set('page', 1);
            window.location.href = url.toString();
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}
