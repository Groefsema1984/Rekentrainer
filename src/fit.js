// ===== Rekenfit: automatiseringsronde van 2 minuten (kale sommen, vlot en foutloos) =====
// Vlot hoofdrekenen (tafels, ×10, breuk–komma–procent) maakt werkgeheugen vrij voor de denkstappen.
const FIT_TIJD = 120;
const FIT_TYPES = [
  {niv:1,naam:'Tafels',gen:r=>{ const a=r.int(2,10),b=r.int(2,10); return r.ja()?[`${a} × ${b}`,a*b]:[`${a*b} : ${a}`,b] }},
  {niv:1,naam:'Plus en min tot 100',gen:r=>{ const a=r.int(11,89),b=r.int(5,99-a); return r.ja()?[`${a} + ${b}`,a+b]:[`${a+b} − ${b}`,a] }},
  {niv:2,naam:'Aanvullen',gen:r=>{ const t=r.pick([100,1000]),a=t===100?r.int(11,89):r.int(110,890); return [`${a} + … = ${t}`,t-a] }},
  {niv:2,naam:'× en : met 10, 100, 1000',gen:r=>{ const a=r.pick([3.5,0.7,12,4.25,0.06,45,2.8]),f=r.pick([10,100,1000]); return r.ja()?[`${nl(a)} × ${nl(f)}`,rondaf(a*f,4)]:[`${nl(a)} : ${nl(f)}`,rondaf(a/f,6)] }},
  {niv:2,naam:'Verdubbelen en halveren',gen:r=>{ const a=r.int(12,99)*r.pick([1,2]); return r.ja()?[`2 × ${a}`,2*a]:[`de helft van ${2*a}`,a] }},
  {niv:3,naam:'Breuk → kommagetal',gen:r=>{ const [t,n]=r.pick([[1,2],[1,4],[3,4],[1,5],[2,5],[1,8],[3,8],[1,10],[7,10],[1,20]]); return [`${t}/${n} als kommagetal`,rondaf(t/n,4)] }},
  {niv:3,naam:'Kommagetal → procent',gen:r=>{ const x=r.pick([0.5,0.25,0.75,0.1,0.05,0.2,0.125,0.6,0.08,1.2]); return [`${nl(x)} = … %`,rondaf(x*100,2)] }},
  {niv:3,naam:'Procent van',gen:r=>{ const p=r.pick([10,20,25,50,5,1]),a=r.pick([40,60,80,120,200,240,360,500]); return [`${p}% van ${a}`,rondaf(a*p/100,2)] }},
  {niv:4,naam:'Keer met kommagetallen',gen:r=>{ const a=r.pick([0.2,0.3,0.4,0.5,0.6,0.8,1.5]),b=r.int(2,12)*r.pick([1,10]); return [`${nl(a)} × ${b}`,rondaf(a*b,4)] }},
  {niv:5,naam:'Kwadraten en wortels',gen:r=>{ const a=r.int(2,15); return r.ja()?[`${a}²`,a*a]:[`√${a*a}`,a] }},
  {niv:5,naam:'Negatieve getallen',gen:r=>{ const a=r.int(-12,12),b=r.int(2,15); return r.ja()?[`${String(a).replace('-','−')} − ${b}`,a-b]:[`${String(a).replace('-','−')} + ${b}`,a+b] }},
  {niv:6,naam:'Groeifactor ↔ procent',gen:r=>{ const p=r.pick([2,3,5,8,10,15,20,25,40]); const op=r.ja(); return r.ja()?[`${p}% ${op?'erbij':'eraf'}: groeifactor`,rondaf(op?1+p/100:1-p/100,4)]:[`groeifactor ${nl(rondaf(op?1+p/100:1-p/100,4))}: … % ${op?'erbij':'eraf'}`,p] }},
  {niv:6,naam:'Machten van 10',gen:r=>{ const n=r.int(2,6); return r.ja()?[`10${SUP(n)} = …`,10**n]:[`${nl(10**n)} = 10 tot de macht …`,n] }}
];
let FIT=null;
function startFit(){
  const r=RNG(nieuweSeed()); const niv=Math.max(1,S.niv||1);
  const types=FIT_TYPES.filter(t=>t.niv<=niv&&t.niv>=niv-3);
  FIT={r,types,start:Date.now(),goed:0,fout:[],n:0,som:null}; oefenActief=true;
  go('fit'); fitVolgende(); FIT.tik=setInterval(fitTik,250);
}
function fitVolgende(){ const t=FIT.r.pick(FIT.types); const [tekst,antw]=t.gen(FIT.r); FIT.som={tekst,antw,type:t.naam}; $('#fitSom').textContent=tekst; const i=$('#fitIn'); i.value=''; i.focus() }
function fitTik(){ const over=Math.max(0,FIT_TIJD-(Date.now()-FIT.start)/1000); const b=$('#fitBalk'); if(!b){ clearInterval(FIT.tik); return } b.style.width=(100*over/FIT_TIJD)+'%'; $('#fitTijd').textContent=Math.ceil(over)+' s'; if(over<=0) fitKlaar() }
function fitAntw(e){
  if(e&&e.key&&e.key!=='Enter') return; const x=parseGetal($('#fitIn').value); if(x===null||isNaN(x)) return;
  FIT.n++; laatsteTik=Date.now(); const ok=Math.abs(x-FIT.som.antw)<1e-6;
  if(ok) FIT.goed++; else FIT.fout.push(FIT.som);
  const f=$('#fitFb'); f.className='fitfb '+(ok?'g':'f'); f.textContent=ok?'Goed!':`Net niet: ${FIT.som.tekst} = ${nl(FIT.som.antw,6)}`;
  $('#fitScore').textContent=FIT.goed; fitVolgende();
}
function fitKlaar(){
  clearInterval(FIT.tik); oefenActief=false;
  const f=S.fit||{best:0,keer:0,hist:[]}; const nieuwRecord=FIT.goed>f.best;
  S.fit={best:Math.max(f.best,FIT.goed),keer:(f.keer||0)+1,hist:(f.hist||[]).concat([{t:Date.now(),g:FIT.goed,n:FIT.n}]).slice(-30),u:Date.now()};
  bewaar();
  const pct=FIT.n?Math.round(100*FIT.goed/FIT.n):0; const types={}; FIT.fout.forEach(x=>types[x.type]=(types[x.type]||0)+1);
  $('#app').innerHTML=`<div class="wrap smal"><div class="kaart mid"><span class="eyebrow" style="color:var(--knop)">Rekenfit</span>
    <div class="nivbadge">${FIT.goed}</div><h2 style="margin:6px 0">${nieuwRecord?'Nieuw record!':'sommen goed in 2 minuten'}</h2>
    <p class="zacht">${FIT.n} geprobeerd · ${pct}% goed · jouw record: ${S.fit.best}</p>
    ${FIT.fout.length?`<div style="text-align:left;max-width:420px;margin:14px auto"><b>Oefen deze nog even:</b><ul class="lijst">${FIT.fout.slice(0,8).map(x=>`<li>${esc(x.tekst)} = <b>${nl(x.antw,6)}</b></li>`).join('')}</ul>${Object.keys(types).length?`<p class="klein zacht">Meeste fouten bij: ${esc(Object.entries(types).sort((a,b)=>b[1]-a[1])[0][0])}</p>`:''}</div>`:'<p>Geen enkele fout. Knap!</p>'}
    <p class="klein">Tip: doe Rekenfit elke les als warming-up. Snel én foutloos rekenen geeft je hoofd ruimte voor de lastige stappen.</p>
    <div class="voet" style="justify-content:center"><button class="knop zacht" onclick="go('home')">Naar dashboard</button><button class="knop" onclick="startFit()">Nog een ronde</button></div></div></div>`;
}
SCHERMEN.fit=()=>`<div class="wrap smal" id="fitScherm"><div class="top"><button class="terug" onclick="clearInterval(FIT&&FIT.tik);go('home')">← Stoppen</button><h1>Rekenfit</h1><span class="chip">Goed: <b id="fitScore">0</b></span><span class="chip" id="fitTijd">120 s</span></div>
  <div class="fitbalk"><i id="fitBalk"></i></div>
  <div class="kaart mid fitkaart"><div class="fitsom" id="fitSom"></div>
  <input id="fitIn" class="fitin" inputmode="decimal" autocomplete="off" onkeydown="fitAntw(event)" aria-label="Antwoord">
  <div class="voet" style="justify-content:center"><button class="knop groot" onclick="fitAntw()">OK</button></div>
  <div id="fitFb" class="fitfb"></div></div>
  <p class="klein zacht mid">Uit je hoofd, zonder kladpapier. Typ je antwoord en druk op Enter of OK. Komma's mag je typen als komma.</p></div>`;
