// ===== Interactieve modellen: strook en getallenlijn die de leerling zelf bedient =====
// Modellen ondersteunen het denken (van concreet naar abstract). De leerling zet zelf het geheel neer,
// verdeelt de strook, kleurt delen in of verschuift een wijzer over een dubbele getallenlijn.
let MOD={tab:'strook',tot:'',n:4,aan:[],b0:0,e0:100,b1:0,e1:100,pos:.5};
function toonModel(){
  const el=$('#modelpaneel'); if(!el) return; el.hidden=!el.hidden; if(el.hidden) return;
  if(Q&&Q.modelVoor!==Q.it.key){ MOD=Object.assign(MOD,{tot:'',n:4,aan:[],b0:0,e0:100,b1:0,e1:100,pos:.5}); Q.modelVoor=Q.it.key }
  modelTeken(); el.scrollIntoView({behavior:'smooth',block:'nearest'});
}
const modelGetal = s => { const x=parseGetal(String(s||'')); return x===null||isNaN(x)?null:x };
function modelTeken(){
  const el=$('#modelpaneel'); if(!el) return;
  const tabs=`<div class="segment mtabs">${[['strook','Strook'],['lijn','Getallenlijn']].map(([k,t])=>`<button class="${MOD.tab===k?'kies':''}" onclick="MOD.tab='${k}';modelTeken()">${t}</button>`).join('')}</div>`;
  el.innerHTML=`<div class="mkop"><b>✏️ Model · denk het uit</b>${tabs}<button class="mdicht" onclick="$('#modelpaneel').hidden=true" aria-label="Sluiten">✕</button></div>${MOD.tab==='strook'?strookHtml():lijnHtml()}`;
  if(MOD.tab==='lijn') lijnKoppel();
}
// --- strook: geheel verdelen in gelijke delen en delen inkleuren ---
function strookHtml(){
  const n=MOD.n, k=MOD.aan.filter(i=>i<n).length, tot=modelGetal(MOD.tot);
  const deel=tot!==null?tot/n:null;
  const vakken=Array.from({length:n},(_,i)=>`<button class="svak ${MOD.aan.includes(i)?'aan':''}" onclick="strookTik(${i})" aria-label="Deel ${i+1}">${deel!==null&&n<=12?nl(rondaf(deel,3)):''}</button>`).join('');
  return `<div class="mrij"><label>Geheel (100%) <input class="minvul" value="${esc(MOD.tot)}" inputmode="decimal" placeholder="bv. 240" oninput="MOD.tot=this.value;strookUit()" onchange="modelTeken()"></label>
    <span class="stepper"><span>Delen</span><button onclick="MOD.n=Math.max(1,MOD.n-1);modelTeken()">−</button><b>${n}</b><button onclick="MOD.n=Math.min(20,MOD.n+1);modelTeken()">+</button></span></div>
   <div class="strook">${vakken}</div>
   <div class="strookschaal"><span>0%</span><span>50%</span><span>100%</span></div>
   <p class="muit" id="strookUit">${strookTekst()}</p>
   <p class="klein zacht">Tik op een deel om het in te kleuren. Vul het geheel in: dan zie je hoeveel 1 deel is.</p>`;
}
function strookTekst(){
  const n=MOD.n, k=MOD.aan.filter(i=>i<n).length, tot=modelGetal(MOD.tot);
  if(!k) return `1 deel = ${breuk(1,n)} = ${nl(rondaf(100/n,2))}%${tot!==null?` = <b>${nl(rondaf(tot/n,4))}</b>`:''}`;
  return `${k} van de ${n} delen = ${breuk(k,n)} = ${nl(rondaf(100*k/n,2))}%${tot!==null?` = <b>${nl(rondaf(tot*k/n,4))}</b>`:''}`;
}
function strookUit(){ const u=$('#strookUit'); if(u) u.innerHTML=strookTekst() }
function strookTik(i){ MOD.aan=MOD.aan.includes(i)?MOD.aan.filter(x=>x!==i):MOD.aan.concat([i]); modelTeken() }
// --- dubbele getallenlijn met verschuifbare wijzer ---
function lijnWaarden(){ const b0=modelGetal(MOD.b0)??0,e0=modelGetal(MOD.e0)??100,b1=modelGetal(MOD.b1)??0,e1=modelGetal(MOD.e1)??100; return {b0,e0,b1,e1,v0:b0+MOD.pos*(e0-b0),v1:b1+MOD.pos*(e1-b1)} }
function lijnHtml(){
  const w=lijnWaarden(); const st=[0,.25,.5,.75,1];
  const inv=(k,ph)=>`<input class="minvul kort" value="${esc(MOD[k])}" inputmode="decimal" placeholder="${ph}" oninput="MOD.${k}=this.value;lijnUit()">`;
  return `<div class="mrij"><span class="klein"><b>Boven</b> van ${inv('b0','0')} tot ${inv('e0','100')}</span><span class="klein"><b>Onder</b> van ${inv('b1','0')} tot ${inv('e1','100')}</span></div>
   <div class="glijn" id="glijn" role="slider" tabindex="0" aria-label="Wijzer" aria-valuenow="${Math.round(MOD.pos*100)}">
     <div class="glas boven">${st.map(s=>`<i style="left:${s*100}%"><span>${nl(rondaf(w.b0+s*(w.e0-w.b0),3))}</span></i>`).join('')}</div>
     <div class="glas onder">${st.map(s=>`<i style="left:${s*100}%"><span>${nl(rondaf(w.b1+s*(w.e1-w.b1),3))}</span></i>`).join('')}</div>
     <div class="gwijzer" id="gwijzer" style="left:${MOD.pos*100}%"><b id="gv0">${nl(rondaf(w.v0,3))}</b><b id="gv1">${nl(rondaf(w.v1,3))}</b></div>
   </div>
   <p class="muit" id="lijnUit">${lijnTekst()}</p>
   <p class="klein zacht">Sleep de wijzer (of gebruik ← →). Boven en onder horen bij elkaar: zet bijvoorbeeld boven het bedrag en onder 0 tot 100 procent.</p>`;
}
function lijnTekst(){ const w=lijnWaarden(); return `Bij de wijzer: boven <b>${nl(rondaf(w.v0,3))}</b> hoort onder <b>${nl(rondaf(w.v1,3))}</b> (${nl(rondaf(MOD.pos*100,1))}% van de lijn)` }
function lijnUit(){ const w=lijnWaarden(); const a=$('#gv0'),b=$('#gv1'),u=$('#lijnUit'),g=$('#gwijzer'); if(g) g.style.left=(MOD.pos*100)+'%'; if(a){ a.textContent=nl(rondaf(w.v0,3)); b.textContent=nl(rondaf(w.v1,3)) } if(u) u.innerHTML=lijnTekst();
  $$('.glas.boven span').forEach((s,i)=>s.textContent=nl(rondaf(w.b0+[0,.25,.5,.75,1][i]*(w.e0-w.b0),3))); $$('.glas.onder span').forEach((s,i)=>s.textContent=nl(rondaf(w.b1+[0,.25,.5,.75,1][i]*(w.e1-w.b1),3))) }
function lijnKoppel(){
  const l=$('#glijn'); if(!l) return; let sleep=false;
  const zet=e=>{ const r=l.getBoundingClientRect(); let p=(e.clientX-r.left)/r.width; p=Math.max(0,Math.min(1,p)); MOD.pos=Math.round(p*200)/200; lijnUit() };
  l.addEventListener('pointerdown',e=>{ sleep=true; l.setPointerCapture(e.pointerId); zet(e) });
  l.addEventListener('pointermove',e=>{ if(sleep) zet(e) });
  l.addEventListener('pointerup',()=>sleep=false);
  l.addEventListener('keydown',e=>{ if(e.key==='ArrowLeft'||e.key==='ArrowRight'){ e.preventDefault(); MOD.pos=Math.max(0,Math.min(1,MOD.pos+(e.key==='ArrowRight'?.01:-.01))); lijnUit() } });
}
