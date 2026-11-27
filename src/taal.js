// ===== Taalsteun: voorlezen en woordenlijst =====
// Rekenopgaven zijn vaak talig. Voorlezen (Nederlandse stem van het apparaat) en uitleg bij rekenwoorden
// helpen taalzwakke leerlingen en NT2-leerlingen, zonder het rekenwerk over te nemen.
const WOORDEN = {
  'procent':'Procent betekent "per honderd". 25% = 25 van de 100 = een kwart.',
  'procentpunt':'Het verschil tussen twee percentages. Van 40% naar 50% = 10 procentpunt.',
  'korting':'Het bedrag dat van de prijs af gaat.',
  'btw':'Belasting die bij de prijs zit. In Nederland meestal 21% (of 9% op eten). De btw is een percentage van de prijs zónder btw.',
  'inclusief':'Met iets erbij inbegrepen. Inclusief btw = de btw zit al in de prijs.',
  'exclusief':'Zonder. Exclusief btw = de btw zit er nog niet in.',
  'rente':'Geld dat je krijgt (sparen) of betaalt (lenen), als percentage van het bedrag.',
  'groeifactor':'Het getal waarmee je elke periode vermenigvuldigt. 5% erbij = × 1,05. 5% eraf = × 0,95.',
  'indexcijfer':'Een getal dat een waarde vergelijkt met een basisjaar (dat is 100). Index 120 = 20% hoger.',
  'inflatie':'Het stijgen van de prijzen, in procenten per jaar.',
  'verhouding':'Hoe twee hoeveelheden bij elkaar horen, bijvoorbeeld 1 : 3.',
  'schaal':'Hoeveel keer kleiner een kaart of tekening is. Schaal 1 : 1000 = 1 cm op de kaart is 1000 cm in het echt.',
  'gemiddelde':'Alle getallen optellen en delen door het aantal getallen.',
  'mediaan':'Het middelste getal als je alle getallen op volgorde zet.',
  'kwartiel':'Getallen op volgorde in vier gelijke groepen. Q1 = de grens van het laagste kwart, Q3 = van het hoogste kwart.',
  'frequentie':'Hoe vaak iets voorkomt.',
  'omtrek':'De lengte van de rand rondom een figuur.',
  'oppervlakte':'Hoeveel ruimte een plat vlak inneemt, in m² of cm².',
  'inhoud':'Hoeveel er in een ruimte past, in m³, liter of cm³.',
  'straal':'De afstand van het midden van een cirkel tot de rand. De helft van de diameter.',
  'diameter':'De afstand dwars door het midden van een cirkel, van rand tot rand. Twee keer de straal.',
  'grondvlak':'Het vlak waarop een ruimtelijke figuur staat.',
  'schuine zijde':'De langste zijde van een rechthoekige driehoek, tegenover de rechte hoek.',
  'rechthoekig':'Met een hoek van precies 90 graden.',
  'evenredig':'Als het ene twee keer zo groot wordt, wordt het andere ook twee keer zo groot.',
  'lineair':'Er komt steeds hetzelfde bij (of af). De grafiek is een rechte lijn.',
  'exponentieel':'Het wordt steeds met hetzelfde getal vermenigvuldigd. Het gaat steeds sneller.',
  'halveringstijd':'De tijd waarin iets de helft kleiner wordt.',
  'formule':'Een rekenregel met letters, bijvoorbeeld K = 3 × u + 12.',
  'gelijkvormig':'Dezelfde vorm, maar groter of kleiner. Alle lengtes zijn met hetzelfde getal vermenigvuldigd.',
  'dichtheid':'Hoeveel gram 1 cm³ van een stof weegt.',
  'vermogen':'Hoeveel energie een apparaat per seconde gebruikt, in watt (W).',
  'kwh':'Kilowattuur: de energie die een apparaat van 1000 watt in 1 uur gebruikt.',
  'aanbetaling':'Het bedrag dat je meteen betaalt als je iets op afbetaling koopt.',
  'termijn':'Eén van de bedragen die je elke maand betaalt bij afbetalen.',
  'contant':'In één keer betalen.',
  'vastrecht':'Een vast bedrag dat je elke maand betaalt, hoeveel je ook gebruikt.',
  'netto':'Wat overblijft na aftrek (bijvoorbeeld na belasting of verpakking).',
  'bruto':'Het totaal, vóór aftrek.',
  'wisselkoers':'Hoeveel je van een andere munt krijgt voor 1 euro.',
  'gemiddelde snelheid':'Totale afstand gedeeld door totale tijd.',
  'snijverlies':'Het stuk materiaal dat je weggooit bij het op maat maken.',
  'kwartielafstand':'Q3 − Q1: hoe ver het middelste deel van de getallen uit elkaar ligt.',
  'spreidingsbreedte':'Grootste getal − kleinste getal.',
  'klassenmidden':'Het getal precies in het midden van een klasse, bijvoorbeeld 15 bij 10 – < 20.'
};
const WOORD_RE = new RegExp('\\b('+Object.keys(WOORDEN).sort((a,b)=>b.length-a.length).map(w=>w.replace(/ /g,'\\s')).join('|')+')\\b','i');
function woordenMarkeren(root){
  if(!root) return; const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement&&!n.parentElement.closest('button,abbr,.term,svg,input,select,textarea,script')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
  const nodes=[]; while(w.nextNode()) nodes.push(w.currentNode);
  const gehad=new Set();
  nodes.forEach(n=>{ const m=n.nodeValue.match(WOORD_RE); if(!m) return; const k=m[1].toLowerCase().replace(/\s+/g,' '); if(gehad.has(k)||!WOORDEN[k]) return; gehad.add(k);
    const r=document.createRange(); r.setStart(n,m.index); r.setEnd(n,m.index+m[1].length);
    const s=document.createElement('button'); s.type='button'; s.className='term'; s.textContent=m[1]; s.title=WOORDEN[k]; s.onclick=e=>{ e.preventDefault(); toonWoord(k) }; r.deleteContents(); r.insertNode(s) });
}
function toonWoord(k){ melding(`<b>${esc(k)}</b>: ${esc(WOORDEN[k])}`) }
// voorlezen: met de stem "Roos" (ElevenLabs, via de server) als die aan staat, anders met de Nederlandse stem van het apparaat.
// Alleen de opgavetekst gaat naar de server, nooit gegevens van de leerling. Elke zin wordt op het apparaat bewaard, zodat hij maar één keer tekens kost.
let STEM={uit:false,audio:null,bezig:false,actief:(()=>{ try{ return localStorage.getItem('ron-stem-actief')==='1' }catch(e){ return false } })()};
function voorleesTekst(){
  const el=document.querySelector('#qbody'); if(!el) return '';
  const kloon=el.cloneNode(true); kloon.querySelectorAll('svg,input,select,.schat,.schema,#modelpaneel,.cijferpad,#padTerug,.l').forEach(x=>x.remove());
  kloon.querySelectorAll('.optie,.sabstap,li').forEach(o=>{ o.textContent=' '+o.textContent.trim().replace(/[.?!]?$/,'. ') }); kloon.querySelectorAll('p,div,h2,h3').forEach(e=>e.append(' '));
  return kloon.textContent.replace(/×/g,' keer ').replace(/ : /g,' gedeeld door ').replace(/−/g,' min ').replace(/€\s?/g,'euro ').replace(/%/g,' procent').replace(/²/g,' kwadraat').replace(/³/g,' kubiek').replace(/≈/g,' ongeveer ').replace(/\s+/g,' ').trim();
}
function stopVoorlezen(){ try{ if(STEM.audio){ STEM.audio.pause(); STEM.audio=null } }catch(e){} try{ speechSynthesis.cancel() }catch(e){} STEM.bezig=false }
const bezigMetVoorlezen=()=>STEM.bezig||!!(window.speechSynthesis&&speechSynthesis.speaking);
function voorlezen(){
  if(bezigMetVoorlezen()){ stopVoorlezen(); return }
  const t=voorleesTekst(); if(!t) return;
  STEM.bezig=true;
  stemRoos(t).then(ok=>{ if(!ok){ STEM.bezig=false; apparaatStem(t) } });
}
function apparaatStem(t){
  if(!('speechSynthesis' in window)){ melding('Voorlezen werkt niet in deze browser.'); return }
  const s=window.speechSynthesis; s.cancel();
  const u=new SpeechSynthesisUtterance(t); u.lang='nl-NL'; u.rate=.92;
  const stem=s.getVoices().find(v=>/^nl/i.test(v.lang)); if(stem) u.voice=stem;
  s.speak(u);
}
async function stemSleutel(t){ const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('roos|'+t)); return [...new Uint8Array(b)].slice(0,16).map(x=>x.toString(16).padStart(2,'0')).join('') }
async function stemRoos(t){
  if(STEM.uit||!serverModus()||t.length>400||!window.crypto||!crypto.subtle) return false;
  try{
    const k=await stemSleutel(t), url='https://stem.rekenen-op-niveau.local/'+k; let blob=null, cache=null;
    try{ cache=await caches.open('ron-stem'); const hit=await cache.match(url); if(hit) blob=await hit.blob() }catch(e){}
    if(!blob){
      const j=await fetch(DATA_ENDPOINT_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({actie:'tts',tekst:t})}).then(r=>r.json());
      if(!j.ok||!j.audio){ if(j.uit||j.op||/Onbekende actie/i.test(j.fout||'')){ STEM.uit=true; if(j.uit){ STEM.actief=false; try{ localStorage.removeItem('ron-stem-actief') }catch(e){} } } return false }
      const bin=atob(j.audio), u8=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u8[i]=bin.charCodeAt(i);
      blob=new Blob([u8],{type:j.mime||'audio/mpeg'});
      try{ if(cache) await cache.put(url,new Response(blob.slice(0),{headers:{'Content-Type':blob.type}})) }catch(e){}
    }
    if(!STEM.bezig) return true;   // intussen gestopt
    const a=new Audio(URL.createObjectURL(blob)); STEM.audio=a; a.onended=()=>{ STEM.bezig=false; STEM.audio=null };
    await a.play(); if(!STEM.actief){ STEM.actief=true; try{ localStorage.setItem('ron-stem-actief','1') }catch(e){} } return true;
  }catch(e){ return false }
}
// ----- docent: voorleesstem aan/uit en verbruik -----
async function docStem(aan){
  if(DOC.data&&DOC.data.lokaal){ melding('Dit werkt alleen met de server.'); return }
  try{ DOC.stem=await api('steminstelling',Object.assign({docentcode:DOC.code},aan===undefined?{}:{aan})); if(aan!==undefined){ STEM.uit=!aan } go('docentStem') }
  catch(e){ melding(/Onbekende actie/i.test(e.message)?'Implementeer eerst de nieuwe versie van Code.gs.':esc(e.message)) }
}
SCHERMEN.docentStem=function(){
  const s=DOC.stem||{}; const pct=s.max?Math.round(100*s.gebruikt/s.max):0;
  return `<div class="wrap smal"><div class="top"><h1>Voorleesstem</h1><button class="knop zacht klein" onclick="go('docent')">← Terug</button></div><div class="kaart">
   <p style="margin-top:0">Status: <b>${!s.ingesteld?'nog niet ingesteld':s.aan?'aan (stem van ElevenLabs)':'uit (stem van het apparaat)'}</b></p>
   ${s.ingesteld?`<p>Verbruik deze maand: <b>${s.gebruikt} van ${s.max}</b> tekens (${pct}%).</p>${balk(pct,'var(--knop)')}<p class="zacht klein">Is het maximum bereikt, dan leest de app voor met de stem van het apparaat. Een zin die al eens is voorgelezen, kost op hetzelfde apparaat geen tekens meer.</p>`:
   `<p class="zacht">Vul in Apps Script bij Projectinstellingen › Scripteigenschappen <b>ELEVENLABS_KEY</b> en <b>ELEVENLABS_VOICE</b> in en implementeer opnieuw.</p>`}
   ${s.fout?`<p class="zacht klein">Laatste melding van ElevenLabs: ${esc(s.fout)}</p>`:''}
   <div class="voet" style="justify-content:flex-start">${s.ingesteld?(s.aan?`<button class="knop zacht" onclick="docStem(false)">Stem uitzetten</button>`:`<button class="knop" onclick="docStem(true)">Stem aanzetten</button>`):''}<button class="knop zacht" onclick="docStem()">Vernieuwen</button></div></div></div>`;
};
