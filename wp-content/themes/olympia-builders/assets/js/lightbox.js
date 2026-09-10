(function() {
    'use strict';

    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var lightboxImage = document.getElementById('lightbox-image');
    var lightboxCounter = document.getElementById('lightbox-counter');
    var lightboxPrev = document.getElementById('lightbox-prev');
    var lightboxNext = document.getElementById('lightbox-next');
    var lightboxClose = document.getElementById('lightbox-close');

    var galleryItems = document.querySelectorAll('.project-gallery-item');
    var images = [];
    var currentIndex = 0;
    var touchStartX = 0;
    var touchStartY = 0;
    var dragOffset = 0;

    // Build images array
    galleryItems.forEach(function(item) {
        images.push(item.getAttribute('data-lightbox-src'));
    });

    if (images.length === 0) return;

    function openLightbox(index) {
        currentIndex = index;
        updateImage();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        dragOffset = 0;
        lightboxImage.style.transform = '';
    }

    function updateImage() {
        lightboxImage.src = images[currentIndex];
        lightboxImage.alt = 'Gallery image ' + (currentIndex + 1);
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
        dragOffset = 0;
        lightboxImage.style.transform = '';
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
        dragOffset = 0;
        lightboxImage.style.transform = '';
    }

    // Click handlers
    galleryItems.forEach(function(item, index) {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function(e) { e.stopPropagation(); prevImage(); });
    lightboxNext.addEventListener('click', function(e) { e.stopPropagation(); nextImage(); });

    // Click outside to close
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeLightbox();
    });

    // Touch handlers for swipe
    lightbox.addEventListener('touchstart', function(e) {
        if (!e.touches[0]) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchmove', function(e) {
        if (!e.touches[0]) return;
        var dx = e.touches[0].clientX - touchStartX;
        var dy = e.touches[0].clientY - touchStartY;
        // Only track horizontal swipes
        if (Math.abs(dy) > Math.abs(dx)) return;
        dragOffset = dx;
        lightboxImage.style.transform = 'translateX(' + dragOffset + 'px)';
        lightboxImage.style.transition = 'none';
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        var endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : touchStartX;
        var dx = endX - touchStartX;
        lightboxImage.style.transition = 'transform 0.3s ease';

        if (dx < -50) {
            nextImage();
        } else if (dx > 50) {
            prevImage();
        } else {
            lightboxImage.style.transform = '';
            dragOffset = 0;
        }
    });
})();
