// ===== Niveau 1 t/m 4 · voor de jongste rekenaars (ongeveer groep 3 t/m 6) =====
// Korte zinnen, kleine getallen, veel beeld: rekenrek, kralen, klok, munten, blokjes, getallenlijn en stroken.
// Contexten uit de belevingswereld van 6 tot 10 jaar: speeltuin, dieren, snoep, knikkers, verjaardag, zwembad.

// ---------- extra beelden voor jonge kinderen ----------
// rekenrek: twee rijen van 10 kralen, per vijf van kleur gewisseld; a kralen boven en b onder naar links geschoven
FIG.rekenrek=(a,b=0)=>{ let o=''; [a,b].forEach((n,r)=>{ const y=30+r*44; o+=`<line x1="20" y1="${y}" x2="540" y2="${y}" class="ax"/>`;
  for(let i=0;i<10;i++){ const links=i<n; const x=links?40+i*30:300+i*22; o+=`<circle cx="${x}" cy="${y}" r="12" class="${links?(i<5?'vlak a':'vlak b'):'vlak leeg'}"/>` } });
  return FIG.wrap(o,560,b===null?60:100) };
// klok met wijzers (u uur, m minuten)
FIG.klok=(u,m)=>{ const c=90,R=78; let o=`<circle cx="${c}" cy="${c}" r="${R}" class="vlak leeg" style="fill:var(--kaart)"/>`;
  for(let i=1;i<=12;i++){ const a=i*30*Math.PI/180; o+=FIG.t(c+56*Math.sin(a),c-56*Math.cos(a)+5,String(i),{fs:15}) }
  for(let i=0;i<60;i++){ const a=i*6*Math.PI/180, r1=i%5?74:68; o+=`<line x1="${c+r1*Math.sin(a)}" y1="${c-r1*Math.cos(a)}" x2="${c+R*Math.sin(a)}" y2="${c-R*Math.cos(a)}" class="ax" stroke-width="${i%5?1:2}"/>` }
  const am=m*6*Math.PI/180, au=((u%12)*30+m/2)*Math.PI/180;
  o+=`<line x1="${c}" y1="${c}" x2="${c+40*Math.sin(au)}" y2="${c-40*Math.cos(au)}" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/><line x1="${c}" y1="${c}" x2="${c+60*Math.sin(am)}" y2="${c-60*Math.cos(am)}" stroke="var(--acc)" stroke-width="4" stroke-linecap="round"/><circle cx="${c}" cy="${c}" r="5" fill="var(--ink)"/>`;
  return FIG.wrap(o,180,180,'style="max-width:220px"') };
// munten en briefjes (bedragen in euro)
FIG.munten=lijst=>{ let x=16,o=''; lijst.forEach(w=>{ if(w>=5){ o+=`<rect x="${x}" y="14" width="78" height="44" rx="5" class="vlak b"/>`+FIG.t(x+39,43,'€ '+w,{c:'op',fs:17}); x+=88 } else { o+=`<circle cx="${x+24}" cy="36" r="24" class="vlak a"/>`+FIG.t(x+24,42,w<1?Math.round(w*100)+' ct':'€ '+w,{c:'op',fs:w<1?13:15}); x+=56 } });
  return FIG.wrap(o,Math.max(200,x+10),72) };
// blokjes: honderdvlakken, tienstaven en losse eenheden
FIG.blokjes=(h,t,e)=>{ let x=12,o=''; for(let i=0;i<h;i++){ o+=`<rect x="${x}" y="8" width="70" height="70" class="vlak a"/>`; for(let k=1;k<10;k++) o+=`<line x1="${x+k*7}" y1="8" x2="${x+k*7}" y2="78" stroke="#fff" stroke-width=".6"/><line x1="${x}" y1="${8+k*7}" x2="${x+70}" y2="${8+k*7}" stroke="#fff" stroke-width=".6"/>`; x+=80 }
  for(let i=0;i<t;i++){ o+=`<rect x="${x}" y="8" width="8" height="70" class="vlak b"/>`; x+=12 } x+=6;
  for(let i=0;i<e;i++){ o+=`<rect x="${x+(i%3)*11}" y="${56-Math.floor(i/3)*11}" width="8" height="8" class="vlak c"/>` }
  return FIG.wrap(o,Math.max(220,x+40),86) };
// rij plaatjes in groepjes (bv. 3 groepjes van 4 appels)
FIG.groepjes=(g,n,emoji)=>{ let o=''; const bw=Math.min(120,540/g); for(let i=0;i<g;i++){ o+=`<rect x="${12+i*bw}" y="6" width="${bw-10}" height="${18+Math.ceil(n/3)*30}" rx="10" class="vlak leeg"/>`;
  for(let k=0;k<n;k++) o+=`<text x="${12+i*bw+16+(k%3)*28}" y="${36+Math.floor(k/3)*30}" font-size="22">${emoji}</text>` }
  return FIG.wrap(o,Math.max(200,12+g*bw),30+Math.ceil(n/3)*30) };
// één stapel: alles bij elkaar, vijf per rij (voor verdelen, zodat de figuur het antwoord niet verraadt)
FIG.stapel=(n,emoji)=>{ let o=`<rect x="8" y="6" width="176" height="${18+Math.ceil(n/5)*30}" rx="10" class="vlak leeg"/>`; for(let k=0;k<n;k++) o+=`<text x="${18+(k%5)*32}" y="${36+Math.floor(k/5)*30}" font-size="22">${emoji}</text>`; return FIG.wrap(o,200,30+Math.ceil(n/5)*30,'style="max-width:240px"') };
// hokjesfiguur (rechthoek in hokjes) voor omtrek en oppervlakte
FIG.hokjes=(b,h)=>{ const s=Math.min(34,300/Math.max(b,h)); let o=''; for(let i=0;i<b;i++) for(let j=0;j<h;j++) o+=`<rect x="${20+i*s}" y="${10+j*s}" width="${s}" height="${s}" class="vlak leeg" style="fill:color-mix(in srgb,var(--acc) 22%,transparent)"/>`;
  o+=`<rect x="20" y="10" width="${b*s}" height="${h*s}" fill="none" stroke="var(--ink)" stroke-width="3"/>`; return FIG.wrap(o,40+b*s,20+h*s,'style="max-width:420px"') };

const DIEREN=[['konijn','konijnen','🐰'],['kip','kippen','🐔'],['vis','vissen','🐟'],['eend','eenden','🦆'],['poes','poezen','🐱']];
const SNOEP=[['knikker','knikkers','🔵'],['snoepje','snoepjes','🍬'],['appel','appels','🍎'],['sticker','stickers','⭐'],['koekje','koekjes','🍪']];
const kind = r => r.pick(['Mila','Sem','Noor','Daan','Yara','Finn','Lotte','Adam','Zoë','Liam','Fenna','Mohammed','Saar','Bram']);
const uurTekst = (u,m) => { const uu=x=>((x-1)%12+12)%12+1; if(m===0) return uu(u)+' uur'; if(m===30) return 'half '+uu(u+1); if(m===15) return 'kwart over '+uu(u); if(m===45) return 'kwart voor '+uu(u+1); return m<30?m+' over '+uu(u):(60-m)+' voor '+uu(u+1) };

