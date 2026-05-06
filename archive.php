<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Soinp_Furniture
 */

get_header();
?>

    <main id="primary" class="site-main">
        <div class="container">
            <?php if ( have_posts() ) : ?>

                <header class="page-header">
                    <?php
                    the_archive_title( '<h1 class="page-title">', '</h1>' );
                    the_archive_description( '<div class="archive-description">', '</div>' );
                    ?>
                </header><!-- .page-header -->

                <div class="products-grid">
                    <?php
                    /* Start the Loop */
                    while ( have_posts() ) :
                        the_post();

                        get_template_part( 'template-parts/content', get_post_format() );

                    endwhile;

                    soinp_furniture_pagination();

                else :

                    get_template_part( 'template-parts/content', 'none' );

                endif;
                ?>
                </div><!-- .products-grid -->
        </div><!-- .container -->
    </main><!-- #main -->

<?php
get_sidebar();
get_footer();
?>