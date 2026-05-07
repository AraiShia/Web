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

var productsData = {
    'gaming-chairs': [
        { id: 1, slug: 'pro-gaming-chair-x1', name: 'Pro Gaming Chair X1', category: 'Pro Series', price: 299, originalPrice: 499, badge: 'Hot', emoji: '🪑', desc: 'Ergonomic design with premium materials for ultimate comfort during long gaming sessions.', features: ['4D armrests', 'Adjustable lumbar support', 'Memory foam cushion', 'Breathable mesh', 'Steel frame', '5-year warranty'] },
        { id: 2, slug: 'pro-gaming-chair-x3', name: 'Pro Gaming Chair X3', category: 'Pro Series', price: 399, originalPrice: 599, badge: 'New', emoji: '🪑', desc: 'Upgraded with RGB lighting and advanced ergonomic features.', features: ['RGB lighting', 'Breathable mesh', '4D armrests', 'Memory foam', 'Reclining backrest', 'Adjustable headrest'] },
        { id: 3, slug: 'casual-gaming-chair', name: 'Casual Gaming Chair', category: 'Casual', price: 199, originalPrice: 299, badge: '', emoji: '🪑', desc: 'Comfortable casual design perfect for everyday use.', features: ['2D armrests', 'Fixed lumbar', 'High-density foam', 'Durable PU leather', 'Easy assembly'] },
        { id: 4, slug: 'ergo-pro-chair', name: 'Ergo Pro Chair', category: 'Pro Series', price: 449, originalPrice: 699, badge: 'Hot', emoji: '🪑', desc: 'Professional-grade ergonomic chair with advanced support features.', features: ['Dynamic lumbar support', '4D armrests', 'Breathable fabric', 'Multi-tilt mechanism', 'Weight capacity 300lbs'] },
        { id: 5, slug: 'rgb-elite-chair', name: 'RGB Elite Chair', category: 'Pro Series', price: 349, originalPrice: 499, badge: 'Sale', emoji: '🪑', desc: 'Immersive RGB lighting meets premium comfort.', features: ['16.8M RGB colors', 'Sync with games', '4D armrests', 'Memory foam', 'USB powered'] },
        { id: 6, slug: 'budget-gamer-chair', name: 'Budget Gamer Chair', category: 'Budget', price: 149, originalPrice: 199, badge: '', emoji: '🪑', desc: 'Affordable gaming chair without compromising on quality.', features: ['2D armrests', 'Basic lumbar', 'PU leather', 'Easy assembly', '1-year warranty'] }
    ],
    'gaming-desks': [
        { id: 7, slug: 'pro-gaming-desk', name: 'Pro Gaming Desk', category: 'Pro Series', price: 499, originalPrice: 699, badge: 'Hot', emoji: '🖥️', desc: 'Large gaming desk with cable management and RGB lighting.', features: ['RGB lighting', 'Cable management', 'Carbon fiber surface', 'Steel frame', 'Weight capacity 200lbs'] },
        { id: 8, slug: 'compact-gaming-desk', name: 'Compact Gaming Desk', category: 'Casual', price: 299, originalPrice: 399, badge: '', emoji: '🖥️', desc: 'Space-efficient gaming desk for smaller setups.', features: ['Compact design', 'Cable management', 'Sturdy frame', 'Easy assembly', 'Water-resistant surface'] }
    ],
    'mouse-pads': [
        { id: 9, slug: 'xl-gaming-mousepad', name: 'XL Gaming Mousepad', category: 'Accessories', price: 49, originalPrice: 79, badge: 'Hot', emoji: '🖱️', desc: 'Extra-large mousepad for complete keyboard and mouse coverage.', features: ['900x400mm size', 'Anti-slip base', 'Smooth surface', 'Water-resistant', 'Stitched edges'] },
        { id: 10, slug: 'rgb-mousepad', name: 'RGB Gaming Mousepad', category: 'Accessories', price: 69, originalPrice: 99, badge: 'New', emoji: '🖱️', desc: 'RGB illuminated mousepad with 14 lighting modes.', features: ['14 RGB modes', 'USB powered', 'Smooth surface', 'Anti-slip rubber base', 'Touch controls'] }
    ],
    'accessories': [
        { id: 11, slug: 'headset-stand', name: 'Gaming Headset Stand', category: 'Accessories', price: 39, originalPrice: 59, badge: '', emoji: '🎧', desc: 'Sturdy headset stand with USB hub and RGB lighting.', features: ['USB 3.0 hub', 'RGB lighting', 'Sturdy aluminum', 'Non-slip base', 'Universal fit'] },
        { id: 12, slug: 'wrist-rest', name: 'Ergonomic Wrist Rest', category: 'Accessories', price: 29, originalPrice: 39, badge: '', emoji: '⌨️', desc: 'Memory foam wrist rest for keyboard and mouse.', features: ['Memory foam', 'Breathable fabric', 'Non-slip base', 'Ergonomic design', 'Easy to clean'] }
    ]
};

