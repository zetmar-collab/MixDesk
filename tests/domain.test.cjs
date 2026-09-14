const { test } = require('node:test');
const assert = require('node:assert/strict');
const { webUrl, username, apiUrl, normalize } = require('../electron/domain.cjs');
const { checksumFor } = require('../electron/ytdlp.cjs');
test('accepts public track URLs without shell interpretation', () => {
 assert.equal(webUrl('https://www.mixcloud.com/a/b/?x=$(calc)'), 'https://www.mixcloud.com/a/b/?x=$(calc)');
 for (const input of ['file:///C:/secret','--exec calc','javascript:alert(1)','https://localhost/a','http://127.0.0.1','http://[::1]','https://user:pass@example.com','https://host.local/','https://site.com:9999']) assert.throws(() => webUrl(input), /INVALID_URL/);
});
test('normalizes profiles and prevents API host injection', () => {
 assert.equal(username('https://www.mixcloud.com/NTSRadio/'), 'NTSRadio');
 assert.throws(() => username('https://evil.com/name'), /INVALID_PROFILE/);
 assert.throws(() => username('../me?access_token=evil'), /INVALID_PROFILE/);
 assert.throws(() => apiUrl('https://evil.com/?access_token=secret','secret'), /INVALID_API_URL/);
 assert.throws(() => apiUrl('//evil.com/path','secret'), /INVALID_API_URL/);
 assert.equal(apiUrl('/me/?access_token=stale', 'new').searchParams.get('access_token'),'new');
 assert.equal(apiUrl('/me/?access_token=stale').searchParams.has('access_token'),false);
});
test('normalization tolerates missing fields and rejects unsafe artwork', () => {
 assert.equal(normalize({name:'<script>',pictures:{large:'javascript:alert(1)'}}).image,'');
 assert.equal(normalize({name:'<script>'}).name,'<script>');
 assert.equal(normalize({}).duration,0);
});
test('checksum parser matches exact asset name', () => {
 const hash = 'a'.repeat(64);
 assert.equal(checksumFor(`${'b'.repeat(64)}  yt-dlp.exe.sig\n${hash}  yt-dlp.exe`, 'yt-dlp.exe'),hash);
 assert.throws(() => checksumFor('bad  yt-dlp.exe','yt-dlp.exe'), /UPDATE_CHECKSUM/);
});
