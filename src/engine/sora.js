// Ported from "Lintasan Sora Adiwangsa.html": spring engine, canvases, sticky stack and scroll reader.
// Content comes in through D (see src/data/profile.ts). Runs once on mount.
import Lenis from 'lenis'

export function startSora(D){
"use strict";
history.scrollRestoration="manual";scrollTo(0,0);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const TOUCH=matchMedia('(hover: none)').matches;
const $=s=>document.querySelector(s);
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
let VW=innerWidth,VH=innerHeight;

/* ================= NOISE ================= */
function h3(x,y,z){let h=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(z,2147483587);h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295;}
const sm=t=>t*t*(3-2*t);
function n3(x,y,z){const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=sm(x-xi),yf=sm(y-yi),zf=sm(z-zi);
  const a=lerp(lerp(h3(xi,yi,zi),h3(xi+1,yi,zi),xf),lerp(h3(xi,yi+1,zi),h3(xi+1,yi+1,zi),xf),yf);
  const b=lerp(lerp(h3(xi,yi,zi+1),h3(xi+1,yi,zi+1),xf),lerp(h3(xi,yi+1,zi+1),h3(xi+1,yi+1,zi+1),xf),yf);
  return lerp(a,b,zf);}
const fbm=(x,y,t)=>n3(x,y,t)*.62+n3(x*2.1+5,y*2.1,t*1.3)*.28+n3(x*4.3,y*4.3+9,t*1.7)*.1;

/* ================= SPRING ENGINE ================= */
class Spring{
  constructor(v,cfg,on){this.v=v;this.to=v;this.vel=0;this.k=cfg[0];this.c=cfg[1];this.on=on;this.rest=true;this.eps=Math.abs(v)<=1.5?.001:.01;}
  set(to,delay=0){const go=()=>{this.to=to;this.rest=false;active.add(this);};delay?setTimeout(go,delay):go();}
  jump(v){this.v=this.to=v;this.vel=0;this.on&&this.on(v);}
  step(ms){for(let i=0;i<ms;i++){const f=-this.k*(this.v-this.to)-this.c*this.vel;this.vel+=f*.001;this.v+=this.vel*.001;}
    if(Math.abs(this.vel)<.01&&Math.abs(this.to-this.v)<this.eps){this.v=this.to;this.vel=0;this.rest=true;}
    this.on&&this.on(this.v);}
}
const active=new Set();
const C={REVEAL:[90,26],ROW:[170,24],TYPE:[210,24],YEAR:[190,24],YEAR_SETTLE:[32,26],FIGURE:[200,24],VEIL:[70,24],SMOOTH:[120,22]};

/* ================= TICKER ================= */
const subs=new Set();let last=performance.now();
function sub(fn,fr=0){const s={fn,fr,t:0};subs.add(s);return()=>subs.delete(s);}
function loop(now){
  const dt=Math.min(64,now-last);last=now;
  [...subs].forEach(s=>{if(now-s.t>=s.fr){s.fn(now,dt);s.t=now;}});
  active.forEach(s=>{s.step(Math.round(dt));if(s.rest)active.delete(s);});
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/* Lenis first */
let lenis=null;
if(!RM){lenis=new Lenis({smoothWheel:true});sub(t=>lenis.raf(t),0);
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=$(a.getAttribute('href'));if(el){e.preventDefault();lenis.scrollTo(el,{duration:1.6});}}));}

/* ================= CANVAS HELPERS ================= */
function fit(cv,dprCap=1.5){const d=Math.min(devicePixelRatio||1,dprCap),r=cv.getBoundingClientRect();
  cv.width=Math.max(1,Math.round(r.width*d));cv.height=Math.max(1,Math.round(r.height*d));
  const x=cv.getContext('2d');x.setTransform(d,0,0,d,0,0);return {x,w:r.width,h:r.height,d};}
const EDGE=[[0,1],[1,2],[3,2],[0,3]]; // T(a,b) R(b,c) B(d,c) L(a,d) via corner ids a0 b1 c2 d3
const CASES={1:[3,2],2:[2,1],3:[3,1],4:[0,1],5:[3,0,2,1],6:[0,2],7:[3,0],8:[3,0],9:[0,2],10:[0,1,3,2],11:[0,1],12:[3,1],13:[2,1],14:[3,2]};
function contours(x,w,h,t,o){
  const cs=o.cell,cols=Math.ceil(w/cs)+1,rows=Math.ceil(h/cs)+1,F=new Float32Array(cols*rows);
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)F[j*cols+i]=fbm(i*cs*o.scale,j*cs*o.scale,t);
  x.beginPath();
  for(const L of o.levels){
    for(let j=0;j<rows-1;j++)for(let i=0;i<cols-1;i++){
      const v=[F[j*cols+i],F[j*cols+i+1],F[(j+1)*cols+i+1],F[(j+1)*cols+i]];
      const k=(v[0]>L?8:0)|(v[1]>L?4:0)|(v[2]>L?2:0)|(v[3]>L?1:0);if(!k||k===15)continue;
      const seg=CASES[k],x0=i*cs,y0=j*cs;
      const pt=e=>{const [p,q]=[[0,1],[1,2],[3,2],[0,3]][e];const tt=(L-v[p])/(v[q]-v[p]);
        return e===0?[x0+cs*tt,y0]:e===1?[x0+cs,y0+cs*tt]:e===2?[x0+cs*tt,y0+cs]:[x0,y0+cs*tt];};
      for(let s=0;s<seg.length;s+=2){const A=pt(seg[s]),B=pt(seg[s+1]);x.moveTo(A[0],A[1]);x.lineTo(B[0],B[1]);}
    }
  }
  x.strokeStyle=o.color;x.lineWidth=o.lw;x.stroke();
}
function inView(el,cb){const io=new IntersectionObserver(([e])=>cb(e.isIntersecting),{rootMargin:'80px'});io.observe(el);}

