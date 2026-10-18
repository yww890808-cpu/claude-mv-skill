// karaoke.js: lyrics that pop in ONE CHARACTER AT A TIME on the song's 16th-note grid, drawn on the 2D compositor through
// window.overlayHook (crisp, above the paper grain). The band sits at y ≈ 960–1065; keep key action above it.
//
// LY = [[lineStart, lineEnd, "line", [time of each character]]], in song time. The character times come from
// tools/char_times.py (vocal onsets snapped to the beat grid). Each character drops in from above, squashes as it lands
// and springs back; the one being sung is gold and bigger. On every beat the characters already up hop together, in a
// small ripple from left to right. A line sinks and fades just before the next one starts.
const LY = [
  [1.5, 5.0, '我们都是渺小真实存在', [1.283, 1.71, 2.137, 2.35, 2.564, 2.99, 3.417, 3.631, 3.844, 4.271]],
  [5.0, 8.61, '祈愿小世界里不只有挫败', [4.697, 5.124, 5.551, 5.764, 5.978, 6.404, 6.831, 7.045, 7.258, 7.685, 8.111]],
  [8.5, 12.03, '直到遇见你我以为就光明起来', [8.325, 8.538, 8.751, 8.965, 9.178, 9.392, 9.818, 10.245, 10.672, 10.885, 11.099, 11.312, 11.525]],
  [12.0, 15.5, '眼睛里看到的都是广袤无垠的大海', [11.952, 12.165, 12.379, 12.592, 12.806, 13.019, 13.232, 13.446, 13.659, 13.872, 14.086, 14.299, 14.513, 14.726, 14.939]],
  [16.0, 19.07, '有你在的日子里不可能被取代', [15.793, 16.006, 16.219, 16.433, 16.646, 16.86, 17.073, 17.286, 17.5, 17.713, 17.926, 18.353, 18.567]],
  [19.0, 22.5, '在最灰暗的日子你陪着我发呆', [18.78, 18.993, 19.207, 19.42, 19.633, 20.06, 20.274, 20.487, 20.914, 21.127, 21.34, 21.767, 21.98]],
  [22.5, 25.5, '你让我学会如何拨开阴霾', [22.194, 22.407, 22.621, 22.834, 23.047, 23.474, 23.901, 24.114, 24.328, 24.541, 24.754]],
  [25.5, 27.18, '将快乐全部收集', [25.394, 25.608, 25.821, 26.035, 26.248, 26.461, 26.675]],
  [27.0, 29.09, '将不开心全部淘汰', [26.675, 26.888, 27.315, 27.528, 27.742, 27.955, 28.168, 28.595]],
  [29.0, 31.66, '你对我说的情话', [29.022, 29.448, 29.662, 29.875, 30.302, 30.942, 31.155]],
  [31.5, 35.5, '像转瞬即逝的烟花', [31.369, 31.582, 32.436, 32.862, 33.289, 33.716, 34.143, 34.569]],
  [35.5, 38.5, '只停在绽放一刹那', [35.423, 35.85, 36.276, 36.49, 36.703, 37.13, 37.557, 37.983]],
  [39.0, 42.5, '我却已无法自拔', [38.837, 39.69, 39.904, 40.117, 40.544, 40.971, 41.397]],
  [42.5, 44.5, '我们的爱总有时差', [42.251, 42.464, 42.678, 43.104, 43.318, 43.531, 43.744, 43.958]],
  [45.0, 48.51, '也为你骗自己放下', [44.811, 45.025, 45.238, 45.665, 46.518, 46.732, 47.372, 48.012]],
  [48.5, 54.0, '爱炙热的你却忘了爱自己', [48.439, 48.652, 49.932, 50.359, 50.786, 51.212, 51.639, 52.066, 52.493, 52.919, 53.346]],
];
const KFONT = '"Ma Shan Zheng", "Kaiti SC", "STKaiti", serif', KSIZE = 76, KY = 1010;
window.EXTRA_FONTS = [[`${KSIZE}px ${KFONT}`, LY.map(l => l[2]).join('')]];

