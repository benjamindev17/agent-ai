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
    ".tri-root{font-family:'Space Grotesk',sans-serif;height:min(calc(100vh - var(--header-h) - 16px),740px);max-width:1140px;width:100%;margin:0 auto;display:flex;gap:18px;padding:clamp(14px,2.4vw,28px);box-sizing:border-box;align-items:stretch;}"+
    ".tri-card{position:relative;background:radial-gradient(120% 140% at 18% 0%,rgba(0,160,157,0.10),transparent 55%),linear-gradient(160deg,rgba(32,26,49,0.66),rgba(11,9,22,0.78));backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.09);border-radius:var(--radius-lg);box-shadow:0 18px 50px -12px rgba(0,0,0,0.55),inset 0 1px 0 rgba(255,255,255,0.07);display:flex;flex-direction:column;min-height:0;overflow:hidden;}"+
    ".tri-card::before{content:'';position:absolute;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(251,191,36,0.16),transparent 70%);top:-90px;right:-90px;pointer-events:none;}"+
    ".tri-stage{flex:1.2;max-width:600px;padding:clamp(16px,2vw,26px);}"+
    ".tri-panel{flex:1;max-width:380px;padding:clamp(16px,2vw,26px);justify-content:center;}"+
    ".tri-h2{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(19px,2.1vw,26px);color:#fff;letter-spacing:-0.5px;margin-bottom:4px;}"+
    ".tri-sub{font-size:12.5px;color:rgba(255,255,255,0.5);margin-bottom:2px;}"+
    ".tri-svg{flex:1;min-height:0;width:100%;max-height:100%;display:block;margin:0 auto;touch-action:none;cursor:pointer;animation:triFloat 5s ease-in-out infinite;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;}"+
    ".tri-svg text{user-select:none;-webkit-user-select:none;}"+
    ".tri-svg.tri-grabbing{animation:none;}"+
    "@keyframes triFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}"+
    ".tri-mono{font-family:'Space Mono',monospace;}"+
    ".tri-hint{font-size:11px;color:rgba(255,255,255,0.35);text-align:center;margin-top:4px;}"+
    ".tri-plabel{font-family:'Space Mono',monospace;font-size:11px;letter-spacing:2.5px;color:rgba(255,255,255,0.45);margin-bottom:20px;}"+
    ".tri-bar-row{margin-bottom:17px;}"+
    ".tri-bar-top{display:flex;align-items:center;gap:8px;margin-bottom:8px;}"+
    ".tri-bar-ico{font-size:13px;flex-shrink:0;}"+
    ".tri-bar-name{font-size:13.5px;color:rgba(255,255,255,0.82);flex:1;}"+
    ".tri-bar-val{font-family:'Space Mono',monospace;font-size:14px;font-weight:700;}"+
    ".tri-bar-track{height:8px;border-radius:999px;background:rgba(255,255,255,0.06);box-shadow:inset 0 1px 2px rgba(0,0,0,0.4);overflow:hidden;}"+
    ".tri-bar-fill{height:100%;border-radius:999px;transition:width .18s cubic-bezier(.4,0,.2,1),background .18s,box-shadow .18s;}"+
    ".tri-verdict{margin-top:22px;padding:16px 18px;border-radius:var(--radius);background:rgba(255,255,255,0.035);border:1px solid rgba(255,255,255,0.06);border-left:3px solid #fbbf24;}"+
    ".tri-vhead{font-family:'Fraunces',serif;font-weight:600;font-size:17.5px;color:#fff;margin-bottom:4px;}"+
    ".tri-vsac{font-family:'Space Mono',monospace;font-size:11.5px;color:#fbbf24;letter-spacing:0.5px;margin-bottom:8px;}"+
    ".tri-vjust{font-size:13px;color:rgba(255,255,255,0.58);line-height:1.55;}"+
    ".tri-stage-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:2px;}"+
    ".tri-present-btn{flex-shrink:0;display:inline-flex;align-items:center;gap:7px;font-family:'Space Grotesk',sans-serif;font-size:12.5px;font-weight:600;color:#fff;background:linear-gradient(135deg,var(--teal),var(--teal-dark));border:none;border-radius:var(--radius);padding:8px 14px;cursor:pointer;box-shadow:0 2px 10px rgba(0,160,157,0.35);transition:transform .12s,box-shadow .12s;}"+
    ".tri-present-btn:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,160,157,0.5);}"+
    ".tri-present-btn .tri-pico{font-size:14px;line-height:1;}"+
    // explanation section
    ".tri-explain{max-width:880px;margin:0 auto;padding:4px clamp(14px,2.4vw,28px) 56px;}"+
    ".tri-ex-card{background:linear-gradient(160deg,rgba(30,24,46,0.55),rgba(13,10,26,0.65));backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,0.10);border-radius:var(--radius-lg);box-shadow:var(--shadow-md);padding:clamp(18px,2.4vw,30px);}"+
    ".tri-ex-h{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(18px,2.2vw,24px);color:#fff;margin-bottom:6px;letter-spacing:-0.4px;}"+
    ".tri-ex-intro{font-size:13.5px;color:rgba(255,255,255,0.62);line-height:1.6;margin-bottom:18px;}"+
    ".tri-ex-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin-bottom:18px;}"+
    ".tri-ex-item{display:flex;gap:11px;align-items:flex-start;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:var(--radius);padding:13px 15px;}"+
    ".tri-ex-ico{font-size:18px;line-height:1.3;flex-shrink:0;}"+
    ".tri-ex-it-h{font-weight:600;font-size:13.5px;color:#fff;margin-bottom:3px;}"+
    ".tri-ex-it-t{font-size:12.5px;color:rgba(255,255,255,0.58);line-height:1.5;}"+
    ".tri-ex-tip{display:flex;gap:10px;align-items:center;font-size:12.5px;color:rgba(255,255,255,0.7);background:rgba(0,160,157,0.10);border:1px solid rgba(0,160,157,0.28);border-radius:var(--radius);padding:12px 15px;line-height:1.5;}"+
    // presentation overlay
    ".tri-overlay{position:fixed;inset:0;z-index:3000;background:radial-gradient(circle at 50% 38%,#171122,#08071a 72%);display:flex;align-items:center;justify-content:center;padding:clamp(16px,3vw,48px);box-sizing:border-box;}"+
    ".tri-ov-close{position:fixed;top:18px;right:20px;z-index:3010;width:46px;height:46px;border-radius:50%;border:1px solid rgba(255,255,255,0.18);background:rgba(255,255,255,0.08);color:#fff;font-size:19px;cursor:pointer;backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;transition:background .12s;}"+
    ".tri-ov-close:hover{background:rgba(255,255,255,0.16);}"+
    ".tri-presenting{flex:none !important;background:transparent !important;border:none !important;box-shadow:none !important;backdrop-filter:none !important;padding:0 !important;width:auto;height:90vh;max-width:96vw;align-items:center;justify-content:center;}"+
    ".tri-presenting .tri-stage-head,.tri-presenting .tri-hint{display:none !important;}"+
    ".tri-presenting::before{display:none !important;}"+
    ".tri-presenting .tri-svg{height:100%;width:auto;max-width:96vw;flex:none;}"+
    "@media(max-width:760px){.tri-root{flex-direction:column;gap:12px;padding:12px;}.tri-stage{flex:1.4;}.tri-panel{flex:1;}.tri-verdict{margin-top:12px;padding:12px 14px;}.tri-explain{padding:4px 12px 48px;}.tri-presenting{height:auto;width:96vw;}.tri-presenting .tri-svg{width:100%;height:auto;}}"+
  "</style>";
  html+="<div class='tri-root'>";
  // ── stage ──
  html+="<div class='tri-card tri-stage' id='tri-stage'>";
  html+="<div class='tri-stage-head'><div><div class='tri-h2'>"+L.title+"</div><div class='tri-sub'>"+L.sub+"</div></div>"+
        "<button class='tri-present-btn' onclick='triangleExpand()'><span class='tri-pico'>⤢</span>"+(isFR?'Présenter':'Present')+"</button></div>";
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
  var BICO={q:'🏆',s:'⚡',c:'💰'};
  [['q',L.bq],['s',L.bs],['c',L.bc]].forEach(function(p){
    html+="<div class='tri-bar-row'>";
    html+="<div class='tri-bar-top'><span class='tri-bar-ico'>"+BICO[p[0]]+"</span><span class='tri-bar-name'>"+p[1]+"</span><span class='tri-bar-val' id='tri-val-"+p[0]+"'>33%</span></div>";
    html+="<div class='tri-bar-track'><div class='tri-bar-fill' id='tri-bar-"+p[0]+"' style='width:33%;'></div></div>";
    html+="</div>";
  });
  html+="<div class='tri-verdict'><div class='tri-vhead' id='tri-vhead'></div><div class='tri-vsac' id='tri-vsac'></div><div class='tri-vjust' id='tri-vjust'></div></div>";
  html+="</div>";
  html+="</div>"; // /tri-root
  // ── explanation (use cases) ──
  var EX=isFR?{
    h:'Quand utiliser le Triangle d\'Or ?',
    intro:'Un support visuel pour cadrer les attentes : sur un projet, on ne peut optimiser que deux des trois critères à la fois. Choisir, c\'est renoncer au troisième.',
    items:[
      {i:'🧭',h:'Cadrer un devis',t:'Faites choisir au client ses deux priorités plutôt que de promettre qualité, délai et budget en même temps.'},
      {i:'⏱️',h:'Justifier un délai ou un coût',t:'Montrez concrètement le compromis derrière chaque demande : « plus vite et moins cher » a un prix sur la qualité.'},
      {i:'🤝',h:'Recentrer une négociation',t:'Quand un client veut « tout, vite et pas cher », le triangle rend l\'arbitrage évident et factuel.'},
      {i:'🎯',h:'Aligner les attentes',t:'Un langage commun, simple et visuel, pour décider ensemble des priorités d\'un projet.'}
    ],
    tip:'Astuce : cliquez sur « Présenter » pour afficher uniquement le triangle en plein écran et le manipuler devant le client, sans montrer ces notes internes.'
  }:{
    h:'When to use the Golden Triangle?',
    intro:'A visual aid to frame expectations: on any project you can only optimize two of the three criteria at once. Choosing means giving up the third.',
    items:[
      {i:'🧭',h:'Frame a quote',t:'Have the client pick their two priorities instead of promising quality, time and budget all at once.'},
      {i:'⏱️',h:'Justify a delay or a cost',t:'Show the concrete trade-off behind each request: "faster and cheaper" has a price on quality.'},
      {i:'🤝',h:'Refocus a negotiation',t:'When a client wants "all of it, fast and cheap", the triangle makes the trade-off obvious and factual.'},
      {i:'🎯',h:'Align expectations',t:'A simple, shared visual language to decide project priorities together.'}
    ],
    tip:'Tip: click "Present" to show only the triangle full-screen and manipulate it in front of the client, without these internal notes.'
  };
  html+="<div class='tri-explain'><div class='tri-ex-card'>";
  html+="<div class='tri-ex-h'>"+EX.h+"</div><div class='tri-ex-intro'>"+EX.intro+"</div>";
  html+="<div class='tri-ex-grid'>";
  EX.items.forEach(function(it){
    html+="<div class='tri-ex-item'><span class='tri-ex-ico'>"+it.i+"</span><div><div class='tri-ex-it-h'>"+it.h+"</div><div class='tri-ex-it-t'>"+it.t+"</div></div></div>";
  });
  html+="</div>";
  html+="<div class='tri-ex-tip'><span style='font-size:15px;'>💡</span><span>"+EX.tip+"</span></div>";
  html+="</div></div>";
  // remove any stale presentation overlay before re-rendering
  var staleOv=el('tri-overlay'); if(staleOv&&staleOv.parentNode) staleOv.parentNode.removeChild(staleOv);
  if(triangleEscHandler){ window.removeEventListener('keydown',triangleEscHandler); triangleEscHandler=null; }
  c.innerHTML=html;
  triangleAxis=null; triangleT=0;
  triangleWire();
  triangleRedraw();
}

