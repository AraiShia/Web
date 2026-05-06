<?php
/**
 * The main template file
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Soinp_Gaming
 */

get_header();
?>

    <main id="primary" class="site-main">

        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-bg"></div>
            <div class="container">
                <div class="hero-content">
                    <div class="hero-badge">Premium Gaming Gear</div>
                    <h1 class="hero-title">
                        Elevate Your <span>Gaming Experience</span>
                    </h1>
                    <p class="hero-subtitle">
                        Discover the ultimate gaming furniture designed for champions. 
                        Premium quality, ergonomic design, and cutting-edge style.
                    </p>
                    <div class="hero-buttons">
                        <a href="#products" class="cta-button">
                            <span>Explore Collection</span>
                        </a>
                        <a href="#about" class="cta-button-secondary">
                            <span>Learn More</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="scroll-indicator">
                <svg width="30" height="50" viewBox="0 0 30 50" fill="none">
                    <path d="M15 0L15 45M7.5 37.5L15 45L22.5 37.5" stroke="#00ff88" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
        </section>

        <!-- Products Section -->
        <section id="products" class="products-section">
            <div class="container">
                <div class="section-header">
                    <div class="section-badge">Featured Products</div>
                    <h2 class="section-title">Gaming Essentials</h2>
                    <p class="section-description">
                        Handpicked selection of premium gaming furniture for serious gamers
                    </p>
                </div>
                
                <div class="products-grid">
                    <?php
                    $args = array(
                        'post_type' => 'product',
                        'posts_per_page' => 6,
                    );
                    $query = new WP_Query( $args );
                    
                    if ( $query->have_posts() ) :
                        while ( $query->have_posts() ) : $query->the_post();
                    ?>
                    <article class="product-card">
                        <div class="product-image-wrapper">
                            <?php if ( has_post_thumbnail() ) : ?>
                                <a href="<?php the_permalink(); ?>">
                                    <?php the_post_thumbnail( 'medium', array( 'class' => 'product-image' ) ); ?>
                                </a>
                            <?php endif; ?>
                            <div class="product-badge">Hot</div>
                        </div>
                        <div class="product-info">
                            <div class="product-category">Gaming Chair</div>
                            <h3 class="product-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                            <p class="product-description"><?php the_excerpt(); ?></p>
                            <div class="product-price">
                                $<?php echo get_post_meta( get_the_ID(), '_product_price', true ); ?>
                                <span>$<?php echo intval(get_post_meta( get_the_ID(), '_product_price', true )) + 200; ?></span>
                            </div>
                            <button class="product-button">
                                <span>Add to Cart</span>
                            </button>
                        </div>
                    </article>
                    <?php
                        endwhile;
                        wp_reset_postdata();
                    else :
                    ?>
                    <p style="text-align: center; color: #666; grid-column: 1/-1; padding: 50px;"><?php _e( 'No products found.', 'soinp-gaming' ); ?></p>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features-section">
            <div class="container">
                <div class="section-header">
                    <div class="section-badge">Why Choose Us</div>
                    <h2 class="section-title">Premium Quality</h2>
                    <p class="section-description">
                        Crafted with precision for the ultimate gaming experience
                    </p>
                </div>
                
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon">🎯</div>
                        <h3 class="feature-title">Ergonomic Design</h3>
                        <p class="feature-description">Engineered for optimal posture and comfort during long gaming sessions.</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">💎</div>
                        <h3 class="feature-title">Premium Materials</h3>
                        <p class="feature-description">High-quality materials that ensure durability and longevity.</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">⚡</div>
                        <h3 class="feature-title">RGB Lighting</h3>
                        <p class="feature-description">Customizable RGB lighting to match your gaming setup.</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🌍</div>
                        <h3 class="feature-title">Global Shipping</h3>
                        <p class="feature-description">Fast and reliable shipping worldwide.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about-section">
            <div class="container">
                <div class="about-content">
                    <div class="about-text">
                        <h2>
                            Born from <span>Passion</span>, 
                            Built for <span>Victory</span>
                        </h2>
                        <p>
                            Founded by gamers, for gamers. We understand the needs of competitive players and casual enthusiasts alike. Our mission is to provide furniture that enhances your gaming performance and transforms your gaming space.
                        </p>
                        <p>
                            Every product is designed with meticulous attention to detail, combining cutting-edge technology with premium craftsmanship. Join thousands of satisfied gamers who have elevated their setup with our products.
                        </p>
                        <div class="about-highlights">
                            <div class="highlight-item">
                                <div class="highlight-number">50K+</div>
                                <div class="highlight-label">Happy Gamers</div>
                            </div>
                            <div class="highlight-item">
                                <div class="highlight-number">100+</div>
                                <div class="highlight-label">Countries</div>
                            </div>
                            <div class="highlight-item">
                                <div class="highlight-number">10+</div>
                                <div class="highlight-label">Years</div>
                            </div>
                            <div class="highlight-item">
                                <div class="highlight-number">24/7</div>
                                <div class="highlight-label">Support</div>
                            </div>
                        </div>
                    </div>
                    <div class="about-image">
                        <img src="<?php echo get_template_directory_uri(); ?>/images/about.jpg" alt="Gaming Setup">
                    </div>
                </div>
            </div>
        </section>

        <!-- Gallery Section -->
        <section class="gallery-section">
            <div class="container">
                <div class="section-header">
                    <div class="section-badge">Gallery</div>
                    <h2 class="section-title">Gaming Setups</h2>
                    <p class="section-description">
                        See how our products transform gaming spaces
                    </p>
                </div>
                
                <div class="gallery-grid">
                    <div class="gallery-item">
                        <img src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=gaming%20room%20setup%20with%20RGB%20lighting%20and%20gaming%20chair%20dark%20atmosphere&image_size=landscape_4_3" alt="Gaming Setup 1">
                    </div>
                    <div class="gallery-item">
                        <img src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=professional%20esports%20gaming%20station%20with%20multiple%20monitors&image_size=landscape_4_3" alt="Gaming Setup 2">
                    </div>
                    <div class="gallery-item">
                        <img src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=modern%20gaming%20chair%20in%20dark%20room%20with%20neon%20lights&image_size=landscape_4_3" alt="Gaming Setup 3">
                    </div>
                    <div class="gallery-item">
                        <img src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=premium%20gaming%20desk%20with%20RGB%20underlighting&image_size=landscape_4_3" alt="Gaming Setup 4">
                    </div>
                    <div class="gallery-item">
                        <img src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=gaming%20setup%20with%20mechanical%20keyboard%20and%20gaming%20chair&image_size=landscape_4_3" alt="Gaming Setup 5">
                    </div>
                    <div class="gallery-item">
                        <img src="https://neeko-copilot.bytedance.net/api/text_to_image?prompt=immersive%20gaming%20experience%20with%20surround%20sound&image_size=landscape_4_3" alt="Gaming Setup 6">
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="contact-section">
            <div class="container">
                <div class="contact-content">
                    <div class="contact-info">
                        <h2>Get In Touch</h2>
                        <p>
                            Have questions about our products? Our team is ready to assist you. 
                            Reach out and let us help you find the perfect gaming furniture.
                        </p>
                        <div class="contact-details">
                            <div class="contact-item">
                                <div class="contact-icon">📧</div>
                                <div class="contact-text">
                                    <h4>Email</h4>
                                    <p>support@soinpgaming.com</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-icon">📞</div>
                                <div class="contact-text">
                                    <h4>Phone</h4>
                                    <p>+86 400-888-8888</p>
                                </div>
                            </div>
                            <div class="contact-item">
                                <div class="contact-icon">📍</div>
                                <div class="contact-text">
                                    <h4>Address</h4>
                                    <p>Guangzhou, China</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form class="contact-form" action="<?php echo esc_url( admin_url('admin-post.php') ); ?>" method="post">
                        <input type="hidden" name="action" value="soinp_contact_form">
                        <?php wp_nonce_field( 'soinp_contact_nonce', 'soinp_contact_nonce_field' ); ?>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required placeholder="Your name">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required placeholder="your@email.com">
                        </div>
                        <div class="form-group">
                            <label for="subject">Subject</label>
                            <input type="text" id="subject" name="subject" required placeholder="How can we help?">
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" required placeholder="Your message..."></textarea>
                        </div>
                        <button type="submit" class="submit-button">Send Message</button>
                    </form>
                </div>
            </div>
        </section>

    </main><!-- #main -->

<?php
get_sidebar();
get_footer();
?>