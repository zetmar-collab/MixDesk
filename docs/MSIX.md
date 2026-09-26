# Pakiety MSIX MixDesk

## Tożsamość sklepu

| Pole | Wartość |
|---|---|
| Identity Name | `MarekZettel-zetmar.MixDesk` |
| Publisher | `CN=15A53D32-C868-48EE-B700-5DBB5449CA1B` |
| PublisherDisplayName | `Marek Zettel - zetmar` |
| Package Family Name | `MarekZettel-zetmar.MixDesk_411qrz2m02jw4` |
| Store ID | `9NL2G09SQMB4` |
| Architektura | x64 |
| Wersja pakietu | `1.0.0.0` |

PFN jest wyliczany przez Windows z nazwy i wydawcy. SID pakietu jest wyliczany przez system, nie wpisuje się go do manifestu. `Store ID` służy do wskazania produktu w Partner Center i również nie jest polem manifestu. Link sklepu będzie dostępny po publikacji produktu.

## Budowanie

Na Windows x64 z zainstalowanym Windows SDK (`MakeAppx.exe` i `SignTool.exe`), Node.js, npm, Pythonem i Pillow:

```powershell
npm ci
npm run build:msix
```

Skrypt pakuje aktualne źródła Electron, tworzy grafiki MSIX z autorskiej ikony, generuje manifest o wersji z `package.json`, buduje pakiet SHA-256 i kopiuje go jako wariant testowy, który podpisuje certyfikatem z `Cert:\CurrentUser\My`. Wybiera najdłużej ważny certyfikat z dokładnie pasującym Subject, kluczem prywatnym i uprawnieniem Code Signing. Konkretny certyfikat można wskazać przez `-CertificateThumbprint` przy bezpośrednim uruchomieniu `scripts/build-msix.ps1`. Prywatny klucz nie jest eksportowany ani zapisywany w repozytorium.

## Pliki

| Plik w `dist/msix` | Użycie |
|---|---|
| `MixDesk_1.0.0.0_x64_Store.msix` | Przesłanie do Partner Center; brak podpisu. |
| `MixDesk_1.0.0.0_x64_TestSigned.msix` | Instalacja testowa na komputerze ufającym certyfikatowi. |
| `SHA256SUMS.txt` | Kontrola integralności pobranych plików. |

`Add-AppxPackage -Path .\dist\msix\MixDesk_1.0.0.0_x64_TestSigned.msix` instaluje wersję testową. Do jej uruchomienia na innym komputerze wymagane jest zaufanie do certyfikatu publicznego. **Nie udostępniaj prywatnego PFX.** Nie instaluj wariantu Store przez `-AllowUnsigned`: taki tryb testowy wymaga specjalnej tożsamości OID i nie odpowiada podpisanej tożsamości produktu. Oba pakiety mają identyczną zawartość aplikacji i manifest; drugi dodatkowo zawiera podpis.

Jeśli przed kolejną instalacją lub przesłaniem zmieni się kod pakietu, podnieś trzyczęściową wersję w `package.json`. Skrypt dopisze czwarty człon `0`, wymagany dla paczek Store. Pakiet jest przeznaczony dla Windows Desktop 10.0.18362 i nowszych oraz korzysta z `runFullTrust` ze względu na uruchamianie yt-dlp.

## Weryfikacja lokalna

`MakeAppx` zakończył tworzenie pakietu, `SignTool` podpisał i zweryfikował wariant testowy, `Get-AuthenticodeSignature` wskazał `NotSigned` dla Store oraz `Valid` dla TestSigned. `Add-AppxPackage` zainstalował podpisany pakiet, a system zwrócił dokładnie PFN i Publisher z powyższej tabeli. Uruchomiono zainstalowaną aplikację i potwierdzono obecność dołączonego yt-dlp oraz ekranu OAuth.

Zgłoszenie 1 produktu `9NL2G09SQMB4` zostało przesłane do certyfikacji 26.09.2026. Publikacja nastąpi po pomyślnym przejściu certyfikacji. Wariant testowy jest podpisany certyfikatem do lokalnych testów; nie jest certyfikatem wystawianym przez Store.

Źródła: [manifest aplikacji klasycznej i MakeAppx](https://learn.microsoft.com/en-us/windows/msix/desktop/desktop-to-uwp-manual-conversion), [wymagania pakietów Store](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msix/app-package-requirements), [podpisywanie testowe](https://learn.microsoft.com/en-us/windows/msix/package/sign-msix-package-guide).
