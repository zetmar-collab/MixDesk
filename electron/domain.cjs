const { isIP } = require('node:net');
function webUrl(value) {
  if (typeof value !== 'string' || value.length > 4096) throw new Error('INVALID_URL');
  let u; try { u = new URL(value.trim()); } catch { throw new Error('INVALID_URL'); }
  const h = u.hostname.toLowerCase();
  if (!['https:', 'http:'].includes(u.protocol) || u.username || u.password || (u.port && !['80','443'].includes(u.port)) || isIP(h) || h.includes(':') || !h.includes('.') || h === 'localhost' || /\.(local|localhost|internal)$/.test(h)) throw new Error('INVALID_URL');
  return u.href;
}
function username(value) {
  let s = String(value || '').trim();
  if (/^https?:/i.test(s)) {
    const u = new URL(webUrl(s));
    if (!['mixcloud.com','www.mixcloud.com'].includes(u.hostname)) throw new Error('INVALID_PROFILE');
    s = u.pathname.split('/').filter(Boolean)[0] || '';
  }
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(s)) throw new Error('INVALID_PROFILE');
  return s;
}
function apiUrl(path, token) {
  const u = new URL(path, 'https://api.mixcloud.com');
  if (u.origin !== 'https://api.mixcloud.com' || u.username || u.password) throw new Error('INVALID_API_URL');
  u.searchParams.delete('access_token');
  if (token) u.searchParams.set('access_token', token);
  return u;
}
function picture(value) {
  try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; }
}
function normalize(item, kind = 'show') {
  return { key: String(item.key || ''), url: String(item.url || ''), name: String(item.name || item.username || ''), username: String(item.username || ''), creator: String(item.user?.name || ''), image: picture(item.pictures?.large || item.pictures?.medium), duration: Number(item.audio_length) || 0, plays: Number(item.play_count) || 0, favorites: Number(item.favorite_count) || 0, tags: (item.tags || []).slice(0,3).map(t => String(t.name || '')), kind };
}
module.exports = { webUrl, username, apiUrl, normalize };
