<?php
/**
 * Functions which enhance the theme by hooking into WordPress
 *
 * @package Soinp_Furniture
 */

function soinp_furniture_body_classes( $classes ) {
    if ( is_single() && ! is_singular( 'product' ) ) {
        $classes[] = 'single-post';
    }
    
    if ( is_page() ) {
        $classes[] = 'page-template';
    }

    return $classes;
}
add_filter( 'body_class', 'soinp_furniture_body_classes' );

function soinp_furniture_excerpt_length( $length ) {
    if ( is_admin() ) {
        return $length;
    }

    return 20;
}
add_filter( 'excerpt_length', 'soinp_furniture_excerpt_length', 999 );

function soinp_furniture_excerpt_more( $more ) {
    if ( is_admin() ) {
        return $more;
    }

    return '...';
}
add_filter( 'excerpt_more', 'soinp_furniture_excerpt_more' );
?>