// Maakt DEKKING.md: welke leerdoelen per niveau en domein, gekoppeld aan het Referentiekader rekenen.
// Gebruik: node tools/dekking.js
const fs=require('fs'),path=require('path'),vm=require('vm');const src=path.join(__dirname,'..','src');
const ctx={console,Math,Date,JSON,Number,String,Object,Array,Set,Map,isFinite,isNaN,parseFloat,parseInt,setTimeout:()=>{},setInterval:()=>{},window:{addEventListener(){}},document:{addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},navigator:{}};
vm.createContext(ctx);
const files=['core.js','svg.js','vraag.js','adaptief.js'].map(f=>path.join(src,f)).concat(fs.readdirSync(path.join(src,'niveaus')).filter(f=>/^n\d+\.js$/.test(f)).sort().map(f=>path.join(src,'niveaus',f)));
vm.runInContext(files.map(f=>fs.readFileSync(f,'utf8')).join('\n')+';globalThis.X={LDS,NIVEAUS,DOMEINEN,SUBDOMEINEN};',ctx);
const {LDS,NIVEAUS,DOMEINEN,SUBDOMEINEN}=ctx.X;
const REF={G:'Getallen: getalbegrip, bewerkingen, breuken/kommagetallen, negatieve getallen en machten, schatten',V:'Verhoudingen: verhoudingstaal, verhoudingstabel, schaal, procenten, procentuele verandering, groei, rente, index',M:'Meten en meetkunde: meten en eenheden, tijd en geld, omtrek/oppervlakte/inhoud, meetkunde (Pythagoras, gelijkvormigheid)',B:'Verbanden: tabellen, grafieken en diagrammen, formules, statistiek'};
let o=`# Dekking van het Referentiekader rekenen\n\nAutomatisch gemaakt met \`node tools/dekking.js\`. ${LDS.length} leerdoelen. ★ = contextopgave in rekentoetsstijl.\n\n| Niveau | Referentie | ${DOMEINEN.map(d=>d.naam).join(' | ')} |\n|---|---|${DOMEINEN.map(()=>'---').join('|')}|\n`;
for(const N of NIVEAUS) o+=`| ${N.n} | ${N.ref} | ${DOMEINEN.map(d=>LDS.filter(l=>l.niv===N.n&&l.dom===d.id).length).join(' | ')} |\n`;
o+=`\n## Domeinen (Referentiekader)\n\n${DOMEINEN.map(d=>`- **${d.naam}** – ${REF[d.id]}`).join('\n')}\n`;
for(const N of NIVEAUS){ o+=`\n## Niveau ${N.n} · ${N.ref} · ${N.titel}\n`;
  for(const d of DOMEINEN){ const l=LDS.filter(x=>x.niv===N.n&&x.dom===d.id); o+=`\n**${d.naam}**\n\n${l.map(x=>`- ${x.ctx?'★ ':''}${x.naam} _(${(SUBDOMEINEN[d.id].find(s=>s.id===x.sub)||{naam:x.sub}).naam}${x.rm?', rekenmachine':''})_`).join('\n')}\n` } }
fs.writeFileSync(path.join(__dirname,'..','DEKKING.md'),o); console.log('DEKKING.md:',LDS.length,'leerdoelen');
