const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { byteRange, serveAudio } = require('../electron/media.cjs');
test('audio ranges support seeking, suffix reads and reject invalid ranges', () => {
 assert.deepEqual(byteRange('bytes=5-',10),{start:5,end:9});
 assert.deepEqual(byteRange('bytes=-3',10),{start:7,end:9});
 assert.deepEqual(byteRange('bytes=2-100',10),{start:2,end:9});
 for (const range of ['bytes=20-','bytes=5-2','bytes=1-2,5-6','bytes=-0','bytes=-','evil']) assert.throws(() => byteRange(range,10));
});
test('audio protocol returns actual partial bytes and 416 for out-of-range requests',async () => {
 const dir = await fs.mkdtemp(path.join(os.tmpdir(),'mixdesk-media-')); const file=path.join(dir,'test.mp3');
 try {
  await fs.writeFile(file,'0123456789');
  const response = await serveAudio(new Request('https://audio.test',{headers:{range:'bytes=3-6'}}),file);
  assert.equal(response.status,206); assert.equal(response.headers.get('Content-Range'),'bytes 3-6/10'); assert.equal(await response.text(),'3456');
  const invalid = await serveAudio(new Request('https://audio.test',{headers:{range:'bytes=11-'}}),file); assert.equal(invalid.status,416);
 } finally { await fs.rm(dir,{recursive:true,force:true}); }
});
