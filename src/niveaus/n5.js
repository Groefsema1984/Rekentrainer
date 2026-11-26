// ===== Niveau 5 · 2F → 3F · ongeveer 3e klas =====
// ---------- Getallen ----------
L({id:'G5.machten',niv:5,dom:'G',sub:'negatief',naam:'Machten uitrekenen',negatief:true,
  uitleg:'Een macht is herhaald vermenigvuldigen: 2⁵ = 2 × 2 × 2 × 2 × 2 = 32. Let op: (−3)² = 9, maar −3² = −(3 × 3) = −9.',
  gen(r){ const type=r.pick(['gewoon','gewoon','haakjes','zonder']); const a=type==='gewoon'?r.pick([2,3,4,5,10]):r.int(2,9); const n=type==='gewoon'?(a===10?r.int(3,6):a===2?r.int(4,8):r.int(2,4)):2; return {type,a,n} },
  vraag:v=>`Reken uit: <b>${v.type==='haakjes'?`(−${v.a})`:v.type==='zonder'?`−${v.a}`:v.a}<sup>${v.n}</sup></b>`,
  antw:v=>v.type==='zonder'?-(v.a**v.n):v.type==='haakjes'?(-v.a)**v.n:v.a**v.n,
  stappen:v=>v.type==='gewoon'?[st(`${Array(v.n).fill(v.a).join(' × ')}`),st(`= ${nl(v.a**v.n)}`,v.a**v.n)]:v.type==='haakjes'?[st(`(−${v.a}) × (−${v.a})`),st(`min × min = plus: ${v.a**2}`,v.a**2)]:[st(`Eerst de macht: ${v.a}² = ${v.a**2}`,v.a**2),st(`Dan het minteken ervoor: −${v.a**2}`,-(v.a**2))],
  fouten:v=>v.type==='gewoon'?[[v.a*v.n,`${v.a}<sup>${v.n}</sup> is niet ${v.a} × ${v.n}, maar ${v.n} keer ${v.a} met zichzelf vermenigvuldigen.`],[v.n**v.a,'Je hebt grondtal en exponent omgedraaid.'],[v.a**(v.n-1),'Tel hoe vaak je '+v.a+' opschrijft: '+v.n+' keer.']]:v.type==='haakjes'?[[-(v.a**2),'De haakjes horen erbij: (−'+v.a+') × (−'+v.a+') is positief.'],[-2*v.a,'Het is (−'+v.a+') keer zichzelf, niet keer 2.']]:[[v.a**2,'Zonder haakjes hoort het minteken niet bij de macht. Eerst '+v.a+'², dan min.'],[-2*v.a,'Het is '+v.a+' keer '+v.a+', niet keer 2.']],
  anders:v=>`Schrijf de macht helemaal uit als vermenigvuldiging. ${v.type!=='gewoon'?'Kijk goed of het minteken binnen of buiten de haakjes staat: alleen wat tussen de haakjes staat wordt gekwadrateerd.':''}`
});
L({id:'G5.breukdelen',niv:5,dom:'G',sub:'breuken',naam:'Delen door een breuk',dec:2,
  uitleg:'Delen door een breuk = hoe vaak past die breuk erin? 3 : ¼ = 12, want in elke 1 passen 4 kwartjes. Rekenregel: delen door een breuk is vermenigvuldigen met het omgekeerde.',
  gen(r){ const [t,n]=r.pick([[1,4],[1,3],[1,2],[3,4],[2,3],[1,5],[1,8],[3,8]]); let a; do{ a=r.pick([2,3,4,5,6,9,12,1.5,2.5]) }while(Math.abs((a*n/t)-Math.round(a*n/t))>1e-9); return {t,n,a,c:r.pick([['liter limonade','glazen van','liter'],['kg chips','zakjes van','kg'],['uur','filmpjes van','uur'],['meter lint','stukjes van','meter']])} },
  vraag:v=>`Je hebt ${nl(v.a)} ${v.c[0]}. Hoeveel ${v.c[1]} ${breuk(v.t,v.n)} ${v.c[2]} kun je ervan maken?`,
  antw:v=>rondaf(v.a*v.n/v.t,2),
  stappen:v=>[st(`In 1 ${v.c[2]} past ${breuk(v.t,v.n)} precies ${nl(v.n/v.t)} keer`,rondaf(v.n/v.t,4)),st(`In ${nl(v.a)}: ${nl(v.a)} × ${nl(v.n/v.t)} = ${nl(v.a*v.n/v.t)}`,rondaf(v.a*v.n/v.t,2))],
  fouten:v=>[[rondaf(v.a*v.t/v.n,3),'Je vermenigvuldigde met de breuk. Dan krijg je minder, maar je moet tellen hoe vaak het erin past.'],[rondaf(v.a/v.n,3),'Kijk hoe vaak '+fr(v.t/v.n)+' in 1 past.'],[rondaf(v.a*v.n,2),v.t===1?'':'Let ook op de teller van de breuk.']].filter(x=>x[1]),
  anders:v=>({tekst:`Teken ${Math.ceil(v.a)} stroken en verdeel elke strook in stukjes van ${fr(v.t/v.n)}. Tel de stukjes.`,svg:FIG.strook(v.n,v.n,`1 geheel = ${nl(v.n/v.t)} stukjes van ${fr(v.t/v.n)}`)})
});
L({id:'G5.schatten',niv:5,dom:'G',sub:'getalbegrip',naam:'Schatten en ordegrootte',
  uitleg:'Rond de getallen af op één cijfer (plus nullen) en reken daarmee. 398 × 52 ≈ 400 × 50 = 20 000.',
  gen(r){ const a=r.int(2,9)*10**r.int(1,3)+r.int(-9,9),b=r.int(2,9)*10**r.int(1,2)+r.int(-4,4); return {a,b,op:r.pick(['×',':'])} },
  vraag:v=>v.op==='×'?`Welke schatting past het best bij <b>${nl(v.a)} × ${nl(v.b)}</b>?`:`Welke schatting past het best bij <b>${nl(v.a*v.b)} : ${nl(v.b)}</b>?`,
  opties:v=>{ const x=v.op==='×'?v.a*v.b:v.a; const o=10**Math.floor(Math.log10(x)); const k=Math.round(x/o); const g=k*o; return [[nl(g),true],[nl(g/10),false,'Tel de nullen: je zit een factor 10 te laag.'],[nl(g*10),false,'Tel de nullen: je zit een factor 10 te hoog.'],[nl(g*100),false,'Dit is veel te groot. Rond af en tel de nullen.']] },
  stappen:v=>{ const rd=n=>{const o=10**Math.floor(Math.log10(n));return Math.round(n/o)*o}; const x=v.op==='×'?v.a*v.b:v.a; const o=10**Math.floor(Math.log10(x)); const g=Math.round(x/o)*o; return v.op==='×'?[st(`${nl(v.a)} ≈ ${nl(rd(v.a))} en ${nl(v.b)} ≈ ${nl(rd(v.b))}`),st(`${nl(rd(v.a))} × ${nl(rd(v.b))} = ${nl(rd(v.a)*rd(v.b))}: vermenigvuldig de cijfers en tel de nullen.`),st(`De optie die daar het dichtst bij ligt: ${nl(g)}`,g)]:[st(`${nl(v.a*v.b)} : ${nl(v.b)}: hoe vaak past ${nl(v.b)} erin?`),st(`${nl(v.b)} × ${nl(g)} ≈ ${nl(v.b*g)}, dat komt in de buurt. Schatting: ${nl(g)}`,g)] },
  anders:v=>`Schrijf de afgeronde getallen als "cijfer met nullen". Vermenigvuldig de cijfers en zet alle nullen erachter. Zo zie je meteen of het om honderden, duizenden of miljoenen gaat.`
});
L({id:'G5.wortel',niv:5,dom:'G',sub:'negatief',naam:'Wortels: tussen welke getallen?',
  uitleg:'√49 = 7 want 7 × 7 = 49. Ligt een getal tussen twee kwadraten, dan ligt de wortel tussen de twee bijbehorende gehele getallen. √50 ligt tussen 7 en 8.',
  gen(r){ const type=r.pick(['exact','tussen']); const a=r.int(4,20); return {type,a,x:type==='exact'?a*a:a*a+r.int(1,2*a)} },
  vraag:v=>v.type==='exact'?`Reken uit: √${v.x}`:`√${v.x} ligt tussen twee hele getallen. Wat is het kleinste van die twee?`,
  antw:v=>v.a,
  stappen:v=>v.type==='exact'?[st(`Welk getal keer zichzelf is ${v.x}?`),st(`${v.a} × ${v.a} = ${v.x}, dus √${v.x} = ${v.a}`,v.a)]:[st(`${v.a}² = ${v.a*v.a} en ${v.a+1}² = ${(v.a+1)**2}`,v.a*v.a),st(`${v.x} ligt ertussen, dus √${v.x} ligt tussen ${v.a} en ${v.a+1}`,v.a)],
  fouten:v=>[[v.x/2,'Wortel trekken is niet delen door 2.'],[v.a+1,v.type==='tussen'?'Dat is het grootste getal. De vraag is het kleinste.':'Controleer: '+(v.a+1)+' × '+(v.a+1)+' = '+(v.a+1)**2+'.'],[v.a-1,'Controleer: '+(v.a-1)+' × '+(v.a-1)+' = '+(v.a-1)**2+'.']],
  anders:v=>`Maak een rijtje kwadraten: ${[v.a-1,v.a,v.a+1].map(x=>`${x}² = ${x*x}`).join(', ')}. Waar past ${v.x}?`
});
// ---------- Verhoudingen ----------
L({id:'V5.tweekortingen',niv:5,dom:'V',sub:'pverandering',naam:'Twee procentuele veranderingen na elkaar',rm:true,verwar:['V5.groeifactor'],
  uitleg:'Twee kortingen na elkaar mag je niet optellen: de tweede korting gaat over de al verlaagde prijs. Vermenigvuldig de factoren: 20% en daarna 10% korting = 0,8 × 0,9 = 0,72, dus 28% korting.',
  gen(r){ const k1=r.pick([10,20,25,30,40,50]),k2=r.pick([10,20,25]); let p; do{ p=r.pick([40,60,80,100,120,150,200,250]) }while((p*(100-k1)*(100-k2))%10000!==0&&(p*(100-k1)*(100-k2))%1000!==0); return {k1,k2,p,wat:r.pick(['prijs','procent']),d:r.pick(['jas','sneakers','koptelefoon','tablet'])} },
  vraag:v=>v.wat==='prijs'?`In de uitverkoop krijg je op een ${v.d} van ${eur(v.p)} eerst ${v.k1}% korting. Aan de kassa krijg je nog eens ${v.k2}% extra korting op de nieuwe prijs. Wat betaal je?`:`Een winkel geeft eerst ${v.k1}% korting en daarna nog ${v.k2}% extra korting op de nieuwe prijs. Hoeveel procent korting is dat in totaal?`,
  antw:v=>v.wat==='prijs'?rondaf(v.p*(100-v.k1)*(100-v.k2)/10000,2):rondaf(100-(100-v.k1)*(100-v.k2)/100,2), eenheid:v=>v.wat==='prijs'?'€':'%',
  stappen:v=>{ const f=(100-v.k1)*(100-v.k2)/10000; return v.wat==='prijs'?[st(`Na ${v.k1}%: ${nl((100-v.k1)/100)} × ${v.p} = ${nl(v.p*(100-v.k1)/100)}`,rondaf(v.p*(100-v.k1)/100,2)),st(`Na ${v.k2}%: ${nl((100-v.k2)/100)} × ${nl(v.p*(100-v.k1)/100)} = ${eur(v.p*f)}`,rondaf(v.p*f,2))]:[st(`Factoren: ${nl((100-v.k1)/100)} × ${nl((100-v.k2)/100)} = ${nl(f)}`,f),st(`Je betaalt ${nl(f*100)}%, dus ${nl(100-f*100)}% korting`,rondaf(100-f*100,2))] },
  fouten:v=>v.wat==='prijs'?[[rondaf(v.p*(100-v.k1-v.k2)/100,2),'Je telde de kortingen op. De tweede korting gaat over de al verlaagde prijs.'],[rondaf(v.p*(100-v.k1)/100,2),'Je vergat de tweede korting.']]:[[v.k1+v.k2,'Je telde de percentages op. De tweede korting gaat over een lager bedrag, dus het is minder.'],[rondaf((100-v.k1)*(100-v.k2)/100,2),'Dat is wat je nog betaalt. De vraag is de korting.']],
  anders:v=>({tekst:'Reken met een voorbeeldprijs van € 100. Na de eerste korting is het € '+(100-v.k1)+'. Daarvan gaat nog '+v.k2+'% af.',svg:FIG.balk([{w:(100-v.k1)*(100-v.k2)/100,label:'betaal',k:'a'},{w:(100-v.k1)*v.k2/100,label:v.k2+'%',k:'b'},{w:v.k1,label:v.k1+'%',k:'zacht'}],'€ 100')}),
  sab:v=>({intro:`Eerst ${v.k1}% korting, daarna nog ${v.k2}% extra op de nieuwe prijs. Een ${v.d} kost ${eur(v.p)}. Noor rekent het uit.`,stappen:[`Er gaat ${v.k1}% en ${v.k2}% af.`,`Samen is dat ${v.k1} + ${v.k2} = ${v.k1+v.k2}% korting.`,`Je betaalt ${100-v.k1-v.k2}% van ${v.p}.`,`Antwoord: ${eur(v.p*(100-v.k1-v.k2)/100)}`],fout:1,juist:rondaf(v.p*(100-v.k1)*(100-v.k2)/10000,2),check:rondaf(v.p*(100-v.k1-v.k2)/100,2),eenheid:'€',vraag:'Wat betaal je echt?',uitleg:'De tweede korting gaat over de al verlaagde prijs. Kortingen na elkaar mag je niet optellen: vermenigvuldig de factoren.',goed:[`${nl((100-v.k1)/100)} × ${nl((100-v.k2)/100)} = ${nl((100-v.k1)*(100-v.k2)/10000)}`,`${nl((100-v.k1)*(100-v.k2)/10000)} × ${v.p} = ${eur(v.p*(100-v.k1)*(100-v.k2)/10000)}`]})
});
L({id:'V5.groeifactor',niv:5,dom:'V',sub:'groei',naam:'Groeifactor bij een percentage',dec:3,verwar:['V5.tweekortingen'],
  uitleg:'Groeifactor = het nieuwe percentage gedeeld door 100. 5% erbij: 105% → 1,05. 12% eraf: 88% → 0,88.',
  gen(r){ const p=r.pick([2,3,4,5,8,10,12,15,20,25,30,40,1.5,2.5]); return {p,omhoog:r.ja(),naar:r.pick(['factor','factor','procent'])} },
  vraag:v=>v.naar==='factor'?`Iets ${v.omhoog?'neemt':'neemt'} met ${nl(v.p)}% ${v.omhoog?'toe':'af'}. Wat is de groeifactor?`:`De groeifactor is ${nl(v.omhoog?1+v.p/100:1-v.p/100)}. Met hoeveel procent neemt het ${v.omhoog?'toe':'af'}?`,
  antw:v=>v.naar==='factor'?rondaf(v.omhoog?1+v.p/100:1-v.p/100,4):v.p, eenheid:v=>v.naar==='factor'?'':'%',
  stappen:v=>v.naar==='factor'?[st(`Nieuw = 100% ${v.omhoog?'+':'−'} ${nl(v.p)}% = ${nl(v.omhoog?100+v.p:100-v.p)}%`,v.omhoog?100+v.p:100-v.p),st(`Delen door 100: ${nl(v.omhoog?1+v.p/100:1-v.p/100)}`,rondaf(v.omhoog?1+v.p/100:1-v.p/100,4))]:[st(`${nl(v.omhoog?1+v.p/100:1-v.p/100)} = ${nl(v.omhoog?100+v.p:100-v.p)}%`,v.omhoog?100+v.p:100-v.p),st(`Verschil met 100%: ${nl(v.p)}%`,v.p)],
  fouten:v=>v.naar==='factor'?[[rondaf(v.p/100,4),'Dat is alleen de verandering. De groeifactor is het hele nieuwe deel: 100% '+(v.omhoog?'+':'−')+' '+nl(v.p)+'%.'],[rondaf(1+v.p/10,3),'Let op de plaats van de komma: '+nl(v.p)+'% = '+nl(v.p/100)+'.'],[rondaf(v.omhoog?1-v.p/100:1+v.p/100,4),'Bij '+(v.omhoog?'een toename':'een afname')+' is de groeifactor '+(v.omhoog?'groter':'kleiner')+' dan 1.']]:[[rondaf(v.omhoog?100+v.p:100-v.p,2),'Dat is het nieuwe percentage. De vraag is de verandering.'],[rondaf(v.p/100,4),'Vergeet niet keer 100 voor procent.']],
  anders:v=>({tekst:'Een groeifactor zegt hoeveel keer zo groot het wordt. Kijk naar de balk: 100% wordt '+(v.omhoog?100+v.p:100-v.p)+'%.',svg:FIG.balk([{w:100,label:'100%',k:'b'},...(v.omhoog?[{w:v.p,label:'+'+nl(v.p)+'%',k:'a'}]:[])],v.omhoog?nl(100+v.p)+'% = × '+nl(1+v.p/100):'')}),
  koppel:(v,r)=>({vraag:'Koppel elke verandering aan de juiste groeifactor.',paren:r.shuffle([['5% erbij','1,05'],['5% eraf','0,95'],['50% erbij','1,5'],['15% eraf','0,85'],['100% erbij','2'],['0,5% erbij','1,005']]).slice(0,4)})
});
L({id:'V5.mengverhouding',niv:5,dom:'V',sub:'vtabel',naam:'Mengverhoudingen',verwar:['V4.recept'],dec:3,
  uitleg:'Bij een mengverhouding 1 : 6 bestaat het geheel uit 1 + 6 = 7 delen. Reken uit hoe groot 1 deel is.',
  gen(r){ let a,b,tot; do{ a=r.int(1,3); b=r.int(3,9); tot=r.pick([0.7,1,1.2,1.4,1.5,2,2.4,2.8,3.5]) }while(ggd(a,b)>1||Math.abs(tot*1000/(a+b)-Math.round(tot*1000/(a+b)))>1e-9); return {a,b,tot,c:r.pick([['siroop','water','liter limonade'],['wasmiddel','water','liter sop'],['verf','verdunner','liter mengsel'],['vruchtensap','bruiswater','liter frisdrank']])} },
  vraag:v=>`Je maakt ${nl(v.tot)} ${v.c[2]} met ${v.c[0]} en ${v.c[1]} in de verhouding ${v.a} : ${v.b}. Hoeveel ml ${v.c[0]} heb je nodig?`,
  antw:v=>rondaf(v.tot*1000*v.a/(v.a+v.b),2), eenheid:'ml',
  stappen:v=>[st(`Aantal delen: ${v.a} + ${v.b} = ${v.a+v.b}`,v.a+v.b),st(`1 deel: ${nl(v.tot*1000)} ml : ${v.a+v.b} = ${nl(v.tot*1000/(v.a+v.b))} ml`,rondaf(v.tot*1000/(v.a+v.b),3)),st(`${v.c[0]}: ${v.a} × ${nl(v.tot*1000/(v.a+v.b))} = ${nl(v.tot*1000*v.a/(v.a+v.b))} ml`,rondaf(v.tot*1000*v.a/(v.a+v.b),2))],
  fouten:v=>[[rondaf(v.tot*1000*v.a/v.b,2),`Bij ${v.a} : ${v.b} is ${v.c[0]} ${v.a} van de ${v.a+v.b} delen, niet ${v.a} van de ${v.b}.`],[rondaf(v.tot*1000*v.b/(v.a+v.b),2),'Dat is de hoeveelheid '+v.c[1]+'.'],[rondaf(v.tot*v.a/(v.a+v.b),4),'Dat is in liter. De vraag is in ml.']],
  anders:v=>({tekst:'Teken een strook met alle delen.',svg:FIG.balk(Array.from({length:v.a+v.b},(_,i)=>({w:1,label:'',k:i<v.a?'a':'b'})),`${nl(v.tot*1000)} ml = ${v.a+v.b} delen`)}),
  tabel:v=>({kop:['Delen','ml'],rijen:[[v.a+v.b,v.tot*1000],[1,rondaf(v.tot*1000/(v.a+v.b),3)],[v.a,rondaf(v.tot*1000*v.a/(v.a+v.b),2)]],leeg:[[1,1],[2,1]]})
});
L({id:'V5.procentvan',niv:5,dom:'V',sub:'procent',naam:'Procent van procent: deel van een deel',rm:true,
  uitleg:'Een percentage van een percentage: vermenigvuldig de kommagetallen. 40% van de 60% = 0,4 × 0,6 = 0,24 = 24% van het geheel.',
  gen(r){ const p1=r.pick([40,50,60,75,80]),p2=r.pick([20,25,30,40,50,60]); const n=r.pick([400,500,800,1000,1200,2000]); return {p1,p2,n,wat:r.pick(['aantal','procent'])} },
  vraag:v=>v.wat==='aantal'?`Op een school zitten ${nl(v.n)} leerlingen. ${v.p1}% sport bij een club. Van die sporters doet ${v.p2}% aan voetbal. Hoeveel leerlingen voetballen bij een club?`:`Van alle leerlingen sport ${v.p1}% bij een club. Van die sporters doet ${v.p2}% aan voetbal. Hoeveel procent van alle leerlingen voetbalt bij een club?`,
  antw:v=>v.wat==='aantal'?v.n*v.p1*v.p2/10000:v.p1*v.p2/100, eenheid:v=>v.wat==='aantal'?'':'%',
  stappen:v=>v.wat==='aantal'?[st(`Sporters: ${nl(v.p1/100)} × ${nl(v.n)} = ${nl(v.n*v.p1/100)}`,v.n*v.p1/100),st(`Voetballers: ${nl(v.p2/100)} × ${nl(v.n*v.p1/100)} = ${nl(v.n*v.p1*v.p2/10000)}`,v.n*v.p1*v.p2/10000)]:[st(`${nl(v.p1/100)} × ${nl(v.p2/100)} = ${nl(v.p1*v.p2/10000)}`,v.p1*v.p2/10000),st(`= ${nl(v.p1*v.p2/100)}%`,v.p1*v.p2/100)],
  fouten:v=>v.wat==='aantal'?[[v.n*v.p2/100,'Het percentage voetballers gaat over de sporters, niet over alle leerlingen.'],[v.n*(v.p1-v.p2)/100,'Je trok de percentages af.']]:[[v.p2,'Dat percentage gaat over de sporters, niet over alle leerlingen.'],[v.p1+v.p2>100?v.p1-v.p2:v.p1+v.p2,'Percentages van verschillende gehelen mag je niet optellen of aftrekken.']],
  anders:v=>({tekst:'Stel je 100 leerlingen voor. '+v.p1+' sporten. Van die '+v.p1+' voetbalt '+v.p2+'%: dat zijn '+nl(v.p1*v.p2/100)+' leerlingen van de 100.',svg:FIG.balk([{w:v.p1*v.p2/100,label:'voetbal',k:'a'},{w:v.p1-v.p1*v.p2/100,label:'andere sport',k:'b'},{w:100-v.p1,label:'geen club',k:'zacht'}],'alle leerlingen = 100%')})
});
// ---------- Meten en meetkunde ----------
L({id:'M5.kmums',niv:5,dom:'M',sub:'eenheden',naam:'Snelheid omrekenen: km/u en m/s',rm:true,dec:2,
  uitleg:'1 m/s = 3,6 km/u (in een uur zitten 3600 seconden: 3600 m = 3,6 km). Van m/s naar km/u: keer 3,6. Van km/u naar m/s: delen door 3,6.',
  gen(r){ const naarKmu=r.ja(); const ms=r.pick([5,10,12.5,15,20,25,30,2.5,7.5]); return {naarKmu,ms,kmu:rondaf(ms*3.6,2),c:r.pick(['Een sprinter loopt','Een trein rijdt','Een windvlaag waait','Een scooter rijdt'])} },
  vraag:v=>v.naarKmu?`${v.c} ${nl(v.ms)} m/s. Hoeveel km/u is dat?`:`${v.c} ${nl(v.kmu)} km/u. Hoeveel m/s is dat?`,
  antw:v=>v.naarKmu?v.kmu:v.ms, eenheid:v=>v.naarKmu?'km/u':'m/s',
  stappen:v=>v.naarKmu?[st(`In 1 uur (3600 s): ${nl(v.ms)} × 3600 = ${nl(v.ms*3600)} m`,v.ms*3600),st(`${nl(v.ms*3600)} m = ${nl(v.kmu)} km, dus ${nl(v.kmu)} km/u`,v.kmu)]:[st(`${nl(v.kmu)} km/u = ${nl(v.kmu*1000)} m per 3600 s`,v.kmu*1000),st(`${nl(v.kmu*1000)} : 3600 = ${nl(v.ms)} m/s`,v.ms)],
  fouten:v=>v.naarKmu?[[rondaf(v.ms/3.6,2),'Je deelde. Van m/s naar km/u is keer 3,6 (km/u is het grotere getal).'],[rondaf(v.ms*60,2),'Er zitten 3600 seconden in een uur, en 1000 m in een km.'],[rondaf(v.ms*3600,2),'Dat zijn meters per uur. Reken om naar km.']]:[[rondaf(v.kmu*3.6,2),'Je vermenigvuldigde. Van km/u naar m/s deel je door 3,6.'],[rondaf(v.kmu/60,2),'Er zitten 3600 seconden in een uur, en 1000 m in een km.'],[rondaf(v.kmu*1000,2),'Dat zijn meters per uur.']],
  anders:v=>({tekst:'Verhoudingstabel van meters per seconde naar per uur:',tabel:{kop:['Tijd','Afstand'],rijen:[['1 s',nl(v.ms)+' m'],['3600 s',nl(v.ms*3600)+' m'],['1 uur',nl(v.kmu)+' km']]}})
});
L({id:'M5.cilinder',niv:5,dom:'M',sub:'inhoud',naam:'Inhoud van een cilinder',rm:true,dec:1,tol:v=>Math.max(.06,Math.PI*v.r*v.r*v.h/1000*.0015),
  uitleg:'Inhoud cilinder = oppervlakte grondvlak × hoogte = π × r × r × h. In cm krijg je cm³; 1000 cm³ = 1 liter.',
  gen(r){ return {r:r.pick([3,4,5,6,8,10,12,15]),h:r.pick([10,12,15,20,25,30,40]),c:r.pick(['Een blik','Een regenton','Een vaas','Een theelicht-houder','Een drinkfles'])} },
  vraag:v=>`${v.c} is een cilinder met een straal van ${v.r} cm en een hoogte van ${v.h} cm. Hoeveel liter past erin? Rond af op 1 decimaal.`,
  antw:v=>rondaf(Math.PI*v.r*v.r*v.h/1000,1), eenheid:'liter',
  stappen:v=>[st(`Grondvlak: π × ${v.r} × ${v.r} ≈ ${nl(rondaf(Math.PI*v.r*v.r,2))} cm²`,rondaf(Math.PI*v.r*v.r,2)),st(`Inhoud: ${nl(rondaf(Math.PI*v.r*v.r,2))} × ${v.h} ≈ ${nl(rondaf(Math.PI*v.r*v.r*v.h,0))} cm³`,rondaf(Math.PI*v.r*v.r*v.h,0)),st(`: 1000 ≈ ${nl(rondaf(Math.PI*v.r*v.r*v.h/1000,1))} liter`,rondaf(Math.PI*v.r*v.r*v.h/1000,1))],
  fouten:v=>[[rondaf(Math.PI*4*v.r*v.r*v.h/1000,1),'Je gebruikte de diameter in plaats van de straal.'],[rondaf(Math.PI*v.r*v.r*v.h,1),'Dat zijn cm³. 1 liter = 1000 cm³.'],[rondaf(2*Math.PI*v.r*v.h/1000,1),'Je gebruikte de omtrek in plaats van de oppervlakte van het grondvlak.']],
  anders:v=>`Een cilinder is een stapel dunne cirkels. Eén laagje van 1 cm hoog is π × ${v.r}² ≈ ${nl(rondaf(Math.PI*v.r*v.r,1))} cm³. Er liggen ${v.h} laagjes op elkaar.`
});
L({id:'M5.gemsnelheid',niv:5,dom:'M',sub:'tijd',naam:'Gemiddelde snelheid over een hele rit',rm:true,dec:1,
  uitleg:'Gemiddelde snelheid = totale afstand : totale tijd. Je mag de twee snelheden niet zomaar middelen als de tijden verschillen.',
  gen(r){ let s1,t1,s2,t2,gem; do{ s1=r.pick([10,12,15,18,20,24,30]); t1=r.pick([0.5,1,1.5,2]); s2=r.pick([4,5,6,8,10]); t2=r.pick([0.5,1,1.5]); gem=(s1*t1+s2*t2)/(t1+t2) }while(Math.abs(gem*10-Math.round(gem*10))>1e-9||(s1+s2)/2===gem); return {s1,t1,s2,t2} },
  vraag:v=>`Bij een triatlontraining fiets je ${nl(v.t1)} uur met ${v.s1} km/u en daarna loop je ${nl(v.t2)} uur met ${v.s2} km/u. Wat is je gemiddelde snelheid over de hele training?`,
  antw:v=>rondaf((v.s1*v.t1+v.s2*v.t2)/(v.t1+v.t2),1), eenheid:'km/u',
  stappen:v=>[st(`Afstand: ${v.s1} × ${nl(v.t1)} + ${v.s2} × ${nl(v.t2)} = ${nl(v.s1*v.t1+v.s2*v.t2)} km`,v.s1*v.t1+v.s2*v.t2),st(`Tijd: ${nl(v.t1)} + ${nl(v.t2)} = ${nl(v.t1+v.t2)} uur`,v.t1+v.t2),st(`${nl(v.s1*v.t1+v.s2*v.t2)} : ${nl(v.t1+v.t2)} = ${nl((v.s1*v.t1+v.s2*v.t2)/(v.t1+v.t2))} km/u`,rondaf((v.s1*v.t1+v.s2*v.t2)/(v.t1+v.t2),1))],
  fouten:v=>[[(v.s1+v.s2)/2,'Je nam het gemiddelde van de twee snelheden. Maar je was niet even lang met elke snelheid bezig.'],[v.s1*v.t1+v.s2*v.t2,'Dat is de totale afstand. Deel nog door de totale tijd.'],[rondaf((v.s1*v.t1+v.s2*v.t2)/2,1),'Deel door de totale tijd, niet door 2.']],
  anders:v=>`Maak er één rit van: hoe ver ben je in totaal gekomen, en hoe lang was je onderweg? Dan is het gewoon afstand : tijd.`,
  sab:v=>({intro:`Je fietst ${nl(v.t1)} uur met ${v.s1} km/u en loopt daarna ${nl(v.t2)} uur met ${v.s2} km/u. Yara rekent de gemiddelde snelheid uit.`,stappen:[`Snelheid 1 is ${v.s1} km/u, snelheid 2 is ${v.s2} km/u.`,`Gemiddeld: (${v.s1} + ${v.s2}) : 2 = ${nl((v.s1+v.s2)/2)} km/u.`,`Antwoord: ${nl((v.s1+v.s2)/2)} km/u.`],fout:1,juist:rondaf((v.s1*v.t1+v.s2*v.t2)/(v.t1+v.t2),1),check:(v.s1+v.s2)/2,eenheid:'km/u',vraag:'Wat is de gemiddelde snelheid echt?',uitleg:'Je mag snelheden alleen zo middelen als je even lang met elke snelheid bezig was. Gebruik totale afstand : totale tijd.',goed:[`Afstand ${nl(v.s1*v.t1+v.s2*v.t2)} km`,`Tijd ${nl(v.t1+v.t2)} uur`,`${nl(rondaf((v.s1*v.t1+v.s2*v.t2)/(v.t1+v.t2),1))} km/u`]})
});
L({id:'M5.vergroten',niv:5,dom:'M',sub:'meetkunde',naam:'Vergroten: wat gebeurt er met de oppervlakte?',
  uitleg:'Worden alle lengtes k keer zo groot, dan wordt de oppervlakte k × k keer zo groot. Twee keer zo lang en twee keer zo breed = vier keer zo veel oppervlakte.',
  gen(r){ const k=r.pick([2,3,4,5,1.5,0.5]); const l=r.pick([10,12,20,30]),b=r.pick([8,10,15,20]); return {k,l,b,c:r.pick(['Een foto','Een poster','Een tekening','Een tegel'])} },
  vraag:v=>`${v.c} van ${v.l} cm bij ${v.b} cm wordt ${v.k<1?'verkleind':'vergroot'} tot ${nl(v.l*v.k)} cm bij ${nl(v.b*v.k)} cm. Hoeveel keer zo groot wordt de oppervlakte?`,
  antw:v=>rondaf(v.k*v.k,4),
  stappen:v=>[st(`Lengtes: ${nl(v.k)} keer zo groot`,v.k),st(`Oppervlakte: ${nl(v.k)} × ${nl(v.k)} = ${nl(v.k*v.k)} keer zo groot`,rondaf(v.k*v.k,4)),st(`Controle: ${v.l*v.b} cm² → ${nl(v.l*v.k*v.b*v.k)} cm²`)],
  fouten:v=>[[v.k,'De lengte en de breedte worden allebei '+nl(v.k)+' keer zo groot. De oppervlakte dus '+nl(v.k)+' × '+nl(v.k)+'.'],[2*v.k,'Je moet de factoren vermenigvuldigen, niet optellen.'],[rondaf(v.k**3,4),'Keer 3 is voor inhoud. Oppervlakte heeft twee richtingen.']],
  anders:v=>({tekst:`Teken het: bij een vergroting met factor ${nl(v.k)} passen er ${nl(v.k)} × ${nl(v.k)} kopieën van de oude figuur in de nieuwe.`,svg:v.k===2?FIG.strook(4,4,'2 × 2 = 4 kopieën'):''})
});
// ---------- Verbanden ----------
L({id:'B5.tabelformule',niv:5,dom:'B',sub:'formules',naam:'Van tabel naar formule',
  uitleg:'Bij een vaste toename per stap: het startgetal (bij 0) is het vaste deel en de toename per stap staat voor de letter. y = toename × x + startgetal.',
  gen(r){ const a=r.pick([2,3,4,5,6,1.5,2.5]),b=r.int(2,25),n=r.pick([12,15,20,25,30]); return {a,b,n,c:r.pick([['Aantal weken','Bedrag op rekening (€)'],['Aantal uur','Kosten (€)'],['Aantal dagen','Hoogte plant (cm)']])} },
  vraag:v=>`In de tabel zie je een vaste toename.<div class="vtabel">${vtabelHtml([v.c[0],v.c[1]],[0,1,2,3,4].map(x=>[x,rondaf(v.a*x+v.b,2)]))}</div>Welke waarde hoort bij ${v.n}?`,
  antw:v=>rondaf(v.a*v.n+v.b,2),
  stappen:v=>[st(`Startgetal (bij 0): ${v.b}`,v.b),st(`Toename per stap: ${nl(v.a)}`,v.a),st(`Formule: y = ${nl(v.a)}x + ${v.b}`),st(`Bij ${v.n}: ${nl(v.a)} × ${v.n} + ${v.b} = ${nl(v.a*v.n+v.b)}`,rondaf(v.a*v.n+v.b,2))],
  fouten:v=>[[rondaf(v.a*v.n,2),'Je bent het startgetal vergeten.'],[rondaf((v.a+v.b)*v.n,2),'De waarde bij 1 is niet de toename per stap. Kijk naar het verschil tussen twee kolommen.'],[rondaf(v.a*(v.n-1)+v.b,2),'Tel de stappen vanaf 0.']],
  anders:v=>`Kijk naar het verschil tussen twee kolommen naast elkaar: steeds ${nl(v.a)}. Vanaf ${v.b} komt er ${v.n} keer ${nl(v.a)} bij.`,
  v3:v=>({vraag:`Een tabel begint bij ${v.b} en neemt per stap ${nl(v.a)} toe. Leg uit hoe je de formule opstelt.`,
    goed:`Bij 0 is het ${v.b}, dat is het vaste deel. Per stap komt er ${nl(v.a)} bij. Dus y = ${nl(v.a)}x + ${v.b}.`,
    bijna:`Per stap komt er ${nl(v.a)} bij, dus y = ${nl(v.a)}x.`,
    fout:`Bij 1 is het ${nl(v.a+v.b)}, dus y = ${nl(v.a+v.b)}x.`,
    kijkwijzer:['Is het startgetal (bij 0) gebruikt?','Is de toename per stap uit de verschillen gehaald?','Klopt de formule als je een waarde uit de tabel invult?']})
});
L({id:'B5.helling',niv:5,dom:'B',sub:'grafieken',naam:'Helling uit een grafiek: hoeveel per stap?',rm:true,dec:2,
  uitleg:'De helling is hoeveel de grafiek stijgt per stap naar rechts: (verschil verticaal) : (verschil horizontaal). Kies twee punten die precies op het rooster liggen.',
  gen(r){ const a=r.pick([0.5,1.5,2,2.5,3,4,5]),b=r.pick([0,5,10,15,20]); return {a,b,c:r.pick([['aantal km','kosten (€)','euro per km'],['aantal minuten','liter water','liter per minuut'],['aantal weken','gespaard (€)','euro per week']])} },
  vraag:v=>`Hoeveel ${v.c[2]} komt erbij volgens de grafiek?`,
  fig:v=>FIG.grafiek([{punten:[[0,v.b],[10,v.b+10*v.a]]}],{xmax:10,xs:2,ymax:Math.ceil((v.b+10*v.a)/10)*10,ys:Math.ceil((v.b+10*v.a)/50)*5||5,xl:v.c[0],yl:v.c[1]}),
  antw:v=>v.a,
  stappen:v=>[st(`Punt 1: (0, ${v.b}); punt 2: (10, ${nl(v.b+10*v.a)})`),st(`Verticaal: ${nl(v.b+10*v.a)} − ${v.b} = ${nl(10*v.a)}`,rondaf(10*v.a,2)),st(`Per stap: ${nl(10*v.a)} : 10 = ${nl(v.a)}`,v.a)],
  fouten:v=>[[rondaf(v.b+10*v.a,2),'Dat is de hoogte van het eindpunt. Je zoekt de toename per stap.'],[rondaf((v.b+10*v.a)/10,2),'Je vergat het beginpunt eraf te halen.'],[v.b,'Dat is het beginpunt.']],
  anders:v=>`Ga vanaf een punt op de lijn één stap naar rechts en kijk hoeveel je omhoog moet om de lijn weer te raken. Dat is de helling.`
});
L({id:'B5.gewogen',niv:5,dom:'B',sub:'statistiek',naam:'Gewogen gemiddelde',rm:true,dec:1,verwar:['B4.frequentie'],
  uitleg:'Bij een gewogen gemiddelde telt het ene cijfer zwaarder dan het andere. Vermenigvuldig elk cijfer met zijn weging, tel op, en deel door de som van de wegingen.',
  gen(r){ let c,w,s,t; do{ c=[r.int(40,90)/10,r.int(40,90)/10,r.int(40,90)/10]; w=[r.pick([1,2]),r.pick([1,2,3]),r.pick([2,3,4])]; s=c.reduce((a,x,i)=>a+x*w[i],0); t=w.reduce((a,b)=>a+b,0) }while(Math.abs(s/t*10-Math.round(s/t*10))>1e-9); return {c,w,s,t,vak:r.pick(CTX.vak)} },
  vraag:v=>`Voor ${v.vak} heb je deze cijfers:<div class="vtabel">${vtabelHtml(['Toets','Cijfer','Weging'],v.c.map((x,i)=>['Toets '+(i+1),nl(x),v.w[i]+'×']))}</div>Wat is je gemiddelde (op 1 decimaal)?`,
  antw:v=>rondaf(v.s/v.t,1),
  stappen:v=>[st(`Cijfer × weging: ${v.c.map((x,i)=>`${nl(x)}×${v.w[i]}`).join(' + ')} = ${nl(v.s)}`,rondaf(v.s,2)),st(`Som van de wegingen: ${v.w.join(' + ')} = ${v.t}`,v.t),st(`${nl(v.s)} : ${v.t} = ${nl(v.s/v.t)}`,rondaf(v.s/v.t,1))],
  fouten:v=>[[rondaf((v.c[0]+v.c[1]+v.c[2])/3,1),'Dat is het gewone gemiddelde. De toetsen tellen niet even zwaar.'],[rondaf(v.s/3,1),'Deel door de som van de wegingen, niet door het aantal toetsen.'],[rondaf(v.s,1),'Deel nog door de som van de wegingen.']],
  anders:v=>`Schrijf elk cijfer zo vaak op als zijn weging: ${v.c.map((x,i)=>Array(v.w[i]).fill(nl(x)).join(', ')).join(', ')}. Dat zijn ${v.t} cijfers. Neem daarvan het gewone gemiddelde.`
});
L({id:'B5.kruistabel',niv:5,dom:'B',sub:'tabellen',naam:'Percentages in een kruistabel',rm:true,dec:1,
  uitleg:'Lees de vraag goed: "van de meisjes" betekent dat je deelt door het totaal aantal meisjes, niet door alle leerlingen.',
  gen(r){ let a,b,c,d; do{ a=r.int(5,30);b=r.int(5,30);c=r.int(5,30);d=r.int(5,30) }while(![20,25,40,50,80].includes(a+b)||![20,25,40,50,80].includes(c+d)); return {a,b,c,d,act:r.pick(['fietsen naar school','bijbaantje hebben','lid zijn van een sportclub'])} },
  vraag:v=>`Een enquête onder leerlingen: ${v.act}?<div class="vtabel">${vtabelHtml(['','Ja','Nee','Totaal'],[['Meisjes',v.a,v.b,v.a+v.b],['Jongens',v.c,v.d,v.c+v.d],['Totaal',v.a+v.c,v.b+v.d,v.a+v.b+v.c+v.d]])}</div>Hoeveel procent van de meisjes zegt ja?`,
  antw:v=>rondaf(100*v.a/(v.a+v.b),1), eenheid:'%',
  stappen:v=>[st(`Meisjes in totaal: ${v.a+v.b}`,v.a+v.b),st(`Meisjes met ja: ${v.a}`,v.a),st(`${v.a} : ${v.a+v.b} × 100 = ${nl(100*v.a/(v.a+v.b))}%`,rondaf(100*v.a/(v.a+v.b),1))],
  fouten:v=>[[rondaf(100*v.a/(v.a+v.b+v.c+v.d),1),'Je deelde door alle leerlingen. De vraag gaat over de meisjes.'],[rondaf(100*v.a/(v.a+v.c),1),'Je deelde door iedereen die ja zegt. De vraag is: hoeveel procent van de meisjes.'],[v.a,'Dat is het aantal, geen percentage.']],
  anders:v=>`Bedek in gedachten de rij van de jongens. Je kijkt alleen naar de meisjes: ${v.a} van de ${v.a+v.b}.`
});
