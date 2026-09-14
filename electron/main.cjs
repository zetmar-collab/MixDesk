const { app, BrowserWindow, ipcMain, protocol, net, safeStorage, shell, session } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
const { pathToFileURL } = require('node:url');
const { Store } = require('./store.cjs');
const { Mixcloud } = require('./mixcloud.cjs');
const { Ytdlp } = require('./ytdlp.cjs');
const { username } = require('./domain.cjs');
const { serveAudio } = require('./media.cjs');
protocol.registerSchemesAsPrivileged([{ scheme: 'mixdesk', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }]);
if (process.env.MIXDESK_TEST_DATA) app.setPath('userData', process.env.MIXDESK_TEST_DATA);
let window, store, downloader, current, oauth;
const mixcloud = new Mixcloud();
function handle(name, fn) {
  ipcMain.handle(name, async (event, payload) => {
    if (event.senderFrame !== window.webContents.mainFrame || !event.senderFrame.url.startsWith('mixdesk://app/')) return { error: 'FORBIDDEN' };
    try { return { data: await fn(payload) }; } catch (e) {
      const code = /^[A-Z_]+$/.test(e.message) ? e.message : 'NETWORK';
      return { error: code };
    }
  });
}
async function connect(token) {
  if (typeof token !== 'string' || !token.trim() || token.length > 4096) throw new Error('INVALID_REQUEST');
  const profile = await mixcloud.profile('', token.trim());
  store.secret('token', token.trim()); store.save({ profile });
  return store.public();
}
app.whenReady().then(async () => {
  store = new Store(app.getPath('userData'), safeStorage);
  downloader = new Ytdlp(path.join(app.getPath('userData'), 'tools'), progress => window?.webContents.send('progress', progress));
  await fs.mkdir(downloader.dir, { recursive: true });
  try { await fs.access(downloader.exe); } catch {
    const bundled = app.isPackaged ? path.join(process.resourcesPath, 'yt-dlp.exe') : path.join(__dirname, '../vendor/yt-dlp.exe');
    try { await fs.copyFile(bundled, downloader.exe); } catch { /* Settings can install the engine if it was not bundled. */ }
  }
  await downloader.clear();
  protocol.handle('mixdesk', request => {
    const u = new URL(request.url);
    if (u.hostname === 'app' && u.pathname === '/mixdesk.png') return net.fetch(pathToFileURL(path.join(__dirname,'../assets/mixdesk.png')).href);
    if (u.hostname === 'audio' && current && u.pathname === '/' + current.id) return serveAudio(request, current.file);
    const allowed = { '/': 'index.html', '/index.html': 'index.html', '/app.js': 'app.js', '/styles.css': 'styles.css' };
    if (u.hostname !== 'app' || !allowed[u.pathname]) return new Response('Not found', { status: 404 });
    return net.fetch(pathToFileURL(path.join(__dirname, '../ui', allowed[u.pathname])).href);
  });
  session.defaultSession.setPermissionRequestHandler((_wc, _permission, callback) => callback(false));
  session.defaultSession.setPermissionCheckHandler(() => false);
  handle('settings:get', () => store.public());
  handle('settings:set', data => {
    const patch = {};
    if (['pl','en'].includes(data?.language)) patch.language = data.language;
    if (['light','dark'].includes(data?.theme)) patch.theme = data.theme;
    if (Number.isFinite(data?.volume)) patch.volume = Math.min(1, Math.max(0, data.volume));
    store.save(patch); return store.public();
  });
  handle('profile:public', async name => {
    const profile = await mixcloud.profile(username(name));
    store.secret('token', ''); store.save({ profile }); return store.public();
  });
  handle('auth:token', connect);
  handle('auth:developer-panel', async () => {
    await shell.openExternal('https://www.mixcloud.com/developers/');
    return true;
  });
  handle('auth:start', async data => {
    if (!data || !/^[\w-]{1,200}$/.test(data.clientId) || typeof data.secret !== 'string' || !data.secret.trim()) throw new Error('OAUTH_CONFIG');
    // Personal OAuth credentials remain only in memory for this five-minute exchange.
    oauth = { clientId: data.clientId, secret: data.secret.trim(), expires: Date.now() + 300000 };
    store.save({ clientId: data.clientId });
    await shell.openExternal('https://www.mixcloud.com/oauth/authorize?' + new URLSearchParams({ client_id: data.clientId }));
    return true;
  });
  handle('auth:code', async code => {
    if (!oauth || oauth.expires < Date.now()) throw new Error('OAUTH_CONFIG');
    if (typeof code !== 'string' || !code.trim() || code.length > 4096) throw new Error('INVALID_REQUEST');
    const params = new URLSearchParams({ client_id: oauth.clientId, client_secret: oauth.secret, code: code.trim() });
    const response = await fetch('https://www.mixcloud.com/oauth/access_token?' + params, { signal: AbortSignal.timeout(25000), redirect: 'error' });
    if (!response.ok) throw new Error('AUTH_EXPIRED');
    const text = await response.text(); let token;
    try { token = JSON.parse(text).access_token; } catch { token = new URLSearchParams(text).get('access_token'); }
    const result = await connect(token); oauth = null; return result;
  });
  handle('auth:logout', () => { oauth = null; store.secret('token', ''); store.save({ profile: null, history: [] }); return store.public(); });
  handle('library:page', data => mixcloud.page({ ...data, name: store.data.profile?.username || store.data.profile?.key?.split('/')[1] }, store.readSecret('token')));
  handle('player:prepare', async url => {
    const item = await downloader.prepare(url);
    current = item;
    store.save({ history: [{ name: item.title, creator: item.creator, url: item.url, image: item.image, duration: item.duration, kind: 'show' }, ...(store.data.history || []).filter(x => x.url !== item.url)].slice(0,50) });
    await downloader.clear(current.file);
    const { file, ...publicItem } = item;
    return { ...publicItem, source: 'mixdesk://audio/' + item.id };
  });
  handle('player:cancel', () => downloader.cancel());
  handle('tools:version', () => downloader.version());
  handle('tools:update', () => downloader.update());
  handle('cache:clear', () => downloader.clear(current?.file));
  app.setAppUserModelId('pl.mixdesk.player');
  window = new BrowserWindow({ width: 1280, height: 860, minWidth: 940, minHeight: 690, title: 'MixDesk', icon: path.join(__dirname, '../assets/mixdesk.ico'), backgroundColor: '#11141c', autoHideMenuBar: true, webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());
  await window.loadURL('mixdesk://app/');
});
app.on('window-all-closed', () => app.quit());
app.on('before-quit', () => downloader?.cancel());
