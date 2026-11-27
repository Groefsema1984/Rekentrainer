// ===== Niveau 2 · 1S · ongeveer groep 8 =====
const c2e = c => rondaf(c/100,2);   // centen → euro
// ---------- Getallen ----------
L({id:'G2.wisselgeld',niv:2,dom:'G',sub:'komma',naam:'Rekenen met geld: optellen en wisselgeld',verwar:['G2.kommakeer'],
  uitleg:'Zet bij geld de komma\'s onder elkaar, of reken in centen. € 4,35 is 435 cent. Wisselgeld = betaald − totaal.',
  gen(r){ const e=r.shuffle(CTX.eten).slice(0,2); const a=r.int(150,690), b=r.int(120,480); const tot=a+b; const bet=tot<1000?1000:2000; return {e,a,b,bet} },
  vraag:v=>`Je koopt een ${v.e[0][0]} van ${eur(c2e(v.a))} en een ${v.e[1][0]} van ${eur(c2e(v.b))}. Je betaalt met een briefje van ${eur(v.bet/100)}. Hoeveel wisselgeld krijg je?`,
  antw:v=>c2e(v.bet-v.a-v.b), eenheid:'€',
  stappen:v=>[st(`Totaal: ${eur(c2e(v.a))} + ${eur(c2e(v.b))} = ${eur(c2e(v.a+v.b))}`,c2e(v.a+v.b)),st(`Wisselgeld: ${eur(v.bet/100)} − ${eur(c2e(v.a+v.b))} = ${eur(c2e(v.bet-v.a-v.b))}`,c2e(v.bet-v.a-v.b))],
  fouten:v=>[[c2e(v.a+v.b),'Dat is wat je moet betalen. De vraag is hoeveel je terugkrijgt.'],[c2e(v.bet-v.a),'Je bent het tweede product vergeten.'],[c2e(v.bet-v.a-v.b+100),'Let op bij het lenen: tel na met optellen vanaf het totaal.']],
  anders:v=>`Tel op vanaf het totaal, zoals een kassamedewerker: van ${eur(c2e(v.a+v.b))} naar een rond bedrag, en dan door naar ${eur(v.bet/100)}. Alles wat je erbij telt, is je wisselgeld.`,
  waarom:{vraag:'Waarom reken je eerst het totaal uit?',opties:['Het wisselgeld is het verschil tussen wat je betaalt en wat alles samen kost.','Omdat je anders te veel betaalt.','Omdat je altijd eerst optelt en dan pas aftrekt, dat is de regel.']}
});
L({id:'G2.kommakeer',niv:2,dom:'G',sub:'komma',naam:'Kommagetal keer een heel getal',verwar:['G2.wisselgeld'],
  uitleg:'Reken eerst zonder komma, en zet de komma daarna terug. Schat ook: € 1,35 × 12 is ongeveer € 1 × 12 + nog wat, dus iets meer dan € 12.',
  gen(r){ const p=r.int(105,395), n=r.int(4,15); return {p,n,c:r.pick([['Een busrit kost','Je reist','keer. Hoeveel betaal je in totaal?'],['Een pak sap kost','Voor het klassenfeest koop je','pakken. Wat kost dat samen?'],['Een lot voor de loterij van het schoolfeest kost','Je verkoopt','loten. Hoeveel geld haal je op?']])} },
  vraag:v=>`${v.c[0]} ${eur(c2e(v.p))}. ${v.c[1]} ${v.n} ${v.c[2]}`,
  antw:v=>c2e(v.p*v.n), eenheid:'€',
  stappen:v=>[st(`Zonder komma: ${v.p} × ${v.n} = ${v.p*v.n}`,v.p*v.n),st(`Komma terug (2 cijfers achter de komma): ${eur(c2e(v.p*v.n))}`,c2e(v.p*v.n)),st(`Schatting: ongeveer ${Math.round(v.p/100)} × ${v.n} = ${Math.round(v.p/100)*v.n}, dat past.`)],
  stapVrij:true,
  fouten:v=>[[c2e(v.p*v.n)*10,'De komma staat op de verkeerde plek. Schat eerst: hoeveel ongeveer?'],[c2e(v.p*v.n)/10,'De komma staat op de verkeerde plek. Schat eerst: hoeveel ongeveer?'],[Math.floor(v.p/100)*v.n+(v.p%100)*v.n/100/10,'Je hebt de euro\'s en centen niet goed samengenomen.']],
  anders:v=>`Splits het bedrag: ${eur(Math.floor(v.p/100))} × ${v.n} = ${eur(Math.floor(v.p/100)*v.n)} en ${v.p%100} cent × ${v.n} = ${(v.p%100)*v.n} cent = ${eur(c2e((v.p%100)*v.n))}. Samen ${eur(c2e(v.p*v.n))}.`
});
const BREUKEN2=[[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,10],[3,10],[7,10],[1,8],[3,8],[1,20],[1,25]];
L({id:'G2.breukkomma',niv:2,dom:'G',sub:'breuken',naam:'Breuk, kommagetal en procent',verwar:['V2.procent'],dec:3,
  uitleg:'Een breuk is een deling: 3/5 = 3 : 5 = 0,6. Een kommagetal maak je een procent door keer 100: 0,6 = 60%.',
  gen(r){ const [t,n]=r.pick(BREUKEN2); return {t,n,naar:r.pick(['komma','procent'])} },
  vraag:v=>v.naar==='komma'?`Schrijf ${breuk(v.t,v.n)} als kommagetal.`:`Hoeveel procent is ${breuk(v.t,v.n)}?`,
  antw:v=>v.naar==='komma'?rondaf(v.t/v.n,3):rondaf(100*v.t/v.n,2), eenheid:v=>v.naar==='procent'?'%':'',
  stappen:v=>[st(`${breuk(v.t,v.n)} = ${v.t} : ${v.n}`),st(`${v.t} : ${v.n} = ${nl(v.t/v.n)}`,rondaf(v.t/v.n,3)),...(v.naar==='procent'?[st(`${nl(v.t/v.n)} × 100 = ${nl(100*v.t/v.n)}%`,rondaf(100*v.t/v.n,2))]:[])],
  fouten:v=>v.naar==='komma'?[[+(v.t+'.'+v.n),'Je schreef teller en noemer achter elkaar. Een breuk is een deling.'],[rondaf(v.n/v.t,3),'Je deelde de noemer door de teller. Het is teller : noemer.'],[rondaf(v.t/v.n*10,3),'Kijk naar de plaats van de komma.']]:[[v.t,'Je nam de teller als procent. Reken eerst teller : noemer uit.'],[rondaf(v.t/v.n,3),'Dat is het kommagetal. Voor procent doe je nog keer 100.'],[rondaf(100*v.n/v.t,2),'Je deelde de noemer door de teller.']],
  anders:v=>({tekst:`Maak de noemer 100: ${breuk(v.t,v.n)} = ${breuk(v.t*100/v.n,100)}. Dat is ${nl(100*v.t/v.n)} van de 100, dus ${nl(100*v.t/v.n)}% en ${nl(v.t/v.n)}.`,svg:FIG.strook(v.t,v.n,`${v.t} van de ${v.n} = ${nl(100*v.t/v.n)}%`)}),
  koppel:(v,r)=>{ const k=r.shuffle(BREUKEN2).slice(0,4); return {vraag:'Koppel elke breuk aan het juiste procent.',paren:k.map(([t,n])=>[`${t}/${n}`,nl(100*t/n)+'%'])} }
});
L({id:'G2.delenrest',niv:2,dom:'G',sub:'bewerkingen',naam:'Delen met rest: wat betekent de rest?',
  uitleg:'Bij delen met rest moet je nadenken over de context. Moet iedereen mee? Dan rond je naar boven af. Gaat het om volle dozen? Dan rond je naar beneden af.',
  gen(r){ const wat=r.pick(['boven','beneden']); let a,b; do{ b=r.pick([6,8,12,15,24,30,40,50]); a=r.int(3*b,9*b) }while(a%b===0); return {a,b,wat} },
  vraag:v=>v.wat==='boven'?`Op schoolreis gaan ${v.a} leerlingen en docenten. In een bus passen ${v.b} personen. Hoeveel bussen zijn er nodig?`:`Een fabriek maakt ${v.a} repen. In een doos gaan er ${v.b}. Hoeveel volle dozen kun je maken?`,
  antw:v=>v.wat==='boven'?Math.ceil(v.a/v.b):Math.floor(v.a/v.b),
  stappen:v=>[st(`${v.a} : ${v.b} = ${Math.floor(v.a/v.b)} rest ${v.a%v.b}`,Math.floor(v.a/v.b)),st(v.wat==='boven'?`De rest (${v.a%v.b} personen) moet ook mee, dus 1 bus extra.`:`De rest (${v.a%v.b} repen) is geen volle doos.`),st(`Antwoord: ${v.wat==='boven'?Math.ceil(v.a/v.b):Math.floor(v.a/v.b)}`,v.wat==='boven'?Math.ceil(v.a/v.b):Math.floor(v.a/v.b))],
  fouten:v=>[[v.wat==='boven'?Math.floor(v.a/v.b):Math.ceil(v.a/v.b),v.wat==='boven'?'Dan blijven er '+(v.a%v.b)+' mensen thuis. Iedereen moet mee.':'De laatste doos is niet vol.'],[rondaf(v.a/v.b,2),'Een halve bus of doos bestaat niet. Kijk wat de rest betekent.'],[v.a%v.b,'Dat is de rest, niet het antwoord.']],
  anders:v=>`Vul de ${v.wat==='boven'?'bussen':'dozen'} één voor één: ${Math.floor(v.a/v.b)} keer ${v.b} = ${Math.floor(v.a/v.b)*v.b}. Er blijven er ${v.a%v.b} over. ${v.wat==='boven'?'Die moeten ook mee, dus nog een bus.':'Die passen niet in een volle doos.'}`
});
// ---------- Verhoudingen ----------
L({id:'V2.vtabel',niv:2,dom:'V',sub:'vtabel',naam:'Verhoudingstabel met gewicht en prijs',verwar:['V2.procent'],
  uitleg:'Kies handige tussenstappen in de tabel: halveren, verdubbelen, keer 10 of delen door 10. Boven en onder doe je hetzelfde.',
  gen(r){ let g,p,t; do{ g=r.pick([100,200,250,500]); p=r.int(12,90)*10; t=r.pick([150,300,400,600,750,1000,1250,1500]) }while(t===g||(p*t)%g!==0||(p*50)%g!==0); return {g,p,t,w:r.pick(['kaas','studentenhaver','snoep uit de schepbak','pindakaas'])} },
  vraag:v=>`${v.g} gram ${v.w} kost ${eur(c2e(v.p))}. Hoeveel kost ${nl(v.t)} gram?`,
  antw:v=>c2e(v.p*v.t/v.g), eenheid:'€',
  stappen:v=>[st(`${v.g} g kost ${eur(c2e(v.p))}`,c2e(v.p)),st(`50 g kost ${eur(c2e(v.p*50/v.g))}`,c2e(v.p*50/v.g)),st(`${nl(v.t)} g = ${v.t/50} × 50 g: ${v.t/50} × ${eur(c2e(v.p*50/v.g))} = ${eur(c2e(v.p*v.t/v.g))}`,c2e(v.p*v.t/v.g))],
  tabel:v=>({kop:['Gram','Prijs (€)'],rijen:[[v.g,c2e(v.p)],[50,c2e(v.p*50/v.g)],[v.t,c2e(v.p*v.t/v.g)]],leeg:[[1,1],[2,1]]}),
  fouten:v=>[[c2e(v.p)+(v.t-v.g)/100,'Je telde iets op. In een verhoudingstabel vermenigvuldig of deel je.'],[c2e(v.p*v.t/v.g)*10,'Kijk naar de komma: schat eerst of het antwoord kan kloppen.'],[c2e(v.p*v.g/v.t),'Je hebt de verhouding omgedraaid. Meer gram is duurder.']],
  anders:v=>({tekst:'Zet het in een verhoudingstabel en ga via 50 gram.',tabel:{kop:['Gram','Prijs (€)'],rijen:[[v.g,c2e(v.p)],[50,c2e(v.p*50/v.g)],[v.t,c2e(v.p*v.t/v.g)]]}})
});
L({id:'V2.procent',niv:2,dom:'V',sub:'procent',naam:'Procent van een aantal',verwar:['G2.breukkomma','V2.vtabel'],
  uitleg:'Reken via 10% of 1%. 10% is delen door 10. Daarna kun je verdubbelen, halveren of optellen. 35% = 3 × 10% + 5%.',
  gen(r){ let p,y; do{ p=r.pick([5,15,20,30,35,40,45,60,65,75,80]); y=r.int(4,30)*20 }while((y*p)%100!==0); return {p,y,c:r.pick([['Van de','leerlingen op school komt','met de fiets. Hoeveel leerlingen zijn dat?'],['Een filmpje heeft','views. Van de kijkers kijkt','het tot het einde. Hoeveel kijkers zijn dat?'],['Bij een sporttoernooi doen','spelers mee;','is jonger dan 14. Hoeveel spelers zijn dat?']])} },
  vraag:v=>`${v.c[0]} ${nl(v.y)} ${v.c[1]} ${v.p}% ${v.c[2]}`,
  antw:v=>v.y*v.p/100,
  stappen:v=>[st(`100% = ${nl(v.y)}`,v.y),st(`10% = ${nl(v.y)} : 10 = ${nl(v.y/10)}`,v.y/10),st(`${v.p}% = ${v.p/10} × ${nl(v.y/10)} = ${nl(v.y*v.p/100)}`,v.y*v.p/100)],
  tabel:v=>({kop:['Procent','Aantal'],rijen:[[100,v.y],[10,v.y/10],[5,v.y/20],[v.p,v.y*v.p/100]],leeg:[[1,1],[3,1]]}),
  fouten:v=>[[v.p,'Procent is een deel van het geheel. Reken uit hoeveel '+v.p+'% van '+v.y+' is.'],[v.y-v.y*v.p/100,'Dat is het andere deel (100% − '+v.p+'%).'],[v.y/v.p,'Je deelde door het percentage. Reken via 10% of 1%.']],
  anders:v=>({tekst:`Gebruik een strook van 100%. Verdeel hem in stukjes van 10%. Eén stukje is ${nl(v.y/10)}.`,svg:FIG.balk([{w:v.p,label:`${v.p}% = ${nl(v.y*v.p/100)}`,k:'b'},{w:100-v.p,label:'',k:'zacht'}],`100% = ${nl(v.y)}`)})
});
L({id:'V2.schaal',niv:2,dom:'V',sub:'schaal',naam:'Schaal op een kaart',
  uitleg:'Schaal 1 : 50 000 betekent: 1 cm op de kaart is 50 000 cm in het echt. 100 000 cm is 1 km, dus 50 000 cm = 0,5 km.',
  gen(r){ const s=r.pick([10000,20000,25000,50000,100000,200000]); const cm=r.int(2,12); const [a,b]=r.pick(CTX.stad); return {s,cm,a,b,wat:r.pick(['fietsroute','wandeling','looproute naar school'])} },
  vraag:v=>`Op een kaart met schaal 1 : ${nl(v.s)} is een ${v.wat} ${v.cm} cm lang. Hoeveel kilometer is dat in het echt?`,
  fig:v=>FIG.meetlat(v.cm,`${v.cm} cm op de kaart`),
  antw:v=>rondaf(v.cm*v.s/100000,2), eenheid:'km',
  stappen:v=>[st(`1 cm op de kaart = ${nl(v.s)} cm in het echt`,v.s),st(`${nl(v.s)} cm = ${nl(v.s/100000)} km`,v.s/100000),st(`${v.cm} × ${nl(v.s/100000)} = ${nl(v.cm*v.s/100000)} km`,rondaf(v.cm*v.s/100000,2))],
  fouten:v=>[[v.cm*v.s/1000,'Van cm naar km deel je door 100 000, niet door 1000.'],[v.cm*v.s/100,'Dat is het aantal meter. De vraag is in km.'],[v.cm*v.s/10000000,'Van cm naar km deel je door 100 000.']],
  anders:v=>({tekst:'Maak een verhoudingstabel van kaart naar werkelijkheid.',tabel:{kop:['Kaart (cm)','Echt (cm)','Echt (km)'],rijen:[[1,v.s,v.s/100000],[v.cm,v.cm*v.s,v.cm*v.s/100000]]}}),
  sab:v=>({intro:`Op een kaart met schaal 1 : ${nl(v.s)} meet Daan ${v.cm} cm. Hij rekent uit hoeveel km dat is.`,
    stappen:[`1 cm op de kaart is ${nl(v.s)} cm in het echt.`,`${v.cm} cm is dus ${v.cm} × ${nl(v.s)} = ${nl(v.cm*v.s)} cm.`,`${nl(v.cm*v.s)} cm : 1000 = ${nl(v.cm*v.s/1000)} km.`,`Antwoord: ${nl(v.cm*v.s/1000)} km.`],
    fout:2,juist:rondaf(v.cm*v.s/100000,2),eenheid:'km',vraag:'Hoeveel km is het echt?',uitleg:'Van cm naar km deel je door 100 000 (100 cm in een meter, 1000 m in een km). Daan deelde maar door 1000.',
    goed:[`${v.cm} × ${nl(v.s)} = ${nl(v.cm*v.s)} cm`,`${nl(v.cm*v.s)} cm : 100 = ${nl(v.cm*v.s/100)} m`,`${nl(v.cm*v.s/100)} m : 1000 = ${nl(v.cm*v.s/100000)} km`]})
});
// ---------- Meten en meetkunde ----------
const EENH2=[['l','ml',1000],['l','dl',10],['l','cl',100],['kg','g',1000],['m','cm',100],['km','m',1000],['cm','mm',10]];
L({id:'M2.eenheden',niv:2,dom:'M',sub:'eenheden',naam:'Omrekenen met kommagetallen',dec:3,
  uitleg:'Gebruik het "trappetje": l → dl → cl → ml, telkens keer 10. Naar beneden (kleiner) keer, naar boven (groter) delen.',
  gen(r){ const e=r.pick(EENH2); const naarKlein=r.ja(); const groot=r.pick([0.25,0.5,0.75,1.2,1.5,2.5,0.4,3.6,0.08]); return {e,naarKlein,groot,klein:rondaf(groot*e[2],3)} },
  vraag:v=>v.naarKlein?`Hoeveel ${v.e[1]} is ${nl(v.groot)} ${v.e[0]}?`:`Hoeveel ${v.e[0]} is ${nl(v.klein)} ${v.e[1]}?`,
  antw:v=>v.naarKlein?v.klein:v.groot, eenheid:v=>v.naarKlein?v.e[1]:v.e[0],
  stappen:v=>[st(`1 ${v.e[0]} = ${nl(v.e[2])} ${v.e[1]}`,v.e[2]),st(v.naarKlein?`${nl(v.groot)} × ${nl(v.e[2])} = ${nl(v.klein)}`:`${nl(v.klein)} : ${nl(v.e[2])} = ${nl(v.groot)}`,v.naarKlein?v.klein:v.groot)],
  fouten:v=>v.naarKlein?[[rondaf(v.klein/10,3),'Kijk nog eens hoeveel '+v.e[1]+' in 1 '+v.e[0]+' gaat.'],[rondaf(v.klein*10,3),'Kijk nog eens hoeveel '+v.e[1]+' in 1 '+v.e[0]+' gaat.'],[rondaf(v.groot/v.e[2],5),'Naar een kleinere eenheid wordt het getal groter.']]:[[rondaf(v.klein*v.e[2],3),'Naar een grotere eenheid wordt het getal kleiner.'],[rondaf(v.groot*10,3),'Kijk nog eens hoeveel '+v.e[1]+' in 1 '+v.e[0]+' gaat.'],[rondaf(v.groot/10,4),'Kijk nog eens hoeveel '+v.e[1]+' in 1 '+v.e[0]+' gaat.']],
  anders:v=>`Schrijf het getal in een tabelletje met de eenheden als kolommen en schuif de komma één plek per stap op het trappetje.`,
  koppel:(v,r)=>({vraag:'Koppel de hoeveelheden die even groot zijn.',paren:r.shuffle([['0,5 l','500 ml'],['1,5 kg','1500 g'],['2,5 m','250 cm'],['3 dl','300 ml'],['0,25 km','250 m'],['75 cl','0,75 l'],['40 mm','4 cm']]).slice(0,4)})
});
L({id:'M2.lvorm',niv:2,dom:'M',sub:'oppervlak',naam:'Oppervlakte van een samengestelde figuur',
  uitleg:'Bij een samengestelde figuur: maak er een grote rechthoek van en haal het stuk eraf dat ontbreekt. Of splits hem in twee rechthoeken.',
  gen(r){ const B=r.int(8,16),H=r.int(6,12),bw=r.int(2,B-4),bh=r.int(2,H-3); return {B,H,bw,bh,c:r.pick(['Een kamer','Een tuin','Een klaslokaal','Een terras'])} },
  vraag:v=>`${v.c} heeft de vorm hieronder (maten in meter). Hoe groot is de oppervlakte?`,
  fig:v=>FIG.lvorm(v.B,v.H,v.bw,v.bh,{B:v.B+' m',H:v.H+' m',top:(v.B-v.bw)+' m',r:(v.H-v.bh)+' m'}),
  antw:v=>v.B*v.H-v.bw*v.bh, eenheid:m2, eenheden:['m',m2,m3],
  stappen:v=>[st(`Grote rechthoek: ${v.B} × ${v.H} = ${v.B*v.H} m²`,v.B*v.H),st(`Stuk dat ontbreekt: ${v.bw} × ${v.bh} = ${v.bw*v.bh} m²`,v.bw*v.bh),st(`Oppervlakte: ${v.B*v.H} − ${v.bw*v.bh} = ${v.B*v.H-v.bw*v.bh} m²`,v.B*v.H-v.bw*v.bh)],
  fouten:v=>[[v.B*v.H,'Je vergat het stuk dat ontbreekt eraf te halen.'],[v.B*v.H+v.bw*v.bh,'Het ontbrekende stuk moet eraf, niet erbij.'],[2*(v.B+v.H),'Dat is de omtrek van de grote rechthoek.']],
  anders:v=>`Je kunt hem ook splitsen: een strook van ${v.B} × ${v.H-v.bh} = ${v.B*(v.H-v.bh)} m² en een stuk van ${v.B-v.bw} × ${v.bh} = ${(v.B-v.bw)*v.bh} m². Samen ${v.B*v.H-v.bw*v.bh} m².`,
  volgorde:true
});
L({id:'M2.inhoud',niv:2,dom:'M',sub:'inhoud',naam:'Inhoud van een balk in liters',
  uitleg:'Inhoud van een balk = lengte × breedte × hoogte. In cm krijg je cm³. 1 liter = 1 dm³ = 1000 cm³.',
  gen(r){ const l=r.int(3,10)*10,b=r.int(2,6)*10,h=r.int(2,6)*10; return {l,b,h,c:r.pick(['Een aquarium','Een plantenbak','Een koelbox','Een opbergbak'])} },
  vraag:v=>`${v.c} is ${v.l} cm lang, ${v.b} cm breed en ${v.h} cm hoog. Hoeveel liter past erin?`,
  fig:v=>FIG.doos(v.l,v.b,v.h,v.l+' cm',v.b+' cm',v.h+' cm'),
  antw:v=>v.l*v.b*v.h/1000, eenheid:'liter',
  stappen:v=>[st(`${v.l} × ${v.b} × ${v.h} = ${nl(v.l*v.b*v.h)} cm³`,v.l*v.b*v.h),st(`1 liter = 1000 cm³`,1000),st(`${nl(v.l*v.b*v.h)} : 1000 = ${nl(v.l*v.b*v.h/1000)} liter`,v.l*v.b*v.h/1000)],
  fouten:v=>[[v.l*v.b*v.h,'Dat zijn cm³. Een liter is 1000 cm³.'],[v.l*v.b*v.h/100,'Een liter is 1000 cm³, niet 100.'],[v.l+v.b+v.h,'Bij inhoud vermenigvuldig je lengte, breedte en hoogte.']],
  anders:v=>`Reken in dm, want 1 dm³ = 1 liter: ${v.l/10} dm × ${v.b/10} dm × ${v.h/10} dm = ${v.l*v.b*v.h/1000} dm³ = ${v.l*v.b*v.h/1000} liter.`
});
L({id:'M2.uurloon',niv:2,dom:'M',sub:'tijd',naam:'Rekenen met tijd en geld',
  uitleg:'Een kwartier is 0,25 uur, een half uur 0,5 uur en drie kwartier 0,75 uur. 2 uur en 15 minuten is dus 2,25 uur, niet 2,15.',
  gen(r){ const p=r.pick([450,500,550,600,650,700,750,800]); const u=r.int(1,5),m=r.pick([15,30,45]); return {p,u,m,c:r.pick(['met oppassen','met je bijbaantje in de supermarkt','met het uitlaten van honden','met bijles geven'])} },
  vraag:v=>`Je verdient ${eur(c2e(v.p))} per uur ${v.c}. Je werkt ${v.u} uur en ${v.m} minuten. Hoeveel verdien je?`,
  antw:v=>c2e(v.p*(v.u+v.m/60)), eenheid:'€',
  stappen:v=>[st(`${v.m} minuten = ${nl(v.m/60)} uur`,v.m/60),st(`${v.u} uur en ${v.m} minuten = ${nl(v.u+v.m/60)} uur`,v.u+v.m/60),st(`${nl(v.u+v.m/60)} × ${eur(c2e(v.p))} = ${eur(c2e(v.p*(v.u+v.m/60)))}`,c2e(v.p*(v.u+v.m/60)))],
  fouten:v=>[[c2e(v.p*(v.u+v.m/100)),`${v.u} uur en ${v.m} minuten is niet ${v.u},${v.m} uur. Een uur heeft 60 minuten.`],[c2e(v.p*v.u),'Je vergat de minuten.'],[c2e(v.p*(v.u+1)),'Je rekende een heel uur extra.']],
  anders:v=>`Reken in stukjes: ${v.u} uur × ${eur(c2e(v.p))} = ${eur(c2e(v.p*v.u))}. ${v.m} minuten is ${v.m/15} kwartier, en een kwartier is ${eur(c2e(v.p/4))}. Samen ${eur(c2e(v.p*(v.u+v.m/60)))}.`,
  sab:v=>({intro:`Je verdient ${eur(c2e(v.p))} per uur en werkt ${v.u} uur en ${v.m} minuten. Mila rekent uit wat je verdient.`,
    stappen:[`Het uurloon is ${eur(c2e(v.p))}.`,`${v.u} uur en ${v.m} minuten is ${v.u},${v.m} uur.`,`${v.u},${v.m} × ${nl(c2e(v.p))} = ${nl(c2e(v.p*(v.u+v.m/100)))}`,`Antwoord: ${eur(c2e(v.p*(v.u+v.m/100)))}.`],
    fout:1,juist:c2e(v.p*(v.u+v.m/60)),eenheid:'€',vraag:'Wat verdien je echt?',uitleg:`Minuten zijn geen honderdsten van een uur. ${v.m} minuten is ${nl(v.m/60)} uur, dus ${nl(v.u+v.m/60)} uur.`,
    goed:[`${v.m} min = ${nl(v.m/60)} uur`,`${nl(v.u+v.m/60)} × ${eur(c2e(v.p))} = ${eur(c2e(v.p*(v.u+v.m/60)))}`]})
});
// ---------- Verbanden ----------
L({id:'B2.lijngrafiek',niv:2,dom:'B',sub:'grafieken',naam:'Lijngrafiek aflezen',
  uitleg:'Zoek op de horizontale as het tijdstip, ga recht omhoog naar de lijn en lees links de waarde af. Let op hoeveel één hokje is.',
  gen(r){ const t=[6,8,10,12,14,16,18,20]; let y=r.int(4,10); const w=t.map(()=>{ y+=r.int(-1,4); return Math.max(0,y)}); const wat=r.pick(['af','verschil']); const i=r.int(1,6); return {t,w,wat,i} },
  vraag:v=>v.wat==='af'?`De grafiek laat de temperatuur op een zomerdag zien. Hoe warm was het om ${v.t[v.i]}:00 uur?`:`De grafiek laat de temperatuur op een zomerdag zien. Hoeveel graden scheelt het tussen de hoogste en de laagste temperatuur?`,
  fig:v=>FIG.grafiek([{punten:v.t.map((x,k)=>[x,v.w[k]])}],{xmin:6,xmax:20,xs:2,ymax:Math.ceil((Math.max(...v.w)+2)/5)*5,ys:Math.max(...v.w)>20?5:2,xl:'tijd (uur)',yl:'temperatuur (°C)',xlab:x=>x+':00'}),
  antw:v=>v.wat==='af'?v.w[v.i]:Math.max(...v.w)-Math.min(...v.w), eenheid:'°C',
  stappen:v=>v.wat==='af'?[st(`Zoek ${v.t[v.i]}:00 op de horizontale as.`),st(`Recht omhoog naar de lijn, dan naar links: ${v.w[v.i]} °C`,v.w[v.i])]:[st(`Hoogste punt: ${Math.max(...v.w)} °C`,Math.max(...v.w)),st(`Laagste punt: ${Math.min(...v.w)} °C`,Math.min(...v.w)),st(`Verschil: ${Math.max(...v.w)-Math.min(...v.w)} °C`,Math.max(...v.w)-Math.min(...v.w))],
  fouten:v=>v.wat==='af'?[[v.w[v.i+1],'Je las af bij het volgende tijdstip.'],[v.w[v.i-1],'Je las af bij het vorige tijdstip.'],[v.t[v.i],'Dat is de tijd, niet de temperatuur.']]:[[Math.max(...v.w),'Dat is de hoogste temperatuur, niet het verschil.'],[Math.max(...v.w)+Math.min(...v.w),'Het verschil krijg je door af te trekken.'],[v.w[v.w.length-1]-v.w[0],'Je nam het eerste en laatste punt. Zoek het hoogste en laagste punt.']],
  anders:v=>`Leg je vinger op de horizontale as, ga recht omhoog tot je de lijn raakt, en dan horizontaal naar links. Tel de hokjes als het getal er niet precies staat.`
});
L({id:'B2.gemiddelde',niv:2,dom:'B',sub:'statistiek',naam:'Gemiddelde berekenen',
  uitleg:'Gemiddelde = alle waarden bij elkaar opgeteld, gedeeld door het aantal waarden.',
  gen(r){ const n=r.int(4,6); let w; do{ w=Array.from({length:n},()=>r.int(8,30)) }while(w.reduce((a,b)=>a+b,0)%n!==0); return {n,w,nm:r.naam(),c:r.pick([['punten per wedstrijd','punten'],['minuten per dag gamen','minuten'],['doelpunten per seizoen','doelpunten'],['volgers erbij per dag','volgers']])} },
  vraag:v=>`${v.nm} houdt het aantal ${v.c[0]} bij: ${v.w.join(', ')}. Wat is het gemiddelde?`,
  antw:v=>v.w.reduce((a,b)=>a+b,0)/v.n,
  stappen:v=>[st(`Optellen: ${v.w.join(' + ')} = ${v.w.reduce((a,b)=>a+b,0)}`,v.w.reduce((a,b)=>a+b,0)),st(`Aantal waarden: ${v.n}`,v.n),st(`${v.w.reduce((a,b)=>a+b,0)} : ${v.n} = ${v.w.reduce((a,b)=>a+b,0)/v.n}`,v.w.reduce((a,b)=>a+b,0)/v.n)],
  fouten:v=>{ const s=v.w.reduce((a,b)=>a+b,0),z=[...v.w].sort((a,b)=>a-b); return [[s,'Je hebt alleen opgeteld. Deel nog door het aantal waarden.'],[rondaf(s/(v.n-1),2),'Tel het aantal waarden goed: het zijn er '+v.n+'.'],[(z[0]+z[z.length-1])/2,'Je nam het midden tussen de kleinste en grootste. Het gemiddelde gebruikt álle waarden.']] },
  anders:v=>{ const g=v.w.reduce((a,b)=>a+b,0)/v.n; return `Stel je voor dat je alles eerlijk verdeelt: wat de hoge waarden te veel hebben, geef je aan de lage. Dan heeft iedereen ${g}. Controle: ${v.w.map(x=>(x-g>=0?'+':'')+(x-g)).join(' ')} = 0.` },
  v3:v=>{ const s=v.w.reduce((a,b)=>a+b,0); return {vraag:`${v.nm} had deze aantallen ${v.c[0]}: ${v.w.join(', ')}. Leg uit hoe je het gemiddelde berekent.`,
    goed:`Alles optellen geeft ${s}. Er zijn ${v.n} waarden, dus ${s} : ${v.n} = ${s/v.n}.`,
    bijna:`Ik tel ze op: ${s}. Dat is het gemiddelde.`,
    fout:`Ik neem de middelste waarde uit het rijtje: ${v.w[Math.floor(v.n/2)]}.`,
    kijkwijzer:['Zijn alle waarden opgeteld?','Is er gedeeld door het aantal waarden?','Is het antwoord een getal tussen de kleinste en de grootste waarde?']} }
});
L({id:'B2.woordformule',niv:2,dom:'B',sub:'formules',naam:'Rekenen met een woordformule',
  uitleg:'Vul de getallen in op de plek van de woorden. Doe eerst keer, dan plus.',
  gen(r){ const a=r.pick([2,3,4,5,7.5,10]),b=r.pick([1.5,2,2.5,3,4,5]),h=r.int(2,8); return {a,b,h,c:r.pick([['fietsverhuur','uur'],['bowlingbaan','spelletje'],['kanoverhuur','uur'],['schaatsbaan met huurschaatsen','uur']])} },
  vraag:v=>`Bij een ${v.c[0]} geldt: <b>kosten = ${nl(v.a)} + ${nl(v.b)} × aantal ${v.c[1]}${v.c[1]==='uur'?'':'s'}</b> (in euro). Wat kost het voor ${v.h} ${v.c[1]}${v.c[1]==='uur'||v.h===1?'':'s'}?`,
  antw:v=>rondaf(v.a+v.b*v.h,2), eenheid:'€',
  stappen:v=>[st(`kosten = ${nl(v.a)} + ${nl(v.b)} × ${v.h}`),st(`${nl(v.b)} × ${v.h} = ${nl(v.b*v.h)}`,rondaf(v.b*v.h,2)),st(`${nl(v.a)} + ${nl(v.b*v.h)} = ${nl(v.a+v.b*v.h)}`,rondaf(v.a+v.b*v.h,2))],
  fouten:v=>[[rondaf((v.a+v.b)*v.h,2),'Eerst keer, dan plus. Het vaste bedrag betaal je maar één keer.'],[rondaf(v.b*v.h,2),'Je vergat het vaste bedrag.'],[rondaf(v.a*v.h+v.b,2),'Je hebt de getallen omgewisseld.']],
  anders:v=>({tekst:'Maak een tabel: bij 0 betaal je alleen het vaste bedrag, daarna komt er per stuk hetzelfde bij.',tabel:{kop:['Aantal','Kosten (€)'],rijen:[[0,v.a],[1,rondaf(v.a+v.b,2)],[2,rondaf(v.a+2*v.b,2)],[v.h,rondaf(v.a+v.b*v.h,2)]]}}),
  tabel:v=>({kop:['Aantal','Kosten (€)'],rijen:[[0,v.a],[1,rondaf(v.a+v.b,2)],[2,rondaf(v.a+2*v.b,2)],[v.h,rondaf(v.a+v.b*v.h,2)]],leeg:[[1,1],[3,1]]})
});
L({id:'B2.dienstregeling',niv:2,dom:'B',sub:'tabellen',naam:'Dienstregeling lezen',
  uitleg:'In een dienstregeling staat elke rit in een eigen kolom. Lees de tijd bij de halte waar je instapt en de halte waar je uitstapt, en reken het verschil uit.',
  gen(r){ const h=['Station','Centrum','Sporthal','School','Zwembad']; const start=r.int(7,8)*60+r.pick([2,12,22,32]); const d=[0,r.int(4,9),r.int(4,9),r.int(3,8),r.int(4,9)]; const cum=d.map((x,i)=>d.slice(0,i+1).reduce((a,b)=>a+b,0)); const ritten=[0,15,30].map(o=>cum.map(c=>start+o+c)); let a=r.int(0,2),b=r.int(a+2,4); return {h,ritten,a,b,rit:r.int(0,2)} },
  vraag:v=>`Hier zie je de dienstregeling van een buslijn.<div class="vtabel">${vtabelHtml(['Halte','Rit 1','Rit 2','Rit 3'],v.h.map((x,i)=>[x,...v.ritten.map(rt=>tijdStr(rt[i]))]))}</div>Je neemt rit ${v.rit+1} van ${v.h[v.a]} naar ${v.h[v.b]}. Hoeveel minuten zit je in de bus?`,
  antw:v=>v.ritten[v.rit][v.b]-v.ritten[v.rit][v.a], eenheid:'min',
  stappen:v=>[st(`Vertrek ${v.h[v.a]}: ${tijdStr(v.ritten[v.rit][v.a])}`),st(`Aankomst ${v.h[v.b]}: ${tijdStr(v.ritten[v.rit][v.b])}`),st(`Verschil: ${v.ritten[v.rit][v.b]-v.ritten[v.rit][v.a]} minuten`,v.ritten[v.rit][v.b]-v.ritten[v.rit][v.a])],
  fouten:v=>[[v.ritten[v.rit][v.b]-v.ritten[v.rit][0],'Je rekende vanaf de eerste halte. Je stapt in bij '+v.h[v.a]+'.'],[v.ritten[v.rit][v.b-1]-v.ritten[v.rit][v.a],'Je stopte een halte te vroeg.'],[15,'Dat is de tijd tussen twee ritten.']],
  anders:v=>`Zet je vinger in de kolom van rit ${v.rit+1}. Lees de tijd bij ${v.h[v.a]} en bij ${v.h[v.b]}. Spring daarna van de ene naar de andere tijd, net als bij een tijdlijn.`
});
