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

// 从 API 加载产品数据
function fetchProducts(category) {
    var url = '/api/products';
    if (category && category !== 'all') {
        url += '?category=' + category;
    }

    return fetch(url)
    .then(function(response) { return response.json(); })
    .then(function(data) { return data.products || []; })
    .catch(function(error) {
        console.error('Error loading products:', error);
        return [];
    });
}

function createProductCard(product) {
    var imageHtml = product.images && product.images.length > 0
        ? '<img src="' + product.images[0] + '" alt="' + product.name + '">'
        : '<span class="product-placeholder">🪑</span>';

    var badgeHtml = product.badge
        ? '<span class="product-badge">' + product.badge + '</span>'
        : '';

    return '<div class="product-card" onclick="goToProduct(\'' + product.slug + '\')">' +
        '<div class="product-image-wrapper">' +
        imageHtml +
        badgeHtml +
        '</div>' +
        '<div class="product-info">' +
        '<span class="product-category">' + product.category + '</span>' +
        '<h3 class="product-title">' + product.name + '</h3>' +
        '<p class="product-description">' + product.description + '</p>' +
        '<div class="product-actions">' +
        '<button class="product-button" onclick="event.stopPropagation(); showProductDetail(\'' + product.slug + '\')">VIEW DETAILS</button>' +
        '<button class="product-button inquiry-btn" onclick="event.stopPropagation(); addToInquiryCartFromList(\'' + product.name + '\', this)">+ INQUIRY</button>' +
        '</div>' +
        '</div>' +
        '</div>';
}

function goToProduct(slug) {
    window.location.href = '/products.html?product=' + slug;
}

// Add product to inquiry cart from product list
function addToInquiryCartFromList(productName, btn) {
    if (typeof inquiryCart !== 'undefined') {
        if (!inquiryCart.includes(productName)) {
            inquiryCart.push(productName);
            // Update display if modal is open
            if (typeof updateInquiryCartDisplay === 'function') {
                updateInquiryCartDisplay();
            }
            // Show feedback
            const originalText = btn.textContent;
            btn.textContent = '✓ Added';
            btn.style.background = 'rgba(0, 255, 136, 0.3)';
            btn.style.color = 'var(--accent-color)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 1500);
        } else {
            btn.textContent = 'Already in cart';
            setTimeout(() => {
                btn.textContent = '+ INQUIRY';
            }, 1500);
        }
    }
}

function renderProducts(category) {
    var grid = document.getElementById('products-grid');
    grid.innerHTML = '<div style="text-align:center; padding:60px 0; color:#666;">Loading products...</div>';

    fetchProducts(category).then(function(products) {
        if (products.length > 0) {
            grid.innerHTML = products.map(createProductCard).join('');
        } else {
            grid.innerHTML = '<div style="text-align:center; padding:60px 0; color:#666;">No products found</div>';
        }
    });
}

function renderProductDetail(product) {
    var detailView = document.getElementById('product-detail-view');

    var features = product.features || [];
    var featuresHtml = features.map(function(f) { return '<li>✓ ' + f + '</li>'; }).join('');

    var images = product.images || [];

    // 构建图片轮播 HTML
    var carouselHtml = '';
    if (images.length > 0) {
        var imgsHtml = images.map(function(src, i) {
            return '<img src="' + src + '" alt="' + product.name + ' ' + (i + 1) + '"' + (i === 0 ? ' class="active"' : '') + ' onerror="this.style.display=\'none\'">';
        }).join('');

        var dotsHtml = images.length > 1 ? images.map(function(_, i) {
            return '<button class="carousel-dot' + (i === 0 ? ' active' : '') + '" onclick="goToSlide(' + i + ')"></button>';
        }).join('') : '';

        var navHtml = images.length > 1 ?
            '<button class="carousel-nav prev" onclick="prevSlide()">&#10094;</button>' +
            '<button class="carousel-nav next" onclick="nextSlide()">&#10095;</button>' : '';

        var thumbsHtml = images.length > 1 ?
            '<div class="thumbnail-strip">' + images.map(function(src, i) {
                return '<div class="thumbnail-item' + (i === 0 ? ' active' : '') + '" onclick="goToSlide(' + i + ')">' +
                    '<img src="' + src + '" alt="Thumb ' + (i + 1) + '">' +
                    '</div>';
            }).join('') + '</div>' : '';

        carouselHtml = '<div class="image-carousel" id="image-carousel">' +
            imgsHtml + navHtml + dotsHtml +
            '</div>';
        thumbsHtml = images.length > 1 ?
            '<div class="thumbnail-strip">' + images.map(function(src, i) {
                return '<div class="thumbnail-item' + (i === 0 ? ' active' : '') + '" onclick="goToSlide(' + i + ')">' +
                    '<img src="' + src + '" alt="Thumb ' + (i + 1) + '">' +
                    '</div>';
            }).join('') + '</div>' : '';
    } else {
        carouselHtml = '<span style="font-size:80px;">🪑</span>';
    }

    // 加载相关产品
    fetchProducts('all').then(function(allProducts) {
        var relatedProducts = allProducts
            .filter(function(p) { return p.slug !== product.slug; })
            .slice(0, 4);

        var relatedHtml = relatedProducts.map(function(rp) {
            var rpImage = rp.images && rp.images.length > 0
                ? '<img src="' + rp.images[0] + '" alt="' + rp.name + '" onerror="this.style.display=\'none\'">'
                : '<span>🪑</span>';
            return '<div class="related-card" onclick="showProductDetail(\'' + rp.slug + '\')">' +
                '<div class="related-card-image">' + rpImage + '</div>' +
                '<div class="related-card-details">' +
                '<h4 class="related-card-title">' + rp.name + '</h4>' +
                '</div>' +
                '</div>';
        }).join('');

        detailView.innerHTML = '<div class="container">' +
            '<button class="back-button" onclick="showProductsList()" style="margin-bottom:20px; padding:10px 20px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:var(--text-secondary); cursor:pointer; display:flex; align-items:center; gap:8px;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
            'Back to Products</button>' +
            '<div class="product-detail-grid">' +
            '<div class="product-gallery">' +
            '<div class="main-product-image">' +
            carouselHtml +
            '</div>' +
            thumbsHtml +
            '</div>' +
            '<div class="product-info-detail">' +
            '<span class="product-category">' + product.category + '</span>' +
            '<h1>' + product.name + '</h1>' +
            '<div class="product-description">' +
            '<h3>DESCRIPTION</h3>' +
            '<p>' + product.description + '</p>' +
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
            '<button class="btn-add-cart-detail" onclick="openInquiryModal(\'' + product.name + '\')">SEND INQUIRY</button>' +
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
    });
}

