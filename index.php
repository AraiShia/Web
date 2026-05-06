<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Soinp_Furniture
 */

get_header();
?>

    <main id="primary" class="site-main">

        <!-- Hero Section -->
        <section class="hero-section">
            <div class="container">
                <h1 class="hero-title"><?php bloginfo( 'name' ); ?></h1>
                <p class="hero-subtitle"><?php bloginfo( 'description' ); ?></p>
                <a href="#products" class="cta-button">View Our Products</a>
            </div>
        </section>

        <!-- Products Section -->
        <section id="products" class="products-section">
            <div class="container">
                <h2 class="section-title">Featured Products</h2>
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
                        <?php if ( has_post_thumbnail() ) : ?>
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail( 'medium', array( 'class' => 'product-image' ) ); ?>
                            </a>
                        <?php endif; ?>
                        <div class="product-info">
                            <h3 class="product-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                            <p class="product-description"><?php the_excerpt(); ?></p>
                            <?php if ( get_post_meta( get_the_ID(), '_product_price', true ) ) : ?>
                                <span class="product-price">$<?php echo get_post_meta( get_the_ID(), '_product_price', true ); ?></span>
                            <?php endif; ?>
                        </div>
                    </article>
                    <?php
                        endwhile;
                        wp_reset_postdata();
                    else :
                    ?>
                    <p><?php _e( 'No products found.', 'soinp-furniture' ); ?></p>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section class="features-section">
            <div class="container">
                <h2 class="section-title">Why Choose Us</h2>
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon">✓</div>
                        <h3 class="feature-title">Quality Products</h3>
                        <p>High-quality office furniture made from premium materials.</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🌍</div>
                        <h3 class="feature-title">Global Export</h3>
                        <p>Export to over 50 countries worldwide.</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">⏱️</div>
                        <h3 class="feature-title">On-Time Delivery</h3>
                        <p>Reliable delivery with competitive lead times.</p>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🎯</div>
                        <h3 class="feature-title">Custom Solutions</h3>
                        <p>Tailored furniture solutions for your business needs.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section class="about-section">
            <div class="container">
                <h2 class="section-title">About Us</h2>
                <div class="about-content">
                    <div>
                        <p>With over 20 years of experience in the office furniture industry, Soinp Furniture is a leading manufacturer and exporter of high-quality office furniture. We specialize in providing comprehensive furniture solutions for businesses worldwide.</p>
                        <p>Our products include office desks, chairs, filing cabinets, conference tables, and complete office furniture systems. We are committed to delivering exceptional quality, innovative design, and excellent customer service.</p>
                    </div>
                    <img src="<?php echo get_template_directory_uri(); ?>/images/about.jpg" alt="About Soinp Furniture" class="about-image">
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="contact-section">
            <div class="container">
                <h2 class="section-title">Contact Us</h2>
                <form class="contact-form" action="<?php echo esc_url( admin_url('admin-post.php') ); ?>" method="post">
                    <input type="hidden" name="action" value="soinp_contact_form">
                    <?php wp_nonce_field( 'soinp_contact_nonce', 'soinp_contact_nonce_field' ); ?>
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <input type="text" id="subject" name="subject" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" required></textarea>
                    </div>
                    <button type="submit" class="submit-button">Send Message</button>
                </form>
            </div>
        </section>

    </main><!-- #main -->

<?php
get_sidebar();
get_footer();
?>