// ================= NIVEAU 1 (rekenen tot 20, eerste stappen tot 100) =================
L({id:'G01.tellen',niv:1,dom:'G',sub:'getalbegrip',naam:'Hoeveel kralen? Tellen met het rekenrek',
  uitleg:'Tel niet één voor één. Kijk naar de kleuren: een rij van vijf zie je in één keer. Vijf en nog twee is zeven.',
  gen(r){ const a=r.int(3,10),b=r.ja(.5)?r.int(0,10):0; return {a,b} },
  vraag:v=>v.b?`Hoeveel kralen zijn naar links geschoven? Tel boven en onder samen.`:`Hoeveel kralen zijn naar links geschoven?`,
  fig:v=>FIG.rekenrek(v.a,v.b),
  antw:v=>v.a+v.b,
  stappen:v=>[st(`Boven: ${v.a>5?'5 en nog '+(v.a-5):v.a}`,v.a),st(v.b?`Onder: ${v.b>5?'5 en nog '+(v.b-5):v.b}`:'Onder: niets',v.b),st(`Samen: ${v.a+v.b}`,v.a+v.b)],
  fouten:v=>[[v.a,'Je telde alleen de bovenste rij.'],[v.a+v.b+1,'Tel nog eens. Gebruik de rijtjes van vijf.'],[Math.max(1,v.a+v.b-1),'Je bent er één vergeten. Kijk naar de rijtjes van vijf.']],
  anders:v=>`Een rij van 5 oranje kralen ken je meteen. Daarna komen de blauwe kralen. Boven: ${v.a}${v.b?', onder: '+v.b:''}.`
});
L({id:'G01.plusmin',niv:1,dom:'G',sub:'bewerkingen',naam:'Plus en min tot 20',verwar:['G01.splitsen'],
  uitleg:'Bij plus komt er iets bij, bij min gaat er iets af. Over de 10? Maak eerst 10 vol en doe dan de rest.',
  gen(r){ const op=r.ja()?'+':'−'; let a,b; if(op==='+'){ a=r.int(3,12); b=r.int(2,20-a) } else { a=r.int(8,20); b=r.int(2,Math.min(9,a-1)) } const [e,m,i]=r.pick(SNOEP); return {op,a,b,e,m,i,k:kind(r)} },
  vraag:v=>v.op==='+'?`${v.k} heeft ${v.a} ${v.m}. ${v.k} krijgt er ${v.b} bij. Hoeveel ${v.m} zijn het nu?`:`${v.k} heeft ${v.a} ${v.m}. ${v.k} geeft er ${v.b} weg. Hoeveel ${v.m} zijn er over?`,
  antw:v=>v.op==='+'?v.a+v.b:v.a-v.b,
  stappen:v=>{ const z=v.op==='+'?v.a+v.b:v.a-v.b; if(v.op==='+'&&v.a<10&&z>10) return [st(`${v.a} + ${10-v.a} = 10`,10),st(`10 + ${v.b-(10-v.a)} = ${z}`,z)]; if(v.op==='−'&&v.a>10&&z<10) return [st(`${v.a} − ${v.a-10} = 10`,10),st(`10 − ${v.b-(v.a-10)} = ${z}`,z)]; return [st(`${v.a} ${v.op} ${v.b}`),st(`= ${z}`,z)] },
  fouten:v=>[[v.op==='+'?Math.abs(v.a-v.b):v.a+v.b,v.op==='+'?'Er komen er juist bij. Dan doe je plus.':'Er gaan er juist af. Dan doe je min.'],[(v.op==='+'?v.a+v.b:v.a-v.b)+1,'Bijna! Tel nog eens precies.'],[Math.max(0,(v.op==='+'?v.a+v.b:v.a-v.b)-1),'Bijna! Tel nog eens precies.']],
  anders:v=>({tekst:`Spring op de getallenlijn. Begin bij ${v.a} en spring ${v.b} ${v.op==='+'?'vooruit':'terug'}.`,svg:FIG.lijn(0,20,1,[{x:v.a,label:String(v.a)},{x:v.op==='+'?v.a+v.b:v.a-v.b,label:'?',k:'b'}],2)})
});
L({id:'G01.splitsen',niv:1,dom:'G',sub:'getalbegrip',naam:'Splitsen: samen 10',verwar:['G01.plusmin'],
  uitleg:'Splitsen betekent: een getal in twee stukken verdelen. 10 = 6 en 4. Ken je de "vriendjes van 10", dan reken je veel sneller.',
  gen(r){ const t=r.pick([10,10,10,8,9,12,15,20]); const a=r.int(1,t-1); const [e,m,i]=r.pick(SNOEP); return {t,a,m,i,k:kind(r)} },
  vraag:v=>`In de doos passen ${v.t} ${v.m}. Er zitten er al ${v.a} in. Hoeveel ${v.m} passen er nog bij?`,
  fig:v=>v.t<=10?FIG.rekenrek(v.a,null):FIG.rekenrek(Math.min(10,v.a),Math.max(0,v.a-10)),
  antw:v=>v.t-v.a,
  stappen:v=>[st(`${v.a} en hoeveel is samen ${v.t}?`),st(`${v.a} + ${v.t-v.a} = ${v.t}`,v.t-v.a)],
  fouten:v=>[[v.t+v.a,'Je telde alles op. Je zoekt wat er nog bij past.'],[v.a,'Dat is wat er al in zit.'],[v.t-v.a+1,'Bijna. Tel vanaf '+v.a+' door tot '+v.t+'.']],
  anders:v=>`Tel vanaf ${v.a} door tot ${v.t} op je vingers: ${Array.from({length:Math.min(6,v.t-v.a)},(_,i)=>v.a+i+1).join(', ')}${v.t-v.a>6?' …':''}. Hoeveel vingers heb je gebruikt?`
});
L({id:'G01.buren',niv:1,dom:'G',sub:'getalbegrip',naam:'Getallen tot 100: buren en tientallen',
  uitleg:'Elk getal heeft een buurman ervoor (1 minder) en erna (1 meer). Bij tientallen tel je met sprongen van 10.',
  gen(r){ return {x:r.int(11,98),t:r.pick(['na','voor','plus10','min10'])} },
  vraag:v=>v.t==='na'?`Welk getal komt direct na ${v.x}?`:v.t==='voor'?`Welk getal komt direct vóór ${v.x}?`:v.t==='plus10'?`Je springt 10 verder dan ${v.x}. Waar kom je uit?`:`Je springt 10 terug vanaf ${v.x}. Waar kom je uit?`,
  antw:v=>v.t==='na'?v.x+1:v.t==='voor'?v.x-1:v.t==='plus10'?v.x+10:v.x-10,
  stappen:v=>[st(v.t==='na'||v.t==='voor'?`Eén ${v.t==='na'?'meer':'minder'} dan ${v.x}`:`De tientallen ${v.t==='plus10'?'gaan 1 omhoog':'gaan 1 omlaag'}, de eenheden blijven ${v.x%10}`),st(`${v.t==='na'?v.x+1:v.t==='voor'?v.x-1:v.t==='plus10'?v.x+10:v.x-10}`,v.t==='na'?v.x+1:v.t==='voor'?v.x-1:v.t==='plus10'?v.x+10:v.x-10)],
  fouten:v=>v.t==='plus10'||v.t==='min10'?[[v.t==='plus10'?v.x+1:v.x-1,'Je sprong 1, maar het moest 10 zijn.'],[v.t==='plus10'?v.x-10:v.x+10,'Verkeerde kant op.']]:[[v.t==='na'?v.x-1:v.x+1,'Andere kant op: '+(v.t==='na'?'erna is één meer.':'ervoor is één minder.')],[v.t==='na'?v.x+10:v.x-10,'Je sprong 10, maar het is maar 1.']],
  anders:v=>({tekst:'Kijk op de getallenlijn.',svg:FIG.lijn(Math.floor(v.x/10)*10-10<0?0:Math.floor(v.x/10)*10-10,Math.floor(v.x/10)*10+20,1,[{x:v.x,label:String(v.x)}],5)})
});
L({id:'V01.dubbel',niv:1,dom:'V',sub:'vtabel',naam:'Dubbel en de helft',
  uitleg:'Dubbel is twee keer zoveel: 6 en 6 is 12. De helft is eerlijk verdelen over twee: de helft van 12 is 6.',
  gen(r){ const x=r.int(2,10); const [e,m,i]=r.pick(SNOEP); return {x,dub:r.ja(),m,i,k:kind(r)} },
  vraag:v=>v.dub?`${v.k} heeft ${v.x} ${v.m}. Oma geeft er net zoveel bij. Hoeveel ${v.m} heeft ${v.k} nu?`:`${v.k} en een vriendje verdelen ${2*v.x} ${v.m} eerlijk. Hoeveel krijgt ieder?`,
  fig:v=>v.dub?FIG.groepjes(2,v.x,v.i):FIG.stapel(2*v.x,v.i),
  antw:v=>v.dub?2*v.x:v.x,
  stappen:v=>v.dub?[st(`Dubbel ${v.x} = ${v.x} + ${v.x}`),st(`= ${2*v.x}`,2*v.x)]:[st(`${2*v.x} in twee gelijke groepjes`),st(`ieder ${v.x}`,v.x)],
  fouten:v=>v.dub?[[v.x+2,'Je deed er 2 bij. Dubbel is er net zoveel bij.'],[v.x,'Dat is wat '+v.k+' eerst had.']]:[[2*v.x,'Dat is alles samen. Je moet verdelen over twee.'],[v.x+1,'Kijk of beide groepjes even groot zijn.']],
  anders:v=>`Leg de ${v.m} in twee rijtjes naast elkaar, steeds één links en één rechts. In elk rijtje zitten er ${v.x}.`
});
L({id:'V01.eerlijk',niv:1,dom:'V',sub:'vtabel',naam:'Eerlijk verdelen',
  uitleg:'Eerlijk verdelen: iedereen krijgt evenveel. Deel uit, steeds één per kind, tot alles op is.',
  gen(r){ const g=r.int(2,4),n=r.int(2,5); const [e,m,i]=r.pick(SNOEP); return {g,n,tot:g*n,m,i} },
  vraag:v=>`Er zijn ${v.tot} ${v.m}. ${v.g} kinderen verdelen ze eerlijk. Hoeveel ${v.m} krijgt elk kind?`,
  fig:v=>FIG.stapel(v.tot,v.i),
  antw:v=>v.n,
  stappen:v=>[st(`${v.tot} verdelen over ${v.g} kinderen`),st(`${v.g} × ${v.n} = ${v.tot}, dus ieder ${v.n}`,v.n)],
  fouten:v=>[[v.tot-v.g,'Je trok het aantal kinderen eraf. Je moet verdelen.'],[v.g,'Dat is het aantal kinderen.'],[v.n+1,'Dan heb je te weinig. Tel nog eens.']],
  anders:v=>`Teken ${v.g} rondjes voor de kinderen. Zet om de beurt een streepje in elk rondje tot je ${v.tot} streepjes hebt.`
});
L({id:'M01.klok',niv:1,dom:'M',sub:'tijd',naam:'Klokkijken: hele en halve uren',
  uitleg:'De kleine wijzer wijst het uur aan. Staat de grote wijzer op de 12, dan is het een heel uur. Op de 6 is het half: half 4 is een half uur vóór 4 uur.',
  gen(r){ const u=r.int(1,12),m=r.pick([0,30]); return {u,m} },
  vraag:v=>`Hoe laat is het op de klok?`,
  fig:v=>FIG.klok(v.u,v.m),
  opties:v=>{ const goed=uurTekst(v.u,v.m); const f=[v.m===30?[uurTekst(v.u,0),'Bij half kijk je naar het volgende uur: half 4 is vóór 4 uur.']:[uurTekst(v.u-1,30),'Staat de grote wijzer op 12, dan is het een heel uur.'],[v.m===30?'half '+(((v.u-1)%12+12)%12+1):uurTekst(v.u+1,0),'Kijk goed naar de kleine wijzer.'],[uurTekst(v.u+6,v.m),'Je verwisselde de wijzers. De kleine wijzer geeft het uur.']];
    const u=[]; f.forEach(x=>{ if(x[0]!==goed&&!u.some(y=>y[0]===x[0])) u.push(x) }); return [[goed,true]].concat(u.slice(0,3).map(x=>[x[0],false,x[1]])) },
  anders:v=>`Kijk eerst naar de grote (oranje) wijzer: ${v.m===0?'die staat op 12, dus het is een heel uur':'die staat op 6, dus het is half'}. Kijk dan naar de kleine wijzer.`
});
L({id:'M01.geld',niv:1,dom:'M',sub:'tijd',naam:'Geld tellen tot 20 euro',
  uitleg:'Begin met het grootste geld. Tel dan de rest erbij: 10, 15, 17, 18.',
  gen(r){ let l; do{ l=Array.from({length:r.int(2,4)},()=>r.pick([1,2,5,10])).sort((a,b)=>b-a) }while(l.reduce((a,b)=>a+b,0)>20); return {l,k:kind(r)} },
  vraag:v=>`${v.k} heeft dit geld in de spaarpot. Hoeveel euro is dat samen?`,
  fig:v=>FIG.munten(v.l),
  antw:v=>v.l.reduce((a,b)=>a+b,0), eenheid:'€',
  stappen:v=>v.l.map((x,i)=>st(`${i?'+ € '+x:'€ '+x} → € ${v.l.slice(0,i+1).reduce((a,b)=>a+b,0)}`,v.l.slice(0,i+1).reduce((a,b)=>a+b,0))),
  fouten:v=>[[v.l.length,'Je telde de munten en briefjes. Kijk wat er op staat.'],[v.l.reduce((a,b)=>a+b,0)-v.l[v.l.length-1],'Je vergat er één.']],
  anders:v=>`Wijs ze één voor één aan en tel door: ${v.l.map((x,i)=>v.l.slice(0,i+1).reduce((a,b)=>a+b,0)).join(', ')}.`
});
L({id:'B01.patroon',niv:1,dom:'B',sub:'formules',naam:'Rijtjes en patronen',
  uitleg:'Kijk hoe je van het ene getal naar het volgende komt. Komt er steeds hetzelfde bij? Doe dat dan nog een keer.',
  gen(r){ const s=r.pick([1,2,2,5,10]),a=r.int(0,10),op=r.ja(.75)?1:-1; const b=op>0?a:a+6*s; return {s,a:b,op} },
  vraag:v=>`Welk getal komt hierna? ${[0,1,2,3].map(i=>v.a+v.op*i*v.s).join(' · ')} · …`,
  antw:v=>v.a+v.op*4*v.s,
  stappen:v=>[st(`Steeds ${v.op>0?'+':'−'} ${v.s}`),st(`${v.a+v.op*3*v.s} ${v.op>0?'+':'−'} ${v.s} = ${v.a+v.op*4*v.s}`,v.a+v.op*4*v.s)],
  fouten:v=>[[v.a+v.op*3*v.s+v.op,'Je deed er 1 bij. Kijk hoe groot de sprong steeds is.'],[v.a+v.op*5*v.s,'Je sloeg er één over.'],[v.a+v.op*3*v.s-v.op*v.s,'Verkeerde kant op.']],
  anders:v=>`Zet boogjes tussen de getallen en schrijf de sprong erboven: ${v.op>0?'+':'−'}${v.s}. Maak nog één boogje.`
});
L({id:'B01.turven',niv:1,dom:'B',sub:'tabellen',naam:'Turven en een tabel lezen',
  uitleg:'Bij turven zet je voor elk ding een streepje. Vier streepjes en een streep erdoor is 5.',
  gen(r){ const d=r.shuffle(DIEREN).slice(0,3).map(x=>[x[1],r.int(2,12)]); return {d,i:r.int(0,2),t:r.pick(['hoeveel','samen'])} },
  vraag:v=>v.t==='hoeveel'?`In de kinderboerderij tellen de kinderen de dieren. Hoeveel ${v.d[v.i][0]} zijn er?`:`Hoeveel dieren zijn er samen?`,
  fig:v=>`<table class="vtab"><tbody>${v.d.map(x=>`<tr><th>${esc(x[0])}</th><td style="text-align:left;letter-spacing:2px;font-weight:700">${'𝍸 '.repeat(Math.floor(x[1]/5))}${'|'.repeat(x[1]%5)}</td></tr>`).join('')}</tbody></table>`,
  antw:v=>v.t==='hoeveel'?v.d[v.i][1]:v.d.reduce((a,x)=>a+x[1],0),
  stappen:v=>v.t==='hoeveel'?[st(`Bossen van 5: ${Math.floor(v.d[v.i][1]/5)}, losse streepjes: ${v.d[v.i][1]%5}`),st(`${v.d[v.i][1]}`,v.d[v.i][1])]:[st(v.d.map(x=>x[1]).join(' + ')),st(`= ${v.d.reduce((a,x)=>a+x[1],0)}`,v.d.reduce((a,x)=>a+x[1],0))],
  fouten:v=>[[v.t==='hoeveel'?Math.floor(v.d[v.i][1]/5)+v.d[v.i][1]%5:v.d[v.i][1],v.t==='hoeveel'?'Een bosje met een streep erdoor is 5, niet 1.':'Je moet alle dieren optellen.']],
  anders:v=>`Tel eerst de bosjes: 5, 10, … Tel daarna de losse streepjes erbij.`
});

