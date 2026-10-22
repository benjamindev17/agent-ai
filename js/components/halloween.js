// ── HALLOWEEN DECORATIONS 🎃 ──
// Décor saisonnier non intrusif : couche de fond (derrière les cartes givrées)
// + toiles d'araignées en coins (au-dessus, mais pointer-events:none).
// Palette conservée (mauve Odoo / teal) + touches orange discrètes.
(function(){
  if(window.__hwInit) return; window.__hwInit = true;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Spider web (quart, ancré au coin haut-gauche) — généré pour éviter les fautes ----
  function webSVG(){
    var radii = [26,50,76,102], lines = '';
    // points le long d'un rayon à la distance r (du coin vers l'intérieur)
    var dirs = [ [1,0],[0.92,0.38],[0.71,0.71],[0.38,0.92],[0,1] ];
    // rayons
    dirs.forEach(function(d){ lines += 'M0 0 L'+(d[0]*110).toFixed(1)+' '+(d[1]*110).toFixed(1)+' '; });
    // anneaux (polylignes reliant les rayons)
    radii.forEach(function(r){
      var seg = '';
      dirs.forEach(function(d,i){ seg += (i===0?'M':'L')+(d[0]*r).toFixed(1)+' '+(d[1]*r).toFixed(1)+' '; });
      lines += seg;
    });
    return '<svg viewBox="0 0 110 110" width="100%" height="100%" aria-hidden="true">'
      +'<path d="'+lines+'" fill="none" stroke="rgba(226,232,240,0.45)" stroke-width="0.8" stroke-linejoin="round"/>'
      +'</svg>';
  }

  // ---- Araignée suspendue ----
  function spiderSVG(){
    var legs='';
    for(var i=0;i<4;i++){
      var y=-3+i*2.2;
      legs+='<path d="M-3 '+y+' C-9 '+(y-3)+' -12 '+(y+1)+' -15 '+(y-2)+'" stroke="#1d1630" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
      legs+='<path d="M3 '+y+' C9 '+(y-3)+' 12 '+(y+1)+' 15 '+(y-2)+'" stroke="#1d1630" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
    }
    return '<svg viewBox="-20 -16 40 34" width="34" height="30" aria-hidden="true">'
      +legs
      +'<ellipse cx="0" cy="2" rx="5" ry="6.2" fill="#1d1630"/>'
      +'<circle cx="0" cy="-4" r="3.4" fill="#241a38"/>'
      +'<circle cx="-1.2" cy="-4.4" r="0.9" fill="#d9772e"/><circle cx="1.2" cy="-4.4" r="0.9" fill="#d9772e"/>'
      +'</svg>';
  }

  // ---- Chauve-souris ----
  function batSVG(){
    return '<svg viewBox="-32 -18 64 34" width="100%" height="100%" aria-hidden="true"><g fill="#241a38">'
      +'<path d="M0 -8 C-3 -14 -7 -14 -9 -9 C-12 -15 -19 -15 -22 -8 C-25 -13 -30 -11 -30 -5 C-27 -6 -24 -3 -24 1 C-27 0 -30 3 -29 7 C-26 3 -20 3 -18 8 C-16 2 -10 2 -9 8 C-7 2 -2 1 0 -4 Z"/>'
      +'<path d="M0 -8 C3 -14 7 -14 9 -9 C12 -15 19 -15 22 -8 C25 -13 30 -11 30 -5 C27 -6 24 -3 24 1 C27 0 30 3 29 7 C26 3 20 3 18 8 C16 2 10 2 9 8 C7 2 2 1 0 -4 Z"/>'
      +'<path d="M-2 -10 L-3 -15 L0 -12 L3 -15 L2 -10 Z"/>'
      +'<ellipse cx="0" cy="-4" rx="3" ry="6"/>'
      +'</g></svg>';
  }

  // ---- Fantôme ----
  function ghostSVG(){
    return '<svg viewBox="-26 -30 52 60" width="100%" height="100%" aria-hidden="true">'
      +'<path d="M0 -26 C-14 -26 -22 -14 -22 1 L-22 24 Q-16 17 -11 24 Q-5.5 17 0 24 Q5.5 17 11 24 Q16 17 22 24 L22 1 C22 -14 14 -26 0 -26 Z" fill="rgba(240,240,250,0.8)"/>'
      +'<ellipse cx="-7" cy="-6" rx="2.6" ry="3.6" fill="#241a38"/><ellipse cx="7" cy="-6" rx="2.6" ry="3.6" fill="#241a38"/>'
      +'<ellipse cx="0" cy="3" rx="2.2" ry="3" fill="rgba(36,26,56,0.65)"/>'
      +'</svg>';
  }

  // ---- Cercueil ----
  function coffinSVG(){
    return '<svg viewBox="-28 -40 56 84" width="100%" height="100%" aria-hidden="true">'
      +'<path d="M-13 -36 L13 -36 L22 -16 L15 40 L-15 40 L-22 -16 Z" fill="#2c2238" stroke="rgba(226,232,240,0.22)" stroke-width="1"/>'
      +'<path d="M-9 -30 L9 -30 L16 -15 L10 34 L-10 34 L-16 -15 Z" fill="none" stroke="rgba(226,232,240,0.12)" stroke-width="1"/>'
      +'<rect x="-2.2" y="-18" width="4.4" height="20" rx="1" fill="rgba(217,119,46,0.55)"/>'
      +'<rect x="-8" y="-11" width="16" height="4.4" rx="1" fill="rgba(217,119,46,0.55)"/>'
      +'</svg>';
  }

  // ---- Frankenstein (vert désaturé proche du teal de marque) ----
  function frankSVG(){
    return '<svg viewBox="-26 -30 52 66" width="100%" height="100%" aria-hidden="true">'
      // boulons
      +'<rect x="-30" y="2" width="8" height="5" rx="1.5" fill="#8a9699"/><rect x="22" y="2" width="8" height="5" rx="1.5" fill="#8a9699"/>'
      // tête
      +'<rect x="-20" y="-24" width="40" height="52" rx="7" fill="#5c8a7a"/>'
      // cheveux plats
      +'<path d="M-20 -17 L-20 -22 Q-20 -24 -18 -24 L18 -24 Q20 -24 20 -22 L20 -17 Q10 -22 0 -18 Q-10 -22 -20 -17 Z" fill="#231a30"/>'
      // yeux
      +'<ellipse cx="-8" cy="-4" rx="3.3" ry="3.8" fill="#eef2f0"/><ellipse cx="8" cy="-4" rx="3.3" ry="3.8" fill="#eef2f0"/>'
      +'<circle cx="-8" cy="-3" r="1.5" fill="#241a38"/><circle cx="8" cy="-3" r="1.5" fill="#241a38"/>'
      // cicatrice + bouche (points de suture)
      +'<path d="M-13 7 L13 7" stroke="#3c5c50" stroke-width="2" stroke-linecap="round"/>'
      +'<path d="M-10 7 L-10 4 M-5 7 L-5 10 M0 7 L0 4 M5 7 L5 10 M10 7 L10 4" stroke="#3c5c50" stroke-width="1.2"/>'
      +'<path d="M6 -22 L6 -12 M3 -19 L9 -19" stroke="#3c5c50" stroke-width="1.2"/>'
      +'</svg>';
  }

  // ---- Soucoupe volante d'Halloween ----
  function ufoSVG(){
    return '<svg viewBox="-60 -34 120 80" width="100%" height="100%" aria-hidden="true">'
      // rayon
      +'<path d="M-20 10 L20 10 L34 44 L-34 44 Z" fill="rgba(217,119,46,0.13)"/>'
      // corps
      +'<ellipse cx="0" cy="8" rx="44" ry="13" fill="#39324e"/>'
      +'<ellipse cx="0" cy="5" rx="44" ry="11" fill="#4a4266"/>'
      // dôme teal
      +'<path d="M-20 4 A20 20 0 0 1 20 4 Z" fill="rgba(0,160,157,0.55)"/>'
      +'<path d="M-20 4 A20 20 0 0 1 20 4" fill="none" stroke="rgba(0,232,176,0.5)" stroke-width="1.4"/>'
      // hublots/lumières orange
      +'<circle cx="-28" cy="9" r="2.6" fill="#d9772e"/><circle cx="-14" cy="12" r="2.6" fill="#ffd166"/>'
      +'<circle cx="0" cy="13" r="2.6" fill="#d9772e"/><circle cx="14" cy="12" r="2.6" fill="#ffd166"/><circle cx="28" cy="9" r="2.6" fill="#d9772e"/>'
      // petite citrouille aspirée
      +'<circle cx="0" cy="34" r="5.5" fill="#d9772e"/><rect x="-1" y="27" width="2" height="3" fill="#3c5c50"/>'
      +'</svg>';
  }

  // ---- Citrouille ----
  function pumpkinSVG(){
    return '<svg viewBox="-22 -22 44 42" width="100%" height="100%" aria-hidden="true">'
      +'<rect x="-2" y="-20" width="4" height="6" rx="1.5" fill="#3c5c50"/>'
      +'<ellipse cx="0" cy="0" rx="20" ry="16" fill="#cf7230"/>'
      +'<ellipse cx="-9" cy="0" rx="7" ry="15" fill="#c06a2c" opacity="0.6"/><ellipse cx="9" cy="0" rx="7" ry="15" fill="#c06a2c" opacity="0.6"/>'
      +'<path d="M-11 -4 L-4 -1 L-11 2 Z" fill="#241a1a"/><path d="M11 -4 L4 -1 L11 2 Z" fill="#241a1a"/>'
      +'<path d="M-11 7 L-7 4 L-3 7 L0 4 L3 7 L7 4 L11 7 L8 11 L-8 11 Z" fill="#241a1a"/>'
      +'</svg>';
  }

  // ---- Styles ----
  var css = ''
    +'#hw-bg,#hw-fg{position:fixed;inset:0;overflow:hidden;pointer-events:none;}'
    +'#hw-bg{z-index:0;}#hw-fg{z-index:3;}'
    +'.hw{position:absolute;pointer-events:none;will-change:transform,opacity;}'
    +'.hw-web{width:150px;height:150px;opacity:0.5;}'
    +'.hw-web.tl{top:62px;left:0;}'
    +'.hw-web.tr{top:62px;right:0;transform:scaleX(-1);}'
    +'.hw-web.bl{bottom:0;left:0;transform:scaleY(-1);}'
    +'.hw-web.br{bottom:0;right:0;transform:scale(-1,-1);}'
    +'.hw-spider{top:62px;left:20%;transform-origin:top center;animation:hw-sway 5s ease-in-out infinite;}'
    +'.hw-spider .thread{width:1px;height:70px;margin:0 auto;background:linear-gradient(rgba(226,232,240,0.5),rgba(226,232,240,0.15));}'
    +'.hw-spider .body{display:flex;justify-content:center;margin-top:-2px;}'
    +'.hw-bat{width:58px;height:34px;opacity:0.6;}'
    +'.hw-bat.b1{top:15%;left:31%;animation:hw-float1 9s ease-in-out infinite;}'
    +'.hw-bat.b2{top:23%;right:22%;width:46px;height:27px;opacity:0.5;animation:hw-float2 11s ease-in-out infinite;}'
    +'.hw-bat.b3{top:47%;left:11%;width:36px;height:21px;opacity:0.45;animation:hw-float1 13s ease-in-out infinite;}'
    +'.hw-ghost{width:50px;height:58px;opacity:0.55;top:40%;right:9%;animation:hw-bob 7s ease-in-out infinite;}'
    +'.hw-coffin{width:70px;height:104px;opacity:0.6;bottom:14px;left:14px;animation:hw-tilt 8s ease-in-out infinite;}'
    +'.hw-frank{width:66px;height:84px;opacity:0.6;bottom:12px;right:18px;animation:hw-bob 6s ease-in-out infinite;}'
    +'.hw-pumpkin{width:46px;height:44px;opacity:0.6;bottom:18px;left:50%;margin-left:-180px;animation:hw-glow 3.5s ease-in-out infinite;}'
    +'.hw-ufo{width:150px;height:100px;top:12%;left:-200px;opacity:0.85;pointer-events:none;}'
    +'.hw-ufo.go{animation:hw-ufo-cross 17s linear forwards;}'
    +'.hw-ufo-inner{position:relative;width:100%;height:100%;transform-origin:50% 45%;pointer-events:auto;cursor:crosshair;}'
    +'.hw-ufo-inner.lvl1{animation:hw-wobble 1.1s ease-in-out infinite;}'
    +'.hw-ufo-inner.lvl2{animation:hw-wobble 0.6s ease-in-out infinite;}'
    +'.hw-ufo-inner.lvl3{animation:hw-wobble 0.34s ease-in-out infinite;}'
    +'.hw-ufo-inner.frantic{animation:hw-frantic 0.3s steps(1,end) infinite;}'
    +'.hw-ufo-inner.dead{opacity:0;}'
    +'.hw-ufo-smoke{position:absolute;left:50%;top:28%;width:72px;height:72px;transform:translate(-50%,-50%);border-radius:50%;opacity:0;pointer-events:none;background:radial-gradient(circle,rgba(90,90,100,0.6),rgba(90,90,100,0) 70%);transition:opacity .3s;}'
    +'.hw-ufo-inner.lvl1 .hw-ufo-smoke{opacity:0.4;}'
    +'.hw-ufo-inner.lvl2 .hw-ufo-smoke{opacity:0.75;background:radial-gradient(circle,rgba(70,70,80,0.78),rgba(217,119,46,0.3) 52%,rgba(0,0,0,0) 72%);}'
    +'.hw-ufo-inner.lvl3 .hw-ufo-smoke{opacity:0.95;width:92px;height:92px;background:radial-gradient(circle,rgba(50,45,55,0.85),rgba(255,120,40,0.55) 42%,rgba(255,80,30,0.12) 66%,rgba(0,0,0,0) 78%);}'
    +'.hw-spark{position:fixed;pointer-events:none;font-family:"Space Grotesk","Noto Sans",sans-serif;font-weight:800;white-space:nowrap;transform:translate(-50%,-50%);will-change:transform,opacity;z-index:4;}'
    +'.hw-spark.go{animation:hw-spark-fly var(--dur,1.1s) ease-out forwards;}'
    +'.hw-boom{position:fixed;pointer-events:none;width:22px;height:22px;border-radius:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(255,240,200,0.95),rgba(255,150,50,0.7) 40%,rgba(255,90,30,0) 70%);z-index:4;}'
    +'.hw-boom.go{animation:hw-boom-pop 0.55s ease-out forwards;}'
    +'.hw-bend{position:absolute;left:-30vw;top:46%;font-family:"Fraunces","Space Grotesk",serif;font-weight:600;font-size:15vw;letter-spacing:0.12em;color:rgba(230,223,244,0.22);filter:blur(1.6px);text-shadow:0 0 26px rgba(113,75,103,0.55),0 0 60px rgba(160,120,150,0.35);white-space:nowrap;opacity:0;}'
    +'.hw-bend.go{animation:hw-bend-fly 15s ease-in-out forwards;}'
    +'@keyframes hw-sway{0%,100%{transform:rotate(-5deg);}50%{transform:rotate(5deg);}}'
    +'@keyframes hw-float1{0%,100%{transform:translate(0,0) rotate(-3deg);}50%{transform:translate(26px,-16px) rotate(3deg);}}'
    +'@keyframes hw-float2{0%,100%{transform:translate(0,0) rotate(2deg);}50%{transform:translate(-30px,14px) rotate(-3deg);}}'
    +'@keyframes hw-bob{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}'
    +'@keyframes hw-tilt{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}'
    +'@keyframes hw-glow{0%,100%{opacity:0.45;filter:drop-shadow(0 0 4px rgba(217,119,46,0.4));}50%{opacity:0.72;filter:drop-shadow(0 0 14px rgba(255,160,60,0.7));}}'
    +'@keyframes hw-ufo-cross{0%{transform:translate(0,0);}25%{transform:translate(30vw,22px);}50%{transform:translate(60vw,-18px);}75%{transform:translate(90vw,14px);}100%{transform:translate(130vw,0);}}'
    +'@keyframes hw-wobble{0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);}}'
    +'@keyframes hw-frantic{0%{transform:translate(-14px,8px) rotate(-14deg);}14%{transform:translate(16px,-10px) rotate(15deg);}28%{transform:translate(-10px,-12px) rotate(-9deg);}42%{transform:translate(18px,7px) rotate(12deg);}56%{transform:translate(-17px,11px) rotate(-15deg);}70%{transform:translate(12px,-8px) rotate(10deg);}84%{transform:translate(-8px,10px) rotate(-11deg);}100%{transform:translate(14px,-6px) rotate(13deg);}}'
    +'@keyframes hw-spark-fly{0%{opacity:1;transform:translate(-50%,-50%) translate(0,0) scale(0.55) rotate(0);}20%{opacity:1;}100%{opacity:0;transform:translate(-50%,-50%) translate(var(--dx,0),var(--dy,0)) scale(var(--sc,1.2)) rotate(var(--rot,0deg));}}'
    +'@keyframes hw-boom-pop{0%{opacity:0.95;transform:translate(-50%,-50%) scale(0.2);}100%{opacity:0;transform:translate(-50%,-50%) scale(11);}}'
    +'@keyframes hw-bend-fly{0%{opacity:0;transform:translate(0,16px) scale(0.9) skewX(-6deg);}18%{opacity:0.28;}80%{opacity:0.2;}100%{opacity:0;transform:translate(95vw,-40px) scale(1.4) skewX(6deg);}}'
    +'@media(max-width:768px){.hw-web{width:104px;height:104px;}.hw-bat.b1,.hw-bat.b3,.hw-pumpkin,.hw-ghost{display:none;}.hw-coffin{width:52px;height:78px;}.hw-frank{width:50px;height:64px;}.hw-bend{font-size:26vw;}}'
    +'@media(prefers-reduced-motion:reduce){.hw,.hw-bend{animation:none!important;}.hw-ufo,.hw-bend{display:none;}}';

  var style = document.createElement('style');
  style.id = 'hw-style'; style.textContent = css;
  document.head.appendChild(style);

  // ---- Couche de fond (derrière les cartes) ----
  var bg = document.createElement('div'); bg.id = 'hw-bg';
  bg.innerHTML =
     '<div class="hw hw-bat b1">'+batSVG()+'</div>'
    +'<div class="hw hw-bat b2">'+batSVG()+'</div>'
    +'<div class="hw hw-bat b3">'+batSVG()+'</div>'
    +'<div class="hw hw-ghost">'+ghostSVG()+'</div>'
    +'<div class="hw hw-coffin">'+coffinSVG()+'</div>'
    +'<div class="hw hw-frank">'+frankSVG()+'</div>'
    +'<div class="hw hw-pumpkin">'+pumpkinSVG()+'</div>';
  document.body.appendChild(bg);

  // ---- Couche avant (toiles + araignée) ----
  var fg = document.createElement('div'); fg.id = 'hw-fg';
  fg.innerHTML =
     '<div class="hw hw-web tl">'+webSVG()+'</div>'
    +'<div class="hw hw-web tr">'+webSVG()+'</div>'
    +'<div class="hw hw-web bl">'+webSVG()+'</div>'
    +'<div class="hw hw-web br">'+webSVG()+'</div>'
    +'<div class="hw hw-spider"><div class="thread"></div><div class="body">'+spiderSVG()+'</div></div>';
  document.body.appendChild(fg);

  if(reduce) return; // pas d'animations périodiques en mode réduit

  // ---- UFO périodique + Easter egg « tir » ----
  var TEAM = ['GRO','LEGU','LAGOV','HUPAS','DMAR','BEBLE','JULE'];
  var SPARK_COLORS = ['#ffd166','#d9772e','#00e8b0','#c9a0ff','#ffffff','#ff7a45'];

  var ufo = document.createElement('div'); ufo.className = 'hw hw-ufo';
  ufo.innerHTML = '<div class="hw-ufo-inner"><div class="hw-ufo-smoke"></div>'+ufoSVG()+'</div>';
  fg.appendChild(ufo); // dans la couche avant → cliquable au-dessus des cartes
  var ufoInner = ufo.querySelector('.hw-ufo-inner');
  var ufoHits = 0;

  ufo.addEventListener('animationend', function(e){ if(e.animationName==='hw-ufo-cross'){ ufo.classList.remove('go'); } });

  function ufoDamage(){
    var lvl = ufoHits<=2 ? 1 : (ufoHits<=6 ? 2 : 3);
    ufoInner.className = 'hw-ufo-inner lvl'+lvl + (ufoHits>=7 ? ' frantic' : '');
  }

  function ufoCenter(){ var r = ufoInner.getBoundingClientRect(); return { x:r.left+r.width/2, y:r.top+r.height/2 }; }

  function spark(x, y, o){
    o = o || {};
    var s = document.createElement('div'); s.className = 'hw-spark';
    var col = SPARK_COLORS[(Math.random()*SPARK_COLORS.length)|0];
    s.style.left = x+'px'; s.style.top = y+'px'; s.style.color = col;
    if(o.text){ s.textContent = o.text; s.style.fontSize = (o.size||13)+'px'; s.style.textShadow = '0 0 8px '+col+',0 0 18px rgba(255,180,80,0.5)'; }
    else { s.textContent = '•'; s.style.fontSize = (o.size||10)+'px'; s.style.textShadow = '0 0 6px '+col; }
    var ang = (o.ang!=null) ? o.ang : Math.random()*Math.PI*2;
    var dist = o.dist || (40 + Math.random()*120);
    s.style.setProperty('--dx', (Math.cos(ang)*dist).toFixed(0)+'px');
    s.style.setProperty('--dy', (Math.sin(ang)*dist - (o.lift||0)).toFixed(0)+'px');
    s.style.setProperty('--sc', (0.8 + Math.random()*1.3).toFixed(2));
    s.style.setProperty('--rot', ((Math.random()*120-60)|0)+'deg');
    s.style.setProperty('--dur', (0.8 + Math.random()*0.7).toFixed(2)+'s');
    fg.appendChild(s); void s.offsetWidth; s.classList.add('go');
    s.addEventListener('animationend', function(){ s.remove(); });
  }

  function ufoExplode(x, y){
    ufoInner.classList.add('dead');
    var boom = document.createElement('div'); boom.className = 'hw-boom';
    boom.style.left = x+'px'; boom.style.top = y+'px';
    fg.appendChild(boom); void boom.offsetWidth; boom.classList.add('go');
    boom.addEventListener('animationend', function(){ boom.remove(); });
    // noms de l'équipe projetés en étincelles (chaque nom plusieurs fois)
    var names = [];
    for(var k=0;k<3;k++){ TEAM.forEach(function(nm){ names.push(nm); }); }
    names.sort(function(){ return Math.random()-0.5; });
    var total = 22;
    for(var i=0;i<total;i++){
      (function(idx){
        setTimeout(function(){
          var ang = (idx/total)*Math.PI*2 + Math.random()*0.6;
          spark(x, y, { text:names[idx%names.length], ang:ang, dist:90+Math.random()*190, size:12+Math.random()*10, lift:18 });
        }, Math.random()*140);
      })(i);
    }
    for(var j=0;j<18;j++){ spark(x, y, { ang:Math.random()*Math.PI*2, dist:60+Math.random()*170, size:8+Math.random()*6, lift:10 }); }
    ufo.classList.remove('go'); // stoppe le vol en cours
    setTimeout(function(){ ufoHits = 0; ufoInner.className = 'hw-ufo-inner'; }, 650);
  }

  function ufoHit(e){
    if(e){ e.preventDefault(); e.stopPropagation(); }
    if(!ufo.classList.contains('go') || ufoInner.classList.contains('dead')) return;
    ufoHits++;
    var c = ufoCenter();
    var n = 3 + ufoHits; // de plus en plus d'étincelles à chaque coup
    for(var i=0;i<n;i++) spark(c.x+(Math.random()*30-15), c.y+(Math.random()*20-10), { dist:25+Math.random()*60, size:9 });
    if(ufoHits>=10){ ufoExplode(c.x, c.y); return; }
    ufoDamage();
  }
  ufo.addEventListener('click', ufoHit);

  function flyUfo(){ if(ufoInner.classList.contains('dead')) return; ufo.classList.remove('go'); void ufo.offsetWidth; ufo.classList.add('go'); }
  function scheduleUfo(){ setTimeout(function(){ flyUfo(); scheduleUfo(); }, 22000 + Math.random()*20000); }
  setTimeout(scheduleUfo, 6000);

  // ---- "BEND" en fumée périodique ----
  var bend = document.createElement('div'); bend.className = 'hw-bend'; bend.textContent = 'BEND';
  bg.appendChild(bend);
  bend.addEventListener('animationend', function(){ bend.classList.remove('go'); });
  function flyBend(){ bend.style.top = (30 + Math.random()*35) + '%'; bend.classList.remove('go'); void bend.offsetWidth; bend.classList.add('go'); }
  function scheduleBend(){ setTimeout(function(){ flyBend(); scheduleBend(); }, 28000 + Math.random()*22000); }
  setTimeout(scheduleBend, 12000);
})();
