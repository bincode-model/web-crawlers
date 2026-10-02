# Web crawlers /[•]\

A procedural spider that walks on the DOM. Its feet plant on real words of the page, and every word it touches glitches into a short-lived CSS mutation — outlines, highlights, monospace blow-ups, rotated words, stretched "silk" bars, ghost echoes and long silk threads. Plain JavaScript × CSS, no build step, no dependencies.

一只在网页文字上爬行的程序化蜘蛛：它的脚踩在页面真实的单词上，被踩到的文字会短暂地“变异”——描边、高亮、等宽放大、旋转、拉伸成色条、残影、远距离蛛丝。纯 JavaScript × CSS，无需构建，无依赖。

▶ **Demo video** (40 s, original soundtrack): see the [latest release](../../releases/latest).

## Run it

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 5173
```

Then visit <http://localhost:5173>.

| Input | Effect |
|---|---|
| move the mouse | the spider chases the cursor |
| click | send the spider to that spot |
| `Space` | pause / resume |
| `F` | toggle camera follow |
| `?debug` | expose internals as `window.__crawler` (for measuring) |

## How it works

- **`js/content.js`** generates an endless "Arachnopedia" — encyclopedia-style articles with long reference lists. Every word is a `<span class="w">` so a foot can grip it. All text is procedurally generated.
- **`js/crawler.js`** is the spider:
  - 8 legs + 2 palps, two-bone IK with a fixed knee side per leg, tetrapod-ish gait with step thresholds, urgent and over-extension retraction;
  - feet are anchored to words via `elementFromPoint` and follow them each frame; if a reflow teleports a word, the foot lets go instead of being dragged;
  - mutations are CSS classes (`css/style.css`, `.m-*`) applied on plant, around the body and under the shins, then reverted;
  - **frame discipline**: `update()` and `draw()` only read the DOM, every write is queued and applied once in `commit()`, so the browser lays out once per frame;
  - the camera auto-reads downward; manual scrolling is respected for 2.5 s;
  - read articles are swapped for an equal-height spacer (constant DOM size), and the world is rebased when the spacer gets huge — it can run indefinitely at 60 fps.
- Tunables live in the `T` object at the top of `js/crawler.js` (`cruise` speed, `stopChance`, `stepFrac`, densities…).

## Demo video pipeline (`video/`)

```bash
cd video
npm install            # puppeteer-core only (uses your installed Chrome)
python music.py        # original soundtrack, numpy-synthesized -> build/music.wav
node render.mjs        # deterministic 60 fps capture + captions -> out/web-crawlers.mp4
node render.mjs --seconds 6           # quick preview
node render.mjs --mux                 # re-mux new music without re-rendering
```

`render.mjs` replaces `requestAnimationFrame` / `performance.now` / `setTimeout` with a virtual clock and seeds `Math.random`, so every frame is exact and every render is reproducible. The soundtrack (`music.py`) is an original composition in G major at 120 BPM whose sections line up with the video's bar-length scenes.

Set `CHROME=/path/to/chrome` if Chrome is not at the default Windows location.
