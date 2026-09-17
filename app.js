const KEY = 'kino-nox-lite-v1';
const VERSION = '0.7.0';
const VAT = 0.21;
const MAX_SEATS = 8;
const OPERATOR_PASSWORD = 'op2026';
/* Maksājums tiek apstrādāts uzreiz: simulētā pakalpojuma atbilde (US-08.01). */
const PAY_DELAY = 900;
/* Sesijas noildze (US-13.02 / US-15.10): sesija beidzas pēc definēta laika, bet
   pirkuma gaitā lietotāju neizraksta — tāpēc laiks tiek atlikts uz priekšu, kamēr
   grozs vai vietu izvēle ir atvērta. */
const SESSION_MIN = 30;
/* ================= US-15.01 / US-15.02: valodas maiņa =================
   Valodas maiņa ir redzama jebkurā lapā (galvenē), un tā neskar ievadītos datus:
   pirms pārzīmēšanas lauki tiek nolasīti, pēc pārzīmēšanas — atgriezti atpakaļ.

   Tulkojums notiek pārlūka pusē: pēc katra render() teksta mezgli un atribūti tiek
   pārrakstīti pēc vārdnīcas. Tāpēc nav jāmaina neviens šablons, un nevar palikt
   neapstrādāts fragments, ko klase atrastu. */

const LANGS = [{ id: 'lv', label: 'LV' }, { id: 'ru', label: 'RU' }, { id: 'en', label: 'EN' }];

/* Pilnas frāzes: teikumi un biežākās etiķetes. */
const I18N_FULL = {
  ru: {
    'Filmas': 'Фильмы', 'Profils': 'Профиль', 'Mans profils': 'Мой профиль', 'Pievienot': 'Добавить', 'Mani pasūtījumi': 'Мои заказы', 'Grozs': 'Корзина',
    'Iziet': 'Выйти', 'Pāriet uz saturu': 'Перейти к содержимому', 'Galvenā navigācija': 'Основная навигация',
    'KINO NOX sākumlapa': 'Главная страница KINO NOX', 'Valoda': 'Язык',
    'Saskarnes valoda': 'Язык интерфейса', 'Grozs ir tukšs.': 'Корзина пуста.',
    'Atrodi savu nākamo seansu.': 'Найди свой следующий сеанс.',
    'KINO NOX Lite ir lokāla mācību sistēma. Dati paliek šajā pārlūkā.':
      'KINO NOX Lite — локальная учебная система. Данные остаются в этом браузере.',
    'Izvēlieties filmu, seansu un vietas.': 'Выберите фильм, сеанс и места.',
    'Skatīt filmas': 'Смотреть фильмы', 'Šodien': 'Сегодня', 'Rīt': 'Завтра', 'Visi': 'Все',
    'Meklēt filmu': 'Поиск фильма', 'Piemēram, orbītā': 'Например, orbītā',
    'Kārtot': 'Сортировать', 'Nosaukums': 'Название', 'Ilgums': 'Длительность', 'Vērtējums': 'Оценка',
    'Virziens': 'Направление', 'Augoši': 'По возрастанию', 'Dilstoši': 'По убыванию',
    'Vecuma reitings': 'Возрастной рейтинг', '12+ un augstāk': '12+ и выше', 'Tikai 16+': 'Только 16+',
    'Cena': 'Цена', 'Līdz 8,00 €': 'До 8,00 €', 'No 8,00 līdz 10,00 €': 'От 8,00 до 10,00 €',
    'Virs 10,00 €': 'Свыше 10,00 €', 'Rādīt visas filmas': 'Показать все фильмы',
    '← Atpakaļ uz katalogu': '← Назад к каталогу', 'Aizvērt': 'Закрыть', 'Izvēlēties': 'Выбрать',
    'Pārdošana beigusies': 'Продажа закрыта', 'Treileris nav pieejams.': 'Трейлер недоступен.',
    '▶ Skatīties treileri': '▶ Смотреть трейлер', 'TREILERIS': 'ТРЕЙЛЕР',
    'Rīta atlaide −20 %': 'Утренняя скидка −20 %', 'Rīta atlaide': 'Утренняя скидка',
    'Neviens seanss neatbilst izvēlētajai cenu grupai.':
      'Ни один сеанс не соответствует выбранной ценовой группе.',
    'Izvēlies vietas.': 'Выбери места.', 'EKRĀNS': 'ЭКРАН', 'Brīva': 'Свободно', 'Aizņemta': 'Занято',
    'Izvēlēta': 'Выбрано', 'Invalīdu vieta': 'Место для инвалида',
    'Invalīdu vieta šajā zālē nav': 'В этом зале нет мест для инвалида',
    'Pasūtījums': 'Заказ', 'Seanss': 'Сеанс', 'Datums': 'Дата', 'Vietas': 'Места',
    'Nav izvēlētas': 'Не выбраны', 'Biļetes veids': 'Тип билета', 'Cena par vietu': 'Цена за место',
    'Kopā': 'Итого', 'Turpināt uz grozu': 'Перейти в корзину',
    'Pieaugušo': 'Взрослый', 'Skolēna': 'Школьника', 'Studenta': 'Студента',
    'Seniora (no 60 g.)': 'Пенсионера (от 60 лет)', 'Bērnu (līdz 12 g.)': 'Детский (до 12 лет)',
    'Ģimenes (no 4 personām)': 'Семейный (от 4 человек)', 'VIP (pirmās rindas)': 'VIP (первые ряды)',
    'Pirkuma apstiprināšana': 'Подтверждение покупки', 'Atlaides kods': 'Код скидки',
    'Piemērot': 'Применить', 'Piemēram, BLEGH': 'Например, BLEGH',
    'Lūdzu, ievadiet atlaižu kodu.': 'Пожалуйста, введите код скидки.',
    'Nederīgs atlaides kods.': 'Недействительный код скидки.',
    'Atlaižu koda termiņš ir beidzies.': 'Срок действия кода скидки истёк.',
    'Saņemšanas veids': 'Способ получения',
    'Biļete tiks parādīta uzreiz ekrānā. E-pasta nosūtīšana mācību vidē tiek simulēta.':
      'Билет будет показан сразу на экране. Отправка письма в учебной среде симулируется.',
    'Biļetes e-pasts tiek ievadīts maksājuma blokā (laukā «E-pasts biļetei»).':
      'E-mail билета вводится в блоке оплаты (поле «E-mail для билета»).',
    'Maksājuma dati': 'Данные оплаты', 'E-pasts biļetei': 'E-mail для билета', 'E-pasts': 'E-mail',
    'Kartes numurs': 'Номер карты', 'Vārds uz kartes': 'Имя на карте',
    'Derīguma termiņš (MM/GG)': 'Срок действия (ММ/ГГ)', 'CVC': 'CVC',
    'Mācību vide: maksājumu pakalpojums tiek simulēts. Ievadiet tikai testa kartes datus (piemēram, 4242 4242 4242 4242); īstus kartes datus šeit ievadīt nedrīkst.':
      'Учебная среда: платёжный сервис симулируется. Вводите только тестовые данные карты (например, 4242 4242 4242 4242); настоящие данные карты здесь вводить нельзя.',
    'Kopsavilkums': 'Итог', 't. sk. PVN 21%': 'в т.ч. НДС 21%', 'Atlaide': 'Скидка',
    'Apstiprināt pirkumu': 'Подтвердить покупку', 'Maksājums tiek apstrādāts…': 'Платёж обрабатывается…',
    'Maksājums': 'Платёж',
    'Simulētais maksājumu pakalpojums atbild uzreiz — pirkuma iznākums parādīsies šajā lapā.':
      'Симулированный платёжный сервис отвечает сразу — результат покупки появится на этой странице.',
    'Ievadiet derīgu e-pasta adresi.': 'Введите корректный адрес e-mail.',
    'Kartes numuram jābūt 13–19 cipariem.': 'В номере карты должно быть 13–19 цифр.',
    'Ievadiet vārdu uz kartes.': 'Введите имя на карте.',
    'Derīguma termiņu rakstiet formā MM/GG.': 'Укажите срок действия в формате ММ/ГГ.',
    'Derīguma mēnesim jābūt no 01 līdz 12.': 'Месяц срока действия должен быть от 01 до 12.',
    'Kartes derīguma termiņš ir beidzies.': 'Срок действия карты истёк.',
    'CVC kodam jābūt 3 cipariem.': 'CVC-код должен состоять из 3 цифр.',
    'PIRKUMS APSTIPRINĀTS': 'ПОКУПКА ПОДТВЕРЖДЕНА', 'PIRKUMS ATCELTS': 'ПОКУПКА ОТМЕНЕНА',
    'Digitālā biļete': 'Цифровой билет', 'Drukāt biļeti': 'Печать билета',
    'Atcelt biļeti': 'Отменить билет',
    'Sūtīt saiti uz e-pastu (simulēts)': 'Отправить ссылку на e-mail (симуляция)',
    'Simulēts e-pasts': 'Симулированное письмо',
    'Mācību vidē e-pasts netiek sūtīts. Šī ir saite, kas e-pastā būtu — vari to atvērt pats:':
      'В учебной среде письмо не отправляется. Это ссылка, которая была бы в письме — можешь открыть её сам:',
    'Pieslēgties': 'Войти', 'Izveidot kontu': 'Создать аккаунт', 'Aizmirsu paroli': 'Забыл пароль',
    'Parole': 'Пароль', 'Vismaz 8 rakstzīmes': 'Минимум 8 символов',
    'Šis konts ir lokāls šajā pārlūkā. Neievadiet īstu paroli.':
      'Этот аккаунт локален в этом браузере. Не вводите настоящий пароль.',
    'Parolei jābūt vismaz 8 rakstzīmes, ar lielo un mazo burtu, ciparu un speciālo rakstzīmi.':
      'Пароль должен содержать минимум 8 символов: заглавную и строчную буквы, цифру и специальный символ.',
    'Pieslēdzieties vai izveidojiet kontu.': 'Войдите или создайте аккаунт.',
    'Konts un pasūtījumi glabājas tikai šajā pārlūkā.':
      'Аккаунт и заказы хранятся только в этом браузере.',
    'Pasūtījumu vēl nav.': 'Заказов пока нет.',
    'Vieta demonstrācijai produkcijas versijā.': 'Место для демонстрации в производственной версии.',
    'OPERATORA PANELIS': 'ПАНЕЛЬ ОПЕРАТОРА', 'Operatora panelis': 'Панель оператора',
    'Operatora pieslēgšanās': 'Вход оператора', 'Operatora parole': 'Пароль оператора',
    'Mācību parole': 'Учебный пароль', 'Mācību vide': 'Учебная среда', 'Mācību dati': 'Учебные данные',
    'Izmaiņas uzreiz saglabājas šajā pārlūkā. Izmantojiet atiestatīšanu, lai atgrieztu sākuma variantu.':
      'Изменения сразу сохраняются в этом браузере. Используйте сброс, чтобы вернуть исходный вариант.',
    'Atlaižu kodi': 'Коды скидок', 'Audita žurnāls': 'Журнал аудита', 'Labot': 'Изменить',
    'Dzēst': 'Удалить', 'Pievienot seansu': 'Добавить сеанс', 'Atcelt': 'Отменить',
    'Pievienot filmu': 'Добавить фильм', 'Saglabāt seansu': 'Сохранить сеанс',
    'Izveidot seansu': 'Создать сеанс', 'Atcelt labošanu': 'Отменить правку',
    'Jauns seanss': 'Новый сеанс', 'Žanrs': 'Жанр', 'Filmas nosaukums': 'Название фильма',
    'Ilgums minūtēs': 'Длительность в минутах', 'Vecuma ierobežojums': 'Возрастное ограничение',
    'Cena €': 'Цена €', 'Apraksts': 'Описание', 'Laiks': 'Время', 'Zāle': 'Зал', 'Filma': 'Фильм',
    'Jauns kods': 'Новый код', 'Veids': 'Тип', 'Minimālā summa €': 'Минимальная сумма €',
    'Termiņš, ja vajag': 'Срок, если нужен', 'Procenti': 'Проценты',
    'Fiksēta summa €': 'Фиксированная сумма €', 'Pievienot kodu': 'Добавить код',
    'Atiestatīt datus': 'Сбросить данные', 'Atiestatīt visus datus': 'Сбросить все данные',
    'Atcelt daļu biļešu': 'Отменить часть билетов',
    'Atcelt atzīmētās vietas': 'Отменить отмеченные места',
    'Mācību dati ir atiestatīti.': 'Учебные данные сброшены.',
    'Atlaides kods pievienots.': 'Код скидки добавлен.', 'Seanss izveidots.': 'Сеанс создан.',
    'Seanss saglabāts.': 'Сеанс сохранён.',
    'Filma ir pievienota lokālajiem datiem.': 'Фильм добавлен в локальные данные.'
  },
  en: {
    'Filmas': 'Films', 'Profils': 'Profile', 'Mans profils': 'My profile', 'Pievienot': 'Add', 'Mani pasūtījumi': 'My orders', 'Grozs': 'Cart',
    'Iziet': 'Sign out', 'Pāriet uz saturu': 'Skip to content', 'Galvenā navigācija': 'Main navigation',
    'KINO NOX sākumlapa': 'KINO NOX home', 'Valoda': 'Language',
    'Saskarnes valoda': 'Interface language', 'Grozs ir tukšs.': 'Your cart is empty.',
    'Atrodi savu nākamo seansu.': 'Find your next screening.',
    'KINO NOX Lite ir lokāla mācību sistēma. Dati paliek šajā pārlūkā.':
      'KINO NOX Lite is a local training system. Data stays in this browser.',
    'Izvēlieties filmu, seansu un vietas.': 'Choose a film, a screening and seats.',
    'Skatīt filmas': 'Browse films', 'Šodien': 'Today', 'Rīt': 'Tomorrow', 'Visi': 'All',
    'Meklēt filmu': 'Search films', 'Piemēram, orbītā': 'For example, orbītā',
    'Kārtot': 'Sort by', 'Nosaukums': 'Title', 'Ilgums': 'Duration', 'Vērtējums': 'Rating',
    'Virziens': 'Direction', 'Augoši': 'Ascending', 'Dilstoši': 'Descending',
    'Vecuma reitings': 'Age rating', '12+ un augstāk': '12+ and above', 'Tikai 16+': 'Only 16+',
    'Cena': 'Price', 'Līdz 8,00 €': 'Up to € 8.00', 'No 8,00 līdz 10,00 €': '€ 8.00 to € 10.00',
    'Virs 10,00 €': 'Over € 10.00', 'Rādīt visas filmas': 'Show all films',
    '← Atpakaļ uz katalogu': '← Back to catalogue', 'Aizvērt': 'Close', 'Izvēlēties': 'Choose',
    'Pārdošana beigusies': 'Sales closed', 'Treileris nav pieejams.': 'Trailer is not available.',
    '▶ Skatīties treileri': '▶ Watch the trailer', 'TREILERIS': 'TRAILER',
    'Rīta atlaide −20 %': 'Morning discount −20%', 'Rīta atlaide': 'Morning discount',
    'Neviens seanss neatbilst izvēlētajai cenu grupai.':
      'No screening matches the selected price group.',
    'Izvēlies vietas.': 'Choose your seats.', 'EKRĀNS': 'SCREEN', 'Brīva': 'Free', 'Aizņemta': 'Taken',
    'Izvēlēta': 'Selected', 'Invalīdu vieta': 'Wheelchair space',
    'Invalīdu vieta šajā zālē nav': 'No wheelchair space in this hall',
    'Pasūtījums': 'Order', 'Seanss': 'Screening', 'Datums': 'Date', 'Vietas': 'Seats',
    'Nav izvēlētas': 'None selected', 'Biļetes veids': 'Ticket type',
    'Cena par vietu': 'Price per seat', 'Kopā': 'Total', 'Turpināt uz grozu': 'Continue to cart',
    'Pieaugušo': 'Adult', 'Skolēna': 'School pupil', 'Studenta': 'Student',
    'Seniora (no 60 g.)': 'Senior (60+)', 'Bērnu (līdz 12 g.)': 'Child (under 12)',
    'Ģimenes (no 4 personām)': 'Family (4+ people)', 'VIP (pirmās rindas)': 'VIP (front rows)',
    'Pirkuma apstiprināšana': 'Confirm your purchase', 'Atlaides kods': 'Discount code',
    'Piemērot': 'Apply', 'Piemēram, BLEGH': 'For example, BLEGH',
    'Lūdzu, ievadiet atlaižu kodu.': 'Please enter a discount code.',
    'Nederīgs atlaides kods.': 'Invalid discount code.',
    'Atlaižu koda termiņš ir beidzies.': 'The discount code has expired.',
    'Saņemšanas veids': 'Delivery',
    'Biļete tiks parādīta uzreiz ekrānā. E-pasta nosūtīšana mācību vidē tiek simulēta.':
      'The ticket appears on screen right away. Sending e-mail is simulated in the training environment.',
    'Biļetes e-pasts tiek ievadīts maksājuma blokā (laukā «E-pasts biļetei»).':
      'The ticket e-mail is entered in the payment block (field “E-mail for the ticket”).',
    'Maksājuma dati': 'Payment details', 'E-pasts biļetei': 'E-mail for the ticket', 'E-pasts': 'E-mail',
    'Kartes numurs': 'Card number', 'Vārds uz kartes': 'Name on card',
    'Derīguma termiņš (MM/GG)': 'Expiry (MM/YY)', 'CVC': 'CVC',
    'Mācību vide: maksājumu pakalpojums tiek simulēts. Ievadiet tikai testa kartes datus (piemēram, 4242 4242 4242 4242); īstus kartes datus šeit ievadīt nedrīkst.':
      'Training environment: the payment service is simulated. Enter test card data only (for example, 4242 4242 4242 4242); never enter real card data here.',
    'Kopsavilkums': 'Summary', 't. sk. PVN 21%': 'incl. VAT 21%', 'Atlaide': 'Discount',
    'Apstiprināt pirkumu': 'Confirm purchase', 'Maksājums tiek apstrādāts…': 'Payment is being processed…',
    'Maksājums': 'Payment',
    'Simulētais maksājumu pakalpojums atbild uzreiz — pirkuma iznākums parādīsies šajā lapā.':
      'The simulated payment service answers immediately — the result appears on this page.',
    'Ievadiet derīgu e-pasta adresi.': 'Enter a valid e-mail address.',
    'Kartes numuram jābūt 13–19 cipariem.': 'The card number must have 13–19 digits.',
    'Ievadiet vārdu uz kartes.': 'Enter the name on the card.',
    'Derīguma termiņu rakstiet formā MM/GG.': 'Write the expiry as MM/YY.',
    'Derīguma mēnesim jābūt no 01 līdz 12.': 'The expiry month must be 01–12.',
    'Kartes derīguma termiņš ir beidzies.': 'The card has expired.',
    'CVC kodam jābūt 3 cipariem.': 'The CVC must be 3 digits.',
    'PIRKUMS APSTIPRINĀTS': 'PURCHASE CONFIRMED', 'PIRKUMS ATCELTS': 'PURCHASE CANCELLED',
    'Digitālā biļete': 'Digital ticket', 'Drukāt biļeti': 'Print ticket',
    'Atcelt biļeti': 'Cancel ticket',
    'Sūtīt saiti uz e-pastu (simulēts)': 'Send the link by e-mail (simulated)',
    'Simulēts e-pasts': 'Simulated e-mail',
    'Mācību vidē e-pasts netiek sūtīts. Šī ir saite, kas e-pastā būtu — vari to atvērt pats:':
      'E-mail is not sent in the training environment. This is the link that would be in it — you can open it yourself:',
    'Pieslēgties': 'Sign in', 'Izveidot kontu': 'Create account', 'Aizmirsu paroli': 'Forgot password',
    'Parole': 'Password', 'Vismaz 8 rakstzīmes': 'At least 8 characters',
    'Šis konts ir lokāls šajā pārlūkā. Neievadiet īstu paroli.':
      'This account is local to this browser. Do not enter a real password.',
    'Parolei jābūt vismaz 8 rakstzīmes, ar lielo un mazo burtu, ciparu un speciālo rakstzīmi.':
      'The password must be at least 8 characters with an upper- and lowercase letter, a digit and a special character.',
    'Pieslēdzieties vai izveidojiet kontu.': 'Sign in or create an account.',
    'Konts un pasūtījumi glabājas tikai šajā pārlūkā.':
      'The account and orders are stored only in this browser.',
    'Pasūtījumu vēl nav.': 'No orders yet.',
    'Vieta demonstrācijai produkcijas versijā.': 'Placeholder for the production version.',
    'OPERATORA PANELIS': 'OPERATOR PANEL', 'Operatora panelis': 'Operator panel',
    'Operatora pieslēgšanās': 'Operator sign-in', 'Operatora parole': 'Operator password',
    'Mācību parole': 'Training password', 'Mācību vide': 'Training environment',
    'Mācību dati': 'Training data',
    'Izmaiņas uzreiz saglabājas šajā pārlūkā. Izmantojiet atiestatīšanu, lai atgrieztu sākuma variantu.':
      'Changes are saved in this browser right away. Use reset to return to the initial state.',
    'Atlaižu kodi': 'Discount codes', 'Audita žurnāls': 'Audit log', 'Labot': 'Edit', 'Dzēst': 'Delete',
    'Pievienot seansu': 'Add screening', 'Atcelt': 'Cancel', 'Pievienot filmu': 'Add film',
    'Saglabāt seansu': 'Save screening', 'Izveidot seansu': 'Create screening',
    'Atcelt labošanu': 'Cancel editing', 'Jauns seanss': 'New screening', 'Žanrs': 'Genre',
    'Filmas nosaukums': 'Film title', 'Ilgums minūtēs': 'Duration in minutes',
    'Vecuma ierobežojums': 'Age limit', 'Cena €': 'Price €', 'Apraksts': 'Description',
    'Laiks': 'Time', 'Zāle': 'Hall', 'Filma': 'Film', 'Jauns kods': 'New code', 'Veids': 'Type',
    'Minimālā summa €': 'Minimum amount €', 'Termiņš, ja vajag': 'Expiry, if needed',
    'Procenti': 'Percent', 'Fiksēta summa €': 'Fixed amount €', 'Pievienot kodu': 'Add code',
    'Atiestatīt datus': 'Reset data', 'Atiestatīt visus datus': 'Reset all data',
    'Atcelt daļu biļešu': 'Cancel part of the tickets',
    'Atcelt atzīmētās vietas': 'Cancel selected seats',
    'Mācību dati ir atiestatīti.': 'Training data has been reset.',
    'Atlaides kods pievienots.': 'Discount code added.', 'Seanss izveidots.': 'Screening created.',
    'Seanss saglabāts.': 'Screening saved.',
    'Filma ir pievienota lokālajiem datiem.': 'The film has been added to local data.'
  }
};

