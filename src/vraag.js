// ===== Leerdoelen, opgaven maken (uit generatoren), tonen en nakijken =====
// Een leerdoel heeft een generator gen(r) die nette getallen kiest. Elke opgave, spiegelvraag en toetsvraag
// wordt daaruit gemaakt met een seed; het antwoord wordt berekend (en in tools/controleer.js gecontroleerd).
const LD = {}; const LDS = [];
function L(def){
  def.rm = def.niv<=2 ? false : !!def.rm;               // rekenmachine pas vanaf niveau 3, per leerdoel
  def.verwar = def.verwar||[];
  if(LD[def.id]) throw new Error('Dubbel leerdoel '+def.id);
  LD[def.id]=def; LDS.push(def); return def;
}
const ldsVan = (niv,dom,sub) => LDS.filter(l=>l.niv===niv&&(!dom||l.dom===dom)&&(!sub||l.sub===sub));
const subVan = (dom,id) => (SUBDOMEINEN[dom]||[]).find(s=>s.id===id)||{id,naam:id};
const eenheidVan = (ld,v) => typeof ld.eenheid==='function'?ld.eenheid(v):(ld.eenheid||'');
const antwTekst = (ld,v,x=ld.antw(v)) => { const e=eenheidVan(ld,v); if(typeof x!=='number') return String(x); return e==='€'?eur(x):nl(x)+(e?(e==='%'?'%':' '+e):'') };

// welke vraagvormen kan dit leerdoel op trede 3?
function vormen(ld){
  const v=[]; if(ld.opties) return ['mc'].concat(ld.sab?['sab']:[],ld.koppel?['koppel']:[],ld.v3?['v3']:[]);
  if(ld.antw) v.push('open','open'); if(ld.antw&&ld.fouten) v.push('mc');
  if(ld.sab) v.push('sab'); if(ld.tabel) v.push('tabel'); if(ld.volgorde&&ld.stappen) v.push('volgorde');
  if(ld.koppel) v.push('koppel'); if(ld.v3) v.push('v3');
  return v;
}

