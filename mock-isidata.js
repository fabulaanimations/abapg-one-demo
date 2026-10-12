/* Synthetic educational fixtures. No ISIDATA endpoint or production credentials. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MockISIDATA = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = 1, TODAY = '2026-10-12', YEAR = '2026/27';
  const DB_KEY = 'abapg.mock.v1.database', SESSION_KEY = 'abapg.mock.v1.session';
  const clone = value => JSON.parse(JSON.stringify(value));
  const Presence = typeof module==='object'&&module.exports ? require('./presence-core.js') : globalThis.ABAPGPresence;
  function seed() {
    const courses = [
      { id:'SC', name:'Scenografia', image:'assets/scenografia.jpg', room:'Laboratorio scenografia' },
      { id:'GD', name:'Graphic Design', image:'assets/generic.jpg', room:'Laboratorio grafica' },
      { id:'PI', name:'Pittura', image:'assets/generic.jpg', room:'Atelier pittura' }
    ].map(c=>({...c,level:'Diploma accademico di I livello',years:3,totalCredits:180}));
    const people = [
      ['t1','docente','Giulia','Fontana','docente'],['t2','docente','Paolo','Venturi','docente.grafica'],['t3','docente','Elena','Sereni','docente.pittura'],
      ['a1','ata','Luca','Marini','ata'],['o1','segreteria','Chiara','Ferri','segreteria'],['x1','admin','Andrea','Landi','admin']
    ].map(([id,role,firstName,lastName,username])=>({id,role,firstName,lastName,username}));
    const names = [['Sofia','Rinaldi'],['Matteo','Galli'],['Alice','Costa'],['Nicolò','Vitali'],['Emma','Morelli'],['Tommaso','Leoni'],['Viola','Sarti'],['Leonardo','Riva'],['Marta','Bellini'],['Diego','Valenti'],['Irene','Rosati'],['Edoardo','Villa'],['Beatrice','Neri'],['Filippo','Mancini'],['Anna','Ricci'],['Clara','Fabbri'],['Pietro','Greco'],['Nora','Silvestri']];
    names.forEach(([firstName,lastName],i)=>people.push({id:'s'+(i+1),role:'studente',firstName,lastName,username:i===0?'studente':i===5?'studente.grafica':i===10?'studente.pittura':i===15?'studente.sospeso':i===16?'studente.nuovo':i===17?'studente.senzaiscrizione':'studente.'+(i+1)}));
    people.forEach((p,i)=>Object.assign(p,{email:p.username+'@demo.invalid',matricola:'MOCK-'+String(i+1).padStart(4,'0'),birthDate:(p.role==='studente'?'2004':'1985')+'-05-'+String(i%27+1).padStart(2,'0'),city:'Perugia (dato fittizio)',active:true}));
    const teachingNames={SC:['Scenografia','Scenotecnica','Disegno progettuale','Storia del teatro','Modellazione digitale','Laboratorio di regia'],GD:['Progettazione grafica','Tipografia','Illustrazione','Storia del design','Tecniche di stampa','Comunicazione visiva'],PI:['Pittura','Tecniche pittoriche','Disegno','Storia dell’arte','Anatomia artistica','Laboratorio del colore']};
    const units=[];
    courses.forEach((c,ci)=>{for(let year=1;year<=3;year++) teachingNames[c.id].forEach((name,j)=>units.push({id:c.id+'-'+year+'-'+(j+1),courseId:c.id,year,name:name+' '+year,credits:[12,12,10,10,8,8][j],hours:[120,120,100,80,80,80][j],semester:j<3?1:2,teacherId:'t'+(ci+1)}));});
    const enrollments=people.filter(p=>p.role==='studente'&&p.id!=='s18').map((p,i)=>({id:'en-'+p.id,studentId:p.id,courseId:courses[Math.min(Math.floor(i/5),2)].id,year:i===0?2:i===5?1:i===10?3:(i%3+1),academicYear:YEAR,status:i===15?'sospesa':i===16?'da completare':'attiva',planStatus:'approvato'}));
    const plans=enrollments.map(e=>({id:'plan-'+e.studentId,studentId:e.studentId,enrollmentId:e.id,unitIds:units.filter(u=>u.courseId===e.courseId).map(u=>u.id),status:'approvato'}));
    const lessons=[];
    courses.forEach(c=>units.filter(u=>u.courseId===c.id&&u.semester===1).forEach(u=>{for(let week=0;week<4;week++) {const day=5+[1,0,2][u.year-1]+week*7;const slot=Number(u.id.split('-')[2])-1;lessons.push({id:'lesson-'+u.id+'-'+week,unitId:u.id,date:'2026-10-'+String(day).padStart(2,'0'),start:['09:00','11:00','14:00'][slot],end:['11:00','13:00','16:00'][slot],room:c.room,topic:['Introduzione al progetto e ricerca','Sviluppo del concept e revisione','Tecniche e sperimentazione','Presentazione degli elaborati'][week]});}}));
    const registers=lessons.filter(l=>l.date<TODAY).map(l=>({lessonId:l.id,topic:l.topic,signed:true,signedAt:l.date+'T16:15:00',teacherId:units.find(u=>u.id===l.unitId).teacherId}));
    const attendance=[];
    lessons.filter(l=>l.date<TODAY).forEach(l=>{const u=units.find(u=>u.id===l.unitId);enrollments.filter(e=>e.status==='attiva'&&e.courseId===u.courseId&&e.year===u.year).forEach((e,i)=>attendance.push({lessonId:l.id,studentId:e.studentId,status:i%4===3?'assente':'presente',source:'registro iniziale demo'}));});
    const exams=units.map((u,i)=>({id:'exam-'+u.id,unitId:u.id,date:u.semester===1?'2027-02-'+String(10+(i%9)).padStart(2,'0'):'2027-07-'+String(5+(i%9)).padStart(2,'0'),time:'09:00',room:courses.find(c=>c.id===u.courseId).room,bookingDeadline:u.semester===1?'2027-02-01':'2027-06-25',capacity:20}));
    const results=[];
    enrollments.forEach(e=>units.filter(u=>u.courseId===e.courseId&&u.year<e.year).forEach((u,i)=>results.push({id:'result-'+e.studentId+'-'+u.id,studentId:e.studentId,unitId:u.id,grade:24+i%7,date:'2026-07-15'})));
    const payments=enrollments.flatMap(e=>[{id:'pay-'+e.studentId+'-1',studentId:e.studentId,description:'Contributo accademico — prima rata',amount:450,dueDate:'2026-09-30',status:'pagato',paidAt:'2026-09-20'},{id:'pay-'+e.studentId+'-2',studentId:e.studentId,description:'Contributo accademico — seconda rata',amount:450,dueDate:'2027-02-28',status:'da pagare',paidAt:null},{id:'pay-'+e.studentId+'-3',studentId:e.studentId,description:'Tassa regionale — simulazione',amount:140,dueDate:'2026-10-01',status:e.studentId==='s1'?'da pagare':'pagato',paidAt:e.studentId==='s1'?null:'2026-09-25'}]);
    return {version:VERSION,people,courses,units,enrollments,plans,lessons,registers,attendance,exams,results,payments,bookings:[],punches:[],requests:[],audit:[],qrSessions:[]};
  }
  function create(storage,options={}) {
    const now=options.now||Date.now;let locationProof=null;
    let db, userId=null, persistence=true, storageWarning='';
    try {const raw=storage.getItem(DB_KEY);db=raw?JSON.parse(raw):seed();if(db.version===VERSION&&!('qrSessions' in db))db.qrSessions=[];if(db.version!==VERSION||!Object.keys(seed()).filter(k=>k!=='version').every(k=>Array.isArray(db[k])))throw Error('Invalid database');userId=storage.getItem(SESSION_KEY);} catch {db=seed();storageWarning='Archivio locale non disponibile o non valido: dati demo ripristinati in memoria.';}
    if(!db.people.some(p=>p.id===userId&&p.active))userId=null;
    const me=()=>db.people.find(p=>p.id===userId)||null;
    const requireRole=(...roles)=>{if(!me()||!roles.includes(me().role))throw Error('Operazione non consentita per questo profilo.');};
    const enrollment=id=>db.enrollments.find(e=>e.studentId===id);
    const unit=id=>db.units.find(u=>u.id===id);
    const hasUnit=(id,uid)=>{const e=enrollment(id),p=db.plans.find(p=>p.studentId===id),u=unit(uid);return Boolean(e&&u&&p&&e.status==='attiva'&&u.courseId===e.courseId&&u.year===e.year&&p.unitIds.includes(uid));};
    function verifiedLocation(){if(!locationProof||locationProof.status!=='in sede'||now()-locationProof.at>300000)throw Error('Verifica la posizione o scegli “Simula in sede” prima di confermare.');return {mode:locationProof.mode,status:locationProof.status,siteId:locationProof.siteId};}
    function persist(){try{storage.setItem(DB_KEY,JSON.stringify(db));if(userId)storage.setItem(SESSION_KEY,userId);else storage.removeItem(SESSION_KEY);}catch{persistence=false;storageWarning='Salvataggio locale non disponibile: le modifiche durano solo fino alla chiusura di questa pagina.';}}
    function change(action,work){const before=clone(db);try{const result=work();db.audit.unshift({id:'audit-'+(db.audit.length+1),actorId:userId,action,at:new Date().toISOString()});persist();return result;}catch(error){db=before;throw error;}}
    function scoped(){
      if(!me())throw Error('Accedi con un account demo.');
      const p=me(),s=clone(db);
      if(['admin','segreteria'].includes(p.role))return s;
      const ids=p.role==='studente'?[p.id]:p.role==='docente'?db.enrollments.filter(e=>db.units.some(u=>u.teacherId===p.id&&hasUnit(e.studentId,u.id))).map(e=>e.studentId):[];
      const us=p.role==='studente'?db.plans.find(x=>x.studentId===p.id)?.unitIds||[]:p.role==='docente'?db.units.filter(u=>u.teacherId===p.id).map(u=>u.id):[];
      s.units=s.units.filter(u=>us.includes(u.id));
      s.courses=s.courses.filter(c=>s.units.some(u=>u.courseId===c.id));
      s.people=s.people.filter(q=>q.id===p.id||ids.includes(q.id)||s.units.some(u=>u.teacherId===q.id));
      ['enrollments','plans','payments','results','bookings'].forEach(key=>{s[key]=s[key].filter(x=>ids.includes(x.studentId));});
      if(p.role==='docente')s.payments=[];
      s.lessons=s.lessons.filter(l=>us.includes(l.unitId)&&(p.role!=='studente'||hasUnit(p.id,l.unitId)));
      s.registers=s.registers.filter(r=>s.lessons.some(l=>l.id===r.lessonId));
      s.qrSessions=s.qrSessions.filter(q=>s.lessons.some(l=>l.id===q.lessonId));
      s.attendance=s.attendance.filter(a=>ids.includes(a.studentId)&&s.lessons.some(l=>l.id===a.lessonId));
      s.exams=s.exams.filter(e=>us.includes(e.unitId));
      s.punches=s.punches.filter(x=>x.personId===p.id);s.requests=s.requests.filter(x=>x.personId===p.id);s.audit=[];
      return s;
    }
    return {
      today:TODAY,academicYear:YEAR,
      demoAccounts:()=>clone(db.people.filter(p=>p.active).map(({id,username,role,firstName,lastName})=>({id,username,role,firstName,lastName}))),
      currentUser:()=>clone(me()),data:scoped,
      storageStatus:()=>({persistent:persistence,warning:storageWarning}),
      login(username,password){const p=db.people.find(p=>p.username===username.trim().toLowerCase()&&p.active);if(!p||password!=='demo123')throw Error('Credenziali demo non valide. Password: demo123');userId=p.id;locationProof=null;persist();return clone(p);},
      logout(){userId=null;locationProof=null;persist();},
      location(){return locationProof?clone({...locationProof,expired:now()-locationProof.at>300000}):null;},
      clearLocation(){locationProof=null;},
      locate(coords){if(!me())throw Error('Accedi prima di verificare la posizione.');locationProof=Presence.locate(coords,now());return clone(locationProof);},
      simulateLocation(inside){if(!me())throw Error('Accedi prima di verificare la posizione.');locationProof={mode:'simulata',status:inside?'in sede':'fuori sede',siteId:Presence.SITE.id,at:now()};return clone(locationProof);},
      issueQr(lessonId){requireRole('docente');const l=db.lessons.find(l=>l.id===lessonId);if(!l||unit(l.unitId).teacherId!==userId||l.date!==TODAY)throw Error('QR disponibile solo per le tue lezioni della data demo.');if(db.registers.some(r=>r.lessonId===lessonId&&r.signed))throw Error('Registro già firmato: raccolta presenze chiusa.');const code=Presence.token(lessonId,userId,now(),globalThis.crypto.randomUUID());return change('Generazione QR lezione',()=>{db.qrSessions=db.qrSessions.filter(q=>q.lessonId!==lessonId);db.qrSessions.push({lessonId,code,expiresAt:now()+Presence.TTL});return code;});},
      checkInQr(code){requireRole('studente');const p=Presence.parse(code,now()),l=db.lessons.find(l=>l.id===p.l);if(!l||l.date!==TODAY||unit(l.unitId).teacherId!==p.t||!hasUnit(userId,l.unitId))throw Error('QR non associato alla tua iscrizione e alla lezione demo.');if(db.registers.some(r=>r.lessonId===l.id&&r.signed))throw Error('Registro già firmato: raccolta presenze chiusa.');const local=db.qrSessions.find(q=>q.lessonId===l.id);if(local&&local.code!==code.trim())throw Error('QR sostituito: utilizza il nuovo codice del docente.');const proof=verifiedLocation();if(db.attendance.some(a=>a.studentId===userId&&a.lessonId===l.id&&a.status==='presente'))throw Error('La tua presenza risulta già registrata.');return change('Firma presenza con QR demo',()=>{db.attendance=db.attendance.filter(a=>!(a.lessonId===l.id&&a.studentId===userId));db.attendance.push({lessonId:l.id,studentId:userId,status:'presente',source:'QR demo · posizione '+proof.mode,location:proof,at:new Date(now()).toISOString()});return l.id;});},
      punchVerified(){requireRole('ata','docente');const proof=verifiedLocation(),last=db.punches.filter(p=>p.personId===userId).at(-1);change('Timbratura badge con posizione '+proof.mode,()=>db.punches.push({personId:userId,type:last?.type==='entrata'?'uscita':'entrata',at:new Date(now()).toISOString(),location:proof}));},
      saveRegister(lessonId,topic,marks,sign){requireRole('docente');const l=db.lessons.find(l=>l.id===lessonId);if(!l||unit(l.unitId).teacherId!==userId)throw Error('Lezione non assegnata.');if(l.date>TODAY)throw Error('Non puoi compilare una lezione futura nella data demo.');const old=db.registers.find(r=>r.lessonId===lessonId);if(old?.signed)throw Error('Registro già firmato: non modificabile.');if(!topic.trim())throw Error('Inserisci l’argomento della lezione.');const roster=db.enrollments.filter(e=>hasUnit(e.studentId,l.unitId)).map(e=>e.studentId);if(Object.keys(marks).some(id=>!roster.includes(id))||roster.some(id=>!['presente','assente','giustificato'].includes(marks[id])))throw Error('Compila la presenza per ogni studente iscritto.');const proof=sign?verifiedLocation():null;return change(sign?'Firma registro demo':'Salvataggio registro',()=>{db.registers=db.registers.filter(r=>r.lessonId!==lessonId);db.registers.push({lessonId,topic:topic.trim().slice(0,2000),teacherId:userId,signed:Boolean(sign),signedAt:sign?new Date().toISOString():null,location:proof});const previous=db.attendance.filter(a=>a.lessonId===lessonId);db.attendance=db.attendance.filter(a=>a.lessonId!==lessonId);roster.forEach(studentId=>{const same=previous.find(a=>a.studentId===studentId&&a.status===marks[studentId]);db.attendance.push(same?{...same}:{lessonId,studentId,status:marks[studentId],source:'docente demo'});});});},
      checkIn(lessonId){requireRole('studente');const l=db.lessons.find(l=>l.id===lessonId);if(!l||!hasUnit(userId,l.unitId)||l.date!==TODAY)throw Error('Presenza disponibile solo per le tue lezioni della data demo.');if(db.registers.some(r=>r.lessonId===lessonId&&r.signed))throw Error('Registro già firmato dal docente.');return change('Conferma presenza simulata',()=>{db.attendance=db.attendance.filter(a=>!(a.lessonId===lessonId&&a.studentId===userId));db.attendance.push({lessonId,studentId:userId,status:'presente',source:'check-in demo'});});},
      bookExam(examId){requireRole('studente');const e=db.exams.find(e=>e.id===examId);if(!e||!hasUnit(userId,e.unitId))throw Error('Appello non previsto dall’iscrizione attiva.');if(e.bookingDeadline<TODAY)throw Error('Prenotazioni chiuse.');if(db.results.some(r=>r.studentId===userId&&r.unitId===e.unitId))throw Error('Esame già superato.');if(db.bookings.some(b=>b.examId===examId&&b.studentId===userId))throw Error('Appello già prenotato.');if(db.bookings.filter(b=>b.examId===examId).length>=e.capacity)throw Error('Appello completo.');change('Prenotazione esame',()=>db.bookings.push({id:'booking-'+userId+'-'+examId,examId,studentId:userId}));},
      cancelExam(examId){requireRole('studente');change('Annullamento prenotazione',()=>{db.bookings=db.bookings.filter(b=>!(b.studentId===userId&&b.examId===examId));});},
      pay(paymentId){requireRole('studente','segreteria','admin');const p=db.payments.find(p=>p.id===paymentId);if(!p||(me().role==='studente'&&p.studentId!==userId))throw Error('Pagamento non accessibile.');if(p.status==='pagato')throw Error('Pagamento già registrato.');change('Pagamento simulato '+paymentId,()=>Object.assign(p,{status:'pagato',paidAt:TODAY}));},
      updateEnrollment(studentId,status){requireRole('segreteria','admin');if(!['attiva','sospesa','da completare'].includes(status))throw Error('Stato non valido.');const e=enrollment(studentId);if(!e)throw Error('Nessuna iscrizione disponibile.');change('Iscrizione '+studentId+': '+status,()=>{e.status=status;});},
      punch(){requireRole('ata','docente');const last=db.punches.filter(p=>p.personId===userId).at(-1);change('Timbratura demo',()=>db.punches.push({personId:userId,type:last?.type==='entrata'?'uscita':'entrata',at:new Date().toISOString()}));},
      request(type,date,note){requireRole('ata');if(!['Ferie','Permesso breve','Missione'].includes(type)||!/^\d{4}-\d{2}-\d{2}$/.test(date)||date<TODAY||!note.trim())throw Error('Inserisci tipo, data dalla data demo in poi e motivazione.');change('Richiesta personale',()=>db.requests.push({id:'request-'+(db.requests.length+1),personId:userId,type,date,note:note.trim().slice(0,500),status:'in attesa'}));},
      decideRequest(id,status){requireRole('segreteria','admin');if(!['approvata','respinta'].includes(status))throw Error('Stato non valido.');const r=db.requests.find(r=>r.id===id);if(!r)throw Error('Richiesta non trovata.');change('Gestione richiesta '+id,()=>{r.status=status;});},
      reset(){requireRole('admin');db=seed();persist();},
      exportData(){requireRole('admin');return JSON.stringify(db,null,2);}
    };
  }
  return {create,seed,VERSION,TODAY,DB_KEY,SESSION_KEY};
});
