var triangleAxis=null, triangleT=0;

function triangleGeom(){
  return {A:{x:160,y:40},B:{x:40,y:247.85},C:{x:280,y:247.85},G:{x:160,y:178.57},
    midBC:{x:160,y:247.85},midAC:{x:220,y:143.93},midAB:{x:100,y:143.93}};
}

function triangleScores(){
  var t=triangleT, base=33.33;
  var q=base, s=base, c=base;
  if(triangleAxis===0){ q=base*(1-t); s=base+(base/2)*t; c=base+(base/2)*t; }
  else if(triangleAxis===1){ s=base*(1-t); q=base+(base/2)*t; c=base+(base/2)*t; }
  else if(triangleAxis===2){ c=base*(1-t); q=base+(base/2)*t; s=base+(base/2)*t; }
  return {q:Math.round(q),s:Math.round(s),c:Math.round(c)};
}

function triangleVerdict(sc,isFR){
  var labels=isFR?{q:'la qualité',s:'la rapidité',c:'le coût maîtrisé'}:{q:'quality',s:'speed',c:'cost control'};
  var vals=[{k:'q',v:sc.q},{k:'s',v:sc.s},{k:'c',v:sc.c}];
  var min=vals.reduce(function(a,b){return b.v<a.v?b:a;});
  if(Math.abs(sc.q-33)<=2&&Math.abs(sc.s-33)<=2&&Math.abs(sc.c-33)<=2){
    return isFR?"Configuration équilibrée : vous ne sacrifiez aucun des trois axes, mais vous ne maximisez aucun d'entre eux non plus.":"Balanced configuration: you are not sacrificing any of the three axes, but you are not maximizing any of them either.";
  }
  var others=vals.filter(function(v){return v.k!==min.k;});
  var sevenness=min.v<=10?(isFR?'totalement':'almost entirely'):(isFR?'fortement':'heavily');
  return isFR?
    ("Vous sacrifiez "+sevenness+" "+labels[min.k]+" pour privilégier "+labels[others[0].k]+" et "+labels[others[1].k]+"."):
    ("You are sacrificing "+sevenness+" "+labels[min.k]+" to favor "+labels[others[0].k]+" and "+labels[others[1].k]+".");
}

function triangleHandlePos(){
  var g=triangleGeom();
  if(triangleAxis===null) return g.G;
  var mid=triangleAxis===0?g.midBC:triangleAxis===1?g.midAC:g.midAB;
  return {x:g.G.x+(mid.x-g.G.x)*triangleT, y:g.G.y+(mid.y-g.G.y)*triangleT};
}

function triangleRedraw(){
  var sc=triangleScores();
  var handle=el('tri-handle'); if(handle){var p=triangleHandlePos();handle.setAttribute('cx',p.x);handle.setAttribute('cy',p.y);}
  ['q','s','c'].forEach(function(k){
    var bar=el('tri-bar-'+k), val=el('tri-val-'+k);
    if(bar) bar.style.width=sc[k]+'%';
    if(val) val.textContent=sc[k]+'%';
  });
  var v=el('tri-verdict'); if(v) v.textContent=triangleVerdict(sc,lang==='fr');
}

function triangleSvgPoint(svg,clientX,clientY){
  var rect=svg.getBoundingClientRect();
  var vb=svg.viewBox.baseVal;
  return {x:(clientX-rect.left)/rect.width*vb.width+vb.x, y:(clientY-rect.top)/rect.height*vb.height+vb.y};
}

function triangleOnDrag(svg,clientX,clientY){
  var g=triangleGeom();
  var p=triangleSvgPoint(svg,clientX,clientY);
  var dx=p.x-g.G.x, dy=p.y-g.G.y;
  var axes=[{i:0,mx:g.midBC.x-g.G.x,my:g.midBC.y-g.G.y},{i:1,mx:g.midAC.x-g.G.x,my:g.midAC.y-g.G.y},{i:2,mx:g.midAB.x-g.G.x,my:g.midAB.y-g.G.y}];
  var best=null,bestCos=-Infinity;
  var plen=Math.sqrt(dx*dx+dy*dy)||1;
  axes.forEach(function(a){
    var alen=Math.sqrt(a.mx*a.mx+a.my*a.my);
    var cos=(dx*a.mx+dy*a.my)/(plen*alen);
    if(cos>bestCos){bestCos=cos;best=a;}
  });
  var alen=Math.sqrt(best.mx*best.mx+best.my*best.my);
  var proj=(dx*best.mx+dy*best.my)/alen;
  triangleAxis=best.i;
  triangleT=Math.max(0,Math.min(1,proj/alen));
  triangleRedraw();
}

function triangleWire(){
  var svg=el('tri-svg'), handle=el('tri-handle');
  if(!svg||!handle) return;
  var dragging=false;
  function move(e){ if(!dragging) return; var pt=e.touches?e.touches[0]:e; triangleOnDrag(svg,pt.clientX,pt.clientY); e.preventDefault&&e.preventDefault(); }
  function start(e){ dragging=true; var pt=e.touches?e.touches[0]:e; triangleOnDrag(svg,pt.clientX,pt.clientY); }
  function stop(){ dragging=false; }
  handle.addEventListener('mousedown',start); handle.addEventListener('touchstart',start,{passive:false});
  svg.addEventListener('mousedown',start); svg.addEventListener('touchstart',start,{passive:false});
  window.addEventListener('mousemove',move); window.addEventListener('touchmove',move,{passive:false});
  window.addEventListener('mouseup',stop); window.addEventListener('touchend',stop);
}

