<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>

    <div class="discount-banner" id="discountBanner">
        <div class="discount-content">
            <span class="discount-badge">LIMITED TIME</span>
            <span class="discount-text">$100 OFF $500+ | 10% OFF FIRST ORDER</span>
            <span class="discount-code">GAMING2024</span>
            <span style="font-size: 18px;">🎮</span>
        </div>
        <button class="banner-close" onclick="document.getElementById('discountBanner').style.display='none'">✕</button>
    </div>

    <header class="site-header">
        <div class="container">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="site-logo">SOINP</a>
            
            <nav class="main-navigation">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container' => false,
                    'menu_class' => '',
                    'items_wrap' => '<ul>%3$s</ul>',
                    'fallback_cb' => function() {
                        echo '<ul><li><a href="' . home_url('/') . '">HOME</a></li><li><a href="' . home_url('/products/') . '">PRODUCTS</a></li><li><a href="#features">FEATURES</a></li><li><a href="#about">ABOUT</a></li><li><a href="#contact">CONTACT</a></li></ul>';
                    }
                ));
                ?>
            </nav>
        </div>
    </header>