// ---------- opgave maken ----------
// opt: {vorm, trede, seed, bron:'oefen'|'spiegel'|'herhaal'|'toets'|'instap'}
function maakItem(ldId,opt={}){
  const ld=LD[ldId]; const seed=opt.seed||nieuweSeed(); const r=RNG(seed); const v=ld.gen(r);
  const trede=opt.trede||3;
  let vorm=opt.vorm;
  if(!vorm){
    if(trede===1&&ld.stappen) vorm='faded1';
    else if(trede===2&&ld.stappen) vorm='faded2';
    else { const vs=vormen(ld); vorm=vs[Math.floor(RNG(seed+7).f()*vs.length)] }
  }
  const it={ key:ldId+'#'+seed, ld:ldId, niv:ld.niv, dom:ld.dom, sub:ld.sub, seed, v, vorm, trede, bron:opt.bron||'oefen', rm:ld.rm, r:RNG(seed+99) };
  it.vraag = ld.vraag?ld.vraag(v):'';
  it.fig = ld.fig?ld.fig(v):'';
  if(ld.antw) it.antw = ld.antw(v);
  it.eenheid = eenheidVan(ld,v);
  if(vorm==='mc'){
    if(ld.opties){ it.opties=it.r.shuffle(ld.opties(v).map(o=>({t:o[0],goed:!!o[1],fb:o[2]||''}))) }
    else {
      const f=(ld.fouten(v)||[]).filter(x=>typeof x[0]==='number'&&Math.abs(x[0]-it.antw)>1e-9);
      const uniek=[]; f.forEach(x=>{ if(!uniek.some(u=>Math.abs(u[0]-x[0])<1e-9)) uniek.push(x) });
      // te weinig misconcepties? vul aan met plausibele getallen (factor 10, of een stap ernaast)
      const a=it.antw, stap=Math.pow(10,Math.max(0,Math.floor(Math.log10(Math.abs(a)||1))-1))*(ld.dec===0?1:1);
      for(const x of [a*10,a/10,a+stap,a-stap,a+2*stap,a*2]){ if(uniek.length>=3) break; const xr=rondaf(x,ld.dec??2); if((xr>0||a<=0)&&Math.abs(xr-a)>1e-9&&!uniek.some(u=>Math.abs(u[0]-xr)<1e-9)&&antwTekst(ld,v,xr)!==antwTekst(ld,v)) uniek.push([xr,'']) }
      it.opties=it.r.shuffle([{t:antwTekst(ld,v),goed:true}].concat(uniek.slice(0,3).map(x=>({t:antwTekst(ld,v,x[0]),goed:false,fb:x[1]}))));
    }
  }
  if(vorm==='faded1'||vorm==='faded2'||vorm==='volgorde'){ it.stappen=ld.stappen(v) }
  if(vorm==='faded1'){ const w=ld.waarom?(typeof ld.waarom==='function'?ld.waarom(v):ld.waarom):{vraag:'Klopt de laatste stap van deze uitwerking?',opties:['Ja, het antwoord past bij de vraag','Nee, er moet nog iets bij','Nee, je moet delen in plaats van vermenigvuldigen']};
    it.check={vraag:w.vraag,opties:it.r.shuffle(w.opties.map((t,i)=>({t,goed:i===0})))} }
  if(vorm==='faded2'){ // één lege tussenstap: bij voorkeur niet de laatste
    const kand=it.stappen.map((s,i)=>i).filter(i=>typeof it.stappen[i][1]==='number');
    const midden=kand.filter(i=>i<it.stappen.length-1);
    it.leeg = (midden.length&&it.r.f()<.7)?it.r.pick(midden):kand[kand.length-1];
  }
  if(vorm==='volgorde'){ it.volg=it.r.shuffle(it.stappen.map((s,i)=>i)); if(it.volg.every((x,i)=>x===i)) it.volg.reverse() }
  if(vorm==='sab') it.sab=ld.sab(v);
  if(vorm==='tabel'){ it.tab=ld.tabel(v); it.tab.leeg=it.tab.leeg.slice().sort((a,b)=>a[1]-b[1]||a[0]-b[0]) }
  if(vorm==='koppel'){ const k=ld.koppel(v,it.r); it.kvraag=k.vraag; it.paren=k.paren; it.rechts=it.r.shuffle(k.paren.map((p,i)=>i)) }
  if(vorm==='v3'){ const k=ld.v3(v); it.v3=k; it.v3volg=it.r.shuffle([0,1,2]) }
  if(ld.eenheden&&(vorm==='open')) it.eenheden=it.r.shuffle(ld.eenheden.slice());
  return it;
}
const spiegelVan = (it,bron='spiegel') => maakItem(it.ld,{trede:3,vorm:LD[it.ld].opties?'mc':(LD[it.ld].antw?'open':null),bron});

