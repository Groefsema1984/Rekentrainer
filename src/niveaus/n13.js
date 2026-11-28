// ===== Uitbreiding niveau 6 t/m 12: onderdelen die per niveau nog ontbraken =====
// Elk leerdoel heeft afleiders met een echte denkfout. Toetsopgaven (ctx) lijken op de doorstroomtoets en de rekentoets.

// ================= NIVEAU 6 (groep 8, 1S) =================
L({id:'G06.midden',niv:6,dom:'G',sub:'getalbegrip',naam:'Welk getal ligt precies in het midden?',
  uitleg:'Het midden tussen twee getallen vind je door ze op te tellen en te delen door 2. Of: neem de helft van het verschil en tel die bij het kleinste getal op.',
  gen(r){ const s=r.pick([[1,0.1],[1,0.5],[10,1],[100,10]]); let a,b; do{ a=r.int(2,40)*s[1]; b=a+r.int(1,12)*2*s[1] }while(b===a); return {a:rondaf(a,2),b:rondaf(b,2)} },
  vraag:v=>`Welk getal ligt op de getallenlijn precies in het midden tussen ${nl(v.a)} en ${nl(v.b)}?`,
  fig:v=>FIG.lijn(v.a,v.b,rondaf((v.b-v.a)/2,4),[{x:v.a,label:nl(v.a)},{x:v.b,label:nl(v.b)},{x:(v.a+v.b)/2,label:'?',k:'b'}],100),
  antw:v=>rondaf((v.a+v.b)/2,4),
  stappen:v=>[st(`Verschil: ${nl(v.b)} − ${nl(v.a)} = ${nl(rondaf(v.b-v.a,4))}`,rondaf(v.b-v.a,4)),st(`Helft daarvan: ${nl(rondaf((v.b-v.a)/2,4))}`,rondaf((v.b-v.a)/2,4)),st(`${nl(v.a)} + ${nl(rondaf((v.b-v.a)/2,4))} = ${nl(rondaf((v.a+v.b)/2,4))}`,rondaf((v.a+v.b)/2,4))],
  fouten:v=>[[rondaf((v.b-v.a)/2,4),'Dat is de helft van het verschil. Tel die nog bij '+nl(v.a)+' op.'],[rondaf(v.a+v.b,4),'Je telde op, maar vergat te delen door 2.'],[rondaf(v.b-v.a,4),'Dat is de afstand tussen de getallen, niet het midden.']],
  anders:v=>`Ga vanaf ${nl(v.a)} en vanaf ${nl(v.b)} even grote stappen naar elkaar toe tot je elkaar raakt.`
});
L({id:'G06.rood',niv:6,dom:'G',sub:'negatief',naam:'Rood staan: negatieve bedragen',negatief:true,
  uitleg:'Sta je rood, dan heb je een negatief saldo: je hebt geld geleend van de bank. −€ 15 en je stort € 40: eerst 15 terug naar 0, dan blijft er 25 over.',
  gen(r){ const a=r.int(5,60),b=r.int(10,90),op=r.pick(['storten','betalen']); return {a,b,op,d:r.pick(['een concertkaartje','nieuwe oordopjes','een treinkaartje','een cadeau'])} },
  vraag:v=>v.op==='storten'?`Je saldo is −€ ${v.a}: je staat rood. Je krijgt € ${v.b} op je rekening. Wat is je saldo dan?`:`Je saldo is −€ ${v.a}: je staat al rood. Je betaalt € ${v.b} voor ${v.d}. Wat is je saldo dan?`,
  antw:v=>v.op==='storten'?v.b-v.a:-v.a-v.b, eenheid:'€',
  stappen:v=>v.op==='storten'?[st(`−${v.a} + ${v.b}`),st(`= ${v.b-v.a<0?'−'+(v.a-v.b):v.b-v.a}`,v.b-v.a)]:[st(`−${v.a} − ${v.b}`),st(`= −${v.a+v.b}`,-v.a-v.b)],
  fouten:v=>v.op==='storten'?[[v.a+v.b,'Je telde het rood staan erbij. Dat geld moet je juist eerst terugbetalen.'],[v.a-v.b,'Let op het teken: kom je boven 0 of blijf je eronder?'],[-v.a-v.b,'Je trok het bedrag af. Er komt geld bij.']]:[[v.b-v.a,'Je telde het bedrag op. Betalen gaat eraf.'],[-(Math.abs(v.b-v.a)),'Je trok de bedragen van elkaar af. Je staat al rood: het wordt nog meer min.'],[v.a+v.b,'Het saldo is negatief: vergeet het minteken niet.']],
  anders:v=>`Denk aan een thermometer of getallenlijn. Begin bij −${v.a} en ga ${v.b} stappen ${v.op==='storten'?'naar rechts':'naar links'}.`
});
L({id:'V06.procentstijging',niv:6,dom:'V',sub:'pverandering',naam:'Hoeveel procent duurder?',verwar:['V2.procent'],
  uitleg:'Procent erbij reken je altijd uit ten opzichte van de oude prijs. Van € 20 naar € 25 is € 5 erbij. 5 van de 20 is 25%.',
  gen(r){ let o,p; do{ o=r.pick([4,8,10,12,20,40,50,80]); p=r.pick([10,20,25,50,75,100]) }while((o*p)%100); return {o,p,n:o*(100+p)/100,d:r.pick(['Een bioscoopkaartje','Een zak chips','Een abonnement op een app','Een pizza'])} },
  vraag:v=>`${v.d} kostte eerst ${eur(v.o)}. Nu kost het ${eur(v.n)}. Met hoeveel procent is de prijs gestegen?`,
  antw:v=>v.p, eenheid:'%',
  stappen:v=>[st(`Erbij: ${eur(v.n)} − ${eur(v.o)} = ${eur(v.n-v.o)}`,v.n-v.o),st(`${nl(v.n-v.o)} van de ${nl(v.o)} = ${nl(v.n-v.o)} : ${nl(v.o)} = ${nl((v.n-v.o)/v.o)}`,(v.n-v.o)/v.o),st(`${nl((v.n-v.o)/v.o)} = ${v.p}%`,v.p)],
  fouten:v=>[[rondaf((v.n-v.o)/v.n*100,1),'Je deelde door de nieuwe prijs. Een stijging vergelijk je met de oude prijs.'],[rondaf(v.n-v.o,2),'Dat is hoeveel euro erbij kwam, niet hoeveel procent.'],[rondaf(v.n/v.o*100,1),'Dat is de nieuwe prijs in procenten van de oude. Trek er 100% vanaf.']],
  anders:v=>`Maak een verhoudingstabel: ${eur(v.o)} is 100%. Hoeveel procent hoort bij ${eur(v.n-v.o)}?`,
  tabel:v=>({kop:['euro','procent'],rijen:[[v.o,100],[v.n-v.o,v.p]],leeg:[[1,1]]}),
  sab:v=>({intro:`${v.d} ging van ${eur(v.o)} naar ${eur(v.n)}. Sem rekent uit hoeveel procent duurder.`,stappen:[`Erbij: ${eur(v.n-v.o)}.`,`${nl(v.n-v.o)} : ${nl(v.n)} = ${nl(rondaf((v.n-v.o)/v.n,4))}.`,`Dat is ${nl(rondaf((v.n-v.o)/v.n*100,1))}%.`],fout:1,juist:v.p,check:rondaf((v.n-v.o)/v.n*100,1),eenheid:'%',vraag:'Met hoeveel procent steeg de prijs echt?',uitleg:'Sem deelde door de nieuwe prijs. Bij een stijging deel je door de oude prijs: die is 100%.',goed:[`${nl(v.n-v.o)} : ${nl(v.o)} = ${nl((v.n-v.o)/v.o)}`,`${v.p}%`]})
});
L({id:'M06.hoeken',niv:6,dom:'M',sub:'meetkunde',naam:'Hoeken uitrekenen: recht en gestrekt',
  uitleg:'Een rechte hoek is 90°, een gestrekte hoek (een rechte lijn) is 180°, een heel rondje is 360°. Weet je een deel, dan trek je dat af van het geheel.',
  gen(r){ const t=r.pick([90,180,360]); const a=t===90?r.int(15,75):t===180?r.int(25,155):r.int(100,300); return {t,a} },
  vraag:v=>v.t===90?`Een rechte hoek wordt door een lijn in twee hoeken verdeeld. De ene hoek is ${v.a}°. Hoe groot is de andere?`:v.t===180?`Twee hoeken liggen naast elkaar op een rechte lijn. De ene is ${v.a}°. Hoe groot is de andere?`:`Een wijzer draait een heel rondje. Hij heeft al ${v.a}° gedraaid. Hoeveel graden moet hij nog?`,
  fig:v=>v.t===90?FIG.hoek(90).replace('</svg>',`<line x1="70" y1="170" x2="${(70+150*Math.cos(v.a*Math.PI/180)).toFixed(1)}" y2="${(170-150*Math.sin(v.a*Math.PI/180)).toFixed(1)}" stroke="var(--acc)" stroke-width="3" stroke-dasharray="6 4"/></svg>`):'',
  antw:v=>v.t-v.a, eenheid:'graden',
  stappen:v=>[st(`Samen is het ${v.t}°`,v.t),st(`${v.t} − ${v.a} = ${v.t-v.a}`,v.t-v.a)],
  fouten:v=>[[v.t===90?180-v.a:v.t===180?(v.a<90?90-v.a:360-v.a):Math.abs(180-v.a),v.t===90?'Een rechte hoek is 90°, niet 180°.':v.t===180?'Een rechte lijn is 180°, niet 90°.':'Een heel rondje is 360°.'],[v.a,'Dat is de hoek die je al weet.'],[v.t+v.a,'Je telde op. Je zoekt wat er nog over is.']],
  anders:v=>`Denk aan de klok: een kwartslag is 90°, een halve slag 180°, een hele slag 360°.`
});
L({id:'X6.zwemabonnement',niv:6,dom:'G',sub:'bewerkingen',naam:'Toetsopgave: wanneer is een abonnement voordeliger?',ctx:true,
  uitleg:'Vergelijk de kosten: hoe vaak moet je gaan voordat het abonnement goedkoper is dan losse kaartjes? Deel de prijs van het abonnement door de prijs van één kaartje en kijk dan goed of je naar boven moet afronden.',
  gen(r){ let p,a; do{ p=r.pick([3.5,4,4.5,5,5.5,6.25]); a=r.pick([45,59,75,89,99,120]) }while(Math.abs(a/p-Math.round(a/p))<1e-9); return {p,a,w:r.pick(['zwembad','klimhal','ijsbaan'])} },
  vraag:v=>`${bron('🎟️ Prijzen '+v.w,`<p>Los kaartje: <b>${eur(v.p)}</b></p><p>Seizoensabonnement (onbeperkt): <b>${eur(v.a)}</b></p><p class="bronvoet">Kinderen tot 4 jaar gratis · Groepskorting op aanvraag</p>`)}Vanaf hoeveel keer gaan is het abonnement goedkoper dan losse kaartjes?`,
  antw:v=>Math.floor(v.a/v.p)+1,
  stappen:v=>[st(`${eur(v.a)} : ${eur(v.p)} = ${nl(rondaf(v.a/v.p,2))}`,rondaf(v.a/v.p,2)),st(`${Math.floor(v.a/v.p)} keer kost ${eur(Math.floor(v.a/v.p)*v.p)}: nog goedkoper dan het abonnement`,Math.floor(v.a/v.p)),st(`Vanaf ${Math.floor(v.a/v.p)+1} keer is het abonnement goedkoper`,Math.floor(v.a/v.p)+1)],
  fouten:v=>[[Math.floor(v.a/v.p),'Bij '+Math.floor(v.a/v.p)+' keer zijn losse kaartjes nog goedkoper ('+eur(Math.floor(v.a/v.p)*v.p)+').'],[rondaf(v.a/v.p,1),'Je kunt geen deel van een keer gaan. Rond af op een heel aantal keer.'],[Math.round(v.a-v.p),'Je trok de prijzen van elkaar af. Je moet delen.']],
  anders:v=>`Maak een tabel: 1 keer ${eur(v.p)}, 10 keer ${eur(10*v.p)}, … Wanneer kom je boven ${eur(v.a)}?`
});

