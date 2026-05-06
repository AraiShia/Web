<?php get_header(); ?>

    <main>
        <!-- Hero Section -->
        <section class="hero-section" id="home">
            <div class="container">
                <div class="hero-content">
                    <span class="hero-badge">#1 Gaming Furniture Brand</span>
                    <h1 class="hero-title">Elevate Your <span>Gaming Experience</span></h1>
                    <p class="hero-description">Discover premium gaming chairs, desks, and accessories designed for champions. Unleash your full potential with Soinp Gaming.</p>
                    <div class="hero-buttons">
                        <a href="#products" class="btn-primary">SHOP NOW</a>
                        <a href="#about" class="btn-secondary">LEARN MORE</a>
                    </div>
                </div>

                <!-- Slider -->
                <div class="slider-container">
                    <div class="slider-wrapper" id="sliderWrapper">
                        <div class="slider-slide">
                            <span class="slider-image">🪑</span>
                        </div>
                        <div class="slider-slide">
                            <span class="slider-image">🖥️</span>
                        </div>
                        <div class="slider-slide">
                            <span class="slider-image">🎮</span>
                        </div>
                    </div>
                    <div class="slider-controls">
                        <button class="slider-btn" onclick="prevSlide()">‹</button>
                        <button class="slider-btn" onclick="nextSlide()">›</button>
                    </div>
                    <div class="slider-indicators">
                        <span class="slider-dot active" onclick="goToSlide(0)"></span>
                        <span class="slider-dot" onclick="goToSlide(1)"></span>
                        <span class="slider-dot" onclick="goToSlide(2)"></span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Categories Section -->
        <section class="categories-section" id="products">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">PRODUCT CATEGORIES</h2>
                    <p class="section-subtitle">Explore our wide range of gaming furniture and accessories</p>
                </div>
                <div class="categories-grid">
                    <div class="category-card" onclick="location.href='<?php echo esc_url(get_permalink(get_page_by_path('gaming-chairs'))); ?>'">
                        <span class="category-icon">🪑</span>
                        <h3 class="category-name">Gaming Chairs</h3>
                        <p class="category-desc">Premium ergonomic chairs for ultimate comfort</p>
                        <span class="category-count">12+ Products</span>
                    </div>
                    <div class="category-card">
                        <span class="category-icon">🖥️</span>
                        <h3 class="category-name">Gaming Desks</h3>
                        <p class="category-desc">Spacious and stylish gaming workstations</p>
                        <span class="category-count">8+ Products</span>
                    </div>
                    <div class="category-card">
                        <span class="category-icon">🖱️</span>
                        <h3 class="category-name">Mouse Pads</h3>
                        <p class="category-desc">Large gaming mouse pads with RGB</p>
                        <span class="category-count">15+ Products</span>
                    </div>
                    <div class="category-card">
                        <span class="category-icon">🎧</span>
                        <h3 class="category-name">Accessories</h3>
                        <p class="category-desc">Headphone stands, cup holders & more</p>
                        <span class="category-count">20+ Products</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Products Section -->
        <section class="products-section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">FEATURED PRODUCTS</h2>
                    <p class="section-subtitle">Handpicked selection of our most popular products</p>
                </div>
                <div class="products-grid">
                    <?php
                    $args = array(
                        'post_type' => 'product',
                        'posts_per_page' => 4,
                        'orderby' => 'date',
                        'order' => 'DESC',
                    );
                    $products = new WP_Query($args);
                    
                    if ($products->have_posts()) :
                        while ($products->have_posts()) : $products->the_post();
                    ?>
                    <article class="product-card">
                        <div class="product-image-wrapper">
                            <?php if (has_post_thumbnail()) : ?>
                                <?php the_post_thumbnail('medium'); ?>
                            <?php else : ?>
                                <span class="product-placeholder">🪑</span>
                            <?php endif; ?>
                            <span class="product-badge">HOT</span>
                        </div>
                        <div class="product-info">
                            <div class="product-category">PRO SERIES</div>
                            <h3 class="product-title"><?php the_title(); ?></h3>
                            <p class="product-description"><?php echo wp_trim_words(get_the_content(), 15); ?></p>
                            <div class="product-price">$299 <span>$499</span></div>
                            <button class="product-button">ADD TO CART</button>
                        </div>
                    </article>
                    <?php
                        endwhile;
                        wp_reset_postdata();
                    else :
                    ?>
                    <p>No products found.</p>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features-section" id="features">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">WHY CHOOSE SOINP</h2>
                    <p class="section-subtitle">Discover what makes our gaming furniture stand out</p>
                </div>
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon">🎯</div>
                        <h3 class="feature-title">Ergonomic Design</h3>
                        <p class="feature-description">Our chairs are engineered for maximum comfort during long gaming sessions, reducing fatigue and improving posture.</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">✨</div>
                        <h3 class="feature-title">Premium Materials</h3>
                        <p class="feature-description">Crafted with high-quality materials including memory foam, breathable mesh, and durable metal frames.</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🎨</div>
                        <h3 class="feature-title">RGB Lighting</h3>
                        <p class="feature-description">Customizable RGB lighting with millions of colors to match your gaming setup and mood.</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🛡️</div>
                        <h3 class="feature-title">Global Warranty</h3>
                        <p class="feature-description">Enjoy peace of mind with our comprehensive warranty and excellent customer support.</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🌍</div>
                        <h3 class="feature-title">Free Shipping</h3>
                        <p class="feature-description">Get free worldwide shipping on all orders over $200. Fast and reliable delivery.</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🔄</div>
                        <h3 class="feature-title">30-Day Returns</h3>
                        <p class="feature-description">Not satisfied? Return your purchase within 30 days for a full refund, no questions asked.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Highlights Section -->
        <section class="highlights-section" id="about">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">OUR STATS</h2>
                    <p class="section-subtitle">Trusted by gamers worldwide</p>
                </div>
                <div class="highlights-grid">
                    <div class="highlight-item">
                        <div class="highlight-number">50K+</div>
                        <div class="highlight-label">Happy Customers</div>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-number">150+</div>
                        <div class="highlight-label">Countries</div>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-number">4.9/5</div>
                        <div class="highlight-label">Rating</div>
                    </div>
                    <div class="highlight-item">
                        <div class="highlight-number">100+</div>
                        <div class="highlight-label">Products</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Gallery Section -->
        <section class="gallery-section" id="gallery">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">GALLERY</h2>
                    <p class="section-subtitle">See our products in action</p>
                </div>
                <div class="gallery-grid">
                    <div class="gallery-item large">
                        <span class="gallery-icon">🪑</span>
                    </div>
                    <div class="gallery-item">
                        <span class="gallery-icon">🖥️</span>
                    </div>
                    <div class="gallery-item">
                        <span class="gallery-icon">🎮</span>
                    </div>
                    <div class="gallery-item">
                        <span class="gallery-icon">🖱️</span>
                    </div>
                    <div class="gallery-item">
                        <span class="gallery-icon">🎧</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="contact-section" id="contact">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">CONTACT US</h2>
                    <p class="section-subtitle">Get in touch with our support team</p>
                </div>
                <div class="contact-container">
                    <div class="contact-info">
                        <div class="contact-item">
                            <div class="contact-icon-wrapper">📧</div>
                            <div class="contact-content">
                                <h3>Email</h3>
                                <p><a href="mailto:support@soinp.com">support@soinp.com</a></p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-icon-wrapper">📞</div>
                            <div class="contact-content">
                                <h3>Phone</h3>
                                <p><a href="tel:+1234567890">+1 (234) 567-890</a></p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-icon-wrapper">📍</div>
                            <div class="contact-content">
                                <h3>Address</h3>
                                <p>123 Gaming Street, Los Angeles, CA 90001</p>
                            </div>
                        </div>
                    </div>
                    <form class="contact-form" action="#" method="post">
                        <div class="form-group">
                            <label class="form-label">Name</label>
                            <input type="text" class="form-input" placeholder="Your name" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" placeholder="Your email" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Message</label>
                            <textarea class="form-input" placeholder="Your message" required></textarea>
                        </div>
                        <button type="submit" class="form-button">SEND MESSAGE</button>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <script>
        // Slider functionality
        let currentSlide = 0;
        const slides = document.querySelectorAll('.slider-slide');
        
        function showSlide(index) {
            const wrapper = document.getElementById('sliderWrapper');
            wrapper.style.transform = `translateX(-${index * 100}%)`;
            
            document.querySelectorAll('.slider-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentSlide = index;
        }
        
        function nextSlide() {
            const nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }
        
        function prevSlide() {
            const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        }
        
        function goToSlide(index) {
            showSlide(index);
        }
        
        // Auto slide
        setInterval(nextSlide, 5000);

        // Form submission
        document.querySelector('.contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will contact you soon.');
            this.reset();
        });

        // Newsletter form
        document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing! You will receive our latest updates.');
            this.reset();
        });

        // Intersection Observer for animations
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.category-card, .feature-item, .highlight-item, .gallery-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    </script>

<?php get_footer(); ?>