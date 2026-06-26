var triangleAxis=null, triangleT=0;

// ── Geometry (equilateral, viewBox 0 0 320 310) ──
function triangleGeom(){
  var A={x:160,y:40}, B={x:40,y:248}, C={x:280,y:248};
  var G={x:160,y:(40+248+248)/3};
  return {A:A,B:B,C:C,G:G,
    midBC:{x:160,y:248}, midCA:{x:220,y:144}, midAB:{x:100,y:144}};
}

// axis 0 -> toward midBC (favors Speed+Cost, sacrifices Quality)
// axis 1 -> toward midCA (favors Quality+Cost, sacrifices Speed)
// axis 2 -> toward midAB (favors Quality+Speed, sacrifices Cost)
var TRI_AX={
  0:{fav:['s','c'], sac:'q', edge:'bc'},
  1:{fav:['q','c'], sac:'s', edge:'ca'},
  2:{fav:['q','s'], sac:'c', edge:'ab'}
};

function triLerp(a,b,t){
  return 'rgb('+Math.round(a[0]+(b[0]-a[0])*t)+','+Math.round(a[1]+(b[1]-a[1])*t)+','+Math.round(a[2]+(b[2]-a[2])*t)+')';
}
var TRI_NARDO=[154,160,166], TRI_GOLD=[251,191,36], TRI_DIM=[58,66,84];
var TRI_ACCENT={q:[45,212,191], s:[167,139,250], c:[251,191,36]};

function triangleScores(){
  var t=triangleT, c=33;
  var q=c, s=c, co=c;
  if(triangleAxis!==null){
    var ax=TRI_AX[triangleAxis];
    function val(k){ return ax.sac===k ? Math.round(c-23*t) : (ax.fav.indexOf(k)>=0 ? Math.round(c+57*t) : c); }
    q=val('q'); s=val('s'); co=val('c');
  }
  return {q:q,s:s,c:co};
}

function triBarColor(v){ return v>70?'#34d399':(v>=30?'#fbbf24':'#fb6868'); }

function triangleVerdict(isFR){
  var displ=isFR?{q:'Qualité',s:'Vitesse',c:'Budget'}:{q:'Quality',s:'Speed',c:'Budget'};
  var sacN=isFR?{q:'la qualité',s:'la vitesse',c:'le budget'}:{q:'quality',s:'speed',c:'budget'};
  var justif=isFR?{
    0:'Livraison rapide et budget maîtrisé, mais la finition en pâtit.',
    1:'Du beau travail sans exploser le budget, mais il faudra patienter.',
    2:'Du beau travail livré vite, mais ça se paie.'
  }:{
    0:'Fast delivery on a tight budget, but the finish suffers.',
    1:'Quality work without blowing the budget, but it takes time.',
    2:'Beautiful work delivered fast, but it comes at a price.'
  };
  if(triangleAxis===null||triangleT<0.06){
    return {head:isFR?'Équilibre parfait':'Perfect balance', sac:'',
      just:isFR?'Aucun compromis tranché : les trois critères restent à parité.':'No sharp compromise: all three criteria stay on par.'};
  }
  var ax=TRI_AX[triangleAxis];
  return {
    head:displ[ax.fav[0]]+' + '+displ[ax.fav[1]],
    sac:(isFR?'Sacrifice : ':'Trade-off: ')+sacN[ax.sac],
    just:justif[triangleAxis]
  };
}

function triangleHandlePos(){
  var g=triangleGeom();
  if(triangleAxis===null) return g.G;
  var mid=triangleAxis===0?g.midBC:triangleAxis===1?g.midCA:g.midAB;
  return {x:g.G.x+(mid.x-g.G.x)*triangleT, y:g.G.y+(mid.y-g.G.y)*triangleT};
}