// ================= NIVEAU 7 (1F/2F) =================
L({id:'G07.ordenen',niv:7,dom:'G',sub:'getalbegrip',naam:'Breuk, kommagetal en procent: welke is het grootst?',
  uitleg:'Maak alles hetzelfde soort getal, bijvoorbeeld een kommagetal: 3/8 = 0,375 en 35% = 0,35. Dan kun je ze makkelijk vergelijken.',
  gen(r){ return {s:r.pick([['0,4','3/8','35%','0,38'],['2/3','0,6','65%','0,606'],['0,8','3/4','78%','0,79'],['45%','2/5','0,44','0,405'],['0,63','5/8','61%','0,62'],['7/10','0,68','69%','0,695']])} },
  vraag:v=>`Welk getal is het grootst?`,
  opties:v=>[[v.s[0],true]].concat(v.s.slice(1).map(x=>[x,false,x.includes('/')?'Reken de breuk om naar een kommagetal: deel de teller door de noemer. '+x+' = '+nl(rondaf(+x.split('/')[0]/+x.split('/')[1],3))+'.':x.includes('%')?'Procent is een deel van 100: '+x+' = '+nl(parseFloat(x)/100)+'.':'Vergelijk cijfer voor cijfer na de komma. Meer cijfers betekent niet groter.'])),
  anders:v=>`Schrijf alles als kommagetal met 3 cijfers achter de komma en vergelijk dan.`
});
L({id:'V07.procentdaling',niv:7,dom:'V',sub:'pverandering',naam:'Hoeveel procent minder?',rm:true,verwar:['V3.hoeveelprocent'],
  uitleg:'Bij een daling deel je het verschil door het oude aantal: dat is 100%. Van 240 naar 180 is 60 minder. 60 : 240 = 0,25 = 25%.',
  gen(r){ const o=r.pick([80,120,200,240,400,500,800]); const p=r.pick([10,15,20,25,30,40,60]); return {o,p,n:o*(100-p)/100,c:r.pick(['leden van de hockeyclub','bezoekers van de bibliotheek','verkochte cd’s','kranten in de brievenbus'])} },
  vraag:v=>`Het aantal ${v.c} daalde van ${nl(v.o)} naar ${nl(v.n)}. Met hoeveel procent daalde het aantal?`,
  antw:v=>v.p, eenheid:'%',
  stappen:v=>[st(`Afname: ${nl(v.o)} − ${nl(v.n)} = ${nl(v.o-v.n)}`,v.o-v.n),st(`${nl(v.o-v.n)} : ${nl(v.o)} = ${nl((v.o-v.n)/v.o)}`,(v.o-v.n)/v.o),st(`= ${v.p}%`,v.p)],
  fouten:v=>[[rondaf((v.o-v.n)/v.n*100,1),'Je deelde door het nieuwe aantal. Deel door het oude aantal: dat was 100%.'],[v.o-v.n,'Dat is hoeveel minder, niet hoeveel procent.'],[100-v.p,'Dat is hoeveel procent er nog over is. De vraag is de daling.']],
  anders:v=>`Verhoudingstabel: ${nl(v.o)} is 100%. Hoeveel procent is ${nl(v.o-v.n)}?`
});
L({id:'V07.rente',niv:7,dom:'V',sub:'groei',naam:'Rente op rente: twee jaar sparen',rm:true,
  uitleg:'Rente komt elk jaar bij het bedrag dat er dan staat. Na het eerste jaar krijg je dus ook rente over de rente. Reken jaar voor jaar, of vermenigvuldig met de groeifactor: 2% rente is × 1,02.',
  gen(r){ return {b:r.pick([200,500,800,1000,1500,2000]),p:r.pick([2,3,4,5]),j:r.pick([2,2,3])} },
  vraag:v=>`Je zet ${eur(v.b)} op een spaarrekening met ${v.p}% rente per jaar. Je laat de rente op de rekening staan. Hoeveel staat er na ${v.j} jaar op? Rond af op centen.`,
  antw:v=>rondaf(v.b*(1+v.p/100)**v.j,2), eenheid:'€',
  stappen:v=>{ const l=[]; let x=v.b; for(let i=1;i<=v.j;i++){ const n=rondaf(x*(1+v.p/100),6); l.push(st(`Jaar ${i}: ${nl(rondaf(x,2))} × ${nl(1+v.p/100)} = ${nl(rondaf(n,2))}`,rondaf(n,2))); x=n } return l },
  fouten:v=>[[rondaf(v.b*(1+v.p*v.j/100),2),'Je kreeg elk jaar rente over alleen het beginbedrag. De rente groeit mee.'],[rondaf(v.b*v.p*v.j/100,2),'Dat is alleen de rente. De vraag is hoeveel er in totaal staat.'],[rondaf(v.b*(1+v.p/100),2),'Dat is na 1 jaar.']],
  anders:v=>`Na 1 jaar: ${eur(v.b)} × ${nl(1+v.p/100)}. Neem dat nieuwe bedrag en doe het nog een keer${v.j>2?', en nog een keer':''}.`
});
L({id:'M07.reistijd',niv:7,dom:'M',sub:'tijd',naam:'Reistijd in minuten',rm:true,verwar:['V3.snelheid'],
  uitleg:'Tijd = afstand : snelheid. Je krijgt dan uren als kommagetal. 1,2 uur is niet 1 uur en 20 minuten: 0,2 uur = 0,2 × 60 = 12 minuten.',
  gen(r){ let km,s; do{ s=r.pick([12,15,18,20,24,30,45,60,80]); km=r.pick([3,6,8,9,10,12,15,18,24,27,30,36,40,45,50,60,72,90]) }while((km*60)%s||km/s<0.4||km/s>2.5||(km*60/s)%60===0); return {km,s,w:s<=24?'fietst':s<=45?'rijdt met de scooter':'rijdt met de auto'} },
  vraag:v=>`Je ${v.w} ${v.km} km met een gemiddelde snelheid van ${v.s} km/u. Hoeveel minuten ben je onderweg?`,
  antw:v=>v.km*60/v.s, eenheid:'minuten',
  stappen:v=>[st(`${v.km} : ${v.s} = ${nl(rondaf(v.km/v.s,4))} uur`,rondaf(v.km/v.s,4)),st(`${nl(rondaf(v.km/v.s,4))} × 60 = ${v.km*60/v.s} minuten`,v.km*60/v.s)],
  fouten:v=>{ const u=v.km/v.s, h=Math.floor(u), d=Math.round((u-h)*100); return [[rondaf(u,2),'Dat is in uren. Keer 60 voor minuten.'],[h*60+d,'Je las '+nl(rondaf(u,2))+' uur als '+h+' uur en '+d+' minuten. Een uur heeft 60 minuten, niet 100.'],[rondaf(v.s/v.km*60,1),'Je deelde andersom: tijd = afstand : snelheid.']] },
  anders:v=>`Hoeveel km doe je in 1 minuut? ${v.s} : 60 = ${nl(rondaf(v.s/60,3))} km. Hoeveel minuten heb je dan nodig voor ${v.km} km?`
});

