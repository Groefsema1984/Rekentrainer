// Inhoudscontrole (orakel): rekent risicovolle leerdoelen onafhankelijk na en controleert realisme en taal.
// controleer.js checkt de vorm; dit script checkt of de opgave in de echte wereld klopt.
// Gebruik: node tools/orakel.js   (exitcode 1 bij een fout)
const fs=require('fs'),path=require('path'),vm=require('vm');
const src=path.join(__dirname,'..','src');
const ctx={console,Math,Date,JSON,Number,String,Object,Array,Set,Map,isFinite,isNaN,parseFloat,parseInt,setTimeout:()=>{},setInterval:()=>{},clearTimeout:()=>{},
  window:{addEventListener(){}},document:{addEventListener(){},visibilityState:'visible'},localStorage:{getItem(){return null},setItem(){},removeItem(){}},melding(){},navigator:{}};
vm.createContext(ctx);
const files=['core.js','svg.js','vraag.js','adaptief.js'].map(f=>path.join(src,f)).concat(fs.readdirSync(path.join(src,'niveaus')).filter(f=>/^n\d+\.js$/.test(f)).sort().map(f=>path.join(src,'niveaus',f)));
vm.runInContext(files.map(f=>fs.readFileSync(f,'utf8')).join('\n')+'\n;globalThis.LDS=LDS;globalThis.maakItem=maakItem;globalThis.LD=LD;globalThis.parseGetal=parseGetal;',ctx,{filename:'alles.js'});
const {LDS,maakItem,LD,parseGetal}=ctx; let fouten=0;
const meld=(id,m)=>{ if(fouten<80) console.log('✗',id,m); fouten++ };
const tekst=s=>String(s||'').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ');
const N=300;
const items=(id,vorm='open',n=N)=>{ const l=[]; for(let s=1;s<=n;s++){ try{ l.push(maakItem(id,{seed:s*104729+7,vorm,trede:3})) }catch(e){} } return l };
// 1. taal en labels in alle vraagteksten
for(const ld of LDS){ if(!ld.antw&&!ld.opties) continue;
  for(const it of items(ld.id,ld.antw?"open":"mc",40)){ const t=tekst(it.vraag)+' '+(it.sab?tekst(it.sab.intro)+' '+(it.sab.stappen||[]).map(tekst).join(' '):'');
    if(/\bgroep [1-8]\b|\b[1-6] ?(vwo|havo|vmbo)\b|\bbrugklas\b/i.test(t)) { meld(ld.id,'klaslabel: '+t.slice(0,90)); break }
    if(/\belke (jaar|uur)\b/.test(t)) { meld(ld.id,'"elke jaar/uur": '+t.slice(0,90)); break }
    if(/&amp;(lt|gt|amp);/.test(t)) { meld(ld.id,'dubbel ge-escaped teken'); break }
    if(/\d \./.test(t)) { meld(ld.id,'spatie voor punt: '+t.slice(0,90)); break }
    if(/[a-z0-9)]\. [a-z]/.test(t.replace(/\b(bv|bijv|o\.a|ca|nr)\. /g,''))) { meld(ld.id,'kleine letter na punt: '+t.slice(0,110)); break }
    if(/(^|[\s(])-\d/.test(t)) { meld(ld.id,'koppelteken als minteken: '+t.slice(0,90)); break }
  } }
// 2. onafhankelijk narekenen en realisme
const check=(id,f)=>{ if(!LD[id]) return meld(id,'leerdoel bestaat niet'); for(const it of items(id)){ const m=f(it.v,it,tekst(it.vraag)); if(m){ meld(id,m+' · '+tekst(it.vraag).slice(0,100)); break } } };
check('G3.breukoptellen',v=>v.op==='+'&&v.a/v.b+v.c/v.d>1?'samen meer dan één geheel':null);
check('G3.kommadelen',(v,it,t)=>/sok/.test(t)&&!/paar sport/.test(t)?'sokken niet per paar':Math.abs(it.antw*v.n-v.tot/100)>1e-9?'narekenen klopt niet':/pizza/.test(t)&&it.antw<4?'pizza te goedkoop':null);
check('V3.snelheid',(v,it,t)=>{ const s=v.km*60/v.min; if(Math.abs(s-it.antw)>1e-9) return 'narekenen klopt niet'; if(/loop/.test(t)&&(s<3||s>7)) return 'wandelen '+s+' km/u'; if(/fiets/.test(t)&&(s<10||s>30)) return 'fietsen '+s+' km/u'; if(/skeeler/.test(t)&&(s<8||s>25)) return 'skeeleren '+s+' km/u'; return null });
check('M1.tijd',(v,it,t)=>/film.*komt aan|bus.*afgelopen|bus.*eindigt|training.*komt aan/.test(t)?'begin- en eindzin passen niet':null);
check('B6.gemhalen',(v,it)=>it.antw<5.5||it.antw>9.5?'benodigd cijfer '+it.antw:null);
// Saboteur G1.cijferen: precies één fout (alleen de eenheden lenen)
for(let s=1;s<=N;s++){ let it; try{ it=maakItem('G1.cijferen',{seed:s*31+5,vorm:'sab',trede:3}) }catch(e){ continue } const sb=it.sab; const t=sb.stappen.map(tekst).join(' ');
  const m=t.match(/Tientallen: (\d) en (\d)/); if(m&&+m[1]-1<+m[2]){ meld('G1.cijferen','saboteur met twee fouten: '+t.slice(0,120)); break } }