function renderTriangleView(){
  var isFR=lang==='fr';
  var c=el('triangle-content'); if(!c) return;
  var L=isFR?{title:'Le Triangle d\'Or',sub:'Faites glisser le point vers un sommet pour visualiser le compromis.',quality:'Qualité',speed:'Rapidité',cost:'Coût',hint:'Glissez la poignée centrale vers un sommet : l\'axe opposé chute, les deux autres progressent.'}
    :{title:'The Golden Triangle',sub:'Drag the point toward a vertex to visualize the trade-off.',quality:'Quality',speed:'Speed',cost:'Cost',hint:'Drag the central handle toward a vertex: the opposite axis falls, the other two rise.'};
  var g=triangleGeom();
  var html='';
  html+="<style>.tri-wrap{font-family:'Space Grotesk',sans-serif;} .tri-wrap h2{font-family:'Fraunces',serif;font-weight:600;} .tri-mono{font-family:'Space Mono',monospace;}</style>";
  html+="<div class='tri-wrap'>";
  html+="<div class='card' style='padding:22px 24px;margin-bottom:20px;'>";
  html+="<h2 style='font-size:24px;margin-bottom:6px;color:#fff;'>"+L.title+"</h2>";
  html+="<div style='font-size:13.5px;color:rgba(255,255,255,0.6);margin-bottom:20px;'>"+L.sub+"</div>";
  html+="<svg id='tri-svg' viewBox='0 0 320 290' style='width:100%;max-width:380px;display:block;margin:0 auto;touch-action:none;cursor:pointer;'>";
  html+="<line x1='"+g.G.x+"' y1='"+g.G.y+"' x2='"+g.midBC.x+"' y2='"+g.midBC.y+"' stroke='rgba(255,255,255,0.15)' stroke-width='1.5'/>";
  html+="<line x1='"+g.G.x+"' y1='"+g.G.y+"' x2='"+g.midAC.x+"' y2='"+g.midAC.y+"' stroke='rgba(255,255,255,0.15)' stroke-width='1.5'/>";
  html+="<line x1='"+g.G.x+"' y1='"+g.G.y+"' x2='"+g.midAB.x+"' y2='"+g.midAB.y+"' stroke='rgba(255,255,255,0.15)' stroke-width='1.5'/>";
  html+="<polygon points='"+g.A.x+","+g.A.y+" "+g.B.x+","+g.B.y+" "+g.C.x+","+g.C.y+"' fill='rgba(0,160,157,0.08)' stroke='rgba(255,255,255,0.3)' stroke-width='2'/>";
  html+="<circle cx='"+g.A.x+"' cy='"+g.A.y+"' r='5' fill='#00A09D'/><text x='"+g.A.x+"' y='"+(g.A.y-14)+"' text-anchor='middle' class='tri-mono' font-size='12' fill='#00A09D'>"+L.quality+"</text>";
  html+="<circle cx='"+g.B.x+"' cy='"+g.B.y+"' r='5' fill='#a78bfa'/><text x='"+g.B.x+"' y='"+(g.B.y+20)+"' text-anchor='middle' class='tri-mono' font-size='12' fill='#a78bfa'>"+L.speed+"</text>";
  html+="<circle cx='"+g.C.x+"' cy='"+g.C.y+"' r='5' fill='#fbbf24'/><text x='"+g.C.x+"' y='"+(g.C.y+20)+"' text-anchor='middle' class='tri-mono' font-size='12' fill='#fbbf24'>"+L.cost+"</text>";
  html+="<circle id='tri-handle' cx='"+g.G.x+"' cy='"+g.G.y+"' r='9' fill='#fff' stroke='#714B67' stroke-width='3' style='cursor:grab;'/>";
  html+="</svg>";
  html+="<div style='font-size:12px;color:rgba(255,255,255,0.45);text-align:center;margin-top:10px;'>"+L.hint+"</div>";
  html+="</div>";
  html+="<div class='card' style='padding:20px 24px;'>";
  [{k:'q',label:L.quality,col:'#00A09D'},{k:'s',label:L.speed,col:'#a78bfa'},{k:'c',label:L.cost,col:'#fbbf24'}].forEach(function(item){
    html+="<div style='margin-bottom:16px;'>";
    html+="<div style='display:flex;justify-content:space-between;font-size:13px;color:rgba(255,255,255,0.8);margin-bottom:6px;'><span>"+item.label+"</span><span id='tri-val-"+item.k+"' class='tri-mono' style='color:"+item.col+";font-weight:700;'>33%</span></div>";
    html+="<div style='background:rgba(255,255,255,0.08);border-radius:6px;height:9px;overflow:hidden;'><div id='tri-bar-"+item.k+"' style='background:"+item.col+";height:100%;width:33%;transition:width .15s ease;'></div></div>";
    html+="</div>";
  });
  html+="<div id='tri-verdict' style='font-size:13.5px;color:rgba(255,255,255,0.85);line-height:1.6;padding-top:8px;border-top:1px solid rgba(255,255,255,0.08);'></div>";
  html+="</div>";
  html+="</div>";
  c.innerHTML=html;
  triangleAxis=null; triangleT=0;
  triangleWire();
  triangleRedraw();
}
