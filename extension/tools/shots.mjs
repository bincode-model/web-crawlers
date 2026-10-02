// Chrome Web Store screenshots (1280x800 JPEG, no alpha) of the extension running on the
// local sample page (generated text only — no third-party sites or marks).
//
//   node shots.mjs   -> ../store/screenshot-1..4.jpg
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { launch, sleep, out, HERE } from './harness.mjs';

const STORE = out(path.resolve(HERE, '../store'));
const H = await launch({ width: 1280, height: 800 });
const page = await H.browser.newPage();
await page.goto(H.sampleUrl, { waitUntil: 'load' });
await page.bringToFront();
const tabId = await H.tabIdOf(page);
const yOf = sel => page.$eval(sel, e => e.getBoundingClientRect().top + scrollY);

async function shot(name, settings, y, wait) {
  await H.setSettings(settings);
  await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y);
  await sleep(300);
  await H.toggle(tabId);
  await sleep(wait);
  const file = path.join(STORE, name);
  await page.screenshot({ path: file, type: 'jpeg', quality: 92 });
  await H.toggle(tabId);
  return file;
}

const refs = await yOf('ol.refs');
await shot('screenshot-1.jpg', { size: 'L', density: 'wild', autoRead: false }, 0, 5200);
const second = await shot('screenshot-2.jpg', { size: 'M', density: 'normal', autoRead: false }, refs - 40, 6000);
await shot('screenshot-4.jpg', { size: 'S', density: 'calm', autoRead: false }, refs + 1400, 6000);

// 3: the popup, composited where Chrome shows it (top-right, under the toolbar)
{
  await H.setSettings({ size: 'M', density: 'normal', autoRead: false }); // same settings as the shot behind it
  const pop = await H.browser.newPage();
  await pop.setViewport({ width: 280, height: 268, deviceScaleFactor: 1 });
  await pop.goto(`chrome-extension://${H.extId}/popup.html`);
  await sleep(500);
  // show it in its "running" state
  await pop.evaluate(() => { const b = document.querySelector('#toggle'); b.disabled = false; b.classList.add('on'); b.textContent = chrome.i18n.getMessage('recall'); document.querySelector('#note').hidden = true; });
  const popPng = await pop.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 280, height: await pop.evaluate(() => document.body.scrollHeight) } });
  await pop.close();
  const bg = readFileSync(second).toString('base64');
  const comp = await H.browser.newPage();
  await comp.setViewport({ width: 1280, height: 800 });
  await comp.setContent(`<body style="margin:0;background:#000">
    <img src="data:image/jpeg;base64,${bg}" style="position:absolute;left:0;top:0;width:1280px;height:800px">
    <img src="data:image/png;base64,${popPng.toString('base64')}" style="position:absolute;right:22px;top:10px;width:280px;
      border:1px solid #2a3040;box-shadow:0 10px 40px rgba(0,0,0,.6),0 0 0 1px rgba(92,200,255,.25)">
  </body>`);
  await comp.screenshot({ path: path.join(STORE, 'screenshot-3.jpg'), type: 'jpeg', quality: 92 });
  await comp.close();
}

await H.close();
console.log('screenshots ->', STORE);
