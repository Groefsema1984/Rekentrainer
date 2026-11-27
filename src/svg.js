// ===== Functionele figuren (SVG): verhoudingsbalk, -tabel, getallenlijn, breukstrook, meetkunde en grafieken =====
const FIG = {
  wrap:(inner,w,h,extra='')=>`<svg class="fig" viewBox="0 0 ${w} ${h}" role="img" ${extra} xmlns="http://www.w3.org/2000/svg">${inner}</svg>`,
  t:(x,y,s,o={})=>`<text x="${x}" y="${y}" text-anchor="${o.a||'middle'}" class="${o.c||''}" ${o.fs?`font-size="${o.fs}"`:''}>${esc(s)}</text>`,

  // verhoudingsbalk: delen [{w:aandeel,label,k:'acc'|'zacht'|'goed'|'fout'}], boven: label boven totale balk
  balk(delen,boven=''){
    const W=560,H=boven?110:84,x0=10,bw=540; const tot=delen.reduce((s,d)=>s+d.w,0); let x=x0,o='';
    if(boven) o+=`<path d="M${x0} 28 v-8 h${bw} v8" class="lijn"/>`+FIG.t(x0+bw/2,14,boven);
    const y=boven?34:10;
    delen.forEach((d,i)=>{ const w=bw*d.w/tot; o+=`<rect x="${x}" y="${y}" width="${w}" height="44" class="vlak ${d.k||(i%2?'b':'a')}"/>`+FIG.t(x+w/2,y+27,d.label||'',{c:'op'}); if(d.onder) o+=FIG.t(x+w/2,y+66,d.onder,{c:'zacht'}); x+=w });
    return FIG.wrap(o,W,H+(delen.some(d=>d.onder)?18:0));
  },
  // breukstrook: n gelijke stukken, k gekleurd
  strook(k,n,label=''){
    const W=560,bw=540,w=bw/n; let o='';
    for(let i=0;i<n;i++) o+=`<rect x="${10+i*w}" y="10" width="${w}" height="40" class="vlak ${i<k?'a':'leeg'}"/>`;
    if(label) o+=FIG.t(280,74,label,{c:'zacht'});
    return FIG.wrap(o,W,label?84:60);
  },
  // getallenlijn van a tot b met streepjes elke s; punten [{x,label,k}]
  lijn(a,b,s,punten=[],labelsElke=1){
    const W=580,x0=20,x1=560,X=v=>x0+(v-a)/(b-a)*(x1-x0); let o=`<line x1="${x0}" y1="40" x2="${x1}" y2="40" class="ax"/>`;
    let i=0; for(let v=a; v<=b+1e-9; v=rondaf(v+s,6),i++){ o+=`<line x1="${X(v)}" y1="32" x2="${X(v)}" y2="48" class="ax"/>`; if(i%labelsElke===0) o+=FIG.t(X(v),70,nl(v),{c:'zacht',fs:15}) }
    punten.forEach(p=>{ o+=`<circle cx="${X(p.x)}" cy="40" r="7" class="pt ${p.k||''}"/>`+(p.label?FIG.t(X(p.x),20,p.label,{fs:16}):'') });
    return FIG.wrap(o,W,82);
  },
  // rechthoek met maten
  rechthoek(b,h,lb,lh,opt={}){
    const sc=Math.min(360/b,170/h), w=b*sc, hh=h*sc, x=(460-w)/2, y=20;
    let o=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" class="vlak ${opt.leeg?'leeg':'a'}"/>`;
    o+=FIG.t(x+w/2,y+hh+26,lb)+FIG.t(x+w+10,y+hh/2+6,lh,{a:'start'});
    return FIG.wrap(o,460,hh+56);
  },
  // L-vorm: buitenmaat B×H met een rechthoek bw×bh weggesneden rechtsboven
  lvorm(B,H,bw,bh,lab){
    const sc=Math.min(360/B,190/H), X=v=>50+v*sc, Y=v=>20+v*sc;
    const p=`M${X(0)} ${Y(0)} H${X(B-bw)} V${Y(bh)} H${X(B)} V${Y(H)} H${X(0)} Z`;
    let o=`<path d="${p}" class="vlak a"/>`;
    o+=FIG.t((X(0)+X(B))/2,Y(H)+26,lab.B)+FIG.t(X(0)-10,(Y(0)+Y(H))/2+6,lab.H,{a:'end'})+FIG.t((X(0)+X(B-bw))/2,Y(0)-6,lab.top||'')+FIG.t(X(B)+10,(Y(bh)+Y(H))/2+6,lab.r||'',{a:'start'});
    return FIG.wrap(o,480,H*sc+60);
  },
  // rechthoekige driehoek met rechthoekszijden a (horizontaal) en b (verticaal)
  driehoek(a,b,la,lb,lc){
    const sc=Math.min(320/a,180/b), w=a*sc, h=b*sc, x=70, y=20;
    let o=`<path d="M${x} ${y} L${x} ${y+h} L${x+w} ${y+h} Z" class="vlak a"/><path d="M${x} ${y+h-16} h16 v16" class="lijn"/>`;
    o+=FIG.t(x+w/2,y+h+26,la)+FIG.t(x-10,y+h/2+6,lb,{a:'end'})+FIG.t(x+w/2+14,y+h/2-8,lc,{a:'start'});
    return FIG.wrap(o,460,h+56);
  },
  cirkel(r,label){
    return FIG.wrap(`<circle cx="120" cy="100" r="80" class="vlak a"/><line x1="120" y1="100" x2="200" y2="100" class="lijn"/><circle cx="120" cy="100" r="4" class="pt"/>`+FIG.t(160,92,label),260,200);
  },
  // balk (3D) l×b×h
  doos(l,b,h,ll,lb,lh){
    const d=40,w=220,hh=110,x=40,y=60;
    let o=`<path d="M${x} ${y} h${w} v${hh} h-${w} Z" class="vlak a"/><path d="M${x} ${y} l${d} -${d} h${w} l-${d} ${d} Z" class="vlak b"/><path d="M${x+w} ${y} l${d} -${d} v${hh} l-${d} ${d} Z" class="vlak c"/>`;
    o+=FIG.t(x+w/2,y+hh+26,ll)+FIG.t(x+w+d/2+12,y+hh-6,lb,{a:'start'})+FIG.t(x-10,y+hh/2+6,lh,{a:'end'});
    return FIG.wrap(o,360,y+hh+40);
  },
  // lijngrafiek: series [{punten:[[x,y]...],naam,k}], as {xmax,ymax,xs,ys,xl,yl}
  grafiek(series,as){
    const W=560,H=320,L=60,R=20,T=20,B=50, X=v=>L+(v-(as.xmin||0))/(as.xmax-(as.xmin||0))*(W-L-R), Y=v=>H-B-(v-(as.ymin||0))/(as.ymax-(as.ymin||0))*(H-T-B);
    let o='';
    for(let v=as.ymin||0; v<=as.ymax+1e-9; v=rondaf(v+as.ys,6)) o+=`<line x1="${L}" y1="${Y(v)}" x2="${W-R}" y2="${Y(v)}" class="rast"/>`+FIG.t(L-8,Y(v)+5,nl(v),{a:'end',c:'zacht',fs:14});
    for(let v=as.xmin||0; v<=as.xmax+1e-9; v=rondaf(v+as.xs,6)) o+=`<line x1="${X(v)}" y1="${T}" x2="${X(v)}" y2="${H-B}" class="rast"/>`+FIG.t(X(v),H-B+20,as.xlab?as.xlab(v):nl(v),{c:'zacht',fs:14});
    o+=`<line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" class="ax"/><line x1="${L}" y1="${T}" x2="${L}" y2="${H-B}" class="ax"/>`;
    o+=FIG.t((L+W-R)/2,H-8,as.xl||'',{fs:15})+`<text x="14" y="${(T+H-B)/2}" transform="rotate(-90 14 ${(T+H-B)/2})" text-anchor="middle" font-size="15">${esc(as.yl||'')}</text>`;
    series.forEach((s,i)=>{ o+=`<polyline points="${s.punten.map(p=>X(p[0])+','+Y(p[1])).join(' ')}" class="serie s${i}" fill="none"/>`+s.punten.map(p=>`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4" class="pt s${i}"/>`).join('') });
    if(series.length>1) o+=series.map((s,i)=>`<rect x="${L+10+i*150}" y="${T+4}" width="14" height="14" class="leg s${i}"/>`+FIG.t(L+30+i*150,T+16,s.naam,{a:'start',fs:14})).join('');
    return FIG.wrap(o,W,H);
  },
  staaf(labels,waarden,as){
    const W=560,H=300,L=56,R=16,T=16,B=46,n=labels.length,bw=(W-L-R)/n,y0=as.ymin||0, Y=v=>H-B-(v-y0)/(as.ymax-y0)*(H-T-B);
    let o='';
    for(let v=y0; v<=as.ymax+1e-9; v=rondaf(v+as.ys,6)) o+=`<line x1="${L}" y1="${Y(v)}" x2="${W-R}" y2="${Y(v)}" class="rast"/>`+FIG.t(L-8,Y(v)+5,nl(v),{a:'end',c:'zacht',fs:14});
    labels.forEach((l,i)=>{ o+=`<rect x="${L+i*bw+bw*.18}" y="${Y(waarden[i])}" width="${bw*.64}" height="${Y(y0)-Y(waarden[i])}" class="vlak a"/>`+FIG.t(L+i*bw+bw/2,H-B+20,l,{fs:14}) });
    o+=`<line x1="${L}" y1="${H-B}" x2="${W-R}" y2="${H-B}" class="ax"/>`+`<text x="14" y="${(T+H-B)/2}" transform="rotate(-90 14 ${(T+H-B)/2})" text-anchor="middle" font-size="15">${esc(as.yl||'')}</text>`;
    return FIG.wrap(o,W,H);
  },
  taart(delen){ // [{w,label}]
    const tot=delen.reduce((s,d)=>s+d.w,0); let a=-Math.PI/2,o='';
    delen.forEach((d,i)=>{ const b=a+2*Math.PI*d.w/tot, gr=b-a>Math.PI?1:0, x1=130+100*Math.cos(a),y1=120+100*Math.sin(a),x2=130+100*Math.cos(b),y2=120+100*Math.sin(b);
      o+=`<path d="M130 120 L${x1} ${y1} A100 100 0 ${gr} 1 ${x2} ${y2} Z" class="vlak t${i%5}"/>`; const m=(a+b)/2; o+=FIG.t(130+64*Math.cos(m),120+64*Math.sin(m)+5,d.kort||'',{c:'op',fs:14}); a=b });
    o+=delen.map((d,i)=>`<rect x="260" y="${30+i*28}" width="16" height="16" class="vlak t${i%5}"/>`+FIG.t(284,43+i*28,d.label,{a:'start',fs:15})).join('');
    return FIG.wrap(o,480,240);
  },
  // schaallijn: lijnstuk met label
  // dubbele getallenlijn: twee grootheden boven elkaar, kolommen = [[waarde boven, waarde onder], ...]
  dubbel(kop,kol){
    const W=600,x0=120,x1=575; kol=kol.filter((c,i)=>kol.findIndex(d=>d[0]===c[0])===i);
    const max=Math.max(...kol.map(c=>Math.abs(Number(c[0]))||0))||1; const X=v=>x0+(Number(v)/max)*(x1-x0);
    const lab=v=>v===null?'?':typeof v==='number'?nl(v):String(v);
    let o=`<line x1="${x0}" y1="44" x2="${x1}" y2="44" class="ax"/><line x1="${x0}" y1="96" x2="${x1}" y2="96" class="ax"/>`+FIG.t(8,49,kop[0],{a:'start',c:'zacht',fs:14})+FIG.t(8,101,kop[1],{a:'start',c:'zacht',fs:14});
    o+=`<line x1="${x0}" y1="38" x2="${x0}" y2="102" class="lijn"/>`+FIG.t(x0,30,'0',{fs:14})+FIG.t(x0,122,'0',{fs:14});
    kol.forEach((c,i)=>{ const x=X(c[0]); o+=`<line x1="${x}" y1="38" x2="${x}" y2="102" class="${i===kol.length-1?'dik':'lijn'}"/>`+FIG.t(x,30,lab(c[0]),{fs:15})+FIG.t(x,122,lab(c[1]),{fs:15}) });
    return FIG.wrap(o,W,134);
  },
  meetlat(cm,label){
    const w=Math.min(500,cm*40); let o=`<line x1="20" y1="30" x2="${20+w}" y2="30" class="dik"/>`;
    for(let i=0;i<=cm;i++) o+=`<line x1="${20+i*w/cm}" y1="22" x2="${20+i*w/cm}" y2="38" class="lijn"/>`;
    return FIG.wrap(o+FIG.t(20+w/2,62,label),Math.max(260,w+40),74);
  }
};
// verhoudingstabel als html-tabel; cellen met null worden een invulvak (data-i volgnummer)
function vtabelHtml(kop,rijen,invul=false){
  let i=0;
  const cel=v=>v===null?(invul?`<td><input type="text" inputmode="decimal" class="tvak" data-i="${i++}" autocomplete="off"></td>`:'<td class="leeg">…</td>'):`<td>${typeof v==='number'?nl(v):esc(v)}</td>`;
  return `<table class="vtab"><tbody>${kop.map((k,r)=>`<tr><th>${esc(k)}</th>${rijen.map(c=>cel(c[r])).join('')}</tr>`).join('')}</tbody></table>`;
}