/* ================= TEXT ENGINE ================= */
function splitLetters(el){
  const txt=el.textContent;el.setAttribute('aria-label',txt);el.textContent='';
  return [...txt].map(ch=>{const s=document.createElement('span');s.className='u';s.setAttribute('aria-hidden','true');s.textContent=ch===' '?' ':ch;el.appendChild(s);return s;});
}
function revealIn(el,delay,cfg=C.REVEAL,dist='1.25rem'){
  if(RM){el.style.opacity=1;el.style.transform='';return;}
  const sp=new Spring(0,cfg,p=>{el.style.opacity=p;el.style.transform=`translateY(calc(${dist} * ${1-p}))`;});
  sp.jump(0);sp.set(1,delay);
}

/* ================= DATA ================= */
const TL=D.timeline;
const MARKERS=D.markers;

/* ================= HERO ================= */
const hero={bg:$('#heroBg'),rv:$('#heroRv'),visible:true};
let HB,HR,mask,mctx;
const ptr={x:VW*.6,y:VH*.5,sx:VW*.6,sy:VH*.5,last:0,moved:false,trail:[]};
function heroResize(){HB=fit(hero.bg,1.25);HR=fit(hero.rv,1.25);calcGlobe&&setTimeout(calcGlobe,0);
  mask=document.createElement('canvas');mask.width=HR.w;mask.height=HR.h;mctx=mask.getContext('2d');}
heroResize();
(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(calcGlobe,50));
addEventListener('pointermove',e=>{ptr.x=e.clientX;ptr.y=e.clientY;ptr.last=performance.now();ptr.moved=true;});
// Globe sits right behind the centered portrait: same horizontal centre, around head height.
// Measured with offsets (not getBoundingClientRect) so the sticky-stack scale doesn't skew it.
let GC=null;
function calcGlobe(){const el=document.querySelector('.cutout'),stage=document.querySelector('.stage'),root=document.querySelector('.hero .stk-inner');
  if(!el||!stage||!root){GC=null;return;}
  // portrait is always centred in the stage, so take the stage's centre line (immune to CSS translate)
  let sx=0,sy=0,n=stage;while(n&&n!==root){sx+=n.offsetLeft;sy+=n.offsetTop;n=n.offsetParent;}
  const h=el.offsetHeight,top=sy+el.offsetTop;GC={x:sx+stage.offsetWidth/2,y:top+h*.46,r:Math.min(h*.5,VW*.44)};}
