/* ============================================================================
 * NEURAL CORE — Brain Animation
 * ============================================================================
 * A self-contained 3D neural-network visualization that renders to a <canvas>.
 * No dependencies, no build step. Locked to a smooth ~60fps and frame-rate
 * independent (all motion is driven by real elapsed time, so it never stutters
 * or "jumps" when frames vary).
 *
 * ---------------------------------------------------------------------------
 * QUICK START
 * ---------------------------------------------------------------------------
 *   <canvas id="brain"></canvas>
 *   <script src="Brain.js"></script>
 *   <script>
 *     const brain = new NeuralCore(document.getElementById('brain'), {
 *       accentColor: '#C77DFF',   // base hue of the network
 *       intensity:   1.3,         // 0.4 – 1.6, scales neuron / signal count
 *     });
 *     brain.start();
 *
 *     brain.setMode('thinking');  // 'idle' | 'thinking' | 'working' | 'writing'
 *     brain.pulse(0.24);          // inject a burst of activity (e.g. per keypress)
 *
 *     // live readouts (updated continuously):
 *     // brain.metrics -> { loadPct, flux, coreTemp, synapseCount }
 *
 *     brain.stop();               // cancel the loop + listeners when done
 *   </script>
 *
 * ---------------------------------------------------------------------------
 * SPEC
 * ---------------------------------------------------------------------------
 * SCENE
 *   • cerebrum   ~540·√intensity neurons on a folded ellipsoid (split L/R)
 *   • cerebellum ~165 neurons, lower-rear cluster
 *   • brain stem ~70  neurons, vertical column
 *   • synapses   nearest-neighbour links (max 4 per neuron, < 46u apart),
 *                drawn as quadratic curves with optional dendrite sprouts
 *   • core       glowing central node; brightness tracks activation
 *   • reticle    three dashed rings + tick marks behind the network
 *
 * MOTION MODEL (all per-frame deltas are multiplied by `dt`, the real elapsed
 *   time in units of one 60fps frame, clamped to 3 so a backgrounded tab does
 *   not teleport anything on return)
 *   • activation A and heat T ease toward per-mode targets (see MODES)
 *   • neurons pulse on a sine wave; in 'working' mode a sweeping band activates
 *     them top-to-bottom
 *
 * FIRING MODEL  (what makes neurons "fire")
 *   • Ignitions are emitted at a STEADY RATE via a fractional accumulator
 *     (ignRate · dt), not random per-frame bursts — so the cadence is even.
 *   • An ignited neuron flares, then fans spikes down a random subset of its
 *     links (probability ∝ strength). Each spike races along its fiber; on
 *     arrival it ignites the next neuron (depth-capped cascade).
 *   • Spikes leave a fading neon trail and a bright head.
 *
 * FADE / GLIDE  (no pop-in, no stutter)
 *   • Every dot is drawn from a pre-rendered radial-gradient SPRITE via
 *     drawImage — NOT canvas shadowBlur. Per-particle shadowBlur was the
 *     original frame-rate killer; sprites keep hundreds of glowing dots cheap.
 *   • Traveling signals ride a sin() envelope: invisible at both ends of the
 *     fiber, brightest in the middle — they fade in, glide, and dissolve, so
 *     the respawn is never visible.
 *   • Spike heads fade in at birth and fade out as they hand off.
 *   • Neurons fade in/out softly with their own pulse.
 *
 * MODES                 activation(A)   heat(T)   pulse-rate
 *   idle                0.20            0.10      0.6×
 *   thinking            0.74            0.92      1.5×   (+ radiating bursts)
 *   working             0.90            0.50      1.0×   (+ sweep band)
 *   writing             0.60            0.30      0.9×   (+ convergence glow)
 *   pulse()/typing temporarily lifts A (and T in 'writing') then decays.
 *
 * COLOR
 *   Hue is taken from `accentColor`; it shifts toward cyan (188°) as heat rises
 *   and saturation climbs slightly. Glow sprites are rebuilt only when the
 *   color drifts — never per particle.
 *
 * METRICS (derived from A / T, refreshed on a real-time cadence ≈130ms)
 *   loadPct  0–100   ·  flux  Hz  ·  coreTemp  K  ·  synapseCount  (fixed)
 * ==========================================================================*/