function findProduct(slug) {
    for (var category in productsData) {
        var product = productsData[category].find(function(p) { return p.slug === slug; });
        if (product) return product;
    }
    return null;
}

function createProductCard(product) {
    var badgeHtml = product.badge ? '<span class="product-badge">' + product.badge + '</span>' : '';
    var originalPriceHtml = product.originalPrice ? '<span>$' + product.originalPrice + '</span>' : '';
    
    return '<div class="product-card" onclick="showProductDetail(\'' + product.slug + '\')">' +
        '<div class="product-image-wrapper">' +
        '<span class="product-placeholder">' + product.emoji + '</span>' +
        badgeHtml +
        '</div>' +
        '<div class="product-info">' +
        '<span class="product-category">' + product.category + '</span>' +
        '<h3 class="product-title">' + product.name + '</h3>' +
        '<p class="product-description">' + product.desc + '</p>' +
        '<div class="product-price">$' + product.price + originalPriceHtml + '</div>' +
        '<button class="product-button">VIEW DETAILS</button>' +
        '</div>' +
        '</div>';
}

function goToProduct(slug) {
    window.location.href = '/products.html?product=' + slug;
}

function renderProducts(category) {
    var grid = document.getElementById('products-grid');
    var products = [];
    
    if (category === 'all') {
        for (var key in productsData) {
            products = products.concat(productsData[key]);
        }
    } else if (productsData[category]) {
        products = productsData[category];
    }
    
    if (products.length > 0) {
        grid.innerHTML = products.map(createProductCard).join('');
    } else {
        grid.innerHTML = '<div style="text-align:center; padding:60px 0; color:#666;">No products found</div>';
    }
}

function renderProductDetail(product) {
    var detailView = document.getElementById('product-detail-view');
    var badgeHtml = product.badge ? '<span class="product-badge">' + product.badge + '</span>' : '';
    var originalPriceHtml = product.originalPrice ? '<span class="original-price">$' + product.originalPrice + '</span>' : '';
    var featuresHtml = product.features.map(function(f) { return '<li>✓ ' + f + '</li>'; }).join('');
    
    var relatedProducts = [];
    for (var key in productsData) {
        relatedProducts = relatedProducts.concat(productsData[key]);
    }
    relatedProducts = relatedProducts.filter(function(p) { return p.slug !== product.slug; }).slice(0, 4);
    var relatedHtml = relatedProducts.map(function(rp) {
        return '<div class="related-card" onclick="showProductDetail(\'' + rp.slug + '\')">' +
            '<div class="related-card-image">' + rp.emoji + '</div>' +
            '<div class="related-card-details">' +
            '<h4 class="related-card-title">' + rp.name + '</h4>' +
            '<div class="related-card-price">$' + rp.price + '</div>' +
            '</div>' +
            '</div>';
    }).join('');
    
    detailView.innerHTML = '<div class="container">' +
        '<div class="product-detail-grid">' +
        '<div class="main-product-image">' +
        '<span>' + product.emoji + '</span>' +
        badgeHtml +
        '</div>' +
        '<div class="product-info-detail">' +
        '<span class="product-category">' + product.category + '</span>' +
        '<h1>' + product.name + '</h1>' +
        '<div class="product-price-detail">' +
        '<span class="current-price">$' + product.price + '</span>' +
        originalPriceHtml +
        '</div>' +
        '<div class="product-description">' +
        '<h3>DESCRIPTION</h3>' +
        '<p>' + product.desc + '</p>' +
        '</div>' +
        '<div class="product-features-detail">' +
        '<h3>FEATURES</h3>' +
        '<ul>' + featuresHtml + '</ul>' +
        '</div>' +
        '<div class="option-group">' +
        '<label>COLOR</label>' +
        '<div class="option-buttons">' +
        '<button class="option-btn selected">BLACK</button>' +
        '<button class="option-btn">WHITE</button>' +
        '<button class="option-btn">BLUE</button>' +
        '</div>' +
        '</div>' +
        '<div class="action-buttons">' +
        '<button class="btn-add-cart-detail">ADD TO QUOTE</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="related-products">' +
        '<div class="section-header">' +
        '<span class="section-badge">RELATED</span>' +
        '<h2 class="section-title">RELATED PRODUCTS</h2>' +
        '</div>' +
        '<div class="related-grid">' + relatedHtml + '</div>' +
        '</div>' +
        '</div>';
}