/* Leksika: vārdi, kas parādās saliktos teikumos (datumi, cenas, saraksti, žanri). */
const I18N_LEX = {
  ru: {
    weekday: { pirmdiena: 'понедельник', otrdiena: 'вторник', trešdiena: 'среда', ceturtdiena: 'четверг', piektdiena: 'пятница', sestdiena: 'суббота', svētdiena: 'воскресенье' },
    month: { janvāris: 'января', februāris: 'февраля', marts: 'марта', aprīlis: 'апреля', maijs: 'мая', jūnijs: 'июня', jūlijs: 'июля', augusts: 'августа', septembris: 'сентября', oktobris: 'октября', novembris: 'ноября', decembris: 'декабря' },
    words: {
      'Pieaugušo': 'Взрослый', 'Skolēna': 'Школьника', 'Studenta': 'Студента', 'Seniora': 'Пенсионера',
      'Bērnu': 'Детский', 'Ģimenes': 'Семейный', 'VIP': 'VIP', 'Trilleris': 'Триллер', 'Drāma': 'Драма',
      'Piedzīvojumu': 'Приключенческий', 'Dokumentālā': 'Документальная', 'Angļu': 'Английский',
      'Latviešu': 'Латышский', 'Zinātniskā fantastika': 'Научная фантастика',
      'Šodien': 'Сегодня', 'Rīt': 'Завтра', 'Zāle': 'Зал', 'Zālē': 'в зале', 'vietas': 'места',
      'Vietas': 'Места', 'vieta': 'место', 'Visi': 'Все', 'filmas': 'фильмов', 'min': 'мин', 'h': 'ч',
      'kārtotas': 'сортировка', 'nosaukums': 'название', 'augoši': 'по возрастанию',
      'dilstoši': 'по убыванию', 'Nav': 'Нет', 'apstiprināta': 'подтверждена', 'atsauce': 'ссылка',
      'karte': 'карта', 'iegādāta': 'куплен', 'Pieslēgšanās': 'Вход', 'no': 'от', 'un': 'и',
      'Režisors': 'Режиссёр', 'Lomās': 'В ролях', 'Subtitri': 'Субтитры', 'Versija': 'Версия',
      'Operators': 'Оператор', 'pieslēgts': 'подключён', 'Kam': 'Кому', 'Tēma': 'Тема'
    }
  },
  en: {
    weekday: { pirmdiena: 'Monday', otrdiena: 'Tuesday', trešdiena: 'Wednesday', ceturtdiena: 'Thursday', piektdiena: 'Friday', sestdiena: 'Saturday', svētdiena: 'Sunday' },
    month: { janvāris: 'January', februāris: 'February', marts: 'March', aprīlis: 'April', maijs: 'May', jūnijs: 'June', jūlijs: 'July', augusts: 'August', septembris: 'September', oktobris: 'October', novembris: 'November', decembris: 'December' },
    words: {
      'Pieaugušo': 'Adult', 'Skolēna': 'School pupil', 'Studenta': 'Student', 'Seniora': 'Senior',
      'Bērnu': 'Child', 'Ģimenes': 'Family', 'VIP': 'VIP', 'Trilleris': 'Thriller', 'Drāma': 'Drama',
      'Piedzīvojumu': 'Adventure', 'Dokumentālā': 'Documentary', 'Angļu': 'English',
      'Latviešu': 'Latvian', 'Zinātniskā fantastika': 'Science fiction',
      'Šodien': 'Today', 'Rīt': 'Tomorrow', 'Zāle': 'Hall', 'Zālē': 'in hall', 'vietas': 'seats',
      'Vietas': 'Seats', 'vieta': 'seat', 'Visi': 'All', 'filmas': 'films', 'min': 'min', 'h': 'h',
      'kārtotas': 'sorted', 'nosaukums': 'title', 'augoši': 'ascending', 'dilstoši': 'descending',
      'Nav': 'None', 'apstiprināta': 'confirmed', 'atsauce': 'reference', 'karte': 'card',
      'iegādāta': 'bought', 'Pieslēgšanās': 'Sign-in', 'no': 'from', 'un': 'and',
      'Režisors': 'Director', 'Lomās': 'Cast', 'Subtitri': 'Subtitles', 'Versija': 'Version',
      'Operators': 'Operator', 'pieslēgts': 'signed in', 'Kam': 'To', 'Tēma': 'Subject'
    }
  }
};

