# MixDesk — polityka prywatności / Privacy Policy

Ostatnia aktualizacja / Last updated: 25 września / September 2026

## Polski

MixDesk jest aplikacją komputerową dla Windows wydawaną przez Marka Zettla (zetmar-collab). Nie wymaga założenia konta MixDesk i nie wysyła danych użytkownika na serwer wydawcy.

Po wpisaniu nazwy profilu lub po zalogowaniu aplikacja pobiera profil, obserwowanych i polubione miksy z API Mixcloud. Przy logowaniu przez OAuth użytkownik podaje własny Client ID i Client Secret. Secret i kod autoryzacyjny pozostają w pamięci tylko na czas wymiany kodu (do pięciu minut). Token dostępu jest zapisany lokalnie w postaci zaszyfrowanej przez Windows DPAPI/Electron safeStorage. Nazwa profilu, Client ID, ustawienia języka i motywu, głośność oraz historia odtwarzania są zapisywane lokalnie w katalogu danych aplikacji. Wylogowanie usuwa token, profil i historię. Dane aplikacji można usunąć również przez odinstalowanie jej i usunięcie katalogu danych użytkownika MixDesk.

Podczas odtwarzania adres utworu jest przekazywany do yt-dlp, które łączy się z serwisem udostępniającym wskazaną treść i pobiera audio do lokalnej pamięci podręcznej. Bufor jest czyszczony przy uruchomieniu i zmianie utworu; można go też usunąć w ustawieniach. Funkcja aktualizacji yt-dlp łączy się z GitHub, pobiera plik i sprawdza jego sumę SHA-256. Korzystanie z Mixcloud, GitHub oraz serwisów wskazanych w adresach URL podlega także ich własnym zasadom prywatności.

MixDesk nie używa własnej analityki, reklam ani śledzenia. Aplikacja nie sprzedaje danych osobowych. W sprawach prywatności i żądań dotyczących danych skontaktuj się przez [GitHub Issues](https://github.com/zetmar-collab/MixDesk/issues). Dane są przechowywane na urządzeniu do czasu wylogowania, wyczyszczenia historii lub usunięcia danych aplikacji; wydawca nie ma dostępu do ich lokalnej kopii.

## English

MixDesk is a Windows desktop application published by Marek Zettel (zetmar-collab). It does not require a MixDesk account and does not send user data to a publisher-operated server.

When a profile name is entered or the user signs in, the app retrieves profile, following, and favorites information from the Mixcloud API. OAuth users provide their own Client ID and Client Secret. The secret and authorization code remain in memory only during the code exchange (up to five minutes). The access token is stored locally, encrypted with Windows DPAPI/Electron safeStorage. The profile name, Client ID, language and theme settings, volume, and playback history are stored locally in the app's user-data directory. Signing out removes the token, profile, and history. App data can also be removed by uninstalling the app and deleting its user-data directory.

For playback, the track URL is passed to yt-dlp, which contacts the service hosting that content and downloads audio to a local cache. The cache is cleared at startup and when changing tracks; it can also be cleared in Settings. The yt-dlp updater contacts GitHub, downloads the executable, and checks its SHA-256 digest. Mixcloud, GitHub, and services identified by pasted URLs have their own privacy policies.

MixDesk does not include publisher-operated analytics, ads, or tracking, and does not sell personal data. For privacy questions or data requests, contact the publisher through [GitHub Issues](https://github.com/zetmar-collab/MixDesk/issues). Data remains on the device until sign-out, history clearing, or deletion of app data; the publisher cannot access the local copy.