// ================= NIVEAU 2 (tafels, getallen tot 1000) =================
L({id:'G02.tafels',niv:2,dom:'G',sub:'bewerkingen',naam:'De tafels van 1 tot en met 10',
  uitleg:'Keer is herhaald optellen: 4 × 5 = 5 + 5 + 5 + 5. Ken je 5 × 5, dan weet je 6 × 5 ook: er komt er één groepje bij.',
  gen(r){ const a=r.int(2,10),b=r.pick([2,3,4,5,10,r.int(2,10)]); const [e,m,i]=r.pick(SNOEP); return {a,b,m,i} },
  vraag:v=>`Er zijn ${v.a} zakjes. In elk zakje zitten ${v.b} ${v.m}. Hoeveel ${v.m} zijn het samen?`,
  fig:v=>v.a<=5&&v.b<=6?FIG.groepjes(v.a,v.b,v.i):'',
  antw:v=>v.a*v.b,
  stappen:v=>[st(`${v.a} × ${v.b}`),st(`= ${v.a*v.b}`,v.a*v.b)],
  fouten:v=>[[v.a+v.b,'Je telde op. Er zijn '+v.a+' groepjes van '+v.b+': dat is keer.'],[(v.a-1)*v.b,'Je bent één groepje vergeten.'],[v.a*v.b+v.b,'Eén groepje te veel.']],
  anders:v=>`Tel met sprongen van ${v.b}: ${Array.from({length:v.a},(_,i)=>(i+1)*v.b).join(', ')}.`
});
L({id:'G02.tot100',niv:2,dom:'G',sub:'bewerkingen',naam:'Plus en min tot 100',
  uitleg:'Rijgen: eerst de tientallen, dan de eenheden. 47 + 25 = 47 + 20 + 5 = 67 + 5 = 72.',
  gen(r){ const op=r.ja()?'+':'−'; let a,b; if(op==='+'){ a=r.int(15,75); b=r.int(12,99-a) } else { a=r.int(40,99); b=r.int(12,a-10) } return {op,a,b,c:r.pick(['bladzijden in je boek','punten bij een spel','meter in het zwembad','plaatjes in je album'])} },
  vraag:v=>v.op==='+'?`Je hebt ${v.a} ${v.c}. Er komen ${v.b} bij. Hoeveel zijn het er nu?`:`Je hebt ${v.a} ${v.c}. Er gaan ${v.b} af. Hoeveel blijven er over?`,
  antw:v=>v.op==='+'?v.a+v.b:v.a-v.b,
  stappen:v=>{ const t=Math.floor(v.b/10)*10,e=v.b%10,z=v.op==='+'?v.a+t:v.a-t,w=v.op==='+'?v.a+v.b:v.a-v.b; return [st(`${v.a} ${v.op} ${t} = ${z}`,z),st(`${z} ${v.op} ${e} = ${w}`,w)] },
  fouten:v=>[[v.op==='+'?v.a+v.b-10:v.a-v.b+10,'Let op bij het overschrijden van een tiental.'],[v.op==='+'?v.a-v.b:v.a+v.b,v.op==='+'?'Er komen er bij: plus.':'Er gaan er af: min.']],
  anders:v=>({tekst:`Spring op de lege getallenlijn: eerst ${Math.floor(v.b/10)*10}, dan ${v.b%10}.`,svg:FIG.lijn(Math.floor(Math.min(v.a,v.op==='+'?v.a:v.a-v.b)/10)*10,Math.ceil(Math.max(v.a,v.op==='+'?v.a+v.b:v.a)/10)*10,10,[{x:v.a,label:String(v.a)},{x:v.op==='+'?v.a+v.b:v.a-v.b,label:'?',k:'b'}])})
});
L({id:'G02.tot1000',niv:2,dom:'G',sub:'getalbegrip',naam:'Getallen tot 1000: honderdtallen, tientallen, eenheden',
  uitleg:'Een plak is 100, een staaf is 10, een blokje is 1. 3 plakken, 4 staven en 2 blokjes = 342.',
  gen(r){ return {h:r.int(1,4),t:r.int(0,9),e:r.int(0,9)} },
  vraag:v=>`Welk getal zie je? (Een plak is 100, een staaf is 10, een blokje is 1.)`,
  fig:v=>FIG.blokjes(v.h,v.t,v.e),
  antw:v=>100*v.h+10*v.t+v.e,
  stappen:v=>[st(`${v.h} × 100 = ${100*v.h}`,100*v.h),st(`${v.t} × 10 = ${10*v.t}`,10*v.t),st(`${100*v.h} + ${10*v.t} + ${v.e} = ${100*v.h+10*v.t+v.e}`,100*v.h+10*v.t+v.e)],
  fouten:v=>[[v.h+v.t+v.e,'Je telde de stukken. Een plak is 100 en een staaf is 10.'],[100*v.h+v.t+10*v.e,'Je verwisselde de staven en de blokjes.']],
  anders:v=>`Schrijf in een tabel: H | T | E → ${v.h} | ${v.t} | ${v.e}. Lees het getal van links naar rechts.`
});
L({id:'V02.keerverdelen',niv:2,dom:'V',sub:'vtabel',naam:'Verdelen met de tafels',
  uitleg:'Delen is het omgekeerde van keer. 24 : 4 = ? Denk: 4 × ? = 24. Dat is 6.',
  gen(r){ const g=r.int(2,10),n=r.int(2,10); return {g,n,tot:g*n,c:r.pick([['stoelen','rijen','in elke rij'],['kinderen','teams','in elk team'],['plantjes','bakken','in elke bak'],['eieren','doosjes','in elk doosje']])} },
  vraag:v=>`Er zijn ${v.tot} ${v.c[0]}. Ze worden eerlijk verdeeld over ${v.g} ${v.c[1]}. Hoeveel ${v.c[0]} komen er ${v.c[2]}?`,
  antw:v=>v.n,
  tabel:v=>({kop:[v.c[1],v.c[0]],rijen:[[1,v.n],[v.g,v.tot]],leeg:[[0,1]]}),
  stappen:v=>[st(`${v.tot} : ${v.g} = ?`),st(`${v.g} × ${v.n} = ${v.tot}`,v.n)],
  fouten:v=>[[v.tot-v.g,'Je trok af. Je moet verdelen: delen.'],[v.tot*v.g,'Je deed keer. Verdelen is delen.'],[v.n+1,'Controleer: '+v.g+' × '+(v.n+1)+' is meer dan '+v.tot+'.']],
  anders:v=>`Welke tafel van ${v.g} geeft ${v.tot}? Tel met sprongen van ${v.g} tot ${v.tot} en tel hoeveel sprongen je maakt.`
});
L({id:'V02.prijs',niv:2,dom:'V',sub:'vtabel',naam:'Hoeveel kost het samen?',
  uitleg:'Weet je wat één ding kost, dan doe je keer het aantal. Een tabel helpt: 1 → 3 euro, 4 → 12 euro.',
  gen(r){ const p=r.int(2,9),n=r.int(2,6); return {p,n,d:r.pick(['ijsjes','kaartjes voor de kinderboerderij','ballonnen','stickervellen'])} },
  vraag:v=>`Eén van de ${v.d} kost € ${v.p}. Je koopt er ${v.n}. Hoeveel euro betaal je?`,
  antw:v=>v.p*v.n, eenheid:'€',
  tabel:v=>({kop:['aantal','euro'],rijen:[[1,v.p],[v.n,v.p*v.n]],leeg:[[1,1]]}),
  stappen:v=>[st(`1 kost € ${v.p}`,v.p),st(`${v.n} × ${v.p} = ${v.p*v.n}`,v.p*v.n)],
  fouten:v=>[[v.p+v.n,'Je telde op. Je koopt '+v.n+' keer iets van € '+v.p+'.'],[v.p*(v.n-1),'Je bent er één vergeten.']],
  anders:v=>`Tel door met € ${v.p} per stuk: ${Array.from({length:v.n},(_,i)=>(i+1)*v.p).join(', ')}.`
});
L({id:'M02.klok',niv:2,dom:'M',sub:'tijd',naam:'Klokkijken: kwartieren',
  uitleg:'Op de 3 is het kwart over, op de 6 half, op de 9 kwart voor het volgende uur.',
  gen(r){ return {u:r.int(1,12),m:r.pick([0,15,30,45])} },
  vraag:v=>`Hoe laat is het op de klok?`,
  fig:v=>FIG.klok(v.u,v.m),
  opties:v=>{ const goed=uurTekst(v.u,v.m); const f=[[uurTekst(v.u,(v.m+30)%60),'Kijk precies waar de grote wijzer staat.'],[v.m===45?'kwart voor '+v.u:v.m===30?'half '+v.u:uurTekst(v.u+1,v.m),'Bij kwart voor en half kijk je naar het volgende uur.'],[uurTekst(v.u,v.m===15?45:15),'Kwart over is op de 3, kwart voor op de 9.'],[uurTekst(v.u+1,0),'De grote wijzer staat niet op de 12.']];
    const u=[]; f.forEach(x=>{ if(x[0]!==goed&&!u.some(y=>y[0]===x[0])) u.push(x) }); return [[goed,true]].concat(u.slice(0,3).map(x=>[x[0],false,x[1]])) },
  anders:v=>`Verdeel de klok in vier stukken, zoals een taart. De grote wijzer staat op ${v.m===0?'de 12: heel uur':v.m===15?'de 3: kwart over':v.m===30?'de 6: half':'de 9: kwart voor'}.`
});
L({id:'M02.meten',niv:2,dom:'M',sub:'eenheden',naam:'Meten met de liniaal: centimeters',
  uitleg:'Leg het begin van het ding precies bij de 0 van de liniaal. Lees af waar het eindigt.',
  gen(r){ return {a:r.int(0,4),l:r.int(3,12),d:r.pick(['potlood','gum','sleutel','schelp','veer'])} },
  vraag:v=>v.a?`Het ${v.d==='gum'?'gum':v.d} ligt van ${v.a} cm tot ${v.a+v.l} cm op de liniaal. Hoe lang is het?`:`Hoe lang is de ${v.d}? Hij ligt van 0 tot ${v.l} cm.`,
  fig:v=>FIG.lijn(0,16,1,[{x:v.a,label:'begin'},{x:v.a+v.l,label:'eind',k:'b'}],2),
  antw:v=>v.l, eenheid:'cm',
  stappen:v=>[st(`Eind ${v.a+v.l}, begin ${v.a}`),st(`${v.a+v.l} − ${v.a} = ${v.l}`,v.l)],
  fouten:v=>[[v.a+v.l,'Dat is waar het eindigt. Het begint niet bij 0.'],[v.l+1,'Je telde de streepjes in plaats van de stukjes ertussen.']],
  anders:v=>`Tel de stukjes tussen begin en eind, niet de streepjes. Van ${v.a} naar ${v.a+v.l} zijn ${v.l} stukjes.`
});
L({id:'M02.wisselgeld',niv:2,dom:'M',sub:'tijd',naam:'Betalen en wisselgeld',
  uitleg:'Wisselgeld: hoeveel krijg je terug? Tel door van de prijs naar het bedrag dat je gaf.',
  gen(r){ const g=r.pick([5,10,20]); const p=r.int(1,g-1); return {g,p,d:r.pick(['een boek','een bal','een knuffel','een puzzel','een springtouw'])} },
  vraag:v=>`Je koopt ${v.d} van € ${v.p}. Je betaalt met een briefje van € ${v.g}. Hoeveel euro krijg je terug?`,
  fig:v=>FIG.munten([v.g]),
  antw:v=>v.g-v.p, eenheid:'€',
  stappen:v=>[st(`Van € ${v.p} naar € ${v.g}`),st(`${v.g} − ${v.p} = ${v.g-v.p}`,v.g-v.p)],
  fouten:v=>[[v.g+v.p,'Je telde op. Je krijgt geld terug: dat is minder.'],[v.p,'Dat is de prijs.']],
  anders:v=>`Tel door zoals in de winkel: € ${v.p} … tot € ${v.g}. Hoeveel euro heb je erbij geteld?`
});
L({id:'B02.tabel',niv:2,dom:'B',sub:'tabellen',naam:'Een tabel aflezen',
  uitleg:'Zoek eerst de goede rij, dan de goede kolom. Waar ze elkaar raken, staat het antwoord.',
  gen(r){ const dagen=['ma','di','wo','do','vr']; const w=dagen.map(()=>r.int(3,25)); if(new Set(w).size<2) w[0]++; let i=r.int(0,4),j; do{ j=r.int(0,4) }while(j===i||w[i]===w[j]); return {dagen,w,i,j,t:r.pick(['dag','verschil'])} },
  vraag:v=>v.t==='dag'?`De tabel laat zien hoeveel kinderen er elke dag zwemmen. Hoeveel kinderen zwemmen er op ${({ma:'maandag',di:'dinsdag',wo:'woensdag',do:'donderdag',vr:'vrijdag'})[v.dagen[v.i]]}?`:`Hoeveel kinderen zwemmen er op ${({ma:'maandag',di:'dinsdag',wo:'woensdag',do:'donderdag',vr:'vrijdag'})[v.dagen[v.i]]} meer of minder dan op ${({ma:'maandag',di:'dinsdag',wo:'woensdag',do:'donderdag',vr:'vrijdag'})[v.dagen[v.j]]}? Geef het verschil.`,
  fig:v=>vtabelHtml(['dag','kinderen'],v.dagen.map((d,i)=>[d,v.w[i]])),
  antw:v=>v.t==='dag'?v.w[v.i]:Math.abs(v.w[v.i]-v.w[v.j]),
  stappen:v=>v.t==='dag'?[st(`Kolom ${v.dagen[v.i]}`),st(`${v.w[v.i]} kinderen`,v.w[v.i])]:[st(`${v.dagen[v.i]}: ${v.w[v.i]}, ${v.dagen[v.j]}: ${v.w[v.j]}`),st(`Verschil: ${Math.abs(v.w[v.i]-v.w[v.j])}`,Math.abs(v.w[v.i]-v.w[v.j]))],
  fouten:v=>v.t==='dag'?[[v.w[(v.i+1)%5],'Je keek een dag te ver.']]:[[v.w[v.i]+v.w[v.j],'Je telde op. Verschil is aftrekken.']],
  anders:v=>`Leg je vinger op de dag en ga recht naar beneden naar het getal.`
});
L({id:'B02.patroon',niv:2,dom:'B',sub:'formules',naam:'Getallenrijen met sprongen',
  uitleg:'Zoek de sprong tussen twee getallen. Soms is het steeds + 3, soms steeds × 2.',
  gen(r){ const t=r.pick(['plus','plus','keer']); if(t==='keer') return {t,a:r.pick([1,2,3,5]),s:2}; return {t,a:r.int(1,30),s:r.pick([3,4,5,10,25])} },
  vraag:v=>`Welk getal komt hierna? ${[0,1,2,3].map(i=>v.t==='keer'?v.a*2**i:v.a+i*v.s).join(' · ')} · …`,
  antw:v=>v.t==='keer'?v.a*16:v.a+4*v.s,
  stappen:v=>[st(v.t==='keer'?'Steeds × 2 (verdubbelen)':`Steeds + ${v.s}`),st(`${v.t==='keer'?v.a*8+' × 2':(v.a+3*v.s)+' + '+v.s} = ${v.t==='keer'?v.a*16:v.a+4*v.s}`,v.t==='keer'?v.a*16:v.a+4*v.s)],
  fouten:v=>v.t==='keer'?[[v.a*8+v.a*4,'De sprongen worden steeds groter: het is steeds × 2.'],[v.a*8+2,'Er komt niet steeds 2 bij, het wordt steeds het dubbele.']]:[[v.a+3*v.s+1,'De sprong is '+v.s+', niet 1.'],[v.a+5*v.s,'Je sloeg er één over.']],
  anders:v=>`Schrijf onder elk paar getallen het verschil. Is dat steeds hetzelfde? Dan is het plus. Wordt het steeds groter? Kijk dan of het steeds het dubbele is.`
});