function globeCenter(){return GC||(VW<1024?{x:VW*.5,y:VH*.5,r:Math.min(VW,VH)*.3}:{x:VW*.5,y:VH*.5,r:Math.min(VW,VH)*.36});}
function drawGlobe(x,t,mode,scanY){
  const g=globeCenter(),rot=t/10000*Math.PI*2;
  if(mode==='dots'){
    for(let la=-80;la<=80;la+=8){const lr=la*Math.PI/180;
      for(let lo=0;lo<360;lo+=6){const a=lo*Math.PI/180+rot,z=Math.cos(lr)*Math.cos(a);if(z<0)continue;
        const px=g.x+g.r*Math.cos(lr)*Math.sin(a),py=g.y-g.r*Math.sin(lr);
        x.fillStyle=`rgba(11,16,32,${.1+z*.35})`;x.fillRect(px-.9,py-.9,1.8,1.8);}}
  }else{
    x.lineWidth=1;
    for(let la=-75;la<=75;la+=15){const lr=la*Math.PI/180;x.beginPath();let on=false;
      for(let lo=0;lo<=360;lo+=4){const a=lo*Math.PI/180+rot,z=Math.cos(lr)*Math.cos(a);const px=g.x+g.r*Math.cos(lr)*Math.sin(a),py=g.y-g.r*Math.sin(lr);
        if(z>=0){on?x.lineTo(px,py):x.moveTo(px,py);on=true;}else on=false;}
      x.stroke();}
    for(let lo=0;lo<360;lo+=15){x.beginPath();let on=false;
      for(let la=-90;la<=90;la+=4){const lr=la*Math.PI/180,a=lo*Math.PI/180+rot,z=Math.cos(lr)*Math.cos(a);const px=g.x+g.r*Math.cos(lr)*Math.sin(a),py=g.y-g.r*Math.sin(lr);
        if(z>=0){on?x.lineTo(px,py):x.moveTo(px,py);on=true;}else on=false;}
      x.stroke();}
  }
}
let heroT0=performance.now();
function heroFrame(now){
  if(!hero.visible)return;
  const t=RM?0:(now-heroT0);
  // pointer smoothing + touch sweep
  if(TOUCH&&now-ptr.last>2500){const k=now/1000;ptr.x=VW*(.5+.3*Math.sin(k*.9));ptr.y=VH*(.5+.22*Math.sin(k*1.4));ptr.moved=true;}
  ptr.sx+=(ptr.x-ptr.sx)*.18;ptr.sy+=(ptr.y-ptr.sy)*.18;
  // background: contours + dotted globe
  const x=HB.x;x.clearRect(0,0,HB.w,HB.h);
  contours(x,HB.w,HB.h,t*.00005,{cell:18,scale:.0028,levels:[.3,.38,.46,.54,.62,.7],color:'#d9e0ee',lw:1});
  drawGlobe(x,t,'dots');
  // reveal mask: decays, painted along pointer path
  mctx.globalCompositeOperation='destination-out';mctx.fillStyle='rgba(0,0,0,.05)';mctx.fillRect(0,0,mask.width,mask.height);
  mctx.globalCompositeOperation='source-over';
  if(ptr.moved){const steps=6;for(let s=0;s<steps;s++){const px=lerp(ptr.px??ptr.sx,ptr.sx,s/steps),py=lerp(ptr.py??ptr.sy,ptr.sy,s/steps);
      for(let k=0;k<3;k++){const r=(VW<640?70:110)*(.75+n3(px*.01,py*.01,t*.001+k)*.5);
        const gr=mctx.createRadialGradient(px,py,0,px,py,r);gr.addColorStop(0,'rgba(0,0,0,.9)');gr.addColorStop(.65,'rgba(0,0,0,.6)');gr.addColorStop(1,'rgba(0,0,0,0)');
        mctx.fillStyle=gr;mctx.beginPath();mctx.arc(px+(k-1)*6,py+(k-1)*4,r,0,7);mctx.fill();}}}
  ptr.px=ptr.sx;ptr.py=ptr.sy;
  // reveal layer
  const r=HR.x;r.clearRect(0,0,HR.w,HR.h);
  // halftone, only around the recent pointer path
  ptr.trail.push([ptr.sx,ptr.sy,now]);while(ptr.trail.length&&now-ptr.trail[0][2]>1600)ptr.trail.shift();
  let bx0=1e9,by0=1e9,bx1=-1e9,by1=-1e9;ptr.trail.forEach(p=>{bx0=Math.min(bx0,p[0]);by0=Math.min(by0,p[1]);bx1=Math.max(bx1,p[0]);by1=Math.max(by1,p[1]);});
  const cs=11,pad=150;bx0=Math.max(0,Math.floor((bx0-pad)/cs)*cs);by0=Math.max(0,Math.floor((by0-pad)/cs)*cs);bx1=Math.min(HR.w,bx1+pad);by1=Math.min(HR.h,by1+pad);
  for(let yy=by0;yy<by1;yy+=cs)for(let xx=bx0;xx<bx1;xx+=cs){
    const v=fbm(xx*.0028,yy*.0028,t*.00005);const rad=Math.max(0,(v-.25))*cs*.9;
    if(rad>.4){r.fillStyle='#0b1020';r.beginPath();r.arc(xx,yy,rad*.5,0,7);r.fill();}}
  contours(r,HR.w,HR.h,t*.00005,{cell:18,scale:.0028,levels:[.3,.38,.46,.54,.62,.7],color:'#5b7cfa',lw:1.6});
  r.strokeStyle='#5b7cfa';drawGlobe(r,t,'wire');
  r.globalCompositeOperation='destination-in';r.drawImage(mask,0,0,HR.w,HR.h);r.globalCompositeOperation='source-over';
  // wireframe scan wave every 3.1s, visible without the cursor
  if(!RM){const g=globeCenter(),ph=(t%3100)/3100,sy=g.y-g.r+ph*2*g.r;
    r.save();r.beginPath();r.rect(0,sy-14,HR.w,28);r.clip();r.globalAlpha=Math.sin(ph*Math.PI)*.55;r.strokeStyle='#5b7cfa';drawGlobe(r,t,'wire');r.restore();}
}
sub(heroFrame,1000/60-2);

/* ================= TYPED LINE ================= */
function typeLine(delay){const el=$('#typedText');if(!el)return;const txt=D.tagline;
  if(RM){el.textContent=txt;return;}
  setTimeout(()=>{let n=0;const id=setInterval(()=>{el.textContent=txt.slice(0,++n);if(n>=txt.length)clearInterval(id);},32);},delay);}

/* ================= VEIL + BURN ================= */
const veil=$('#veil'),burnCv=$('#burn');let B=fit(burnCv,1);
const meter=$('#meter'),gfill=$('#gfill'),vpct=$('#vpct');
const bootEls=[...document.querySelectorAll('#boot li')];
const prog=new Spring(0,[10,30],p=>{meter.style.transform=`scaleX(${p})`;gfill.style.clipPath=`inset(0 0 ${100-p*100}% 0)`;vpct.textContent=String(Math.round(p*100)).padStart(3,'0');bootEls.forEach((el,i)=>el.classList.toggle('on',p>=(i+.5)/bootEls.length*.98));});
function paintBurn(p){
  const x=B.x;x.clearRect(0,0,B.w,B.h);const cs=10;
  for(let yy=0;yy<B.h;yy+=cs)for(let xx=0;xx<B.w;xx+=cs){
    const v=yy/B.h*1.0+(n3(xx*.012,yy*.012,3)-.5)*.42;
    if(v<p-.035)continue;
    if(v<p){x.fillStyle='#5b7cfa';x.fillRect(xx,yy,cs,cs);x.fillStyle='rgba(255,255,255,.55)';x.fillRect(xx+3,yy+3,cs-6,cs-6);}
    else{x.fillStyle='#0b1020';x.fillRect(xx,yy,cs+.5,cs+.5);}
  }
}
paintBurn(-1);
// hero entrance prep
const entrance=[...document.querySelectorAll('[data-in]')];
if(!RM)entrance.forEach(el=>{el.style.opacity=0;});
prog.set(.7);
const ready=Promise.all([document.fonts?document.fonts.ready:Promise.resolve(),new Promise(r=>setTimeout(r,1300))]);
ready.then(()=>{
  prog.k=170;prog.c=26;prog.set(1);
  setTimeout(()=>{
    $('#veilUi').style.opacity=0;vpct.style.opacity=0;meter.parentNode.style.opacity=0;$('#boot').style.opacity=0;
    typeLine(+($('#typed')?.dataset.in||0)+900);
    entrance.forEach(el=>revealIn(el,+el.dataset.in+300));
    if(RM){veil.remove();return;}
    const b=new Spring(-.1,[40,22],p=>paintBurn(p));b.set(1.45);
    const kill=setInterval(()=>{if(b.v>1.4){veil.remove();clearInterval(kill);}},100);
  },670);
});
setTimeout(()=>{if(document.body.contains(veil)){veil.remove();entrance.forEach(el=>{el.style.opacity=1;el.style.transform='';});const t=$('#typedText');if(t&&!t.textContent)t.textContent=D.tagline;}},7000);

