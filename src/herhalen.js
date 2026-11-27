// ===== Gespreide herhaling, zichtbaar voor de leerling =====
// Een beheerst leerdoel komt terug na 2 dagen, 1 week, 2 weken, 1 maand en 2 maanden (uitbreidende intervallen).
// Goed bij een herhaalmoment: de volgende herhaling schuift verder op. Fout: terug naar 2 dagen (en de foutenbank in).
// De leerling ziet in een planning wat er vandaag, morgen en later terugkomt, en waarom.
const HERHAAL_DAGEN = [2,7,14,30,60];
const DAG = 864e5;
function onderhoudBij(it,res,x){
  if(it.trede!==3||it.bron==='spiegel'||it.bron==='instap') return;
  const nu=Date.now();
  if(it.bron==='onderhoud'){ x.h=res.goed?Math.min((x.h||0)+1,HERHAAL_DAGEN.length-1):0; x.hd=nu+HERHAAL_DAGEN[x.h]*DAG; x.hk=(x.hk||0)+1; return }
  if(x.b>=DREMPEL&&!x.hd){ x.h=0; x.hd=nu+HERHAAL_DAGEN[0]*DAG }
}
const onderhoudDue = () => Object.entries(S.ld).filter(([k,x])=>LD[k]&&x.hd&&x.hd<=Date.now()&&!(S.fb[k]&&!S.fb[k].opgelost)).sort((a,b)=>a[1].hd-b[1].hd);
const herhaalNu = () => fbDue().length+onderhoudDue().length;
// alle geplande herhalingen: foutenbank + onderhoud
function herhaalPlanning(){
  const nu=Date.now(), p=[];
  fbOpen().forEach(([k,f])=>p.push({k,soort:'fout',t:f.dueT||nu,f}));
  Object.entries(S.ld).forEach(([k,x])=>{ if(LD[k]&&x.hd&&!(S.fb[k]&&!S.fb[k].opgelost)) p.push({k,soort:'onderhoud',t:x.hd,x}) });
  return p.sort((a,b)=>a.t-b.t);
}
const dagStart = t => { const d=new Date(t); d.setHours(0,0,0,0); return d.getTime() };
const dagenTot = t => Math.round((dagStart(t)-dagStart(Date.now()))/DAG);
function wanneerTekst(t){
  const d=dagenTot(t);
  if(d<=0) return 'vandaag'; if(d===1) return 'morgen';
  if(d<7) return 'op '+new Date(t).toLocaleDateString('nl-NL',{weekday:'long'});
  return 'over '+d+' dagen ('+new Date(t).toLocaleDateString('nl-NL',{day:'numeric',month:'short'})+')';
}
function intervalLadder(h){ return `<span class="hladder" title="Herhaalstap ${h+1} van ${HERHAAL_DAGEN.length}">${HERHAAL_DAGEN.map((d,i)=>`<i class="${i<h?'af':i===h?'nu':''}">${d<7?d+'d':d<30?(d/7)+'w':(d/30)+'m'}</i>`).join('')}</span>` }
// regel onder de feedback: wanneer komt dit terug?
function herhaalInfo(it,res){
  if(SES&&SES.soort!=='oefen') return '';
  if(it.bron==='onderhoud'){ const x=ldS(it.ld);
    return `<p class="hinfo">📅 ${res.goed?`Goed onthouden! Volgende herhaling ${wanneerTekst(x.hd)}.`:`Weggezakt. Dat is normaal. Hij staat in je foutenbank en komt ${wanneerTekst(x.hd)} weer als herhaalmoment.`} ${intervalLadder(x.h||0)}</p>` }
  const f=S.fb[it.ld]; if(!f) return '';
  if(it.bron==='herhaal'&&f.opgelost) return `<p class="hinfo">🎉 Opgelost uit je foutenbank. ${ldS(it.ld).hd?`Hij komt ${wanneerTekst(ldS(it.ld).hd)} nog terug als herhaalmoment.`:''}</p>`;
  if(!f.opgelost&&!res.goed) return `<p class="hinfo">📅 Deze komt terug in je foutenbank: nog in deze of de volgende ronde, daarna na 1 en 3 dagen.</p>`;
  if(it.bron==='herhaal'&&res.goed) return `<p class="hinfo">📅 ${f.rij}/${f.nodig} keer goed. Volgende keer: ${wanneerTekst(f.dueT)}.</p>`;
  return '';
}
function planningKaart(){
  const p=herhaalPlanning(); const v=p.filter(x=>dagenTot(x.t)<=0).length, m=p.filter(x=>dagenTot(x.t)===1).length, w=p.filter(x=>dagenTot(x.t)>1&&dagenTot(x.t)<7).length;
  return `<div class="kaart"><h3 class="kaartkop">Herhaalplanning</h3>
    <div class="hteller"><div><b>${v}</b><small>vandaag</small></div><div><b>${m}</b><small>morgen</small></div><div><b>${w}</b><small>deze week</small></div></div>
    ${p.length?'':'<p class="klein zacht">Nog niets gepland. Beheers je een onderdeel (80%), dan komt het na 2 dagen terug.</p>'}
    <div class="voet" style="margin-top:8px">${v?`<button class="knop klein" onclick="startOefen({modus:'herhaal'})">Herhaal nu (${Math.min(10,v)})</button>`:''}<button class="knop zacht klein" onclick="go('planning')">Bekijk planning</button></div></div>`;
}
SCHERMEN.planning=()=>{
  const p=herhaalPlanning(); const v=p.filter(x=>dagenTot(x.t)<=0).length;
  const dagen=Array.from({length:14},(_,i)=>{ const t=dagStart(Date.now())+i*DAG; const n=p.filter(x=>Math.max(0,dagenTot(x.t))===i).length;
    return `<div class="hdag ${i===0?'nu':''}"><small>${i===0?'vandaag':new Date(t).toLocaleDateString('nl-NL',{weekday:'short'})}</small><b>${new Date(t).getDate()}</b><span style="height:${n?Math.min(48,10+n*7):0}px" title="${n} herhalingen">${n||''}</span></div>` }).join('');
  const groep=(titel,f)=>{ const l=p.filter(x=>f(dagenTot(x.t))); if(!l.length) return '';
    return `<h3 class="kaartkop" style="margin-top:18px">${titel} <span class="zacht">(${l.length})</span></h3>${l.map(x=>{ const ld=LD[x.k];
      const info=x.soort==='fout'?`<span class="hsoort fout">Foutenbank</span> nog ${x.f.nodig-(x.f.rij||0)}× goed nodig`:`<span class="hsoort">Onderhoud</span> ${intervalLadder(x.x.h||0)}`;
      return `<div class="rij"><span class="hbol" style="background:${DOM[ld.dom].k}"></span><div style="flex:1"><b>${esc(ld.naam)}</b><br><small class="zacht">Niveau ${ld.niv} · ${esc(DOM[ld.dom].naam)} · ${wanneerTekst(x.t)}</small><div class="klein">${info}</div></div></div>` }).join('')}` };
  return `<section class="foto paginakop" style="${foto('fouten')};border-radius:0;min-height:210px"><div class="wrap" style="width:100%;padding-bottom:0"><span class="eyebrow" style="color:var(--acc)">Herhaalplanning</span><h1>Op tijd herhalen = langer onthouden</h1></div></section>
   <div class="wrap smal"><div class="kaart">
   <p>Wat je net geleerd hebt, zak je na een paar dagen weer weg. Daarom komt elk onderdeel dat je beheerst <b>op vaste momenten terug</b>. Heb je het goed, dan duurt het steeds langer tot de volgende keer:</p>
   <p class="mid">${intervalLadder(-1).replace('hladder','hladder groot')}</p>
   <p class="klein zacht">2 dagen → 1 week → 2 weken → 1 maand → 2 maanden. Is het weggezakt, dan begin je weer bij 2 dagen. Fouten uit je foutenbank komen sneller terug: dezelfde of volgende ronde, dan na 1 en 3 dagen.</p>
   <div class="hstrip">${dagen}</div>
   ${v?`<div class="voet" style="justify-content:flex-start"><button class="knop" onclick="startOefen({modus:'herhaal'})">Herhaal nu (${Math.min(10,v)})</button></div>`:''}
   ${groep('Vandaag',d=>d<=0)}${groep('Morgen',d=>d===1)}${groep('Deze week',d=>d>1&&d<7)}${groep('Later',d=>d>=7)}
   ${p.length?'':'<p class="zacht">Er staat nog niets gepland. Oefen een onderdeel tot je het beheerst: dan verschijnt het hier.</p>'}
   </div></div>${VOET()}`;
};