// ================= NIVEAU 3 (cijferen, delen, eerste breuken) =================
L({id:'G03.cijferen',niv:3,dom:'G',sub:'bewerkingen',naam:'Optellen en aftrekken onder elkaar',
  uitleg:'Zet de getallen precies onder elkaar: eenheden onder eenheden. Begin rechts. Wordt het 10 of meer, onthoud dan 1 bij de volgende kolom.',
  gen(r){ const op=r.ja()?'+':'−'; let a,b; if(op==='+'){ a=r.int(120,650); b=r.int(105,980-a) } else { a=r.int(300,999); b=r.int(105,a-50) } return {op,a,b} },
  vraag:v=>`Reken uit: ${v.a} ${v.op} ${v.b}`,
  antw:v=>v.op==='+'?v.a+v.b:v.a-v.b,
  stappen:v=>{ const w=v.op==='+'?v.a+v.b:v.a-v.b; return [st(`Eenheden: ${v.a%10} ${v.op} ${v.b%10}`),st(`Tientallen en honderdtallen daarna`),st(`${v.a} ${v.op} ${v.b} = ${w}`,w)] },
  fouten:v=>v.op==='+'?[[v.a+v.b-10,'Je vergat een 1 te onthouden.'],[v.a+v.b-100,'Je vergat een 1 te onthouden bij de honderdtallen.']]:[[Math.abs(v.a-v.b)+10,'Bij lenen wordt de kolom ernaast 1 minder.'],[kolomfout(v.a,v.b),'Je trok per kolom klein van groot af. Je moet lenen.']],
  anders:v=>`Je kunt ook rijgen: ${v.a} ${v.op} ${Math.floor(v.b/100)*100} = ${v.op==='+'?v.a+Math.floor(v.b/100)*100:v.a-Math.floor(v.b/100)*100}, dan de tientallen, dan de eenheden.`
});
L({id:'G03.keer',niv:3,dom:'G',sub:'bewerkingen',naam:'Keer met grotere getallen',
  uitleg:'Splits het grote getal: 6 × 23 = 6 × 20 + 6 × 3 = 120 + 18 = 138.',
  gen(r){ return {a:r.int(3,9),b:r.int(12,49),c:r.pick([['rijen van','stoelen in de aula'],['dozen met','potloden'],['weken met','minuten zwemles'],['tafels met','kinderen']])} },
  vraag:v=>`Er zijn ${v.a} ${v.c[0]} ${v.b} ${v.c[1].split(' ')[0]}. Hoeveel ${v.c[1].split(' ')[0]} zijn dat samen?`,
  antw:v=>v.a*v.b,
  stappen:v=>[st(`${v.a} × ${Math.floor(v.b/10)*10} = ${v.a*Math.floor(v.b/10)*10}`,v.a*Math.floor(v.b/10)*10),st(`${v.a} × ${v.b%10} = ${v.a*(v.b%10)}`,v.a*(v.b%10)),st(`Samen ${v.a*v.b}`,v.a*v.b)],
  fouten:v=>[[v.a*Math.floor(v.b/10)*10+v.b%10,'Je vergat de eenheden ook keer '+v.a+' te doen.'],[v.a+v.b,'Je telde op. Het is '+v.a+' keer '+v.b+'.']],
  anders:v=>({tekst:`Teken een rechthoek van ${v.a} bij ${v.b}, gesplitst in ${Math.floor(v.b/10)*10} en ${v.b%10}.`,svg:FIG.balk([{w:Math.floor(v.b/10)*10,label:`${v.a} × ${Math.floor(v.b/10)*10}`},{w:Math.max(3,v.b%10),label:`${v.a} × ${v.b%10}`}])})
});
L({id:'G03.rest',niv:3,dom:'G',sub:'bewerkingen',naam:'Delen met rest',
  uitleg:'Bij delen blijft er soms iets over. 23 : 5 = 4, rest 3, want 4 × 5 = 20 en er blijven 3 over.',
  gen(r){ const d=r.int(3,8),q=r.int(3,9),rest=r.int(1,d-1); return {d,q,rest,n:d*q+rest,c:r.pick(['knikkers','stickers','kaarten'])} },
  vraag:v=>`Je verdeelt ${v.n} ${v.c} eerlijk over ${v.d} kinderen. Hoeveel ${v.c} blijven er over?`,
  antw:v=>v.rest,
  stappen:v=>[st(`${v.d} × ${v.q} = ${v.d*v.q}`,v.d*v.q),st(`${v.n} − ${v.d*v.q} = ${v.rest}`,v.rest)],
  fouten:v=>[[v.q,'Dat is hoeveel ieder kind krijgt. De vraag is wat er overblijft.'],[v.rest+v.d,'Daar kan nog ieder kind er één van krijgen.']],
  anders:v=>`Welke tafel van ${v.d} komt het dichtst onder ${v.n}? ${v.d} × ${v.q} = ${v.d*v.q}. Wat is het verschil met ${v.n}?`
});
L({id:'G03.breuk',niv:3,dom:'G',sub:'breuken',naam:'Breuken: de helft, een kwart, een derde',
  uitleg:'Een breuk is een stuk van iets heels. Bij 1/4 verdeel je het geheel in 4 gelijke stukken en neem je er 1.',
  gen(r){ const [t,n]=r.pick([[1,2],[1,4],[3,4],[1,3],[2,3],[1,5],[2,5],[1,8],[3,8]]); return {t,n} },
  vraag:v=>`Welk deel van de strook is gekleurd?`,
  fig:v=>FIG.strook(v.t,v.n),
  opties:v=>{ const goed=`${v.t}/${v.n}`; const f=[[`${v.t}/${v.n-v.t}`,'Je vergeleek gekleurd met niet-gekleurd. De noemer is het aantal stukken in totaal.'],[`${v.n-v.t}/${v.n}`,'Dat is het deel dat níet gekleurd is.'],[`${v.n}/${v.t}`,'Teller en noemer zijn omgedraaid.'],[`1/${v.n}`,'Er zijn meer stukken gekleurd.']];
    const u=[]; f.forEach(x=>{ if(x[0]!==goed&&!u.some(y=>y[0]===x[0])) u.push(x) }); return [[goed,true]].concat(u.slice(0,3).map(x=>[x[0],false,x[1]])) },
  anders:v=>`Tel eerst alle stukken: ${v.n}. Dat komt onder de streep. Tel dan de gekleurde stukken: ${v.t}. Dat komt boven de streep.`
});
L({id:'V03.tabel',niv:3,dom:'V',sub:'vtabel',naam:'Verhoudingstabel: hoeveel voor zoveel?',
  uitleg:'In een verhoudingstabel doe je boven en onder hetzelfde. Keer 2 boven? Dan ook keer 2 onder.',
  gen(r){ const a=r.int(2,5),p=r.int(2,8),f=r.int(2,5); return {a,p,f,b:a*f,d:r.pick(['zakjes chips','pakjes drinken','vellen stickers','zakjes zaadjes'])} },
  vraag:v=>`${v.a} ${v.d} kosten samen € ${v.a*v.p}. Hoeveel kosten ${v.b} ${v.d}?`,
  antw:v=>v.b*v.p, eenheid:'€',
  tabel:v=>({kop:['aantal','euro'],rijen:[[v.a,v.a*v.p],[v.b,v.b*v.p]],leeg:[[1,1]]}),
  stappen:v=>[st(`${v.a} → € ${v.a*v.p}`),st(`× ${v.f}: ${v.b} → ${v.f} × ${v.a*v.p}`),st(`= € ${v.b*v.p}`,v.b*v.p)],
  fouten:v=>[[v.a*v.p+(v.b-v.a),'Je telde het verschil in aantal erbij. In een verhoudingstabel doe je keer.'],[v.a*v.p*v.b,'Je deed keer '+v.b+' in plaats van keer '+v.f+'.']],
  anders:v=>`Reken eerst uit wat 1 kost: € ${v.a*v.p} : ${v.a} = € ${v.p}. Doe dan keer ${v.b}.`
});
L({id:'V03.recept',niv:3,dom:'V',sub:'vtabel',naam:'Een recept voor meer kinderen',
  uitleg:'Maak je een recept voor twee keer zoveel kinderen, dan heb je van alles twee keer zoveel nodig.',
  gen(r){ const k=r.pick([2,4]),f=r.pick([2,3]); const [d,h,e]=r.pick([['eieren',r.int(1,3),''],['bloem',r.pick([100,150,200,250]),'gram'],['melk',r.pick([200,250,300]),'ml'],['suiker',r.pick([50,75,100]),'gram']]); return {k,f,d,h,e} },
  vraag:v=>`Voor pannenkoeken voor ${v.k} kinderen heb je ${v.h}${v.e?' '+v.e:''} ${v.d} nodig. Hoeveel${v.e?' '+v.e:''} ${v.d} heb je nodig voor ${v.k*v.f} kinderen?`,
  antw:v=>v.h*v.f, eenheid:v=>v.e,
  tabel:v=>({kop:['kinderen',v.d],rijen:[[v.k,v.h],[v.k*v.f,v.h*v.f]],leeg:[[1,1]]}),
  stappen:v=>[st(`${v.k*v.f} kinderen is ${v.f} keer zoveel als ${v.k}`),st(`${v.f} × ${v.h} = ${v.h*v.f}`,v.h*v.f)],
  fouten:v=>[[v.h+v.k*(v.f-1),'Je telde het aantal extra kinderen erbij. Alles wordt '+v.f+' keer zoveel.'],[v.h*v.k*v.f,'Je deed keer het aantal kinderen. Het is maar '+v.f+' keer zoveel.']],
  anders:v=>`Doe het recept ${v.f} keer: ${Array.from({length:v.f},()=>v.h).join(' + ')} = ${v.h*v.f}.`
});
L({id:'M03.omtrek',niv:3,dom:'M',sub:'oppervlak',naam:'Omtrek en oppervlakte in hokjes',
  uitleg:'Omtrek: hoe lang is de rand eromheen? Oppervlakte: hoeveel hokjes passen erin?',
  gen(r){ return {b:r.int(2,8),h:r.int(2,6),t:r.pick(['omtrek','opp']),d:r.pick(['moestuintje','zandbak','vloerkleed','zwembadje'])} },
  vraag:v=>v.t==='omtrek'?`Het ${v.d} is ${v.b} hokjes lang en ${v.h} hokjes breed. Elk hokje is 1 meter. Hoeveel meter hek moet er rondom?`:`Het ${v.d} is ${v.b} hokjes lang en ${v.h} hokjes breed. Hoeveel hokjes is dat?`,
  fig:v=>FIG.hokjes(v.b,v.h),
  antw:v=>v.t==='omtrek'?2*(v.b+v.h):v.b*v.h, eenheid:v=>v.t==='omtrek'?'m':'hokjes',
  stappen:v=>v.t==='omtrek'?[st(`${v.b} + ${v.h} + ${v.b} + ${v.h}`),st(`= ${2*(v.b+v.h)}`,2*(v.b+v.h))]:[st(`${v.h} rijen van ${v.b}`),st(`${v.h} × ${v.b} = ${v.b*v.h}`,v.b*v.h)],
  fouten:v=>v.t==='omtrek'?[[v.b*v.h,'Dat is de oppervlakte (de hokjes erin). Het hek gaat langs de rand.'],[v.b+v.h,'Je deed maar twee kanten. Er zijn vier kanten.']]:[[2*(v.b+v.h),'Dat is de rand eromheen. Tel de hokjes erin.'],[v.b+v.h,'Je telde op. Het zijn '+v.h+' rijen van '+v.b+'.']],
  anders:v=>v.t==='omtrek'?`Loop met je vinger langs de rand en tel elk stukje: boven ${v.b}, rechts ${v.h}, onder ${v.b}, links ${v.h}.`:`Tel één rij: ${v.b} hokjes. Er zijn ${v.h} rijen.`
});
L({id:'M03.tijdsduur',niv:3,dom:'M',sub:'tijd',naam:'Hoe lang duurt het?',
  uitleg:'Tel eerst door naar het hele uur, dan de hele uren, dan de rest. Een uur is 60 minuten.',
  gen(r){ const s=r.int(8,16)*60+r.pick([0,15,30,45]); const d=r.pick([30,45,60,75,90,105,120]); const [c1,c2]=r.pick([['De zwemles begint om','is afgelopen om'],['De film begint om','is afgelopen om'],['De voetbaltraining begint om','is klaar om'],['Het feestje begint om','is afgelopen om']]); return {s,d,c1,c2} },
  vraag:v=>`${v.c1} ${tijdStr(v.s)} en ${v.c2} ${tijdStr(v.s+v.d)}. Hoeveel minuten duurt het?`,
  antw:v=>v.d, eenheid:'min',
  stappen:v=>[st(`Van ${tijdStr(v.s)} tot ${tijdStr(v.s+v.d)}`),st(`${Math.floor(v.d/60)} uur en ${v.d%60} minuten`),st(`= ${v.d} minuten`,v.d)],
  fouten:v=>[[Math.floor(v.d/60)*100+v.d%60,'Een uur is 60 minuten, niet 100.'],[v.d%60||60,'Je vergat de hele uren.']],
  anders:v=>({tekst:'Spring op de tijdlijn in stappen van een kwartier.',svg:FIG.lijn(v.s,v.s+v.d,15,[{x:v.s,label:tijdStr(v.s)},{x:v.s+v.d,label:tijdStr(v.s+v.d),k:'b'}])})
});
L({id:'B03.staaf',niv:3,dom:'B',sub:'grafieken',naam:'Een staafgrafiek lezen',
  uitleg:'Kijk eerst hoeveel één streepje op de as waard is. Lees dan af tot waar de staaf komt.',
  gen(r){ const d=r.shuffle(['hond','kat','konijn','vis','cavia']).slice(0,4); const w=d.map(()=>r.int(1,10)); if(new Set(w).size<2) w[0]=w[0]%10+1; let i=r.int(0,3),j; do{j=r.int(0,3)}while(j===i||w[j]===w[i]); return {d,w,i,j,t:r.pick(['een','verschil'])} },
  vraag:v=>v.t==='een'?`De kinderen van een klas vertellen welk huisdier ze hebben. Hoeveel kinderen hebben een ${v.d[v.i]}?`:`Hoeveel kinderen hebben een ${v.d[v.i]} meer of minder dan een ${v.d[v.j]}? Geef het verschil.`,
  fig:v=>FIG.staaf(v.d,v.w,{ymax:12,ys:2,yl:'aantal kinderen'}),
  antw:v=>v.t==='een'?v.w[v.i]:Math.abs(v.w[v.i]-v.w[v.j]),
  stappen:v=>v.t==='een'?[st(`De staaf van ${v.d[v.i]} komt tot ${v.w[v.i]}`,v.w[v.i])]:[st(`${v.d[v.i]}: ${v.w[v.i]}, ${v.d[v.j]}: ${v.w[v.j]}`),st(`Verschil ${Math.abs(v.w[v.i]-v.w[v.j])}`,Math.abs(v.w[v.i]-v.w[v.j]))],
  fouten:v=>v.t==='een'?[[Math.ceil(v.w[v.i]/2),'Je telde de streepjes. Elk streepje is 2 kinderen.']]:[[v.w[v.i]+v.w[v.j],'Je telde op. Verschil is aftrekken.']],
  anders:v=>`Leg een liniaal plat tegen de bovenkant van de staaf en kijk welk getal hij raakt.`
});
L({id:'B03.rooster',niv:3,dom:'B',sub:'tabellen',naam:'Een rooster of dienstregeling lezen',
  uitleg:'Zoek de goede regel en de goede kolom. Bij tijden reken je met 60 minuten in een uur.',
  gen(r){ const s=r.int(8,15)*60+r.pick([0,10,20,30]); const st0=[0,r.int(4,8)]; st0.push(st0[1]+r.int(5,9)); st0.push(st0[2]+r.int(4,8)); return {s,st:st0,i:r.int(1,3)} },
  vraag:v=>`De bus vertrekt om ${tijdStr(v.s)} bij school. Kijk in de tabel. Hoeveel minuten doet de bus over de rit van school naar ${['school','de bieb','het zwembad','de speeltuin'][v.i]}?`,
  fig:v=>vtabelHtml(['halte','tijd'],['school','de bieb','het zwembad','de speeltuin'].map((h,i)=>[h,tijdStr(v.s+v.st[i])])),
  antw:v=>v.st[v.i], eenheid:'min',
  stappen:v=>[st(`${tijdStr(v.s)} → ${tijdStr(v.s+v.st[v.i])}`),st(`${v.st[v.i]} minuten`,v.st[v.i])],
  fouten:v=>[[v.st[v.i]-v.st[v.i-1]||v.st[v.i]+1,'Dat is alleen het laatste stukje. De rit begint bij school.']],
  anders:v=>`Tel door op de klok van ${tijdStr(v.s)} naar ${tijdStr(v.s+v.st[v.i])}.`
});

