const fs = require('node:fs');
const { stat } = require('node:fs/promises');
const { Readable } = require('node:stream');
const path = require('node:path');
function byteRange(header, size) {
 if (!header) return null;
 const match = /^bytes=(\d*)-(\d*)$/.exec(header);
 if (!match || (!match[1] && !match[2])) throw new Error('RANGE');
 let start = match[1] ? Number(match[1]) : Math.max(0,size-Number(match[2]));
 let end = match[1] ? (match[2] ? Math.min(Number(match[2]),size-1) : size-1) : size-1;
 if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start<0 || start>=size || end<start) throw new Error('RANGE');
 return {start,end};
}
async function serveAudio(request, file) {
 const { size } = await stat(file);
 const types = {'.m4a':'audio/mp4','.mp4':'audio/mp4','.mp3':'audio/mpeg','.webm':'audio/webm','.ogg':'audio/ogg','.opus':'audio/ogg','.wav':'audio/wav','.aac':'audio/aac','.flac':'audio/flac'};
 const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store'};
 let range;
 try { range = byteRange(request.headers.get('range'),size); } catch { return new Response(null,{status:416,headers:{...headers,'Content-Range':`bytes */${size}`}}); }
 const start = range?.start || 0, end = range?.end ?? size-1;
 headers['Content-Length'] = String(end-start+1);
 if (range) headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
 const body = request.method === 'HEAD' ? null : Readable.toWeb(fs.createReadStream(file,{start,end}));
 return new Response(body,{status:range ? 206 : 200,headers});
}
module.exports = { byteRange, serveAudio };
