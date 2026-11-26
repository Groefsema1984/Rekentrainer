// ===== Niveau 1 · 1F · ongeveer groep 7 =====
// ---------- Getallen ----------
L({id:'G1.afronden',niv:1,dom:'G',sub:'getalbegrip',naam:'Afronden op tientallen, honderdtallen en duizendtallen',
  uitleg:'Kijk naar het cijfer rechts van de plek waarop je afrondt. Is dat 5 of meer, dan rond je naar boven af. Is het 4 of minder, dan naar beneden.',
  gen(r){ const op=r.pick([10,100,1000]); let x; do{ x=r.int(1200,98000) }while(x%op===0||Math.floor(x/(op/10))%10===0&&op>10&&r.ja(.5)); return {x,op,ctx:r.pick([['Bij een concert waren','bezoekers'],['Een filmpje op social media heeft','views'],['Een stadion heeft','stoelen'],['Bij de marathon liepen','lopers mee'],['Een game heeft al','downloads']])} },
  vraag:v=>`${v.ctx[0]} ${nl(v.x)} ${v.ctx[1]}. Rond dit getal af op ${({10:'tientallen',100:'honderdtallen',1000:'duizendtallen'})[v.op]}.`,
  antw:v=>Math.round(v.x/v.op)*v.op,
  stappen:v=>{ const d=Math.floor(v.x/(v.op/10))%10; return [st(`Het cijfer rechts van de ${({10:'tientallen',100:'honderdtallen',1000:'duizendtallen'})[v.op]} is ${d}.`,d),st(d>=5?`${d} is 5 of meer, dus naar boven afronden.`:`${d} is minder dan 5, dus naar beneden afronden.`),st(`Afgerond: ${nl(Math.round(v.x/v.op)*v.op)}`,Math.round(v.x/v.op)*v.op)] },
  fouten:v=>[[Math.floor(v.x/v.op)*v.op,'Je hebt de cijfers alleen weggestreept. Kijk naar het cijfer erachter: bij 5 of meer rond je naar boven af.'],[Math.ceil(v.x/v.op)*v.op,'Bij een cijfer onder de 5 rond je naar beneden af.'],[Math.round(v.x/(v.op===1000?100:v.op*10))*(v.op===1000?100:v.op*10),'Let op op welke plek je moet afronden.']],
  anders:v=>({tekst:`Zet het getal op een getallenlijn tussen de twee mogelijke uitkomsten. Welke ligt het dichtst bij?`,svg:FIG.lijn(Math.floor(v.x/v.op)*v.op,Math.floor(v.x/v.op)*v.op+v.op,v.op/10,[{x:v.x,label:nl(v.x)}],5)}),
  waarom:{vraag:'Waarom kijk je naar het cijfer rechts van de plek waarop je afrondt?',opties:['Dat cijfer bepaalt of je dichter bij het hogere of het lagere getal zit.','Omdat je altijd het laatste cijfer weghaalt.','Omdat je daar 1 bij moet optellen.']}
});
L({id:'G1.nullen',niv:1,dom:'G',sub:'bewerkingen',naam:'Vermenigvuldigen met nullen',verwar:['G1.cijferen'],
  uitleg:'Reken eerst zonder de nullen. Tel daarna alle nullen van beide getallen bij elkaar en zet ze achter je uitkomst.',
  gen(r){ const a=r.int(2,9),b=r.int(2,9),i=r.int(1,2),j=r.int(1,3-i); return {a,b,i,j,A:a*10**i,B:b*10**j,c:r.pick([['Een stadion heeft','vakken met elk','stoelen. Hoeveel stoelen zijn er in totaal?'],['Een school bestelt','dozen met elk','schriften. Hoeveel schriften zijn dat?'],['Op een festival staan','rijen met elk','fietsen. Hoeveel fietsen staan er?']])} },
  vraag:v=>`${v.c[0]} ${nl(v.A)} ${v.c[1]} ${nl(v.B)} ${v.c[2]}`,
  antw:v=>v.A*v.B,
  stappen:v=>[st(`Zonder nullen: ${v.a} × ${v.b} = ${v.a*v.b}`,v.a*v.b),st(`Aantal nullen: ${v.i} + ${v.j} = ${v.i+v.j}`,v.i+v.j),st(`${v.a*v.b} met ${v.i+v.j} nullen erachter: ${nl(v.A*v.B)}`,v.A*v.B)],
  fouten:v=>[[v.a*v.b*10**(v.i+v.j-1),'Je bent een nul vergeten. Tel de nullen van beide getallen.'],[v.a*v.b*10**(v.i+v.j+1),'Je hebt een nul te veel. Tel nog eens hoeveel nullen er in beide getallen staan.'],[v.A+v.B,'Je hebt opgeteld in plaats van vermenigvuldigd.']],
  anders:v=>`Splits de getallen: ${nl(v.A)} = ${v.a} × ${nl(10**v.i)} en ${nl(v.B)} = ${v.b} × ${nl(10**v.j)}. Dan is het ${v.a} × ${v.b} × ${nl(10**v.i)} × ${nl(10**v.j)} = ${v.a*v.b} × ${nl(10**(v.i+v.j))}.`,
  waarom:{vraag:'Waarom mag je de nullen eerst weglaten?',opties:['Omdat elke nul "keer 10" betekent; die zet je er aan het eind weer bij.','Omdat nullen niets waard zijn.','Omdat je met nullen altijd 0 krijgt.']},
  volgorde:true
});
function kolomfout(a,b){ const s=String(a),t=String(b).padStart(s.length,'0'); let o=''; for(let i=0;i<s.length;i++) o+=Math.abs(+s[i]-+t[i]); return +o }
L({id:'G1.cijferen',niv:1,dom:'G',sub:'bewerkingen',naam:'Aftrekken met lenen',verwar:['G1.nullen'],
  uitleg:'Bij aftrekken met lenen: kan het niet in een kolom, leen dan 1 van de kolom links ervan (10 erbij). Je kunt ook rijgen: eerst de honderdtallen eraf, dan de tientallen, dan de eenheden.',
  gen(r){ let a,c; do{ a=r.int(121,480); c=r.int(36,98) }while(a%10>=c%10||a-c<20); const [p]=prodPrijs(r); return {a,c,p,n:r.naam()} },
  vraag:v=>`${v.n} heeft € ${v.a} gespaard en koopt een ${v.p} van € ${v.c}. Hoeveel euro houdt ${v.n} over?`,
  antw:v=>v.a-v.c, eenheid:'€',
  stappen:v=>{ const t=Math.floor(v.c/10)*10,e=v.c%10; return [st(`${v.a} − ${t} = ${v.a-t}`,v.a-t),st(`${v.a-t} − ${e} = ${v.a-v.c}`,v.a-v.c),st(`Controle: ${v.a-v.c} + ${v.c} = ${v.a}`)] },
  fouten:v=>[[kolomfout(v.a,v.c),'Je hebt per kolom het kleinste van het grootste afgetrokken. Bij aftrekken moet je dan lenen.'],[v.a+v.c,'Je hebt opgeteld. Na het kopen heb je minder over.'],[v.a-v.c+10,'Bij lenen ben je vergeten dat de tientallen 1 minder worden.']],
  anders:v=>({tekst:`Spring op de getallenlijn terug: eerst ${Math.floor(v.c/10)*10} terug, daarna nog ${v.c%10}.`,svg:FIG.lijn(Math.floor((v.a-v.c)/10)*10,Math.ceil(v.a/10)*10,10,[{x:v.a,label:String(v.a)},{x:v.a-Math.floor(v.c/10)*10,label:String(v.a-Math.floor(v.c/10)*10),k:'b'},{x:v.a-v.c,label:String(v.a-v.c)}])}),
  sab:v=>{ const t=Math.floor(v.c/10)*10,e=v.c%10,kf=kolomfout(v.a,v.c); return {intro:`${v.n} heeft € ${v.a} en koopt iets van € ${v.c}. Ravi rekent onder elkaar uit wat er overblijft.`,
    stappen:[`Eenheden: ${v.a%10} − ${e} kan niet, dus ${e} − ${v.a%10} = ${e-v.a%10}.`,`Tientallen: ${Math.floor(v.a/10)%10} en ${Math.floor(v.c/10)%10} → verschil ${Math.abs(Math.floor(v.a/10)%10-Math.floor(v.c/10)%10)}.`,`Honderdtallen: ${Math.floor(v.a/100)} blijft ${Math.floor(v.a/100)}.`,`Antwoord: € ${kf}.`],
    fout:0,juist:v.a-v.c,eenheid:'€',vraag:'Hoeveel houdt ' + v.n + ' echt over?',uitleg:`Ravi draait de som om bij de eenheden. Je mag niet ${e} − ${v.a%10} doen: je moet lenen.`,
    goed:[`${v.a} − ${t} = ${v.a-t}`,`${v.a-t} − ${e} = ${v.a-v.c}`]} }
});
L({id:'G1.breukvan',niv:1,dom:'G',sub:'breuken',naam:'Breuk van een hoeveelheid',verwar:['V1.procent'],
  uitleg:'Een breuk van een hoeveelheid: deel eerst door de noemer (onder de streep), dan heb je 1 deel. Vermenigvuldig daarna met de teller (boven de streep).',
  gen(r){ const n=r.pick([3,4,5,6,8,10]),t=r.int(2,n-1),k=r.int(2,9); const c=r.pick([['Van de','leerlingen in de klas sport','deel bij een club. Hoeveel leerlingen zijn dat?'],['Een zak bevat','snoepjes. Je eet','deel op. Hoeveel snoepjes zijn dat?'],['Een playlist duurt','minuten. Je hebt','deel geluisterd. Hoeveel minuten is dat?']]); return {n,t,k,tot:n*k,c} },
  vraag:v=>`${v.c[0]} ${v.tot} ${v.c[1]} ${breuk(v.t,v.n)} ${v.c[2]}`,
  fig:v=>FIG.strook(0,v.n,`${v.tot} verdeeld in ${v.n} gelijke stukken`),
  antw:v=>v.k*v.t,
  stappen:v=>[st(`${v.tot} : ${v.n} = ${v.k} (dat is 1 deel)`,v.k),st(`${v.t} delen: ${v.t} × ${v.k} = ${v.t*v.k}`,v.t*v.k)],
  fouten:v=>[[v.k,`Je hebt 1 deel uitgerekend (${breuk(1,v.n)}). Het zijn er ${v.t}.`],[v.tot%v.t===0?v.tot/v.t*v.n:v.tot-v.t,'Je deelt door de teller. Deel eerst door de noemer: zo groot is 1 deel.'],[v.tot-v.t,'Je hebt de teller afgetrokken. Een breuk is een deel van het geheel.']],
  anders:v=>({tekst:`Teken een strook van ${v.tot} en verdeel hem in ${v.n} gelijke stukken van ${v.k}. Kleur er ${v.t}.`,svg:FIG.strook(v.t,v.n,`${v.t} van de ${v.n} stukken = ${v.t} × ${v.k} = ${v.t*v.k}`)}),
  waarom:{vraag:'Waarom deel je eerst door de noemer?',opties:['De noemer zegt in hoeveel gelijke delen je het geheel verdeelt.','De noemer is altijd het grootste getal.','Omdat je bij breuken altijd eerst deelt door het onderste getal en daarna optelt.']},
  sab:v=>({intro:`Van ${v.tot} snoepjes is ${breuk(v.t,v.n)} rood. Lisa rekent uit hoeveel rode snoepjes er zijn.`,
    stappen:[`${breuk(v.t,v.n)} betekent: ${v.t} van de ${v.n} gelijke delen.`,`Eén deel: ${v.tot} : ${v.t} = ${nl(v.tot/v.t,2)}`,`${v.t} delen: ${v.t} × ${nl(v.tot/v.t,2)} = ${nl(v.tot,2)}`,`Antwoord: ${v.tot} rode snoepjes.`],
    fout:1,juist:v.k*v.t,eenheid:'',vraag:'Hoeveel rode snoepjes zijn er echt?',uitleg:`Eén deel krijg je door te delen door de noemer (${v.n}), niet door de teller. Dan klopt het antwoord ook: het moet minder zijn dan het geheel.`,
    goed:[`1 deel: ${v.tot} : ${v.n} = ${v.k}`,`${v.t} delen: ${v.t} × ${v.k} = ${v.t*v.k}`]})
});
// ---------- Verhoudingen ----------
L({id:'V1.vtabel',niv:1,dom:'V',sub:'vtabel',naam:'Verhoudingstabel: prijs per aantal',verwar:['V1.verdelen'],
  uitleg:'In een verhoudingstabel doe je boven en onder hetzelfde. Handig is om eerst terug te rekenen naar 1 stuk.',
  gen(r){ const a=r.pick([2,3,4,5]),p=r.int(3,12); let b; do{ b=r.pick([6,7,8,9,10,12,15]) }while(b===a); const d=r.pick([['bioscoopkaartjes','kaartjes'],['tickets voor het zwembad','tickets'],['pizza\'s','pizza\'s'],['T-shirts voor het sportteam','T-shirts']]); return {a,p,b,d} },
  vraag:v=>`${v.a} ${v.d[0]} kosten samen ${eur(v.a*v.p)}. Hoeveel kosten ${v.b} ${v.d[1]}?`,
  antw:v=>v.b*v.p, eenheid:'€',
  stappen:v=>[st(`${v.a} ${v.d[1]} kosten € ${v.a*v.p}`,v.a*v.p),st(`1 stuk: ${v.a*v.p} : ${v.a} = € ${v.p}`,v.p),st(`${v.b} stuks: ${v.b} × ${v.p} = € ${v.b*v.p}`,v.b*v.p)],
  tabel:v=>({kop:['Aantal','Prijs (€)'],rijen:[[v.a,v.a*v.p],[1,v.p],[v.b,v.b*v.p]],leeg:[[1,1],[2,1]]}),
  fouten:v=>[[v.a*v.p+(v.b-v.a),'Je telde het verschil in aantal op bij de prijs. In een verhoudingstabel vermenigvuldig of deel je.'],[v.a*v.p*v.b,'Je vermenigvuldigde de totaalprijs met het aantal. Reken eerst uit wat 1 stuk kost.'],[v.p,'Dat is de prijs van 1 stuk.']],
  anders:v=>({tekst:'Zet het in een verhoudingstabel. Ga via 1 stuk naar het aantal dat je zoekt.',tabel:{kop:['Aantal','Prijs (€)'],rijen:[[v.a,v.a*v.p],[1,v.p],[v.b,v.b*v.p]]}}),
  waarom:{vraag:'Waarom reken je eerst uit wat 1 stuk kost?',opties:['Vanuit 1 stuk kun je makkelijk naar elk ander aantal.','Omdat 1 altijd het goedkoopst is.','Omdat je dan het antwoord al hebt.']}
});
L({id:'V1.procent',niv:1,dom:'V',sub:'procent',naam:'Makkelijke procenten: 50%, 25% en 10%',verwar:['G1.breukvan'],
  uitleg:'50% is de helft, 25% is een kwart en 10% is een tiende. Deel dus door 2, door 4 of door 10.',
  gen(r){ const p=r.pick([10,25,50]); const [d,pr]=prodPrijs(r); let x=pr; if(p===25&&x%4) x=x-x%4+4; return {p,d,x,vraagNaar:r.pick(['korting','nieuw'])} },
  vraag:v=>v.vraagNaar==='korting'?`Een ${v.d} kost ${eur(v.x)}. In de sale krijg je ${v.p}% korting. Hoeveel euro korting krijg je?`:`Een ${v.d} kost ${eur(v.x)}. In de sale krijg je ${v.p}% korting. Wat betaal je nog?`,
  antw:v=>v.vraagNaar==='korting'?v.x*v.p/100:v.x-v.x*v.p/100, eenheid:'€',
  stappen:v=>{ const del=100/v.p, k=v.x/del; const s=[st(`${v.p}% = 1/${del} deel, dus ${v.x} : ${del} = € ${nl(k)}`,k)]; if(v.vraagNaar==='nieuw') s.push(st(`Nieuwe prijs: ${v.x} − ${nl(k)} = € ${nl(v.x-k)}`,v.x-k)); return s },
  fouten:v=>{ const k=v.x*v.p/100; return [[v.p,'Procent is geen bedrag in euro. Reken uit hoeveel '+v.p+'% van de prijs is.'],[v.vraagNaar==='korting'?v.x-k:k,v.vraagNaar==='korting'?'Dat is de nieuwe prijs. De vraag is hoeveel korting je krijgt.':'Dat is de korting. De vraag is wat je nog betaalt.'],[v.x-v.p,'Je trok '+v.p+' euro af. Procent is een deel van de prijs.']] },
  anders:v=>({tekst:`Teken de prijs als een balk van 100%. ${v.p}% is ${({10:'een tiende',25:'een kwart',50:'de helft'})[v.p]} van de balk.`,svg:FIG.balk([{w:v.p,label:`${v.p}% = ${eur(v.x*v.p/100)}`,k:'a'},{w:100-v.p,label:`${100-v.p}%`,k:'zacht'}],`100% = ${eur(v.x)}`)})
});
L({id:'V1.verdelen',niv:1,dom:'V',sub:'vtabel',naam:'Eerlijk verdelen in een verhouding',verwar:['V1.vtabel'],
  uitleg:'Bij verdelen in een verhouding tel je eerst de delen bij elkaar op. Dan weet je hoe groot 1 deel is.',
  gen(r){ let a,b; do{ a=r.int(1,4); b=r.int(1,5) }while(a===b||ggd(a,b)>1); const k=r.pick([5,6,8,10,12,15,20]); const [n1,n2]=r.naam2(); return {a,b,k,n1,n2,tot:(a+b)*k,c:r.pick(['met auto\'s wassen','met oppassen','met de flessenactie','met een kraam op de vrijmarkt'])} },
  vraag:v=>`${v.n1} en ${v.n2} verdienen samen ${eur(v.tot)} ${v.c}. ${v.n1} werkte ${v.a} uur en ${v.n2} ${v.b} uur. Ze verdelen het geld in de verhouding ${v.a} : ${v.b}. Hoeveel krijgt ${v.n2}?`,
  antw:v=>v.b*v.k, eenheid:'€',
  stappen:v=>[st(`Samen ${v.a} + ${v.b} = ${v.a+v.b} delen`,v.a+v.b),st(`1 deel = ${v.tot} : ${v.a+v.b} = € ${v.k}`,v.k),st(`${v.n2}: ${v.b} × ${v.k} = € ${v.b*v.k}`,v.b*v.k)],
  fouten:v=>[[v.tot/2,'Eerlijk delen betekent hier niet: allebei de helft. Wie langer werkt, krijgt meer.'],[v.a*v.k,`Dat is het deel van ${v.n1}.`],[v.k,'Dat is 1 deel. '+v.n2+' krijgt er '+v.b+'.']],
  anders:v=>({tekst:`Teken een strook met ${v.a+v.b} gelijke vakjes: ${v.a} voor ${v.n1} en ${v.b} voor ${v.n2}. Elk vakje is ${eur(v.k)}.`,svg:FIG.balk(Array.from({length:v.a+v.b},(_,i)=>({w:1,label:'€'+v.k,k:i<v.a?'a':'b'})),`${eur(v.tot)}`)})
});
// ---------- Meten en meetkunde ----------
const EENH1=[['km','m',1000,'Een wandelroute is','lang'],['m','cm',100,'Een springtouw is','lang'],['cm','mm',10,'Een gum is','lang'],['kg','g',1000,'Een zak meel weegt',''],['l','ml',1000,'Een fles water bevat','']];
L({id:'M1.eenheden',niv:1,dom:'M',sub:'eenheden',naam:'Lengte, gewicht en inhoud omrekenen',
  uitleg:'Van een grote naar een kleine eenheid: het getal wordt groter (vermenigvuldigen). Van klein naar groot: het getal wordt kleiner (delen). 1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1000 g, 1 l = 1000 ml.',
  gen(r){ const e=r.pick(EENH1); const naarKlein=r.ja(.6); const x=naarKlein?r.int(2,9):r.int(2,9)*e[2]; return {e,naarKlein,x} },
  vraag:v=>v.naarKlein?`${v.e[3]} ${v.x} ${v.e[0]} ${v.e[4]}. Hoeveel ${v.e[1]} is dat?`:`${v.e[3]} ${nl(v.x)} ${v.e[1]} ${v.e[4]}. Hoeveel ${v.e[0]} is dat?`,
  antw:v=>v.naarKlein?v.x*v.e[2]:v.x/v.e[2], eenheid:v=>v.naarKlein?v.e[1]:v.e[0],
  stappen:v=>[st(`1 ${v.e[0]} = ${nl(v.e[2])} ${v.e[1]}`,v.e[2]),st(v.naarKlein?`Naar een kleinere eenheid: keer ${nl(v.e[2])}`:`Naar een grotere eenheid: delen door ${nl(v.e[2])}`),st(v.naarKlein?`${v.x} × ${nl(v.e[2])} = ${nl(v.x*v.e[2])}`:`${nl(v.x)} : ${nl(v.e[2])} = ${nl(v.x/v.e[2])}`,v.naarKlein?v.x*v.e[2]:v.x/v.e[2])],
  fouten:v=>v.naarKlein?[[v.x*v.e[2]/10,'Kijk nog eens hoeveel '+v.e[1]+' er in 1 '+v.e[0]+' gaan.'],[v.x*v.e[2]*10,'Kijk nog eens hoeveel '+v.e[1]+' er in 1 '+v.e[0]+' gaan.'],[v.x/v.e[2],'Je deelde, maar naar een kleinere eenheid wordt het getal groter.']]:[[v.x*v.e[2],'Naar een grotere eenheid wordt het getal kleiner: delen.'],[v.x/v.e[2]*10,'Kijk nog eens hoeveel '+v.e[1]+' er in 1 '+v.e[0]+' gaan.'],[v.x/v.e[2]/10,'Kijk nog eens hoeveel '+v.e[1]+' er in 1 '+v.e[0]+' gaan.']],
  anders:v=>`Denk aan iets wat je kent: een liniaal van 30 cm is 300 mm. Een klein eenheidje past er vaak in een groot eenheidje. Daarom wordt het getal groter als je naar de kleine eenheid gaat.`,
  koppel:(v,r)=>({vraag:'Koppel de maten die even groot zijn.',paren:r.shuffle([['1 km','1000 m'],['1 m','100 cm'],['1 cm','10 mm'],['1 kg','1000 g'],['1 l','1000 ml'],['½ km','500 m'],['1 dm','10 cm']]).slice(0,4)})
});
L({id:'M1.tijd',niv:1,dom:'M',sub:'tijd',naam:'Tijdsduur berekenen',
  uitleg:'Een uur heeft 60 minuten, niet 100. Reken een tijdsduur uit door in stappen naar hele uren te springen.',
  gen(r){ const s=r.int(8,19)*60+r.pick([15,20,25,35,40,45,50]); const d=r.int(50,170); return {s,e:s+d,d,c:r.pick(['De film begint om','De training begint om','De bus vertrekt om','Het concert begint om','De wedstrijd begint om']),c2:r.pick(['is afgelopen om','is klaar om','komt aan om','eindigt om'])} },
  vraag:v=>`${v.c} ${tijdStr(v.s)} en ${v.c2} ${tijdStr(v.e)}. Hoeveel minuten duurt het?`,
  antw:v=>v.d, eenheid:'min',
  stappen:v=>{ const h1=Math.ceil(v.s/60)*60, a=h1-v.s, b=Math.floor(v.e/60)*60-h1, c=v.e-Math.floor(v.e/60)*60; return [st(`Van ${tijdStr(v.s)} naar ${tijdStr(h1)}: ${a} minuten`,a),st(`Van ${tijdStr(h1)} naar ${tijdStr(Math.floor(v.e/60)*60)}: ${b} minuten`,b),st(`Van ${tijdStr(Math.floor(v.e/60)*60)} naar ${tijdStr(v.e)}: ${c} minuten`,c),st(`Samen: ${a} + ${b} + ${c} = ${v.d} minuten`,v.d)] },
  fouten:v=>{ const dec=(Math.floor(v.e/60)*100+v.e%60)-(Math.floor(v.s/60)*100+v.s%60); return [[dec,'Je rekende alsof een uur 100 minuten heeft. Een uur heeft 60 minuten.'],[v.d-60,'Tel de hele uren goed: elk heel uur is 60 minuten.'],[v.d+60,'Tel de hele uren goed: elk heel uur is 60 minuten.']] },
  anders:v=>({tekst:'Spring op de tijdlijn naar het volgende hele uur, dan per uur, dan het laatste stukje.',svg:FIG.lijn(Math.floor(v.s/60)*60,Math.ceil(v.e/60)*60,15,[{x:v.s,label:tijdStr(v.s)},{x:v.e,label:tijdStr(v.e)}],100)}),
  volgorde:true
});
L({id:'M1.rechthoek',niv:1,dom:'M',sub:'oppervlak',naam:'Omtrek en oppervlakte van een rechthoek',
  uitleg:'Omtrek: de lengte van de rand, dus alle zijden bij elkaar (in m). Oppervlakte: hoeveel vierkantjes erin passen, lengte × breedte (in m²).',
  gen(r){ const l=r.int(5,20),b=r.int(3,l-1); return {l,b,wat:r.pick(['omtrek','opp']),c:r.pick(['Een schoolplein','Een moestuin','Een speelveld','Een terras','Een zwembad'])} },
  vraag:v=>`${v.c} is een rechthoek van ${v.l} m lang en ${v.b} m breed. ${v.wat==='omtrek'?'Er komt een hek omheen. Hoe lang is de omtrek?':'Hoe groot is de oppervlakte?'} Kies ook de goede eenheid.`,
  fig:v=>FIG.rechthoek(v.l,v.b,v.l+' m',v.b+' m'),
  antw:v=>v.wat==='omtrek'?2*(v.l+v.b):v.l*v.b, eenheid:v=>v.wat==='omtrek'?'m':m2, eenheden:['m',m2,m3],
  stappen:v=>v.wat==='omtrek'?[st(`Twee lange zijden: 2 × ${v.l} = ${2*v.l}`,2*v.l),st(`Twee korte zijden: 2 × ${v.b} = ${2*v.b}`,2*v.b),st(`Omtrek: ${2*v.l} + ${2*v.b} = ${2*(v.l+v.b)} m`,2*(v.l+v.b))]:[st(`Oppervlakte = lengte × breedte`),st(`${v.l} × ${v.b} = ${v.l*v.b} m²`,v.l*v.b)],
  fouten:v=>v.wat==='omtrek'?[[v.l*v.b,'Dat is de oppervlakte. De omtrek is de rand eromheen.'],[v.l+v.b,'Je telde maar twee zijden. Een rechthoek heeft er vier.'],[2*v.l+v.b,'Je bent een zijde vergeten.']]:[[2*(v.l+v.b),'Dat is de omtrek. De oppervlakte is lengte × breedte.'],[v.l+v.b,'Bij oppervlakte vermenigvuldig je.'],[v.l*v.b*2,'Oppervlakte is lengte × breedte, niet keer 2.']],
  anders:v=>v.wat==='omtrek'?`Loop in gedachten om ${v.c.toLowerCase()} heen: ${v.l} + ${v.b} + ${v.l} + ${v.b} meter. Dat is de omtrek.`:`Stel je voor dat je tegels van 1 bij 1 meter legt: ${v.l} tegels in een rij, en ${v.b} rijen. Dat zijn ${v.l} × ${v.b} tegels.`
});
// ---------- Verbanden ----------
const MAANDEN=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
L({id:'B1.tabel',niv:1,dom:'B',sub:'tabellen',naam:'Informatie uit een tabel halen',
  uitleg:'Lees eerst de kop van de tabel: wat staat er in de rijen en de kolommen? Zoek dan de getallen die je nodig hebt.',
  gen(r){ const st0=r.int(0,6); const m=MAANDEN.slice(st0,st0+5); const w=m.map(()=>r.int(3,15)*5); const n=r.naam(); const wat=r.pick(['verschil','totaal']); let i=r.int(0,4),j; do{j=r.int(0,4)}while(j===i||w[j]===w[i]); return {m,w,n,wat,i,j} },
  vraag:v=>`${v.n} houdt bij hoeveel euro er per maand op de spaarrekening komt.<div class="vtabel">${vtabelHtml(['Maand','Gespaard (€)'],v.m.map((x,k)=>[x,v.w[k]]))}</div>${v.wat==='verschil'?`Hoeveel euro spaarde ${v.n} in ${v.m[v.i]} meer of minder dan in ${v.m[v.j]}? (Geef het verschil.)`:`Hoeveel euro spaarde ${v.n} in deze vijf maanden samen?`}`,
  antw:v=>v.wat==='verschil'?Math.abs(v.w[v.i]-v.w[v.j]):v.w.reduce((a,b)=>a+b,0), eenheid:'€',
  stappen:v=>v.wat==='verschil'?[st(`${v.m[v.i]}: € ${v.w[v.i]}`,v.w[v.i]),st(`${v.m[v.j]}: € ${v.w[v.j]}`,v.w[v.j]),st(`Verschil: ${Math.max(v.w[v.i],v.w[v.j])} − ${Math.min(v.w[v.i],v.w[v.j])} = ${Math.abs(v.w[v.i]-v.w[v.j])}`,Math.abs(v.w[v.i]-v.w[v.j]))]:[st(`${v.w.join(' + ')}`),st(`= ${v.w.reduce((a,b)=>a+b,0)}`,v.w.reduce((a,b)=>a+b,0))],
  fouten:v=>v.wat==='verschil'?[[v.w[v.i]+v.w[v.j],'Je telde op. Het verschil krijg je door af te trekken.'],[v.w[v.i],'Dat is alleen het bedrag van '+v.m[v.i]+'.']]:[[v.w.reduce((a,b)=>a+b,0)-v.w[4],'Je bent een maand vergeten.'],[v.w.reduce((a,b)=>a+b,0)-v.w[0],'Je bent een maand vergeten.']],
  anders:v=>`Wijs met je vinger in de tabel: zoek eerst de kolom van de maand, lees dan het bedrag eronder. Schrijf de getallen die je nodig hebt op kladpapier voordat je gaat rekenen.`
});
const SPORTEN=['voetbal','hockey','turnen','tennis','dansen','zwemmen','basketbal'];
L({id:'B1.staaf',niv:1,dom:'B',sub:'grafieken',naam:'Staafdiagram aflezen',
  uitleg:'Bij een staafdiagram lees je de hoogte van de staaf af op de verticale as. Kijk goed hoeveel één hokje waard is.',
  gen(r){ const s=r.shuffle(SPORTEN).slice(0,5); const stap=r.pick([2,5]); const w=s.map(()=>r.int(1,8)*stap); let i=r.int(0,4),j; do{j=r.int(0,4)}while(j===i||w[i]===w[j]); return {s,w,stap,i,j,wat:r.pick(['meer','totaal'])} },
  vraag:v=>v.wat==='meer'?`In het diagram zie je welke sport de leerlingen van groep 8 en de brugklas het leukst vinden. Hoeveel leerlingen kiezen ${v.s[v.i]} meer of minder dan ${v.s[v.j]}? (Geef het verschil.)`:`In het diagram zie je welke sport leerlingen het leukst vinden. Hoeveel leerlingen kiezen ${v.s[v.i]} of ${v.s[v.j]} samen?`,
  fig:v=>FIG.staaf(v.s,v.w,{ymax:Math.max(...v.w)+v.stap*2-Math.max(...v.w)%v.stap,ys:v.stap,yl:'aantal leerlingen'}),
  antw:v=>v.wat==='meer'?Math.abs(v.w[v.i]-v.w[v.j]):v.w[v.i]+v.w[v.j],
  stappen:v=>[st(`${v.s[v.i]}: ${v.w[v.i]} leerlingen`,v.w[v.i]),st(`${v.s[v.j]}: ${v.w[v.j]} leerlingen`,v.w[v.j]),st(v.wat==='meer'?`Verschil: ${Math.abs(v.w[v.i]-v.w[v.j])}`:`Samen: ${v.w[v.i]+v.w[v.j]}`,v.wat==='meer'?Math.abs(v.w[v.i]-v.w[v.j]):v.w[v.i]+v.w[v.j])],
  fouten:v=>[[v.wat==='meer'?v.w[v.i]+v.w[v.j]:Math.abs(v.w[v.i]-v.w[v.j]),v.wat==='meer'?'Je telde op, maar de vraag gaat over het verschil.':'Je trok af, maar de vraag is hoeveel samen.'],[v.w[v.i]/v.stap,'Je telde de hokjes. Eén hokje is '+v.stap+' leerlingen.'],[v.w[v.i],'Dat is alleen '+v.s[v.i]+'.']],
  anders:v=>`Leg een liniaal horizontaal tegen de bovenkant van de staaf en kijk welk getal je op de as raakt. Elk hokje is hier ${v.stap} leerlingen.`
});
L({id:'B1.patroon',niv:1,dom:'B',sub:'formules',naam:'Een regelmaat voortzetten',
  uitleg:'Bij een vaste groei per stap: begin bij de startwaarde en tel er voor elke stap hetzelfde bij. Na 8 stappen is het startwaarde + 8 × groei.',
  gen(r){ const s=r.int(5,30),g=r.int(2,9),w=r.int(6,15); return {s,g,w,c:r.pick([['Een zonnebloem is','cm en groeit elke week','cm. Hoe lang is de zonnebloem na','weken?','cm'],['Op je spaarrekening staat','euro. Je zet er elke week','euro bij. Hoeveel staat erop na','weken?','€'],['Een kanaal heeft','volgers en krijgt er elke dag','bij. Hoeveel volgers na','dagen?','']])} },
  vraag:v=>`${v.c[0]} ${v.s} ${v.c[1]} ${v.g} ${v.c[2]} ${v.w} ${v.c[3]}`,
  antw:v=>v.s+v.w*v.g, eenheid:v=>v.c[4],
  stappen:v=>[st(`Groei: ${v.w} × ${v.g} = ${v.w*v.g}`,v.w*v.g),st(`Begin erbij: ${v.s} + ${v.w*v.g} = ${v.s+v.w*v.g}`,v.s+v.w*v.g)],
  tabel:v=>({kop:['Stap','Waarde'],rijen:[[0,v.s],[1,v.s+v.g],[2,v.s+2*v.g],[v.w,v.s+v.w*v.g]],leeg:[[2,1],[3,1]]}),
  fouten:v=>[[v.w*v.g,'Je bent de beginwaarde vergeten.'],[v.s*v.w,'Je vermenigvuldigde de beginwaarde. Alleen de groei komt er elke stap bij.'],[v.s+(v.w-1)*v.g,'Tel de stappen goed: na '+v.w+' stappen is er '+v.w+' keer iets bijgekomen.']],
  anders:v=>({tekst:'Maak een tabel: bij elke stap komt er hetzelfde bij.',tabel:{kop:['Stap','Waarde'],rijen:[[0,v.s],[1,v.s+v.g],[2,v.s+2*v.g],[3,v.s+3*v.g],['…','…'],[v.w,v.s+v.w*v.g]]}}),
  v3:v=>({vraag:`${v.c[0]} ${v.s} ${v.c[1]} ${v.g} ${v.c[2]} ${v.w} ${v.c[3]} Leg uit hoe je dit uitrekent.`,
    goed:`Er komt ${v.w} keer ${v.g} bij, dat is ${v.w*v.g}. Plus het begin ${v.s} geeft ${v.s+v.w*v.g}.`,
    bijna:`Elke stap komt er ${v.g} bij. ${v.w} × ${v.g} = ${v.w*v.g}. Het antwoord is ${v.w*v.g}.`,
    fout:`Je begint met ${v.s} en dat wordt ${v.w} keer zo veel: ${v.s} × ${v.w} = ${v.s*v.w}.`,
    kijkwijzer:['Heb je de beginwaarde meegenomen?','Heb je de groei per stap keer het aantal stappen gedaan?','Staat er een duidelijk antwoord met een berekening?']})
});
