<?php
/**
 * Soinp Furniture Theme Customizer
 *
 * @package Soinp_Furniture
 */

function soinp_furniture_customize_register( $wp_customize ) {
    $wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
    $wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
    $wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

    if ( isset( $wp_customize->selective_refresh ) ) {
        $wp_customize->selective_refresh->add_partial(
            'blogname',
            array(
                'selector'        => '.site-title a',
                'render_callback' => 'soinp_furniture_customize_partial_blogname',
            )
        );
        $wp_customize->selective_refresh->add_partial(
            'blogdescription',
            array(
                'selector'        => '.site-description',
                'render_callback' => 'soinp_furniture_customize_partial_blogdescription',
            )
        );
    }

    $wp_customize->add_section(
        'soinp_furniture_hero_section',
        array(
            'title'       => __( 'Hero Section', 'soinp-furniture' ),
            'description' => __( 'Customize the hero section', 'soinp-furniture' ),
            'priority'    => 30,
        )
    );

    $wp_customize->add_setting(
        'soinp_furniture_hero_title',
        array(
            'default'           => __( 'Welcome to Soinp Furniture', 'soinp-furniture' ),
            'sanitize_callback' => 'sanitize_text_field',
            'transport'         => 'postMessage',
        )
    );

    $wp_customize->add_control(
        'soinp_furniture_hero_title',
        array(
            'label'    => __( 'Hero Title', 'soinp-furniture' ),
            'section'  => 'soinp_furniture_hero_section',
            'type'     => 'text',
        )
    );

    $wp_customize->add_setting(
        'soinp_furniture_hero_subtitle',
        array(
            'default'           => __( 'Quality Office Furniture for Your Business', 'soinp-furniture' ),
            'sanitize_callback' => 'sanitize_text_field',
            'transport'         => 'postMessage',
        )
    );

    $wp_customize->add_control(
        'soinp_furniture_hero_subtitle',
        array(
            'label'    => __( 'Hero Subtitle', 'soinp-furniture' ),
            'section'  => 'soinp_furniture_hero_section',
            'type'     => 'text',
        )
    );

    $wp_customize->add_setting(
        'soinp_furniture_hero_button_text',
        array(
            'default'           => __( 'View Our Products', 'soinp-furniture' ),
            'sanitize_callback' => 'sanitize_text_field',
            'transport'         => 'postMessage',
        )
    );

    $wp_customize->add_control(
        'soinp_furniture_hero_button_text',
        array(
            'label'    => __( 'CTA Button Text', 'soinp-furniture' ),
            'section'  => 'soinp_furniture_hero_section',
            'type'     => 'text',
        )
    );
}
add_action( 'customize_register', 'soinp_furniture_customize_register' );

function soinp_furniture_customize_partial_blogname() {
    bloginfo( 'name' );
}

function soinp_furniture_customize_partial_blogdescription() {
    bloginfo( 'description' );
}

function soinp_furniture_customize_css() {
    ?>
    <style type="text/css">
        .site-title a {
            color: <?php echo esc_attr( get_header_textcolor() ); ?>;
        }
        .site-description {
            color: <?php echo esc_attr( get_header_textcolor() ); ?>;
        }
    </style>
    <?php
}
add_action( 'wp_head', 'soinp_furniture_customize_css' );
?>