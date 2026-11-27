// ===== Instaptoets (plaatsing) en formatieve rekentoets per niveau =====
const VAST = it => { const l=LD[it.ld]; return l.opties?'mc':(l.antw?(Math.random()<.65?'open':(l.fouten?'mc':'open')):null) };

const nivMax=()=>Math.max(...LDS.map(l=>l.niv));
// ---------- instaptoets: blokken van 4 (één per domein), trapsgewijs omhoog of omlaag ----------
function instapBlok(k){
  return DOMEINEN.map(d=>{ const l=ldsVan(k,d.id); const ld=l[Math.floor(Math.random()*l.length)]; const it=maakItem(ld.id,{trede:3,bron:'instap'}); if(!['open','mc'].includes(it.vorm)) return maakItem(ld.id,{trede:3,vorm:VAST(it),bron:'instap'}); return it });
}
// Per vraag adaptief (trap): start op het niveau van de klas. Fout → volgende vraag één niveau lager.
// Twee keer achter elkaar goed op hetzelfde niveau → één niveau hoger. Zo komt de leerling uit op het
// niveau waar hij ongeveer 70% goed heeft. Domeinen wisselen elke vraag (G, V, M, B), 16 vragen.
const INSTAP_N = 16;
function instapVraag(){
  const d=DOMEINEN[SES.log.length%4].id; let l=ldsVan(SES.k,d).filter(x=>!SES.gebruikt.includes(x.id)); if(!l.length) l=ldsVan(SES.k,d);
  const ld=l[Math.floor(Math.random()*l.length)]; SES.gebruikt.push(ld.id);
  let it=maakItem(ld.id,{trede:3,bron:'instap'}); if(!['open','mc'].includes(it.vorm)) it=maakItem(ld.id,{trede:3,vorm:VAST(it),bron:'instap'});
  SES.blok=[it]; SES.bi=0;
}
function startInstap(){
  const k=Math.min(STARTNIVEAU_KLAS[S.klas]||1,nivMax());
  SES={soort:'instap',titel:'Instaptoets',k,startK:k,reeks:0,gebruikt:[],log:[],res:[],i:0,n:INSTAP_N,start:Date.now()};
  instapVraag(); volgendeItem();
}
function instapNiveau(log){
  const st={}; log.forEach(x=>{ st[x.niv]=st[x.niv]||[0,0]; st[x.niv][1]++; if(x.goed) st[x.niv][0]++ });
  const ok=Object.keys(st).map(Number).filter(n=>st[n][1]>=2&&st[n][0]/st[n][1]>=.6);
  if(ok.length) return Math.max(...ok);
  const laagste=Math.min(...log.map(x=>x.niv)); return Math.max(1,laagste-1);
}
function instapAntwoord(res){
  const it=Q.it; SES.log.push({niv:it.niv,dom:it.dom,ld:it.ld,goed:res.goed,zeker:res.zeker}); SES.res.push(res.goed); SES.i++;
  if(res.goed){ SES.reeks++; if(SES.reeks>=2&&SES.k<nivMax()){ SES.k++; SES.reeks=0 } }
  else { SES.reeks=0; if(SES.k>1) SES.k--; }
  if(SES.log.length>=INSTAP_N) return instapKlaar(instapNiveau(SES.log));
  instapVraag(); volgendeItem();
}
function instapKlaar(niv){
  oefenActief=false;
  // goed beantwoorde leerdoelen hoeven niet met het uitgewerkte voorbeeld te beginnen
  SES.log.forEach(x=>{ const s=ldS(x.ld); if(x.goed&&s.tr===0) S.ld[x.ld]=Object.assign({},s,{b:Math.max(s.b,x.zeker===false?20:35),n:1,tr:x.zeker===false?2:3,l:Date.now(),u:Date.now()}) });
  const vorige=S.niv;
  S.niv=niv; S.max=Math.max(S.max||0,niv); S.rec=[]; S.recNiv=niv;
  S.plaatsing={niv,tijd:Date.now(),vragen:SES.log.length,goed:SES.log.filter(x=>x.goed).length};
  DOMEINEN.forEach(d=>werkDomBij(niv,d.id));
  const perNiv={}; SES.log.forEach(x=>{ perNiv[x.niv]=perNiv[x.niv]||[0,0]; perNiv[x.niv][1]++; if(x.goed) perNiv[x.niv][0]++ });
  const perDom={}; DOMEINEN.forEach(d=>{ const l=SES.log.filter(x=>x.dom===d.id); perDom[d.id]=l.length?Math.round(100*l.filter(x=>x.goed).length/l.length):'' });
  event({t:'toets',soort:'Instaptoets',niveau:niv,poging:1,totaal:Math.round(100*S.plaatsing.goed/S.plaatsing.vragen),perDomein:perDom,geslaagd:true,duurMin:Math.round((Date.now()-SES.start)/60000)});
  badgesBijwerken(); bewaar();
  const N=NIVEAUS[niv-1];
  go('uitslag',{html:`<div class="wrap smal"><div class="kaart mid"><span class="eyebrow" style="color:var(--knop)">Uitslag instaptoets</span><div class="nivbadge">${niv}</div>
   <h2 style="margin:6px 0">Je start op Niveau ${niv}</h2><p class="zacht">${esc(N.titel)} · ${esc(N.ref)}</p>
   <p>Je maakte ${S.plaatsing.vragen} opgaven en had er ${S.plaatsing.goed} goed. ${vorige&&vorige!==niv?`Je stond eerst op Niveau ${vorige}.`:''}</p>
   <div style="text-align:left;margin:16px auto;max-width:380px">${Object.keys(perNiv).sort().map(n=>`<div class="minirij"><span>Niveau ${n}</span>${balk(100*perNiv[n][0]/perNiv[n][1])}<b>${perNiv[n][0]}/${perNiv[n][1]}</b></div>`).join('')}</div>
   <p>Vanaf nu oefen je op jouw niveau. Elk onderdeel begint met een uitgelegd voorbeeld, daarna doe je het steeds meer zelf. Staan alle vier domeinen op 80%, dan maak je de rekentoets en ga je naar het volgende niveau.</p>
   <div class="voet" style="justify-content:center"><button class="knop groot" onclick="go('home')">Naar mijn dashboard</button></div></div></div>`});
}