// ---------- tonen ----------
const TREDE_LABEL={faded1:'Voorbeeld',faded2:'Invulsom',open:'Zelf doen',mc:'Kies het goede antwoord',sab:'De Saboteur',tabel:'Verhoudingstabel',volgorde:'Zet in de goede volgorde',koppel:'Koppel',v3:'Drie antwoorden vergelijken'};
function invoerVak(id,e,extra=''){
  const pre=e==='€'?'<span class="eh">€</span>':''; const post=e&&e!=='€'?`<span class="eh">${esc(e)}</span>`:'';
  return `<div class="reken">${pre}<input type="text" id="${id}" inputmode="decimal" autocomplete="off" autocorrect="off" spellcheck="false" ${extra}>${post}</div>`;
}
function itemHtml(it){
  const ld=LD[it.ld]; let h='';
  const vraag=`<div class="vraag">${it.vraag}</div>${it.fig?`<div class="figuur">${it.fig}</div>`:''}`;
  switch(it.vorm){
    case 'open':
      h=vraag;
      if(it.eenheden) h+=`<div class="reken"><input type="text" id="antw" inputmode="decimal" autocomplete="off"><select id="eenh" style="max-width:130px"><option value="">eenheid</option>${it.eenheden.map(e=>`<option>${esc(e)}</option>`).join('')}</select></div>`;
      else h+=invoerVak('antw',it.eenheid);
      break;
    case 'mc':
      h=vraag+`<div class="opties">${it.opties.map((o,i)=>`<button class="optie" data-i="${i}" onclick="kiesOptie(${i})"><span class="l">${'ABCD'[i]}</span><span>${o.t}</span></button>`).join('')}</div>`;
      break;
    case 'faded1':
      h=`<div class="uitlegblok"><span class="eyebrow">Zo werkt het</span><p>${ld.uitleg}</p></div>`+vraag+
        `<ol class="stappen">${it.stappen.map(s=>`<li>${s[0]}</li>`).join('')}</ol>`+
        `<div class="checkvraag"><b>Checkvraag:</b> ${esc(it.check.vraag)}</div><div class="opties">${it.check.opties.map((o,i)=>`<button class="optie" data-i="${i}" onclick="kiesOptie(${i})"><span class="l">${'ABC'[i]}</span><span>${esc(o.t)}</span></button>`).join('')}</div>`;
      break;
    case 'faded2':
      h=vraag+`<ol class="stappen">${it.stappen.map((s,i)=>i===it.leeg?`<li class="leegstap">${s[0].replace(/\{\?\}|…|\.\.\./,'')}<div style="margin-top:8px">${invoerVak('antw',s[2]||'')}</div></li>`:`<li>${s[0]}</li>`).join('')}</ol><p class="zacht klein">Vul de lege stap in.</p>`;
      break;
    case 'sab':
      h=`<div class="vraag">${it.sab.intro||it.vraag}</div>${it.fig?`<div class="figuur">${it.fig}</div>`:''}<p class="zacht">Eén stap bevat een denkfout. Tik op de foute stap en verbeter hem.</p>`+
        `<div class="sabstappen">${it.sab.stappen.map((s,i)=>`<button class="sabstap" data-i="${i}" onclick="kiesSab(${i})"><span class="nr">${i+1}</span><span>${s}</span></button>`).join('')}</div>`+
        `<div id="sabverb" hidden><label class="label">${esc(it.sab.vraag||'Wat is het juiste antwoord?')}</label>${invoerVak('antw',it.sab.eenheid??it.eenheid)}</div>`;
      break;
    case 'tabel':
      h=vraag+`<div class="tabelwrap">${vtabelHtml(it.tab.kop,it.tab.rijen.map((c,ci)=>c.map((x,ri)=>it.tab.leeg.some(l=>l[0]===ci&&l[1]===ri)?null:x)),true)}</div><p class="zacht klein">Vul de lege vakjes in.</p>`;
      break;
    case 'volgorde':
      h=vraag+`<p class="zacht">Tik de stappen aan in de goede volgorde.</p><div class="volgorde" id="volgBron">${it.volg.map(i=>`<button class="vstap" data-i="${i}" onclick="tikVolg(${i})">${it.stappen[i][0]}</button>`).join('')}</div><ol class="stappen" id="volgDoel"></ol><button class="knop zacht klein" onclick="wisVolg()">Opnieuw</button>`;
      break;
    case 'koppel':
      h=`<div class="vraag">${it.kvraag}</div><p class="zacht">Tik links, dan rechts om een paar te maken.</p><div class="koppelgrid"><div>${it.paren.map((p,i)=>`<button class="kp links" data-i="${i}" onclick="tikKop('l',${i})">${p[0]}</button>`).join('')}</div><div>${it.rechts.map(i=>`<button class="kp rechts" data-i="${i}" onclick="tikKop('r',${i})">${it.paren[i][1]}</button>`).join('')}</div></div>`;
      break;
    case 'v3':
      h=`<div class="vraag">${it.v3.vraag}</div>${it.fig?`<div class="figuur">${it.fig}</div>`:''}<label class="label">Stap 1 · Schrijf kort hoe jij het aanpakt</label><textarea id="eigen" rows="3" placeholder="Mijn aanpak…"></textarea><div id="v3deel2" hidden></div>`;
      break;
  }
  return h;
}

