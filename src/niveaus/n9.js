// ===== Contextopgaven in rekentoetsstijl (alle niveaus) =====
// Echte rekentoetsopgaven: een bron (folder, tabel, dienstregeling) met méér informatie dan nodig,
// en een vraag die meerdere stappen combineert. Deze leerdoelen tellen mee in oefenen én rekentoets.
const bron = (titel,inhoud,sub) => `<div class="bron"><div class="bronkop">${titel}${sub?`<span>${sub}</span>`:''}</div>${inhoud}</div>`;
const bronTabel = (kop,rijen) => `<table class="brontab"><thead><tr>${kop.map(k=>`<th>${k}</th>`).join('')}</tr></thead><tbody>${rijen.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const sterren = n => '★'.repeat(n)+'☆'.repeat(5-n);
function winkel(r){ const p=r.shuffle(CTX.product.filter(x=>x[0]!=='fiets')).slice(0,3).map(x=>({n:x[0],p:r.pick(x[1]),s:r.int(3,5),lev:r.pick(['morgen in huis','2–3 werkdagen','op voorraad'])})); return p }
const winkelBron = (w,actie,gratis) => bron('🛒 Webshop SportZone',bronTabel(['Artikel','Prijs','Beoordeling','Levering'],w.map(x=>[x.n,eur(x.p),sterren(x.s),x.lev]))+`<p class="bronvoet">Verzendkosten € 4,95 · <b>gratis vanaf ${eur(gratis)}</b>${actie?` · <span class="actie">${actie}</span>`:''}</p>`);

// ---------- Webshop: N2 t/m N5 ----------
L({id:'X2.webshop',niv:2,dom:'G',sub:'bewerkingen',naam:'Toetsopgave: bestellen in een webshop',ctx:true,
  uitleg:'Lees eerst wat er gevraagd wordt en zoek dan alleen de informatie die je nodig hebt. Let op voorwaarden zoals "gratis verzending vanaf".',
  gen(r){ const w=winkel(r); return {w,g:r.pick([50,75,100])} },
  vraag:v=>`${winkelBron(v.w,'',v.g)}Je bestelt één ${v.w[0].n} en één ${v.w[1].n}. Wat betaal je in totaal, inclusief eventuele verzendkosten?`,
  antw:v=>{ const t=v.w[0].p+v.w[1].p; return rondaf(t+(t>=v.g?0:4.95),2) }, eenheid:'€',
  stappen:v=>{ const t=v.w[0].p+v.w[1].p; return [st(`Artikelen: ${v.w[0].p} + ${v.w[1].p} = ${t}`,t),st(t>=v.g?`${eur(t)} is ${eur(v.g)} of meer: gratis verzending`:`${eur(t)} is minder dan ${eur(v.g)}: + € 4,95`),st(`Totaal: ${eur(t+(t>=v.g?0:4.95),true)}`,rondaf(t+(t>=v.g?0:4.95),2))] },
  fouten:v=>{ const t=v.w[0].p+v.w[1].p; return [[t>=v.g?rondaf(t+4.95,2):t,t>=v.g?'Vanaf '+eur(v.g)+' is verzending gratis.':'Je vergat de verzendkosten.'],[rondaf(v.w[0].p+v.w[1].p+v.w[2].p+(v.w[0].p+v.w[1].p+v.w[2].p>=v.g?0:4.95),2),'Je telde ook het derde artikel mee.']] },
  anders:v=>`Streep in de folder door wat je niet nodig hebt (beoordeling, levertijd, het derde artikel). Wat overblijft: twee prijzen en de regel over verzendkosten.`
});
L({id:'X3.webshop',niv:3,dom:'V',sub:'procent',naam:'Toetsopgave: korting en verzendkosten',rm:true,ctx:true,verwar:['V3.korting'],
  uitleg:'Bereken eerst de korting, kijk dan pas of je boven de grens voor gratis verzending komt. De volgorde maakt uit.',
  gen(r){ let w,k,g; do{ w=winkel(r); k=r.pick([20,25,40,50]); g=r.pick([50,75,100]) }while((w[0].p*k)%100!==0); return {w,k,g} },
  vraag:v=>`${winkelBron(v.w,`Deze week ${v.k}% korting op ${v.w[0].n}`,v.g)}Je bestelt één ${v.w[0].n} en één ${v.w[1].n}. Wat betaal je in totaal?`,
  antw:v=>{ const t=v.w[0].p*(100-v.k)/100+v.w[1].p; return rondaf(t+(t>=v.g?0:4.95),2) }, eenheid:'€',
  stappen:v=>{ const a=v.w[0].p*(100-v.k)/100, t=a+v.w[1].p; return [st(`${v.w[0].n}: ${100-v.k}% van ${v.w[0].p} = ${nl(a)}`,rondaf(a,2)),st(`Samen: ${nl(a)} + ${v.w[1].p} = ${nl(t)}`,rondaf(t,2)),st(t>=v.g?`Vanaf ${eur(v.g)}: gratis verzending. Totaal ${eur(t,true)}`:`Onder ${eur(v.g)}: + € 4,95 = ${eur(t+4.95,true)}`,rondaf(t+(t>=v.g?0:4.95),2))] },
  fouten:v=>{ const a=v.w[0].p*(100-v.k)/100, t=a+v.w[1].p, z=v.w[0].p+v.w[1].p; return [[rondaf(t+(t>=v.g?4.95:0),2),t>=v.g?'Je komt boven '+eur(v.g)+', dus de verzending is gratis.':'Na de korting kom je onder '+eur(v.g)+'. Dan betaal je wel verzendkosten.'],[rondaf(z*(100-v.k)/100+(z*(100-v.k)/100>=v.g?0:4.95),2),'De korting geldt alleen voor de '+v.w[0].n+'.'],[rondaf(z+(z>=v.g?0:4.95),2),'Je vergat de korting.']] },
  anders:v=>`Werk in drie stappen: (1) nieuwe prijs van de ${v.w[0].n}, (2) optellen, (3) pas dan de regel voor verzendkosten toepassen.`
});
L({id:'X4.webshop',niv:4,dom:'V',sub:'procent',naam:'Toetsopgave: actie "2e halve prijs"',rm:true,ctx:true,verwar:['V3.korting'],
  uitleg:'Bij "2e halve prijs" krijg je de korting op het goedkoopste artikel, tenzij er iets anders staat. Lees de kleine lettertjes.',
  gen(r){ let w; do{ w=winkel(r) }while(w[0].p===w[1].p); return {w,g:r.pick([75,100,150])} },
  vraag:v=>`${winkelBron(v.w,'Actie: 2e artikel halve prijs (korting op het goedkoopste artikel)',v.g)}Je koopt één ${v.w[0].n} en één ${v.w[1].n}. Hoeveel procent korting krijg je in totaal op de artikelen? Rond af op 1 decimaal.`,
  antw:v=>{ const lo=Math.min(v.w[0].p,v.w[1].p),t=v.w[0].p+v.w[1].p; return rondaf(lo/2/t*100,1) }, eenheid:'%', dec:1,
  stappen:v=>{ const lo=Math.min(v.w[0].p,v.w[1].p),t=v.w[0].p+v.w[1].p; return [st(`Zonder actie: ${v.w[0].p} + ${v.w[1].p} = ${t}`,t),st(`Korting: helft van ${lo} = ${nl(lo/2)}`,lo/2),st(`${nl(lo/2)} : ${t} × 100 ≈ ${nl(rondaf(lo/2/t*100,1))}%`,rondaf(lo/2/t*100,1))] },
  fouten:v=>{ const lo=Math.min(v.w[0].p,v.w[1].p),hi=Math.max(v.w[0].p,v.w[1].p),t=lo+hi; return [[50,'Je krijgt 50% op één artikel, niet op allebei.'],[25,'25% klopt alleen als beide artikelen even duur zijn.'],[rondaf(hi/2/t*100,1),'De korting is op het goedkoopste artikel.']].filter(x=>x[0]!==rondaf(lo/2/t*100,1)) },
  anders:v=>`Reken eerst in euro: wat had je zonder actie betaald en hoeveel euro korting krijg je? Daarna: korting : oorspronkelijk × 100.`
});
L({id:'X5.webshop',niv:5,dom:'V',sub:'pverandering',naam:'Toetsopgave: kortingscode en btw',rm:true,ctx:true,verwar:['V6.btwexcl','V5.tweekortingen'],
  uitleg:'In webshops staan prijzen inclusief btw. Een zakelijke klant (bijvoorbeeld de school) wil de prijs zonder btw weten: deel door 1,21.',
  gen(r){ const w=winkel(r); return {w,k:r.pick([10,15,20]),n:r.pick([5,10,12,15])} },
  vraag:v=>`${winkelBron(v.w,`Kortingscode SCHOOL${v.k}: ${v.k}% op je hele bestelling`,100)}De sportsectie bestelt ${v.n} keer een ${v.w[1].n} met de kortingscode. Alle prijzen zijn inclusief 21% btw. Hoeveel is de bestelling <b>zonder</b> btw? Rond af op centen.`,
  antw:v=>rondaf(v.n*v.w[1].p*(100-v.k)/100/1.21,2), eenheid:'€',
  stappen:v=>{ const t=v.n*v.w[1].p, k=t*(100-v.k)/100; return [st(`${v.n} × ${v.w[1].p} = ${t}`,t),st(`Na ${v.k}% korting: ${nl((100-v.k)/100)} × ${t} = ${nl(k)} (incl. btw, gratis verzending)`,rondaf(k,2)),st(`Zonder btw: ${nl(k)} : 1,21 ≈ ${eur(k/1.21,true)}`,rondaf(k/1.21,2))] },
  fouten:v=>{ const k=v.n*v.w[1].p*(100-v.k)/100; return [[rondaf(k*0.79,2),'21% eraf halen klopt niet: de btw is 21% van de prijs zónder btw. Deel door 1,21.'],[rondaf(k,2),'Dat is inclusief btw.'],[rondaf(v.n*v.w[1].p/1.21,2),'Je vergat de kortingscode.']] },
  anders:v=>`Maak een strook: prijs zonder btw = 100%, met btw = 121%. Je weet de 121%. Hoeveel is 1%? En 100%?`
});
// ---------- Reizen: N2 en N4 ----------
L({id:'X2.bus',niv:2,dom:'M',sub:'tijd',naam:'Toetsopgave: welke bus moet je nemen?',ctx:true,
  uitleg:'Reken terug vanaf de tijd dat je er moet zijn. Tel alle stukken op: lopen, de rit en weer lopen.',
  gen(r){ const s=r.pick([7*60+32,7*60+37,7*60+42]),q=15; const ritten=[0,1,2,3].map(i=>s+i*q); const rit=r.pick([14,18,22,25]),loop=r.pick([4,6,8]); const begin=8*60+30; const ok=ritten.filter(t=>t+rit+loop<=begin); return {ritten,rit,loop,begin,laatste:ok[ok.length-1],lijn:r.pick([5,12,73,105])} },
  vraag:v=>`${bron('🚌 Lijn '+v.lijn+' · richting Centrum',bronTabel(['Halte','Vertrek'],[['Dorpsplein',v.ritten.map(tijdStr).join(' · ')]])+`<p class="bronvoet">Reistijd Dorpsplein → halte School: ${v.rit} minuten · Wifi aan boord · Ritprijs € 1,20</p>`)}Van halte School loop je nog ${v.loop} minuten naar school. De les begint om ${tijdStr(v.begin)}. Welke bus is de laatste waarmee je op tijd bent?`,
  opties:v=>v.ritten.slice().reverse().map(t=>[tijdStr(t),t===v.laatste,t>v.laatste?`Met deze bus ben je pas om ${tijdStr(t+v.rit+v.loop)} op school.`:'Die is op tijd, maar er is een latere bus die ook op tijd is.']),
  stappen:v=>[st(`Op school uiterlijk ${tijdStr(v.begin)}`),st(`Terugrekenen: ${v.rit} + ${v.loop} = ${v.rit+v.loop} minuten onderweg`,v.rit+v.loop),st(`Bus van ${tijdStr(v.laatste)}: aankomst school ${tijdStr(v.laatste+v.rit+v.loop)}`)],
  anders:v=>`Probeer elke bus: vertrektijd + ${v.rit} + ${v.loop} minuten. Welke is het laatst, maar nog vóór ${tijdStr(v.begin)}?`
});
L({id:'X4.reis',niv:4,dom:'M',sub:'tijd',naam:'Toetsopgave: reis met overstap',ctx:true,verwar:['M4.snelheid'],
  uitleg:'Bij een overstap tel je ook de wachttijd mee. Zet alle tijden onder elkaar: vertrek, aankomst, wachten, vertrek, aankomst.',
  gen(r){ const v1=r.pick([9*60+4,9*60+14,9*60+24]),r1=r.pick([23,27,31]),ov=r.pick([4,6]); const t2=[0,1,2,3].map(i=>v1+r1+r.pick([1,2])+i*15); const r2=r.pick([18,24,35]); const aank1=v1+r1; const v2=t2.find(t=>t>=aank1+ov); return {v1,r1,ov,t2,r2,v2,aank1,stad:r.pick(CTX.stad)} },
  vraag:v=>`${bron('🚆 Reisplanner',bronTabel(['Trein','Vertrek','Aankomst','Spoor'],[[`Sprinter naar ${v.stad[0]}`,tijdStr(v.v1),tijdStr(v.aank1),'3a'],[`Intercity naar ${v.stad[1]}`,v.t2.map(tijdStr).join(' · '),`${v.r2} min rijden`,'7']])+`<p class="bronvoet">Overstaptijd op het station: minimaal ${v.ov} minuten · 1e klas toeslag € 8,50</p>`)}Je neemt de sprinter van ${tijdStr(v.v1)} en stapt over op de eerste intercity die je kunt halen. Hoeveel minuten duurt je hele reis?`,
  antw:v=>v.v2+v.r2-v.v1, eenheid:'minuten',
  stappen:v=>[st(`Aankomst sprinter: ${tijdStr(v.aank1)}`),st(`Overstap ${v.ov} min: eerste intercity om ${tijdStr(v.v2)}`),st(`Aankomst: ${tijdStr(v.v2)} + ${v.r2} = ${tijdStr(v.v2+v.r2)}`),st(`Reistijd: ${tijdStr(v.v1)} → ${tijdStr(v.v2+v.r2)} = ${v.v2+v.r2-v.v1} minuten`,v.v2+v.r2-v.v1)],
  fouten:v=>[[v.r1+v.r2,'Je vergat de wachttijd bij de overstap.'],[v.r1+v.ov+v.r2,'De intercity vertrekt niet precies na je overstaptijd. Kijk in de tabel wanneer hij gaat.'],[v.t2[0]+v.r2-v.v1===v.v2+v.r2-v.v1?v.v2+15+v.r2-v.v1:v.t2[0]+v.r2-v.v1,'Die intercity haal je niet: je hebt '+v.ov+' minuten nodig om over te stappen.']],
  anders:v=>`Maak een tijdlijn: ${tijdStr(v.v1)} vertrek → ${tijdStr(v.aank1)} aankomst → + ${v.ov} min lopen → welke intercity daarna? → + ${v.r2} min.`
});
// ---------- Kamp: N2 en N3 ----------
const kampRecept=[['spaghetti',100,'g',500,1.29],['gehakt',125,'g',500,4.49],['tomatensaus',150,'ml',500,1.79],['geraspte kaas',30,'g',200,2.19]];
L({id:'X3.kamp',niv:3,dom:'V',sub:'vtabel',naam:'Toetsopgave: boodschappen voor het kamp',rm:true,ctx:true,verwar:['V4.recept'],
  uitleg:'Reken eerst uit hoeveel je in totaal nodig hebt. Je kunt alleen hele pakken kopen: rond dus naar boven af.',
  gen(r){ const i=r.int(0,3); let n; do{ n=r.int(18,64) }while((n*kampRecept[i][1])%kampRecept[i][3]===0); return {i,n} },
  vraag:v=>{ const x=kampRecept[v.i]; return `${bron('🏕️ Kampmenu dag 2: spaghetti bolognese','<p>Per persoon:</p>'+bronTabel(['Ingrediënt','Per persoon','Verpakking','Prijs'],kampRecept.map(y=>[y[0],y[1]+' '+y[2],y[3]+' '+y[2],eur(y[4],true)]))+'<p class="bronvoet">Kookploeg: 4 leerlingen · Eten om 18:00 · Afwas: tent 2</p>')}Er gaan ${v.n} leerlingen en begeleiders mee. Wat kost de ${x[0]} voor het hele kamp?` },
  antw:v=>{ const x=kampRecept[v.i]; return rondaf(Math.ceil(v.n*x[1]/x[3])*x[4],2) }, eenheid:'€',
  stappen:v=>{ const x=kampRecept[v.i],tot=v.n*x[1],p=Math.ceil(tot/x[3]); return [st(`Nodig: ${v.n} × ${x[1]} = ${tot} ${x[2]}`,tot),st(`Pakken: ${tot} : ${x[3]} = ${nl(rondaf(tot/x[3],2))}, dus ${p} pakken (naar boven)`,p),st(`Kosten: ${p} × ${nl(x[4])} = ${eur(p*x[4],true)}`,rondaf(p*x[4],2))] },
  fouten:v=>{ const x=kampRecept[v.i],tot=v.n*x[1]; return [[rondaf(Math.floor(tot/x[3])*x[4],2),'Je rondde naar beneden af. Dan heb je te weinig: koop een pak extra.'],[rondaf(tot/x[3]*x[4],2),'Je kunt geen deel van een pak kopen.'],[rondaf(v.n*x[4],2),'Niet iedereen krijgt een heel pak.']] },
  anders:v=>`Maak een verhoudingstabel: 1 persoon → ${kampRecept[v.i][1]} ${kampRecept[v.i][2]}, ${v.n} personen → ? Hoeveel pakken van ${kampRecept[v.i][3]} ${kampRecept[v.i][2]} heb je dan minstens nodig?`
});
// ---------- Abonnementen: N4 en N5 ----------
const BUNDELS=[['Basic',8,2,20],['Plus',12,5,10],['Unlimited',17,99,0]];
const bundelKost=(b,u)=>b[1]+Math.max(0,u-b[2])*3;
L({id:'X4.bundel',niv:4,dom:'B',sub:'tabellen',naam:'Toetsopgave: het goedkoopste abonnement',rm:true,ctx:true,verwar:['B6.snijpunt'],
  uitleg:'Reken voor elk abonnement uit wat het jou kost bij jouw gebruik. Het goedkoopste per maand is niet altijd het abonnement met de laagste maandprijs.',
  gen(r){ return {u:r.int(3,8),j:r.ja()} },
  vraag:v=>`${bron('📱 Sim-only abonnementen',bronTabel(['Bundel','Per maand','Data','Extra data','Aansluitkosten'],BUNDELS.map(b=>[b[0],eur(b[1]),b[2]>50?'onbeperkt':b[2]+' GB','€ 3,- per GB',eur(b[3])]))+'<p class="bronvoet">Onbeperkt bellen en sms’en bij alle bundels · 5G inbegrepen · Maandelijks opzegbaar</p>')}Je gebruikt elke maand ${v.u} GB. ${v.j?'Wat kost het goedkoopste abonnement voor jou in het eerste jaar, inclusief aansluitkosten?':'Wat kost het goedkoopste abonnement voor jou per maand?'}`,
  antw:v=>Math.min(...BUNDELS.map(b=>v.j?bundelKost(b,v.u)*12+b[3]:bundelKost(b,v.u))), eenheid:'€',
  stappen:v=>[...BUNDELS.map(b=>st(`${b[0]}: ${b[1]}${b[2]<v.u?` + ${v.u-b[2]} × 3`:''} = ${bundelKost(b,v.u)} per maand${v.j?`, jaar: ${bundelKost(b,v.u)} × 12 + ${b[3]} = ${bundelKost(b,v.u)*12+b[3]}`:''}`,v.j?bundelKost(b,v.u)*12+b[3]:bundelKost(b,v.u))),st(`Goedkoopst: ${eur(Math.min(...BUNDELS.map(b=>v.j?bundelKost(b,v.u)*12+b[3]:bundelKost(b,v.u))))}`,Math.min(...BUNDELS.map(b=>v.j?bundelKost(b,v.u)*12+b[3]:bundelKost(b,v.u))))],
  fouten:v=>[[v.j?8*12+20:8,'Basic heeft de laagste maandprijs, maar met '+v.u+' GB betaal je extra data.'],...BUNDELS.map(b=>[v.j?bundelKost(b,v.u)*12:bundelKost(b,v.u)*12,v.j?'Vergeet de aansluitkosten niet.':'Dat is per jaar. De vraag is per maand.'])],
  anders:v=>({tekst:'Zet het in een tabel: maandprijs + extra data'+(v.j?', × 12 + aansluitkosten':'')+'.',tabel:{kop:['Bundel','Per maand bij '+v.u+' GB'],rijen:BUNDELS.map(b=>[b[0],'?'])}})
});
// ---------- Sport: N5 t/m N7 ----------
L({id:'X5.hardlopen',niv:5,dom:'M',sub:'tijd',naam:'Toetsopgave: snelheid uit een uitslagenlijst',rm:true,ctx:true,dec:1,verwar:['M5.kmums','V3.snelheid'],
  uitleg:'Snelheid in km/u = afstand in km : tijd in uren. Zet de tijd eerst om naar uren (minuten : 60). Pas op met seconden.',
  gen(r){ const d=r.pick([5,10,21.1]); const lopers=r.shuffle(NAMEN).slice(0,4).map(n=>({n,t:Math.round(d*r.int(42,70)/10)*1})); return {d,lopers,wie:r.int(0,3)} },
  vraag:v=>`${bron('🏃 Uitslag Stadsloop · '+nl(v.d)+' km',bronTabel(['Plaats','Naam','Tijd (min)','Leeftijd'],v.lopers.slice().sort((a,b)=>a.t-b.t).map((x,i)=>[i+1,x.n,x.t,14+((x.t+i)%5)]))+'<p class="bronvoet">Start 10:00 · Temperatuur 14 °C · Drankpost bij elke 2,5 km</p>')}Wat was de gemiddelde snelheid van ${v.lopers[v.wie].n} in km/u? Rond af op 1 decimaal.`,
  antw:v=>rondaf(v.d/(v.lopers[v.wie].t/60),1), eenheid:'km/u',
  stappen:v=>{ const t=v.lopers[v.wie].t; return [st(`Tijd: ${t} min = ${t} : 60 ≈ ${nl(rondaf(t/60,4))} uur`,rondaf(t/60,4)),st(`${nl(v.d)} : ${nl(rondaf(t/60,4))} ≈ ${nl(rondaf(v.d/(t/60),1))} km/u`,rondaf(v.d/(t/60),1))] },
  fouten:v=>{ const t=v.lopers[v.wie].t; return [[rondaf(v.d/t,1)||rondaf(v.d/t*10,1),'Je deelde door minuten. km/u betekent: per uur.'],[rondaf(v.d/(t/100),1),'Een uur heeft 60 minuten, niet 100.'],[rondaf(t/v.d,1),'Dat zijn minuten per km. De vraag is km per uur.']] },
  anders:v=>`Verhoudingstabel: ${v.lopers[v.wie].t} minuten → ${nl(v.d)} km. 60 minuten → ? km.`
});
L({id:'X6.record',niv:6,dom:'V',sub:'pverandering',naam:'Toetsopgave: hoeveel procent sneller?',rm:true,ctx:true,dec:1,verwar:['V4.procentverandering','G8.afwijking'],
  uitleg:'Procentuele verandering = (nieuw − oud) : oud × 100%. Bij tijden: een kortere tijd is een verbetering. Werk in één eenheid (bijvoorbeeld seconden).',
  gen(r){ const ou=r.int(150,330),dv=r.int(5,25); const sp=r.pick(['800 m hardlopen','200 m vrije slag zwemmen','1000 m schaatsen','3 km fietsen (tijdrit)']); return {ou,nu:ou-dv,dv,sp} },
  vraag:v=>`${bron('⏱️ Persoonlijke records · '+v.sp,bronTabel(['Seizoen','Tijd','Wedstrijd','Plaats in uitslag'],[['vorig seizoen',`${Math.floor(v.ou/60)}:${String(v.ou%60).padStart(2,'0')}`,'Clubkampioenschap','4e'],['dit seizoen',`${Math.floor(v.nu/60)}:${String(v.nu%60).padStart(2,'0')}`,'Regiofinale','2e']])+'<p class="bronvoet">Tijden in minuten:seconden</p>')}Met hoeveel procent is de tijd verbeterd? Rond af op 1 decimaal.`,
  antw:v=>rondaf(v.dv/v.ou*100,1), eenheid:'%',
  stappen:v=>[st(`Oud: ${v.ou} s, nieuw: ${v.nu} s`,v.ou),st(`Verschil: ${v.dv} s`,v.dv),st(`${v.dv} : ${v.ou} × 100 ≈ ${nl(rondaf(v.dv/v.ou*100,1))}%`,rondaf(v.dv/v.ou*100,1))],
  fouten:v=>[[rondaf(v.dv/v.nu*100,1),'Deel door de oude tijd, niet door de nieuwe.'],[v.dv,'Dat is het verschil in seconden, geen percentage.'],[rondaf((Math.floor(v.ou/60)+(v.ou%60)/100-Math.floor(v.nu/60)-(v.nu%60)/100)/(Math.floor(v.ou/60)+(v.ou%60)/100)*100,1),'Je rekende met 3:25 als 3,25. Een minuut heeft 60 seconden: reken alles om naar seconden.']],
  anders:v=>`Zet beide tijden om naar seconden (minuten × 60 + seconden). Hoeveel seconden is er afgegaan, en welk deel is dat van de oude tijd?`
});
// ---------- Energie: N6 t/m N8 ----------
const APPARATEN=[['gameconsole',150],['laptop',60],['koelkast',100],['tv',120],['bureaulamp (gloeilamp)',60],['elektrische kachel',1500]];
L({id:'X6.energie',niv:6,dom:'M',sub:'eenheden',naam:'Toetsopgave: energiekosten van apparaten',rm:true,ctx:true,verwar:['M8.verbruik'],
  uitleg:'Energie in kWh = vermogen in kW × tijd in uren. 1 kW = 1000 W. Kosten = kWh × prijs per kWh.',
  gen(r){ const a=r.pick(APPARATEN); return {a,u:r.pick([1.5,2,3,4,5]),p:r.pick([0.25,0.3,0.35,0.4]),d:r.pick([7,30,365])} },
  vraag:v=>`${bron('⚡ Energielabel en tarief',bronTabel(['Apparaat','Vermogen','Energieklasse'],APPARATEN.slice(0,4).concat([v.a]).filter((x,i,s)=>s.indexOf(x)===i).map(x=>[x[0],x[1]+' W',x[1]>500?'G':x[1]>100?'D':'B']))+`<p class="bronvoet">Stroomprijs: ${eur(v.p,true)} per kWh · Vastrecht € 6,50 per maand</p>`)}Een ${v.a[0]} staat ${nl(v.u)} uur per dag aan. Wat kost de stroom daarvan in ${v.d===7?'een week':v.d===30?'30 dagen':'een jaar (365 dagen)'}? Rond af op centen.`,
  antw:v=>rondaf(v.a[1]/1000*v.u*v.d*v.p,2), eenheid:'€',
  stappen:v=>[st(`${v.a[1]} W = ${nl(v.a[1]/1000)} kW`,v.a[1]/1000),st(`Per dag: ${nl(v.a[1]/1000)} × ${nl(v.u)} = ${nl(v.a[1]/1000*v.u)} kWh`,rondaf(v.a[1]/1000*v.u,4)),st(`${v.d} dagen: ${nl(rondaf(v.a[1]/1000*v.u*v.d,4))} kWh`,rondaf(v.a[1]/1000*v.u*v.d,4)),st(`× ${nl(v.p)} = ${eur(v.a[1]/1000*v.u*v.d*v.p,true)}`,rondaf(v.a[1]/1000*v.u*v.d*v.p,2))],
  fouten:v=>[[rondaf(v.a[1]*v.u*v.d*v.p,2),'Je rekende met watt in plaats van kilowatt. 1 kW = 1000 W.'],[rondaf(v.a[1]/1000*v.u*v.d*v.p+6.5*(v.d/30),2),'Het vastrecht betaal je toch al, het hoort niet bij dit apparaat.'],[rondaf(v.a[1]/1000*v.d*v.p,2),'Vergeet het aantal uur per dag niet.']],
  anders:v=>`kWh betekent: kilowatt × uur. Een apparaat van 1000 W dat 1 uur aan staat, gebruikt 1 kWh.`
});
L({id:'X8.terugverdien',niv:8,dom:'B',sub:'formules',naam:'Toetsopgave: terugverdientijd',rm:true,ctx:true,dec:1,verwar:['B8.breakeven'],
  uitleg:'Terugverdientijd = extra aanschafprijs : besparing per jaar. Reken de besparing eerst uit in euro per jaar.',
  gen(r){ const w1=r.pick([100,150,200]),w2=r.pick([20,30,40]),u=r.pick([3,4,5,6]),p=r.pick([0.3,0.35,0.4]),x=r.pick([60,80,100,120]); const b=rondaf((w1-w2)/1000*u*365*p,2); return {w1,w2,u,p,x,b,c:r.pick([['oude koelkast','zuinige koelkast'],['oude tv','nieuwe led-tv'],['oude pc','zuinige laptop']])} },
  vraag:v=>`${bron('💡 Vergelijking',bronTabel(['','Vermogen','Aanschaf','Garantie'],[[v.c[0],v.w1+' W','al in huis','verlopen'],[v.c[1],v.w2+' W',eur(v.x),'5 jaar']])+`<p class="bronvoet">Stroomprijs ${eur(v.p,true)} per kWh · Gebruik: ${v.u} uur per dag, 365 dagen per jaar</p>`)}Na hoeveel jaar heb je de aanschaf van de ${v.c[1]} terugverdiend door de lagere stroomkosten? Rond af op 1 decimaal.`,
  antw:v=>rondaf(v.x/v.b,1), eenheid:'jaar',
  stappen:v=>[st(`Verschil: ${v.w1} − ${v.w2} = ${v.w1-v.w2} W = ${nl((v.w1-v.w2)/1000)} kW`,(v.w1-v.w2)/1000),st(`Per jaar: ${nl((v.w1-v.w2)/1000)} × ${v.u} × 365 = ${nl(rondaf((v.w1-v.w2)/1000*v.u*365,3))} kWh`,rondaf((v.w1-v.w2)/1000*v.u*365,3)),st(`Besparing: × ${nl(v.p)} = ${eur(v.b,true)} per jaar`,v.b),st(`${v.x} : ${nl(v.b)} ≈ ${nl(rondaf(v.x/v.b,1))} jaar`,rondaf(v.x/v.b,1))],
  fouten:v=>[[rondaf(v.x/(v.w2/1000*v.u*365*v.p),1),'Je rekende met het verbruik van het nieuwe apparaat. Het gaat om het verschil.'],[rondaf(v.x/(v.b/365),1),'Dat zijn dagen, geen jaren.'],[rondaf(v.b/v.x,1),'Je deelde omgekeerd: aanschafprijs : besparing per jaar.']],
  anders:v=>`Hoeveel euro bespaar je per jaar? Hoe vaak past dat bedrag in ${eur(v.x)}?`
});
// ---------- Afbetalen: N7 ----------
L({id:'X7.afbetalen',niv:7,dom:'V',sub:'procent',naam:'Toetsopgave: contant of op afbetaling?',rm:true,ctx:true,dec:1,verwar:['V4.procentverandering'],
  uitleg:'Tel bij afbetaling alles op: aanbetaling + alle termijnen. Vergelijk met de contante prijs: extra : contant × 100%.',
  gen(r){ const P=r.pick([599,699,799,899,1049]),A=r.pick([0,49,99]),n=r.pick([12,18,24]),T=r.pick([25,29,35,39,45,49]); return (A+n*T>P*1.03&&A+n*T<P*1.6)?{P,A,n,T,d:r.pick(['smartphone','laptop','e-bike','gameconsole'])}:{P:699,A:49,n:24,T:29,d:'smartphone'} },
  vraag:v=>`${bron('🏷️ '+v.d.charAt(0).toUpperCase()+v.d.slice(1)+' – deze maand in de aanbieding',`<p><b>Contant: ${eur(v.P)}</b></p><p>Of op afbetaling: ${v.A?eur(v.A)+' aanbetaling en ':''}${v.n} × ${eur(v.T)} per maand</p><p class="bronvoet">Inclusief 2 jaar garantie · Gratis bezorging · Kleur: zwart of zilver · Geld lenen kost geld</p>`)}Hoeveel procent betaal je bij afbetaling meer dan contant? Rond af op 1 decimaal.`,
  antw:v=>rondaf((v.A+v.n*v.T-v.P)/v.P*100,1), eenheid:'%',
  stappen:v=>[st(`Afbetaling totaal: ${v.A} + ${v.n} × ${v.T} = ${v.A+v.n*v.T}`,v.A+v.n*v.T),st(`Extra: ${v.A+v.n*v.T} − ${v.P} = ${v.A+v.n*v.T-v.P}`,v.A+v.n*v.T-v.P),st(`${v.A+v.n*v.T-v.P} : ${v.P} × 100 ≈ ${nl(rondaf((v.A+v.n*v.T-v.P)/v.P*100,1))}%`,rondaf((v.A+v.n*v.T-v.P)/v.P*100,1))],
  fouten:v=>[[rondaf((v.A+v.n*v.T-v.P)/(v.A+v.n*v.T)*100,1),'Deel door de contante prijs (het oude bedrag), niet door het totaal bij afbetaling.'],...(v.A?[[rondaf((v.n*v.T-v.P)/v.P*100,1),'Je vergat de aanbetaling.']]:[]),[v.A+v.n*v.T-v.P,'Dat is het extra bedrag in euro, geen percentage.']].filter(x=>x[0]>0),
  anders:v=>`Bereken eerst wat je in totaal kwijt bent bij afbetaling. Hoeveel euro is dat meer dan ${eur(v.P)}? Welk deel van ${eur(v.P)} is dat?`
});
// ---------- Grafiek met twee lijnen: N7 ----------
L({id:'X7.tweelijnen',niv:7,dom:'B',sub:'grafieken',naam:'Toetsopgave: twee grafieken vergelijken',ctx:true,verwar:['B3.tweelijnen','B6.snijpunt'],
  uitleg:'Bij twee lijnen in één grafiek: lees bij dezelfde waarde op de horizontale as beide lijnen af en vergelijk. Het snijpunt is waar ze even groot zijn.',
  gen(r){ const a1=r.pick([0,10,20]),b1=r.pick([4,5,6]),a2=r.pick([40,50,60]),b2=r.pick([1,2]); const x0=(a2-a1)/(b1-b2); return Number.isInteger(x0)&&x0<=20&&x0>0?{a1,b1,a2,b2,x0,c:r.pick([['Klimhal Boulder','Klimhal Vertical'],['Zwembad De Wiel','Sportfondsenbad']])}:{a1:0,b1:5,a2:40,b2:3,x0:20,c:['Klimhal Boulder','Klimhal Vertical']} },
  vraag:v=>`De kosten van een jaar sporten bij twee aanbieders (lijn A: ${v.c[0]}, lijn B: ${v.c[1]}). A rekent € ${v.b1} per bezoek${v.a1?` plus ${eur(v.a1)} inschrijfgeld`:''}, B rekent ${eur(v.a2)} lidmaatschap plus € ${v.b2} per bezoek. Vanaf hoeveel bezoeken is B goedkoper dan A?`,
  fig:v=>FIG.grafiek([{punten:[[0,v.a1],[30,v.a1+30*v.b1]],k:'a',label:'A'},{punten:[[0,v.a2],[30,v.a2+30*v.b2]],k:'b',label:'B'}],{xmax:30,xs:5,ymax:Math.ceil((v.a1+30*v.b1)/50)*50,ys:25,xl:'aantal bezoeken',yl:'kosten (€)'}),
  antw:v=>v.x0+1, eenheid:'bezoeken',
  stappen:v=>[st(`Even duur: ${v.a1} + ${v.b1}x = ${v.a2} + ${v.b2}x`),st(`Verschil per bezoek ${v.b1-v.b2}, verschil vast ${v.a2-v.a1}: ${v.a2-v.a1} : ${v.b1-v.b2} = ${v.x0}`,v.x0),st(`Bij ${v.x0} even duur, vanaf ${v.x0+1} is B goedkoper`,v.x0+1)],
  fouten:v=>[[v.x0,'Bij '+v.x0+' bezoeken zijn ze even duur. Pas daarna is B goedkoper.'],[v.a2-v.a1,'Deel het verschil in vaste kosten nog door het verschil per bezoek.'],[v.x0-1,'Bij minder bezoeken is A juist goedkoper.']],
  anders:v=>`Maak een tabel voor 0, 5, 10, … bezoeken met de kosten van A en B. Waar wisselen ze van plek?`
});