// ---------- rekentoets ----------
function toetsHerkDoms(n){ // domeinen die na een niet-gehaalde toets nog moeten
  const laatste=[...S.toetsen].reverse().find(t=>t.niveau===n&&t.soort==='Rekentoets'); if(!laatste||laatste.geslaagd) return null;
  return laatste.terug&&laatste.terug.length?laatste.terug:null;
}
SCHERMEN.toetsIntro=function(p){
  const n=p.niv, herk=toetsHerkDoms(n); const doms=herk||DOMEINEN.map(d=>d.id); const per=herk?8:6;
  return `<section class="foto paginakop" style="${foto('toets')};border-radius:0;min-height:240px"><div class="wrap" style="width:100%;padding-bottom:0"><button class="terug" onclick="go('home')">← Dashboard</button><span class="eyebrow" style="color:var(--acc);display:block;margin-top:10px">Formatieve rekentoets</span><h1>${herk?'Herkansing ':''}Niveau ${n}</h1></div></section>
   <div class="wrap smal"><div class="kaart">
   <p>${herk?`Je maakt alleen opgaven uit de domeinen die de vorige keer onder 80% bleven: <b>${doms.map(d=>DOM[d].naam).join(', ')}</b>.`:'Een gemengde toets over alle vier domeinen, met open en gesloten vragen en minstens één Saboteur.'}</p>
   <ul class="lijst"><li>${doms.length*per} opgaven. Je krijgt pas na de toets te zien wat goed en fout was.</li><li>Gehaald als elk domein én het totaal op 80% of hoger staat.${n<8?` Dan ga je door naar Niveau ${n+1}.`:''}</li><li>Rekenmachine alleen bij opgaven met 🧮. Pak kladpapier.</li></ul>
   <div class="voet"><button class="knop groot" onclick="startToets(${n})">Start de toets</button></div></div></div>`;
};
function startToets(n){
  const herk=toetsHerkDoms(n); const doms=herk||DOMEINEN.map(d=>d.id); const per=herk?8:6; const items=[];
  doms.forEach(d=>{ const lds=shuffle(ldsVan(n,d)); for(let i=0;i<per;i++){ const ld=lds[i%lds.length]; let it=maakItem(ld.id,{trede:3,bron:'toets'}); if(it.vorm==='volgorde'||it.vorm==='v3') it=maakItem(ld.id,{trede:3,vorm:VAST(it),bron:'toets'}); items.push(it) } });
  // minstens 3 contextopgaven in rekentoetsstijl (als het niveau ze heeft)
  const ctxLds=shuffle(LDS.filter(l=>l.niv===n&&l.ctx&&doms.includes(l.dom)));
  for(const ld of ctxLds){ if(items.filter(x=>LD[x.ld].ctx).length>=3) break; if(items.some(x=>x.ld===ld.id)) continue; const j=items.findIndex(x=>x.dom===ld.dom&&!LD[x.ld].ctx); if(j>=0){ let it=maakItem(ld.id,{trede:3,bron:'toets'}); if(!['open','mc'].includes(it.vorm)) it=maakItem(ld.id,{trede:3,vorm:VAST(it),bron:'toets'}); items[j]=it } }
  if(!items.some(x=>x.vorm==='sab')){ const kan=items.map((x,i)=>i).filter(i=>LD[items[i].ld].sab); if(kan.length){ const i=kan[Math.floor(Math.random()*kan.length)]; items[i]=maakItem(items[i].ld,{trede:3,vorm:'sab',bron:'toets'}) } }
  SES={soort:'toets',titel:'Rekentoets Niveau '+n,niv:n,herk,items:shuffle(items),antw:[],res:[],i:0,n:items.length,start:Date.now()};
  volgendeItem();
}
function eindeToets(){
  oefenActief=false; const n=SES.niv; const per={}; const doms=SES.herk||DOMEINEN.map(d=>d.id);
  doms.forEach(d=>{ const l=SES.antw.filter(a=>a.it.dom===d); per[d]=Math.round(100*l.filter(a=>a.res.goed).length/Math.max(1,l.length)) });
  const totaal=Math.round(100*SES.antw.filter(a=>a.res.goed).length/SES.antw.length);
  const terug=doms.filter(d=>per[d]<DREMPEL); const geslaagd=!terug.length&&totaal>=DREMPEL;
  const poging=S.toetsen.filter(t=>t.niveau===n&&t.soort==='Rekentoets').length+1;
  const t={eid:eid(),tijd:Date.now(),soort:'Rekentoets',niveau:n,poging,totaal,perDomein:per,geslaagd,terug:geslaagd?[]:(terug.length?terug:doms),duurMin:Math.round((Date.now()-SES.start)/60000)};
  S.toetsen=S.toetsen.concat([t]);
  // foute toetsvragen gaan de foutenbank in; ook de leerdoelen worden bijgewerkt
  SES.antw.forEach(a=>verwerkStil(a.it,a.res));
  if(geslaagd){
    S.diplomas[n]={tijd:Date.now(),score:totaal,poging};
    doms.forEach(d=>{ const k=domKey(n,d); S.dom[k]=Object.assign({},S.dom[k]||{},{herk:false,st:'beheerst',u:Date.now()}) });
    if(S.niv===n&&n<8){ S.niv=n+1; S.max=Math.max(S.max||0,n+1); S.rec=[]; S.recNiv=n+1 }
  } else {
    t.terug.forEach(d=>{ ldsVan(n,d).forEach(l=>{ const x=ldS(l.id); if(x.b>75) S.ld[l.id]=Object.assign({},x,{b:75,u:Date.now()}) }); const k=domKey(n,d); S.dom[k]=Object.assign({},S.dom[k]||{},{herk:true,u:Date.now()}); werkDomBij(n,d) });
  }
  event(Object.assign({t:'toets'},t));
  badgesBijwerken(); bewaar();
  SES.uitslag=t; toonToetsUitslag();
}
function verwerkStil(it,res){ // toetsvraag: beheersing en foutenbank bijwerken zonder feedbackscherm
  const x=Object.assign({},ldS(it.ld)); x.b=rondaf(x.b+(res.goed?.15:.25)*((res.goed?100:0)-x.b),1); x.n++; x.u=Date.now(); if(x.tr===0) x.tr=res.goed?3:1; S.ld[it.ld]=x;
  if(!res.goed){ foutenbank(it,res); event({t:'fout',niveau:it.niv,domein:it.dom,leerdoel:it.ld,opgave:it.key,type:'Toets: '+(TREDE_LABEL[it.vorm]||it.vorm),trede:3,gegeven:res.gegeven,juist:res.juist,zeker:res.zeker}) }
  S.aantal=(S.aantal||0)+1; if(res.goed) S.goed=(S.goed||0)+1;
}
function toonToetsUitslag(){
  const t=SES.uitslag, n=t.niveau; const fout=SES.antw.filter(a=>!a.res.goed).length;
  go('uitslag',{html:`<div class="wrap smal"><div class="kaart mid"><span class="eyebrow" style="color:var(--knop)">Rekentoets Niveau ${n}</span>
   <div class="cijfer ${t.geslaagd?'vold':''}">${t.totaal}%</div>
   <h2>${t.geslaagd?(n<8?`Gehaald! Je gaat door naar Niveau ${n+1}.`:'Gehaald! Je hebt het 3F-eindniveau bereikt.'):'Nog niet gehaald'}</h2>
   <div style="text-align:left;margin:16px auto;max-width:420px">${Object.keys(t.perDomein).map(d=>`<div class="minirij"><span>${DOM[d].kort}</span>${balk(t.perDomein[d],DOM[d].k)}<b>${t.perDomein[d]}%</b></div>`).join('')}</div>
   ${t.geslaagd?'':`<p>Je gaat terug naar <b>${t.terug.map(d=>DOM[d].naam).join(', ')}</b>. Staat dat weer op 80%, dan maak je een herkansing met alleen die domeinen.</p>`}
   ${fout?`<p>Je had ${fout} vragen fout. Bekijk ze nu: per vraag zie je de uitwerking en kies je zelf wat er misging.</p>`:''}
   <div class="voet" style="justify-content:center">${fout?`<button class="knop" onclick="SES.ri=0;toonReview()">Bekijk je fouten</button>`:`<button class="knop" onclick="go('home')">Naar dashboard</button>`}</div></div></div>`});
}
// na de toets: per foute vraag de uitwerking, zelf het fouttype kiezen, daarna 2 spiegelopgaven uit het zwakste onderdeel
function toonReview(){
  const fout=SES.antw.filter(a=>!a.res.goed); const a=fout[SES.ri]; if(!a) return naReview();
  const it=a.it; const d=DOM[it.dom];
  go('uitslag',{html:`<div class="wrap" id="qz"><div class="top"><h1>Fout ${SES.ri+1} van ${fout.length}</h1></div><div class="kaart" style="--k:${d.k}">
   <span class="eyebrow" style="color:${d.k}">${esc(d.naam)} · ${esc(LD[it.ld].naam)}</span>
   <div class="vraag">${it.vorm==='sab'?it.sab.intro:it.vorm==='koppel'?it.kvraag:it.vraag}</div>${it.fig?`<div class="figuur">${it.fig}</div>`:''}
   <div class="fb fout"><p>Jouw antwoord: <b>${esc(a.res.gegeven)}</b>${a.res.zeker===true?' (zeker)':a.res.zeker===false?' (gok)':''}</p>${a.res.juist?`<p>Goed antwoord: <b>${esc(a.res.juist)}</b></p>`:''}${a.res.fb?`<p>${a.res.fb}</p>`:''}</div>
   <div class="anders"><span class="eyebrow" style="color:var(--knop)">Uitwerking (kijkwijzer)</span>${uitwerkingHtml(it)||andersHtml(it)}</div>
   <label class="label">Wat ging er mis? Kies zelf.</label><div class="segment breed">${['Rekenfout','Begripsfout','Leesfout','Te snel gewerkt'].map(f=>`<button onclick="kiesFouttype('${f}')">${f}</button>`).join('')}</div></div></div>`});
}
function kiesFouttype(f){
  const fout=SES.antw.filter(a=>!a.res.goed); const a=fout[SES.ri]; a.fouttype=f;
  event({t:'fout',eid:a.it.key+'-ft',niveau:a.it.niv,domein:a.it.dom,leerdoel:a.it.ld,opgave:a.it.key,type:'Fouttypering na toets',trede:3,gegeven:a.res.gegeven,juist:a.res.juist,zeker:a.res.zeker,fouttype:f});
  SES.ri++; toonReview();
}
function naReview(){
  // zwakste onderdeel: domein met laagste toetsscore, daarbinnen leerdoel met laagste beheersing
  const t=SES.uitslag; const d=Object.keys(t.perDomein).sort((a,b)=>t.perDomein[a]-t.perDomein[b])[0];
  const ld=ldsVan(t.niveau,d).sort((a,b)=>ldS(a.id).b-ldS(b.id).b)[0];
  const ctx={modus:'ld',ld:ld.id,niv:t.niveau};
  SES={soort:'oefen',ctx,titel:'Gericht oefenen: '+ld.naam,n:2,i:0,res:[],recent:[],start:{b:DOMEINEN.map(x=>domB(t.niveau,x.id))}};
  melding('Nu 2 gerichte opgaven uit je zwakste onderdeel.');
  toonItem(maakItem(ld.id,{trede:3,vorm:LD[ld.id].opties?'mc':'open',bron:'oefen'}));
}
// toets: na de laatste vraag naar de uitslag
const _volgendeItem=volgendeItem;
volgendeItem=function(){ if(SES&&SES.soort==='toets'&&SES.i>=SES.n) return eindeToets(); return _volgendeItem() };
