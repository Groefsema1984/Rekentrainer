// ===== Voortgangsgrafieken in Got It-indeling (Vellesan-kleuren): ringen, donuts en het onderdelenwiel =====
function boog(cx,cy,r,a0,a1){ // a in graden, 0 = boven, met de klok mee
  const p=a=>[cx+r*Math.sin(a*Math.PI/180), cy-r*Math.cos(a*Math.PI/180)];
  const [x0,y0]=p(a0),[x1,y1]=p(a1); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a1-a0>180?1:0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}
// concentrische ringen (totaaloverzicht): vals [{b,k,label}]
function ringenSvg(vals,midden){
  const S0=230,c=S0/2; let o='';
  vals.forEach((v,i)=>{ const r=c-14-i*19;
    o+=`<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--ring)" stroke-width="13"/>`;
    if(v.b>0) o+=`<path d="${boog(c,c,r,0,Math.min(359.9,3.6*v.b))}" fill="none" stroke="${v.k}" stroke-width="13" stroke-linecap="round"/>`;
  });
  o+=`<text x="${c}" y="${c+4}" text-anchor="middle" class="ringgetal">${esc(midden)}</text>`;
  return `<svg class="ringen" viewBox="0 0 ${S0} ${S0}" role="img" aria-label="Totaaloverzicht">${o}</svg>`;
}
function donutSvg(b,k,klein=false){
  const S0=klein?90:130,c=S0/2,r=c-12,sw=klein?11:15;
  return `<svg class="donut" viewBox="0 0 ${S0} ${S0}" role="img" aria-label="${b}%"><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--ring)" stroke-width="${sw}"/>${b>0?`<path d="${boog(c,c,r,0,Math.min(359.9,3.6*b))}" fill="none" stroke="${k}" stroke-width="${sw}" stroke-linecap="round"/>`:''}<text x="${c}" y="${c+(klein?6:8)}" text-anchor="middle" class="donutgetal" style="font-size:${klein?19:26}px">${b}%</text></svg>`;
}
// onderdelenwiel: taartpunten = onderdelen, ringen = niveau 1 (binnen) t/m 8 (buiten)
function wielSvg(dom,huidig){
  const subs=SUBDOMEINEN[dom]; const k=DOM[dom].k; const m=subs.length; const W=520,c=W/2, r0=52, dr=19, gap=3;
  let o='';
  subs.forEach((s,i)=>{
    const a0=i*360/m+gap/2, a1=(i+1)*360/m-gap/2;
    for(let n=1;n<=8;n++){
      const ri=r0+(n-1)*dr, ro=ri+dr-2; const b=subB(n,dom,s.id);
      const p=a=>[c+Math.sin(a*Math.PI/180),-Math.cos(a*Math.PI/180)];
      const [sx,sy]=p(a0),[ex,ey]=p(a1); const gr=a1-a0>180?1:0;
      const d=`M${(c+ (sx-c)*ri).toFixed(1)} ${(c+sy*ri).toFixed(1)} A${ri} ${ri} 0 ${gr} 1 ${(c+(ex-c)*ri).toFixed(1)} ${(c+ey*ri).toFixed(1)} L${(c+(ex-c)*ro).toFixed(1)} ${(c+ey*ro).toFixed(1)} A${ro} ${ro} 0 ${gr} 0 ${(c+(sx-c)*ro).toFixed(1)} ${(c+sy*ro).toFixed(1)} Z`;
      const op = b===null?0: b>=DREMPEL?1: b>=50?.62: b>0?.32:.1;
      const fill = b===null?'var(--ring-leeg)':k;
      o+=`<path d="${d}" fill="${fill}" fill-opacity="${b===null?1:Math.max(op,.1)}" stroke="${n===huidig?'var(--ink)':'none'}" stroke-width="${n===huidig?1.5:0}" class="wielcel" data-sub="${s.id}" data-n="${n}" onclick="go('domein',{dom:'${dom}',niv:${n},sub:'${s.id}'})"><title>${esc(s.naam)} · Niveau ${n}${b===null?' (geen opgaven)':': '+b+'%'}</title></path>`;
    }
    const am=(a0+a1)/2, rl=r0+8*dr+18, lx=c+rl*Math.sin(am*Math.PI/180), ly=c-rl*Math.cos(am*Math.PI/180);
    const anchor=Math.abs(lx-c)<20?'middle':lx>c?'start':'end';
    o+=`<text x="${lx.toFixed(1)}" y="${(ly+5).toFixed(1)}" text-anchor="${anchor}" class="wiellabel">${esc(s.naam)}</text>`;
  });
  o+=`<circle cx="${c}" cy="${c}" r="${r0-6}" fill="var(--kaart)" stroke="var(--lijn)"/><text x="${c}" y="${c-4}" text-anchor="middle" class="wielmidden">Niveau</text><text x="${c}" y="${c+22}" text-anchor="middle" class="wielmidden groot">${huidig||'–'}</text>`;
  return `<svg class="wiel" viewBox="-130 -10 ${W+260} ${W+20}" role="img" aria-label="Voortgang per onderdeel en niveau">${o}</svg>`;
}
