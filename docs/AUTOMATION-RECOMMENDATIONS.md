## Rekomendacje automatyzacji Codex

### Profil projektu
- Typ i języki: aplikacja Windows, JavaScript, HTML, CSS; pomocniczy generator ikony w Pythonie.
- Frameworki oraz kluczowe zależności: Electron 44.3.0, electron-builder 26.15.3, Playwright 1.63.0, yt-dlp.
- Testy i CI: testy node:test, rzeczywiste okno Electron w Playwright i osobny test Mixcloud na żywo. Nie skonfigurowano zdalnego CI.
- Istotne ryzyka: tokeny OAuth, aktualizacja programu wykonywalnego, zmiany zewnętrznego API i odtwarzanie multimediów.

### Rekomendacje
#### AGENTS.md — reguły integracji i sekretów
- Dlaczego: autoryzacja, proces yt-dlp oraz parser adresów mają istotne granice zaufania.
- Korzyść: przyszłe zmiany zachowują sandbox, walidację IPC, brak sekretów w rendererze i checksumy aktualizacji.
- Koszt i kompromisy: krótki dokument wymagający aktualizacji przy zmianie architektury.
- Wdrożenie: wersjonowane w projekcie; **rekomendacja, niewdrożona**.
- Następny krok: spisać trwałe reguły wraz z poleceniami kontroli.

#### Polecenia projektu i CI — Windows release checks
- Dlaczego: uruchomienie audio i ikona zasobów PE wymagają sprawdzenia na Windows.
- Korzyść: testy przed pakowaniem, kontrola EXE, wersji i integralności dołączonego yt-dlp.
- Koszt i kompromisy: runner Windows i czas pakowania; testy na żywo mogą zależeć od sieci.
- Wdrożenie: repozytorium i CI; lokalne polecenia test/build już powstały w ramach budowy aplikacji, **zdalne CI jest tylko rekomendacją**.
- Następny krok: po utworzeniu repozytorium dodać workflow uruchamiany ręcznie i przy wydaniach; testy na żywo pozostawić opcjonalne.

### Priorytet wdrożenia
1. Trwałe reguły `AGENTS.md` dla sekretów, IPC i aktualizacji.
2. Windows CI kontrolujący testy oraz wynikowy EXE.

Nie instalowano pluginów, nie zmieniano osobistego `config.toml` i nie konfigurowano MCP. Którą z rekomendacji chcesz wdrożyć w następnym kroku?
