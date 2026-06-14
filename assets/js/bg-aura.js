/* ──────────────────────────────────────────────────────────────
   bg-aura.js
   Canvas gradient animation + mouse/scroll parallax + scroll-reveal
   Palette: #09568c (blue) · #c9c2bd (sand) · #8d9ca0 (slate)
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ─── Canvas ─────────────────────────────────────── */
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ─── Input state ────────────────────────────────── */
  const ptr = { x: 0.50, y: 0.42 };   // normalised pointer position
  let scrollRatio = 0;                  // 0 = top, 1 = bottom

  window.addEventListener('mousemove', function (e) {
    ptr.x = e.clientX / window.innerWidth;
    ptr.y = e.clientY / window.innerHeight;
  }, { passive: true });

  window.addEventListener('touchmove', function (e) {
    if (e.touches.length) {
      ptr.x = e.touches[0].clientX / window.innerWidth;
      ptr.y = e.touches[0].clientY / window.innerHeight;
    }
  }, { passive: true });

  window.addEventListener('scroll', function () {
    const max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    scrollRatio = window.scrollY / max;
  }, { passive: true });

  /* ─── Orb definitions ────────────────────────────────
     bx/by   : base normalised position
     r       : radius as fraction of min(W,H)
     col     : [R,G,B]
     a       : peak alpha
     spd     : primary angular speed (rad/ms)
     ax/ay   : oscillation amplitudes
     px/py   : phase offsets
     mi      : mouse influence weight
     scroll  : vertical scroll parallax factor (sign matters)
  ──────────────────────────────────────────────────── */
  var orbs = [
    // Large steel blue — top-left, slow drift
    { bx:.10, by:.16, r:.60, col:[9,86,140],   a:.50, spd:1.6e-4, ax:.24, ay:.18, px:0.00, py:1.10, mi:.055, scroll:-.05,  cx:0, cy:0 },
    // Large warm sand — bottom-right, slowest
    { bx:.90, by:.84, r:.56, col:[201,194,189], a:.60, spd:1.2e-4, ax:.20, ay:.16, px:2.30, py:0.40, mi:.040, scroll: .04,  cx:0, cy:0 },
    // Medium slate — centre, medium speed
    { bx:.52, by:.46, r:.44, col:[141,156,160], a:.36, spd:2.0e-4, ax:.17, ay:.20, px:4.20, py:2.80, mi:.030, scroll:-.03,  cx:0, cy:0 },
    // Small blue — bottom-left accent
    { bx:.18, by:.82, r:.37, col:[9,86,140],    a:.28, spd:1.5e-4, ax:.14, ay:.22, px:1.50, py:3.50, mi:.042, scroll: .06,  cx:0, cy:0 },
    // Small sand — top-right accent
    { bx:.84, by:.16, r:.35, col:[201,194,189], a:.35, spd:1.9e-4, ax:.18, ay:.14, px:3.10, py:1.70, mi:.032, scroll:-.04,  cx:0, cy:0 },
    // Tiny slate — roaming
    { bx:.65, by:.60, r:.26, col:[141,156,160], a:.22, spd:2.5e-4, ax:.22, ay:.24, px:5.50, py:0.90, mi:.060, scroll: .03,  cx:0, cy:0 },
  ];

  // Initialise smoothed positions
  orbs.forEach(function(o){ o.cx = o.bx; o.cy = o.by; });

  /* ─── Lerp ───────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ─── Draw loop ──────────────────────────────────── */
  function draw(now) {
    ctx.clearRect(0, 0, W, H);

    var minDim = Math.min(W, H);

    for (var i = 0; i < orbs.length; i++) {
      var o = orbs[i];

      // Animated target (Lissajous-ish)
      var tx = o.bx + Math.sin(now * o.spd           + o.px) * o.ax;
      var ty = o.by + Math.cos(now * o.spd * 0.73    + o.py) * o.ay;

      // Mouse pull
      tx = lerp(tx, ptr.x, o.mi);
      ty = lerp(ty, ptr.y, o.mi * 0.55);

      // Scroll parallax (background moves less than content)
      ty += scrollRatio * o.scroll;

      // Smooth (exponential ease)
      o.cx = lerp(o.cx, tx, 0.025);
      o.cy = lerp(o.cy, ty, 0.020);

      var x = o.cx * W;
      var y = o.cy * H;
      var r = o.r * minDim;
      var R = o.col[0], G = o.col[1], B = o.col[2];

      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0,    'rgba(' + R + ',' + G + ',' + B + ',' + o.a + ')');
      g.addColorStop(0.42, 'rgba(' + R + ',' + G + ',' + B + ',' + (o.a * 0.34).toFixed(3) + ')');
      g.addColorStop(1,    'rgba(' + R + ',' + G + ',' + B + ',0)');

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

  /* ─── Scroll-reveal ──────────────────────────────── */
  var targets = document.querySelectorAll(
    '.panel:not(.panel-hero), .rc-card, .pub-card, .award-row, .jtag'
  );

  if (typeof IntersectionObserver !== 'undefined') {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -16px 0px' });

    targets.forEach(function (el, i) {
      // Stagger capped at 160ms so it feels snappy, not laggy
      el.style.transitionDelay = Math.min(i * 28, 160) + 'ms';
      io.observe(el);
    });
  } else {
    // No IntersectionObserver (very old browsers) — show everything
    targets.forEach(function (el) { el.classList.add('revealed'); });
  }

})();
