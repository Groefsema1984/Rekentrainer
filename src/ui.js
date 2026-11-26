// ===== Schermen voor de leerling =====
// Foto's: Unsplash (gratis te gebruiken onder de Unsplash-licentie)
const FOTO={start:'1509062522246-3755977927d7',G:'1635070041078-e363dbe005cb',V:'1554224155-6726b3ff858f',M:'1503387762-592deb58ef4e',B:'1551288049-bebda4e38f71',
  toets:'1606326608606-aa0b62935f2b',instap:'1522202176988-66273c2fd55f',fouten:'1456513080510-7bf3a84b82f8',niveaus:'1519389950473-47ba0277781c'};
const foto=(k,w=1400)=>FOTO[k]?`background-image:url('https://images.unsplash.com/photo-${FOTO[k]}?w=${w}&q=70&auto=format&fit=crop')`:'';
const VOET=()=>`<footer class="voettekst"><div class="in"><b>vellesan <span class="o">college</span></b><span>Rekentrainer · Niveau 1 t/m 8 (1F tot en met 3F)</span><span style="margin-left:auto">Foto's: Unsplash</span></div></footer>`;

let scherm='welkom', param={};
function go(naam,p={}){
  if(naam!=='quiz') oefenActief=false;
  scherm=naam; param=p; document.body.dataset.scherm=naam;
  const f=SCHERMEN[naam]||SCHERMEN.home; $('#app').innerHTML=f(p); menu(); profiel(); window.scrollTo(0,0);
  if(naam==='quiz') naRender();
}
function menu(){
  const m=$('#menu'); if(!m) return;
  if(!S||!S.naam||!S.niv){ m.innerHTML=''; return }
  const items=[['home','Dashboard'],['niveaus','Niveaus'],['fouten','Foutenbank'],['account','Account']];
  m.innerHTML=items.map(([k,t])=>`<button class="${scherm===k||(k==='home'&&scherm==='domein')?'aan':''}" onclick="go('${k}')">${t}</button>`).join('')+
    `<button onclick="go('docentLogin')" style="margin-left:auto">Docent</button>`;
}
function profiel(){
  const p=$('#profiel'); if(!p) return;
  if(!S||!S.naam){ p.innerHTML=`<button class="knop zacht klein" onclick="go('docentLogin')">Docent</button>`; return }
  p.innerHTML=`<span id="syncStatus">${syncLabel()}</span><button class="profiel" onclick="go('account')"><span class="avatar">${esc(S.naam.trim()[0]||'?').toUpperCase()}</span><span>${esc(S.naam.split(' ')[0])}${S.niv?' · Niveau '+S.niv:''}</span></button>`;
}
function melding(t,ms=3500){ const d=document.createElement('div'); d.className='melding'; d.innerHTML=t; document.body.appendChild(d); setTimeout(()=>d.remove(),ms) }
const balk=(b,k)=>`<div class="balk"><i style="width:${Math.max(0,Math.min(100,b))}%;${k?`background:${k}`:''}"></i></div>`;

// ---------- account ----------
async function nieuwAccount(){
  const naam=$('#wNaam').value.trim().replace(/\s+/g,' '), klas=$('#wKlas').value;
  if(naam.length<3||!naam.includes(' ')){ melding('Vul je voor- én achternaam in.'); return }
  const btn=$('#wMaak'); btn.disabled=true; btn.textContent='Bezig…';
  S=nieuweStaat(); S.naam=naam; S.klas=klas;
  if(serverModus()){
    try{ const j=await api('nieuw',{naam,klas}); S.id=j.id; S.code=j.code; S.klasinst=j.klasinst; bewaar(false); go('code'); return }
    catch(e){ btn.disabled=false; btn.textContent='Account maken'; melding('Account maken lukte niet: '+esc(e.message)+'. Controleer je internet.'); S=null; return }
  }
  S.id='LOKAAL-'+Math.random().toString(36).slice(2,6).toUpperCase(); bewaar(false); go('instapIntro');
}
async function herstelAccount(){
  const id=$('#hId').value.trim().toUpperCase(), code=$('#hCode').value.trim();
  if(!id||code.length!==6){ melding('Vul je leerling-ID en je herstelcode van 6 cijfers in.'); return }
  try{ const j=await api('herstel',{id,code}); S=Object.assign(nieuweStaat(),j.staat); S.id=id; S.code=code; S.klasinst=j.klasinst; bewaar(false); melding('Welkom terug, '+esc(S.naam.split(' ')[0])+'!'); go(S.niv?'home':'instapIntro') }
  catch(e){ melding(esc(e.message)) }
}
function uitloggen(){ if(!confirm('Weet je zeker dat je wilt uitloggen? Schrijf eerst je leerling-ID en herstelcode op.')) return; sync().finally(()=>{ try{localStorage.removeItem(KEY);localStorage.removeItem(KEY+'-reserve');localStorage.removeItem(OUTBOX)}catch(e){} S=null; go('welkom') }) }

