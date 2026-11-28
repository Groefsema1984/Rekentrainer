// ===== Uitbreiding niveau 1 t/m 5: subdomeinen die nog ontbraken, echte misconcepties en saboteurs =====
// Doel: elk niveau dekt alle vier de domeinen breed (getallen, verhoudingen, meten en meetkunde, verbanden),
// met afleiders die een echte denkfout laten zien in plaats van een willekeurig getal.

const DAGEN=['maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag','zondag'];
const uniekOpties=(goed,f)=>{ const u=[]; f.forEach(x=>{ if(x[0]!==goed&&!u.some(y=>y[0]===x[0])) u.push(x) }); return [[goed,true]].concat(u.slice(0,3).map(x=>[x[0],false,x[1]])) };
const zonderGelijk=(goed,f)=>f.filter(x=>Number.isFinite(x[0])&&Math.abs(x[0]-goed)>1e-9);

// vlakke figuur met n hoeken (regelmatig), of een rechthoek
FIG.vorm=(n,recht=false)=>{ let p; if(recht) p=[[40,40],[260,40],[260,150],[40,150]]; else { p=[]; for(let i=0;i<n;i++){ const a=(i/n)*2*Math.PI-Math.PI/2+(n===4?Math.PI/4:0); p.push([150+80*Math.cos(a),100+80*Math.sin(a)]) } }
  return FIG.wrap(`<polygon points="${p.map(q=>q.map(z=>Math.round(z)).join(',')).join(' ')}" class="vlak a" stroke="var(--ink)" stroke-width="3"/>`,300,195,'style="max-width:260px"') };
// hoek van g graden, met een boogje
FIG.hoek=g=>{ const x0=70,y0=170,L=180,a=g*Math.PI/180, x1=x0+L*Math.cos(a), y1=y0-L*Math.sin(a), r=34, bx=x0+r*Math.cos(a), by=y0-r*Math.sin(a);
  const boog=g===90?`<polyline points="${x0+24},${y0} ${x0+24},${y0-24} ${x0},${y0-24}" fill="none" stroke="var(--acc)" stroke-width="3"/>`:`<path d="M ${x0+r} ${y0} A ${r} ${r} 0 0 0 ${bx.toFixed(1)} ${by.toFixed(1)}" fill="none" stroke="var(--acc)" stroke-width="3"/>`;
  return FIG.wrap(`<line x1="${x0}" y1="${y0}" x2="${x0+L}" y2="${y0}" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><line x1="${x0}" y1="${y0}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>${boog}`,300,190,'style="max-width:280px"') };
// staande thermometer van lo tot hi met een markering
FIG.thermo=(lo,hi,punten)=>{ const h=220,y=t=>14+(hi-t)/(hi-lo)*(h-30); let o=`<rect x="60" y="8" width="22" height="${h-20}" rx="11" class="vlak leeg"/>`;
  for(let t=lo;t<=hi;t++){ const yy=y(t); o+=`<line x1="${t%5?84:82}" y1="${yy}" x2="${t%5?92:100}" y2="${yy}" class="ax"/>`; if(t%5===0) o+=FIG.t(122,yy+5,String(t).replace('-','−'),{fs:13}) }
  punten.forEach((p,i)=>{ const yy=y(p.t); o+=`<line x1="40" y1="${yy}" x2="60" y2="${yy}" stroke="var(--acc)" stroke-width="3"/>`+FIG.t(34,yy+5,p.label,{a:'end',fs:13}) });
  return FIG.wrap(o,160,h,'style="max-width:180px"') };

// ================= NIVEAU 1 =================
L({id:'G01.sprongen',niv:1,dom:'G',sub:'getalbegrip',naam:'Sprongen: tel verder met 2, 5 of 10',
  uitleg:'Kijk hoe groot de sprong is. Van 4 naar 6 is een sprong van 2. Doe dezelfde sprong nog een keer.',
  gen(r){ const s=r.pick([2,2,5,10]); const b=s===10?r.pick([10,20,30]):s===5?r.pick([0,5,10]):r.int(1,8); return {s,b,rij:[0,1,2,3].map(i=>b+i*s)} },
  vraag:v=>`Welk getal komt hierna? ${v.rij.join(', ')}, …`,
  antw:v=>v.b+4*v.s,
  stappen:v=>[st(`De sprong is ${v.s}`,v.s),st(`${v.rij[3]} + ${v.s} = ${v.b+4*v.s}`,v.b+4*v.s)],
  fouten:v=>[[v.rij[3]+1,'Je telde één verder. Kijk hoe groot de sprong is.'],[v.rij[3]+2*v.s,'Je sprong twee keer. Er komt maar één getal bij.'],[v.rij[3],'Dat getal staat er al. Wat komt erna?']],
  anders:v=>`Zeg de rij hardop: ${v.rij.join(', ')}. Elke keer komt er ${v.s} bij.`
});
L({id:'G01.groter',niv:1,dom:'G',sub:'getalbegrip',naam:'Welk getal is het grootst?',
  uitleg:'Kijk eerst naar het tiental. Een getal met een tiental (zoals 13) is groter dan een getal zonder tiental (zoals 9).',
  gen(r){ let t; do{ t=r.shuffle([11,12,13,14,15,16,17,18,19,20]).slice(0,2) }while(Math.abs(t[0]-t[1])<2); return {e:r.int(7,9),t,d:r.int(2,6)} },
  vraag:v=>`Welk getal is het grootst?`,
  opties:v=>{ const g=Math.max(...v.t), k=Math.min(...v.t); return uniekOpties(String(g),[[String(v.e),`${v.e} is een groot cijfer, maar ${g} heeft een tiental. Dat is meer.`],[String(k),`${k} is kleiner dan ${g}. Kijk naar het tweede cijfer.`],[String(v.d),`${v.d} is juist een klein getal.`]]) },
  anders:v=>({tekst:'Zoek de getallen op de getallenlijn. Hoe verder naar rechts, hoe groter.',svg:FIG.lijn(0,20,1,[{x:v.e,label:String(v.e)},{x:v.t[0],label:String(v.t[0])},{x:v.t[1],label:String(v.t[1])}],5)})
});
L({id:'G01.dubbel',niv:1,dom:'G',sub:'bewerkingen',naam:'Dubbelen en bijna-dubbelen',verwar:['G01.plusmin'],
  uitleg:'Dubbelen ken je uit je hoofd: 6 + 6 = 12. Bij 6 + 7 is het één meer: 13.',
  gen(r){ const a=r.int(2,9),bijna=r.ja(.6); return {a,b:bijna?a+1:a} },
  vraag:v=>`${v.a} + ${v.b} = ?`,
  antw:v=>v.a+v.b,
  stappen:v=>v.a===v.b?[st(`Dubbel ${v.a} = ${2*v.a}`,2*v.a)]:[st(`Dubbel ${v.a} = ${2*v.a}`,2*v.a),st(`En nog 1 erbij: ${2*v.a+1}`,2*v.a+1)],
  fouten:v=>zonderGelijk(v.a+v.b,[[2*v.a,'Dat is dubbel '+v.a+'. Er komt er nog één bij.'],[v.a+v.b+1,'Eén te veel. Kijk goed: is het dubbel of bijna dubbel?'],[v.a+v.b-1,'Eén te weinig. Tel nog eens.'],[2*v.b+1,'Begin bij dubbel '+v.a+'.']]),
  anders:v=>`Denk aan je handen of een dobbelsteen: ${v.a} en ${v.a} is ${2*v.a}.${v.a!==v.b?' Daarna nog 1 erbij.':''}`
});
L({id:'M01.vormen',niv:1,dom:'M',sub:'meetkunde',naam:'Vormen: hoeveel hoeken?',
  uitleg:'Een hoek is een punt waar twee rechte randen samenkomen. Tel ze rond, en begin bij een hoek die je onthoudt.',
  gen(r){ const [n,naam,recht]=r.pick([[3,'driehoek',false],[4,'vierkant',false],[4,'rechthoek',true],[5,'vijfhoek',false],[6,'zeshoek',false]]); return {n,naam,recht} },
  vraag:v=>`Hoeveel hoeken heeft deze vorm?`,
  fig:v=>FIG.vorm(v.n,v.recht),
  antw:v=>v.n,
  stappen:v=>[st(`Tel de punten rond: ${Array.from({length:v.n},(x,i)=>i+1).join(', ')}`,v.n)],
  fouten:v=>[[v.n+1,'Je telde de eerste hoek twee keer. Leg je vinger op de hoek waar je begint.'],[v.n-1,'Je bent er één vergeten. Tel rond tot je terug bent.'],[2*v.n,'Je telde de randen en de hoeken samen. Alleen de punten zijn hoeken.']],
  anders:v=>`Dit is een ${v.naam}. Zet een stip op elke hoek en tel de stippen.`
});
L({id:'B01.kalender',niv:1,dom:'B',sub:'tabellen',naam:'Dagen van de week',
  uitleg:'De week gaat zo: maandag, dinsdag, woensdag, donderdag, vrijdag, zaterdag, zondag. Na zondag begint het weer bij maandag.',
  gen(r){ return {d:r.int(0,6),k:r.int(1,3),na:r.ja(.75)} },
  vraag:v=>v.na?`Vandaag is het ${DAGEN[v.d]}. Welke dag is het over ${v.k===1?'1 dag':v.k+' dagen'}?`:`Vandaag is het ${DAGEN[v.d]}. Welke dag was het gisteren?`,
  opties:v=>{ const z=v.na?v.k:-1, g=DAGEN[(v.d+z+7)%7]; return uniekOpties(g,[[DAGEN[v.d],'Dat is vandaag.'],[DAGEN[(v.d+z+(v.na?1:-1)+7)%7],'Je ging één dag te ver.'],[DAGEN[(v.d-z+7)%7],v.na?'Je ging terug. Over een paar dagen is later.':'Gisteren is één dag eerder, niet later.']]) },
  anders:v=>`Zeg de dagen op en begin bij ${DAGEN[v.d]}. ${v.na?'Tel '+v.k+' verder.':'Ga één terug.'}`
});

