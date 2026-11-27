// ===== Adaptieve engine: beheersing, treden, foutenbank (spaced repetition), vraagkeuze en niveau omhoog/omlaag =====
const GEWICHT = { t3zg:.30, t3zf:.40, t3gg:.20, t3gf:.30, t2g:.15, t2f:.15, t1g:.05, t1f:.08, spg:.15, spf:.25 };
const ldS = id => S.ld[id] || {b:0,n:0,tr:0,rij:0,frij:0,l:0,u:0};
const domKey = (n,d) => n+'.'+d;

// beheersing van een domein op een niveau = gemiddelde van de leerdoelen (niet geoefend = 0)
function domB(n,d){ const l=ldsVan(n,d); if(!l.length) return 0; return Math.round(l.reduce((s,x)=>s+ldS(x.id).b,0)/l.length) }
function subB(n,d,sub){ const l=ldsVan(n,d,sub); if(!l.length) return null; return Math.round(l.reduce((s,x)=>s+ldS(x.id).b,0)/l.length) }
function nivB(n){ return Math.round(DOMEINEN.reduce((s,d)=>s+domB(n,d.id),0)/4) }
const medaille = b => [...MEDAILLES].reverse().find(m=>b>=m.min)||null;
function domStatus(n,d){
  if(S.diplomas[n]) return 'beheerst';
  const b=domB(n,d); const x=S.dom[domKey(n,d)]||{};
  if(x.herk&&b<DREMPEL) return 'herkansing';
  return b>=DREMPEL?'check':'oefenen';
}
const toetsOpen = n => DOMEINEN.every(d=>domB(n,d.id)>=DREMPEL) && !S.diplomas[n] && (!S.klasinst||S.klasinst.toetsVrij!==false);
// aandachtspunten: zwakste onderdelen van een domein op het huidige niveau
function aandachtspunten(n,d,max=3){
  return (SUBDOMEINEN[d]||[]).map(s=>({s,b:subB(n,d,s.id)})).filter(x=>x.b!==null&&x.b<DREMPEL).sort((a,b)=>a.b-b.b).slice(0,max);
}

