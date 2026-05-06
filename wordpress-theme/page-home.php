<?php
/*
Template Name: Soinp Gaming Home
Template Post Type: page
*/

get_header(); ?>

    <!-- Hero Slider Section -->
    <section class="hero-slider">
        <div class="slides-container">
            <div class="slide active">
                <div class="slide-bg"></div>
                <div class="slide-content">
                    <div class="slide-inner">
                        <span class="slide-badge">Premium Gaming Furniture</span>
                        <h1 class="slide-title">Elevate Your <span>Gaming Experience</span></h1>
                        <p class="slide-subtitle">Discover the ultimate gaming chairs, desks, and accessories designed for champions.</p>
                        <div class="slide-buttons">
                            <a href="#products" class="cta-button">
                                <span>Explore Products</span>
                                <span>→</span>
                            </a>
                            <a href="#about" class="cta-button-secondary">
                                <span>Learn More</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="slide">
                <div class="slide-bg"></div>
                <div class="slide-content">
                    <div class="slide-inner">
                        <span class="slide-badge">Ergonomic Design</span>
                        <h1 class="slide-title">Comfort <span>Meets Performance</span></h1>
                        <p class="slide-subtitle">Premium materials and innovative design for hours of comfortable gaming.</p>
                        <div class="slide-buttons">
                            <a href="#products" class="cta-button">
                                <span>Shop Now</span>
                                <span>→</span>
                            </a>
                            <a href="#features" class="cta-button-secondary">
                                <span>Our Features</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="slide">
                <div class="slide-bg"></div>
                <div class="slide-content">
                    <div class="slide-inner">
                        <span class="slide-badge">Bulk Orders Welcome</span>
                        <h1 class="slide-title">B2B <span>Solutions</span></h1>
                        <p class="slide-subtitle">Special pricing and dedicated support for business clients.</p>
                        <div class="slide-buttons">
                            <a href="#contact" class="cta-button">
                                <span>Request Quote</span>
                                <span>→</span>
                            </a>
                            <a href="#about" class="cta-button-secondary">
                                <span>Contact Us</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Slider Navigation -->
        <div class="slider-nav">
            <div class="slider-dot active" data-slide="0"></div>
            <div class="slider-dot" data-slide="1"></div>
            <div class="slider-dot" data-slide="2"></div>
        </div>
        
        <!-- Slider Arrows -->
        <button class="slider-arrow slider-arrow-prev">‹</button>
        <button class="slider-arrow slider-arrow-next">›</button>
    </section>

    <!-- Categories Section -->
    <section class="categories-section" id="categories">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Product Categories</h2>
                <p class="section-subtitle">Explore our premium gaming furniture collection</p>
            </div>
            
            <div class="categories-grid">
                <div class="category-card" onclick="location.href='<?php echo esc_url(home_url('/products/?category=gaming-chairs')); ?>'">
                    <div class="category-icon">🪑</div>
                    <h3 class="category-name">Gaming Chairs</h3>
                    <p class="category-desc">Premium ergonomic chairs for ultimate comfort</p>
                    <span class="category-count">4 Products</span>
                </div>
                <div class="category-card" onclick="location.href='<?php echo esc_url(home_url('/products/?category=gaming-desks')); ?>'">
                    <div class="category-icon">🖥️</div>
                    <h3 class="category-name">Gaming Desks</h3>
                    <p class="category-desc">Spacious and stylish gaming workstations</p>
                    <span class="category-count">2 Products</span>
                </div>
                <div class="category-card" onclick="location.href='<?php echo esc_url(home_url('/products/?category=mouse-pads')); ?>'">
                    <div class="category-icon">🖱️</div>
                    <h3 class="category-name">Mouse Pads</h3>
                    <p class="category-desc">Professional-grade gaming surfaces</p>
                    <span class="category-count">2 Products</span>
                </div>
                <div class="category-card" onclick="location.href='<?php echo esc_url(home_url('/products/?category=accessories')); ?>'">
                    <div class="category-icon">🎧</div>
                    <h3 class="category-name">Accessories</h3>
                    <p class="category-desc">Essential gaming accessories</p>
                    <span class="category-count">2 Products</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Products Section -->
    <section class="products-section" id="products">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Featured Products</h2>
                <p class="section-subtitle">Handpicked selection of our most popular items</p>
            </div>
            
            <div class="products-grid">
                <article class="product-card">
                    <div class="product-image-wrapper">
                        <span class="product-placeholder">🪑</span>
                        <span class="product-badge">Hot</span>
                    </div>
                    <div class="product-info">
                        <span class="product-category">Pro Series</span>
                        <h3 class="product-title">Pro Gaming Chair X1</h3>
                        <p class="product-description">Ergonomic design with premium materials for ultimate gaming comfort.</p>
                        <div class="product-price">$299 <span>$499</span></div>
                        <a href="<?php echo esc_url(home_url('/products/?product=pro-gaming-chair-x1')); ?>" class="product-button">View Details</a>
                    </div>
                </article>
                <article class="product-card">
                    <div class="product-image-wrapper">
                        <span class="product-placeholder">🖥️</span>
                        <span class="product-badge">New</span>
                    </div>
                    <div class="product-info">
                        <span class="product-category">Pro Series</span>
                        <h3 class="product-title">Pro Gaming Desk XL</h3>
                        <p class="product-description">Spacious gaming desk with RGB lighting and cable management.</p>
                        <div class="product-price">$349 <span>$499</span></div>
                        <a href="<?php echo esc_url(home_url('/products/?product=pro-gaming-desk-xl')); ?>" class="product-button">View Details</a>
                    </div>
                </article>
                <article class="product-card">
                    <div class="product-image-wrapper">
                        <span class="product-placeholder">🖱️</span>
                        <span class="product-badge">Hot</span>
                    </div>
                    <div class="product-info">
                        <span class="product-category">Pro Series</span>
                        <h3 class="product-title">RGB Extended Mouse Pad</h3>
                        <p class="product-description">XXL size with 15 RGB modes for immersive gaming.</p>
                        <div class="product-price">$79 <span>$119</span></div>
                        <a href="<?php echo esc_url(home_url('/products/?product=rgb-extended-mouse-pad')); ?>" class="product-button">View Details</a>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" id="features">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Why Choose Us</h2>
                <p class="section-subtitle">Premium quality and exceptional service for gamers worldwide</p>
            </div>
            
            <div class="features-grid">
                <div class="feature-item">
                    <div class="feature-icon">🎯</div>
                    <h3 class="feature-title">Ergonomic Design</h3>
                    <p class="feature-description">Every product is designed with ergonomics in mind, ensuring maximum comfort during long gaming sessions.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🛡️</div>
                    <h3 class="feature-title">Premium Materials</h3>
                    <p class="feature-description">We use only the highest quality materials to ensure durability and longevity.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🚀</div>
                    <h3 class="feature-title">Fast Shipping</h3>
                    <p class="feature-description">Worldwide shipping with fast delivery times and secure packaging.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">💼</div>
                    <h3 class="feature-title">B2B Solutions</h3>
                    <p class="feature-description">Special pricing and dedicated support for corporate clients and bulk orders.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">🎨</div>
                    <h3 class="feature-title">Customization</h3>
                    <p class="feature-description">Custom colors and branding options available for large orders.</p>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">📞</div>
                    <h3 class="feature-title">24/7 Support</h3>
                    <p class="feature-description">Our dedicated support team is available around the clock to assist you.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Highlights Section -->
    <section class="highlights-section">
        <div class="container">
            <div class="highlights-grid">
                <div class="highlight-item">
                    <div class="highlight-number">50K+</div>
                    <div class="highlight-label">Happy Customers</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-number">100+</div>
                    <div class="highlight-label">Countries Served</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-number">500+</div>
                    <div class="highlight-label">B2B Partners</div>
                </div>
                <div class="highlight-item">
                    <div class="highlight-number">5⭐</div>
                    <div class="highlight-label">Average Rating</div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="about-section" id="about">
        <div class="container">
            <div class="about-content">
                <div class="about-text">
                    <h2 class="section-title">About Soinp Gaming</h2>
                    <p>Founded in 2020, Soinp Gaming has quickly become a leading provider of premium gaming furniture. Our mission is to enhance the gaming experience through innovative design and exceptional quality.</p>
                    <p>We work directly with manufacturers to ensure every product meets our strict quality standards. Whether you're a professional gamer, esports team, or corporate client, we have the perfect solutions for your needs.</p>
                    <a href="#contact" class="cta-button" style="display: inline-block; margin-top: 20px;">
                        <span>Get in Touch</span>
                        <span>→</span>
                    </a>
                </div>
                <div class="about-image">
                    <span class="about-image-placeholder">🏢</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section" id="contact">
        <div class="container">
            <div class="contact-content">
                <div class="contact-info">
                    <h2>Get In Touch</h2>
                    <p>Have questions about our products or need a quote for bulk orders? Our team is ready to assist you.</p>
                    
                    <div class="contact-details">
                        <div class="contact-item">
                            <div class="contact-icon">📧</div>
                            <div class="contact-text">
                                <h4>Email</h4>
                                <p>contact@soinp.com</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-icon">📞</div>
                            <div class="contact-text">
                                <h4>Phone</h4>
                                <p>+1 (888) 123-4567</p>
                            </div>
                        </div>
                        <div class="contact-item">
                            <div class="contact-icon">📍</div>
                            <div class="contact-text">
                                <h4>Address</h4>
                                <p>123 Gaming Street, Los Angeles, CA 90001</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="contact-form">
                    <h3>Send Message</h3>
                    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                        <input type="hidden" name="action" value="soinp_contact_form">
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" class="form-input" placeholder="Your name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" class="form-input" placeholder="your@email.com" required>
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" name="subject" class="form-input" placeholder="Subject">
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" class="form-input" placeholder="Your message..." required></textarea>
                        </div>
                        <button type="submit" class="form-button">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Hero Slider
        document.addEventListener('DOMContentLoaded', function() {
            const slides = document.querySelectorAll('.slide');
            const dots = document.querySelectorAll('.slider-dot');
            const prevBtn = document.querySelector('.slider-arrow-prev');
            const nextBtn = document.querySelector('.slider-arrow-next');
            let currentSlide = 0;

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

            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => showSlide(i));
            });

            prevBtn?.addEventListener('click', prevSlide);
            nextBtn?.addEventListener('click', nextSlide);

            setInterval(nextSlide, 5000);
        });
    </script>

<?php get_footer(); ?>
