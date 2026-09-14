const $ = id => document.getElementById(id);
const api = (name, data) => window.mixdesk.call(name, data);
const words = {
 pl: { developerPanel:'Otwórz panel deweloperski Mixcloud ↗', brandTagline:'TWOJA OSOBISTA CZĘSTOTLIWOŚĆ', recordTagline:'ZNAJDŹ SWOJĄ CZĘSTOTLIWOŚĆ', library:'Twoja biblioteka', home:'Start', favorites:'Polubione', following:'Obserwowani', history:'Ostatnio słuchane', settings:'Ustawienia', checking:'Sprawdzanie…', guest:'Twoje konto', connect:'Połącz z Mixcloud', playLink:'Odtwórz link', urlHint:'Mixcloud, YouTube i inne serwisy obsługiwane przez yt-dlp.', eyebrow:'TWÓJ RYTM. TWOJE MIEJSCE.', heroTitle:'Daj się ponieść\ndobrym dźwiękom.', heroText:'Ulubione miksy i twórcy. Wszystko w jednym miejscu,\nbez otwierania kolejnych kart.', connectLibrary:'Połącz swoją bibliotekę', explore:'ODKRYWAJ DŹWIĘKI', popular:'Odkryj nowe brzmienia', refresh:'Odśwież ↻', back:'← Obserwowani', loadMore:'Wczytaj więcej', nothingPlaying:'Czas na dobry miks', selectTrack:'Wybierz utwór lub wklej link', settingsHint:'Dostosuj MixDesk do siebie.', appearance:'Wygląd', dark:'Ciemny', light:'Jasny', interfaceLanguage:'Język interfejsu', engine:'Silnik odtwarzania', update:'Zainstaluj / aktualizuj', updateHint:'Oficjalne wydanie yt-dlp. Integralność pliku sprawdzana przez SHA-256.', cache:'Pamięć podręczna audio', cacheHint:'Bieżący utwór pozostaje dostępny.', clear:'Wyczyść', independent:'Niezależna aplikacja. Nie jest produktem Mixcloud.', yourMixcloud:'Twój Mixcloud', accountHint:'Połącz konto przez OAuth lub przeglądaj publiczną bibliotekę.', publicProfile:'Publiczny profil', loadProfile:'Wczytaj profil', publicHint:'Podaj nazwę użytkownika lub adres profilu. To nie loguje do konta.', oauthTitle:'Zaloguj się przez Mixcloud OAuth', oauthHint:'Dla własnej aplikacji OAuth: wpisz Client ID i Client Secret z panelu deweloperskiego Mixcloud. Logowanie otworzy się w przeglądarce, która wyświetli kod do skopiowania. Sekret pozostaje tylko w pamięci przez 5 minut.', browserLogin:'Otwórz logowanie w przeglądarce', authCode:'Kod autoryzacyjny', login:'Zaloguj', tokenTitle:'Połącz istniejącym tokenem dostępu', tokenHint:'Token zostanie zaszyfrowany przez Windows dla bieżącego użytkownika.', logout:'Odłącz konto i usuń token', filter:'Filtruj…', paste:'Wklej link do utworu lub miksu…', loggedIn:'Konto połączone', publicMode:'Profil publiczny', missing:'Nie zainstalowano', working:'Trwa operacja…', updating:'Pobieranie i weryfikowanie yt-dlp…', updated:'yt-dlp jest gotowy. Wersja: ', cleared:'Pamięć podręczna została wyczyszczona.', loadingAudio:'Przygotowanie audio — pobieranie do pamięci podręcznej…', downloading:'Pobieranie audio: ', cancel:'Anuluj', cancelled:'Anulowano pobieranie.', noProfile:'Twoja biblioteka czeka', noProfileText:'Połącz konto lub wczytaj publiczny profil, aby zobaczyć polubione miksy i obserwowanych twórców.', noItems:'Na razie tu cicho', noItemsText:'Nie ma jeszcze pozycji na tej liście.', noHistory:'Odtwórz swój pierwszy miks', noHistoryText:'Odsłuchane utwory pojawią się tutaj. Zacznij od linku lub popularnych miksów.', noMatches:'Brak wyników filtra', noMatchesText:'Spróbuj krótszej nazwy lub usuń filtr.', failed:'Nie udało się wczytać listy', retry:'Spróbuj ponownie', codeReady:'Zaloguj się w przeglądarce i wklej wyświetlony kod poniżej.', uploaded:'MIKSY TWÓRCY', play:'Odtwórz', viewCreator:'Zobacz miksy', previous:'Poprzedni', next:'Następny', pause:'Pauza', seek:'Przewiń', volume:'Głośność', mute:'Wycisz / włącz dźwięk', close:'Zamknij', theme:'Zmień motyw', language:'Zmień język', error:{ NETWORK:'Brak połączenia z serwisem. Sprawdź internet i spróbuj ponownie.', INVALID_URL:'Wklej poprawny, publiczny adres HTTP lub HTTPS do pojedynczego utworu.', INVALID_PROFILE:'Podaj poprawną nazwę użytkownika Mixcloud lub adres profilu.', NOT_FOUND:'Nie znaleziono profilu lub utworu.', AUTH_EXPIRED:'Autoryzacja wygasła lub odmówiono dostępu. Połącz konto ponownie.', RATE_LIMIT:'Mixcloud ograniczył liczbę zapytań. Spróbuj ponownie za chwilę.', YTDLP_MISSING:'Zainstaluj yt-dlp w Ustawieniach, aby odtwarzać audio.', PLAYBACK_FAILED:'yt-dlp nie mógł przygotować audio. Zaktualizuj go i sprawdź dostępność linku. Serwis może wymagać logowania, dodatkowego dekodera lub ograniczać dostęp.', UPDATE_FAILED:'Nie udało się pobrać yt-dlp. Sprawdź połączenie z GitHub.', UPDATE_CHECKSUM:'Suma kontrolna aktualizacji jest nieprawidłowa. Plik nie został zainstalowany.', TIMEOUT:'Przekroczono czas oczekiwania. Spróbuj ponownie.', BUSY:'Poczekaj na zakończenie bieżącej operacji lub anuluj pobieranie.', OAUTH_CONFIG:'Podaj dane własnej aplikacji OAuth i rozpocznij logowanie ponownie.', ENCRYPTION_UNAVAILABLE:'Windows nie udostępnił szyfrowania. Token nie został zapisany.', CANCELLED:'Anulowano pobieranie.', MEDIA:'Nie można odtworzyć tego formatu audio. Spróbuj innego utworu.', INVALID_REQUEST:'Sprawdź wprowadzone dane.' } },
 en: { developerPanel:'Open Mixcloud developer dashboard ↗', brandTagline:'YOUR PERSONAL FREQUENCY', recordTagline:'FIND YOUR FREQUENCY', library:'Your library', home:'Home', favorites:'Favorites', following:'Following', history:'Recently played', settings:'Settings', checking:'Checking…', guest:'Your account', connect:'Connect Mixcloud', playLink:'Play link', urlHint:'Mixcloud, YouTube and other services supported by yt-dlp.', eyebrow:'YOUR RHYTHM. YOUR SPACE.', heroTitle:'Get lost in\ngreat sounds.', heroText:'Your favorite mixes and creators. All in one place,\nwithout opening another tab.', connectLibrary:'Connect your library', explore:'DISCOVER YOUR SOUND', popular:'Discover new sounds', refresh:'Refresh ↻', back:'← Following', loadMore:'Load more', nothingPlaying:'Time for a great mix', selectTrack:'Choose a show or paste a link', settingsHint:'Make MixDesk your own.', appearance:'Appearance', dark:'Dark', light:'Light', interfaceLanguage:'Interface language', engine:'Playback engine', update:'Install / update', updateHint:'Official yt-dlp release. File integrity verified with SHA-256.', cache:'Audio cache', cacheHint:'The current track remains available.', clear:'Clear', independent:'Independent app. Not a Mixcloud product.', yourMixcloud:'Your Mixcloud', accountHint:'Connect with OAuth or browse a public library.', publicProfile:'Public profile', loadProfile:'Load profile', publicHint:'Enter a username or profile URL. This does not sign you in.', oauthTitle:'Sign in with Mixcloud OAuth', oauthHint:'For your own OAuth application: enter the Client ID and Client Secret from the Mixcloud developer dashboard. Sign in through your browser, then copy the displayed code. The secret stays in memory for five minutes only.', browserLogin:'Open sign-in in browser', authCode:'Authorization code', login:'Sign in', tokenTitle:'Connect with an existing access token', tokenHint:'Windows encrypts the token for the current user.', logout:'Disconnect and remove token', filter:'Filter…', paste:'Paste a link to a track or mix…', loggedIn:'Account connected', publicMode:'Public profile', missing:'Not installed', working:'Working…', updating:'Downloading and verifying yt-dlp…', updated:'yt-dlp is ready. Version: ', cleared:'Audio cache cleared.', loadingAudio:'Preparing audio — downloading to the local cache…', downloading:'Downloading audio: ', cancel:'Cancel', cancelled:'Download cancelled.', noProfile:'Your library awaits', noProfileText:'Connect your account or load a public profile to see your favorite mixes and followed creators.', noItems:'A little quiet here', noItemsText:'There are no items in this list yet.', noHistory:'Play your first mix', noHistoryText:'Your listening history will appear here. Start with a link or a popular mix.', noMatches:'No matching items', noMatchesText:'Try a shorter name or clear the filter.', failed:'Could not load this list', retry:'Try again', codeReady:'Sign in through your browser and paste the displayed code below.', uploaded:'CREATOR’S MIXES', play:'Play', viewCreator:'View mixes', previous:'Previous', next:'Next', pause:'Pause', seek:'Seek', volume:'Volume', mute:'Mute / unmute', close:'Close', theme:'Change theme', language:'Change language', error:{ NETWORK:'Could not connect. Check your internet connection and try again.', INVALID_URL:'Paste a valid public HTTP or HTTPS link to a single track.', INVALID_PROFILE:'Enter a valid Mixcloud username or profile URL.', NOT_FOUND:'Profile or track not found.', AUTH_EXPIRED:'Authorization expired or access was denied. Reconnect your account.', RATE_LIMIT:'Mixcloud is rate limiting requests. Please try again later.', YTDLP_MISSING:'Install yt-dlp in Settings to play audio.', PLAYBACK_FAILED:'yt-dlp could not prepare audio. Update it and check the link. The service may require authentication, an additional decoder or restrict access.', UPDATE_FAILED:'Could not download yt-dlp. Check your GitHub connection.', UPDATE_CHECKSUM:'Update checksum mismatch. The file was not installed.', TIMEOUT:'The operation timed out. Please try again.', BUSY:'Wait for the current operation or cancel the download.', OAUTH_CONFIG:'Enter your own OAuth app credentials and start sign-in again.', ENCRYPTION_UNAVAILABLE:'Windows encryption is unavailable. The token was not saved.', CANCELLED:'Download cancelled.', MEDIA:'This audio format cannot be played. Try another track.', INVALID_REQUEST:'Check the entered information.' } }
};
let settings = { language:'pl', theme:'dark' }, view = 'home', items = [], nextPage = null, creator = null, generation = 0, version = null, busy = false, playing = null, queue = [], queueIndex = -1;
const t = key => words[settings.language][key] || key;
const message = e => words[settings.language].error[e.message] || t('error').NETWORK;
const audio = $('audio');
const time = value => { const n = Math.max(0, Math.floor(Number(value) || 0)); return n >= 3600 ? `${Math.floor(n/3600)}:${String(Math.floor(n/60)%60).padStart(2,'0')}:${String(n%60).padStart(2,'0')}` : `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`; };
function translate() {
 document.documentElement.lang = settings.language; document.body.dataset.theme = settings.theme;
 document.querySelectorAll('[data-i]').forEach(el => { el.textContent = t(el.dataset.i); });
 $('hero').querySelector('h1').style.whiteSpace = 'pre-line'; $('hero').querySelector('p').style.whiteSpace = 'pre-line';
 $('language').textContent = settings.language.toUpperCase(); $('theme').textContent = settings.theme === 'dark' ? '☼' : '☾';
 $('theme-select').value = settings.theme; $('language-select').value = settings.language;
 $('url').placeholder = t('paste'); $('filter').placeholder = t('filter');
 for (const [id,key] of Object.entries({previous:'previous',next:'next',seek:'seek',volume:'volume',mute:'mute',theme:'theme',language:'language',filter:'filter'})) $(id).setAttribute('aria-label',t(key));
 document.querySelectorAll('.close').forEach(x => x.setAttribute('aria-label',t('close')));
 $('account-name').textContent = settings.profile?.name || t('guest');
 $('account-state').textContent = settings.profile ? t(settings.authenticated ? 'loggedIn' : 'publicMode') : t('connect');
 $('connect-button').textContent = settings.profile?.name || t('connect');
 $('connected-info').textContent = settings.profile ? `${settings.profile.name} · ${t(settings.authenticated ? 'loggedIn' : 'publicMode')}` : '';
 $('logout').hidden = !settings.profile; $('client-id').value = settings.clientId || '';
 $('engine-version').textContent = version || t('missing'); $('tool-version').textContent = version || t('missing');
 updateHeading(); renderItems(); updatePlayer();
}
function updateHeading() {
 $('breadcrumb').textContent = t(view); $('hero').hidden = view !== 'home';
 $('section-title').textContent = creator?.name || t(view === 'home' ? 'popular' : view);
 $('section-eyebrow').textContent = t(creator ? 'uploaded' : view === 'home' ? 'explore' : 'library');
 $('creator-back').hidden = !creator; $('category').hidden = view !== 'home';
 document.querySelectorAll('[data-view]').forEach(x => x.classList.toggle('active', x.dataset.view === view));
}
function status(text, cancellable = false) {
 $('status').replaceChildren(); $('status').hidden = !text;
 if (cancellable) { const btn = document.createElement('button'); btn.className = 'subtle'; btn.textContent = t('cancel'); btn.onclick = () => api('player:cancel').catch(e => status(message(e))); $('status').append(btn); }
 $('status').append(document.createTextNode(text));
}
function empty(title, description, action) {
 $('empty').hidden = false; $('empty-title').textContent = title; $('empty-text').textContent = description;
 $('empty-action').hidden = !action;
 if (action) { $('empty-action').textContent = t(action === 'connect' ? 'connect' : 'retry'); $('empty-action').onclick = action === 'connect' ? openAccount : () => load(); }
}
function cover(container, url) {
 if (!url || !/^https:\/\//.test(url)) return;
 const image = document.createElement('img'); image.src = url; image.alt = ''; image.loading = 'lazy'; image.referrerPolicy = 'no-referrer'; image.onerror = () => image.remove(); container.append(image);
}
function renderItems() {
 const grid = $('items'); grid.replaceChildren(); $('empty').hidden = true;
 const filter = $('filter').value.trim().toLocaleLowerCase();
 const filtered = items.filter(x => `${x.name} ${x.creator} ${(x.tags || []).join(' ')}`.toLocaleLowerCase().includes(filter));
 filtered.forEach(item => {
  const card = document.createElement('article'); card.className = 'card' + (item.kind === 'user' ? ' user' : '');
  const art = document.createElement('button'); art.className = 'card-cover'; art.textContent = item.kind === 'user' ? '◎' : '♫'; art.setAttribute('aria-label', `${t(item.kind === 'user' ? 'viewCreator' : 'play')}: ${item.name}`); cover(art, item.image);
  const playIcon = document.createElement('span'); playIcon.className = 'card-play'; playIcon.textContent = item.kind === 'user' ? '↗' : '▶'; art.append(playIcon);
  if (item.duration) { const dur = document.createElement('span'); dur.className = 'card-duration'; dur.textContent = time(item.duration); art.append(dur); }
  art.onclick = () => { if (item.kind === 'user') { creator = item; load(); } else { queue = filtered.filter(x => x.kind !== 'user'); queueIndex = queue.indexOf(item); play(item.url); } };
  const title = document.createElement('h3'); title.textContent = item.name;
  const sub = document.createElement('p'); sub.textContent = item.creator || (item.username ? '@' + item.username : 'Mixcloud');
  const tags = document.createElement('div'); tags.className = 'tags'; tags.textContent = (item.tags || []).join(' · ');
  card.append(art,title,sub,tags); grid.append(card);
 });
 $('load-more').hidden = !nextPage;
 if (!filtered.length) {
  if (!settings.profile && ['following','favorites'].includes(view)) empty(t('noProfile'),t('noProfileText'),'connect');
  else if (filter) empty(t('noMatches'),t('noMatchesText'));
  else empty(t(view === 'history' ? 'noHistory' : 'noItems'),t(view === 'history' ? 'noHistoryText' : 'noItemsText'));
 }
}
async function load(more = false) {
 const gen = ++generation; updateHeading();
 if (!more) { items = []; nextPage = null; }
 if (view === 'history') { settings = await api('settings:get'); items = settings.history || []; renderItems(); return; }
 if (!settings.profile && ['following','favorites'].includes(view)) { renderItems(); return; }
 $('empty').hidden = true;
 if (!more) { $('items').replaceChildren(); for (let i=0;i<4;i++) { const el = document.createElement('div'); el.className = 'skeleton'; $('items').append(el); } }
 $('load-more').disabled = true;
 try {
  const data = await api('library:page', { category: $('category').value, section: creator ? 'cloudcasts' : view === 'home' ? 'popular' : view, creator: creator?.username || creator?.key?.split('/')[1], next: more ? nextPage : null });
  if (gen !== generation) return;
  const seen = new Set(items.map(x => x.key || x.url)); items.push(...data.items.filter(x => !seen.has(x.key || x.url))); nextPage = data.next; renderItems();
 } catch (e) { if (gen !== generation) return; renderItems(); if (!items.length) empty(t('failed'),message(e),'retry'); else status(message(e)); }
 finally { if (gen === generation) $('load-more').disabled = false; }
}
function openAccount() { $('account-dialog').showModal(); }
function updatePlayer() {
 $('toggle-play').disabled = !playing; $('toggle-play').textContent = audio.paused ? '▶' : 'Ⅱ'; $('toggle-play').setAttribute('aria-label', t(audio.paused ? 'play' : 'pause'));
 if (playing) { $('track-title').textContent = playing.title; $('track-creator').textContent = playing.creator; }
 $('previous').disabled = busy || queueIndex <= 0; $('next').disabled = busy || queueIndex < 0 || queueIndex >= queue.length-1;
}
async function play(url) {
 if (busy) { status(t('error').BUSY, true); return; }
 if (!version) { status(t('error').YTDLP_MISSING); $('settings-dialog').showModal(); return; }
 busy = true; audio.pause(); $('url-form').querySelector('button').disabled = true; updatePlayer(); status(t('loadingAudio'),true);
 try {
  const result = await api('player:prepare', url); playing = result; audio.src = result.source; $('player-art').textContent = '♫'; cover($('player-art'), result.image);
  await audio.play(); status(''); if (view === 'history') await load();
 } catch (e) { status(message(e)); }
 finally { busy = false; $('url-form').querySelector('button').disabled = false; updatePlayer(); }
}
async function preference(patch) { try { settings = await api('settings:set', patch); translate(); } catch (e) { status(message(e)); } }
async function formAction(form, fn, output = 'account-status') {
 const buttons = [...form.querySelectorAll('button')]; buttons.forEach(x => x.disabled = true); $(output).textContent = t('working');
 try { await fn(); } catch (e) { $(output).textContent = message(e); } finally { buttons.forEach(x => x.disabled = false); }
}
async function connected(value) { creator = null; settings = value; $('account-status').textContent = ''; $('account-dialog').close(); translate(); await load(); }
document.querySelectorAll('[data-view]').forEach(button => button.onclick = () => { view = button.dataset.view; creator = null; $('filter').value = ''; load().catch(e => status(message(e))); });
['connect-button','hero-connect','account-nav'].forEach(id => $(id).onclick = openAccount);
$('settings-nav').onclick = () => $('settings-dialog').showModal();
document.querySelectorAll('dialog .close').forEach(button => button.onclick = () => button.closest('dialog').close());
$('language').onclick = () => preference({ language: settings.language === 'pl' ? 'en' : 'pl' });
$('theme').onclick = () => preference({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
$('language-select').onchange = e => preference({ language: e.target.value });
$('theme-select').onchange = e => preference({ theme: e.target.value });
$('category').onchange = () => { $('filter').value = ''; load(); };
$('filter').oninput = renderItems; $('refresh').onclick = () => load(); $('load-more').onclick = () => load(true); $('back').onclick = () => { creator = null; load(); };
$('url-form').onsubmit = e => { e.preventDefault(); queue = []; queueIndex = -1; play($('url').value.trim()); };
$('profile-form').onsubmit = e => { e.preventDefault(); formAction(e.target, async () => connected(await api('profile:public', $('profile-name').value))); };
$('token-form').onsubmit = e => { e.preventDefault(); const token = $('access-token').value; $('access-token').value = ''; formAction(e.target, async () => connected(await api('auth:token', token))); };
$('developer-panel').onclick = async () => { try { await api('auth:developer-panel'); } catch(e) { $('account-status').textContent = message(e); } };
$('oauth-form').onsubmit = e => { e.preventDefault(); const secret = $('client-secret').value; $('client-secret').value = ''; formAction(e.target, async () => { await api('auth:start', { clientId: $('client-id').value.trim(), secret }); $('account-status').textContent = t('codeReady'); $('oauth-code').focus(); }); };
$('code-form').onsubmit = e => { e.preventDefault(); const code = $('oauth-code').value; $('oauth-code').value = ''; formAction(e.target, async () => connected(await api('auth:code', code))); };
$('logout').onclick = async () => { try { await connected(await api('auth:logout')); } catch (e) { $('account-status').textContent = message(e); } };
$('update-tool').onclick = async () => {
 $('update-tool').disabled = true; $('settings-status').textContent = t('updating');
 try { version = await api('tools:update'); translate(); $('settings-status').textContent = t('updated') + version; } catch(e) { $('settings-status').textContent = message(e); } finally { $('update-tool').disabled = false; }
};
$('clear-cache').onclick = async () => { try { await api('cache:clear'); $('settings-status').textContent = t('cleared'); } catch(e) { $('settings-status').textContent = message(e); } };
$('toggle-play').onclick = () => { if (!playing) return; if (audio.paused) audio.play().catch(() => status(t('error').MEDIA)); else audio.pause(); };
$('previous').onclick = () => { if (!busy && queueIndex > 0) play(queue[--queueIndex].url); };
$('next').onclick = () => { if (!busy && queueIndex < queue.length-1) play(queue[++queueIndex].url); };
audio.onended = () => { if (queueIndex >= 0 && queueIndex < queue.length-1) play(queue[++queueIndex].url); };
audio.onplay = audio.onpause = updatePlayer;
audio.onerror = () => status(t('error').MEDIA);
audio.ontimeupdate = audio.onloadedmetadata = () => { const duration = Number.isFinite(audio.duration) ? audio.duration : 0; $('elapsed').textContent = time(audio.currentTime); $('duration').textContent = time(duration); $('seek').max = duration || 100; $('seek').value = audio.currentTime; $('seek').disabled = !duration; };
$('seek').oninput = e => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(e.target.value); };
$('volume').oninput = e => { audio.volume = Number(e.target.value); };
$('volume').onchange = () => preference({ volume: audio.volume });
$('mute').onclick = () => { audio.muted = !audio.muted; $('mute').textContent = audio.muted ? '⊘' : '♫'; };
document.addEventListener('keydown', e => { if (e.code === 'Space' && !['INPUT','TEXTAREA','SELECT','BUTTON','SUMMARY'].includes(e.target.tagName) && !document.querySelector('dialog[open]')) { e.preventDefault(); $('toggle-play').click(); } });
window.mixdesk.onProgress(data => { if (data.type === 'download') status(t('downloading') + data.percent.toFixed(1) + '%', true); });
(async () => { settings = await api('settings:get'); audio.volume = settings.volume ?? .8; $('volume').value = audio.volume; version = await api('tools:version'); translate(); await load(); })().catch(e => status(message(e)));