const SCHERMEN = {
welkom(){
  return `<section class="foto held" style="${foto('start',1800)}"><div class="in"><div>
    <span class="eyebrow">Vellesan College · Rekentrainer</span>
    <h1>Word sterker in rekenen, stap voor stap</h1>
    <p>Je start met een korte instaptoets. Daarna oefen je op jouw niveau, met uitleg bij elke fout, tot je de rekentoets haalt. Van Niveau 1 tot en met Niveau 8 (3F).</p>
    <button class="knop groot" onclick="document.getElementById('aanmelden').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#wNaam').focus(),400)">Start</button>
    <ul class="usp"><li>Op jouw niveau</li><li>Uitleg bij elke fout</li><li>Klaar voor de rekentoets</li></ul></div></div></section>
   <div class="wrap" id="aanmelden" style="max-width:1000px"><div class="welkom-grid">
   <div class="kaart"><span class="eyebrow" style="color:var(--knop)">Eerste keer</span><h3 style="margin:6px 0 0">Ik ben nieuw</h3>
    <label class="label">Je voor- en achternaam</label><input type="text" id="wNaam" autocomplete="name">
    <label class="label">Je klas</label><select id="wKlas">${KLASSEN.map(k=>`<option>${esc(k)}</option>`).join('')}</select>
    <div class="voet"><button class="knop vol" id="wMaak" onclick="nieuwAccount()">Account maken</button></div></div>
   ${serverModus()?`<div class="kaart"><span class="eyebrow" style="color:var(--knop)">Terugkomen</span><h3 style="margin:6px 0 0">Ik heb al een account</h3>
    <p class="zacht" style="margin:6px 0 0;font-size:15px">Nieuwe iPad, of de app opnieuw geopend? Vul je leerling-ID en herstelcode in. Je voortgang komt terug.</p>
    <label class="label">Leerling-ID</label><input type="text" id="hId" autocapitalize="characters" placeholder="bijv. K1-K7QM">
    <label class="label">Herstelcode (6 cijfers)</label><input type="text" id="hCode" inputmode="numeric" maxlength="6">
    <div class="voet"><button class="knop zacht vol" onclick="herstelAccount()">Herstel mijn voortgang</button></div></div>`:
    `<div class="kaart"><h3 style="margin-top:0">Testmodus</h3><p class="zacht" style="margin:0">Er is nog geen server ingesteld. De voortgang staat alleen op dit apparaat.</p></div>`}</div>
   <p class="zacht mid" style="font-size:14px;margin-top:24px">Tip voor de iPad: open de link in Safari, tik op het deel-icoon en kies "Zet op beginscherm".</p></div>${VOET()}`;
},
code(){
  return `<div class="wrap" style="max-width:560px"><div class="kaart mid"><div class="groot">🔐</div>
   <h2 style="margin-top:0">Bewaar deze gegevens goed</h2><p>Hiermee haal je je voortgang terug op een andere iPad of als de app gewist is. <b>Maak nu een screenshot.</b></p>
   <p class="zacht" style="margin-bottom:2px">Leerling-ID</p><div class="code">${esc(S.id)}</div>
   <p class="zacht" style="margin-bottom:2px">Herstelcode</p><div class="code">${esc(S.code)}</div>
   <p class="zacht" style="font-size:14px">Je vindt ze later ook onder Account. Je docent kan ze ook opzoeken.</p>
   <div class="voet" style="justify-content:center"><button class="knop" onclick="go(S.niv?'home':'instapIntro')">Ik heb een screenshot gemaakt</button></div></div></div>`;
},
instapIntro(){
  const opnieuw=!!S.plaatsing;
  return `<section class="foto paginakop" style="${foto('instap')};border-radius:0;min-height:260px"><div class="wrap" style="width:100%;padding-bottom:0"><span class="eyebrow" style="color:var(--acc)">Instaptoets</span><h1>${opnieuw?'Instaptoets opnieuw maken':'Eerst kijken wat je al kunt'}</h1></div></section>
   <div class="wrap smal"><div class="kaart">
   <p>Deze toets bepaalt op welk niveau je begint. Je krijgt steeds vier opgaven, één uit elk domein: <b>Getallen</b>, <b>Verhoudingen</b>, <b>Meten en meetkunde</b> en <b>Verbanden</b>. Gaat het goed, dan worden de opgaven moeilijker. Gaat het minder, dan makkelijker.</p>
   <ul class="lijst"><li>Het duurt ongeveer 10 tot 20 minuten.</li><li>Je krijgt tijdens de toets nog geen uitleg. Dat komt daarna, bij het oefenen.</li><li>Kies bij elk antwoord <b>Zeker (!)</b> of <b>Gok (?)</b>. Wees eerlijk: dan oefen je straks precies wat je nodig hebt.</li><li>Pak kladpapier. Een rekenmachine mag alleen als het icoontje 🧮 aan staat.</li></ul>
   ${opnieuw?'<p class="zacht">Je huidige niveau wordt vervangen door de uitslag van deze toets. Je oefenvoortgang blijft bewaard.</p>':''}
   <div class="voet"><button class="knop groot" onclick="startInstap()">Start de instaptoets</button></div></div></div>`;
},
home(){
  if(!S.niv) return SCHERMEN.instapIntro();
  const n=S.niv, N=NIVEAUS[n-1]; const totaal=nivB(n);
  const due=fbDue().length, open=fbOpen().length, zf=fbOpen().filter(([k,f])=>f.zf).length;
  const omlaagNu = S.omlaagMelding; if(omlaagNu){ S.omlaagMelding=false; bewaar(false) }
  const domKaart=d=>{ const b=domB(n,d.id), st=domStatus(n,d.id), med=medaille(b), ap=aandachtspunten(n,d.id);
    return `<div class="domkaart" style="--k:${d.k}"><div class="dkkop"><h3>${esc(d.naam)} <span>${b}%</span></h3>${med?`<span class="med" title="${med.n}">${med.e}</span>`:''}</div>
      <div class="dkbody">${donutSvg(b,d.k)}<div><small class="ap">Aandachtspunten</small>${ap.length?`<ul class="aplijst">${ap.map(x=>`<li><button onclick="startOefen({modus:'sub',dom:'${d.id}',sub:'${x.s.id}'})">${esc(x.s.naam)}</button></li>`).join('')}</ul>`:`<p class="zacht klein">${st==='beheerst'?'Dit domein is beheerst.':'Geen: alles staat op zilver.'}</p>`}
      ${st==='check'?'<span class="status check">Klaar voor de check</span>':st==='herkansing'?'<span class="status herk">Terug naar oefenen</span>':''}</div></div>
      <div class="dkvoet"><button class="knop klein" style="background:${d.k}" onclick="go('domein',{dom:'${d.id}'})">Bekijk je voortgang</button><button class="knop zacht klein" onclick="startOefen({modus:'domein',dom:'${d.id}'})">Oefen</button></div></div>` };
  const toets = S.diplomas[n] ? `<p>Je hebt de rekentoets van Niveau ${n} gehaald. 🎓</p>` :
    toetsOpen(n) ? `<p>Alle domeinen staan op 80% of hoger. Je mag de rekentoets van Niveau ${n} maken.</p><button class="knop vol" onclick="go('toetsIntro',{niv:${n}})">Start de rekentoets</button>` :
    `<p class="zacht klein">De rekentoets van Niveau ${n} gaat open als alle vier domeinen op 80% staan.</p>${DOMEINEN.map(d=>`<div class="minirij"><span>${d.kort}</span>${balk(domB(n,d.id),d.k)}<b>${domB(n,d.id)}%</b></div>`).join('')}`;
  return `<section class="foto niveaukop" style="${foto('start',1800)}"><div class="in">
     <div><span class="eyebrow">Niveau ${n} · ${esc(N.ref)}</span><h1>${esc(N.titel)}</h1><p>${esc(N.sub)}</p>
     <div class="ladder">${NIVEAUS.map(x=>`<span class="${x.n<n||S.diplomas[x.n]?'af':x.n===n?'nu':''}" title="Niveau ${x.n}">${S.diplomas[x.n]?'✓':x.n}</span>`).join('')}</div></div>
     <button class="knop groot" onclick="startOefen({modus:'slim'})">Verder oefenen</button></div></section>
   <div class="wrap">
   ${omlaagNu?`<div class="kaart melden"><b>We zijn een niveau teruggegaan.</b> De laatste opgaven op Niveau ${n+1} gingen nog lastig. Op Niveau ${n} maak je de basis eerst sterker. Haal de rekentoets van Niveau ${n} en je gaat weer omhoog.</div>`:''}
   <div class="gotdash">
    <aside class="kaart totaal"><h3 class="kaartkop">Totaaloverzicht</h3>
      ${ringenSvg(DOMEINEN.map(d=>({b:domB(n,d.id),k:d.k})),totaal+'%')}
      <div class="legenda">${DOMEINEN.map(d=>`<span><i style="background:${d.k}"></i>${d.kort} ${domB(n,d.id)}%</span>`).join('')}</div>
      <div class="cijfers"><div><span class="getal">${S.aantal||0}</span><small>opgaven</small></div><div><span class="getal">${Object.keys(S.diplomas).length}</span><small>toetsen gehaald</small></div><div><span class="getal">${Math.round((S.tijd||0)/60)}</span><small>minuten</small></div></div>
    </aside>
    <div class="domgrid">${DOMEINEN.map(domKaart).join('')}</div>
    <aside class="rechterkol">
      <div class="kaart"><h3 class="kaartkop">Verder werken</h3>
        <button class="verder" onclick="startOefen({modus:'slim'})"><b>Slim oefenen</b><small>10 opgaven, precies op wat je nodig hebt</small><span>›</span></button>
        ${due?`<button class="verder rood" onclick="startOefen({modus:'fouten'})"><b>Herhaal je fouten (${due})</b><small>${zf?zf+' keer "Zeker én fout": die eerst':'Ze komen terug tot je ze 2× goed hebt'}</small><span>›</span></button>`:''}
      </div>
      <div class="kaart"><h3 class="kaartkop">Jouw rekentoets</h3>${toets}</div>
      <div class="kaart"><h3 class="kaartkop">Foutenbank</h3><p class="klein" style="margin:0 0 10px">${open?`${open} onderdelen staan nog open${zf?`, waarvan ${zf} "Zeker én fout"`:''}.`:'Je foutenbank is leeg. Netjes!'}</p><button class="knop zacht klein vol" onclick="go('fouten')">Bekijk foutenbank</button></div>
      <div class="kaart"><h3 class="kaartkop">Badges</h3><div class="badges">${BADGES.map(b=>`<span class="${S.badges.includes(b.id)?'':'nee'}" title="${esc(b.naam+': '+b.uit)}">${b.e}</span>`).join('')}</div></div>
    </aside></div></div>${VOET()}`;
},
domein(p){
  const d=DOM[p.dom]; const n=p.niv||S.niv; const subs=SUBDOMEINEN[p.dom]; const b=domB(n,p.dom);
  const todo=subs.map(s=>{ const lds=ldsVan(n,p.dom,s.id); if(!lds.length) return '';
    return `<div class="todo ${p.sub===s.id?'uit':''}"><h4>${esc(s.naam)} <span>${subB(n,p.dom,s.id)}%</span></h4>${lds.map(l=>{ const x=ldS(l.id); const fase=x.tr===0?'Nog niet gestart':x.b>=DREMPEL?'Beheerst':['','Fase 1 · voorbeeld','Fase 2 · invulsom','Fase 3 · zelf doen'][x.tr];
      return `<button class="todoitem" onclick="startOefen({modus:'ld',ld:'${l.id}',niv:${n}})"><span class="vink ${x.b>=DREMPEL?'ja':x.n?'half':''}">${x.b>=DREMPEL?'✓':''}</span><span><b>${esc(l.naam)}</b><small>${fase}${x.n?` · ${Math.round(x.b)}%`:''}</small></span>${S.fb[l.id]&&!S.fb[l.id].opgelost?'<em title="In je foutenbank">!</em>':''}</button>` }).join('')}</div>` }).join('');
  const nivKeuze=`<div class="nivkeuze">${NIVEAUS.map(x=>`<button class="${x.n===n?'aan':''}" ${x.n>S.niv?'disabled':''} onclick="go('domein',{dom:'${p.dom}',niv:${x.n}})">${x.n}</button>`).join('')}</div>`;
  return `<section class="foto paginakop" style="${foto(p.dom)};border-radius:0;min-height:230px"><div class="wrap" style="width:100%;padding-bottom:0"><button class="terug" onclick="go('home')">← Dashboard</button><span class="eyebrow" style="color:${d.k};display:block;margin-top:10px">Niveau ${n} · ${b}%</span><h1>${esc(d.naam)}</h1></div></section>
   <div class="wrap"><div class="domlayout">
    <div class="kaart wielkaart"><div class="wielkop"><h3 class="kaartkop">Jouw voortgang per onderdeel</h3>${nivKeuze}</div>${wielSvg(p.dom,n)}
      <div class="wiellegenda"><span><i style="background:${d.k}"></i>beheerst (80%+)</span><span><i style="background:${d.k};opacity:.62"></i>op weg (50%+)</span><span><i style="background:${d.k};opacity:.32"></i>gestart</span><span><i style="background:var(--ring-leeg)"></i>nog niet gestart</span></div>
      <p class="zacht klein mid">Binnen is Niveau 1, buiten Niveau 8. Tik op een vakje om dat onderdeel en niveau te bekijken.</p>
      <div class="voet" style="justify-content:center"><button class="knop" style="background:${d.k}" onclick="startOefen({modus:'domein',dom:'${p.dom}',niv:${n}})">Oefen ${esc(d.naam.toLowerCase())}${n!==S.niv?' (Niveau '+n+')':''}</button></div></div>
    <aside class="kaart todokaart"><h3 class="kaartkop">To do · Niveau ${n}</h3>${todo||'<p class="zacht">Geen onderdelen op dit niveau.</p>'}</aside>
   </div></div>${VOET()}`;
},
niveaus(){
  return `<section class="foto paginakop" style="${foto('niveaus')};border-radius:0;min-height:210px"><div class="wrap" style="width:100%;padding-bottom:0"><span class="eyebrow" style="color:var(--acc)">Jouw route</span><h1>Niveau 1 tot en met 8</h1></div></section>
   <div class="wrap"><div class="levels">${NIVEAUS.map(x=>{ const dicht=x.n>S.niv; const b=dicht?0:nivB(x.n); const dip=S.diplomas[x.n];
    return `<div class="levelkaart ${dicht?'dicht':''}"><div class="boven"><span>Niveau ${x.n} · ${esc(x.ref)}</span><span>${dip?'🎓':x.n===S.niv?'📍':dicht?'🔒':''}</span></div><h3>${esc(x.titel)}</h3><p>${esc(x.sub)}</p>
     ${dicht?'':`${DOMEINEN.map(d=>`<div class="minirij"><span>${d.kort}</span>${balk(domB(x.n,d.id),d.k)}<b>${domB(x.n,d.id)}%</b></div>`).join('')}`}
     <div class="onder">${dicht?'<span class="zacht">Haal eerst de toets van het niveau ervoor</span>':`<button class="knop zacht klein" onclick="startOefen({modus:'slim',niv:${x.n}})">Oefen dit niveau</button>`}${dip?`<span class="zacht">${dip.score}%</span>`:''}</div></div>` }).join('')}</div>
   <p class="zacht" style="margin-top:20px">Niveau 4 is het niveau van de rekentoets 2F. Niveau 8 is het 3F-eindniveau van het vwo.</p></div>${VOET()}`;
},
fouten(){
  const open=fbOpen().sort((a,b)=>(b[1].zf-a[1].zf)||(b[1].t-a[1].t));
  const opgelost=Object.entries(S.fb).filter(([k,f])=>f.opgelost&&LD[k]).length;
  return `<section class="foto paginakop" style="${foto('fouten')};border-radius:0;min-height:210px"><div class="wrap" style="width:100%;padding-bottom:0"><span class="eyebrow" style="color:var(--acc)">Foutenbank</span><h1>Fouten zijn er om van te leren</h1></div></section>
   <div class="wrap smal"><div class="kaart">
   <p>Elke fout komt hier terug, met andere getallen. Na <b>2 keer achter elkaar goed</b> is hij opgelost. Bij <b>Zeker én fout</b> (je dacht dat je het wist) moet het 3 keer goed. ${opgelost?`Je hebt al ${opgelost} fouten opgelost.`:''}</p>
   ${open.length?`<div class="voet" style="justify-content:flex-start"><button class="knop" onclick="startOefen({modus:'fouten'})">Herhaal nu (${Math.min(10,open.length)})</button></div>`:''}
   ${open.map(([k,f])=>{ const l=LD[k]; return `<div class="rij"><span class="fbicoon ${f.zf?'zf':''}">${f.zf?'!':'?'}</span><div style="flex:1"><b>${esc(l.naam)}</b><br><small class="zacht">Niveau ${l.niv} · ${DOM[l.dom].naam} · jouw antwoord: ${esc(f.gegeven||'–')} · goed: ${esc(f.juist||'–')} · ${f.rij||0}/${f.nodig} keer goed</small></div><button class="knop zacht klein" onclick="startOefen({modus:'ld',ld:'${k}',niv:${l.niv}})">Oefen</button></div>` }).join('')||'<p class="zacht">Er staan geen open fouten in je foutenbank.</p>'}
   </div></div>${VOET()}`;
},
account(){
  return `<div class="wrap smal"><h1>Account</h1><div class="kaart">
   <p><b>${esc(S.naam)}</b> · ${esc(S.klas)}</p>
   <p class="zacht" style="margin-bottom:2px">Leerling-ID</p><div class="code">${esc(S.id||'–')}</div>
   <p class="zacht" style="margin-bottom:2px">Herstelcode</p><div class="code">${esc(S.code||'–')}</div>
   <p>${syncLabel()}</p>
   <div class="voet" style="justify-content:flex-start"><button class="knop zacht" onclick="sync().then(()=>go('account'))">Nu opslaan</button><button class="knop zacht" onclick="go('instapIntro')">Instaptoets opnieuw</button><button class="knop zacht" onclick="document.body.classList.toggle('th-nacht');S.th=document.body.classList.contains('th-nacht')?'nacht':'';bewaar(false)">Donker thema</button><button class="knop rand" onclick="uitloggen()">Uitloggen</button></div></div></div>`;
},
quiz(){ return quizHtml() },
uitslag(p){ return p.html },
};