// ---------- verwerken van een antwoord ----------
// res: {goed, zeker(bool|null), gegeven, juist, mis, fouttype}
function verwerk(it,res){
  const ld=LD[it.ld]; const x=Object.assign({},ldS(it.ld)); const nu=Date.now();
  const zelfstandig = it.trede===3 && it.bron!=='instap-oefen';
  // 1. beheersing
  let w;
  if(it.bron==='spiegel') w=res.goed?GEWICHT.spg:GEWICHT.spf;
  else if(it.trede===1) w=res.goed?GEWICHT.t1g:GEWICHT.t1f;
  else if(it.trede===2) w=res.goed?GEWICHT.t2g:GEWICHT.t2f;
  else if(res.zeker===false) w=res.goed?GEWICHT.t3gg:GEWICHT.t3gf;
  else w=res.goed?GEWICHT.t3zg:GEWICHT.t3zf;
  if(it.trede===1&&!res.goed) w=0;                 // checkvraag fout: geen straf, wel extra uitleg
  x.b = rondaf(x.b + w*((res.goed?100:0)-x.b),1);
  if(zelfstandig||it.bron==='spiegel') x.n++;
  // itemanalyse: eerste zelfstandige pogingen (geen herhaling/spiegel) → p-waarde per leerdoel voor de docent
  if(it.trede===3&&!['spiegel','herhaal','instap','onderhoud'].includes(it.bron)){ x.p3=(x.p3||0)+1; if(res.goed) x.g3=(x.g3||0)+1; else if(res.zeker===true) x.zf3=(x.zf3||0)+1 }
  // 2. treden (faded examples)
  if(it.bron==='spiegel'){ if(!res.goed) x.tr=Math.min(x.tr||3,2) }
  else if(x.tr===0){ x.tr = res.goed ? (res.zeker!==false?3:2) : 1 }      // instapvraag van een nieuw leerdoel
  else if(it.trede===1){ x.tr=2 }
  else if(it.trede===2){ if(res.goed){ x.tr=3; x.frij=0 } else { x.frij=(x.frij||0)+1; if(x.frij>=2){ x.tr=1; x.frij=0 } } }
  else { if(res.goed){ x.rij=(x.rij||0)+1; x.frij=0 } else { x.rij=0; x.frij=(x.frij||0)+1; if(x.frij>=2){ x.tr=2; x.frij=0 } } }
  onderhoudBij(it,res,x);
  x.l=nu; x.u=nu; S.ld[it.ld]=x;
  // 3. foutenbank
  if(it.trede===3||it.bron==='spiegel') foutenbank(it,res);
  // 4. tellers, recente resultaten (voor niveau omlaag), domeinstatus
  S.aantal=(S.aantal||0)+1; if(res.goed) S.goed=(S.goed||0)+1;
  if(it.niv===S.niv&&it.trede===3&&it.bron!=='spiegel'){ if(S.recNiv!==S.niv){S.rec=[];S.recNiv=S.niv} S.rec=S.rec.concat([res.goed?1:0]).slice(-24) }
  werkDomBij(it.niv,it.dom);
  // 5. log voor de Sheet
  if(!res.goed&&it.trede!==1) event({t:'fout',niveau:it.niv,domein:it.dom,leerdoel:it.ld,opgave:it.key,type:TREDE_LABEL[it.vorm]||it.vorm,trede:it.trede,
    gegeven:res.gegeven,juist:res.juist,zeker:res.zeker,fouttype:res.fouttype||(res.mis?'Misconceptie: '+res.mis:''),rekenmachine:!!it.rmGebruikt,misc:misTag(res.fb)});
  if(it.bron==='spiegel'&&Q&&Q.vorigeFout) event({t:'fout',eid:Q.vorigeFout+'-sp',niveau:it.niv,domein:it.dom,leerdoel:it.ld,opgave:it.key,type:'Spiegelvraag',trede:3,gegeven:res.gegeven,juist:res.juist,zeker:res.zeker,spiegelGoed:res.goed});
  badgesBijwerken();
  bewaar();
}
function werkDomBij(n,d){
  const k=domKey(n,d); const oud=S.dom[k]||{}; const b=domB(n,d);
  const nieuw=Object.assign({},oud,{b,n:(oud.n||0)+1,l:Date.now(),u:Date.now()});
  if(oud.herk&&b>=DREMPEL) nieuw.herk=false;
  nieuw.st=domStatus(n,d); S.dom[k]=nieuw;
}

// ---------- foutenbank ----------
// één item per leerdoel; komt terug in dezelfde sessie (na 6-10 vragen) en daarna na 1 en 3 dagen.
// opgelost na 2 keer achter elkaar zelfstandig goed (3 keer bij "Zeker én fout").
function foutenbank(it,res){
  const k=it.ld; const f=S.fb[k]; const nu=Date.now();
  if(it.bron==='herhaal'&&f&&!f.opgelost){
    const g=Object.assign({},f,{u:nu});
    if(res.goed){ g.rij=(g.rij||0)+1; if(g.rij>=g.nodig){ g.opgelost=true; g.opgelostOp=nu } else { g.dueN=1e12; g.dueT=nu+[1,1,3][g.rij]*864e5 } }
    else { g.rij=0; g.dueN=S.aantal+6; g.dueT=0; if(res.zeker!==false){ g.zf=true; g.nodig=3 } g.gegeven=res.gegeven; g.juist=res.juist; g.keer=(g.keer||1)+1 }
    S.fb[k]=g; return;
  }
  if(res.goed||it.bron==='spiegel') return;
  const zf=res.zeker!==false;
  const basis=f&&!f.opgelost?f:{keer:0,t0:nu};
  S.fb[k]=Object.assign({},basis,{ld:it.ld,niv:it.niv,dom:it.dom,sub:it.sub,vorm:it.vorm,gegeven:res.gegeven,juist:res.juist,zeker:res.zeker,
    zf:!!(basis.zf||zf), nodig:(basis.zf||zf)?3:2, rij:0, keer:(basis.keer||0)+1, dueN:S.aantal+6+Math.floor(Math.random()*5), dueT:0, opgelost:false, t:nu, u:nu});
}
const fbOpen = () => Object.entries(S.fb).filter(([k,f])=>!f.opgelost&&LD[k]);
const fbDue = () => fbOpen().filter(([k,f])=>(f.dueN<=S.aantal)||(f.dueT&&f.dueT<=Date.now()));

