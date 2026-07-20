/* "Why We're Doing This" carousel — progressive enhancement.
   With no JS the first slide renders statically and controls stay hidden.
   Here we wire up autoplay, manual controls, keyboard and touch.

   The auto-advance clock IS the progress bar: we let the CSS animation on
   `.why-progress span` run for --why-interval, then advance on animationend.
   Pausing the carousel pauses that animation (animation-play-state), so the
   progress fill and the advance stay perfectly in sync. */
(function () {
  'use strict';

  var INTERVAL_MS = 7000;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var slides   = Array.prototype.slice.call(root.querySelectorAll('[data-slide]'));
    var captions = Array.prototype.slice.call(root.querySelectorAll('[data-caption]'));
    var dots     = Array.prototype.slice.call(root.querySelectorAll('[data-dot]'));
    var progress = root.querySelector('[data-progress] span');
    var prevBtn = root.querySelector('[data-prev]');
    var nextBtn = root.querySelector('[data-next]');

    if (slides.length < 2) return; // nothing to rotate

    var current = 0;
    var autoplay = !reduceMotion;

    /* Lazy backgrounds. Only slide 0's photo is inlined in the HTML; the rest
       carry their URL in data-bg. We decode each into a detached Image first,
       then swap it onto the slide once it's ready so the cross-fade never
       flashes an empty frame. Idle-warm them all up front (there's ample time
       before the 7s clock reaches them); show() also loads on demand in case a
       viewer jumps ahead of the prefetch. */
    function loadSlide(i) {
      var s = slides[i];
      if (!s || s.dataset.bgLoaded) return;
      s.dataset.bgLoaded = '1'; // guard: one request per slide, even mid-flight
      var url = s.getAttribute('data-bg');
      if (!url) return;         // slide 0 is already inlined
      var img = new Image();
      img.onload = function () { s.style.backgroundImage = "url('" + url + "')"; };
      img.src = url;
    }

    var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 200); };
    idle(function () { slides.forEach(function (_, i) { loadSlide(i); }); });

    root.style.setProperty('--why-interval', (INTERVAL_MS / 1000) + 's');
    root.classList.add('is-enhanced');

    /* Photo, caption and dot for one index move together. The photo is
       decorative; the caption carries the slide role for assistive tech. */
    function setActive(i, on) {
      slides[i].classList.toggle('is-active', on);
      dots[i].classList.toggle('is-active', on);
      dots[i].setAttribute('aria-selected', on ? 'true' : 'false');
      if (captions[i]) {
        captions[i].classList.toggle('is-active', on);
        if (on) captions[i].removeAttribute('aria-hidden');
        else captions[i].setAttribute('aria-hidden', 'true');
      }
    }

    function show(next, opts) {
      opts = opts || {};
      next = (next + slides.length) % slides.length;
      if (next === current) { restartClock(); return; }

      loadSlide(next); // safety net if the viewer outruns the idle prefetch
      setActive(current, false);
      current = next;
      setActive(current, true);

      if (opts.focusDot) dots[current].focus();
      restartClock();
    }

    function next() { show(current + 1); }
    function prev() { show(current - 1); }

    /* Restart the progress animation from zero by forcing a reflow. When it
       finishes (animationend) we advance — that's the autoplay heartbeat. */
    function restartClock() {
      if (!autoplay || !progress) return;
      progress.style.animation = 'none';
      void progress.offsetWidth; // reflow
      progress.style.animation = '';
    }

    function play() {
      if (!autoplay) return;
      root.classList.add('is-playing');
      restartClock();
    }
    function pause() { root.classList.add('is-paused'); }
    function resume() { root.classList.remove('is-paused'); }

    if (progress) {
      progress.addEventListener('animationend', function () {
        if (autoplay && !root.classList.contains('is-paused')) next();
      });
    }

    // Manual controls
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); });
    });

    // Pause (freezing the progress bar) while the pointer is over the carousel
    root.addEventListener('mouseenter', pause);
    root.addEventListener('mouseleave', function () {
      // Don't resume if keyboard focus is still inside the carousel.
      if (root.contains(document.activeElement)) return;
      resume();
    });

    // Pause when keyboard focus enters the carousel
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', function (e) {
      if (!root.contains(e.relatedTarget)) resume();
    });

    // Pause when the tab is hidden (avoids a burst of advances on return)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause(); else resume();
    });

    // Keyboard: arrows step through slides
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1, { focusDot: true }); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1, { focusDot: true }); }
    });

    // Touch / pointer swipe on the viewport
    var startX = null;
    var viewport = root;
    viewport.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    viewport.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    });
    viewport.addEventListener('pointercancel', function () { startX = null; });

    play();
  });
})();
