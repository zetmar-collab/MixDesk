const { _electron: electron } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
(async () => {
 const dir = path.resolve('test-results/ui-profile'); await fs.mkdir(dir,{recursive:true});
 await fs.rm(path.join(dir,'settings.json'),{force:true});
 const env = { ...process.env, MIXDESK_TEST_DATA:dir }; delete env.ELECTRON_RUN_AS_NODE;
 const app = await electron.launch({args:['.'],env});
 try {
  const page = await app.firstWindow(); const errors = []; page.on('pageerror',e => errors.push(e.message));
  await page.locator('#engine-version').filter({hasText:/Nie zainstalowano|\d{4}/}).waitFor({timeout:30000});
  await page.locator('#items .card, #empty:not([hidden])').first().waitFor({timeout:35000});
  await page.screenshot({path:'test-results/home-dark.png'});
  assert.equal(await page.title(),'MixDesk');
  await page.locator('[data-view=favorites]').click();
  await page.locator('#empty-title').filter({hasText:'Twoja biblioteka czeka'}).waitFor();
  await page.locator('#language').click();
  await page.locator('#empty-title').filter({hasText:'Your library awaits'}).waitFor();
  await page.locator('#theme').click();
  await page.waitForFunction(() => document.body.dataset.theme === 'light');
  await page.locator('[data-view=home]').click();
  await page.locator('#items .card, #empty:not([hidden])').first().waitFor({timeout:35000});
  await page.screenshot({path:'test-results/home-light.png'});
  await page.locator('#settings-nav').click(); await page.locator('#settings-dialog').waitFor({state:'visible'});
  assert.equal(await page.locator('#theme-select').inputValue(),'light');
  await page.locator('#settings-dialog .close').click();
  await page.locator('#account-nav').click();
  await page.locator('#profile-name').fill('https://evil.com/invalid'); await page.locator('#profile-form button').click();
  await page.locator('#account-status').filter({hasText:'Enter a valid Mixcloud'}).waitFor();
  await app.evaluate(({shell}) => {
   global.__mixdeskOriginalOpenExternal = shell.openExternal;
   global.__mixdeskOpenedLink = new Promise(resolve => { shell.openExternal = async url => { resolve(url); }; });
  });
  await page.locator('#account-dialog details').first().locator('summary').click();
  await page.locator('#developer-panel').click();
  assert.equal(await app.evaluate(() => global.__mixdeskOpenedLink),'https://www.mixcloud.com/developers/');
  await app.evaluate(({shell}) => { shell.openExternal = global.__mixdeskOriginalOpenExternal; });
  await page.locator('#account-dialog .close').click();
  const security = await app.evaluate(({BrowserWindow}) => { const p = BrowserWindow.getAllWindows()[0].webContents.getLastWebPreferences(); return {sandbox:p.sandbox,nodeIntegration:p.nodeIntegration,contextIsolation:p.contextIsolation}; });
  assert.deepEqual(security,{sandbox:true,nodeIntegration:false,contextIsolation:true});
  assert.deepEqual(errors,[]);
  console.log('UI passed: real Electron launch, rendering, navigation, PL/EN, themes, settings, input validation, isolation.');
 } finally { await app.close(); }
})().catch(e => { console.error(e); process.exitCode=1; });