/* ================= GIT GRAPH (perjalanan dalam commit) ================= */
// Time runs left→right (2020 → 2027). main = career line; each product is a branch
// with real commit counts. The playhead sweeps across and lights commits as it passes.
const mapCv=$('#map'),chq=$('#chq');let M,Q,dots=[],G={main:[],branches:[],X0:0,X1:0,mainY:0,X:t=>0};
const S={trace:0,started:false,done:false,ret:{x:-999,y:-999},visible:false};
const MONO='"Geist Mono Variable",ui-monospace,monospace';
function buildGraph(){
  const phone=VW<900;
  const box=phone?{x:VW*.07,y:VH*.5,w:VW*.86,h:VH*.2}:{x:VW*.35,y:VH*.17,w:VW*.6,h:VH*.5};
  // piecewise time axis: 2020–2022 is quiet, so it gets less room than 2022–2027
  const T0=2020,T1=2027,X=t=>box.x+box.w*(t<2022?(t-2020)/2*.16:.16+(t-2022)/5*.84);
  const lanes=Math.max(...D.branches.map(b=>Math.abs(b.lane)));const gap=box.h/(lanes*2+1);
  const mainY=box.y+box.h/2,dx=Math.min(26,box.w*.03);
  const bez=(a,b,c,d,n)=>{const out=[];for(let s=1;s<=n;s++){const t=s/n,u=1-t;out.push([u*u*u*a[0]+3*u*u*t*b[0]+3*u*t*t*c[0]+t*t*t*d[0],u*u*u*a[1]+3*u*u*t*b[1]+3*u*t*t*c[1]+t*t*t*d[1]]);}return out;};
  G={X,X0:X(T0),X1:X(T1),mainY,gap,box,branches:[],main:[[X(T0),mainY],[X(2026.95),mainY]],mobile:false};
  if(VW<640){
    // phone: one tidy row per repo (sorted by start), straight lit segment on a shared time axis
    const mb={x:VW*.05,y:VH*.27,w:VW*.9,h:VH*.47},rows=[...D.branches].sort((a,b)=>a.from-b.from),rg=mb.h/(rows.length+1);
    const MX=t=>mb.x+mb.w*(t<2022?(t-2020)/2*.16:.16+(t-2022)/5*.84);
    const my=mb.y+rg*.65;
    G={X:MX,X0:MX(T0),X1:MX(T1),mainY:my,gap:rg,box:mb,branches:[],main:[[MX(T0),my],[MX(2026.95),my]],mobile:true};
    rows.forEach((b,i)=>{const y=mb.y+rg*(i+1)+rg*.65,x0=MX(b.from),x1=MX(b.to);
      const n=Math.max(3,Math.round(Math.sqrt(b.commits||9)*1.1)),commits=[];
      for(let k=0;k<n;k++){const t=b.from+.04+(b.to-b.from-.08)*(k/(n-1));commits.push({x:MX(t),y,t});}
      G.branches.push({...b,count:b.commits,y,pts:[[x0,y],[x1,y]],commits,labelX:mb.x});});
    return;
  }
  for(const b of D.branches){
    const y=mainY+b.lane*gap,x0=X(b.from),x1=X(b.to),pts=[[x0,mainY]];
    pts.push(...bez([x0,mainY],[x0+dx,mainY],[x0,y],[x0+dx,y],12));
    pts.push([b.merge?x1-dx:x1,y]);
    if(b.merge)pts.push(...bez([x1-dx,y],[x1,y],[x1-dx,mainY],[x1,mainY],12));
    const n=Math.max(3,Math.round(Math.sqrt(b.commits||9)*1.6)),commits=[];
    for(let k=0;k<n;k++){const t=b.from+.08+(b.to-b.from-.16)*(k/(n-1));commits.push({x:X(t),y,t});}
    G.branches.push({...b,count:b.commits,y,pts,commits,labelX:x0+dx+6});
  }
}
function mapResize(){M=fit(mapCv,1.5);Q=fit(chq,1);
  dots=[];const g=12;
  for(let y=Math.floor(VH*.08/g)*g;y<VH*.98;y+=g)for(let x=0;x<VW;x+=g){const v=fbm(x*.004,y*.004,7);if(v>.42)dots.push([x,y,v]);}
  buildGraph();}
mapResize();
mapCv.parentNode.addEventListener('pointermove',e=>{S.ret.x=e.clientX;S.ret.y=e.clientY;});
mapCv.parentNode.addEventListener('pointerleave',()=>{S.ret.x=-999;});
const ret={x:new Spring(VW/2,C.SMOOTH),y:new Spring(VH/2,C.SMOOTH)};
function startTrace(){if(S.started)return;S.started=true;
  if(RM){S.trace=1;S.done=true;return;}
  const t0=performance.now();const un=sub(now=>{S.trace=clamp((now-t0)/6000);if(S.trace>=1){S.done=true;un();}},0);
  [...$('#plate').querySelectorAll('.row')].forEach((r,i)=>revealIn(r,260+i*110,C.ROW,'.6rem'));
}
const tAt=px=>{const f=(px-G.X0)/(G.X1-G.X0);return f<.16?2020+f/.16*2:2022+(f-.16)/.84*5;};
const ym=t=>{const y=Math.floor(t),m=Math.min(12,Math.floor((t-y)*12)+1);return `${y}-${String(m).padStart(2,'0')}`;};
function strokeUpTo(x,pts,cut){x.beginPath();let started=false;
  for(let i=0;i<pts.length;i++){const p=pts[i];if(p[0]>cut&&i>0){const q=pts[i-1];if(q[0]<cut){const k=(cut-q[0])/(p[0]-q[0]);x.lineTo(cut,q[1]+(p[1]-q[1])*k);}break;}
    started?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]);started=true;}
  x.stroke();}
