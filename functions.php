<?php
/**
 * Soinp Gaming Furniture functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package Soinp_Gaming
 */

if ( ! defined( '_S_VERSION' ) ) {
    define( '_S_VERSION', '2.0.0' );
}

if ( ! function_exists( 'soinp_gaming_setup' ) ) :
    function soinp_gaming_setup() {
        load_theme_textdomain( 'soinp-gaming', get_template_directory() . '/languages' );
        
        add_theme_support( 'automatic-feed-links' );
        add_theme_support( 'title-tag' );
        add_theme_support( 'post-thumbnails' );
        
        register_nav_menus( array(
            'menu-1' => esc_html__( 'Primary', 'soinp-gaming' ),
        ) );
        
        add_theme_support( 'html5', array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
        ) );
        
        add_theme_support( 'custom-background', apply_filters( 'soinp_gaming_custom_background_args', array(
            'default-color' => '0d0d0d',
            'default-image' => '',
        ) ) );
        
        add_theme_support( 'customize-selective-refresh-widgets' );
        
        add_theme_support( 'custom-logo', array(
            'height'      => 250,
            'width'       => 250,
            'flex-width'  => true,
            'flex-height' => true,
        ) );
    }
endif;
add_action( 'after_setup_theme', 'soinp_gaming_setup' );

