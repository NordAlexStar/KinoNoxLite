# KINO NOX Lite

Statiskā PB7 mācību lietotne. Atveriet `index.html` pārlūkā: nav vajadzīgs .NET, datubāze, internets vai serveris. Vietējā mapē `assets/` atrodas kino zāles un filmu plakātu attēli.

**Versija 0.3.0**

## Kas ir lokāls

- katalogs ar alfabētisku kārtojumu, žanra filtru un filtru **Šodien**;
- filmas kartīte ar režisoru, aktieriem, vērtējumu un treileri;
- seansi ar datumu, laiku, zāli un cenu (grupēti pa dienām);
- vietu plāns ar 10 minūšu rezervācijas taimeri;
- biļešu veidi (pieaugušo, skolēna, studenta, seniora, bērnu) ar atšķirīgām cenām;
- atlaižu kodi, cenu kopsavilkums ar PVN, digitālā biļete ar cenu un datumu;
- maksājuma forma ar kartes laukiem (numurs, vārds, derīguma termiņš, CVC) un ievades pārbaudi;
- maksājums tiek apstrādāts uzreiz: pēc apstiprināšanas redzams stāvoklis «Maksājums tiek apstrādāts…», un iznākums (apstiprināts, maksājuma atsauce, laiks, maskēti kartes pēdējie 4 cipari) parādās biļetē vienā solī;
- CVC kods netiek saglabāts ne `localStorage`, ne pasūtījumā — glabājas tikai maskēti `•••• 1234` un maksājuma atsauce;
- profils ar reģistrāciju, paroles prasībām, bloķēšanu un pagaidu paroli;
- parole glabājas **jaucējvērtībā** (lietotāja sāls + 1000 reižu SHA-256), nevis atklātā tekstā; vecāki dati tiek pārrakstīti automātiski pirmajā atvēršanā;
- biļetes atcelšana (ne vēlāk kā 24 h pirms seansa) un naudas atmaksa;
- operatora panelis ar pieslēgšanos: filmu pievienošana, labošana, dzēšana, seansu izveide un atcelšana, atlaižu kodu pārvaldība, audita žurnāls;
- dati tiek glabāti konkrētā pārlūka `localStorage` glabātuvē;
- poga **Atiestatīt datus** atgriež sākuma stāvokli.

## Kā atvērt

**Vienkāršākais ceļš (ieteicams studentiem):** lejupielādēt **vienu failu** `standalone/KinoNoxLite.html` un atvērt to ar dubultklikšķi. Tajā jau ir iekšā visa lapa, stili, skripti un attēli — nav vajadzīga neviena papildu mape, serveris vai internets.

Viena faila versiju pārbūvē ar `python3 standalone/build.py` (vajadzīgs Python 3 un Pillow).

**Pilnā versija:** lejupielādēt visu repozitoriju (Code → Download ZIP), atarhivēt un atvērt `index.html`. Šajā versijā attēli tiek ņemti no mapes `assets/`, tāpēc failam jāatrodas blakus `styles.css`, `imagery.css`, `app.js` un `assets/` — citādi lapa paliks bez noformējuma.

Pārbaudīts: ja pārlūks aizliedz `localStorage` (piemēram, stingros drošības režīmos), lietotne turpina darboties un parāda paziņojumu, ka dati netiks saglabāti.

## Maksājuma dati (mācību vide)

Maksājumu pakalpojums šeit ir **simulēts**: nekādi dati nekur netiek sūtīti. Ievadiet tikai testa kartes datus, piemēram:

| Lauks | Piemērs |
|---|---|
| Kartes numurs | `4242 4242 4242 4242` |
| Vārds uz kartes | `MĀCĪBU KARTE` |
| Derīguma termiņš | `12/28` (nākotnē) |
| CVC | `123` |

Īstus kartes datus šeit ievadīt nedrīkst. Pārbaudot saglabāšanu, skatieties pārlūka Storage: CVC kods tur nav atrodams.

## Operatora piekļuve (mācību vide)

Operatora parole: `op2026`

## Mācību robeža

Maksājumu pakalpojums, e-pasta nosūtīšana, vairāku lietotāju vienlaicīga rezervācija un daudzvalodu saskarne šeit ir simulēti vai nav iekļauti.
Lietotne ir paredzēta prasību analīzei, backlog darbam, pieņemšanas kritērijiem un manuālajai testēšanai.

Īstas paroles, īsti maksājumu dati vai persondati nav jāievada. Paroles jaucēšana ir mācību līmenī (sāls + atkārtots SHA-256 pārlūkā); produkcijas sistēmā šeit būtu PBKDF2/argon2 ar lielāku iterāciju skaitu un jaucēšana servera pusē.

## Versiju vēsture

- **0.3.0** — maksājuma forma ar kartes laukiem un ievades pārbaudi (US-08.04); maksājums tiek apstrādāts uzreiz — stāvoklis, iznākums un maksājuma atsauce biļetē (US-08.01); parole glabājas sāls+jaucējvērtībā, vecie dati tiek pārrakstīti (US-13.01).
- **0.2.1** — redzama versija un kājene, mobilā navigācija, treilera logs, pirkuma soļu josla, biļetes druka, tukšie stāvokļi, viena faila lejupielāde.
- **0.2.0** — seansu datumi, filtrs «Šodien», biļešu veidi, 10 minūšu rezervācija, atcelšana ar atmaksu, operatora panelis ar audita žurnālu.
