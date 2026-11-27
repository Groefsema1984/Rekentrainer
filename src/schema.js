// ===== Schema bij verhaalsommen: eerst de gegevens ordenen, dan rekenen =====
// Bij een verhaalsom met een verhoudingsstructuur zet de leerling eerst de getallen uit de tekst
// in een verhoudingstabel (het schema). Het vraagteken is wat je zoekt. Pas daarna gaat het antwoordvak open.
function schemaActief(it){
  const ld=LD[it.ld];
  return !!(SES&&SES.soort==='oefen'&&it.vorm==='open'&&ld.tabel&&!ld.toon&&it.bron!=='spiegel'&&(it.seed%3===0||(ld.ctx&&!schatActief(it))));
}
function schemaHtml(it){ Q.schema=null; return schemaActief(it)?'<div class="schema" id="schema" hidden></div>':'' }
const tekstGetallen = t => (t.match(/\d+(?:\.\d{3})*(?:,\d+)?/g)||[]).map(s=>parseGetal(s)).filter(x=>x!==null&&isFinite(x));
function schemaNaRender(){
  const box=$('#schema'); if(!box||!Q) return;
  const it=Q.it, ld=LD[it.ld]; let t; try{ t=ld.tabel(it.v) }catch(e){ t=null }
  const kloon=$('#qbody').cloneNode(true); kloon.querySelectorAll('#schema,#schat,input,select').forEach(x=>x.remove());
  const getallen=tekstGetallen(kloon.textContent||'');
  const bekend=x=>typeof x==='number'&&getallen.some(g=>Math.abs(g-x)<1e-9);
  if(!t||!t.rijen||!t.kop){ box.remove(); return }
  let n=0;
  const cellen=t.rijen.map((c,ci)=>c.map((x,ri)=>{ if(t.leeg.some(l=>l[0]===ci&&l[1]===ri)) return {s:'?'}; if(bekend(x)||(x===100&&/procent|%/i.test(t.kop[ri]))){ n++; return {s:'in',x} } return {s:'tus'} }));
  if(n<2){ box.remove(); return }
  Q.schema={t,cellen,klaar:false};
  const cel=(c,ci,ri)=>c.s==='?'?'<td class="zoek">?</td>':c.s==='tus'?'<td class="leeg">…</td>':`<td><input class="schvak" data-r="${ri}" data-c="${ci}" inputmode="decimal" autocomplete="off" aria-label="${esc(t.kop[ri])}"></td>`;
  box.innerHTML=`<b>Denkstap · maak eerst een schema</b><p class="klein">Welke getallen uit de opgave horen bij elkaar? Zet ze in de ${ld.dom==='B'?'tabel':'verhoudingstabel'}.${t.kop.some(k=>/procent|%/i.test(k))?' Denk ook aan het geheel: dat is 100%.':''} Het <b>?</b> is wat je zoekt.</p>
    <div class="tabelwrap"><table class="vtab"><tbody>${t.kop.map((k,ri)=>`<tr><th>${esc(k)}</th>${cellen.map((c,ci)=>cel(c[ri],ci,ri)).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="voet" style="justify-content:flex-start;margin-top:8px"><button class="knop klein" onclick="schemaCheck()">Controleer schema</button></div><p class="klein" id="schemafb"></p>`;
  box.hidden=false;
  $$('.schvak',box).forEach(x=>x.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); e.stopImmediatePropagation(); schemaCheck() } }));
  const a=$('#antw'); if(a){ a.disabled=true; let c=a; while(c.parentElement&&c.parentElement.id!=='qbody') c=c.parentElement; if(c.parentElement&&c!==box) c.parentElement.insertBefore(box,c) }
}
function schemaCheck(){
  const sc=Q&&Q.schema; if(!sc||sc.klaar) return;
  const vakken=$$('#schema .schvak'); if(vakken.some(x=>!x.value.trim())){ melding('Vul eerst alle lege vakjes van het schema in.'); return }
  // per rij vergelijken; kolommen in een andere volgorde mag ook
  let ok=true;
  sc.t.kop.forEach((k,ri)=>{ const rij=vakken.filter(x=>+x.dataset.r===ri); const moet=rij.map(x=>sc.t.rijen[+x.dataset.c][ri]).sort((a,b)=>a-b);
    const is=rij.map(x=>parseGetal(x.value)).sort((a,b)=>a-b); const rijOk=moet.every((m,i)=>is[i]!==null&&Math.abs(is[i]-m)<1e-6);
    rij.forEach(x=>{ x.disabled=true; x.classList.add(rijOk?'goed':'fout'); if(!rijOk) x.value=nl(sc.t.rijen[+x.dataset.c][ri],6) }); if(!rijOk) ok=false });
  sc.klaar=true; sc.ok=ok;
  $('#schemafb').innerHTML=ok?'Goed geordend. Kijk nu: hoe kom je van een bekende kolom naar de kolom met het <b>?</b> '+(LD[Q.it.ld].dom==='B'?'Welk patroon of welke regel zie je?':'Wat je boven doet (× of :), doe je ook onder.')
    :'Niet helemaal: de juiste getallen staan nu in het schema. Lees de zin bij elk getal nog eens: waar hoort het bij? Reken daarna verder vanuit het schema.';
  $('#schema button').disabled=true;
  const a=$('#antw'); if(a){ a.disabled=false; a.focus() }
}
