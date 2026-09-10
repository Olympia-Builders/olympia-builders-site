(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        var heroSwiper = document.querySelector('.hero-swiper');
        if (!heroSwiper) return;

        var slideCount = heroSwiper.querySelectorAll('.swiper-slide').length;

        new Swiper('.hero-swiper', {
            effect: 'fade',
            fadeEffect: { crossFade: true },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            loop: slideCount > 1,
            speed: 1000,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    });
})();