// ---------- welke vraag komt nu? ----------
// ctx: {modus:'slim'|'domein'|'sub'|'ld'|'fouten', niv, dom, sub, ld, recent:[ldIds]}
function volgende(ctx){
  const niv=ctx.niv||S.niv; const recent=ctx.recent||[];
  const inScope = id => { const l=LD[id]; if(!l) return false;
    if(ctx.modus==='fouten'||ctx.modus==='herhaal') return true;
    if(ctx.modus==='ld') return id===ctx.ld;
    if(l.niv!==niv && !(ctx.modus==='slim'&&l.niv<niv)) return false;
    if(ctx.dom&&l.dom!==ctx.dom) return false; if(ctx.sub&&l.sub!==ctx.sub) return false; return true };
  // 1. foutenbank (Zeker én fout eerst)
  const due=fbDue().filter(([k])=>inScope(k)).sort((a,b)=>(b[1].zf-a[1].zf)||(a[1].t-b[1].t));
  const kans = ctx.modus==='fouten'||ctx.modus==='herhaal'?1 : due.length&&due[0][1].zf?.6:.35;
  if(due.length&&Math.random()<kans) return maakItem(due[0][0],{trede:3,vorm:LD[due[0][0]].opties?'mc':(LD[due[0][0]].antw?'open':null),bron:'herhaal'});
  if(ctx.modus==='fouten'){ const open=fbOpen().sort((a,b)=>(b[1].zf-a[1].zf)||(a[1].t-b[1].t)); if(open.length) return maakItem(open[0][0],{trede:3,vorm:LD[open[0][0]].opties?'mc':(LD[open[0][0]].antw?'open':null),bron:'herhaal'}); return null }
  // 1b. herhaalmomenten (gespreide herhaling van beheerste leerdoelen)
  if(['slim','domein','herhaal'].includes(ctx.modus)){ const od=onderhoudDue().filter(([k])=>ctx.modus==='herhaal'||(LD[k].niv<=niv&&(!ctx.dom||LD[k].dom===ctx.dom)&&!recent.includes(k)));
    if(od.length&&(ctx.modus==='herhaal'||Math.random()<.3)) return maakItem(od[0][0],{trede:3,bron:'onderhoud'}); }
  if(ctx.modus==='herhaal') return null;
  if(ctx.modus==='ld') return itemVoor(ctx.ld);
  // 2. interleaving: na 3 keer hetzelfde leerdoel een verwarbaar leerdoel
  const laatste=recent.slice(-3);
  if(laatste.length===3&&laatste.every(x=>x===laatste[0])){
    const opties=(LD[laatste[0]].verwar||[]).filter(id=>LD[id]&&LD[id].niv<=niv);
    if(opties.length) return itemVoor(opties[Math.floor(Math.random()*opties.length)]);
  }
  // 3. domein kiezen (slim: zwakste domein krijgt voorrang) en daarbinnen het zwakste leerdoel
  let doms=ctx.dom?[ctx.dom]:DOMEINEN.map(d=>d.id);
  if(doms.length>1){
    const g=doms.map(d=>Math.max(5,105-domB(niv,d))+(recent.length&&LD[recent[recent.length-1]]?.dom===d?-20:0));
    let t=Math.random()*g.reduce((a,b)=>a+Math.max(1,b),0); let i=0; for(;i<g.length;i++){ t-=Math.max(1,g[i]); if(t<=0) break } doms=[doms[Math.min(i,doms.length-1)]];
  }
  let kand=LDS.filter(l=>l.niv===niv&&l.dom===doms[0]&&(!ctx.sub||l.sub===ctx.sub));
  if(ctx.modus==='slim'&&Math.random()<.12){ const lager=LDS.filter(l=>l.niv<niv&&l.niv>=niv-2&&l.dom===doms[0]); if(lager.length) kand=lager } // af en toe onderhoud van lagere niveaus
  if(!kand.length) kand=LDS.filter(l=>l.niv===niv);
  const score=l=>{ const x=ldS(l.id); return (100-x.b) + (x.tr===0?12:0) + Math.random()*25 - (recent.slice(-2).includes(l.id)?40:0) - (x.b>=95?30:0) };
  kand.sort((a,b)=>score(b)-score(a));
  return itemVoor(kand[0].id);
}
function itemVoor(id){ const x=ldS(id); return maakItem(id,{trede:x.tr===0?3:x.tr,bron:x.tr===0?'nieuw':'oefen'}) }