// ===================================================================
// Oefensessies, instaptoets en rekentoets (één quizscherm)
// ===================================================================
let SES=null;
function startOefen(ctx){
  ctx=Object.assign({niv:ctx.niv||S.niv},ctx);
  const titel = ctx.modus==='fouten'?'Herhaal je fouten': ctx.modus==='ld'?LD[ctx.ld].naam : ctx.modus==='sub'?subVan(ctx.dom,ctx.sub).naam : ctx.modus==='domein'?DOM[ctx.dom].naam : 'Slim oefenen';
  SES={soort:'oefen',ctx,titel,n:ctx.modus==='fouten'?Math.min(10,Math.max(1,fbOpen().length)):10,i:0,res:[],recent:[],start:{b:DOMEINEN.map(d=>domB(ctx.niv,d.id))}};
  volgendeItem();
}
function volgendeItem(){
  if(SES.i>=SES.n) return eindeSessie();
  let it;
  if(SES.soort==='oefen'){ it=volgende(Object.assign({},SES.ctx,{recent:SES.recent})); if(!it) return eindeSessie() }
  else if(SES.soort==='instap') it=SES.blok[SES.bi];
  else it=SES.items[SES.i];
  toonItem(it);
}
function toonItem(it){ Q={it,keuze:null,klaar:false,start:Date.now()}; oefenActief=true; go('quiz') }
function quizHtml(){
  const it=Q.it, ld=LD[it.ld], d=DOM[it.dom];
  const dots = SES.soort==='instap' ? '' : `<div class="voortgang">${Array.from({length:SES.n},(_,i)=>`<i class="${i<SES.res.length?(SES.res[i]?'g':'f'):i===SES.i?'nu':''}"></i>`).join('')}</div>`;
  const label = it.bron==='spiegel'?'Spiegelvraag · zelfde denkstap, andere getallen':it.bron==='herhaal'?'Uit je foutenbank':TREDE_LABEL[it.vorm];
  const fase = SES.soort==='oefen'&&it.bron!=='spiegel'&&it.bron!=='herhaal'?(it.trede===1?'Fase 1':it.trede===2?'Fase 2':'Fase 3'):'';
  const rm = it.rm?`<button class="rmknop" onclick="toonRekenmachine()" title="Rekenmachine">🧮 Rekenmachine</button>`:`<span class="rmknop dicht" title="Rekenmachine niet toegestaan">🧮 Uit het hoofd of op kladpapier</span>`;
  const knoppen = (it.vorm==='faded1'||it.vorm==='v3') ? `<button class="knop" id="kCheck" onclick="indienen(null)">Controleer</button>`
     : `<button class="knop zekerknop" onclick="indienen(true)" title="Ik weet het zeker"><b>!</b> Zeker</button><button class="knop gokknop" onclick="indienen(false)" title="Ik gok"><b>?</b> Gok</button>`;
  return `<div class="wrap" id="qz"><div class="top"><button class="terug" onclick="stopSessie()">← Stoppen</button><h1>${esc(SES.titel)}</h1>${SES.soort==='instap'?`<span class="chip">Niveau ${it.niv}</span>`:''}${SES.soort==='toets'?`<span class="chip">Vraag ${SES.i+1} van ${SES.n}</span>`:''}</div>${dots}
   <div class="kaart" style="--k:${d.k}"><div class="qkop"><span class="eyebrow" style="color:${d.k}">${esc(d.naam)} · ${esc(subVan(it.dom,it.sub).naam)}</span><span class="zacht klein">${esc(label)}${fase?' · '+fase:''}</span>${rm}</div>
   <div id="qbody">${itemHtml(it)}</div>
   <div id="qfb"></div>
   <div class="voet" id="qknoppen">${knoppen}</div></div></div><div id="rekenmachine" hidden></div>`;
}
function naRender(){
  const a=$('#antw'); if(a&&!('ontouchstart' in window)) a.focus();
  $$('#qbody input').forEach(x=>x.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); indienen(true) } }));
  if(Q.it.vorm==='v3') $('#kCheck').textContent='Verder';
}
function stopSessie(){
  if(SES&&SES.soort==='toets'&&!confirm('Wil je stoppen met de toets? Je antwoorden tellen dan niet.')) return;
  if(SES&&SES.soort==='instap'&&!confirm('Wil je stoppen met de instaptoets? Je kunt hem later opnieuw starten.')) return;
  bewaar(); go(S.niv?'home':'instapIntro');
}