// ================= NIVEAU 8 (2F) =================
L({id:'V08.bouwtekening',niv:8,dom:'V',sub:'schaal',naam:'Bouwtekening op schaal',rm:true,verwar:['V3.schaal'],
  uitleg:'Schaal 1 : 50 betekent: alles is in het echt 50 keer zo groot. 1 cm op de tekening is 50 cm in het echt. Reken daarna om naar meters: : 100.',
  gen(r){ let s,t; do{ s=r.pick([20,25,50,100,200]); t=r.pick([2.5,3,4,4.5,6,7.5,8,9,12]) }while(Math.abs(t*s/100*100-Math.round(t*s))>1e-9); return {s,t,naar:r.ja(.7),d:r.pick(['de muur van de woonkamer','de tuin','het balkon','de garage'])} },
  vraag:v=>v.naar?`Op een bouwtekening met schaal 1 : ${v.s} is ${v.d} ${nl(v.t)} cm lang. Hoe lang is dat in het echt, in meter?`:`${v.d[0].toUpperCase()+v.d.slice(1)} is in het echt ${nl(rondaf(v.t*v.s/100,4))} m lang. Hoeveel cm is dat op een tekening met schaal 1 : ${v.s}?`,
  antw:v=>v.naar?rondaf(v.t*v.s/100,4):v.t, eenheid:v=>v.naar?'m':'cm',
  stappen:v=>v.naar?[st(`${nl(v.t)} × ${v.s} = ${nl(rondaf(v.t*v.s,4))} cm`,rondaf(v.t*v.s,4)),st(`${nl(rondaf(v.t*v.s,4))} cm = ${nl(rondaf(v.t*v.s/100,4))} m`,rondaf(v.t*v.s/100,4))]:[st(`${nl(rondaf(v.t*v.s/100,4))} m = ${nl(rondaf(v.t*v.s,4))} cm`,rondaf(v.t*v.s,4)),st(`${nl(rondaf(v.t*v.s,4))} : ${v.s} = ${nl(v.t)} cm`,v.t)],
  fouten:v=>v.naar?[[rondaf(v.t*v.s,4),'Dat is in centimeters. Deel nog door 100 voor meters.'],[rondaf(v.t*v.s/1000,4),'1 m is 100 cm, niet 1000.'],[rondaf(v.t/v.s,4),'Je deelde. In het echt is alles groter.']]:[[rondaf(v.t/100,4),'Je vergat eerst om te rekenen naar cm.'],[rondaf(v.t*v.s*v.s/100,4),'Je vermenigvuldigde. Op de tekening is alles kleiner.'],[rondaf(v.t*10,4),'Reken de meters eerst om naar centimeters: × 100.']],
  anders:v=>`Maak een tabel: 1 cm tekening → ${v.s} cm echt. Reken daarna cm om naar m.`,
  sab:v=>({intro:`Schaal 1 : ${v.s}. Op de tekening is ${v.d} ${nl(v.t)} cm. Liam rekent de echte lengte uit.`,stappen:[`${nl(v.t)} × ${v.s} = ${nl(rondaf(v.t*v.s,4))} cm.`,`Van cm naar m deel ik door 1000: ${nl(rondaf(v.t*v.s/1000,4))} m.`,`In het echt is het ${nl(rondaf(v.t*v.s/1000,4))} m.`],fout:1,juist:rondaf(v.t*v.s/100,4),check:rondaf(v.t*v.s/1000,4),eenheid:'m',vraag:'Hoe lang is het echt?',uitleg:'1 meter is 100 centimeter. Van cm naar m deel je door 100.',goed:[`${nl(rondaf(v.t*v.s,4))} : 100 = ${nl(rondaf(v.t*v.s/100,4))} m`]})
});
L({id:'G08.deelvaneen',niv:8,dom:'G',sub:'breuken',naam:'Een deel van een deel',
  uitleg:'Een deel van een deel is vermenigvuldigen: 2/3 van 3/4 = 2/3 × 3/4 = 6/12 = 1/2. Teller keer teller, noemer keer noemer, dan vereenvoudigen.',
  gen(r){ const [a,b,c,d]=r.pick([[3,4,2,3],[2,5,1,2],[3,5,2,3],[1,2,3,4],[4,5,1,4],[2,3,3,5],[5,6,2,5],[3,8,2,3]]); return {a,b,c,d,w:r.pick([['van de leerlingen komt op de fiets','daarvan fietst meer dan 5 km'],['van de bezoekers is volwassen','daarvan heeft een jaarkaart'],['van de spelers is verdediger','daarvan is links'] ])} },
  vraag:v=>`${breuk(v.a,v.b)} ${v.w[0]}. ${breuk(v.c,v.d)} ${v.w[1]}. Welk deel van het totaal is dat?`,
  opties:v=>{ const g=ggd(v.a*v.c,v.b*v.d), goed=`${v.a*v.c/g}/${v.b*v.d/g}`; const s=v.a*v.d+v.c*v.b, n=v.b*v.d, g2=ggd(s,n); return uniekOpties(goed,[[`${v.a+v.c}/${v.b+v.d}`,'Je telde tellers en noemers op. Een deel van een deel is keer.'],[`${s/g2}/${n/g2}`,'Je telde de breuken op. Het is een deel ván het eerste deel: vermenigvuldig.'],[`${v.c}/${v.d}`,'Dat deel gaat over een groep, niet over het totaal.'],[`${v.a*v.c}/${v.b+v.d}`,'De noemers moet je ook vermenigvuldigen.']]) },
  anders:v=>`Neem een voorbeeld van ${v.b*v.d*2} personen. ${breuk(v.a,v.b)} daarvan is ${v.b*v.d*2*v.a/v.b}. Daarvan ${breuk(v.c,v.d)} is ${v.b*v.d*2*v.a/v.b*v.c/v.d}. Welk deel van ${v.b*v.d*2} is dat?`
});
L({id:'M08.dikte',niv:8,dom:'M',sub:'eenheden',naam:'Heel klein en heel veel: millimeters',rm:true,
  uitleg:'Bij kleine maten reken je met millimeters. 10 mm = 1 cm, 1000 mm = 1 m. Eerst vermenigvuldigen, dan omrekenen.',
  gen(r){ const [w,d,n]=r.pick([['een vel papier',0.1,[500,1000,2500]],['een speelkaart',0.3,[52,104,300]],['een munt van 1 euro',2.3,[10,20,50]],['een plaat triplex',4,[25,50,120]]]); const nn=r.pick(n); return {w,d,n:nn,naar:Math.abs(d*nn/10-Math.round(d*nn/10))<1e-9&&r.ja()?'m':'cm'} },
  vraag:v=>`${v.w[0].toUpperCase()+v.w.slice(1)} is ${nl(v.d)} mm dik. Hoe hoog is een stapel van ${v.n}, in ${v.naar}?`,
  antw:v=>rondaf(v.d*v.n/(v.naar==='cm'?10:1000),4), eenheid:v=>v.naar,
  stappen:v=>[st(`${v.n} × ${nl(v.d)} = ${nl(rondaf(v.d*v.n,4))} mm`,rondaf(v.d*v.n,4)),st(`${nl(rondaf(v.d*v.n,4))} mm = ${nl(rondaf(v.d*v.n/(v.naar==='cm'?10:1000),4))} ${v.naar}`,rondaf(v.d*v.n/(v.naar==='cm'?10:1000),4))],
  fouten:v=>[[rondaf(v.d*v.n,4),'Dat is in millimeters. Reken nog om naar '+v.naar+'.'],[rondaf(v.d*v.n/(v.naar==='cm'?100:100),4),v.naar==='cm'?'1 cm is 10 mm, niet 100.':'1 m is 1000 mm, niet 100.'],[rondaf(v.d*v.n*(v.naar==='cm'?10:1000),4),'Naar een grotere eenheid wordt het getal kleiner: delen.']],
  anders:v=>`Reken eerst de hele stapel uit in mm. Bedenk dan: hoeveel mm is 1 ${v.naar}?`
});
L({id:'M08.veelhoek',niv:8,dom:'M',sub:'meetkunde',naam:'Hoeken in een regelmatige veelhoek',rm:true,
  uitleg:'Een veelhoek met n hoeken kun je verdelen in (n − 2) driehoeken. Samen zijn de hoeken dus (n − 2) × 180°. In een regelmatige veelhoek zijn alle hoeken gelijk: deel door n.',
  gen(r){ const [n,naam,w]=r.pick([[5,'vijfhoek','een tegel'],[6,'zeshoek','een honingraat-tegel'],[8,'achthoek','een stopbord'],[10,'tienhoek','een tafelblad'],[12,'twaalfhoek','een munt']]); return {n,naam,w} },
  vraag:v=>`${v.w[0].toUpperCase()+v.w.slice(1)} heeft de vorm van een regelmatige ${v.naam}. Hoe groot is één hoek binnenin?`,
  fig:v=>FIG.vorm(v.n),
  antw:v=>(v.n-2)*180/v.n, eenheid:'graden',
  stappen:v=>[st(`${v.n} − 2 = ${v.n-2} driehoeken`,v.n-2),st(`${v.n-2} × 180 = ${(v.n-2)*180}°`,(v.n-2)*180),st(`${(v.n-2)*180} : ${v.n} = ${(v.n-2)*180/v.n}°`,(v.n-2)*180/v.n)],
  fouten:v=>[[360/v.n,'Dat is de hoek bij het middelpunt (360 : '+v.n+'). De hoek binnenin, bij een hoekpunt, is groter.'],[(v.n-2)*180,'Dat zijn alle hoeken samen. Deel nog door '+v.n+'.'],[rondaf(180/v.n,2),'Een veelhoek is niet één driehoek. Gebruik (n − 2) × 180.']],
  anders:v=>`Trek vanuit één hoekpunt lijnen naar de andere hoekpunten. Tel de driehoeken: elke driehoek is 180°.`
});

