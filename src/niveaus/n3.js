// ===== Niveau 3 · 1S → 2F · ongeveer 1e klas =====
// ---------- Getallen ----------
L({id:'G3.volgorde',niv:7,dom:'G',sub:'bewerkingen',naam:'Volgorde van bewerkingen',negatief:false,
  uitleg:'Eerst wat tussen haakjes staat, dan keer en delen, daarna plus en min. Werk bij gelijke bewerkingen van links naar rechts.',
  gen(r){ const vorm=r.pick(['a+b×c','a−b×c','(a+b)×c','a+b:c','a×b−c×d']); let a=r.int(2,20),b=r.int(2,12),c=r.int(2,9),d=r.int(2,6);
    if(vorm==='a+b:c') b=c*r.int(2,9); if(vorm==='a−b×c') a=b*c+r.int(1,30); if(vorm==='a×b−c×d'&&a*b<=c*d) a=c*d+r.int(1,6); return {vorm,a,b,c,d} },
  vraag:v=>`Reken uit: <b>${v.vorm.replace('a',v.a).replace('b',v.b).replace('c',v.c).replace('d',v.d)}</b>`,
  antw:v=>({'a+b×c':v.a+v.b*v.c,'a−b×c':v.a-v.b*v.c,'(a+b)×c':(v.a+v.b)*v.c,'a+b:c':v.a+v.b/v.c,'a×b−c×d':v.a*v.b-v.c*v.d})[v.vorm],
  stappen:v=>({'a+b×c':[st(`Eerst keer: ${v.b} × ${v.c} = ${v.b*v.c}`,v.b*v.c),st(`Dan plus: ${v.a} + ${v.b*v.c} = ${v.a+v.b*v.c}`,v.a+v.b*v.c)],
    'a−b×c':[st(`Eerst keer: ${v.b} × ${v.c} = ${v.b*v.c}`,v.b*v.c),st(`Dan min: ${v.a} − ${v.b*v.c} = ${v.a-v.b*v.c}`,v.a-v.b*v.c)],
    '(a+b)×c':[st(`Eerst haakjes: ${v.a} + ${v.b} = ${v.a+v.b}`,v.a+v.b),st(`Dan keer: ${v.a+v.b} × ${v.c} = ${(v.a+v.b)*v.c}`,(v.a+v.b)*v.c)],
    'a+b:c':[st(`Eerst delen: ${v.b} : ${v.c} = ${v.b/v.c}`,v.b/v.c),st(`Dan plus: ${v.a} + ${v.b/v.c} = ${v.a+v.b/v.c}`,v.a+v.b/v.c)],
    'a×b−c×d':[st(`${v.a} × ${v.b} = ${v.a*v.b}`,v.a*v.b),st(`${v.c} × ${v.d} = ${v.c*v.d}`,v.c*v.d),st(`${v.a*v.b} − ${v.c*v.d} = ${v.a*v.b-v.c*v.d}`,v.a*v.b-v.c*v.d)]})[v.vorm],
  fouten:v=>({'a+b×c':[[(v.a+v.b)*v.c,'Je rekende van links naar rechts. Keer gaat vóór plus.']],'a−b×c':[[(v.a-v.b)*v.c,'Je rekende van links naar rechts. Keer gaat vóór min.']],'(a+b)×c':[[v.a+v.b*v.c,'Haakjes gaan voor alles: eerst optellen.']],'a+b:c':[[rondaf((v.a+v.b)/v.c,2),'Je rekende van links naar rechts. Delen gaat vóór plus.']],'a×b−c×d':[[(v.a*v.b-v.c)*v.d,'Je rekende van links naar rechts. Doe eerst beide keersommen.']]})[v.vorm].concat([[({'a+b×c':v.a+v.b+v.c,'a−b×c':v.a-v.b-v.c,'(a+b)×c':v.a+v.b+v.c,'a+b:c':v.a+v.b-v.c,'a×b−c×d':v.a+v.b-v.c-v.d})[v.vorm],'Kijk goed welke bewerkingen er staan.']]),
  anders:v=>`Zet in gedachten haakjes om de keer- en deelsommen. Die reken je als eerste uit. Op een rekenmachine met de goede volgorde krijg je hetzelfde antwoord.`,
  sab:v=>{ const A=v.a, B=v.b, C=v.c; const fout=(A+B)*C; return {intro:`Noor rekent <b>${A} + ${B} × ${C}</b> uit.`,stappen:[`Er staat een plus en een keer.`,`${A} + ${B} = ${A+B}`,`${A+B} × ${C} = ${fout}`,`Antwoord: ${fout}`],fout:1,juist:A+B*C,check:fout,eenheid:'',vraag:'Wat is het goede antwoord?',uitleg:'Keer gaat vóór plus. Noor begint met optellen.',goed:[`${B} × ${C} = ${B*C}`,`${A} + ${B*C} = ${A+B*C}`]} }
});
const NOEMERPAREN=[[2,3],[2,4],[3,4],[2,5],[3,6],[4,8],[2,6],[4,6],[3,12],[6,8],[4,12],[5,10]];
L({id:'G3.breukoptellen',niv:7,dom:'G',sub:'breuken',naam:'Breuken optellen en aftrekken',dec:9,tol:.002,
  uitleg:'Maak de breuken eerst gelijknamig: zoek een noemer waar beide noemers in passen. Tel dan alleen de tellers op. De noemer blijft hetzelfde.',
  toon:x=>fr(x),
  gen(r){ let a,b,c,d,op; do{ [b,d]=r.pick(NOEMERPAREN); a=r.int(1,b-1); c=r.int(1,d-1); op=r.ja(.7)||a/b<=c/d?'+':'−'; if(a/b<=c/d) op='+' }while(op==='+'&&a/b+c/d>1); return {a,b,c,d,op,ctx:r.pick(['pizza','taart','lasagne','chocoladereep'])} }, // samen nooit meer dan één geheel
  vraag:v=>v.op==='+'?`Je eet ${breuk(v.a,v.b)} van een ${v.ctx} en je vriend eet ${breuk(v.c,v.d)}. Welk deel hebben jullie samen gegeten? Geef je antwoord als breuk, bijvoorbeeld 5/6.`:`Er is nog ${breuk(v.a,v.b)} van een ${v.ctx} over. Jij eet daarvan ${breuk(v.c,v.d)} van de hele ${v.ctx} op. Welk deel is er nu nog over? Geef je antwoord als breuk.`,
  antw:v=>v.op==='+'?v.a/v.b+v.c/v.d:v.a/v.b-v.c/v.d,
  stappen:v=>{ const n=v.b*v.d/ggd(v.b,v.d), x=v.a*n/v.b, y=v.c*n/v.d, z=v.op==='+'?x+y:x-y; return [st(`Gelijke noemer: ${n}`,n),st(`${breuk(v.a,v.b)} = ${breuk(x,n)} en ${breuk(v.c,v.d)} = ${breuk(y,n)}`),st(`${x} ${v.op==='+'?'+':'−'} ${y} = ${z}, dus ${breuk(z,n)}${ggd(z,n)>1?' = '+fr(z/n):''}`,z/n)] },
  fouten:v=>[[v.op==='+'?(v.a+v.c)/(v.b+v.d):Math.abs(v.a-v.c)/Math.abs(v.b-v.d||1),'Je telde de noemers ook op. De noemer zegt hoe groot de stukjes zijn; die verander je niet door op te tellen.'],[v.op==='+'?(v.a+v.c)/(v.b*v.d):Math.abs(v.a-v.c)/(v.b*v.d),'Je maakte de noemer gelijk, maar vergat de tellers mee te veranderen.'],[(v.op==='+'?v.a+v.c:Math.abs(v.a-v.c))/Math.max(v.b,v.d),'Je nam de grootste noemer, maar veranderde de teller van de andere breuk niet mee.']],
  anders:v=>({tekst:`Verdeel alles in stukjes van dezelfde grootte. Dan kun je de stukjes gewoon tellen.`,svg:FIG.strook(Math.round((v.op==='+'?v.a/v.b+v.c/v.d:v.a/v.b-v.c/v.d)*(v.b*v.d/ggd(v.b,v.d))),v.b*v.d/ggd(v.b,v.d),`in stukjes van 1/${v.b*v.d/ggd(v.b,v.d)}`)}),
  waarom:{vraag:'Waarom moet je de breuken eerst gelijknamig maken?',opties:['Je kunt alleen stukjes optellen die even groot zijn.','Omdat de grootste noemer altijd wint.','Omdat je anders een kommagetal krijgt.']}
});
L({id:'G3.kommadelen',niv:7,dom:'G',sub:'komma',naam:'Delen met geld: prijs per stuk',verwar:['V3.prijsvgl'],
  uitleg:'Bij delen met geld kun je het bedrag in centen zetten, delen, en dan terug naar euro\'s. Schat eerst: past het antwoord?',
  gen(r){ const c=r.int(0,2); const p=[r.int(8,24),r.int(90,240),r.int(20,60)][c]*5, n=[r.pick([4,6,8,12]),r.pick([3,4,5,6]),r.pick([3,4,5,6])][c]; return {p,n,tot:p*n,c} },
  vraag:v=>[`Een multipack van ${v.n} blikjes frisdrank kost ${eur(c2e(v.tot))}. Wat kost één blikje?`,`Met ${v.n} vrienden betalen jullie samen ${eur(c2e(v.tot))} voor pizza's. Hoeveel betaalt ieder?`,`Een pak met ${v.n} paar sportsokken kost ${eur(c2e(v.tot))}. Wat kost één paar?`][v.c],
  antw:v=>c2e(v.p), eenheid:'€',
  stappen:v=>[st(`${eur(c2e(v.tot))} = ${v.tot} cent`,v.tot),st(`${v.tot} : ${v.n} = ${v.p} cent`,v.p),st(`${v.p} cent = ${eur(c2e(v.p))}`,c2e(v.p))],
  fouten:v=>[[c2e(v.p)*10,'De komma staat verkeerd. Schat: '+eur(c2e(v.tot))+' verdelen over '+v.n+' is ongeveer '+eur(Math.round(v.tot/100/v.n))+' per stuk.'],[rondaf(c2e(v.tot)*v.n,2),'Je vermenigvuldigde. Eén stuk is goedkoper dan het hele pak.'],[rondaf(c2e(v.tot)-v.n,2),'Je trok het aantal af. Je moet delen.']],
  anders:v=>({tekst:'Gebruik een verhoudingstabel.',tabel:{kop:['Aantal','Prijs (€)'],rijen:[[v.n,c2e(v.tot)],[1,c2e(v.p)]]}})
});
L({id:'G3.negatief',niv:7,dom:'G',sub:'negatief',naam:'Negatieve getallen in de praktijk',negatief:true,
  uitleg:'Gebruik een getallenlijn (of een thermometer). Onder nul tel je naar links. Het verschil tussen −4 en 7 is 4 + 7 = 11.',
  gen(r){ const type=r.pick(['verschil','daling']); const laag=-r.int(2,12),hoog=r.int(2,15),start=r.int(1,8),d=r.int(start+2,start+12); return {type,laag,hoog,start,d,plek:r.pick(['in Oostenrijk op wintersport','in de Alpen','in Lapland','in een ijshal'])} },
  vraag:v=>v.type==='verschil'?`Je bent ${v.plek}. 's Nachts is het ${nl(v.laag)} °C en overdag ${v.hoog} °C. Hoeveel graden is het verschil?`:`Je bent ${v.plek}. 's Middags is het ${v.start} °C. 's Nachts daalt de temperatuur ${v.d} graden. Hoe koud is het dan?`,
  antw:v=>v.type==='verschil'?v.hoog-v.laag:v.start-v.d, eenheid:'°C',
  stappen:v=>v.type==='verschil'?[st(`Van ${nl(v.laag)} naar 0: ${-v.laag} graden`,-v.laag),st(`Van 0 naar ${v.hoog}: ${v.hoog} graden`,v.hoog),st(`Samen: ${-v.laag} + ${v.hoog} = ${v.hoog-v.laag}`,v.hoog-v.laag)]:[st(`Van ${v.start} naar 0: ${v.start} graden omlaag`,v.start),st(`Nog ${v.d-v.start} graden omlaag onder nul`,v.d-v.start),st(`Temperatuur: ${nl(v.start-v.d)} °C`,v.start-v.d)],
  fouten:v=>v.type==='verschil'?[[v.hoog+v.laag,'Je trok de getallen zonder minteken van elkaar af. Onder nul tellen de graden óók mee.'],[v.hoog,'Je bent de graden onder nul vergeten.']]:[[v.d-v.start,'Het is onder nul: vergeet het minteken niet.'],[v.start+v.d,'De temperatuur daalt: je moet aftrekken.']],
  anders:v=>({tekst:'Kijk op de getallenlijn hoeveel stappen je zet.',svg:v.type==='verschil'?FIG.lijn(v.laag-1,v.hoog+1,1,[{x:v.laag,label:nl(v.laag)},{x:0,label:'0',k:'b'},{x:v.hoog,label:String(v.hoog)}],2):FIG.lijn(v.start-v.d-1,v.start+1,1,[{x:v.start,label:String(v.start)},{x:0,label:'0',k:'b'},{x:v.start-v.d,label:nl(v.start-v.d)}],2)})
});
// ---------- Verhoudingen ----------
L({id:'V3.korting',niv:7,dom:'V',sub:'procent',naam:'Nieuwe prijs na korting',verwar:['V3.hoeveelprocent','V4.terugrekenen'],
  uitleg:'Korting haal je van 100% af. Wat overblijft is het deel dat je betaalt. 25% korting: je betaalt 75%, dus 0,75 × de prijs.',
  gen(r){ let p,k; do{ [,p]=[0,r.pick([40,45,60,80,90,120,140,150,200,250])]; k=r.pick([10,15,20,25,30,35,40]) }while((p*k)%100!==0&&(p*k)%50!==0); return {p,k,d:r.pick(['koptelefoon','festivalticket','paar sneakers','skateboard','spijkerbroek','game','wintercoat'])} },
  vraag:v=>`Een ${v.d} kost ${eur(v.p)}. Op Black Friday krijg je ${v.k}% korting. Wat betaal je?`,
  antw:v=>rondaf(v.p*(100-v.k)/100,2), eenheid:'€',
  stappen:v=>[st(`Je betaalt 100% − ${v.k}% = ${100-v.k}%`,100-v.k),st(`${100-v.k}% = ${nl((100-v.k)/100)}`,(100-v.k)/100),st(`${nl((100-v.k)/100)} × ${v.p} = ${eur(v.p*(100-v.k)/100)}`,rondaf(v.p*(100-v.k)/100,2))],
  fouten:v=>[[rondaf(v.p*v.k/100,2),'Dat is de korting: wat je bespaart. De vraag is wat je betaalt.'],[v.p-v.k,`Je trok € ${v.k} af. ${v.k}% is niet hetzelfde als € ${v.k}.`],[rondaf(v.p*(100+v.k)/100,2),'Bij korting wordt de prijs lager, niet hoger.']],
  anders:v=>({tekst:`Teken de prijs als een balk van 100%. Knip er ${v.k}% af. Wat overblijft is ${100-v.k}%: dat betaal je.`,svg:FIG.balk([{w:100-v.k,label:`jij betaalt ${100-v.k}%`,k:'a'},{w:v.k,label:`${v.k}%`,k:'zacht'}],`100% = ${eur(v.p)}`)}),
  waarom:{vraag:'Waarom reken je eerst 100% − korting uit?',opties:['Dan weet je welk deel van de prijs je nog betaalt.','Omdat je bij procenten altijd van 100 aftrekt.','Omdat de korting altijd 100% is.']},
  sab:v=>({intro:`Een ${v.d} kost ${eur(v.p)} en je krijgt ${v.k}% korting. Sem rekent de nieuwe prijs uit.`,stappen:[`De korting is ${v.k}%.`,`Ik haal de korting van de prijs af: ${v.p} − ${v.k} = ${v.p-v.k}.`,`De nieuwe prijs is ${eur(v.p-v.k)}.`],fout:1,juist:rondaf(v.p*(100-v.k)/100,2),check:v.p-v.k,eenheid:'€',vraag:'Wat is de nieuwe prijs echt?',uitleg:`${v.k}% is een deel van de prijs, geen bedrag in euro. ${v.k}% van ${eur(v.p)} is ${eur(v.p*v.k/100)}.`,goed:[`${v.k}% van ${v.p} = ${nl(v.p*v.k/100)}`,`${v.p} − ${nl(v.p*v.k/100)} = ${eur(v.p*(100-v.k)/100)}`]})
});
L({id:'V3.hoeveelprocent',niv:7,dom:'V',sub:'procent',naam:'Hoeveel procent is het?',verwar:['V3.korting'],
  uitleg:'Deel het deel door het geheel en doe keer 100. 18 van de 24 = 18 : 24 = 0,75 = 75%.',
  gen(r){ let y,x; do{ y=r.pick([20,25,40,50,60,80,120,200,250,400]); x=r.int(1,y-1) }while((x*100)%y!==0&&(x*200)%y!==0); return {x,y,c:r.pick([['Je had','van de','vragen van de toets goed.'],['Van de','leerlingen in jaar 1 hebben er','een telefoon met een gebarsten scherm.'],['Een voetballer scoorde','keer uit','penalty\'s.']]),wissel:false} },
  vraag:v=>v.c[0]==='Van de'?`${v.c[0]} ${v.y} ${v.c[1]} ${v.x} ${v.c[2]} Hoeveel procent is dat?`:`${v.c[0]} ${v.x} ${v.c[1]} ${v.y} ${v.c[2]} Hoeveel procent is dat?`,
  antw:v=>rondaf(100*v.x/v.y,2), eenheid:'%',
  stappen:v=>[st(`Deel : geheel = ${v.x} : ${v.y} = ${nl(v.x/v.y)}`,rondaf(v.x/v.y,4)),st(`${nl(v.x/v.y)} × 100 = ${nl(100*v.x/v.y)}%`,rondaf(100*v.x/v.y,2))],
  fouten:v=>[[rondaf(v.x/v.y,4),'Dat is een kommagetal. Doe nog keer 100 voor procent.'],[rondaf(100*v.y/v.x,2),'Je deelde het geheel door het deel. Het is deel : geheel.'],[rondaf(100*(v.y-v.x)/v.y,2),'Dat is het andere deel.']],
  anders:v=>({tekst:'Maak een verhoudingstabel met 100 erin.',tabel:{kop:['Aantal','Procent'],rijen:[[v.y,100],[1,rondaf(100/v.y,4)],[v.x,rondaf(100*v.x/v.y,2)]]}}),
  tabel:v=>({kop:['Aantal','Procent'],rijen:[[v.y,100],[v.x,rondaf(100*v.x/v.y,2)]],leeg:[[1,1]]})
});
L({id:'V3.schaal',niv:7,dom:'V',sub:'schaal',naam:'De schaal van een kaart bepalen',
  uitleg:'Schaal = kaart : werkelijkheid, allebei in centimeters. Maak de kaartafstand 1 cm, dan staat er 1 : …',
  gen(r){ const s=r.pick([5000,10000,20000,25000,50000,100000]); const cm=r.pick([2,3,4,5,6,8,10,12]); return {s,cm,km:cm*s/100000} },
  vraag:v=>`Een fietspad is in het echt ${nl(v.km)} km lang. Op de kaart is het ${v.cm} cm. Wat is de schaal? Vul in: 1 : …`,
  antw:v=>v.s,
  stappen:v=>[st(`${nl(v.km)} km = ${nl(v.km*100000)} cm`,v.km*100000),st(`${v.cm} cm op de kaart is ${nl(v.km*100000)} cm echt`),st(`1 cm is ${nl(v.km*100000)} : ${v.cm} = ${nl(v.s)} cm, dus 1 : ${nl(v.s)}`,v.s)],
  fouten:v=>[[v.s/100,'Je rekende de echte afstand in meters. Kaart en werkelijkheid moeten allebei in cm.'],[v.s*v.cm*v.cm/v.cm,'Je deelde niet door de kaartafstand.'],[v.s/1000,'Van km naar cm is keer 100 000.']],
  anders:v=>({tekst:'Zet het in een tabel en maak de kaartafstand 1 cm.',tabel:{kop:['Kaart (cm)','Echt (cm)'],rijen:[[v.cm,v.km*100000],[1,v.s]]}})
});
L({id:'V3.snelheid',niv:7,dom:'V',sub:'schaal',naam:'Gemiddelde snelheid in km per uur',verwar:['V3.schaal'],
  uitleg:'Snelheid in km/u = hoeveel km je in 1 uur aflegt. Reken met een verhoudingstabel van je minuten naar 60 minuten.',
  gen(r){ const [c,lo,hi]=r.pick([['Je fietst naar de sportclub:',12,25],['Je skeelert een rondje:',10,20],['Je loopt een stuk van de wandeltocht:',4,6],['Je fietst naar je oma:',12,25]]); let km,min; do{ min=r.pick([10,12,15,20,30,40,45,50,90]); km=r.int(1,30) }while((km*60)%min!==0||km*60/min>hi||km*60/min<lo); return {km,min,c} }, // realistische snelheid per vervoermiddel
  vraag:v=>`${v.c} ${v.km} km in ${v.min} minuten. Wat is je gemiddelde snelheid in km/u?`,
  antw:v=>v.km*60/v.min, eenheid:'km/u',
  stappen:v=>[st(`${v.min} minuten → ${v.km} km`),st(`60 minuten is ${nl(60/v.min)} keer zo lang`,rondaf(60/v.min,4)),st(`${v.km} × ${nl(60/v.min)} = ${nl(v.km*60/v.min)} km/u`,v.km*60/v.min)],
  tabel:v=>({kop:['Minuten','Kilometer'],rijen:[[v.min,v.km],[60,v.km*60/v.min]],leeg:[[1,1]]}),
  fouten:v=>[[rondaf(v.km/v.min,2),'Dat is het aantal km per minuut. Voor km/u reken je naar 60 minuten.'],[rondaf(v.km*v.min/60,2),'Je deelde in plaats van vermenigvuldigd. In een heel uur kom je verder.'],[v.km,'Dat is de afstand in '+v.min+' minuten, niet in een uur.']],
  anders:v=>({tekst:'Verhoudingstabel: minuten boven, kilometers onder.',tabel:{kop:['Minuten','Kilometer'],rijen:[[v.min,v.km],[60,v.km*60/v.min]]}})
});
L({id:'V3.prijsvgl',niv:7,dom:'V',sub:'vtabel',naam:'Welke aanbieding is het voordeligst?',verwar:['G3.kommadelen'],
  uitleg:'Vergelijk prijzen door ze om te rekenen naar dezelfde hoeveelheid, bijvoorbeeld de prijs per stuk of per 100 gram.',
  gen(r){ let a,b,pa,pb; do{ a=r.pick([4,6,8,10,12]); b=r.pick([6,12,15,20,24]); pa=a*r.int(30,90)*1; pb=b*r.int(30,90) }while(a===b||pa/a===pb/b||Math.abs(pa/a-pb/b)<4); return {a,b,pa,pb,w:r.pick(['blikjes frisdrank','pakjes drinken','eierkoeken','energierepen'])} },
  vraag:v=>`Welke aanbieding is het voordeligst?<br>A: ${v.a} ${v.w} voor ${eur(c2e(v.pa))}<br>B: ${v.b} ${v.w} voor ${eur(c2e(v.pb))}`,
  opties:v=>{ const A=v.pa/v.a<v.pb/v.b; return [['A',A,A?'':`Bij A kost één stuk ${eur(c2e(v.pa/v.a))}, bij B ${eur(c2e(v.pb/v.b))}.`],['B',!A,!A?'':`Bij A kost één stuk ${eur(c2e(v.pa/v.a))}, bij B ${eur(c2e(v.pb/v.b))}.`],['Ze zijn even duur',false,'Reken de prijs per stuk uit: die is niet gelijk.']] },
  stappen:v=>[st(`A: ${eur(c2e(v.pa))} : ${v.a} = ${eur(c2e(v.pa/v.a))} per stuk`,c2e(v.pa/v.a)),st(`B: ${eur(c2e(v.pb))} : ${v.b} = ${eur(c2e(v.pb/v.b))} per stuk`,c2e(v.pb/v.b)),st(`${v.pa/v.a<v.pb/v.b?'A':'B'} is het voordeligst.`)],
  anders:v=>({tekst:'Zet beide aanbiedingen in een tabel en reken terug naar 1 stuk.',tabel:{kop:['','Aantal','Prijs (€)','Per stuk (€)'],rijen:[['A',v.a,c2e(v.pa),c2e(v.pa/v.a)],['B',v.b,c2e(v.pb),c2e(v.pb/v.b)]]}}),
  waarom:{vraag:'Waarom reken je terug naar de prijs per stuk?',opties:['Dan vergelijk je dezelfde hoeveelheid.','Omdat het kleinste pak altijd het voordeligst is.','Omdat je dan minder hoeft te betalen.']},
  v3:v=>{ const A=v.pa/v.a<v.pb/v.b; return {vraag:`A: ${v.a} ${v.w} voor ${eur(c2e(v.pa))}. B: ${v.b} ${v.w} voor ${eur(c2e(v.pb))}. Leg uit welke aanbieding voordeliger is.`,
    goed:`Per stuk: A kost ${eur(c2e(v.pa/v.a))}, B kost ${eur(c2e(v.pb/v.b))}. Dus ${A?'A':'B'} is voordeliger.`,
    bijna:`${A?'A':'B'} is voordeliger, want die is per stuk goedkoper.`,
    fout:`${v.pa<v.pb?'A':'B'} is voordeliger, want die kost in totaal minder geld.`,
    kijkwijzer:['Is er vergeleken bij dezelfde hoeveelheid (per stuk)?','Staan de berekeningen erbij?','Is er een duidelijke conclusie?']} }
});
// ---------- Meten en meetkunde ----------
const OPPE=[['m²','dm²',100],['dm²','cm²',100],['m²','cm²',10000],['cm²','mm²',100]];
L({id:'M3.oppeenheden',niv:7,dom:'M',sub:'eenheden',naam:'Oppervlakte-eenheden omrekenen',dec:4,
  uitleg:'1 m = 10 dm, maar 1 m² = 10 × 10 = 100 dm². Bij oppervlakte is elke stap op het trappetje keer 100.',
  gen(r){ const e=r.pick(OPPE); const naarKlein=r.ja(); const [c,gs]={'m²':[r.pick(['Een poster','Een tafelblad','Een raam']),[0.5,1.2,2,2.5,0.25,1.5]],'dm²':['Een vloertegel',[2.5,4,6.25,9]],'cm²':['Een postzegel',[4,6,4.5,7.5]]}[e[0]]; const g=r.pick(gs); return {e,naarKlein,g,c,k:rondaf(g*e[2],4)} }, // grootte past bij het voorwerp
  vraag:v=>v.naarKlein?`${v.c} is ${nl(v.g)} ${v.e[0]}. Hoeveel ${v.e[1]} is dat?`:`${v.c} is ${nl(v.k)} ${v.e[1]}. Hoeveel ${v.e[0]} is dat?`,
  antw:v=>v.naarKlein?v.k:v.g, eenheid:v=>v.naarKlein?v.e[1]:v.e[0],
  stappen:v=>[st(`1 ${v.e[0]} = ${nl(v.e[2])} ${v.e[1]}`,v.e[2]),st(v.naarKlein?`${nl(v.g)} × ${nl(v.e[2])} = ${nl(v.k)}`:`${nl(v.k)} : ${nl(v.e[2])} = ${nl(v.g)}`,v.naarKlein?v.k:v.g)],
  fouten:v=>{ const f=Math.sqrt(v.e[2]); return v.naarKlein?[[rondaf(v.g*f,4),`Bij lengte is het keer ${f}, maar bij oppervlakte keer ${f} × ${f} = ${v.e[2]}.`],[rondaf(v.g/v.e[2],6),'Naar een kleinere eenheid wordt het getal groter.']]:[[rondaf(v.k/f,4),`Bij oppervlakte deel je door ${v.e[2]}, niet door ${f}.`],[rondaf(v.k*v.e[2],4),'Naar een grotere eenheid wordt het getal kleiner.']] },
  anders:v=>({tekst:`Teken een vierkant van 1 ${v.e[0].replace('²','')} bij 1 ${v.e[0].replace('²','')}. Langs elke kant passen ${Math.sqrt(v.e[2])} ${v.e[1].replace('²','')}. Er passen dus ${Math.sqrt(v.e[2])} × ${Math.sqrt(v.e[2])} = ${v.e[2]} vierkantjes in.`,svg:FIG.strook(10,10,'1 rij van 10 vakjes; er zijn 10 rijen → 100 vakjes')})
});
L({id:'M3.driehoek',niv:7,dom:'M',sub:'oppervlak',naam:'Oppervlakte van een driehoek',dec:1,
  uitleg:'Een driehoek is de helft van een rechthoek. Oppervlakte = basis × hoogte : 2.',
  gen(r){ return {a:r.int(3,16),b:r.int(3,12),c:r.pick(['Een zeil van een zeilboot','Een vlag','Een stuk tuin','Een dakkapel'])} },
  vraag:v=>`${v.c} heeft de vorm van een rechthoekige driehoek met zijden van ${v.a} m en ${v.b} m langs de rechte hoek. Hoe groot is de oppervlakte?`,
  fig:v=>FIG.driehoek(v.a,v.b,v.a+' m',v.b+' m',''),
  antw:v=>v.a*v.b/2, eenheid:m2, eenheden:['m',m2,m3],
  stappen:v=>[st(`Rechthoek eromheen: ${v.a} × ${v.b} = ${v.a*v.b} m²`,v.a*v.b),st(`Driehoek is de helft: ${v.a*v.b} : 2 = ${nl(v.a*v.b/2)} m²`,v.a*v.b/2)],
  fouten:v=>[[v.a*v.b,'Dat is de rechthoek. Een driehoek is daar de helft van.'],[v.a+v.b,'Bij oppervlakte vermenigvuldig je.'],[rondaf((v.a+v.b)/2,1),'Basis × hoogte, en dan pas delen door 2.']],
  anders:v=>`Leg twee van deze driehoeken tegen elkaar: samen vormen ze een rechthoek van ${v.a} bij ${v.b}. Eén driehoek is dus de helft.`
});
L({id:'M3.liters',niv:7,dom:'M',sub:'inhoud',naam:'Inhoud in m³ en liters',
  uitleg:'1 m³ = 1000 liter (1 m = 10 dm, dus 10 × 10 × 10 = 1000 dm³ en 1 dm³ = 1 liter).',
  gen(r){ return {l:r.pick([2,3,4,5,6]),b:r.pick([1.5,2,2.5,3]),h:r.pick([0.4,0.5,0.6,0.8]),c:r.pick(['Een opblaasbad','Een vijver','Een plantenbak op het schoolplein','Een zandbak'])} },
  vraag:v=>`${v.c} is ${nl(v.l)} m lang, ${nl(v.b)} m breed en ${nl(v.h)} m diep. Hoeveel liter water gaat erin?`,
  fig:v=>FIG.doos(v.l,v.b,v.h,nl(v.l)+' m',nl(v.b)+' m',nl(v.h)+' m'),
  antw:v=>rondaf(v.l*v.b*v.h*1000,2), eenheid:'liter',
  stappen:v=>[st(`${nl(v.l)} × ${nl(v.b)} × ${nl(v.h)} = ${nl(v.l*v.b*v.h)} m³`,rondaf(v.l*v.b*v.h,4)),st(`1 m³ = 1000 liter`,1000),st(`${nl(v.l*v.b*v.h)} × 1000 = ${nl(v.l*v.b*v.h*1000)} liter`,rondaf(v.l*v.b*v.h*1000,2))],
  fouten:v=>[[rondaf(v.l*v.b*v.h,4),'Dat is in m³. Een m³ is 1000 liter.'],[rondaf(v.l*v.b*v.h*100,2),'1 m³ is 1000 liter, niet 100.'],[rondaf(v.l*v.b*v.h*10,2),'1 m³ is 1000 liter.']],
  anders:v=>`Reken eerst om naar dm: ${v.l*10} dm × ${v.b*10} dm × ${v.h*10} dm = ${nl(v.l*v.b*v.h*1000)} dm³. En 1 dm³ = 1 liter.`
});
L({id:'M3.hoeken',niv:7,dom:'M',sub:'meetkunde',naam:'Hoeken in driehoeken en vierhoeken',
  uitleg:'De drie hoeken van een driehoek zijn samen 180°. De vier hoeken van een vierhoek zijn samen 360°. Een gestrekte hoek (rechte lijn) is 180°.',
  gen(r){ const type=r.pick(['driehoek','vierhoek','lijn']); let h; if(type==='driehoek'){ const a=r.int(25,90),b=r.int(20,150-a); h=[a,b] } else if(type==='vierhoek'){ const a=r.int(60,120),b=r.int(50,120),c=r.int(50,110); h=[a,b,c] } else h=[r.int(25,155)]; return {type,h} },
  vraag:v=>v.type==='driehoek'?`In een driehoek zijn twee hoeken ${v.h[0]}° en ${v.h[1]}°. Hoe groot is de derde hoek?`:v.type==='vierhoek'?`In een vierhoek zijn drie hoeken ${v.h.join('°, ')}°. Hoe groot is de vierde hoek?`:`Twee hoeken liggen naast elkaar op een rechte lijn. De ene is ${v.h[0]}°. Hoe groot is de andere?`,
  antw:v=>(v.type==='vierhoek'?360:180)-v.h.reduce((a,b)=>a+b,0), eenheid:'°',
  stappen:v=>[st(`Samen: ${v.type==='vierhoek'?360:180}°`,v.type==='vierhoek'?360:180),st(`Bekend: ${v.h.join(' + ')} = ${v.h.reduce((a,b)=>a+b,0)}°`,v.h.reduce((a,b)=>a+b,0)),st(`Over: ${(v.type==='vierhoek'?360:180)-v.h.reduce((a,b)=>a+b,0)}°`,(v.type==='vierhoek'?360:180)-v.h.reduce((a,b)=>a+b,0))],
  fouten:v=>[[(v.type==='vierhoek'?180:360)-v.h.reduce((a,b)=>a+b,0),v.type==='vierhoek'?'Een vierhoek heeft samen 360°, niet 180°.':'Samen is het hier 180°, niet 360°.'],[Math.abs(90-v.h[0]),'Alleen bij een rechte hoek gaat het om 90°.']],
  anders:v=>v.type==='driehoek'?'Scheur de drie hoeken van een papieren driehoek af en leg ze tegen elkaar: samen vormen ze een rechte lijn, 180°.':v.type==='vierhoek'?'Trek een lijn van hoek naar hoek: de vierhoek valt uiteen in twee driehoeken, 2 × 180° = 360°.':'Een rechte lijn is een halve draai: 180°.'
});
// ---------- Verbanden ----------
L({id:'B3.formule',niv:7,dom:'B',sub:'formules',naam:'Formule met letters invullen',verwar:['B3.tweelijnen'],
  uitleg:'Vervang de letter door het getal. Let op: 2,40a betekent 2,40 × a. Eerst keer, dan plus.',
  gen(r){ const c=r.pick([['taxirit','K','a','het aantal km',[2.2,2.4,2.5,3],[3,3.5,4,5],'km'],['mobiel abonnement','K','g','het aantal GB extra',[1.5,2,2.5,3],[8,10,12,15],'GB'],['fotoafdruk-service','K','f','het aantal foto\'s',[0.15,0.2,0.25,0.3],[2,2.5,3,4],'foto\'s']]); const a=r.pick(c[4]),b=r.pick(c[5]),x=r.int(4,24); return {c,a,b,x} },
  vraag:v=>`Voor een ${v.c[0]} geldt de formule <b>${v.c[1]} = ${nl(v.a)}${v.c[2]} + ${nl(v.b)}</b>. Hierin is ${v.c[1]} de prijs in euro en ${v.c[2]} ${v.c[3]}. Bereken ${v.c[1]} bij ${v.x} ${v.c[6]}.`,
  antw:v=>rondaf(v.a*v.x+v.b,2), eenheid:'€',
  stappen:v=>[st(`${v.c[1]} = ${nl(v.a)} × ${v.x} + ${nl(v.b)}`),st(`${nl(v.a)} × ${v.x} = ${nl(v.a*v.x)}`,rondaf(v.a*v.x,2)),st(`${nl(v.a*v.x)} + ${nl(v.b)} = ${nl(v.a*v.x+v.b)}`,rondaf(v.a*v.x+v.b,2))],
  fouten:v=>[[rondaf(v.a*(v.x+v.b),2),'Eerst keer, dan plus. Het vaste bedrag doe je niet keer het aantal.'],[rondaf(v.a*v.x,2),'Je bent het vaste bedrag vergeten.'],[rondaf(v.a+v.x+v.b,2),`${nl(v.a)}${v.c[2]} betekent ${nl(v.a)} keer ${v.c[2]}.`]],
  anders:v=>`Schrijf de formule over en zet op de plek van ${v.c[2]} het getal tussen haakjes: ${v.c[1]} = ${nl(v.a)} × (${v.x}) + ${nl(v.b)}. Reken dan eerst de keersom.`
});
L({id:'B3.tweelijnen',niv:7,dom:'B',sub:'grafieken',naam:'Twee lijnen vergelijken: wanneer even duur?',verwar:['B3.formule'],
  uitleg:'Twee abonnementen zijn even duur waar de lijnen elkaar snijden. Je kunt ook een tabel maken en kijken wanneer de bedragen gelijk zijn.',
  gen(r){ let a1,b1,a2,b2,x; do{ a1=r.int(0,4)*5; b1=r.int(4,10); b2=r.int(1,b1-2); x=r.int(2,8); a2=a1+(b1-b2)*x }while(a2>60); return {a1,b1,a2,b2,x,c:r.pick(['sportschool','bowlingbaan','klimhal','escaperoom-pas'])} },
  vraag:v=>`Een ${v.c} heeft twee tarieven. Tarief A: ${eur(v.a1)} inschrijving + ${eur(v.b1)} per bezoek. Tarief B: ${eur(v.a2)} inschrijving + ${eur(v.b2)} per bezoek. Bij hoeveel bezoeken kosten ze evenveel?`,
  fig:v=>FIG.grafiek([{punten:[[0,v.a1],[10,v.a1+10*v.b1]],naam:'Tarief A'},{punten:[[0,v.a2],[10,v.a2+10*v.b2]],naam:'Tarief B'}],{xmax:10,xs:1,ymax:Math.ceil(Math.max(v.a1+10*v.b1,v.a2+10*v.b2)/20)*20,ys:20,xl:'aantal bezoeken',yl:'kosten (€)'}),
  antw:v=>v.x,
  stappen:v=>[st(`Verschil inschrijving: ${v.a2} − ${v.a1} = ${v.a2-v.a1}`,v.a2-v.a1),st(`Per bezoek scheelt het ${v.b1} − ${v.b2} = ${v.b1-v.b2}`,v.b1-v.b2),st(`${v.a2-v.a1} : ${v.b1-v.b2} = ${v.x} bezoeken`,v.x)],
  tabel:v=>({kop:['Bezoeken','A (€)','B (€)'],rijen:[[0,v.a1,v.a2],[v.x-1,v.a1+(v.x-1)*v.b1,v.a2+(v.x-1)*v.b2],[v.x,v.a1+v.x*v.b1,v.a2+v.x*v.b2]],leeg:[[2,1],[2,2]]}),
  fouten:v=>[[v.a2-v.a1,'Dat is het verschil in inschrijfgeld. Kijk per bezoek hoeveel dat verschil kleiner wordt.'],[v.x+1,'Controleer: reken bij beide tarieven de kosten uit.'],[v.x-1,'Controleer: reken bij beide tarieven de kosten uit.']],
  anders:v=>({tekst:'Maak een tabel en kijk wanneer de bedragen gelijk zijn.',tabel:{kop:['Bezoeken','A (€)','B (€)'],rijen:Array.from({length:Math.min(v.x+2,10)},(_,i)=>[i,v.a1+i*v.b1,v.a2+i*v.b2])}})
});
L({id:'B3.mediaan',niv:7,dom:'B',sub:'statistiek',naam:'Mediaan en modus',verwar:['B2.gemiddelde'],
  uitleg:'Mediaan: zet de getallen op volgorde; het middelste getal is de mediaan (bij een even aantal: het gemiddelde van de middelste twee). Modus: het getal dat het vaakst voorkomt.',
  gen(r){ const wat=r.pick(['mediaan','modus']); const n=wat==='mediaan'?r.pick([5,7,9,6,8]):r.int(7,10); let w; do{ w=Array.from({length:n},()=>r.int(1,10)); if(wat==='modus'){ const m=r.pick(w); w[r.int(0,n-1)]=m; w[r.int(0,n-1)]=m } }while(wat==='modus'&&!uniekeModus(w)); return {wat,w,c:r.pick(['cijfers voor de toets','aantal uren slaap','doelpunten per wedstrijd','aantal berichtjes per uur'])} },
  vraag:v=>`Dit zijn de ${v.c} van een groep: ${v.w.join(', ')}. Wat is de ${v.wat}?`,
  antw:v=>v.wat==='mediaan'?mediaan(v.w):modusVan(v.w),
  stappen:v=>{ const z=[...v.w].sort((a,b)=>a-b); return v.wat==='mediaan'?[st(`Op volgorde: ${z.join(', ')}`),st(z.length%2?`Het middelste getal (nummer ${(z.length+1)/2}) is ${mediaan(v.w)}`:`De middelste twee: ${z[z.length/2-1]} en ${z[z.length/2]}, gemiddeld ${nl(mediaan(v.w))}`,mediaan(v.w))]:[st(`Op volgorde: ${z.join(', ')}`),st(`${modusVan(v.w)} komt het vaakst voor`,modusVan(v.w))] },
  fouten:v=>[[v.wat==='mediaan'?v.w[Math.floor(v.w.length/2)]:mediaan(v.w),v.wat==='mediaan'?'Zet de getallen eerst op volgorde.':'Dat is de mediaan. De modus is het getal dat het vaakst voorkomt.'],[rondaf(v.w.reduce((a,b)=>a+b,0)/v.w.length,2),'Dat is het gemiddelde.'],[Math.max(...v.w),'Dat is het grootste getal.']],
  anders:v=>`Schrijf alle getallen op kaartjes en leg ze op volgorde. Streep steeds de kleinste en de grootste weg. Wat overblijft in het midden is de mediaan.`
});
function mediaan(w){ const z=[...w].sort((a,b)=>a-b),n=z.length; return n%2?z[(n-1)/2]:(z[n/2-1]+z[n/2])/2 }
function telVan(w){ const t={}; w.forEach(x=>t[x]=(t[x]||0)+1); return t }
function uniekeModus(w){ const t=telVan(w),m=Math.max(...Object.values(t)); return Object.values(t).filter(x=>x===m).length===1&&m>1 }
function modusVan(w){ const t=telVan(w); return +Object.keys(t).sort((a,b)=>t[b]-t[a])[0] }
L({id:'B3.procenttabel',niv:7,dom:'B',sub:'tabellen',naam:'Percentages uit een tabel',verwar:['V3.hoeveelprocent'],
  uitleg:'Tel eerst het totaal uit de tabel. Deel daarna het aantal door het totaal en doe keer 100.',
  gen(r){ const s=r.shuffle(['TikTok','YouTube','Instagram','Snapchat','WhatsApp']).slice(0,4); let w; do{ w=s.map(()=>r.int(2,14)) }while(![20,25,40,50].includes(w.reduce((a,b)=>a+b,0))); return {s,w,i:r.int(0,3)} },
  vraag:v=>`In een klas is gevraagd welke app ze het meest gebruiken.<div class="vtabel">${vtabelHtml(['App','Aantal leerlingen'],v.s.map((x,k)=>[x,v.w[k]]))}</div>Hoeveel procent van de klas kiest ${v.s[v.i]}?`,
  antw:v=>100*v.w[v.i]/v.w.reduce((a,b)=>a+b,0), eenheid:'%',
  stappen:v=>{ const t=v.w.reduce((a,b)=>a+b,0); return [st(`Totaal: ${v.w.join(' + ')} = ${t}`,t),st(`${v.w[v.i]} : ${t} = ${nl(v.w[v.i]/t)}`,v.w[v.i]/t),st(`${nl(v.w[v.i]/t)} × 100 = ${nl(100*v.w[v.i]/t)}%`,100*v.w[v.i]/t)] },
  fouten:v=>{ const t=v.w.reduce((a,b)=>a+b,0); return [[v.w[v.i],'Dat is het aantal leerlingen, geen percentage.'],[rondaf(100*v.w[v.i]/30,2),'Gebruik het echte totaal uit de tabel.'],[rondaf(v.w[v.i]/t,4),'Doe nog keer 100 voor procent.']] },
  anders:v=>{ const t=v.w.reduce((a,b)=>a+b,0); return ({tekst:`Het totaal is ${t}. Maak er 100 van in een verhoudingstabel.`,tabel:{kop:['Leerlingen','Procent'],rijen:[[t,100],[1,rondaf(100/t,2)],[v.w[v.i],100*v.w[v.i]/t]]}}) }
});
