// ===== Ouderoverzicht: wekelijks rapportje (sterk, moeite, tip voor thuis), te printen of te delen =====
// Gebruikt alleen wat al op het apparaat staat; er worden geen nieuwe persoonsgegevens verzameld.
const THUISTIP = {
  getalbegrip:['Tel samen dingen in huis: traptreden, knopen, autos op straat. Tel ook terug en met sprongen van 2, 5 of 10.','Laat getallen op de kassabon of het nieuws hardop lezen en afronden: "ongeveer hoeveel is dat?"'],
  bewerkingen:['Speel een dobbelspel: gooi twee stenen en tel op of trek af. Wie het eerst het antwoord zegt, wint.','Reken boodschappen uit het hoofd uit: twee pakken van € 1,79, hoeveel samen? Eerst schatten, dan precies.'],
  breuken:['Verdeel samen een pizza of een reep: wat is de helft, een kwart, een derde? Wie krijgt meer?','Gebruik een maatbeker bij het bakken: hoeveel keer past ¼ liter in 1 liter?'],
  komma:['Lees prijzen samen: is € 2,50 meer of minder dan € 2,05? Waarom?','Weeg fruit in de winkel: 1,25 kg, hoeveel gram is dat?'],
  negatief:['Kijk samen naar de thermometer of het weerbericht: van −3 naar 4 graden, hoeveel warmer?','Praat over onder en boven nul: een lift met kelderverdiepingen is een mooie getallenlijn.'],
  vtabel:['Bij het koken: het recept is voor 4 personen, wij zijn met 6. Hoeveel van alles? Maak samen een tabelletje.','Vergelijk prijzen: 3 voor € 2 of 5 voor € 3, wat is voordeliger?'],
  schaal:['Zoek samen een route op de kaart en meet met een liniaal: hoeveel kilometer is het echt?','Snelheid in de auto of op de fiets: als we 15 km per uur fietsen, hoe lang doen we over 5 km?'],
  procent:['Kijk naar kortingen in folders: 25% korting op € 40, wat betaal je? Eerst 10% uitrekenen helpt.','Laat zien dat 50% de helft is en 25% een kwart, met een reep of een fles.'],
  pverandering:['Bekijk een prijs die stijgt: van € 2,00 naar € 2,20, hoeveel procent duurder?','Praat over btw op een bonnetje: wat is de prijs zonder btw?'],
  groei:['Spaarrente: als je elk jaar 2% rente krijgt, hoeveel heb je na 3 jaar? Reken het samen jaar voor jaar.','Bespreek groei van een plant of een filmpje dat viraal gaat: steeds een vast aantal erbij, of steeds keer iets?'],
  eenheden:['Meet samen in huis: hoe lang is de tafel in cm en in m? Hoeveel liter past in de emmer?','Weeg ingrediënten bij het bakken en reken om: 0,5 kg is hoeveel gram?'],
  tijd:['Laat je kind de klok kijken bij vaste momenten: hoe lang nog tot het eten? Hoe laat is het over een kwartier?','Gebruik de dienstregeling of een tv-gids: hoe lang duurt de rit of het programma?'],
  oppervlak:['Meet een kamer of een tuin op: hoeveel tegels of vierkante meter zijn het?','Teken op ruitjespapier vormen en tel de hokjes binnen en de rand eromheen.'],
  inhoud:['Vul samen bakjes met water en vergelijk: hoeveel bekers gaan erin?','Reken uit hoeveel liter in een aquarium of zwembadje past: lengte × breedte × hoogte.'],
  meetkunde:['Zoek vormen in huis: waar zie je een rechte hoek, een cirkel, een symmetrische vorm?','Bouw met blokken of lego na wat op een plaatje staat: hoe ziet het eruit van boven?'],
  tabellen:['Lees samen een tabel: de dienstregeling, een sportuitslag of een voedingsetiket.','Hou een week bij hoeveel minuten je kind buiten speelt, en maak er een tabel van.'],
  grafieken:['Teken samen een grafiek van de temperatuur van deze week. Wanneer was het het warmst?','Bekijk een grafiek in de krant of op het nieuws en vraag: wat zie je stijgen of dalen?'],
  formules:['Zoek patronen: 2, 4, 6, 8, wat komt daarna? Of bij een taxi: starttarief plus een bedrag per kilometer.','Maak een eigen regel: "zakgeld = 2 euro plus 50 cent per klusje". Hoeveel bij 5 klusjes?'],
  statistiek:['Bereken samen het gemiddelde van een paar cijfers of van de punten bij een spelletje.','Doe een kleine enquête in de familie en maak er een staafgrafiek van.'],
};
function weekBegin(d=new Date()){ const t=new Date(d.getFullYear(),d.getMonth(),d.getDate()); const dn=t.getDay()||7; t.setDate(t.getDate()-dn+1); return t.getTime() }
function ouderData(){
  const wb=weekBegin(); const n=S.niv;
  const geoefend=Object.entries(S.ld).filter(([id,x])=>LD[id]&&(x.u||x.l||0)>=wb).map(([id,x])=>({ld:LD[id],x}));
  const subs={}; geoefend.forEach(({ld,x})=>{ const k=ld.dom+'|'+ld.sub; (subs[k]=subs[k]||{dom:ld.dom,sub:ld.sub,b:[],n:0}).b.push(x.b); subs[k].n+=x.n||0 });
  const lijst=Object.values(subs).map(s=>Object.assign(s,{gem:Math.round(s.b.reduce((a,b)=>a+b,0)/s.b.length)}));
  const sterk=lijst.filter(s=>s.gem>=70).sort((a,b)=>b.gem-a.gem).slice(0,3);
  let moeite=lijst.filter(s=>s.gem<55).sort((a,b)=>a.gem-b.gem).slice(0,3);
  const fbNieuw=fbOpen().filter(([k,f])=>(f.t||0)>=wb);
  if(!moeite.length){ const m={}; fbOpen().forEach(([k])=>{ const l=LD[k]; const key=l.dom+'|'+l.sub; m[key]=m[key]||{dom:l.dom,sub:l.sub,gem:ldS(k).b,b:[],n:0} }); moeite=Object.values(m).slice(0,2) }
  const min=Math.round((S.week&&S.week[weekId()]||0)/60);
  return {n,min,geoefend:geoefend.length,sterk,moeite,fbNieuw:fbNieuw.length,dom:DOMEINEN.map(d=>({d,b:domB(n,d.id)}))};
}
function ouderTekst(o){
  const naam=S.naam.split(' ')[0];
  const r=[`Rekenen op Niveau · weekoverzicht van ${naam} (${S.klas}), week van ${new Date(weekBegin()).toLocaleDateString('nl-NL',{day:'numeric',month:'long'})}`,'',
    `Niveau ${o.n}${NIVEAUS[o.n-1]&&NIVEAUS[o.n-1].ref?' ('+NIVEAUS[o.n-1].ref+')':''}. Deze week ${o.min} minuten geoefend aan ${o.geoefend} onderwerpen.`,
    'Per domein: '+o.dom.map(x=>`${x.d.naam} ${x.b}%`).join(', ')+'.',''];
  r.push('Gaat goed: '+(o.sterk.length?o.sterk.map(s=>subVan(s.dom,s.sub).naam).join(', '):'nog niets duidelijk sterk deze week; meer oefenen helpt.'));
  r.push('Kost nog moeite: '+(o.moeite.length?o.moeite.map(s=>subVan(s.dom,s.sub).naam).join(', '):'niets opvallends.'));
  const tip=o.moeite[0]?THUISTIP[o.moeite[0].sub]:null; if(tip) r.push('','Tip voor thuis: '+tip[S.niv<=6?0:1]);
  return r.join('\n');
}
SCHERMEN.ouders=function(){
  const o=ouderData(), naam=esc(S.naam.split(' ')[0]);
  const tip=o.moeite[0]?THUISTIP[o.moeite[0].sub]:null;
  const chip=s=>`<li><b style="color:${DOM[s.dom].k}">${esc(subVan(s.dom,s.sub).naam)}</b> <span class="zacht">${esc(DOM[s.dom].naam)} · ${s.gem}%</span></li>`;
  return `<div class="wrap smal ouders"><div class="top"><h1>Voor ouders</h1><span class="chip">Week van ${new Date(weekBegin()).toLocaleDateString('nl-NL',{day:'numeric',month:'long'})}</span></div>
   <div class="kaart"><p style="margin-top:0">Dit is het weekoverzicht van <b>${naam}</b> (${esc(S.klas)}), nu op <b>niveau ${o.n}</b>${NIVEAUS[o.n-1]&&NIVEAUS[o.n-1].ref?' · '+esc(NIVEAUS[o.n-1].ref):''}.</p>
    <div class="statstrook"><div><b>${o.min}</b><span>minuten deze week</span></div><div><b>${o.geoefend}</b><span>onderwerpen geoefend</span></div><div><b>${o.fbNieuw}</b><span>nieuwe fouten om te herhalen</span></div></div>
    <div style="margin-top:14px">${o.dom.map(x=>`<div class="minirij"><span>${esc(x.d.kort||x.d.naam)}</span>${balk(x.b,x.d.k)}<b>${x.b}%</b></div>`).join('')}</div></div>
   <div class="kaart" style="margin-top:14px"><span class="eyebrow" style="color:var(--goed)">Gaat goed</span>${o.sterk.length?`<ul class="ouderlijst">${o.sterk.map(chip).join('')}</ul>`:`<p class="zacht">Deze week nog niets duidelijk sterk. Een paar korte oefenmomenten helpen al.</p>`}
    <span class="eyebrow" style="color:var(--fout);display:block;margin-top:14px">Kost nog moeite</span>${o.moeite.length?`<ul class="ouderlijst">${o.moeite.map(chip).join('')}</ul>`:`<p class="zacht">Niets opvallends.</p>`}</div>
   ${tip?`<div class="kaart" style="margin-top:14px"><span class="eyebrow" style="color:var(--knop)">Tip voor thuis</span><p>${esc(tip[S.niv<=6?0:1])}</p><p class="zacht klein">Kort en vaak werkt beter dan lang: tien minuten per dag is genoeg. Vraag vooral: "Hoe heb je dat bedacht?"</p></div>`:''}
   <div class="voet" style="justify-content:flex-start"><button class="knop" onclick="window.print()">Printen of als pdf bewaren</button><button class="knop zacht" onclick="ouderKopieer()">Tekst kopiëren</button><button class="knop zacht" onclick="go('home')">Terug</button></div></div>`;
};
function ouderKopieer(){ const t=ouderTekst(ouderData()); (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>melding('Gekopieerd. Plak het in een mail of app.')).catch(()=>{ prompt('Kopieer deze tekst:',t) }) }