// ================= NIVEAU 2 =================
L({id:'G02.halveren',niv:2,dom:'G',sub:'breuken',naam:'De helft van …',
  uitleg:'De helft is: eerlijk verdelen in 2 gelijke stukken. De helft van 16 is 8, want 8 + 8 = 16.',
  gen(r){ const h=r.int(3,20); const [e,m,i]=r.pick(SNOEP); return {h,n:2*h,m,i,k:kind(r)} },
  vraag:v=>`${v.k} heeft ${v.n} ${v.m}. De helft geeft ${v.k} aan een vriendje. Hoeveel ${v.m} krijgt het vriendje?`,
  antw:v=>v.h,
  stappen:v=>[st(`Helft = verdelen in 2`),st(`${v.h} + ${v.h} = ${v.n}, dus de helft is ${v.h}`,v.h)],
  fouten:v=>[[v.n*2,'Je nam het dubbele. De helft is juist minder.'],[v.n-2,'Je haalde er 2 af. De helft is in 2 gelijke stukken verdelen.'],[v.h+1,'Bijna. Controleer: is '+(v.h+1)+' + '+(v.h+1)+' gelijk aan '+v.n+'?']],
  anders:v=>({tekst:`Verdeel ze om de beurt: één voor jou, één voor je vriendje. Of zoek het dubbel: welk getal + hetzelfde getal is ${v.n}?`,svg:FIG.strook(1,2)})
});
L({id:'G02.verschil',niv:2,dom:'G',sub:'bewerkingen',naam:'Hoeveel scheelt het?',
  uitleg:'Het verschil is hoeveel er nog bij moet. Van 8 naar 13 is 5. Je kunt optellen vanaf het kleine getal, of het kleine van het grote afhalen.',
  gen(r){ const a=r.int(4,12),d=r.int(3,9); const [n1,n2]=[kind(r),kind(r)]; return {a,b:a+d,d,n1,n2:n2===n1?'haar broer':n2,c:r.pick(['jaar','knikkers','stickers'])} },
  vraag:v=>v.c==='jaar'?`${v.n1} is ${v.a} jaar. ${v.n2[0].toUpperCase()+v.n2.slice(1)} is ${v.b} jaar. Hoeveel jaar scheelt dat?`:`${v.n1} heeft ${v.a} ${v.c}. ${v.n2[0].toUpperCase()+v.n2.slice(1)} heeft er ${v.b}. Hoeveel ${v.c} heeft ${v.n2} meer?`,
  antw:v=>v.d,
  stappen:v=>[st(`Van ${v.a} naar ${v.b}`),st(`${v.b} − ${v.a} = ${v.d}`,v.d)],
  fouten:v=>[[v.a+v.b,'Je telde ze bij elkaar. De vraag is hoeveel het scheelt.'],[v.d+1,'Je telde het begingetal mee. Spring van '+v.a+' naar '+v.b+' en tel de sprongen.'],[v.d-1,'Eén te weinig. Tel de sprongen nog eens.']],
  anders:v=>({tekst:`Begin bij ${v.a} op de getallenlijn en spring naar ${v.b}. Hoeveel sprongen zijn dat?`,svg:FIG.lijn(0,25,1,[{x:v.a,label:String(v.a)},{x:v.b,label:String(v.b),k:'b'}],5)}),
  sab:v=>({intro:`${v.n1} heeft ${v.a} en ${v.n2} heeft ${v.b}. Bram rekent uit hoeveel het scheelt.`,stappen:[`De getallen zijn ${v.a} en ${v.b}.`,`Ik doe ${v.a} + ${v.b} = ${v.a+v.b}.`,`Het scheelt ${v.a+v.b}.`],fout:1,juist:v.d,check:v.a+v.b,vraag:'Hoeveel scheelt het echt?',uitleg:'Bij hoeveel het scheelt doe je min, of je telt door vanaf het kleine getal.',goed:[`${v.b} − ${v.a} = ${v.d}`]})
});
L({id:'M02.vormen3d',niv:2,dom:'M',sub:'meetkunde',naam:'Ruimtefiguren: kubus, bol, cilinder',
  uitleg:'Een kubus heeft 6 vierkante vlakken (zoals een dobbelsteen). Een bol is overal rond (een bal). Een cilinder heeft twee ronde vlakken (een blik). Een balk heeft rechthoeken (een doos).',
  gen(r){ return {x:r.pick([['🎲','een dobbelsteen','kubus'],['⚽','een voetbal','bol'],['🥫','een blik soep','cilinder'],['📦','een schoenendoos','balk'],['🍦','een ijshoorntje','kegel']])} },
  vraag:v=>`Welke vorm heeft ${v.x[1]} ${v.x[0]}?`,
  opties:v=>{ const fb={kubus:'Een kubus heeft zes gelijke vierkanten, zoals een dobbelsteen.',bol:'Een bol is overal rond. Hij heeft geen platte kant.',cilinder:'Een cilinder heeft boven en onder een rondje, zoals een blik.',balk:'Een balk is een doos met rechthoeken. Niet alle kanten zijn even lang.',kegel:'Een kegel heeft een punt en een rond vlak.'};
    const verwar={kubus:['balk','cilinder','bol'],bol:['cilinder','kegel','kubus'],cilinder:['bol','balk','kegel'],balk:['kubus','cilinder','kegel'],kegel:['cilinder','bol','kubus']}[v.x[2]];
    return uniekOpties(v.x[2],verwar.map(w=>[w,fb[w]])) },
  anders:v=>`Pak in gedachten ${v.x[1]} vast. Is hij overal rond, heeft hij platte vierkanten of rechthoeken, of een rond vlak?`
});
L({id:'M02.kannen',niv:2,dom:'M',sub:'inhoud',naam:'Inhoud: hoeveel bekers?',verwar:['G02.verschil'],
  uitleg:'Inhoud is hoeveel erin past. Gaan er in één kan 4 bekers, dan gaan er in 3 kannen 4 + 4 + 4 = 12 bekers.',
  gen(r){ let a,b; do{ a=r.int(2,5); b=r.int(2,4) }while(a===2&&b===2); return {a,b,w:r.pick(['limonade','water','melk'])} },
  vraag:v=>`Met één kan ${v.w} vul je ${v.a} bekers. Hoeveel bekers vul je met ${v.b} kannen?`,
  fig:v=>FIG.groepjes(v.b,v.a,'🥤'),
  antw:v=>v.a*v.b,
  stappen:v=>[st(Array(v.b).fill(v.a).join(' + ')),st(`= ${v.a*v.b}`,v.a*v.b)],
  fouten:v=>zonderGelijk(v.a*v.b,[[v.a+v.b,'Je telde de kannen en de bekers bij elkaar. Elke kan geeft '+v.a+' bekers.'],[v.a*(v.b+1),'Je deed één kan te veel.'],[v.a*(v.b-1),'Je vergat één kan.']]),
  anders:v=>`Teken ${v.b} kannen en zet bij elke kan ${v.a} streepjes. Tel alle streepjes.`,
  sab:v=>({intro:`Met één kan vul je ${v.a} bekers. Noor rekent uit hoeveel bekers ${v.b} kannen zijn.`,stappen:[`Eén kan is ${v.a} bekers.`,`Er zijn ${v.b} kannen, dus ${v.a} + ${v.b} = ${v.a+v.b}.`,`Antwoord: ${v.a+v.b} bekers.`],fout:1,juist:v.a*v.b,check:v.a+v.b,vraag:'Hoeveel bekers zijn het echt?',uitleg:'Elke kan geeft '+v.a+' bekers. Dus tel je '+v.b+' keer '+v.a+'.',goed:[`${Array(v.b).fill(v.a).join(' + ')} = ${v.a*v.b}`]})
});
L({id:'M02.hokjes',niv:2,dom:'M',sub:'oppervlak',naam:'Oppervlakte: hokjes tellen',
  uitleg:'Oppervlakte is hoeveel hokjes de figuur bedekt. Tel rij voor rij: 3 rijen van 5 is 5, 10, 15.',
  gen(r){ return {b:r.int(3,6),h:r.int(2,4)} },
  vraag:v=>`Hoeveel hokjes is deze rechthoek groot?`,
  fig:v=>FIG.hokjes(v.b,v.h),
  antw:v=>v.b*v.h,
  stappen:v=>[st(`${v.h} rijen van ${v.b}`),st(Array(v.h).fill(v.b).join(' + ')+` = ${v.b*v.h}`,v.b*v.h)],
  fouten:v=>zonderGelijk(v.b*v.h,[[2*v.b+2*v.h-4,'Je telde alleen de hokjes aan de rand. De hokjes in het midden tellen ook.'],[v.b+v.h,'Je telde één rij en één kolom. Tel alle rijen.'],[v.b*(v.h-1),'Je bent een rij vergeten.']]),
  anders:v=>`Tel de bovenste rij: ${v.b}. Hoeveel rijen zijn er? Tel dan steeds ${v.b} erbij.`
});
L({id:'B02.kalender',niv:2,dom:'B',sub:'tabellen',naam:'Kalender: over een week',
  uitleg:'Een week heeft 7 dagen. Over een week is de datum 7 hoger. Over twee weken 14 hoger.',
  gen(r){ const w=r.pick([1,1,2]); return {w,d:r.int(1,31-7*w),m:r.pick(MAANDEN.filter((x,i)=>i!==1)),k:kind(r),f:r.pick(['een feestje','zwemles','een schoolreisje','de tandarts'])} },
  vraag:v=>`Het is vandaag ${v.d} ${v.m}. ${v.k} heeft over ${v.w===1?'een week':'twee weken'} ${v.f}. Welke datum is dat?`,
  antw:v=>v.d+7*v.w, toon:(x,v)=>x+' '+v.m,
  stappen:v=>[st(`${v.w===1?'Een week':'Twee weken'} = ${7*v.w} dagen`,7*v.w),st(`${v.d} + ${7*v.w} = ${v.d+7*v.w}`,v.d+7*v.w)],
  fouten:v=>[[v.d+v.w,'Je telde '+v.w+' dag. Een week heeft 7 dagen.'],[v.d+5*v.w,'Je telde alleen de schooldagen. Een week heeft 7 dagen.'],[v.d+7*v.w+1,'Je telde vandaag mee. Begin te tellen bij morgen.']],
  anders:v=>`Op een kalender staat dezelfde dag van de week recht onder elkaar. Eén rij lager is 7 dagen later.`
});

