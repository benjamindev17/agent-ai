// ── GLOBE ──
const canvas=document.getElementById('earthCanvas'),ctx=canvas.getContext('2d');
let W,H,time=0,highlightedCountry=null,geoData=null;
const stars=Array.from({length:180},()=>({x:Math.random(),y:Math.random(),s:Math.random()*1.2+0.3,b:Math.random()*0.4+0.15,sp:Math.random()*0.003+0.001}));
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r=>r.json()).then(topo=>{geoData=decodeTopo(topo);animate();}).catch(()=>animate());
function decodeTopo(topo){const arcs=topo.arcs,sc=topo.transform.scale,tr=topo.transform.translate;const da=arcs.map(a=>{let x=0,y=0;return a.map(p=>{x+=p[0];y+=p[1];return[x*sc[0]+tr[0],y*sc[1]+tr[1]];});});const iso={'56':'BE','276':'DE','250':'FR','826':'GB','380':'IT','724':'ES','620':'PT','528':'NL','442':'LU','756':'CH','40':'AT','208':'DK','752':'SE','246':'FI','372':'IE','616':'PL','203':'CZ','703':'SK','348':'HU','642':'RO','100':'BG','300':'GR','191':'HR','705':'SI','233':'EE','428':'LV','440':'LT','196':'CY','470':'MT','578':'NO','804':'UA','112':'BY','643':'RU','688':'RS','70':'BA','499':'ME','807':'MK','8':'AL','498':'MD','792':'TR','788':'TN','12':'DZ','504':'MA','434':'LY','818':'EG'};const ra=i=>i>=0?da[i]:[...da[~i]].reverse();const feats=[];topo.objects.countries.geometries.forEach(g=>{const rings=[];const proc=refs=>{let c=[];refs.forEach(i=>c=c.concat(ra(i)));rings.push(c);};if(g.type==='Polygon')g.arcs.forEach(proc);else if(g.type==='MultiPolygon')g.arcs.forEach(p=>p.forEach(proc));feats.push({iso:iso[String(g.id)]||null,rings});});return feats;}
function project(lon,lat,t){const lookLat=(44+Math.sin(t*0.00012)*0.8)*Math.PI/180,lookLon=(8+Math.cos(t*0.0001)*1.0)*Math.PI/180,camAz=(215+Math.sin(t*0.00008)*2)*Math.PI/180,camEl=(32+Math.sin(t*0.00007)*1.5)*Math.PI/180,CD=1.32;const phi=lat*Math.PI/180,lam=lon*Math.PI/180;const px=Math.cos(phi)*Math.cos(lam),py=Math.cos(phi)*Math.sin(lam),pz=Math.sin(phi);const lx=Math.cos(lookLat)*Math.cos(lookLon),ly=Math.cos(lookLat)*Math.sin(lookLon),lz=Math.sin(lookLat);const cx=lx-Math.cos(camEl)*Math.cos(camAz)*(CD-1),cy=ly-Math.cos(camEl)*Math.sin(camAz)*(CD-1),cz=lz+Math.sin(camEl)*(CD-1);let fx=lx-cx,fy=ly-cy,fz=lz-cz;const fl=Math.sqrt(fx*fx+fy*fy+fz*fz);fx/=fl;fy/=fl;fz/=fl;let rx=fy-fz*0,ry=fz*0-fx,rz=0;const rl=Math.sqrt(rx*rx+ry*ry+rz*rz);rx/=rl;ry/=rl;let ux=ry*fz-rz*fy,uy=rz*fx-rx*fz,uz=rx*fy-ry*fx;const ro=Math.sin(t*0.00006)*0.025,cr=Math.cos(ro),sr=Math.sin(ro);const rx2=rx*cr+ux*sr,ry2=ry*cr+uy*sr,rz2=rz*cr+uz*sr,ux2=-rx*sr+ux*cr,uy2=-ry*sr+uy*cr,uz2=-rz*sr+uz*cr;const dx=px-cx,dy=py-cy,dz=pz-cz;const cZ=dx*fx+dy*fy+dz*fz;if(cZ<0.05)return null;const cX=dx*rx2+dy*ry2+dz*rz2,cY=dx*ux2+dy*uy2+dz*uz2;const dot=px*cx+py*cy+pz*cz,cd=Math.sqrt(cx*cx+cy*cy+cz*cz);if(dot/cd<1.0/cd*0.85)return null;const fov=0.75,ss=Math.min(W,H)*fov/cZ;return{x:W*0.5+cX*ss,y:H*0.5-cY*ss,z:cZ,d:dot/cd};}
const EU=new Set(['BE','DE','FR','IT','ES','PT','NL','LU','CH','AT','DK','SE','FI','IE','PL','CZ','SK','HU','RO','BG','GR','HR','SI','EE','LV','LT','CY','MT','GB','NO']);
const C=[{a:51.51,o:-0.13,s:6,c:'GB'},{a:48.86,o:2.35,s:6,c:'FR'},{a:52.52,o:13.41,s:5,c:'DE'},{a:40.42,o:-3.70,s:5,c:'ES'},{a:41.90,o:12.50,s:5,c:'IT'},{a:45.46,o:9.19,s:5,c:'IT'},{a:50.85,o:4.35,s:4,c:'BE'},{a:52.37,o:4.90,s:4,c:'NL'},{a:48.21,o:16.37,s:4,c:'AT'},{a:59.33,o:18.07,s:3.5,c:'SE'},{a:55.68,o:12.57,s:3.5,c:'DK'},{a:60.17,o:24.94,s:3,c:'FI'},{a:38.72,o:-9.14,s:4,c:'PT'},{a:52.23,o:21.01,s:4,c:'PL'},{a:47.50,o:19.04,s:3.5,c:'HU'},{a:44.43,o:26.10,s:3.5,c:'RO'},{a:37.98,o:23.73,s:3.5,c:'GR'},{a:53.35,o:-6.26,s:3,c:'IE'},{a:47.38,o:8.54,s:3,c:'CH'},{a:49.61,o:6.13,s:1.5,c:'LU'},{a:50.08,o:14.44,s:3,c:'CZ'},{a:59.91,o:10.75,s:3,c:null},{a:55.76,o:37.62,s:5,c:null},{a:41.01,o:28.98,s:5,c:null},{a:30.04,o:31.24,s:4,c:null}];
function drawFrame(t){
  ctx.clearRect(0,0,W,H);
  // ── deep space with radial vignette (darker at edges) ──
  const spaceG=ctx.createRadialGradient(W*0.5,H*0.46,0,W*0.5,H*0.5,Math.max(W,H)*0.8);
  spaceG.addColorStop(0,'#171132');spaceG.addColorStop(0.55,'#0a0817');spaceG.addColorStop(1,'#030206');
  ctx.fillStyle=spaceG;ctx.fillRect(0,0,W,H);
  stars.forEach(s=>{ctx.fillStyle=`rgba(255,255,255,${s.b+Math.sin(t*s.sp)*0.1})`;ctx.beginPath();ctx.arc(s.x*W,s.y*H,s.s,0,Math.PI*2);ctx.fill();});
  // ── compute the visible globe disc (screen-space circle) from projected sphere points ──
  let miX=1e9,miY=1e9,maX=-1e9,maY=-1e9,cnt=0;
  for(let la=-88;la<=88;la+=6){for(let lo=-180;lo<180;lo+=6){const p=project(lo,la,t);if(p){if(p.x<miX)miX=p.x;if(p.x>maX)maX=p.x;if(p.y<miY)miY=p.y;if(p.y>maY)maY=p.y;cnt++;}}}
  const hasGlobe=cnt>24;
  const gcx=(miX+maX)/2, gcy=(miY+maY)/2, grad=Math.max(maX-miX,maY-miY)/2*1.02;
  if(hasGlobe){
    // atmospheric halo — soft cyan ring glow just outside the disc
    const ag=ctx.createRadialGradient(gcx,gcy,grad*0.84,gcx,gcy,grad*1.17);
    ag.addColorStop(0,'rgba(70,185,235,0)');ag.addColorStop(0.55,'rgba(95,210,245,0.34)');ag.addColorStop(1,'rgba(55,145,215,0)');
    ctx.beginPath();ctx.arc(gcx,gcy,grad*1.17,0,Math.PI*2);ctx.fillStyle=ag;ctx.fill();
    // ── ocean sphere: clip to disc, shade like a lit globe ──
    ctx.save();
    ctx.beginPath();ctx.arc(gcx,gcy,grad,0,Math.PI*2);ctx.clip();
    const og=ctx.createRadialGradient(gcx-grad*0.34,gcy-grad*0.40,grad*0.04,gcx,gcy,grad*1.08);
    og.addColorStop(0,'#127ea0');og.addColorStop(0.4,'#0a556e');og.addColorStop(0.78,'#063648');og.addColorStop(1,'#03212e');
    ctx.fillStyle=og;ctx.fillRect(gcx-grad,gcy-grad,grad*2,grad*2);
    // continents on top of the ocean, clipped to the disc
    if(geoData)geoData.forEach(f=>{const isHL=highlightedCountry&&f.iso===highlightedCountry,isEU=f.iso&&EU.has(f.iso);f.rings.forEach(ring=>{ctx.beginPath();let st=false,vis=false;for(let i=0;i<ring.length;i++){const p=project(ring[i][0],ring[i][1],t);if(!p){st=false;continue;}vis=true;if(!st){ctx.moveTo(p.x,p.y);st=true;}else ctx.lineTo(p.x,p.y);}if(!vis)return;ctx.closePath();if(isHL){ctx.fillStyle='rgba(0,190,175,0.35)';ctx.strokeStyle='rgba(0,235,220,0.7)';ctx.lineWidth=1.2;ctx.shadowColor='rgba(0,210,200,0.55)';ctx.shadowBlur=15;}else if(isEU){ctx.fillStyle='rgba(30,90,55,0.82)';ctx.strokeStyle='rgba(90,180,120,0.55)';ctx.lineWidth=0.6;ctx.shadowBlur=0;}else{ctx.fillStyle='rgba(22,66,42,0.72)';ctx.strokeStyle='rgba(60,120,85,0.3)';ctx.lineWidth=0.3;ctx.shadowBlur=0;}ctx.fill();ctx.stroke();ctx.shadowBlur=0;});});
    // subtle inner shadow at the limb to round the sphere
    const sh=ctx.createRadialGradient(gcx,gcy,grad*0.72,gcx,gcy,grad);
    sh.addColorStop(0,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(2,10,20,0.45)');
    ctx.fillStyle=sh;ctx.fillRect(gcx-grad,gcy-grad,grad*2,grad*2);
    ctx.restore();
    // crisp bright rim — the key separator between globe and space
    ctx.beginPath();ctx.arc(gcx,gcy,grad,0,Math.PI*2);ctx.strokeStyle='rgba(205,248,255,0.6)';ctx.lineWidth=1.4;ctx.stroke();
    ctx.beginPath();ctx.arc(gcx,gcy,grad+2,0,Math.PI*2);ctx.strokeStyle='rgba(120,215,245,0.25)';ctx.lineWidth=2.2;ctx.stroke();
  }
  // ── city glow markers (over the globe, unclipped) ──
  C.forEach(c=>{const p=project(c.o,c.a,t);if(!p)return;const isHL=highlightedCountry&&c.c===highlightedCountry,pulse=Math.sin(t*0.0025+c.a*0.12)*0.2+0.8,df=Math.pow(Math.max(0,Math.min(1,p.d)),0.5);let col,al,gs;if(isHL){col='0,230,220';al=0.95*df;gs=c.s*5;}else if(c.c){col='255,200,60';al=(0.55+pulse*0.3)*df;gs=c.s*3.5;}else{col='220,180,80';al=0.2*df;gs=c.s*2;}const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,gs);g.addColorStop(0,`rgba(${col},${al})`);g.addColorStop(0.25,`rgba(${col},${al*0.55})`);g.addColorStop(0.6,`rgba(${col},${al*0.15})`);g.addColorStop(1,`rgba(${col},0)`);ctx.beginPath();ctx.arc(p.x,p.y,gs,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();ctx.beginPath();ctx.arc(p.x,p.y,Math.max(0.5,c.s*0.4*df),0,Math.PI*2);ctx.fillStyle=`rgba(${col},${Math.min(1,al*2)})`;ctx.fill();});
}
function animate(){time+=16;try{drawFrame(time);}catch(e){}requestAnimationFrame(animate);}
document.addEventListener('visibilitychange',function(){if(!document.hidden)requestAnimationFrame(animate);});
function highlightCountry(code){if(code==='UK')code='GB';highlightedCountry=code;}
