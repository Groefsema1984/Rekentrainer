// ===== Niveau 7 · 3F basis · ongeveer 5e klas =====
// ---------- Getallen ----------
L({id:'G7.wetnotrekenen',niv:11,dom:'G',sub:'bewerkingen',naam:'Rekenen met wetenschappelijke notatie',rm:true,verwar:['G6.wetnot'],
  uitleg:'Vermenigvuldigen: getallen vermenigvuldigen en exponenten optellen. (3 × 10⁴) × (5 × 10³) = 15 × 10⁷. Netjes schrijven (getal tussen 1 en 10): 1,5 × 10⁸.',
  gen(r){ const a=r.pick([1.5,2,2.5,3,4,5,6,8]),b=r.pick([2,3,4,5,1.2,2.5]),p=r.int(2,8),q=r.int(2,8); let m=rondaf(a*b,4),e=p+q; const schuif=m>=10; if(schuif){ m=rondaf(m/10,4); e++ } return {a,b,p,q,m,e,schuif,type:r.pick(['exp','getal'])} },
  vraag:v=>`Reken uit en schrijf in wetenschappelijke notatie: <b>(${wn(v.a,v.p)}) × (${wn(v.b,v.q)})</b>. ${v.type==='exp'?'Wat is de exponent?':'Welk getal staat vóór × 10<sup>…</sup>?'}`,
  antw:v=>v.type==='exp'?v.e:v.m,
  stappen:v=>[st(`Getallen: ${nl(v.a)} × ${nl(v.b)} = ${nl(v.a*v.b)}`,rondaf(v.a*v.b,4)),st(`Machten: 10${SUP(v.p)} × 10${SUP(v.q)} = 10${SUP(v.p+v.q)}`,v.p+v.q),st(v.schuif?`${nl(v.a*v.b)} × 10${SUP(v.p+v.q)} = ${wn(v.m,v.e)}`:`Uitkomst: ${wn(v.m,v.e)}`,v.type==='exp'?v.e:v.m)],
  fouten:v=>v.type==='exp'?[[v.p*v.q,'Bij vermenigvuldigen van machten van 10 tel je de exponenten op.'],...(v.schuif?[[v.p+v.q,`${nl(v.a*v.b)} ligt niet tussen 1 en 10. Schuif de komma: de exponent wordt één hoger.`]]:[[v.p+v.q+1,'Het getal ligt al tussen 1 en 10. Je hoeft de exponent niet aan te passen.']]),[v.e+1,'Tel de exponenten nog eens op.']]:[...(v.schuif?[[rondaf(v.a*v.b,4),'Het getal voor de macht moet tussen 1 en 10 liggen. Schuif de komma en maak de exponent één hoger.']]:[]),[rondaf(v.a+v.b,4),'De getallen vermenigvuldig je, je telt ze niet op.'],[rondaf(v.m*10,4),'Het getal moet tussen 1 en 10 liggen.']],
  anders:v=>`Haal de vermenigvuldiging uit elkaar: ${nl(v.a)} × ${nl(v.b)} × 10${SUP(v.p)} × 10${SUP(v.q)}. Tien tot de macht ${v.p} keer tien tot de macht ${v.q} zijn samen ${v.p+v.q} keer een factor tien.`
});
L({id:'G7.voorvoegsels',niv:11,dom:'G',sub:'getalbegrip',naam:'Kilo, mega, giga: grote opslag en bestanden',rm:true,dec:4,
  uitleg:'Kilo = 1000, mega = 1 000 000, giga = 1 000 000 000, tera = 10¹². Dus 1 GB = 1000 MB en 1 MB = 1000 kB. (Bij rekenen in de rekentoets gebruik je stappen van 1000.)',
  gen(r){ const t=r.pick(['om','om','passen']); if(t==='passen'){ const G=r.pick([16,32,64,128,256]),s=r.pick([3,4,4.5,6,7,25,45]); return {t,G,s,wat:s>10?'video’s':'foto’s'} }
    const [u1,u2,f]=r.pick([['GB','MB',1000],['TB','GB',1000],['MB','kB',1000],['GB','kB',1000000]]); const y=r.pick([0.25,0.5,1.2,2.5,3.75,4.5,0.08,6]); const omlaag=r.ja(); return omlaag?{t,van:u1,naar:u2,x:y,y:rondaf(y*f,6),f,omlaag}:{t,van:u2,naar:u1,x:rondaf(y*f,6),y,f,omlaag} },
  vraag:v=>v.t==='passen'?`Een telefoon heeft ${v.G} GB vrije ruimte. Je ${v.wat} zijn gemiddeld ${nl(v.s)} MB. Hoeveel ${v.wat} passen er (hele aantallen)?`:`Reken om: ${nl(v.x)} ${v.van} = … ${v.naar}`,
  antw:v=>v.t==='passen'?Math.floor(v.G*1000/v.s):v.y, eenheid:v=>v.t==='passen'?'':v.naar,
  stappen:v=>v.t==='passen'?[st(`${v.G} GB = ${nl(v.G*1000)} MB`,v.G*1000),st(`${nl(v.G*1000)} : ${nl(v.s)} = ${nl(rondaf(v.G*1000/v.s,2))}`,rondaf(v.G*1000/v.s,2)),st(`Hele ${v.wat}: ${Math.floor(v.G*1000/v.s)}`,Math.floor(v.G*1000/v.s))]:v.omlaag?[st(`1 ${v.van} = ${nl(v.f)} ${v.naar}`,v.f),st(`${nl(v.x)} × ${nl(v.f)} = ${nl(v.y)}`,v.y)]:[st(`1 ${v.naar} = ${nl(v.f)} ${v.van}`,v.f),st(`${nl(v.x)} : ${nl(v.f)} = ${nl(v.y)}`,v.y)],
  fouten:v=>v.t==='passen'?[[rondaf(v.G/v.s,2),'Reken eerst om naar dezelfde eenheid: GB naar MB.'],[Math.ceil(v.G*1000/v.s)===Math.floor(v.G*1000/v.s)?Math.floor(v.G*1000/v.s)+1:Math.ceil(v.G*1000/v.s),'Een half bestand past niet. Rond naar beneden af.'],[Math.floor(v.G*100/v.s),'1 GB = 1000 MB, niet 100.']]:v.omlaag?[[rondaf(v.x/v.f,8),'Naar een kleinere eenheid krijg je een groter getal.'],[rondaf(v.x*v.f/1000,6)||rondaf(v.x*10,4),'1 '+v.van+' = '+nl(v.f)+' '+v.naar+'.'],[rondaf(v.x*v.f*1000,6),'De stap is te groot.']]:[[rondaf(v.x*v.f,6),'Naar een grotere eenheid krijg je een kleiner getal.'],[rondaf(v.x/v.f*1000,6),'1 '+v.naar+' = '+nl(v.f)+' '+v.van+'.'],[rondaf(v.x/v.f/1000,9),'De stap is te groot.']],
  anders:v=>({tekst:'Het trapje: elke stap is × 1000.',tabel:{kop:['TB','GB','MB','kB'],rijen:[['1','1000','1 000 000','1 000 000 000']]}}),
  koppel:(v,r)=>({vraag:'Koppel wat even groot is.',paren:r.shuffle([['2,5 GB','2500 MB'],['0,5 TB','500 GB'],['750 kB','0,75 MB'],['4 GB','4 000 000 kB'],['1,2 MB','1200 kB'],['3 TB','3 000 000 MB']]).slice(0,4)})
});
L({id:'G7.negmachten',niv:11,dom:'G',sub:'negatief',naam:'Kleine getallen: negatieve exponenten',negatief:true,verwar:['G6.wetnot'],
  toon:(x,v)=>v.type==='exp'?(x<0?'−'+Math.abs(x):String(x)):nl(x,10),
  uitleg:'Kleine getallen schrijf je met een negatieve exponent. 0,0025 = 2,5 × 10⁻³: de komma schuift 3 plaatsen naar rechts tot achter het eerste cijfer dat geen 0 is.',
  gen(r){ return {m:r.pick([2,2.5,4,5,8,1.2,3.5]),n:r.int(2,6),type:r.pick(['getal','exp']),c:r.pick(['Een bacterie is','Een haar is','Een stofdeeltje is','Een laagje verf is'])} },
  vraag:v=>v.type==='getal'?`${v.c} ${wn(v.m,-v.n)} meter dik. Schrijf dat als kommagetal.`:`${v.c} ${nl(rondaf(v.m*10**-v.n,10),10)} meter dik. Je schrijft dat als ${nl(v.m)} × 10<sup>?</sup>. Wat is de exponent?`,
  antw:v=>v.type==='getal'?rondaf(v.m*10**-v.n,10):-v.n,
  stappen:v=>v.type==='getal'?[st(`10${SUP(-v.n)} = ${nl(10**-v.n,10)}`,rondaf(10**-v.n,10)),st(`${nl(v.m)} × ${nl(10**-v.n,10)} = ${nl(rondaf(v.m*10**-v.n,10),10)}`,rondaf(v.m*10**-v.n,10))]:[st(`De komma moet achter het eerste cijfer dat geen 0 is: ${nl(v.m)}`,v.m),st(`Dat is ${v.n} plaatsen naar rechts, dus exponent −${v.n}`,-v.n)],
  fouten:v=>v.type==='getal'?[[rondaf(v.m*10**-(v.n-1),10),`De komma schuift ${v.n} plaatsen naar links, niet ${v.n-1}.`],[rondaf(v.m*10**-(v.n+1),10),`De komma schuift ${v.n} plaatsen, niet ${v.n+1}.`],[rondaf(v.m*10**v.n,0),'Een negatieve exponent maakt het getal juist heel klein.']]:[[-(v.n-1),'Tel ook de stap over de 0 vóór de komma mee.'],[v.n,'Een klein getal (kleiner dan 1) heeft een negatieve exponent.'],[-(v.n+1),'Tel de plaatsen nog eens: tot achter het eerste cijfer dat geen 0 is.']],
  anders:v=>`10⁻¹ = 0,1; 10⁻² = 0,01; 10⁻³ = 0,001. Elke stap is delen door 10: de komma schuift één plaats naar links.`
});
L({id:'G7.ordegrootte',niv:11,dom:'G',sub:'getalbegrip',naam:'Hoeveel keer zo groot? (machten van 10)',rm:true,
  uitleg:'Delen in wetenschappelijke notatie: getallen delen en exponenten aftrekken. (6 × 10⁹) : (2 × 10⁶) = 3 × 10³ = 3000 keer zo groot.',
  gen(r){ const b=r.pick([1.5,2,2.5,3]),k=r.pick([1,2,3,4,5]),q=r.int(2,6),d=r.int(2,5); return {b,k,a:rondaf(b*k,2),q,p:q+d,d,c:r.pick([['Een datacenter verwerkt','berichten per dag, een schoolserver'],['Het aantal sterren in een melkwegstelsel is',', het aantal mensen in een stad is'],['Een virale video heeft','views, een gewone video heeft']])} },
  vraag:v=>`Getal A is ${wn(v.a,v.p)} en getal B is ${wn(v.b,v.q)}. Hoeveel keer zo groot is A als B?`,
  antw:v=>v.k*10**v.d,
  stappen:v=>[st(`Getallen: ${nl(v.a)} : ${nl(v.b)} = ${v.k}`,v.k),st(`Machten: 10${SUP(v.p)} : 10${SUP(v.q)} = 10${SUP(v.d)} = ${nl(10**v.d)}`,10**v.d),st(`${v.k} × ${nl(10**v.d)} = ${nl(v.k*10**v.d)}`,v.k*10**v.d)],
  fouten:v=>[[v.k*v.d,'10 tot de macht '+v.d+' is niet '+v.d+'. Het is een 1 met '+v.d+' nullen.'],[v.k*10**(v.d+1),'Trek de exponenten af: '+v.p+' − '+v.q+' = '+v.d+'.'],[v.k*10**(v.p+v.q),'Bij delen trek je de exponenten af.'],...(v.k>1?[[10**v.d,'Vergeet de getallen voor de macht niet: '+nl(v.a)+' : '+nl(v.b)+'.']]:[])],
  anders:v=>`Schrijf beide als gewoon getal: A = ${nl(rondaf(v.a*10**v.p,0))} en B = ${nl(rondaf(v.b*10**v.q,0))}. Tel het verschil in nullen.`
});
// ---------- Verhoudingen ----------
L({id:'V7.rentejaren',niv:11,dom:'V',sub:'groei',naam:'Na hoeveel jaar? (rente op rente)',rm:true,verwar:['V6.groeinperioden'],
  uitleg:'Wil je weten wanneer een bedrag een doel haalt, probeer dan met de groeifactor: begin × gⁿ. Verhoog n tot je over het doel heen gaat. Met de rekenmachine: telkens × g en tellen.',
  gen(r){ const b=r.pick([1000,2000,2500,5000]),p=r.pick([2,3,4,5,6,8]),f=r.pick([1.2,1.25,1.5,2]); const g=rondaf(1+p/100,4),doel=rondaf(b*f,2); let n=0,w=b; while(w<doel-1e-9){ w=w*g; n++ } return {b,p,g,doel,n,f,lin:Math.ceil(rondaf((doel-b)/(b*p/100),6))} },
  vraag:v=>`Je zet ${eur(v.b)} op een spaarrekening met ${nl(v.p)}% rente per jaar (rente op rente). Na hoeveel hele jaren staat er voor het eerst minstens ${eur(v.doel)} op?`,
  antw:v=>v.n, eenheid:'jaar',
  stappen:v=>[st(`Groeifactor: ${nl(v.g)}`,v.g),st(`Na ${v.n-1} jaar: ${nl(v.b)} × ${nl(v.g)}${SUP(v.n-1)} ≈ ${eur(v.b*v.g**(v.n-1))} (nog te weinig)`,rondaf(v.b*v.g**(v.n-1),2)),st(`Na ${v.n} jaar: ${nl(v.b)} × ${nl(v.g)}${SUP(v.n)} ≈ ${eur(v.b*v.g**v.n)}`,rondaf(v.b*v.g**v.n,2)),st(`Dus na ${v.n} jaar`,v.n)],
  fouten:v=>[[v.n-1,'Na '+(v.n-1)+' jaar is het nog net niet genoeg. Controleer met de rekenmachine.'],[v.lin,'Je rekende elk jaar met dezelfde rente. Maar je krijgt ook rente over de rente, dus het gaat sneller.'],[v.n+1,'Na '+v.n+' jaar is het al genoeg.']].filter(x=>x[0]>0),
  anders:v=>({tekst:'Maak een tabel en vermenigvuldig elk jaar met '+nl(v.g)+'.',tabel:{kop:['jaar','bedrag'],rijen:Array.from({length:Math.min(v.n+1,6)},(_,i)=>{ const j=i<5?i:v.n; return [j,eur(v.b*v.g**j)] })}})
});
L({id:'V7.index',niv:11,dom:'V',sub:'procent',naam:'Indexcijfers',rm:true,dec:2,verwar:['V7.procentpunt'],
  uitleg:'Een indexcijfer vergelijkt met een basisjaar, dat altijd 100 is. Index 112 betekent: 112% van de prijs in het basisjaar, dus 12% duurder.',
  gen(r){ const [d,P]=r.pick([['een bioscoopkaartje',r.pick([8,10,12])],['een liter melk',r.pick([1,1.2,1.5])],['een voetbalshirt',r.pick([50,60,80])],['een abonnement op een sportschool',r.pick([20,25,40])],['een ijsje',r.pick([2,2.5])]]),I=r.pick([104,108,110,112.5,115,120,125,96,90]); return {P,I,N:rondaf(P*I/100,2),type:r.pick(['prijs','index']),j:r.pick([[2015,2024],[2020,2025],[2010,2023]]),d} }, // prijs past bij het product
  vraag:v=>v.type==='prijs'?`In ${v.j[0]} (index = 100) kostte ${v.d} ${eur(v.P,true)}. In ${v.j[1]} is het indexcijfer ${nl(v.I)}. Wat kost het in ${v.j[1]}?`:`In ${v.j[0]} (index = 100) kostte ${v.d} ${eur(v.P,true)}. In ${v.j[1]} kost het ${eur(v.N,true)}. Wat is het indexcijfer in ${v.j[1]}?`,
  antw:v=>v.type==='prijs'?v.N:v.I, eenheid:v=>v.type==='prijs'?'€':'',
  stappen:v=>v.type==='prijs'?[st(`Index ${nl(v.I)} = ${nl(v.I)}% van de prijs in ${v.j[0]}`,v.I),st(`${nl(v.I/100)} × ${nl(v.P)} = ${eur(v.N,true)}`,v.N)]:[st(`Nieuw : oud = ${nl(v.N)} : ${nl(v.P)} = ${nl(v.I/100)}`,rondaf(v.I/100,4)),st(`× 100 = index ${nl(v.I)}`,v.I)],
  fouten:v=>v.type==='prijs'?[[rondaf(Math.abs(v.P*(v.I-100)/100),2),'Dat is alleen de verandering. Het indexcijfer geeft de hele nieuwe prijs.'],[rondaf(v.P+v.I-100,2),'Een indexcijfer is een percentage, geen bedrag in euro.'],[rondaf(v.P*100/v.I,2),'Je deelde door de index. Hoger indexcijfer = hogere prijs.']]:[[rondaf(Math.abs(v.I-100),1),'Dat is de procentuele verandering. Het indexcijfer is de nieuwe prijs als percentage van de oude.'],[rondaf(100*v.P/v.N,1),'Je deelde oud door nieuw. Het moet nieuw : oud.']],
  anders:v=>({tekst:'Zet het in een verhoudingstabel: het basisjaar is 100.',tabel:{kop:['index','prijs (€)'],rijen:[['100',nl(v.P)],[v.type==='prijs'?nl(v.I):'?',v.type==='prijs'?'?':nl(v.N)]]}}),
  tabel:v=>({kop:['Index','Prijs (€)'],rijen:[[100,v.P],[v.I,v.N]],leeg:[v.type==='prijs'?[1,1]:[1,0]]})
});
L({id:'V7.procentpunt',niv:11,dom:'V',sub:'pverandering',naam:'Procent of procentpunt?',rm:true,dec:1,verwar:['V4.procentverandering'],
  uitleg:'Gaat een percentage van 40% naar 50%, dan is dat 10 procentpunt meer (gewoon het verschil). Maar het is een stijging van 25% (10 is 25% van 40).',
  gen(r){ const a=r.pick([20,25,40,50,60,80]); let d; do{ d=r.pick([5,10,15,20]) }while(a+d>100); return {a,b:a+d,d,type:r.pick(['pp','pct']),c:r.pick(['Het percentage leerlingen dat met de fiets naar school komt','De opkomst bij de leerlingenraadverkiezing','Het slagingspercentage van de school','Het percentage jongeren met een bijbaan'])} },
  vraag:v=>`${v.c} stijgt van ${v.a}% naar ${v.b}%. ${v.type==='pp'?'Met hoeveel procentpunt is het gestegen?':'Met hoeveel procent is het gestegen? Rond af op 1 decimaal.'}`,
  antw:v=>v.type==='pp'?v.d:rondaf(v.d/v.a*100,1), eenheid:v=>v.type==='pp'?'procentpunt':'%',
  stappen:v=>v.type==='pp'?[st(`Verschil: ${v.b} − ${v.a} = ${v.d} procentpunt`,v.d)]:[st(`Verschil: ${v.b} − ${v.a} = ${v.d} procentpunt`,v.d),st(`Ten opzichte van de oude waarde: ${v.d} : ${v.a} × 100 = ${nl(rondaf(v.d/v.a*100,1))}%`,rondaf(v.d/v.a*100,1))],
  fouten:v=>v.type==='pp'?[[rondaf(v.d/v.a*100,1),'Dat is de procentuele stijging. Procentpunt is gewoon het verschil tussen de percentages.'],[v.b,'Dat is het nieuwe percentage.']]:[[v.d,'Dat is het verschil in procentpunten. Voor de procentuele stijging deel je door de oude waarde.'],[rondaf(v.d/v.b*100,1),'Deel door de oude waarde, niet door de nieuwe.'],[rondaf(v.b/v.a*100,1),'Dat is het nieuwe percentage van de oude waarde. Trek er nog 100 vanaf.']],
  anders:v=>`Doe alsof het geen percentages zijn maar aantallen: van ${v.a} naar ${v.b} leerlingen. Er komen er ${v.d} bij (procentpunten). Dat is ${nl(rondaf(v.d/v.a*100,1))}% van de ${v.a} die er al waren.`,
  sab:v=>({intro:`${v.c} ging van ${v.a}% naar ${v.b}%. Een nieuwssite schrijft over een "stijging van ${v.d}%". Noor controleert het.`,stappen:[`Het oude percentage is ${v.a}%, het nieuwe ${v.b}%.`,`${v.b} − ${v.a} = ${v.d}, dus het steeg met ${v.d}%.`,`De nieuwssite heeft gelijk.`],fout:1,juist:rondaf(v.d/v.a*100,1),check:v.d,eenheid:'%',vraag:'Met hoeveel procent steeg het echt (1 decimaal)?',uitleg:'Het verschil tussen twee percentages heet procentpunt. De procentuele stijging reken je uit ten opzichte van de oude waarde.',goed:[`${v.d} procentpunt`,`${v.d} : ${v.a} × 100 = ${nl(rondaf(v.d/v.a*100,1))}%`]})
});
L({id:'V7.terugfactor',niv:11,dom:'V',sub:'groei',naam:'Terugrekenen bij groei over jaren',rm:true,verwar:['V4.terugrekenen','V6.groeinperioden'],
  uitleg:'Ken je de waarde ná een aantal jaren groei, dan deel je door de groeifactor tot de macht het aantal jaren. Let op: delen door 1,04 is iets anders dan keer 0,96.',
  gen(r){ const t=r.pick(['huis','sparen','fiets']); const D={huis:{b:r.pick([200000,250000,300000,350000]),p:r.pick([3,4,5,6]),up:true,n:r.int(3,6),zin:'Een huis is nu {W} waard. De waarde steeg {n} jaar lang met {p}% per jaar. Wat was het huis {n} jaar geleden waard (op hele euro’s)?',d:0},
    sparen:{b:r.pick([800,1000,1500,2000]),p:r.pick([2,2.5,3,4]),up:true,n:r.int(3,8),zin:'Na {n} jaar met {p}% rente per jaar (rente op rente) staat er {W} op je rekening. Hoeveel heb je erop gezet?',d:2},
    fiets:{b:r.pick([1200,1500,2000,2500]),p:r.pick([10,15,20]),up:false,n:r.int(2,4),zin:'Een e-bike is nu {W} waard. De waarde daalde {n} jaar lang met {p}% per jaar. Wat kostte hij nieuw?',d:2}}[t];
    const g=rondaf(D.up?1+D.p/100:1-D.p/100,4); return {t,...D,g,W:rondaf(D.b*g**D.n,2)} },
  vraag:v=>v.zin.replace('{W}',eur(v.W,true)).replace(/\{n\}/g,v.n).replace('{p}',nl(v.p)),
  antw:v=>rondaf(v.W/v.g**v.n,v.d), eenheid:'€',
  stappen:v=>[st(`Groeifactor: ${nl(v.g)}`,v.g),st(`${nl(v.g)}${SUP(v.n)} ≈ ${nl(rondaf(v.g**v.n,4))}`,rondaf(v.g**v.n,4)),st(`${nl(v.W)} : ${nl(rondaf(v.g**v.n,4))} ≈ ${eur(rondaf(v.W/v.g**v.n,v.d))}`,rondaf(v.W/v.g**v.n,v.d))],
  fouten:v=>[[rondaf(v.W*(v.up?1-v.p/100:1+v.p/100)**v.n,v.d),`Je vermenigvuldigde met ${nl(v.up?1-v.p/100:1+v.p/100)}. Maar het omgekeerde van × ${nl(v.g)} is : ${nl(v.g)}.`],[rondaf(v.W*(1-(v.up?1:-1)*v.n*v.p/100),v.d),'Je haalde '+v.n+' keer hetzelfde percentage van het eindbedrag af. Reken met de groeifactor.'],[rondaf(v.W/(v.g*v.n),v.d),'Deel door de groeifactor tot de macht '+v.n+', niet door groeifactor × '+v.n+'.']],
  anders:v=>`Vooruit is × ${nl(v.g)} per jaar, dus terug is : ${nl(v.g)} per jaar. Dat doe je ${v.n} keer: in één keer delen door ${nl(v.g)}${SUP(v.n)}.`,
  sab:v=>({intro:`Nu is het ${eur(v.W,true)}. Het ${v.up?'steeg':'daalde'} ${v.n} jaar lang met ${nl(v.p)}% per jaar. Daan rekent terug.`,stappen:[`Terug betekent het omgekeerde percentage.`,`De factor is ${nl(v.up?1-v.p/100:1+v.p/100)} per jaar.`,`${nl(v.W)} × ${nl(v.up?1-v.p/100:1+v.p/100)}${SUP(v.n)} ≈ ${eur(rondaf(v.W*(v.up?1-v.p/100:1+v.p/100)**v.n,v.d))}`],fout:1,juist:rondaf(v.W/v.g**v.n,v.d),check:rondaf(v.W*(v.up?1-v.p/100:1+v.p/100)**v.n,v.d),eenheid:'€',vraag:'Wat was de beginwaarde echt?'+(v.d===0?' (op hele euro’s)':' (op centen)'),uitleg:'Het percentage ging over de oude waarde. Terugrekenen doe je door te delen door de groeifactor, niet door met het omgekeerde percentage te vermenigvuldigen.',goed:[`Groeifactor ${nl(v.g)}`,`${nl(v.W)} : ${nl(v.g)}${SUP(v.n)} ≈ ${eur(rondaf(v.W/v.g**v.n,v.d))}`]})
});
// ---------- Meten en meetkunde ----------
L({id:'M7.gelijkvormig',niv:11,dom:'M',sub:'meetkunde',naam:'Gelijkvormigheid: schaduwen en foto’s',rm:true,verwar:['V3.schaal'],
  uitleg:'Bij gelijkvormige figuren worden alle lengtes met dezelfde factor vermenigvuldigd. Een paal van 2 m met een schaduw van 3 m: een boom met een schaduw van 18 m (6 keer zo lang) is ook 6 keer zo hoog.',
  gen(r){ const h1=r.pick([1.5,1.8,2]),s1=r.pick([1,1.2,2,2.5,3]),k=r.pick([4,5,6,8,10,12]); return {h1,s1,k,s2:rondaf(s1*k,2),h2:rondaf(h1*k,2),c:r.pick(['een boom','een flatgebouw','een lichtmast','de klimtoren'])} },
  vraag:v=>`Op dezelfde zonnige middag heeft een paal van ${nl(v.h1)} m een schaduw van ${nl(v.s1)} m. De schaduw van ${v.c} is ${nl(v.s2)} m. Hoe hoog is ${v.c}?`,
  antw:v=>v.h2, eenheid:'m',
  stappen:v=>[st(`Factor: ${nl(v.s2)} : ${nl(v.s1)} = ${v.k}`,v.k),st(`Hoogte: ${nl(v.h1)} × ${v.k} = ${nl(v.h2)} m`,v.h2)],
  fouten:v=>[[rondaf(v.h1+v.s2-v.s1,2),'Bij gelijkvormigheid vermenigvuldig je met een factor, je telt niet hetzelfde erbij op.'],[rondaf(v.s2*v.s1/v.h1,2),'Je zette de verhouding verkeerd om. Hoogte : schaduw is bij allebei hetzelfde.'],[v.s2,'Dat is de schaduw, niet de hoogte.']],
  anders:v=>({tekst:'Zet het in een verhoudingstabel: wat je met de schaduw doet, doe je ook met de hoogte.',tabel:{kop:['','paal','?'],rijen:[['schaduw (m)',nl(v.s1),nl(v.s2)],['hoogte (m)',nl(v.h1),'?']]}}),
  tabel:v=>({kop:['Schaduw (m)','Hoogte (m)'],rijen:[[v.s1,v.h1],[v.s2,v.h2]],leeg:[[1,1]]})
});
L({id:'M7.inhoudk3',niv:11,dom:'M',sub:'inhoud',naam:'Vergroten: wat gebeurt er met de inhoud?',dec:4,verwar:['M5.vergroten'],
  uitleg:'Worden alle lengtes k keer zo groot, dan wordt de oppervlakte k² keer zo groot en de inhoud k³ keer zo groot. Twee keer zo lang, breed en hoog = 2 × 2 × 2 = 8 keer zoveel inhoud.',
  gen(r){ const k=r.pick([2,3,4,1.5,0.5,10]); return {k,V:r.pick([20,40,50,100,250]),type:r.pick(['factor','inhoud']),c:r.pick(['Een beeldje','Een sieradendoosje','Een kaars','Een schaalmodel van een stadion'])} },
  vraag:v=>v.type==='factor'?`${v.c} wordt nagemaakt, maar alle lengtes worden ${nl(v.k)} keer zo groot. Hoeveel keer zo groot wordt de inhoud?`:`${v.c} heeft een inhoud van ${v.V} cm³. Er komt een versie waarbij alle lengtes ${nl(v.k)} keer zo groot zijn. Wat is de inhoud daarvan?`,
  antw:v=>v.type==='factor'?rondaf(v.k**3,4):rondaf(v.V*v.k**3,4), eenheid:v=>v.type==='factor'?'':cm3,
  stappen:v=>[st(`Lengtes × ${nl(v.k)}`,v.k),st(`Inhoud × ${nl(v.k)} × ${nl(v.k)} × ${nl(v.k)} = × ${nl(v.k**3)}`,rondaf(v.k**3,4)),...(v.type==='inhoud'?[st(`${v.V} × ${nl(v.k**3)} = ${nl(v.V*v.k**3)} cm³`,rondaf(v.V*v.k**3,4))]:[])],
  fouten:v=>{ const m=v.type==='factor'?1:v.V; return [[rondaf(m*v.k,4),'Lengte, breedte én hoogte worden allemaal '+nl(v.k)+' keer zo groot.'],[rondaf(m*v.k*v.k,4),'Keer '+nl(v.k)+'² is voor oppervlakte. Inhoud heeft drie richtingen.'],[rondaf(m*3*v.k,4),'Het is '+nl(v.k)+' × '+nl(v.k)+' × '+nl(v.k)+', niet 3 × '+nl(v.k)+'.']] },
  anders:v=>`Denk aan blokjes. Een kubus met ribbe 1 is 1 blokje. Met ribbe ${nl(v.k)} passen er ${nl(v.k)} × ${nl(v.k)} × ${nl(v.k)} = ${nl(v.k**3)} van die blokjes in.`,
  koppel:(v,r)=>({vraag:'Koppel elke vergroting aan wat er gebeurt.',paren:r.shuffle([['lengtes × 2: oppervlakte','× 4'],['lengtes × 2: inhoud','× 8'],['lengtes × 3: oppervlakte','× 9'],['lengtes × 3: inhoud','× 27'],['lengtes × 10: inhoud','× 1000'],['lengtes × 10: oppervlakte','× 100']]).slice(0,4)})
});
L({id:'M7.piramide',niv:11,dom:'M',sub:'inhoud',naam:'Inhoud van een piramide',rm:true,verwar:['M6.prisma'],
  uitleg:'Inhoud piramide = ⅓ × oppervlakte grondvlak × hoogte. Een piramide past precies 3 keer in een balk met hetzelfde grondvlak en dezelfde hoogte.',
  gen(r){ let a,h; do{ a=r.pick([3,4,6,9,10,12]); h=r.pick([3,4,5,6,9,10,12]) }while((a*a*h)%3); return {a,h,c:r.pick([['Een glazen piramide bij een museum','m',m3],['Een tent in piramidevorm','m',m3],['Een kaars in de vorm van een piramide','cm',cm3],['Een doosje bonbons in piramidevorm','cm',cm3]])} },
  vraag:v=>`${v.c[0]} heeft een vierkant grondvlak met zijden van ${v.a} ${v.c[1]} en is ${v.h} ${v.c[1]} hoog. Wat is de inhoud?`,
  antw:v=>v.a*v.a*v.h/3, eenheid:v=>v.c[2],
  stappen:v=>[st(`Grondvlak: ${v.a} × ${v.a} = ${v.a*v.a}`,v.a*v.a),st(`× hoogte: ${v.a*v.a} × ${v.h} = ${v.a*v.a*v.h}`,v.a*v.a*v.h),st(`⅓ daarvan: ${v.a*v.a*v.h} : 3 = ${v.a*v.a*v.h/3} ${v.c[2]}`,v.a*v.a*v.h/3)],
  fouten:v=>[[v.a*v.a*v.h,'Je vergat ⅓. Dit is de inhoud van een balk.'],[v.a*v.a*v.h/2,'Een piramide is ⅓ van de balk, niet ½.'],[rondaf(v.a*v.h/3,2),'Het grondvlak is '+v.a+' × '+v.a+'.']],
  anders:v=>`Stel je een balk voor van ${v.a} × ${v.a} × ${v.h}. Daar gaan precies drie van deze piramides in.`,
  sab:v=>({intro:`${v.c[0]}: grondvlak ${v.a} bij ${v.a}, hoogte ${v.h}. Sanne rekent de inhoud uit.`,stappen:[`Inhoud = grondvlak × hoogte.`,`Grondvlak: ${v.a} × ${v.a} = ${v.a*v.a}`,`Inhoud: ${v.a*v.a} × ${v.h} = ${v.a*v.a*v.h} ${v.c[2]}`],fout:0,juist:v.a*v.a*v.h/3,check:v.a*v.a*v.h,eenheid:v.c[2],vraag:'Wat is de inhoud echt?',uitleg:'Grondvlak × hoogte geldt voor een balk of prisma. Een piramide loopt spits toe: daar komt ⅓ bij.',goed:[`⅓ × ${v.a*v.a} × ${v.h}`,`= ${v.a*v.a*v.h/3} ${v.c[2]}`]})
});
L({id:'M7.atletiekbaan',niv:11,dom:'M',sub:'oppervlak',naam:'Samengestelde figuren met cirkels',rm:true,dec:1,verwar:['M4.cirkel'],
  tol:v=>v.type==='opp'?Math.max(1,v.l*v.d*.004):.3,
  uitleg:'Een sportveld met twee halve cirkels aan de korte kanten = een rechthoek + één hele cirkel. Oppervlakte cirkel = π × r × r. Omtrek cirkel = π × diameter.',
  gen(r){ return {l:r.pick([80,84,100,110]),d:r.pick([40,50,60,70]),type:r.pick(['opp','omtrek']),c:r.pick(['Een atletiekveld','Een ijsbaan','Een skatepark','Een schoolplein'])} },
  vraag:v=>`${v.c} bestaat uit een rechthoek van ${v.l} m bij ${v.d} m met aan beide korte kanten een halve cirkel. ${v.type==='opp'?'Wat is de oppervlakte? Rond af op hele m².':'Hoe lang is de rand eromheen? Rond af op 1 decimaal.'}`,
  antw:v=>v.type==='opp'?rondaf(v.l*v.d+Math.PI*(v.d/2)**2,0):rondaf(2*v.l+Math.PI*v.d,1), eenheid:v=>v.type==='opp'?m2:'m',
  stappen:v=>v.type==='opp'?[st(`Rechthoek: ${v.l} × ${v.d} = ${v.l*v.d} m²`,v.l*v.d),st(`Twee halve cirkels = één cirkel met r = ${v.d/2}: π × ${v.d/2} × ${v.d/2} ≈ ${nl(rondaf(Math.PI*(v.d/2)**2,1))} m²`,rondaf(Math.PI*(v.d/2)**2,1)),st(`Samen ≈ ${nl(rondaf(v.l*v.d+Math.PI*(v.d/2)**2,0))} m²`,rondaf(v.l*v.d+Math.PI*(v.d/2)**2,0))]:[st(`Rechte stukken: 2 × ${v.l} = ${2*v.l} m`,2*v.l),st(`Twee halve cirkels = één omtrek: π × ${v.d} ≈ ${nl(rondaf(Math.PI*v.d,1))} m`,rondaf(Math.PI*v.d,1)),st(`Samen ≈ ${nl(rondaf(2*v.l+Math.PI*v.d,1))} m`,rondaf(2*v.l+Math.PI*v.d,1))],
  fouten:v=>v.type==='opp'?[[rondaf(v.l*v.d+Math.PI*v.d*v.d,0),'Je gebruikte de diameter als straal. De straal is de helft: '+v.d/2+' m.'],[rondaf(v.l*v.d+2*Math.PI*(v.d/2)**2,0),'Twee halve cirkels zijn samen één hele cirkel.'],[v.l*v.d,'Vergeet de halve cirkels niet.']]:[[rondaf(2*v.l+2*Math.PI*v.d,1),'Twee halve cirkelbogen zijn samen één hele omtrek.'],[2*v.l+2*v.d,'De bochten zijn rond. Gebruik π × diameter.'],[rondaf(2*v.l+Math.PI*v.d/2,1),'De omtrek van een cirkel is π × diameter, niet π × straal.']],
  anders:v=>`Schuif in gedachten de twee halve cirkels tegen elkaar: samen vormen ze één cirkel met diameter ${v.d} m. Wat overblijft is een rechthoek van ${v.l} bij ${v.d}.`
});
// ---------- Verbanden ----------
L({id:'B7.expformule',niv:11,dom:'B',sub:'formules',naam:'Exponentiële formules gebruiken',rm:true,dec:1,verwar:['B6.exptabel','V6.groeinperioden'],
  uitleg:'In de formule N = b × gᵗ is b de beginwaarde (bij t = 0) en g de groeifactor per tijdseenheid. Reken eerst de macht uit, dan pas keer b.',
  gen(r){ const t=r.pick(['views','medicijn','bacterie']); const D={views:{b:r.pick([200,500,800]),g:r.pick([1.5,1.8,2,2.5]),t:r.int(3,6),L:'V',e:'dagen',zin:'Het aantal views van een filmpje is V = {b} × {g}<sup>t</sup>, met t in dagen. Hoeveel views zijn het na {t} dagen? Rond af op een heel getal.',d:0},
    medicijn:{b:r.pick([200,400,500]),g:r.pick([0.8,0.85,0.9,0.75]),t:r.int(3,8),L:'M',e:'uur',zin:'De hoeveelheid medicijn in je bloed is M = {b} × {g}<sup>t</sup> (in mg), met t in uren. Hoeveel mg is er na {t} uur? Rond af op 1 decimaal.',d:1},
    bacterie:{b:r.pick([50,100,250]),g:r.pick([1.2,1.3,1.4,3]),t:r.int(3,6),L:'B',e:'uur',zin:'Het aantal bacteriën is B = {b} × {g}<sup>t</sup>, met t in uren. Hoeveel bacteriën zijn er na {t} uur? Rond af op een heel getal.',d:0}}[t]; return {type:t,...D} },
  vraag:v=>v.zin.replace('{b}',v.b).replace('{g}',nl(v.g)).replace('{t}',v.t),
  antw:v=>rondaf(v.b*v.g**v.t,v.d),
  stappen:v=>[st(`Eerst de macht: ${nl(v.g)}${SUP(v.t)} ≈ ${nl(rondaf(v.g**v.t,4))}`,rondaf(v.g**v.t,4)),st(`Dan keer ${v.b}: ${v.b} × ${nl(rondaf(v.g**v.t,4))} ≈ ${nl(rondaf(v.b*v.g**v.t,v.d))}`,rondaf(v.b*v.g**v.t,v.d))],
  fouten:v=>[[rondaf(v.b*v.g*v.t,v.d),'Je vermenigvuldigde met '+v.t+'. Maar t is de exponent: '+v.t+' keer met '+nl(v.g)+' vermenigvuldigen.'],[rondaf(Math.min((v.b*v.g)**v.t,1e12),v.d),'Je deed eerst '+v.b+' × '+nl(v.g)+' en daarna de macht. De macht hoort alleen bij '+nl(v.g)+'.'],[rondaf(v.b*v.g**(v.t-1),v.d),'Bij t = 0 heb je de beginwaarde. Tel de stappen vanaf 0.']],
  anders:v=>({tekst:'Maak een tabel: elke tijdstap × '+nl(v.g)+'.',tabel:{kop:['t',v.L],rijen:Array.from({length:v.t+1},(_,i)=>[i,nl(rondaf(v.b*v.g**i,2))])}}),
  v3:v=>({vraag:`In de formule ${v.L} = ${v.b} × ${nl(v.g)}<sup>t</sup>: wat betekenen ${v.b} en ${nl(v.g)}?`,
    goed:`${v.b} is de hoeveelheid bij t = 0 (de beginwaarde). ${nl(v.g)} is de groeifactor: ${v.e==='dagen'?'elke dag':'elk uur'} wordt het ${nl(v.g)} keer zo veel, dus ${v.g>1?nl(rondaf((v.g-1)*100,2))+'% erbij':nl(rondaf((1-v.g)*100,2))+'% eraf'}.`,
    bijna:`${v.b} is de beginwaarde en ${nl(v.g)} is hoeveel er ${v.e==='dagen'?'elke dag':'elk uur'} bijkomt.`,
    fout:`${v.b} is het maximum en ${nl(v.g)} is het aantal ${v.e}.`,
    kijkwijzer:['Wordt het getal vóór × uitgelegd als beginwaarde bij t = 0?','Wordt de groeifactor uitgelegd als "keer zo veel per tijdstap"?','Wordt de groeifactor omgezet naar een percentage?']})
});
L({id:'B7.kwartielen',niv:11,dom:'B',sub:'statistiek',naam:'Kwartielen en spreiding',verwar:['B3.mediaan'],
  uitleg:'Zet de getallen op volgorde. De mediaan ligt in het midden. Het eerste kwartiel (Q1) is de mediaan van de onderste helft, het derde kwartiel (Q3) de mediaan van de bovenste helft. Kwartielafstand = Q3 − Q1.',
  gen(r){ const n=r.pick([7,11]); let x; do{ x=Array.from({length:n},()=>r.int(1,30)*5) }while(new Set(x).size<n-2); const s=[...x].sort((a,b)=>a-b); const h=(n-1)/2; const q1=s[(h-1)/2],q3=s[h+1+(h-1)/2]; return {n,x,s,med:s[h],q1,q3,type:r.pick(['iqr','q1','q3']),c:r.pick(['minuten dat leerlingen per dag gamen','minuten reistijd naar school','minuten dat leerlingen per dag sporten'])} },
  vraag:v=>`Bij ${v.n} leerlingen is het aantal ${v.c} gemeten: <b>${v.x.join(', ')}</b>. ${v.type==='iqr'?'Wat is de kwartielafstand?':v.type==='q1'?'Wat is het eerste kwartiel (Q1)?':'Wat is het derde kwartiel (Q3)?'}`,
  antw:v=>v.type==='iqr'?v.q3-v.q1:v.type==='q1'?v.q1:v.q3, eenheid:'minuten',
  stappen:v=>[st(`Op volgorde: ${v.s.join(', ')}`),st(`Mediaan (middelste): ${v.med}`,v.med),...(v.type==='q3'?[]:[st(`Q1 = middelste van de onderste helft: ${v.q1}`,v.q1)]),...(v.type==='q1'?[]:[st(`Q3 = middelste van de bovenste helft: ${v.q3}`,v.q3)]),...(v.type==='iqr'?[st(`Kwartielafstand: ${v.q3} − ${v.q1} = ${v.q3-v.q1}`,v.q3-v.q1)]:[])],
  fouten:v=>{ const h=(v.n-1)/2,o1=v.x[(h-1)/2],o3=v.x[h+1+(h-1)/2]; return v.type==='iqr'?[[v.s[v.n-1]-v.s[0],'Dat is de spreidingsbreedte (grootste − kleinste). Kwartielafstand is Q3 − Q1.'],[v.q3-v.med,'Je gebruikte de mediaan. Kwartielafstand is Q3 − Q1.'],[Math.abs(o3-o1),'Zet de getallen eerst op volgorde.']]:v.type==='q1'?[[o1,'Zet de getallen eerst op volgorde.'],[v.med,'Dat is de mediaan. Q1 is het midden van de onderste helft.'],[v.s[0],'Dat is het kleinste getal.']]:[[o3,'Zet de getallen eerst op volgorde.'],[v.med,'Dat is de mediaan. Q3 is het midden van de bovenste helft.'],[v.s[v.n-1],'Dat is het grootste getal.']] },
  anders:v=>`Schrijf de getallen op volgorde en zet een streep bij de mediaan. Links daarvan ${(v.n-1)/2} getallen, rechts ook. Van elk van die twee groepjes zoek je weer het middelste getal.`
});
L({id:'B7.omvormen',niv:11,dom:'B',sub:'formules',naam:'Formule omvormen',verwar:['B4.formuleterug'],
  uitleg:'Een formule omvormen doe je met de omgekeerde bewerkingen in de omgekeerde volgorde. K = 3 × u + 12: eerst × 3, dan + 12. Terug: eerst − 12, dan : 3. Dus u = (K − 12) : 3.',
  gen(r){ const [K,u,kw,uw]=r.pick([['K','u','de kosten in euro','het aantal uren'],['F','C','de temperatuur in °F','de temperatuur in °C'],['P','w','het aantal punten','het aantal gewonnen wedstrijden'],['H','d','de hoogte van een plant in cm','het aantal dagen']]); return {K,u,kw,uw,a:r.pick([2,3,4,5,1.5,2.5]),b:r.pick([6,8,10,12,15,20,32])} },
  vraag:v=>`Voor ${v.kw} geldt: <b>${v.K} = ${nl(v.a)} × ${v.u} + ${v.b}</b>, met ${v.u} = ${v.uw}. Welke formule geeft ${v.u} als je ${v.K} weet?`,
  opties:v=>[[`${v.u} = (${v.K} − ${v.b}) : ${nl(v.a)}`,true],[`${v.u} = ${v.K} : ${nl(v.a)} − ${v.b}`,false,'Eerst het vaste getal eraf, dan pas delen. Anders deel je het vaste getal ook.'],[`${v.u} = (${v.K} + ${v.b}) : ${nl(v.a)}`,false,'Het vaste getal moet eraf: je doet de omgekeerde bewerking.'],[`${v.u} = ${nl(v.a)} × ${v.K} − ${v.b}`,false,'Het omgekeerde van keer is delen.']],
  stappen:v=>[st(`Heen: ${v.u} → × ${nl(v.a)} → + ${v.b} → ${v.K}`),st(`Terug: ${v.K} → − ${v.b} → : ${nl(v.a)} → ${v.u}`),st(`Controle met ${v.u} = 4: ${v.K} = ${nl(v.a*4+v.b)} en (${nl(v.a*4+v.b)} − ${v.b}) : ${nl(v.a)} = 4`,4)],
  anders:v=>`Kies een getal en reken heen en terug. Neem ${v.u} = 10: dan is ${v.K} = ${nl(v.a*10+v.b)}. Welke formule maakt van ${nl(v.a*10+v.b)} weer 10?`,
  v3:v=>({vraag:`Leg uit hoe je ${v.K} = ${nl(v.a)} × ${v.u} + ${v.b} omvormt naar een formule voor ${v.u}.`,
    goed:`Bij de formule gaat ${v.u} eerst × ${nl(v.a)} en dan + ${v.b}. Terug doe je het omgekeerde in omgekeerde volgorde: eerst − ${v.b}, dan : ${nl(v.a)}. Dus ${v.u} = (${v.K} − ${v.b}) : ${nl(v.a)}.`,
    bijna:`Je doet het omgekeerde: : ${nl(v.a)} en − ${v.b}, dus ${v.u} = ${v.K} : ${nl(v.a)} − ${v.b}.`,
    fout:`Je zet de letters om: ${v.u} = ${nl(v.a)} × ${v.K} + ${v.b}.`,
    kijkwijzer:['Worden de omgekeerde bewerkingen gebruikt?','Staan ze in de omgekeerde volgorde (eerst − , dan :)?','Is gecontroleerd met een getal?']})
});
L({id:'B7.gemtoename',niv:11,dom:'B',sub:'grafieken',naam:'Gemiddelde toename per tijdseenheid',rm:true,verwar:['B5.helling'],
  uitleg:'Gemiddelde toename per jaar = (waarde aan het eind − waarde aan het begin) : aantal jaren ertussen. Let op: tel de jaren, niet de kolommen.',
  gen(r){ const j0=r.pick([2000,2005,2010]),st5=5; let y,i1,i2; do{ y=[r.int(20,60)*10]; for(let i=1;i<6;i++) y.push(y[i-1]+r.int(-2,8)*10); i1=r.int(0,3); i2=r.int(i1+2,5) }while(y[i2]<=y[i1]); return {j0,y,i1,i2,c:r.pick(['Aantal leden van een e-sportclub','Aantal bezoekers van een skatepark (per week)','Aantal laadpalen in een gemeente'])} },
  vraag:v=>`${v.c}:<div class="vtabel">${vtabelHtml(['Jaar','Aantal'],v.y.map((x,i)=>[v.j0+5*i,x]))}</div>Wat is de gemiddelde toename per jaar tussen ${v.j0+5*v.i1} en ${v.j0+5*v.i2}? Rond af op 2 decimalen.`,
  antw:v=>rondaf((v.y[v.i2]-v.y[v.i1])/(5*(v.i2-v.i1)),2),
  stappen:v=>[st(`Toename: ${v.y[v.i2]} − ${v.y[v.i1]} = ${v.y[v.i2]-v.y[v.i1]}`,v.y[v.i2]-v.y[v.i1]),st(`Aantal jaren: ${v.j0+5*v.i2} − ${v.j0+5*v.i1} = ${5*(v.i2-v.i1)}`,5*(v.i2-v.i1)),st(`${v.y[v.i2]-v.y[v.i1]} : ${5*(v.i2-v.i1)} ≈ ${nl(rondaf((v.y[v.i2]-v.y[v.i1])/(5*(v.i2-v.i1)),2))} per jaar`,rondaf((v.y[v.i2]-v.y[v.i1])/(5*(v.i2-v.i1)),2))],
  fouten:v=>[[v.y[v.i2]-v.y[v.i1],'Dat is de totale toename. Deel nog door het aantal jaren.'],[rondaf((v.y[v.i2]-v.y[v.i1])/(v.i2-v.i1),2),'Je deelde door het aantal stappen in de tabel. Elke stap is 5 jaar.'],[rondaf((v.y[v.i2]-v.y[v.i1])/(5*(v.i2-v.i1)+5),2),'Tel het aantal jaren ertussen: eindjaar − beginjaar.']],
  anders:v=>`Denk aan een trap: hoeveel ben je in totaal gestegen, en over hoeveel jaar? Verdeel de stijging eerlijk over die jaren.`
});
