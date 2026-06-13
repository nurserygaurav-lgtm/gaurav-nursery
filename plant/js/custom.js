(function($) {
    $(document).ready(function() {
        "use strict";
        //Slide feature
        $('.ts-slide-features').each(function() {
            $(this).owlCarousel({
                loop: true,
                nav: false,
                dots: true,
                margin: 0,
                autoplay: true,
                responsiveClass: false,
                responsive: {
                    0: {
                        items: 1
                    },
                    480: {
                        items: 1
                    },
                    768: {
                        items: 1
                    },
                    992: {
                        items: 1
                    }
                }
            })
        });
        jQuery('#slider').show().revolution({
            dottedOverlay: "none",
            delay: 16000,
            startwidth: 1920,
            startheight: 1300,
            hideThumbs: 200,

            thumbWidth: 100,
            thumbHeight: 50,
            thumbAmount: 1,

            navigationType: "none",
            navigationArrows: "none",
            navigationStyle: "round",

            touchenabled: "on",
            onHoverStop: "on",

            swipe_velocity: 0.7,
            swipe_min_touches: 1,
            swipe_max_touches: 1,
            drag_block_vertical: false,

            parallax: "mouse",
            parallaxBgFreeze: "on",
            parallaxLevels: [10, 7, 4, 3, 2, 5, 4, 3, 2, 1],

            keyboardNavigation: "off",


            shadow: 0,
            fullWidth: "on",
            fullScreen: "off",

            spinner: "spinner4"

        });
        //BACK TO TOP
        $(window).scroll(function() {
            if ($(window).scrollTop() > 50) {
                $('a.backtotop').fadeIn(1000);
            } else {
                $('a.backtotop').fadeOut(500);
            }
        });
        $('a.backtotop').on('click',function() {
                $('html, body').animate({
                    scrollTop: 0
                }, 800);
                return false;
            })
            // Video Lightbox
            //$('.quick-install a').simpleLightboxVideo();
        $(window).on("orientationchange load resize", function() {
            var width = $(window).width();
            if (width > 767) {
                $('.layout-customer .col-sm-7').after($('.layout-customer .col-sm-3'));
            } else {
                $('.layout-customer .col-sm-7').before($('.layout-customer .col-sm-3'));
            }
        });
    });
    new WOW().init();
}(jQuery));