// ---------- niveau omlaag ----------
// als op het huidige niveau 24 zelfstandige vragen gemaakt zijn en minder dan 40% goed is, gaat de leerling een niveau terug
function checkNiveauOmlaag(){
  if(!S.niv||S.niv<=1||S.recNiv!==S.niv||S.rec.length<24) return false;
  const p=S.rec.reduce((a,b)=>a+b,0)/S.rec.length;
  if(p>=.4) return false;
  const van=S.niv; S.niv=van-1; S.rec=[]; S.recNiv=S.niv;
  event({t:'niveau',van,naar:S.niv,reden:'beheersing te laag'});
  bewaar(); return true;
}

// ---------- badges ----------
const BADGES = [
  {id:'start',e:'🚀',naam:'Gestart',uit:'Instaptoets gemaakt',test:()=>!!S.plaatsing},
  {id:'o100',e:'💯',naam:'100 opgaven',uit:'100 opgaven gemaakt',test:()=>S.aantal>=100},
  {id:'o500',e:'🏋️',naam:'500 opgaven',uit:'500 opgaven gemaakt',test:()=>S.aantal>=500},
  {id:'sab',e:'🕵️',naam:'Saboteur-jager',uit:'10 Saboteurs ontmaskerd',test:()=>(S.sabGoed||0)>=10},
  {id:'fb10',e:'🧹',naam:'Opruimer',uit:'10 fouten uit je foutenbank opgelost',test:()=>Object.values(S.fb).filter(f=>f.opgelost).length>=10},
  {id:'zilver4',e:'🎯',naam:'Klaar voor de check',uit:'Alle vier domeinen op zilver',test:()=>S.niv&&DOMEINEN.every(d=>domB(S.niv,d.id)>=80)},
  {id:'dip1',e:'🎓',naam:'Eerste diploma',uit:'Een rekentoets gehaald',test:()=>Object.keys(S.diplomas).length>=1},
  {id:'2f',e:'🏅',naam:'2F gehaald',uit:'Rekentoets van Niveau 4 gehaald',test:()=>!!S.diplomas[4]},
  {id:'3f',e:'🏆',naam:'3F gehaald',uit:'Rekentoets van Niveau 8 gehaald',test:()=>!!S.diplomas[8]}
];
function badgesBijwerken(){ BADGES.forEach(b=>{ if(!S.badges.includes(b.id)&&b.test()){ S.badges=S.badges.concat([b.id]); setTimeout(()=>melding(`${b.e} Badge: ${b.naam}`),600) } }) }