// ---------- interactie per vorm (houdt de keuze bij in Q.keuze) ----------
let Q=null; // {it, keuze, ...}
function kiesOptie(i){ if(Q.klaar) return; Q.keuze=i; $$('.optie').forEach(b=>b.classList.toggle('kies',+b.dataset.i===i)) }
function kiesSab(i){ if(Q.klaar) return; Q.sabStap=i; $$('.sabstap').forEach(b=>b.classList.toggle('kies',+b.dataset.i===i)); const v=$('#sabverb'); v.hidden=false; setTimeout(()=>$('#antw').focus(),50) }
function tikVolg(i){ if(Q.klaar) return; Q.volg=Q.volg||[]; if(Q.volg.includes(i)) return; Q.volg.push(i); $(`.vstap[data-i="${i}"]`).disabled=true; $('#volgDoel').insertAdjacentHTML('beforeend',`<li>${Q.it.stappen[i][0]}</li>`) }
function wisVolg(){ if(Q.klaar) return; Q.volg=[]; $$('.vstap').forEach(b=>b.disabled=false); $('#volgDoel').innerHTML='' }
function tikKop(kant,i){
  if(Q.klaar) return; Q.paar=Q.paar||{};
  if(kant==='l'){ Q.links=i; $$('.kp.links').forEach(b=>b.classList.toggle('kies',+b.dataset.i===i)); return }
  if(Q.links==null) return;
  for(const k in Q.paar) if(Q.paar[k]===i) delete Q.paar[k];
  Q.paar[Q.links]=i; Q.links=null; tekenKoppel();
}
function tekenKoppel(){
  const kl=['#f08a09','#1b8fb0','#3f8f3a','#7a5bd6','#d6453d','#c49a00'];
  $$('.kp').forEach(b=>{b.style.borderColor='';b.classList.remove('kies');b.querySelector('.kb')?.remove()});
  Object.entries(Q.paar).forEach(([l,r],n)=>{ const c=kl[+l%kl.length]; const bl=$(`.kp.links[data-i="${l}"]`), br=$(`.kp.rechts[data-i="${r}"]`); [bl,br].forEach(b=>{b.style.borderColor=c;b.insertAdjacentHTML('afterbegin',`<i class="kb" style="background:${c}"></i>`)}) });
}

// is er iets ingevuld? (voordat Zeker/Gok werkt)
function heeftAntwoord(){
  const it=Q.it;
  switch(it.vorm){
    case 'mc': case 'faded1': return Q.keuze!=null;
    case 'open': case 'faded2': return ($('#antw').value.trim()!=='') && (!it.eenheden||$('#eenh').value);
    case 'sab': return Q.sabStap!=null && $('#antw').value.trim()!=='';
    case 'tabel': return $$('.tvak').every(x=>x.value.trim()!=='');
    case 'volgorde': return (Q.volg||[]).length===it.stappen.length;
    case 'koppel': return Object.keys(Q.paar||{}).length===it.paren.length;
    case 'v3': return true;
  }
  return true;
}
const zelfde = (a,b,tol=1e-6) => typeof a==='number'&&typeof b==='number'&&Math.abs(a-b)<=tol+1e-9*Math.abs(b);

