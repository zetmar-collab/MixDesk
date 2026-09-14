const { apiUrl, normalize, username } = require('./domain.cjs');
class Mixcloud {
  constructor(fetcher = fetch) { this.fetcher = fetcher; }
  async request(path, token) {
    let response;
    try { response = await this.fetcher(apiUrl(path, token), { signal: AbortSignal.timeout(25000), redirect: 'error' }); } catch { throw new Error('NETWORK'); }
    if (response.status === 429) throw new Error('RATE_LIMIT');
    if ([401,403].includes(response.status)) throw new Error('AUTH_EXPIRED');
    if (response.status === 404) throw new Error('NOT_FOUND');
    if (!response.ok) throw new Error('NETWORK');
    const data = await response.json();
    if (data.error) throw new Error(token ? 'AUTH_EXPIRED' : 'NETWORK');
    return data;
  }
  async profile(name, token) { return normalize(await this.request(token ? '/me/' : `/${username(name)}/`, token), 'user'); }
  async page({ name, section, creator, next, category = 'chillout' }, token) {
    if (!['favorites','following','cloudcasts','popular'].includes(section)) throw new Error('INVALID_REQUEST');
    if (!['chillout','jazz','ambient','house'].includes(category)) throw new Error('INVALID_REQUEST');
    const path = section === 'popular' ? `/categories/${category}/cloudcasts/?limit=30` : `/${username(creator || name)}/${section}/?limit=30`;
    const data = await this.request(next || path, token);
    if (!Array.isArray(data.data)) throw new Error('NETWORK');
    const nextUrl = data.paging?.next ? apiUrl(data.paging.next).href : null;
    return { items: (data.data || []).map(x => normalize(x, section === 'following' ? 'user' : 'show')), next: nextUrl };
  }
}
module.exports = { Mixcloud };
