// ===== Rekenmachine (alleen bij opgaven waar die in de rekentoets ook mag) =====
let RM={uit:'',hist:''};
function toonRekenmachine(){
  if(!Q||!Q.it.rm) return; Q.it.rmGebruikt=true;
  const el=$('#rekenmachine'); el.hidden=!el.hidden; if(el.hidden) return;
  const t=['C','(',')','÷','7','8','9','×','4','5','6','−','1','2','3','+','0',',','%','='];
  el.innerHTML=`<div class="rm"><div class="rmkop"><b>🧮 Rekenmachine</b><button onclick="$('#rekenmachine').hidden=true" aria-label="Sluiten">✕</button></div><div class="rmhist">${esc(RM.hist)}</div><div class="rmscherm" id="rmScherm">${esc(RM.uit)||'0'}</div>
    <div class="rmtoetsen">${t.map(k=>`<button class="${/[÷×−+=]/.test(k)?'op':k==='C'?'wis':''}" onclick="rmToets('${k}')">${k}</button>`).join('')}<button onclick="rmToets('√')">√</button><button onclick="rmToets('π')">π</button><button onclick="rmToets('^')">xʸ</button><button onclick="rmToets('⌫')">⌫</button><button class="op" onclick="rmNaarAntw()" title="Zet in antwoordvak">→ vak</button></div></div>`;
}
function rmToets(k){
  if(k==='C'){RM.uit='';RM.hist=''} else if(k==='⌫') RM.uit=RM.uit.slice(0,-1);
  else if(k==='='){ const r=rmReken(RM.uit); RM.hist=RM.uit+' ='; RM.uit=isFinite(r)?nl(r,8).replace(/\./g,''):'Fout' }
  else { if(RM.uit==='Fout') RM.uit=''; RM.uit+=k }
  $('#rmScherm').textContent=RM.uit||'0'; $('.rmhist').textContent=RM.hist;
}
function rmReken(s){
  s=s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/,/g,'.').replace(/(\d+(?:\.\d+)?)%/g,'($1/100)').replace(/√\(?(\d+(?:\.\d+)?)\)?/g,'Math.sqrt($1)').replace(/\^/g,'**').replace(/π/g,'Math.PI');
  if(!/^[\d+\-*/().\sMathsqrtPI]*$/.test(s)) return NaN;
  try{ return Function('"use strict";return ('+s+')')() }catch(e){ return NaN }
}
function rmNaarAntw(){ const a=$('#antw'); if(a&&!a.disabled&&RM.uit&&RM.uit!=='Fout'){ a.value=RM.uit; $('#rekenmachine').hidden=true } }