// ================= NIVEAU 3 =================
L({id:'G03.plaatswaarde',niv:3,dom:'G',sub:'getalbegrip',naam:'Wat is een cijfer waard?',
  uitleg:'Hoeveel een cijfer waard is, hangt af van de plek. In 347 is de 3 driehonderd, de 4 veertig en de 7 zeven.',
  gen(r){ let h,t,e; do{ h=r.int(1,9);t=r.int(1,9);e=r.int(1,9) }while(new Set([h,t,e]).size<3); const p=r.pick(['h','t']); return {h,t,e,p,n:100*h+10*t+e} },
  vraag:v=>`Hoeveel is de ${v.p==='h'?v.h:v.t} waard in het getal ${v.n}?`,
  fig:v=>FIG.blokjes(v.h,v.t,v.e),
  antw:v=>v.p==='h'?100*v.h:10*v.t,
  stappen:v=>[st(`${v.n} = ${100*v.h} + ${10*v.t} + ${v.e}`),st(`De ${v.p==='h'?v.h+' staat op de plek van de honderdtallen':v.t+' staat op de plek van de tientallen'}: ${v.p==='h'?100*v.h:10*v.t}`,v.p==='h'?100*v.h:10*v.t)],
  fouten:v=>v.p==='h'?[[v.h,'Dat is het cijfer. Het staat op de plek van de honderden.'],[10*v.h,'Dat is de waarde op de plek van de tientallen. De '+v.h+' staat vooraan: honderdtallen.'],[100*v.h+10*v.t,'Je nam ook de tientallen mee.']]:[[v.t,'Dat is het cijfer. Het staat op de plek van de tientallen.'],[100*v.t,'Dat zou de waarde vooraan zijn. De '+v.t+' staat in het midden: tientallen.'],[10*v.h+v.t,'Dat is het aantal tientallen in het hele getal. De vraag is wat deze '+v.t+' waard is.']],
  anders:v=>`Zet het getal in een schema: H | T | E = ${v.h} | ${v.t} | ${v.e}. Een H is 100, een T is 10.`
});
L({id:'G03.breukvergelijk',niv:3,dom:'G',sub:'breuken',naam:'Welk stuk is groter?',
  uitleg:'Hoe meer stukken je maakt, hoe kleiner elk stuk. Een pizza in 8 stukken geeft kleinere stukken dan in 4 stukken. Dus 1/4 is groter dan 1/8.',
  gen(r){ let a,b; do{ a=r.pick([2,3,4,5,6,8,10]); b=r.pick([2,3,4,5,6,8,10]) }while(a===b); return {a,b,d:r.pick(['pizza','taart','reep chocola'])} },
  vraag:v=>`Twee kinderen krijgen een stuk van een even grote ${v.d}. De ene krijgt 1/${v.a}, de andere 1/${v.b}. Welk stuk is het grootst?`,
  fig:v=>FIG.strook(1,v.a)+FIG.strook(1,v.b),
  opties:v=>{ const g=Math.min(v.a,v.b), k=Math.max(v.a,v.b); return [[`1/${g}`,true],[`1/${k}`,false,`${k} is een groter getal, maar de ${v.d} is in meer stukken gesneden. Dan is elk stuk kleiner.`],['Ze zijn even groot',false,'Het zijn allebei 1 stuk, maar de stukken zijn niet even groot.']] },
  anders:v=>`Vergelijk de stroken. Bij 1/${Math.max(v.a,v.b)} is de ${v.d} in meer stukken verdeeld. Kijk welk gekleurd stuk langer is.`
});
L({id:'G03.wisselgeld',niv:3,dom:'G',sub:'komma',naam:'Geld met een komma: wisselgeld',
  uitleg:'€ 2,50 is 2 euro en 50 cent. Bij terugrekenen: van € 2,50 naar € 3 is 50 cent, en dan nog naar € 5.',
  gen(r){ const a=r.pick([5,10]); const e=r.int(1,a===5?3:7), c=r.pick([25,50,75]); return {a,b:e+c/100,e,c,d:r.pick(['een boek','een ijsje en een drankje','een cadeautje','een kaartje voor het zwembad'])} },
  vraag:v=>`Je betaalt ${v.d} van ${eur(v.b)} met een briefje van € ${v.a}. Hoeveel geld krijg je terug?`,
  antw:v=>rondaf(v.a-v.b,2), eenheid:'€',
  stappen:v=>[st(`Van ${eur(v.b)} naar € ${v.e+1} is ${100-v.c} cent`,rondaf(1-v.c/100,2)),st(`Van € ${v.e+1} naar € ${v.a} is € ${v.a-v.e-1}`,v.a-v.e-1),st(`Samen ${eur(v.a-v.b)}`,rondaf(v.a-v.b,2))],
  fouten:v=>[[rondaf(v.a-v.e+v.c/100,2),'Je haalde de euro’s eraf, maar telde de centen erbij. De centen moeten er ook af.'],[v.a-v.e,'Je vergat de centen.'],[rondaf(v.a-v.e-1+v.c/100,2),'Je verwisselde de centen. Van '+v.c+' cent naar een hele euro is '+(100-v.c)+' cent.']],
  anders:v=>({tekst:`Tel op vanaf de prijs, zoals in een winkel: ${eur(v.b)}, dan naar € ${v.e+1}, dan naar € ${v.a}.`,svg:FIG.munten([v.a])}),
  sab:v=>({intro:`${v.d[0].toUpperCase()+v.d.slice(1)} kost ${eur(v.b)}. Je betaalt met € ${v.a}. Saar rekent het wisselgeld uit.`,stappen:[`Ik haal eerst de euro’s eraf: ${v.a} − ${v.e} = ${v.a-v.e}.`,`De ${v.c} cent tel ik erbij: ${eur(v.a-v.e+v.c/100)}.`,`Ik krijg ${eur(v.a-v.e+v.c/100)} terug.`],fout:1,juist:rondaf(v.a-v.b,2),check:rondaf(v.a-v.e+v.c/100,2),eenheid:'€',vraag:'Hoeveel krijg je echt terug?',uitleg:'De centen horen bij de prijs, dus die moeten er ook af. Tel liever op vanaf de prijs.',goed:[`${eur(v.b)} + ${eur(1-v.c/100)} = € ${v.e+1}`,`€ ${v.e+1} + € ${v.a-v.e-1} = € ${v.a}`,`Terug: ${eur(v.a-v.b)}`]})
});
L({id:'V03.kaart',niv:3,dom:'V',sub:'schaal',naam:'Kaart lezen: 1 cm is …',
  uitleg:'Op een kaart is alles kleiner. Staat er "1 cm = 100 m", dan is elke centimeter op de kaart 100 meter in het echt.',
  gen(r){ const s=r.pick([10,50,100,200,500]); return {s,c:r.int(2,9),w:r.pick(['van school naar de speeltuin','van huis naar de bakker','over het pad in het park','van de camping naar het strand'])} },
  vraag:v=>`Op een kaart is 1 cm in het echt ${v.s} meter. De weg ${v.w} is op de kaart ${v.c} cm. Hoeveel meter is dat in het echt?`,
  antw:v=>v.c*v.s, eenheid:'m',
  stappen:v=>[st(`1 cm → ${v.s} m`,v.s),st(`${v.c} cm → ${v.c} × ${v.s} = ${v.c*v.s} m`,v.c*v.s)],
  tabel:v=>({kop:['cm op de kaart','meter in het echt'],rijen:[[1,v.s],[v.c,v.c*v.s]],leeg:[[1,1]]}),
  fouten:v=>[[v.c+v.s,'Je telde op. Elke centimeter is '+v.s+' meter, dus het is keer.'],[v.c*v.s*10,'Eén nul te veel. Reken '+v.c+' × '+v.s+'.'],[v.s,'Dat is 1 cm. De weg is '+v.c+' cm.']],
  anders:v=>`Maak een tabel: 1 cm is ${v.s} m, 2 cm is ${2*v.s} m, … Ga door tot ${v.c} cm.`,
  sab:v=>({intro:`Op de kaart is 1 cm in het echt ${v.s} meter. De weg is ${v.c} cm. Finn rekent het uit.`,stappen:[`1 cm is ${v.s} m.`,`${v.c} cm is ${v.s} + ${v.c} = ${v.s+v.c} m.`,`De weg is ${v.s+v.c} meter.`],fout:1,juist:v.c*v.s,check:v.c+v.s,eenheid:'m',vraag:'Hoeveel meter is de weg echt?',uitleg:'Elke centimeter op de kaart is '+v.s+' meter. Dan doe je keer, niet plus.',goed:[`${v.c} × ${v.s} = ${v.c*v.s} m`]})
});
L({id:'M03.flessen',niv:3,dom:'M',sub:'inhoud',naam:'Liters: halve en kwart liters',
  uitleg:'In 1 liter gaan 2 halve liters, of 4 kwart liters. In 3 liter gaan dus 6 halve liters.',
  gen(r){ return {l:r.int(2,6),q:r.pick([2,4]),d:r.pick(['een pan soep','een emmer','een grote kan','een teiltje'])} },
  vraag:v=>`Je vult ${v.d} van ${v.l} liter met flesjes van ${v.q===2?'een halve liter':'een kwart liter'}. Hoeveel flesjes heb je nodig?`,
  antw:v=>v.l*v.q,
  stappen:v=>[st(`In 1 liter gaan ${v.q} flesjes`,v.q),st(`${v.l} × ${v.q} = ${v.l*v.q}`,v.l*v.q)],
  fouten:v=>[[v.l/v.q,'Je deelde. Het flesje is kleiner dan een liter, dus je hebt er juist meer nodig.'],[v.l+v.q,'Je telde op. Per liter heb je '+v.q+' flesjes nodig.'],[v.l*(v.q===2?4:2),v.q===2?'Een halve liter: daar gaan er 2 van in een liter, niet 4.':'Een kwart liter: daar gaan er 4 van in een liter, niet 2.']].filter(x=>Number.isFinite(x[0])),
  anders:v=>`Teken ${v.l} liters naast elkaar en verdeel elke liter in ${v.q} stukken. Tel alle stukken.`
});
L({id:'M03.symmetrie',niv:3,dom:'M',sub:'meetkunde',naam:'Symmetrie: spiegelen',
  uitleg:'Een figuur is symmetrisch als je hem zo kunt vouwen dat de twee helften precies op elkaar passen. De vouwlijn heet spiegelas.',
  gen(r){ return {g:r.pick(['A','H','M','O','T','U','V','W','X','Y']),f:r.shuffle(['F','G','J','L','N','P','R','S','Z']).slice(0,3)} },
  vraag:v=>`Welke letter is symmetrisch? Je kunt hem dan dubbelvouwen zodat de helften precies op elkaar passen.`,
  opties:v=>[[v.g,true]].concat(v.f.map(x=>[x,false,['N','S','Z'].includes(x)?`De ${x} ziet er hetzelfde uit als je hem omdraait, maar vouwen lukt niet: de helften passen niet op elkaar.`:`Vouw de ${x} in gedachten dubbel. De twee helften passen niet op elkaar.`])),
  anders:v=>`Zet een spiegeltje midden op de letter ${v.g}. Zie je dan weer de hele letter? Dan is hij symmetrisch.`
});

