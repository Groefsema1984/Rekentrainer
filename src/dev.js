// ===== Ontwikkelaarsmodus: alle niveaus open, elke opgave en elk vraagtype direct bekijken =====
// Ontgrendelen: Docent › inloggen met de docentcode (de server controleert die) › Ontwikkelaarsmodus.
// Het ontwikkelaarsprofiel staat apart opgeslagen; het gewone leerlingaccount op dit apparaat blijft onaangeroerd.
// In deze modus gaat er niets naar de server: geen synchronisatie, geen foutenlog, niet in de vraagcontrole.
function devStaat(niv){ return Object.assign(nieuweStaat(),{naam:'Ontwikkelaar',klas:'klas 6 vwo',niv:niv||12,max:NIVEAUS.length,plaatsing:{niv:niv||12},ver:VER,dev:true}) }
function devAan(){
  if(!DOC.data||DOC.data.lokaal||!DOC.code){ melding('Log eerst in met de docentcode.'); return }
  try{ localStorage.setItem(DEV_VLAG,'1'); if(!localStorage.getItem('rekenkracht-dev-staat')) localStorage.setItem('rekenkracht-dev-staat',JSON.stringify(devStaat(12))) }catch(e){ melding('Opslaan lukt niet op dit apparaat.'); return }
  location.hash=''; location.reload();
}
function devUit(){ try{ localStorage.removeItem(DEV_VLAG) }catch(e){} location.hash=''; location.reload() }
function devReset(){ if(!confirm('Voortgang van het ontwikkelaarsprofiel wissen?')) return; S=devStaat(S.niv||12); bewaar(false); melding('Voortgang gewist.'); go('dev') }
function devNiveau(n){ S.niv=n; S.max=NIVEAUS.length; bewaar(false); go('dev') }
function devKlas(k){ S.klas=k; bewaar(false); go('dev') }
const devVormen=ld=>[...new Set(vormen(ld).concat(ld.stappen?['faded1','faded2']:[]))];
function devItem(id,vorm){
  const ld=LD[id];
  SES={soort:'oefen',ctx:{modus:'ld',ld:id,niv:ld.niv},titel:'Ontwikkelaar · '+ld.naam,n:1,i:0,res:[],recent:[],start:{b:DOMEINEN.map(d=>domB(ld.niv,d.id))}};
  try{ toonItem(maakItem(id,{vorm,trede:vorm==='faded1'?1:vorm==='faded2'?2:3,bron:'oefen'})) }catch(e){ melding('Fout bij maken van '+id+'|'+vorm+': '+esc(e.message)) }
}
function devToets(){ startToets(S.niv) }
function devInstap(){ go('instapIntro'); startInstap() }
SCHERMEN.dev=function(){
  if(!DEV) return SCHERMEN.home();
  const n=S.niv, N=NIVEAUS[n-1];
  const lds=d=>LDS.filter(l=>l.niv===n&&l.dom===d.id);
  return `<div class="wrap"><div class="top"><h1>🛠 Ontwikkelaar</h1><span class="chip">Niets gaat naar de server</span></div>
   <div class="kaart"><span class="eyebrow" style="color:var(--knop)">Niveau kiezen</span>
    <div class="devniv">${NIVEAUS.map((x,i)=>`<button class="${i+1===n?'aan':''}" onclick="devNiveau(${i+1})">${i+1}</button>`).join('')}</div>
    <p class="zacht" style="margin:8px 0 0">Niveau ${n}${N&&N.ref?' · '+esc(N.ref):''}${N&&N.titel?' · '+esc(N.titel):''}</p>
    <div class="voet" style="justify-content:flex-start;flex-wrap:wrap">
     <button class="knop" onclick="go('home')">Dashboard van niveau ${n}</button>
     <button class="knop zacht" onclick="devToets()">Rekentoets niveau ${n} starten</button>
     <button class="knop zacht" onclick="devInstap()">Instaptoets starten</button>
     <button class="knop zacht" onclick="startFit()">Rekenfit</button>
    </div>
    <label class="label">Groep of klas (bepaalt waar de instaptoets begint)</label>${klasSelect('devKlasSel',S.klas)}
    <div class="voet" style="justify-content:flex-start"><button class="knop zacht klein" onclick="devKlas($('#devKlasSel').value)">Klas opslaan</button><button class="knop zacht klein" onclick="devReset()">Voortgang wissen</button><button class="knop zacht klein" onclick="devUit()">Ontwikkelaarsmodus verlaten</button></div></div>
   ${DOMEINEN.map(d=>`<div class="kaart" style="--k:${d.k};margin-top:14px"><span class="eyebrow" style="color:${d.k}">${esc(d.naam)} · niveau ${n} · ${lds(d).length} leerdoelen</span>
    <table class="devtab">${lds(d).map(l=>`<tr><td><b>${esc(l.naam)}</b><br><small class="zacht">${esc(l.id)} · ${esc(subVan(l.dom,l.sub).naam)}</small></td><td>${devVormen(l).map(v=>`<button class="knop zacht klein" onclick="devItem('${l.id}','${v}')">${esc(TREDE_LABEL[v]||v)}</button>`).join(' ')}</td></tr>`).join('')}</table></div>`).join('')}
  </div>`;
};
// zichtbaar label en waarschuwing bij het vangnet
if(DEV){
  document.body.classList.add('devmodus');
  const _profiel=profiel; profiel=function(){ _profiel(); const p=$('#profiel'); if(p&&!p.querySelector('.devlabel')) p.insertAdjacentHTML('afterbegin','<button class="devlabel" onclick="go(\'dev\')">🛠 Ontwikkelaar</button>') };
  const _over=opgaveOverslaan; opgaveOverslaan=function(){ try{ melding('Vangnet: '+Q.it.ld+'|'+Q.it.vorm+' rendert niet goed en is overgeslagen.') }catch(e){} return _over() };
}
