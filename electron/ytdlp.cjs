const fs = require('node:fs/promises');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { createHash, randomUUID } = require('node:crypto');
const { webUrl } = require('./domain.cjs');
const RELEASE = 'https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest';
function checksumFor(text, name) {
  const row = text.split(/\r?\n/).find(line => line.trim().split(/\s+/).at(-1)?.replace(/^\*/, '') === name);
  const hash = row?.trim().split(/\s+/)[0];
  if (!/^[a-f0-9]{64}$/i.test(hash || '')) throw new Error('UPDATE_CHECKSUM');
  return hash.toLowerCase();
}
class Ytdlp {
  constructor(dir, notify = () => {}) { this.dir = dir; this.exe = path.join(dir, 'yt-dlp.exe'); this.cache = path.join(dir, 'audio'); this.notify = notify; this.active = null; this.updating = false; this.preparing = false; }
  async version() { try { return (await this.run(['--version'], false, 15000)).trim(); } catch { return null; } }
  run(args, track = false, timeout = 120000) {
    return new Promise((resolve, reject) => {
      const child = spawn(this.exe, args, { windowsHide: true, shell: false });
      if (track) this.active = child;
      let out = '', err = '', ended = false;
      const timer = setTimeout(() => { child.kill(); finish(new Error('TIMEOUT')); }, timeout);
      const finish = (error) => { if (ended) return; ended = true; clearTimeout(timer); if (this.active === child) this.active = null; error ? reject(error) : resolve(out); };
      child.stdout.on('data', chunk => {
        out += chunk.toString();
        if (out.length > 8e6) { child.kill(); return finish(new Error('OUTPUT_TOO_LARGE')); }
        const matches = chunk.toString().match(/\[download\]\s+([\d.]+)%/g);
        if (matches?.length) this.notify({ type: 'download', percent: parseFloat(matches.at(-1).match(/[\d.]+/)[0]) });
      });
      child.stderr.on('data', chunk => { err = (err + chunk.toString()).slice(-4000); });
      child.on('error', () => finish(new Error('YTDLP_MISSING')));
      child.on('close', code => finish(code === 0 ? null : new Error(code === null ? 'CANCELLED' : 'PLAYBACK_FAILED', { cause: err.replace(/https?:\/\/\S+/g, '[URL]') })));
    });
  }
  cancel() { this.active?.kill(); }
  async update() {
    if (this.updating || this.preparing || this.active) throw new Error('BUSY');
    this.updating = true;
    try {
      await fs.mkdir(this.dir, { recursive: true });
      const res = await fetch(RELEASE, { signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw new Error('UPDATE_FAILED');
      const release = await res.json();
      const getAsset = async name => {
        const url = release.assets?.find(x => x.name === name)?.browser_download_url;
        if (!url || !url.startsWith('https://github.com/yt-dlp/yt-dlp/releases/download/')) throw new Error('UPDATE_FAILED');
        const r = await fetch(url, { signal: AbortSignal.timeout(180000) });
        if (!r.ok) throw new Error('UPDATE_FAILED');
        return Buffer.from(await r.arrayBuffer());
      };
      this.notify({ type: 'update' });
      const hashes = await getAsset('SHA2-256SUMS');
      const binary = await getAsset('yt-dlp.exe');
      if (createHash('sha256').update(binary).digest('hex') !== checksumFor(hashes.toString(), 'yt-dlp.exe')) throw new Error('UPDATE_CHECKSUM');
      await fs.writeFile(this.exe + '.new', binary);
      await fs.rename(this.exe + '.new', this.exe);
      return await this.version();
    } finally { this.updating = false; }
  }
  async prepare(value) {
    const url = webUrl(value);
    if (this.preparing || this.active || this.updating) throw new Error('BUSY');
    this.preparing = true;
    const id = randomUUID();
    const output = path.join(this.cache, `${id}.%(ext)s`);
    try {
      await fs.mkdir(this.cache, { recursive: true });
      const raw = await this.run(['--ignore-config','--no-playlist','--no-warnings','--no-colors','--newline','--progress','--no-mtime','--socket-timeout','30','--retries','3','--fragment-retries','3','--max-filesize','2G','--format','bestaudio[protocol=https]/bestaudio[protocol=http]/bestaudio/best','--output',output,'--print','after_move:__RESULT__%()j','--',url], true, 1200000);
      const line = raw.split(/\r?\n/).find(l => l.startsWith('__RESULT__'));
      if (!line) throw new Error('PLAYBACK_FAILED');
      const info = JSON.parse(line.slice(10));
      const file = (await fs.readdir(this.cache)).find(f => f.startsWith(id + '.') && !/\.(part|ytdl|json)$/.test(f));
      if (!file) throw new Error('PLAYBACK_FAILED');
      return { id, file: path.join(this.cache, file), title: String(info.title || url), creator: String(info.uploader || ''), duration: Number(info.duration) || 0, image: info.thumbnail || '', url };
    } catch (error) {
      for (const file of await fs.readdir(this.cache).catch(() => [])) if (file.startsWith(id + '.')) await fs.rm(path.join(this.cache, file), { force: true }).catch(() => {});
      throw error;
    } finally { this.preparing = false; }
  }
  async clear(keep) {
    if (this.active) throw new Error('BUSY');
    await fs.mkdir(this.cache, { recursive: true });
    for (const file of await fs.readdir(this.cache)) if (path.join(this.cache, file) !== keep) await fs.rm(path.join(this.cache, file), { force: true }).catch(() => {});
  }
}
module.exports = { Ytdlp, checksumFor };
