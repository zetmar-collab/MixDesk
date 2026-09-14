const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Mixcloud } = require('../electron/mixcloud.cjs');
test('loads following then creator uploads, redacts paging tokens', async () => {
 const requests = [];
 const client = new Mixcloud(async u => { requests.push(u); return Response.json({ data:[{key:'/creator/',username:'creator',name:'Creator'}],paging:{next:'https://api.mixcloud.com/alice/following/?offset=30&access_token=secret'} }); });
 const first = await client.page({ name:'alice',section:'following' },'secret');
 assert.equal(first.items[0].kind,'user');
 assert.equal(new URL(first.next).searchParams.has('access_token'),false);
 await client.page({name:'alice',section:'cloudcasts',creator:'creator'},'secret');
 assert.equal(requests[1].pathname,'/creator/cloudcasts/');
 assert.equal(requests[1].searchParams.get('access_token'),'secret');
});
test('does not follow malicious pagination or HTTP redirects', async () => {
 const client = new Mixcloud(async (_u, options) => { assert.equal(options.redirect,'error'); return Response.json({data:[],paging:{next:'https://evil.com/'}}); });
 await assert.rejects(client.page({section:'popular'}),/INVALID_API_URL/);
});
test('maps revocation, rate limiting, missing profiles and network failures', async () => {
 for (const [status,code] of [[401,'AUTH_EXPIRED'],[403,'AUTH_EXPIRED'],[404,'NOT_FOUND'],[429,'RATE_LIMIT'],[500,'NETWORK']]) {
  await assert.rejects(new Mixcloud(async () => new Response('',{status})).profile('alice'), new RegExp(code));
 }
 await assert.rejects(new Mixcloud(async () => {throw Error('sensitive URL');}).profile('alice'),/^Error: NETWORK$/);
});