// When each line is on screen. A line comes up just before its first character. When the next line starts, it lifts one
// row and shrinks (two-row KTV style) and stays until its last character has had at least 0.7 s, then fades.
const LYWIN = LY.map((l, i) => {
  const a = l[3][0] - .12, last = l[3][l[3].length - 1];
  const nx = i + 1 < LY.length ? LY[i + 1][3][0] - .1 : Infinity;
  const end = Math.min(Math.max(nx, last + .7), l[1] + 1.2, i + 2 < LY.length ? LY[i + 2][3][0] - .1 : Infinity);
  return [a, end, nx];
});

window.overlayHook = (c, t) => {
  for (let i = 0; i < LY.length; i++) if (t >= LYWIN[i][0] && t < LYWIN[i][1]) kLine(c, LY[i], t, LYWIN[i]);
};

function kLine(c, L, t, [wa, wb, nx]) {
  const [, , txt, ts] = L, chars = [...txt];
  const out = ease(seg(t, wb - .22, wb));                 // the exit: sink and fade
  if (out >= 1) return;
  const lift = ease(seg(t, nx, nx + .16));                 // pushed up a row by the next line
  c.save(); c.translate(960, KY - 100 * lift); c.scale(1 - .24 * lift, 1 - .24 * lift); c.translate(-960, -KY);
  c.font = `${KSIZE}px ${KFONT}`; c.textBaseline = 'middle'; c.textAlign = 'center';
  const ws = chars.map(ch => c.measureText(ch).width + 6), total = ws.reduce((a, b) => a + b, 0);
  let x = 960 - total / 2;
  const xs = ws.map(w => { const cx = x + w / 2; x += w; return cx; });
  // which characters are up, and the newest one (being sung)
  let n = 0; while (n < ts.length && t >= ts[n]) n++;
  if (n === 0) { c.restore(); return; }
  const last = n - 1, landK = seg(t, ts[last], ts[last] + .1);
  // the backing: a soft ragged ink band that grows with the characters, and boils
  const bx0 = xs[0] - ws[0] / 2 - 46, bx1 = lerp(xs[Math.max(0, last - 1)], xs[last], easeOut(landK)) + ws[last] / 2 + 46;
  const r = k => hash(BOILN * 13 + k) * 7 - 3.5, by = KY + 14 * out;
  c.globalAlpha = .78 * (1 - out); c.fillStyle = PAL.ink; c.beginPath();
  c.moveTo(bx0 + r(1), by - 50 + r(2)); c.lineTo((bx0 + bx1) / 2, by - 55 + r(3)); c.lineTo(bx1 + r(4), by - 50 + r(5));
  c.lineTo(bx1 + 18, by + r(6)); c.lineTo(bx1 + r(7), by + 50 + r(8)); c.lineTo((bx0 + bx1) / 2, by + 55 + r(9));
  c.lineTo(bx0 + r(10), by + 50 + r(11)); c.lineTo(bx0 - 18, by + r(12)); c.closePath(); c.fill();
  for (let i = 0; i < n; i++) {
    const a = t - ts[i];
    // drop in (0 → .1 s), then squash on landing and spring back
    const fall = a < .1 ? easeIn(a / .1) : 1, land = a < .1 ? 0 : a - .1;
    const sqz = a < .1 ? -.18 * fall : .34 * Math.exp(-land * 11) * Math.cos(land * 26);
    // every beat, the characters already up hop together, rippling left to right
    const beatHop = a > .3 ? 11 * pulse(t - i * .035, 7) : 0;
    const y = KY - (1 - fall) * 95 - beatHop + 14 * out, sung = i === last && i < ts.length;
    const big = (i === last ? 1.16 : 1) * (1 + .25 * Math.exp(-land * 9) * (a >= .1 ? 1 : 0));
    c.save(); c.globalAlpha = (1 - out) * clamp(a / .04); c.translate(xs[i], y + KSIZE * .35); c.scale(big * (1 + sqz * .7), big * (1 - sqz)); c.translate(0, -KSIZE * .35);
    c.rotate((hash(i * 7 + txt.length) - .5) * .12);
    c.fillStyle = PAL.ink; c.fillText(chars[i], 4, 5);
    c.fillStyle = sung ? '#F6C14E' : PAL.cream; c.fillText(chars[i], 0, 0);
    c.restore();
  }
  c.restore();
}
