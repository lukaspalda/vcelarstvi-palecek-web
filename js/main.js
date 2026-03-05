(function() {
    'use strict';

    // ── Mobile Menu ──
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        navMenu.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // ── Sticky Navbar ──
    var navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // ── Smooth Scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Scroll Animations ──
    var animElements = document.querySelectorAll('[data-animate]');
    if (animElements.length > 0 && 'IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        animElements.forEach(function(el) { observer.observe(el); });
    }

    // ── FAQ Accordion (only one open at a time) ──
    document.querySelectorAll('.faq-item').forEach(function(item) {
        item.addEventListener('toggle', function() {
            if (this.open) {
                document.querySelectorAll('.faq-item').forEach(function(other) {
                    if (other !== item) other.removeAttribute('open');
                });
            }
        });
    });

    // ── Lecture Year Toggle (collapse/expand) ──
    document.querySelectorAll('.year-toggle').forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var yearBlock = this.closest('.lecture-year');
            var tableWrapper = yearBlock.querySelector('.lecture-table-wrapper');
            var expandLabel = this.querySelector('.year-expand');

            if (!tableWrapper || !expandLabel) return;

            if (tableWrapper.classList.contains('lecture-hidden')) {
                tableWrapper.classList.remove('lecture-hidden');
                yearBlock.classList.remove('collapsed');
                expandLabel.textContent = 'Skrýt ▴';
            } else {
                tableWrapper.classList.add('lecture-hidden');
                yearBlock.classList.add('collapsed');
                expandLabel.textContent = 'Zobrazit ▾';
            }
        });
    });

    // ── Gallery Filter ──
    var galleryTabs = document.querySelectorAll('.gallery-tab');
    var galleryItems = document.querySelectorAll('.gallery-item');

    galleryTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var filter = this.getAttribute('data-filter');

            // Update active tab
            galleryTabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');

            // Filter items with animation
            galleryItems.forEach(function(item) {
                var category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = '';
                    item.classList.remove('gallery-hidden');
                } else {
                    item.classList.add('gallery-hidden');
                    setTimeout(function() {
                        if (item.classList.contains('gallery-hidden')) {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });

    // ── Lightbox ──
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var lightboxClose = document.getElementById('lightbox-close');
    var lightboxPrev = document.getElementById('lightbox-prev');
    var lightboxNext = document.getElementById('lightbox-next');
    var currentLightboxIndex = 0;

    function getVisibleItems() {
        var items = [];
        galleryItems.forEach(function(item) {
            if (item.style.display !== 'none' && !item.classList.contains('gallery-hidden')) {
                items.push(item);
            }
        });
        return items;
    }

    function openLightbox(index) {
        var visible = getVisibleItems();
        if (index < 0 || index >= visible.length) return;
        currentLightboxIndex = index;
        var item = visible[index];
        var img = item.querySelector('img');
        var caption = item.querySelector('.gallery-caption');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigateLightbox(direction) {
        var visible = getVisibleItems();
        currentLightboxIndex += direction;
        if (currentLightboxIndex < 0) currentLightboxIndex = visible.length - 1;
        if (currentLightboxIndex >= visible.length) currentLightboxIndex = 0;
        openLightbox(currentLightboxIndex);
    }

    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var visible = getVisibleItems();
            var index = visible.indexOf(this);
            if (index >= 0) openLightbox(index);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', function() { navigateLightbox(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', function() { navigateLightbox(1); });

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ── Contact Form ──
    var form = document.querySelector('[data-wz-contact]');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var origText = btn.textContent;
            btn.textContent = 'Odesílání...';
            btn.disabled = true;
            setTimeout(function() {
                btn.textContent = '✓ Odesláno!';
                btn.style.background = '#5B9A2F';
                form.reset();
                setTimeout(function() {
                    btn.textContent = origText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1000);
        });
    }

    // ── Cookie Banner ──
    var banner = document.getElementById('cookie-banner');
    var acceptBtn = document.getElementById('cookie-accept');
    var rejectBtn = document.getElementById('cookie-reject');

    function hideBanner() {
        if (banner) {
            banner.classList.remove('visible');
        }
    }

    if (banner) {
        var consent = localStorage.getItem('cookies-consent');
        if (!consent) {
            setTimeout(function() { banner.classList.add('visible'); }, 500);
        }
    }
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('cookies-consent', 'accepted');
            hideBanner();
        });
    }
    if (rejectBtn) {
        rejectBtn.addEventListener('click', function() {
            localStorage.setItem('cookies-consent', 'rejected');
            hideBanner();
        });
    }

})();
