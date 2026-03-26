/* ═══════════════════════════════════════════════
   CINEBODY — Click-to-Play Video Controller
   Requires: Vimeo Player SDK (player.vimeo.com/api/player.js)

   Attributes on .vid-playable:
     data-vimeo="ID"           — Vimeo video ID (required)
     data-vimeo-h="HASH"       — hash for private/unlisted videos
     data-autoplay             — autoplay on desktop, click-to-play on mobile
     data-autoplay-always      — autoplay on ALL devices including mobile
     vid-playable--h           — 16:9 aspect
     vid-playable--v           — 9:16 aspect
   ═══════════════════════════════════════════════ */

(function() {
  var playSVG = '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>';
  var svgMuted = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
  var svgUnmuted = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';

  var isMobile = window.innerWidth < 768;
  var activePlayer = null;
  var activeBtn = null;

  function loadVideo(container, videoId, hash) {
    if (container.classList.contains('playing')) return;

    var base = 'https://player.vimeo.com/video/' + videoId;
    var params = hash ? '?h=' + hash + '&' : '?';
    var src = base + params + 'autoplay=1&loop=1&muted=1&byline=0&title=0&portrait=0';

    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.allow = 'autoplay';
    iframe.loading = 'lazy';
    container.insertBefore(iframe, container.firstChild);
    container.classList.add('playing');

    if (typeof Vimeo !== 'undefined' && Vimeo.Player) {
      container._player = new Vimeo.Player(iframe);
    }
  }

  document.querySelectorAll('.vid-playable').forEach(function(container) {
    var videoId = container.getAttribute('data-vimeo');
    var hash = container.getAttribute('data-vimeo-h');
    var autoplayDesktop = container.hasAttribute('data-autoplay');
    var autoplayAlways = container.hasAttribute('data-autoplay-always');
    if (!videoId) return;

    // Determine if this video should autoplay
    var shouldAutoplay = autoplayAlways || (autoplayDesktop && !isMobile);

    // Add play button
    var playBtn = document.createElement('div');
    playBtn.className = 'vid-play-btn';
    playBtn.innerHTML = playSVG;
    container.appendChild(playBtn);

    // Hide play button if autoplaying
    if (shouldAutoplay) {
      playBtn.style.display = 'none';
    }

    // Add mute button
    var muteBtn = document.createElement('button');
    muteBtn.className = 'vid-mute-btn';
    muteBtn.innerHTML = svgMuted;
    muteBtn.setAttribute('aria-label', 'Unmute');
    container.appendChild(muteBtn);

    // Autoplay: load when scrolled into view
    if (shouldAutoplay) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            loadVideo(container, videoId, hash);
            obs.unobserve(container);
          }
        });
      }, { threshold: 0.15 });
      obs.observe(container);
    }

    // Click to play (fallback, always available)
    container.addEventListener('click', function(e) {
      if (e.target.closest('.vid-mute-btn')) return;
      loadVideo(container, videoId, hash);
    });

    // Mute/unmute
    muteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var player = container._player;
      if (!player) return;

      if (activeBtn === muteBtn) {
        player.setMuted(true);
        muteBtn.innerHTML = svgMuted;
        muteBtn.setAttribute('aria-label', 'Unmute');
        activePlayer = null;
        activeBtn = null;
        return;
      }

      if (activePlayer && activeBtn) {
        activePlayer.setMuted(true);
        activeBtn.innerHTML = svgMuted;
        activeBtn.setAttribute('aria-label', 'Unmute');
      }

      player.setMuted(false);
      muteBtn.innerHTML = svgUnmuted;
      muteBtn.setAttribute('aria-label', 'Mute');
      activePlayer = player;
      activeBtn = muteBtn;
    });
  });
})();