// nakijken → {goed, gegeven, juist, fb (html), misconceptie}
function nakijk(){
  const it=Q.it, ld=LD[it.ld]; const tol=ld.tol||1e-6; let goed=false, gegeven='', fb='', mis='';
  switch(it.vorm){
    case 'open': {
      const x=parseGetal($('#antw').value); gegeven=$('#antw').value+(it.eenheden?' '+$('#eenh').value:'');
      goed=zelfde(x,it.antw,tol);
      if(goed&&it.eenheden&&$('#eenh').value!==it.eenheid){ goed=false; fb=`Het getal klopt, maar de eenheid niet. Het moet <b>${esc(it.eenheid)}</b> zijn.`; mis='eenheid' }
      if(!goed&&!fb&&isNaN(x)) fb='Vul een getal in. Je mag een komma of een punt gebruiken.';
      if(!goed&&!fb&&ld.fouten){ const m=ld.fouten(it.v).find(f=>zelfde(x,f[0],tol)); if(m){ fb=m[1]; mis=m[2]||'misconceptie' } }
      if(!goed&&!fb&&ld.afronding&&zelfde(rondaf(x,0),rondaf(it.antw,0),.5)) fb='Je zit er dichtbij. Let op het afronden.';
      break; }
    case 'mc': case 'faded1': {
      const o=(it.vorm==='mc'?it.opties:it.check.opties)[Q.keuze]; goed=o.goed; gegeven=o.t.replace(/<[^>]+>/g,'');
      if(!goed){ fb=o.fb||''; mis=o.fb?'misconceptie':'' }
      $$('.optie').forEach((b,i)=>{ const oo=(it.vorm==='mc'?it.opties:it.check.opties)[i]; if(oo.goed) b.classList.add('goed'); else if(i===Q.keuze) b.classList.add('fout') });
      break; }
    case 'faded2': {
      const s=it.stappen[it.leeg]; const x=parseGetal($('#antw').value); gegeven=$('#antw').value; goed=zelfde(x,s[1],tol);
      if(!goed) fb=`In deze stap hoort <b>${nl(s[1])}</b>.`;
      break; }
    case 'sab': {
      const x=parseGetal($('#antw').value); const stapGoed=Q.sabStap===it.sab.fout; const valGoed=zelfde(x,it.sab.juist,tol);
      gegeven='stap '+(Q.sabStap+1)+': '+$('#antw').value; goed=stapGoed&&valGoed;
      $$('.sabstap').forEach((b,i)=>{ if(i===it.sab.fout) b.classList.add('goed'); else if(i===Q.sabStap) b.classList.add('fout') });
      if(!stapGoed) fb=`De denkfout zit in stap ${it.sab.fout+1}. ${it.sab.uitleg}`;
      else if(!valGoed) fb=`Goed gezien: stap ${it.sab.fout+1} is fout. ${it.sab.uitleg} Maar je verbetering klopt nog niet.`;
      else fb=it.sab.uitleg;
      break; }
    case 'tabel': {
      const vakken=$$('.tvak'); let alle=true; const lijst=it.tab.leeg.map(([c,r])=>it.tab.rijen[c][r]);
      vakken.forEach((x,i)=>{ const ok=zelfde(parseGetal(x.value),lijst[i],tol); x.classList.add(ok?'goed':'fout'); if(!ok) alle=false });
      goed=alle; gegeven=vakken.map(x=>x.value).join(' | ');
      if(!goed) fb='Niet alle vakjes kloppen. De goede waarden: '+lijst.map(x=>nl(x)).join(', ')+'.';
      break; }
    case 'volgorde': {
      goed=Q.volg.every((x,i)=>x===i); gegeven=Q.volg.map(x=>x+1).join('-');
      if(!goed) fb='De goede volgorde staat hieronder in de uitwerking.';
      break; }
    case 'koppel': {
      goed=it.paren.every((p,i)=>Q.paar[i]===i); gegeven=JSON.stringify(Q.paar);
      $$('.kp.links').forEach(b=>{ const i=+b.dataset.i; b.classList.add(Q.paar[i]===i?'goed':'fout') });
      if(!goed) fb='Goede paren: '+it.paren.map(p=>`${p[0]} ↔ ${p[1]}`).join(' · ');
      break; }
  }
  const juist = it.vorm==='sab'?antwTekstVrij(it.sab.juist,it.sab.eenheid??it.eenheid):it.vorm==='faded2'?nl(it.stappen[it.leeg][1]):(it.vorm==='mc'||it.vorm==='faded1')?((it.vorm==='mc'?it.opties:it.check.opties).find(o=>o.goed).t.replace(/<[^>]+>/g,'')):(it.antw!=null?antwTekst(ld,it.v):'');
  return {goed,gegeven,juist,fb,mis};
}
const antwTekstVrij=(x,e)=> e==='€'?eur(x):nl(x)+(e?(e==='%'?'%':' '+e):'');

// uitwerking van een opgave (stappen) en andere uitleg
function uitwerkingHtml(it){
  const ld=LD[it.ld]; if(it.vorm==='sab') return `<ol class="stappen klein">${(it.sab.goed||[]).map(s=>`<li>${s}</li>`).join('')}</ol>`;
  if(!ld.stappen) return '';
  return `<ol class="stappen klein">${ld.stappen(it.v).map(s=>`<li>${s[0].replace(/\{\?\}/,s[1]!=null?nl(s[1]):'')}</li>`).join('')}</ol>`;
}
function andersHtml(it){
  const ld=LD[it.ld]; if(!ld.anders) return `<p>${ld.uitleg}</p>`;
  const a=ld.anders(it.v); const o=typeof a==='string'?{tekst:a}:a;
  return `<p>${o.tekst}</p>${o.svg?`<div class="figuur">${o.svg}</div>`:''}${o.tabel?`<div class="tabelwrap">${vtabelHtml(o.tabel.kop,o.tabel.rijen)}</div>`:''}`;
}
