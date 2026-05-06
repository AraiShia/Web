<?php
/*
Template Name: Soinp Gaming Products
Template Post Type: page
*/

get_header(); ?>

    <section class="page-hero">
        <div class="container">
            <h1 id="page-title">All Products</h1>
            <p id="page-description">Discover our premium gaming furniture collection.</p>
        </div>
    </section>

    <section class="products-section">
        <div class="container">
            <div class="category-tabs" id="category-tabs">
                <button class="category-tab active" data-category="all">All Products</button>
                <button class="category-tab" data-category="gaming-chairs">Gaming Chairs</button>
                <button class="category-tab" data-category="gaming-desks">Gaming Desks</button>
                <button class="category-tab" data-category="mouse-pads">Mouse Pads</button>
                <button class="category-tab" data-category="accessories">Accessories</button>
            </div>

            <div class="filters" id="filters-bar">
                <div class="filter-group">
                    <button class="filter-btn active">All</button>
                    <button class="filter-btn">Pro Series</button>
                    <button class="filter-btn">Casual</button>
                    <button class="filter-btn">Budget</button>
                </div>
                <select class="sort-select">
                    <option>Sort by: Popular</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                </select>
            </div>

            <div class="products-grid" id="products-grid">
                <div style="text-align:center; padding:60px 0; color:#666;">Loading products...</div>
            </div>

            <div class="product-detail-view" id="product-detail-view"></div>
        </div>
    </section>

    <script>
        var productsData = {
            'gaming-chairs': [
                { id: 1, slug: 'pro-gaming-chair-x1', name: 'Pro Gaming Chair X1', category: 'Pro Series', price: 299, originalPrice: 499, badge: 'hot', emoji: '🪑', desc: 'Ergonomic design with premium materials.', features: ['4D armrests', 'Adjustable lumbar support', 'Memory foam'] },
                { id: 2, slug: 'pro-gaming-chair-x3', name: 'Pro Gaming Chair X3', category: 'Pro Series', price: 399, originalPrice: 599, badge: 'new', emoji: '🪑', desc: 'Upgraded with RGB lighting.', features: ['RGB lighting', 'Breathable mesh', '4D armrests'] },
                { id: 3, slug: 'casual-gaming-chair', name: 'Casual Gaming Chair', category: 'Casual', price: 199, originalPrice: 299, badge: '', emoji: '🪑', desc: 'Comfortable casual design.', features: ['2D armrests', 'Fixed lumbar', 'High-density foam'] },
                { id: 4, slug: 'starter-gaming-chair', name: 'Starter Gaming Chair', category: 'Budget', price: 149, originalPrice: 229, badge: 'sale', emoji: '🪑', desc: 'Great value option.', features: ['Basic armrests', 'Simple lumbar', 'Standard foam'] }
            ],
            'gaming-desks': [
                { id: 101, slug: 'pro-gaming-desk-xl', name: 'Pro Gaming Desk XL', category: 'Pro Series', price: 349, originalPrice: 499, badge: 'new', emoji: '🖥️', desc: 'Spacious gaming desk with RGB.', features: ['RGB strips', 'Cable management', 'Carbon fiber'] },
                { id: 102, slug: 'compact-gaming-desk', name: 'Compact Gaming Desk', category: 'Casual', price: 199, originalPrice: 279, badge: '', emoji: '🖥️', desc: 'Space-saving design.', features: ['Compact size', 'Headphone hook', 'Cup holder'] }
            ],
            'mouse-pads': [
                { id: 201, slug: 'rgb-extended-mouse-pad', name: 'RGB Extended Mouse Pad', category: 'Pro Series', price: 79, originalPrice: 119, badge: 'hot', emoji: '🖱️', desc: 'XXL size with RGB.', features: ['15 RGB modes', 'Water-resistant', 'Non-slip base'] },
                { id: 202, slug: 'speed-edition-mouse-pad', name: 'Speed Edition', category: 'Casual', price: 39, originalPrice: 59, badge: '', emoji: '🖱️', desc: 'Ultra-smooth surface.', features: ['Smooth surface', 'Low friction', 'Portable'] }
            ],
            'accessories': [
                { id: 301, slug: 'gaming-headset-stand', name: 'Headset Stand', category: 'Accessories', price: 59, originalPrice: 89, badge: '', emoji: '🎧', desc: 'Premium aluminum stand.', features: ['Aluminum', 'RGB lighting', 'USB hub'] },
                { id: 302, slug: 'cable-management-kit', name: 'Cable Kit', category: 'Accessories', price: 29, originalPrice: 49, badge: 'sale', emoji: '🔌', desc: 'Complete cable solution.', features: ['Clips', 'Velcro ties', 'Sleeves'] }
            ]
        };

        var categoryInfo = {
            'all': { title: 'All Products', description: 'Discover our premium gaming furniture collection.' },
            'gaming-chairs': { title: 'Gaming Chairs', description: 'Premium gaming chairs for comfort and performance.' },
            'gaming-desks': { title: 'Gaming Desks', description: 'Professional gaming desks with space-efficient designs.' },
            'mouse-pads': { title: 'Mouse Pads', description: 'High-performance mouse pads.' },
            'accessories': { title: 'Accessories', description: 'Essential gaming accessories.' }
        };

        function getParam(name) {
            var urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(name);
        }

        function getCurrentCategory() {
            var category = getParam('category');
            if (category && categoryInfo[category]) {
                return category;
            }
            return 'all';
        }

        function findProduct(slug) {
            for (var category in productsData) {
                var product = productsData[category].find(function(p) { return p.slug === slug; });
                if (product) return product;
            }
            return null;
        }

        function createProductCard(product) {
            var badgeHtml = product.badge ? '<span class="product-badge badge-' + product.badge + '">' + product.badge + '</span>' : '';
            var originalPriceHtml = product.originalPrice ? '<span class="original">$' + product.originalPrice + '</span>' : '';
            
            return '<article class="product-card" data-slug="' + product.slug + '">' +
                '<div class="product-image">' + badgeHtml + product.emoji + '</div>' +
                '<div class="product-details">' +
                '<div class="product-category">' + product.category + '</div>' +
                '<h3 class="product-title">' + product.name + '</h3>' +
                '<p class="product-desc">' + product.desc + '</p>' +
                '<div class="product-price">$' + product.price + ' ' + originalPriceHtml + '</div>' +
                '<div class="product-actions">' +
                '<button class="btn btn-primary" onclick="goToProduct(\'' + product.slug + '\')">View Details</button>' +
                '</div>' +
                '</div>' +
                '</article>';
        }

        function goToProduct(slug) {
            window.location.href = '<?php echo esc_url(get_permalink()); ?>?product=' + slug;
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

            if (products.length === 0) {
                grid.innerHTML = '<div style="text-align:center; padding:60px 0; color:#666;">No products found</div>';
                return;
            }

            grid.innerHTML = products.map(createProductCard).join('');
        }

        function renderProductDetail(product) {
            var detailView = document.getElementById('product-detail-view');
            var featuresHtml = product.features.map(function(f) { return '<li>' + f + '</li>'; }).join('');
            
            var relatedProducts = [];
            for (var cat in productsData) {
                relatedProducts = relatedProducts.concat(productsData[cat]);
            }
            relatedProducts = relatedProducts.filter(function(p) { return p.slug !== product.slug; }).slice(0, 4);
            var relatedHtml = relatedProducts.map(function(rp) {
                return '<div class="related-card" onclick="goToProduct(\'' + rp.slug + '\')">' +
                    '<div class="related-card-image">' + rp.emoji + '</div>' +
                    '<div class="related-card-details">' +
                    '<div class="related-card-title">' + rp.name + '</div>' +
                    '<div class="related-card-price">$' + rp.price + '</div>' +
                    '</div>' +
                    '</div>';
            }).join('');

            detailView.innerHTML = 
                '<div class="product-detail-grid">' +
                '<div class="main-product-image">' + (product.badge ? '<span class="product-badge badge-' + product.badge + '">' + product.badge + '</span>' : '') + product.emoji + '</div>' +
                '<div class="product-info-detail">' +
                '<h1>' + product.name + '</h1>' +
                '<div class="product-category">' + product.category + '</div>' +
                '<div class="product-price-detail">' +
                '<span class="current-price">$' + product.price + '</span>' +
                (product.originalPrice ? '<span class="original-price">$' + product.originalPrice + '</span>' : '') +
                '</div>' +
                '<div class="product-description"><h3>Description</h3><p>' + product.desc + '</p></div>' +
                '<div class="product-features-detail"><h3>Features</h3><ul>' + featuresHtml + '</ul></div>' +
                '<div class="option-group"><label>Color</label><div class="option-buttons"><button class="option-btn selected">Black</button><button class="option-btn">Black/Red</button></div></div>' +
                '<div class="action-buttons"><button class="btn-add-cart-detail">Request Quote</button></div>' +
                '</div>' +
                '</div>' +
                (relatedHtml ? '<div class="related-products"><h3>Related Products</h3><div class="related-grid">' + relatedHtml + '</div></div>' : '');
        }

        function showProductDetail(slug) {
            var product = findProduct(slug);
            if (!product) return false;
            
            document.getElementById('products-grid').style.display = 'none';
            document.getElementById('filters-bar').style.display = 'none';
            document.getElementById('category-tabs').style.display = 'none';
            document.getElementById('page-hero').style.display = 'none';
            document.getElementById('product-detail-view').classList.add('active');
            renderProductDetail(product);
            return true;
        }

        function showProductsList() {
            document.getElementById('products-grid').style.display = 'grid';
            document.getElementById('filters-bar').style.display = 'flex';
            document.getElementById('category-tabs').style.display = 'flex';
            document.getElementById('page-hero').style.display = 'block';
            document.getElementById('product-detail-view').classList.remove('active');
        }

        function updatePageInfo(category) {
            var info = categoryInfo[category];
            if (info) {
                document.getElementById('page-title').textContent = info.title;
                document.getElementById('page-description').textContent = info.description;
            }
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
            var productSlug = getParam('product');
            var currentCategory = getCurrentCategory();
            
            if (productSlug) {
                var found = showProductDetail(productSlug);
                if (!found) {
                    showProductsList();
                    updatePageInfo(currentCategory);
                    updateCategoryTabs(currentCategory);
                    renderProducts(currentCategory);
                }
            } else {
                showProductsList();
                updatePageInfo(currentCategory);
                updateCategoryTabs(currentCategory);
                renderProducts(currentCategory);
            }

            document.querySelectorAll('.category-tab').forEach(function(tab) {
                tab.addEventListener('click', function() {
                    var category = this.dataset.category;
                    window.location.href = '<?php echo esc_url(get_permalink()); ?>?category=' + category;
                });
            });

            document.querySelectorAll('.filter-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
                    this.classList.add('active');
                });
            });
        }

        document.addEventListener('DOMContentLoaded', init);
    </script>

<?php get_footer(); ?>
