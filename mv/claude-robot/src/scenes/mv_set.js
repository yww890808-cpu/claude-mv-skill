// mv_set.js: the shared world, cast and props for the MV. Chapter files (mv_a/b/c.js) only read from MV.
// Everything is a pure function of t. Song beats: B(n) = OFF + n * BEAT (70.3 BPM, OFF 0.43 s):
//   B(6)=5.55 B(7)=6.40 B(12)=10.67 B(20)=17.50 B(28)=24.33 B(30)=26.04 B(31)=26.89 B(32)=27.74 B(33)=28.59
//   B(38)=32.86 B(39)=33.72 B(40)=34.57 B(41)=35.42 B(50)=43.11 B(56)=48.23 B(62)=53.35
const MV = (() => {
  const B = n => OFF + n * BEAT;
  // the blue co-star: same model as Clawd, recoloured
  const BLUE = { col: '#5E93D6', dk: '#3A62A6', lt: '#A9CBF0' };
  const HEART = '#E2476E', HEARTLT = '#F59AB0';

  // ---- the cast ----
  // me(): the orange lead. you(): the blue co-star. Pass emotions(..., { base: BLUE }) for the blue one's mood changes.
  const me = (x, y, u, o = {}) => clawd(x, y, u, o);
  const you = (x, y, u, o = {}) => clawd(x, y, u, { ...BLUE, ...o, ...(o.col ? {} : BLUE) });

  // ---- sky: horizontal washes from top colour to bottom colour, in screen space, plus a soft watercolour bloom ----
  function sky(top, bot, bloom = null, key = 'sky') {
    boilSeed(key);
    const n = 10;
    for (let i = 0; i < n; i++) {
      const y0 = -80 + i * (H + 160) / n;
      paint(rectPts(-120, y0 - 30, W + 240, (H + 160) / n + 60, 6), { wash: mixCol(top, bot, i / (n - 1)), washOp: 255, ink: null });
    }
    // (no bloom: big watercolour fills are slow to render and the bands already read as a painted sky)
  }
  // twinkling stars (screen space unless a camera is active); a = 0..1 fade
  function stars(t, n = 40, a = 1, seed = 1, area = [0, 0, W, H * .7], sz = 1) {
    if (a <= .02) return;
    boilSeed('stars' + seed);
    for (let i = 0; i < n; i++) {
      const x = area[0] + hash(i * 3.1 + seed) * area[2], y = area[1] + hash(i * 7.3 + seed * 2) * area[3];
      const tw = .6 + .4 * Math.sin(t * (1.5 + hash(i) * 2) + i), r = (5 + 9 * hash(i * 1.7 + seed)) * tw * sz * a;
      if (hash(i * 5.5) > .75) glow(x, y, r * 4, '#FFE7B0', .5 * a);
      paint(starPts(x, y, r, .36, 4), { wash: '#FFF1CF', washOp: 255 * a, ink: null });
    }
  }
  // the little planet: a big disc whose top is the ground. Returns helpers to stand things on its surface.
  function planet(cx, top, R, col = '#7FA65E', dk = '#5E8446', key = 'planet') {
    boilSeed(key);
    const cy = top + R;
    paint(ellPts(cx, cy, R, R, 90, 2), { wash: col, washOp: 255, ink: PAL.ink, sw: 1.2 });
    paint(ellPts(cx, cy + R * .1, R * .93, R * .9, 60, 3), { wash: dk, washOp: 60, ink: null });
    // grass tufts on the rim, fixed positions
    for (let i = 0; i < 26; i++) {
      const a = -Math.PI / 2 + (hash(i * 2.3 + R) - .5) * 1.6, r = R - 2;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, s = 8 + 10 * hash(i);
      inkLine([[x - s * .5, y + 2], [x - s * .2, y - s], [x, y + 2], [x + s * .3, y - s * .8], [x + s * .5, y + 2]], .6, dk, 'inkfine', .3);
    }
    return surf(cx, cy, R);
  }
  // standing point and lean on a planet surface at screen-x x
  const surf = (cx, cy, R) => x => { const dx = clamp(x - cx, -R + 1, R - 1); return { x, y: cy - Math.sqrt(R * R - dx * dx), rot: Math.asin(dx / R) }; };

  // a puffy cloud outline: bumps on top, flatter underneath
  function cloudPts(cx, cy, w, h, n = 30, seed = 0) {
    const p = [];
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, up = Math.sin(a) < 0;
      const bump = up ? 1 + .22 * Math.abs(Math.sin(a * 3 + seed)) : .78;
      p.push([cx + Math.cos(a) * w * bump, cy + Math.sin(a) * h * bump]);
    }
    return p;
  }
  // a little grey rain cloud (= sadness in this video), with falling drops
  function rainCloud(x, y, s, t, a = 1, key = 'rc') {
    if (a <= .02) return;
    boilSeed(key);
    for (let i = 0; i < 4; i++) {
      const ph = frac(t * 1.6 + i / 4), dx = (i - 1.5) * s * .5;
      paint(P2([[dx, s * .4 + ph * s * 1.4], [dx + s * .07, s * .55 + ph * s * 1.4], [dx, s * .62 + ph * s * 1.4], [dx - s * .07, s * .55 + ph * s * 1.4]], x, y), { wash: PAL.sky, washOp: 255 * a * (1 - ph), ink: null });
    }
    paint(cloudPts(x, y, s, s * .45, 26, 1), { wash: '#8C8FA6', washOp: 255 * a, fill: '#6D7088', fillOp: 70 * a, bleed: .1, tex: .4, ink: a > .5 ? PAL.ink : null, sw: .8 });
  }
  const P2 = (pts, x, y) => pts.map(([a, b]) => [x + a, y + b]);

  function heart(x, y, r, col = HEART, o = {}) {
    paint(heartPts(x, y, r), { wash: col, washOp: o.op ?? 255, fill: o.fill ?? HEARTLT, fillOp: 60, bleed: .05, ink: o.ink === null ? null : PAL.ink, sw: o.sw ?? clamp(r / 30, .4, 1.2) });
  }

  function sun(x, y, r, a = 1) {
    boilSeed('sun');
    glow(x, y, r * 4, '#FFC766', a);
    paint(ellPts(x, y, r, r, 28, 1), { wash: '#FFD36B', washOp: 255 * a, fill: '#FFB347', fillOp: 70 * a, bleed: .05, ink: null });
  }
  function moon(x, y, r, a = 1, bg = '#2A3270') {
    boilSeed('moon');
    glow(x, y, r * 3, '#FFF1C8', .6 * a);
    paint(ellPts(x, y, r, r, 26, 1), { wash: '#FBEFC8', washOp: 255 * a, ink: null });
    paint(ellPts(x + r * .45, y - r * .25, r * .85, r * .85, 26, 1), { wash: bg, washOp: 255 * a, ink: null });   // crescent bite
  }

  // a shooting star from p0 to p1 between t0 and t1 (a wish), with a fading tail
  function shootingStar(t, t0, t1, p0, p1, key = 'shoot') {
    if (t < t0 || t > t1 + .4) return;
    boilSeed(key);
    const k = ease(seg(t, t0, t1)), head = [lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k)], fade = 1 - seg(t, t1, t1 + .4);
    const tk = Math.max(0, k - .22), tail = [lerp(p0[0], p1[0], tk), lerp(p0[1], p1[1], tk)];
    glow(head[0], head[1], 70, '#FFE9A8', fade);
    paint(ribbon([tail, [lerp(tail[0], head[0], .6), lerp(tail[1], head[1], .6)], head], 2, 16), { wash: '#FFF1CF', washOp: 230 * fade, ink: null });
    paint(starPts(head[0], head[1], 18, .4, 4, t * 3), { wash: '#FFF6DA', washOp: 255 * fade, ink: null });
  }

  // the glass jar of joy: n little hearts inside, glowing brighter as it fills. (x, y) = bottom centre; s = height.
  function jar(x, y, s, n, t, key = 'jar') {
    boilSeed(key);
    const w = s * .78, gl = clamp(n / 6);
    if (gl > 0) glow(x, y - s * .45, s * (1 + gl), '#FFB4C6', .35 + .5 * gl);
    paint(rrPts(x - w / 2, y - s, w, s, s * .18), { wash: '#DDEFF2', washOp: 120, ink: PAL.ink, sw: .9 });
    for (let i = 0; i < n; i++) {
      const hx = x + (hash(i * 3.3) - .5) * w * .55, hy = y - s * .2 - (i % 3) * s * .18 - Math.floor(i / 3) * s * .12;
      heart(hx, hy + Math.sin(t * 3 + i) * 2, s * .12, HEART, { sw: .5 });
    }
    paint(rectPts(x - w * .44, y - s * 1.08, w * .88, s * .14, 1), { wash: '#C9A57A', ink: PAL.ink, sw: .8 });   // the lid rim
    inkLine([[x - w * .3, y - s * .8], [x - w * .32, y - s * .3]], .7, '#FFFFFF', 'inkfine', .3);              // glass glint
  }

  // a firework that bursts in the shape of a heart: age 0 → 1.2 s; r = size; col = colour
  function heartFirework(x, y, r, age, col, key = 'fw', freeze = null) {
    if (age < 0 || age > 1.6) return;
    boilSeed(key);
    const k = easeOut(seg(age, 0, .45)), fade = 1 - seg(age, .7, 1.4), droop = 40 * Math.pow(Math.max(0, age - .4), 2);
    if (age < .12) { glow(x, y + 60 * (1 - age / .12), 40, col, 1); return; }   // the rising spark
    glow(x, y, r * 1.8 * k, col, .8 * fade);
    const n = 26;
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, hx = 16 * Math.pow(Math.sin(a), 3), hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
      const px = x + hx / 16 * r * k, py = y + hy / 16 * r * k + droop;
      const ix = x + hx / 16 * r * k * .78, iy = y + hy / 16 * r * k * .78 + droop * .8;
      if (fade > .05) inkLine([[ix, iy], [px, py]], 1.6 * fade, col, 'ink', 0);
      paint(starPts(px, py, 7 * fade + 2, .4, 4), { wash: '#FFF3D6', washOp: 255 * fade, ink: null });
    }
  }

  // the stack of toy blocks (shot 2)
  const BLOCKC = ['#F2D7A6', '#7FB7C9', '#E8A0A8', '#E8AA38'];
  function block(x, y, s, i, rot = 0) {
    push(); translate(x, y); rotate(rot);
    paint(rectPts(-s / 2, -s / 2, s, s, 1.5), { wash: BLOCKC[i % 4], washOp: 255, fill: mixCol(BLOCKC[i % 4], PAL.ink, .25), fillOp: 50, tex: .5, ink: PAL.ink, sw: .9 });
    paint(ellPts(-s * .15, -s * .15, s * .12, s * .12, 10), { wash: PAL.cream, washOp: 160, ink: null });
    pop();
  }

  // rain: diagonal streaks, positions fixed by hash, falling with t
  function rain(t, a = 1, n = 70, key = 'rain') {
    if (a <= .02) return;
    boilSeed(key);
    for (let i = 0; i < n; i++) {
      const x0 = hash(i * 1.9) * (W + 300) - 150, sp = 900 + 400 * hash(i * 4.1), y = ((hash(i * 2.7) * (H + 200) + t * sp) % (H + 200)) - 100;
      const x = x0 - (y + 100) * .18;
      inkLine([[x, y], [x - 9, y + 46]], .7, mixCol('#C8D2E6', PAL.ink, .2), 'inkfine', 0);
    }
  }

  // a flaming heart (shot 16): flames are flickering ribbons above it, with heat glow
  function flameHeart(x, y, r, t, heat = 1, key = 'fh') {
    boilSeed(key);
    glow(x, y, r * 4 * (.7 + .3 * heat), '#FF9A4A', .9 * heat);
    for (let i = 0; i < 5; i++) {
      const fx = x + (i - 2) * r * .32, h = r * (1.1 + .5 * hash(i)) * (1 + .18 * Math.sin(t * 11 + i * 2)) * heat;
      const sway = Math.sin(t * 7 + i) * r * .15;
      paint(ribbon([[fx, y - r * .2], [fx + sway * .5, y - r * .2 - h * .5], [fx + sway, y - r * .2 - h]], r * .42, 2), { wash: i % 2 ? '#FFB347' : '#FF7A3D', washOp: 230 * heat, ink: null });
    }
    heart(x, y + r * .1, r, '#E03C4F', { fill: '#FF8A5B' });
  }

  // a sea from the horizon down, with gold glitter on the sun's path
  function sea(t, hy, sunX, key = 'sea') {
    boilSeed(key);
    paint(rectPts(-200, hy, W + 400, H - hy + 300, 0), { wash: '#3F8FA8', washOp: 255, ink: null });
    paint(rectPts(-200, hy + 120, W + 400, H, 4), { fill: '#2E6F8E', fillOp: 90, bleed: .1, tex: .5, ink: null });
    for (let i = 0; i < 46; i++) {
      const d = hash(i * 2.2), y = hy + 10 + d * d * (H - hy), x = sunX + (hash(i * 5.1) - .5) * (120 + d * 900) + Math.sin(t * 1.4 + i) * 12;
      const w = 18 + d * 70, sh = .5 + .5 * Math.sin(t * 3 + i * 1.7);
      inkLine([[x - w / 2, y], [x + w / 2, y]], .5 + d, mixCol('#FFE3A0', '#FFFFFF', sh * .4), 'inkfine', 0);
    }
    for (let i = 0; i < 14; i++) {   // soft wave lines across the whole sea
      const d = hash(i * 9.7), y = hy + 30 + d * d * (H - hy), x = hash(i * 3.9) * W;
      inkLine([[x - 60, y], [x - 30, y - 6], [x, y], [x + 30, y - 6], [x + 60, y]], .5, '#BFE3EA', 'inkfine', .5);
    }
  }

  // a big leaf used as an umbrella (shot 6): stem from (sx, sy) up to the canopy
  function leafUmbrella(sx, sy, cx, cy, w) {
    boilSeed('leaf');
    inkLine([[sx, sy], [lerp(sx, cx, .5) + 6, lerp(sy, cy, .5)], [cx, cy]], 1.4, '#4F6E36', 'ink', .4);
    const pts = [];
    for (let i = 0; i <= 20; i++) { const k = i / 20, x = cx - w / 2 + w * k; pts.push([x, cy - Math.sin(k * Math.PI) * w * .28]); }
    for (let i = 20; i >= 0; i--) { const k = i / 20, x = cx - w / 2 + w * k; pts.push([x, cy + 6 - Math.sin(k * Math.PI) * w * .1 + Math.sin(k * 18) * 4]); }
    paint(pts, { wash: '#6FA552', washOp: 255, fill: '#4F8A3A', fillOp: 80, tex: .5, ink: PAL.ink, sw: 1 });
    inkLine([[cx - w * .45, cy - 4], [cx, cy - w * .22], [cx + w * .45, cy - 4]], .7, '#3E6A2A', 'inkfine', .5);
  }

  return { B, BLUE, HEART, HEARTLT, me, you, sky, stars, planet, surf, cloudPts, rainCloud, heart, sun, moon, shootingStar, jar, heartFirework, block, rain, flameHeart, sea, leafUmbrella };
})();
