(function() {
    'use strict';

    var header = document.getElementById('site-header');
    var menuToggle = document.getElementById('menu-toggle');
    var menuToggleMobile = document.getElementById('menu-toggle-mobile');
    var navOverlay = document.getElementById('nav-overlay');
    var burgerIcons = document.querySelectorAll('.burger-icon');
    var headerLogoDesktop = document.getElementById('header-logo-desktop');
    var headerLogoMobile = document.getElementById('header-logo-mobile');
    var headerMobileInner = document.getElementById('header-mobile-inner');

    var isMenuOpen = false;
    var lastScrollY = 0;

    // Toggle menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            header.classList.add('menu-open');
            navOverlay.classList.add('active');
            burgerIcons.forEach(function(icon) { icon.classList.add('active'); });
            if (headerLogoDesktop) headerLogoDesktop.style.opacity = '0';
            if (headerLogoDesktop) headerLogoDesktop.style.pointerEvents = 'none';
            if (headerLogoMobile) headerLogoMobile.style.opacity = '0';
            if (headerLogoMobile) headerLogoMobile.style.pointerEvents = 'none';
            // Update aria
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
            if (menuToggleMobile) menuToggleMobile.setAttribute('aria-expanded', 'true');
        } else {
            header.classList.remove('menu-open');
            navOverlay.classList.remove('active');
            burgerIcons.forEach(function(icon) { icon.classList.remove('active'); });
            if (headerLogoDesktop) headerLogoDesktop.style.opacity = '1';
            if (headerLogoDesktop) headerLogoDesktop.style.pointerEvents = '';
            if (headerLogoMobile) headerLogoMobile.style.opacity = '1';
            if (headerLogoMobile) headerLogoMobile.style.pointerEvents = '';
            if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
            if (menuToggleMobile) menuToggleMobile.setAttribute('aria-expanded', 'false');
        }
    }

    if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
    if (menuToggleMobile) menuToggleMobile.addEventListener('click', toggleMenu);

    // Close menu when clicking overlay background
    if (navOverlay) {
        navOverlay.addEventListener('click', function(e) {
            if (e.target === navOverlay) toggleMenu();
        });
    }

    // Close menu when clicking nav links
    var navLinks = document.querySelectorAll('.nav-overlay-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            if (isMenuOpen) toggleMenu();
        });
    });

    // Scroll behavior
    function handleScroll() {
        var currentScrollY = window.scrollY;

        // Show/hide header
        if (!isMenuOpen) {
            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                header.classList.remove('hidden');
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.classList.add('hidden');
            }
        }

        // Mobile glass mode
        var heroHeight = window.innerHeight * 0.8;
        if (headerMobileInner) {
            if (currentScrollY >= heroHeight) {
                headerMobileInner.classList.add('glass-mode');
            } else {
                headerMobileInner.classList.remove('glass-mode');
            }
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle anchor links (smooth scroll on same page, or navigate + hash)
    document.querySelectorAll('a[href*="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            var anchor = this.getAttribute('data-anchor');

            // If it's a same-page anchor
            if (anchor || (href.startsWith('#') && href.length > 1)) {
                var targetId = anchor || href.substring(1);
                var target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            // If it's a cross-page anchor like /#about
            else if (href.includes('/#')) {
                // Let the browser navigate; the hash will trigger scroll on load
            }
        });
    });

    // On page load, scroll to hash if present
    if (window.location.hash) {
        setTimeout(function() {
            var target = document.querySelector(window.location.hash);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
})();
