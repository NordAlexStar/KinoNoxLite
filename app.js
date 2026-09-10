const KEY = 'kino-nox-lite-v1';
const VERSION = '0.2.1';
const VAT = 0.21;
const MAX_SEATS = 8;
const OPERATOR_PASSWORD = 'op2026';

function isoDate(offset){const t=new Date();t.setDate(t.getDate()+offset);return t.toISOString().slice(0,10)}
function todayISO(){return new Date().toISOString().slice(0,10)}

const seed = {
  movies: [
    {id:1,title:'Neona pilsēta',genre:'Trilleris',year:2026,duration:118,age:'16+',language:'Angļu',subtitles:'Latviešu',director:'Māra Ozola',actors:'I. Kalniņš, A. Bērziņa',rating:8.1,trailer:true,price:8.5,accent:"url('assets/poster-neona-pilseta.png')",description:'Pēc nakts lietus Rīga iemirdzas neona krāsās. Detektīve Mara atrod pavedienu, kas ved pāri pilsētai un pašai sev pāri.'},
    {id:2,title:'Mēness arhīvs',genre:'Zinātniskā fantastika',year:2026,duration:132,age:'12+',language:'Angļu',subtitles:'Latviešu',director:'Jānis Vītols',actors:'K. Ozoliņa, R. Lapsa',rating:7.6,trailer:true,price:9,accent:"url('assets/poster-meness-arhivs.png')",description:'Uz pamestas Mēness stacijas atstāta balss ieraksta atklāj stāstu, kuru neviens nebija paredzējis dzirdēt.'},
    {id:3,title:'Vasaras otra puse',genre:'Drāma',year:2025,duration:104,age:'7+',language:'Latviešu',subtitles:'Angļu',director:'Līga Bērza',actors:'A. Ozols, M. Kūla',rating:7.9,trailer:false,price:7.5,accent:"url('assets/poster-vasaras-otra-puse.png')",description:'Draudzība, kas sākas vienā vasarā, iemāca pieaugt daudz ātrāk nekā gribētos.'},
    {id:4,title:'Savvaļas signāls',genre:'Piedzīvojumu',year:2025,duration:96,age:'7+',language:'Latviešu',subtitles:'Nav',director:'Pēteris Kalns',actors:'E. Sproģe, T. Vīksna',rating:6.8,trailer:false,price:7.5,accent:"url('assets/poster-savvalas-signals.png')",description:'Jauna biologu komanda seko noslēpumainam radiosignālam dziļi mežā.'}
  ],
  screenings: [
    {id:1,movieId:1,date:isoDate(0),time:'18:30',hall:'Zāle 1',price:8.5},
    {id:2,movieId:1,date:isoDate(0),time:'21:15',hall:'Zāle 2',price:9.5},
    {id:3,movieId:2,date:isoDate(0),time:'19:10',hall:'Zāle 3',price:9},
    {id:4,movieId:2,date:isoDate(1),time:'22:00',hall:'Zāle 1',price:10},
    {id:5,movieId:3,date:isoDate(1),time:'17:45',hall:'Zāle 2',price:7.5},
    {id:6,movieId:4,date:isoDate(2),time:'16:20',hall:'Zāle 1',price:7.5},
    {id:7,movieId:3,date:isoDate(0),time:'15:00',hall:'Zāle 3',price:7.5}
  ],
  halls:{'Zāle 1':{rows:6,seats:10},'Zāle 2':{rows:5,seats:8},'Zāle 3':{rows:7,seats:12}},
  reserved:{1:['A2','C7'],2:['B4'],3:['A1','A2','D5'],4:['C3'],5:['B6'],6:['E8'],7:[]},
  ticketTypes:[
    {id:'pieauguso',label:'Pieaugušo',k:1},
    {id:'skolena',label:'Skolēna',k:0.7},
    {id:'studenta',label:'Studenta',k:0.7},
    {id:'seniora',label:'Seniora (no 60 g.)',k:0.6},
    {id:'bernu',label:'Bērnu (līdz 12 g.)',k:0.5}
  ],
  users:[],orders:[],promos:{BLEGH:10,SKOLA25:25},audit:[],profile:null,operator:false
};

