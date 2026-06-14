/* ──────────────────────────────────────────────────────────────
   bg-aura.js  —  Molecular / neural-network graph animation
   Nodes drift on smooth sinusoidal paths.
   Hub nodes glow. Mouse highlights nearby connections.
   Palette: #2b8dd6 · #8d9ca0 · #c9b07a
   ────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ─── Canvas ─────────────────────────────────────── */
  var canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0;

  /* ─── Input ──────────────────────────────────────── */
  var ptr = { x: -999, y: -999 };   // screen px; -999 = off-screen
  var scrollY = 0;

  window.addEventListener('mousemove', function (e) {
    ptr.x = e.clientX; ptr.y = e.clientY;
  }, { passive: true });
  window.addEventListener('mouseleave', function () {
    ptr.x = -999; ptr.y = -999;
  }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (e.touches.length) {
      ptr.x = e.touches[0].clientX;
      ptr.y = e.touches[0].clientY;
    }
  }, { passive: true });
  window.addEventListener('scroll', function () {
    scrollY = window.scrollY;
  }, { passive: true });

  /* ─── Node parameters ────────────────────────────── */
  var TOTAL_NODES  = 54;
  var HUB_COUNT    = 7;
  var CONNECT_DIST = 148;   // px
  var MOUSE_DIST   = 170;   // px — mouse highlight radius

  /* Colours */
  var C_BLUE  = [43, 141, 214];
  var C_SLATE = [141, 156, 160];
  var C_SAND  = [201, 176, 122];

  var nodes = [];

  function initNodes() {
    nodes = [];
    for (var i = 0; i < TOTAL_NODES; i++) {
      var isHub = i < HUB_COUNT;
      /* Hubs spread evenly; regulars random */
      var bx = isHub
        ? 0.08 + (i / HUB_COUNT) * 0.86
        : Math.random();
      var by = isHub
        ? 0.15 + Math.random() * 0.70
        : Math.random();

      /* Mix of blue and slate for regulars */
      var col = isHub
        ? C_BLUE
        : (Math.random() < 0.55 ? C_SLATE : C_BLUE);

      nodes.push({
        bx:   bx,
        by:   by,
        ax:   isHub ? 0.06 + Math.random() * 0.06 : 0.04 + Math.random() * 0.10,
        ay:   isHub ? 0.04 + Math.random() * 0.06 : 0.03 + Math.random() * 0.10,
        spd:  isHub ? 5e-5 + Math.random() * 4e-5 : 4e-5 + Math.random() * 9e-5,
        px:   Math.random() * Math.PI * 2,
        py:   Math.random() * Math.PI * 2,
        r:    isHub ? 3.5 + Math.random() * 2.5  : 1.0 + Math.random() * 1.6,
        isHub: isHub,
        col:  col,
        a:    isHub ? 0.90 : 0.22 + Math.random() * 0.38,
        /* smoothed screen positions */
        sx: 0, sy: 0,
      });
    }
    /* Seed initial smoothed positions */
    nodes.forEach(function (n, i) {
      n.sx = n.bx * W;
      n.sy = n.by * H;
    });
  }

  /* ─── Resize ─────────────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initNodes();
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  /* ─── Lerp / clamp ───────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  /* ─── Draw loop ──────────────────────────────────── */
  function draw(now) {
    ctx.clearRect(0, 0, W, H);

    /* 0. Very subtle large background glow for depth */
    var gx = W * 0.25, gy = H * 0.22, gr = Math.min(W, H) * 0.55;
    var bg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
    bg.addColorStop(0,   'rgba(9,60,120,0.18)');
    bg.addColorStop(0.5, 'rgba(9,60,120,0.07)');
    bg.addColorStop(1,   'rgba(9,60,120,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* 1. Update node positions */
    var scrollFrac = scrollY / Math.max(document.body.scrollHeight - H, 1);
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var tx = (n.bx + Math.sin(now * n.spd         + n.px) * n.ax) * W;
      var ty = (n.by + Math.cos(now * n.spd * 0.71  + n.py) * n.ay) * H
               - scrollFrac * n.by * 28;    /* subtle parallax */
      n.sx = lerp(n.sx, tx, 0.018);
      n.sy = lerp(n.sy, ty, 0.016);
    }

    /* 2. Draw edges ─────────────────────────────────── */
    for (var i = 0; i < nodes.length - 1; i++) {
      var a = nodes[i];
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j];
        var dx = a.sx - b.sx;
        var dy = a.sy - b.sy;
        var d2 = dx * dx + dy * dy;
        if (d2 > CONNECT_DIST * CONNECT_DIST) continue;
        var d = Math.sqrt(d2);
        var baseAlpha = (1 - d / CONNECT_DIST);

        /* Mouse proximity boost */
        var mda = Math.sqrt((a.sx-ptr.x)*(a.sx-ptr.x)+(a.sy-ptr.y)*(a.sy-ptr.y));
        var mdb = Math.sqrt((b.sx-ptr.x)*(b.sx-ptr.x)+(b.sy-ptr.y)*(b.sy-ptr.y));
        var nearMouse = (mda < MOUSE_DIST || mdb < MOUSE_DIST);
        var boost = nearMouse
          ? Math.pow(1 - Math.min(mda, mdb) / MOUSE_DIST, 1.6) * 1.8
          : 0;

        var edgeAlpha = clamp(baseAlpha * (0.20 + boost * 0.55), 0, 0.75);
        var isHubEdge = a.isHub || b.isHub;

        /* Hub edges: brighter blue; regular: slate */
        var R = isHubEdge ? C_BLUE[0] : C_SLATE[0];
        var G = isHubEdge ? C_BLUE[1] : C_SLATE[1];
        var B = isHubEdge ? C_BLUE[2] : C_SLATE[2];

        ctx.strokeStyle = 'rgba(' + R + ',' + G + ',' + B + ',' + edgeAlpha.toFixed(3) + ')';
        ctx.lineWidth   = isHubEdge ? 0.9 : 0.55;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }
    }

    /* 3. Draw nodes ──────────────────────────────────── */
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var md = Math.sqrt((n.sx-ptr.x)*(n.sx-ptr.x)+(n.sy-ptr.y)*(n.sy-ptr.y));
      var mouseBoost = md < MOUSE_DIST
        ? Math.pow(1 - md / MOUSE_DIST, 1.8) * 0.7
        : 0;
      var finalAlpha = clamp(n.a + mouseBoost, 0, 1);

      var R = n.col[0], G = n.col[1], B = n.col[2];

      if (n.isHub) {
        /* Glow ring behind hub */
        var glowR = n.r * (5 + mouseBoost * 4);
        var grd = ctx.createRadialGradient(n.sx, n.sy, 0, n.sx, n.sy, glowR);
        grd.addColorStop(0,   'rgba(' + R + ',' + G + ',' + B + ',' + (finalAlpha * 0.30).toFixed(3) + ')');
        grd.addColorStop(0.5, 'rgba(' + R + ',' + G + ',' + B + ',' + (finalAlpha * 0.08).toFixed(3) + ')');
        grd.addColorStop(1,   'rgba(' + R + ',' + G + ',' + B + ',0)');
        ctx.fillStyle = grd;
        ctx.fillRect(n.sx - glowR, n.sy - glowR, glowR * 2, glowR * 2);
      }

      /* Core dot */
      ctx.fillStyle = 'rgba(' + R + ',' + G + ',' + B + ',' + finalAlpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, n.r + mouseBoost * 1.2, 0, Math.PI * 2);
      ctx.fill();
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
