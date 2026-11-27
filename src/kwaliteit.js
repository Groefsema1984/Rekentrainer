// ===== Automatische kwaliteitscontrole van opgaven (itemanalyse per opgavesjabloon) =====
// Een opgavesjabloon = leerdoel + vraagvorm (bv. "V4.terugrekenen|mc"). Na elke opgave stuurt de app
// een klein event naar de Sheet: goed/fout, Zeker/Gok, tijd, overgeslagen, en of de leerling sterk is.
// Code.gs telt alles op en zet sjablonen die slecht werken op "Geblokkeerd" (bv. bijna iedereen fout,
// vaak overgeslagen, of sterke leerlingen maken hem vaker fout dan zwakke). De app haalt die lijst op
// en biedt geblokkeerde sjablonen niet meer aan; sjablonen die goed werken krijgen vaker een beurt.
const SJ_KEY='rekentrainer-sjablonen';
let SJ=(()=>{ try{ const x=JSON.parse(localStorage.getItem(SJ_KEY)||'null'); if(x&&x.blok) return x }catch(e){} return {blok:[],sterk:[],t:0} })();
const sjKey = (ld,vorm) => ld+'|'+vorm;
const sjGeblokkeerd = k => SJ.blok.includes(k);
// welke vormen mag maakItem kiezen? geblokkeerde eruit (behalve als er dan niets overblijft), sterke dubbel
function sjabloonFilter(ld,vs){
  const ok=vs.filter(v=>!sjGeblokkeerd(sjKey(ld.id,v))); const l=ok.length?ok:vs;
  return l.concat(l.filter(v=>SJ.sterk.includes(sjKey(ld.id,v))));
}
async function haalSjablonen(){
  if(!serverModus()||demoModus) return;
  if(Date.now()-(SJ.t||0)<6*36e5) return;          // hooguit eens per 6 uur
  try{ const j=await api('sjablonen',{}); SJ={blok:j.blok||[],sterk:j.sterk||[],t:Date.now()}; localStorage.setItem(SJ_KEY,JSON.stringify(SJ)) }catch(e){ /* offline: laatste lijst blijft gelden */ }
}
// is de leerling sterk op dit onderdeel? (voor de discriminatie: maken sterke leerlingen hem vaker goed?)
const leerlingSterk = it => !!S&&(it.niv<(S.niv||1)||domB(it.niv,it.dom)>=DREMPEL);
function itemEvent(it,res,skip=false){
  if(!it||!S||['spiegel','herhaal'].includes(it.bron)) return;   // die zijn gekozen op zwakte: geen eerlijke meting
  const sec=Math.round((Date.now()-(Q&&Q.t0||Date.now()))/1000);
  event({t:'item',sj:sjKey(it.ld,it.vorm),ld:it.ld,vorm:it.vorm,niv:it.niv,soort:SES?SES.soort:'',goed:skip?null:!!res.goed,zeker:skip?null:res.zeker,skip:!!skip,sec:Math.min(sec,1800),sterk:leerlingSterk(it)});
}
