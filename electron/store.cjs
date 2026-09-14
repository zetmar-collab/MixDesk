const fs = require('node:fs');
const path = require('node:path');
class Store {
  constructor(dir, encryption) {
    this.file = path.join(dir, 'settings.json'); this.encryption = encryption;
    fs.mkdirSync(dir, { recursive: true });
    try { this.data = JSON.parse(fs.readFileSync(this.file, 'utf8')); } catch { this.data = {}; }
  }
  save(patch) {
    const next = { ...this.data, ...patch };
    fs.writeFileSync(this.file + '.tmp', JSON.stringify(next, null, 2));
    fs.renameSync(this.file + '.tmp', this.file); this.data = next;
  }
  secret(key, value) {
    if (!value) { this.save({ [key]: null }); return; }
    if (!this.encryption.isEncryptionAvailable()) throw new Error('ENCRYPTION_UNAVAILABLE');
    this.save({ [key]: this.encryption.encryptString(value).toString('base64') });
  }
  readSecret(key) {
    if (!this.data[key]) return '';
    try { return this.encryption.decryptString(Buffer.from(this.data[key], 'base64')); } catch { return ''; }
  }
  public() { const { language = 'pl', theme = 'dark', profile = null, clientId = '', history = [], volume = 0.8 } = this.data; return { language, theme, profile, clientId, history, volume, authenticated: !!this.readSecret('token') }; }
}
module.exports = { Store };
