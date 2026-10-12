(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ABAPGPresence=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  // Approximate map centre from the Academy's public Where we are page; demo geofence only.
  const SITE={id:'abapg-demo',name:'Sede ABAPG — geofence demo',address:'Piazza San Francesco al Prato, 5 · Perugia',latitude:43.1133383,longitude:12.3838233,radius:150};
  const TTL=120000,PREFIX='ABAPG:LESSON:';
  function distance(a,b){const r=Math.PI/180,dLat=(b.latitude-a.latitude)*r,dLon=(b.longitude-a.longitude)*r,x=Math.sin(dLat/2)**2+Math.cos(a.latitude*r)*Math.cos(b.latitude*r)*Math.sin(dLon/2)**2;return 6371000*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
  function locate(coords,at=Date.now()){
    if(!coords||!Number.isFinite(coords.latitude)||!Number.isFinite(coords.longitude)||Math.abs(coords.latitude)>90||Math.abs(coords.longitude)>180||!Number.isFinite(coords.accuracy)||coords.accuracy<0)throw Error('Posizione GPS non valida.');
    const meters=distance(coords,SITE),status=coords.accuracy>100?'incerta':meters+coords.accuracy<=SITE.radius?'in sede':meters-coords.accuracy>SITE.radius?'fuori sede':'incerta';
    return {mode:'GPS',status,siteId:SITE.id,at,meters:Math.round(meters),accuracy:Math.round(coords.accuracy)};
  }
  function token(lessonId,teacherId,at=Date.now(),nonce){return PREFIX+JSON.stringify({v:1,l:lessonId,t:teacherId,i:at,e:at+TTL,n:nonce});}
  function parse(text,now=Date.now()){
    if(typeof text!=='string'||text.length>1500||!text.trim().startsWith(PREFIX))throw Error('QR non riconosciuto: serve il QR della lezione, non il badge personale.');
    let p;try{p=JSON.parse(text.trim().slice(PREFIX.length));}catch{throw Error('QR non valido.');}
    if(!p||p.v!==1||typeof p.l!=='string'||typeof p.t!=='string'||typeof p.n!=='string'||p.n.length<8||!Number.isSafeInteger(p.i)||!Number.isSafeInteger(p.e)||p.e-p.i!==TTL)throw Error('Contenuto QR non valido.');
    if(now>=p.e)throw Error('QR scaduto: chiedi al docente di rigenerarlo.');if(p.i>now+5000)throw Error('Orario del QR non valido: controlla l’orologio del dispositivo.');return p;
  }
  return {SITE,TTL,PREFIX,distance,locate,token,parse};
});
