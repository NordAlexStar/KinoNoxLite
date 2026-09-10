# KINO NOX Lite

Statiskā PB7 mācību lietotne. Atveriet `index.html` pārlūkā: nav vajadzīgs .NET, datubāze, internets vai serveris. Vietējā mapē `assets/` atrodas kino zāles un filmu plakātu attēli.

**Versija 0.2.1**

## Kas ir lokāls

- katalogs ar alfabētisku kārtojumu, žanra filtru un filtru **Šodien**;
- filmas kartīte ar režisoru, aktieriem, vērtējumu un treileri;
- seansi ar datumu, laiku, zāli un cenu (grupēti pa dienām);
- vietu plāns ar 10 minūšu rezervācijas taimeri;
- biļešu veidi (pieaugušo, skolēna, studenta, seniora, bērnu) ar atšķirīgām cenām;
- atlaižu kodi, cenu kopsavilkums ar PVN, digitālā biļete ar cenu un datumu;
- biļetes atcelšana (ne vēlāk kā 24 h pirms seansa) un naudas atmaksa;
- profils ar reģistrāciju, paroles prasībām, bloķēšanu un pagaidu paroli;
- operatora panelis ar pieslēgšanos: filmu pievienošana, labošana, dzēšana, seansu izveide un atcelšana, atlaižu kodu pārvaldība, audita žurnāls;
- dati tiek glabāti konkrētā pārlūka `localStorage` glabātuvē;
- poga **Atiestatīt datus** atgriež sākuma stāvokli.

## Kā atvērt

**Vienkāršākais ceļš (ieteicams studentiem):** lejupielādēt **vienu failu** `standalone/KinoNoxLite.html` un atvērt to ar dubultklikšķi. Tajā jau ir iekšā visa lapa, stili, skripti un attēli — nav vajadzīga neviena papildu mape, serveris vai internets.

**Pilnā versija:** lejupielādēt visu repozitoriju (Code → Download ZIP), atarhivēt un atvērt `index.html`. Šajā versijā attēli tiek ņemti no mapes `assets/`, tāpēc failam jāatrodas blakus `styles.css`, `imagery.css`, `app.js` un `assets/` — citādi lapa paliks bez noformējuma.

Pārbaudīts: ja pārlūks aizliedz `localStorage` (piemēram, stingros drošības režīmos), lietotne turpina darboties un parāda paziņojumu, ka dati netiks saglabāti.

## Operatora piekļuve (mācību vide)

Operatora parole: `op2026`

## Mācību robeža

Maksājums, e-pasta nosūtīšana, vairāku lietotāju vienlaicīga rezervācija un daudzvalodu saskarne šeit ir simulēti vai nav iekļauti.
Lietotne ir paredzēta prasību analīzei, backlog darbam, pieņemšanas kritērijiem un manuālajai testēšanai.

Īstas paroles, maksājumu dati vai persondati nav jāievada.
