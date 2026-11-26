// ===== Niveau 6 · 3F in aanloop · ongeveer 4e klas =====
const SUP = n => String(n).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹⁻'['0123456789-'.indexOf(c)]).join('');
const wn = (m,n) => `${nl(m)} × 10${SUP(n)}`;           // wetenschappelijke notatie als tekst
// ---------- Getallen ----------
L({id:'G6.wetnot',niv:6,dom:'G',sub:'getalbegrip',naam:'Wetenschappelijke notatie',
  uitleg:'Grote getallen schrijf je kort als getal × macht van 10. 4 500 000 = 4,5 × 10⁶: de komma schuift 6 plaatsen. Het eerste getal ligt altijd tussen 1 en 10.',
  gen(r){ const m=r.pick([1.2,2.5,3.2,4.5,6,7.8,9.1,1.05,8.4]),n=r.int(3,9); return {m,n,x:rondaf(m*10**n,0),type:r.pick(['getal','exp']),c:r.pick(['Een land heeft','Een filmpje heeft','Een game is','De zon staat op'])} },
  vraag:v=>v.type==='getal'?`Een getal is in wetenschappelijke notatie <b>${wn(v.m,v.n)}</b>. Schrijf het als gewoon getal.`:`Je schrijft <b>${nl(v.x)}</b> in wetenschappelijke notatie als ${nl(v.m)} × 10<sup>?</sup>. Wat is de exponent?`,
  antw:v=>v.type==='getal'?v.x:v.n,
  stappen:v=>v.type==='getal'?[st(`10${SUP(v.n)} = een 1 met ${v.n} nullen = ${nl(10**v.n)}`,10**v.n),st(`${nl(v.m)} × ${nl(10**v.n)} = ${nl(v.x)}`,v.x)]:[st(`Zet de komma achter het eerste cijfer: ${nl(v.m)}`,v.m),st(`De komma schuift ${v.n} plaatsen, dus de exponent is ${v.n}`,v.n)],
  fouten:v=>v.type==='getal'?[[rondaf(v.m*10**(v.n-1),0),`Keer 10${SUP(v.n)} schuift de komma ${v.n} plaatsen naar rechts. Tel opnieuw.`],[rondaf(v.m*10**(v.n+1),0),`Je schoof de komma één plaats te ver. Het zijn ${v.n} plaatsen.`],[rondaf(v.m*v.n*10,1),'10 tot de macht '+v.n+' is niet 10 × '+v.n+'.']]:[[v.n+1,'Je telde alle cijfers. De exponent is het aantal plaatsen dat de komma schuift.'],[v.n-1,'Tel de plaatsen nog eens vanaf de komma achter het eerste cijfer.']],
  anders:v=>`Elke keer × 10 schuift de komma één plaats. ${nl(v.m)} → ${[1,2,3].map(i=>nl(rondaf(v.m*10**i,2))).join(' → ')} → … Na ${v.n} keer heb je ${nl(v.x)}.`,
  koppel:(v,r)=>({vraag:'Koppel de getallen die even groot zijn.',paren:r.shuffle([['3 × 10³','3000'],['3 × 10⁴','30 000'],['3,5 × 10³','3500'],['3,5 × 10⁴','35 000'],['3 × 10⁶','3 000 000'],['3,5 × 10⁶','3 500 000']]).slice(0,4)})
});
L({id:'G6.rekenvolgorde',niv:6,dom:'G',sub:'bewerkingen',naam:'Rekenvolgorde met machten',verwar:['G3.volgorde'],
  uitleg:'Volgorde: eerst haakjes, dan machten, dan × en :, dan + en −. 3 + 2 × 4² = 3 + 2 × 16 = 35.',
  gen(r){ const t=r.pick(['a','b','c']); let a,b,c; do{ a=r.int(2,9);b=r.int(2,9);c=r.int(2,6) }while(t==='c'&&a*a<=b*c); return {t,a,b,c} },
  vraag:v=>`Reken uit: <b>${v.t==='a'?`${v.a} + ${v.b} × ${v.c}²`:v.t==='b'?`(${v.a} + ${v.b})² − ${v.c}`:`${v.a}² − ${v.b} × ${v.c}`}</b>`,
  antw:v=>v.t==='a'?v.a+v.b*v.c*v.c:v.t==='b'?(v.a+v.b)**2-v.c:v.a*v.a-v.b*v.c,
  stappen:v=>v.t==='a'?[st(`Macht eerst: ${v.c}² = ${v.c*v.c}`,v.c*v.c),st(`Dan keer: ${v.b} × ${v.c*v.c} = ${v.b*v.c*v.c}`,v.b*v.c*v.c),st(`Dan plus: ${v.a} + ${v.b*v.c*v.c} = ${v.a+v.b*v.c*v.c}`,v.a+v.b*v.c*v.c)]:v.t==='b'?[st(`Haakjes eerst: ${v.a} + ${v.b} = ${v.a+v.b}`,v.a+v.b),st(`Macht: ${v.a+v.b}² = ${(v.a+v.b)**2}`,(v.a+v.b)**2),st(`Min: ${(v.a+v.b)**2} − ${v.c} = ${(v.a+v.b)**2-v.c}`,(v.a+v.b)**2-v.c)]:[st(`Macht eerst: ${v.a}² = ${v.a*v.a}`,v.a*v.a),st(`Dan keer: ${v.b} × ${v.c} = ${v.b*v.c}`,v.b*v.c),st(`Min: ${v.a*v.a} − ${v.b*v.c} = ${v.a*v.a-v.b*v.c}`,v.a*v.a-v.b*v.c)],
  fouten:v=>v.t==='a'?[[(v.a+v.b)*v.c*v.c,'Je rekende van links naar rechts. Keer gaat vóór plus.'],[v.a+(v.b*v.c)**2,'Het kwadraat hoort alleen bij de '+v.c+', niet bij '+v.b+' × '+v.c+'.'],[v.a+v.b*v.c*2,v.c+'² is '+v.c+' × '+v.c+', niet '+v.c+' × 2.']]:v.t==='b'?[[v.a*v.a+v.b*v.b-v.c,'(a + b)² is niet a² + b². Reken eerst de haakjes uit.'],[2*(v.a+v.b)-v.c,'Kwadrateren is keer zichzelf, niet keer 2.']]:[[(v.a*v.a-v.b)*v.c,'Keer gaat vóór min.'],[2*v.a-v.b*v.c,v.a+'² is '+v.a+' × '+v.a+'.']].filter(x=>x[0]>=0),
  anders:v=>`Zet in gedachten haakjes om wat eerst moet. Machten binden het sterkst, dan × en :, en pas als laatste + en −.`,
  volgorde:true
});
L({id:'G6.breukrekenen',niv:6,dom:'G',sub:'breuken',naam:'Breuken vermenigvuldigen en delen',toon:x=>fr(x),verwar:['G5.breukdelen'],
  uitleg:'Breuken vermenigvuldigen: teller × teller en noemer × noemer. ⅔ × ¾ = 6/12 = ½. Delen door een breuk: vermenigvuldigen met het omgekeerde.',
  gen(r){ const B=[[1,2],[1,3],[2,3],[1,4],[3,4],[2,5],[3,5],[5,6],[3,8]]; let p,q; do{ p=r.pick(B);q=r.pick(B) }while(p===q); return {t1:p[0],n1:p[1],t2:q[0],n2:q[1],op:r.pick(['×',':'])} },
  vraag:v=>`Reken uit en schrijf als breuk: <b>${breuk(v.t1,v.n1)} ${v.op} ${breuk(v.t2,v.n2)}</b>`,
  antw:v=>v.op==='×'?(v.t1*v.t2)/(v.n1*v.n2):(v.t1*v.n2)/(v.n1*v.t2),
  stappen:v=>v.op==='×'?[st(`Tellers: ${v.t1} × ${v.t2} = ${v.t1*v.t2}`,v.t1*v.t2),st(`Noemers: ${v.n1} × ${v.n2} = ${v.n1*v.n2}`,v.n1*v.n2),st(`${v.t1*v.t2}/${v.n1*v.n2} = ${fr((v.t1*v.t2)/(v.n1*v.n2))}`,(v.t1*v.t2)/(v.n1*v.n2))]:[st(`Omgekeerde van ${v.t2}/${v.n2} is ${v.n2}/${v.t2}`),st(`${v.t1}/${v.n1} × ${v.n2}/${v.t2} = ${v.t1*v.n2}/${v.n1*v.t2}`),st(`Vereenvoudigd: ${fr((v.t1*v.n2)/(v.n1*v.t2))}`,(v.t1*v.n2)/(v.n1*v.t2))],
  fouten:v=>v.op==='×'?[[(v.t1+v.t2)/(v.n1+v.n2),'Bij vermenigvuldigen tel je tellers en noemers niet op.'],[(v.t1*v.t2)/v.n1,'Vermenigvuldig ook de noemers.'],[(v.t1*v.n2)/(v.n1*v.t2),'Je deelde. Hier moet je vermenigvuldigen.']]:[[(v.t1*v.t2)/(v.n1*v.n2),'Je vermenigvuldigde. Delen = vermenigvuldigen met het omgekeerde.'],[(v.n1*v.t2)/(v.t1*v.n2),'Je draaide de verkeerde breuk om. Alleen de tweede breuk draai je om.']],
  anders:v=>v.op==='×'?`"${fr(v.t1/v.n1)} × ${fr(v.t2/v.n2)}" betekent ${fr(v.t1/v.n1)} deel van ${fr(v.t2/v.n2)}. Neem eerst ${fr(v.t2/v.n2)} van een pizza en daarvan weer ${fr(v.t1/v.n1)}: dat stuk is kleiner dan allebei.`:`"${fr(v.t1/v.n1)} : ${fr(v.t2/v.n2)}" betekent: hoe vaak past ${fr(v.t2/v.n2)} in ${fr(v.t1/v.n1)}? Maak eerst dezelfde noemer, dan kun je de tellers delen.`
});
L({id:'G6.wortelschatten',niv:6,dom:'G',sub:'negatief',naam:'Wortel uitrekenen in een context',rm:true,dec:1,verwar:['G5.wortel'],
  uitleg:'Bij een vierkant is zijde × zijde = oppervlakte. Ken je de oppervlakte, dan is de zijde de wortel: √oppervlakte. Schat eerst tussen welke hele getallen het ligt.',
  gen(r){ let x; do{ x=r.int(20,500) }while(Number.isInteger(Math.sqrt(x))); return {x,a:Math.floor(Math.sqrt(x)),c:r.pick(['grasveld','schoolplein','zwembad','moestuintje','podium'])} },
  vraag:v=>`Een vierkant ${v.c} heeft een oppervlakte van ${v.x} m². Hoe lang is één zijde? Rond af op 1 decimaal.`,
  antw:v=>rondaf(Math.sqrt(v.x),1), eenheid:'m',
  stappen:v=>[st(`Schatting: ${v.a}² = ${v.a*v.a} en ${v.a+1}² = ${(v.a+1)**2}, dus tussen ${v.a} en ${v.a+1}`,v.a*v.a),st(`Rekenmachine: √${v.x} ≈ ${nl(rondaf(Math.sqrt(v.x),2))}`,rondaf(Math.sqrt(v.x),2)),st(`Afgerond: ${nl(rondaf(Math.sqrt(v.x),1))} m`,rondaf(Math.sqrt(v.x),1))],
  fouten:v=>[[rondaf(v.x/2,1),'De wortel is niet de helft. Zoek het getal dat keer zichzelf '+v.x+' is.'],[rondaf(v.x/4,1),'Je deelde door 4 zijden. Maar oppervlakte = zijde × zijde.'],[v.a,'Je rondde af op een heel getal. De vraag is 1 decimaal.']],
  anders:v=>`Probeer: ${nl(v.a+.5)} × ${nl(v.a+.5)} = ${nl((v.a+.5)**2)}. Is dat meer of minder dan ${v.x}? Zo kom je steeds dichterbij. De rekenmachine doet het met √.`
});
// ---------- Verhoudingen ----------
L({id:'V6.groeinperioden',niv:6,dom:'V',sub:'groei',naam:'Groei over meerdere perioden',rm:true,verwar:['V5.groeifactor','V5.tweekortingen'],
  uitleg:'Groeit iets elke periode met hetzelfde percentage, dan vermenigvuldig je elke periode met dezelfde groeifactor. Na n perioden: beginwaarde × groeifactorⁿ.',
  gen(r){ const t=r.pick(['sparen','auto','volgers']); const D={sparen:{b:r.pick([500,1000,1500,2000,2500]),p:r.pick([1.5,2,2.5,3,4]),n:r.int(3,10),up:true,d:2,eh:'€',per:'jaar',zin:'Je zet {b} op een spaarrekening met {p}% rente per jaar (rente op rente). Hoeveel staat er na {n} jaar op?'},
    auto:{b:r.pick([12000,15000,18000,20000,24000]),p:r.pick([10,12,15,20]),n:r.int(2,6),up:false,d:2,eh:'€',per:'jaar',zin:'Een auto kost nieuw {b}. De waarde daalt elk jaar met {p}%. Wat is hij na {n} jaar waard?'},
    volgers:{b:r.pick([200,500,800,1200]),p:r.pick([5,8,10,12,15]),n:r.int(3,8),up:true,d:0,eh:'',per:'week',zin:'Een gamekanaal heeft {b} volgers. Het aantal groeit elke week met {p}%. Hoeveel volgers zijn het na {n} weken (afgerond)?'}}[t];
    return {t,...D,g:rondaf(D.up?1+D.p/100:1-D.p/100,4)} },
  vraag:v=>v.zin.replace('{b}',v.eh==='€'?eur(v.b):nl(v.b)).replace('{p}',nl(v.p)).replace('{n}',v.n),
  antw:v=>rondaf(v.b*v.g**v.n,v.d), eenheid:v=>v.eh,
  stappen:v=>[st(`Groeifactor per ${v.per}: ${nl(v.g)}`,v.g),st(`Na ${v.n} keer: ${nl(v.b)} × ${nl(v.g)}${SUP(v.n)}`),st(`= ${nl(rondaf(v.b*v.g**v.n,v.d))}`,rondaf(v.b*v.g**v.n,v.d))],
  fouten:v=>[[rondaf(v.b*(1+(v.up?1:-1)*v.n*v.p/100),v.d),'Je nam elke '+v.per+' hetzelfde bedrag. Maar het percentage gaat steeds over de nieuwe waarde.'],[rondaf(v.b*v.g*v.n,v.d),'Je vermenigvuldigde met '+v.n+'. Je moet '+v.n+' keer met '+nl(v.g)+' vermenigvuldigen: tot de macht '+v.n+'.'],[rondaf(v.b*v.g**(v.n-1),v.d),'Tel de perioden: het zijn er '+v.n+'.']],
  anders:v=>({tekst:'Maak een tabel per '+v.per+'. Elke stap is × '+nl(v.g)+'.',tabel:{kop:[v.per,'waarde'],rijen:[0,1,2,3].map(i=>[i,nl(rondaf(v.b*v.g**i,2))]).concat([[v.n,nl(rondaf(v.b*v.g**v.n,v.d))]])}}),
  sab:v=>({intro:`Beginwaarde ${nl(v.b)}, elke ${v.per} ${nl(v.p)}% ${v.up?'erbij':'eraf'}. Sem rekent de waarde na ${v.n} keer uit.`,stappen:[`${nl(v.p)}% van ${nl(v.b)} is ${nl(v.b*v.p/100)}.`,`Na ${v.n} keer is dat ${v.n} × ${nl(v.b*v.p/100)} = ${nl(v.n*v.b*v.p/100)} ${v.up?'erbij':'eraf'}.`,`Antwoord: ${nl(rondaf(v.b*(1+(v.up?1:-1)*v.n*v.p/100),v.d))}`],fout:1,juist:rondaf(v.b*v.g**v.n,v.d),check:rondaf(v.b*(1+(v.up?1:-1)*v.n*v.p/100),v.d),eenheid:v.eh,vraag:'Wat is de waarde echt?',uitleg:'Het percentage gaat elke '+v.per+' over de nieuwe waarde. Daarom vermenigvuldig je met de groeifactor tot de macht '+v.n+'.',goed:[`Groeifactor ${nl(v.g)}`,`${nl(v.b)} × ${nl(v.g)}${SUP(v.n)} = ${nl(rondaf(v.b*v.g**v.n,v.d))}`]})
});
L({id:'V6.btwexcl',niv:6,dom:'V',sub:'procent',naam:'Prijs zonder btw terugrekenen',rm:true,verwar:['V4.terugrekenen','V4.btw'],
  uitleg:'De btw gaat over de prijs zónder btw. Een prijs met 21% btw is dus 121% van de prijs zonder btw. Deel door 1,21 (of door 1,09 bij 9% btw).',
  gen(r){ const b=r.pick([21,21,9]); const ex=b===21?r.pick([20,40,50,80,100,150,200,250,300,500]):r.pick([4,5,8,10,12,20,25,40]); return {b,ex,inc:rondaf(ex*(100+b)/100,2),d:b===21?r.pick(['koptelefoon','spelcomputer','fiets','gamestoel']):r.pick(['taart','boodschappen','schoolkantine-bestelling','lunch'])} },
  vraag:v=>`De ${v.d} kost ${eur(v.inc)} inclusief ${v.b}% btw. Wat is de prijs zonder btw?`,
  antw:v=>v.ex, eenheid:'€',
  stappen:v=>[st(`Prijs met btw = ${100+v.b}%`,100+v.b),st(`1% = ${nl(v.inc)} : ${100+v.b} = ${nl(rondaf(v.inc/(100+v.b),4))}`,rondaf(v.inc/(100+v.b),4)),st(`100% = ${eur(v.ex)}`,v.ex)],
  fouten:v=>[[rondaf(v.inc*(100-v.b)/100,2),`Je haalde ${v.b}% van ${eur(v.inc)} af. Maar die ${v.b}% ging over de lagere prijs zonder btw.`],[rondaf(v.inc-v.b,2),'Een percentage is geen bedrag in euro.'],[rondaf(v.inc*(100+v.b)/100,2),'Je telde de btw er nog een keer bij.']],
  anders:v=>({tekst:'Teken een strook: de prijs zonder btw is 100%, de btw is '+v.b+'% erbovenop. Samen '+(100+v.b)+'% = '+eur(v.inc)+'.',svg:FIG.balk([{w:100,label:'zonder btw (100%)',k:'b'},{w:v.b,label:v.b+'%',k:'a'}],eur(v.inc)+' = '+(100+v.b)+'%')}),
  tabel:v=>({kop:['Procent','Bedrag (€)'],rijen:[[100+v.b,v.inc],[100,v.ex]],leeg:[[1,1]]}),
  sab:v=>({intro:`De ${v.d} kost ${eur(v.inc)} inclusief ${v.b}% btw. Lars rekent de prijs zonder btw uit.`,stappen:[`De btw is ${v.b}% van ${eur(v.inc)}.`,`${nl(v.b/100)} × ${nl(v.inc)} = ${nl(rondaf(v.inc*v.b/100,2))}`,`Zonder btw: ${eur(rondaf(v.inc*(100-v.b)/100,2))}`],fout:0,juist:v.ex,check:rondaf(v.inc*(100-v.b)/100,2),eenheid:'€',vraag:'Wat is de prijs zonder btw echt?',uitleg:'De btw is '+v.b+'% van de prijs zonder btw, niet van de prijs met btw. Deel door '+nl((100+v.b)/100)+'.',goed:[`${eur(v.inc)} = ${100+v.b}%`,`${nl(v.inc)} : ${nl((100+v.b)/100)} = ${eur(v.ex)}`]})
});
L({id:'V6.wisselkoers',niv:6,dom:'V',sub:'vtabel',naam:'Wisselkoersen',rm:true,dec:2,
  uitleg:'Een wisselkoers is een verhouding: 1 euro = 1,08 dollar. Van euro naar dollar: keer 1,08. Van dollar naar euro: delen door 1,08. Controleer: in de munt met het kleinere bedrag per eenheid krijg je meer.',
  gen(r){ const [munt,k]=r.pick([['Amerikaanse dollar',1.08],['Britse pond',0.85],['Zwitserse frank',0.95],['Turkse lira',35],['Japanse yen',160],['Zweedse kroon',11.5]]); return {munt,k,naarEur:r.ja(),b:r.pick([20,50,75,120,250,400]),c:r.pick(['voor een concertkaartje','voor je vakantie','voor een game in een buitenlandse webshop','voor souvenirs'])} },
  vraag:v=>v.naarEur?`Je betaalt ${nl(v.b)} ${v.munt} ${v.c}. De koers is 1 euro = ${nl(v.k)} ${v.munt}. Hoeveel euro is dat (op 2 decimalen)?`:`Je wisselt ${eur(v.b)} ${v.c}. De koers is 1 euro = ${nl(v.k)} ${v.munt}. Hoeveel ${v.munt} krijg je?`,
  antw:v=>v.naarEur?rondaf(v.b/v.k,2):rondaf(v.b*v.k,2), eenheid:v=>v.naarEur?'€':v.munt,
  stappen:v=>v.naarEur?[st(`1 euro = ${nl(v.k)} ${v.munt}`,v.k),st(`${nl(v.b)} : ${nl(v.k)} ≈ ${nl(rondaf(v.b/v.k,2))} euro`,rondaf(v.b/v.k,2))]:[st(`1 euro = ${nl(v.k)} ${v.munt}`,v.k),st(`${nl(v.b)} × ${nl(v.k)} = ${nl(rondaf(v.b*v.k,2))} ${v.munt}`,rondaf(v.b*v.k,2))],
  fouten:v=>v.naarEur?[[rondaf(v.b*v.k,2),'Je vermenigvuldigde. Van de vreemde munt naar euro deel je door de koers.'],[v.b,'Je moet nog omrekenen met de koers.']]:[[rondaf(v.b/v.k,2),'Je deelde. Van euro naar de vreemde munt vermenigvuldig je met de koers.'],[v.b,'Je moet nog omrekenen met de koers.']],
  anders:v=>({tekst:'Zet het in een verhoudingstabel. Wat je met de ene rij doet, doe je met de andere.',tabel:{kop:['euro',v.munt],rijen:v.naarEur?[['1',nl(v.k)],['?',nl(v.b)]]:[['1',nl(v.k)],[nl(v.b),'?']]}}),
  tabel:v=>v.naarEur?{kop:['Euro',v.munt],rijen:[[1,v.k],[rondaf(v.b/v.k,2),v.b]],leeg:[[1,0]]}:{kop:['Euro',v.munt],rijen:[[1,v.k],[v.b,rondaf(v.b*v.k,2)]],leeg:[[1,1]]}
});
L({id:'V6.verdelen3',niv:6,dom:'V',sub:'vtabel',naam:'Verdelen in een verhouding met drie delen',rm:true,verwar:['V5.mengverhouding'],
  uitleg:'Bij een verhouding 2 : 3 : 5 zijn er 2 + 3 + 5 = 10 delen. Reken uit hoeveel 1 deel is en vermenigvuldig.',
  gen(r){ const a=r.int(1,4),b=r.int(1,5),c=r.int(2,6),k=r.pick([5,10,12,15,20,25,40]); const [n1,n2,n3]=r.shuffle(NAMEN).slice(0,3); return {a,b,c,k,T:k*(a+b+c),n1,n2,n3,wat:r.pick(['het prijzengeld van een gametoernooi','de opbrengst van een sponsorloop','de winst van een schoolproject'])} },
  vraag:v=>`${v.n1}, ${v.n2} en ${v.n3} verdelen ${v.wat}: ${eur(v.T)}. Ze verdelen in de verhouding ${v.a} : ${v.b} : ${v.c}. Hoeveel krijgt ${v.n2}?`,
  antw:v=>v.b*v.k, eenheid:'€',
  stappen:v=>[st(`Aantal delen: ${v.a} + ${v.b} + ${v.c} = ${v.a+v.b+v.c}`,v.a+v.b+v.c),st(`1 deel: ${v.T} : ${v.a+v.b+v.c} = ${v.k}`,v.k),st(`${v.n2}: ${v.b} × ${v.k} = ${eur(v.b*v.k)}`,v.b*v.k)],
  fouten:v=>[[rondaf(v.T/3,2),'Je verdeelde eerlijk in drieën. Bij een verhouding krijgt iedereen een ander aantal delen.'],[v.k,'Dat is 1 deel. '+v.n2+' krijgt '+v.b+' delen.'],[rondaf(v.T*v.b/10,2),'Deel door het totaal aantal delen: '+(v.a+v.b+v.c)+'.']],
  anders:v=>({tekst:'Teken een strook met alle delen.',svg:FIG.balk([{w:v.a,label:v.n1,k:'zacht'},{w:v.b,label:v.n2,k:'a'},{w:v.c,label:v.n3,k:'b'}],eur(v.T)+' = '+(v.a+v.b+v.c)+' delen')}),
  tabel:v=>({kop:['Delen','Bedrag (€)'],rijen:[[v.a+v.b+v.c,v.T],[1,v.k],[v.b,v.b*v.k]],leeg:[[1,1],[2,1]]})
});
// ---------- Meten en meetkunde ----------
L({id:'M6.pythagoras',niv:6,dom:'M',sub:'meetkunde',naam:'Stelling van Pythagoras',rm:true,dec:1,
  uitleg:'In een rechthoekige driehoek geldt: a² + b² = c², waarbij c de schuine zijde is (tegenover de rechte hoek). Schuine zijde zoeken: optellen en wortel. Rechthoekszijde zoeken: aftrekken en wortel.',
  gen(r){ const t=r.pick(['schuin','schuin','zijde']); const a=r.int(3,12); let b,c; if(t==='schuin'){ do{ b=r.int(4,16) }while(b===a) } else c=r.int(a+2,a+12);
    return {t,a,b,c,ctx:r.pick(t==='schuin'?['Een rechthoekig grasveld is {a} m bij {b} m. Je steekt schuin over. Hoe lang is die route?','Een tv-scherm is {a} dm hoog en {b} dm breed. Hoe lang is de diagonaal?','Een skatehelling is {a} dm hoog en {b} dm lang (vlakke kant). Hoe lang is de schuine plank?']:['Een ladder van {c} m staat tegen een muur. De voet staat {a} m van de muur. Hoe hoog komt de ladder?','Een vlieger hangt aan een touw van {c} m. Je staat {a} m van het punt recht onder de vlieger. Hoe hoog hangt hij?'])} },
  vraag:v=>v.ctx.replace('{a}',v.a).replace('{b}',v.b).replace('{c}',v.c)+' Rond af op 1 decimaal.',
  antw:v=>v.t==='schuin'?rondaf(Math.sqrt(v.a*v.a+v.b*v.b),1):rondaf(Math.sqrt(v.c*v.c-v.a*v.a),1), eenheid:v=>v.ctx.includes(' dm')?'dm':'m',
  stappen:v=>v.t==='schuin'?[st(`${v.a}² + ${v.b}² = ${v.a*v.a} + ${v.b*v.b} = ${v.a*v.a+v.b*v.b}`,v.a*v.a+v.b*v.b),st(`√${v.a*v.a+v.b*v.b} ≈ ${nl(rondaf(Math.sqrt(v.a*v.a+v.b*v.b),1))}`,rondaf(Math.sqrt(v.a*v.a+v.b*v.b),1))]:[st(`Schuine zijde is ${v.c}: ${v.c}² − ${v.a}² = ${v.c*v.c} − ${v.a*v.a} = ${v.c*v.c-v.a*v.a}`,v.c*v.c-v.a*v.a),st(`√${v.c*v.c-v.a*v.a} ≈ ${nl(rondaf(Math.sqrt(v.c*v.c-v.a*v.a),1))}`,rondaf(Math.sqrt(v.c*v.c-v.a*v.a),1))],
  fouten:v=>v.t==='schuin'?[[v.a+v.b,'De schuine zijde is korter dan de twee andere samen. Gebruik a² + b² = c².'],[v.a*v.a+v.b*v.b,'Je vergat de wortel te trekken.'],[rondaf(Math.sqrt(Math.abs(v.b*v.b-v.a*v.a)),1),'Bij de schuine zijde tel je de kwadraten op.']]:[[rondaf(Math.sqrt(v.c*v.c+v.a*v.a),1),'De ladder (of het touw) is al de schuine zijde. Trek de kwadraten af.'],[v.c-v.a,'Zijden mag je niet zomaar aftrekken. Werk met de kwadraten.'],[v.c*v.c-v.a*v.a,'Je vergat de wortel te trekken.']],
  anders:v=>`Teken de driehoek en zet een boogje bij de rechte hoek. De langste zijde ligt daar tegenover. ${v.t==='schuin'?'Die zoek je: kwadraten optellen, dan de wortel.':'Die ken je al ('+v.c+'): kwadraten aftrekken, dan de wortel.'} Controle: de schuine zijde is altijd de langste.`,
  sab:v=>v.t==='schuin'?({intro:`Een rechthoek is ${v.a} bij ${v.b}. Mila rekent de diagonaal uit.`,stappen:[`De diagonaal gaat langs beide zijden.`,`${v.a} + ${v.b} = ${v.a+v.b}`,`Antwoord: ${v.a+v.b}`],fout:0,juist:rondaf(Math.sqrt(v.a*v.a+v.b*v.b),1),check:v.a+v.b,vraag:'Hoe lang is de diagonaal echt (1 decimaal)?',uitleg:'Schuin oversteken is korter dan langs de randen lopen. Gebruik Pythagoras: a² + b² = c².',goed:[`${v.a}² + ${v.b}² = ${v.a*v.a+v.b*v.b}`,`√${v.a*v.a+v.b*v.b} ≈ ${nl(rondaf(Math.sqrt(v.a*v.a+v.b*v.b),1))}`]}):({intro:`Een ladder van ${v.c} m staat ${v.a} m van de muur. Mila rekent uit hoe hoog hij komt.`,stappen:[`${v.c}² + ${v.a}² = ${v.c*v.c+v.a*v.a}`,`√${v.c*v.c+v.a*v.a} ≈ ${nl(rondaf(Math.sqrt(v.c*v.c+v.a*v.a),1))}`,`Antwoord: ${nl(rondaf(Math.sqrt(v.c*v.c+v.a*v.a),1))} m`],fout:0,juist:rondaf(Math.sqrt(v.c*v.c-v.a*v.a),1),check:rondaf(Math.sqrt(v.c*v.c+v.a*v.a),1),eenheid:'m',vraag:'Hoe hoog komt de ladder echt?',uitleg:'De ladder is de schuine zijde. Dan trek je de kwadraten af. De hoogte kan nooit langer zijn dan de ladder.',goed:[`${v.c}² − ${v.a}² = ${v.c*v.c-v.a*v.a}`,`√${v.c*v.c-v.a*v.a} ≈ ${nl(rondaf(Math.sqrt(v.c*v.c-v.a*v.a),1))}`]})
});
L({id:'M6.prisma',niv:6,dom:'M',sub:'inhoud',naam:'Inhoud van een prisma',rm:true,verwar:['M5.cilinder'],
  uitleg:'Inhoud van een prisma = oppervlakte grondvlak × hoogte (lengte). Is het grondvlak een driehoek, dan is dat ½ × basis × hoogte van de driehoek.',
  gen(r){ const t=r.pick(['doos','tent']); return t==='doos'?{t,b:r.pick([4,5,6,8]),h:r.pick([3,4,5,6]),l:r.pick([15,20,25,30]),eh:cm3,c:'Een chocoladedoos heeft de vorm van een driehoekig prisma. De driehoek is {b} cm breed en {h} cm hoog. De doos is {l} cm lang.'}:{t,b:r.pick([2,3,4]),h:r.pick([1.5,2,2.5]),l:r.pick([2,3,4]),eh:m3,c:'Een tent heeft de vorm van een driehoekig prisma. De voorkant is een driehoek van {b} m breed en {h} m hoog. De tent is {l} m lang.'} },
  vraag:v=>v.c.replace('{b}',nl(v.b)).replace('{h}',nl(v.h)).replace('{l}',nl(v.l))+' Wat is de inhoud?',
  antw:v=>rondaf(v.b*v.h/2*v.l,2), eenheid:v=>v.eh,
  stappen:v=>[st(`Grondvlak (driehoek): ½ × ${nl(v.b)} × ${nl(v.h)} = ${nl(v.b*v.h/2)}`,rondaf(v.b*v.h/2,3)),st(`Inhoud: ${nl(v.b*v.h/2)} × ${nl(v.l)} = ${nl(v.b*v.h/2*v.l)} ${v.eh}`,rondaf(v.b*v.h/2*v.l,2))],
  fouten:v=>[[rondaf(v.b*v.h*v.l,2),'Je vergat ½: het grondvlak is een driehoek, geen rechthoek.'],[rondaf(v.b*v.h/2,3),'Dat is alleen de oppervlakte van de driehoek. Vermenigvuldig nog met de lengte.'],[rondaf(v.b*v.h/2*v.l/3,2),'Delen door 3 hoort bij een piramide, niet bij een prisma.']],
  anders:v=>`Een prisma is een stapel gelijke plakjes. Eén plakje van 1 ${v.eh===cm3?'cm':'m'} dik heeft de vorm van de driehoek (½ × ${nl(v.b)} × ${nl(v.h)}). Er liggen ${nl(v.l)} plakjes achter elkaar.`
});
L({id:'M6.inhoudeenheden',niv:6,dom:'M',sub:'eenheden',naam:'Inhoudsmaten in grote stappen',rm:true,dec:4,verwar:['M4.inhoudmaten'],
  uitleg:'Bij inhoud is elke stap in het metriek stelsel × 1000: 1 m³ = 1000 dm³ = 1 000 000 cm³. 1 dm³ = 1 liter en 1 cm³ = 1 ml.',
  gen(r){ const [u1,u2,f]=r.pick([['m³','liter',1000],['m³','cm³',1000000],['dm³','cm³',1000],['liter','ml',1000],['liter','cl',100],['m³','dl',10000],['cl','ml',10]]); const y=r.pick([0.25,0.5,1.2,2.5,3.75,4.5,0.08,6]); const omlaag=r.ja(); return omlaag?{van:u1,naar:u2,x:y,y:rondaf(y*f,6),f,omlaag}:{van:u2,naar:u1,x:rondaf(y*f,6),y,f,omlaag} },
  vraag:v=>`Reken om: ${nl(v.x)} ${v.van} = … ${v.naar}`,
  antw:v=>v.y, eenheid:v=>v.naar,
  stappen:v=>v.omlaag?[st(`1 ${v.van} = ${nl(v.f)} ${v.naar}`,v.f),st(`${nl(v.x)} × ${nl(v.f)} = ${nl(v.y)} ${v.naar}`,v.y)]:[st(`1 ${v.naar} = ${nl(v.f)} ${v.van}`,v.f),st(`${nl(v.x)} : ${nl(v.f)} = ${nl(v.y)} ${v.naar}`,v.y)],
  fouten:v=>v.omlaag?[[rondaf(v.x/v.f,8),'Naar een kleinere eenheid krijg je een groter getal: vermenigvuldigen.'],[rondaf(v.x*v.f/10,6),'De stap is te klein. 1 '+v.van+' = '+nl(v.f)+' '+v.naar+'.'],[rondaf(v.x*v.f*10,6),'De stap is te groot. 1 '+v.van+' = '+nl(v.f)+' '+v.naar+'.']]:[[rondaf(v.x*v.f,6),'Naar een grotere eenheid krijg je een kleiner getal: delen.'],[rondaf(v.x/v.f*10,6),'De stap is te klein. 1 '+v.naar+' = '+nl(v.f)+' '+v.van+'.'],[rondaf(v.x/v.f/10,8),'De stap is te groot. 1 '+v.naar+' = '+nl(v.f)+' '+v.van+'.']],
  anders:v=>({tekst:'Gebruik het inhoudstrapje. Elke trede is × 1000 (bij liters en ml: dl en cl tussendoor, elk × 10).',tabel:{kop:['m³','dm³ = liter','cm³ = ml'],rijen:[['1','1000','1 000 000']]}}),
  koppel:(v,r)=>({vraag:'Koppel de inhouden die even groot zijn.',paren:r.shuffle([['2,5 m³','2500 liter'],['0,5 m³','500 000 cm³'],['3 liter','300 cl'],['75 cl','0,75 liter'],['4 dm³','4000 ml'],['0,2 m³','2000 dl']]).slice(0,4)})
});
L({id:'M6.schaalopp',niv:6,dom:'M',sub:'oppervlak',naam:'Oppervlakte op een kaart met schaal',rm:true,dec:4,verwar:['M5.vergroten','V3.schaal'],
  uitleg:'Reken eerst de lengtes om naar echte lengtes in km. Vermenigvuldig dan pas. Doe je het andersom, dan moet je de schaal twee keer gebruiken (in de lengte én in de breedte).',
  gen(r){ return {s:r.pick([10000,20000,50000,100000]),a:r.int(2,8),b:r.int(2,8),c:r.pick(['natuurgebied','meer','vakantiepark','bos','festivalterrein'])} },
  vraag:v=>`Op een kaart met schaal 1 : ${nl(v.s)} is een ${v.c} een rechthoek van ${v.a} cm bij ${v.b} cm. Hoeveel km² is het in het echt?`,
  antw:v=>rondaf(v.a*v.b*(v.s/100000)**2,4), eenheid:km2,
  stappen:v=>[st(`Lengte: ${v.a} × ${nl(v.s)} = ${nl(v.a*v.s)} cm = ${nl(v.a*v.s/100000)} km`,rondaf(v.a*v.s/100000,4)),st(`Breedte: ${v.b} × ${nl(v.s)} = ${nl(v.b*v.s)} cm = ${nl(v.b*v.s/100000)} km`,rondaf(v.b*v.s/100000,4)),st(`Oppervlakte: ${nl(v.a*v.s/100000)} × ${nl(v.b*v.s/100000)} = ${nl(v.a*v.b*(v.s/100000)**2)} km²`,rondaf(v.a*v.b*(v.s/100000)**2,4))],
  fouten:v=>[[rondaf(v.a*v.b*v.s/100000,4),'Je gebruikte de schaal maar één keer. Het gebied wordt in de lengte én in de breedte groter.'],[rondaf(v.a*v.b*(v.s/100000)**2*100,4),'Let op: 1 km = 100 000 cm.'],[rondaf((v.a+v.b)*v.s/100000,4),'Dat lijkt op een omtrek. Voor oppervlakte vermenigvuldig je lengte en breedte.']],
  anders:v=>`1 cm op de kaart is ${nl(v.s/100000)} km echt. Een vierkantje van 1 cm bij 1 cm op de kaart is dus ${nl(v.s/100000)} × ${nl(v.s/100000)} = ${nl((v.s/100000)**2)} km². Het gebied is ${v.a*v.b} van die vierkantjes.`
});
// ---------- Verbanden ----------
L({id:'B6.tweepunten',niv:6,dom:'B',sub:'formules',naam:'Formule uit twee gegevens',rm:true,verwar:['B5.tabelformule'],
  uitleg:'Bij een lineair verband: toename per stap = (verschil in uitkomst) : (verschil in invoer). Het vaste bedrag reken je terug vanuit één gegeven.',
  gen(r){ const a=r.pick([1.5,2,2.5,3,0.5]),b=r.pick([3,4,5,6,7.5]); const x1=r.int(2,8),x2=x1+r.int(3,9),n=r.pick([15,20,25,30]); const c=r.pick([['Een taxirit van','km','kost'],['Een feestzaal huren voor','personen','kost'],['Een bowlingavond met','spelletjes','kost']]); return {a,b,x1,x2,n,y1:rondaf(a*x1+b,2),y2:rondaf(a*x2+b,2),c} },
  vraag:v=>`${v.c[0]} ${v.x1} ${v.c[1]} ${v.c[2]} ${eur(v.y1)}. ${v.c[0]} ${v.x2} ${v.c[1]} ${v.c[2]} ${eur(v.y2)}. Er is een vast bedrag plus een bedrag per stuk. Wat kost het voor ${v.n} ${v.c[1]}?`,
  antw:v=>rondaf(v.a*v.n+v.b,2), eenheid:'€',
  stappen:v=>[st(`Verschil: ${nl(v.y2)} − ${nl(v.y1)} = ${nl(v.y2-v.y1)} voor ${v.x2-v.x1} ${v.c[1]}`,rondaf(v.y2-v.y1,2)),st(`Per stuk: ${nl(v.y2-v.y1)} : ${v.x2-v.x1} = ${nl(v.a)}`,v.a),st(`Vast bedrag: ${nl(v.y1)} − ${v.x1} × ${nl(v.a)} = ${nl(v.b)}`,v.b),st(`Bij ${v.n}: ${nl(v.a)} × ${v.n} + ${nl(v.b)} = ${eur(v.a*v.n+v.b)}`,rondaf(v.a*v.n+v.b,2))],
  fouten:v=>[[rondaf(v.y1/v.x1*v.n,2),'Je deed alsof er geen vast bedrag is. Dan is het niet evenredig.'],[rondaf(v.a*v.n,2),'Je vergat het vaste bedrag.'],[rondaf((v.y2-v.y1)*v.n+v.b,2),'Deel de toename nog door het aantal '+v.c[1]+' ertussen.']],
  anders:v=>({tekst:'Zet de twee gegevens in een tabel en kijk wat er per stap bijkomt.',tabel:{kop:[v.c[1],'kosten (€)'],rijen:[[0,'?'],[v.x1,nl(v.y1)],[v.x2,nl(v.y2)],[v.n,'?']]}}),
  v3:v=>({vraag:`${v.x1} ${v.c[1]} kost ${eur(v.y1)} en ${v.x2} ${v.c[1]} kost ${eur(v.y2)}. Leg uit hoe je het vaste bedrag vindt.`,
    goed:`${v.x2-v.x1} ${v.c[1]} meer kost ${eur(v.y2-v.y1)} meer, dus ${eur(v.a)} per stuk. Bij ${v.x1} is dat ${eur(v.a*v.x1)}, dus het vaste bedrag is ${eur(v.y1)} − ${eur(v.a*v.x1)} = ${eur(v.b)}.`,
    bijna:`Per stuk is ${eur(v.a)}. Het vaste bedrag is ${eur(v.y1)} − ${eur(v.a)} = ${eur(rondaf(v.y1-v.a,2))}.`,
    fout:`${eur(v.y1)} : ${v.x1} = ${eur(rondaf(v.y1/v.x1,2))} per stuk, dus er is geen vast bedrag.`,
    kijkwijzer:['Is de prijs per stuk uit het verschil gehaald?','Is het vaste bedrag teruggerekend met alle stuks, niet met één?','Klopt de formule voor allebei de gegevens?']})
});
L({id:'B6.exptabel',niv:6,dom:'B',sub:'tabellen',naam:'Exponentiële groei in een tabel',rm:true,verwar:['B5.tabelformule'],
  uitleg:'Bij lineaire groei komt er steeds hetzelfde getal bij. Bij exponentiële groei wordt het steeds met hetzelfde getal vermenigvuldigd: de groeifactor = waarde : vorige waarde.',
  gen(r){ return {b:r.pick([100,200,400,500,1000]),g:r.pick([1.1,1.2,1.5,2,0.8,0.5,0.9]),type:r.pick(['factor','verder']),n:r.int(5,7),c:r.pick([['Week','Aantal'],['Uur','Aantal bacteriën'],['Jaar','Waarde (€)'],['Dag','Views']])} },
  vraag:v=>`De waarden in de tabel groeien exponentieel.<div class="vtabel">${vtabelHtml(v.c,[0,1,2,3].map(t=>[t,nl(rondaf(v.b*v.g**t,2))]))}</div>${v.type==='factor'?'Wat is de groeifactor?':`Welke waarde hoort bij ${v.c[0].toLowerCase()} ${v.n}? Rond af op 2 decimalen.`}`,
  antw:v=>v.type==='factor'?v.g:rondaf(v.b*v.g**v.n,2),
  stappen:v=>v.type==='factor'?[st(`${nl(rondaf(v.b*v.g,2))} : ${nl(v.b)} = ${nl(v.g)}`,v.g),st(`Controle: ${nl(rondaf(v.b*v.g*v.g,2))} : ${nl(rondaf(v.b*v.g,2))} = ${nl(v.g)}`,v.g)]:[st(`Groeifactor: ${nl(rondaf(v.b*v.g,2))} : ${nl(v.b)} = ${nl(v.g)}`,v.g),st(`Bij ${v.n}: ${nl(v.b)} × ${nl(v.g)}${SUP(v.n)} = ${nl(rondaf(v.b*v.g**v.n,2))}`,rondaf(v.b*v.g**v.n,2))],
  fouten:v=>{ const y=t=>rondaf(v.b*v.g**t,2); return v.type==='factor'?[[Math.abs(rondaf(y(1)-y(0),2)),'Dat is het verschil. Bij exponentiële groei deel je twee opeenvolgende waarden.'],[Math.abs(rondaf(v.g-1,2)),'Dat is de verandering als kommagetal. De groeifactor is nieuw : oud.']]:[[rondaf(y(3)+(v.n-3)*(y(3)-y(2)),2),'Je deed alsof er steeds hetzelfde bijkomt. Bij exponentiële groei vermenigvuldig je steeds.'],[rondaf(v.b*v.g*v.n,2),'Je moet '+v.n+' keer met '+nl(v.g)+' vermenigvuldigen, niet één keer met '+v.n+'.'],[y(v.n-1),'Tel de stappen vanaf 0.']].filter(x=>x[0]>=0) },
  anders:v=>`Kijk tussen twee kolommen: van ${nl(v.b)} naar ${nl(rondaf(v.b*v.g,2))} is × ${nl(v.g)}. Van ${nl(rondaf(v.b*v.g,2))} naar ${nl(rondaf(v.b*v.g*v.g,2))} ook. Dat is exponentieel.`,
  koppel:(v,r)=>({vraag:'Koppel elke tabel aan het soort groei.',paren:r.shuffle([['10, 20, 40, 80','× 2 per stap'],['10, 20, 30, 40','+ 10 per stap'],['80, 40, 20, 10','× 0,5 per stap'],['100, 110, 121, 133,1','× 1,1 per stap'],['100, 110, 120, 130','+ 10 per stap (vanaf 100)'],['50, 45, 40, 35','− 5 per stap']]).slice(0,4)})
});
L({id:'B6.snijpunt',niv:6,dom:'B',sub:'formules',naam:'Wanneer zijn twee abonnementen even duur?',rm:true,verwar:['B3.tweelijnen'],
  uitleg:'Het ene abonnement heeft een hoog vast bedrag en een lage prijs per keer, het andere andersom. Het verschil in vast bedrag wordt elke keer kleiner met het verschil per keer. Deel het ene verschil door het andere.',
  gen(r){ const x0=r.int(5,30),p2=r.pick([0,1,2,2.5,3]),d=r.pick([1,1.5,2,2.5,4,5]),a1=r.pick([0,5,10,15]); const c=r.pick([['een sportschool','bezoeken','per bezoek'],['een fietsverhuur','dagen','per dag'],['een streamingdienst met huurfilms','films','per film']]); return {x0,p1:p2+d,p2,a1,a2:a1+x0*d,c} },
  vraag:v=>`Bij ${v.c[0]} kies je uit twee abonnementen. A: ${eur(v.a1)} vast plus ${eur(v.p1,true)} ${v.c[2]}. B: ${eur(v.a2)} vast plus ${eur(v.p2,true)} ${v.c[2]}. Bij hoeveel ${v.c[1]} zijn A en B even duur?`,
  antw:v=>v.x0, eenheid:v=>v.c[1],
  stappen:v=>[st(`Verschil vast bedrag: ${nl(v.a2)} − ${nl(v.a1)} = ${nl(v.a2-v.a1)}`,v.a2-v.a1),st(`Verschil ${v.c[2]}: ${nl(v.p1)} − ${nl(v.p2)} = ${nl(v.p1-v.p2)}`,rondaf(v.p1-v.p2,2)),st(`${nl(v.a2-v.a1)} : ${nl(v.p1-v.p2)} = ${v.x0}`,v.x0)],
  fouten:v=>[[v.a2-v.a1,'Dat is het verschil in vast bedrag. Deel nog door het verschil per keer.'],[rondaf((v.a2-v.a1)/(v.p1+v.p2),2),'Deel door het verschil per keer, niet door de som.'],[rondaf(v.a2/v.p1,2),'Je moet de verschillen gebruiken, niet één abonnement.']],
  anders:v=>({tekst:'Maak een tabel en kijk wanneer de bedragen gelijk zijn.',tabel:{kop:[v.c[1],'A (€)','B (€)'],rijen:[0,Math.round(v.x0/2),v.x0,v.x0+5].map(x=>[x,nl(v.a1+v.p1*x),nl(v.a2+v.p2*x)])}})
});
L({id:'B6.gemhalen',niv:6,dom:'B',sub:'statistiek',naam:'Welk cijfer moet je halen?',rm:true,dec:1,verwar:['B5.gewogen'],
  uitleg:'Gemiddelde × aantal = totaal. Reken uit welk totaal je nodig hebt, trek af wat je al hebt: dat moet je nog halen.',
  gen(r){ let c,k,G,s,x; do{ k=r.int(2,4); c=Array.from({length:k},()=>r.int(40,85)/10); G=r.pick([5.5,6,6.5,7,7.5]); s=rondaf(c.reduce((a,b)=>a+b,0),1); x=rondaf(G*(k+1)-s,1) }while(x<1||x>10); return {c,k,G,s,x,vak:r.pick(CTX.vak)} },
  vraag:v=>`Voor ${v.vak} heb je ${v.k} cijfers: ${v.c.map(nl).join(', ')}. Er komt nog één toets bij, die even zwaar telt. Welk cijfer moet je halen om precies een ${nl(v.G)} gemiddeld te staan?`,
  antw:v=>v.x,
  stappen:v=>[st(`Nodig totaal: ${nl(v.G)} × ${v.k+1} = ${nl(v.G*(v.k+1))}`,rondaf(v.G*(v.k+1),1)),st(`Je hebt al: ${v.c.map(nl).join(' + ')} = ${nl(v.s)}`,v.s),st(`Nog nodig: ${nl(v.G*(v.k+1))} − ${nl(v.s)} = ${nl(v.x)}`,v.x)],
  fouten:v=>[[v.G,'Dan kom je alleen op een '+nl(v.G)+' als je nu al precies '+nl(v.G)+' staat.'],[rondaf(2*v.G-v.s/v.k,1),'Je rekende alsof je huidige gemiddelde en het nieuwe cijfer even zwaar tellen. Je huidige gemiddelde telt '+v.k+' keer.'],[rondaf(v.G*v.k-v.s,1),'Na de nieuwe toets zijn er '+(v.k+1)+' cijfers, niet '+v.k+'.']].filter(x=>x[0]>0),
  anders:v=>`Stel je het gemiddelde voor als een "eerlijke verdeling" van punten. Voor ${v.k+1} cijfers van gemiddeld ${nl(v.G)} heb je ${nl(v.G*(v.k+1))} punten nodig. Hoeveel punten heb je al, en hoeveel mis je nog?`
});