(function (global) {
  'use strict';

  var MODE_TARGETS = {
    idle:     { a: 0.20, t: 0.10, pulse: 0.6 },
    thinking: { a: 0.74, t: 0.92, pulse: 1.5 },
    working:  { a: 0.90, t: 0.50, pulse: 1.0 },
    writing:  { a: 0.60, t: 0.30, pulse: 0.9 }
  };

  function NeuralCore(canvas, options) {
    if (!canvas) throw new Error('NeuralCore: a <canvas> element is required');
    options = options || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.accentColor = options.accentColor || '#12C2FF';
    this.intensity   = options.intensity != null ? options.intensity : 1.3;
    this.autoCycle   = !!options.autoCycle;

    this.mode = options.mode || 'idle';
    this.metrics = { loadPct: 22, flux: 96, coreTemp: 312, synapseCount: 0 };

    this._energy = 0;
    this._running = false;
    this._raf = 0;
    this._boundResize = this.resize.bind(this);
  }

  /* -------- color helpers -------- */
  NeuralCore.prototype.hexToHsl = function (hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var r = parseInt(h.slice(0, 2), 16) / 255,
        g = parseInt(h.slice(2, 4), 16) / 255,
        b = parseInt(h.slice(4, 6), 16) / 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), H = 0, S = 0, L = (mx + mn) / 2, d = mx - mn;
    if (d) {
      S = L > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) H = (g - b) / d + (g < b ? 6 : 0);
      else if (mx === g) H = (b - r) / d + 2;
      else H = (r - g) / d + 4;
      H *= 60;
    }
    return { h: H, s: S * 100, l: L * 100 };
  };
  NeuralCore.prototype.hsl = function (h, s, l, a) {
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + (a == null ? 1 : a) + ')';
  };
  NeuralCore.prototype.smooth = function (rate, dt) { return 1 - Math.pow(1 - rate, dt); };

  /* -------- glow sprite (smooth dots without per-particle shadowBlur) -------- */
  NeuralCore.prototype.glowSprite = function (h, s, l, core) {
    var size = 64, c = document.createElement('canvas'); c.width = c.height = size;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    if (core) {
      grd.addColorStop(0, 'rgba(255,255,255,1)');
      grd.addColorStop(0.22, this.hsl(h, 100, Math.min(94, l + 24), 0.95));
      grd.addColorStop(0.55, this.hsl(h, s, l, 0.30));
      grd.addColorStop(1, this.hsl(h, s, l, 0));
    } else {
      grd.addColorStop(0, this.hsl(h, s, l, 0.85));
      grd.addColorStop(0.35, this.hsl(h, s, l, 0.30));
      grd.addColorStop(1, this.hsl(h, s, l, 0));
    }
    g.fillStyle = grd; g.fillRect(0, 0, size, size);
    return c;
  };
  NeuralCore.prototype.blit = function (sprite, x, y, r, alpha) {
    if (alpha <= 0 || !sprite) return;
    var ctx = this.ctx;
    ctx.globalAlpha = alpha > 1 ? 1 : alpha;
    ctx.drawImage(sprite, x - r, y - r, r * 2, r * 2);
    ctx.globalAlpha = 1;
  };

  NeuralCore.prototype.targetFor = function (mode) {
    return MODE_TARGETS[mode] || MODE_TARGETS.idle;
  };

  /* -------- public controls -------- */
  NeuralCore.prototype.setMode = function (m) { if (MODE_TARGETS[m]) this.mode = m; };
  NeuralCore.prototype.setAutoCycle = function (on) {
    this.autoCycle = !!on; this._lastCycle = (typeof performance !== 'undefined' ? performance.now() : Date.now());
  };
  /** Inject activity (0–1). Call on keypress / events. Switches to 'writing'. */
  NeuralCore.prototype.pulse = function (amount) {
    this._energy = Math.min(1, this._energy + (amount == null ? 0.24 : amount));
    if (this.mode !== 'writing') this.setMode('writing');
  };
  NeuralCore.prototype.setAccent = function (hex) {
    this.accentColor = hex;
    var base = this.hexToHsl(hex);
    this.baseHue = base.h; this.baseSat = Math.max(60, base.s);
    this._spriteHue = null;
  };

  /* -------- a neuron fires -------- */
  NeuralCore.prototype.ignite = function (idx, strength, depth) {
    var n = this.nodes[idx]; if (!n) return;
    n.flare = Math.min(1.4, (n.flare || 0) + strength);
    if (depth >= 6 || strength < 0.12) return;
    var links = this.adj[idx]; if (!links) return;
    for (var i = 0; i < links.length; i++) {
      var lk = links[i];
      if (Math.random() < this._propProb * strength) {
        this.firings.push({ syn: lk.syn, fwd: lk.fwd, target: lk.other, t: 0,
          speed: 0.05 + Math.random() * 0.05, strength: strength * 0.74, depth: depth + 1, trail: [] });
      }
    }
  };

  /* -------- scene build -------- */
  NeuralCore.prototype.build = function () {
    var intensity = this.intensity;
    var nodes = [], synapses = [], signals = [];
    var cerebrum = Math.round(540 * Math.sqrt(intensity)), cerebellum = 165, stem = 70, i, j;

    for (i = 0; i < cerebrum; i++) {
      var isLeft = Math.random() > 0.5;
      var theta = Math.random() * Math.PI * 2, phi = Math.acos(Math.random() * 2 - 1);
      var rx = Math.sin(phi) * Math.cos(theta) * 145, ry = Math.sin(phi) * Math.sin(theta) * 105, rz = Math.cos(phi) * 115;
      var fold = Math.sin(theta * 8) * Math.sin(phi * 8) * 14;
      var dist = Math.sqrt(rx * rx + ry * ry + rz * rz);
      rx += rx / dist * fold; ry += ry / dist * fold; rz += rz / dist * fold;
      rx += isLeft ? -26 : 26;
      nodes.push({ x: rx, y: ry - 15, z: rz, off: Math.random() * Math.PI * 2, size: Math.random() * 0.7 + 0.35, type: 'cerebrum', flare: 0 });
    }
    for (i = 0; i < cerebellum; i++) {
      var th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI;
      var bx = Math.sin(ph) * Math.cos(th) * 55, by = Math.sin(ph) * Math.sin(th) * 32 + 75, bz = Math.cos(ph) * 45 - 80;
      var f2 = Math.sin(by * 0.35) * 4; bx += f2; bz += f2;
      nodes.push({ x: bx, y: by, z: bz, off: Math.random() * Math.PI * 2, size: Math.random() * 0.5 + 0.25, type: 'cerebellum', flare: 0 });
    }
    for (i = 0; i < stem; i++) {
      nodes.push({ x: (Math.random() - 0.5) * 22, y: Math.random() * 110 + 65, z: (Math.random() - 0.5) * 22 - 20,
        off: Math.random() * Math.PI * 2, size: Math.random() * 0.6 + 0.3, type: 'stem', flare: 0 });
    }

    var maxC = 4;
    for (i = 0; i < nodes.length; i++) {
      var c = 0;
      for (j = i + 1; j < nodes.length; j++) {
        if (c >= maxC) break;
        var n1 = nodes[i], n2 = nodes[j];
        if (n1.type === 'stem' && n2.type === 'cerebrum') continue;
        var dx = n1.x - n2.x, dy = n1.y - n2.y, dz = n1.z - n2.z;
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 46) {
          var mx = (n1.x + n2.x) / 2 + (Math.random() - 0.5) * 16,
              my = (n1.y + n2.y) / 2 + (Math.random() - 0.5) * 16,
              mz = (n1.z + n2.z) / 2 + (Math.random() - 0.5) * 16;
          var sprout = null;
          if (Math.random() > 0.5) sprout = { x: mx + (Math.random() - 0.5) * 18, y: my + (Math.random() - 0.5) * 18, z: mz + (Math.random() - 0.5) * 18 };
          synapses.push({ from: i, to: j, cx: mx, cy: my, cz: mz, sprout: sprout });
          c++;
        }
      }
    }

    var sigCount = Math.round(190 * intensity);
    for (i = 0; i < sigCount; i++) signals.push({ idx: Math.floor(Math.random() * synapses.length), p: Math.random(), speed: 0.014 + Math.random() * 0.022 });

    var outIdx = 0, best = -1e9;
    for (i = 0; i < nodes.length; i++) { var sc = -nodes[i].z - nodes[i].x * 0.4; if (nodes[i].type === 'cerebrum' && sc > best) { best = sc; outIdx = i; } }
    var oc = nodes[outIdx], outZone = [];
    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].type !== 'cerebrum') continue;
      var ox = nodes[i].x - oc.x, oy = nodes[i].y - oc.y, oz = nodes[i].z - oc.z;
      if (ox * ox + oy * oy + oz * oz < 78 * 78) outZone.push(i);
    }

    var adj = nodes.map(function () { return []; });
    synapses.forEach(function (s, k) { adj[s.from].push({ syn: k, other: s.to, fwd: true }); adj[s.to].push({ syn: k, other: s.from, fwd: false }); });

    this.nodes = nodes; this.synapses = synapses; this.signals = signals;
    this.outIdx = outIdx; this.outZone = outZone; this.adj = adj;
    this.bursts = []; this.firings = [];
    this.metrics.synapseCount = synapses.length;
  };

  /* -------- 3D -------- */
  NeuralCore.prototype.rot = function (x, y, z, rx, ry) {
    var x1 = x, y1 = y, z1 = z, c, s, t1, t2;
    if (rx) { c = Math.cos(rx); s = Math.sin(rx); t1 = y1 * c - z1 * s; t2 = y1 * s + z1 * c; y1 = t1; z1 = t2; }
    if (ry) { c = Math.cos(ry); s = Math.sin(ry); t1 = x1 * c - z1 * s; t2 = x1 * s + z1 * c; x1 = t1; z1 = t2; }
    return { x: x1, y: y1, z: z1 };
  };
  NeuralCore.prototype.proj = function (x, y, z) {
    var fov = 450, scale = fov / (fov + z), v = this.viewScale;
    return { x: x * scale * v + this.cx, y: y * scale * v + this.cy, scale: scale * v, depth: z };
  };

  NeuralCore.prototype.resize = function () {
    if (!this.canvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = this.canvas.clientWidth || this.canvas.parentNode && this.canvas.parentNode.clientWidth || window.innerWidth;
    var h = this.canvas.clientHeight || this.canvas.parentNode && this.canvas.parentNode.clientHeight || window.innerHeight;
    this.canvas.width = w * dpr; this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cssW = w; this.cssH = h; this.cx = w / 2; this.cy = h / 2 - 8;
    this.viewScale = Math.max(0.55, Math.min(1.45, Math.min(w, h) / 580));
  };

  /* -------- lifecycle -------- */
  NeuralCore.prototype.start = function () {
    if (this._running) return;
    var base = this.hexToHsl(this.accentColor);
    this.baseHue = base.h; this.baseSat = Math.max(60, base.s);
    this.cur = { a: 0.20, t: 0.10 };
    this.frame = 0; this._spriteHue = null;
    var now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    this._lastT = now; this._lastCycle = now; this._spawnAcc = 0; this._hudAcc = 0;
    this.build();
    this.resize();
    window.addEventListener('resize', this._boundResize);
    this._running = true;
    var self = this;
    var loop = function () { self.draw(); self._raf = requestAnimationFrame(loop); };
    this._raf = requestAnimationFrame(loop);
  };
  NeuralCore.prototype.stop = function () {
    this._running = false;
    cancelAnimationFrame(this._raf);
    window.removeEventListener('resize', this._boundResize);
  };

  /* -------- the frame -------- */
  NeuralCore.prototype.draw = function () {
    var ctx = this.ctx; if (!ctx) return;
    var now = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    var dt = (now - (this._lastT || now)) / 16.667;
    this._lastT = now;
    if (!(dt > 0)) dt = 1;
    if (dt > 3) dt = 3;                 // clamp tab-switch gaps so nothing teleports
    this.frame += dt; var f = this.frame;

    if (this.autoCycle && now - this._lastCycle > 3800) {
      var seq = ['idle', 'thinking', 'working', 'writing'];
      this.setMode(seq[(seq.indexOf(this.mode) + 1) % seq.length]); this._lastCycle = now;
    }

    this._energy *= Math.pow(0.965, dt); if (this._energy < 0.002) this._energy = 0;
    var energy = this._energy, mode = this.mode, tgt = this.targetFor(mode);
    var aT = Math.min(1, tgt.a + energy * 0.45);
    var tT = Math.min(1, tgt.t + (mode === 'writing' ? energy * 0.25 : 0));
    this.cur.a += (aT - this.cur.a) * this.smooth(0.045, dt);
    this.cur.t += (tT - this.cur.t) * this.smooth(0.045, dt);
    var A = this.cur.a, T = this.cur.t;

    var glow = 8 + A * 30;
    var pulseRate = (0.03 + A * 0.13) * tgt.pulse;
    var sigSpeed = 0.7 + A * 3.6;

    var hue = this.baseHue + (188 - this.baseHue) * Math.min(1, T * 0.6);
    var sat = Math.min(100, this.baseSat + T * 8);
    var lineL = 52, nodeL = 56 + A * 8, coreL = 70 + A * 12;

    var hk = Math.round(hue) + '|' + Math.round(sat);
    if (hk !== this._spriteHue) {
      this._spriteHue = hk;
      this._coreSprite = this.glowSprite(hue, sat, 72, true);
      this._haloSprite = this.glowSprite(hue, sat, 62, false);
    }

    ctx.clearRect(0, 0, this.cssW, this.cssH);
    ctx.globalCompositeOperation = 'screen';

    var rotY = Math.sin(f * 0.003) * 0.13, rotX = 0.15 + Math.cos(f * 0.002) * 0.05, osc = 1 + Math.sin(f * 0.015) * 0.01;
    var cx = this.cx, cy = this.cy, R = 170 * this.viewScale, a, ring;

    /* reticle rings */
    ctx.save(); ctx.lineWidth = 1;
    for (ring = 0; ring < 3; ring++) {
      var rr = R * (1.15 + ring * 0.16), sp = (f * 0.004 * (ring % 2 ? -1 : 1)) + ring;
      ctx.strokeStyle = this.hsl(hue, sat, 48, 0.12 + A * 0.12); ctx.beginPath();
      for (a = 0; a < Math.PI * 2; a += 0.04) {
        if (Math.sin(a * 6 + ring * 2) > 0.4) continue;
        var x = cx + Math.cos(a + sp) * rr, y = cy + Math.sin(a + sp) * rr * 0.96;
        ctx.moveTo(x, y); ctx.lineTo(cx + Math.cos(a + sp + 0.02) * rr, cy + Math.sin(a + sp + 0.02) * rr * 0.96);
      }
      ctx.stroke();
    }
    ctx.strokeStyle = this.hsl(hue, sat, 55, 0.22 + A * 0.2);
    for (a = 0; a < Math.PI * 2; a += Math.PI / 24) {
      var r1 = R * 1.5, r2 = R * 1.56, an = a + f * 0.001;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * r1, cy + Math.sin(an) * r1 * 0.96);
      ctx.lineTo(cx + Math.cos(an) * r2, cy + Math.sin(an) * r2 * 0.96); ctx.stroke();
    }
    ctx.restore();

    /* project nodes */
    var self = this;
    var PN = this.nodes.map(function (n) {
      var r = self.rot(n.x * osc, n.y * osc, n.z * osc, rotX, rotY);
      var p = self.proj(r.x, r.y, r.z);
      var pulse = Math.sin(f * pulseRate + n.off) * 0.5 + 0.5;
      if (mode === 'working') { var sweep = Math.pow(Math.max(0, Math.sin(n.y * 0.018 - f * 0.045)), 3); pulse = Math.min(1, pulse * 0.5 + sweep * 0.9); }
      if (n.flare > 0) { pulse = Math.min(1, pulse + n.flare); n.flare *= Math.pow(0.92, dt); }
      p.o = n; p.pulse = pulse; return p;
    });
    var PC = [], PS = [];
    this.synapses.forEach(function (s) {
      var r = self.rot(s.cx * osc, s.cy * osc, s.cz * osc, rotX, rotY); PC.push(self.proj(r.x, r.y, r.z));
      if (s.sprout) { var q = self.rot(s.sprout.x * osc, s.sprout.y * osc, s.sprout.z * osc, rotX, rotY); PS.push(self.proj(q.x, q.y, q.z)); } else PS.push(null);
    });

    /* core */
    var coreR = (34 + Math.sin(f * 0.03) * 2 + A * 16) * this.viewScale;
    var cg = ctx.createRadialGradient(cx, cy, 2, cx, cy, coreR);
    cg.addColorStop(0, 'rgba(255,255,255,1)');
    cg.addColorStop(0.18, this.hsl(hue, 100, coreL, 0.95));
    cg.addColorStop(0.6, this.hsl(hue, sat, 52, 0.28));
    cg.addColorStop(1, this.hsl(hue, sat, 50, 0));
    ctx.save(); ctx.shadowBlur = glow * 1.6; ctx.shadowColor = this.hsl(hue, 100, 55, 0.85);
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(cx, cy, coreR, 0, Math.PI * 2); ctx.fill(); ctx.restore();

    /* dendrite paths */
    ctx.lineWidth = 0.45;
    this.synapses.forEach(function (s, i) {
      var n1 = PN[s.from], n2 = PN[s.to], c = PC[i], sp = PS[i];
      var ap = (n1.pulse + n2.pulse) / 2, alpha = (0.04 + ap * 0.13) * (0.3 + A * 0.7);
      ctx.strokeStyle = self.hsl(hue, sat, lineL, alpha);
      ctx.beginPath(); ctx.moveTo(n1.x, n1.y); ctx.quadraticCurveTo(c.x, c.y, n2.x, n2.y); ctx.stroke();
      if (sp) {
        ctx.strokeStyle = self.hsl(hue, sat, lineL, alpha * 0.6);
        ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.quadraticCurveTo(sp.x, sp.y, sp.x + (sp.x - c.x) * 0.2, sp.y + (sp.y - c.y) * 0.2); ctx.stroke();
      }
    });

    /* traveling signals — fade in / glide / fade out */
    this.signals.forEach(function (sig) {
      sig.p += sig.speed * sigSpeed * dt;
      if (sig.p >= 1) { sig.p -= 1; sig.idx = Math.floor(Math.random() * self.synapses.length); }
      var s = self.synapses[sig.idx], p0 = PN[s.from], p1 = PC[sig.idx], p2 = PN[s.to];
      var t = sig.p, mt = 1 - t;
      var x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
      var y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;
      var scl = mt * mt * p0.scale + 2 * mt * t * p1.scale + t * t * p2.scale;
      var env = Math.sin(t * Math.PI), e2 = env * env;
      self.blit(self._haloSprite, x, y, (2.6 + A * 1.4) * scl, 0.45 * e2);
      self.blit(self._coreSprite, x, y, 1.5 * scl, 0.95 * e2);
    });

    /* steady ignition rate */
    this._propProb = 0.42 + A * 0.30;
    var ignRate = 0.6 + A * 1.1;
    this._spawnAcc += ignRate * dt;
    var spawns = 0;
    while (this._spawnAcc >= 1 && spawns < 14) { this.ignite(Math.floor(Math.random() * this.nodes.length), 0.7 + Math.random() * 0.4, 0); this._spawnAcc -= 1; spawns++; }

    /* spikes racing along fibers */
    if (this.firings.length > 1600) this.firings.splice(0, this.firings.length - 1600);
    this.firings = this.firings.filter(function (fp) {
      fp.t += fp.speed * dt;
      var s = self.synapses[fp.syn], p0 = PN[s.from], p1 = PC[fp.syn], p2 = PN[s.to];
      var u = fp.fwd ? Math.min(1, fp.t) : 1 - Math.min(1, fp.t), mu = 1 - u;
      var x = mu * mu * p0.x + 2 * mu * u * p1.x + u * u * p2.x;
      var y = mu * mu * p0.y + 2 * mu * u * p1.y + u * u * p2.y;
      var scl = mu * mu * p0.scale + 2 * mu * u * p1.scale + u * u * p2.scale;
      fp.trail.push({ x: x, y: y }); if (fp.trail.length > 10) fp.trail.shift();
      var tn = fp.trail.length, i;
      if (tn > 1) {
        ctx.save(); ctx.lineCap = 'round';
        for (i = 1; i < tn; i++) {
          ctx.strokeStyle = self.hsl(hue, 100, 66, (i / tn) * fp.strength * 0.85);
          ctx.lineWidth = (0.4 + (i / tn) * 1.1) * scl;
          ctx.beginPath(); ctx.moveTo(fp.trail[i - 1].x, fp.trail[i - 1].y); ctx.lineTo(fp.trail[i].x, fp.trail[i].y); ctx.stroke();
        }
        ctx.restore();
      }
      var headEnv = Math.min(1, fp.t * 5) * Math.min(1, (1 - fp.t) * 5);
      var ha = Math.min(1, fp.strength + 0.25) * headEnv;
      self.blit(self._haloSprite, x, y, (1.8 + fp.strength * 1.6) * scl, ha * 0.6);
      self.blit(self._coreSprite, x, y, (0.9 + fp.strength * 0.9) * scl, ha);
      if (fp.t >= 1) { self.ignite(fp.target, fp.strength, fp.depth); return false; }
      return true;
    });

    /* thinking bursts */
    if (mode === 'thinking' && Math.random() < (0.12 + A * 0.2) * dt) {
      var bn = PN[Math.floor(Math.random() * PN.length)];
      bn.o.flare = 1; this.bursts.push({ x: bn.x, y: bn.y, r: 2, max: 26 + Math.random() * 30 });
    }
    this.bursts = this.bursts.filter(function (b) {
      b.r += 1.4 * dt; var aa = Math.max(0, 1 - b.r / b.max); if (aa <= 0) return false;
      ctx.save(); ctx.strokeStyle = self.hsl(hue, sat, 60, aa * 0.7); ctx.lineWidth = 1.4;
      ctx.shadowColor = self.hsl(hue, 100, 55, aa); ctx.shadowBlur = glow;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
      return true;
    });

    /* writing: cascade converges across the output region */
    var writingPower = (mode === 'writing' ? 1 : 0) + energy;
    if (writingPower > 0.05 && this.outZone && this.outZone.length) {
      var seeds = 1 + Math.floor(writingPower * 2.5), i;
      for (i = 0; i < seeds; i++) {
        if (Math.random() < writingPower * dt) this.ignite(this.outZone[Math.floor(Math.random() * this.outZone.length)], 0.65 + Math.random() * 0.4, 2);
      }
      var gx = 0, gy = 0;
      for (i = 0; i < this.outZone.length; i++) { gx += PN[this.outZone[i]].x; gy += PN[this.outZone[i]].y; }
      gx /= this.outZone.length; gy /= this.outZone.length;
      this.blit(this._coreSprite, gx, gy, (46 + writingPower * 34) * this.viewScale, Math.min(0.42, writingPower * 0.42));
    }

    /* nodes — each dot softly fades in / out with its pulse */
    PN.forEach(function (node) {
      var size = node.o.size * node.scale * (1 + node.pulse * 0.5);
      var alpha = node.scale * 0.30 + node.pulse * 0.55;
      if (node.pulse > 0.5) self.blit(self._haloSprite, node.x, node.y, size * 3.4, (node.pulse - 0.5) * 0.55);
      self.blit(self._coreSprite, node.x, node.y, size * 1.8, alpha);
    });

    /* metrics, paced by real time */
    this._hudAcc += dt;
    if (this._hudAcc >= 8) {
      this._hudAcc = 0;
      var jit = function () { return Math.random() - 0.5; };
      var lp = Math.max(0, Math.min(100, Math.round(A * 100 + jit() * 3)));
      this.metrics.loadPct = lp;
      this.metrics.flux = Math.max(0, Math.round(A * 620 + 60 + jit() * 30));
      this.metrics.coreTemp = Math.round(308 + T * 250 + jit() * 4);
      if (typeof this.onMetrics === 'function') this.onMetrics(this.metrics);
    }
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = NeuralCore;
  global.NeuralCore = NeuralCore;
})(typeof window !== 'undefined' ? window : this);