function soinp_gaming_widgets_init() {
    register_sidebar( array(
        'name'          => esc_html__( 'Sidebar', 'soinp-gaming' ),
        'id'            => 'sidebar-1',
        'description'   => esc_html__( 'Add widgets here.', 'soinp-gaming' ),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
}
add_action( 'widgets_init', 'soinp_gaming_widgets_init' );

function soinp_gaming_scripts() {
    wp_enqueue_style( 'soinp-gaming-style', get_stylesheet_uri(), array(), _S_VERSION );
    wp_style_add_data( 'soinp-gaming-style', 'rtl', 'replace' );
    
    wp_enqueue_script( 'soinp-gaming-navigation', get_template_directory_uri() . '/js/navigation.js', array(), _S_VERSION, true );
    
    wp_enqueue_script( 'soinp-gaming-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), _S_VERSION, true );
    
    wp_enqueue_script( 'soinp-gaming-custom', get_template_directory_uri() . '/js/custom.js', array('jquery'), _S_VERSION, true );
    
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'soinp_gaming_scripts' );

function soinp_gaming_register_product_cpt() {
    $labels = array(
        'name'                  => _x( 'Products', 'Post Type General Name', 'soinp-gaming' ),
        'singular_name'         => _x( 'Product', 'Post Type Singular Name', 'soinp-gaming' ),
        'menu_name'             => __( 'Products', 'soinp-gaming' ),
        'name_admin_bar'        => __( 'Product', 'soinp-gaming' ),
        'archives'              => __( 'Product Archives', 'soinp-gaming' ),
        'attributes'            => __( 'Product Attributes', 'soinp-gaming' ),
        'parent_item_colon'     => __( 'Parent Product:', 'soinp-gaming' ),
        'all_items'             => __( 'All Products', 'soinp-gaming' ),
        'add_new_item'          => __( 'Add New Product', 'soinp-gaming' ),
        'add_new'               => __( 'Add New', 'soinp-gaming' ),
        'new_item'              => __( 'New Product', 'soinp-gaming' ),
        'edit_item'             => __( 'Edit Product', 'soinp-gaming' ),
        'update_item'           => __( 'Update Product', 'soinp-gaming' ),
        'view_item'             => __( 'View Product', 'soinp-gaming' ),
        'view_items'            => __( 'View Products', 'soinp-gaming' ),
        'search_items'          => __( 'Search Product', 'soinp-gaming' ),
        'not_found'             => __( 'Not found', 'soinp-gaming' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'soinp-gaming' ),
        'featured_image'        => __( 'Product Image', 'soinp-gaming' ),
        'set_featured_image'    => __( 'Set product image', 'soinp-gaming' ),
        'remove_featured_image' => __( 'Remove product image', 'soinp-gaming' ),
        'use_featured_image'    => __( 'Use as product image', 'soinp-gaming' ),
        'insert_into_item'      => __( 'Insert into product', 'soinp-gaming' ),
        'uploaded_to_this_item' => __( 'Uploaded to this product', 'soinp-gaming' ),
        'items_list'            => __( 'Products list', 'soinp-gaming' ),
        'items_list_navigation' => __( 'Products list navigation', 'soinp-gaming' ),
        'filter_items_list'     => __( 'Filter products list', 'soinp-gaming' ),
    );
    $args = array(
        'label'                 => __( 'Product', 'soinp-gaming' ),
        'description'           => __( 'Gaming furniture products', 'soinp-gaming' ),
        'labels'                => $labels,
        'supports'              => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields' ),
        'taxonomies'            => array( 'category' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-chair',
        'show_in_admin_bar'     => true,
        'show_in_nav_menus'     => true,
        'can_export'            => true,
        'has_archive'           => true,
        'exclude_from_search'   => false,
        'publicly_queryable'    => true,
        'capability_type'       => 'post',
        'show_in_rest'          => true,
    );
    register_post_type( 'product', $args );
}
add_action( 'init', 'soinp_gaming_register_product_cpt', 0 );

function soinp_contact_form_handler() {
    if ( ! isset( $_POST['soinp_contact_nonce_field'] ) || ! wp_verify_nonce( $_POST['soinp_contact_nonce_field'], 'soinp_contact_nonce' ) ) {
        wp_die( 'Invalid nonce.' );
    }
    
    $name = sanitize_text_field( $_POST['name'] );
    $email = sanitize_email( $_POST['email'] );
    $subject = sanitize_text_field( $_POST['subject'] );
    $message = sanitize_textarea_field( $_POST['message'] );
    
    $to = get_option( 'admin_email' );
    $headers = array(
        'From: ' . $name . ' <' . $email . '>',
        'Content-Type: text/html; charset=UTF-8',
    );
    
    $email_message = "<h2>Contact Form Submission</h2>";
    $email_message .= "<p><strong>Name:</strong> $name</p>";
    $email_message .= "<p><strong>Email:</strong> $email</p>";
    $email_message .= "<p><strong>Subject:</strong> $subject</p>";
    $email_message .= "<p><strong>Message:</strong><br>$message</p>";
    
    wp_mail( $to, $subject, $email_message, $headers );
    
    wp_redirect( get_permalink() . '?contact_success=1' );
    exit;
}
add_action( 'admin_post_soinp_contact_form', 'soinp_contact_form_handler' );
add_action( 'admin_post_nopriv_soinp_contact_form', 'soinp_contact_form_handler' );

function soinp_gaming_customize_register( $wp_customize ) {
    $wp_customize->add_section( 'soinp_gaming_hero_section', array(
        'title'    => __( 'Hero Section', 'soinp-gaming' ),
        'priority' => 30,
    ) );
    
    $wp_customize->add_setting( 'soinp_gaming_hero_title', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    
    $wp_customize->add_control( 'soinp_gaming_hero_title', array(
        'label'    => __( 'Hero Title', 'soinp-gaming' ),
        'section'  => 'soinp_gaming_hero_section',
        'type'     => 'text',
    ) );
    
    $wp_customize->add_setting( 'soinp_gaming_hero_subtitle', array(
        'default'           => '',
        'sanitize_callback' => 'sanitize_textarea_field',
    ) );
    
    $wp_customize->add_control( 'soinp_gaming_hero_subtitle', array(
        'label'    => __( 'Hero Subtitle', 'soinp-gaming' ),
        'section'  => 'soinp_gaming_hero_section',
        'type'     => 'textarea',
    ) );
}
add_action( 'customize_register', 'soinp_gaming_customize_register' );

require get_template_directory() . '/inc/custom-header.php';
require get_template_directory() . '/inc/customizer.php';
require get_template_directory() . '/inc/template-functions.php';
require get_template_directory() . '/inc/template-tags.php';
?>