// ================= NIVEAU 9 =================
L({id:'G09.kommadelen',niv:9,dom:'G',sub:'komma',naam:'Delen door een kommagetal',
  uitleg:'Delen door een kommagetal? Vermenigvuldig allebei de getallen met 10 of 100 tot de deler heel is. 4,5 : 0,15 = 450 : 15 = 30.',
  gen(r){ const [d,w,e]=r.pick([[0.15,'flesjes van 0,15 liter','liter'],[0.25,'bekers van 0,25 liter','liter'],[0.2,'stukken van 0,2 meter','meter'],[0.12,'zakjes van 0,12 kg','kg'],[0.4,'porties van 0,4 kg','kg']]); let q; do{ q=r.int(6,60) }while(q%10===0); return {d,w,e,q,t:rondaf(d*q,4)} },
  vraag:v=>`Je hebt ${nl(v.t)} ${v.e}. Hoeveel ${v.w} kun je ervan maken?`,
  antw:v=>v.q,
  stappen:v=>{ const ff=Number.isInteger(rondaf(v.d*10,6))?10:100; return [st(`Beide × ${ff}: ${nl(rondaf(v.t*ff,4))} : ${nl(rondaf(v.d*ff,4))}`),st(`= ${v.q}`,v.q)] },
  fouten:v=>[[rondaf(v.q/10,4),'De komma staat verkeerd. Schat: hoe vaak past '+nl(v.d)+' in 1? Ongeveer '+Math.round(1/v.d)+' keer.'],[rondaf(v.q*10,4),'De komma staat verkeerd. Vermenigvuldig beide getallen met hetzelfde.'],[rondaf(v.t*v.d,4),'Je vermenigvuldigde. Hoe vaak past '+nl(v.d)+' erin? Dat is delen.']],
  anders:v=>`Schat eerst: in 1 ${v.e} past ${nl(v.d)} ongeveer ${Math.round(1/v.d)} keer. In ${nl(v.t)} ${v.e} dus ongeveer ${Math.round(v.t/v.d)} keer.`
});
L({id:'M09.trapezium',niv:9,dom:'M',sub:'oppervlak',naam:'Oppervlakte van een trapezium',rm:true,
  uitleg:'Een trapezium heeft twee evenwijdige zijden. Oppervlakte = (a + b) : 2 × hoogte: je neemt het gemiddelde van de twee evenwijdige zijden en doet dat keer de hoogte.',
  gen(r){ let a,b; do{ a=r.int(4,14); b=r.int(2,10) }while(a<=b||(a+b)%2); return {a,b,h:r.int(3,9),d:r.pick(['een tuin','een dakvlak','een stuk weiland','een bloembed'])} },
  vraag:v=>`${v.d[0].toUpperCase()+v.d.slice(1)} heeft de vorm van een trapezium. De evenwijdige zijden zijn ${v.a} m en ${v.b} m, de hoogte is ${v.h} m. Hoeveel m² is het?`,
  fig:v=>{ const B=300, T=Math.round(B*v.b/v.a), H=150, x0=30, y0=20+H, xt=x0+(B-T)/2; return FIG.wrap(`<polygon points="${x0},${y0} ${x0+B},${y0} ${xt+T},${y0-H} ${xt},${y0-H}" class="vlak a" stroke="var(--ink)" stroke-width="2"/><line x1="${xt}" y1="${y0-H}" x2="${xt}" y2="${y0}" stroke="var(--ink)" stroke-dasharray="5 4"/>`+FIG.t(x0+B/2,y0+24,v.a+' m',{fs:16})+FIG.t(x0+B/2,y0-H-8,v.b+' m',{fs:16})+FIG.t(xt+8,y0-H/2,v.h+' m',{a:'start',fs:16}),B+60,H+56,'style="max-width:380px"') },
  antw:v=>(v.a+v.b)/2*v.h, eenheid:m2,
  stappen:v=>[st(`(${v.a} + ${v.b}) : 2 = ${(v.a+v.b)/2}`,(v.a+v.b)/2),st(`${(v.a+v.b)/2} × ${v.h} = ${(v.a+v.b)/2*v.h} m²`,(v.a+v.b)/2*v.h)],
  fouten:v=>[[(v.a+v.b)*v.h,'Je vergat te delen door 2. Je neemt het gemiddelde van de twee zijden.'],[v.a*v.h,'Je gebruikte alleen de lange zijde. Dan reken je een rechthoek die te groot is.'],[v.a*v.b*v.h/2,'Je vermenigvuldigde de zijden. Tel ze op en deel door 2.']],
  anders:v=>`Knip het trapezium in een rechthoek van ${v.b} bij ${v.h} en twee driehoekjes. Of: leg er een omgekeerde kopie naast, dan krijg je een parallellogram van ${v.a+v.b} bij ${v.h}. Neem de helft.`
});

