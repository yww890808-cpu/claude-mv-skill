// mv_b.js: shots 7–12 (22.19 – 38.84 s). See STORYBOARD.md for the reads.
(() => {
  const { B, BLUE, me, you } = MV;
  const GREY = ['#767B90', '#A9ADB9'], BRIGHT = ['#9FD3EE', '#FCE9C4'], NIGHT = ['#141A44', '#3A3F7A'];

  // ---------- 7 · 22.19–25.39 · 你让我学会如何拨开阴霾 ----------
  // Under a ceiling of dark clouds, you raise your arms and shove the clouds over you off to the right: blue sky. I tilt my
  // head (?), then copy you and shove mine off to the left (拨开阴霾); the sun pours in and I light up.
  function darkClouds(t, dx, side, key) {
    boilSeed(key);
    const xs = side < 0 ? [140, 420, 700, 900] : [1020, 1260, 1520, 1780];
    xs.forEach((x, i) => { boilSeed(key + 'hi' + i); paint(MV.cloudPts(x + 120 + dx * 1.1, 90, 260, 120, 26, i * 3 + side), { wash: '#7A7D92', washOp: 255, ink: null }); });
    boilSeed(key);
    xs.forEach((x, i) => {
      const y = 300 + (i % 2) * 70 + hash(i + side) * 30;
      paint(MV.cloudPts(x + dx, y, 240, 125, 30, i + side), { wash: i % 2 ? '#5D6075' : '#6B6E84', washOp: 255, fill: '#4A4C5E', fillOp: 60, bleed: .1, ink: PAL.ink, sw: .8 });
    });
  }
  function s7(t, lt, dur) {
    const k1 = easeIn(seg(t, 22.55, 23.35)), k2 = easeIn(seg(t, B(28), B(28) + .6)), clear = (k1 + k2) / 2;
    MV.sky(mixCol(GREY[0], '#7FC0E8', clear), mixCol(GREY[1], '#DCEFF5', clear));
    camBegin(960, 540, .96);
    if (k1 > .05) MV.sun(1560, 200, 80, Math.max(k1 * .6, k2));
    MV.rain(t, 1 - clear * 1.3, 80, 'rain7');
    darkClouds(t, -1300 * k2, -1, 'cl');
    darkClouds(t, 1300 * k1, 1, 'cr');
    const g = MV.planet(960, 840, 1300, mixCol('#7E8C72', '#86B35E', clear), mixCol('#5F6B56', '#5E8446', clear));
    // you: arms up, shove (stretch up) at 22.6, then happy in the sunlight
    const bs = g(1150), shove1 = take(t, 22.62, 1.1);
    const bm = emotions(t, [[0, 'determined', { aL: 1.45, aR: 1.45, lookY: -1 }], [23.45, 'happy', { lookX: -.8 }]], { base: BLUE });
    you(bs.x, bs.y, 27, { ...bm, rot: bs.rot, sq: bm.sq + shove1.sq, dy: bm.dy + shove1.dy, seed: 2 });
    const ms = g(770), shove2 = take(t, B(28), 1.1);
    const mm = emotions(t, [[0, 'neutral', { lookX: .9, lookY: -.6 }], [23.35, 'confused', { lookX: .8 }], [23.95, 'determined', { aL: 1.45, aR: 1.45, lookY: -1 }], [24.75, 'happy', { emote: 'spark' }]]);
    me(ms.x, ms.y, 27, { ...mm, rot: ms.rot, sq: mm.sq + shove2.sq, dy: mm.dy + shove2.dy });
    if (clear > .3) glow(960, 300, 900, '#FFE2A0', .3 * clear);
    camEnd();
  }

  // ---------- 8 · 25.39–26.68 · 将快乐全部收集 ----------
  // Sunny. Little hearts float in the air; hugging my jar, I hop on the beat and catch them in it one by one (收集快乐);
  // the jar glows brighter.
  const FLOAT = [[700, 430], [1240, 380], [880, 300], [1080, 470], [560, 560], [1380, 560], [960, 250]];
  // each catch: [heart index, time it flies into the jar]
  const CATCH = [[3, 25.72], [2, 25.86], [1, 26.24], [0, 26.36]];
  function jarTop(t, x, y, u, dyU) { return [x, y + dyU * u - 5.8 * u]; }
  function s8(t, lt, dur) {
    MV.sky(...BRIGHT);
    camBegin(960, 540, 1.02);
    MV.sun(1650, 170, 70);
    const g = MV.planet(960, 860, 1300, '#8DBA62', '#5E8446');
    const s = g(960), u = 26;
    const j1 = jump(t, 25.5, 25.95, 3), j2 = jump(t, 26.05, 26.5, 3), hop = { dy: j1.dy + j2.dy, sq: j1.sq + j2.sq };
    const mm = feel('excited', t, { aL: -.55 + .15 * Math.sin(t * 12), aR: -.55 - .15 * Math.sin(t * 12), lookY: -.8 });
    let n = 1;
    // floating hearts, and the ones flying into the jar
    FLOAT.forEach(([hx, hy], i) => {
      const c = CATCH.find(q => q[0] === i), bob = Math.sin(t * 2.4 + i * 1.3) * 12;
      boilSeed('fh' + i);
      if (!c) { MV.heart(hx, hy + bob, 38); return; }
      if (t >= c[1]) { n++; return; }
      const k = seg(t, c[1] - .25, c[1]), top = jarTop(t, s.x, s.y, u, hop.dy + mm.dy);
      const p = arcPt([hx, hy + bob], top, -60, easeIn(k));
      MV.heart(p[0], p[1], 38 * (1 - .5 * k));
    });
    me(s.x, s.y, u, { ...mm, dy: mm.dy + hop.dy, sq: mm.sq + hop.sq, rot: s.rot, draw: (uu) => MV.jar(0, -.6 * uu, 5 * uu, n, t, 'jar8') });
    camEnd();
  }

  // ---------- 9 · 26.68–29.02 · 将不开心全部淘汰 ----------
  // Three grey rain clouds (the sadness from before) hang around me. I kick them off the planet one by one, on the beat
  // (淘汰): left, right, then a jumping kick; then I laugh.
  const KICKS = [[27.06, 600, -1], [B(32), 1290, 1], [28.4, 1470, 1]];
  function s9(t, lt, dur) {
    MV.sky(...BRIGHT);
    camBegin(960, 540, .98);
    MV.sun(1650, 170, 70);
    const g = MV.planet(960, 860, 1300, '#8DBA62', '#5E8446');
    MV.jar(400, g(400).y, 110, 5, t, 'jar9');
    // my path: to the left cloud, back right to the second, then hop at the third
    const x = t < 27.3 ? lerp(960, 720, ease(seg(t, 26.7, 27.0))) : lerp(720, 1200, ease(seg(t, 27.3, 27.62))) + 90 * ease(seg(t, 28.0, 28.3));
    const s = g(x), u = 26;
    const facingL = t < 27.25;
    const hop = jump(t, 28.1, 28.62, 4);
    let lunge = 0;
    KICKS.forEach(([kt]) => { lunge += Math.exp(-Math.pow((t - kt) / .09, 2)); });
    const mm = emotions(t, [[0, 'mischief'], [27.12, 'playful'], [28.65, 'laugh']]);
    // the clouds, then their flights off the planet
    KICKS.forEach(([kt, cx, dir], i) => {
      const cy = g(cx).y - (i === 2 ? 230 : 110);
      if (t < kt) { MV.rainCloud(cx + Math.sin(t * 2 + i) * 8, cy + Math.sin(t * 3 + i) * 6, 95, t, 1, 'kc' + i); return; }
      const k = seg(t, kt, kt + .55), p = arcPt([cx, cy], [cx + dir * 1100, cy - 420], 220, easeOut(k));
      if (k < 1) { push(); translate(p[0], p[1]); rotate(dir * k * 5); MV.rainCloud(0, 0, 95 * (1 - .6 * k), t, 1 - k * .5, 'kc' + i); pop(); }
      if (t - kt < .3) { boilSeed('pow' + i); emote('spark', cx - dir * 40, cy + 20, 26 * (1 - (t - kt) / .3) + 8, 1, t - kt); }
    });
    const view = facingL ? { view: 'q', flip: true } : t < 28.7 ? { view: 'q', flip: false } : { view: 'front' };
    me(s.x, s.y, u, { ...mm, ...view, rot: s.rot + (facingL ? -1 : 1) * .32 * lunge, dx: (facingL ? -1 : 1) * .7 * lunge, dy: mm.dy + hop.dy, sq: mm.sq + hop.sq });
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#1F2550', '#2F3C7A']);
  }

  // ---------- 10 · 29.02–31.37 · 你对我说的情话 ----------
  // Night, close. You lean in to my ear; little hearts and notes float from your mouth into my ear (情话, no words); I go
  // shy and pink.
  const NOTES = 9;
  function whisper(t, from, to, i) {
    const t0 = 29.6 + i * .17, k = seg(t, t0, t0 + .75);
    if (k <= 0 || k >= 1) return;
    const x = lerp(from[0], to[0], k), y = lerp(from[1], to[1], k) - Math.sin(k * Math.PI) * 50 + Math.sin(k * 9 + i) * 10;
    boilSeed('wh' + i);
    const s = 24 * (1 - .3 * k) * Math.min(1, k * 6);
    if (i % 3 === 1) emote('music', x, y, s * .75, 1, t);
    else MV.heart(x, y, s * 1.3);
  }
  function nightBase(t, cy, z, key = 'n') {
    MV.sky(...NIGHT);
    MV.stars(t, 50, 1, 21, [0, 0, W, H * .75]);
  }
  function s10(t, lt, dur) {
    nightBase(t);
    camBegin(960, 560, 1.02 + .04 * seg(lt, 0, dur));
    MV.moon(1600, 170, 55, 1, NIGHT[0]);
    const g = MV.planet(960, 900, 1300, '#3F5A50', '#2C4238');
    const u = 36, lean = ease(seg(t, 29.15, 29.6));
    const bs = g(1190), ms = g(730);
    const talking = t > 29.6 && t < 31.1, mouthNow = talking ? (Math.floor(t / .1065) % 2 ? 'o' : 'smile') : 'smile';
    const bm = emotions(t, [[0, 'happy', { lookX: -1 }]], { base: BLUE });
    you(bs.x, bs.y, u, { ...bm, mouth: mouthNow, view: 'q', flip: true, rot: bs.rot - .1 * lean, dx: -.9 * lean, seed: 2 });
    // from your mouth (3/4 view facing left) to my ear (my right edge)
    const from = [bs.x - .9 * lean * u - 2.4 * u, bs.y - 4.5 * u + 10], to = [ms.x + 5.2 * u, ms.y - 5.8 * u];
    for (let i = 0; i < NOTES; i++) whisper(t, from, to, i);
    const mm = emotions(t, [[0, 'neutral', { lookX: .8 }], [29.95, 'shy'], [30.75, 'shy', { emote: 'heart' }]]);
    me(ms.x, ms.y, u, { ...mm, view: 'q', rot: ms.rot });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, ['#1F2550', '#2F3C7A']);
  }

  // ---------- 11 · 31.37–35.42 · 像转瞬即逝的烟花 ----------
  // The camera follows a stream of hearts up into the night; they burst into heart-shaped fireworks (烟花), one after
  // another, and I stare up with starry eyes; they die out fast (转瞬即逝) and my smile goes.
  const FW = [[700, -150, 32.86, MV.HEART, 230], [1260, -240, 33.29, '#F6C14E', 260], [960, -390, B(39), '#F59AB0', 300], [520, -330, 34.14, '#7FD0C8', 200]];
  function s11(t, lt, dur) {
    nightBase(t);
    const k = ease(seg(t, 31.45, 32.7));
    const cy = lerp(560, 150, k), z = lerp(1.06, .66, k);
    camBegin(960, cy, z);
    MV.stars(t, 30, 1, 31, [-400, -900, W + 800, 1000], 1.4);
    MV.moon(1600, 170, 55, 1, NIGHT[0]);
    FW.forEach(([fx, fy, ft, col, r], i) => {
      // a heart rising from between us to where it bursts
      const rk = seg(t, 31.4 + i * .12, ft);
      if (rk > 0 && rk < 1) { boilSeed('rh' + i); const p = [lerp(965, fx, ease(rk)), lerp(620, fy, ease(rk)) + Math.sin(rk * 8 + i) * 14]; glow(p[0], p[1], 50, col, .7); MV.heart(p[0], p[1], 20); }
      MV.heartFirework(fx, fy, r, t - ft, col, 'fw' + i);
    });
    const g = MV.planet(960, 900, 1300, '#3F5A50', '#2C4238');
    const u = 36, bs = g(1190), ms = g(730);
    const bm = emotions(t, [[0, 'happy', { lookX: -1 }], [31.9, 'happy', { lookY: -1 }]], { base: BLUE });
    you(bs.x, bs.y, u, { ...bm, ...(t < 31.9 ? { view: 'q', flip: true } : turn(t, 31.9, 32.1, -.125, 0)), rot: bs.rot, seed: 2 });
    const mm = emotions(t, [[0, 'shy'], [32.05, 'hopeful', { lookY: -1 }], [32.95, 'starstruck', { lookY: -1 }], [34.55, 'neutral', { lookY: -1, lookX: 0 }]]);
    me(ms.x, ms.y, u, { ...mm, ...(t < 31.8 ? { view: 'q' } : turn(t, 31.8, 32.0, .125, 0)), rot: ms.rot });
    camEnd();
  }

  // ---------- 12 · 35.42–38.84 · 只停在绽放一刹那 ----------
  // Low and close: the biggest firework opens over me; at full bloom everything freezes (一刹那) while I reach for it;
  // then it crumbles into smoke and I'm sad. Out: a white flash.
  function s12(t, lt, dur) {
    const F0 = 36.3, F1 = 37.55, tf = t < F0 ? t : t < F1 ? F0 : F0 + (t - F1);   // frozen time
    const frozen = t >= F0 && t < F1;
    MV.sky('#10153A', '#33386E');
    MV.stars(tf, 50, 1, 41, [0, 0, W, H * .8]);
    camBegin(960, 560, 1 + .03 * seg(lt, 0, dur));
    // the big firework: blooms to full by the freeze, then fades and droops as smoke
    const age = tf < F0 ? (tf - B(41)) * (.6 / (F0 - B(41))) : .6 + (tf - F0) * 1.1;
    MV.heartFirework(1240, 330, 360, age, MV.HEART, 'big');
    if (t > F1) for (let i = 0; i < 10; i++) {   // smoke puffs where the sparks were
      const a = i / 10 * TAU, sk = seg(t, F1, F1 + 1.1), px = 1240 + Math.cos(a) * 300 * (.6 + .4 * sk), py = 330 + Math.sin(a) * 260 + 60 * sk;
      boilSeed('smk' + i);
      paint(MV.cloudPts(px, py, 40 + 40 * sk, 26 + 20 * sk, 18, i), { wash: '#6C6F88', washOp: 200 * (1 - sk), ink: null });
    }
    const g = MV.planet(860, 960, 1500, '#3F5A50', '#2C4238');
    const s = g(760);
    const mm = emotions(tf, [[0, 'starstruck', { lookX: .6, lookY: -1 }], [35.95, 'hopeful', { lookX: .7, lookY: -1, aR: 1.05, aL: .1 }], [36.5, 'sad', { lookX: .6, lookY: -.5, aR: -.4 }]]);
    me(s.x, s.y, 34, { ...mm, rot: s.rot });
    camEnd();
    // the freeze: a soft shutter flash and a held, paler frame
    if (frozen) flash(.35 * Math.exp(-(t - F0) * 6) + .08, '#FFF6E8');
    if (lt > dur - .3) flash(seg(lt, dur - .3, dur), '#FFF8EC');
  }

  shots([[22.19, s7], [25.39, s8], [26.68, s9], [29.02, s10], [31.37, s11], [35.42, s12]]);
})();
