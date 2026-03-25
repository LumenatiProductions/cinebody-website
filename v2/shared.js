/* ============================================
   CINEBODY V2 SHARED JAVASCRIPT
   Paste this into Settings > Advanced > Code Injection > Footer
   ============================================ */

(function() {
  'use strict';

  /* ── Scroll Reveal Observer ── */
  function initReveal() {
    var els = document.querySelectorAll('.cb-reveal, .cb-stagger');
    if (!els.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    els.forEach(function(el) { observer.observe(el); });
  }

  /* ── Counter Animation ── */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function(el) { observer.observe(el); });

    function animateCounter(el) {
      var target = parseInt(el.dataset.countTo);
      var suffix = el.dataset.countSuffix || '';
      var prefix = el.dataset.countPrefix || '';
      var duration = 2000;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 4);
        var current = Math.floor(eased * target);
        el.textContent = prefix + (target >= 1000 ? current.toLocaleString() : current) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + (target >= 1000 ? target.toLocaleString() : target) + suffix;
      }

      requestAnimationFrame(step);
    }
  }

  /* ── Video Component ──
     Pattern: Desktop shows autoplay muted iframe.
     Mobile shows poster image; tap loads iframe.
     Click toggles unmute/mute (one active at a time per section). */
  function initVideos() {
    var sections = document.querySelectorAll('[data-cb-video-group]');

    sections.forEach(function(section) {
      var videos = section.querySelectorAll('.cb-video');
      var players = [];
      var activeIndex = null;
      var isMobile = window.innerWidth < 768;

      videos.forEach(function(vid, i) {
        var iframe = vid.querySelector('iframe');
        var poster = vid.querySelector('.cb-video__poster');

        // Mobile: show poster, hide iframe until tap
        if (isMobile && poster && iframe) {
          iframe.removeAttribute('src');
          iframe.dataset.src = iframe.dataset.src || iframe.getAttribute('src') || '';
        }

        // Desktop: init Vimeo player if available
        if (!isMobile && iframe && typeof Vimeo !== 'undefined') {
          try {
            var p = new Vimeo.Player(iframe);
            p.setVolume(0);
            players[i] = p;
          } catch(e) {
            players[i] = null;
          }
        }

        vid.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          // Mobile: load iframe on first tap
          if (isMobile && iframe && !iframe.getAttribute('src') && iframe.dataset.src) {
            iframe.setAttribute('src', iframe.dataset.src);
            vid.classList.add('is-playing');
            if (poster) poster.style.opacity = '0';

            // Init player after iframe loads
            iframe.addEventListener('load', function() {
              if (typeof Vimeo !== 'undefined') {
                try {
                  var p = new Vimeo.Player(iframe);
                  p.setVolume(1);
                  p.play();
                  players[i] = p;
                } catch(ex) {}
              }
            }, { once: true });
            return;
          }

          // Toggle logic
          if (activeIndex === i) {
            // Pause this one
            vid.classList.remove('is-playing');
            if (poster) poster.style.opacity = '1';
            if (players[i]) {
              players[i].setVolume(0);
              players[i].play(); // keep looping muted
            }
            activeIndex = null;
          } else {
            // Pause all others
            videos.forEach(function(v, j) {
              v.classList.remove('is-playing');
              var p2 = v.querySelector('.cb-video__poster');
              if (p2) p2.style.opacity = '1';
              if (players[j]) {
                players[j].setVolume(0);
                if (j !== i) players[j].pause();
              }
            });

            // Play this one
            vid.classList.add('is-playing');
            if (poster) poster.style.opacity = '0';
            if (players[i]) {
              players[i].setVolume(1);
              players[i].play();
            }
            activeIndex = i;
          }
        });
      });
    });
  }

  /* ── FAQ Accordion ── */
  function initFAQ() {
    document.querySelectorAll('.cb-faq__trigger').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var expanded = this.getAttribute('aria-expanded') === 'true';
        // Close all
        document.querySelectorAll('.cb-faq__trigger').forEach(function(b) {
          b.setAttribute('aria-expanded', 'false');
          var panel = document.getElementById(b.getAttribute('aria-controls'));
          if (panel) panel.setAttribute('aria-hidden', 'true');
        });
        // Open clicked if was closed
        if (!expanded) {
          this.setAttribute('aria-expanded', 'true');
          var panel = document.getElementById(this.getAttribute('aria-controls'));
          if (panel) panel.setAttribute('aria-hidden', 'false');
        }
      });
    });
  }

  /* ── Pricing Toggle ── */
  function initPricingToggle() {
    var toggle = document.getElementById('cb-pricing-toggle');
    if (!toggle) return;

    var labelAnnual = document.getElementById('cb-label-annual');
    var labelMonthly = document.getElementById('cb-label-monthly');
    var amounts = document.querySelectorAll('[data-annual]');
    var billings = document.querySelectorAll('[data-billing-annual]');

    function update(isMonthly) {
      toggle.setAttribute('aria-checked', isMonthly);
      if (labelAnnual) labelAnnual.classList.toggle('is-active', !isMonthly);
      if (labelMonthly) labelMonthly.classList.toggle('is-active', isMonthly);

      amounts.forEach(function(el) {
        el.textContent = isMonthly ? el.dataset.monthly : el.dataset.annual;
      });

      billings.forEach(function(el) {
        el.textContent = isMonthly ? el.dataset.billingMonthly : el.dataset.billingAnnual;
      });
    }

    toggle.addEventListener('click', function() {
      update(toggle.getAttribute('aria-checked') !== 'true');
    });

    if (labelAnnual) labelAnnual.addEventListener('click', function() { update(false); });
    if (labelMonthly) labelMonthly.addEventListener('click', function() { update(true); });
  }

  /* ── Init ── */
  function init() {
    initReveal();
    initCounters();
    initVideos();
    initFAQ();
    initPricingToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