var triangleEscHandler=null;
function triangleExpand(){
  var stage=el('tri-stage'); if(!stage||el('tri-overlay')) return;
  var ov=document.createElement('div'); ov.className='tri-overlay'; ov.id='tri-overlay';
  var close=document.createElement('button'); close.className='tri-ov-close'; close.setAttribute('aria-label','Fermer'); close.textContent='✕';
  close.onclick=triangleCollapse;
  document.body.appendChild(ov);
  ov.appendChild(close);
  // remember origin to restore later
  stage._homeParent=stage.parentNode; stage._homeNext=stage.nextSibling;
  stage.classList.add('tri-presenting');
  ov.appendChild(stage);
  triangleEscHandler=function(e){ if(e.key==='Escape') triangleCollapse(); };
  window.addEventListener('keydown',triangleEscHandler);
}
function triangleCollapse(){
  var stage=el('tri-stage'), ov=el('tri-overlay');
  if(stage){
    stage.classList.remove('tri-presenting');
    if(stage._homeParent) stage._homeParent.insertBefore(stage, stage._homeNext||null);
  }
  if(ov&&ov.parentNode) ov.parentNode.removeChild(ov);
  if(triangleEscHandler){ window.removeEventListener('keydown',triangleEscHandler); triangleEscHandler=null; }
  triangleRedraw();
}