// ================= NIVEAU 4 =================
L({id:'G04.negatief',niv:4,dom:'G',sub:'negatief',naam:'Onder nul: temperatuur',
  uitleg:'Onder nul tel je met een minteken: −3 °C is 3 graden onder nul. Van −3 naar 5 ga je eerst 3 omhoog naar 0, dan nog 5.',
  gen(r){ const a=r.int(1,8),b=r.int(2,10); return {a,b,w:r.pick(['’s nachts','vanochtend vroeg'])} },
  vraag:v=>`Het was ${v.w} −${v.a} °C. ’s Middags is het ${v.b} °C. Hoeveel graden is het warmer geworden?`,
  fig:v=>FIG.thermo(-10,15,[{t:-v.a,label:'−'+v.a},{t:v.b,label:String(v.b)}]),
  antw:v=>v.a+v.b, eenheid:'graden',
  stappen:v=>[st(`Van −${v.a} naar 0: ${v.a} graden`,v.a),st(`Van 0 naar ${v.b}: ${v.b} graden`,v.b),st(`Samen: ${v.a+v.b} graden`,v.a+v.b)],
  fouten:v=>zonderGelijk(v.a+v.b,[[Math.abs(v.b-v.a),'Je deed '+v.b+' − '+v.a+'. Maar −'+v.a+' ligt onder nul: je moet eerst naar 0 en dan verder.'],[v.a+v.b+1,'Je telde de 0 twee keer.'],[v.b,'Je begon bij 0. Het begon onder nul.']]),
  anders:v=>`Kijk op de thermometer. Tel de streepjes van −${v.a} omhoog tot ${v.b}.`
});
L({id:'G04.deelsom',niv:4,dom:'G',sub:'bewerkingen',naam:'Delen door splitsen',
  uitleg:'Grote deelsommen splits je in handige stukken. 96 : 4 = 80 : 4 + 16 : 4 = 20 + 4 = 24.',
  gen(r){ let d,q; do{ d=r.int(3,8); q=r.int(12,29) }while(d*q>200); const n=d*q, s=d*10*Math.floor(q/10); return {d,q,n,s,k:kind(r),m:r.pick(['stickers','kaartjes','knikkers','punaises'])} },
  vraag:v=>`${v.k} verdeelt ${v.n} ${v.m} eerlijk over ${v.d} vriendjes. Hoeveel ${v.m} krijgt ieder?`,
  antw:v=>v.q,
  stappen:v=>[st(`${v.n} = ${v.s} + ${v.n-v.s}`),st(`${v.s} : ${v.d} = ${v.s/v.d}`,v.s/v.d),st(`${v.n-v.s} : ${v.d} = ${(v.n-v.s)/v.d}`,(v.n-v.s)/v.d),st(`${v.s/v.d} + ${(v.n-v.s)/v.d} = ${v.q}`,v.q)],
  fouten:v=>zonderGelijk(v.q,[[v.s/v.d,'Je deelde alleen het eerste stuk ('+v.s+'). De rest moet ook verdeeld worden.'],[v.n-v.d,'Je deed min. Eerlijk verdelen is delen.'],[v.q+1,'Controleer: '+(v.q+1)+' × '+v.d+' = '+(v.q+1)*v.d+', dat is te veel.']]),
  anders:v=>`Deel eerst ${v.s} (dat gaat makkelijk), dan de rest: ${v.n-v.s}.`
});
L({id:'M04.tijdsduur',niv:4,dom:'M',sub:'tijd',naam:'Hoe lang duurt het? Rekenen met de klok',
  uitleg:'Een uur heeft 60 minuten, niet 100. Reken in stappen: van 18:45 naar 19:00 is 15 minuten, van 19:00 naar 20:00 is 60, van 20:00 naar 20:10 is 10.',
  gen(r){ const u=r.int(9,18); let m,d; do{ m=r.pick([15,30,40,45,50]); d=r.pick([35,50,70,75,85,95,110]) }while(m+d<60); const e=u*60+m+d; return {u,m,d,eu:Math.floor(e/60),em:e%60,w:r.pick(['De film','Het voetbaltoernooi','De schoolvoorstelling','De zwemles'])} },
  vraag:v=>`${v.w} begint om ${v.u}:${String(v.m).padStart(2,'0')} en is om ${v.eu}:${String(v.em).padStart(2,'0')} afgelopen. Hoeveel minuten duurt het?`,
  antw:v=>v.d, eenheid:'minuten',
  stappen:v=>{ const tot=60-v.m, vol=(v.eu-v.u-1)*60; return [st(`${v.u}:${String(v.m).padStart(2,'0')} → ${v.u+1}:00 is ${tot} min`,tot),st(`${v.u+1}:00 → ${v.eu}:00 is ${vol} min`,vol),st(`${v.eu}:00 → ${v.eu}:${String(v.em).padStart(2,'0')} is ${v.em} min`,v.em),st(`${tot} + ${vol} + ${v.em} = ${v.d}`,v.d)] },
  fouten:v=>zonderGelijk(v.d,[[(v.eu*100+v.em)-(v.u*100+v.m),'Je rekende alsof een uur 100 minuten heeft. Een uur heeft 60 minuten.'],[v.d-60,'Je bent een uur vergeten.'],[(v.eu-v.u)*60,'Je keek alleen naar de uren.']]),
  anders:v=>({tekst:'Spring op een tijdlijn naar het volgende hele uur, dan per uur, dan de laatste minuten.',svg:FIG.klok(v.u,v.m)}),
  sab:v=>({intro:`${v.w} begint om ${v.u}:${String(v.m).padStart(2,'0')} en eindigt om ${v.eu}:${String(v.em).padStart(2,'0')}. Daan rekent uit hoelang het duurt.`,stappen:[`Ik haal de tijden van elkaar af.`,`${v.eu}${String(v.em).padStart(2,'0')} − ${v.u}${String(v.m).padStart(2,'0')} = ${(v.eu*100+v.em)-(v.u*100+v.m)}.`,`Het duurt ${(v.eu*100+v.em)-(v.u*100+v.m)} minuten.`],fout:1,juist:v.d,check:(v.eu*100+v.em)-(v.u*100+v.m),eenheid:'minuten',vraag:'Hoeveel minuten duurt het echt?',uitleg:'Klokken rekenen niet met 100 maar met 60 minuten per uur. Spring naar het hele uur en tel verder.',goed:[`Naar ${v.u+1}:00 is ${60-v.m} min`,`Dan nog ${(v.eu-v.u-1)*60+v.em} min`,`Samen ${v.d} minuten`]})
});
L({id:'M04.hoeken',niv:4,dom:'M',sub:'meetkunde',naam:'Hoeken: scherp, recht of stomp',
  uitleg:'Een rechte hoek is precies een hoek van een blad papier (90°). Kleiner is een scherpe hoek, groter een stompe hoek.',
  gen(r){ const g=r.pick([30,40,50,60,90,90,110,120,135,150]); return {g} },
  vraag:v=>`Wat voor hoek is dit?`,
  fig:v=>FIG.hoek(v.g),
  opties:v=>{ const s=v.g<90?'scherpe hoek':v.g===90?'rechte hoek':'stompe hoek'; return [[s,true]].concat(['scherpe hoek','rechte hoek','stompe hoek'].filter(x=>x!==s).map(x=>[x,false,x==='rechte hoek'?'Leg de hoek van een blad papier erop. Past hij precies? Dan is hij recht. Hier niet.':x==='scherpe hoek'?'Een scherpe hoek is kleiner dan de hoek van een blad papier. Deze is groter.':'Een stompe hoek is groter dan de hoek van een blad papier. Deze is kleiner.'])) },
  anders:v=>`Houd de hoek van een blad papier in de hoek. ${v.g<90?'De hoek is smaller dan het papier.':v.g===90?'Hij past precies.':'De hoek is wijder dan het papier.'}`
});
L({id:'B04.taxi',niv:4,dom:'B',sub:'formules',naam:'Rekenregel: vast bedrag plus per stuk',
  uitleg:'Bij veel prijzen betaal je een vast bedrag en dan nog per kilometer of per uur. Reken eerst het deel per stuk uit en tel dan het vaste bedrag erbij.',
  gen(r){ const [w,eh,vast,per]=r.pick([['Een taxirit','km',[3,4,5],[2,3]],['Een fiets huren','uur',[5,6,10],[2,3,4]],['Een feestje in de speeltuin','kind',[10,15,20],[4,5,6]]]); return {w,eh,v:r.pick(vast),p:r.pick(per),n:r.int(3,9)} },
  vraag:v=>`${v.w} kost € ${v.v} vast en dan nog € ${v.p} per ${v.eh}. Wat kost het voor ${v.n} ${v.eh==='kind'?'kinderen':v.eh}?`,
  antw:v=>v.v+v.p*v.n, eenheid:'€',
  stappen:v=>[st(`${v.n} × € ${v.p} = € ${v.n*v.p}`,v.n*v.p),st(`€ ${v.n*v.p} + € ${v.v} = € ${v.v+v.p*v.n}`,v.v+v.p*v.n)],
  fouten:v=>zonderGelijk(v.v+v.p*v.n,[[(v.v+v.p)*v.n,'Je deed het vaste bedrag ook '+v.n+' keer. Dat betaal je maar één keer.'],[v.p*v.n,'Je vergat het vaste bedrag van € '+v.v+'.'],[v.v*v.n+v.p,'Je verwisselde het vaste bedrag en het bedrag per '+v.eh+'.']]),
  anders:v=>`Maak een tabel: 1 ${v.eh} kost € ${v.v} + € ${v.p} = € ${v.v+v.p}. Bij elke ${v.eh} erbij komt er € ${v.p} bij.`,
  sab:v=>({intro:`${v.w} kost € ${v.v} vast en € ${v.p} per ${v.eh}. Lotte rekent de prijs voor ${v.n} uit.`,stappen:[`Vast + per ${v.eh} = € ${v.v} + € ${v.p} = € ${v.v+v.p}.`,`Dat ${v.n} keer: ${v.n} × € ${v.v+v.p} = € ${(v.v+v.p)*v.n}.`,`Het kost € ${(v.v+v.p)*v.n}.`],fout:1,juist:v.v+v.p*v.n,check:(v.v+v.p)*v.n,eenheid:'€',vraag:'Wat kost het echt?',uitleg:'Het vaste bedrag betaal je maar één keer. Alleen het bedrag per '+v.eh+' doe je '+v.n+' keer.',goed:[`${v.n} × € ${v.p} = € ${v.n*v.p}`,`€ ${v.n*v.p} + € ${v.v} = € ${v.v+v.p*v.n}`]})
});
L({id:'B04.gemiddelde',niv:4,dom:'B',sub:'statistiek',naam:'Het gemiddelde: eerlijk verdelen',
  uitleg:'Het gemiddelde vind je zo: tel alles op en deel door hoeveel getallen er zijn. Het is alsof je alles eerlijk verdeelt.',
  gen(r){ let w; do{ w=Array.from({length:r.pick([3,4])},()=>r.int(2,12)) }while(w.reduce((a,b)=>a+b,0)%w.length!==0||new Set(w).size<2); return {w,k:kind(r),c:r.pick(['punten bij een spelletje','doelpunten per wedstrijd','bladzijden lezen per dag'])} },
  vraag:v=>`${v.k} houdt bij: ${v.c}. Dat is ${v.w.slice(0,-1).join(', ')} en ${v.w[v.w.length-1]}. Wat is het gemiddelde?`,
  fig:v=>FIG.staaf(v.w.map((x,i)=>String(i+1)),v.w,{ymax:12,ys:2}),
  antw:v=>v.w.reduce((a,b)=>a+b,0)/v.w.length,
  stappen:v=>{ const s=v.w.reduce((a,b)=>a+b,0); return [st(`${v.w.join(' + ')} = ${s}`,s),st(`${s} : ${v.w.length} = ${s/v.w.length}`,s/v.w.length)] },
  fouten:v=>{ const s=v.w.reduce((a,b)=>a+b,0); return zonderGelijk(s/v.w.length,[[s,'Dat is het totaal. Deel nog door het aantal getallen ('+v.w.length+').'],[Math.max(...v.w)-Math.min(...v.w),'Dat is het verschil tussen grootste en kleinste. Het gemiddelde is: alles samen, gedeeld door het aantal.'],[s/(v.w.length-1),'Je deelde door één te weinig. Er zijn '+v.w.length+' getallen.'],[(v.w[0]+v.w[v.w.length-1])/2,'Je nam alleen het eerste en het laatste getal.']]) },
  anders:v=>`Maak de staven even hoog: haal van de hoge staven af en geef het aan de lage. Hoe hoog worden ze dan allemaal?`
});

