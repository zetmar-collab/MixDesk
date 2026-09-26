// The NSIS portable launcher does not forward the Electron inspector pipe.
// Connect to its Chromium port to validate the actual single-file EXE.
const { chromium } = require('playwright');
const { spawn } = require('node:child_process');
const net = require('node:net');
const path = require('node:path');
const assert = require('node:assert/strict');
(async()=>{
 const server=net.createServer(); await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;await new Promise(r=>server.close(r));
 const env={...process.env,MIXDESK_TEST_DATA:path.resolve('test-results/portable-profile')};delete env.ELECTRON_RUN_AS_NODE;
 const child=spawn(path.resolve(process.env.MIXDESK_EXECUTABLE || 'dist/MixDesk.exe'),[`--remote-debugging-port=${port}`],{env,windowsHide:true,stdio:'ignore'});
 let browser;
 try {
  for(let i=0;i<120;i++){try{browser=await chromium.connectOverCDP(`http://127.0.0.1:${port}`,{timeout:500});break;}catch{await new Promise(r=>setTimeout(r,250));}}
  assert.ok(browser,'Portable application must start');
  const context=browser.contexts()[0];const page=context.pages()[0] || await context.waitForEvent('page');
  await page.locator('#engine-version').filter({hasText:/\d{4}/}).waitFor({timeout:30000});
  if(process.argv.includes('--smoke')) {
   await page.locator('#account-nav').click();
   await page.locator('#account-dialog details').first().locator('summary').click();
   await page.locator('#developer-panel').waitFor({state:'visible'});
   assert.match(await page.locator('#developer-panel').textContent(),/panel deweloperski Mixcloud/);
   await page.screenshot({path:'test-results/portable-oauth.png'});
   console.log('Final portable EXE passed: startup, bundled engine and developer dashboard button.');
  } else {
  await page.evaluate(()=>{document.getElementById('audio').muted=true;});
  await page.locator('#url').fill('https://www.youtube.com/watch?v=jNQXAC9IVRw');await page.locator('#url-form button').click();
  await page.locator('#track-title').filter({hasText:'Me at the zoo'}).waitFor({timeout:120000});
  await page.waitForFunction(()=>document.getElementById('audio').currentTime>.2);
  await page.locator('#toggle-play').click();assert.equal(await page.evaluate(()=>document.getElementById('audio').paused),true);
  await page.screenshot({path:'test-results/portable-player.png'});
  console.log('Single-file MixDesk.exe passed: starts, shows custom UI, bundles yt-dlp, plays YouTube and pauses.');
  }
 } finally {
  if(browser){const session=await browser.newBrowserCDPSession();await session.send('Browser.close').catch(()=>{});await browser.close().catch(()=>{});}
  if(child.exitCode===null) await Promise.race([new Promise(r=>child.once('exit',r)),new Promise(r=>setTimeout(r,5000))]);
 }
})().catch(e=>{console.error(e);process.exitCode=1;});