let mapT0=performance.now();
function mapFrame(now){
  if(!S.visible)return;
  const x=M.x,w=M.w,h=M.h,t=now-mapT0;x.clearRect(0,0,w,h);
  // dashed grid, crawling
  x.save();x.setLineDash([4,6]);x.lineDashOffset=-(t/7000*40%10);x.strokeStyle='#28314a';x.lineWidth=1;
  const gs=VW<640?120:180;x.beginPath();for(let gx=gs;gx<w;gx+=gs){x.moveTo(gx,0);x.lineTo(gx,h);}for(let gy=gs;gy<h;gy+=gs){x.moveTo(0,gy);x.lineTo(w,gy);}x.stroke();x.restore();
  // dot matrix
  x.fillStyle='#4a5370';for(const d of dots){x.globalAlpha=(d[2]-.42)*1.6;x.fillRect(d[0]-.75,d[1]-.75,1.5,1.5);}x.globalAlpha=1;
  // year axis
  x.font=`400 10.5px ${MONO}`;x.textAlign='center';
  for(let yr=2020;yr<=2026;yr++){if(G.mobile&&yr===2021)continue;const gx=G.X(yr);x.fillStyle='#4a5370';x.fillRect(gx,G.box.y+G.box.h+14,1,6);x.fillText(String(yr),gx,G.box.y+G.box.h+34);}
  x.textAlign='left';
  const cut=S.done?1e9:G.X0+(G.X1-G.X0)*S.trace;
  x.lineJoin='round';x.lineCap='round';
  // phone: faint full-width track per row so rows read as a table
  if(G.mobile){x.save();x.setLineDash([2,4]);x.strokeStyle='#1a2238';x.lineWidth=1;
    [G.mainY,...G.branches.map(b=>b.y)].forEach(y=>{x.beginPath();x.moveTo(G.X0,y);x.lineTo(G.X1,y);x.stroke();});x.restore();}
  // unlit graph
  x.strokeStyle='#202941';x.lineWidth=1.5;
  x.beginPath();x.moveTo(...G.main[0]);x.lineTo(...G.main[1]);x.stroke();
  G.branches.forEach(b=>{x.beginPath();b.pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();});
  // lit graph (glow + core)
  x.globalCompositeOperation='lighter';x.strokeStyle='rgba(91,124,250,.18)';x.lineWidth=8;
  strokeUpTo(x,G.main,cut);G.branches.forEach(b=>strokeUpTo(x,b.pts,cut));
  x.globalCompositeOperation='source-over';
  x.strokeStyle='#ffffff';x.lineWidth=2.5;strokeUpTo(x,G.main,cut);
  x.strokeStyle='#5b7cfa';x.lineWidth=1.6;G.branches.forEach(b=>strokeUpTo(x,b.pts,cut));
  // commits
  G.branches.forEach(b=>b.commits.forEach(c=>{const lit=c.x<=cut;
    x.fillStyle=lit?'#5b7cfa':'#0f1528';x.strokeStyle=lit?'#5b7cfa':'#4a5370';x.lineWidth=1.5;
    x.beginPath();x.arc(c.x,c.y,G.mobile?(lit?2.4:2):(lit?3.2:2.6),0,7);x.fill();x.stroke();}));
  // branch labels
  if(G.mobile){x.font=`500 10.5px ${MONO}`;
    x.fillStyle='#ffffff';x.fillText('main · karier',G.box.x,G.mainY-8);
    G.branches.forEach(b=>{const lit=b.pts[0][0]<=cut,y0=String(Math.floor(b.from)).slice(2),y1=String(Math.floor(b.to)).slice(2),meta=!b.merge?`${y0}–kini`:y0===y1?`'${y0}`:`${y0}–${y1}`;
      x.textAlign='left';x.fillStyle=lit?'#ffffff':'#4a5370';x.fillText(b.name,G.box.x,b.y-7);
      x.textAlign='right';x.fillStyle=lit?'#7b84a0':'#2a3350';x.fillText(meta,G.box.x+G.box.w,b.y-7);x.textAlign='left';});}
  if(VW>=640){x.font=`500 11px ${MONO}`;G.branches.forEach(b=>{const lit=b.pts[0][0]<=cut;
    const f0=Math.floor(b.from),f1=Math.floor(b.to),meta=!b.merge?`${f0}–kini`:f0===f1?`${f0}`:`${f0}–${f1}`,full=`${b.name}  ${meta}`;
    const lx=b.labelX+x.measureText(full).width>w-16?b.pts[0][0]-12-x.measureText(full).width:b.labelX;
    x.fillStyle=lit?'#ffffff':'#4a5370';x.fillText(b.name,lx,b.y-9);
    if(lit){x.fillStyle='#7b84a0';x.fillText(meta,lx+x.measureText(b.name+'  ').width,b.y-9);}});}
  // tags on main
  x.font=`500 11px ${MONO}`;
  MARKERS.forEach((m,i)=>{const px=G.X(m.t),py=G.mainY,lit=px<=cut;
    x.fillStyle=lit?'#5b7cfa':'#0f1528';x.strokeStyle=lit?'#5b7cfa':'#4a5370';x.lineWidth=1.5;
    x.save();x.translate(px,py);x.rotate(Math.PI/4);x.fillRect(-5,-5,10,10);x.strokeRect(-5,-5,10,10);x.restore();
    if(VW>=640){x.fillStyle=lit?'#ffffff':'#7b84a0';const ly=i%2?py+22:py-14;x.fillText(m.l,px+10,ly);}});
  // HEAD ping
  const hx=G.X(2026.95),hy=G.mainY;
  if(!RM&&S.done){const ph=(t%2600)/2600;x.strokeStyle=`rgba(91,124,250,${(1-ph)*.6})`;x.lineWidth=1.5;x.beginPath();x.arc(hx,hy,6+ph*40,0,7);x.stroke();}
  x.fillStyle=S.done?'#5b7cfa':'#28314a';x.fillRect(hx-4,hy-4,8,8);
  if(VW>=640&&S.done){x.fillStyle='#5b7cfa';x.fillText('HEAD',hx-14,hy-14);}
  // playhead
  if(!S.done&&S.trace>0){x.save();x.setLineDash([3,5]);x.strokeStyle='rgba(91,124,250,.7)';x.lineWidth=1;x.beginPath();x.moveTo(cut,G.box.y-20);x.lineTo(cut,G.box.y+G.box.h+20);x.stroke();x.restore();
    x.fillStyle='#5b7cfa';x.font=`500 11px ${MONO}`;x.fillText(ym(tAt(cut)),cut+8,G.box.y-8);}
  // reticle: inspect the nearest commit
  if(S.done&&!TOUCH&&S.ret.x>-900){
    ret.x.set(S.ret.x);ret.y.set(S.ret.y);const rx=ret.x.v,ry=ret.y.v;
    x.strokeStyle='rgba(91,124,250,.45)';x.lineWidth=1;x.beginPath();x.moveTo(rx-140,ry);x.lineTo(rx+140,ry);x.moveTo(rx,ry-140);x.lineTo(rx,ry+140);x.stroke();
    for(const d of dots){const dx=d[0]-rx,dy=d[1]-ry;if(Math.abs(dx)>80||Math.abs(dy)>80)continue;if(Math.hypot(dx,dy)<40){x.fillStyle='rgba(255,255,255,.55)';x.fillRect(d[0]-1.5,d[1]-1.5,3,3);}}
    let best=null,bd=48;G.branches.forEach(b=>b.commits.forEach(c=>{const dd=Math.hypot(c.x-rx,c.y-ry);if(dd<bd){bd=dd;best={b,c};}}));
    x.font=`500 11px ${MONO}`;
    if(best){const {b,c}=best;x.strokeStyle='#ffffff';x.lineWidth=1.5;x.beginPath();x.arc(c.x,c.y,9,0,7);x.stroke();
      const label=`${b.name} · ${ym(c.t)}`;const tw=x.measureText(label).width+16;
      x.fillStyle='rgba(15,21,40,.92)';x.fillRect(c.x+14,c.y+12,tw,24);x.strokeStyle='#5b7cfa';x.strokeRect(c.x+14,c.y+12,tw,24);
      x.fillStyle='#ffffff';x.fillText(label,c.x+22,c.y+28);}
    else{x.strokeStyle='#5b7cfa';x.strokeRect(rx-10,ry-10,20,20);x.fillStyle='#5b7cfa';x.fillText(ym(clamp(tAt(rx),2020,2026.99)),rx+16,ry+24);}
  }
}
sub(mapFrame,1000/60-2);
// pixel dissolve between hero and graph (no chequer pattern)
function paintChequer(s){
  const x=Q.x,w=Q.w,h=Q.h;x.clearRect(0,0,w,h);const cs=VW<640?14:20,rows=Math.ceil(h/cs),cols=Math.ceil(w/cs);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const base=1-r/rows,v=base*.8+(h3(r,c,1)-.5)*.35;
    if(v>s){x.fillStyle=v-s<.04?'#5b7cfa':'#f5f7fc';x.fillRect(c*cs,r*cs,cs-(v-s<.04?2:-.5),cs-(v-s<.04?2:-.5));}}
}

