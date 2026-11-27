// ===== Effectmeting: voormeting en nameting (zelfde opgavesoorten, andere getallen) met rapportage =====
// De voormeting legt vast welke leerdoelen en welk niveau gemeten zijn; de nameting gebruikt precies dezelfde leerdoelen,
// met nieuwe getallen. Zo zijn de twee metingen vergelijkbaar. Geen feedback tijdens de meting, wel een tijdslimiet.
const METING = {n:20, min:30, minDagen:28};
const metingStaat = () => S.meting||{};
function startMeting(soort){
  const m=metingStaat(); let niv, lds;
  if(soort==='Voormeting'){ niv=S.niv; lds=[]; DOMEINEN.forEach(d=>{ const l=shuffle(LDS.filter(x=>x.niv===niv&&x.dom===d.id&&(x.antw||x.opties))); for(let i=0;i<METING.n/4&&l.length;i++) lds.push(l[i%l.length].id) }) }
  else { if(!m.voor){ melding('Maak eerst de voormeting.'); return } niv=m.voor.niv; lds=m.voor.lds }
  const items=lds.map(id=>{ let it=maakItem(id,{trede:3,bron:'toets'}); if(!['open','mc'].includes(it.vorm)) it=maakItem(id,{trede:3,vorm:VAST(it),bron:'toets'}); return it });
  SES={soort:'toets',meting:{id:soort.toLowerCase(),naam:soort,soort,lds},titel:soort+' · niveau '+niv,niv,herk:null,items:shuffle(items),antw:[],res:[],i:0,n:items.length,start:Date.now(),eind:Date.now()+METING.min*60000*(S.rustig?1.5:1)};
  toetsKlokStart(); volgendeItem();
}
function metingKlaar(t){
  const m=Object.assign({},metingStaat()); const reg={tijd:t.tijd,niv:t.niveau,totaal:t.totaal,per:t.perDomein,lds:SES.meting.lds};
  if(t.soort==='Voormeting') m.voor=reg; else m.na=reg; S.meting=m; bewaar();
  go('meting');
}
SCHERMEN.meting=function(){
  const m=metingStaat(), dagen=m.voor?Math.floor((Date.now()-m.voor.tijd)/864e5):0;
  const rij=(x,l)=>x?`<div class="minirij"><span>${l}</span>${balk(x.totaal,'var(--knop)')}<b>${x.totaal}%</b></div>`:'';
  return `<div class="wrap smal"><div class="top"><h1>Voor- en nameting</h1></div>
   <div class="kaart"><p style="margin-top:0">Met een voormeting en later een nameting zie je hoeveel je vooruit bent gegaan. Beide metingen hebben ${METING.n} opgaven van dezelfde soort (met andere getallen) en duren maximaal ${Math.round(METING.min*(S.rustig?1.5:1))} minuten. Tijdens de meting krijg je geen uitleg.</p>
    ${rij(m.voor,'Voormeting')}${rij(m.na,'Nameting')}
    ${m.voor&&m.na?`<p><b>${m.na.totaal-m.voor.totaal>=0?'+':''}${m.na.totaal-m.voor.totaal} procentpunt</b> ${m.na.totaal>m.voor.totaal?'vooruit. Goed gedaan!':m.na.totaal===m.voor.totaal?'gelijk gebleven.':'achteruit. Bespreek dit met je docent.'}</p>`:''}
    <div class="voet" style="justify-content:flex-start">
     ${!m.voor?`<button class="knop" onclick="startMeting('Voormeting')">Start voormeting (niveau ${S.niv})</button>`:
       `<button class="knop ${dagen<METING.minDagen?'zacht':''}" onclick="${dagen<METING.minDagen?`if(confirm('De voormeting is pas ${dagen} dagen geleden. Een nameting zegt meer na minstens ${METING.minDagen} dagen. Toch starten?'))`:''}startMeting('Nameting')">Start nameting (niveau ${m.voor.niv})</button>`}
     <button class="knop zacht" onclick="go('oefentoets')">Terug</button></div>
    ${m.voor?`<p class="zacht klein">Voormeting gemaakt op ${datumKort(m.voor.tijd)} (${dagen} dagen geleden).</p>`:''}</div></div>`;
};
// link vanaf het oefentoetsscherm
const _oefentoetsScherm=SCHERMEN.oefentoets;
SCHERMEN.oefentoets=function(){ return _oefentoetsScherm().replace(/<\/div>$/,`<div class="kaart" style="margin-top:14px"><span class="eyebrow" style="color:var(--knop)">Effectmeting</span><h2 style="margin:6px 0">Voor- en nameting</h2><p>Meet waar je nu staat, en kijk na een paar weken oefenen hoeveel je vooruit bent gegaan.</p><div class="voet" style="justify-content:flex-start"><button class="knop zacht" onclick="go('meting')">Naar de voor- en nameting</button></div></div></div>`) };

