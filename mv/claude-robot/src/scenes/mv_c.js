// mv_c.js: shots 13–17 (38.84 – 59.04 s). See STORYBOARD.md for the reads.
(() => {
  const { B, BLUE, me, you } = MV;
  const chestHeart = (k, t, dx = 0) => (u, sw) => { if (k > .02) MV.heart(dx * u, -3.1 * u, u * .95 * k * (1 + .18 * pulse(t, 5)), MV.HEART, { sw: sw * .5 }); };

  // ---------- 13 · 38.84–42.25 · 我却已无法自拔 ----------
  // A pink world. My feet are stuck in a heart-shaped pool; I yank and yank on the beat but sink deeper (无法自拔); then I
  // give up, heart-eyed and swaying, as little hearts bubble up.
  function poolPts(cx, cy, r, sy) { return heartPts(cx, cy, r, 64).map(([x, y]) => [x, cy + (y - cy) * sy]); }
  function s13(t, lt, dur) {
    MV.sky('#F2A9BE', '#FCE1E4');
    camBegin(960, 560, 1.02 + .05 * seg(lt, 0, dur));
    boilSeed('ground13');
    paint(rectPts(-300, 760, W + 600, 700, 4), { wash: '#E3A6BF', washOp: 255, ink: null });
    inkLine([[-300, 762], [W + 300, 758]], .8, '#B9738F', 'ink', 0);
    const cx = 960, cy = 870, r = 330, sy = .42, pool = poolPts(cx, cy - 60, r, sy);
    boilSeed('pool');
    paint(pool, { wash: '#C2456A', washOp: 255, ink: PAL.ink, sw: 1 });
    paint(ellPts(cx - 120, cy - 95, 70, 12, 14), { wash: '#E77A98', washOp: 200, ink: null });
    // ripples around me
    for (let i = 0; i < 2; i++) { const ph = frac(t * .9 + i * .5); inkLine(ellPts(cx, cy - 20, 150 + 130 * ph, 22 + 18 * ph, 24).concat([[cx + 150 + 130 * ph, cy - 20]]), .6 * (1 - ph), '#F59AB0', 'inkfine', .5); }
    const u = 30;
    const sink = kf(t, [[38.84, .3], [41.2, 2.4], [42.25, 3.4]]);
    const yanks = [B(46), 40.12, B(47), 40.98], tug = yanks.reduce((a, y) => a + Math.max(0, Math.exp(-Math.pow((t - y) / .07, 2))), 0);
    const giveUp = t > 41.25;
    const mm = emotions(t, [[38.84, 'surprised', { lookY: .8 }], [39.45, 'nervous', { emote: 'sweat' }], [41.25, 'love']]);
    const flail = giveUp ? {} : t > 39.45 ? { aL: .9 + .6 * Math.sin(t * 17), aR: .9 - .6 * Math.sin(t * 17 + .7) } : {};
    me(cx, cy - 20, u, { ...mm, ...flail, dy: (mm.dy || 0) + sink - 1.1 * tug, sq: (mm.sq || 0) - .12 * tug, noShadow: true });
    // the pool's front half covers my sunk legs and body
    const lower = pool.filter(([, y]) => y > cy - 60);
    boilSeed('poolfront');
    paint([[cx - r * 1.05, cy - 60], ...lower, [cx + r * 1.05, cy - 60]].sort(() => 0), { wash: '#C2456A', washOp: 255, ink: null });
    // little hearts bubbling up once I've given in
    if (giveUp) for (let i = 0; i < 6; i++) {
      const ph = frac((t - 41.25) * .7 + i / 6), a = Math.sin(ph * Math.PI);
      boilSeed('bub' + i);
      if (a > .1) MV.heart(cx + (hash(i * 3) - .5) * 420 + Math.sin(ph * 6 + i) * 20, cy - 60 - ph * 380, 14 * a);
    }
    camEnd();
    if (lt < .35) flash(1 - lt / .35, '#FFF8EC');
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#E27A92', '#F59AB0']);
  }

  // ---------- 14 · 42.25–44.81 · 我们的爱总有时差 ----------
  // Split screen: on the left it's day and I'm waving; on the right it's night and you're asleep under the moon (时差).
  // Nobody waves back; my arm drops.
  function s14(t, lt, dur) {
    // left half: day
    MV.sky('#8EC9EC', '#E6F4F2');
    MV.sun(260, 190, 70);
    const gl = MV.planet(480, 800, 900, '#86B35E', '#5E8446', 'pl14');
    const ms = gl(480), wave = t < 43.4;
    const mm = emotions(t, [[0, 'happy', { lookX: .8 }], [43.4, 'hopeful', { lookX: 1 }], [43.95, 'sad', { lookX: 1, aR: -.6, aL: -.6 }]]);
    me(ms.x, ms.y, 28, { ...mm, ...(wave ? { aR: 1.2 + .45 * Math.sin(t * 13), aL: .1 } : {}), rot: ms.rot });
    // right half: night, sliding in from the right edge at the start
    const px = lerp(W, 960, easeOut(seg(t, 42.25, 42.62)));
    push(); translate(px - 960, 0);
    boilSeed('night14');
    for (let i = 0; i < 6; i++) paint(rectPts(960, -80 + i * 210, 1100, 250, 0), { wash: mixCol('#1E2350', '#4A4A86', i / 5), washOp: 255, ink: null });
    MV.stars(t, 22, 1, 51, [1000, 0, 880, 600]);
    MV.moon(1660, 190, 55, 1, '#2A3070');
    const gr = MV.planet(1440, 800, 900, '#3F5A50', '#2C4238', 'pr14');
    const bs = gr(1440);
    you(bs.x, bs.y, 28, { ...feel('sleepy', t, BLUE), noLegs: true, dy: 2, rot: bs.rot, seed: 2 });
    // the seam: a wobbly ink line
    inkLine([[960 + jit(2), -40], [962, 540], [960 + jit(2), H + 40]], 2.4, PAL.ink, 'ink', .3);
    pop();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#7B5CA8', '#E27A92']);
  }

  // ---------- 15 · 44.81–48.44 · 也为你骗自己放下 ----------
  // Dusk. I'm holding my jar of hearts; I slowly set it down on the ground and step back (放下); I force a smile with
  // teary eyes (骗自己), turn and walk away, then look back at it.
  const DUSK2 = ['#5B4B8A', '#F2A07B'];
  function s15(t, lt, dur) {
    MV.sky(...DUSK2);
    camBegin(960, 560, 1.02);
    MV.sun(1500, 760, 90, .9);
    const g = MV.planet(960, 830, 1500, '#6E8F5A', '#4F6E44');
    const u = 30, JX = 920, down = ease(seg(t, 45.25, 45.95)), held = t < 45.95;
    // me: hold → crouch to set the jar down → back off → forced smile → turn away → walk → look back
    const back = stroll(t, 46.0, 46.4, JX, 760, u), away = stroll(t, 47.5, 48.05, 760, 580, u);
    const x = t < 47.5 ? back.x : away.x, s = g(x);
    let view = { view: 'front' };
    if (t > 47.3 && t < 48.0) view = turn(t, 47.3, 47.48, 0, -.25);
    else if (t >= 48.0) view = turn(t, 48.0, 48.2, -.25, .125);
    const mm = emotions(t, [[0, 'sad', { emote: null, aL: -.5, aR: -.5 }], [46.3, 'happy', { eyes: 'teary', mouth: 'smile', emote: null, blush: 0 }], [47.95, 'sad', { lookX: 1, emote: null }]]);
    const crouch = held ? .18 * down : .18 * (1 - ease(seg(t, 45.95, 46.2)));
    const walking = t > 47.5 && t < 48.05 ? { walk: away.walk, view: 'side', flip: true } : t > 46.0 && t < 46.4 ? { walk: back.walk } : {};
    me(s.x, s.y, u, { ...mm, ...view, ...walking, rot: s.rot, sq: (mm.sq || 0) + crouch, aL: held ? -.5 - .6 * down : mm.aL, aR: held ? -.5 - .6 * down : mm.aR,
      draw: held ? (uu) => MV.jar(0, lerp(-.6 * uu, 0, down), 4.4 * uu, 5, t, 'jar15') : null });
    if (!held) MV.jar(JX, g(JX).y, 4.4 * u, 5, t, 'jar15');
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, ['#7B5CA8', '#E27A92']);
  }

  // ---------- 16 · 48.44–53.90 · 爱炙热的你却忘了爱自己 ----------
  // I hold out a burning heart toward you (爱炙热) but you walk away into the distance; the heat drains me pale and
  // sweating. I look down at myself (忘了爱自己), draw the heart back and hug it into my own chest; my colour returns.
  function s16(t, lt, dur) {
    const dk = seg(lt, 0, dur);
    MV.sky(mixCol('#4A3E80', '#2A2860', dk), mixCol('#D98C7A', '#8E5E86', dk));
    MV.stars(t, 24, dk, 61, [0, 0, W, H * .4]);
    const z = 1 + .22 * ease(seg(t, 51.9, 53.0)), cx = lerp(960, 760, ease(seg(t, 51.9, 53.0)));
    camBegin(cx, lerp(560, 600, ease(seg(t, 51.9, 53.0))), z);
    const g = MV.planet(960, 850, 1500, '#5E7F52', '#46663E');
    // you, far away, walking off to the right
    const yx = lerp(1330, 1820, ease(seg(t, 48.6, 52.2))), ys = g(yx), yu = lerp(15, 10, seg(t, 48.6, 52.2));
    if (yx < 1800) you(ys.x, ys.y, yu, { ...feel('neutral', t, BLUE), view: 'qback', walk: (t - 48.6) * 1.6, rot: ys.rot, seed: 2 });
    const u = 30, ms = g(660);
    const pale = seg(t, 50.5, 51.6) * (1 - seg(t, 52.95, 53.4));
    const mm = emotions(t, [[0, 'hopeful', { lookX: 1, aL: .5, aR: .5 }], [50.6, 'nervous', { lookX: 1, aL: .45, aR: .45 }], [51.95, 'sad', { lookY: 1, lookX: 0, aL: .25, aR: .25, emote: null }], [52.95, 'relieved', { aL: -.45, aR: -.45, emote: null }]]);
    const view = t < 51.9 ? { view: 'q' } : turn(t, 51.9, 52.1, .125, 0);
    // the burning heart: held out in front, then drawn back into my chest
    const k = ease(seg(t, 52.25, 52.95)), inChest = t >= 52.95;
    const front = [ms.x + 7.4 * u, ms.y - 5.6 * u], chest = [ms.x, ms.y - 3.1 * u];
    const hp = [lerp(front[0], chest[0], k), lerp(front[1], chest[1], k)];
    if (!inChest && t < 52.25) { boilSeed('fhglow'); glow(ms.x + 2 * u, ms.y - 5 * u, 260, '#FF9A4A', .5 * (1 - k)); }
    me(ms.x, ms.y, u, { ...mm, ...view, rot: ms.rot, tint: pale > .01 ? 'pale' : mm.tint, tintK: pale > .01 ? pale : mm.tintK, ...(pale > .01 ? { col: undefined } : {}),
      emote: pale > .4 && t < 51.95 ? 'sweat' : mm.emote, emoteK: pale > .4 && t < 51.95 ? 1 : mm.emoteK, draw: inChest ? chestHeart(1, t) : null });
    if (!inChest) MV.flameHeart(hp[0], hp[1], lerp(46, 28, k), t, 1 - k);
    if (inChest) { boilSeed('warm'); glow(chest[0], chest[1], 170 * (1 + .25 * pulse(t, 5)), '#FF9AB0', .8); }
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#2A2860', '#4A3E80']);
  }

  // ---------- 17 · 53.90–59.04 · (outro) ----------
  // Back where it began: the little planet under the stars, tiny me, but now a warm heart beats on my chest. A shooting
  // star; I look up and wave. The iris closes on me.
  function s17(t, lt, dur) {
    const z = kf(t, [[53.9, 3.2], [55.9, 1.7], [59.04, 1.8]]), cy = kf(t, [[53.9, 752], [55.9, 690], [59.04, 695]]);
    MV.sky('#1E2350', '#5A4E86');
    camBegin(960, 540, Math.pow(z, .25)); MV.stars(t, 46, 1, 3); camEnd();
    MV.shootingStar(t, 55.9, 56.7, [300, 140], [1500, 330], 'shoot17');
    camBegin(960, cy, z);
    const g = MV.planet(960, 800, 700, '#6E8F5A', '#4F6E44'), s = g(960);
    const mm = emotions(t, [[53.9, 'relieved', { emote: null }], [55.95, 'hopeful', { lookY: -1, lookX: .3 }], [56.8, 'happy', { lookY: -.8 }]]);
    const waving = t > 56.8 ? { aR: 1.2 + .4 * Math.sin(t * 9), aL: .2 } : {};
    me(s.x, s.y, 11, { ...mm, ...waving, draw: chestHeart(1, t) });
    glow(s.x, s.y - 3.1 * 11, 60 * (1 + .3 * pulse(t, 5)), '#FF9AB0', .8);
    const at = toScreen(960, 800 - 44);
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, ['#2A2860', '#4A3E80']);
    const ik = seg(t, 57.3, 58.7);
    if (ik > 0) iris(...at, lerp(1700, 0, ease(ik)));
  }

  shots([[38.84, s13], [42.25, s14], [44.81, s15], [48.44, s16], [53.90, s17]]);
})();