// ================= NIVEAU 10 =================
L({id:'M10.tempo',niv:10,dom:'M',sub:'tijd',naam:'Hardlooptempo: minuten en seconden per km',rm:true,verwar:['M5.gemsnelheid'],
  uitleg:'Tempo = tijd : afstand. Reken de tijd eerst om naar seconden. 52 min 30 s = 3150 s. Op 10 km is dat 315 s per km = 5 min 15 s.',
  gen(r){ let km,t; do{ km=r.pick([5,8,10,15,21]); t=km*r.int(250,400) }while(t%60===0); return {km,t,m:Math.floor(t/60),s:t%60} },
  vraag:v=>`Je loopt ${v.km} km in ${v.m} minuten en ${v.s} seconden. Wat is je gemiddelde tempo, in seconden per km?`,
  antw:v=>v.t/v.km, eenheid:'seconden',
  stappen:v=>[st(`${v.m} × 60 + ${v.s} = ${v.t} s`,v.t),st(`${v.t} : ${v.km} = ${v.t/v.km} s per km`,v.t/v.km)],
  fouten:v=>[[rondaf((v.m+v.s/100)/v.km*100,1),'Je las '+v.m+' min '+v.s+' s als '+nl(v.m+v.s/100)+' minuten. Een minuut heeft 60 seconden, niet 100.'],[rondaf(v.m*60/v.km,1),'Je vergat de '+v.s+' seconden.'],[rondaf(v.t/v.km/60,2),'Dat is in minuten. De vraag is in seconden.']],
  anders:v=>`Zet alles in seconden: ${v.m} minuten = ${v.m*60} seconden. Tel de ${v.s} seconden erbij en verdeel over ${v.km} km.`
});