// ----- docent: rapportage -----
async function docEffect(){
  if(DOC.data&&DOC.data.lokaal){ melding('De rapportage werkt alleen met de server.'); return }
  try{ DOC.effect=await api('effect',{docentcode:DOC.code,klas:DOC.klas}); go('docentEffect') }catch(e){ melding(/Onbekende actie/i.test(e.message)?'Implementeer eerst de nieuwe versie van Code.gs.':esc(e.message)) }
}
SCHERMEN.docentEffect=function(){
  const e=DOC.effect||{leerlingen:[]}, s=e.stat; const f=x=>x==null?"–":nl(Math.round(x*10)/10);
  const oordeel=d=>d==null?'':d>=.8?'groot effect':d>=.5?'middelgroot effect':d>=.2?'klein effect':'geen aantoonbaar effect';
  return `<div class="wrap"><div class="top"><h1>Effectmeting${DOC.klas?' · '+esc(DOC.klas):''}</h1><button class="knop zacht klein" onclick="go('docent')">← Terug</button><button class="knop zacht klein" onclick="exportEffect()">CSV</button></div>
   <div class="kaart">${s?`<div class="statstrook"><div><span>Leerlingen met voor- én nameting</span><b>${s.n}</b></div><div><span>Gemiddeld bij voormeting</span><b>${f(s.voor)}%</b></div><div><span>Gemiddelde winst</span><b>${s.winst>=0?'+':''}${f(s.winst)} pp</b></div><div><span>Effectgrootte (d)</span><b>${f(s.d)}</b></div></div>
    <p>${s.beter} van de ${s.n} leerlingen gingen vooruit. ${s.d!=null?`Effectgrootte d = ${f(s.d)}: <b>${oordeel(s.d)}</b> (gemiddelde winst gedeeld door de spreiding van de winst; vanaf 0,2 klein, 0,5 middelgroot, 0,8 groot).`:''}</p>
    <p class="zacht klein">Let op: zonder vergelijkingsgroep laat dit de groei zien, niet alleen het effect van de app. Voor een pilot: laat een andere klas dezelfde metingen maken zonder de app, of vergelijk met de groei van vorig jaar.</p>`:'<p class="zacht">Nog geen leerlingen met zowel een voor- als een nameting.</p>'}</div>
   <div class="kaart tabelwrap" style="margin-top:14px"><table><thead><tr><th>Naam</th><th>Klas</th><th>Niveau</th><th>Voormeting</th><th>Nameting</th><th>Verschil</th></tr></thead><tbody>${e.leerlingen.map(l=>`<tr><td>${esc(l.naam)}</td><td>${esc(l.klas)}</td><td>${l.voor?l.voor.niveau:'–'}</td><td>${l.voor?l.voor.totaal+'% <span class="zacht klein">'+datumKort(l.voor.tijd)+'</span>':'–'}</td><td>${l.na?l.na.totaal+'% <span class="zacht klein">'+datumKort(l.na.tijd)+'</span>':'–'}</td><td>${l.voor&&l.na?`<b>${l.na.totaal-l.voor.totaal>=0?'+':''}${l.na.totaal-l.voor.totaal}</b>`:'–'}</td></tr>`).join('')||'<tr><td colspan="6" class="zacht">Nog geen metingen.</td></tr>'}</tbody></table></div></div>`;
};
function exportEffect(){
  const e=DOC.effect||{leerlingen:[]}; const r=[['Naam','Klas','Niveau','Voormeting %','Datum voor','Nameting %','Datum na','Verschil']].concat(e.leerlingen.map(l=>[l.naam,l.klas,l.voor?l.voor.niveau:'',l.voor?l.voor.totaal:'',l.voor?new Date(l.voor.tijd).toLocaleDateString('nl-NL'):'',l.na?l.na.totaal:'',l.na?new Date(l.na.tijd).toLocaleDateString('nl-NL'):'',l.voor&&l.na?l.na.totaal-l.voor.totaal:'']));
  const csv=r.map(x=>x.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(';')).join('\n'); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob(['﻿'+csv],{type:'text/csv'})); a.download='effectmeting.csv'; a.click();
}
