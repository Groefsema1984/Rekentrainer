// ===== Rekentrainer Vellesan · kern: instellingen, hulpfuncties, staat, opslag en synchronisatie =====
const DATA_ENDPOINT_URL = "";            // URL van de Google Apps Script web-app (leeg = testmodus, alleen op dit apparaat)
const BOUW = '/*BOUW*/';
const KLASSEN = ['1e klas','2e klas','3e klas','4e klas','5e klas','6e klas','Thuis'];
const KEY = 'rekenvel-v1';
const OUTBOX = 'rekenvel-outbox';
const IDLE_MS = 90*1000;

const NIVEAUS = [
  {n:1,ref:'1F',titel:'Basis op orde',       sub:'Hele getallen, eenvoudige breuken en procenten, maten en tabellen'},
  {n:2,ref:'1S',titel:'Stevige basis',       sub:'Kommagetallen, verhoudingstabellen, oppervlakte en grafieken'},
  {n:3,ref:'1S → 2F',titel:'Op weg naar 2F', sub:'Procenten, schaal, eenheden omrekenen en formules in woorden'},
  {n:4,ref:'2F',titel:'Niveau 2F',           sub:'Alles wat je nodig hebt voor de rekentoets 2F'},
  {n:5,ref:'2F → 3F',titel:'Op weg naar 3F', sub:'Procentuele verandering, snelheid, inhoud en negatieve getallen'},
  {n:6,ref:'3F',titel:'3F in aanloop',       sub:'Groeifactoren, Pythagoras, machten en formules'},
  {n:7,ref:'3F',titel:'3F basis',            sub:'Rente, indexcijfers, gelijkvormigheid en statistiek'},
  {n:8,ref:'3F',titel:'3F eindniveau',       sub:'Gemengde, complexe contexten op het hoogste rekenniveau'}
];
// subdomeinen (onderdelen): het wiel op de domeinpagina heeft per onderdeel een ring per niveau
const SUBDOMEINEN = {
  G:[{id:'getalbegrip',naam:'Getalbegrip'},{id:'bewerkingen',naam:'Bewerkingen'},{id:'breuken',naam:'Breuken'},{id:'komma',naam:'Kommagetallen'},{id:'negatief',naam:'Negatief en machten'}],
  V:[{id:'vtabel',naam:'Verhoudingstabel'},{id:'schaal',naam:'Schaal en snelheid'},{id:'procent',naam:'Procenten'},{id:'pverandering',naam:'Procentuele verandering'},{id:'groei',naam:'Groei en rente'}],
  M:[{id:'eenheden',naam:'Eenheden omrekenen'},{id:'tijd',naam:'Tijd en geld'},{id:'oppervlak',naam:'Omtrek en oppervlakte'},{id:'inhoud',naam:'Inhoud'},{id:'meetkunde',naam:'Meetkunde'}],
  B:[{id:'tabellen',naam:'Tabellen'},{id:'grafieken',naam:'Grafieken'},{id:'formules',naam:'Formules'},{id:'statistiek',naam:'Statistiek'}]
};
const STARTNIVEAU_KLAS = {'1e klas':2,'2e klas':3,'3e klas':4,'4e klas':5,'5e klas':6,'6e klas':6,'Thuis':2};
const DOMEINEN = [
  {id:'G',naam:'Getallen',kort:'Getallen',k:'#f08a09',ic:'🔢'},
  {id:'V',naam:'Verhoudingen',kort:'Verhoudingen',k:'#1b8fb0',ic:'⚖️'},
  {id:'M',naam:'Meten en meetkunde',kort:'Meten',k:'#3f8f3a',ic:'📐'},
  {id:'B',naam:'Verbanden',kort:'Verbanden',k:'#7a5bd6',ic:'📈'}
];
const DOM = Object.fromEntries(DOMEINEN.map(d=>[d.id,d]));
const DREMPEL = 80;                       // beheersing waarbij een domein "Klaar voor de check" is
const MEDAILLES = [{n:'brons',e:'🥉',min:50},{n:'zilver',e:'🥈',min:80},{n:'goud',e:'🥇',min:95}];

