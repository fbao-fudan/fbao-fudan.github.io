/* ──────────────────────────────────────────────────────────────
   bg-aura.js  —  Ambient colour field
   Five large gradient blobs drawn in screen blend mode on a
   near-black base.  They drift very slowly on independent
   sinusoidal paths and breathe in opacity, creating a living,
   aurora-like atmosphere.  No distracting shapes or particles.
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0;

  /* ─── Scroll ──────────────────────────────────────── */
  var scrollRatio = 0;
  window.addEventListener('scroll', function () {
    scrollRatio = window.scrollY /
      Math.max(document.body.scrollHeight - window.innerHeight, 1);
  }, { passive: true });

  /* ─── Blob definitions ────────────────────────────────
     Colours are calibrated for canvas screen-blend on #060a14.
     r  = radius as fraction of min(W,H) — kept large so edges
          never become visible inside the viewport.
     spd = very slow angular speed (rad/ms)
     ax/ay = oscillation amplitude (normalised)
     px/py = phase offsets so blobs never sync
     a   = peak opacity in screen mode
  ──────────────────────────────────────────────────── */
  var blobs = [
    /* Large steel-blue — brand anchor, drifts top-left → centre */
    { bx:.14, by:.22, r:.80, col:[22, 108, 215], a:.50, spd:1.7e-5, ax:.22, ay:.15, px:0.00, py:0.90, cx:0, cy:0 },
    /* Large teal — top-right; where it overlaps blue it goes cyan */
    { bx:.84, by:.16, r:.76, col:[0,  152, 188], a:.42, spd:1.3e-5, ax:.18, ay:.17, px:1.80, py:2.20, cx:0, cy:0 },
    /* Indigo/violet — lower-left; adds depth, mixes purple with blue */
    { bx:.22, by:.68, r:.65, col:[72,  46, 218], a:.28, spd:2.3e-5, ax:.20, ay:.24, px:3.20, py:1.10, cx:0, cy:0 },
    /* Deep blue — lower-right */
    { bx:.80, by:.80, r:.62, col:[12,  80, 172], a:.38, spd:1.6e-5, ax:.24, ay:.18, px:2.60, py:3.80, cx:0, cy:0 },
    /* Bright cyan accent — small, faster, centre; lifts midground */
    { bx:.52, by:.38, r:.46, col:[0,  178, 218], a:.22, spd:2.9e-5, ax:.28, ay:.26, px:5.10, py:0.60, cx:0, cy:0 },
  ];
  blobs.forEach(function (b) { b.cx = b.bx; b.cy = b.by; });

  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ─── Resize ─────────────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ─── Draw loop ──────────────────────────────────── */
  function draw(now) {
    var minDim = Math.min(W, H);

    /* 1. Near-black base — drawn with source-over */
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#060a14';
    ctx.fillRect(0, 0, W, H);

    /* 2. Blobs in screen mode (additive light mixing) */
    ctx.globalCompositeOperation = 'screen';

    for (var i = 0; i < blobs.length; i++) {
      var b = blobs[i];

      /* Sinusoidal drift + very subtle scroll parallax */
      var tx = b.bx + Math.sin(now * b.spd         + b.px) * b.ax;
      var ty = b.by + Math.cos(now * b.spd * 0.69  + b.py) * b.ay
               - scrollRatio * 0.022;

      /* Exponential smooth — feels heavy and slow */
      b.cx = lerp(b.cx, tx, 0.010);
      b.cy = lerp(b.cy, ty, 0.009);

      /* Slow opacity breathing — independent per blob */
      var breathe = 0.80 + Math.sin(now * 0.00011 + b.px * 1.7) * 0.24;
      var alpha   = b.a * breathe;

      var x = b.cx * W,  y = b.cy * H,  r = b.r * minDim;
      var R = b.col[0],  G = b.col[1],  B = b.col[2];

      /* Multi-stop radial gradient: hot core → soft falloff */
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0,    'rgba('+R+','+G+','+B+','+ alpha.toFixed(3)        +')');
      g.addColorStop(0.30, 'rgba('+R+','+G+','+B+','+(alpha * 0.68).toFixed(3)+')');
      g.addColorStop(0.60, 'rgba('+R+','+G+','+B+','+(alpha * 0.28).toFixed(3)+')');
      g.addColorStop(1,    'rgba('+R+','+G+','+B+',0)');

      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    /* 3. Restore normal compositing */
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

  /* ─── Scroll-reveal ──────────────────────────────── */
  var targets = document.querySelectorAll(
    '.panel:not(.panel-hero), .rc-card, .pub-card, .award-row, .jtag'
  );
  if (typeof IntersectionObserver !== 'undefined') {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -16px 0px' });
    targets.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 22, 130) + 'ms';
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add('revealed'); });
  }

})();
