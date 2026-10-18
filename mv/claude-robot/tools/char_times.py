#!/usr/bin/env python3
"""char_times.py song.mp3 lyrics.lrc [--bpm=70.3 --beat0=0.43] -> prints a JS LY table with one time per character.

The LRC only gives line starts (±0.5 s). For each line we look for vocal onsets (spectral flux in 250-3500 Hz) between
its start and the next line, pick one onset per character (strongest first, spaced >= 1/16 note), fill any gaps evenly,
then snap every time to the song's 16th-note grid so each character lands on the rhythm.
"""
import re, subprocess, sys, json
import numpy as np
args = dict(a.lstrip('-').split('=', 1) for a in sys.argv[3:] if '=' in a)
bpm, beat0 = float(args.get('bpm', 70.30)), float(args.get('beat0', 0.430))
B = 60 / bpm; G = B / 4                                  # 16th-note grid
sr, hop, win = 22050, 128, 2048
x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', sys.argv[1], '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'],
                                 capture_output=True, check=True).stdout, dtype=np.float32)
fr = np.lib.stride_tricks.sliding_window_view(x, win)[::hop]
S = np.abs(np.fft.rfft(fr * np.hanning(win), axis=1)); f = np.fft.rfftfreq(win, 1 / sr)
S = np.log1p(S[:, (f > 250) & (f < 3500)] * 10)
flux = np.maximum(0, np.diff(S, axis=0)).sum(1); flux = np.maximum(flux - np.convolve(flux, np.ones(48) / 48, 'same'), 0)
fps = sr / hop; T = lambda i: (i + 1) / fps
lines = []
for l in open(sys.argv[2], encoding='utf-8'):
    m = re.match(r'\[(\d+):(\d+(?:\.\d+)?)\](.*)', l.strip())
    if m: lines.append((int(m[1]) * 60 + float(m[2]), m[3].strip()))
snap = lambda t: beat0 + round((t - beat0) / G) * G
out = []
for k, (t0, txt) in enumerate(lines):
    if not txt: continue
    t1 = lines[k + 1][0] if k + 1 < len(lines) else t0 + 4
    n = len(txt); a, b = t0 - .35, t1 - .35
    ia, ib = int(a * fps), int(b * fps); seg = flux[ia:ib]
    # local maxima
    pk = [i for i in range(1, len(seg) - 1) if seg[i] >= seg[i - 1] and seg[i] > seg[i + 1]]
    pk.sort(key=lambda i: -seg[i]); chosen = []
    for i in pk:
        tt = T(ia + i)
        if all(abs(tt - c) >= G * .9 for c in chosen): chosen.append(tt)
        if len(chosen) == n: break
    chosen.sort()
    # keep onsets only if they cover the line sensibly; otherwise spread evenly over 85% of the line
    span_ok = len(chosen) == n and chosen[-1] - chosen[0] > (t1 - t0) * .45
    ts = chosen if span_ok else list(np.linspace(t0, t0 + (t1 - t0) * .82, n))
    s = []
    for tt in ts:
        q = snap(tt)
        if s and q <= s[-1] + 1e-6: q = s[-1] + G
        s.append(round(q, 3))
    end = max(t1, s[-1] + .5)
    out.append((round(t0, 2), round(end, 2), txt, s, 'onsets' if span_ok else 'even'))
for t0, t1, txt, s, how in out:
    print(f"  [{t0}, {t1}, '{txt}', {json.dumps(s)}],   // {how}  gaps {np.round(np.diff(s), 2).tolist()}")
