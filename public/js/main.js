var lastScrollPosition = 0;

document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    initNavigation();
    initContactForm();
    loadFeaturedProducts();
    initCategoryFilter();
    setupHistoryNavigation();
    loadLatestArticles();
    loadGallery();
    loadCategories();
    loadBanner();
});

function setupHistoryNavigation() {
    window.addEventListener('popstate', function(e) {
        var savedScrollPosition = sessionStorage.getItem('homepageScrollPosition');
        if (savedScrollPosition !== null) {
            setTimeout(function() {
                window.scrollTo(0, parseInt(savedScrollPosition));
            }, 100);
        } else {
            setTimeout(function() {
                window.scrollTo(0, 0);
            }, 100);
        }
    });
}

function navigateToProductDetail(slug) {
    lastScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    sessionStorage.setItem('homepageScrollPosition', lastScrollPosition);
    history.replaceState({ returnTo: 'homepage', scrollPosition: lastScrollPosition }, '', '/products.html?product=' + slug);
    location.replace('/products.html?product=' + slug);
}

// Slider Functionality
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevArrow = document.querySelector('.slider-arrow-prev');
    const nextArrow = document.querySelector('.slider-arrow-next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function nextSlide() {
        const newIndex = (currentSlide + 1) % slides.length;
        showSlide(newIndex);
    }

    function prevSlide() {
        const newIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(newIndex);
    }

    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    prevArrow?.addEventListener('click', prevSlide);
    nextArrow?.addEventListener('click', nextSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    const slider = document.querySelector('.hero-slider');
    slider?.addEventListener('mouseenter', stopAutoPlay);
    slider?.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
}

// Navigation Functionality
function initNavigation() {
    const header = document.querySelector('.site-header');
    const discountBanner = document.getElementById('discountBanner');
    
    window.addEventListener('scroll', function() {
        const bg = getComputedStyle(document.documentElement).getPropertyValue('--header-bg').trim() || 'rgba(0, 0, 0, 0.98)';
        if (window.scrollY > 50) {
            header.style.background = bg;
            header.style.backdropFilter = 'blur(20px)';
            header.style.padding = '15px 0';
        } else {
            header.style.background = bg;
            header.style.backdropFilter = 'blur(15px)';
            header.style.padding = '20px 0';
        }
    });
}

function closeBanner() {
    const banner = document.getElementById('discountBanner');
    if (banner) {
        banner.style.display = 'none';
        document.querySelector('.site-header').style.top = '0';
    }
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-button');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'SENDING...';
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Add privacy consent flag
        data.privacyConsent = document.getElementById('privacy-check').checked;
        
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert(result.message || 'Your inquiry has been submitted! We will contact you within 24 hours.');
                form.reset();
            } else {
                alert(result.message || 'Failed to submit inquiry. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to submit inquiry. Please try again.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    });
}

// Featured Products Loading - 从 API 获取
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    fetch('/api/products')
    .then(response => response.json())
    .then(data => {
        const products = data.products;
        if (products && products.length > 0) {
            container.innerHTML = products.slice(0, 6).map(createProductCard).join('');
        } else {
            container.innerHTML = '<div style="text-align:center; padding:60px 0; color:#666;">No products available</div>';
        }
    })
    .catch(error => {
        console.error('Error loading products:', error);
        container.innerHTML = '<div style="text-align:center; padding:60px 0; color:#666;">No products available</div>';
    });
}

function createProductCard(product) {
    const imageHtml = product.images && product.images.length > 0
        ? `<img src="${product.images[0]}" alt="${product.name}">`
        : `<span class="product-placeholder">🪑</span>`;
    return `
        <div class="product-card" onclick="navigateToProductDetail('${product.slug}')">
            <div class="product-image-wrapper">
                ${imageHtml}
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <span class="product-button">VIEW DETAILS</span>
            </div>
        </div>
    `;
}

