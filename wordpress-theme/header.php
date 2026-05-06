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
            <span style="color: var(--primary-color); font-weight: 600;">🎮</span>
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
                ));
                ?>
            </nav>

            <div class="header-actions">
                <div class="header-icon" id="searchIcon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </div>
                <div class="header-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                        <path d="M3 6h18"></path>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <span class="cart-count">0</span>
                </div>
            </div>
        </div>
    </header>