function triangleRedraw(){
  var g=triangleGeom(), sc=triangleScores(), t=triangleT, ax=triangleAxis!==null?TRI_AX[triangleAxis]:null;
  var handle=el('tri-handle'); if(handle){var p=triangleHandlePos();handle.setAttribute('cx',p.x);handle.setAttribute('cy',p.y);}
  var ring=el('tri-handle-ring'); if(ring){var p2=triangleHandlePos();ring.setAttribute('cx',p2.x);ring.setAttribute('cy',p2.y);}
  // edges
  ['ab','bc','ca'].forEach(function(e){
    var line=el('tri-edge-'+e); if(!line) return;
    var col, w=2;
    if(!ax){ col=triLerp(TRI_NARDO,TRI_NARDO,0); }
    else if(ax.edge===e){ col=triLerp(TRI_NARDO,TRI_GOLD,t); w=2+2.4*t; line.setAttribute('filter','url(#triGlow)'); }
    else { col=triLerp(TRI_NARDO,TRI_DIM,t); line.removeAttribute('filter'); }
    if(!ax||ax.edge!==e) line.removeAttribute('filter');
    line.setAttribute('stroke',col); line.setAttribute('stroke-width',w);
  });
  // vertices + words
  [['q',g.A],['s',g.B],['c',g.C]].forEach(function(pair){
    var k=pair[0], dot=el('tri-vx-'+k), word=el('tri-word-'+k), sub=el('tri-sub-'+k);
    var col, wcol;
    if(!ax){ col=triLerp(TRI_ACCENT[k],TRI_ACCENT[k],0); wcol='rgba(255,255,255,0.92)'; }
    else if(ax.fav.indexOf(k)>=0){ col=triLerp(TRI_ACCENT[k],TRI_GOLD,t); wcol=triLerp([255,255,255],TRI_GOLD,t); }
    else { col=triLerp(TRI_ACCENT[k],TRI_DIM,t); wcol=triLerp([255,255,255],[120,128,145],t); }
    if(dot){ dot.setAttribute('fill',col); }
    if(word) word.setAttribute('fill',wcol);
    if(sub) sub.setAttribute('fill', !ax?'rgba(255,255,255,0.4)':(ax.fav.indexOf(k)>=0?triLerp([180,184,196],TRI_GOLD,t):'rgba(255,255,255,0.3)'));
  });
  // bars
  ['q','s','c'].forEach(function(k){
    var bar=el('tri-bar-'+k), val=el('tri-val-'+k), col=triBarColor(sc[k]);
    if(bar){ bar.style.width=sc[k]+'%'; bar.style.background=col; bar.style.boxShadow='0 0 10px '+col+'88'; }
    if(val){ val.textContent=sc[k]+'%'; val.style.color=col; }
  });
  // verdict
  var v=triangleVerdict(lang==='fr');
  var vh=el('tri-vhead'), vs=el('tri-vsac'), vj=el('tri-vjust');
  if(vh) vh.textContent=v.head;
  if(vs){ vs.textContent=v.sac; vs.style.display=v.sac?'block':'none'; }
  if(vj) vj.textContent=v.just;
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
  var axes=[{i:0,mx:g.midBC.x-g.G.x,my:g.midBC.y-g.G.y},{i:1,mx:g.midCA.x-g.G.x,my:g.midCA.y-g.G.y},{i:2,mx:g.midAB.x-g.G.x,my:g.midAB.y-g.G.y}];
  var best=axes[0],bestCos=-Infinity, plen=Math.sqrt(dx*dx+dy*dy)||1;
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
  function move(e){ if(!dragging) return; var pt=e.touches?e.touches[0]:e; triangleOnDrag(svg,pt.clientX,pt.clientY); if(e.cancelable)e.preventDefault(); }
  function start(e){ dragging=true; svg.classList.add('tri-grabbing'); var pt=e.touches?e.touches[0]:e; triangleOnDrag(svg,pt.clientX,pt.clientY); }
  function stop(){ dragging=false; svg.classList.remove('tri-grabbing'); }
  handle.addEventListener('mousedown',start); handle.addEventListener('touchstart',start,{passive:false});
  svg.addEventListener('mousedown',start); svg.addEventListener('touchstart',start,{passive:false});
  window.addEventListener('mousemove',move); window.addEventListener('touchmove',move,{passive:false});
  window.addEventListener('mouseup',stop); window.addEventListener('touchend',stop);
}

