// Controleert alle leerdoelen: voor elk leerdoel 400 keer een opgave maken en nagaan of alles klopt.
// Gebruik: node tools/controleer.js   (stopt met exitcode 1 bij een fout)
const fs=require('fs'),path=require('path'),vm=require('vm');
const src=path.join(__dirname,'..','src');
const ctx={console,Math,Date,JSON,Number,String,Object,Array,Set,Map,isFinite,isNaN,parseFloat,parseInt,setTimeout:()=>{},setInterval:()=>{},clearTimeout:()=>{},
  window:{addEventListener(){}},document:{addEventListener(){},visibilityState:'visible'},localStorage:{getItem(){return null},setItem(){},removeItem(){}},melding(){},navigator:{}};
vm.createContext(ctx);
const files=['core.js','svg.js','vraag.js','adaptief.js'].map(f=>path.join(src,f)).concat(fs.readdirSync(path.join(src,'niveaus')).filter(f=>/^n\d+\.js$/.test(f)).sort().map(f=>path.join(src,'niveaus',f)));
vm.runInContext(files.map(f=>fs.readFileSync(f,'utf8')).join('\n')+'\n;globalThis.LDS=LDS;globalThis.maakItem=maakItem;globalThis.vormen=vormen;globalThis.SUBDOMEINEN=SUBDOMEINEN;globalThis.LD=LD;',ctx,{filename:'alles.js'});
const {LDS,maakItem,vormen,SUBDOMEINEN,LD}=ctx; let fouten=0; const meld=(ld,m)=>{ if(fouten<60) console.log('✗',ld.id,m); fouten++ };
const dec=x=>{ const s=String(Math.abs(x)); return s.includes('e')?9:(s.split('.')[1]||'').length };
const tekst=s=>String(s).replace(/<[^>]+>/g,'');
for(const ld of LDS){
  if(!SUBDOMEINEN[ld.dom]||!SUBDOMEINEN[ld.dom].some(s=>s.id===ld.sub)) meld(ld,'onbekend subdomein '+ld.sub);
  (ld.verwar||[]).forEach(id=>{ if(!LD[id]) meld(ld,'verwar naar onbekend leerdoel '+id) });
  const vs=[...new Set(vormen(ld).concat(ld.stappen?['faded1','faded2']:[]))];
  for(let s=1;s<=400;s++){
    for(const vorm of vs){
      let it; try{ it=maakItem(ld.id,{seed:s*7919+13,vorm,trede:vorm==='faded1'?1:vorm==='faded2'?2:3}) }catch(e){ meld(ld,vorm+' seed '+s+': '+e.message); continue }
      const v=it.v;
      if(vorm==='open'||vorm==='mc'){
        if(ld.antw){ const a=it.antw; if(typeof a!=='number'||!isFinite(a)) { meld(ld,'antwoord geen getal: '+a+' '+JSON.stringify(v)); break }
          if(dec(a)>(ld.dec??2)) { meld(ld,'te veel decimalen: '+a+' '+JSON.stringify(v)); break }
          if(a<0&&!ld.negatief) { meld(ld,'negatief antwoord: '+a); break } }
        if(/undefined|NaN|Infinity/.test(tekst(it.vraag))) { meld(ld,'vraagtekst: '+tekst(it.vraag)); break }
      }
      if(vorm==='mc'){ if(it.opties.length<3) { meld(ld,'mc heeft maar '+it.opties.length+' opties '+JSON.stringify(v)); break }
        const t=it.opties.map(o=>tekst(o.t)); if(new Set(t).size!==t.length) { meld(ld,'dubbele mc-opties: '+t.join(' | ')); break }
        if(it.opties.filter(o=>o.goed).length!==1) { meld(ld,'mc niet precies 1 goed'); break } }
      if(vorm==='faded1'||vorm==='faded2'){ const stp=it.stappen; const laatste=[...stp].reverse().find(x=>typeof x[1]==='number');
        if(ld.antw&&laatste&&Math.abs(laatste[1]-it.antw)>1e-6&&!ld.stapVrij) { meld(ld,'laatste stap ('+laatste[1]+') ≠ antwoord ('+it.antw+') '+JSON.stringify(v)); break }
        if(stp.some(x=>/undefined|NaN/.test(tekst(x[0])))) { meld(ld,'staptekst: '+stp.map(x=>x[0]).join(' / ')); break }
        if(vorm==='faded2'&&it.leeg==null) { meld(ld,'geen lege stap'); break } }
      if(vorm==='sab'){ const sb=it.sab; if(!(sb.fout>=0&&sb.fout<sb.stappen.length)) { meld(ld,'sab fout-index'); break }
        if(!isFinite(sb.juist)) { meld(ld,'sab juist '+sb.juist); break }
        if(sb.stappen.length<3||sb.stappen.length>6) { meld(ld,'sab aantal stappen '+sb.stappen.length); break }
        if(sb.stappen.some(x=>/undefined|NaN/.test(tekst(x)))) { meld(ld,'sab tekst '+sb.stappen.join(' / ')); break }
        if(sb.check!=null&&Math.abs(sb.check-sb.juist)<1e-9) { meld(ld,'saboteur-uitkomst is per ongeluk goed '+JSON.stringify(v)); break } }
      if(vorm==='tabel'){ for(const [c,r] of it.tab.leeg){ const x=it.tab.rijen[c][r]; if(typeof x!=='number'||!isFinite(x)||dec(x)>(ld.dec??2)) { meld(ld,'tabelvak '+x); break } } }
      if(vorm==='koppel'){ const l=it.paren.map(p=>p[0]),r=it.paren.map(p=>p[1]); if(new Set(l).size!==l.length||new Set(r).size!==r.length) { meld(ld,'koppel niet uniek '+JSON.stringify(it.paren)); break } }
    }
  }
  if(ld.fouten){ let weinig=0; for(let s=1;s<=200;s++){ const it=maakItem(ld.id,{seed:s*31+5,vorm:'mc'}); if(it.opties.length<3) weinig++ } if(weinig) meld(ld,'mc met < 3 opties in '+weinig+'/200'); }
}
// dekking: elk niveau elk domein minstens 3 leerdoelen
const tel={}; LDS.forEach(l=>{ const k=l.niv+'.'+l.dom; tel[k]=(tel[k]||0)+1 });
for(let n=1;n<=8;n++) for(const d of ['G','V','M','B']){ if((tel[n+'.'+d]||0)<3) console.log('… nog niet compleet: Niveau '+n+' '+d+' ('+(tel[n+'.'+d]||0)+' leerdoelen)') }
console.log(LDS.length+' leerdoelen gecontroleerd, '+fouten+' fouten');
process.exit(fouten?1:0);
