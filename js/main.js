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
            banner.style.opacity = '0';
            banner.style.transform = 'translateY(20px)';
            setTimeout(function() { banner.hidden = true; }, 300);
        }
    }

    if (banner) {
        var consent = localStorage.getItem('cookies-consent');
        if (!consent) {
            banner.hidden = false;
            // Small delay so animation works
            setTimeout(function() {
                banner.style.opacity = '1';
                banner.style.transform = 'translateY(0)';
            }, 500);
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
