# Architektura MixDesk

## Wymagania i zakres

Windows x64, własny interfejs PL/EN i motyw jasny/ciemny; OAuth Mixcloud, publiczny profil, polubienia, obserwowani i ich publikacje; pojedynczy URL obsługiwany przez yt-dlp; aktualizacja silnika i samodzielny EXE z ikoną. Listy korzystają z paginacji po 30 pozycji i filtra aktualnie wczytanych wyników. Brak osadzonej strony Mixcloud.

Electron wybrano ze względu na integrację procesów Node.js, multimediów Chromium i dostępny zestaw narzędzi Windows. Tauri wymagałby w tym środowisku instalacji kompilatora Rust i osobnej integracji procesów. Kosztem Electron jest większy pakiet i pamięć procesu Chromium; wydajności RAM nie mierzono.

## Diagram

```text
UI HTML / CSS / JavaScript (sandbox, CSP, własna domena mixdesk://app)
  → preload: jawna lista metod
    → IPC: walidacja nadawcy i parametrów
      ├─ Mixcloud REST API / OAuth → znormalizowane metadane
      ├─ Store → JSON + token chroniony Windows DPAPI
      └─ Ytdlp → proces bez powłoki → lokalny plik audio
                    ↑ oficjalna aktualizacja + SHA-256
HTMLAudioElement ← mixdesk://audio/<losowy identyfikator>
                    ← odczyt pliku z obsługą HTTP Range
```

## Moduły

- `electron/main.cjs`: cykl życia okna, IPC, rejestracja protokołu, OAuth, historia.
- `electron/domain.cjs`: URL, profile, ograniczenie domeny API i normalizacja.
- `electron/mixcloud.cjs`: REST, paginacja, mapowanie błędów.
- `electron/store.cjs`: atomowy zapis ustawień i szyfrowanie.
- `electron/ytdlp.cjs`: aktualizacje, proces pobierania, timeout, anulowanie i czyszczenie.
- `electron/media.cjs`: częściowe odpowiedzi 206/416 dla przewijania.
- `electron/preload.cjs`: ograniczony most komunikacyjny.
- `ui/`: własny interfejs, słownik PL/EN, odtwarzacz.
- `assets/`: autorska ikona; `vendor/`: oficjalny yt-dlp.
- `tests/`: jednostkowe, UI i integracyjne na żywo.

## Schemat przechowywania

Mały, pojedynczy JSON wystarcza dla preferencji i 50 wpisów historii; SQLite nie jest potrzebne przy tym zakresie. Proces główny jest jedynym piszącym. Zapis odbywa się przez plik tymczasowy i zmianę nazwy.

```text
settings = {
 language: "pl" | "en", theme: "light" | "dark", volume: 0..1,
 profile: { key, username, name, image, url, kind },
 clientId: string,
 token: base64(DPAPI(access_token)) | null,
 history: [{ name, creator, url, image, duration, kind }] // max 50
}
```

Sekret OAuth pozostaje w pamięci procesu, a jawny token nigdy nie trafia do renderera. `settings:get` zwraca tylko ustawienia publiczne i flagę `authenticated`.

## Kontrakty API

| IPC | Wejście | Wynik |
|---|---|---|
| settings:get / settings:set | brak / theme, language, volume | ustawienia publiczne |
| profile:public | username albo URL profilu | profil + ustawienia |
| auth:start / auth:code / auth:token | konfiguracja osobista / kod / token | start logowania / ustawienia |
| auth:logout | brak | wyczyszczone dane konta |
| library:page | section, creator?, category?, next? | items, next |
| player:prepare / player:cancel | URL / brak | metadane i lokalny source / brak |
| tools:version / tools:update | brak | wersja |
| cache:clear | brak | brak |

Wewnętrznie błędy są stabilnymi kodami tłumaczonymi przez UI. Parametry procesu są tablicą argumentów z `--` przed URL, bez `shell: true`; lokalna konfiguracja yt-dlp jest ignorowana. Linki paginacji muszą pozostać w `https://api.mixcloud.com`. Nawigacja okna, nowe okna i uprawnienia webowe są blokowane. Metadane są renderowane przez `textContent`; brak `innerHTML` dla danych sieciowych.

## Widoki i przepływy

Start → kategoria → miks → postęp pobierania → audio.

Konto → publiczny profil lub osobisty OAuth → polubienia / obserwowani → twórca → jego miksy.

Ustawienia → język / motyw / silnik / cache. Stan preferencji zachowuje się między uruchomieniami.

Mixcloud `/popular/` w testowanym API zwracał obiekt profilu zamiast listy. Ekran odkrywania korzysta z działających endpointów `/categories/{category}/cloudcasts/`; nie przedstawia ich jako globalnego rankingu popularności.

## Testy i publikacja

Testy jednostkowe: walidacja URL i domeny, usuwanie tokenów z paginacji, mapowanie błędów API, szyfrowanie i brak sekretów w ustawieniach publicznych, sumy SHA-256, zakresy audio.

Testy UI: uruchomienie rzeczywistego Electron, PL/EN, oba motywy, nawigacja, ustawienia, błędne profile, izolacja renderera.

Test na żywo: profil NTSRadio, listy, pobranie miksu, start odtwarzania i przewinięcie o 60 sekund, historia. OAuth wymaga własnych danych klienta i świadomego zalogowania użytkownika; nie jest symulowany jako udana autoryzacja.

Publikacja: `npm run build`, następnie test EXE. Pakiet jest unsigned; podpis wydawcy i wspólny backend OAuth stanowią odrębne kroki przed publiczną dystrybucją. Dołączony yt-dlp można zaktualizować z poziomu aplikacji.
