const { _electron: electron } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
 const env = {...process.env,MIXDESK_TEST_DATA:path.resolve('test-results/packaged-profile')}; delete env.ELECTRON_RUN_AS_NODE;
 const app = await electron.launch({executablePath:path.resolve(process.argv[2] || 'dist/win-unpacked/MixDesk.exe'),args:[],env,timeout:60000});
 try {
  const page = await app.firstWindow(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.locator('#engine-version').filter({hasText:/\d{4}/}).waitFor({timeout:30000});
  assert.equal(await app.evaluate(({app})=>app.isPackaged),true);
  await page.evaluate(()=>{document.getElementById('audio').muted=true;});
  await page.locator('#url').fill('https://www.youtube.com/watch?v=jNQXAC9IVRw');
  await page.locator('#url-form button').click();
  await page.locator('#track-title').filter({hasText:'Me at the zoo'}).waitFor({timeout:120000});
  await page.waitForFunction(()=>document.getElementById('audio').currentTime > .2);
  await page.locator('#toggle-play').click();
  assert.equal(await page.evaluate(()=>document.getElementById('audio').paused),true);
  await page.locator('#account-nav').click();
  await page.locator('#profile-name').fill('NTSRadio');
  await page.locator('#profile-form button').click();
  await page.locator('#account-dialog').waitFor({state:'hidden',timeout:30000});
  await page.locator('[data-view=following]').click();
  await page.locator('#items .card').first().waitFor({timeout:30000});
  await page.screenshot({path:'test-results/packaged-player.png'});
  assert.deepEqual(errors,[]);
  console.log('Packaged EXE passed: bundled yt-dlp, YouTube playback through UI, pause, public profile, following list.');
 } finally {await app.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
