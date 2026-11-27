// ===== Niveau 8 · 3F eindniveau · bovenbouw havo/vwo =====
// ---------- Getallen ----------
L({id:'G8.perhoofd',niv:12,dom:'G',sub:'getalbegrip',naam:'Grote getallen per persoon',rm:true,verwar:['G7.ordegrootte'],
  uitleg:'Deel het totaal door het aantal mensen. In wetenschappelijke notatie: deel de getallen en trek de exponenten af. Controleer of de uitkomst realistisch is.',
  gen(r){ const c=r.pick([['In een land wordt per jaar','kg afval weggegooid','inwoners','kg per inwoner',[6,8,9],9,[1.5,2,1.8],7],['Een streamingdienst verwerkt per dag','minuten aan video','gebruikers','minuten per gebruiker',[3,4.5,6],9,[1.5,2,2.5],7],['Een land gebruikt per jaar','liter drinkwater','inwoners','liter per inwoner',[1.2,1.8,2.4],12,[1.5,2,1.2],7],['Een appgebruikersgroep verstuurt per dag','berichten','gebruikers','berichten per gebruiker',[5,7.5,9],10,[2,2.5,5],8]]); const m1=r.pick(c[4]),m2=r.pick(c[6]); return {c,m1,p:c[5],m2,q:c[7],d:c[5]-c[7]} },
  vraag:v=>`${v.c[0]} ${wn(v.m1,v.p)} ${v.c[1]}. Er zijn ${wn(v.m2,v.q)} ${v.c[2]}. Hoeveel ${v.c[3]} is dat? Rond af op een heel getal.`,
  antw:v=>rondaf(v.m1/v.m2*10**v.d,0), eenheid:'',
  stappen:v=>[st(`Getallen: ${nl(v.m1)} : ${nl(v.m2)} ≈ ${nl(rondaf(v.m1/v.m2,4))}`,rondaf(v.m1/v.m2,4)),st(`Machten: 10${SUP(v.p)} : 10${SUP(v.q)} = 10${SUP(v.d)} = ${nl(10**v.d)}`,10**v.d),st(`${nl(rondaf(v.m1/v.m2,4))} × ${nl(10**v.d)} ≈ ${nl(rondaf(v.m1/v.m2*10**v.d,0))}`,rondaf(v.m1/v.m2*10**v.d,0))],
  fouten:v=>[[rondaf(v.m1/v.m2*10**(v.d-1),0),'Trek de exponenten precies af: '+v.p+' − '+v.q+' = '+v.d+'.'],[rondaf(v.m1/v.m2*10**(v.d+1),0),'Trek de exponenten precies af: '+v.p+' − '+v.q+' = '+v.d+'.'],[rondaf(v.m2/v.m1*10**v.d,0),'Je deelde de getallen in de verkeerde volgorde: totaal : aantal mensen.']],
  anders:v=>`Schrijf beide als gewoon getal en streep evenveel nullen weg: ${nl(rondaf(v.m1*10**v.p,0))} : ${nl(rondaf(v.m2*10**v.q,0))}.`
});
L({id:'G8.machtregels',niv:12,dom:'G',sub:'negatief',naam:'Rekenregels voor machten',negatief:true,verwar:['G7.wetnotrekenen'],
  uitleg:'Zelfde grondtal: vermenigvuldigen = exponenten optellen (2³ × 2⁴ = 2⁷), delen = exponenten aftrekken, macht van een macht = exponenten vermenigvuldigen ((10²)³ = 10⁶).',
  gen(r){ return {g:r.pick([2,3,10]),a:r.int(2,9),b:r.int(2,6),t:r.pick(['keer','deel','macht'])} },
  vraag:v=>`Schrijf als één macht van ${v.g}: <b>${v.t==='keer'?`${v.g}${SUP(v.a)} × ${v.g}${SUP(v.b)}`:v.t==='deel'?`${v.g}${SUP(v.a)} : ${v.g}${SUP(v.b)}`:`(${v.g}${SUP(v.a)})${SUP(v.b)}`}</b>. Wat is de exponent?`,
  antw:v=>v.t==='keer'?v.a+v.b:v.t==='deel'?v.a-v.b:v.a*v.b,
  toon:x=>x<0?'−'+Math.abs(x):String(x),
  stappen:v=>v.t==='keer'?[st(`${v.a} factoren ${v.g} en nog ${v.b} factoren ${v.g}`),st(`Samen ${v.a} + ${v.b} = ${v.a+v.b} factoren`,v.a+v.b)]:v.t==='deel'?[st(`${v.b} factoren ${v.g} vallen weg tegen elkaar`),st(`Over: ${v.a} − ${v.b} = ${v.a-v.b}`,v.a-v.b)]:[st(`${v.b} keer ${v.g}${SUP(v.a)} met elkaar vermenigvuldigen`),st(`${v.b} × ${v.a} = ${v.a*v.b} factoren`,v.a*v.b)],
  fouten:v=>v.t==='keer'?[[v.a*v.b,'Bij vermenigvuldigen tel je de exponenten op.'],[v.a+v.b+1,'Tel de exponenten nog eens op.']]:v.t==='deel'?[[v.a+v.b,'Bij delen trek je de exponenten af.'],[rondaf(v.a/v.b,2),'Je deelt de exponenten niet, je trekt ze af.']]:[[v.a+v.b,'Bij een macht van een macht vermenigvuldig je de exponenten.'],[v.a**v.b>200?v.a*v.b+1:v.a**v.b,'Vermenigvuldig de exponenten: '+v.a+' × '+v.b+'.']],
  anders:v=>`Schrijf het uit. ${v.g}${SUP(2)} × ${v.g}${SUP(3)} = (${v.g}·${v.g}) × (${v.g}·${v.g}·${v.g}): dat zijn 5 factoren. Tel zo ook hier.`
});
L({id:'G8.samenwerken',niv:12,dom:'G',sub:'breuken',naam:'Rekenen met omgekeerden: samen werken',rm:true,dec:2,verwar:['G6.breukrekenen'],
  uitleg:'Doet A een klus in 3 uur, dan doet A per uur ⅓ van de klus. Samen per uur: ⅓ + ⅙ = ½ klus. Dan duurt de klus samen 1 : ½ = 2 uur. Samen is altijd sneller dan de snelste alleen.',
  gen(r){ const [a,b]=r.pick([[3,6],[4,12],[6,12],[10,15],[12,24],[20,30],[6,3],[10,40],[2,6],[5,20]]); const [n1,n2]=r.naam2(); return {a,b,f:a*b/(a+b),n1,n2,c:r.pick([['de folders voor de open dag vouwen','uur'],['het voetbalveld lijnen trekken','uur'],['een zwembadje vullen met twee kranen','minuten'],['de kantine schoonmaken','uur']])} },
  vraag:v=>`${v.n1} kan ${v.c[0]} in ${v.a} ${v.c[1]}. ${v.n2} doet het alleen in ${v.b} ${v.c[1]}. Hoe lang duurt het als ze het samen doen?`,
  antw:v=>rondaf(v.f,2), eenheid:v=>v.c[1],
  stappen:v=>[st(`Per ${v.c[1]==='uur'?'uur':'minuut'}: ${v.n1} ${fr(1/v.a)}, ${v.n2} ${fr(1/v.b)} van de klus`),st(`Samen: ${fr(1/v.a)} + ${fr(1/v.b)} = ${fr(1/v.a+1/v.b)}`,rondaf(1/v.a+1/v.b,4)),st(`Tijd: 1 : ${fr(1/v.a+1/v.b)} = ${nl(v.f)} ${v.c[1]}`,rondaf(v.f,2))],
  fouten:v=>[[rondaf((v.a+v.b)/2,2),'Dat is het gemiddelde. Maar samen gaat het sneller dan allebei alleen.'],[v.a+v.b,'Samen werken duurt korter, niet langer.'],[Math.abs(v.b-v.a),'Je trok de tijden af. Werk met het deel van de klus per tijdseenheid.']],
  anders:v=>`Neem een handig aantal klussen: in ${v.a*v.b/ggd(v.a,v.b)} ${v.c[1]} doet ${v.n1} ${v.b/ggd(v.a,v.b)} klussen en ${v.n2} ${v.a/ggd(v.a,v.b)}. Samen ${(v.a+v.b)/ggd(v.a,v.b)} klussen in ${v.a*v.b/ggd(v.a,v.b)} ${v.c[1]}. Hoe lang voor één klus?`
});
L({id:'G8.afwijking',niv:12,dom:'G',sub:'getalbegrip',naam:'Hoeveel procent zat de schatting ernaast?',rm:true,dec:1,verwar:['V4.procentverandering'],
  uitleg:'Relatieve afwijking = (verschil tussen schatting en echte waarde) : echte waarde × 100%. Je deelt altijd door de echte waarde.',
  gen(r){ let w,s; do{ w=r.pick([400,500,800,1200,1500,2000,2500]); s=w+r.pick([-300,-200,-100,100,150,200,300,500]) }while(s<=0||Math.abs(Math.abs(s-w)/s-Math.abs(s-w)/w)<.002); return {w,s,c:r.pick(['het aantal bezoekers van het schoolfeest','het aantal snoepjes in een pot','het aantal views van de schoolvlog','het aantal deelnemers aan de sponsorloop'])} },
  vraag:v=>`Je schatte ${v.c} op ${nl(v.s)}. Het echte aantal was ${nl(v.w)}. Hoeveel procent zat je schatting ernaast? Rond af op 1 decimaal.`,
  antw:v=>rondaf(Math.abs(v.s-v.w)/v.w*100,1), eenheid:'%',
  stappen:v=>[st(`Verschil: ${Math.abs(v.s-v.w)}`,Math.abs(v.s-v.w)),st(`${Math.abs(v.s-v.w)} : ${nl(v.w)} × 100 = ${nl(rondaf(Math.abs(v.s-v.w)/v.w*100,1))}%`,rondaf(Math.abs(v.s-v.w)/v.w*100,1))],
  fouten:v=>[[rondaf(Math.abs(v.s-v.w)/v.s*100,1),'Je deelde door je schatting. Deel door de echte waarde.'],[Math.abs(v.s-v.w),'Dat is het verschil, geen percentage.'],[rondaf(v.s/v.w*100,1),'Dat is de schatting als percentage van de echte waarde. Hoeveel zit je ernaast?']],
  anders:v=>`De echte waarde is 100%. Hoeveel procent is het verschil (${Math.abs(v.s-v.w)}) daarvan?`
});
// ---------- Verhoudingen ----------
L({id:'V8.reeel',niv:12,dom:'V',sub:'groei',naam:'Reële groei: loon en inflatie',rm:true,dec:1,verwar:['V5.tweekortingen'],
  uitleg:'Stijgt je loon met 5% en de prijzen met 2%, dan kun je niet 3% meer kopen. Reken met factoren: 1,05 : 1,02 ≈ 1,029, dus ongeveer 2,9% meer koopkracht.',
  gen(r){ let a,b,x; do{ a=r.pick([3,4,5,6,8,10]); b=r.pick([2,3,4,6,8,12]); x=rondaf(((1+a/100)/(1+b/100)-1)*100,1) }while(a===b||x===a-b); return {a,b,x,c:r.pick(['Het loon van je bijbaan','Je zakgeld','Het minimumloon voor jongeren'])} },
  vraag:v=>`${v.c} stijgt met ${v.a}%. De prijzen stijgen in dezelfde tijd met ${v.b}% (inflatie). Met hoeveel procent ${v.a>v.b?'stijgt':'daalt'} wat je ervan kunt kopen? Rond af op 1 decimaal.`,
  antw:v=>Math.abs(v.x), eenheid:'%',
  stappen:v=>[st(`Factoren: ${nl(1+v.a/100)} en ${nl(1+v.b/100)}`,rondaf(1+v.a/100,4)),st(`${nl(1+v.a/100)} : ${nl(1+v.b/100)} ≈ ${nl(rondaf((1+v.a/100)/(1+v.b/100),4))}`,rondaf((1+v.a/100)/(1+v.b/100),4)),st(`Dat is ${nl(Math.abs(v.x))}% ${v.a>v.b?'erbij':'eraf'}`,Math.abs(v.x))],
  fouten:v=>[[Math.abs(v.a-v.b),'Je trok de percentages af. Dat is maar een benadering. Deel de groeifactoren.'],[rondaf(Math.abs((1+v.a/100)*(1-v.b/100)-1)*100,1),'Je vermenigvuldigde met '+nl(1-v.b/100)+'. Hogere prijzen betekent: delen door '+nl(1+v.b/100)+'.'],[rondaf(Math.abs((1+v.a/100)/(1+v.b/100))*100,1),'Dat is het nieuwe niveau. Trek er 100 vanaf.']].filter(x=>x[0]!==Math.abs(v.x)),
  anders:v=>`Stel: je verdiende € 100 en een product kostte € 1. Je kon er 100 kopen. Nu verdien je € ${100+v.a} en kost het € ${nl(1+v.b/100)}. Hoeveel kun je er nu kopen?`,
  sab:v=>({intro:`Loon +${v.a}%, prijzen +${v.b}%. Jesse rekent uit hoeveel je er echt op ${v.a>v.b?'vooruit':'achteruit'} gaat.`,stappen:[`Het loon gaat ${v.a}% omhoog.`,`De prijzen ${v.b}% omhoog.`,`${v.a} − ${v.b} = ${v.a-v.b}, dus ${Math.abs(v.a-v.b)}% ${v.a>v.b?'meer':'minder'} koopkracht.`],fout:2,juist:Math.abs(v.x),check:Math.abs(v.a-v.b),eenheid:'%',vraag:'Wat is de verandering echt (1 decimaal)?',uitleg:'Percentages van verschillende dingen mag je niet zomaar aftrekken. Deel de groeifactoren.',goed:[`${nl(1+v.a/100)} : ${nl(1+v.b/100)} ≈ ${nl(rondaf((1+v.a/100)/(1+v.b/100),4))}`,`${nl(Math.abs(v.x))}% ${v.a>v.b?'erbij':'eraf'}`]})
});
L({id:'V8.halvering',niv:12,dom:'V',sub:'groei',naam:'Halveringstijd',rm:true,verwar:['V7.terugfactor'],
  uitleg:'Bij een halveringstijd van 6 uur is er na 6 uur de helft over, na 12 uur een kwart, na 18 uur een achtste. Na k halveringstijden: begin × 0,5ᵏ.',
  gen(r){ const [s,h,e]=r.pick([['cafeïne in je bloed',5,'mg'],['een medicijn in je bloed',6,'mg'],['een radioactieve stof',8,'gram'],['een pijnstiller in je bloed',4,'mg']]); return {s,h,e,b:r.pick([80,160,200,240,400,800]),k:r.int(2,5),t:r.pick(['over','tijd'])} },
  vraag:v=>v.t==='over'?`De halveringstijd van ${v.s} is ${v.h} uur. Je begint met ${v.b} ${v.e}. Hoeveel is er na ${v.h*v.k} uur over?`:`De halveringstijd van ${v.s} is ${v.h} uur. Je begint met ${v.b} ${v.e}. Na hoeveel uur is er nog ${nl(v.b/2**v.k)} ${v.e} over?`,
  antw:v=>v.t==='over'?v.b/2**v.k:v.h*v.k, eenheid:v=>v.t==='over'?v.e:'uur',
  stappen:v=>v.t==='over'?[st(`Aantal halveringen: ${v.h*v.k} : ${v.h} = ${v.k}`,v.k),st(`${v.b} × 0,5${SUP(v.k)} = ${v.b} : ${2**v.k} = ${nl(v.b/2**v.k)} ${v.e}`,v.b/2**v.k)]:[st(`${v.b} → ${Array.from({length:v.k},(_,i)=>nl(v.b/2**(i+1))).join(' → ')}`),st(`Dat zijn ${v.k} halveringen`,v.k),st(`${v.k} × ${v.h} = ${v.k*v.h} uur`,v.k*v.h)],
  fouten:v=>v.t==='over'?[[v.b/(2*v.k),'Na '+v.k+' halveringen deel je door 2 × 2 × … ('+v.k+' keer), niet door 2 × '+v.k+'.'],[v.b/2**(v.k-1),'Tel het aantal halveringen: '+v.h*v.k+' : '+v.h+' = '+v.k+'.'],[v.b/2,'Na één halveringstijd is de helft over, maar het waren er '+v.k+'.']]:[[v.k,'Dat is het aantal halveringen. Elke halvering duurt '+v.h+' uur.'],[v.h*(v.k+1),'Tel de halveringen nog eens.'],[v.h*(v.k-1),'Tel de halveringen nog eens.']],
  anders:v=>({tekst:'Maak een tabel: elke '+v.h+' uur gaat het door de helft.',tabel:{kop:['uur','over ('+v.e+')'],rijen:Array.from({length:v.k+1},(_,i)=>[i*v.h,nl(v.b/2**i)])}})
});
L({id:'V8.indexbasis',niv:12,dom:'V',sub:'procent',naam:'Indexcijfers met een ander basisjaar',rm:true,dec:1,verwar:['V7.index'],
  uitleg:'Wil je een ander basisjaar, dan deel je alle indexcijfers door het indexcijfer van het nieuwe basisjaar en vermenigvuldig je met 100.',
  gen(r){ let i1,i2; do{ i1=r.pick([105,110,112,115,120,125,130]); i2=r.pick([120,125,130,140,150,156,160,175]) }while(i2<=i1||rondaf(i2/i1*100,1)===i2-i1+100); return {i1,i2,j:[2015,2020,2025],c:r.pick(['De prijs van een bioscoopkaartje','De huurprijzen','De prijs van een treinkaartje'])} },
  vraag:v=>`${v.c}: indexcijfer ${v.j[0]} = 100, ${v.j[1]} = ${v.i1}, ${v.j[2]} = ${v.i2}. Je neemt ${v.j[1]} als nieuw basisjaar (= 100). Wat is dan het indexcijfer van ${v.j[2]}?`,
  antw:v=>rondaf(v.i2/v.i1*100,1),
  stappen:v=>[st(`${v.j[1]} wordt 100: deel door ${v.i1}`,v.i1),st(`${v.i2} : ${v.i1} × 100 ≈ ${nl(rondaf(v.i2/v.i1*100,1))}`,rondaf(v.i2/v.i1*100,1))],
  fouten:v=>[[v.i2-v.i1+100,'Je trok de verschillen af. Indexcijfers zijn verhoudingen: delen.'],[rondaf(v.i1/v.i2*100,1),'Je deelde omgekeerd. Nieuw jaar : basisjaar.'],[v.i2,'Dat is het oude indexcijfer.']],
  anders:v=>({tekst:'Een verhoudingstabel: maak van '+v.i1+' de 100.',tabel:{kop:['oud','nieuw'],rijen:[[String(v.i1),'100'],[String(v.i2),'?']]}}),
  tabel:v=>({kop:['Oude index','Nieuwe index'],rijen:[[v.i1,100],[v.i2,rondaf(v.i2/v.i1*100,1)]],leeg:[[1,1]]})
});
L({id:'V8.groeiperiode',niv:12,dom:'V',sub:'groei',naam:'Groei per maand en per jaar',rm:true,dec:2,verwar:['V6.groeinperioden'],
  uitleg:'Per maand 1% groei is per jaar niet 12%: het is 1,01¹² ≈ 1,127, dus 12,7%. Andersom: per jaar 10% is per maand 1,1^(1/12) ≈ 1,008, dus ongeveer 0,8%.',
  gen(r){ return r.ja()?{t:'jaar',p:r.pick([0.5,1,1.5,2,3])}:{t:'maand',p:r.pick([10,12,20,25,50])} },
  vraag:v=>v.t==='jaar'?`Het aantal volgers van een account groeit elke maand met ${nl(v.p)}%. Met hoeveel procent groeit het per jaar? Rond af op 2 decimalen.`:`Een bedrag groeit met ${v.p}% per jaar. Met welk percentage per maand komt dat overeen? Rond af op 2 decimalen.`,
  antw:v=>v.t==='jaar'?rondaf(((1+v.p/100)**12-1)*100,2):rondaf(((1+v.p/100)**(1/12)-1)*100,2), eenheid:'%',
  stappen:v=>v.t==='jaar'?[st(`Factor per maand: ${nl(1+v.p/100)}`,rondaf(1+v.p/100,4)),st(`Per jaar: ${nl(1+v.p/100)}¹² ≈ ${nl(rondaf((1+v.p/100)**12,4))}`,rondaf((1+v.p/100)**12,4)),st(`Dat is ${nl(rondaf(((1+v.p/100)**12-1)*100,2))}% per jaar`,rondaf(((1+v.p/100)**12-1)*100,2))]:[st(`Factor per jaar: ${nl(1+v.p/100)}`,rondaf(1+v.p/100,4)),st(`Per maand: ${nl(1+v.p/100)}^(1/12) ≈ ${nl(rondaf((1+v.p/100)**(1/12),5))}`,rondaf((1+v.p/100)**(1/12),5)),st(`Dat is ${nl(rondaf(((1+v.p/100)**(1/12)-1)*100,2))}% per maand`,rondaf(((1+v.p/100)**(1/12)-1)*100,2))],
  fouten:v=>v.t==='jaar'?[[rondaf(v.p*12,2),'Je vermenigvuldigde met 12. Maar elke maand groeit ook de groei van vorige maanden mee.'],[rondaf((1+v.p/100)**12*100,2),'Dat is het nieuwe niveau in procenten. Trek er 100 vanaf.']]:[[rondaf(v.p/12,2),'Je deelde door 12. Omdat de groei elke maand meegroeit, is het per maand iets minder.'],[rondaf((1+v.p/100)**(1/12)*100,2),'Dat is het nieuwe niveau in procenten. Trek er 100 vanaf.']],
  anders:v=>v.t==='jaar'?`Vermenigvuldig 12 keer met ${nl(1+v.p/100)} op de rekenmachine (of gebruik de knop xʸ met exponent 12).`:`Zoek de factor die 12 keer met zichzelf vermenigvuldigd ${nl(1+v.p/100)} geeft. Op de rekenmachine: ${nl(1+v.p/100)} xʸ (1 : 12).`
});
// ---------- Meten en meetkunde ----------
L({id:'M8.verbruik',niv:12,dom:'M',sub:'eenheden',naam:'Brandstofverbruik en kosten',rm:true,verwar:['V3.prijsvgl'],
  uitleg:'"1 op 16" betekent 16 km met 1 liter. Liters per 100 km = 100 : 16 = 6,25. Kosten van een rit: (afstand : 100) × verbruik × prijs per liter.',
  gen(r){ const t=r.pick(['l100','kosten','kosten']); return t==='l100'?{t,op:r.pick([10,12.5,16,20,25])}:{t,d:r.pick([150,240,300,450,600]),l:r.pick([5,6,6.5,7,8]),p:r.pick([1.9,2,2.1,2.2])} },
  vraag:v=>v.t==='l100'?`Een scooter rijdt 1 op ${nl(v.op)}. Hoeveel liter is dat per 100 km?`:`Je rijdt met je ouders ${v.d} km naar een festival. De auto verbruikt ${nl(v.l)} liter per 100 km. Benzine kost ${eur(v.p,true)} per liter. Wat kost de benzine voor de heenreis?`,
  antw:v=>v.t==='l100'?rondaf(100/v.op,2):rondaf(v.d/100*v.l*v.p,2), eenheid:v=>v.t==='l100'?'liter':'€',
  stappen:v=>v.t==='l100'?[st(`1 liter = ${nl(v.op)} km`,v.op),st(`100 km: 100 : ${nl(v.op)} = ${nl(rondaf(100/v.op,2))} liter`,rondaf(100/v.op,2))]:[st(`Liters: ${v.d} : 100 × ${nl(v.l)} = ${nl(v.d/100*v.l)} liter`,rondaf(v.d/100*v.l,2)),st(`Kosten: ${nl(v.d/100*v.l)} × ${nl(v.p)} = ${eur(v.d/100*v.l*v.p,true)}`,rondaf(v.d/100*v.l*v.p,2))],
  fouten:v=>v.t==='l100'?[[rondaf(v.op/100,4),'Je deelde omgekeerd. Hoeveel liter heb je nodig voor 100 km?'],[100*v.op,'Dat zijn km, geen liters.']]:[[rondaf(v.d*v.l*v.p,2),'Het verbruik is per 100 km. Deel de afstand eerst door 100.'],[rondaf(v.d/100*v.l,2),'Dat zijn de liters. Vermenigvuldig nog met de prijs.'],[rondaf(v.d/v.l*v.p,2),'Je rekende alsof de auto 1 op '+nl(v.l)+' rijdt. Het is '+nl(v.l)+' liter per 100 km.']],
  anders:v=>({tekst:'Verhoudingstabel van km naar liter:',tabel:v.t==='l100'?{kop:['km','liter'],rijen:[[nl(v.op),'1'],['100','?']]}:{kop:['km','liter'],rijen:[['100',nl(v.l)],[String(v.d),'?']]}})
});
L({id:'M8.dichtheid',niv:12,dom:'M',sub:'inhoud',naam:'Dichtheid: massa uit volume',rm:true,dec:3,verwar:['M2.inhoud'],
  uitleg:'Dichtheid zegt hoeveel gram 1 cm³ van een stof weegt. Massa = dichtheid × volume. 1 kg = 1000 g.',
  gen(r){ const [s,dh]=r.pick([['aluminium',2.7],['ijzer',7.9],['eikenhout',0.7],['ijs',0.92],['beton',2.4]]); return {s,dh,l:r.pick([5,10,20,25]),b:r.pick([4,5,10]),h:r.pick([2,4,5,10])} },
  vraag:v=>`Een blok ${v.s} is ${v.l} cm lang, ${v.b} cm breed en ${v.h} cm hoog. De dichtheid van ${v.s} is ${nl(v.dh)} g/cm³. Hoeveel kg weegt het blok?`,
  antw:v=>rondaf(v.dh*v.l*v.b*v.h/1000,3), eenheid:'kg',
  stappen:v=>[st(`Volume: ${v.l} × ${v.b} × ${v.h} = ${v.l*v.b*v.h} cm³`,v.l*v.b*v.h),st(`Massa: ${nl(v.dh)} × ${v.l*v.b*v.h} = ${nl(v.dh*v.l*v.b*v.h)} g`,rondaf(v.dh*v.l*v.b*v.h,2)),st(`= ${nl(v.dh*v.l*v.b*v.h/1000)} kg`,rondaf(v.dh*v.l*v.b*v.h/1000,3))],
  fouten:v=>[[rondaf(v.dh*v.l*v.b*v.h,2),'Dat zijn grammen. Deel door 1000 voor kg.'],[rondaf(v.l*v.b*v.h/v.dh/1000,3),'Massa = dichtheid × volume, niet volume : dichtheid.'],[rondaf(v.l*v.b*v.h/1000,3),'Je vergat de dichtheid. Niet elke stof weegt 1 g per cm³ (dat geldt alleen voor water).']],
  anders:v=>`Elk blokje van 1 cm³ weegt ${nl(v.dh)} g. Hoeveel van die blokjes zitten er in het blok?`
});
L({id:'M8.zwembad',niv:12,dom:'M',sub:'inhoud',naam:'Inhoud van samengestelde ruimtes',rm:true,verwar:['M6.prisma'],
  uitleg:'Splits een ingewikkelde vorm in delen waarvan je de inhoud kunt berekenen, en tel ze op. Let op de eenheid: 1 m³ = 1000 liter.',
  gen(r){ let a,b; do{ a=r.pick([5,8,10,12]); b=r.pick([5,8,10,15]) }while(a===b); return {a,b,w:r.pick([4,5,6,8]),d1:r.pick([0.8,1,1.2]),d2:r.pick([1.8,2,2.5,3])} },
  vraag:v=>`Een zwembad is ${v.w} m breed. Het ondiepe deel is ${v.a} m lang en ${nl(v.d1)} m diep, het diepe deel is ${v.b} m lang en ${nl(v.d2)} m diep (beide met een vlakke bodem). Hoeveel liter water gaat erin?`,
  antw:v=>rondaf(v.w*(v.a*v.d1+v.b*v.d2)*1000,0), eenheid:'liter',
  stappen:v=>[st(`Ondiep: ${v.a} × ${v.w} × ${nl(v.d1)} = ${nl(v.a*v.w*v.d1)} m³`,rondaf(v.a*v.w*v.d1,2)),st(`Diep: ${v.b} × ${v.w} × ${nl(v.d2)} = ${nl(v.b*v.w*v.d2)} m³`,rondaf(v.b*v.w*v.d2,2)),st(`Samen ${nl(v.w*(v.a*v.d1+v.b*v.d2))} m³ = ${nl(rondaf(v.w*(v.a*v.d1+v.b*v.d2)*1000,0))} liter`,rondaf(v.w*(v.a*v.d1+v.b*v.d2)*1000,0))],
  fouten:v=>[[rondaf(v.w*(v.a*v.d1+v.b*v.d2),2),'Dat zijn m³. 1 m³ = 1000 liter.'],[rondaf(v.w*(v.a+v.b)*v.d2*1000,0),'Niet het hele bad is diep.'],[rondaf(v.w*(v.a+v.b)*(v.d1+v.d2)/2*1000,0),'Je nam de gemiddelde diepte, maar de delen zijn niet even lang.']],
  anders:v=>`Teken het bad van opzij: twee rechthoeken naast elkaar. Elk deel is een balk.`
});
L({id:'M8.maquette',niv:12,dom:'M',sub:'meetkunde',naam:'Schaalmodellen: inhoud omrekenen',rm:true,dec:3,verwar:['M7.inhoudk3'],
  uitleg:'Bij schaal 1 : k is elke lengte in het echt k keer zo groot, dus de inhoud k × k × k = k³ keer zo groot. Reken daarna om: 1 m³ = 1 000 000 cm³.',
  gen(r){ return {k:r.pick([10,20,50,100]),V:r.pick([120,240,500,800,1600,2400]),c:r.pick(['een gebouw','een silo','een sporthal','een tribune'])} },
  vraag:v=>`Een maquette van ${v.c} heeft schaal 1 : ${v.k}. De maquette heeft een inhoud van ${nl(v.V)} cm³. Hoeveel m³ is de echte inhoud?`,
  antw:v=>rondaf(v.V*v.k**3/1e6,3), eenheid:m3,
  stappen:v=>[st(`Inhoudsfactor: ${v.k}³ = ${nl(v.k**3)}`,v.k**3),st(`Echt: ${nl(v.V)} × ${nl(v.k**3)} = ${nl(v.V*v.k**3)} cm³`,v.V*v.k**3),st(`: 1 000 000 = ${nl(rondaf(v.V*v.k**3/1e6,3))} m³`,rondaf(v.V*v.k**3/1e6,3))],
  fouten:v=>[[rondaf(v.V*v.k/1e6,6),'Je gebruikte de schaal één keer. Inhoud heeft drie richtingen: k³.'],[rondaf(v.V*v.k**2/1e6,5),'k² is voor oppervlakte. Inhoud gaat met k³.'],[rondaf(v.V*v.k**3/1000,3),'1 m³ = 1 000 000 cm³, niet 1000.']],
  anders:v=>`Een blokje van 1 cm³ in de maquette is in het echt ${v.k} cm × ${v.k} cm × ${v.k} cm = ${nl(v.k**3)} cm³.`
});
// ---------- Verbanden ----------
L({id:'B8.breakeven',niv:12,dom:'B',sub:'formules',naam:'Break-even: vanaf wanneer winst?',rm:true,verwar:['B6.snijpunt'],
  uitleg:'Winst = opbrengst − kosten. Per verkocht stuk verdien je (verkoopprijs − inkoopprijs). De vaste kosten moet je eerst terugverdienen: aantal = vaste kosten : winst per stuk.',
  gen(r){ let F,p,k,q; do{ p=r.pick([10,12,15,20,25]); k=r.pick([4,5,6,8,10]); q=r.int(20,80); F=(p-k)*q }while(p<=k||F>2000); return {F,p,k,q,t:r.pick(['be','winst']),n:q+r.pick([10,20,30]),c:r.pick([['hoodies met het schoollogo','hoodie'],['T-shirts voor de sponsorloop','shirt'],['kaarten voor het schoolfeest','kaart']])} },
  vraag:v=>`De leerlingenraad verkoopt ${v.c[0]}. De vaste kosten (ontwerp, kraam) zijn ${eur(v.F)}. Elke ${v.c[1]} kost ${eur(v.k)} en wordt verkocht voor ${eur(v.p)}. ${v.t==='be'?'Hoeveel moeten er verkocht worden om quitte te spelen?':`Wat is de winst als er ${v.n} verkocht worden?`}`,
  antw:v=>v.t==='be'?v.q:(v.p-v.k)*v.n-v.F, eenheid:v=>v.t==='be'?'':'€',
  stappen:v=>v.t==='be'?[st(`Winst per ${v.c[1]}: ${v.p} − ${v.k} = ${v.p-v.k}`,v.p-v.k),st(`${v.F} : ${v.p-v.k} = ${v.q}`,v.q)]:[st(`Winst per ${v.c[1]}: ${v.p} − ${v.k} = ${v.p-v.k}`,v.p-v.k),st(`${v.n} × ${v.p-v.k} = ${(v.p-v.k)*v.n}`,(v.p-v.k)*v.n),st(`Min vaste kosten: ${(v.p-v.k)*v.n} − ${v.F} = ${eur((v.p-v.k)*v.n-v.F)}`,(v.p-v.k)*v.n-v.F)],
  fouten:v=>v.t==='be'?[[rondaf(v.F/v.p,2),'Je deelde door de verkoopprijs. Elke '+v.c[1]+' kost ook geld: gebruik de winst per stuk.'],[rondaf(v.F/v.k,2),'Deel door de winst per stuk, niet door de inkoopprijs.']]:[[(v.p-v.k)*v.n,'Je vergat de vaste kosten.'],[v.p*v.n-v.F,'Je vergat de inkoopprijs per stuk.'],[v.p*v.n-v.k*v.n-v.F+v.F*2>0?v.p*v.n-v.k-v.F:0,'De inkoopprijs geldt voor elk stuk.']].filter(x=>x[0]>0),
  anders:v=>({tekst:'Maak een tabel met opbrengst en kosten.',tabel:{kop:['aantal','opbrengst','kosten','winst'],rijen:[0,Math.round(v.q/2),v.q,v.q+20].map(q=>[q,eur(v.p*q),eur(v.F+v.k*q),eur(v.p*q-v.F-v.k*q)])}})
});
L({id:'B8.linexp',niv:12,dom:'B',sub:'tabellen',naam:'Lineair tegen exponentieel',rm:true,verwar:['B6.exptabel'],
  uitleg:'Een lineaire groei krijgt elke stap hetzelfde erbij. Een exponentiële groei begint vaak langzaam, maar haalt de lineaire altijd in. Zoek met een tabel de eerste stap waarbij exponentieel groter is.',
  gen(r){ let A,a,B,g,n; do{ A=r.pick([100,200,500]); a=r.pick([20,25,50,100]); B=r.pick([50,100,200]); g=r.pick([1.2,1.25,1.5,2]); n=0; while(B*g**n<=A+a*n&&n<60) n++ }while(n<3||n>15); return {A,a,B,g,n,c:r.pick(['volgers','abonnees','leden'])} },
  vraag:v=>`Kanaal A heeft ${v.A} ${v.c} en krijgt er elke week ${v.a} bij. Kanaal B heeft ${v.B} ${v.c} en groeit elke week met factor ${nl(v.g)}. Na hoeveel weken heeft B voor het eerst meer ${v.c} dan A?`,
  antw:v=>v.n, eenheid:'weken',
  stappen:v=>[st(`A: ${v.A} + ${v.a} × w; B: ${v.B} × ${nl(v.g)}^w`),st(`Week ${v.n-1}: A = ${v.A+v.a*(v.n-1)}, B ≈ ${nl(rondaf(v.B*v.g**(v.n-1),1))} (A nog groter)`,rondaf(v.B*v.g**(v.n-1),1)),st(`Week ${v.n}: A = ${v.A+v.a*v.n}, B ≈ ${nl(rondaf(v.B*v.g**v.n,1))}`,rondaf(v.B*v.g**v.n,1)),st(`Dus na ${v.n} weken`,v.n)],
  fouten:v=>[[v.n-1,'In week '+(v.n-1)+' heeft A nog meer. Controleer met een tabel.'],[v.n+1,'In week '+v.n+' heeft B al meer.'],[Math.max(1,Math.round((v.A-v.B)/(v.B*(v.g-1)-v.a))||v.n+2),'Je rekende alsof B elke week evenveel groeit. Maar B groeit steeds harder.']],
  anders:v=>({tekst:'Maak een tabel per week.',tabel:{kop:['week','A','B'],rijen:Array.from({length:Math.min(v.n+1,8)},(_,i)=>{ const w=i<7?i:v.n; return [w,v.A+v.a*w,nl(rondaf(v.B*v.g**w,1))] })}})
});
L({id:'B8.klassen',niv:12,dom:'B',sub:'statistiek',naam:'Gemiddelde uit een tabel met klassen',rm:true,dec:1,verwar:['B4.frequentie','B5.gewogen'],
  uitleg:'Bij een tabel met klassen ken je de precieze waarden niet. Neem het klassenmidden als schatting, vermenigvuldig met de frequentie, tel op en deel door het totaal aantal.',
  gen(r){ const w=r.pick([5,10,20]),s=r.pick([0,10,20]); let f,tot,som; do{ f=[r.int(2,9),r.int(5,15),r.int(5,15),r.int(2,9)]; tot=f.reduce((a,b)=>a+b,0); som=f.reduce((a,x,i)=>a+x*(s+w*i+w/2),0) }while(Math.abs(som/tot*10-Math.round(som/tot*10))>1e-9&&false); return {w,s,f,tot,som,c:r.pick(['minuten reistijd naar school','minuten per dag op social media','minuten huiswerk per dag'])} },
  vraag:v=>`Een enquête onder ${v.tot} leerlingen over ${v.c}:<div class="vtabel">${vtabelHtml(['Klasse','Aantal'],v.f.map((x,i)=>[`${v.s+v.w*i} – < ${v.s+v.w*(i+1)}`,x]))}</div>Schat het gemiddelde met de klassenmiddens. Rond af op 1 decimaal.`,
  antw:v=>rondaf(v.som/v.tot,1), eenheid:'minuten',
  stappen:v=>[st(`Klassenmiddens: ${v.f.map((_,i)=>nl(v.s+v.w*i+v.w/2)).join(', ')}`),st(`Midden × aantal: ${v.f.map((x,i)=>`${nl(v.s+v.w*i+v.w/2)}×${x}`).join(' + ')} = ${nl(v.som)}`,v.som),st(`${nl(v.som)} : ${v.tot} ≈ ${nl(rondaf(v.som/v.tot,1))}`,rondaf(v.som/v.tot,1))],
  fouten:v=>[[rondaf(v.f.reduce((a,x,i)=>a+x*(v.s+v.w*i),0)/v.tot,1),'Je gebruikte de ondergrens van elke klasse. Neem het midden.'],[rondaf(v.som/4,1),'Deel door het aantal leerlingen, niet door het aantal klassen.'],[rondaf(v.s+2*v.w,1),'Dat is het midden van de hele tabel. De klassen hebben niet evenveel leerlingen.']],
  anders:v=>`Doe alsof iedereen in een klasse precies in het midden zit. Dan heb je ${v.f[0]} leerlingen met ${nl(v.s+v.w/2)} minuten, ${v.f[1]} met ${nl(v.s+1.5*v.w)} minuten, enzovoort. Neem daarvan het gemiddelde.`
});
L({id:'B8.formulekiezen',niv:12,dom:'B',sub:'formules',naam:'Welke formule past bij de situatie?',verwar:['B7.expformule','B6.tweepunten'],
  uitleg:'Elke stap hetzelfde erbij: lineair, N = begin + toename × t. Elke stap een vast percentage erbij of eraf: exponentieel, N = begin × groeifactorᵗ.',
  gen(r){ const b=r.pick([200,500,800,1000]),p=r.pick([3,4,5,8,10,20]),t=r.pick(['erbij','eraf','vast']); return {b,p,t,a:r.pick([15,20,25,40]),c:r.pick(['volgers','euro','leden'])} },
  vraag:v=>`Begin: ${v.b} ${v.c}. ${v.t==='erbij'?`Elk jaar komt er ${v.p}% bij.`:v.t==='eraf'?`Elk jaar gaat er ${v.p}% af.`:`Elk jaar komen er ${v.a} bij.`} Welke formule hoort hierbij (t in jaren)?`,
  opties:v=>{ const g=nl(rondaf(v.t==='eraf'?1-v.p/100:1+v.p/100,4)); return v.t==='vast'?[[`N = ${v.b} + ${v.a} × t`,true],[`N = ${v.b} × ${v.a}<sup>t</sup>`,false,'Er komt elk jaar een vast aantal bij, dat is lineair.'],[`N = ${v.a} + ${v.b} × t`,false,'Het begingetal is '+v.b+', dat staat los.'],[`N = ${v.b} × ${nl(1+v.a/100)}<sup>t</sup>`,false,'Er komt een vast aantal bij, geen percentage.']]:[[`N = ${v.b} × ${g}<sup>t</sup>`,true],[`N = ${v.b} ${v.t==='eraf'?'−':'+'} ${v.p} × t`,false,'Een percentage erbij of eraf is exponentieel: gebruik de groeifactor.'],[`N = ${v.b} × ${nl(v.p/100)}<sup>t</sup>`,false,'De groeifactor is het hele nieuwe deel: 100% '+(v.t==='eraf'?'−':'+')+' '+v.p+'%.'],[`N = ${v.b} × ${v.t==='eraf'?nl(1+v.p/100):nl(1-v.p/100)}<sup>t</sup>`,false,v.t==='eraf'?'Bij een afname is de groeifactor kleiner dan 1.':'Bij een toename is de groeifactor groter dan 1.']] },
  stappen:v=>[st(v.t==='vast'?'Elk jaar hetzelfde aantal erbij: lineair':'Elk jaar een percentage: exponentieel'),st(v.t==='vast'?`Controle t = 1: ${v.b} + ${v.a} = ${v.b+v.a}`:`Controle t = 1: ${v.b} × ${nl(rondaf(v.t==='eraf'?1-v.p/100:1+v.p/100,4))} = ${nl(rondaf(v.b*(v.t==='eraf'?1-v.p/100:1+v.p/100),2))}`,v.t==='vast'?v.b+v.a:rondaf(v.b*(v.t==='eraf'?1-v.p/100:1+v.p/100),2))],
  anders:v=>`Reken de eerste twee jaren uit en kijk welke formule dezelfde getallen geeft.`,
  koppel:(v,r)=>({vraag:'Koppel elke situatie aan de juiste formule.',paren:r.shuffle([['500, elk jaar 20 erbij','N = 500 + 20t'],['500, elk jaar 20% erbij','N = 500 × 1,2ᵗ'],['500, elk jaar 20% eraf','N = 500 × 0,8ᵗ'],['500, elk jaar 20 eraf','N = 500 − 20t'],['500, elk jaar verdubbeld','N = 500 × 2ᵗ'],['500, elk jaar gehalveerd','N = 500 × 0,5ᵗ']]).slice(0,4)})
});