// ================= NIVEAU 4 (op weg naar 1F) =================
L({id:'G04.groot',niv:4,dom:'G',sub:'getalbegrip',naam:'Grote getallen tot 100.000',
  uitleg:'Groepeer per drie cijfers van rechts: 45.302 = 45 duizend 302. Afronden: kijk naar het cijfer achter de plek waarop je afrondt.',
  gen(r){ const x=r.int(1200,99000); return {x,op:r.pick([100,1000]),c:r.pick(['bezoekers in de dierentuin','stappen in een week','kijkers van een filmpje','toeschouwers in het stadion'])} },
  vraag:v=>`Er waren ${nl(v.x,0)} ${v.c}. Rond af op ${v.op===100?'honderdtallen':'duizendtallen'}.`,
  antw:v=>Math.round(v.x/v.op)*v.op,
  stappen:v=>[st(`Kijk naar het cijfer achter de ${v.op===100?'honderdtallen':'duizendtallen'}`),st(`${nl(Math.round(v.x/v.op)*v.op,0)}`,Math.round(v.x/v.op)*v.op)],
  fouten:v=>[[Math.floor(v.x/v.op)*v.op===Math.round(v.x/v.op)*v.op?Math.ceil(v.x/v.op)*v.op:Math.floor(v.x/v.op)*v.op,'Bij 5 of meer rond je naar boven af, anders naar beneden.'],[Math.round(v.x/(v.op===100?1000:100))*(v.op===100?1000:100),'Kijk goed op welke plek je moet afronden.']],
  anders:v=>({tekst:'Op welk rond getal ligt hij het dichtst?',svg:FIG.lijn(Math.floor(v.x/v.op)*v.op,Math.ceil(v.x/v.op)*v.op+(v.x%v.op===0?v.op:0),v.op/10,[{x:v.x,label:nl(v.x,0)}],5)})
});
L({id:'G04.kommageld',niv:4,dom:'G',sub:'komma',naam:'Kommagetallen met geld',
  uitleg:'Bij geld staan de centen achter de komma. € 2,45 + € 1,80: tel eerst de euro\'s, dan de centen. 100 cent is 1 euro.',
  gen(r){ const a=r.int(105,895),b=r.int(55,495); return {a,b,op:r.ja()?'+':'−',c:r.pick(['een ijsje en een flesje water','een stripboek en een pen','een broodje en een appel'])} },
  vraag:v=>v.op==='+'?`Je koopt ${v.c}: € ${nl(v.a/100,2).replace(/,(\d)$/,',$10')} en € ${nl(v.b/100,2).replace(/,(\d)$/,',$10')}. Hoeveel betaal je samen?`:`Je hebt € ${nl((v.a+v.b)/100,2).replace(/,(\d)$/,',$10')}. Je geeft € ${nl(v.b/100,2).replace(/,(\d)$/,',$10')} uit. Hoeveel houd je over?`,
  antw:v=>v.op==='+'?(v.a+v.b)/100:v.a/100, eenheid:'€',
  stappen:v=>v.op==='+'?[st(`${v.a} cent + ${v.b} cent = ${v.a+v.b} cent`,v.a+v.b),st(`= € ${nl((v.a+v.b)/100,2)}`,(v.a+v.b)/100)]:[st(`${v.a+v.b} cent − ${v.b} cent = ${v.a} cent`,v.a),st(`= € ${nl(v.a/100,2)}`,v.a/100)],
  fouten:v=>v.op==='+'?[[(v.a+v.b)/10,'De komma staat verkeerd. Schat: past het bedrag?'],[Math.floor(v.a/100)+Math.floor(v.b/100)+((v.a%100+v.b%100)%100)/100,'100 cent is 1 euro: vergeet die euro niet.']]:[[(v.a+2*v.b)/100,'Je telde op. Uitgeven is aftrekken.']],
  anders:v=>`Reken in centen: € ${nl(v.a/100,2)} = ${v.a} cent. Reken uit en zet daarna de komma terug.`
});
L({id:'G04.breukvan',niv:4,dom:'G',sub:'breuken',naam:'Een breuk van een aantal',
  uitleg:'1/4 van 20: verdeel 20 in 4 gelijke groepjes. Eén groepje is 5. Bij 3/4 neem je 3 groepjes: 15.',
  gen(r){ const [t,n]=r.pick([[1,2],[1,3],[1,4],[3,4],[2,3],[1,5],[2,5],[1,10]]); const k=r.int(2,8); const [e,m]=r.pick(SNOEP); return {t,n,tot:n*k,m} },
  vraag:v=>`Er zijn ${v.tot} ${v.m}. Je krijgt ${breuk(v.t,v.n)} deel. Hoeveel ${v.m} krijg je?`,
  fig:v=>FIG.strook(v.t,v.n,`${v.tot} ${v.m} in ${v.n} gelijke stukken`),
  antw:v=>v.tot/v.n*v.t,
  stappen:v=>[st(`1 stuk: ${v.tot} : ${v.n} = ${v.tot/v.n}`,v.tot/v.n),st(`${v.t} stuk${v.t>1?'ken':''}: ${v.t} × ${v.tot/v.n} = ${v.tot/v.n*v.t}`,v.tot/v.n*v.t)],
  fouten:v=>[[v.tot/v.n,v.t>1?'Dat is 1 stuk. Je hebt er '+v.t+' nodig.':'Bijna.'],[v.tot/v.t,'Je deelde door de teller. Deel door de noemer: '+v.n+' stukken.'],[v.tot-v.t,'Je trok de teller eraf.']].filter(x=>x[0]!==v.tot/v.n*v.t),
  anders:v=>`Teken ${v.n} vakjes. Verdeel de ${v.tot} ${v.m} eerlijk: ${v.tot/v.n} per vakje. Kleur ${v.t} vakje${v.t>1?'s':''}.`
});
L({id:'V04.schaal',niv:4,dom:'V',sub:'schaal',naam:'Plattegrond: 1 cm is ... meter',
  uitleg:'Op een plattegrond is alles kleiner. Staat er "1 cm is 5 m", dan is 3 cm op de kaart 3 × 5 = 15 meter echt.',
  gen(r){ return {s:r.pick([2,5,10,20,50]),cm:r.int(2,9),d:r.pick(['de speeltuin','het voetbalveld','het schoolplein','de camping'])} },
  vraag:v=>`Op de plattegrond van ${v.d} is 1 cm in het echt ${v.s} meter. De glijbaan staat ${v.cm} cm van de ingang. Hoeveel meter is dat echt?`,
  antw:v=>v.s*v.cm, eenheid:'m',
  tabel:v=>({kop:['kaart (cm)','echt (m)'],rijen:[[1,v.s],[v.cm,v.s*v.cm]],leeg:[[1,1]]}),
  stappen:v=>[st(`1 cm → ${v.s} m`),st(`${v.cm} cm → ${v.cm} × ${v.s} = ${v.s*v.cm} m`,v.s*v.cm)],
  fouten:v=>[[v.s+v.cm,'Je telde op. Elke cm is '+v.s+' meter: dat is keer.'],[v.cm,'Dat is de afstand op de kaart.']],
  anders:v=>`Zet de stapjes op een rij: ${Array.from({length:Math.min(v.cm,6)},(_,i)=>(i+1)*v.s+' m').join(', ')}${v.cm>6?' …':''}.`
});
L({id:'V04.verhouding',niv:4,dom:'V',sub:'vtabel',naam:'Verhoudingen: van 1 naar meer',
  uitleg:'Reken eerst uit hoeveel het voor 1 is. Daarna kun je het voor elk aantal uitrekenen.',
  gen(r){ const n=r.int(3,6),p=r.int(3,12),m=r.int(2,9); return {n,p,m,d:r.pick([['kaartjes voor het zwembad','euro'],['zakjes voer voor de konijnen','euro'],['rondjes in de draaimolen','muntjes']])} },
  vraag:v=>`${v.n} ${v.d[0]} kosten ${v.n*v.p} ${v.d[1]}. Hoeveel ${v.d[1]} kosten ${v.m} ${v.d[0]}?`,
  antw:v=>v.m*v.p,
  tabel:v=>({kop:['aantal',v.d[1]],rijen:[[v.n,v.n*v.p],[1,v.p],[v.m,v.m*v.p]],leeg:[[1,1],[2,1]]}),
  stappen:v=>[st(`1 kost ${v.n*v.p} : ${v.n} = ${v.p}`,v.p),st(`${v.m} kosten ${v.m} × ${v.p} = ${v.m*v.p}`,v.m*v.p)],
  fouten:v=>[[v.n*v.p+(v.m-v.n),'Je telde het verschil in aantal erbij. Reken eerst uit wat 1 kost.'],[v.n*v.p*v.m,'Je vergat eerst te delen door '+v.n+'.']],
  anders:v=>({tekst:'Maak een verhoudingstabel met 1 in het midden.',tabel:{kop:['aantal',v.d[1]],rijen:[[v.n,v.n*v.p],[1,v.p],[v.m,v.m*v.p]]}})
});
L({id:'M04.eenheden',niv:4,dom:'M',sub:'eenheden',naam:'Meter, centimeter, kilo en gram',
  uitleg:'1 meter = 100 centimeter. 1 kilogram = 1000 gram. 1 liter = 10 deciliter = 1000 milliliter.',
  gen(r){ const [a,b,f,d,lijst]=r.pick([['m','cm',100,'Een springtouw is',[2,3,4]],['kg','gram',1000,'Een zak aardappels weegt',[2,3,5]],['liter','ml',1000,'Een fles limonade is',[1,2]],['km','m',1000,'De wandeling is',[2,3,5]]]); const x=r.pick(lijst)+r.pick([0,0,0.5]); return {a,b,f,d,x} },
  vraag:v=>`${v.d} ${nl(v.x)} ${v.a}. Hoeveel ${v.b} is dat?`,
  antw:v=>v.x*v.f, eenheid:v=>v.b,
  stappen:v=>[st(`1 ${v.a} = ${v.f} ${v.b}`,v.f),st(`${nl(v.x)} × ${v.f} = ${nl(v.x*v.f)}`,v.x*v.f)],
  fouten:v=>[[v.x*(v.f===100?1000:100),'Let op: 1 '+v.a+' is '+v.f+' '+v.b+'.'],[v.x/v.f,'Je deelde. Naar een kleinere maat wordt het getal groter.']],
  anders:v=>`Een ${v.b} is klein, een ${v.a} is groot. In één ${v.a} passen ${v.f} ${v.b}. Dus het getal wordt ${v.f} keer zo groot.`
});
L({id:'M04.opp',niv:4,dom:'M',sub:'oppervlak',naam:'Oppervlakte van een rechthoek in m²',
  uitleg:'Oppervlakte = lengte × breedte. Een vierkant van 1 meter bij 1 meter is 1 m².',
  gen(r){ return {l:r.int(3,12),b:r.int(2,8),d:r.pick(['de slaapkamer','het grasveld van de speeltuin','de moestuin','het podium'])} },
  vraag:v=>`${v.d[0].toUpperCase()+v.d.slice(1)} is ${v.l} meter lang en ${v.b} meter breed. Hoeveel m² is dat?`,
  fig:v=>FIG.hokjes(v.l,v.b),
  antw:v=>v.l*v.b, eenheid:m2,
  stappen:v=>[st(`${v.l} × ${v.b}`),st(`= ${v.l*v.b} m²`,v.l*v.b)],
  fouten:v=>[[2*(v.l+v.b),'Dat is de omtrek (de rand). Oppervlakte is lengte × breedte.'],[v.l+v.b,'Je telde op. Het is lengte keer breedte.']],
  anders:v=>`Er passen ${v.b} rijen van ${v.l} vierkante meters in.`
});
L({id:'M04.liter',niv:4,dom:'M',sub:'inhoud',naam:'Liters en bekers',
  uitleg:'Hoeveel bekers kun je vullen? Zet alles in dezelfde maat (ml) en deel.',
  gen(r){ const b=r.pick([100,125,200,250]); const l=r.pick([1,1.5,2]); return {b,l} },
  vraag:v=>`Je hebt ${nl(v.l)} liter limonade. In een beker gaat ${v.b} ml. Hoeveel bekers kun je vullen?`,
  antw:v=>v.l*1000/v.b,
  stappen:v=>[st(`${nl(v.l)} liter = ${v.l*1000} ml`,v.l*1000),st(`${v.l*1000} : ${v.b} = ${v.l*1000/v.b}`,v.l*1000/v.b)],
  fouten:v=>[[v.l*100/v.b,'1 liter is 1000 ml, niet 100.'],[Math.round(v.b/v.l),'Je deelde de verkeerde kant op.']].filter(x=>Number.isFinite(x[0])),
  anders:v=>`1 liter = 1000 ml. Hoe vaak past ${v.b} in 1000? Doe dat ${nl(v.l)} keer.`
});
L({id:'B04.lijn',niv:4,dom:'B',sub:'grafieken',naam:'Een lijngrafiek aflezen',
  uitleg:'Een lijngrafiek laat zien hoe iets verandert. Zoek het tijdstip op de onderste as en ga recht omhoog naar de lijn.',
  gen(r){ const t=[8,10,12,14,16]; let w=[r.pick([14,16,18])]; for(let i=1;i<5;i++) w.push(w[i-1]+r.pick([-2,0,2,2,4])); if(new Set(w).size<2) w[4]+=2; let i=r.int(0,4),j; do{j=r.int(0,4)}while(j===i||w[i]===w[j]); return {t,w,i,j,s:r.pick(['een','verschil'])} },
  vraag:v=>v.s==='een'?`De grafiek laat de temperatuur op een zomerdag in de speeltuin zien. Hoe warm was het om ${v.t[v.i]}:00 uur?`:`Hoeveel graden scheelde het tussen ${v.t[v.i]}:00 en ${v.t[v.j]}:00 uur?`,
  fig:v=>FIG.grafiek([{punten:v.t.map((x,k)=>[x,v.w[k]])}],{xmin:8,xmax:16,xs:2,ymin:10,ymax:Math.max(...v.w)+2,ys:2,xl:'uur',yl:'°C'}),
  antw:v=>v.s==='een'?v.w[v.i]:Math.abs(v.w[v.i]-v.w[v.j]), eenheid:'graden',
  stappen:v=>v.s==='een'?[st(`Om ${v.t[v.i]}:00 → ${v.w[v.i]} °C`,v.w[v.i])]:[st(`${v.w[v.i]} en ${v.w[v.j]}`),st(`Verschil ${Math.abs(v.w[v.i]-v.w[v.j])}`,Math.abs(v.w[v.i]-v.w[v.j]))],
  fouten:v=>v.s==='een'?[[v.w[(v.i+1)%5],'Je keek bij een ander tijdstip.']]:[[v.w[v.i]+v.w[v.j],'Het verschil is aftrekken.']],
  anders:v=>`Leg een liniaal rechtop bij het tijdstip. Waar raakt hij de lijn? Kijk dan opzij naar de getallen links.`
});
L({id:'B04.tabel',niv:4,dom:'B',sub:'tabellen',naam:'Rekenen met gegevens uit een tabel',
  uitleg:'Lees eerst de getallen die je nodig hebt. Schrijf ze op. Bedenk dan: plus, min, keer of delen?',
  gen(r){ const s=[['zwembad',r.pick([3,4,5])],['dierentuin',r.pick([12,14,15])],['bioscoop',r.pick([8,9,10])],['klimbos',r.pick([15,18,20])]]; const i=r.int(0,3),n=r.int(2,5); return {s,i,n} },
  vraag:v=>`In de tabel zie je wat een kaartje voor een kind kost. Je gaat met ${v.n} kinderen naar de ${v.s[v.i][0]}. Hoeveel euro kost dat?`,
  fig:v=>vtabelHtml(['uitje','prijs per kind (€)'],v.s.map(x=>[x[0],x[1]])),
  antw:v=>v.s[v.i][1]*v.n, eenheid:'€',
  stappen:v=>[st(`${v.s[v.i][0]}: € ${v.s[v.i][1]} per kind`,v.s[v.i][1]),st(`${v.n} × ${v.s[v.i][1]} = ${v.s[v.i][1]*v.n}`,v.s[v.i][1]*v.n)],
  fouten:v=>[[v.s[v.i][1]+v.n,'Je telde op. Voor elk kind betaal je een kaartje: keer.'],[v.s[(v.i+1)%4][1]*v.n,'Je keek in de verkeerde rij.']],
  anders:v=>`Zoek de rij van de ${v.s[v.i][0]}. Daar staat de prijs voor 1 kind. Jullie zijn met ${v.n}.`
});

