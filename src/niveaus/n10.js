// ===== Aanvullingen op het referentiekader (gaten in de dekking) =====
L({id:'G2.verdelen',niv:2,dom:'G',sub:'bewerkingen',naam:'Eerlijk verdelen: wat doe je met de rest?',verwar:['G2.delenrest'],
  uitleg:'Bij delen met rest bepaalt de vraag wat je met de rest doet. Moet iedereen mee (busjes, tafels)? Dan rond je naar boven af. Gaat het om volle groepjes of pakjes? Dan rond je naar beneden af.',
  gen(r){ const g=r.pick([4,5,6,8,9,12]); let n; do{ n=r.int(40,200) }while(n%g===0); return {g,n,t:r.pick(['op','af']),c:r.pick([['leerlingen','auto’s met plek voor','Hoeveel auto’s zijn er nodig om iedereen te vervoeren?','op'],['flesjes','kratjes van','Hoeveel volle kratjes kun je vullen?','af'],['spelers','teams van','Hoeveel volledige teams kun je maken?','af'],['gasten','tafels voor','Hoeveel tafels zijn er nodig zodat iedereen zit?','op']])} },
  vraag:v=>`Er zijn ${v.n} ${v.c[0]}. Je verdeelt ze over ${v.c[1]} ${v.g}. ${v.c[2]}`,
  antw:v=>v.c[3]==='op'?Math.ceil(v.n/v.g):Math.floor(v.n/v.g),
  stappen:v=>[st(`${v.n} : ${v.g} = ${Math.floor(v.n/v.g)} rest ${v.n%v.g}`,Math.floor(v.n/v.g)),st(v.c[3]==='op'?`De rest moet ook mee: ${Math.ceil(v.n/v.g)}`:`Alleen volle groepjes tellen: ${Math.floor(v.n/v.g)}`,v.c[3]==='op'?Math.ceil(v.n/v.g):Math.floor(v.n/v.g))],
  fouten:v=>v.c[3]==='op'?[[Math.floor(v.n/v.g),'Dan blijven er '+(v.n%v.g)+' over. Die moeten ook mee.'],[v.n%v.g,'Dat is de rest.']]:[[Math.ceil(v.n/v.g),'Het laatste groepje is niet vol.'],[v.n%v.g,'Dat is de rest.']],
  anders:v=>`Teken het: zet ${v.g} ${v.c[0]} in een rij. Hoeveel volle rijen krijg je, en wat blijft er over? Wat betekent dat hier?`
});
L({id:'M3.temperatuur',niv:3,dom:'M',sub:'eenheden',naam:'Temperatuur: rekenen onder en boven nul',verwar:['G3.negatief'],
  uitleg:'Op een thermometer tel je het verschil in stappen. Van −4 °C naar 7 °C: eerst 4 graden naar 0, dan nog 7. Samen 11 graden.',
  gen(r){ const a=-r.int(2,12),b=r.int(1,15); return {a,b,t:r.pick(['verschil','eind']),d:r.int(3,9),c:r.pick(['In Oostenrijk op wintersport','Op een winterochtend in Groningen','In Noorwegen'])} },
  vraag:v=>v.t==='verschil'?`${v.c} is het ’s ochtends ${String(v.a).replace('-','−')} °C. ’s Middags is het ${v.b} °C. Hoeveel graden is de temperatuur gestegen?`:`${v.c} is het ’s middags ${v.b} °C. ’s Nachts daalt de temperatuur ${v.b+v.d} graden. Hoeveel graden onder nul is het dan?`,
  antw:v=>v.t==='verschil'?v.b-v.a:v.d, eenheid:v=>v.t==='verschil'?'graden':'graden onder nul',
  stappen:v=>v.t==='verschil'?[st(`Van ${String(v.a).replace('-','−')} naar 0: ${-v.a} graden`,-v.a),st(`Van 0 naar ${v.b}: ${v.b} graden`,v.b),st(`Samen: ${-v.a} + ${v.b} = ${v.b-v.a}`,v.b-v.a)]:[st(`Van ${v.b} naar 0: ${v.b} graden`,v.b),st(`Nog ${v.b+v.d} − ${v.b} = ${v.d} graden eronder: −${v.d} °C`,v.d)],
  fouten:v=>v.t==='verschil'?[[v.b+v.a>0?v.b+v.a:v.b,'Je trok af. Onder nul en boven nul tel je bij elkaar op.'],[v.b,'Vergeet het stuk onder nul niet.']]:[[v.b+v.d,'Dat is de daling. Hoeveel is er onder nul over?'],[v.b,'Dat is de temperatuur overdag.']],
  anders:v=>({tekst:'Teken een thermometer als getallenlijn en tel de stappen.',svg:FIG.lijn(Math.min(v.a,-v.d)-1,Math.max(v.b,1)+1,1,[{x:v.t==='verschil'?v.a:v.b,label:String(v.t==='verschil'?v.a:v.b).replace('-','−')+'°'},{x:v.t==='verschil'?v.b:-v.d,label:String(v.t==='verschil'?v.b:-v.d).replace('-','−')+'°',k:'b'}],5)})
});
L({id:'B4.cirkeldiagram',niv:4,dom:'B',sub:'grafieken',naam:'Cirkeldiagram: percentage en graden',rm:true,dec:1,
  uitleg:'Een hele cirkel is 360° = 100%. 1% is dus 3,6°. Van graden naar procent: delen door 3,6.',
  gen(r){ const d=r.pick([[50,25,15,10],[40,30,20,10],[45,25,20,10],[35,30,25,10],[60,20,15,5]]); const l=r.shuffle(['gamen','sporten','social media','huiswerk','muziek']).slice(0,4); return {d,l,i:r.int(0,3),t:r.pick(['graden','procent'])} },
  vraag:v=>`Het cirkeldiagram laat zien waaraan leerlingen hun vrije tijd besteden. ${v.t==='graden'?`${v.l[v.i]} is ${v.d[v.i]}%. Hoeveel graden is dat stuk van de cirkel?`:`Het stuk ${v.l[v.i]} is ${nl(v.d[v.i]*3.6)}°. Hoeveel procent is dat?`}`,
  fig:v=>FIG.taart(v.d.map((w,i)=>({w,label:v.l[i]+(i===v.i?'':' '+w+'%')}))),
  antw:v=>v.t==='graden'?rondaf(v.d[v.i]*3.6,1):v.d[v.i], eenheid:v=>v.t==='graden'?'graden':'%',
  stappen:v=>v.t==='graden'?[st(`100% = 360°, dus 1% = 3,6°`,3.6),st(`${v.d[v.i]} × 3,6 = ${nl(v.d[v.i]*3.6)}°`,rondaf(v.d[v.i]*3.6,1))]:[st(`360° = 100%, 1% = 3,6°`,3.6),st(`${nl(v.d[v.i]*3.6)} : 3,6 = ${v.d[v.i]}%`,v.d[v.i])],
  fouten:v=>v.t==='graden'?[[v.d[v.i],'Dat is het percentage. Reken om naar graden: keer 3,6.'],[rondaf(v.d[v.i]*3.6/10,1),'1% = 3,6°.'],[rondaf(v.d[v.i]/3.6,1),'Van procent naar graden vermenigvuldig je met 3,6.']]:[[rondaf(v.d[v.i]*3.6,1),'Dat zijn graden.'],[rondaf(v.d[v.i]*3.6/360,2),'Vergeet niet keer 100.'],[rondaf(v.d[v.i]*3.6*3.6,1),'Van graden naar procent deel je door 3,6.']],
  anders:v=>`Een kwart cirkel is 90° en dat is 25%. Hoeveel graden hoort bij 1%? En bij ${v.d[v.i]}%?`
});
L({id:'M4.prijsm2',niv:4,dom:'M',sub:'oppervlak',naam:'Prijs per m²: vloer en snijverlies',rm:true,ctx:true,verwar:['M3.oppeenheden'],
  uitleg:'Reken eerst de oppervlakte uit in m². Komt er snijverlies bij, tel dat percentage erbij. Je koopt hele pakken: rond naar boven af.',
  gen(r){ return {l:r.pick([3,3.5,4,4.5,5]),b:r.pick([2.5,3,3.5,4]),pak:r.pick([2,2.2,2.5]),prijs:r.pick([19.95,24.95,29.95]),sv:10} },
  vraag:v=>`${bron('🪵 Laminaat Eiken Natuur',`<p>Pak = ${nl(v.pak)} m² · ${eur(v.prijs,true)} per pak</p><p class="bronvoet">Reken op ${v.sv}% snijverlies · Dikte 8 mm · Geschikt voor vloerverwarming</p>`)}Je slaapkamer is ${nl(v.l)} m bij ${nl(v.b)} m. Hoeveel pakken laminaat moet je kopen?`,
  antw:v=>Math.ceil(rondaf(v.l*v.b*1.1/v.pak,6)),
  stappen:v=>[st(`Oppervlakte: ${nl(v.l)} × ${nl(v.b)} = ${nl(v.l*v.b)} m²`,rondaf(v.l*v.b,2)),st(`Plus 10%: ${nl(v.l*v.b)} × 1,1 = ${nl(rondaf(v.l*v.b*1.1,3))} m²`,rondaf(v.l*v.b*1.1,3)),st(`${nl(rondaf(v.l*v.b*1.1,3))} : ${nl(v.pak)} ≈ ${nl(rondaf(v.l*v.b*1.1/v.pak,2))}, dus ${Math.ceil(rondaf(v.l*v.b*1.1/v.pak,6))} pakken`,Math.ceil(rondaf(v.l*v.b*1.1/v.pak,6)))],
  fouten:v=>[[Math.ceil(rondaf(v.l*v.b/v.pak,6)),'Je vergat het snijverlies.'],[Math.floor(rondaf(v.l*v.b*1.1/v.pak,6)),'Met naar beneden afronden heb je te weinig.'],[Math.ceil(rondaf(2*(v.l+v.b)/v.pak,6)),'Dat is de omtrek. Voor een vloer heb je de oppervlakte nodig.']],
  anders:v=>`Drie stappen: hoeveel m² is de kamer, hoeveel m² met 10% extra, hoeveel pakken van ${nl(v.pak)} m² zijn dat (hele pakken)?`
});
L({id:'M5.tijdzone',niv:5,dom:'M',sub:'tijd',naam:'Tijdzones en vliegtijd',
  uitleg:'Reken eerst de aankomsttijd uit in de tijd van vertrek (vertrek + vliegduur). Tel daarna het tijdsverschil erbij op of trek het eraf.',
  gen(r){ const [stad,dt]=r.pick([['New York',-6],['Curaçao',-5],['Dubai',3],['Bangkok',6],['Lissabon',-1],['Tokio',8]]); let v,d; do{ v=r.int(16,44)*15; d=r.int(10,60)*15 }while(new Set([v+d+dt*60,v+d,v+d-dt*60,v+dt*60].map(tijdStr)).size<4); return {stad,dt,v,d} },
  vraag:v=>`Je vliegt van Amsterdam naar ${v.stad}. Vertrek ${tijdStr(v.v)} (Nederlandse tijd), vliegtijd ${Math.floor(v.d/60)} uur${v.d%60?' en '+v.d%60+' minuten':''}. In ${v.stad} is het ${Math.abs(v.dt)} uur ${v.dt<0?'vroeger':'later'} dan in Nederland. Hoe laat is het in ${v.stad} als je landt?`,
  opties:v=>{ const nl_=v.v+v.d,juist=nl_+v.dt*60; return [[tijdStr(juist),true],[tijdStr(nl_),false,'Dat is de Nederlandse tijd. Reken nog om naar de lokale tijd.'],[tijdStr(nl_-v.dt*60),false,`In ${v.stad} is het ${v.dt<0?'vroeger':'later'}: je moet ${v.dt<0?'eraf halen':'erbij tellen'}.`],[tijdStr(v.v+v.dt*60),false,'Vergeet de vliegtijd niet.']] },
  stappen:v=>[st(`Landen in Nederlandse tijd: ${tijdStr(v.v)} + ${Math.floor(v.d/60)}:${String(v.d%60).padStart(2,'0')} = ${tijdStr(v.v+v.d)}`),st(`Tijdsverschil ${v.dt>0?'+':'−'}${Math.abs(v.dt)} uur: ${tijdStr(v.v+v.d+v.dt*60)}`),st(`In minuten na middernacht: ${((v.v+v.d+v.dt*60)%1440+1440)%1440}`,((v.v+v.d+v.dt*60)%1440+1440)%1440)],
  anders:v=>`Doe het in twee stappen op een tijdlijn: eerst vliegen (Nederlandse klok), dan de klok verzetten.`
});
L({id:'M6.download',niv:6,dom:'M',sub:'eenheden',naam:'Downloadsnelheid: Mbit/s en MB',rm:true,dec:1,verwar:['G7.voorvoegsels'],
  uitleg:'Internetsnelheid staat in megabit per seconde (Mbit/s), bestanden in megabyte (MB). 1 byte = 8 bit. Een bestand van 100 MB is dus 800 Mbit.',
  gen(r){ return {s:r.pick([50,100,200,400]),f:r.pick([1.5,2,4,6.5,12,25]),wat:r.pick(['een game-update','een film','een app'])} },
  vraag:v=>`Je downloadt ${v.wat} van ${nl(v.f)} GB. Je internet haalt ${v.s} Mbit/s. Hoeveel minuten duurt het downloaden? Rond af op 1 decimaal.`,
  antw:v=>rondaf(v.f*1000*8/v.s/60,1), eenheid:'minuten',
  stappen:v=>[st(`${nl(v.f)} GB = ${nl(v.f*1000)} MB`,v.f*1000),st(`× 8 = ${nl(v.f*8000)} Mbit`,v.f*8000),st(`${nl(v.f*8000)} : ${v.s} = ${nl(v.f*8000/v.s)} seconden`,rondaf(v.f*8000/v.s,2)),st(`: 60 ≈ ${nl(rondaf(v.f*8000/v.s/60,1))} minuten`,rondaf(v.f*8000/v.s/60,1))],
  fouten:v=>[[rondaf(v.f*1000/v.s/60,1),'Je vergat dat 1 byte = 8 bit.'],[rondaf(v.f*8000/v.s,1),'Dat zijn seconden.'],[rondaf(v.f*1000*8/v.s/100,1),'Een minuut heeft 60 seconden.']],
  anders:v=>`Zet alles in dezelfde eenheid: hoeveel megabit is het bestand, en hoeveel megabit gaat er per seconde door?`
});
L({id:'B6.misleidend',niv:6,dom:'B',sub:'grafieken',naam:'Misleidende grafieken herkennen',rm:true,dec:1,
  uitleg:'Begint de verticale as niet bij 0, dan lijken verschillen veel groter dan ze zijn. Reken altijd met de getallen, niet met de lengte van de staven.',
  gen(r){ const a=r.pick([900,950,1000,1200]),d=r.pick([30,40,50,60]),y0=a-r.pick([20,30])-(a%50); return {a,b:a+d,d,y0:Math.floor((a-20)/50)*50,c:r.pick(['Aantal leerlingen van de school','Bezoekers van het zwembad per week','Volgers van de schoolaccount'])} },
  vraag:v=>`${v.c}: vorig jaar ${v.a}, dit jaar ${v.b}. In de grafiek lijkt de staaf veel langer geworden. Met hoeveel procent is het aantal echt gestegen? Rond af op 1 decimaal.`,
  fig:v=>FIG.staaf(['vorig jaar','dit jaar'],[v.a,v.b],{ymin:v.y0,ymax:v.y0+Math.ceil((v.b-v.y0+10)/20)*20,ys:20,yl:'aantal'}),
  antw:v=>rondaf(v.d/v.a*100,1), eenheid:'%',
  stappen:v=>[st(`De as begint bij ${v.y0}, niet bij 0`),st(`Echte stijging: ${v.b} − ${v.a} = ${v.d}`,v.d),st(`${v.d} : ${v.a} × 100 ≈ ${nl(rondaf(v.d/v.a*100,1))}%`,rondaf(v.d/v.a*100,1))],
  fouten:v=>[[rondaf((v.b-v.y0)/(v.a-v.y0)*100-100,1),'Je keek naar de lengte van de staven. Die is misleidend: de as begint niet bij 0.'],[v.d,'Dat is het verschil in aantal.'],[rondaf(v.d/v.b*100,1),'Deel door het oude aantal.']],
  anders:v=>`Kijk naar de as: hij begint bij ${v.y0}. Teken in gedachten de staven vanaf 0: dan zijn ze bijna even lang.`
});
