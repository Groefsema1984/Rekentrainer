// ===== Groep 3 t/m 6 (niveau 1–4): eerst tikken, dan grote cijfertoetsen, daarna gewoon typen =====
// Opbouw per leerdoel:  'tik'     – de eerste opgaven zijn meerkeuze (grote tegels om op te tikken)
//                       'toetsen' – open vraag met grote cijfertoetsen in beeld (typen mag ook)
//                       'typen'   – open vraag; de cijfertoetsen zijn met één tik terug te halen
// Daarnaast: automatisch voorlezen op niveau 1–2 (uit te zetten), vriendelijke feedback.
function invoerStap(ld){
  if(!ld||ld.niv>4||typeof S==='undefined'||!S||!S.ld) return 'typen';
  const x=S.ld[ld.id]||{n:0,b:0};
  if(x.n<3) return 'tik';
  if(x.n<12&&(x.b||0)<75) return 'toetsen';
  return 'typen';
}
const autoLezen = () => !!(S&&S.autoLees!==false);
function zetAutoLezen(aan){ S.autoLees=aan; bewaar(false); const b=$('#autoLeesKnop'); if(b){ b.textContent=aan?'🔊 Voorlezen: aan':'🔈 Voorlezen: uit'; b.classList.toggle('aan',aan) } if(!aan) try{ stopVoorlezen() }catch(e){} }

function cijferpadHtml(){
  const k=['1','2','3','4','5','6','7','8','9',',','0','⌫'];
  return `<div class="cijferpad" role="group" aria-label="Cijfertoetsen">${k.map(x=>`<button type="button" onclick="cijferTik('${x}')" ${x==='⌫'?'aria-label="Wissen" class="wis"':''}>${x}</button>`).join('')}</div>`;
}
function cijferTik(x){
  const i=$('#antw'); if(!i||Q.klaar) return;
  if(x==='⌫') i.value=i.value.slice(0,-1); else if(i.value.length<9) i.value+=x;
  i.dispatchEvent(new Event('input',{bubbles:true}));
}
function toonCijferpad(){ const r=$('#antw')&&$('#antw').closest('.reken'); if(r&&!$('.cijferpad')){ r.insertAdjacentHTML('afterend',cijferpadHtml()); const t=$('#padTerug'); if(t) t.remove() } }

const _naRenderJong=naRender;
naRender=function(){
  _naRenderJong();
  try{
    const it=Q&&Q.it; if(!it||it.niv>4) return;
    // knop om automatisch voorlezen aan/uit te zetten
    const kop=$('.qkop'); if(kop&&!$('#autoLeesKnop')) kop.insertAdjacentHTML('beforeend',`<button class="rmknop ${autoLezen()?'aan':''}" id="autoLeesKnop" onclick="zetAutoLezen(!autoLezen())">${autoLezen()?'🔊 Voorlezen: aan':'🔈 Voorlezen: uit'}</button>`);
    // cijfertoetsen bij open vragen
    if(['open','faded2','sab'].includes(it.vorm)&&$('#antw')){
      const stap=invoerStap(LD[it.ld]);
      if(stap==='typen') $('#antw').closest('.reken').insertAdjacentHTML('afterend','<button type="button" class="knop zacht klein" id="padTerug" onclick="toonCijferpad()">Cijfertoetsen tonen</button>');
      else toonCijferpad();
    }
    // niveau 1–2: de vraag wordt vanzelf voorgelezen
    if(it.niv<=2&&autoLezen()){ stopVoorlezen(); setTimeout(()=>{ try{ if(!bezigMetVoorlezen()) voorlezen() }catch(e){} },350) }
  }catch(e){ console.warn(e) }
};