// Category Filtering
function initCategoryFilter() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        fetch(`/api/products?category=${category}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('categories-grid');
            if (container && data.products.length > 0) {
                container.innerHTML = data.products.map(createProductCard).join('');
            }
        })
        .catch(error => console.error('Error:', error));
    }
}

// Product Detail Modal
function showProductDetail(slug) {
    navigateToProductDetail(slug);
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('product-modal');
    if (modal && e.target === modal) {
        closeProductModal();
    }
});

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('.newsletter-input').value;
    
    fetch('/api/newsletter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    })
    .then(response => response.json())
    .then(result => {
        alert('Subscribed successfully!');
        this.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to subscribe');
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';        
    observer.observe(section);
});

// Load Latest Articles
async function loadLatestArticles() {
    const container = document.getElementById('latest-articles-grid');
    if (!container) return;

    try {
        const response = await fetch('/api/articles?limit=3');
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            const categoryLabels = {
                'news': 'NEWS',
                'guide': 'GUIDE',
                'blog': 'BLOG',
                'case': 'CASE STUDY'
            };
            
            container.innerHTML = data.articles.map(article => `
                <a href="/article.html?slug=${article.slug}" class="article-preview-card">
                    <div class="article-preview-image">
                        ${article.images && article.images.length > 0 ? '<img src="' + article.images[0] + '" alt="' + article.title + '">' : '<span>📰</span>'}
                    </div>
                    <div class="article-preview-content">
                        <span class="article-preview-category">${categoryLabels[article.category] || article.category}</span>
                        <h3 class="article-preview-title">${article.title}</h3>
                        <p class="article-preview-excerpt">${article.excerpt}</p>
                        <span class="article-preview-date">${article.publishedAt}</span>
                    </div>
                </a>
            `).join('');
        } else {
            container.innerHTML = '<p style="color:var(--text-secondary); text-align:center; grid-column:1/-1;">No articles available</p>';
        }
    } catch (error) {
        console.error('Error loading latest articles:', error);
    }
}

// Load Gallery
async function loadGallery() {
    const container = document.getElementById('gallery-grid');
    if (!container) return;

    try {
        const response = await fetch('/api/gallery');
        const data = await response.json();
        const galleryItems = data.gallery || [];

        container.innerHTML = galleryItems.map(item => `
            <div class="gallery-item">
                ${item.image
                    ? `<img src="${item.image}" alt="${item.alt}"><span class="gallery-overlay">+</span>`
                    : `<span class="gallery-placeholder">🖼️</span><span class="gallery-overlay">+</span>`}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

// Load Categories
async function loadCategories() {
    const container = document.getElementById('categories-grid');
    if (!container) return;

    try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        const categories = data.categories || [];

        container.innerHTML = categories.map(cat => `
            <a href="/products.html?category=${cat.id}" class="category-card">
                <div class="category-image-wrapper">
                    <img src="${cat.image}" alt="${cat.name}" class="category-image">
                    <span class="category-badge ${cat.isComingSoon ? 'coming-soon' : ''}">${cat.badge}</span>
                </div>
                <div class="category-info">
                    <h3 class="category-title">${cat.name}</h3>
                    <p class="category-description">${cat.description}</p>
                    <span class="category-count">${cat.isComingSoon ? 'COMING SOON' : cat.productCount + ' PRODUCTS'}</span>
                </div>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
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

        document.getElementById('banner-badge').textContent = bannerData.badge || '';
        document.getElementById('banner-text').textContent = bannerData.text || '';
        document.getElementById('banner-code').textContent = bannerData.code || '';

        // 隐藏空字段
        ['banner-badge', 'banner-text', 'banner-code'].forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.textContent.trim()) {
                el.style.display = 'none';
            } else if (el) {
                el.style.display = '';
            }
        });

        // 检查关闭状态
        if (sessionStorage.getItem('bannerClosed') === 'true') {
            banner.style.display = 'none';
        }
    } catch (error) {
        console.error('Error loading banner:', error);
    }
}
