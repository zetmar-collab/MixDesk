# MixDesk — odtwarzacz Mixcloud dla Windows
![Logo](https://github.com/zetmar-collab/MixDesk/blob/main/docs/ChatGPT%20Image%2015%20wrz%202026%2C%2004_26_12.png)

Gotowy program: **`dist/MixDesk.exe`**. To aplikacja Windows x64 z własną ikoną; nie wymaga instalowania Node.js, Pythona ani yt-dlp. Silnik yt-dlp jest dołączony do EXE i można aktualizować go w ustawieniach.

**[Pobierz MixDesk.exe dla Windows](https://github.com/zetmar-collab/MixDesk/releases/latest/download/MixDesk.exe)** · [Wydania i sumy kontrolne](https://github.com/zetmar-collab/MixDesk/releases)

## Pierwsze uruchomienie

1. Uruchom `MixDesk.exe` dwukrotnym kliknięciem.
2. Wklej adres pojedynczego utworu i wybierz **Odtwórz link**, albo wybierz miks na ekranie Start.
3. W **Połącz z Mixcloud** wpisz nazwę użytkownika lub URL profilu, aby przeglądać publiczne polubienia i obserwowanych. Kliknięcie twórcy pokazuje jego miksy.
4. Konto można uwierzytelnić przez OAuth zgodnie z opisem poniżej. Samo wczytanie publicznego profilu nie jest logowaniem.
5. Motyw i język PL/EN zmienisz w prawym górnym rogu lub w Ustawieniach.

Program ma własne okno i własny odtwarzacz. Nie osadza strony ani widgetu Mixcloud. Audio jest najpierw pobierane do pamięci podręcznej; interfejs pokazuje postęp oraz pozwala anulować operację. Odtwarzacz obsługuje pauzę, przewijanie, głośność, wyciszenie, poprzedni/następny utwór i automatyczne przejście przez bieżącą listę. Spacja przełącza odtwarzanie poza polami tekstowymi i oknami dialogowymi.

## Logowanie do Mixcloud

Mixcloud udostępnia logowanie OAuth w systemowej przeglądarce. Nie zapewnia tej aplikacji gotowego identyfikatora klienta. Aby zalogować się przez OAuth:

1. W sekcji OAuth kliknij **Otwórz panel deweloperski Mixcloud**, aby otworzyć [panel Mixcloud](https://www.mixcloud.com/developers/) w przeglądarce. Zarejestruj tam **własną** aplikację i odczytaj Client ID oraz Client Secret.
2. W MixDesk otwórz **Połącz z Mixcloud → Zaloguj się przez Mixcloud OAuth** i wpisz Client ID oraz Client Secret.
3. Wybierz logowanie w przeglądarce. Aplikacja pomija `redirect_uri`; zgodnie z dokumentacją Mixcloud wyświetli kod do skopiowania.
4. Wklej kod w MixDesk i wybierz **Zaloguj**. Sekret klienta jest przechowywany wyłącznie w pamięci na czas wymiany kodu, maksymalnie pięć minut.

Alternatywnie wklej istniejący access token. Token zostaje zaszyfrowany przez Electron safeStorage/Windows DPAPI dla zalogowanego użytkownika Windows. Wylogowanie usuwa token, profil i lokalną historię. Dane OAuth nie są dołączone do programu ani zapisane w repozytorium.

**Dla publicznej dystrybucji z jednym wspólnym Client ID potrzebny będzie własny serwer wymiany kodów OAuth**, aby sekret wspólnego klienta nie trafiał do aplikacji desktopowej. Dostarczona wersja obsługuje osobistą konfigurację OAuth. Autoryzacji prawdziwego konta nie zweryfikowano bez danych użytkownika.

## Aktualizacja, pliki i ograniczenia

- **Ustawienia → Zainstaluj / aktualizuj** pobiera najnowsze oficjalne wydanie yt-dlp z GitHub i weryfikuje SHA-256 przed podmianą pliku.
- Ustawienia: `%APPDATA%\mixdesk\settings.json`; narzędzie i audio: `%APPDATA%\mixdesk\tools\`. Są to dane aplikacji, nie folder obok przenośnego EXE.
- Bufor audio jest czyszczony przy uruchomieniu i po przejściu na nowy utwór. Ustawienia pozwalają wyczyścić go ręcznie, pozostawiając bieżące audio. Pojedynczy plik ma limit 2 GiB; przygotowanie trwa maksymalnie 20 minut.
- Obsługiwane są pojedyncze publiczne adresy HTTP(S) rozpoznawane przez yt-dlp. Listy odtwarzania nie są pobierane zbiorczo. Nie każdy serwis ani każdy format gwarantuje odtwarzanie.
- Token API Mixcloud służy do pobierania biblioteki. Nie jest przekazywany jako sesja przeglądarki do yt-dlp. Treści prywatne, płatne, ograniczone regionalnie, wymagające cookies lub DRM mogą być niedostępne. Dodatkowych runtime'ów JavaScript i FFmpeg nie dołączono.
- EXE ma własną ikonę i nie ma podpisu certyfikatem wydawcy.

## Budowanie ze źródeł

Wymagane do developmentu: Windows x64, Node.js i npm. Dla użytkownika gotowego EXE te zależności nie są wymagane.

```powershell
npm ci
npm start
npm test
npm run test:ui
npm run build
```

`npm run build` tworzy `dist/MixDesk.exe`; `npm run pack` tworzy rozpakowaną aplikację. `vendor/yt-dlp.exe` zawiera zweryfikowany oficjalny silnik. Własną ikonę można odtworzyć poleceniem `python scripts/icon.py` po zainstalowaniu Pillow. To narzędzie deweloperskie, nie zależność programu.

Test integracyjny na rzeczywistym Mixcloud: `node tests/live.cjs`. Pobiera publiczny miks, odtwarza go z wyciszeniem i sprawdza przewijanie; wymaga internetu. Testy jednostkowe nie wymagają sieci. Wyniki i zrzuty ekranu powstają w `test-results/`.

## Dokumentacja projektu

- [Architektura, moduły i plan testów](docs/ARCHITECTURE.md)
- [Rekomendacje automatyzacji Codex](docs/AUTOMATION-RECOMMENDATIONS.md)
- [Lista zmian](CHANGELOG.md)
- [Licencja](LICENSE)

Źródła integracji: [Mixcloud API i OAuth](https://www.mixcloud.com/developers/), [yt-dlp](https://github.com/yt-dlp/yt-dlp), [bezpieczeństwo Electron](https://www.electronjs.org/docs/latest/tutorial/security).
