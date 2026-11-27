// ===== Niveau 4 · 2F · ongeveer 2e klas =====
// ---------- Getallen ----------
L({id:'G4.afronden',niv:8,dom:'G',sub:'getalbegrip',naam:'Afronden op decimalen in een context',rm:true,
  uitleg:'Rond af op het aantal decimalen dat past bij de situatie: geld op 2 decimalen (centen), en kijk bij afronden naar het eerstvolgende cijfer.',
  gen(r){ const type=r.pick(['geld','deel']); if(type==='geld'){ let t,n; do{ t=r.int(1000,9000); n=r.pick([3,6,7,9,11,12]) }while((t%n)===0||Math.round(t/n*1000)%10===5); return {type,t,n} } let a,b; do{ a=r.int(20,99); b=r.pick([3,6,7,9,11]) }while(a%b===0||Math.round(a/b*100)%10===5); return {type,a,b} },
  vraag:v=>v.type==='geld'?`Met ${v.n} vrienden huren jullie een sloep voor ${eur(c2e(v.t))}. Hoeveel betaalt ieder? Rond af op centen.`:`Een fietstocht van ${v.a} km wordt verdeeld in ${v.b} gelijke etappes. Hoe lang is één etappe? Rond af op 1 decimaal.`,
  antw:v=>v.type==='geld'?rondaf(v.t/v.n/100,2):rondaf(v.a/v.b,1), eenheid:v=>v.type==='geld'?'€':'km',
  stappen:v=>v.type==='geld'?[st(`${nl(c2e(v.t))} : ${v.n} = ${nl(v.t/v.n/100,5)}…`),st(`Het derde cijfer achter de komma is ${Math.floor(v.t/v.n*10)%10}, dus ${Math.floor(v.t/v.n*10)%10>=5?'naar boven':'naar beneden'}.`,Math.floor(v.t/v.n*10)%10),st(`Afgerond: ${eur(rondaf(v.t/v.n/100,2))}`,rondaf(v.t/v.n/100,2))]:[st(`${v.a} : ${v.b} = ${nl(v.a/v.b,4)}…`),st(`Het tweede cijfer achter de komma is ${Math.floor(v.a/v.b*100)%10}`,Math.floor(v.a/v.b*100)%10),st(`Afgerond: ${nl(rondaf(v.a/v.b,1))} km`,rondaf(v.a/v.b,1))],
  fouten:v=>v.type==='geld'?[[Math.floor(v.t/v.n)/100,'Je hebt de cijfers afgekapt in plaats van afgerond.'],[rondaf(v.t/v.n/100,1),'Bij geld rond je af op centen: 2 cijfers achter de komma.'],[Math.ceil(v.t/v.n)/100,'Kijk naar het derde cijfer: is dat 5 of meer?']]:[[Math.floor(v.a/v.b*10)/10,'Je hebt afgekapt in plaats van afgerond.'],[Math.round(v.a/v.b),'Rond af op 1 decimaal, niet op een heel getal.'],[rondaf(v.a/v.b,2),'Rond af op 1 decimaal.']],
  anders:v=>`Zet het getal op een getallenlijn tussen de twee mogelijke afgeronde waarden en kijk welke het dichtstbij ligt.`
});
L({id:'G4.miljoen',niv:8,dom:'G',sub:'getalbegrip',naam:'Grote getallen: duizend, miljoen, miljard',dec:3,
  uitleg:'1 miljoen = 1.000.000 (6 nullen), 1 miljard = 1.000.000.000 (9 nullen). 2,4 miljoen = 2,4 × 1.000.000 = 2.400.000.',
  gen(r){ const naarGetal=r.ja(); const [c,e,x]=r.pick([['Een video heeft',['miljoen',1e6],r.pick([1.2,2.4,3.5,0.8,17.5,4.25])],['Een video heeft',['miljard',1e9],r.pick([1.2,2.4,3.5])],['Een stad heeft',['duizend',1e3],r.pick([17.5,42.5,85,120,350])],['Een land heeft',['miljoen',1e6],r.pick([17.5,8.6,4.25,11.6,6.8])],['Een game is gedownload door',['miljoen',1e6],r.pick([1.2,2.4,0.8,6.8,0.35])]]); return {naarGetal,x,e,c} }, // aantal past bij de context
  vraag:v=>v.naarGetal?`${v.c} ${nl(v.x)} ${v.e[0]} ${v.c.includes('video')?'views':v.c.includes('game')?'spelers':'inwoners'}. Schrijf dit getal helemaal uit (zonder het woord ${v.e[0]}).`:`${v.c} ${nl(v.x*v.e[1],0)} ${v.c.includes('video')?'views':v.c.includes('game')?'spelers':'inwoners'}. Hoeveel ${v.e[0]} is dat?`,
  antw:v=>v.naarGetal?rondaf(v.x*v.e[1],0):v.x, eenheid:v=>v.naarGetal?'':v.e[0],
  stappen:v=>[st(`1 ${v.e[0]} = ${nl(v.e[1],0)}`,v.e[1]),st(v.naarGetal?`${nl(v.x)} × ${nl(v.e[1],0)} = ${nl(v.x*v.e[1],0)}`:`${nl(v.x*v.e[1],0)} : ${nl(v.e[1],0)} = ${nl(v.x)}`,v.naarGetal?rondaf(v.x*v.e[1],0):v.x)],
  fouten:v=>v.naarGetal?[[rondaf(v.x*v.e[1]/10,0),'Tel de nullen: 1 '+v.e[0]+' heeft er '+Math.log10(v.e[1])+'.'],[rondaf(v.x*v.e[1]*10,0),'Tel de nullen: 1 '+v.e[0]+' heeft er '+Math.log10(v.e[1])+'.']]:[[v.x*10,'Kijk goed hoeveel nullen 1 '+v.e[0]+' heeft.'],[v.x/10,'Kijk goed hoeveel nullen 1 '+v.e[0]+' heeft.']],
  anders:v=>`Schrijf het getal in groepjes van drie cijfers: duizenden, miljoenen, miljarden. Elke groep van drie is een stap van × 1000.`
});
L({id:'G4.negatief',niv:8,dom:'G',sub:'negatief',naam:'Rekenen met negatieve getallen',negatief:true,
  uitleg:'Plus een negatief getal = min. Min een negatief getal = plus. Keer of delen: twee mintekens geven een plus, één minteken geeft een min.',
  gen(r){ const op=r.pick(['+','−','×',':']); let a=r.int(-15,15)||-3,b=r.int(-12,12)||-4; if(a>0&&b>0) b=-b; if(op===':'){ const q=r.int(-9,9)||-2; a=q*b } return {a,b,op} },
  vraag:v=>`Reken uit: <b>${nl(v.a)} ${v.op} ${v.b<0?'('+nl(v.b)+')':v.b}</b>`,
  antw:v=>({'+':v.a+v.b,'−':v.a-v.b,'×':v.a*v.b,':':v.a/v.b})[v.op],
  stappen:v=>({'+':[st(`${nl(v.a)} + ${v.b<0?'('+nl(v.b)+')':v.b}${v.b<0?` = ${nl(v.a)} − ${-v.b}`:''}`),st(`= ${nl(v.a+v.b)}`,v.a+v.b)],'−':[st(`${nl(v.a)} − ${v.b<0?'('+nl(v.b)+')':v.b}${v.b<0?` = ${nl(v.a)} + ${-v.b}`:''}`),st(`= ${nl(v.a-v.b)}`,v.a-v.b)],'×':[st(`${Math.abs(v.a)} × ${Math.abs(v.b)} = ${Math.abs(v.a*v.b)}`,Math.abs(v.a*v.b)),st(`${(v.a<0)!==(v.b<0)?'Eén minteken: min':'Twee mintekens (of geen): plus'}`),st(`= ${nl(v.a*v.b)}`,v.a*v.b)],':':[st(`${Math.abs(v.a)} : ${Math.abs(v.b)} = ${Math.abs(v.a/v.b)}`,Math.abs(v.a/v.b)),st(`${(v.a<0)!==(v.b<0)?'Eén minteken: min':'Twee mintekens (of geen): plus'}`),st(`= ${nl(v.a/v.b)}`,v.a/v.b)]})[v.op],
  fouten:v=>{ const g=({'+':v.a+v.b,'−':v.a-v.b,'×':v.a*v.b,':':v.a/v.b})[v.op]; return [[-g,'Let op het minteken.'],[({'+':v.a-v.b,'−':v.a+v.b,'×':v.a+v.b,':':v.a*v.b})[v.op],v.op==='−'?'Min een negatief getal wordt plus.':v.op==='+'?'Plus een negatief getal wordt min.':'Kijk goed welke bewerking er staat.'],[({'+':Math.abs(v.a)+Math.abs(v.b),'−':Math.abs(v.a)-Math.abs(v.b),'×':Math.abs(v.a*v.b),':':Math.abs(v.a/v.b)})[v.op],'Je liet de mintekens weg.']] },
  anders:v=>v.op==='+'||v.op==='−'?({tekst:'Gebruik de getallenlijn: begin bij het eerste getal en zet stappen.',svg:FIG.lijn(Math.min(v.a,v.a+v.b,v.a-v.b)-1,Math.max(v.a,v.a+v.b,v.a-v.b)+1,1,[{x:v.a,label:nl(v.a)},{x:v.op==='+'?v.a+v.b:v.a-v.b,label:'?',k:'b'}],5)}):`Reken eerst zonder mintekens. Tel daarna de mintekens: een even aantal geeft plus, een oneven aantal min.`,
  negatief2:true
});
L({id:'G4.kommakeerkomma',niv:8,dom:'G',sub:'komma',naam:'Kommagetal keer kommagetal',rm:false,verwar:['G4.afronden'],
  uitleg:'Reken zonder komma\'s. Tel daarna hoeveel cijfers er in totaal achter de komma stonden, en zet de komma terug. Schat altijd ter controle.',
  gen(r){ return {kg:r.int(11,39)/10,p:r.int(12,49)/10,w:r.pick(['appels','mandarijnen','druiven','tomaten','kersen'])} },
  vraag:v=>`Op de markt kosten ${v.w} ${eur(v.p)} per kilo. Je koopt ${nl(v.kg)} kg. Wat betaal je?`,
  antw:v=>rondaf(v.kg*v.p,2), eenheid:'€',
  stappen:v=>[st(`Zonder komma's: ${Math.round(v.kg*10)} × ${Math.round(v.p*10)} = ${Math.round(v.kg*10)*Math.round(v.p*10)}`,Math.round(v.kg*10)*Math.round(v.p*10)),st(`Twee cijfers achter de komma: ${nl(rondaf(v.kg*v.p,2))}`,rondaf(v.kg*v.p,2)),st(`Schatting: ${Math.round(v.kg)} × ${Math.round(v.p)} ≈ ${Math.round(v.kg)*Math.round(v.p)}, dat past.`)],
  fouten:v=>[[rondaf(v.kg*v.p*10,2),'De komma staat verkeerd. Schat eerst ongeveer.'],[rondaf(v.kg*v.p/10,2),'De komma staat verkeerd. Schat eerst ongeveer.'],[rondaf(Math.floor(v.kg)*v.p+(v.kg%1),2),'Je moet de hele kilo\'s én het stuk achter de komma met de prijs vermenigvuldigen.']],
  anders:v=>`Splits: ${Math.floor(v.kg)} kg kost ${Math.floor(v.kg)} × ${eur(v.p)} = ${eur(Math.floor(v.kg)*v.p)}. En ${nl(rondaf(v.kg%1,1))} kg kost ${nl(rondaf(v.kg%1,1))} × ${eur(v.p)} = ${eur(rondaf((v.kg%1)*v.p,2))}. Samen ${eur(rondaf(v.kg*v.p,2))}.`
});
// ---------- Verhoudingen ----------
L({id:'V4.terugrekenen',niv:8,dom:'V',sub:'pverandering',naam:'Terugrekenen naar de oude prijs',verwar:['V3.korting','V4.btw'],rm:true,
  uitleg:'De nieuwe prijs is een percentage van de OUDE prijs. Bij 20% korting is de nieuwe prijs 80%. Reken via 1% terug naar 100%.',
  gen(r){ let k,o; do{ k=r.pick([10,15,20,25,30,40]); o=r.pick([40,60,70,80,90,120,150,200,240,300,450,600,1200,1800]) }while((o*(100-k))%100!==0); const omhoog=r.ja(.3); return {k,o,omhoog,n:rondaf(o*(omhoog?100+k:100-k)/100,2),d:({40:'pet',60:'scooterhelm',70:'sporttas',80:'winterjas',90:'paar voetbalschoenen',120:'skateboard',150:'tent',200:'gameconsole',240:'telefoon',300:'telefoon',450:'laptop',600:'laptop',1200:'e-bike',1800:'e-bike'})[o]} }, // product past bij de prijs
  vraag:v=>v.omhoog?`De prijs van een ${v.d} is met ${v.k}% verhoogd. Nu kost hij ${eur(v.n)}. Wat was de oude prijs?`:`Na ${v.k}% korting kost een ${v.d} nog ${eur(v.n)}. Wat was de oude prijs?`,
  antw:v=>v.o, eenheid:'€',
  stappen:v=>{ const p=v.omhoog?100+v.k:100-v.k; return [st(`${eur(v.n)} is ${p}% van de oude prijs`,p),st(`1% = ${nl(v.n)} : ${p} = ${nl(v.n/p)}`,rondaf(v.n/p,4)),st(`100% = ${nl(v.n/p)} × 100 = ${eur(v.o)}`,v.o)] },
  tabel:v=>{ const p=v.omhoog?100+v.k:100-v.k; return {kop:['Procent','Bedrag (€)'],rijen:[[p,v.n],[1,rondaf(v.n/p,4)],[100,v.o]],leeg:[[2,1]]} },
  fouten:v=>v.omhoog?[[rondaf(v.n*(100-v.k)/100,2),'Je haalde '+v.k+'% van de nieuwe prijs af. De '+v.k+'% hoorde bij de OUDE prijs.'],[rondaf(v.n*(100+v.k)/100,2),'Je rekende nog een keer '+v.k+'% erbij.'],[v.n-v.k,'Procent is geen bedrag in euro.']]:[[rondaf(v.n*(100+v.k)/100,2),'Je nam '+v.k+'% van de nieuwe prijs. De korting hoorde bij de OUDE prijs.'],[rondaf(v.n*(100-v.k)/100,2),'Je rekende nog een keer korting. Je moet juist terug naar 100%.'],[v.n+v.k,'Procent is geen bedrag in euro.']],
  anders:v=>{ const p=v.omhoog?100+v.k:100-v.k; return ({tekst:`Zet het in een verhoudingstabel: ${p}% hoort bij ${eur(v.n)}. Deel door ${p} en doe keer 100.`,tabel:{kop:['Procent','Bedrag (€)'],rijen:[[p,v.n],[1,rondaf(v.n/p,4)],[100,v.o]]}}) },
  sab:v=>{ if(v.omhoog){ const f=rondaf(v.n*(100-v.k)/100,2); return {intro:`Na een verhoging van ${v.k}% kost een ${v.d} ${eur(v.n)}. Ravi rekent de oude prijs uit.`,stappen:[`De verhoging is ${v.k}% van de oude prijs.`,`${v.k}% van ${nl(v.n)} = ${nl(v.n*v.k/100)}`,`Oude prijs = ${nl(v.n)} − ${nl(v.n*v.k/100)}`,`Antwoord: ${eur(f)}`],fout:1,juist:v.o,check:f,eenheid:'€',vraag:'Wat was de oude prijs echt?',uitleg:`Ravi neemt ${v.k}% van de NIEUWE prijs. Maar ${eur(v.n)} is ${100+v.k}% van de oude prijs.`,goed:[`${100+v.k}% = ${eur(v.n)}`,`1% = ${nl(v.n/(100+v.k))}`,`100% = ${eur(v.o)}`]} }
    const f=rondaf(v.n*(100+v.k)/100,2); return {intro:`Na ${v.k}% korting kost een ${v.d} nog ${eur(v.n)}. Ravi rekent de oude prijs uit.`,stappen:[`De korting is ${v.k}% van de oude prijs.`,`${v.k}% van ${nl(v.n)} = ${nl(v.n*v.k/100)}`,`Oude prijs = ${nl(v.n)} + ${nl(v.n*v.k/100)}`,`Antwoord: ${eur(f)}`],fout:1,juist:v.o,check:f,eenheid:'€',vraag:'Wat was de oude prijs echt?',uitleg:`Ravi neemt ${v.k}% van de NIEUWE prijs. Maar ${eur(v.n)} is ${100-v.k}% van de oude prijs.`,goed:[`${100-v.k}% = ${eur(v.n)}`,`1% = ${nl(v.n/(100-v.k))}`,`100% = ${eur(v.o)}`]} }
});
L({id:'V4.btw',niv:8,dom:'V',sub:'procent',naam:'Btw erbij rekenen',verwar:['V4.terugrekenen'],rm:true,
  uitleg:'Btw komt bovenop de prijs. Bij 21% btw betaal je 121% van de prijs zonder btw: prijs × 1,21. Bij 9% btw: × 1,09.',
  gen(r){ const b=r.pick([21,9]); let x; do{ x=r.pick([20,40,50,80,100,150,200,250,300,400,500,1000]) }while((x*b)%100!==0&&(x*b)%10!==0); return {b,x,d:b===21?r.pick(['laptop','fiets','koptelefoon','bureaustoel']):r.pick(['boodschappen voor een feestje','schoolboeken','bloemen','een taart'])} },
  vraag:v=>`De prijs van ${v.b===21?'een '+v.d:v.d} is ${eur(v.x)} zonder btw. Er komt ${v.b}% btw bij. Wat is de prijs met btw?`,
  antw:v=>rondaf(v.x*(100+v.b)/100,2), eenheid:'€',
  stappen:v=>[st(`Met btw is het ${100+v.b}% = ${nl((100+v.b)/100)}`,(100+v.b)/100),st(`${nl((100+v.b)/100)} × ${v.x} = ${eur(v.x*(100+v.b)/100)}`,rondaf(v.x*(100+v.b)/100,2))],
  fouten:v=>[[rondaf(v.x*v.b/100,2),'Dat is alleen de btw. De vraag is de prijs mét btw.'],[v.x+v.b,'Btw is een percentage, geen bedrag in euro.'],[rondaf(v.x*(100-v.b)/100,2),'Btw komt erbij, niet eraf.']],
  anders:v=>({tekst:`Teken een balk van 100% en zet er ${v.b}% achter.`,svg:FIG.balk([{w:100,label:`100% = ${eur(v.x)}`,k:'b'},{w:v.b,label:`${v.b}%`,k:'a'}],`${100+v.b}%`)})
});
L({id:'V4.recept',niv:8,dom:'V',sub:'vtabel',naam:'Een recept omrekenen',
  uitleg:'Reken eerst terug naar 1 persoon (of naar een handig aantal), dan naar het aantal personen dat je nodig hebt.',
  gen(r){ let p1,p2,q; const ing=r.pick([['bloem','gram',[200,240,300,360,400,500]],['melk','ml',[250,300,400,500,600]],['pasta','gram',[300,400,500,600]],['kipfilet','gram',[400,480,600]]]); do{ p1=r.pick([2,3,4,6]); p2=r.pick([3,5,6,8,9,10]); q=r.pick(ing[2]) }while(p1===p2||(q*p2)%p1!==0); return {p1,p2,q,ing,gerecht:r.pick(['pannenkoeken','pasta pesto','wraps','curry'])} },
  vraag:v=>`Voor ${v.gerecht} voor ${v.p1} personen heb je ${v.q} ${v.ing[1]} ${v.ing[0]} nodig. Hoeveel ${v.ing[1]} ${v.ing[0]} heb je nodig voor ${v.p2} personen?`,
  antw:v=>v.q*v.p2/v.p1, eenheid:v=>v.ing[1],
  stappen:v=>[st(`1 persoon: ${v.q} : ${v.p1} = ${nl(v.q/v.p1)}`,rondaf(v.q/v.p1,4)),st(`${v.p2} personen: ${v.p2} × ${nl(v.q/v.p1)} = ${nl(v.q*v.p2/v.p1)}`,v.q*v.p2/v.p1)],
  tabel:v=>({kop:['Personen',v.ing[0]+' ('+v.ing[1]+')'],rijen:[[v.p1,v.q],[1,rondaf(v.q/v.p1,4)],[v.p2,v.q*v.p2/v.p1]],leeg:[[2,1]]}),
  fouten:v=>[[v.q+(v.p2-v.p1),'Je telde het verschil in personen op. Je moet vermenigvuldigen of delen.'],[rondaf(v.q*v.p1/v.p2,2),'Je hebt de verhouding omgedraaid. '+(v.p2>v.p1?'Meer':'Minder')+' personen betekent '+(v.p2>v.p1?'meer':'minder')+' '+v.ing[0]+'.'],[v.q*v.p2,'Je vergat eerst terug te rekenen naar 1 persoon.']],
  anders:v=>({tekst:'Verhoudingstabel via 1 persoon:',tabel:{kop:['Personen',v.ing[1]],rijen:[[v.p1,v.q],[1,rondaf(v.q/v.p1,4)],[v.p2,v.q*v.p2/v.p1]]}})
});
L({id:'V4.procentverandering',niv:8,dom:'V',sub:'pverandering',naam:'Toename of afname in procenten',rm:true,verwar:['V4.terugrekenen'],
  uitleg:'Procentuele verandering = (nieuw − oud) : oud × 100%. Je deelt altijd door de OUDE waarde.',
  gen(r){ let o,p; do{ o=r.pick([20,25,40,50,60,80,120,200,250,400,500]); p=r.pick([-40,-30,-25,-20,-15,-10,5,10,15,20,25,30,50,60,75]) }while((o*p)%100!==0); return {o,p,n:o*(100+p)/100,c:r.pick([['Een kanaal had','volgers en nu'],['Een kaartje kostte','euro en nu'],['De oefentijd per week was','minuten en nu']])} },
  vraag:v=>`${v.c[0]} ${nl(v.o)} ${v.c[1]} ${nl(v.n)}. Met hoeveel procent is het ${v.p>0?'gestegen':'gedaald'}?`,
  antw:v=>Math.abs(v.p), eenheid:'%',
  stappen:v=>[st(`Verschil: ${nl(v.n)} − ${nl(v.o)} = ${nl(v.n-v.o)}`,v.n-v.o),st(`Delen door de oude waarde: ${nl(v.n-v.o)} : ${nl(v.o)} = ${nl((v.n-v.o)/v.o)}`,rondaf((v.n-v.o)/v.o,4)),st(`× 100 = ${nl(Math.abs(v.p))}% ${v.p>0?'stijging':'daling'}`,Math.abs(v.p))],
  fouten:v=>[[rondaf(Math.abs(100*(v.n-v.o)/v.n),2),'Je deelde door de nieuwe waarde. Deel altijd door de oude waarde.'],[Math.abs(v.n-v.o),'Dat is het verschil, geen percentage.'],[rondaf(100*v.n/v.o,2),'Dat is de nieuwe waarde in procenten van de oude. De verandering is het verschil met 100%.']],
  anders:v=>({tekst:'De oude waarde is 100%. Zet het verschil in een verhoudingstabel.',tabel:{kop:['Waarde','Procent'],rijen:[[v.o,100],[Math.abs(v.n-v.o),Math.abs(v.p)]]}}),
  v3:v=>({vraag:`${v.c[0]} ${nl(v.o)} ${v.c[1]} ${nl(v.n)}. Leg uit met hoeveel procent het ${v.p>0?'gestegen':'gedaald'} is.`,
    goed:`Het verschil is ${nl(Math.abs(v.n-v.o))}. Ten opzichte van de oude waarde: ${nl(Math.abs(v.n-v.o))} : ${nl(v.o)} = ${nl(Math.abs(v.p)/100)}, dus ${Math.abs(v.p)}%.`,
    bijna:`Het verschil is ${nl(Math.abs(v.n-v.o))}, dus het is ${nl(Math.abs(v.n-v.o))}% ${v.p>0?'gestegen':'gedaald'}.`,
    fout:`${nl(Math.abs(v.n-v.o))} : ${nl(v.n)} × 100 = ${nl(rondaf(Math.abs(100*(v.n-v.o)/v.n),1))}%.`,
    kijkwijzer:['Is het verschil berekend?','Is er gedeeld door de OUDE waarde?','Is er keer 100 gedaan en staat er een %-teken?']})
});
// ---------- Meten en meetkunde ----------
L({id:'M4.snelheid',niv:8,dom:'M',sub:'tijd',naam:'Afstand, snelheid en tijd',rm:true,
  uitleg:'Afstand = snelheid × tijd, met de tijd in uren. 1 uur en 15 minuten is 1,25 uur. Of gebruik een verhoudingstabel van 60 minuten naar jouw tijd.',
  gen(r){ const wat=r.pick(['afstand','tijd']); let s,m; do{ s=r.pick([12,15,16,18,20,24,30,45,60,80,90,100,120]); m=r.pick([15,20,30,40,45,75,90,105,150]) }while((s*m)%60!==0); return {wat,s,m,km:s*m/60,c:s<=30?r.pick(['fiets','e-bike']):s<=60?'scooter':r.pick(['auto','touringcar','trein'])} },
  vraag:v=>v.wat==='afstand'?`Een ${v.c} rijdt gemiddeld ${v.s} km/u. Hoeveel km legt hij af in ${v.m>=60?Math.floor(v.m/60)+' uur'+(v.m%60?' en '+v.m%60+' minuten':''):v.m+' minuten'}?`:`Een ${v.c} rijdt gemiddeld ${v.s} km/u. Hoeveel minuten doet hij over ${nl(v.km)} km?`,
  antw:v=>v.wat==='afstand'?v.km:v.m, eenheid:v=>v.wat==='afstand'?'km':'min',
  stappen:v=>v.wat==='afstand'?[st(`${v.m} minuten = ${nl(v.m/60)} uur`,rondaf(v.m/60,4)),st(`Afstand: ${v.s} × ${nl(v.m/60)} = ${nl(v.km)} km`,v.km)]:[st(`In 60 minuten: ${v.s} km`,v.s),st(`1 km duurt ${nl(60/v.s)} minuten`,rondaf(60/v.s,4)),st(`${nl(v.km)} km: ${nl(v.km)} × ${nl(60/v.s)} = ${v.m} minuten`,v.m)],
  tabel:v=>({kop:['Minuten','Kilometer'],rijen:[[60,v.s],[v.m,v.km]],leeg:v.wat==='afstand'?[[1,1]]:[[1,0]]}),
  fouten:v=>v.wat==='afstand'?[[rondaf(v.s*v.m/100,2),`${v.m} minuten is niet ${nl(v.m/100)} uur. Deel door 60.`],[v.s*v.m,'Zet de tijd eerst om in uren.'],[rondaf(v.s/v.m*60,2),'Je hebt gedeeld in plaats van vermenigvuldigd.']]:[[rondaf(v.km/v.s,4),'Dat is de tijd in uren. Reken om naar minuten.'],[rondaf(v.km/v.s*100,2),'Een uur heeft 60 minuten, niet 100.'],[rondaf(v.s/v.km*60,2),'Je hebt de verhouding omgedraaid.']],
  anders:v=>({tekst:'Verhoudingstabel: in 60 minuten leg je de snelheid af.',tabel:{kop:['Minuten','Kilometer'],rijen:[[60,v.s],[v.m,v.km]]}})
});
L({id:'M4.cirkel',niv:8,dom:'M',sub:'oppervlak',naam:'Omtrek en oppervlakte van een cirkel',rm:true,dec:1,tol:v=>Math.max(.06,(v.wat==='omtrek'?2*Math.PI*v.r:Math.PI*v.r*v.r)*.0012),
  uitleg:'Omtrek = π × diameter (= 2 × π × straal). Oppervlakte = π × straal × straal. Gebruik π ≈ 3,14 of de π-toets.',
  gen(r){ const [c,rs,eh]=r.pick([['Een trampoline',[15,18,20,25],'dm'],['Een ronde tafel',[5,6,7,8],'dm'],['Een pizza',[12,14,15,16],'cm'],['Een rond zwembadje',[10,12,15,20],'dm'],['Een cirkelvormig grasveld',[5,6,8,10,12],'m'],['Een bierviltje',[4,5,6],'cm']]); return {r:r.pick(rs),wat:r.pick(['omtrek','opp']),c,eh,geefD:r.ja()} }, // realistische maat per voorwerp
  vraag:v=>`${v.c} heeft een ${v.geefD?'diameter van '+(2*v.r):'straal van '+v.r} ${v.eh}. Bereken de ${v.wat==='omtrek'?'omtrek':'oppervlakte'}. Rond af op 1 decimaal.`,
  fig:v=>FIG.cirkel(v.r,v.geefD?'d = '+(2*v.r):'r = '+v.r),
  antw:v=>rondaf(v.wat==='omtrek'?2*Math.PI*v.r:Math.PI*v.r*v.r,1), eenheid:v=>v.wat==='omtrek'?v.eh:v.eh+'²',
  stappen:v=>v.wat==='omtrek'?[st(`Diameter = ${2*v.r}`,2*v.r),st(`Omtrek = π × ${2*v.r} ≈ ${nl(rondaf(2*Math.PI*v.r,1))}`,rondaf(2*Math.PI*v.r,1))]:[st(`Straal = ${v.r}`,v.r),st(`Oppervlakte = π × ${v.r} × ${v.r} = π × ${v.r*v.r} ≈ ${nl(rondaf(Math.PI*v.r*v.r,1))}`,rondaf(Math.PI*v.r*v.r,1))],
  fouten:v=>v.wat==='omtrek'?[[rondaf(Math.PI*v.r,1),'Je gebruikte de straal. Omtrek = π × diameter.'],[rondaf(Math.PI*v.r*v.r,1),'Dat is de oppervlakte.'],[rondaf(4*Math.PI*v.r,1),'Je verdubbelde de diameter nog een keer.']]:[[rondaf(Math.PI*4*v.r*v.r,1),'Je gebruikte de diameter in plaats van de straal.'],[rondaf(2*Math.PI*v.r,1),'Dat is de omtrek.'],[rondaf(Math.PI*2*v.r,1),'Oppervlakte = π × straal × straal.']],
  anders:v=>v.wat==='omtrek'?`Leg een touw om de cirkel en dan langs de diameter: het touw is iets meer dan 3 keer zo lang als de diameter. Dat "iets meer dan 3" is π.`:`Een cirkel past in een vierkant van ${2*v.r} bij ${2*v.r}. De cirkel is iets meer dan driekwart daarvan: ongeveer 3,14 × ${v.r} × ${v.r}.`
});
const INH4=[['m³','dm³',1000],['dm³','cm³',1000],['m³','liter',1000],['liter','ml',1000],['cm³','ml',1],['liter','dm³',1]];
L({id:'M4.inhoudmaten',niv:8,dom:'M',sub:'inhoud',naam:'Inhoudsmaten omrekenen',dec:4,
  uitleg:'Bij inhoud is elke stap op het trappetje keer 1000 (10 × 10 × 10). Handig: 1 dm³ = 1 liter en 1 cm³ = 1 ml.',
  gen(r){ let e; do{ e=r.pick(INH4) }while(e[2]===1&&r.ja(.6)); const naarKlein=r.ja(); const g=r.pick([0.5,1.2,2,2.5,0.75,3.5,0.25,4]); return {e,naarKlein,g,k:rondaf(g*e[2],4)} },
  vraag:v=>v.naarKlein?`Hoeveel ${v.e[1]} is ${nl(v.g)} ${v.e[0]}?`:`Hoeveel ${v.e[0]} is ${nl(v.k)} ${v.e[1]}?`,
  antw:v=>v.naarKlein?v.k:v.g, eenheid:v=>v.naarKlein?v.e[1]:v.e[0],
  stappen:v=>[st(`1 ${v.e[0]} = ${nl(v.e[2])} ${v.e[1]}`,v.e[2]),st(v.naarKlein?`${nl(v.g)} × ${nl(v.e[2])} = ${nl(v.k)}`:`${nl(v.k)} : ${nl(v.e[2])} = ${nl(v.g)}`,v.naarKlein?v.k:v.g)],
  fouten:v=>v.e[2]===1?[[rondaf((v.naarKlein?v.g:v.k)*1000,4),`1 ${v.e[0]} is precies 1 ${v.e[1]}.`],[rondaf((v.naarKlein?v.g:v.k)/1000,6),`1 ${v.e[0]} is precies 1 ${v.e[1]}.`]]:v.naarKlein?[[rondaf(v.g*10,4),'Bij inhoud is het keer 1000 per stap, niet keer 10.'],[rondaf(v.g*100,4),'Bij inhoud is het keer 1000 per stap, niet keer 100.']]:[[rondaf(v.k/10,4),'Bij inhoud deel je door 1000 per stap.'],[rondaf(v.k/100,4),'Bij inhoud deel je door 1000 per stap.']],
  anders:v=>`Een kubus van 1 dm bij 1 dm bij 1 dm is precies 1 liter. Er passen 10 × 10 × 10 = 1000 kubusjes van 1 cm³ in.`,
  koppel:(v,r)=>({vraag:'Koppel de inhouden die even groot zijn.',paren:r.shuffle([['1 m³','1000 liter'],['1 dm³','1 liter'],['1 cm³','1 ml'],['0,5 liter','500 cm³'],['2 m³','2000 dm³'],['250 ml','0,25 dm³']]).slice(0,4)})
});
L({id:'M4.plattegrond',niv:8,dom:'M',sub:'oppervlak',naam:'Oppervlakte via een plattegrond met schaal',rm:true,verwar:['V3.schaal'],
  uitleg:'Reken eerst de echte lengte en breedte uit met de schaal. Bereken daarna pas de oppervlakte. (Niet eerst de oppervlakte op papier: die wordt met schaal × schaal vergroot.)',
  gen(r){ const s=r.pick([50,100,200]); let l,b; do{ l=r.int(4,16)/(s===50?1:2); b=r.int(3,12)/(s===50?1:2) }while(l<=b); return {s,l,b,c:r.pick(['slaapkamer','klaslokaal','woonkamer','kantine'])} },
  vraag:v=>`Op een plattegrond met schaal 1 : ${v.s} is een ${v.c} ${nl(v.l)} cm lang en ${nl(v.b)} cm breed. Hoeveel m² is de ${v.c} in het echt?`,
  antw:v=>rondaf(v.l*v.s/100*v.b*v.s/100,2), eenheid:m2,
  stappen:v=>[st(`Lengte echt: ${nl(v.l)} × ${v.s} = ${nl(v.l*v.s)} cm = ${nl(v.l*v.s/100)} m`,rondaf(v.l*v.s/100,2)),st(`Breedte echt: ${nl(v.b)} × ${v.s} = ${nl(v.b*v.s)} cm = ${nl(v.b*v.s/100)} m`,rondaf(v.b*v.s/100,2)),st(`Oppervlakte: ${nl(v.l*v.s/100)} × ${nl(v.b*v.s/100)} = ${nl(v.l*v.s*v.b*v.s/10000)} m²`,rondaf(v.l*v.s/100*v.b*v.s/100,2))],
  fouten:v=>[[rondaf(v.l*v.b*v.s/100,2),'Je vergrootte de oppervlakte maar één keer met de schaal. Reken eerst lengte en breedte om.'],[rondaf(v.l*v.b,2),'Dat is de oppervlakte op papier in cm².'],[rondaf(v.l*v.b*v.s*v.s,2),'Dat zijn cm². Reken om naar m².']],
  anders:v=>`Schets de kamer en zet bij elke zijde de echte maat in meters. Daarna reken je lengte × breedte, net als bij elke rechthoek.`
});
// ---------- Verbanden ----------
L({id:'B4.formuleterug',niv:8,dom:'B',sub:'formules',naam:'Terugrekenen met een formule',verwar:['B3.formule'],rm:true,
  uitleg:'Weet je de uitkomst en zoek je het getal dat erin ging? Werk terug: eerst het vaste bedrag eraf, dan delen door het getal dat ervoor staat.',
  gen(r){ const c=r.pick([['taxirit','K','a','km',[2,2.5,3],[3,4,5]],['schaatsbaan','K','u','uur',[3,4,5],[5,7.5,10]],['belbundel','K','m','minuten',[0.1,0.2,0.25],[5,7.5,10]]]); const a=r.pick(c[4]),b=r.pick(c[5]),x=c[0]==='schaatsbaan'?r.int(1,4):r.int(3,30); return {c,a,b,x,K:rondaf(a*x+b,2)} }, // niet 19 uur schaatsen
  vraag:v=>`Voor een ${v.c[0]} geldt <b>${v.c[1]} = ${nl(v.a)}${v.c[2]} + ${nl(v.b)}</b> (${v.c[1]} in euro, ${v.c[2]} in ${v.c[3]}). Iemand betaalt ${eur(v.K)}. Hoeveel ${v.c[3]} was dat?`,
  antw:v=>v.x, eenheid:v=>v.c[3],
  stappen:v=>[st(`${nl(v.a)}${v.c[2]} + ${nl(v.b)} = ${nl(v.K)}`),st(`Vaste bedrag eraf: ${nl(v.K)} − ${nl(v.b)} = ${nl(v.K-v.b)}`,rondaf(v.K-v.b,2)),st(`Delen: ${nl(v.K-v.b)} : ${nl(v.a)} = ${v.x}`,v.x)],
  fouten:v=>[[rondaf(v.K/v.a,2),'Haal eerst het vaste bedrag eraf, daarna pas delen.'],[rondaf(v.K/v.a-v.b,2),'Eerst het vaste bedrag eraf, dan delen. De volgorde is andersom dan bij invullen.'],[rondaf((v.K+v.b)/v.a,2),'Het vaste bedrag moet eraf, niet erbij.']],
  anders:v=>({tekst:'Gebruik een terugrekenschema: wat bij invullen het laatst gebeurt, draai je het eerst om.',tabel:{kop:['Stap','Vooruit','Terug'],rijen:[['1',`× ${nl(v.a)}`,`− ${nl(v.b)}`],['2',`+ ${nl(v.b)}`,`: ${nl(v.a)}`]]}})
});
L({id:'B4.afstandtijd',niv:8,dom:'B',sub:'grafieken',naam:'Afstand-tijdgrafiek lezen',
  uitleg:'In een afstand-tijdgrafiek betekent een horizontaal stuk: stilstaan. Een steil stuk: snel gaan. Lees begin en eind van een stuk af en reken het verschil uit.',
  gen(r){ const s1=r.pick([10,12,15,20]),st1=r.pick([1,2]),p=r.int(1,2),s2=r.pick([10,15,20]); const pts=[[0,0]]; let t=0,d=0; for(let i=0;i<st1;i++){t++;d+=s1;pts.push([t,d])} for(let i=0;i<p;i++){t+=0.5;pts.push([t,d])} for(let i=0;i<2;i++){t++;d+=s2;pts.push([t,d])} return {pts,wat:r.pick(['pauze','afstand','laatste']),s2,st1,p} },
  vraag:v=>v.wat==='pauze'?`De grafiek laat een fietstocht zien. Hoeveel minuten pauze werd er gehouden?`:v.wat==='afstand'?`De grafiek laat een fietstocht zien. Hoeveel km werd er in totaal gefietst?`:`De grafiek laat een fietstocht zien. Hoeveel km werd er na de pauze gefietst?`,
  fig:v=>FIG.grafiek([{punten:v.pts}],{xmax:Math.ceil(v.pts[v.pts.length-1][0]),xs:0.5,ymax:Math.ceil((v.pts[v.pts.length-1][1]+5)/10)*10,ys:10,xl:'tijd (uur)',yl:'afstand (km)'}),
  antw:v=>v.wat==='pauze'?v.p*30:v.wat==='afstand'?v.pts[v.pts.length-1][1]:2*v.s2, eenheid:v=>v.wat==='pauze'?'min':'km',
  stappen:v=>v.wat==='pauze'?[st('Pauze = het horizontale stuk.'),st(`Van ${nl(v.st1)} tot ${nl(v.st1+v.p*0.5)} uur: ${v.p*30} minuten`,v.p*30)]:v.wat==='afstand'?[st('Kijk naar het laatste punt van de grafiek.'),st(`${v.pts[v.pts.length-1][1]} km`,v.pts[v.pts.length-1][1])]:[st(`Na de pauze: van ${v.pts[v.pts.length-1][1]-2*v.s2} km naar ${v.pts[v.pts.length-1][1]} km`),st(`${2*v.s2} km`,2*v.s2)],
  fouten:v=>v.wat==='pauze'?[[v.p*0.5,'Dat is in uren. De vraag is in minuten.'],[v.p*50,'Een half uur is 30 minuten.'],[v.p*60,'Elk hokje is een half uur.']]:v.wat==='afstand'?[[v.pts[v.pts.length-1][0],'Dat is de tijd, niet de afstand.'],[v.pts[v.pts.length-1][1]-2*v.s2,'Dat is de afstand tot de pauze.']]:[[v.pts[v.pts.length-1][1],'Dat is de totale afstand. Haal de afstand vóór de pauze eraf.'],[v.s2,'Dat is maar één uur fietsen.']],
  anders:v=>`Wijs eerst het horizontale stuk aan: daar verandert de afstand niet, dus daar stond de fietser stil. Lees bij elk knikpunt de tijd (onder) en de afstand (links) af.`
});
L({id:'B4.frequentie',niv:8,dom:'B',sub:'statistiek',naam:'Gemiddelde uit een frequentietabel',rm:true,dec:1,
  uitleg:'In een frequentietabel staat hoe vaak elke waarde voorkomt. Gemiddelde = (waarde × aantal, opgeteld) : totaal aantal.',
  gen(r){ let w,f,tot,s; do{ w=[4,5,6,7,8,9]; f=w.map(()=>r.int(0,7)); tot=f.reduce((a,b)=>a+b,0); s=w.reduce((a,x,i)=>a+x*f[i],0) }while(tot<12||Math.round(s/tot*10)!==s/tot*10&&Math.abs(s/tot*10-Math.round(s/tot*10))>1e-9); return {w,f,tot,s} },
  vraag:v=>`In de tabel zie je de cijfers voor een proefwerk in een klas.<div class="vtabel">${vtabelHtml(['Cijfer','Aantal leerlingen'],v.w.map((x,k)=>[x,v.f[k]]))}</div>Wat is het gemiddelde cijfer?`,
  antw:v=>rondaf(v.s/v.tot,1),
  stappen:v=>[st(`Cijfer × aantal: ${v.w.map((x,i)=>`${x}×${v.f[i]}`).join(' + ')} = ${v.s}`,v.s),st(`Aantal leerlingen: ${v.tot}`,v.tot),st(`${v.s} : ${v.tot} = ${nl(v.s/v.tot)}`,rondaf(v.s/v.tot,1))],
  fouten:v=>[[rondaf(v.w.reduce((a,b)=>a+b,0)/v.w.length,1),'Je nam het gemiddelde van de cijfers 4 t/m 9, zonder te kijken hoe vaak ze voorkomen.'],[rondaf(v.s/v.w.length,1),'Deel door het aantal leerlingen, niet door het aantal verschillende cijfers.'],[v.s,'Deel nog door het aantal leerlingen.']],
  anders:v=>`Stel je voor dat alle ${v.tot} cijfers los op een rij staan: ${v.w.map((x,i)=>Array(v.f[i]).fill(x).join(', ')).filter(x=>x).join(', ')}. Tel ze op en deel door ${v.tot}.`
});
// grafiekvorm koppelen aan verhaal
const VORMEN={stijgt:'M10 90 L110 10',daalt:'M10 10 L110 90',sneller:'M10 90 Q90 88 110 10',langzamer:'M10 10 Q20 85 110 88',stoppen:'M10 90 L45 50 L75 50 L110 10',bergop:'M10 90 L60 15 L110 90'};
const mini=d=>`<svg viewBox="0 0 120 100" class="mini"><path d="M10 5 V95 H115" fill="none" stroke="currentColor" stroke-width="2"/><path d="${d}" fill="none" stroke="var(--knop)" stroke-width="4" stroke-linecap="round"/></svg>`;
L({id:'B4.grafiekverhaal',niv:8,dom:'B',sub:'grafieken',naam:'Grafiek bij een verhaal kiezen',
  uitleg:'Kijk naar de vorm: stijgt de grafiek, daalt hij, of loopt hij horizontaal? Gaat het steeds sneller (steiler) of steeds langzamer (vlakker)?',
  gen(r){ return {} },
  koppel:(v,r)=>{ const v4=r.shuffle([['De temperatuur van een kop thee die afkoelt',VORMEN.langzamer],['Je spaargeld als je elke week hetzelfde bedrag erbij doet',VORMEN.stijgt],['Het aantal views van een filmpje dat viraal gaat',VORMEN.sneller],['Een kaars die gelijkmatig opbrandt (lengte)',VORMEN.daalt],['Afstand bij fietsen naar school met een rood stoplicht onderweg',VORMEN.stoppen],['De hoogte van een bal die je omhoog gooit',VORMEN.bergop]]).slice(0,4); return {vraag:'Koppel elk verhaal aan de grafiek die erbij past. (Horizontaal: de tijd.)',paren:v4.map(x=>[x[0],mini(x[1])])} },
  anders:v=>`Lees elk verhaal en vraag jezelf af: wordt het meer of minder? Gaat het steeds sneller (de lijn wordt steiler) of steeds langzamer (de lijn wordt vlakker)? Staat het even stil (horizontaal)?`
});
