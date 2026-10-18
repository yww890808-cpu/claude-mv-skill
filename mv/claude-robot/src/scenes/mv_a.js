// mv_a.js: shots 1–6 (0 – 22.19 s). Song time = video time. See STORYBOARD.md for the reads.
(() => {
  const { B, BLUE, me, you } = MV;
  const NIGHT = ['#1E2350', '#5A4E86', '#7A5C9A'];
  // heart that beats on the chest (body-local, front view), used in shots 1, 16, 17
  const chestHeart = (k, t) => (u, sw) => { if (k > .02) MV.heart(0, -3.1 * u, u * .95 * k * (1 + .18 * pulse(t, 5)), MV.HEART, { sw: sw * .5 }); };

  // ---------- 1 · 0–4.70 · 我们都是渺小真实存在 ----------
  // Close on me under the night sky; the camera pulls far back until I'm tiny on a little planet (渺小); I look up, then
  // close my eyes and a heart beats on my chest (真实存在). In: iris opens. Out: the camera starts pushing in.
  function s1(t, lt, dur) {
    const z = kf(t, [[0, 3.4], [1.2, 3.1], [3.0, 1], [4.35, 1.04], [4.7, 1.5]], (x) => ease(x)), cy = kf(t, [[0, 756], [1.2, 752], [3.0, 540], [4.35, 545], [4.7, 700]]);
    MV.sky(...NIGHT);
    camBegin(960, 540, Math.pow(z, .25)); MV.stars(t, 46, 1, 3); camEnd();
    camBegin(960, cy, z);
    const g = MV.planet(960, 800, 700, '#6E8F5A', '#4F6E44');
    const mood = emotions(t, [[0, 'neutral'], [1.5, 'thinking', { lookY: -1, lookX: .1, emote: null }], [3.05, 'relieved', { emote: null }]]);
    const hk = ease(seg(t, 3.1, 3.5)), s = g(960);
    me(s.x, s.y, 11, { ...mood, draw: chestHeart(hk, t) });
    if (hk > 0) glow(s.x, s.y - 3.1 * 11, 60 * (1 + .3 * pulse(t, 5)), '#FF9AB0', .8 * hk);
    const at = toScreen(960, 800 - 44);
    camEnd();
    if (t < 1.1) iris(...at, lerp(0, 1700, easeIn(seg(t, 0, 1.1)) * .6 + seg(t, 0, 1.1) * .4));
  }

  // ---------- 2 · 4.70–8.33 · 祈愿小世界里不只有挫败 ----------
  // Dusk on the little planet. I balance one more block on my head, hop and toss it on top of my tower; the tower wobbles
  // and falls (挫败, on the beat at 6.40); a rain cloud over me. A shooting star: I look up and clasp a wish (祈愿).
  const DUSK = ['#3B3F7A', '#D98C8C', '#F0B07A'];
  const TOWER_X = 1090, BS = 64;
  // where each block is at time t (shared with shot 3 so the fallen blocks stay where they landed)
  function blockPose(i, t, base) {
    const y0 = base.y, stackY = k => y0 - BS * (k + .5);
    const T0 = B(7);   // the topple, on the beat
    // block 3 is the one tossed from my head
    if (i === 3 && t < 5.9) return null;
    let sway = 0;
    if (t > 5.9 && t < T0) sway = .05 * Math.sin((t - 5.9) * 22) * seg(t, 5.9, T0) + .08 * easeIn(seg(t, 6.15, T0));
    if (t < T0) {   // standing (and wobbling about the base)
      const r = (i + .5) * BS, a = sway;
      return { x: TOWER_X + Math.sin(a) * r, y: y0 - Math.cos(a) * r, rot: a };
    }
    const k = seg(t, T0 + i * .06, T0 + i * .06 + .5), land = [TOWER_X + 110 + i * 92, y0 - BS / 2 + 2], from = [TOWER_X + Math.sin(.08) * (i + .5) * BS, stackY(i)];
    const p = arcPt(from, land, 40 + i * 30, easeIn(k) * .4 + k * .6), bounce = k >= 1 ? 8 * Math.exp(-(t - (T0 + i * .06 + .5)) * 9) * Math.abs(Math.sin((t - (T0 + i * .06 + .5)) * 18)) : 0;
    return { x: p[0], y: p[1] - bounce, rot: lerp(.08, [.25, -.4, .6, 1.57][i], k) };
  }
  function towerWorld(t, g) {
    const base = g(TOWER_X);
    for (let i = 0; i < 4; i++) { const b = blockPose(i, t, base); if (b) { boilSeed('blk' + i); MV.block(b.x, b.y, BS, i, b.rot); } }
    return base;
  }
  function s2(t, lt, dur) {
    MV.sky(...DUSK);
    MV.stars(t, 14, .5, 7, [0, 0, W, H * .35]);
    MV.shootingStar(t, 7.0, 7.65, [260, 120], [1500, 300]);
    const z = lerp(1.3, 1, easeOut(seg(lt, 0, .45)));
    camBegin(960, 560, z);
    const g = MV.planet(960, 770, 1500, '#7FA65E', '#5E8446');
    towerWorld(t, g);
    const s = g(780), u = 24;
    const hop = jump(t, 5.3, 5.75, 2.2);
    const mood = emotions(t, [[0, 'determined', { lookX: .8 }], [B(7) + .05, 'surprised', { lookX: .8 }], [6.75, 'sad'], [7.15, 'hopeful', { lookY: -1, lookX: .4, emote: null }],
      [7.7, 'relieved', { eyes: 'closed', mouth: null, aL: .8, aR: .8, emote: 'spark', blush: .2 }]]);
    const view = t < 6.95 ? { view: 'q' } : turn(t, 6.95, 7.12, .125, 0);
    me(s.x, s.y, u, { ...mood, ...view, rot: s.rot, dy: mood.dy + hop.dy, sq: mood.sq + hop.sq, ...(t < 5.75 ? { aL: .9 + .3 * seg(t, 5.2, 5.4), aR: .9 } : {}) });
    // the block balanced on my head, then tossed onto the tower on an arc
    if (t < 5.9) {
      const head = [s.x + .6 * u, s.y + hop.dy * u - 8 * u * (1 - hop.sq) - BS / 2 + 4];
      const top = [TOWER_X, g(TOWER_X).y - BS * 3.5];
      const k = seg(t, 5.5, 5.9), p = k > 0 ? arcPt(head, top, 160, ease(k)) : head;
      boilSeed('blk3'); MV.block(p[0], p[1], BS, 3, k * Math.PI * .5 * (1 - k) * 2);
    }
    camEnd();
  }

  // ---------- 3 · 8.33–11.95 · 直到遇见你我以为就光明起来 ----------
  // The blue robot leaps onto my planet and lands beside me (遇见你); I jump with surprise; the sun rises behind us and the
  // whole sky turns from dusk to gold (光明起来); my eyes become stars. In: the wish flashes white.
  function s3(t, lt, dur) {
    const k = ease(seg(t, 9.9, 11.4));
    MV.sky(mixCol(DUSK[0], '#F4B96E', k), mixCol(DUSK[1], '#FCE4B4', k), mixCol(DUSK[2], '#FFD58A', k));
    MV.stars(t, 14, .5 * (1 - k), 7, [0, 0, W, H * .35]);
    const zp = 1 + .05 * seg(lt, 0, dur) + .5 * easeIn(seg(t, 11.62, 11.95));
    camBegin(lerp(960, 800, easeIn(seg(t, 11.62, 11.95))), lerp(560, 700, easeIn(seg(t, 11.62, 11.95))), zp);
    MV.sun(960, lerp(900, 430, ease(seg(t, 9.9, 11.6))), 90, .4 + .6 * k);
    const g = MV.planet(960, 770, 1500, mixCol('#7FA65E', '#94B85A', k), '#5E8446');
    towerWorld(t, g);
    // the blue robot leaps in from the right and lands at 9.12
    const bx = lerp(1720, 1170, ease(seg(t, 8.45, 9.12))), bs = g(bx), bj = jump(t, 8.45, 9.12, 5);
    const bm = emotions(t, [[0, 'excited'], [9.3, 'happy', { aL: .3 + .8 * Math.max(0, Math.sin((t - 9.3) * 9)), aR: .3 }]], { base: BLUE });
    you(bs.x, bs.y, 24, { ...bm, view: t < 9.5 ? 'q' : 'front', flip: true, rot: bs.rot, dy: bm.dy + bj.dy, sq: bm.sq + bj.sq });
    const s = g(780);
    const mood = emotions(t, [[0, 'relieved', { eyes: 'closed', mouth: null, aL: .8, aR: .8, emote: 'spark', blush: .2 }], [9.18, 'surprised', { lookX: 1 }], [10.25, 'starstruck']]);
    me(s.x, s.y, 24, { ...mood, view: t > 9.18 && t < 10.2 ? 'q' : 'front', rot: s.rot });
    if (k > .1) glow(960, 520, 900, '#FFD08A', .35 * k);
    camEnd();
    if (lt < .35) flash(1 - lt / .35, '#FFF6DE');
  }

  // ---------- 4 · 11.95–15.79 · 眼睛里看到的都是广袤无垠的大海 ----------
  // A: my eyes in close-up, gold waves shining in them (眼睛里看到的). B: the camera rises; from behind, the two of us sit
  // on the planet's edge before a sea that runs to the horizon (广袤无垠的大海), and I lean on you.
  const GOLD = ['#F6C27A', '#FCE3B0', '#FFD58A'];
  function s4(t, lt, dur) {
    if (t < 13.25) {
      const rise = easeIn(seg(t, 12.95, 13.25));
      MV.sky(...GOLD);
      camBegin(960, 900 - 6 * 26 - 900 * rise, lerp(3.2, 3.6, seg(t, 11.95, 13)) );
      const mood = emotions(t, [[11.95, 'surprised'], [12.45, 'starstruck', { eyes: 'wide', mouth: 'open' }]]);
      me(960, 900, 26, { ...mood, eyes: 'wide', lookX: 0, lookY: 0, noShadow: true, draw: (u, sw) => {
        // the sea shining inside each eye: a teal band, a gold sun glint and two little wave lines
        for (const sd of [-1, 1]) {
          const ex = sd * 2.5 * u, ey = -6 * u;
          paint(rrPts(ex - .5 * u, ey + .15 * u, 1 * u, 1 * u, .3 * u), { wash: '#3F8FA8', washOp: 230, ink: null });
          const ph = t * 2.5;
          inkLine([[ex - .42 * u, ey + .5 * u + Math.sin(ph) * 2], [ex, ey + .38 * u], [ex + .42 * u, ey + .5 * u - Math.sin(ph) * 2]], sw * .35, '#CFF0F2', 'inkfine', .6);
          paint(ellPts(ex + .1 * u, ey + .05 * u, .22 * u, .22 * u, 10), { wash: '#FFD36B', ink: null });
          paint(ellPts(ex - .2 * u, ey - .6 * u, .2 * u, .28 * u, 10), { wash: PAL.cream, ink: null });
        }
      } });
      camEnd();
      return;
    }
    // B: tilt down from the sky onto the sea and our backs
    const cy = lerp(-120, 540, ease(seg(t, 13.25, 14.1)));
    camBegin(960, cy, 1);
    // the sky is painted in world space here, so the tilt down reads
    const bands = [['#EFA65F', -1300], ['#F3B66C', -500], [GOLD[0], -150], ['#F9D396', 200], [GOLD[1], 420]];
    bands.forEach(([c, y0], i) => { boilSeed('sb' + i); paint(rectPts(-300, y0, W + 600, (i < 4 ? bands[i + 1][1] : 600) - y0 + 40, 5), { wash: c, washOp: 255, ink: null }); });
    MV.sun(960, 560, 95);
    MV.sea(t, 560, 960);
    // the planet's edge in the foreground
    boilSeed('edge');
    paint(ellPts(960, 880 + 2600, 2700, 2600, 120, 2), { wash: '#94B85A', washOp: 255, ink: PAL.ink, sw: 1.2 });
    const lean = ease(seg(t, 14.5, 15.0));
    const sway = n => .035 * Math.sin(bpOf(t) * Math.PI / 2 + n);
    you(1100, 905, 30, { ...feel('relieved', t, BLUE), view: 'back', noLegs: true, dy: 2, rot: sway(1.3) - .04 * lean });
    me(820, 905, 30, { ...feel('relieved', t), view: 'back', noLegs: true, dy: 2, rot: sway(0) + .13 * lean, dx: .4 * lean, emote: lean > .6 ? 'hearts' : null, emoteK: seg(t, 14.9, 15.2), emoteAge: t - 14.9 });
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#E8AA38', '#3F8FA8']);
  }

  // ---------- 5 · 15.79–18.78 · 有你在的日子里不可能被取代 ----------
  // Sun and moon race twice round the sky (日子) while we dance side by side; it stops at noon and I hug you tight and
  // nod hard twice, hearts popping (不可能被取代).
  function s5(t, lt, dur) {
    const a = TAU * 2 * ease(seg(t, 15.85, 17.5)), day = clamp(.5 + .65 * Math.cos(a));
    MV.sky(mixCol('#1E2350', '#8EC9EC', day), mixCol('#4A4A86', '#E6F4F2', day));
    MV.stars(t, 30, 1 - day, 11);
    camBegin(960, 540, 1 + .03 * seg(lt, 0, dur));
    const ox = 960, oy = 980, R = 760;
    MV.sun(ox + Math.sin(a) * R, oy - Math.cos(a) * R, 80, clamp(Math.cos(a) * 2 + .6));
    MV.moon(ox - Math.sin(a) * R, oy + Math.cos(a) * R, 60, clamp(-Math.cos(a) * 2 + .6), mixCol('#1E2350', '#8EC9EC', day));
    const g = MV.planet(960, 820, 1200, mixCol('#4D6B50', '#86B35E', day), mixCol('#34503A', '#5E8446', day));
    const hugK = ease(seg(t, 17.5, 17.85));
    const bs = g(1090), ms = g(lerp(820, 880, hugK));
    const bm = emotions(t, [[0, 'happy'], [17.75, 'shy']], { base: BLUE });
    you(bs.x, bs.y, 26, { ...bm, ...(t < 17.5 ? move('sway', t, 1) : {}), rot: bs.rot - .05 * hugK, seed: 2 });
    const nod = ring(t, [17.98, 18.4], 9, 22);
    const mm = emotions(t, [[0, 'happy'], [17.5, 'love', { aR: .08, aL: .35 }]]);
    const dance = t < 17.5 ? move('sway', t + .12, 0) : {};
    me(ms.x, ms.y, 26, { ...mm, ...dance, rot: ms.rot + .06 * hugK, sq: (mm.sq || 0) + .22 * Math.max(0, nod), dy: (mm.dy || 0) + .5 * Math.min(0, -nod) });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, ['#E8AA38', '#3F8FA8']);
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, ['#8C8FA6', '#6D7088']);
  }

  // ---------- 6 · 18.78–22.19 · 在最灰暗的日子你陪着我发呆 ----------
  // Grey and raining (最灰暗的日子). I sit hunched under my rain cloud. You walk over, hold a big leaf over us both, say
  // nothing, and stare ahead with me (陪着我发呆); I lean on you.
  const GREY = ['#767B90', '#A9ADB9'];
  function s6(t, lt, dur) {
    MV.sky(...GREY);
    const z = 1.04 + .03 * seg(lt, 0, dur);
    camBegin(960, 560, z);
    const g = MV.planet(960, 830, 1300, '#7E8C72', '#5F6B56');
    // you walk in from the right, stop at 20.5 and raise the leaf
    const st = stroll(t, 19.55, 20.5, 1560, 1130, 28), bs = g(st.x), raise = ease(seg(t, 20.5, 20.85));
    const aL = lerp(.2, 1.3, raise), u = 28;
    // the leaf's stem starts at the tip of your raised arm (front view, left arm)
    const piv = [bs.x - (4.9 + .55 * clamp((aL - .7) / .9)) * u, bs.y - 4.5 * u], tip = [piv[0] - 2.2 * u * Math.cos(aL), piv[1] - 2.2 * u * Math.sin(aL)];
    const canopy = [lerp(tip[0] + 120, 990, raise), lerp(tip[1] + 60, bs.y - 8 * u - 120, raise)];
    MV.rain(t, 1, 80, 'rain6');
    const bm = emotions(t, [[0, 'neutral', { lookX: -.8 }], [20.6, 'neutral', { eyes: 'dot', mouth: 'flat', lookX: 0 }]], { base: BLUE });
    you(bs.x, bs.y, u, { ...bm, ...(t < 20.5 ? { view: st.view, flip: st.flip, walk: st.walk, dy: st.dy } : { view: 'front' }), aL, rot: bs.rot, seed: 2 });
    if (t > 20.45) MV.leafUmbrella(tip[0], tip[1], canopy[0], canopy[1], lerp(80, 560, raise));
    const ms = g(860), lean = ease(seg(t, 21.35, 21.85));
    const mm = emotions(t, [[0, 'sad', { aL: -.6, aR: -.6 }], [20.0, 'sad', { lookX: 1, aL: -.6, aR: -.6 }], [20.95, 'bored', { eyes: 'dot', mouth: 'flat', lookX: 0, lookY: 0, emote: null, aL: -.7, aR: -.7 }]]);
    me(ms.x, ms.y, u, { ...mm, noLegs: true, dy: (mm.dy || 0) + 2, rot: ms.rot + .12 * lean, dx: .5 * lean, seed: 5 });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, ['#8C8FA6', '#6D7088']);
  }

  shots([[0, s1], [4.70, s2], [8.33, s3], [11.95, s4], [15.79, s5], [18.78, s6]]);
})();
