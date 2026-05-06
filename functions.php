<?php
/**
 * Soinp Furniture Theme Functions
 *
 * @package Soinp_Furniture
 */

if ( ! function_exists( 'soinp_furniture_setup' ) ) :
    function soinp_furniture_setup() {
        load_theme_textdomain( 'soinp-furniture', get_template_directory() . '/languages' );

        add_theme_support( 'automatic-feed-links' );
        add_theme_support( 'title-tag' );
        add_theme_support( 'post-thumbnails' );
        add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption' ) );
        add_theme_support( 'custom-background', apply_filters( 'soinp_furniture_custom_background_args', array( 'default-color' => 'ffffff', 'default-image' => '', ) ) );

        register_nav_menus( array(
            'menu-1' => esc_html__( 'Primary', 'soinp-furniture' ),
        ) );
    }
endif;
add_action( 'after_setup_theme', 'soinp_furniture_setup' );

function soinp_furniture_widgets_init() {
    register_sidebar( array(
        'name'          => esc_html__( 'Sidebar', 'soinp-furniture' ),
        'id'            => 'sidebar-1',
        'description'   => esc_html__( 'Add widgets here.', 'soinp-furniture' ),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h2 class="widget-title">',
        'after_title'   => '</h2>',
    ) );
}
add_action( 'widgets_init', 'soinp_furniture_widgets_init' );

function soinp_furniture_scripts() {
    wp_enqueue_style( 'soinp-furniture-style', get_stylesheet_uri() );
    wp_enqueue_script( 'soinp-furniture-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20151215', true );
    wp_enqueue_script( 'soinp-furniture-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20151215', true );
    
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }
}
add_action( 'wp_enqueue_scripts', 'soinp_furniture_scripts' );

function soinp_furniture_register_product_post_type() {
    $labels = array(
        'name'                  => _x( 'Products', 'Post Type General Name', 'soinp-furniture' ),
        'singular_name'         => _x( 'Product', 'Post Type Singular Name', 'soinp-furniture' ),
        'menu_name'             => __( 'Products', 'soinp-furniture' ),
        'name_admin_bar'        => __( 'Product', 'soinp-furniture' ),
        'archives'              => __( 'Product Archives', 'soinp-furniture' ),
        'attributes'            => __( 'Product Attributes', 'soinp-furniture' ),
        'parent_item_colon'     => __( 'Parent Product:', 'soinp-furniture' ),
        'all_items'             => __( 'All Products', 'soinp-furniture' ),
        'add_new_item'          => __( 'Add New Product', 'soinp-furniture' ),
        'add_new'               => __( 'Add New', 'soinp-furniture' ),
        'new_item'              => __( 'New Product', 'soinp-furniture' ),
        'edit_item'             => __( 'Edit Product', 'soinp-furniture' ),
        'update_item'           => __( 'Update Product', 'soinp-furniture' ),
        'view_item'             => __( 'View Product', 'soinp-furniture' ),
        'view_items'            => __( 'View Products', 'soinp-furniture' ),
        'search_items'          => __( 'Search Product', 'soinp-furniture' ),
        'not_found'             => __( 'Not found', 'soinp-furniture' ),
        'not_found_in_trash'    => __( 'Not found in Trash', 'soinp-furniture' ),
        'featured_image'        => __( 'Product Image', 'soinp-furniture' ),
        'set_featured_image'    => __( 'Set product image', 'soinp-furniture' ),
        'remove_featured_image' => __( 'Remove product image', 'soinp-furniture' ),
        'use_featured_image'    => __( 'Use as product image', 'soinp-furniture' ),
        'insert_into_item'      => __( 'Insert into product', 'soinp-furniture' ),
        'uploaded_to_this_item' => __( 'Uploaded to this product', 'soinp-furniture' ),
        'items_list'            => __( 'Products list', 'soinp-furniture' ),
        'items_list_navigation' => __( 'Products list navigation', 'soinp-furniture' ),
        'filter_items_list'     => __( 'Filter products list', 'soinp-furniture' ),
    );
    $args = array(
        'label'                 => __( 'Product', 'soinp-furniture' ),
        'description'           => __( 'Office furniture products', 'soinp-furniture' ),
        'labels'                => $labels,
        'supports'              => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields' ),
        'hierarchical'          => false,
        'public'                => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-store',
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
add_action( 'init', 'soinp_furniture_register_product_post_type', 0 );

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

    $body = '<h3>Contact Form Submission</h3>';
    $body .= '<p><strong>Name:</strong> ' . $name . '</p>';
    $body .= '<p><strong>Email:</strong> ' . $email . '</p>';
    $body .= '<p><strong>Subject:</strong> ' . $subject . '</p>';
    $body .= '<p><strong>Message:</strong></p>';
    $body .= '<p>' . nl2br( $message ) . '</p>';

    if ( wp_mail( $to, $subject, $body, $headers ) ) {
        wp_redirect( home_url( '/?contact_success=1' ) );
        exit;
    } else {
        wp_redirect( home_url( '/?contact_error=1' ) );
        exit;
    }
}
add_action( 'admin_post_nopriv_soinp_contact_form', 'soinp_contact_form_handler' );
add_action( 'admin_post_soinp_contact_form', 'soinp_contact_form_handler' );

function soinp_furniture_pagination() {
    global $wp_query;
    
    $big = 999999999;
    
    echo paginate_links( array(
        'base'      => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
        'format'    => '?paged=%#%',
        'current'   => max( 1, get_query_var( 'paged' ) ),
        'total'     => $wp_query->max_num_pages,
        'prev_text' => __( '← Previous', 'soinp-furniture' ),
        'next_text' => __( 'Next →', 'soinp-furniture' ),
    ) );
}

require get_template_directory() . '/inc/custom-header.php';
require get_template_directory() . '/inc/template-tags.php';
require get_template_directory() . '/inc/template-functions.php';
require get_template_directory() . '/inc/customizer.php';
?>