function showProductDetail(slug) {
    var product = findProduct(slug);
    if (!product) return false;
    
    document.getElementById('products-grid').style.display = 'none';
    document.getElementById('filters-bar').style.display = 'none';
    document.getElementById('category-tabs').parentElement.style.display = 'none';
    document.getElementById('page-hero').style.display = 'none';
    document.getElementById('product-detail-view').classList.add('active');
    renderProductDetail(product);
    
    window.scrollTo(0, 0);
    return true;
}

function showProductsList() {
    document.getElementById('products-grid').style.display = 'grid';
    document.getElementById('filters-bar').style.display = 'block';
    document.getElementById('category-tabs').parentElement.style.display = 'block';
    document.getElementById('page-hero').style.display = 'block';
    document.getElementById('product-detail-view').classList.remove('active');
    document.getElementById('product-detail-view').innerHTML = '';
}

function updatePageInfo(category) {
    var titleEl = document.getElementById('page-title');
    var descEl = document.getElementById('page-description');
    
    var titles = {
        'all': 'ALL PRODUCTS',
        'gaming-chairs': 'GAMING CHAIRS',
        'gaming-desks': 'GAMING DESKS',
        'mouse-pads': 'MOUSE PADS',
        'accessories': 'ACCESSORIES'
    };
    
    var descriptions = {
        'all': 'Discover our premium gaming furniture collection',
        'gaming-chairs': 'Professional gaming chairs with ergonomic design',
        'gaming-desks': 'Spacious desks for the perfect gaming setup',
        'mouse-pads': 'Premium mousepads for precision gaming',
        'accessories': 'Enhance your setup with our accessories'
    };
    
    titleEl.textContent = titles[category] || 'ALL PRODUCTS';
    descEl.textContent = descriptions[category] || 'Discover our premium gaming furniture collection';
}

function updateCategoryTabs(category) {
    document.querySelectorAll('.category-tab').forEach(function(tab) {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });
}

function init() {
    var currentCategory = getCurrentCategory();
    var productSlug = getParam('product');
    
    if (productSlug) {
        showProductDetail(productSlug);
    } else {
        updatePageInfo(currentCategory);
        updateCategoryTabs(currentCategory);
        renderProducts(currentCategory);
    }
    
    document.querySelectorAll('.category-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            var category = this.dataset.category;
            updatePageInfo(category);
            updateCategoryTabs(category);
            renderProducts(category);
            showProductsList();
            
            var url = new URL(window.location);
            url.searchParams.set('category', category);
            url.searchParams.delete('product');
            window.history.pushState({}, '', url);
        });
    });
    
    document.querySelectorAll('.filter-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');
        });
    });
    
    document.getElementById('sort-select').addEventListener('change', function() {
        var sortValue = this.value;
        var grid = document.getElementById('products-grid');
        var cards = Array.from(grid.children);
        
        cards.sort(function(a, b) {
            var priceA = parseFloat(a.querySelector('.product-price').textContent.replace('$', ''));
            var priceB = parseFloat(b.querySelector('.product-price').textContent.replace('$', ''));
            
            if (sortValue === 'price-low') {
                return priceA - priceB;
            } else if (sortValue === 'price-high') {
                return priceB - priceA;
            }
            return 0;
        });
        
        cards.forEach(function(card) { grid.appendChild(card); });
    });
}

function closeBanner() {
    var banner = document.getElementById('discountBanner');
    if (banner) {
        banner.style.display = 'none';
        document.querySelector('.site-header').style.top = '0';
    }
}