// ================= aanvulling: elk domein op niveau 1 t/m 4 minstens drie leerdoelen =================
// twee lengtes naast elkaar, gemeten in blokjes
FIG.lengtes=lijst=>{ let o=''; lijst.forEach(([naam,n],r)=>{ const y=14+r*46; o+=FIG.t(10,y+22,naam,{a:'start',fs:15}); for(let i=0;i<n;i++) o+=`<rect x="${110+i*30}" y="${y}" width="28" height="28" rx="4" class="${r?'vlak b':'vlak a'}"/>` });
  return FIG.wrap(o,Math.max(260,120+Math.max(...lijst.map(x=>x[1]))*30),20+lijst.length*46) };
// beeldgrafiek: per rij een plaatje per stem
FIG.picto=(rijen,emoji)=>{ let o=''; rijen.forEach(([naam,n],r)=>{ const y=10+r*38; o+=FIG.t(10,y+22,naam,{a:'start',fs:15}); for(let i=0;i<n;i++) o+=`<text x="${110+i*30}" y="${y+24}" font-size="22">${emoji}</text>` });
  return FIG.wrap(o,Math.max(260,130+Math.max(...rijen.map(x=>x[1]))*30),16+rijen.length*38) };

L({id:'V01.groepjes',niv:1,dom:'V',sub:'vtabel',naam:'Groepjes van evenveel',
  uitleg:'Zie je groepjes die even groot zijn? Tel dan met sprongen: 3, 6, 9. Dat gaat sneller dan één voor één.',
  gen(r){ const g=r.int(2,4),n=r.int(2,5); const [e,m,i]=r.pick(SNOEP); return {g,n,m,i,zak:r.pick(['zakjes','bakjes','doosjes'])} },
  vraag:v=>`Er zijn ${v.g} ${v.zak}. In elk ${v.zak.slice(0,-1)} zitten ${v.n} ${v.m}. Hoeveel ${v.m} zijn het samen?`,
  fig:v=>FIG.groepjes(v.g,v.n,v.i),
  antw:v=>v.g*v.n,
  stappen:v=>[st(`Spring steeds ${v.n} verder: ${Array.from({length:v.g},(_,k)=>(k+1)*v.n).join(', ')}`),st(`Samen ${v.g*v.n}`,v.g*v.n)],
  fouten:v=>[[v.g+v.n,`Je telde ${v.g} en ${v.n} bij elkaar. Tel alle ${v.m}.`],[(v.g-1)*v.n,'Je bent één groepje vergeten.']],
  anders:v=>`Wijs elk groepje aan en zeg hardop: ${Array.from({length:v.g},(_,k)=>(k+1)*v.n).join(', ')}.`
});
L({id:'M01.lengte',niv:1,dom:'M',sub:'eenheden',naam:'Lengtes vergelijken met blokjes',
  uitleg:'Je meet een lengte door blokjes op een rij te leggen. Meer blokjes is langer. Het verschil zie je aan de blokjes die over zijn.',
  gen(r){ const d=r.shuffle([['potlood','gum'],['slang','worm'],['trein','auto'],['sjaal','sok']]).pop(); const a=r.int(5,10),b=r.int(2,a-1); return {d,a,b} },
  vraag:v=>`De ${v.d[0]} is ${v.a} blokjes lang. De ${v.d[1]} is ${v.b} blokjes lang. Hoeveel blokjes is de ${v.d[0]} langer?`,
  fig:v=>FIG.lengtes([[v.d[0],v.a],[v.d[1],v.b]]),
  antw:v=>v.a-v.b,
  stappen:v=>[st(`${v.a} blokjes en ${v.b} blokjes`),st(`${v.a} − ${v.b} = ${v.a-v.b}`,v.a-v.b)],
  fouten:v=>[[v.a+v.b,'Je telde alle blokjes. Je zoekt hoeveel er meer zijn.'],[v.a,`Dat is de hele ${v.d[0]}.`]],
  anders:v=>`Leg je vinger onder de blokjes. Welke blokjes van de ${v.d[0]} hebben geen buurman eronder? Tel die.`
});
L({id:'B01.picto',niv:1,dom:'B',sub:'grafieken',naam:'Een beeldgrafiek lezen',
  uitleg:'In een beeldgrafiek is elk plaatje één kind. Tel de plaatjes in een rij. Welke rij is het langst?',
  gen(r){ const f=r.shuffle(['appel','banaan','peer','druif']).slice(0,3); const w=r.shuffle([1,2,3,4,5,6,7]).slice(0,3); let i=r.int(0,2),j; do{j=r.int(0,2)}while(j===i||w[j]===w[i]); if(w[i]<w[j]) [i,j]=[j,i]; return {f,w,i,j,t:r.pick(['een','meer'])} },
  vraag:v=>v.t==='een'?`Elk kind kiest zijn lievelingsfruit. Elk plaatje is één kind. Hoeveel kinderen kiezen ${v.f[v.i]}?`:`Elk plaatje is één kind. Hoeveel meer kinderen kiezen ${v.f[v.i]} dan ${v.f[v.j]}?`,
  fig:v=>FIG.picto(v.f.map((x,k)=>[x,v.w[k]]),'🙂'),
  antw:v=>v.t==='een'?v.w[v.i]:v.w[v.i]-v.w[v.j],
  stappen:v=>v.t==='een'?[st(`Tel de plaatjes bij ${v.f[v.i]}: ${v.w[v.i]}`,v.w[v.i])]:[st(`${v.f[v.i]}: ${v.w[v.i]}, ${v.f[v.j]}: ${v.w[v.j]}`),st(`${v.w[v.i]} − ${v.w[v.j]} = ${v.w[v.i]-v.w[v.j]}`,v.w[v.i]-v.w[v.j])],
  fouten:v=>v.t==='een'?[[v.w[(v.i+1)%3],'Dat is een andere rij.'],[v.w[v.i]+1,'Tel nog eens precies.']]:[[v.w[v.i]+v.w[v.j],'Je telde beide rijen. Je zoekt hoeveel meer.'],[v.w[v.i],`Dat zijn alle kinderen bij ${v.f[v.i]}.`]],
  anders:v=>`Zet je vinger op het eerste plaatje van de rij en tel tot het laatste.`
});
L({id:'V02.keerzoveel',niv:2,dom:'V',sub:'vtabel',naam:'Twee keer, drie keer zoveel',
  uitleg:'Drie keer zoveel betekent: drie keer hetzelfde aantal. Noor heeft 4, dan is drie keer zoveel 4 + 4 + 4 = 12.',
  gen(r){ const f=r.int(2,5),n=r.int(2,10); const [e,m]=r.pick(SNOEP); const a=kind(r); let b; do{b=kind(r)}while(b===a); return {f,n,m,a,b} },
  vraag:v=>`${v.b} heeft ${v.n} ${v.m}. ${v.a} heeft er ${['','','twee','drie','vier','vijf'][v.f]} keer zoveel. Hoeveel ${v.m} is dat?`,
  antw:v=>v.f*v.n,
  stappen:v=>[st(`${v.f} keer ${v.n}`),st(`${v.f} × ${v.n} = ${v.f*v.n}`,v.f*v.n)],
  fouten:v=>[[v.f+v.n,`Je deed er ${v.f} bij. Het is ${v.f} keer zoveel.`],[v.n,`Dat heeft ${v.b}.`]],
  anders:v=>`Teken ${v.f} rijtjes van ${v.n} streepjes. Tel alle streepjes.`
});
L({id:'B02.staaf',niv:2,dom:'B',sub:'grafieken',naam:'Een staaf aflezen',
  uitleg:'Ga met je vinger naar de bovenkant van de staaf. Ga dan recht naar links. Daar lees je het getal.',
  gen(r){ const d=r.shuffle(['voetbal','zwemmen','dansen','judo','tennis']).slice(0,4); const w=d.map(()=>r.int(1,10)); return {d,w,i:r.int(0,3)} },
  vraag:v=>`De kinderen van een klas kiezen hun lievelingssport. Hoeveel kinderen kiezen ${v.d[v.i]}?`,
  fig:v=>FIG.staaf(v.d,v.w,{ymax:10,ys:1,yl:'aantal kinderen'}),
  antw:v=>v.w[v.i],
  stappen:v=>[st(`De staaf bij ${v.d[v.i]} komt tot ${v.w[v.i]}`,v.w[v.i])],
  fouten:v=>[[v.w[(v.i+1)%4]===v.w[v.i]?v.w[v.i]+1:v.w[(v.i+1)%4],'Kijk goed welke staaf bij '+v.d[v.i]+' hoort.'],[v.w[v.i]===10?9:v.w[v.i]+1,'Lees precies af bij de bovenkant.']],
  anders:v=>`Leg een liniaal plat op de bovenkant van de staaf bij ${v.d[v.i]}. Welk getal raakt hij links?`
});
L({id:'V03.perstuk',niv:3,dom:'V',sub:'vtabel',naam:'Eerst de prijs van één',
  uitleg:'Weet je wat een paar dingen kosten? Reken eerst uit wat één kost. Daarna kun je elk aantal uitrekenen.',
  gen(r){ const p=r.int(2,9),a=r.int(2,5); let b; do{b=r.int(2,9)}while(b===a); const d=r.pick([['ijsjes','ijsje'],['kaartjes','kaartje'],['schriften','schrift'],['broodjes','broodje']]); return {p,a,b,d} },
  vraag:v=>`${v.a} ${v.d[0]} kosten samen € ${v.a*v.p}. Hoeveel euro kosten ${v.b} ${v.d[0]}?`,
  antw:v=>v.b*v.p, eenheid:'€',
  stappen:v=>[st(`1 ${v.d[1]}: ${v.a*v.p} : ${v.a} = ${v.p}`,v.p),st(`${v.b} ${v.d[0]}: ${v.b} × ${v.p} = ${v.b*v.p}`,v.b*v.p)],
  fouten:v=>[[v.p,`Zoveel kost 1 ${v.d[1]}. Je wilt er ${v.b}.`],[v.a*v.p+(v.b-v.a),'Je telde het verschil in aantal erbij. Reken met de prijs van één.']],
  anders:v=>({tekst:'Zet het in een tabel. Eerst naar 1, dan naar '+v.b+'.',tabel:{kop:['aantal','prijs (€)'],rijen:[[v.a,v.a*v.p],[1,'?'],[v.b,'?']]}})
});
L({id:'M03.gewicht',niv:3,dom:'M',sub:'eenheden',naam:'Kilo en gram',
  uitleg:'1 kilo (kg) is 1000 gram. Een halve kilo is 500 gram. Reken eerst alles om naar gram.',
  gen(r){ const kg=r.int(1,3),g=r.pick([250,500,750,200,400,600]); return {kg,g,d:r.pick(['meel','suiker','aardappels','appels'])} },
  vraag:v=>`Er ligt een zak met ${v.kg} kilo ${v.d}. Je gebruikt ${v.g} gram. Hoeveel gram ${v.d} is er nog over?`,
  antw:v=>v.kg*1000-v.g, eenheid:'gram',
  stappen:v=>[st(`${v.kg} kilo = ${v.kg*1000} gram`,v.kg*1000),st(`${v.kg*1000} − ${v.g} = ${v.kg*1000-v.g}`,v.kg*1000-v.g)],
  fouten:v=>[[Math.abs(v.kg*100-v.g)||v.kg*100+1,'1 kilo is 1000 gram, niet 100.'],[v.kg*1000+v.g,'Je gebruikt het op, dus er gaat iets af.']],
  anders:v=>`Denk aan pakken van 1000 gram. ${v.kg} pak${v.kg>1?'ken':''} is ${v.kg*1000} gram. Haal er ${v.g} gram af.`
});
L({id:'B03.reeks',niv:3,dom:'B',sub:'formules',naam:'Getallenrijen voortzetten',
  uitleg:'Kijk hoeveel er steeds bij komt of af gaat. Doe dat dan nog een paar keer.',
  gen(r){ const s=r.int(1,20),d=r.pick([3,4,5,6,25,-2,-3]); const st0=d<0?s+30:s; const k=r.int(6,8); return {s:st0,d,k} },
  vraag:v=>`Kijk naar de rij: ${[0,1,2,3].map(i=>v.s+i*v.d).join(', ')}, … Welk getal staat op plek ${v.k}?`,
  antw:v=>v.s+(v.k-1)*v.d,
  stappen:v=>[st(`Er gaat steeds ${v.d>0?v.d+' bij':(-v.d)+' af'}`),st(`Plek 4 is ${v.s+3*v.d}. Nog ${v.k-4} keer ${v.d>0?'erbij':'eraf'}`),st(`Plek ${v.k}: ${v.s+(v.k-1)*v.d}`,v.s+(v.k-1)*v.d)],
  fouten:v=>[[v.s+v.k*v.d,'Je deed één stap te veel. Plek 1 is het eerste getal.'],[v.s+4*v.d,'Dat is plek 5.']],
  anders:v=>`Schrijf de rij verder op, tot je ${v.k} getallen hebt: ${[0,1,2,3].map(i=>v.s+i*v.d).join(', ')}, …`
});
L({id:'V04.korting',niv:4,dom:'V',sub:'procent',naam:'De helft of een kwart korting',
  uitleg:'Bij de helft korting betaal je de andere helft. Bij een kwart korting deel je eerst door 4 en haal je dat van de prijs af.',
  gen(r){ const k=r.pick(['helft','kwart']); const p=k==='helft'?r.int(3,25)*2:r.int(2,15)*4; return {k,p,d:r.pick(['spel','skateboard','boek','voetbal','knuffel'])} },
  vraag:v=>`Een ${v.d} kost € ${v.p}. Je krijgt ${v.k==='helft'?'de helft':'een kwart'} korting. Hoeveel euro betaal je?`,
  antw:v=>v.k==='helft'?v.p/2:v.p*3/4, eenheid:'€',
  stappen:v=>v.k==='helft'?[st(`Korting: ${v.p} : 2 = ${v.p/2}`,v.p/2),st(`Je betaalt ${v.p} − ${v.p/2} = ${v.p/2}`,v.p/2)]:[st(`Korting: ${v.p} : 4 = ${v.p/4}`,v.p/4),st(`Je betaalt ${v.p} − ${v.p/4} = ${v.p*3/4}`,v.p*3/4)],
  fouten:v=>v.k==='helft'?[[v.p,'Dat is de prijs zonder korting.'],[v.p-2,'De helft korting is niet € 2 eraf.']]:[[v.p/4,'Dat is de korting. Je vraagt wat je betaalt.'],[v.p-4,'Een kwart is niet € 4. Deel de prijs door 4.']],
  anders:v=>({tekst:`Teken een strook van € ${v.p} in ${v.k==='helft'?2:4} stukken.`,svg:FIG.strook(1,v.k==='helft'?2:4)})
});
L({id:'B04.staaf',niv:4,dom:'B',sub:'grafieken',naam:'Staafgrafiek met grote getallen',
  uitleg:'Kijk eerst wat één stap op de as waard is: hier 100. Halverwege twee strepen is 50 erbij.',
  gen(r){ const d=['ma','di','wo','do','vr','za','zo']; const w=d.map((x,i)=>r.int(i>=5?8:2,i>=5?16:9)*50); return {d,w,t:r.pick(['weekend','een'])} },
  vraag:v=>v.t==='weekend'?`De grafiek laat zien hoeveel mensen het zwembad bezochten. Hoeveel bezoekers waren er in het weekend (za en zo) samen?`:`De grafiek laat zien hoeveel mensen het zwembad bezochten. Hoeveel bezoekers waren er op woensdag?`,
  fig:v=>FIG.staaf(v.d,v.w,{ymax:800,ys:100,yl:'bezoekers'}),
  antw:v=>v.t==='weekend'?v.w[5]+v.w[6]:v.w[2],
  stappen:v=>v.t==='weekend'?[st(`za ${v.w[5]}, zo ${v.w[6]}`),st(`${v.w[5]} + ${v.w[6]} = ${v.w[5]+v.w[6]}`,v.w[5]+v.w[6])]:[st(`De staaf bij wo komt tot ${v.w[2]}`,v.w[2])],
  fouten:v=>v.t==='weekend'?[[v.w[6],'Dat is alleen zondag. Tel zaterdag erbij.'],[v.w[5]+v.w[6]+100,'Lees precies af. Tussen twee strepen zit 50.']]:[[v.w[2]%100?v.w[2]-50:v.w[2]+50,'Kijk goed: halverwege twee strepen is 50.'],[v.w[3]===v.w[2]?v.w[2]+100:v.w[3],'Dat is donderdag.']],
  anders:v=>`Elke streep is 100 meer. Ligt de staaf tussen twee strepen in? Dan is het 50 meer dan de onderste.`
});
