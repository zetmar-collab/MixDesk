# Weryfikacja — 14 września 2026

## Zaliczone

- 10 testów jednostkowych i integracyjnych: walidacja adresów, domena API, paginacja, błędy autoryzacji i sieci, tokeny, checksumy i HTTP Range.
- Testy UI w rzeczywistym Electron 44.3.0: PL/EN, motyw jasny/ciemny, nawigacja, walidacja profilu, ustawienia i sandbox.
- Oficjalny yt-dlp 2026.08.19: pierwsza instalacja oraz aktualizacja istniejącego pliku, obie z SHA-256.
- Mixcloud na żywo: publiczny profil NTSRadio, 30 pozycji strony obserwowanych, 30 publikacji, poprawna pusta lista polubień tego profilu.
- Pobranie i odtworzenie miksu „La Cosecha Internacional w/ ONLY KIXY - 10th September 2026”, czas odczytany przez odtwarzacz: 3604,14 s. Sprawdzone przewinięcie do 60. sekundy i zapis historii.
- YouTube na żywo: pobranie „Me at the zoo” przez yt-dlp do WebM oraz odtwarzanie poprzez interfejs zbudowanego programu Windows, z wyciszeniem.
- Zbudowany program: `app.isPackaged = true`, dołączony silnik, wklejenie URL, odtwarzanie, pauza, publiczny profil i obserwowani.
- Ikona odczytana bezpośrednio z zasobów PE przez Windows `ExtractAssociatedIcon`.
- `npm audit --omit=dev`: 0 zgłoszonych podatności.

## Zakres nieweryfikowany

- Zalogowanie do prywatnego konta OAuth: wymaga danych aplikacji oraz udziału użytkownika. Obsługa nie jest przedstawiana jako sprawdzona autoryzacja konta.
- Treści prywatne, płatne, wymagające cookies, DRM oraz wszystkie pozostałe serwisy yt-dlp.
- Instalacja na odrębnym, czystym komputerze Windows i podpis certyfikatem wydawcy.

Testy sieciowe potwierdzają działanie wskazanych przykładów w dniu testu, nie gwarantują przyszłej dostępności zewnętrznych usług.