/* Frāžu likumi saliktiem teikumiem (dinamiski skaitļi, laiki, saraksti). */
const I18N_PHRASES = {
  ru: [
    [/\bŠodien\b/g, 'Сегодня'], [/\bRīt\b/g, 'Завтра'],
    [/\bRezervācija spēkā\b/g, 'Бронь действует'],
    [/\bvienā pirkumā līdz\b/g, 'в одной покупке до'], [/\bvietām\b/g, 'мест'],
    [/\bkad laiks beidzas, pasūtījums tiek anulēts un vietas atbrīvotas\b/g,
      'когда время истёк, заказ аннулируется, а места освобождаются'],
    [/\bRezervācijas laiks beidzās\b/g, 'Время брони истекло'],
    [/\bRezervācijas laiks ir beidzies\b/g, 'Время брони истекло'],
    [/\bpasūtījums anulēts, izvēlētās vietas atbrīvotas citiem pircējiem\b/g,
      'заказ аннулирован, выбранные места освобождены для других покупателей'],
    [/\bvietas atbrīvotas citiem pircējiem\b/g, 'места освобождены для других покупателей'],
    [/\bLūdzu, izvēlieties vietas no jauna\b/g, 'Пожалуйста, выберите места заново'],
    [/\bVienā pirkumā var iegādāties ne vairāk kā\b/g, 'В одной покупке можно купить не более'],
    [/\bSesija beigsies pēc\b/g, 'Сессия завершится через'],
    [/\bpirkuma laikā laiks tiek atlikts\b/g, 'во время покупки время продлевается'],
    [/\bCenu filtrs\b/g, 'Фильтр по цене'], [/\bredzami\b/g, 'показано'], [/\bseansiem\b/g, 'сеансов'],
    [/\bNeviena filma neatbilst meklēšanai\b/g, 'Ни один фильм не соответствует поиску'],
    [/\bNeviena filma neatbilst izvēlētajiem filtriem\b/g, 'Ни один фильм не соответствует фильтрам'],
    [/\bfilmas · kārtotas\b/g, 'фильмов · сортировка'],
    [/\bBiļete atcelta\. Atmaksāta summa\b/g, 'Билет отменён. Возвращено'],
    [/\bAtceltas vietas\b/g, 'Отменены места'], [/\bAtmaksāts\b/g, 'Возвращено'],
    [/\bDerīgās vietas\b/g, 'Действующие места'],
    [/\bAtceltas visas vietas — biļete slēgta\. Atmaksāta summa\b/g,
      'Отменены все места — билет закрыт. Возвращено'],
    [/\bPar atceltajām vietām atmaksāts\b/g, 'За отменённые места возвращено'],
    [/\bAtzīmējiet vismaz vienu vietu, ko atcelt\b/g, 'Отметьте хотя бы одно место для отмены'],
    [/\bAtlaide (procenti|fiksēta summa)?\b/g, 'Скидка'], [/\bir piemērota\b/g, 'применена'],
    [/\bKods darbojas pasūtījumiem no\b/g, 'Код действует для заказов от'],
    [/\bProcentu atlaide var būt no 1 līdz 50 %/g, 'Процентная скидка может быть от 1 до 50 %'],
    [/\bKods «([^»]+)» netika pievienots\b/g, 'Код «$1» не добавлен'],
    [/\bNorādiet filmu, datumu, laiku un cenu\b/g, 'Укажите фильм, дату, время и цену'],
    [/\bNorādiet koda nosaukumu un atlaidi\b/g, 'Укажите название кода и размер скидки'],
    [/\bFiksētā atlaide nevar būt negatīva\b/g, 'Фиксированная скидка не может быть отрицательной'],
    [/\bZālē «([^»]+)» (.+) plkst\. (\d{2}:\d{2}) jau notiek filma «([^»]+)» \((\d{2}:\d{2})\)\. Divi seansi vienā zālē nevar pārklāties\./g,
      'В зале «$1» $2 в $3 уже идёт фильм «$4» ($5). Два сеанса в одном зале не могут пересекаться.'],
    [/\bSeanss atcelts — izvēlies risinājumu\b/g, 'Сеанс отменён — выбери решение'],
    [/\bKinoteātris atcēla seansu\. Tev ir izvēle: pilna atmaksa vai cita biļete tajā pašā filmā\./g,
      'Кинотеатр отменил сеанс. У тебя есть выбор: полный возврат или другой билет на тот же фильм.'],
    [/\bPieprasīt atmaksu\b/g, 'Запросить возврат'], [/\bCita biļete\b/g, 'Другой билет'],
    [/\bIzvēlēties citu seansu\b/g, 'Выбрать другой сеанс'],
    [/\bCits šīs filmas seanss šobrīd nav pieejams\./g, 'Другого сеанса этого фильма сейчас нет.'],
    [/\bBiļete pārcelta\b/g, 'Билет перенесён'], [/\bAtmaksa apstiprināta\b/g, 'Возврат подтверждён'],
    [/\bMaksājums apstiprināts uzreiz \(([^)]+)\)\./g, 'Платёж подтверждён сразу ($1).'],
    [/\bJauna pagaidu parole: ([A-Z0-9-]+)\. Mācību vidē tā tiek parādīta uzreiz\./g,
      'Новый временный пароль: $1. В учебной среде он показывается сразу.'],
    [/\bMācību vide\b/g, 'Учебная среда'],
    [/\bAktīvie seansi\b/g, 'Активные сеансы'], [/\bFilmas\b/g, 'Фильмы'],
    [/\bLabot seansu\b/g, 'Изменить сеанс'],
    [/\bAtvērta jauna seansa forma ar izvēlētu filmu\./g,
      'Открыта форма нового сеанса с выбранным фильмом.'],
    [/\bVersija\b/g, 'Версия'], [/\bOperators: pieslēgts\./g, 'Оператор: подключён.'],
    [/\bSākuma stāvoklis\b/g, 'Исходное состояние'],
    [/\bPievienota filma\b/g, 'Добавлен фильм'], [/\bPievienots atlaides kods\b/g, 'Добавлен код скидки'],
    [/\bLabots seanss\b/g, 'Изменён сеанс'], [/\bIzveidots seanss\b/g, 'Создан сеанс'],
    [/\bAtcelts seanss\b/g, 'Отменён сеанс'], [/\bOperators pieslēdzās\b/g, 'Оператор вошёл'],
    [/\bAtiestatīti dati\b/g, 'Данные сброшены'], [/\bbez termiņa\b/g, 'без срока'],
    [/\btermiņš\b/g, 'срок'], [/\bno\b/g, 'от'], [/\bVisi\b/g, 'Все']
  ],
  en: [
    [/\bŠodien\b/g, 'Today'], [/\bRīt\b/g, 'Tomorrow'],
    [/\bRezervācija spēkā\b/g, 'Booking valid'],
    [/\bvienā pirkumā līdz\b/g, 'up to'], [/\bvietām\b/g, 'seats'],
    [/\bkad laiks beidzas, pasūtījums tiek anulēts un vietas atbrīvotas\b/g,
      'when time runs out the order is cancelled and the seats are released'],
    [/\bRezervācijas laiks beidzās\b/g, 'The booking time has expired'],
    [/\bRezervācijas laiks ir beidzies\b/g, 'The booking time has expired'],
    [/\bLūdzu, izvēlieties vietas no jauna\b/g, 'Please choose seats again'],
    [/\bVienā pirkumā var iegādāties ne vairāk kā\b/g, 'You can buy at most'],
    [/\bSesija beigsies pēc\b/g, 'The session ends in'],
    [/\bpirkuma laikā laiks tiek atlikts\b/g, 'time is extended during a purchase'],
    [/\bCenu filtrs\b/g, 'Price filter'], [/\bredzami\b/g, 'shown'], [/\bseansiem\b/g, 'screenings'],
    [/\bNeviena filma neatbilst meklēšanai\b/g, 'No film matches the search'],
    [/\bNeviena filma neatbilst izvēlētajiem filtriem\b/g, 'No film matches the filters'],
    [/\bfilmas · kārtotas\b/g, 'films · sorted'],
    [/\bBiļete atcelta\. Atmaksāta summa\b/g, 'Ticket cancelled. Refunded'],
    [/\bAtceltas vietas\b/g, 'Cancelled seats'], [/\bAtmaksāts\b/g, 'Refunded'],
    [/\bDerīgās vietas\b/g, 'Valid seats'],
    [/\bPar atceltajām vietām atmaksāts\b/g, 'Refunded for cancelled seats'],
    [/\bAtzīmējiet vismaz vienu vietu, ko atcelt\b/g, 'Tick at least one seat to cancel'],
    [/\bAtlaide\b/g, 'Discount'], [/\bir piemērota\b/g, 'applied'],
    [/\bKods darbojas pasūtījumiem no\b/g, 'The code works for orders from'],
    [/\bProcentu atlaide var būt no 1 līdz 50 %/g, 'A percentage discount can be 1–50%'],
    [/\bKods «([^»]+)» netika pievienots\b/g, 'Code “$1” was not added'],
    [/\bNorādiet filmu, datumu, laiku un cenu\b/g, 'Enter the film, date, time and price'],
    [/\bNorādiet koda nosaukumu un atlaidi\b/g, 'Enter the code name and the discount'],
    [/\bZālē «([^»]+)» (.+) plkst\. (\d{2}:\d{2}) jau notiek filma «([^»]+)» \((\d{2}:\d{2})\)\. Divi seansi vienā zālē nevar pārklāties\./g,
      'In hall “$1” on $2 at $3 the film “$4” is already running ($5). Two screenings cannot overlap in one hall.'],
    [/\bSeanss atcelts — izvēlies risinājumu\b/g, 'Screening cancelled — choose a solution'],
    [/\bPieprasīt atmaksu\b/g, 'Request a refund'], [/\bCita biļete\b/g, 'Another ticket'],
    [/\bIzvēlēties citu seansu\b/g, 'Choose another screening'],
    [/\bCits šīs filmas seanss šobrīd nav pieejams\./g, 'No other screening of this film right now.'],
    [/\bBiļete pārcelta\b/g, 'Ticket moved'], [/\bAtmaksa apstiprināta\b/g, 'Refund confirmed'],
    [/\bJauna pagaidu parole: ([A-Z0-9-]+)\. Mācību vidē tā tiek parādīta uzreiz\./g,
      'New temporary password: $1. In the training environment it is shown right away.'],
    [/\bAktīvie seansi\b/g, 'Active screenings'], [/\bFilmas\b/g, 'Films'],
    [/\bLabot seansu\b/g, 'Edit screening'],
    [/\bAtvērta jauna seansa forma ar izvēlētu filmu\./g,
      'The new screening form is open with a film selected.'],
    [/\bVersija\b/g, 'Version'], [/\bOperators: pieslēgts\./g, 'Operator: signed in.'],
    [/\bSākuma stāvoklis\b/g, 'Initial state'],
    [/\bPievienota filma\b/g, 'Film added'], [/\bPievienots atlaides kods\b/g, 'Discount code added'],
    [/\bLabots seanss\b/g, 'Screening edited'], [/\bIzveidots seanss\b/g, 'Screening created'],
    [/\bAtcelts seanss\b/g, 'Screening cancelled'], [/\bOperators pieslēdzās\b/g, 'Operator signed in'],
    [/\bAtiestatīti dati\b/g, 'Data reset'], [/\bbez termiņa\b/g, 'no expiry'],
    [/\btermiņš\b/g, 'expiry'], [/\bno\b/g, 'from'], [/\bVisi\b/g, 'All']
  ]
};

/* Leksika: vārdi, kas parādās saliktos teikumos (datumi, saraksti, žanri). */
/* Границы слова считаем по Unicode: \b не видит латышские буквы (ā, ē, š…), поэтому
   он не срабатывал, когда слово заканчивалось на «ā» — половина подписей оставалась непереведённой. */
function lexPair(map) {
  const low = {};
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const k of keys) low[k.toLowerCase()] = map[k];
  const pattern = keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return [new RegExp('(?<![\\p{L}])(?:' + pattern + ')(?![\\p{L}])', 'giu'), low];
}

function tr(text) {
  const lang = state.lang || 'lv';
  if (lang === 'lv' || !text) return text;
  const s = String(text);
  const full = (I18N_FULL[lang] || {})[s.trim()];
  if (full != null) return s.replace(s.trim(), full);
  const lex = I18N_LEX[lang] || {weekday: {}, month: {}, words: {}};
  /* Vispirms garās frāzes, tad atsevišķi vārdi: ja vispirms tulkotu vārdus, frāze
     «Operators pieslēdzās» vairs nesakristu ar savu likumu. */
  let out = s;
  for (const [re, rep] of phraseRules(lang)) out = out.replace(re, rep);
  const [reWd, mapWd] = lexPair(lex.weekday);
  const [reMo, mapMo] = lexPair(lex.month);
  const [reWo, mapWo] = lexPair(lex.words);
  out = out
    .replace(reWd, (m) => mapWd[m.toLowerCase()] || m)
    .replace(reMo, (m) => mapMo[m.toLowerCase()] || m)
    .replace(reWo, (m) => mapWo[m.toLowerCase()] || m);
  return out;
}

/* \b не видит латышские буквы, поэтому фразы оборачиваем Unicode-границами один раз. */
const PHRASE_CACHE = {};
function phraseRules(lang) {
  if (PHRASE_CACHE[lang]) return PHRASE_CACHE[lang];
  PHRASE_CACHE[lang] = (I18N_PHRASES[lang] || []).map(([re, rep]) => [
    new RegExp('(?<![\\p{L}\\p{N}])' + re.source.replace(/\\b/g, '') + '(?![\\p{L}\\p{N}])', 'gu'),
    rep
  ]);
  return PHRASE_CACHE[lang];
}

/* Tulko teksta mezglus un atribūtus visā lapā (galvene un kājene ir ārpus #app). */
function applyLang(root) {
  const lang = state.lang || 'lv';
  const host = root || document.body;
  const walk = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walk.nextNode()) nodes.push(walk.currentNode);
  for (const n of nodes) {
    const cur = n.nodeValue;
    if (!cur || !cur.trim()) continue;
    if (n.__lv === undefined) n.__lv = cur;          // pirmavots paliek atmiņā
    const src = n.__lv;
    const t = lang === 'lv' ? src : tr(src);
    if (t !== cur) n.nodeValue = t;
  }
  host.querySelectorAll('[placeholder],[title],[aria-label]').forEach(el => {
    el.__lvAttr = el.__lvAttr || {};
    for (const a of ['placeholder', 'title', 'aria-label']) {
      const cur = el.getAttribute(a);
      if (cur == null) continue;
      if (el.__lvAttr[a] === undefined) el.__lvAttr[a] = cur;
      const src = el.__lvAttr[a];
      const t = lang === 'lv' ? src : tr(src);
      if (t !== src) el.setAttribute(a, t);
    }
  });
  document.documentElement.lang = lang;
}

/* US-15.02: pirms valodas maiņas nolasām ievadītos datus, pēc — atgriežam atpakaļ. */
function captureDrafts() {
  const d = {};
  document.querySelectorAll('#app input, #app select, #app textarea').forEach(el => {
    if (el.id && el.value !== '') d[el.id] = el.value;
  });
  return d;
}
function restoreDrafts(d) {
  for (const [id, val] of Object.entries(d || {})) {
    const el = document.getElementById(id);
    if (el && el.value === '') el.value = val;
  }
}
function setLang(code) {
  const drafts = captureDrafts();
  const focus = document.activeElement && document.activeElement.id;
  state.lang = code;
  save();
  render();
  restoreDrafts(drafts);
  if (focus) { const el = document.getElementById(focus); if (el) el.focus(); }
}

/* Servera emulācija (US-05.03 / US-15.09): pirms pirkuma apstiprināšanas vietas
   tiek pārlasītas no glabātavas, un citu pārlūka cilņu izmaiņas ienāk ar storage notikumu. */

/* ---------- Paroles jaucējvērtība (US-13.01) ----------
   Parole netiek glabāta atklātā tekstā: katram lietotājam ir sava sāls, un glabājas
   tikai atkārtota SHA-256 jaucējvērtība (sāls + parole, HASH_ROUNDS reizes).
   Mācību videi ar to pietiek; produkcijā šeit būtu PBKDF2/argon2 ar lielāku iterāciju
   skaitu un jaucēšana notiktu servera pusē. */
