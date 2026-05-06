<?php
/**
 * Soinp Gaming Theme Functions
 *
 * @package Soinp_Gaming
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Register navigation menus.
 */
function soinp_gaming_register_nav_menus() {
    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', 'soinp-gaming'),
        'footer-categories' => esc_html__('Footer Categories', 'soinp-gaming'),
        'footer-support' => esc_html__('Footer Support', 'soinp-gaming'),
    ));
}
add_action('after_setup_theme', 'soinp_gaming_register_nav_menus');

/**
 * Enqueue styles.
 */
function soinp_gaming_enqueue_styles() {
    wp_enqueue_style('soinp-gaming-style', get_stylesheet_uri(), array(), '1.0.0', 'all');
}
add_action('wp_enqueue_scripts', 'soinp_gaming_enqueue_styles');

/**
 * Add theme support.
 */
function soinp_gaming_setup() {
    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title.
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support('post-thumbnails');

    // Switch default core markup for search form, comment form, and comments
    // to output valid HTML5.
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));

    // Enable support for Post Formats.
    add_theme_support('post-formats', array(
        'aside',
        'image',
        'video',
        'quote',
        'link',
    ));
}
add_action('after_setup_theme', 'soinp_gaming_setup');

/**
 * Register widget areas.
 */
function soinp_gaming_widgets_init() {
    register_sidebar(array(
        'name'          => esc_html__('Sidebar', 'soinp-gaming'),
        'id'            => 'sidebar-1',
        'description'   => esc_html__('Add widgets here.', 'soinp-gaming'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ));
}
add_action('widgets_init', 'soinp_gaming_widgets_init');

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Custom functions that act independently of the theme templates.
 */
require get_template_directory() . '/inc/extras.php';

/**
 * Load Jetpack compatibility file.
 */
if (defined('JETPACK__VERSION')) {
    require get_template_directory() . '/inc/jetpack.php';
}