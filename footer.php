<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Soinp_Furniture
 */

?>

    <footer id="colophon" class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>About Us</h3>
                    <p>Soinp Furniture - Leading office furniture manufacturer and exporter since 2004.</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="<?php echo home_url(); ?>">Home</a></li>
                        <li><a href="#products">Products</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>Contact Info</h3>
                    <p>Email: info@soinp.com</p>
                    <p>Phone: +86 123 4567 8900</p>
                    <p>Address: Furniture Industrial Zone, Dongguan, China</p>
                </div>
            </div><!-- .footer-content -->
            <div class="footer-bottom">
                <p>&copy; <?php echo date( 'Y' ); ?> Soinp Furniture. All rights reserved.</p>
            </div><!-- .footer-bottom -->
        </div><!-- .container -->
    </footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>