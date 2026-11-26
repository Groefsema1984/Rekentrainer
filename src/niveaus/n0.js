// ===== Hulpmiddelen voor de vragenbanken =====
// Contexten voor 10-16 jaar: sport, gamen, bijbaan, festival, OV, koken, reizen, social media, school.
const CTX = {
  product:[['hoodie',[30,40,45,50,60,80]],['paar sneakers',[60,80,90,100,120,150]],['game',[20,30,40,50,60,70]],['koptelefoon',[40,50,80,100,120,150]],['voetbalshirt',[40,60,70,80,90]],['skateboard',[50,60,80,90,100,120]],['spijkerbroek',[40,50,60,70,80]],['rugzak',[25,30,40,50,60]],['racket',[30,40,50,60,80]],['fiets',[250,300,400,450,500,600]]],
  eten:[['pizza',8],['portie friet',3],['smoothie',4],['wrap',5],['bak sushi',10]],
  sport:['voetbal','hockey','basketbal','volleybal','tennis','zwemmen','turnen','handbal'],
  stad:[['Amsterdam','Utrecht'],['Rotterdam','Den Haag'],['Groningen','Assen'],['Haarlem','Leiden'],['Zwolle','Deventer']],
  vak:['wiskunde','Engels','geschiedenis','biologie','aardrijkskunde','Nederlands']
};
const prodPrijs = r => { const p=r.pick(CTX.product); return [p[0],r.pick(p[1])] };
const st = (tekst,waarde,eenheid) => [tekst,waarde,eenheid];       // stap in een uitwerking
const ggd = (a,b) => b?ggd(b,a%b):Math.abs(a);
const breuk = (t,n) => `<span class="breuk"><sup>${t}</sup>⁄<sub>${n}</sub></span>`;
const tijdStr = m => { m=((m%1440)+1440)%1440; return Math.floor(m/60)+':'+String(m%60).padStart(2,'0') };
const m2 = 'm²', cm2 = 'cm²', cm3='cm³', m3='m³', dm3='dm³', km2='km²';