function indienen(zeker){
  if(!Q||Q.klaar) return;
  const it=Q.it;
  if(it.vorm==='v3') return v3Stap();
  if(!heeftAntwoord()){ melding('Vul eerst je antwoord in.'); return }
  Q.klaar=true; const res=nakijk(); res.zeker=zeker; Q.res=res;
  $$('#qbody input,#qbody select,#qbody textarea').forEach(x=>x.disabled=true);
  if(it.vorm==='sab'&&res.goed) S.sabGoed=(S.sabGoed||0)+1;
  if(SES.soort==='instap') return instapAntwoord(res);
  if(SES.soort==='toets'){ SES.res.push(res.goed); SES.antw.push({it,res}); SES.i++; return volgendeItem() }
  // oefenen: verwerken + feedback
  verwerk(it,res);
  if(it.bron!=='spiegel'){ SES.res.push(res.goed); SES.recent.push(it.ld) }
  toonFeedback(it,res);
}
function toonFeedback(it,res){
  const fb=$('#qfb'), kn=$('#qknoppen');
  if(res.goed){
    const extra = it.bron==='spiegel'?'Het kwartje is gevallen. 👍': it.vorm==='faded1'?'Precies. Nu ga je het zelf proberen.': res.zeker===false?'Goed! Je gokte, maar het klopte. Volgende keer durf je vast "Zeker".':'Goed!';
    fb.innerHTML=`<div class="fb goed"><b>${extra}</b>${res.fb&&it.vorm==='sab'?`<p>${res.fb}</p>`:''}${uitwerkingHtml(it)?`<details><summary>Bekijk de uitwerking</summary>${uitwerkingHtml(it)}</details>`:''}</div>`;
    kn.innerHTML=`<button class="knop" onclick="naVraag()">Volgende →</button>`;
  } else {
    const zf=res.zeker===true?`<p class="zf">Je was zeker, maar het was fout. Juist deze vraag komt extra vaak terug.</p>`:'';
    fb.innerHTML=`<div class="fb fout"><b>Nog niet goed.</b>${res.fb?`<p>${res.fb}</p>`:''}${it.vorm!=='sab'&&it.vorm!=='faded1'?`<p>Het goede antwoord is <b>${esc(res.juist)}</b>.</p>`:''}${zf}</div>
      <div class="anders"><span class="eyebrow" style="color:var(--knop)">Andere uitleg</span>${andersHtml(it)}${uitwerkingHtml(it)?`<details ${it.vorm==='faded1'?'':'open'}><summary>Uitwerking stap voor stap</summary>${uitwerkingHtml(it)}</details>`:''}</div>`;
    const spiegel = it.bron!=='spiegel' && it.vorm!=='faded1';
    kn.innerHTML = spiegel?`<button class="knop" onclick="naarSpiegel()">Probeer een spiegelvraag →</button>`:`<button class="knop" onclick="naVraag()">Volgende →</button>`;
    if(it.bron==='spiegel') fb.insertAdjacentHTML('beforeend','<p class="zacht klein">Geen zorgen: je oefent dit onderdeel straks nog eens met tussenstappen.</p>');
  }
  fb.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function naarSpiegel(){ const vorig=Q.it; const sp=spiegelVan(vorig); Q={it:sp,keuze:null,klaar:false,vorigeFout:vorig.key}; go('quiz') }
function naVraag(){
  SES.i=SES.res.length;
  if(checkNiveauOmlaag()){ S.omlaagMelding=true; bewaar(); melding('We gaan een niveau terug om de basis sterker te maken.',5000); return go('home') }
  volgendeItem();
}
function eindeSessie(){
  oefenActief=false; const g=SES.res.filter(x=>x).length, n=SES.res.length; const niv=SES.ctx.niv;
  const nu=DOMEINEN.map(d=>domB(niv,d.id));
  const rijen=DOMEINEN.map((d,i)=>{ const v=SES.start.b[i], w=nu[i]; return w!==v?`<div class="minirij"><span>${d.kort}</span>${balk(w,d.k)}<b>${w}%</b><small class="${w>v?'plus':'min'}">${w>v?'+':''}${w-v}</small></div>`:'' }).join('');
  const open=toetsOpen(S.niv);
  go('uitslag',{html:`<div class="wrap smal"><div class="kaart mid"><div class="groot">${g/n>=.8?'🚀':g/n>=.5?'💪':'🧠'}</div><h2 style="margin-top:0">${g} van de ${n} goed</h2>
    <p class="zacht">${g/n>=.8?'Sterk gewerkt!':g/n>=.5?'Goed bezig. De fouten komen later terug in je foutenbank.':'Lastige ronde. Juist hiervan leer je het meest: je fouten komen terug met uitleg.'}</p>
    ${rijen?`<div style="text-align:left;margin:18px 0">${rijen}</div>`:''}
    ${open?`<div class="kaart melden"><b>Alle domeinen staan op 80% of meer.</b> Je mag de rekentoets van Niveau ${S.niv} maken.</div>`:''}
    <div class="voet" style="justify-content:center"><button class="knop zacht" onclick="go('home')">Naar dashboard</button>${open?`<button class="knop" onclick="go('toetsIntro',{niv:${S.niv}})">Naar de rekentoets</button>`:`<button class="knop" onclick="startOefen(SES.ctx)">Nog een ronde</button>`}</div></div></div>`});
}

// ---------- drie antwoorden vergelijken ----------
function v3Stap(){
  const it=Q.it; Q.v3fase=(Q.v3fase||0)+1;
  if(Q.v3fase===1){
    if(($('#eigen').value||'').trim().length<5){ Q.v3fase=0; melding('Schrijf eerst kort je eigen aanpak op.'); return }
    $('#eigen').disabled=true; const a=[it.v3.goed,it.v3.bijna,it.v3.fout];
    $('#v3deel2').hidden=false; $('#v3deel2').innerHTML=`<label class="label">Stap 2 · Beoordeel deze drie antwoorden</label>${it.v3volg.map((k,j)=>`<div class="v3ant"><p>${a[k]}</p><div class="segment" data-j="${j}">${['Goed','Bijna goed','Fout'].map((t,x)=>`<button onclick="kiesV3(${j},${x})" data-x="${x}">${t}</button>`).join('')}</div></div>`).join('')}`;
    $('#kCheck').textContent='Controleer'; return;
  }
  if(Q.v3fase===2){
    Q.v3k=Q.v3k||{}; if(Object.keys(Q.v3k).length<3){ Q.v3fase=1; melding('Beoordeel alle drie de antwoorden.'); return }
    const goed=it.v3volg.every((k,j)=>Q.v3k[j]===k);
    $$('.segment').forEach(s=>{ const j=+s.dataset.j; $$('button',s).forEach(b=>{ const x=+b.dataset.x; if(x===it.v3volg[j]) b.classList.add('goed'); else if(x===Q.v3k[j]) b.classList.add('fout'); b.disabled=true }) });
    Q.v3goed=goed;
    $('#qfb').innerHTML=`<div class="fb ${goed?'goed':'fout'}"><b>${goed?'Je hebt alle drie goed beoordeeld.':'Niet alle beoordelingen kloppen. Kijk naar de groene vakjes.'}</b><p><b>Kijkwijzer</b></p><ul>${it.v3.kijkwijzer.map(k=>`<li>${k}</li>`).join('')}</ul></div>
      <label class="label">Stap 3 · Vergelijk met jouw aanpak. Hoe was die?</label><div class="segment" id="zelf">${['Goed','Bijna goed','Nog niet goed'].map((t,x)=>`<button onclick="Q.zelf=${x};$$('#zelf button').forEach((b,i)=>b.classList.toggle('kies',i===${x}))">${t}</button>`).join('')}</div>`;
    $('#kCheck').textContent='Afronden'; return;
  }
  if(Q.zelf==null){ Q.v3fase=2; melding('Kies hoe jouw eigen aanpak was.'); return }
  Q.klaar=true; const res={goed:Q.v3goed,zeker:null,gegeven:'Eigen aanpak: '+['goed','bijna','nog niet'][Q.zelf]+' · '+($('#eigen').value||'').slice(0,120),juist:'',mis:''};
  if(SES.soort==='toets'){ SES.res.push(res.goed); SES.antw.push({it,res}); SES.i++; return volgendeItem() }
  verwerk(it,res); SES.res.push(res.goed); SES.recent.push(it.ld);
  $('#qknoppen').innerHTML=`<button class="knop" onclick="naVraag()">Volgende →</button>`;
}
function kiesV3(j,x){ Q.v3k=Q.v3k||{}; Q.v3k[j]=x; $$(`.segment[data-j="${j}"] button`).forEach(b=>b.classList.toggle('kies',+b.dataset.x===x)) }

// ---------- opstart ----------
function start(){
  laad();
  if(S&&S.th==='nacht') document.body.classList.add('th-nacht');
  if(location.hash==='#docent') return go('docentLogin');
  if(!S||!S.naam) return go('welkom');
  if(!S.niv) return go('instapIntro');
  go('home'); planSync(1500);
}