// ================= NIVEAU 11 =================
L({id:'B11.schijven',niv:11,dom:'B',sub:'tabellen',naam:'Belasting in schijven uit een tabel',rm:true,
  uitleg:'Bij schijven betaal je over elk deel van je inkomen het percentage van die schijf. Over het deel tot de grens het lage percentage, alleen over het deel daarboven het hoge.',
  gen(r){ const g=r.pick([38000,40000,42000]); const p1=r.pick([36,37]),p2=r.pick([49,50]); const ink=g+r.int(2,30)*1000; return {g,p1,p2,ink} },
  vraag:v=>`${bron('📄 Belastingtabel (vereenvoudigd)',bronTabel(['Inkomen','Tarief'],[[`tot € ${nl(v.g,0)}`,v.p1+'%'],[`boven € ${nl(v.g,0)}`,v.p2+'%']]),'per jaar')}Iemand verdient € ${nl(v.ink,0)} per jaar. Hoeveel belasting betaalt deze persoon in totaal?`,
  antw:v=>rondaf(v.g*v.p1/100+(v.ink-v.g)*v.p2/100,2), eenheid:'€',
  stappen:v=>[st(`${v.p1}% van ${nl(v.g,0)} = ${nl(v.g*v.p1/100)}`,v.g*v.p1/100),st(`${v.p2}% van ${nl(v.ink-v.g,0)} = ${nl(rondaf((v.ink-v.g)*v.p2/100,2))}`,rondaf((v.ink-v.g)*v.p2/100,2)),st(`Samen ${eur(v.g*v.p1/100+(v.ink-v.g)*v.p2/100)}`,rondaf(v.g*v.p1/100+(v.ink-v.g)*v.p2/100,2))],
  fouten:v=>[[rondaf(v.ink*v.p2/100,2),'Je rekende het hoge tarief over het hele inkomen. Dat geldt alleen voor het deel boven de grens.'],[rondaf(v.ink*v.p1/100,2),'Je vergat het hogere tarief boven de grens.'],[rondaf(v.ink*v.p1/100+(v.ink-v.g)*v.p2/100,2),'Je telde het deel boven de grens twee keer.']],
  anders:v=>`Splits het inkomen: € ${nl(v.g,0)} in de eerste schijf, € ${nl(v.ink-v.g,0)} in de tweede. Reken voor elk deel apart.`
});

