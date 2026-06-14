/* ──────────────────────────────────────────────────────────────
   bg-aura.js  —  Dark theme: floating geometric shapes
   Palette: #2b8dd6 (blue) · #8d9ca0 (slate) · #c9b07a (sand)
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ─── Canvas ─────────────────────────────────────── */
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initShapes();
  }

  /* ─── Input ──────────────────────────────────────── */
  var ptr = { x: 0.5, y: 0.4 };
  var scrollRatio = 0;

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
    var max = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    scrollRatio = window.scrollY / max;
  }, { passive: true });

  /* ─── Palette ────────────────────────────────────── */
  var COLS = [
    [43, 141, 214],    // blue
    [43, 141, 214],    // blue (weighted)
    [141, 156, 160],   // slate
    [141, 156, 160],   // slate (weighted)
    [201, 176, 122],   // sand
  ];

  /* ─── Deep background orbs ───────────────────────── */
  var bgOrbs = [
    { bx:.15, by:.20, r:.50, col:[9,86,140],   a:.22, spd:1.5e-4, ax:.20, ay:.15, px:0.0, py:0.8, cx:0, cy:0 },
    { bx:.85, by:.78, r:.45, col:[43,141,214], a:.14, spd:1.1e-4, ax:.18, ay:.14, px:2.1, py:1.5, cx:0, cy:0 },
    { bx:.50, by:.50, r:.38, col:[141,156,160],a:.10, spd:1.8e-4, ax:.14, ay:.16, px:3.8, py:2.6, cx:0, cy:0 },
  ];
  bgOrbs.forEach(function(o){ o.cx = o.bx; o.cy = o.by; });

  /* ─── Geometric shapes ───────────────────────────── */
  var TYPES  = ['hex','hex','hex','tri','tri','ring','ring','sq'];
  var shapes = [];

  function initShapes() {
    shapes = [];
    // Place ~22 shapes, mix of sizes
    var counts = [
      { type:'hex',  n:8,  minR:18, maxR:68 },
      { type:'tri',  n:6,  minR:14, maxR:52 },
      { type:'ring', n:5,  minR:22, maxR:75 },
      { type:'sq',   n:3,  minR:14, maxR:42 },
    ];
    counts.forEach(function(def) {
      for (var i = 0; i < def.n; i++) {
        var col = COLS[Math.floor(Math.random() * COLS.length)];
        var r   = def.minR + Math.random() * (def.maxR - def.minR);
        // Larger shapes are more transparent
        var a   = lerp(0.18, 0.04, (r - def.minR) / (def.maxR - def.minR));
        a *= (0.7 + Math.random() * 0.6);
        shapes.push({
          type:     def.type,
          x:        Math.random() * W,
          y:        Math.random() * H,
          r:        r,
          rot:      Math.random() * Math.PI * 2,
          rotSpd:   (Math.random() - 0.5) * 0.0012,
          vx:       (Math.random() - 0.5) * 0.30,
          vy:       (Math.random() - 0.5) * 0.30,
          a:        a,
          col:      col,
          lw:       Math.random() * 1.0 + 0.4,
          // Parallax layer depth: 0 (far) to 1 (near)
          depth:    Math.random(),
        });
      }
    });
  }

  /* ─── Draw helpers ───────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  function drawHex(x, y, r, rot) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = rot + i * Math.PI / 3;
      var px = x + r * Math.cos(a);
      var py = y + r * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawTri(x, y, r, rot) {
    ctx.beginPath();
    for (var i = 0; i < 3; i++) {
      var a = rot + i * (Math.PI * 2 / 3) - Math.PI / 2;
      var px = x + r * Math.cos(a);
      var py = y + r * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawSq(x, y, r, rot) {
    ctx.beginPath();
    for (var i = 0; i < 4; i++) {
      var a = rot + i * Math.PI / 2 + Math.PI / 4;
      var px = x + r * Math.cos(a);
      var py = y + r * Math.sin(a);
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  /* ─── Draw loop ──────────────────────────────────── */
  function draw(now) {
    ctx.clearRect(0, 0, W, H);

    var minDim = Math.min(W, H);
    var mx = ptr.x, my = ptr.y;

    /* 1. Deep background orbs */
    for (var oi = 0; oi < bgOrbs.length; oi++) {
      var o = bgOrbs[oi];
      var tx = o.bx + Math.sin(now * o.spd + o.px) * o.ax;
      var ty = o.by + Math.cos(now * o.spd * 0.71 + o.py) * o.ay;
      tx = lerp(tx, mx, 0.025);
      ty = lerp(ty, my, 0.015);
      ty -= scrollRatio * 0.06;
      o.cx = lerp(o.cx, tx, 0.018);
      o.cy = lerp(o.cy, ty, 0.015);

      var ox = o.cx * W, oy = o.cy * H, or_ = o.r * minDim;
      var R = o.col[0], G = o.col[1], B = o.col[2];
      var g = ctx.createRadialGradient(ox, oy, 0, ox, oy, or_);
      g.addColorStop(0,    'rgba('+R+','+G+','+B+','+o.a+')');
      g.addColorStop(0.45, 'rgba('+R+','+G+','+B+','+(o.a*0.30).toFixed(3)+')');
      g.addColorStop(1,    'rgba('+R+','+G+','+B+',0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    /* 2. Geometric shapes */
    for (var si = 0; si < shapes.length; si++) {
      var s = shapes[si];

      // Update rotation
      s.rot += s.rotSpd;

      // Mouse parallax (nearer shapes shift more)
      var parallaxX = (mx - 0.5) * s.depth * 18;
      var parallaxY = (my - 0.5) * s.depth * 12 - scrollRatio * s.depth * 40;

      // Drift
      s.x += s.vx;
      s.y += s.vy;

      // Wrap
      var pad = s.r + 10;
      if (s.x < -pad)   s.x = W + pad;
      if (s.x > W + pad) s.x = -pad;
      if (s.y < -pad)   s.y = H + pad;
      if (s.y > H + pad) s.y = -pad;

      var drawX = s.x + parallaxX;
      var drawY = s.y + parallaxY;

      var CR = s.col[0], CG = s.col[1], CB = s.col[2];
      ctx.strokeStyle = 'rgba('+CR+','+CG+','+CB+','+s.a+')';
      ctx.lineWidth   = s.lw;
      ctx.fillStyle   = 'rgba('+CR+','+CG+','+CB+','+(s.a*0.08).toFixed(3)+')';

      ctx.save();
      switch (s.type) {
        case 'hex':  drawHex(drawX, drawY, s.r, s.rot); ctx.stroke(); ctx.fill(); break;
        case 'tri':  drawTri(drawX, drawY, s.r, s.rot); ctx.stroke(); ctx.fill(); break;
        case 'sq':   drawSq (drawX, drawY, s.r, s.rot); ctx.stroke(); ctx.fill(); break;
        case 'ring':
          ctx.beginPath();
          ctx.arc(drawX, drawY, s.r, 0, Math.PI * 2);
          ctx.stroke();
          // Inner ring
          ctx.beginPath();
          ctx.arc(drawX, drawY, s.r * 0.62, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba('+CR+','+CG+','+CB+','+(s.a*0.45).toFixed(3)+')';
          ctx.lineWidth = s.lw * 0.5;
          ctx.stroke();
          break;
      }
      ctx.restore();
    }

    requestAnimationFrame(draw);
  }

  /* ─── Start ──────────────────────────────────────── */
  window.addEventListener('resize', resize, { passive: true });
  resize();
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
      el.style.transitionDelay = Math.min(i * 24, 140) + 'ms';
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add('revealed'); });
  }

})();
