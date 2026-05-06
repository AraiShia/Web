jQuery(document).ready(function($) {
    'use strict';

    // Header scroll effect
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) {
            $('.site-header').addClass('scrolled');
        } else {
            $('.site-header').removeClass('scrolled');
        }
    });

    // Smooth scroll for anchor links
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        
        var target = this.hash;
        var $target = $(target);
        
        if ($target.length) {
            $('html, body').animate({
                scrollTop: $target.offset().top - 80
            }, 800, 'swing');
        }
    });

    // Product card hover effect
    $('.product-card').hover(function() {
        $(this).addClass('hovered');
    }, function() {
        $(this).removeClass('hovered');
    });

    // Gallery lightbox effect
    $('.gallery-item').on('click', function() {
        var imgSrc = $(this).find('img').attr('src');
        var imgAlt = $(this).find('img').attr('alt');
        
        var lightbox = '<div class="lightbox-overlay">' +
            '<div class="lightbox-content">' +
            '<span class="lightbox-close">&times;</span>' +
            '<img src="' + imgSrc + '" alt="' + imgAlt + '">' +
            '</div>' +
            '</div>';
        
        $('body').append(lightbox);
        $('body').addClass('lightbox-open');
        
        $('.lightbox-close, .lightbox-overlay').on('click', function() {
            $('.lightbox-overlay').remove();
            $('body').removeClass('lightbox-open');
        });
    });

    // Contact form validation
    $('.contact-form').on('submit', function(e) {
        var isValid = true;
        
        $(this).find('input, textarea').each(function() {
            if (!$(this).val()) {
                $(this).css('border-color', '#ff4444');
                isValid = false;
            } else {
                $(this).css('border-color', 'rgba(255, 255, 255, 0.1)');
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            alert('Please fill in all fields.');
        }
    });

    // Counter animation
    function animateCounters() {
        var counters = $('.highlight-number');
        
        counters.each(function() {
            var $this = $(this);
            var countTo = $this.text().replace(/[^0-9]/g, '');
            var suffix = $this.text().replace(/[0-9]/g, '');
            
            $({ countNum: 0 }).animate({ countNum: countTo }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.floor(this.countNum) + suffix);
                },
                complete: function() {
                    $this.text(countTo + suffix);
                }
            });
        });
    }

    // Intersection Observer for animations
    var observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('about-highlights')) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
                
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Observe elements
    $('.about-highlights').each(function() {
        observer.observe(this);
    });

    // Mobile menu toggle
    $('.menu-toggle').on('click', function() {
        $('.main-navigation').toggleClass('toggled');
    });

    // Parallax effect for hero section
    $(window).scroll(function() {
        var scrolled = $(window).scrollTop();
        $('.hero-bg').css('transform', 'translateY(' + scrolled * 0.5 + 'px)');
    });

    // RGB color changing effect
    var colors = ['#00ff88', '#00d4ff', '#9d4edd', '#ff6b6b', '#ffd93d'];
    var colorIndex = 0;
    
    setInterval(function() {
        colorIndex = (colorIndex + 1) % colors.length;
        $('.hero-title span').css({
            background: 'linear-gradient(135deg, ' + colors[colorIndex] + ' 0%, ' + colors[(colorIndex + 1) % colors.length] + ' 100%)',
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent'
        });
    }, 3000);

    // Add CSS for lightbox
    var lightboxCSS = `
        .lightbox-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
        }
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        .lightbox-content img {
            max-width: 100%;
            max-height: 80vh;
            border-radius: 15px;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
        }
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: #fff;
            font-size: 30px;
            cursor: pointer;
        }
        .lightbox-open {
            overflow: hidden;
        }
        .in-view {
            animation: fadeInUp 0.8s ease-out;
        }
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;

    $('<style>').text(lightboxCSS).appendTo('head');
});
