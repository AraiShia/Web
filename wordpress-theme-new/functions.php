<?php
/**
 * Soinp Gaming Theme Functions
 *
 * @package Soinp_Gaming
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register navigation menus.
 */
function soinp_gaming_register_nav_menus() {
    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', 'soinp-gaming'),
    ));
}
add_action('after_setup_theme', 'soinp_gaming_register_nav_menus');

/**
 * Enqueue styles.
 */
function soinp_gaming_enqueue_styles() {
    $style_path = get_stylesheet_directory() . '/style.css';
    $style_version = file_exists($style_path) ? filemtime($style_path) : '1.0.0';
    
    wp_enqueue_style('soinp-gaming-style', get_stylesheet_uri(), array(), $style_version, 'all');
}
add_action('wp_enqueue_scripts', 'soinp_gaming_enqueue_styles');

/**
 * Add theme support.
 */
function soinp_gaming_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
}
add_action('after_setup_theme', 'soinp_gaming_setup');
?>