function renderTriangleView(){
  var isFR=lang==='fr';
  var c=el('triangle-content'); if(!c) return;
  var L=isFR?{
    title:'Le Triangle d\'Or', sub:'Glissez le curseur vers un sommet : il se cale sur l\'axe le plus proche.',
    A:'Bien', Asub:'QUALITÉ', B:'Rapide', Bsub:'DÉLAI', Cc:'Pas cher', Csub:'BUDGET',
    panel:'ANALYSE DE SÉLECTION', bq:'Bien', bs:'Rapide', bc:'Pas cher'
  }:{
    title:'The Golden Triangle', sub:'Drag the cursor toward a vertex: it snaps to the nearest axis.',
    A:'Good', Asub:'QUALITY', B:'Fast', Bsub:'TIME', Cc:'Cheap', Csub:'BUDGET',
    panel:'SELECTION ANALYSIS', bq:'Good', bs:'Fast', bc:'Cheap'
  };
  var g=triangleGeom();
  var html='';
  html+="<style>"+
    ".tri-root{font-family:'Space Grotesk',sans-serif;height:100%;display:flex;gap:18px;padding:clamp(14px,2.4vw,28px);box-sizing:border-box;align-items:stretch;}"+
    ".tri-card{background:linear-gradient(160deg,rgba(30,24,46,0.55),rgba(13,10,26,0.65));backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.10);border-radius:var(--radius-lg);box-shadow:var(--shadow-md),inset 0 1px 0 rgba(255,255,255,0.06);display:flex;flex-direction:column;min-height:0;overflow:hidden;}"+
    ".tri-stage{flex:1.25;padding:clamp(16px,2vw,26px);}"+
    ".tri-panel{flex:1;padding:clamp(16px,2vw,26px);justify-content:center;}"+
    ".tri-h2{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(20px,2.4vw,28px);color:#fff;letter-spacing:-0.5px;margin-bottom:4px;}"+
    ".tri-sub{font-size:12.5px;color:rgba(255,255,255,0.55);margin-bottom:6px;}"+
    ".tri-svg{flex:1;min-height:0;width:100%;display:block;touch-action:none;cursor:pointer;animation:triFloat 5s ease-in-out infinite;}"+
    ".tri-svg.tri-grabbing{animation:none;}"+
    "@keyframes triFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}"+
    ".tri-mono{font-family:'Space Mono',monospace;}"+
    ".tri-hint{font-size:11px;color:rgba(255,255,255,0.4);text-align:center;margin-top:6px;}"+
    ".tri-plabel{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.5);margin-bottom:18px;}"+
    ".tri-bar-row{margin-bottom:16px;}"+
    ".tri-bar-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px;}"+
    ".tri-bar-name{font-size:13.5px;color:rgba(255,255,255,0.82);}"+
    ".tri-bar-val{font-family:'Space Mono',monospace;font-size:14px;font-weight:700;}"+
    ".tri-bar-track{height:8px;border-radius:6px;background:rgba(255,255,255,0.07);overflow:hidden;}"+
    ".tri-bar-fill{height:100%;border-radius:6px;transition:width .18s cubic-bezier(.4,0,.2,1),background .18s,box-shadow .18s;}"+
    ".tri-verdict{margin-top:20px;padding:16px 18px;border-radius:var(--radius);background:rgba(255,255,255,0.04);border-left:3px solid #fbbf24;}"+
    ".tri-vhead{font-family:'Fraunces',serif;font-weight:600;font-size:18px;color:#fff;margin-bottom:4px;}"+
    ".tri-vsac{font-family:'Space Mono',monospace;font-size:12px;color:#fbbf24;letter-spacing:0.5px;margin-bottom:8px;}"+
    ".tri-vjust{font-size:13px;color:rgba(255,255,255,0.62);line-height:1.55;}"+
    "@media(max-width:760px){.tri-root{flex-direction:column;gap:12px;padding:12px;}.tri-stage{flex:1.4;}.tri-panel{flex:1;}.tri-verdict{margin-top:12px;padding:12px 14px;}}"+
  "</style>";
  html+="<div class='tri-root'>";
  // ── stage ──
  html+="<div class='tri-card tri-stage'>";
  html+="<div class='tri-h2'>"+L.title+"</div><div class='tri-sub'>"+L.sub+"</div>";
  html+="<svg id='tri-svg' class='tri-svg' viewBox='0 0 320 305' preserveAspectRatio='xMidYMid meet'>";
  html+="<defs>"+
    "<radialGradient id='triFill' cx='50%' cy='58%' r='62%'>"+
      "<stop offset='0%' stop-color='rgba(0,160,157,0.16)'/><stop offset='70%' stop-color='rgba(113,75,103,0.10)'/><stop offset='100%' stop-color='rgba(0,0,0,0)'/>"+
    "</radialGradient>"+
    "<radialGradient id='triHandle' cx='38%' cy='32%' r='75%'>"+
      "<stop offset='0%' stop-color='#ffffff'/><stop offset='55%' stop-color='#f3eef1'/><stop offset='100%' stop-color='#d9c7d2'/>"+
    "</radialGradient>"+
    "<filter id='triGlow' x='-60%' y='-60%' width='220%' height='220%'><feGaussianBlur stdDeviation='3.2' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>"+
    "<filter id='triHandleGlow' x='-120%' y='-120%' width='340%' height='340%'><feGaussianBlur stdDeviation='4' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>"+
  "</defs>";
  // fill
  html+="<polygon points='"+g.A.x+","+g.A.y+" "+g.B.x+","+g.B.y+" "+g.C.x+","+g.C.y+"' fill='url(#triFill)'/>";
  // axes (center -> mids)
  ['midBC','midCA','midAB'].forEach(function(m){
    html+="<line x1='"+g.G.x+"' y1='"+g.G.y+"' x2='"+g[m].x+"' y2='"+g[m].y+"' stroke='rgba(255,255,255,0.10)' stroke-width='1' stroke-dasharray='3 4'/>";
  });
  // edges
  html+="<line id='tri-edge-ab' x1='"+g.A.x+"' y1='"+g.A.y+"' x2='"+g.B.x+"' y2='"+g.B.y+"' stroke='rgb(154,160,166)' stroke-width='2' stroke-linecap='round'/>";
  html+="<line id='tri-edge-bc' x1='"+g.B.x+"' y1='"+g.B.y+"' x2='"+g.C.x+"' y2='"+g.C.y+"' stroke='rgb(154,160,166)' stroke-width='2' stroke-linecap='round'/>";
  html+="<line id='tri-edge-ca' x1='"+g.C.x+"' y1='"+g.C.y+"' x2='"+g.A.x+"' y2='"+g.A.y+"' stroke='rgb(154,160,166)' stroke-width='2' stroke-linecap='round'/>";
  // vertices + labels
  html+="<circle id='tri-vx-q' cx='"+g.A.x+"' cy='"+g.A.y+"' r='5.5' fill='rgb(45,212,191)'/>";
  html+="<text id='tri-word-q' x='"+g.A.x+"' y='25' text-anchor='middle' font-family='Fraunces,serif' font-weight='600' font-size='17' fill='rgba(255,255,255,0.92)'>"+L.A+"</text>";
  html+="<text id='tri-sub-q' x='"+g.A.x+"' y='37' text-anchor='middle' class='tri-mono' font-size='9' letter-spacing='1.5' fill='rgba(255,255,255,0.4)'>"+L.Asub+"</text>";
  html+="<circle id='tri-vx-s' cx='"+g.B.x+"' cy='"+g.B.y+"' r='5.5' fill='rgb(167,139,250)'/>";
  html+="<text id='tri-word-s' x='"+g.B.x+"' y='276' text-anchor='middle' font-family='Fraunces,serif' font-weight='600' font-size='17' fill='rgba(255,255,255,0.92)'>"+L.B+"</text>";
  html+="<text id='tri-sub-s' x='"+g.B.x+"' y='289' text-anchor='middle' class='tri-mono' font-size='9' letter-spacing='1.5' fill='rgba(255,255,255,0.4)'>"+L.Bsub+"</text>";
  html+="<circle id='tri-vx-c' cx='"+g.C.x+"' cy='"+g.C.y+"' r='5.5' fill='rgb(251,191,36)'/>";
  html+="<text id='tri-word-c' x='"+g.C.x+"' y='276' text-anchor='middle' font-family='Fraunces,serif' font-weight='600' font-size='17' fill='rgba(255,255,255,0.92)'>"+L.Cc+"</text>";
  html+="<text id='tri-sub-c' x='"+g.C.x+"' y='289' text-anchor='middle' class='tri-mono' font-size='9' letter-spacing='1.5' fill='rgba(255,255,255,0.4)'>"+L.Csub+"</text>";
  // handle
  html+="<circle id='tri-handle-ring' cx='"+g.G.x+"' cy='"+g.G.y+"' r='16' fill='none' stroke='rgba(251,191,36,0.35)' stroke-width='1.5'><animate attributeName='r' values='13;19;13' dur='2.6s' repeatCount='indefinite'/><animate attributeName='opacity' values='0.5;0;0.5' dur='2.6s' repeatCount='indefinite'/></circle>";
  html+="<circle id='tri-handle' cx='"+g.G.x+"' cy='"+g.G.y+"' r='10' fill='url(#triHandle)' stroke='#714B67' stroke-width='2.5' filter='url(#triHandleGlow)' style='cursor:grab;'/>";
  html+="</svg>";
  html+="<div class='tri-hint'>"+(isFR?'Le curseur glisse uniquement le long de l\'axe le plus proche.':'The cursor slides only along the nearest axis.')+"</div>";
  html+="</div>";
  // ── panel ──
  html+="<div class='tri-card tri-panel'>";
  html+="<div class='tri-plabel'>"+L.panel+"</div>";
  [['q',L.bq],['s',L.bs],['c',L.bc]].forEach(function(p){
    html+="<div class='tri-bar-row'>";
    html+="<div class='tri-bar-top'><span class='tri-bar-name'>"+p[1]+"</span><span class='tri-bar-val' id='tri-val-"+p[0]+"'>33%</span></div>";
    html+="<div class='tri-bar-track'><div class='tri-bar-fill' id='tri-bar-"+p[0]+"' style='width:33%;'></div></div>";
    html+="</div>";
  });
  html+="<div class='tri-verdict'><div class='tri-vhead' id='tri-vhead'></div><div class='tri-vsac' id='tri-vsac'></div><div class='tri-vjust' id='tri-vjust'></div></div>";
  html+="</div>";
  html+="</div>";
  c.innerHTML=html;
  triangleAxis=null; triangleT=0;
  triangleWire();
  triangleRedraw();
}
