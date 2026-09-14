// Explicit live integration check: uses public Mixcloud data and downloads one show.
const { _electron: electron } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
 const env = { ...process.env, MIXDESK_TEST_DATA:path.resolve('test-results/live-profile') }; delete env.ELECTRON_RUN_AS_NODE;
 const app = await electron.launch({args:['.'],env});
 try {
  const page = await app.firstWindow();
  await page.waitForFunction(() => window.mixdesk);
  const version = await page.evaluate(() => window.mixdesk.call('tools:update'));
  assert.match(version,/^\d{4}\.\d{2}\.\d{2}/);
  const profile = await page.evaluate(() => window.mixdesk.call('profile:public','NTSRadio'));
  assert.equal(profile.profile.username,'NTSRadio'); assert.equal(profile.authenticated,false);
  const follows = await page.evaluate(() => window.mixdesk.call('library:page',{section:'following'}));
  assert.ok(follows.items.length > 0);
  const likes = await page.evaluate(() => window.mixdesk.call('library:page',{section:'favorites'}));
  assert.ok(Array.isArray(likes.items));
  const shows = await page.evaluate(() => window.mixdesk.call('library:page',{section:'cloudcasts',creator:'NTSRadio'}));
  assert.ok(shows.items.length > 0);
  const result = await page.evaluate(url => window.mixdesk.call('player:prepare',url), shows.items[0].url);
  assert.ok(result.source.startsWith('mixdesk://audio/')); assert.equal(result.file,undefined);
  await page.evaluate(async source => { const a=document.getElementById('audio'); a.muted=true; a.src=source; await a.play(); },result.source);
  await page.waitForFunction(() => document.getElementById('audio').currentTime > 0.3, null, {timeout:20000});
  const duration = await page.evaluate(() => document.getElementById('audio').duration); assert.ok(duration > 0);
  await page.evaluate(() => { const a=document.getElementById('audio'); a.currentTime=60; });
  await page.waitForFunction(() => { const a=document.getElementById('audio'); return !a.seeking && a.currentTime > 60.2; },null,{timeout:20000});
  await page.evaluate(() => document.getElementById('audio').pause());
  const state = await page.evaluate(() => window.mixdesk.call('settings:get')); assert.equal(state.history[0].url,shows.items[0].url);
  console.log(JSON.stringify({profile:profile.profile.name,followed:follows.items.length,likes:likes.items.length,shows:shows.items.length,audio:result.title,duration,seek:true,history:true},null,2));
 } finally { await app.close(); }
})().catch(e => {console.error(e);process.exitCode=1;});