// ---------- hulpfuncties ----------
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const esc = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rondaf = (x,d=2)=>{ const f=Math.pow(10,d); return Math.round((x+Number.EPSILON*Math.sign(x||1))*f)/f };
const duiz = s => s.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
// getal in Nederlandse notatie: max d decimalen, geen overbodige nullen; duizendtallen met punt (vanaf 10.000)
function nl(x,d=4){
  if(typeof x!=='number'||!isFinite(x)) return String(x);
  const neg=x<0; let s=String(rondaf(Math.abs(x),d));
  if(/e/.test(s)) s=Math.abs(x).toFixed(d).replace(/0+$/,'').replace(/\.$/,'');
  let [h,dd]=s.split('.'); if(h.length>4) h=duiz(h);
  return (neg?'−':'')+h+(dd?','+dd:'');
}
const eur = (x,altijdCent=false) => { const c=Math.abs(rondaf(x,2)%1)>1e-9||altijdCent; const [h,d]=Math.abs(x).toFixed(2).split('.'); return '€ '+(x<0?'−':'')+(h.length>3?duiz(h):h)+(c?','+d:',-') };
const pct = x => nl(x,2)+'%';
function parseGetal(s){
  if(s==null) return NaN;
  s=String(s).trim().replace(/[−–]/g,'-').replace(/[€%\s]/g,'').replace(/[a-zA-Z²³\/]+$/,'');
  if(/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s=s.replace(/\./g,'');
  if(/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s=s.replace(/,/g,'');
  s=s.replace(',','.');
  if(/^-?\d+\/\d+$/.test(s)){ const [a,b]=s.split('/'); return Number(a)/Number(b) }
  return s===''||!/^-?(\d+\.?\d*|\.\d+)$/.test(s)?NaN:Number(s);
}
const vandaag = ()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
function weekId(d=new Date()){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const dn=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-dn);const y=new Date(Date.UTC(t.getUTCFullYear(),0,1));return t.getUTCFullYear()+'-W'+String(Math.ceil(((t-y)/864e5+1)/7)).padStart(2,'0')}
const datumKort = t => t?new Date(t).toLocaleDateString('nl-NL',{day:'numeric',month:'short'}):'–';
const eid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,8);
function shuffle(a,r=Math.random){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

// ---------- seeded random (spiegelvragen = zelfde generator, andere seed) ----------
function RNG(seed){
  let a=seed>>>0||1;
  const f=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
  const r={ f,
    int:(lo,hi)=>lo+Math.floor(f()*(hi-lo+1)),
    pick:arr=>arr[Math.floor(f()*arr.length)],
    stap:(lo,hi,s)=>lo+s*Math.floor(f()*(Math.floor((hi-lo)/s)+1)),
    shuffle:arr=>shuffle(arr,f),
    naam:()=>r.pick(NAMEN), naam2:()=>{const a=r.pick(NAMEN);let b;do{b=r.pick(NAMEN)}while(b===a);return [a,b]},
    ja:(p=.5)=>f()<p
  };
  return r;
}
const NAMEN=['Sem','Noor','Daan','Aya','Milan','Sara','Mohammed','Lotte','Finn','Yara','Luuk','Emma','Bram','Fenna','Jayden','Zoë','Ravi','Lina','Thijs','Iris','Ilias','Julia','Mees','Nora','Jesse','Hanna','Ayoub','Sophie','Tim','Elif'];
const nieuweSeed = () => (Math.random()*2**31)>>>0;

// ---------- staat ----------
function nieuweStaat(){
  return { id:'', code:'', naam:'', klas:'', upd:0, aangemaakt:Date.now(),
    niv:0, max:0, plaatsing:null,            // niv 0 = nog geen instaptoets gemaakt
    ld:{}, dom:{}, fb:{}, toetsen:[], diplomas:{}, rec:[], recNiv:0,
    tijd:0, week:{}, dag:{}, aantal:0, goed:0, badges:[], th:'' };
}
let S = null;

function laad(){
  try{ const r=localStorage.getItem(KEY); if(r) S=Object.assign(nieuweStaat(),JSON.parse(r)); }catch(e){ S=null }
  if(!S){ try{ const r=localStorage.getItem(KEY+'-reserve'); if(r) S=Object.assign(nieuweStaat(),JSON.parse(r)); }catch(e){} }
}
function bewaar(sync=true){
  if(!S) return; S.upd=Date.now();
  try{ const oud=localStorage.getItem(KEY); if(oud) localStorage.setItem(KEY+'-reserve',oud); localStorage.setItem(KEY,JSON.stringify(S)); }catch(e){}
  if(sync) planSync();
}

// ---------- samenvoegen (zelfde regels als server/Code.gs) ----------
const MAX_VELDEN = new Set(['tijd','aantal','goed','max']);
function merge(a,b,pad=''){
  if(a===undefined||a===null) return b; if(b===undefined||b===null) return a;
  if(Array.isArray(a)&&Array.isArray(b)){
    const ab=a.concat(b);
    if(ab.length&&ab.every(x=>x&&typeof x==='object'&&x.eid)){ const s=new Set(),u=[]; ab.forEach(x=>{if(!s.has(x.eid)){s.add(x.eid);u.push(x)}}); return u.sort((x,y)=>(x.tijd||0)-(y.tijd||0)) }
    if(ab.length&&ab.every(x=>typeof x==='string')){ const u=a.slice(); b.forEach(x=>{if(!u.includes(x))u.push(x)}); return u }
    return b;
  }
  if(typeof a==='object'&&typeof b==='object'){
    if('u' in a||'u' in b) return (a.u||0)>(b.u||0)?a:b;
    const o={}; for(const k of Object.keys(a).concat(Object.keys(b))) if(!(k in o)) o[k]=merge(a[k],b[k],pad+'.'+k); return o;
  }
  if(typeof a==='number'&&typeof b==='number'){ const v=pad.split('.').pop(); if(MAX_VELDEN.has(v)||pad.startsWith('.week.')||pad.startsWith('.dag.')) return Math.max(a,b) }
  return b;
}
function mergeStaat(p,q){ const [o,n]=(p.upd||0)<=(q.upd||0)?[p,q]:[q,p]; const m=merge(o,n); m.upd=Math.max(o.upd||0,n.upd||0); return m }

// ---------- events (fouten, toetsen) voor de Sheet ----------
function outbox(){ try{ return JSON.parse(localStorage.getItem(OUTBOX)||'[]') }catch(e){ return [] } }
function zetOutbox(l){ try{ localStorage.setItem(OUTBOX,JSON.stringify(l.slice(-800))) }catch(e){} }
function event(ev){ if(!S||demoModus) return; ev.eid=ev.eid||eid(); ev.tijd=ev.tijd||Date.now(); const l=outbox(); l.push(ev); zetOutbox(l); planSync() }

// ---------- server ----------
const serverModus = ()=>!!DATA_ENDPOINT_URL;
let syncStatus='lokaal', syncTimer=null, bezig=false, syncTijd=0, syncFout='', demoModus=false;
async function api(actie,data){
  const r=await fetch(DATA_ENDPOINT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(Object.assign({actie},data))});
  const j=await r.json(); if(!j.ok) throw new Error(j.fout||'Serverfout'); return j;
}
function planSync(ms=4000){ if(!serverModus()||!S||!S.id||demoModus) return; clearTimeout(syncTimer); syncTimer=setTimeout(sync,ms) }
async function sync(){
  if(!serverModus()||!S||!S.id||bezig||demoModus) return;
  bezig=true; syncStatus='bezig'; toonSync();
  const evs=outbox().slice(0,300);
  try{
    const j=await api('sync',{id:S.id,code:S.code,staat:S,events:evs});
    const code=S.code; S=mergeStaat(S,j.staat); S.code=code;
    if(j.klasinst) S.klasinst=j.klasinst;
    const klaar=new Set(j.verwerkt||[]); zetOutbox(outbox().filter(e=>!klaar.has(e.eid)));
    try{ localStorage.setItem(KEY,JSON.stringify(S)) }catch(e){}
    syncStatus='ok'; syncTijd=Date.now(); syncFout='';
  }catch(e){ syncStatus='fout'; syncFout=String(e.message||e); setTimeout(()=>planSync(30000),0) }
  bezig=false; toonSync();
}
function toonSync(){ const el=$('#syncStatus'); if(el) el.innerHTML=syncLabel() }
function syncLabel(){
  if(!serverModus()) return '<span class="sync">Testmodus: alleen op dit apparaat</span>';
  if(syncStatus==='ok') return `<span class="sync ok">✓ Opgeslagen ${new Date(syncTijd).toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit'})}</span>`;
  if(syncStatus==='fout') return `<span class="sync fout">Niet verstuurd, probeert het straks opnieuw</span>`;
  if(syncStatus==='bezig') return '<span class="sync">Opslaan…</span>';
  return '<span class="sync">Op dit apparaat opgeslagen</span>';
}
window.addEventListener('online',()=>planSync(500));
document.addEventListener('visibilitychange',()=>{ if(document.visibilityState==='hidden'&&S&&S.id){ bewaar(false); sync() } });

// ---------- oefentijd ----------
let laatsteTik=Date.now(), oefenActief=false;
['pointerdown','keydown'].forEach(e=>document.addEventListener(e,()=>{laatsteTik=Date.now()},{passive:true}));
setInterval(()=>{
  if(!S||!S.id||!oefenActief||document.visibilityState!=='visible'||Date.now()-laatsteTik>IDLE_MS) return;
  S.tijd=(S.tijd||0)+15; const w=weekId(); S.week[w]=(S.week[w]||0)+15; const d=vandaag(); S.dag[d]=(S.dag[d]||0)+15;
  if(S.tijd%120===0) bewaar(); else { try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){} }
},15000);
