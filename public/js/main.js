document.addEventListener('DOMContentLoaded', function() {
    initSlider();
    initNavigation();
    initContactForm();
    loadFeaturedProducts();
    initCategoryFilter();
});

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
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.padding = '15px 0';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
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
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(result => {
            alert('Message sent successfully!');
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to send message. Please try again.');
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
    const url = '/products.html?product=' + product.slug;
    const imageHtml = product.images && product.images.length > 0
        ? `<img src="${product.images[0]}" alt="${product.name}">`
        : `<span class="product-placeholder">🪑</span>`;
    return `
        <div class="product-card">
            <div class="product-image-wrapper">
                ${imageHtml}
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <a href="${url}" class="product-button">VIEW DETAILS</a>
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
    fetch(`/api/products/${slug}`)
    .then(response => response.json())
    .then(product => {
        const modal = document.getElementById('product-modal');
        const detailContainer = document.getElementById('modal-product-detail');
        
        if (!modal || !detailContainer) return;

        detailContainer.innerHTML = `
            <div class="main-product-image">
                <span>🪑</span>
            </div>
            <div class="product-info-detail">
                <span class="product-category">${product.category}</span>
                <h1>${product.name}</h1>
                <div class="product-description-detail">
                    <h3>DESCRIPTION</h3>
                    <p>${product.description}</p>
                </div>
                <div class="product-features-detail">
                    <h3>FEATURES</h3>
                    <ul>
                        ${product.features.map(f => `<li>✓ ${f}</li>`).join('')}
                    </ul>
                </div>
                <div class="option-group">
                    <label>COLOR</label>
                    <div class="option-buttons">
                        <button class="option-btn selected">BLACK</button>
                        <button class="option-btn">WHITE</button>
                        <button class="option-btn">BLUE</button>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="btn-add-cart-detail" onclick="alert('Coming soon')">ADD TO QUOTE</button>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    })
    .catch(error => {
        console.error('Error loading product:', error);
        alert('Product not found');
    });
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