/* ================= TIMELINE ================= */
const tl=$('#tl');
function plateArt(cv,d,i){const {x,w,h}=fit(cv,1.5);
  x.fillStyle='#121a2e';x.fillRect(0,0,w,h);
  const H=d.h,c1=`hsl(${H} 70% 60%)`,c2='rgba(170,180,204,.5)';
  if(d.m==='dots'){for(let y=12;y<h;y+=14)for(let xx=12;xx<w;xx+=14){const v=fbm(xx*.008,y*.008,i);x.fillStyle=v>.55?c1:c2;const r=v*3.2;x.beginPath();x.arc(xx,y,r,0,7);x.fill();}}
  if(d.m==='waves'){for(let k=0;k<26;k++){x.beginPath();x.strokeStyle=k%5===0?c1:c2;x.lineWidth=k%5===0?2:1;for(let s=0;s<=80;s++){const px=s/80*w,py=h*.15+k*h*.03+Math.sin(s*.15+k*.4)*h*.06;s?x.lineTo(px,py):x.moveTo(px,py);}x.stroke();}}
  if(d.m==='grid'){const n=12;for(let a=0;a<n;a++)for(let b=0;b<n*.7;b++){const v=h3(a,b,i);x.strokeStyle=c2;x.strokeRect(a*w/n+4,b*h/(n*.7)+4,w/n-8,h/(n*.7)-8);if(v>.82){x.fillStyle=c1;x.fillRect(a*w/n+4,b*h/(n*.7)+4,w/n-8,h/(n*.7)-8);}}}
  if(d.m==='rings'){for(let k=1;k<30;k++){x.beginPath();x.strokeStyle=k%6===0?c1:c2;x.lineWidth=k%6===0?2:1;x.arc(w*.62,h*.55,k*w*.022,0,7);x.stroke();}x.fillStyle=c1;x.beginPath();x.arc(w*.62,h*.55,w*.05,0,7);x.fill();}
  if(d.m==='blocks'){for(let k=0;k<40;k++){const bw=w*(.05+h3(k,1,i)*.18),bh=h*(.05+h3(k,2,i)*.25);x.fillStyle=h3(k,3,i)>.8?c1:'rgba(170,180,204,.18)';x.fillRect(h3(k,4,i)*(w-bw),h3(k,5,i)*(h-bh),bw,bh);}}
  if(d.m==='stripes'){for(let k=0;k<w+h;k+=12){x.strokeStyle=k%96===0?c1:c2;x.lineWidth=k%96===0?3:1;x.beginPath();x.moveTo(k,0);x.lineTo(k-h,h);x.stroke();}x.fillStyle='#121a2e';x.fillRect(w*.2,h*.3,w*.6,h*.4);x.strokeStyle=c1;x.lineWidth=2;x.strokeRect(w*.2,h*.3,w*.6,h*.4);}
  // terminal window over the pattern
  const MONO='"Geist Mono Variable",ui-monospace,monospace';
  x.fillStyle='rgba(18,19,23,.35)';x.fillRect(0,0,w,h);
  const narrow=w<420,wx=w*(narrow?.04:.07),wy=h*.12,ww=w*(narrow?.92:.74),lh=Math.max(17,Math.min(22,h*.075)),wh=34+lh*(d.code.length+1);
  x.fillStyle='rgba(11,16,32,.94)';x.fillRect(wx,wy,ww,wh);x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=1;x.strokeRect(wx+.5,wy+.5,ww-1,wh-1);
  x.fillStyle='rgba(255,255,255,.06)';x.fillRect(wx,wy,ww,24);
  ['#ff5f57','#febc2e','#28c840'].forEach((c,k)=>{x.fillStyle=c;x.beginPath();x.arc(wx+14+k*14,wy+12,4,0,7);x.fill();});
  x.font=`400 11px ${MONO}`;x.fillStyle='rgba(170,180,204,.7)';x.textAlign='center';x.fillText(`~/dian — ${d.y}`,wx+ww/2,wy+16);x.textAlign='left';
  const longest=Math.max(...d.code.map(l=>l.length));x.font=`400 ${Math.round(Math.min(lh*.62,(ww-28)/(longest*.62)))}px ${MONO}`;
  d.code.forEach((ln,k)=>{const yy=wy+24+lh*(k+1);const pre=ln.slice(0,2),rest=ln.slice(2);
    x.fillStyle=pre.startsWith('$')?'#5b7cfa':pre.startsWith('✓')?'#34d399':'#7b84a0';x.fillText(pre,wx+14,yy);
    x.fillStyle=pre.startsWith('$')?'#ffffff':'rgba(255,255,255,.72)';x.fillText(rest,wx+14+x.measureText(pre).width,yy);});
  x.fillStyle='#5b7cfa';x.fillRect(wx+14,wy+24+lh*(d.code.length+1)-lh*.55,lh*.4,lh*.62);
  x.fillStyle='rgba(255,255,255,.6)';x.font=`500 11px ${MONO}`;x.fillText(`// 0${i+1} · ${d.y}`,14,h-14);
}
const rows=[];
TL.forEach((d,i)=>{
  const row=document.createElement('article');row.className='trow';
  row.innerHTML=`<div class="plate-w side"><div class="tplate"><div class="in"></div><canvas aria-hidden="true"></canvas></div></div>
    <div class="side txt"><div class="tyear">${d.y}</div><h3 class="ttitle">${d.t}<small>${d.s||''}</small></h3><p class="tcopy">${d.c}</p></div>`;
  tl.appendChild(row);
  const letters=splitLetters(row.querySelector('.tyear'));
  const cv=row.querySelector('canvas');
  rows.push({row,letters,cv,d,i,plate:row.querySelector('.tplate'),txt:row.querySelector('.txt'),played:false});
});
function paintPlates(){rows.forEach(r=>plateArt(r.cv,r.d,r.i));}
(document.fonts?document.fonts.ready:Promise.resolve()).then(paintPlates);
const yio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const r=rows.find(q=>q.row===e.target);if(!r||r.played)return;r.played=true;yio.unobserve(e.target);
  if(RM)return;
  r.letters.forEach((s,k)=>{const dx=(h3(k,r.i,2)-.5)*80,dy=(h3(k,r.i,3)-.2)*70,rot=(h3(k,r.i,4)-.5)*50;
    const sp=new Spring(0,C.YEAR,p=>{s.style.transform=`translate(${dx*(1-p)}px,${dy*(1-p)}px) rotate(${rot*(1-p)}deg)`;s.style.opacity=p;});sp.jump(0);sp.set(1,k*70);
    setTimeout(()=>{const st=new Spring(1,C.YEAR_SETTLE,o=>s.style.opacity=o);st.set(.4);},2200+k*70);});
  revealIn(r.txt.querySelector('.ttitle'),180,C.TYPE,'.4em');revealIn(r.txt.querySelector('.tcopy'),300,C.REVEAL,'.6em');
}),{rootMargin:'0% 0% -25% 0%'});
rows.forEach(r=>yio.observe(r.row));
const markRot=new Spring(0,C.FIGURE,v=>$('#mark').style.transform=`rotate(${v}deg)`);

