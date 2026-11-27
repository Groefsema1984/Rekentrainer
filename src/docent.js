// ===== Docentendashboard: klassenoverzicht, leerlingdetail, hardnekkige fouten, klasinstellingen en export =====
let DOC={code:'',data:null,klas:''};
function metStaat(st,f){ const oud=S; S=Object.assign(nieuweStaat(),st); try{ return f() } finally { S=oud } }

SCHERMEN.docentLogin=function(){
  return `<div class="wrap" style="max-width:520px"><div class="kaart"><span class="eyebrow" style="color:var(--knop)">Docent</span><h2 style="margin:6px 0 10px">Docentendashboard</h2>
   ${serverModus()?`<label class="label">Docentcode</label><input type="password" id="dCode" autocomplete="off"><div class="voet"><button class="knop vol" onclick="docentIn()">Inloggen</button></div>`:
   `<p class="zacht">Testmodus: er is nog geen server ingesteld. Je ziet alleen de leerling op dit apparaat.</p><div class="voet"><button class="knop vol" onclick="docentLokaal()">Bekijk leerling op dit apparaat</button></div>`}
   <div class="voet" style="justify-content:flex-start"><button class="terug" onclick="go(S&&S.naam?'home':'welkom')">← Terug</button></div></div></div>`;
};
async function docentIn(){
  const code=$('#dCode').value.trim(); if(!code) return;
  try{ const j=await api('overzicht',{docentcode:code}); DOC.code=code; DOC.data=j; go('docent') }catch(e){ melding(esc(e.message)) }
}
function docentLokaal(){
  if(!S||!S.naam){ melding('Er staat geen leerling op dit apparaat.'); return }
  const r={'Leerling-ID':S.id,'Naam':S.naam,'Klas':S.klas,'Herstelcode':S.code,'Laatst gezien':S.upd,'Huidig niveau':S.niv,'Hoogst ontgrendeld':S.max,'Oefentijd totaal (min)':Math.round(S.tijd/60),'Oefentijd deze week (min)':Math.round((S.week[weekId()]||0)/60),'Opgaven gemaakt':S.aantal,
    'Getallen %':domB(S.niv,'G'),'Verhoudingen %':domB(S.niv,'V'),'Meten en meetkunde %':domB(S.niv,'M'),'Verbanden %':domB(S.niv,'B'),'Open fouten':fbOpen().length,'Zeker én fout (open)':fbOpen().filter(([k,f])=>f.zf).length,'Toetsen geslaagd':Object.keys(S.diplomas).length};
  DOC.data={klassen:KLASSEN,leerlingen:[r],topfouten:[],klasinst:{},lokaal:true}; go('docent');
}
async function docentVernieuw(){ if(DOC.data&&DOC.data.lokaal) return docentLokaal(); try{ DOC.data=await api('overzicht',{docentcode:DOC.code}); go('docent') }catch(e){ melding(esc(e.message)) } }