// zelfuitleg bij het voorbeeld (fase 1): drie verschillende opties, precies één goed
for(const ld of LDS){ if(!ld.stappen) continue; for(let s=1;s<=30;s++){ let it; try{ it=maakItem(ld.id,{seed:s*977+3,vorm:'faded1',trede:1}) }catch(e){ meld(ld.id,'faded1: '+e.message); break }
  const o=it.check.opties.map(x=>tekst(x.t)); if(new Set(o).size!==o.length||o.some(x=>!x.trim())||it.check.opties.filter(x=>x.goed).length!==1){ meld(ld.id,'checkvraag: '+tekst(it.check.vraag)+' | '+o.join(' | ')); break } } }
// invoer
[['1 1/6',7/6],['12,5',12.5],['12.5',12.5],[' 3 ',3],['€ 4,50',4.5],['1.250',1250],['0,125',.125],['−2',-2],['2 3/4 kg',2.75]].forEach(([s,w])=>{ const x=parseGetal(s); if(Math.abs(x-w)>1e-9) meld('parseGetal',`"${s}" → ${x}, verwacht ${w}`) });
// nieuwe leerdoelen niveau 1–5: onafhankelijk narekenen
check('M04.tijdsduur',(v,it)=>((v.eu*60+v.em)-(v.u*60+v.m))!==it.antw?'tijdsduur klopt niet':v.em>59||v.eu>23?'onmogelijke tijd':null);
check('V05.schaal',(v,it)=>Math.abs(v.c*v.s/100/1000-it.antw)>1e-9?'schaal klopt niet':it.antw>20?'wandelroute '+it.antw+' km':null);
check('M05.aquarium',(v,it)=>Math.abs(v.l*v.b*v.h/1000-it.antw)>1e-9?'inhoud klopt niet':null);
check('X5.traktatie',(v,it)=>{ const z=Math.ceil(v.k*v.p/v.z); return z*v.z<v.k*v.p||(z-1)*v.z>=v.k*v.p?'aantal zakken klopt niet':Math.abs(z*v.pr-it.antw)>0.005?'prijs klopt niet':null });
check('B05.gemiddelde',(v,it)=>it.antw<1||it.antw>10?'benodigd cijfer '+it.antw:Math.abs((v.w.reduce((a,b)=>a+b,0)+it.antw)/5-v.g)>1e-9?'gemiddelde klopt niet':null);
check('G05.negatief',(v,it)=>it.antw!==(v.op==='kouder'?-v.a-v.b:v.b-v.a)?'temperatuur klopt niet':null);

// ---------- kwaliteitssignalen (waarschuwing, geen fout) ----------
// a) meerkeuze zonder echte denkfout: gemiddeld 1 of meer opgevulde afleiders zonder feedback
const zwak=[]; for(const ld of LDS){ if(!ld.antw||!ld.fouten||ld.opties) continue; let fill=0,n=0; for(let s=1;s<=30;s++){ try{ const it=maakItem(ld.id,{seed:s*97+1,vorm:'mc',trede:3}); fill+=it.opties.filter(o=>!o.goed&&!o.fb).length; n++ }catch(e){} } if(n&&fill/n>=1) zwak.push(ld.id) }
if(zwak.length) console.log(`⚠ ${zwak.length} leerdoel(en) met meestal een opvul-afleider zonder denkfout: ${zwak.join(', ')}`);
// b) dekking: elk niveau minstens 3 leerdoelen per domein
const SUBD=ctx.SUBDOMEINEN||{}; const perNiv={}; LDS.forEach(l=>{ const k=perNiv[l.niv]=perNiv[l.niv]||{G:0,V:0,M:0,B:0}; k[l.dom]++ });
Object.entries(perNiv).forEach(([n,k])=>{ const dun=Object.entries(k).filter(([d,x])=>x<3).map(([d,x])=>d+':'+x); if(dun.length) console.log(`⚠ niveau ${n}: weinig leerdoelen in domein ${dun.join(', ')}`) });

console.log(fouten?`${fouten} inhoudsfout(en) gevonden.`:'Orakel: geen inhoudsfouten gevonden.'); process.exit(fouten?1:0);