/* ================= STUDIO + FOOTER CONTOURS ================= */
const ctrCv=$('#ctr'),fCv=$('#fctr');let CT=fit(ctrCv,1),FT=fit(fCv,1);const vis={ctr:false,f:false};
inView(ctrCv,v=>vis.ctr=v);inView(fCv,v=>vis.f=v);
sub(now=>{if(vis.ctr){CT.x.clearRect(0,0,CT.w,CT.h);contours(CT.x,CT.w,CT.h,RM?0:now*.00004,{cell:20,scale:.0024,levels:[.32,.42,.52,.62,.72],color:'rgba(11,16,32,.08)',lw:1});}
  if(vis.f){FT.x.clearRect(0,0,FT.w,FT.h);contours(FT.x,FT.w,FT.h,RM?0:now*.00004+3,{cell:20,scale:.0024,levels:[.32,.42,.52,.62,.72],color:'rgba(255,255,255,.1)',lw:1});}},1000/30);
// crawling dashed connectors + live pulse
const conns=[...document.querySelectorAll('.conn')],ringI=$('#ring i');
sub(now=>{if(!vis.ctr)return;const o=RM?0:(now/5200*40)%10;conns.forEach(c=>c.style.backgroundPosition=`${o}px 0`);
  if(!RM){const ph=(now%3200)/3200;ringI.style.transform=`scale(${1+ph*2.4})`;ringI.style.opacity=1-ph;}},1000/30);