const KOLOM=['Getallen %','Verhoudingen %','Meten en meetkunde %','Verbanden %'];
SCHERMEN.docent=function(){
  if(!DOC.data) return SCHERMEN.docentLogin();
  const d=DOC.data; const ll=d.leerlingen.filter(l=>!DOC.klas||l.Klas===DOC.klas).sort((a,b)=>String(a.Klas).localeCompare(String(b.Klas))||String(a.Naam).localeCompare(String(b.Naam)));
  const pc=v=>v===''||v==null?'<td class="zacht">–</td>':`<td><span class="pctcel ${v>=80?'hoog':v<50?'laag':''}">${v}%</span></td>`;
  const perNiv={}; ll.forEach(l=>{ const n=l['Huidig niveau']||0; perNiv[n]=(perNiv[n]||0)+1 });
  const inst=DOC.klas&&d.klasinst?d.klasinst[DOC.klas]:null;
  return `<div class="wrap"><div class="top"><h1>Docentendashboard</h1><button class="knop zacht klein" onclick="docentVernieuw()">↻ Vernieuwen</button><button class="knop zacht klein" onclick="docAnalyse()">Analyse van de vragen</button><button class="knop zacht klein" onclick="exportCsv()">CSV</button><button class="knop zacht klein" onclick="exportJson()">JSON</button></div>
   <div class="nivkeuze klassen"><button class="${!DOC.klas?'aan':''}" onclick="DOC.klas='';go('docent')">Alle klassen</button>${d.klassen.map(k=>`<button class="${DOC.klas===k?'aan':''}" onclick="DOC.klas='${esc(k)}';go('docent')">${esc(k)}</button>`).join('')}</div>
   <div class="statstrook" style="margin:16px 0 22px"><div><small>Leerlingen</small><span class="getal">${ll.length}</span></div><div><small>Gemiddeld niveau</small><span class="getal">${ll.length?nl(ll.reduce((s,l)=>s+(+l['Huidig niveau']||0),0)/ll.length,1):'–'}</span></div><div><small>Opgaven deze selectie</small><span class="getal">${ll.reduce((s,l)=>s+(+l['Opgaven gemaakt']||0),0)}</span></div><div><small>Verdeling niveaus</small><span class="klein">${Object.keys(perNiv).sort().map(n=>`N${n}: ${perNiv[n]}`).join(' · ')||'–'}</span></div></div>
   ${inst?`<div class="kaart" style="margin-bottom:18px"><b>Instellingen ${esc(DOC.klas)}</b> <label style="margin-left:16px"><input type="checkbox" ${inst.toetsVrij?'checked':''} onchange="klasInst('${esc(DOC.klas)}',this.checked)"> Rekentoets mag automatisch open</label></div>`:''}
   <div class="kaart tabelwrap"><table><thead><tr><th>Naam</th><th>Klas</th><th>Niveau</th>${KOLOM.map(k=>`<th>${k.replace(' %','').replace('Meten en meetkunde','Meten')}</th>`).join('')}<th>Open fouten</th><th>Zeker&nbsp;én&nbsp;fout</th><th>Toetsen</th><th>Min. week</th><th>Laatst</th><th>ID / code</th></tr></thead><tbody>
   ${ll.map(l=>`<tr class="klik" onclick="docentLeerling('${esc(l['Leerling-ID'])}')"><td><b>${esc(l.Naam)}</b></td><td>${esc(l.Klas)}</td><td><b>${l['Huidig niveau']||'–'}</b></td>${KOLOM.map(k=>pc(l[k])).join('')}<td>${l['Open fouten']||0}</td><td>${l['Zeker én fout (open)']?`<b style="color:var(--fout)">${l['Zeker én fout (open)']}</b>`:0}</td><td>${l['Toetsen geslaagd']||0}</td><td>${l['Oefentijd deze week (min)']||0}</td><td>${datumKort(l['Laatst gezien'])}</td><td class="zacht klein">${esc(l['Leerling-ID'])}<br>${esc(l.Herstelcode||'')}</td></tr>`).join('')||'<tr><td colspan="13" class="zacht">Nog geen leerlingen.</td></tr>'}
   </tbody></table></div>
   ${d.topmisc&&d.topmisc.length?`<h2 class="sectie">Denkfouten${DOC.klas?' in '+esc(DOC.klas):''}</h2><p class="zacht klein">Fouten gegroepeerd per misconceptie, over alle leerdoelen heen. Begin bij de bovenste: die komt bij de meeste leerlingen voor.</p><div class="kaart tabelwrap"><table><thead><tr><th>Denkfout</th><th>Leerlingen</th><th>Keer</th><th>Waarvan zeker</th><th>Komt voor bij</th><th>Tip voor een mini-instructie</th></tr></thead><tbody>${d.topmisc.map(t=>`<tr><td><b>${esc(t.naam)}</b></td><td>${t.leerlingen}</td><td>${t.keer}</td><td>${t.zeker}</td><td class="klein">${t.leerdoelen.map(x=>esc(LD[x]?LD[x].naam:x)).join('<br>')}</td><td class="klein">${esc(misTip(t.naam))}</td></tr>`).join('')}</tbody></table></div>`:''}
   ${d.topfouten&&d.topfouten.length?`<h2 class="sectie">Hardnekkigste fouten${DOC.klas?' in '+esc(DOC.klas):''}</h2><div class="kaart tabelwrap"><table><thead><tr><th>Leerdoel</th><th>Niveau</th><th>Domein</th><th>Keer fout</th><th>Waarvan zeker</th><th>Leerlingen</th></tr></thead><tbody>${d.topfouten.map(t=>`<tr><td>${esc(LD[t.leerdoel]?LD[t.leerdoel].naam:t.leerdoel)}</td><td>${t.niveau}</td><td>${esc(t.domein)}</td><td>${t.keer}</td><td>${t.zeker}</td><td>${t.leerlingen}</td></tr>`).join('')}</tbody></table></div>`:''}
   </div>`;
};
async function klasInst(klas,vrij){ try{ const j=await api('klasinstelling',{docentcode:DOC.code,klas,toetsVrij:vrij}); DOC.data.klasinst[klas]=j.klasinst; melding('Opgeslagen') }catch(e){ melding(esc(e.message)) } }
async function docentLeerling(id){
  let j;
  if(DOC.data.lokaal) j={leerling:{id:S.id,naam:S.naam,klas:S.klas,code:S.code},staat:S,fouten:[],toetsen:S.toetsen.map(t=>({'Datum/tijd':t.tijd,'Niveau':t.niveau,'Poging':t.poging,'Totaal %':t.totaal,'Geslaagd':t.geslaagd?'ja':'nee','Terug naar domeinen':(t.terug||[]).map(d=>DOM[d].naam).join(', ')}))};
  else try{ j=await api('leerling',{docentcode:DOC.code,id}) }catch(e){ melding(esc(e.message)); return }
  DOC.detail=j; go('docentLeerling');
}
SCHERMEN.docentLeerling=function(){
  const j=DOC.detail; const st=j.staat||{};
  return metStaat(st,()=>{
    const n=S.niv||1; const open=fbOpen().sort((a,b)=>(b[1].zf-a[1].zf)||(b[1].keer-a[1].keer));
    return `<div class="wrap"><div class="top"><button class="terug" onclick="go('docent')">← Klassenoverzicht</button><h1>${esc(j.leerling.naam)}</h1><span class="chip">${esc(j.leerling.klas)}</span><span class="chip">Niveau ${S.niv||'–'}</span><button class="knop zacht klein" onclick="exportLeerling()">JSON</button></div>
    <p class="zacht">ID ${esc(j.leerling.id)} · herstelcode ${esc(j.leerling.code)} · ${S.aantal||0} opgaven · ${Math.round((S.tijd||0)/60)} minuten · instaptoets: ${S.plaatsing?`Niveau ${S.plaatsing.niv} (${datumKort(S.plaatsing.tijd)})`:'nog niet gemaakt'}</p>
    <div class="gotdash docent"><aside class="kaart totaal"><h3 class="kaartkop">Niveau ${n}</h3>${ringenSvg(DOMEINEN.map(d=>({b:domB(n,d.id),k:d.k})),nivB(n)+'%')}
      <div class="legenda">${DOMEINEN.map(d=>`<span><i style="background:${d.k}"></i>${d.kort} ${domB(n,d.id)}%</span>`).join('')}</div></aside>
     <div class="kaart"><h3 class="kaartkop">Voortgang per niveau</h3><div class="tabelwrap"><table><thead><tr><th>Niveau</th>${DOMEINEN.map(d=>`<th>${d.kort}</th>`).join('')}<th>Toets</th></tr></thead><tbody>${NIVEAUS.filter(x=>x.n<=Math.max(n,S.max||0)).map(x=>`<tr><td><b>${x.n}</b> <small class="zacht">${x.ref}</small></td>${DOMEINEN.map(d=>`<td>${domB(x.n,d.id)}%</td>`).join('')}<td>${S.diplomas[x.n]?'🎓 '+S.diplomas[x.n].score+'%':''}</td></tr>`).join('')}</tbody></table></div>
      <h3 class="kaartkop" style="margin-top:18px">Onderdelen op Niveau ${n}</h3>${DOMEINEN.map(d=>`<p class="klein" style="margin:4px 0"><b style="color:${d.k}">${d.kort}:</b> ${SUBDOMEINEN[d.id].map(s=>{const b=subB(n,d.id,s.id);return b===null?'':`${esc(s.naam)} ${b}%`}).filter(x=>x).join(' · ')}</p>`).join('')}</div></div>
    <h2 class="sectie">Foutenbank (open)</h2><div class="kaart tabelwrap"><table><thead><tr><th></th><th>Leerdoel</th><th>Niveau</th><th>Domein</th><th>Keer fout</th><th>Laatste antwoord</th><th>Goed</th><th>Herhaald goed</th></tr></thead><tbody>${open.map(([k,f])=>`<tr><td>${f.zf?'<b style="color:var(--fout)" title="Zeker én fout">!</b>':''}</td><td>${esc(LD[k].naam)}</td><td>${LD[k].niv}</td><td>${DOM[LD[k].dom].kort}</td><td>${f.keer||1}</td><td>${esc(f.gegeven||'')}</td><td>${esc(f.juist||'')}</td><td>${f.rij||0}/${f.nodig}</td></tr>`).join('')||'<tr><td colspan="8" class="zacht">Geen open fouten.</td></tr>'}</tbody></table></div>
    <h2 class="sectie">Toetsen</h2><div class="kaart tabelwrap"><table><thead><tr><th>Datum</th><th>Soort</th><th>Niveau</th><th>Poging</th><th>Totaal</th><th>Geslaagd</th><th>Terug naar</th></tr></thead><tbody>${(j.toetsen||[]).slice().reverse().map(t=>`<tr><td>${datumKort(t['Datum/tijd'])}</td><td>${esc(t.Soort||'Rekentoets')}</td><td>${t.Niveau}</td><td>${t.Poging||''}</td><td>${t['Totaal %']}%</td><td>${t.Geslaagd}</td><td>${esc(t['Terug naar domeinen']||'')}</td></tr>`).join('')||'<tr><td colspan="7" class="zacht">Nog geen toetsen.</td></tr>'}</tbody></table></div>
    ${(j.fouten||[]).length?`<h2 class="sectie">Laatste fouten</h2><div class="kaart tabelwrap"><table><thead><tr><th>Datum</th><th>Niveau</th><th>Leerdoel</th><th>Vraagtype</th><th>Antwoord</th><th>Goed</th><th>Zeker/gok</th><th>Fouttype</th></tr></thead><tbody>${j.fouten.slice(-40).reverse().map(f=>`<tr><td>${datumKort(f['Datum/tijd'])}</td><td>${f.Niveau}</td><td>${esc(LD[f.Leerdoel]?LD[f.Leerdoel].naam:f.Leerdoel)}</td><td>${esc(f.Vraagtype)}</td><td>${esc(f['Gegeven antwoord'])}</td><td>${esc(f['Juiste antwoord'])}</td><td>${esc(f['Zeker/gok'])}</td><td>${esc(f.Fouttype)}</td></tr>`).join('')}</tbody></table></div>`:''}
    </div>`;
  });
};
function download(naam,tekst,type){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([tekst],{type})); a.download=naam; document.body.appendChild(a); a.click(); setTimeout(()=>a.remove(),100) }
function exportCsv(){
  const ll=DOC.data.leerlingen.filter(l=>!DOC.klas||l.Klas===DOC.klas); if(!ll.length) return;
  const kop=Object.keys(ll[0]); const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
  download('rekentrainer-'+(DOC.klas||'alle')+'-'+vandaag()+'.csv','﻿'+[kop.map(q).join(';')].concat(ll.map(l=>kop.map(k=>q(l[k])).join(';'))).join('\n'),'text/csv');
}
function exportJson(){ download('rekentrainer-'+vandaag()+'.json',JSON.stringify(DOC.data,null,1),'application/json') }
function exportLeerling(){ download('rekentrainer-'+DOC.detail.leerling.id+'.json',JSON.stringify(DOC.detail,null,1),'application/json') }

