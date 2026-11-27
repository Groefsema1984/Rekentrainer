// ===== Eerst schatten, dan rekenen (bij rekenmachine-opgaven tijdens het oefenen) =====
// Bij een open opgave waarbij de rekenmachine mag, kiest de leerling eerst de juiste ordegrootte.
// Pas daarna gaan het antwoordvak en de rekenmachine open. Zo leert hij zijn uitkomst te controleren.
const eenCijfer = x => { if(!x) return 0; const o=10**Math.floor(Math.log10(Math.abs(x))); return Math.round(x/o)*o };
function schatActief(it){ const ld=LD[it.ld]; return !!(SES&&SES.soort==='oefen'&&it.vorm==='open'&&ld.rm&&!ld.toon&&Math.abs(it.antw)>=8&&it.bron!=='spiegel'&&(it.seed%3!==0)) }
function schatHtml(it){
  Q.schat=null;
  if(!schatActief(it)) return '';
  const g=eenCijfer(it.antw); const o=shuffle([[g,1],[g*10,0],[g/10,0]]);
  Q.schat={g,klaar:false};
  return `<div class="schat" id="schat"><b>Schat eerst:</b> ongeveer hoe groot wordt het antwoord?<div class="schatopties">${o.map(x=>`<button class="optie mini" onclick="kiesSchat(this,${x[1]})">± ${nl(x[0],6)}</button>`).join('')}</div><p class="klein zacht" id="schatfb">Rond de getallen af en reken uit je hoofd. Daarna mag je precies rekenen.</p></div>`;
}
function kiesSchat(el,ok){
  if(!Q.schat||Q.schat.klaar) return; Q.schat.klaar=true; Q.schat.ok=!!ok;
  $$('.schatopties .optie').forEach(b=>{ b.disabled=true }); el.classList.add(ok?'goed':'fout');
  $('#schatfb').innerHTML=ok?'Goede schatting. Reken het nu precies uit en kijk of je uitkomst daar dichtbij ligt.':`Het antwoord ligt rond de <b>${nl(Q.schat.g,6)}</b>. Gebruik die schatting straks om je uitkomst te controleren.`;
  const a=$('#antw'); if(a){ a.disabled=false; a.focus() }
}
function schatNaRender(){ if(Q&&Q.schat&&!Q.schat.klaar&&$('#schat')){ const a=$('#antw'); if(a){ a.disabled=true; let c=a; while(c.parentElement&&c.parentElement.id!=='qbody') c=c.parentElement; if(c.parentElement) c.parentElement.insertBefore($('#schat'),c) } } }
// controle achteraf: zit het antwoord er een factor 5 of meer naast?
function ordegrootteTip(it,res){
  if(it.vorm!=='open'&&it.vorm!=='faded2') return '';
  const juist=it.vorm==='open'?it.antw:it.stappen[it.leeg][1]; const x=parseGetal(String(res.gegeven).split(' ')[0]);
  if(!isFinite(x)||!x||!juist) return ''; const f=x/juist; if(f<5&&f>0.2) return '';
  const k=f>=5?Math.round(f):Math.round(1/f);
  return `<p class="schattip">🔎 <b>Controleer met een schatting:</b> jouw antwoord is ongeveer ${nl(k>=100?eenCijfer(k):k)} keer zo ${f>=5?'groot':'klein'} als het goede antwoord. Kan dat kloppen? Rond de getallen in de vraag af en reken het globaal na.</p>`;
}