// calendar cards in
const calIo=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;calIo.disconnect();
  [...$('#cal').querySelectorAll('.card')].forEach((c,i)=>revealIn(c,560+i*90,C.ROW,'1rem'));},{rootMargin:'0% 0% -20% 0%'});
if(!RM){[...$('#cal').querySelectorAll('.card')].forEach(c=>c.style.opacity=0);calIo.observe($('#cal'));}
// footer nav letters resolve
const GL='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_';
const fio=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;fio.disconnect();if(RM)return;
  [...$('#fnav').querySelectorAll('a')].forEach((a,i)=>{const target=a.dataset.t.toUpperCase();const t0=performance.now()+260+i*80;
    const un=sub(now=>{const el=now-t0;if(el<0){a.textContent=target.replace(/./g,()=>GL[Math.random()*GL.length|0]);return;}
      const n=Math.floor(el/45);a.textContent=target.split('').map((ch,k)=>k<n?ch:GL[Math.random()*GL.length|0]).join('');if(n>=target.length){a.textContent=a.dataset.t;un();}},40);});},{threshold:.3});
fio.observe($('#fnav'));
const fig=new Spring(1,C.FIGURE,p=>$('#figure').style.transform=`translateY(${p*40}%)`);fig.jump(RM?0:1);

/* ================= SCROLL READER (stack, chequer, rail, figure) ================= */
const hero$=$('#top'),season$=$('#perjalanan'),dwell$=$('#dwell'),tl$=$('#linimasa');
const pinned=[{inner:hero$.querySelector('.stk-inner'),shade:hero$.querySelector('.shade'),next:season$},
              {inner:season$.querySelector('.stk-inner'),shade:season$.querySelector('.shade'),next:tl$}];
const phone=matchMedia('(max-width: 639px)');
sub(()=>{
  VH=innerHeight;
  const shrink=phone.matches?0:.1;
  pinned.forEach((p,i)=>{const pr=clamp(1-p.next.getBoundingClientRect().top/VH);
    p.inner.style.transform=pr>0&&shrink>0?`scale(${1-shrink*pr})`:'';
    p.shade.style.opacity=.55*pr;p.inner.style.visibility=pr>=1?'hidden':'visible';
    if(i===0)hero.visible=pr<1;
    if(i===1)S.visible=season$.getBoundingClientRect().top<VH&&pr<1;});
  // chequered dissolve
  const dt=dwell$.getBoundingClientRect().top,D=dwell$.offsetHeight;
  const s=clamp((2*VH-dt)/(VH+D*.7));
  if(S.visible||s<1)paintChequer(RM?(s>.3?1:0):s);
  if(dt<=VH*1.1)startTrace();
  // timeline rail
  const tr=tl.getBoundingClientRect();const tp=clamp((VH*.55-tr.top)/tr.height);
  $('#thread').style.transform=`scaleY(${tp})`;$('#mark').style.top=`${tp*100}%`;markRot.set(tp*5*360);
  // timeline parallax (three layers)
  if(!RM&&VW>=900)rows.forEach(r=>{const b=r.row.getBoundingClientRect(),off=(b.top+b.height/2-VH/2)/VH;
    r.plate.style.transform=`translateY(${off*-30}px)`;r.txt.style.transform=`translateY(${off*40}px)`;r.letters.forEach(()=>{});});
  // footer figure rides back as the page bottoms out
  const bottom=clamp((scrollY+VH-(document.documentElement.scrollHeight-VH*.8))/(VH*.8));fig.set(RM?0:1-bottom);
},10);

/* ================= MISC ================= */
$('#mail').addEventListener('click',()=>{const out=$('#copied');
  (navigator.clipboard?navigator.clipboard.writeText(D.email):Promise.reject()).then(()=>out.textContent='Email tersalin ✓')
  .catch(()=>{const r=document.createRange();r.selectNodeContents($('#mail'));getSelection().removeAllRanges();getSelection().addRange(r);out.textContent='Tekan Ctrl+C untuk menyalin';});});
$('#caseBtn').addEventListener('click',()=>{const el=$('#karya');lenis?lenis.scrollTo(el,{duration:1.6}):el.scrollIntoView({behavior:'smooth'});});
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{VW=innerWidth;VH=innerHeight;heroResize();mapResize();CT=fit(ctrCv,1);FT=fit(fCv,1);if(document.body.contains(veil))B=fit(burnCv,1);paintPlates();},150);});
}