let state = load();
let view = {screen:'catalog',movieId:null,screeningId:null,seats:[],typeId:'pieauguso',cart:null,filter:'Visi',todayOnly:false,order:null,notice:null,holdEnd:null,passwordView:null,trailer:false};
let holdTimer = null;

const app = document.querySelector('#app');
function clone(x){return JSON.parse(JSON.stringify(x))}
const store={mem:{},ok:(()=>{try{localStorage.setItem('__probe','1');localStorage.removeItem('__probe');return true}catch{return false}})()};
function lsGet(k){try{return store.ok?localStorage.getItem(k):(k in store.mem?store.mem[k]:null)}catch{return k in store.mem?store.mem[k]:null}}
function lsSet(k,v){try{if(store.ok)localStorage.setItem(k,v);else store.mem[k]=v}catch{store.mem[k]=v}}
function lsDel(k){try{if(store.ok)localStorage.removeItem(k);else delete store.mem[k]}catch{delete store.mem[k]}}
function load(){try{return {...clone(seed),...JSON.parse(lsGet(KEY))}}catch{return clone(seed)}}
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
function unitPrice(s,typeId){return Math.round(s.price*typeOf(typeId).k*100)/100}
function startsAt(s){return new Date(s.date+'T'+s.time+':00')}
function titleArt(m){return m.title.replace(/ /g,'\n')}
function audit(action,detail){state.audit.push({ts:nowLabel(),action,detail});if(state.audit.length>60)state.audit.shift()}
function toast(text){const t=document.querySelector('#toast');t.textContent=text;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2800)}
function updateCart(){const n=view.cart&&view.cart.seats?view.cart.seats.length:0;document.querySelector('#cart-count').textContent=n}
function nav(screen){stopHold();view={screen,movieId:null,screeningId:null,seats:[],typeId:'pieauguso',cart:null,filter:view.filter,todayOnly:view.todayOnly,order:null,notice:null,holdEnd:null,passwordView:null};render();app.focus()}

