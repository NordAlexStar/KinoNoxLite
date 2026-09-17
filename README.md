# KINO NOX Lite

Statiskā PB7 mācību lietotne. Atveriet `index.html` pārlūkā: nav vajadzīgs .NET, datubāze, internets vai serveris. Vietējā mapē `assets/` atrodas kino zāles un filmu plakātu attēli.

**Versija 0.5.0**

## Kas ir lokāls

- katalogs ar alfabētisku kārtojumu, žanra filtru un filtru **Šodien**;
- filmas kartīte ar režisoru, aktieriem, vērtējumu un treileri;
- seansi ar datumu, laiku, zāli un cenu (grupēti pa dienām);
- vietu plāns ar 10 minūšu rezervācijas taimeri;
- septiņi biļešu veidi ar atšķirīgām cenām: pieaugušo, skolēna, studenta, seniora, bērnu, **ģimenes** (no 4 personām, −20 %) un **VIP** (pirmās rindas, +50 %);
- atlaižu kodi ar **termiņu** (tukšs = bez termiņa; beidzies kods tiek noraidīts), cenu kopsavilkums ar PVN, digitālā biļete ar cenu un datumu;
- tukšs atlaižu koda lauks atbild uzreiz: «Lūdzu, ievadiet atlaižu kodu.»;
- maksājuma forma ar kartes laukiem (numurs, vārds, derīguma termiņš, CVC) un ievades pārbaudi;
- maksājums tiek apstrādāts uzreiz: pēc apstiprināšanas redzams stāvoklis «Maksājums tiek apstrādāts…», un iznākums (apstiprināts, maksājuma atsauce, laiks, maskēti kartes pēdējie 4 cipari) parādās biļetē vienā solī;
- CVC kods netiek saglabāts ne `localStorage`, ne pasūtījumā — glabājas tikai maskēti `•••• 1234` un maksājuma atsauce;
- profils ar reģistrāciju, paroles prasībām, bloķēšanu un pagaidu paroli;
- parole glabājas **jaucējvērtībā** (lietotāja sāls + 1000 reižu SHA-256), nevis atklātā tekstā; vecāki dati tiek pārrakstīti automātiski pirmajā atvēršanā;
- **sesija beidzas pēc 30 minūtēm** (US-13.02): atlikums redzams profilā; kamēr notiek pirkums — vietu izvēle, grozs vai maksājums — laiks tiek atlikts un lietotāju neizraksta;
- biļetes atcelšana (ne vēlāk kā 24 h pirms seansa) un naudas atmaksa;
- **biļetes atcelšana ar saiti no (simulētā) e-pasta**: biļetē ir poga, kas parāda saiti ar biļetes tokenu; saites atvēršana dod atcelšanas ekrānu;
- ja seansu atceļ kinoteātris, pircējam ir **izvēle**: pieprasīt atmaksu vai saņemt citu biļeti tajā pašā filmā;
- operatora panelis ar pieslēgšanos: filmu pievienošana, labošana, dzēšana, seansu izveide, **labošana** un atcelšana, atlaižu kodu pārvaldība (ar termiņu), audita žurnāls;
- **kopīgs vietu stāvoklis starp pārlūka cilnēm** (servera emulācija mācību videi): pirms pirkuma apstiprināšanas aizņemtās vietas tiek pārlasītas no glabātavas, un citu cilņu izmaiņas ienāk uzreiz — divu pircēju scenāriju var izpildīt divās cilnēs;
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

Maksājumu pakalpojums un e-pasta nosūtīšana šeit ir **simulēti**: maksājums tiek apstrādāts uzreiz lokāli, bet e-pasts netiek sūtīts — tā vietā biļetē ir redzama saite, kas e-pastā būtu. Vairāku lietotāju vienlaicīga rezervācija ir **emulēta** pārlūka ietvaros (kopīgs vietu stāvoklis starp cilnēm), jo īsta servera šeit nav; daudzvalodu saskarne nav iekļauta.
Lietotne ir paredzēta prasību analīzei, backlog darbam, pieņemšanas kritērijiem un manuālajai testēšanai.

Īstas paroles, īsti maksājumu dati vai persondati nav jāievada. Paroles jaucēšana ir mācību līmenī (sāls + atkārtots SHA-256 pārlūkā); produkcijas sistēmā šeit būtu PBKDF2/argon2 ar lielāku iterāciju skaitu un jaucēšana servera pusē.

## Versiju vēsture

- **0.4.0** — septiņi biļešu veidi, tostarp ģimenes un VIP (US-06.01 / US-15.04); tukša atlaižu koda lauka paziņojums (US-07.02 / US-15.05); atlaižu koda termiņš operatora panelī (US-07.03 / US-15.11); seansa labošana un strādājoša poga seansa rindā (US-11.01 / US-15.06); biļetes atcelšana ar saiti no e-pasta (US-10.03 / US-15.07); pircēja izvēle pēc kinoteātra atceltā seansa (US-10.04 / US-15.08); kopīgs vietu stāvoklis starp pārlūka cilnēm (US-05.03 / US-15.09); sesijas noildze ar pirkuma aizsardzību (US-13.02 / US-15.10).
- **0.5.0** — desmit prasības ar parametriem (US-16.01…US-16.07, US-16.14, US-16.15, US-16.18): meklēšana pēc nosaukuma; kārtošana pēc kritērija un virziena (izvēle saglabājas); ilguma formāts stundās un minūtēs; kataloga filtrs pēc vecuma reitinga; filtrs pēc cenu grupas ar robežām 8,00 un 10,00 €; rīta seansu atlaide −20 % (robeža 12:00); invalīdu vietas zālēs; atlaižu kods ar minimālo summu; fiksētas summas atlaižu kods (ne vairāk par kopsummu); daļēja biļešu atcelšana.
- **0.3.0** — maksājuma forma ar kartes laukiem un ievades pārbaudi (US-08.04); maksājums tiek apstrādāts uzreiz — stāvoklis, iznākums un maksājuma atsauce biļetē (US-08.01); parole glabājas sāls+jaucējvērtībā, vecie dati tiek pārrakstīti (US-13.01).
- **0.2.1** — redzama versija un kājene, mobilā navigācija, treilera logs, pirkuma soļu josla, biļetes druka, tukšie stāvokļi, viena faila lejupielāde.
- **0.2.0** — seansu datumi, filtrs «Šodien», biļešu veidi, 10 minūšu rezervācija, atcelšana ar atmaksu, operatora panelis ar audita žurnālu.