// 轮播控制
var currentSlide = 0;
var totalSlides = 0;

function updateCarousel() {
    var carousel = document.getElementById('image-carousel');
    if (!carousel) return;

    var imgs = carousel.querySelectorAll('img');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var thumbs = document.querySelectorAll('.thumbnail-item');

    imgs.forEach(function(img, i) {
        img.classList.toggle('active', i === currentSlide);
    });
    dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === currentSlide);
    });
    thumbs.forEach(function(thumb, i) {
        thumb.classList.toggle('active', i === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function showProductDetail(slug) {
    // 从 API 获取单个产品
    fetch('/api/products/' + slug)
    .then(function(response) {
        if (!response.ok) throw new Error('Product not found');
        return response.json();
    })
    .then(function(product) {
        if (!product || product.message) throw new Error('Not found');

        // 初始化轮播
        currentSlide = 0;
        totalSlides = (product.images || []).length;

        document.getElementById('products-grid').style.display = 'none';
        document.getElementById('filters-bar').style.display = 'none';
        document.getElementById('category-tabs').parentElement.style.display = 'none';
        document.getElementById('page-hero').style.display = 'none';
        document.getElementById('product-detail-view').classList.add('active');
        renderProductDetail(product);

        var category = getCurrentCategory();
        var newUrl = '/products.html?category=' + category + '&product=' + slug;
        history.pushState({ category: category, product: slug }, '', newUrl);

        window.scrollTo(0, 0);
    })
    .catch(function(error) {
        console.error('Error loading product:', error);
        alert('Product not found');
    });

    return true;
}

function showProductsList() {
    document.getElementById('products-grid').style.display = 'grid';
    document.getElementById('filters-bar').style.display = 'block';
    document.getElementById('category-tabs').parentElement.style.display = 'block';
    document.getElementById('page-hero').style.display = 'block';
    document.getElementById('product-detail-view').classList.remove('active');
    document.getElementById('product-detail-view').innerHTML = '';

    // Update URL to remove product parameter
    var url = new URL(window.location);
    url.searchParams.delete('product');
    window.history.pushState({}, '', url);
}

// Handle browser back button
window.addEventListener('popstate', function(e) {
    // If came from homepage, clear flag and let browser handle it
    if (sessionStorage.getItem('cameFromHomepage') === 'true') {
        sessionStorage.removeItem('cameFromHomepage');
        return; // Let browser handle naturally (go to homepage)
    }
    
    var productSlug = getParam('product');
    if (productSlug) {
        showProductDetail(productSlug);
    } else {
        showProductsList();
    }
});

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

    // Check if we came from homepage
    var referrer = document.referrer;
    if (referrer && (referrer.includes('localhost') || referrer.includes(window.location.hostname)) && !referrer.includes('products.html')) {
        sessionStorage.setItem('cameFromHomepage', 'true');
    }

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
        var grid = document.getElementById('products-grid');
        var cards = Array.from(grid.children);

        cards.sort(function(a, b) {
            var priceA = parseFloat(a.querySelector('.product-price') ? a.querySelector('.product-price').textContent.replace('$', '') : '0');
            var priceB = parseFloat(b.querySelector('.product-price') ? b.querySelector('.product-price').textContent.replace('$', '') : '0');

            if (this.value === 'price-low') return priceA - priceB;
            if (this.value === 'price-high') return priceB - priceA;
            return 0;
        }.bind(this));

        cards.forEach(function(card) { grid.appendChild(card); });
    });

    window.addEventListener('popstate', function(e) {
        // If came from homepage, clear flag and let browser handle it
        if (sessionStorage.getItem('cameFromHomepage') === 'true') {
            sessionStorage.removeItem('cameFromHomepage');
            return; // Let browser handle naturally (go to homepage)
        }
        
        if (e.state && e.state.product) {
            showProductDetail(e.state.product);
        } else {
            showProductsList();
            var category = getCurrentCategory();
            updatePageInfo(category);
            updateCategoryTabs(category);
            renderProducts(category);
        }
    });
}

function closeBanner() {
    var banner = document.getElementById('discountBanner');
    if (banner) {
        banner.style.display = 'none';
        document.querySelector('.site-header').style.top = '0';
    }
}