// ================= NIVEAU 5 =================
L({id:'G05.kommavergelijk',niv:5,dom:'G',sub:'komma',naam:'Kommagetallen vergelijken',
  uitleg:'Vergelijk kommagetallen cijfer voor cijfer, van links naar rechts. Maak ze even lang: 0,5 = 0,500 en 0,45 = 0,450. Dan zie je dat 0,5 groter is.',
  gen(r){ const s=r.pick([['0,5','0,45','0,125','0,09'],['0,8','0,75','0,625','0,08'],['1,3','1,25','1,175','1,05'],['2,6','2,55','2,456','2,06'],['0,7','0,65','0,666','0,07']]); return {s,volg:r.shuffle(s.slice())} },
  vraag:v=>`Welk getal is het grootst? ${v.volg.join('  ·  ')}`,
  opties:v=>[[v.s[0],true],[v.s[2],false,'Meer cijfers achter de komma betekent niet groter. Maak ze even lang: '+v.s[0]+'00 is groter dan '+v.s[2]+'.'],[v.s[1],false,'Kijk naar het eerste cijfer achter de komma: daar wint '+v.s[0]+'.'],[v.s[3],false,'Bij '+v.s[3]+' staat er een 0 direct achter de komma. Dat is heel weinig.']],
  anders:v=>`Denk aan geld of meters: ${v.s[0]} is ${v.s[0].split(',')[1]}0 cent achter de komma, ${v.s[1]} is ${v.s[1].split(',')[1]} cent.`
});
L({id:'G05.negatief',niv:5,dom:'G',sub:'negatief',naam:'Rekenen onder nul',negatief:true,
  uitleg:'Onder nul wordt kouder meer min. Van −4 en 7 graden kouder ga je 7 stappen omlaag: −11.',
  gen(r){ const a=r.int(1,9),b=r.int(2,9),op=r.pick(['kouder','warmer']); return {a,b,op,w:r.pick(['Op de berg','In de vriezer','In Lapland','Op het ijs'])} },
  vraag:v=>`${v.w} is het −${v.a} °C. Het wordt ${v.b} graden ${v.op}. Hoeveel graden is het dan?`,
  antw:v=>v.op==='kouder'?-v.a-v.b:-v.a+v.b, eenheid:'°C',
  stappen:v=>v.op==='kouder'?[st(`−${v.a} − ${v.b}`),st(`= −${v.a+v.b}`,-v.a-v.b)]:[st(`−${v.a} + ${v.b}`),st(`= ${v.b-v.a<0?'−'+(v.a-v.b):v.b-v.a}`,v.b-v.a)],
  fouten:v=>{ const g=v.op==='kouder'?-v.a-v.b:-v.a+v.b; return zonderGelijk(g,v.op==='kouder'?[[v.b-v.a,'Kouder betekent omlaag. Je ging omhoog.'],[v.a+v.b,'Je vergat het minteken. Onder nul is min.'],[-(Math.abs(v.b-v.a)),'Je deed '+v.b+' − '+v.a+'. Vanaf −'+v.a+' ga je nog verder omlaag.']]:[[-v.a-v.b,'Warmer betekent omhoog. Je ging omlaag.'],[v.a+v.b,'Je telde '+v.a+' en '+v.b+' op. Maar je begint onder nul.'],[-(v.b-v.a),'Let op het teken: kom je boven nul of blijf je eronder?']]) },
  fig:v=>FIG.thermo(-20,10,[{t:-v.a,label:'−'+v.a}]),
  anders:v=>`Kijk op de thermometer. Begin bij −${v.a} en tel ${v.b} streepjes ${v.op==='kouder'?'omlaag':'omhoog'}.`,
  sab:v=>({intro:`${v.w} is het −${v.a} °C. Het wordt ${v.b} graden ${v.op}. Mohammed rekent het uit.`,stappen:[`Ik begin bij −${v.a}.`,v.op==='kouder'?`${v.b} kouder: ${v.b} − ${v.a} = ${v.b-v.a<0?'−'+(v.a-v.b):v.b-v.a}.`:`${v.b} warmer: −${v.a} − ${v.b} = −${v.a+v.b}.`,`Het is dan ${v.op==='kouder'?(v.b-v.a<0?'−'+(v.a-v.b):v.b-v.a):'−'+(v.a+v.b)} °C.`],fout:1,juist:v.op==='kouder'?-v.a-v.b:v.b-v.a,check:v.op==='kouder'?v.b-v.a:-v.a-v.b,eenheid:'°C',vraag:'Hoeveel graden is het echt?',uitleg:v.op==='kouder'?'Kouder is omlaag op de thermometer: daar wordt het getal onder nul groter.':'Warmer is omhoog op de thermometer.',goed:[v.op==='kouder'?`−${v.a} − ${v.b} = −${v.a+v.b}`:`−${v.a} + ${v.b} = ${v.b-v.a<0?'−'+(v.a-v.b):v.b-v.a}`]})
});
L({id:'V05.schaal',niv:5,dom:'V',sub:'schaal',naam:'Schaal 1 : 50.000 op de wandelkaart',
  uitleg:'Schaal 1 : 50.000 betekent: 1 cm op de kaart is 50.000 cm in het echt. Dat is 500 m, of 0,5 km. Streep nullen weg: cm → m is : 100, m → km is : 1000.',
  gen(r){ const s=r.pick([10000,25000,50000,100000]); const c=r.pick(s===10000?[5,10,15]:s===25000?[2,4,6,8]:[2,3,4,5,6,7]); return {s,c,w:r.pick(['de wandelroute','de fietstocht','het pad langs het meer','de route naar de uitkijktoren'])} },
  vraag:v=>`Een kaart heeft schaal 1 : ${nl(v.s)}. Op de kaart is ${v.w} ${v.c} cm lang. Hoeveel km is dat in het echt?`,
  antw:v=>v.c*v.s/100000, eenheid:'km', dec:2,
  stappen:v=>[st(`1 cm = ${nl(v.s)} cm = ${nl(v.s/100)} m`,v.s/100),st(`${v.c} cm → ${nl(v.c*v.s/100)} m`,v.c*v.s/100),st(`${nl(v.c*v.s/100)} m = ${nl(v.c*v.s/100000)} km`,v.c*v.s/100000)],
  fouten:v=>[[v.c*v.s,'Dat is in centimeters. Reken om naar km: : 100.000.'],[v.c*v.s/100,'Dat is in meters. Nog : 1000 voor km.'],[v.c*v.s/10000,'Er is een nul te weinig weggestreept. 1 km = 100.000 cm.']],
  anders:v=>`Onthoud: 1 : 100.000 betekent 1 cm = 1 km. Bij 1 : ${nl(v.s)} is 1 cm dus ${nl(v.s/100000)} km.`,
  sab:v=>({intro:`Schaal 1 : ${nl(v.s)}. Op de kaart is ${v.w} ${v.c} cm. Zoë rekent het om naar km.`,stappen:[`${v.c} × ${nl(v.s)} = ${nl(v.c*v.s)} cm.`,`Van cm naar km deel ik door 1000: ${nl(v.c*v.s/1000)} km.`,`De route is ${nl(v.c*v.s/1000)} km.`],fout:1,juist:v.c*v.s/100000,check:v.c*v.s/1000,eenheid:'km',vraag:'Hoeveel km is het echt?',uitleg:'Van cm naar m is : 100, van m naar km is : 1000. Samen : 100.000.',goed:[`${nl(v.c*v.s)} cm : 100 = ${nl(v.c*v.s/100)} m`,`${nl(v.c*v.s/100)} m : 1000 = ${nl(v.c*v.s/100000)} km`]})
});
L({id:'M05.aquarium',niv:5,dom:'M',sub:'inhoud',naam:'Inhoud van een bak in liters',
  uitleg:'Inhoud = lengte × breedte × hoogte. Reken in dm: 1 dm³ = 1 liter. Dus 50 cm × 30 cm × 40 cm = 5 × 3 × 4 dm = 60 liter.',
  gen(r){ return {l:r.pick([40,50,60,80,100]),b:r.pick([20,30,40]),h:r.pick([20,30,40,50]),d:r.pick(['Een aquarium','Een plantenbak','Een zandbak voor binnen','Een opbergbak'])} },
  vraag:v=>`${v.d} is ${v.l} cm lang, ${v.b} cm breed en ${v.h} cm hoog. Hoeveel liter past erin?`,
  antw:v=>v.l*v.b*v.h/1000, eenheid:'liter',
  stappen:v=>[st(`In dm: ${v.l/10} × ${v.b/10} × ${v.h/10}`),st(`= ${v.l*v.b*v.h/1000} dm³`,v.l*v.b*v.h/1000),st(`1 dm³ = 1 liter, dus ${v.l*v.b*v.h/1000} liter`,v.l*v.b*v.h/1000)],
  fouten:v=>[[v.l*v.b*v.h,'Dat is in cm³. Een liter is 1000 cm³.'],[v.l*v.b*v.h/100,'Een liter is 1000 cm³, niet 100.'],[(v.l+v.b+v.h),'Je telde op. Inhoud is lengte × breedte × hoogte.']],
  anders:v=>`Reken eerst om naar decimeter: ${v.l} cm = ${v.l/10} dm. Een kubus van 1 dm bij 1 dm bij 1 dm is precies 1 liter.`
});
L({id:'M05.draaien',niv:5,dom:'M',sub:'meetkunde',naam:'Graden: draaien met de klok',
  uitleg:'Een heel rondje is 360°. De klok heeft 12 uren, dus elke uurstap van de grote wijzer is 360 : 12 = 30°. Een kwartslag is 90°.',
  gen(r){ return {k:r.pick([1,2,3,4,5,6,8,9]),t:r.pick(['grote wijzer','draaimolen'])} },
  vraag:v=>v.t==='grote wijzer'?`De grote wijzer van een klok draait van de 12 naar de ${v.k*1}. Hoeveel graden is dat?`:`Een draaimolen heeft 12 paardjes op gelijke afstand. Hij draait ${v.k} paardjes verder. Hoeveel graden is dat?`,
  fig:v=>v.t==='grote wijzer'?FIG.klok(0,v.k*5):'',
  antw:v=>v.k*30, eenheid:'graden',
  stappen:v=>[st(`360 : 12 = 30 graden per stap`,30),st(`${v.k} × 30 = ${v.k*30}`,v.k*30)],
  fouten:v=>zonderGelijk(v.k*30,[[v.k*5,'Dat zijn de minuten. Gevraagd is het aantal graden: 30 per stap.'],[v.k*60,'Je nam 60 per stap. Een rondje is 360°, dat zijn 12 stappen van 30°.'],[v.k*36,'Je deelde 360 door 10. Er zijn 12 stappen.']]),
  anders:v=>`Een kwartslag (van 12 naar 3) is 90°. Dat is 3 stappen, dus één stap is 30°.`
});
L({id:'B05.gemiddelde',niv:5,dom:'B',sub:'statistiek',naam:'Gemiddelde, en een getal erbij',
  uitleg:'Gemiddelde = totaal : aantal. Wil je weten wat er nog nodig is voor een bepaald gemiddelde? Reken eerst uit welk totaal daarbij hoort.',
  gen(r){ let w,g; do{ w=Array.from({length:4},()=>r.pick([5,5.5,6,6.5,7,7.5,8,8.5,9])); g=r.pick([6.5,7,7.5]) }while(g*5-w.reduce((a,b)=>a+b,0)<4||g*5-w.reduce((a,b)=>a+b,0)>10); return {w,g,k:kind(r)} },
  vraag:v=>`${v.k} heeft voor vier toetsen de cijfers ${v.w.map(nl).slice(0,3).join(', ')} en ${nl(v.w[3])}. ${v.k} wil na de vijfde toets gemiddeld een ${nl(v.g)} staan. Welk cijfer is daarvoor nodig?`,
  antw:v=>rondaf(v.g*5-v.w.reduce((a,b)=>a+b,0),2), dec:1,
  stappen:v=>{ const s=v.w.reduce((a,b)=>a+b,0); return [st(`Nodig totaal: 5 × ${nl(v.g)} = ${nl(v.g*5)}`,v.g*5),st(`Nu: ${v.w.map(nl).join(' + ')} = ${nl(s)}`,s),st(`${nl(v.g*5)} − ${nl(s)} = ${nl(v.g*5-s)}`,rondaf(v.g*5-s,2))] },
  fouten:v=>{ const s=v.w.reduce((a,b)=>a+b,0); return zonderGelijk(rondaf(v.g*5-s,2),[[v.g,'Een '+nl(v.g)+' halen is alleen genoeg als je nu al precies '+nl(v.g)+' gemiddeld staat.'],[rondaf(2*v.g-s/4,2),'Je rekende alsof de nieuwe toets net zoveel telt als de vier oude samen.'],[rondaf(s/4,2),'Dat is je gemiddelde nu. De vraag is welk cijfer je nog nodig hebt.']]) },
  anders:v=>`Bij een gemiddelde van ${nl(v.g)} over 5 toetsen hoort samen ${nl(v.g*5)} punten. Hoeveel heb je al, en hoeveel mist er nog?`
});
L({id:'X5.traktatie',niv:5,dom:'G',sub:'bewerkingen',naam:'Toetsopgave: genoeg kopen voor een traktatie',ctx:true,
  uitleg:'In toetsopgaven moet je vaak naar boven afronden: je kunt geen halve zak kopen. Reken uit hoeveel je nodig hebt en kijk dan hoeveel verpakkingen dat worden.',
  gen(r){ let k,p,z; do{ k=r.int(22,31); p=r.pick([2,3]); z=r.pick([10,12,15,20]) }while((k*p)%z===0); return {k,p,z,pr:r.pick([1.49,1.79,1.89,2.25,2.49]),n:kind(r),d:r.pick(['mini-koekjes','zuurtjes','minirozijntjes','snoepjes'])} },
  vraag:v=>`${v.n} trakteert in de klas. Er zijn ${v.k} kinderen en iedereen krijgt ${v.p} ${v.d}. In een zak zitten ${v.z} ${v.d} en een zak kost ${eur(v.pr)}. Hoeveel moet ${v.n} minstens betalen?`,
  antw:v=>rondaf(Math.ceil(v.k*v.p/v.z)*v.pr,2), eenheid:'€',
  stappen:v=>[st(`${v.k} × ${v.p} = ${v.k*v.p} ${v.d}`,v.k*v.p),st(`${v.k*v.p} : ${v.z} = ${nl(rondaf(v.k*v.p/v.z,2))}, dus ${Math.ceil(v.k*v.p/v.z)} zakken`,Math.ceil(v.k*v.p/v.z)),st(`${Math.ceil(v.k*v.p/v.z)} × ${eur(v.pr)} = ${eur(Math.ceil(v.k*v.p/v.z)*v.pr)}`,rondaf(Math.ceil(v.k*v.p/v.z)*v.pr,2))],
  fouten:v=>zonderGelijk(rondaf(Math.ceil(v.k*v.p/v.z)*v.pr,2),[[rondaf(Math.floor(v.k*v.p/v.z)*v.pr,2),'Je rondde naar beneden af. Dan heb je te weinig: er moeten nog een paar kinderen iets krijgen.'],[rondaf(v.k*v.p/v.z*v.pr,2),'Je kunt geen deel van een zak kopen. Rond af naar hele zakken, naar boven.'],[rondaf(Math.ceil(v.k/v.z)*v.pr,2),'Iedereen krijgt '+v.p+' '+v.d+'. Reken eerst uit hoeveel je er in totaal nodig hebt.']]),
  anders:v=>`Je hebt ${v.k*v.p} ${v.d} nodig. Hoeveel zakken van ${v.z} zijn dat? Rond naar boven af: een zak te weinig is niet genoeg.`
});
