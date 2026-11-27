// ===== Oefentoetsen onder toetsomstandigheden: doorstroomtoets groep 8, rekentoets 2F en 3F =====
// Vaste tijd met klok, geen uitleg of hulp tijdens de toets, rekenmachine alleen waar dat in de echte toets mag.
// Een oefentoets verandert het niveau niet en levert geen diploma op; fouten gaan wel naar de foutenbank.
const EXAMENS=[
  {id:'doorstroom',naam:'Doorstroomtoets groep 8',ref:'1F/1S',niveaus:[5,6],n:24,min:45,rm:false,voor:'Voor groep 7 en 8',info:'Getallen, verhoudingen, meten en verbanden op 1F- en 1S-niveau. Zonder rekenmachine.'},
  {id:'2F',naam:'Rekentoets 2F',ref:'2F',niveaus:[7,8],n:30,min:60,rm:true,voor:'Voor vmbo, havo en vwo onderbouw',info:'Contextopgaven op 2F-niveau. De rekenmachine mag alleen bij de opgaven waar dat in de echte toets ook mag.'},
  {id:'3F',naam:'Rekentoets 3F',ref:'3F',niveaus:[10,11,12],n:30,min:75,rm:true,voor:'Voor havo en vwo bovenbouw',info:'Contextopgaven op 3F-niveau, met formules, grafieken en procentuele verandering.'},
];
SCHERMEN.oefentoets=function(){
  const laatste=id=>(S.toetsen||[]).filter(t=>t.soort==='Oefentoets'&&t.examen===id).slice(-1)[0];
  return `<div class="wrap smal"><div class="top"><h1>Oefentoets</h1></div><p class="zacht">Oefen onder toetsomstandigheden: met een klok, zonder uitleg tussendoor en zonder hulpmiddelen. Na afloop zie je je score per domein en bekijk je je fouten.</p>
   ${EXAMENS.map(e=>{ const l=laatste(e.id); return `<div class="kaart" style="margin-top:14px"><span class="eyebrow" style="color:var(--knop)">${esc(e.voor)} · ${e.ref}</span><h2 style="margin:6px 0">${esc(e.naam)}</h2><p>${esc(e.info)}</p><p class="zacht klein">${e.n} opgaven · ${e.min} minuten${l?` · vorige keer ${l.totaal}% (${datumKort(l.tijd)})`:''}</p><div class="voet" style="justify-content:flex-start"><button class="knop" onclick="startOefentoets('${e.id}')">Start oefentoets</button></div></div>` }).join('')}</div>`;
};
function maakToetsItems(niveaus,n,bron,rmMag=true){
  const items=[], per=Math.ceil(n/4);
  DOMEINEN.forEach(d=>{ const lds=shuffle(LDS.filter(l=>niveaus.includes(l.niv)&&l.dom===d.id).sort((a,b)=>(b.ctx?1:0)-(a.ctx?1:0)));
    for(let i=0;i<per&&lds.length;i++){ const ld=lds[i%lds.length]; let it; try{ it=maakItem(ld.id,{trede:3,bron}); if(!['open','mc'].includes(it.vorm)) it=maakItem(ld.id,{trede:3,vorm:VAST(it),bron}) }catch(e){ continue } if(!rmMag) it.rm=false; items.push(it) } });
  return shuffle(items).slice(0,n);
}
function startOefentoets(id){
  const e=EXAMENS.find(x=>x.id===id); const items=maakToetsItems(e.niveaus,e.n,'toets',e.rm);
  SES={soort:'toets',oefentoets:e,titel:'Oefentoets '+e.naam,niv:Math.max(...e.niveaus),herk:null,items,antw:[],res:[],i:0,n:items.length,start:Date.now(),eind:Date.now()+e.min*60000};
  toetsKlokStart(); volgendeItem();
}
let toetsKlokTimer=null;
function toetsKlokStart(){ clearInterval(toetsKlokTimer); toetsKlokTimer=setInterval(toetsKlokTik,1000) }
function toetsKlokTik(){
  if(!SES||!SES.eind){ clearInterval(toetsKlokTimer); return }
  const rest=Math.max(0,SES.eind-Date.now()); const el=$('#toetsKlok');
  if(el){ const m=Math.floor(rest/60000), s=Math.floor(rest/1000)%60; el.textContent=`⏱ ${m}:${String(s).padStart(2,'0')}`; el.classList.toggle('bijna',rest<5*60000) }
  if(rest<=0&&SES.soort==='toets'){ clearInterval(toetsKlokTimer); melding('De tijd is om.');
    // niet-gemaakte opgaven tellen als fout
    for(let i=SES.antw.length;i<SES.items.length;i++){ SES.antw.push({it:SES.items[i],res:{goed:false,gegeven:'(niet gemaakt)',juist:'',zeker:null}}); SES.res.push(false) }
    SES.i=SES.n; eindeToets() }
}
const _naRenderToets=naRender;
naRender=function(){ _naRenderToets(); try{ if(SES&&SES.eind&&SES.soort==='toets'){ const top=$('#qz .top'); if(top&&!$('#toetsKlok')) top.insertAdjacentHTML('beforeend','<span class="chip toetsklok" id="toetsKlok"></span>'); toetsKlokTik() } }catch(e){} };
const _eindeToetsGewoon=eindeToets;
eindeToets=function(){
  if(!SES||!SES.oefentoets&&!SES.meting) return _eindeToetsGewoon();
  clearInterval(toetsKlokTimer); oefenActief=false;
  const e=SES.oefentoets||SES.meting, per={};
  DOMEINEN.forEach(d=>{ const l=SES.antw.filter(a=>a.it.dom===d.id); if(l.length) per[d.id]=Math.round(100*l.filter(a=>a.res.goed).length/l.length) });
  const totaal=Math.round(100*SES.antw.filter(a=>a.res.goed).length/Math.max(1,SES.antw.length));
  const soort=SES.meting?SES.meting.soort:'Oefentoets';
  const t={eid:eid(),tijd:Date.now(),soort,examen:e.id,niveau:SES.niv,totaal,perDomein:per,geslaagd:totaal>=DREMPEL,duurMin:Math.round((Date.now()-SES.start)/60000),terug:[]};
  S.toetsen=S.toetsen.concat([t]); SES.antw.forEach(a=>{ if(a.it&&a.res.gegeven!=='(niet gemaakt)') verwerkStil(a.it,a.res) });
  event(Object.assign({t:'toets'},t)); bewaar();
  SES.uitslag=Object.assign({},t,{perDomein:per});
  const fout=SES.antw.filter(a=>!a.res.goed).length;
  if(SES.meting) return metingKlaar(t);
  go('uitslag',{html:`<div class="wrap smal"><div class="kaart mid"><span class="eyebrow" style="color:var(--knop)">Oefentoets ${esc(e.naam)}</span>
   <div class="cijfer ${totaal>=DREMPEL?'vold':''}">${totaal}%</div>
   <h2>${totaal>=80?'Sterk! Op dit niveau ben je klaar voor de echte toets.':totaal>=60?'Bijna. Oefen nog gericht op je zwakste domein.':'Hier valt nog veel te winnen. Begin bij je zwakste domein.'}</h2>
   <div style="text-align:left;margin:16px auto;max-width:420px">${Object.keys(per).map(d=>`<div class="minirij"><span>${DOM[d].kort}</span>${balk(per[d],DOM[d].k)}<b>${per[d]}%</b></div>`).join('')}</div>
   <p class="zacht">${SES.antw.length} opgaven in ${t.duurMin} minuten.</p>
   <div class="voet" style="justify-content:center">${fout?`<button class="knop" onclick="SES.ri=0;toonReview()">Bekijk je fouten</button>`:''}<button class="knop zacht" onclick="go('oefentoets')">Naar oefentoetsen</button></div></div></div>`});
};