// ================= NIVEAU 12 =================
L({id:'V12.nettoverandering',niv:12,dom:'V',sub:'pverandering',naam:'Eerst omhoog, dan omlaag: netto verandering',rm:true,verwar:['V5.tweekortingen'],
  uitleg:'Procentuele veranderingen na elkaar vermenigvuldig je: +25% en daarna −20% is 1,25 × 0,80 = 1,00. Netto 0%, ook al lijkt het alsof er 5% bij komt.',
  gen(r){ const [a,b]=r.pick([[25,-20],[50,-30],[20,-25],[10,-10],[40,-25],[60,-50],[-20,30],[-10,20],[30,-20]]); return {a,b,c:r.pick(['De prijs van een aandeel','Het aantal abonnees van een kanaal','De huur van een kantoor','De prijs van een vliegticket'])} },
  vraag:v=>`${v.c} ${v.a>0?'stijgt':'daalt'} eerst met ${Math.abs(v.a)}% en ${v.b>0?'stijgt':'daalt'} daarna met ${Math.abs(v.b)}%. Wat is de totale procentuele verandering? (Een daling geef je met een minteken.)`,
  negatief:true,
  antw:v=>rondaf(((1+v.a/100)*(1+v.b/100)-1)*100,2), eenheid:'%',
  stappen:v=>[st(`Factoren: ${nl(1+v.a/100)} × ${nl(1+v.b/100)} = ${nl(rondaf((1+v.a/100)*(1+v.b/100),4))}`,rondaf((1+v.a/100)*(1+v.b/100),4)),st(`${nl(rondaf((1+v.a/100)*(1+v.b/100),4))} − 1 = ${nl(rondaf(((1+v.a/100)*(1+v.b/100)-1)*100,2))}%`,rondaf(((1+v.a/100)*(1+v.b/100)-1)*100,2))],
  fouten:v=>[[v.a+v.b,'Je telde de percentages op. De tweede verandering gaat over een ander bedrag.'],[rondaf((1+v.a/100)*(1+v.b/100)*100,2),'Dat is het nieuwe niveau in procenten. Trek er 100 vanaf.'],[rondaf(-((1+v.a/100)*(1+v.b/100)-1)*100,2)||rondaf(v.a*v.b/100,2),'Let op het teken: is het eindbedrag hoger of lager dan het begin?']],
  anders:v=>`Reken met een voorbeeld van 100. Na de eerste verandering: ${nl(100+v.a)}. Daarna ${v.b>0?'+':'−'}${Math.abs(v.b)}% daarvan.`,
  sab:v=>({intro:`${v.c} verandert met ${v.a>0?'+':'−'}${Math.abs(v.a)}% en daarna met ${v.b>0?'+':'−'}${Math.abs(v.b)}%. Fenna rekent de totale verandering uit.`,stappen:[`De veranderingen zijn ${v.a>0?'+':'−'}${Math.abs(v.a)}% en ${v.b>0?'+':'−'}${Math.abs(v.b)}%.`,`Samen: ${v.a} + ${v.b<0?'('+String(v.b).replace('-','−')+')':v.b} = ${String(v.a+v.b).replace('-','−')}%.`,`Totaal ${String(v.a+v.b).replace('-','−')}%.`].map(x=>x.replace(/(^|[\s(])-(\d)/g,'$1−$2')),fout:1,juist:rondaf(((1+v.a/100)*(1+v.b/100)-1)*100,2),check:v.a+v.b,eenheid:'%',vraag:'Wat is de totale verandering echt?',uitleg:'Fenna telde de percentages op. Na de eerste verandering is het grondbedrag anders: vermenigvuldig de groeifactoren.',goed:[`${nl(1+v.a/100)} × ${nl(1+v.b/100)} = ${nl(rondaf((1+v.a/100)*(1+v.b/100),4))}`]})
});
L({id:'B12.gemverandering',niv:12,dom:'B',sub:'grafieken',naam:'Gemiddelde verandering uit een grafiek',rm:true,verwar:['B7.gemtoename'],
  uitleg:'Gemiddelde verandering op een interval = (eindwaarde − beginwaarde) : (eindtijd − begintijd). Lees beide punten precies af, let op de eenheden op de assen.',
  gen(r){ const k=r.pick([2,3,4,5]); let y; do{ y=[r.int(2,6)*10]; for(let i=1;i<=6;i++) y.push(y[i-1]+r.int(-1,4)*10) }while(Math.max(...y)>200||Math.min(...y)<10); let i,j; do{ i=r.int(0,3); j=r.int(i+2,6) }while(y[j]===y[i]); return {k,y,i,j,c:r.pick([['Hoogte van een zonnebloem','dag','cm'],['Aantal downloads van een app','week','× 1000'],['Waterstand in een stuwmeer','uur','cm']])} },
  vraag:v=>`De grafiek toont: ${v.c[0].toLowerCase()} (${v.c[2]}). Bereken de gemiddelde verandering per ${v.c[1]} tussen ${v.c[1]} ${v.i*v.k} en ${v.c[1]} ${v.j*v.k}. Rond af op 2 decimalen.`,
  fig:v=>FIG.grafiek([{punten:v.y.map((y,t)=>[t*v.k,y])}],{xmin:0,xmax:6*v.k,xs:v.k,ymin:0,ymax:Math.ceil((Math.max(...v.y)+10)/20)*20,ys:Math.max(...v.y)>90?20:10,xl:v.c[1],yl:v.c[2]}),
  negatief:true,
  antw:v=>rondaf((v.y[v.j]-v.y[v.i])/((v.j-v.i)*v.k),2),
  stappen:v=>[st(`Verandering: ${v.y[v.j]} − ${v.y[v.i]} = ${v.y[v.j]-v.y[v.i]}`,v.y[v.j]-v.y[v.i]),st(`Tijd: ${v.j*v.k} − ${v.i*v.k} = ${(v.j-v.i)*v.k}`,(v.j-v.i)*v.k),st(`${v.y[v.j]-v.y[v.i]} : ${(v.j-v.i)*v.k} = ${nl(rondaf((v.y[v.j]-v.y[v.i])/((v.j-v.i)*v.k),2))}`,rondaf((v.y[v.j]-v.y[v.i])/((v.j-v.i)*v.k),2))],
  fouten:v=>[[v.y[v.j]-v.y[v.i],'Dat is de totale verandering. Deel nog door de tijd ertussen.'],[rondaf((v.y[v.j]-v.y[v.i])/(v.j-v.i),2),'Je deelde door het aantal hokjes. Elk hokje op de tijdas is '+v.k+' '+v.c[1]+'.'],[rondaf((v.j-v.i)*v.k/(v.y[v.j]-v.y[v.i]),2),'Je deelde andersom. Het is verandering : tijd.']],
  anders:v=>`Zet twee stippen op de grafiek: bij ${v.i*v.k} en bij ${v.j*v.k}. Hoeveel ben je omhoog of omlaag gegaan, en over hoeveel ${v.c[1]}?`
});
L({id:'M12.mantel',niv:12,dom:'M',sub:'oppervlak',naam:'Oppervlakte van een cilinder: hoeveel materiaal?',rm:true,
  uitleg:'Rol de zijkant (mantel) van een cilinder uit: dat is een rechthoek. De breedte is de omtrek van de cirkel (π × diameter), de hoogte is de hoogte van de cilinder. Boven- en onderkant zijn cirkels: π × r².',
  gen(r){ return {d:r.pick([6,7,8,10,12]),h:r.pick([10,11,12,15,20]),t:r.pick(['mantel','totaal']),w:r.pick([['Een blik tomaten','cm'],['Een koker voor posters','cm'],['Een kaars','cm'],['Een regenton','dm']])} },
  vraag:v=>v.t==='mantel'?`${v.w[0]} is een cilinder met een diameter van ${v.d} ${v.w[1]} en een hoogte van ${v.h} ${v.w[1]}. Hoeveel ${v.w[1]}² materiaal is er nodig voor de zijkant (de mantel)? Rond af op 1 decimaal.`:`${v.w[0]} is een gesloten cilinder met een diameter van ${v.d} ${v.w[1]} en een hoogte van ${v.h} ${v.w[1]}. Wat is de totale oppervlakte, in ${v.w[1]}²? Rond af op 1 decimaal.`,
  antw:v=>v.t==='mantel'?rondaf(Math.PI*v.d*v.h,1):rondaf(Math.PI*v.d*v.h+2*Math.PI*(v.d/2)**2,1), eenheid:v=>v.w[1]+'²',
  stappen:v=>{ const m=rondaf(Math.PI*v.d*v.h,4), c=rondaf(Math.PI*(v.d/2)**2,4); return v.t==='mantel'?[st(`Omtrek: π × ${v.d} ≈ ${nl(rondaf(Math.PI*v.d,2))}`,rondaf(Math.PI*v.d,2)),st(`Mantel: ${nl(rondaf(Math.PI*v.d,2))} × ${v.h} ≈ ${nl(rondaf(m,1))}`,rondaf(m,1))]:[st(`Mantel: π × ${v.d} × ${v.h} ≈ ${nl(rondaf(m,1))}`,rondaf(m,1)),st(`Twee cirkels: 2 × π × ${nl(v.d/2)}² ≈ ${nl(rondaf(2*c,1))}`,rondaf(2*c,1)),st(`Samen ≈ ${nl(rondaf(m+2*c,1))}`,rondaf(m+2*c,1))] },
  fouten:v=>{ const m=Math.PI*v.d*v.h, c=Math.PI*(v.d/2)**2; return v.t==='mantel'?[[rondaf(Math.PI*(v.d/2)*v.h,1),'Je gebruikte de straal. De omtrek is π × diameter (of 2 × π × straal).'],[rondaf(c*v.h,1),'Dat is de inhoud. De vraag is de oppervlakte van de zijkant.'],[rondaf(v.d*v.h,1),'Je vergat π. De breedte van het etiket is de omtrek van de cirkel.']]:[[rondaf(m,1),'Dat is alleen de mantel. Tel boven- en onderkant erbij.'],[rondaf(m+c,1),'Een gesloten cilinder heeft twee cirkels: boven en onder.'],[rondaf(m+2*Math.PI*v.d**2,1),'Je gebruikte de diameter in π × r². Neem de straal: '+nl(v.d/2)+'.']] },
  anders:v=>`Pak een blik en haal het etiket eraf: het is een rechthoek. Hoe breed is die rechthoek? Precies één keer rond het blik.`
});
