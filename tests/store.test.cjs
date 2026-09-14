const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Store } = require('../electron/store.cjs');
test('public settings never expose secrets; logout removes ciphertext', () => {
 const dir = fs.mkdtempSync(path.join(os.tmpdir(),'mixdesk-test-'));
 try {
  const crypto = {isEncryptionAvailable:() => true, encryptString:s => Buffer.from(s.split('').reverse().join('')),decryptString:b => b.toString().split('').reverse().join('')};
  const store = new Store(dir,crypto); store.secret('token','sensitive');
  assert.equal(store.readSecret('token'),'sensitive'); assert.equal(store.public().token,undefined);
  assert.equal(fs.readFileSync(store.file,'utf8').includes('sensitive'),false);
  store.secret('token',''); assert.equal(store.public().authenticated,false);
  const noEncryption = new Store(dir,{isEncryptionAvailable:() => false});
  assert.throws(() => noEncryption.secret('token','sensitive'),/ENCRYPTION_UNAVAILABLE/);
 } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