const HASH_ROUNDS = 1000;
const SHA256_K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
const rotr = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0;
function sha256hex(text) {
  const bytes = new TextEncoder().encode(text);
  const size = (((bytes.length + 9 + 63) >> 6) << 6);
  const buf = new Uint8Array(size);
  buf.set(bytes);
  buf[bytes.length] = 0x80;
  const dv = new DataView(buf.buffer);
  dv.setUint32(size - 8, Math.floor(bytes.length * 8 / 0x100000000));
  dv.setUint32(size - 4, (bytes.length * 8) >>> 0);
  const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
             0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const w = new Uint32Array(64);
  for (let off = 0; off < size; off += 64) {
    for (let t = 0; t < 16; t++) w[t] = dv.getUint32(off + t * 4);
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const t1 = (hh + S1 + ((e & f) ^ (~e & g)) + SHA256_K[t] + w[t]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
  }
  return h.map(x => x.toString(16).padStart(8, '0')).join('');
}
function randHex(n) {
  const a = '0123456789abcdef';
  let s = '';
  for (let i = 0; i < n; i++) s += a[Math.floor(Math.random() * 16)];
  return s;
}
function hashPassword(password, salt) {
  let h = salt + ':' + password;
  for (let i = 0; i < HASH_ROUNDS; i++) h = sha256hex(h);
  return h;
}
/* Vecāki dati (0.2.1 un agrāk) glabāja paroli atklātā tekstā: pārceļam uz jaucējvērtību un
   pašu paroli izdzēšam. */
let needsMigration = false;
function migrateUsers(list) {
  let changed = false;
  for (const u of list || []) {
    if (u && typeof u.password === 'string') {
      u.salt = u.salt || randHex(16);
      u.hash = hashPassword(u.password, u.salt);
      u.algo = 'sha256';
      delete u.password;
      changed = true;
    }
  }
  return changed;
}
/* US-15.11 / US-16.14 / US-16.15: kodam ir veids (procenti vai fiksēta summa), minimālā summa un termiņš.
   Vecā glabātava glabāja tikai procentu skaitli — tā tiek pārrakstīta palaišanā, skat. migratePromos(). */
function migratePromos(map) {
  let changed = false;
  for (const [code, val] of Object.entries(map || {})) {
    if (typeof val === 'number') {
      map[code] = {kind: 'percent', value: val, min: 0, until: ''};
      changed = true;
    } else if (val && val.kind == null) {
      map[code] = {kind: 'percent', value: Number(val.value != null ? val.value : val.percent) || 0,
                   min: Number(val.min) || 0, until: val.until || ''};
      changed = true;
    }
  }
  return changed;
}

function isoDate(offset){const t=new Date();t.setDate(t.getDate()+offset);return t.toISOString().slice(0,10)}
function todayISO(){return new Date().toISOString().slice(0,10)}

const seed = {
  movies: [
    {id:1,title:'Neona pilsēta',genre:'Trilleris',year:2026,duration:118,age:'16+',language:'Angļu',subtitles:'Latviešu',director:'Māra Ozola',actors:'I. Kalniņš, A. Bērziņa',rating:8.1,trailer:true,price:8.5,accent:"url('assets/poster-neona-pilseta.png')",description:'Pēc nakts lietus Rīga iemirdzas neona krāsās. Detektīve Mara atrod pavedienu, kas ved pāri pilsētai un pašai sev pāri.'},
    {id:2,title:'Mēness arhīvs',genre:'Zinātniskā fantastika',year:2026,duration:132,age:'12+',language:'Angļu',subtitles:'Latviešu',director:'Jānis Vītols',actors:'K. Ozoliņa, R. Lapsa',rating:7.6,trailer:true,price:9,accent:"url('assets/poster-meness-arhivs.png')",description:'Uz pamestas Mēness stacijas atstāta balss ieraksta atklāj stāstu, kuru neviens nebija paredzējis dzirdēt.'},
    {id:3,title:'Vasaras otra puse',genre:'Drāma',year:2025,duration:104,age:'7+',language:'Latviešu',subtitles:'Angļu',director:'Līga Bērza',actors:'A. Ozols, M. Kūla',rating:7.9,trailer:false,price:7.5,accent:"url('assets/poster-vasaras-otra-puse.png')",description:'Draudzība, kas sākas vienā vasarā, iemāca pieaugt daudz ātrāk nekā gribētos.'},
    {id:4,title:'Savvaļas signāls',genre:'Piedzīvojumu',year:2025,duration:96,age:'7+',language:'Latviešu',subtitles:'Nav',director:'Pēteris Kalns',actors:'E. Sproģe, T. Vīksna',rating:6.8,trailer:false,price:7.5,accent:"url('assets/poster-savvalas-signals.png')",description:'Jauna biologu komanda seko noslēpumainam radiosignālam dziļi mežā.'},
    /* Papildināts pēc klases defektiem BUG-05/06/07 (17.09.2026): sadaļā «Zinātniskā fantastika» bija tikai
       viena filma, tāpēc alfabētisko kārtību tur nevarēja pārbaudīt, un neviena filma nesākās ar «A» —
       «pirmā filma sarakstā» arī nebija pārbaudāma. Šī filma aizpilda abas robus. */
    {id:5,title:'Atgriešanās orbītā',genre:'Zinātniskā fantastika',year:2026,duration:126,age:'12+',language:'Angļu',subtitles:'Latviešu',director:'Ilze Muižniece',actors:'D. Osis, L. Caune',rating:7.4,trailer:false,price:9.5,accent:"url('assets/poster-atgriesanas-orbita.png')",description:'Mājas stacija klusē jau deviņus gadus. Kad atgriežas pēdējā ekspedīcija, apkalpe atklāj, ka laiks orbītā un uz Zemes rit dažādi.'},
    /* US-16.03: īsai filmai (mazāk par 60 min) ilguma formāts ir cits — bez šādas filmas
       formāta pirmo klasi nevarēja pārbaudīt vispār. */
    {id:6,title:'Nakts maiņa',genre:'Dokumentālā',year:2026,duration:45,age:'7+',language:'Latviešu',subtitles:'Angļu',director:'Rūta Ķēniņa',actors:'–',rating:7.2,trailer:false,price:6.5,accent:"url('assets/poster-neona-pilseta.png')",description:'Īsfilma par nakts maiņas cilvēkiem: dispečeri, maiznieki, slimnīcas dežuranti.'}
  ],
  screenings: [
    {id:1,movieId:1,date:isoDate(0),time:'18:30',hall:'Zāle 1',price:8.5},
    {id:2,movieId:1,date:isoDate(0),time:'21:15',hall:'Zāle 2',price:9.5},
    {id:3,movieId:2,date:isoDate(0),time:'19:10',hall:'Zāle 3',price:9},
    {id:4,movieId:2,date:isoDate(1),time:'22:00',hall:'Zāle 1',price:10},
    {id:5,movieId:3,date:isoDate(1),time:'17:45',hall:'Zāle 2',price:7.5},
    {id:6,movieId:4,date:isoDate(2),time:'16:20',hall:'Zāle 1',price:7.5},
    {id:7,movieId:3,date:isoDate(0),time:'15:00',hall:'Zāle 3',price:7.5},
    /* BUG-08: границы суток. Ни одного сеанса 00:00 или 23:59 в данных не было, поэтому проверку
       «фильм виден в Šodien на границе дня» нельзя было выполнить вовсе. Теперь оба края есть. */
    {id:8,movieId:5,date:isoDate(0),time:'00:00',hall:'Zāle 1',price:9.5},
    {id:9,movieId:5,date:isoDate(0),time:'23:59',hall:'Zāle 2',price:9.5},
    /* US-16.06: rīta atlaidei vajag rīta seansu un robežu tieši 12:00 — abi ir rīt, lai tos
       varētu nopirkt jebkurā dienas laikā. */
    {id:10,movieId:1,date:isoDate(1),time:'09:30',hall:'Zāle 1',price:8.5},
    {id:11,movieId:2,date:isoDate(1),time:'12:00',hall:'Zāle 2',price:9},
    /* US-16.05: cenu grupu robežas (8,00 / 10,00) — seansi ar tieši šīm cenām. */
    {id:12,movieId:4,date:isoDate(1),time:'14:15',hall:'Zāle 3',price:8},
    {id:13,movieId:3,date:isoDate(1),time:'21:30',hall:'Zāle 1',price:10},
    /* US-16.03 un US-16.06: īsā filma arī rīta seansā (cena 6,50 € — «līdz 8,00» grupa). */
    {id:14,movieId:6,date:isoDate(1),time:'11:00',hall:'Zāle 3',price:6.5}
  ],
  /* US-16.07: invalīdu vietas ir atzīmētas katrā zālē atsevišķi. */
  halls:{'Zāle 1':{rows:6,seats:10,inv:['F1','F2']},
         'Zāle 2':{rows:5,seats:8,inv:['E1']},
         'Zāle 3':{rows:7,seats:12,inv:['G1','G2']}},
  reserved:{1:['A2','C7'],2:['B4'],3:['A1','A2','D5'],4:['C3'],5:['B6'],6:['E8'],7:[],8:[],9:[],
            10:[],11:[],12:[],13:[]},
  ticketTypes:[
    {id:'pieauguso',label:'Pieaugušo',k:1},
    {id:'skolena',label:'Skolēna',k:0.7},
    {id:'studenta',label:'Studenta',k:0.7},
    {id:'seniora',label:'Seniora (no 60 g.)',k:0.6},
    {id:'bernu',label:'Bērnu (līdz 12 g.)',k:0.5},
    /* US-15.04: kanons US-06.01 prasa septiņus biļešu veidus — ģimenes un VIP iztrūka. */
    {id:'gimenes',label:'Ģimenes (no 4 personām)',k:0.8},
    {id:'vip',label:'VIP (pirmās rindas)',k:1.5}
  ],
  users:[],orders:[],
  /* US-15.11: atlaižu kodam ir arī termiņš (tukšs = bez termiņa). Vecā glabātava glabāja
     tikai procentus (skaitli) — tā tiek pārrakstīta palaišanā, skat. migratePromos(). */
  promos:{BLEGH:{kind:'percent',value:10,min:0,until:''},SKOLA25:{kind:'percent',value:25,min:0,until:''}},
  /* US-16.02: kārtošanas izvēle saglabājas pārlādēšanas laikā. */
  prefs:{sort:'title',dir:'asc'},
  /* US-15.01: saskarnes valoda (lv / ru / en) saglabājas pārlūkā. */
  lang:'lv',
  session:null,
  audit:[],profile:null,operator:false
};

let view = {screen:'catalog',movieId:null,screeningId:null,seats:[],typeId:'pieauguso',cart:null,filter:'Visi',todayOnly:false,order:null,notice:null,holdEnd:null,passwordView:null,trailer:false,paying:false,paymentError:null,emailOpen:false,cancelToken:null,editingScreening:null,screeningMovie:null,query:'',age:'visi',priceBand:'visi',cancelSeats:[]};
let holdTimer = null;

const app = document.querySelector('#app');
function clone(x){return JSON.parse(JSON.stringify(x))}
const store={mem:{},ok:(()=>{try{localStorage.setItem('__probe','1');localStorage.removeItem('__probe');return true}catch{return false}})()};
function lsGet(k){try{return store.ok?localStorage.getItem(k):(k in store.mem?store.mem[k]:null)}catch{return k in store.mem?store.mem[k]:null}}
function lsSet(k,v){try{if(store.ok)localStorage.setItem(k,v);else store.mem[k]=v}catch{store.mem[k]=v}}
function lsDel(k){try{if(store.ok)localStorage.removeItem(k);else delete store.mem[k]}catch{delete store.mem[k]}}
function load(){
  try{
    const s={...clone(seed),...JSON.parse(lsGet(KEY))};
    let changed=migrateUsers(s.users);
    if(migratePromos(s.promos)) changed=true;
    if(changed) needsMigration=true;
    return s;
  }catch{return clone(seed)}
}
/* Glabātava tiek lasīta TIKAI tad, kad palīgfunkcijas jau ir gatavas: agrāk `load()` tika izsaukts
   pirms `const store`, izņēmums tika norīts, un lietotne vienmēr sāka no sākuma stāvokļa, ignorējot
   saglabātos datus. */
let state = load();
function save(){lsSet(KEY,JSON.stringify(state));updateCart()}
function money(n){return new Intl.NumberFormat('lv-LV',{style:'currency',currency:'EUR'}).format(n)}
function nowLabel(){return new Intl.DateTimeFormat('lv-LV',{weekday:'long',day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'}).format(new Date())}
function dateLabel(iso){
  if(iso===todayISO()) return 'Šodien';
  if(iso===isoDate(1)) return 'Rīt';
  const [y,m,d]=iso.split('-');
  return `${d}.${m}.${y}`;
}
function movie(id){return state.movies.find(x=>x.id===Number(id))}
function screening(id){return state.screenings.find(x=>x.id===Number(id))}
function reserved(id){return state.reserved[id]||[]}
function typeOf(id){return state.ticketTypes.find(t=>t.id===id)||state.ticketTypes[0]}
/* US-16.06: rīta seansi (sākas pirms 12:00) ir par 20 % lētāki; robeža 12:00 vēl nav rīts. */
const MORNING_UNTIL = '12:00', MORNING_DISCOUNT = 0.2;
function isMorning(s){return s.time < MORNING_UNTIL}
function unitPrice(s,typeId){
  const base=s.price*typeOf(typeId).k;
  const k=isMorning(s)?(1-MORNING_DISCOUNT):1;
  return Math.round(base*k*100)/100;
}
/* US-16.03: ilgums stundās un minūtēs (59 min, 1 h, 1 h 59 min). */
function durationLabel(min){
  const h=Math.floor(min/60),m=min%60;
  if(min<60)return `${m} min`;
  if(m===0)return `${h} h`;
  return `${h} h ${m} min`;
}
/* US-16.05: cenu grupas — robežas (8,00 un 10,00) pieder tikai vienai grupai. */
function priceInBand(price,band){
  if(!band||band==='visi')return true;
  if(band==='lidz8')return price<=8;
  if(band==='no8lidz10')return price>8&&price<=10;
  if(band==='virs10')return price>10;
  return true;
}
function bandLabel(b){return {lidz8:'līdz 8,00 €',no8lidz10:'no 8,00 līdz 10,00 €',virs10:'virs 10,00 €'}[b]||'visi seansi'}
/* US-16.07: invalīdu vietas zālē. */
function invSeats(s){const h=state.halls[s.hall];return (h&&h.inv)||[]}
/* US-16.02: kārtošanas izvēle saglabājas. */
function pref(k,def){return (state.prefs&&state.prefs[k]!=null)?state.prefs[k]:def}
function setPref(k,v){state.prefs=Object.assign({},state.prefs||{},{[k]:v});save()}
/* ---------- Atlaižu kods: veids, minimums, termiņš (US-07.01, 07.02, 15.11, 16.14, 16.15) ---------- */
function promoOf(code){
  const p=state.promos[String(code||'').trim().toUpperCase()];
  if(p==null)return null;
  if(typeof p==='number')return {kind:'percent',value:p,min:0,until:''};
  return {kind:p.kind||'percent',value:Number(p.value!=null?p.value:p.percent)||0,
          min:Number(p.min)||0,until:p.until||''};
}
function promoExpired(code){const p=promoOf(code);return !!(p&&p.until&&new Date(p.until+'T23:59:59')<new Date())}
/* Aprēķins: procenti vai fiksēta summa; fiksētā atlaide nekad nav lielāka par kopsummu. */
function promoCalc(code,subtotal){
  const p=promoOf(code);
  if(!p)return {ok:false,reason:'nederīgs'};
  if(promoExpired(code))return {ok:false,reason:'beidzies'};
  if(p.min>subtotal)return {ok:false,reason:'min',min:p.min};
  const off=p.kind==='eur'?Math.min(p.value,subtotal):Math.round(subtotal*p.value/100*100)/100;
  return {ok:true,off,kind:p.kind,value:p.value,min:p.min,
          label:p.kind==='eur'?`−${money(p.value)}`:`−${p.value}%`};
}
function startsAt(s){return new Date(s.date+'T'+s.time+':00')}
function titleArt(m){return m.title.replace(/ /g,'\n')}
function audit(action,detail){state.audit.push({ts:nowLabel(),action,detail});if(state.audit.length>60)state.audit.shift()}
function toast(text){const t=document.querySelector('#toast');t.textContent=tr(text);t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2800)}
function updateCart(){const n=view.cart&&view.cart.seats?view.cart.seats.length:0;document.querySelector('#cart-count').textContent=n}
function nav(screen){stopHold();if(location.hash){try{history.replaceState(null,'',location.href.replace(/#.*$/,''))}catch(e){}}view={screen,movieId:null,screeningId:null,seats:[],typeId:'pieauguso',cart:null,filter:view.filter,todayOnly:view.todayOnly,order:null,notice:null,holdEnd:null,passwordView:null,paying:false,paymentError:null,emailOpen:false,cancelToken:null,editingScreening:null,screeningMovie:null,query:'',age:'visi',priceBand:'visi',cancelSeats:[]};render();app.focus()}

function stopHold(){if(holdTimer){clearInterval(holdTimer);holdTimer=null}}
function holdLabel(ms){const s=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function startHold(){
  /* BUG-17 (US-05.02): rezervācijas laiks darbojas arī grozā un maksājuma lapā, ne tikai vietu izvēlē. */
  if(view.screen==='cart'&&!view.cart){stopHold();return}
  if(!view.holdEnd) view.holdEnd=Date.now()+10*60*1000;
  stopHold();
  holdTimer=setInterval(()=>{
    const left=view.holdEnd-Date.now();
    const el=document.querySelector('#hold');
    if(el) el.textContent=holdLabel(left);
    if(left<=0){
      stopHold();view.holdEnd=null;
      if(view.screen==='cart'){
        view.cart=null;view.seats=[];view.paying=false;
        view.notice='Rezervācijas laiks beidzās — pasūtījums anulēts, izvēlētās vietas atbrīvotas citiem pircējiem.';
      }else{
        view.seats=[];
        view.notice='Rezervācijas laiks beidzās — vietas atbrīvotas citiem pircējiem.';
      }
      render();
    }
  },1000);
}

/* ---------- Sesija (US-13.02 / US-15.10) ----------
   Sesija beidzas pēc definēta laika (SESSION_MIN). Kamēr notiek pirkums — atvērts grozs,
   vietu izvēle vai maksājuma apstiprināšana — laiks tiek atlikts, lai cilvēks nepazaudē pirkumu. */
function startSession(){state.session={expiresAt:Date.now()+SESSION_MIN*60*1000}}
function touchSession(){if(state.session)state.session.expiresAt=Date.now()+SESSION_MIN*60*1000}
function sessionLeft(){return state.session?state.session.expiresAt-Date.now():null}
function inPurchase(){return !!(view.cart||view.paying||view.screen==='booking'||view.screen==='cart')}
function sessionTick(){
  const el=document.querySelector('#session-left');
  if(!state.session){if(el)el.textContent='—';return}
  if(inPurchase())touchSession();
  if(!inPurchase()&&Date.now()>state.session.expiresAt){
    state.profile=null;state.session=null;save();stopHold();
    nav('profile');
    view.notice=`Sesija beidzās pēc ${SESSION_MIN} minūtēm — esat izrakstīts.`;
    return render();
  }
  if(el)el.textContent=holdLabel(sessionLeft());
}
/* ---------- Kopīgs vietu stāvoklis (servera emulācija, US-05.03 / US-15.09) ----------
   Īsta servera mācību vidē nav, tāpēc pircēja vietu stāvoklis tiek pārlasīts no glabātavas
   pirms pirkuma apstiprināšanas, un citu cilņu izmaiņas ienāk ar storage notikumu. Tā divu
   pircēju scenāriju var izpildīt divās vienas pārlūka cilnēs. */
function storedState(){try{return JSON.parse(lsGet(KEY))||{}}catch{return {}}}
function refreshReserved(screeningId){
  const srv=(storedState().reserved||{})[screeningId]||[];
  const merged=[...new Set([...reserved(screeningId),...srv])];
  state.reserved[screeningId]=merged;
  return merged;
}
function onStoreChanged(){
  if(!store.ok)return;
  const snap=storedState();
  state.reserved={...state.reserved,...(snap.reserved||{})};
  if(Array.isArray(snap.orders))state.orders=snap.orders;
  const ae=document.activeElement;
  if(ae&&/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName))return;   // cilvēks raksta — nepārzīmējam
  if(view.screen==='booking'||view.screen==='ticket'||view.screen==='profile'||view.screen==='catalog')render();
}

/* ---------- Katalogs ---------- */
/* US-16.02: kārtošana pēc kritērija un virziena; izvēle glabājas state.prefs. */
function movieSort(){
  const crit=pref('sort','title'),sign=pref('dir','asc')==='desc'?-1:1;
  return (a,b)=>{
    let r=0;
    if(crit==='duration')r=a.duration-b.duration;
    else if(crit==='rating')r=a.rating-b.rating;
    else r=a.title.localeCompare(b.title,'lv');
    if(r===0)r=a.title.localeCompare(b.title,'lv');   // vienādas vērtības — nosaukums kā otrais kritērijs
    return r*sign;
  };
}
function sortLabel(){
  const crit=pref('sort','title'),dir=pref('dir','asc');
  const c={title:'nosaukums',duration:'ilgums',rating:'vērtējums'}[crit]||'nosaukums';
  return `${c} (${dir==='asc'?'augoši':'dilstoši'})`;
}
function catalog(){
  const genres=['Visi',...new Set(state.movies.map(x=>x.genre))];
  const today=todayISO();
  const q=(view.query||'').trim().toLowerCase();
  let items=state.movies.filter(m=>view.filter==='Visi'||m.genre===view.filter);
  /* US-16.04: vecuma reitings — «12+» rāda 12+ un 16+, «16+» tikai 16+. */
  if(view.age&&view.age!=='visi'){
    const min=Number(String(view.age).replace('+',''));
    items=items.filter(m=>Number(String(m.age).replace('+',''))>=min);
  }
  /* US-16.05: cenu grupa — filmas, kam ir seanss šajā grupā. */
  if(view.priceBand&&view.priceBand!=='visi')
    items=items.filter(m=>state.screenings.some(s=>s.movieId===m.id&&priceInBand(s.price,view.priceBand)));
  /* US-16.01: meklēšana pēc nosaukuma daļas, bez reģistra jutības. */
  if(q) items=items.filter(m=>m.title.toLowerCase().includes(q));
  if(view.todayOnly) items=items.filter(m=>state.screenings.some(s=>s.movieId===m.id&&s.date===today));
  items=[...items].sort(movieSort());
  return `<section><div class="catalog-hero"><div><p class="eyebrow">${nowLabel()}</p><h1 class="page-title">Atrodi savu nākamo seansu.</h1><p class="lede">KINO NOX Lite ir lokāla mācību sistēma. Dati paliek šajā pārlūkā.</p></div></div>
  ${store.ok?'':'<div class="notice error">Šis pārlūks neļauj saglabāt datus (localStorage) — izmaiņas paliks tikai līdz lapas aizvēršanai. Ieteicams atvērt failu lokāli vai izmantot citu pārlūku.</div>'}
  <div class="utility-row"><div class="filters">${genres.map(g=>`<button class="${g===view.filter?'active':''}" data-filter="${g}">${g}</button>`).join('')}<button class="${view.todayOnly?'active':''}" data-action="today">Šodien</button></div>
  <span class="meta">${items.length} filmas · kārtotas: ${sortLabel()}</span></div>
  <div class="utility-row"><div class="form-grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));width:100%">
  <label>Meklēt filmu<input id="search" value="${view.query||''}" placeholder="Piemēram, orbītā"></label>
  <label>Kārtot<select id="sort-crit"><option value="title"${pref('sort','title')==='title'?' selected':''}>Nosaukums</option><option value="duration"${pref('sort','title')==='duration'?' selected':''}>Ilgums</option><option value="rating"${pref('sort','title')==='rating'?' selected':''}>Vērtējums</option></select></label>
  <label>Virziens<select id="sort-dir"><option value="asc"${pref('dir','asc')==='asc'?' selected':''}>Augoši</option><option value="desc"${pref('dir','asc')==='desc'?' selected':''}>Dilstoši</option></select></label>
  <label>Vecuma reitings<select id="age-filter"><option value="visi"${(view.age||'visi')==='visi'?' selected':''}>Visi</option><option value="12+"${view.age==='12+'?' selected':''}>12+ un augstāk</option><option value="16+"${view.age==='16+'?' selected':''}>Tikai 16+</option></select></label>
  <label>Cena<select id="price-filter"><option value="visi"${(view.priceBand||'visi')==='visi'?' selected':''}>Visi</option><option value="lidz8"${view.priceBand==='lidz8'?' selected':''}>Līdz 8,00 €</option><option value="no8lidz10"${view.priceBand==='no8lidz10'?' selected':''}>No 8,00 līdz 10,00 €</option><option value="virs10"${view.priceBand==='virs10'?' selected':''}>Virs 10,00 €</option></select></label>
  </div></div>
  ${items.length?`<div class="movie-grid">${items.map(m=>`<article class="movie" data-movie="${m.id}"><div class="poster" style="--poster:${m.accent}">${titleArt(m).replace(/\n/g,'<br>')}</div><h2>${m.title}</h2><div class="meta">${m.genre} · ${m.year} · ${durationLabel(m.duration)} · ${m.age}</div><div class="meta">★ ${m.rating.toFixed(1)}</div><div class="price">No ${money(m.price)}</div><div class="card-cta">Skatīt seansus →</div></article>`).join('')}</div>`
   :`<div class="empty-state">${q?`Neviena filma neatbilst meklēšanai «${view.query}».`:'Neviena filma neatbilst izvēlētajiem filtriem.'}<div class="form-actions" style="justify-content:center"><button class="button secondary" data-action="reset-filters">Rādīt visas filmas</button></div></div>`}</section>`
}

/* ---------- Filmas kartīte ---------- */
function movieDetail(){
  const m=movie(view.movieId);
  const band=view.priceBand||'visi';
  const all=[...state.screenings].filter(x=>x.movieId===m.id).sort((a,b)=>startsAt(a)-startsAt(b));
  /* US-16.05: cenu grupa filtrē seansus arī filmas kartītē. */
  const shows=all.filter(s=>priceInBand(s.price,band));
  const groups=[...new Set(shows.map(s=>s.date))];
  return `<section class="detail-layout"><div><div class="detail-poster" style="--poster:${m.accent}">${titleArt(m).replace(/\n/g,'<br>')}</div></div>
  <div class="detail-copy"><button class="subtle" data-nav="catalog">← Atpakaļ uz katalogu</button><p class="eyebrow">${m.genre}</p><h1>${m.title}</h1>
  <div class="facts"><span>${m.year}</span><span>${durationLabel(m.duration)}</span><span>${m.age}</span><span>${m.language}</span><span>Subtitri: ${m.subtitles}</span><span>★ ${m.rating.toFixed(1)}</span></div>
  <p>${m.description}</p><p class="meta">Režisors: ${m.director} · Lomās: ${m.actors}</p>
  ${m.trailer?'<button class="button secondary" data-action="trailer">▶ Skatīties treileri</button>':'<p class="meta">Treileris nav pieejams.</p>'}
  ${band!=='visi'?`<p class="meta">Cenu filtrs «${bandLabel(band)}»: redzami ${shows.length} no ${all.length} seansiem.</p>`:''}
  ${groups.map(g=>`<div class="panel"><h2>${dateLabel(g)}</h2>${shows.filter(s=>s.date===g).map(s=>{
    const closed=Date.now()>startsAt(s).getTime()-30*60*1000;
    return `<div class="showtime"><div><strong>${s.time}</strong>${isMorning(s)?' <span class="tag">Rīta atlaide −20 %</span>':''}<div class="meta">${s.hall} · ${dateLabel(s.date)} · no ${money(s.price)}</div></div>${closed?'<span class="tag">Pārdošana beigusies</span>':`<button class="button" data-show="${s.id}">Izvēlēties</button>`}</div>`}).join('')}</div>`).join('')}
  ${all.length&&!shows.length?'<div class="empty-state">Neviens seanss neatbilst izvēlētajai cenu grupai.</div>':''}
  ${view.notice?notice(view.notice):''}</div></section>`
}

/* ---------- Vietu izvēle ---------- */
function booking(){
  const s=screening(view.screeningId),m=movie(s.movieId),hall=state.halls[s.hall];
  const rows='ABCDEFG'.slice(0,hall.rows).split('');
  const inv=invSeats(s);   // US-16.07: invalīdu vietas ir atzīmētas atsevišķi
  const seatRows=rows.map(r=>`<div class="seat-row" style="--seats:${hall.seats}"><span class="row-label">${r}</span>${Array.from({length:hall.seats},(_,i)=>{let n=`${r}${i+1}`,taken=reserved(s.id).includes(n),selected=view.seats.includes(n),wheel=inv.includes(n);return `<button class="seat ${taken?'taken':''} ${selected?'selected':''} ${wheel?'wheel':''}" data-seat="${n}" ${taken?'disabled':''}${wheel?' title="Invalīdu vieta"':''}>${i+1}</button>`}).join('')}</div>`).join('');
  const up=unitPrice(s,view.typeId);
  return `<section>${steps('booking')}<button class="subtle" data-movie="${m.id}">← ${m.title}</button><div class="booking-layout"><div>
  <p class="eyebrow">${m.title} · ${s.time} · ${s.hall} · ${dateLabel(s.date)}</p><h1 class="page-title">Izvēlies vietas.</h1>
  <p class="meta">Rezervācija spēkā: <span class="timer" id="hold">${view.holdEnd?holdLabel(view.holdEnd-Date.now()):'10:00'}</span> · vienā pirkumā līdz ${MAX_SEATS} vietām</p>
  <div class="screen">EKRĀNS</div><div class="seat-map">${seatRows}</div>
  <div class="legend"><span><i></i>Brīva</span><span><i class="taken"></i>Aizņemta</span><span><i class="selected"></i>Izvēlēta</span><span><i class="wheel"></i>Invalīdu vieta${inv.length?`: ${inv.join(', ')}`:' šajā zālē nav'}</span></div></div>
  <aside class="panel"><h2>Pasūtījums</h2>
  <div class="summary-row"><span>Seanss</span><strong>${s.time}</strong></div>
  <div class="summary-row"><span>Datums</span><strong>${dateLabel(s.date)}</strong></div>
  <div class="summary-row"><span>Vietas</span><strong>${view.seats.length?view.seats.join(', '):'Nav izvēlētas'}</strong></div>
  <div class="form-grid"><label>Biļetes veids<select id="ticket-type">${state.ticketTypes.map(t=>`<option value="${t.id}" ${t.id===view.typeId?'selected':''}>${t.label} · ${money(Math.round(s.price*t.k*100)/100)}</option>`).join('')}</select></label></div>
  ${isMorning(s)?'<div class="summary-row"><span>Rīta atlaide</span><strong>−20 %</strong></div>':''}
  <div class="summary-row"><span>Cena par vietu</span><strong>${money(up)}</strong></div>
  <div class="summary-row total"><span>Kopā</span><span>${money(Math.round(up*view.seats.length*100)/100)}</span></div>
  <div class="form-actions"><button class="button" data-action="add-cart" ${view.seats.length?'':'disabled'}>Turpināt uz grozu</button></div>
  ${view.notice?notice(view.notice):''}</aside></div></section>`
}

/* ---------- Maksājuma forma (US-08.01, US-08.04) ----------
   Kartes dati tiek nolasīti tikai brīdī, kad cilvēks apstiprina pirkumu: tie netiek glabāti
   ne localStorage, ne pasūtījumā. Saglabājas vienīgi maskēti pēdējie 4 cipari un maksājuma
   atsauce — ar to pietiek biļetei un atmaksai. CVC netiek saglabāts nekad. */
function paymentPanel(total){
  if(view.paying) return `<div class="panel"><h2>Maksājums</h2>
  <p class="lede" id="pay-state">Maksājums tiek apstrādāts…</p>
  <p class="meta">Simulētais maksājumu pakalpojums atbild uzreiz — pirkuma iznākums parādīsies šajā lapā.</p></div>`;
  return `<div class="panel"><h2>Maksājuma dati</h2>
  <p class="meta">Mācību vide: maksājumu pakalpojums tiek simulēts. Ievadiet tikai testa kartes datus (piemēram, 4242 4242 4242 4242); īstus kartes datus šeit ievadīt nedrīkst.</p>
  <div class="form-grid">
  <label>E-pasts biļetei<input id="order-email" type="email" value="${state.profile?.email||''}" placeholder="vards@example.com"></label>
  <label>Kartes numurs<input id="card-number" inputmode="numeric" autocomplete="off" placeholder="4242 4242 4242 4242"></label>
  <label>Vārds uz kartes<input id="card-name" autocomplete="off" placeholder="VĀRDS UZVĀRDS"></label>
  <label>Derīguma termiņš (MM/GG)<input id="card-exp" inputmode="numeric" autocomplete="off" maxlength="5" placeholder="12/28"></label>
  <label>CVC<input id="card-cvc" inputmode="numeric" autocomplete="off" maxlength="3" placeholder="123"></label>
  </div>
  ${view.paymentError?notice(view.paymentError,'error'):''}
  <p class="meta">Apmaksājamā summa: <strong>${money(total)}</strong></p></div>`;
}

/* BUG-11 (US-11.01): divi seansi vienā zālē nedrīkst pārklāties — ņemot vērā filmas ilgumu.
   Atgriež konfliktējošo seansu vai null. */
function screeningConflict(scr,ignoreId){
  const m=movie(scr.movieId),dur=(m?m.duration:120)*60000;
  const a=startsAt(scr).getTime(),b=a+dur;
  return state.screenings.find(s=>{
    if(ignoreId&&s.id===ignoreId)return false;
    if(s.hall!==scr.hall||s.date!==scr.date)return false;
    const sm=movie(s.movieId),sd=(sm?sm.duration:120)*60000;
    const x=startsAt(s).getTime(),y=x+sd;
    return a<y&&x<b;
  })||null;
}
function conflictText(scr,c){
  const cm=movie(c.movieId);
  return `Zālē «${scr.hall}» ${dateLabel(scr.date)} plkst. ${scr.time} jau notiek filma «${cm?cm.title:'?'}» (${c.time}). Divi seansi vienā zālē nevar pārklāties.`;
}

/* ---------- Grozs ---------- */
function cart(){
  const c=view.cart;
  if(!c) return `<section><p class="eyebrow">Grozs</p><h1 class="page-title">Grozs ir tukšs.</h1><p class="lede">Izvēlieties filmu, seansu un vietas.</p>${view.notice?notice(view.notice,'error'):''}<button class="button" data-nav="catalog">Skatīt filmas</button></section>`;
  const m=movie(c.movieId),s=screening(c.screeningId),t=typeOf(c.typeId);
  const promo=(c.promo||'').toUpperCase();
  const subtotal=Math.round(c.unit*c.seats.length*100)/100;
  /* US-15.05 (tukšs lauks), US-15.11 (termiņš), US-16.14 (minimums), US-16.15 (fiksēta summa). */
  const res=c.promo?promoCalc(promo,subtotal):null;
  const off=res&&res.ok?res.off:0;
  const total=Math.round((subtotal-off)*100)/100;
  const vat=Math.round(subtotal*VAT/(1+VAT)*100)/100;
  const promoText=c.promoNotice
    ? c.promoNotice
    : (c.promo ? (res.ok ? `Atlaide ${res.label} ir piemērota.`
        : (res.reason==='beidzies' ? 'Atlaižu koda termiņš ir beidzies.'
        : (res.reason==='min' ? `Kods darbojas pasūtījumiem no ${money(res.min)}.`
        : 'Nederīgs atlaides kods.'))) : '');
  const promoType=c.promoNotice||!(res&&res.ok)?'error':'success';
  return `<section>${steps('cart')}<div class="booking-layout"><div><p class="eyebrow">Pirkuma apstiprināšana</p><h1 class="page-title">${m.title}</h1>
  <p class="lede">${dateLabel(s.date)} · ${s.time} · ${s.hall} · vietas ${c.seats.join(', ')}</p>
  <p class="meta">Rezervācija spēkā: <span class="timer" id="hold">${view.holdEnd?holdLabel(view.holdEnd-Date.now()):'10:00'}</span> — kad laiks beidzas, pasūtījums tiek anulēts un vietas atbrīvotas.</p>
  <div class="panel"><h2>Biļetes veids</h2><p class="meta">${t.label} · ${money(c.unit)} par vietu · ${c.seats.length} biļete(s)</p></div>
  <div class="panel"><h2>Atlaides kods</h2><div class="form-actions"><input id="promo" value="${c.promo||''}" placeholder="Piemēram, BLEGH"><button class="button secondary" data-action="promo">Piemērot</button></div>
  ${promoText?notice(promoText,promoType):''}</div>
  <div class="panel"><h2>Saņemšanas veids</h2><p class="meta">Biļete tiks parādīta uzreiz ekrānā. E-pasta nosūtīšana mācību vidē tiek simulēta.</p></div>
  ${paymentPanel(total)}</div>
  <aside class="panel"><h2>Kopsavilkums</h2>
  <div class="summary-row"><span>${c.seats.length} × ${t.label}</span><strong>${money(subtotal)}</strong></div>
  ${isMorning(s)?'<div class="summary-row"><span>Rīta atlaide</span><strong>−20 %</strong></div>':''}
  ${off?`<div class="summary-row"><span>Atlaide ${res.label}</span><strong>−${money(off)}</strong></div>`:''}
  <div class="summary-row"><span>t. sk. PVN ${Math.round(VAT*100)}%</span><strong>${money(vat)}</strong></div>
  <div class="summary-row total"><span>Kopā</span><span>${money(total)}</span></div>
  <p class="meta">Biļetes e-pasts tiek ievadīts maksājuma blokā (laukā «E-pasts biļetei»).</p>
  <div class="form-actions"><button class="button" data-action="checkout" ${view.paying?'disabled':''}>${view.paying?'Maksājums tiek apstrādāts…':'Apstiprināt pirkumu'}</button></div>
  ${view.notice?notice(view.notice):''}</aside></div></section>`
}

/* ---------- Biļete ---------- */
function cancelLink(o){
  const base=location.href.replace(/#.*$/,'');
  return `${base}#atcelt=${o.token}`;
}
/* US-15.07: e-pasts mācību vidē netiek sūtīts — parādām saiti, kas tajā būtu. */
function emailBlock(o){
  return `<div class="panel"><h2>Simulēts e-pasts</h2>
  <p class="meta">Kam: ${o.email} · Tēma: Tava biļete ${o.id}</p>
  <p>Mācību vidē e-pasts netiek sūtīts. Šī ir saite, kas e-pastā būtu — vari to atvērt pats:</p>
  <p><a href="#atcelt=${o.token}">${cancelLink(o)}</a></p>
  <div class="form-actions"><button class="button secondary" data-action="close-email">Aizvērt</button></div></div>`;
}
function ticket(){
  const o=view.order,m=movie(o.movieId),s=screening(o.screeningId),t=typeOf(o.typeId);
  const bits=Array.from({length:64},(_,i)=>((o.token.charCodeAt(i%o.token.length)+i)%3?'':'off'));
  const when=s?`${dateLabel(s.date)} · ${s.time} · ${s.hall}`:'Seanss atcelts kinoteātrī';
  const left=s?startsAt(s)-Date.now():0;
  const cancellable=!!s&&!o.cancelled&&left>=24*60*60*1000;
  const options=replacementOptions(o);
  return `<section>${steps('ticket')}<p class="eyebrow">${o.cancelled?'Pirkums atcelts':(o.screenCancelled?'Seanss atcelts kinoteātrī':'Pirkums apstiprināts')}</p><h1 class="page-title">Digitālā biļete</h1>
  <div class="ticket"${o.cancelled?' style="opacity:.55"':''}><p class="eyebrow">KINO NOX · ${o.id}</p><h2>${m.title}</h2>
  <div class="ticket-grid"><div><p><strong>${when}</strong></p><p>Vietas: <strong>${o.seats.join(', ')}</strong> · ${t.label}</p><p>Cena: <strong>${money(o.total)}</strong> (t. sk. PVN ${money(o.vat)})</p><p>Apmaksa: <strong>${o.payment?'apstiprināta':'—'}</strong>${o.payment?` · atsauce <strong>${o.payment.ref}</strong> · ${o.payment.at} · karte ${o.payment.card}`:''}</p><p class="meta">${o.email} · iegādāta ${o.created}${o.replacedFrom?` · pārcelta no ${o.replacedFrom}`:''}</p></div>
  <div class="qr">${bits.map(c=>`<b class="${c}"></b>`).join('')}</div></div></div>
  ${o.screenCancelled&&!o.cancelled?`<div class="panel"><h2>Seanss atcelts — izvēlies risinājumu</h2>
  <p class="meta">Kinoteātris atcēla seansu. Tev ir izvēle: pilna atmaksa vai cita biļete tajā pašā filmā.</p>
  <div class="form-actions"><button class="button" data-action="choose-refund" data-id="${o.id}">Pieprasīt atmaksu ${money(o.total)}</button></div>
  ${options.length?`<div class="form-grid"><label>Cita biļete<select id="replacement">${options.map(x=>`<option value="${x.id}">${dateLabel(x.date)} · ${x.time} · ${x.hall} · no ${money(x.price)}</option>`).join('')}</select></label></div>
  <div class="form-actions"><button class="button secondary" data-action="choose-screening" data-id="${o.id}">Izvēlēties citu seansu</button></div>`:'<p class="meta">Cits šīs filmas seanss šobrīd nav pieejams.</p>'}</div>`:''}
  ${/* US-16.18: daļēja atcelšana — tikai vairāku vietu pasūtījumam, kas vēl ir derīgs. */''}
  ${cancellable&&o.seats.length>1?`<div class="panel"><h2>Atcelt daļu biļešu</h2>
  <p class="meta">Atzīmē vietas, kuras atcelt. Atmaksa tiks aprēķināta tikai par atzīmētajām; pārējās biļetes paliek derīgas.</p>
  <div class="form-grid">${o.seats.map(n=>`<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" class="cancel-seat" value="${n}" ${(view.cancelSeats||[]).includes(n)?'checked':''}> Vieta ${n} · ${money(o.unit)}</label>`).join('')}</div>
  <div class="form-actions"><button class="button danger" data-action="cancel-seats" data-id="${o.id}">Atcelt atzīmētās vietas</button></div></div>`:''}
  <div class="form-actions">${cancellable?`<button class="button danger" data-action="cancel-order" data-id="${o.id}">Atcelt biļeti</button>`:''}
  <button class="button secondary" data-action="print">Drukāt biļeti</button>
  <button class="button secondary" data-action="send-link" data-id="${o.id}">Sūtīt saiti uz e-pastu (simulēts)</button>
  <button class="button" data-nav="catalog">Atpakaļ uz katalogu</button><button class="button secondary" data-nav="profile">Mani pasūtījumi</button></div>
  ${view.emailOpen?emailBlock(o):''}
  ${o.cancelled?notice(`Biļete atcelta. Atmaksāta summa: ${money(o.refunded)}.`,o.refunded?'success':'error'):''}
  ${!o.cancelled&&o.refunded?notice(`Par atceltajām vietām atmaksāts: ${money(o.refunded)}.`,(o.refunded>o.total?'error':'success')):''}
  ${view.notice?notice(view.notice):''}</section>`
}
/* US-15.08: citi šīs pašas filmas seansi, kurus vēl var nopirkt. */
function replacementOptions(o){
  return state.screenings.filter(x=>x.id!==o.screeningId&&x.movieId===o.movieId
    && startsAt(x)-30*60*1000>Date.now())
    .sort((a,b)=>startsAt(a)-startsAt(b));
}
/* Brīvās vietas zālē pēc kārtas — vajag, lai cita seansa biļeti varētu izsniegt automātiski. */
function freeSeats(s,n){
  const hall=state.halls[s.hall];
  const rows='ABCDEFG'.slice(0,hall.rows).split('');
  const taken=reserved(s.id),out=[];
  for(const r of rows){for(let i=1;i<=hall.seats;i++){const nm=`${r}${i}`;if(!taken.includes(nm))out.push(nm)}}
  return out.slice(0,n);
}
/* US-15.07: ekrāns, kas atveras pa saiti no (simulētā) e-pasta. */
function linkScreen(){
  const o=state.orders.find(x=>x.token===view.cancelToken);
  if(!o) return `<section><p class="eyebrow">Saite no e-pasta</p><h1 class="page-title">Saite nav derīga.</h1>
  <p class="lede">Biļete ar šādu saiti šajā pārlūkā nav atrasta. Ja biļeti pircējat citā pārlūkā, saite tur arī jāatver.</p>
  <div class="form-actions"><button class="button" data-nav="catalog">Skatīt filmas</button></div></section>`;
  const m=movie(o.movieId),s=screening(o.screeningId);
  const left=s?startsAt(s)-Date.now():0;
  const cancellable=!!s&&!o.cancelled&&left>=24*60*60*1000;
  return `<section><p class="eyebrow">Saite no e-pasta</p><h1 class="page-title">${m.title}</h1>
  <p class="lede">${o.id} · ${s?`${dateLabel(s.date)} · ${s.time} · ${s.hall}`:'seanss atcelts'} · vietas ${o.seats.join(', ')} · ${money(o.total)}</p>
  ${o.cancelled?notice(`Biļete jau atcelta. Atmaksāta summa: ${money(o.refunded)}.`,'success')
    :cancellable?`<div class="form-actions"><button class="button danger" data-action="cancel-order" data-id="${o.id}">Atcelt biļeti</button></div>`
    :notice('Atcelt nevar: līdz seansam ir mazāk nekā 24 stundas.','error')}
  <div class="form-actions"><button class="button secondary" data-nav="catalog">Uz katalogu</button></div></section>`;
}

/* ---------- Profils ---------- */
function profile(){
  const logged=state.profile;
  const mine=state.orders.filter(o=>!logged||o.email===logged.email);
  const users=state.users.map(u=>`<option value="${u.email}">${u.email}</option>`).join('');
  return `<section class="profile-layout"><div><p class="eyebrow">Profils</p><h1 class="page-title">${logged?logged.email:'Pieslēdzieties vai izveidojiet kontu.'}</h1>
  ${logged?`<div class="panel"><h2>Mani pasūtījumi</h2>${mine.length?mine.map(o=>{const sc=screening(o.screeningId);return `<div class="admin-row"><span><strong>${movie(o.movieId).title}</strong>${o.cancelled?' <span class="tag">Atcelta</span>':(o.screenCancelled?' <span class="tag">Seanss atcelts — gaida izvēli</span>':'')}<br><span class="meta">${sc?`${dateLabel(sc.date)} · ${sc.time}`:'seanss atcelts'} · ${o.created} · ${o.seats.join(', ')}</span></span><button class="button secondary" data-order="${o.id}">Biļete</button></div>`}).join(''):'<p class="meta">Pasūtījumu vēl nav.</p>'}</div>`:`<p class="lede">Šis konts ir lokāls šajā pārlūkā. Neievadiet īstu paroli.</p>`}
  ${view.notice?notice(view.notice):''}</div>
  <aside class="panel">${logged?`<h2>Pieslēgts</h2><p class="meta">Konts un pasūtījumi glabājas tikai šajā pārlūkā.</p>
  <p class="meta">Sesija beigsies pēc <span class="timer" id="session-left">${state.session?holdLabel(sessionLeft()):'—'}</span> — pirkuma laikā laiks tiek atlikts (US-13.02).</p>
  <button class="button secondary" data-action="logout">Iziet</button>`:`
  <h2>Izveidot vai atvērt profilu</h2>
  <div class="form-grid"><label>E-pasts<input id="profile-email" type="email" placeholder="vards@example.com" list="known-users"><datalist id="known-users">${users}</datalist></label>
  <label>Mācību parole<input id="profile-password" type="password" placeholder="Vismaz 8 rakstzīmes"></label></div>
  <p class="meta">Parolei jābūt vismaz 8 rakstzīmes, ar lielo un mazo burtu, ciparu un speciālo rakstzīmi.</p>
  <div class="form-actions"><button class="button" data-action="register">Izveidot kontu</button><button class="button secondary" data-action="login">Pieslēgties</button></div>
  <button class="subtle" data-action="forgot">Aizmirsu paroli</button>
  ${view.passwordView?notice(`Jauna pagaidu parole: <strong>${view.passwordView}</strong>. Mācību vidē tā tiek parādīta uzreiz.`,'success'):''}`}</aside></section>`
}

/* ---------- Operatora panelis ---------- */
function admin(){
  if(!state.operator) return `<section><p class="eyebrow">Operatora panelis</p><h1 class="page-title">Operatora pieslēgšanās</h1>
  <div class="panel" style="max-width:420px"><div class="form-grid"><label>Operatora parole<input id="op-pass" type="password" placeholder="Parole"></label></div>
  <div class="form-actions"><button class="button" data-action="op-login">Pieslēgties</button></div>${view.notice?notice(view.notice):''}</div></section>`;
  const movies=state.movies.map(m=>`<div class="admin-row"><span><strong>${m.title}</strong><br><span class="meta">${m.genre} · ${m.duration} min · ${money(m.price)}</span></span><button class="button secondary" data-action="edit-movie" data-id="${m.id}">Labot</button> <button class="button danger" data-action="delete-movie" data-id="${m.id}">Dzēst</button></div>`).join('');
  const screenings=state.screenings.map(s=>`<div class="admin-row"><span><strong>${movie(s.movieId).title}</strong><br><span class="meta">${dateLabel(s.date)} · ${s.time} · ${s.hall} · ${money(s.price)}</span></span><button class="button secondary" data-action="edit-screening" data-id="${s.id}">Labot</button> <button class="button secondary" data-action="new-screening" data-id="${s.movieId}">Pievienot seansu</button> <button class="button danger" data-action="cancel-screening" data-id="${s.id}">Atcelt</button></div>`).join('');
  const editing=view.editingMovie;
  const edSc=view.editingScreening?screening(view.editingScreening):null;
  const preMovie=String(view.screeningMovie||(edSc?edSc.movieId:''));
  return `<section class="admin-layout"><div>
  <p class="eyebrow">Operatora panelis</p><h1 class="page-title">Mācību dati</h1><p class="lede">Izmaiņas uzreiz saglabājas šajā pārlūkā. Izmantojiet atiestatīšanu, lai atgrieztu sākuma variantu.</p>
  <div class="panel"><h2>Filmas (${state.movies.length})</h2><div class="admin-list">${movies}</div></div>
  <div class="panel"><h2>Aktīvie seansi (${state.screenings.length})</h2><div class="admin-list">${screenings}</div></div>
  <div class="panel"><h2>Atlaižu kodi</h2><div class="admin-list">${Object.entries(state.promos).map(([k])=>{const p=promoOf(k)||{kind:'percent',value:0,min:0,until:''};const val=p.kind==='eur'?`−${money(p.value)}`:`−${p.value}%`;return `<div class="admin-row"><span><strong>${k}</strong> · ${val}${p.min?` · no ${money(p.min)}`:''} · ${p.until?(promoExpired(k)?`termiņš ${p.until} (beidzies)`:`termiņš ${p.until}`):'bez termiņa'}</span></div>`}).join('')}</div>
  <div class="form-grid"><label>Jauns kods<input id="promo-code" placeholder="PIEMĒRAM, VASARA"></label><label>Veids<select id="promo-kind"><option value="percent">Procenti</option><option value="eur">Fiksēta summa €</option></select></label><label>Atlaide<input id="promo-value" type="number" min="1" max="50" value="15"></label><label>Minimālā summa €<input id="promo-min" type="number" min="0" step="0.5" value="0"></label><label>Termiņš, ja vajag<input id="promo-until" type="date"></label></div>
  <div class="form-actions"><button class="button secondary" data-action="add-promo">Pievienot kodu</button></div></div>
  <div class="panel"><h2>Audita žurnāls</h2><div class="admin-list">${state.audit.length?state.audit.slice().reverse().map(a=>`<div class="admin-row"><span class="meta">${a.ts} · <strong>${a.action}</strong> · ${a.detail}</span></div>`).join(''):'<p class="meta">Ierakstu vēl nav.</p>'}</div></div>
  </div>
  <aside><div class="panel"><h2>${editing?'Labot filmu':'Pievienot filmu'}</h2>
  <div class="form-grid"><label>Nosaukums<input id="new-title" value="${editing?movie(editing).title:''}" placeholder="Filmas nosaukums"></label>
  <label>Žanrs<input id="new-genre" value="${editing?movie(editing).genre:''}" placeholder="Žanrs"></label>
  <label>Ilgums minūtēs<input id="new-duration" type="number" min="1" value="${editing?movie(editing).duration:100}"></label>
  <label>Cena €<input id="new-price" type="number" min="1" step="0.5" value="${editing?movie(editing).price:8}"></label>
  <label>Vecuma ierobežojums<input id="new-age" value="${editing?movie(editing).age:'7+'}"></label>
  <label>Apraksts<textarea id="new-description" placeholder="Īss apraksts">${editing?movie(editing).description:''}</textarea></label></div>
  <div class="form-actions"><button class="button" data-action="${editing?'save-movie':'add-movie'}">${editing?'Saglabāt':'Pievienot'}</button>${editing?'<button class="button secondary" data-action="cancel-edit">Atcelt</button>':''}</div></div>
  <div class="panel"><h2>${edSc?`Labot seansu #${edSc.id}`:'Jauns seanss'}</h2>
  <div class="form-grid"><label>Filma<select id="sc-movie">${state.movies.map(m=>`<option value="${m.id}"${preMovie===String(m.id)?' selected':''}>${m.title}</option>`).join('')}</select></label>
  <label>Datums<input id="sc-date" type="date" value="${edSc?edSc.date:isoDate(0)}"></label>
  <label>Laiks<input id="sc-time" type="time" value="${edSc?edSc.time:'19:00'}"></label>
  <label>Zāle<select id="sc-hall">${Object.keys(state.halls).map(h=>`<option${edSc&&edSc.hall===h?' selected':''}>${h}</option>`).join('')}</select></label>
  <label>Cena €<input id="sc-price" type="number" min="1" step="0.5" value="${edSc?edSc.price:8.5}"></label></div>
  <div class="form-actions"><button class="button" data-action="${edSc?'save-screening':'add-screening'}">${edSc?'Saglabāt seansu':'Izveidot seansu'}</button>${edSc?'<button class="button secondary" data-action="cancel-screening-edit">Atcelt labošanu</button>':''}</div>${view.notice?notice(view.notice):''}</div>
  <div class="panel"><h2>Mācību vide</h2><p class="meta">Versija ${VERSION}. Operators: ${state.operator?'pieslēgts':'—'}.</p>
  <div class="form-actions"><button class="button secondary" data-action="op-logout">Iziet</button><button class="button danger" data-action="reset">Atiestatīt visus datus</button></div></div></aside></section>`
}

function notice(n,type=''){return `<div class="notice ${type}">${n}</div>`}
function steps(cur){
  const list=[['movie','Filma'],['booking','Vietas'],['cart','Apmaksa'],['ticket','Biļete']];
  const ci=list.findIndex(x=>x[0]===cur);
  return `<ol class="steps" aria-label="Pirkuma soļi">${list.map((s,i)=>`<li class="${i<ci?'done':i===ci?'current':''}">${i<ci?'✓':'<b>'+(i+1)+'</b>'}${s[1]}</li>`).join('')}</ol>`;
}
function trailerModal(){
  const m=movie(view.movieId);
  return `<div class="modal-backdrop" data-backdrop="trailer"><div class="modal" role="dialog" aria-modal="true" aria-label="Treileris"><p class="eyebrow">Treileris</p><h2>${m?m.title:''}</h2>
  <div class="trailer-frame">Treileris mācību vidē netiek atskaņots.<br><span class="meta">Vieta demonstrācijai produkcijas versijā.</span></div>
  <div class="form-actions"><button class="button secondary" data-action="close-trailer">Aizvērt</button></div></div></div>`;
}
let lastScreen=null;
function render(){
  document.querySelectorAll('[data-nav]').forEach(b=>{const on=b.dataset.nav===view.screen;b.classList.toggle('active',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  document.querySelectorAll('[data-version]').forEach(el=>el.textContent=VERSION);
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  let html=view.screen==='link'?linkScreen():view.screen==='catalog'?catalog():view.screen==='movie'?movieDetail():view.screen==='booking'?booking():view.screen==='cart'?cart():view.screen==='ticket'?ticket():view.screen==='profile'?profile():admin();
  if(view.trailer) html+=trailerModal();
  app.innerHTML=html;updateCart();applyLang(document.body);
  const langSel=document.querySelector('#lang');if(langSel)langSel.value=state.lang||'lv';
  if(lastScreen!==view.screen){window.scrollTo({top:0,behavior:'smooth'});lastScreen=view.screen}
  if(view.screen==='booking'||view.screen==='cart') startHold(); else stopHold();
}

function addCart(){
  const s=screening(view.screeningId);
  const c={movieId:s.movieId,screeningId:s.id,seats:[...view.seats],typeId:view.typeId,unit:unitPrice(s,view.typeId),promo:'',promoNotice:''};
  view.cart=c;view.screen='cart';view.notice=null;view.paying=false;view.paymentError=null;snapshot(c);render();
}
function snapshot(c){view.cart=c}

/* ---------- Kartes datu pārbaude (US-08.04) ----------
   Vērtības tiek nolasītas no formas un tūlīt aizmirstas: glabājas tikai pēdējie 4 cipari. */
function digits(v){return String(v||'').replace(/\D/g,'')}
function readPayment(){
  const number=digits(document.querySelector('#card-number').value);
  const name=document.querySelector('#card-name').value.trim();
  const exp=document.querySelector('#card-exp').value.trim();
  const cvc=document.querySelector('#card-cvc').value.trim();
  if(number.length<13||number.length>19) return {error:'Kartes numuram jābūt 13–19 cipariem.'}
  if(name.length<3) return {error:'Ievadiet vārdu uz kartes.'}
  const m=/^(\d{1,2})\s*\/\s*(\d{2})$/.exec(exp);
  if(!m) return {error:'Derīguma termiņu rakstiet formā MM/GG.'}
  const mm=Number(m[1]),yy=Number(m[2]);
  if(mm<1||mm>12) return {error:'Derīguma mēnesim jābūt no 01 līdz 12.'}
  const now=new Date(),curY=now.getFullYear()%100,curM=now.getMonth()+1;
  if(yy<curY||(yy===curY&&mm<curM)) return {error:'Kartes derīguma termiņš ir beidzies.'}
  if(!/^\d{3}$/.test(cvc)) return {error:'CVC kodam jābūt 3 cipariem.'}
  return {last4:number.slice(-4)}
}

/* US-08.01: maksājums tiek apstrādāts nekavējoties — viens solis, uzreiz zināms iznākums. */
function checkout(){
  if(view.paying) return;                    // US-08.03: atkārtots klikšķis nerada otru pasūtījumu
  /* BUG-17 (US-05.02): ja rezervācijas laiks ir beidzies, pirkums netiek pieņemts. */
  if(view.holdEnd&&view.holdEnd-Date.now()<=0){
    stopHold();view.holdEnd=null;view.cart=null;view.seats=[];
    view.notice='Rezervācijas laiks ir beidzies — pasūtījums anulēts. Lūdzu, izvēlieties vietas no jauna.';
    return render();
  }
  const email=document.querySelector('#order-email').value.trim();
  if(!/^\S+@\S+\.\S+$/.test(email)){view.paymentError='Ievadiet derīgu e-pasta adresi.';render();return}
  const card=readPayment();
  if(card.error){view.paymentError=card.error;toast(card.error);render();return}
  const c=view.cart,taken=refreshReserved(c.screeningId);   // US-15.09: pārlasām no glabātavas
  if(c.seats.some(x=>taken.includes(x))){toast('Kāda vieta vairs nav pieejama. Atgriezieties pie seansa.');return}
  if(!c.seats.length){toast('Nav izvēlēta neviena vieta.');return}
  view.paymentError=null;view.paying=true;render();
  const started=Date.now();
  setTimeout(()=>finishPayment(email,card.last4,started),PAY_DELAY);
}

function finishPayment(email,last4,started){
  const c=view.cart;
  if(!c){view.paying=false;return render()}
  const taken=refreshReserved(c.screeningId);   // US-15.09: otra cilne varēja nopirkt šo vietu
  if(c.seats.some(x=>taken.includes(x))){view.paying=false;toast('Kāda vieta vairs nav pieejama. Atgriezieties pie seansa.');return render()}
  state.reserved[c.screeningId]=[...taken,...c.seats];
  const subtotal=Math.round(c.unit*c.seats.length*100)/100;
  const res=c.promo?promoCalc(c.promo,subtotal):null;
  const off=res&&res.ok?res.off:0;
  const total=Math.round((subtotal-off)*100)/100;
  const vat=Math.round(subtotal*VAT/(1+VAT)*100)/100;
  const ms=Date.now()-started;
  const payment={status:'apstiprinats',ref:'PAY-'+String(Date.now()).slice(-6),at:nowLabel(),ms,card:'•••• '+last4};
  const o={id:'KN-'+String(Date.now()).slice(-6),movieId:c.movieId,screeningId:c.screeningId,seats:c.seats,typeId:c.typeId,unit:c.unit,subtotal,promo:(c.promo||''),promoOff:off,total,vat,email,created:nowLabel(),token:Math.random().toString(36).slice(2,10).toUpperCase(),cancelled:false,refunded:0,screenCancelled:false,payment};
  state.orders.push(o);save();
  view={...view,screen:'ticket',order:o,seats:[],cart:null,notice:null,holdEnd:null,paying:false,paymentError:null,emailOpen:false,cancelToken:null,editingScreening:null,screeningMovie:null,query:'',age:'visi',priceBand:'visi',cancelSeats:[]};stopHold();render();
  toast(`Maksājums apstiprināts uzreiz (${(ms/1000).toFixed(1)} s).`);
}

document.addEventListener('click',e=>{
  const b=e.target.closest('button,[data-movie],[data-show],[data-seat],[data-filter],[data-order]');if(!b)return;
  if(b.dataset.nav)return nav(b.dataset.nav);
  if(b.dataset.action==='home')return nav('catalog');
  if(b.dataset.action==='trailer'){view.trailer=true;return render()}
  if(b.dataset.action==='close-trailer'){view.trailer=false;return render()}
  if(b.dataset.action==='print')return window.print();
  if(b.dataset.filter){view.filter=b.dataset.filter;return render()}
  if(b.dataset.action==='today'){view.todayOnly=!view.todayOnly;return render()}
  if(b.dataset.action==='reset-filters'){view.filter='Visi';view.todayOnly=false;view.age='visi';view.priceBand='visi';view.query='';return render()}
  if(b.dataset.movie){stopHold();view.screen='movie';view.movieId=Number(b.dataset.movie);view.notice=null;return render()}
  if(b.dataset.show){view.screen='booking';view.screeningId=Number(b.dataset.show);view.seats=[];view.holdEnd=null;view.notice=null;return render()}
  if(b.dataset.seat){
    const n=b.dataset.seat;
    if(view.seats.includes(n)){view.seats=view.seats.filter(x=>x!==n);view.notice=null;return render()}
    /* BUG-16 (US-05.05): vienā pirkumā ne vairāk kā MAX_SEATS vietas. Robeža tiek pārbaudīta
       pirms pievienošanas, un lietotājs saņem paziņojumu lapā, nevis klusu atteikumu. */
    if(view.seats.length>=MAX_SEATS){
      view.notice=`Vienā pirkumā var iegādāties ne vairāk kā ${MAX_SEATS} vietas.`;
      return render();
    }
    view.notice=null;
    view.seats=[...view.seats,n];return render();
  }
  if(b.dataset.action==='add-cart')return addCart();
  if(b.dataset.action==='promo'){
    /* US-15.05: tukšs lauks vai tikai atstarpes — vietējs paziņojums, nekas nemainās. */
    const raw=document.querySelector('#promo').value;
    if(!raw.trim()){view.cart.promo='';view.cart.promoNotice='Lūdzu, ievadiet atlaižu kodu.';return render()}
    view.cart.promo=raw.trim();view.cart.promoNotice='';return render();
  }
  if(b.dataset.action==='checkout')return checkout();
  if(b.dataset.action==='cancel-order'){
    const o=state.orders.find(x=>x.id===b.dataset.id);
    const s=screening(o.screeningId);
    o.cancelled=true;
    /* Mīna Nr.4 paliek apzināti: parastajā atcelšanā atmaksa tiek rēķināta no seansa cenas,
       nevis no samaksātās summas. Ja seansu jau atcēla kinoteātris, atgriežam apmaksāto summu. */
    const add=s?Math.round(s.price*o.seats.length*100)/100:o.total;
    o.refunded=Math.round(((o.refunded||0)+add)*100)/100;
    state.reserved[o.screeningId]=reserved(o.screeningId).filter(n=>!o.seats.includes(n));
    save();view.order=o;return render();
  }
  /* US-16.18: daļēja atcelšana — atmaksa tikai par atzīmētajām vietām. */
  if(b.dataset.action==='cancel-seats'){
    const o=state.orders.find(x=>x.id===b.dataset.id);
    const s=screening(o.screeningId);
    const picked=(view.cancelSeats||[]).filter(n=>o.seats.includes(n));
    if(!picked.length){view.notice='Atzīmējiet vismaz vienu vietu, ko atcelt.';return render()}
    const refund=s?Math.round(s.price*picked.length*100)/100:0;   // tā pati formula kā pilnajā atcelšanā
    o.refunded=Math.round(((o.refunded||0)+refund)*100)/100;
    o.seats=o.seats.filter(n=>!picked.includes(n));
    o.cancelled=o.seats.length===0;
    if(o.cancelled)o.cancelledAll=true;
    state.reserved[o.screeningId]=reserved(o.screeningId).filter(n=>!picked.includes(n));
    view.cancelSeats=[];
    save();view.order=o;
    view.notice=o.cancelled
      ?`Atceltas visas vietas — biļete slēgta. Atmaksāta summa: ${money(o.refunded)}.`
      :`Atceltas vietas: ${picked.join(', ')}. Atmaksāts: ${money(refund)}. Derīgās vietas: ${o.seats.join(', ')}.`;
    return render();
  }
  /* US-15.08: pircēja izvēle pēc kinoteātra atceltā seansa. */
  if(b.dataset.action==='choose-refund'){
    const o=state.orders.find(x=>x.id===b.dataset.id);
    o.cancelled=true;o.refunded=o.total;o.screenChoice='atmaksa';
    state.reserved[o.screeningId]=reserved(o.screeningId).filter(n=>!o.seats.includes(n));
    save();view.order=o;view.notice=`Atmaksa apstiprināta: ${money(o.refunded)}.`;return render();
  }
  if(b.dataset.action==='choose-screening'){
    const o=state.orders.find(x=>x.id===b.dataset.id);
    const pick=document.querySelector('#replacement');
    const target=pick?screening(pick.value):null;
    if(!target){view.notice='Izvēlieties citu seansu.';return render()}
    const seats=freeSeats(target,o.seats.length);
    if(seats.length<o.seats.length){view.notice='Šajā seansā nav pietiekami daudz brīvu vietu.';return render()}
    state.reserved[target.id]=[...reserved(target.id),...seats];
    const no={...o,id:'KN-'+String(Date.now()).slice(-6),screeningId:target.id,seats,created:nowLabel(),
      cancelled:false,refunded:0,screenCancelled:false,screenChoice:'cita biļete',replacedFrom:o.id,
      token:Math.random().toString(36).slice(2,10).toUpperCase()};
    o.cancelled=true;o.refunded=0;o.replacedBy=no.id;
    state.orders.push(no);save();view.order=no;
    view.notice=`Biļete pārcelta: ${dateLabel(target.date)} · ${target.time} · ${target.hall}, vietas ${seats.join(', ')}.`;
    return render();
  }
  if(b.dataset.action==='send-link'){view.emailOpen=true;return render()}
  if(b.dataset.action==='close-email'){view.emailOpen=false;return render()}
  if(b.dataset.order){const o=state.orders.find(x=>x.id===b.dataset.order);view={...view,screen:'ticket',order:o,notice:null};return render()}
  if(b.dataset.action==='forgot'){view.passwordView='TEMP-'+Math.random().toString(36).slice(2,6).toUpperCase();return render()}
  if(b.dataset.action==='register'||b.dataset.action==='login'){
    const email=document.querySelector('#profile-email').value.trim(),pass=document.querySelector('#profile-password').value;
    if(!/^\S+@\S+\.\S+$/.test(email)){view.notice='Ievadiet derīgu e-pasta adresi.';return render()}
    if(pass.length<8||!/[A-ZĀČĒĢĪĶĻŅŠŪŽ]/.test(pass)||!/[a-zāčēģīķļņšūž]/.test(pass)||!/\d/.test(pass)||!/[^\w\s]/.test(pass)){view.notice='Parolei jābūt vismaz 8 rakstzīmes ar lielo un mazo burtu, ciparu un speciālo rakstzīmi.';return render()}
    let u=state.users.find(x=>x.email.toLowerCase()===email.toLowerCase());
    if(b.dataset.action==='register'&&!u){u={email,salt:randHex(16),algo:'sha256',fails:0,blocked:false};u.hash=hashPassword(pass,u.salt);state.users.push(u)}
    if(!u||u.hash!==hashPassword(pass,u.salt)){
      if(u){u.fails=(u.fails||0)+1;if(u.fails>3){u.blocked=true;save();view.notice='Konts bloķēts pēc vairākiem neveiksmīgiem mēģinājumiem. Izmantojiet paroles atiestatīšanu.';return render()}}
      view.notice='E-pasts vai mācību parole nav pareiza.';save();return render()
    }
    if(u.blocked){view.notice='Konts ir bloķēts. Izmantojiet paroles atiestatīšanu.';return render()}
    u.fails=0;state.profile={email:u.email};startSession();save();view.notice=null;view.passwordView=null;return render()
  }
  if(b.dataset.action==='logout'){state.profile=null;state.session=null;save();return nav('profile')}
  if(b.dataset.action==='op-login'){
    const pass=document.querySelector('#op-pass').value;
    if(pass!==OPERATOR_PASSWORD){view.notice='Nepareiza operatora parole.';return render()}
    state.operator=true;save();audit('Pieslēgšanās','Operators pieslēdzās');view.notice=null;return render();
  }
  if(b.dataset.action==='op-logout'){state.operator=false;audit('Iziet','Operators izgāja');save();return nav('admin')}
  if(b.dataset.action==='edit-movie'){view.editingMovie=Number(b.dataset.id);return render()}
  if(b.dataset.action==='cancel-edit'){view.editingMovie=null;return render()}
  if(b.dataset.action==='delete-movie'){
    const id=Number(b.dataset.id);
    state.movies=state.movies.filter(m=>m.id!==id);
    state.screenings=state.screenings.filter(s=>s.movieId!==id);
    audit('Dzēsta filma',movie(id)?movie(id).title:'ID '+id);save();view.notice='Filma dzēsta.';return render();
  }
  if(b.dataset.action==='add-movie'||b.dataset.action==='save-movie'){
    const title=document.querySelector('#new-title').value.trim(),genre=document.querySelector('#new-genre').value.trim(),duration=Number(document.querySelector('#new-duration').value),price=Number(document.querySelector('#new-price').value),age=document.querySelector('#new-age').value.trim(),description=document.querySelector('#new-description').value.trim();
    if(!title||!genre||!duration||!price||duration<1||price<=0){view.notice='Aizpildiet nosaukumu, žanru, ilgumu (vismaz 1 min) un cenu (lielāku par 0).';return render()}
    if(b.dataset.action==='save-movie'){
      const m=movie(view.editingMovie);Object.assign(m,{title,genre,duration,price,age:age||m.age,description:description||m.description});
      audit('Labota filma',title);view.editingMovie=null;view.notice='Filma saglabāta.';save();return render();
    }
    state.movies.push({id:Math.max(...state.movies.map(x=>x.id))+1,title,genre,year:new Date().getFullYear(),duration,age:age||'7+',language:'Latviešu',subtitles:'Nav',director:'—',actors:'—',rating:0,trailer:false,price,accent:'linear-gradient(135deg,#243142,#5f7289)',description:description||'Mācību filmas apraksts.'});
    audit('Pievienota filma',title);save();view.notice='Filma ir pievienota lokālajiem datiem.';return render();
  }
  /* US-15.06: seansa maiņa un strādājoša poga seansa rindā. */
  if(b.dataset.action==='new-screening'){
    view.screeningMovie=Number(b.dataset.id);view.editingScreening=null;
    view.notice='Atvērta jauna seansa forma ar izvēlētu filmu.';return render();
  }
  if(b.dataset.action==='edit-screening'){
    view.editingScreening=Number(b.dataset.id);view.screeningMovie=null;view.notice=null;return render();
  }
  if(b.dataset.action==='cancel-screening-edit'){view.editingScreening=null;view.notice=null;return render()}
  if(b.dataset.action==='add-screening'||b.dataset.action==='save-screening'){
    const movieId=Number(document.querySelector('#sc-movie').value),
          date=document.querySelector('#sc-date').value,
          time=document.querySelector('#sc-time').value,
          hall=document.querySelector('#sc-hall').value,
          price=Number(document.querySelector('#sc-price').value);
    if(!date||!time||!movieId||!price){view.notice='Norādiet filmu, datumu, laiku un cenu.';return render()}
    /* BUG-11: viena zāle vienā laikā — pārbaude arī labošanā (izņemot pašu seansu). */
    const candidate={movieId,date,time,hall},
          clash=screeningConflict(candidate,b.dataset.action==='save-screening'?view.editingScreening:null);
    if(clash){view.notice=conflictText(candidate,clash);return render()}
    if(b.dataset.action==='save-screening'){
      const s=screening(view.editingScreening);
      Object.assign(s,{movieId,date,time,hall,price});
      audit('Labots seanss',`${movie(movieId).title} · ${date} ${time} · ${hall} · ${money(price)}`);
      view.editingScreening=null;view.notice='Seanss saglabāts.';save();return render();
    }
    state.screenings.push({id:Math.max(...state.screenings.map(x=>x.id))+1,movieId,date,time,hall,price});
    audit('Izveidots seanss',`${movie(movieId).title} · ${date} ${time}`);
    view.screeningMovie=null;save();view.notice='Seanss izveidots.';return render();
  }
  if(b.dataset.action==='cancel-screening'){
    const id=Number(b.dataset.id),s=screening(id);
    state.screenings=state.screenings.filter(x=>x.id!==id);
    /* US-15.08: apmaksātos pasūtījumus vairs neatceļam klusi — pircējs izvēlas atmaksu vai citu biļeti. */
    let waiting=0;
    for(const o of state.orders.filter(x=>x.screeningId===id&&!x.cancelled&&!x.screenCancelled)){
      o.screenCancelled=true;waiting++;
    }
    audit('Atcelts seanss',`${movie(s.movieId).title} · ${s.date} ${s.time}`);
    save();
    view.notice=waiting
      ?`Seanss atcelts. ${waiting} apmaksāts(-i) pasūtījums(-i) gaida pircēja izvēli: atmaksa vai cita biļete.`
      :'Seanss atcelts.';
    return render();
  }
  if(b.dataset.action==='add-promo'){
    const code=document.querySelector('#promo-code').value.trim().toUpperCase(),
          kindEl=document.querySelector('#promo-kind'),
          kind=kindEl?kindEl.value:'percent',
          val=Number(document.querySelector('#promo-value').value),
          minEl=document.querySelector('#promo-min'),
          min=minEl?(Number(minEl.value)||0):0,
          untilInput=document.querySelector('#promo-until'),
          until=untilInput?untilInput.value:'';
    if(!code||!val){view.notice='Norādiet koda nosaukumu un atlaidi.';return render()}
    /* BUG-12 / BUG-13 (US-07.03): maksimālā atlaide ir 50 % — lielāku kodu sistēma nepieņem. */
    if(kind==='percent'&&(val<1||val>50)){
      view.notice=`Procentu atlaide var būt no 1 līdz 50 %. Kods «${code}» netika pievienots.`;
      return render();
    }
    if(kind==='eur'&&val<0){view.notice='Fiksētā atlaide nevar būt negatīva.';return render()}
    state.promos[code]={kind,value:val,min,until};
    audit('Pievienots atlaides kods',`${code} · ${kind==='eur'?`−${money(val)}`:`−${val}%`}${min?` · no ${money(min)}`:''}${until?` · termiņš ${until}`:''}`);
    save();view.notice='Atlaides kods pievienots.';return render();
  }
  if(b.dataset.action==='reset'){
    const keepProfile=state.profile;
    state=clone(seed);state.profile=keepProfile;
    lsDel(KEY);save();
    view={screen:'catalog',movieId:null,screeningId:null,seats:[],typeId:'pieauguso',cart:null,filter:'Visi',todayOnly:false,order:null,notice:null,holdEnd:null,passwordView:null,paying:false,paymentError:null,emailOpen:false,cancelToken:null,editingScreening:null,screeningMovie:null,query:'',age:'visi',priceBand:'visi',cancelSeats:[]};
    audit('Atiestatīti dati','Sākuma stāvoklis');
    toast('Mācību dati ir atiestatīti.');return render();
  }
});

/* US-16.01: meklēšana rakstot — pēc pārzīmēšanas fokuss atgriežas laukā. */
document.addEventListener('input',e=>{
  if(e.target.id!=='search')return;
  view.query=e.target.value;
  render();
  const el=document.querySelector('#search');
  if(el){el.focus();el.setSelectionRange(el.value.length,el.value.length)}
});
document.addEventListener('change',e=>{
  if(e.target.id==='lang'){setLang(e.target.value);return}
  if(e.target.id==='ticket-type'){view.typeId=e.target.value;return render()}
  /* US-16.02: kārtošana saglabājas; US-16.04 un US-16.05: filtri. */
  if(e.target.id==='sort-crit'){setPref('sort',e.target.value);return render()}
  if(e.target.id==='sort-dir'){setPref('dir',e.target.value);return render()}
  if(e.target.id==='age-filter'){view.age=e.target.value;return render()}
  if(e.target.id==='price-filter'){view.priceBand=e.target.value;return render()}
  /* US-16.18: atzīmes daļējai atcelšanai — bez pārzīmēšanas, lai atzīmes nepazustu. */
  if(e.target.classList&&e.target.classList.contains('cancel-seat')){
    const set=new Set(view.cancelSeats||[]);
    if(e.target.checked)set.add(e.target.value);else set.delete(e.target.value);
    view.cancelSeats=[...set];
    return;
  }
});
document.addEventListener('click',e=>{if(e.target.dataset&&e.target.dataset.backdrop){view.trailer=false;render()}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&view.trailer){view.trailer=false;render()}});

/* Vecākā glabātava (0.2.1 un agrāk) saturēja paroli atklātā tekstā, bet atlaides kods — tikai
   procentus; pārrakstām abus uzreiz pēc palaišanas. */
if(needsMigration){needsMigration=false;save()}
/* US-15.07: saite no (simulētā) e-pasta — #atcelt=<token> atver atcelšanas ekrānu. */
const linkMatch=/#atcelt=([A-Za-z0-9]+)/.exec(location.hash||'');
if(linkMatch){view.screen='link';view.cancelToken=linkMatch[1]}
render();
/* US-13.02: sesijas pulkstenis. US-05.03: citu cilņu izmaiņas (servera emulācija). */
setInterval(sessionTick,1000);
if(store.ok)window.addEventListener('storage',e=>{if(e.key===KEY)onStoreChanged()});
sessionTick();
