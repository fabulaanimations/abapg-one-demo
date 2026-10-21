(function(){
'use strict';

let storage;
try{storage=window.localStorage;}catch{storage={getItem(){return null},setItem(){},removeItem(){}}}

const api=MockISIDATA.create(storage);
const root=document.getElementById('appRoot');
let page='home', lessonId='', message='';

const labels={studente:'Studente',docente:'Docente'};
const menus={
  studente:[
    ['home','⌂','Home'],
    ['qr','⌘','Firma QR'],
    ['piano','▦','Piano di studi'],
    ['lezioni','◷','Orario'],
    ['presenze','✓','Presenze'],
    ['esami','★','Esami'],
    ['profilo','●','Profilo']
  ],
  docente:[
    ['home','⌂','Home'],
    ['qr','⌘','QR presenze'],
    ['lezioni','◷','Lezioni'],
    ['registro','✓','Registro'],
    ['studenti','♟','Studenti'],
    ['profilo','●','Profilo']
  ]
};

const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=x=>x?new Date(x+'T12:00:00').toLocaleDateString('it-IT',{day:'numeric',month:'short',year:'numeric'}):'—';
const name=p=>p?`${p.firstName} ${p.lastName}`:'—';
const button=(text,action,value='',style='outline')=>`<button class="btn ${style}" data-action="${action}" data-value="${esc(value)}">${text}</button>`;
const title=(t,s='')=>`<div class="sectionTitle"><h2 tabindex="-1" id="pageTitle">${esc(t)}</h2><p>${esc(s)}</p></div>`;
const status=s=>`<span class="status ${['attiva','presente'].includes(s)?'ok':'off'}">${esc(s)}</span>`;
const card=(t,c)=>`<section class="card"><h3>${esc(t)}</h3>${c}</section>`;
const table=(heads,rows)=>rows.length?`<div class="tableWrap" role="region" tabindex="0"><table class="table"><thead><tr>${heads.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td data-label="${esc(heads[i])}"><span>${c}</span></td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<p class="empty">Nessun elemento disponibile.</p>';
const metric=(l,v)=>`<div class="card kpi"><div class="label">${esc(l)}</div><div class="value">${esc(v)}</div></div>`;
const sortedLessons=d=>[...d.lessons].sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start));

function context(){
  const d=api.data(),u=api.currentUser();
  const e=d.enrollments.find(e=>e.studentId===u.id);
  const course=d.courses.find(c=>c.id===e?.courseId);
  return {d,u,e,course};
}
function earned(d,id){
  return d.results.filter(r=>r.studentId===id).reduce((sum,r)=>sum+(d.units.find(u=>u.id===r.unitId)?.credits||0),0);
}

const presence=ABAPGPresenceUI.create({
  api,button,card,title,esc,name,navigate,
  notify(text){message=text;render();}
});

function filteredAccounts(){
  return api.demoAccounts().filter(a=>a.role==='studente'||a.role==='docente');
}

function login(){
  const accounts=filteredAccounts();
  const featured=[
    ['studente','Studente · Scenografia'],
    ['docente','Docente · Scenografia'],
    ['studente.grafica','Studente · Graphic Design'],
    ['docente.grafica','Docente · Graphic Design'],
    ['studente.pittura','Studente · Pittura'],
    ['docente.pittura','Docente · Pittura']
  ].map(([username,label])=>({account:accounts.find(a=>a.username===username),label})).filter(x=>x.account);

  root.innerHTML=`
  <main class="loginShell">
    <section class="loginVisual">
      <img src="assets/generic.jpg" alt="Accademia di Belle Arti">
      <div>
        <span class="premiumEyebrow">Accademia di Belle Arti Pietro Vannucci</span>
        <h1>ABAPG One.<br><em>Docenti e studenti.</em></h1>
        <p>Una demo concreta del flusso che in futuro potrà essere alimentato da ISIDATA.</p>
      </div>
    </section>

    <section class="loginPanel">
      <img class="loginLogo" src="assets/logo-completo.png" alt="ABAPG">
      <span class="pill magenta">DEMO MOBILE · v8.0</span>
      <h2>Accedi alla demo</h2>
      <p class="sub">Per ora abbiamo lasciato soltanto i due profili principali: <b>Studente</b> e <b>Docente</b>.</p>

      <h3>Accesso rapido</h3>
      <div class="demoAccounts">
        ${featured.map(x=>`<button class="accountCard" data-action="demo" data-value="${esc(x.account.username)}"><strong>${esc(x.label)}</strong><span>${esc(name(x.account))}</span></button>`).join('')}
      </div>

      <details>
        <summary>Altri studenti e docenti fittizi</summary>
        <label class="field">Account demo
          <select id="demoAccount">
            ${accounts.map(p=>`<option value="${esc(p.username)}">${esc(labels[p.role])} · ${esc(name(p))} · ${esc(p.username)}</option>`).join('')}
          </select>
        </label>
        ${button('Entra con l’account selezionato','selected-demo','','primary')}
      </details>

      <form id="loginForm">
        <div class="field"><label for="username">Nome utente demo</label><input id="username" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="studente" required></div>
        <div class="field"><label for="password">Password demo</label><input id="password" name="password" type="password" autocomplete="current-password" placeholder="demo123" required></div>
        <button class="btn primary" type="submit">Accedi</button>
        <p class="sub">Password per tutti: <b>demo123</b></p>
      </form>
      <p id="loginError" role="alert"></p>
      <p class="small">I dati sono tutti inventati e vengono salvati soltanto sul dispositivo usato per la demo.</p>
    </section>
  </main>`;
}

function home({d,u,e,course}){
  if(u.role==='studente'){
    const next=sortedLessons(d).find(l=>l.date>=api.today);
    const unit=d.units.find(x=>x.id===next?.unitId);
    return title('Ciao, '+u.firstName,'Profilo studente · dati di iscrizione simulati')+
    `<section class="courseBanner">
      <div class="courseBannerMedia"><img src="${course?.image||'assets/scenografia.jpg'}" alt="${esc(course?.name||'Corso')}"></div>
      <div class="courseBannerText">
        <div class="premiumEyebrow">Il mio corso · ${api.academicYear}</div>
        <h2>${esc(course?.name||'Corso non associato')}</h2>
        <p>${esc(course?.level||'')}</p>
        <div class="courseStats">
          <div class="courseStat"><b>${e?.year||'—'}°</b><span>anno</span></div>
          <div class="courseStat"><b>${earned(d,u.id)}</b><span>CFA acquisiti</span></div>
          <div class="courseStat"><b>${course?.totalCredits||'—'}</b><span>CFA percorso</span></div>
        </div>
        <div class="premiumActions">
          ${button('Piano di studi','nav','piano','primary')}
          ${button('Il mio orario','nav','lezioni')}
        </div>
      </div>
    </section>
    <div class="grid g2 spaced">
      ${card('Prossima lezione',next?`<h3>${esc(unit?.name||'Lezione')}</h3><p>${date(next.date)} · ${next.start}–${next.end}</p><p>${esc(next.room)}</p>${button('Apri orario','nav','lezioni','primary')}`:'<p>Nessuna lezione prevista.</p>')}
      ${card('Presenza alla lezione',`<p>Quando il docente genera il QR, lo studente può firmare la presenza direttamente dall’app.</p>${button('Firma con QR','nav','qr','primary')}`)}
    </div>`;
  }

  return title('Ciao, '+u.firstName,'Profilo docente · insegnamenti e registro simulati')+
  `<section class="premiumHero">
    <div class="premiumHeroMedia"><img src="assets/generic.jpg" alt="Accademia"></div>
    <div class="premiumHeroOverlay"></div>
    <div class="premiumHeroContent">
      <div class="premiumEyebrow">Didattica · ${api.academicYear}</div>
      <h1>Il tuo spazio<br>per insegnare.</h1>
      <p>Lezioni, studenti, registro e QR presenze in un unico ambiente.</p>
      <div class="premiumActions">
        ${button('Apri registro','nav','registro','primary')}
        ${button('Genera QR','nav','qr')}
      </div>
    </div>
  </section>
  <div class="grid g3 spaced">
    ${metric('Insegnamenti',d.units.length)}
    ${metric('Studenti iscritti',d.enrollments.filter(e=>e.status==='attiva').length)}
    ${metric('Lezioni oggi',d.lessons.filter(l=>l.date===api.today).length)}
  </div>
  ${card('I tuoi insegnamenti',table(['Materia','Corso / anno','CFA'],d.units.map(x=>[
    esc(x.name),
    `${esc(d.courses.find(c=>c.id===x.courseId)?.name)} · ${x.year}°`,
    x.credits
  ])))}`;
}

function plan({d,u,e,course}){
  const p=d.plans.find(p=>p.studentId===u.id);
  return title('Piano di studi',`${course?.name||''} · ${api.academicYear}`)+
  [1,2,3].map(y=>card(`${y}° anno`,table(
    ['Insegnamento','CFA','Semestre','Docente','Carriera'],
    d.units.filter(x=>p?.unitIds.includes(x.id)&&x.year===y).map(x=>{
      const r=d.results.find(r=>r.studentId===u.id&&r.unitId===x.id);
      return [
        esc(x.name),
        x.credits,
        x.semester,
        esc(name(d.people.find(p=>p.id===x.teacherId))),
        r?`${r.grade}/30 · ${date(r.date)}`:(x.year===e?.year?'Da sostenere':'Anno successivo')
      ];
    })
  ))).join('');
}

function lessons({d,u}){
  return title('Lezioni','Calendario didattico demo')+
  table(['Data','Orario','Insegnamento','Aula','Docente','Azione'],
    sortedLessons(d).map(l=>{
      const x=d.units.find(x=>x.id===l.unitId);
      return [
        date(l.date),
        `${l.start}–${l.end}`,
        esc(x?.name||''),
        esc(l.room),
        esc(name(d.people.find(p=>p.id===x?.teacherId))),
        u.role==='docente'?button('Registro','lesson',l.id):l.date===api.today?button('Firma QR','nav','qr','primary'):'—'
      ];
    })
  );
}

function register({d}){
  const ls=sortedLessons(d);
  if(!ls.some(l=>l.id===lessonId))lessonId=ls.find(l=>l.date===api.today)?.id||ls[0]?.id;
  const l=ls.find(l=>l.id===lessonId);
  if(!l)return title('Registro')+'<p>Nessuna lezione assegnata.</p>';

  const x=d.units.find(x=>x.id===l.unitId);
  const reg=d.registers.find(r=>r.lessonId===l.id);
  const locked=reg?.signed||l.date>api.today;
  const roster=d.enrollments.filter(e=>e.status==='attiva'&&e.courseId===x.courseId&&e.year===x.year);

  return title('Registro docente',`${x.name} · ${date(l.date)} · ${l.start}–${l.end}`)+
  `<div class="field"><label for="lessonSelect">Lezione</label>
    <select id="lessonSelect">${ls.map(a=>`<option value="${a.id}" ${a.id===l.id?'selected':''}>${date(a.date)} · ${a.start} · ${esc(d.units.find(x=>x.id===a.unitId)?.name)}</option>`).join('')}</select>
  </div>
  <section class="card">
    <h3>${esc(x.name)}</h3>
    <p>${date(l.date)} · ${l.start}–${l.end} · ${esc(l.room)}</p>
    ${status(reg?.signed?'firmato':l.date>api.today?'lezione futura':'da firmare')}
    <div class="miniActions">${l.date===api.today&&!reg?.signed?button('Genera QR presenze','qr-lesson',l.id,'primary'):''}</div>
    ${!locked?presence.locationPanel():''}
    <form id="registerForm">
      <div class="field"><label for="topic">Argomento</label><textarea id="topic" name="topic" required maxlength="2000" ${locked?'disabled':''}>${esc(reg?.topic||l.topic)}</textarea></div>
      ${roster.map(e=>{
        const p=d.people.find(p=>p.id===e.studentId);
        const a=d.attendance.find(a=>a.studentId===p.id&&a.lessonId===l.id);
        return `<div class="attendance"><label for="mark-${p.id}"><b>${esc(name(p))}</b><br><small>${esc(p.matricola)}</small></label>
        <select id="mark-${p.id}" name="mark-${p.id}" ${locked?'disabled':''}>
          <option value="">Da rilevare</option>
          ${['presente','assente','giustificato'].map(s=>`<option ${s===a?.status?'selected':''} value="${s}">${s}</option>`).join('')}
        </select></div>`;
      }).join('')}
      <div class="miniActions">${locked?'<p class="sub">Registro non modificabile.</p>':'<button class="btn outline" type="submit" name="intent" value="save">Salva bozza</button><button class="btn primary" type="submit" name="intent" value="sign">Firma registro</button>'}</div>
    </form>
  </section>`;
}

function attendance({d,u}){
  const rows=[];
  sortedLessons(d).filter(l=>l.date<=api.today).forEach(l=>{
    const unit=d.units.find(x=>x.id===l.unitId);
    const ids=u.role==='studente'?[u.id]:d.enrollments.filter(e=>e.status==='attiva'&&e.courseId===unit.courseId&&e.year===unit.year).map(e=>e.studentId);
    ids.forEach(id=>{
      const a=d.attendance.find(a=>a.lessonId===l.id&&a.studentId===id);
      rows.push([
        esc(name(d.people.find(p=>p.id===id))),
        date(l.date),
        esc(unit.name),
        status(a?.status||'da rilevare'),
        esc(a?.source||'—')
      ]);
    });
  });
  return title('Presenze','Rilevazioni del registro fittizio')+table(['Studente','Data','Lezione','Presenza','Origine'],rows);
}

function exams({d,u,e}){
  return title('Esami','Appelli e prenotazioni simulate')+
  table(['Materia','Appello','Aula','Stato / azione'],
    d.exams.filter(a=>u.role!=='studente'||d.units.find(x=>x.id===a.unitId)?.year===e?.year).map(a=>{
      const x=d.units.find(x=>x.id===a.unitId);
      const booked=d.bookings.some(b=>b.studentId===u.id&&b.examId===a.id);
      return [
        esc(x.name),
        `${date(a.date)} · ${a.time}`,
        esc(a.room),
        u.role==='studente'
          ? button(booked?'Annulla prenotazione':'Prenota',booked?'cancel-exam':'book-exam',a.id,booked?'outline':'primary')
          : `${d.bookings.filter(b=>b.examId===a.id).length} prenotati`
      ];
    })
  );
}

function students({d}){
  return title('Studenti','Studenti iscritti ai tuoi insegnamenti')+
  table(['Studente','Matricola','Corso','Anno'],
    d.enrollments.filter(e=>e.status==='attiva').map(e=>{
      const p=d.people.find(p=>p.id===e.studentId);
      return [
        esc(name(p)),
        esc(p.matricola),
        esc(d.courses.find(c=>c.id===e.courseId)?.name),
        e.year
      ];
    })
  );
}

function profile({u,e,course}){
  return title('Profilo','Anagrafica fittizia associata all’account demo')+
  card(name(u),
    `<p>${esc(labels[u.role])} · ${esc(u.matricola)}</p>
     <p>${esc(u.email)}</p>
     <p>${esc(u.city)}</p>
     ${e?`<p>${esc(course?.name||'')} · ${e.year}° anno · ${status(e.status)}</p>`:''}
     ${button('Cambia account','logout','','primary')}`
  );
}

function render(){
  presence.stop();

  const current=api.currentUser();
  if(current && !['studente','docente'].includes(current.role)){
    api.logout();
  }

  if(!api.currentUser()){
    login();
    return;
  }

  const ctx=context(),u=ctx.u,items=menus[u.role];
  if(!items.some(i=>i[0]===page))page='home';

  const pages={
    home,
    qr:presence.qrPage,
    piano:plan,
    lezioni:lessons,
    registro:register,
    presenze:attendance,
    esami:exams,
    studenti:students,
    profilo:profile
  };

  root.innerHTML=`
  <div class="app">
    <aside class="sidebar">
      <div class="brandCard"><img class="brandLogo" src="assets/logo-completo.png" alt="ABAPG"><div class="brandSub">Demo Docente + Studente</div></div>
      <nav class="nav" aria-label="Navigazione principale">
        ${items.map(([id,icon,text])=>`<button class="${page===id?'active':''}" ${page===id?'aria-current="page"':''} data-action="nav" data-value="${id}"><span>${icon}</span>${text}</button>`).join('')}
      </nav>
      <div class="sync"><span class="dot"></span><b>ISIDATA simulato</b><small>Archivio fittizio locale per la presentazione.</small></div>
    </aside>

    <main class="main">
      <header class="top">
        <div><div class="topTitle">ABAPG One</div><div class="sub">${esc(labels[u.role])} · ${esc(name(u))}</div></div>
        <div class="user">${button('Cambia account','logout')}<div class="avatar">${esc(u.firstName[0]+u.lastName[0])}</div></div>
      </header>

      <div class="demoBar"><span>DEMO DOCENTE + STUDENTE · ${date(api.today)}</span><span id="pwaStatus"></span></div>

      <div class="mobileMenu">
        <label for="mobilePage">Vai a</label>
        <select id="mobilePage">${items.map(([id,,text])=>`<option value="${id}" ${page===id?'selected':''}>${esc(text)}</option>`).join('')}</select>
      </div>

      <section class="content">
        ${message?`<div class="notice" role="status">${esc(message)}</div>`:''}
        ${pages[page](ctx)}
        <footer class="demoFooter">ABAPG One · Demo v8.0<br>Solo Docente e Studente · dati totalmente fittizi · nessun collegamento a ISIDATA.</footer>
      </section>
    </main>
  </div>

  <nav class="mobilebar" aria-label="Navigazione rapida">
    ${items.slice(0,4).map(([id,icon,text])=>`<button ${page===id?'aria-current="page"':''} data-action="nav" data-value="${id}"><span>${icon}</span>${esc(text)}</button>`).join('')}
    <button data-action="menu"><span>☰</span>Menu</button>
  </nav>`;

  updatePwaStatus();
  presence.afterRender();
}

function navigate(p){
  page=p;message='';render();
  document.getElementById('pageTitle')?.focus({preventScroll:true});
  window.scrollTo({top:0,behavior:'smooth'});
}

function execute(fn,success){
  try{fn();message=success||'Operazione salvata nel registro fittizio.';}
  catch(e){message=e.message;}
  render();
}

root.addEventListener('click',event=>{
  const el=event.target.closest('[data-action]');
  if(!el)return;
  const {action,value}=el.dataset;

  if(presence.handleClick(action,value))return;

  if(action==='demo'||action==='selected-demo'){
    const username=action==='demo'?value:document.getElementById('demoAccount').value;
    const chosen=filteredAccounts().find(a=>a.username===username);
    if(!chosen){message='Account non disponibile nella demo Docente + Studente.';render();return;}
    presence.reset();
    execute(()=>{api.login(username,'demo123');page='home';lessonId='';},'Accesso demo effettuato.');
    window.scrollTo(0,0);
    return;
  }

  if(action==='nav'){navigate(value);return;}
  if(action==='logout'){
    presence.reset();api.logout();page='home';lessonId='';message='';render();window.scrollTo(0,0);return;
  }
  if(action==='menu'){
    document.getElementById('mobilePage')?.focus();
    document.querySelector('.mobileMenu')?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  if(action==='lesson'){lessonId=value;navigate('registro');return;}

  const actions={
    'book-exam':()=>api.bookExam(value),
    'cancel-exam':()=>api.cancelExam(value)
  };
  if(actions[action])execute(actions[action]);
});

root.addEventListener('change',event=>{
  if(presence.change(event.target))return;
  if(event.target.id==='mobilePage')navigate(event.target.value);
  if(event.target.id==='lessonSelect'){lessonId=event.target.value;message='';render();}
});

root.addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.target,data=new FormData(form);

  if(presence.submit(form))return;

  if(form.id==='loginForm'){
    try{
      const username=String(data.get('username')||'').trim().toLowerCase();
      const chosen=filteredAccounts().find(a=>a.username===username);
      if(!chosen)throw Error('In questa versione puoi entrare solo come docente o studente.');
      api.login(username,data.get('password'));
      page='home';message='';render();window.scrollTo(0,0);
    }catch(e){
      const err=document.getElementById('loginError');
      if(err)err.textContent=e.message;
    }
    return;
  }

  if(form.id==='registerForm'){
    const marks={};
    for(const [key,value] of data)if(key.startsWith('mark-'))marks[key.slice(5)]=value;
    execute(()=>api.saveRegister(lessonId,data.get('topic'),marks,event.submitter?.value==='sign'),'Registro salvato.');
  }
});

let pwaReady=false,pwaError=false;
function updatePwaStatus(){
  const el=document.getElementById('pwaStatus');
  if(el)el.textContent=pwaError?'Online':pwaReady?(navigator.onLine?'Pronta':'Offline'):'Caricamento…';
}

window.addEventListener('online',updatePwaStatus);
window.addEventListener('offline',updatePwaStatus);
window.addEventListener('storage',event=>{
  if([MockISIDATA.DB_KEY,MockISIDATA.SESSION_KEY].includes(event.key))location.reload();
});

render();

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./service-worker.js',{updateViaCache:'none'})
    .then(async reg=>{await navigator.serviceWorker.ready;pwaReady=true;updatePwaStatus();reg.update().catch(()=>{});})
    .catch(()=>{pwaError=true;updatePwaStatus();});
}else{
  pwaError=true;updatePwaStatus();
}
})();