function stopHold(){if(holdTimer){clearInterval(holdTimer);holdTimer=null}}
function holdLabel(ms){const s=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`}
function startHold(){
  if(!view.holdEnd) view.holdEnd=Date.now()+10*60*1000;
  stopHold();
  holdTimer=setInterval(()=>{
    const left=view.holdEnd-Date.now();
    const el=document.querySelector('#hold');
    if(el) el.textContent=holdLabel(left);
    if(left<=0){stopHold();view.seats=[];view.holdEnd=null;view.notice='Rezervācijas laiks beidzās — vietas atbrīvotas citiem pircējiem.';render()}
  },1000);
}

/* ---------- Katalogs ---------- */
function catalog(){
  const genres=['Visi',...new Set(state.movies.map(x=>x.genre))];
  const today=todayISO();
  let items=state.movies.filter(m=>view.filter==='Visi'||m.genre===view.filter);
  if(view.todayOnly) items=items.filter(m=>state.screenings.some(s=>s.movieId===m.id&&s.date===today));
  items=[...items].sort((a,b)=>a.title.localeCompare(b.title,'lv'));
  return `<section><div class="catalog-hero"><div><p class="eyebrow">${nowLabel()}</p><h1 class="page-title">Atrodi savu nākamo seansu.</h1><p class="lede">KINO NOX Lite ir lokāla mācību sistēma. Dati paliek šajā pārlūkā.</p></div></div>
  ${store.ok?'':'<div class="notice error">Šis pārlūks neļauj saglabāt datus (localStorage) — izmaiņas paliks tikai līdz lapas aizvēršanai. Ieteicams atvērt failu lokāli vai izmantot citu pārlūku.</div>'}
  <div class="utility-row"><div class="filters">${genres.map(g=>`<button class="${g===view.filter?'active':''}" data-filter="${g}">${g}</button>`).join('')}<button class="${view.todayOnly?'active':''}" data-action="today">Šodien</button></div><span class="meta">${items.length} filmas · kārtotas alfabētiski</span></div>
  ${items.length?`<div class="movie-grid">${items.map(m=>`<article class="movie" data-movie="${m.id}"><div class="poster" style="--poster:${m.accent}">${titleArt(m).replace(/\n/g,'<br>')}</div><h2>${m.title}</h2><div class="meta">${m.genre} · ${m.year} · ${m.duration} min · ${m.age}</div><div class="meta">★ ${m.rating.toFixed(1)}</div><div class="price">No ${money(m.price)}</div><div class="card-cta">Skatīt seansus →</div></article>`).join('')}</div>`:'<div class="empty-state">Neviena filma neatbilst izvēlētajam filtram.<div class="form-actions" style="justify-content:center"><button class="button secondary" data-filter="Visi">Rādīt visas filmas</button></div></div>'}</section>`
}

/* ---------- Filmas kartīte ---------- */
function movieDetail(){
  const m=movie(view.movieId);
  const shows=[...state.screenings].filter(x=>x.movieId===m.id).sort((a,b)=>startsAt(a)-startsAt(b));
  const groups=[...new Set(shows.map(s=>s.date))];
  return `<section class="detail-layout"><div><div class="detail-poster" style="--poster:${m.accent}">${titleArt(m).replace(/\n/g,'<br>')}</div></div>
  <div class="detail-copy"><button class="subtle" data-nav="catalog">← Atpakaļ uz katalogu</button><p class="eyebrow">${m.genre}</p><h1>${m.title}</h1>
  <div class="facts"><span>${m.year}</span><span>${m.duration} min</span><span>${m.age}</span><span>${m.language}</span><span>Subtitri: ${m.subtitles}</span><span>★ ${m.rating.toFixed(1)}</span></div>
  <p>${m.description}</p><p class="meta">Režisors: ${m.director} · Lomās: ${m.actors}</p>
  ${m.trailer?'<button class="button secondary" data-action="trailer">▶ Skatīties treileri</button>':'<p class="meta">Treileris nav pieejams.</p>'}
  ${groups.map(g=>`<div class="panel"><h2>${dateLabel(g)}</h2>${shows.filter(s=>s.date===g).map(s=>{
    const closed=Date.now()>startsAt(s).getTime()-30*60*1000;
    return `<div class="showtime"><div><strong>${s.time}</strong><div class="meta">${s.hall} · ${dateLabel(s.date)} · no ${money(s.price)}</div></div>${closed?'<span class="tag">Pārdošana beigusies</span>':`<button class="button" data-show="${s.id}">Izvēlēties</button>`}</div>`}).join('')}</div>`).join('')}
  ${view.notice?notice(view.notice):''}</div></section>`
}

/* ---------- Vietu izvēle ---------- */
function booking(){
  const s=screening(view.screeningId),m=movie(s.movieId),hall=state.halls[s.hall];
  const rows='ABCDEFG'.slice(0,hall.rows).split('');
  const seatRows=rows.map(r=>`<div class="seat-row" style="--seats:${hall.seats}"><span class="row-label">${r}</span>${Array.from({length:hall.seats},(_,i)=>{let n=`${r}${i+1}`,taken=reserved(s.id).includes(n),selected=view.seats.includes(n);return `<button class="seat ${taken?'taken':''} ${selected?'selected':''}" data-seat="${n}" ${taken?'disabled':''}>${i+1}</button>`}).join('')}</div>`).join('');
  const up=unitPrice(s,view.typeId);
  return `<section>${steps('booking')}<button class="subtle" data-movie="${m.id}">← ${m.title}</button><div class="booking-layout"><div>
  <p class="eyebrow">${m.title} · ${s.time} · ${s.hall} · ${dateLabel(s.date)}</p><h1 class="page-title">Izvēlies vietas.</h1>
  <p class="meta">Rezervācija spēkā: <span class="timer" id="hold">${view.holdEnd?holdLabel(view.holdEnd-Date.now()):'10:00'}</span> · vienā pirkumā līdz ${MAX_SEATS} vietām</p>
  <div class="screen">EKRĀNS</div><div class="seat-map">${seatRows}</div>
  <div class="legend"><span><i></i>Brīva</span><span><i class="taken"></i>Aizņemta</span><span><i class="selected"></i>Izvēlēta</span></div></div>
  <aside class="panel"><h2>Pasūtījums</h2>
  <div class="summary-row"><span>Seanss</span><strong>${s.time}</strong></div>
  <div class="summary-row"><span>Datums</span><strong>${dateLabel(s.date)}</strong></div>
  <div class="summary-row"><span>Vietas</span><strong>${view.seats.length?view.seats.join(', '):'Nav izvēlētas'}</strong></div>
  <div class="form-grid"><label>Biļetes veids<select id="ticket-type">${state.ticketTypes.map(t=>`<option value="${t.id}" ${t.id===view.typeId?'selected':''}>${t.label} · ${money(Math.round(s.price*t.k*100)/100)}</option>`).join('')}</select></label></div>
  <div class="summary-row"><span>Cena par vietu</span><strong>${money(up)}</strong></div>
  <div class="summary-row total"><span>Kopā</span><span>${money(Math.round(up*view.seats.length*100)/100)}</span></div>
  <div class="form-actions"><button class="button" data-action="add-cart" ${view.seats.length?'':'disabled'}>Turpināt uz grozu</button></div>
  ${view.notice?notice(view.notice):''}</aside></div></section>`
}

/* ---------- Grozs ---------- */
function cart(){
  const c=view.cart;
  if(!c) return `<section><p class="eyebrow">Grozs</p><h1 class="page-title">Grozs ir tukšs.</h1><p class="lede">Izvēlieties filmu, seansu un vietas.</p><button class="button" data-nav="catalog">Skatīt filmas</button></section>`;
  const m=movie(c.movieId),s=screening(c.screeningId),t=typeOf(c.typeId);
  const promo=(c.promo||'').toUpperCase();
  const discount=state.promos[promo]||0;
  const subtotal=Math.round(c.unit*c.seats.length*100)/100;
  const total=Math.round(subtotal*(1-discount/100)*100)/100;
  const vat=Math.round(subtotal*VAT/(1+VAT)*100)/100;
  return `<section>${steps('cart')}<div class="booking-layout"><div><p class="eyebrow">Pirkuma apstiprināšana</p><h1 class="page-title">${m.title}</h1>
  <p class="lede">${dateLabel(s.date)} · ${s.time} · ${s.hall} · vietas ${c.seats.join(', ')}</p>
  <div class="panel"><h2>Biļetes veids</h2><p class="meta">${t.label} · ${money(c.unit)} par vietu · ${c.seats.length} biļete(s)</p></div>
  <div class="panel"><h2>Atlaides kods</h2><div class="form-actions"><input id="promo" value="${c.promo||''}" placeholder="Piemēram, BLEGH"><button class="button secondary" data-action="promo">Piemērot</button></div>
  ${c.promo?notice(discount?`Atlaide ${discount}% ir piemērota.`:'Nederīgs atlaides kods.',discount?'success':'error'):''}</div>
  <div class="panel"><h2>Saņemšanas veids</h2><p class="meta">Biļete tiks parādīta uzreiz ekrānā. E-pasta nosūtīšana mācību vidē tiek simulēta.</p></div></div>
  <aside class="panel"><h2>Kopsavilkums</h2>
  <div class="summary-row"><span>${c.seats.length} × ${t.label}</span><strong>${money(subtotal)}</strong></div>
  ${discount?`<div class="summary-row"><span>Atlaide</span><strong>−${discount}%</strong></div>`:''}
  <div class="summary-row"><span>t. sk. PVN ${Math.round(VAT*100)}%</span><strong>${money(vat)}</strong></div>
  <div class="summary-row total"><span>Kopā</span><span>${money(total)}</span></div>
  <div class="form-grid"><label>E-pasts biļetei<input id="order-email" type="email" value="${state.profile?.email||''}" placeholder="vards@example.com"></label></div>
  <div class="form-actions"><button class="button" data-action="checkout">Apstiprināt pirkumu</button></div>
  ${view.notice?notice(view.notice):''}</aside></div></section>`
}

/* ---------- Biļete ---------- */
function ticket(){
  const o=view.order,m=movie(o.movieId),s=screening(o.screeningId),t=typeOf(o.typeId);
  const bits=Array.from({length:64},(_,i)=>((o.token.charCodeAt(i%o.token.length)+i)%3?'':'off'));
  const left=startsAt(s)-Date.now();
  const cancellable=!o.cancelled&&left>=24*60*60*1000;
  return `<section>${steps('ticket')}<p class="eyebrow">${o.cancelled?'Pirkums atcelts':'Pirkums apstiprināts'}</p><h1 class="page-title">Digitālā biļete</h1>
  <div class="ticket"${o.cancelled?' style="opacity:.55"':''}><p class="eyebrow">KINO NOX · ${o.id}</p><h2>${m.title}</h2>
  <div class="ticket-grid"><div><p><strong>${dateLabel(s.date)} · ${s.time}</strong> · ${s.hall}</p><p>Vietas: <strong>${o.seats.join(', ')}</strong> · ${t.label}</p><p>Cena: <strong>${money(o.total)}</strong> (t. sk. PVN ${money(o.vat)})</p><p class="meta">${o.email} · iegādāta ${o.created}</p></div>
  <div class="qr">${bits.map(c=>`<b class="${c}"></b>`).join('')}</div></div></div>
  <div class="form-actions">${cancellable?`<button class="button danger" data-action="cancel-order" data-id="${o.id}">Atcelt biļeti</button>`:''}
  <button class="button secondary" data-action="print">Drukāt biļeti</button>
  <button class="button" data-nav="catalog">Atpakaļ uz katalogu</button><button class="button secondary" data-nav="profile">Mani pasūtījumi</button></div>
  ${o.cancelled?notice(`Biļete atcelta. Atmaksāta summa: ${money(o.refunded)}.`,'success'):''}
  ${view.notice?notice(view.notice):''}</section>`
}

/* ---------- Profils ---------- */
function profile(){
  const logged=state.profile;
  const mine=state.orders.filter(o=>!logged||o.email===logged.email);
  const users=state.users.map(u=>`<option value="${u.email}">${u.email}</option>`).join('');
  return `<section class="profile-layout"><div><p class="eyebrow">Profils</p><h1 class="page-title">${logged?logged.email:'Pieslēdzieties vai izveidojiet kontu.'}</h1>
  ${logged?`<div class="panel"><h2>Mani pasūtījumi</h2>${mine.length?mine.map(o=>`<div class="admin-row"><span><strong>${movie(o.movieId).title}</strong>${o.cancelled?' <span class="tag">Atcelta</span>':''}<br><span class="meta">${dateLabel(screening(o.screeningId).date)} · ${o.created} · ${o.seats.join(', ')}</span></span><button class="button secondary" data-order="${o.id}">Biļete</button></div>`).join(''):'<p class="meta">Pasūtījumu vēl nav.</p>'}</div>`:`<p class="lede">Šis konts ir lokāls šajā pārlūkā. Neievadiet īstu paroli.</p>`}
  ${view.notice?notice(view.notice):''}</div>
  <aside class="panel">${logged?`<h2>Pieslēgts</h2><p class="meta">Konts un pasūtījumi glabājas tikai šajā pārlūkā.</p><button class="button secondary" data-action="logout">Iziet</button>`:`
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
  const screenings=state.screenings.map(s=>`<div class="admin-row"><span><strong>${movie(s.movieId).title}</strong><br><span class="meta">${dateLabel(s.date)} · ${s.time} · ${s.hall} · ${money(s.price)}</span></span><button class="button secondary" data-action="new-screening" data-id="${s.movieId}">Pievienot seansu</button> <button class="button danger" data-action="cancel-screening" data-id="${s.id}">Atcelt</button></div>`).join('');
  const editing=view.editingMovie;
  return `<section class="admin-layout"><div>
  <p class="eyebrow">Operatora panelis</p><h1 class="page-title">Mācību dati</h1><p class="lede">Izmaiņas uzreiz saglabājas šajā pārlūkā. Izmantojiet atiestatīšanu, lai atgrieztu sākuma variantu.</p>
  <div class="panel"><h2>Filmas (${state.movies.length})</h2><div class="admin-list">${movies}</div></div>
  <div class="panel"><h2>Aktīvie seansi (${state.screenings.length})</h2><div class="admin-list">${screenings}</div></div>
  <div class="panel"><h2>Atlaižu kodi</h2><div class="admin-list">${Object.entries(state.promos).map(([k,v])=>`<div class="admin-row"><span><strong>${k}</strong> · −${v}%</span></div>`).join('')}</div>
  <div class="form-grid"><label>Jauns kods<input id="promo-code" placeholder="PIEMĒRAM, VASARA"></label><label>Atlaide %<input id="promo-value" type="number" min="1" max="50" value="15"></label></div>
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
  <div class="panel"><h2>Jauns seanss</h2>
  <div class="form-grid"><label>Filma<select id="sc-movie">${state.movies.map(m=>`<option value="${m.id}">${m.title}</option>`).join('')}</select></label>
  <label>Datums<input id="sc-date" type="date" value="${isoDate(0)}"></label>
  <label>Laiks<input id="sc-time" type="time" value="19:00"></label>
  <label>Zāle<select id="sc-hall">${Object.keys(state.halls).map(h=>`<option>${h}</option>`).join('')}</select></label>
  <label>Cena €<input id="sc-price" type="number" min="1" step="0.5" value="8.5"></label></div>
  <div class="form-actions"><button class="button" data-action="add-screening">Izveidot seansu</button></div>${view.notice?notice(view.notice):''}</div>
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
  let html=view.screen==='catalog'?catalog():view.screen==='movie'?movieDetail():view.screen==='booking'?booking():view.screen==='cart'?cart():view.screen==='ticket'?ticket():view.screen==='profile'?profile():admin();
  if(view.trailer) html+=trailerModal();
  app.innerHTML=html;updateCart();
  if(lastScreen!==view.screen){window.scrollTo({top:0,behavior:'smooth'});lastScreen=view.screen}
  if(view.screen==='booking') startHold(); else stopHold();
}

function addCart(){
  const s=screening(view.screeningId);
  const c={movieId:s.movieId,screeningId:s.id,seats:[...view.seats],typeId:view.typeId,unit:unitPrice(s,view.typeId),promo:''};
  view.cart=c;view.screen='cart';view.notice=null;snapshot(c);render();
}
function snapshot(c){view.cart=c}

function checkout(){
  const email=document.querySelector('#order-email').value.trim();
  if(!/^\S+@\S+\.\S+$/.test(email)){toast('Ievadiet derīgu e-pasta adresi.');return}
  const c=view.cart,taken=reserved(c.screeningId);
  if(c.seats.some(x=>taken.includes(x))){toast('Kāda vieta vairs nav pieejama. Atgriezieties pie seansa.');return}
  if(!c.seats.length){toast('Nav izvēlēta neviena vieta.');return}
  state.reserved[c.screeningId]=[...taken,...c.seats];
  const subtotal=Math.round(c.unit*c.seats.length*100)/100;
  const discount=state.promos[(c.promo||'').toUpperCase()]||0;
  const total=Math.round(subtotal*(1-discount/100)*100)/100;
  const vat=Math.round(subtotal*VAT/(1+VAT)*100)/100;
  const o={id:'KN-'+String(Date.now()).slice(-6),movieId:c.movieId,screeningId:c.screeningId,seats:c.seats,typeId:c.typeId,unit:c.unit,subtotal,discount,total,vat,email,created:nowLabel(),token:Math.random().toString(36).slice(2,10).toUpperCase(),cancelled:false,refunded:0};
  state.orders.push(o);save();
  view={...view,screen:'ticket',order:o,seats:[],cart:null,notice:null,holdEnd:null};stopHold();render();
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
  if(b.dataset.movie){stopHold();view.screen='movie';view.movieId=Number(b.dataset.movie);view.notice=null;return render()}
  if(b.dataset.show){view.screen='booking';view.screeningId=Number(b.dataset.show);view.seats=[];view.holdEnd=null;view.notice=null;return render()}
  if(b.dataset.seat){
    const n=b.dataset.seat;
    if(view.seats.includes(n)){view.seats=view.seats.filter(x=>x!==n);view.notice=null;return render()}
    if(view.seats.length>=MAX_SEATS+1){toast(`Vienā pirkumā var iegādāties ne vairāk kā ${MAX_SEATS} vietas.`);return}
    view.seats=[...view.seats,n];return render();
  }
  if(b.dataset.action==='add-cart')return addCart();
  if(b.dataset.action==='promo'){view.cart.promo=document.querySelector('#promo').value.trim();return render()}
  if(b.dataset.action==='checkout')return checkout();
  if(b.dataset.action==='cancel-order'){
    const o=state.orders.find(x=>x.id===b.dataset.id);
    const s=screening(o.screeningId);
    o.cancelled=true;
    o.refunded=Math.round(s.price*o.seats.length*100)/100;
    state.reserved[o.screeningId]=reserved(o.screeningId).filter(n=>!o.seats.includes(n));
    save();view.order=o;return render();
  }
  if(b.dataset.order){const o=state.orders.find(x=>x.id===b.dataset.order);view={...view,screen:'ticket',order:o,notice:null};return render()}
  if(b.dataset.action==='forgot'){view.passwordView='TEMP-'+Math.random().toString(36).slice(2,6).toUpperCase();return render()}
  if(b.dataset.action==='register'||b.dataset.action==='login'){
    const email=document.querySelector('#profile-email').value.trim(),pass=document.querySelector('#profile-password').value;
    if(!/^\S+@\S+\.\S+$/.test(email)){view.notice='Ievadiet derīgu e-pasta adresi.';return render()}
    if(pass.length<8||!/[A-ZĀČĒĢĪĶĻŅŠŪŽ]/.test(pass)||!/[a-zāčēģīķļņšūž]/.test(pass)||!/\d/.test(pass)||!/[^\w\s]/.test(pass)){view.notice='Parolei jābūt vismaz 8 rakstzīmes ar lielo un mazo burtu, ciparu un speciālo rakstzīmi.';return render()}
    let u=state.users.find(x=>x.email.toLowerCase()===email.toLowerCase());
    if(b.dataset.action==='register'&&!u){u={email,password:pass,fails:0,blocked:false};state.users.push(u)}
    if(!u||u.password!==pass){
      if(u){u.fails=(u.fails||0)+1;if(u.fails>3){u.blocked=true;save();view.notice='Konts bloķēts pēc vairākiem neveiksmīgiem mēģinājumiem. Izmantojiet paroles atiestatīšanu.';return render()}}
      view.notice='E-pasts vai mācību parole nav pareiza.';save();return render()
    }
    if(u.blocked){view.notice='Konts ir bloķēts. Izmantojiet paroles atiestatīšanu.';return render()}
    u.fails=0;state.profile={email:u.email};save();view.notice=null;view.passwordView=null;return render()
  }
  if(b.dataset.action==='logout'){state.profile=null;save();return nav('profile')}
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
  if(b.dataset.action==='add-screening'){
    const movieId=Number(document.querySelector('#sc-movie').value),date=document.querySelector('#sc-date').value,time=document.querySelector('#sc-time').value,hall=document.querySelector('#sc-hall').value,price=Number(document.querySelector('#sc-price').value);
    if(!date||!time){view.notice='Norādiet seansa datumu un laiku.';return render()}
    state.screenings.push({id:Math.max(...state.screenings.map(x=>x.id))+1,movieId,date,time,hall,price});
    audit('Izveidots seanss',`${movie(movieId).title} · ${date} ${time}`);save();view.notice='Seanss izveidots.';return render();
  }
  if(b.dataset.action==='cancel-screening'){
    const id=Number(b.dataset.id),s=screening(id);
    state.screenings=state.screenings.filter(x=>x.id!==id);
    for(const o of state.orders.filter(o=>o.screeningId===id&&!o.cancelled)){o.cancelled=true;o.refunded=o.total}
    audit('Atcelts seanss',`${movie(s.movieId).title} · ${s.date} ${s.time}`);save();view.notice='Seanss atcelts; apmaksātās biļetes atmaksātas.';return render();
  }
  if(b.dataset.action==='add-promo'){
    const code=document.querySelector('#promo-code').value.trim().toUpperCase(),val=Number(document.querySelector('#promo-value').value);
    if(!code||!val){view.notice='Norādiet koda nosaukumu un atlaidi.';return render()}
    state.promos[code]=val;audit('Pievienots atlaides kods',`${code} · −${val}%`);save();view.notice='Atlaides kods pievienots.';return render();
  }
  if(b.dataset.action==='reset'){
    const keepProfile=state.profile;
    state=clone(seed);state.profile=keepProfile;
    lsDel(KEY);save();
    view={screen:'catalog',movieId:null,screeningId:null,seats:[],typeId:'pieauguso',cart:null,filter:'Visi',todayOnly:false,order:null,notice:null,holdEnd:null,passwordView:null};
    audit('Atiestatīti dati','Sākuma stāvoklis');
    toast('Mācību dati ir atiestatīti.');return render();
  }
});

document.addEventListener('change',e=>{
  if(e.target.id==='ticket-type'){view.typeId=e.target.value;return render()}
});
document.addEventListener('click',e=>{if(e.target.dataset&&e.target.dataset.backdrop){view.trailer=false;render()}},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&view.trailer){view.trailer=false;render()}});

render();