// ---------- itemanalyse: welke leerdoelen zijn te makkelijk of te moeilijk? ----------
async function docAnalyse(){
  let items;
  if(DOC.data.lokaal){ items=Object.keys(S.ld).filter(k=>S.ld[k].p3).map(k=>({ld:k,pogingen:S.ld[k].p3,goed:S.ld[k].g3||0,zekerFout:S.ld[k].zf3||0,leerlingen:1})) }
  else try{ items=(await api('analyse',{docentcode:DOC.code,klas:DOC.klas})).items }catch(e){ melding(esc(e.message)); return }
  DOC.analyse=items.filter(x=>LD[x.ld]).map(x=>Object.assign(x,{p:Math.round(100*x.goed/x.pogingen),zf:Math.round(100*x.zekerFout/x.pogingen)})); go('docentAnalyse');
}
const signaal = x => x.pogingen<10?['te weinig data','zacht']:x.p>=90?['erg makkelijk: eerder overslaan of naar een lager niveau','groen']:x.p<40?['erg moeilijk: extra instructie of later aanbieden','rood']:x.zf>=25?['veel zeker-fout: hardnekkige misconceptie','rood']:['passend','groen'];
SCHERMEN.docentAnalyse=function(){
  const a=(DOC.analyse||[]).slice().sort((x,y)=>LD[x.ld].niv-LD[y.ld].niv||x.p-y.p);
  return `<div class="wrap"><div class="top"><button class="terug" onclick="go('docent')">← Dashboard</button><h1>Analyse van de vragen${DOC.klas?' · '+esc(DOC.klas):''}</h1><button class="knop zacht klein" onclick="analyseCsv()">CSV</button></div>
   <p class="zacht">Per leerdoel: het percentage goed bij de <b>eerste zelfstandige poging</b> (p-waarde). Tussen 40% en 90% is een opgave goed op niveau. Gebruik dit om instructie te plannen en om de indeling van leerdoelen over niveaus bij te stellen.</p>
   ${a.length?`<div class="kaart tabelwrap"><table><thead><tr><th>Leerdoel</th><th>Niveau</th><th>Pogingen</th><th>Leerlingen</th><th>% goed</th><th>% zeker-fout</th><th>Signaal</th></tr></thead><tbody>${a.map(x=>{ const [t,k]=signaal(x); return `<tr><td>${esc(LD[x.ld].naam)}</td><td>${LD[x.ld].niv}</td><td>${x.pogingen}</td><td>${x.leerlingen}</td><td>${balk(x.p)} ${x.p}%</td><td>${x.zf}%</td><td><span class="chip ${k}">${t}</span></td></tr>` }).join('')}</tbody></table></div>`:'<div class="kaart"><p>Nog geen gegevens. Zodra leerlingen oefenen, verschijnt hier per leerdoel hoe moeilijk het is.</p></div>'}</div>${VOET()}`;
};
function analyseCsv(){ download('itemanalyse-'+vandaag()+'.csv',['leerdoel;niveau;domein;pogingen;leerlingen;% goed;% zeker-fout'].concat((DOC.analyse||[]).map(x=>[x.ld,LD[x.ld].niv,LD[x.ld].dom,x.pogingen,x.leerlingen,x.p,x.zf].join(';'))).join('\n'),'text/csv') }
