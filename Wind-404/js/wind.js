(() => {
  'use strict';
  const root = document.documentElement;
  const toggle = document.querySelector('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  const letters = [];
  document.querySelectorAll('.headline-line').forEach(line => {
    const words = line.textContent.split(' ');
    line.textContent = '';
    words.forEach((word, index) => {
      if (index) line.append(' ');
      const wrapper = document.createElement('span');
      wrapper.className = 'word';
      Array.from(word).forEach(char => {
        const span = document.createElement('span');
        span.className = 'letter'; span.textContent = char;
        wrapper.append(span); letters.push(span);
      });
      line.append(wrapper);
    });
  });
  const field = document.querySelector('.leaves');
  let fieldSize = {width:field.clientWidth, height:field.clientHeight};
  const fieldObserver = new ResizeObserver(([entry]) => {
    fieldSize = {width:entry.contentRect.width, height:entry.contentRect.height};
  });
  fieldObserver.observe(field);
  const svgNS = 'http://www.w3.org/2000/svg';
  const scene = document.querySelector('.scene');
  const trails = document.createElementNS(svgNS, 'g');
  trails.classList.add('traveling-wind');
  // The reference is a drawn-and-erased ribbon in front of the scene, not a rigid loop.
  scene.append(trails);
  const gusts = [];
  function spawnGust(direction = 1, strength = .8) {
    if (gusts.length >= 2) return;
    const group = document.createElementNS(svgNS, 'g');
    const curves = [
      {name:'dark', color:'#4b5962', width:8.5, delay:0,
        d:'M126 199C170 194 224 167 232 128C242 88 211 68 184 81C159 92 168 137 188 169C216 209 254 221 300 200L333 177'},
      {name:'light', color:'#aebbc5', width:10.5, delay:.18,
        d:'M105 215C164 264 214 245 277 232C344 219 421 226 451 189C481 151 456 97 425 97C391 96 380 126 399 151C416 176 459 182 513 162'}
    ].map(config => {
      const el = document.createElementNS(svgNS, 'path');
      el.setAttribute('d', config.d);
      el.setAttribute('fill', 'none');
      el.setAttribute('stroke', config.color);
      el.setAttribute('stroke-width', String(config.width));
      el.setAttribute('stroke-linecap', 'round');
      el.dataset.ribbon = config.name;
      el.style.opacity = '0';
      group.append(el);
      return {...config, el};
    });
    trails.append(group);
    curves.forEach(curve => curve.length = curve.el.getTotalLength());
    gusts.push({group, curves, direction, strength, age:0, speed:.95+strength*.15});
  }
  const particles = Array.from({length: 9}, (_, i) => {
    const el = document.createElement('span'); el.className = 'leaf';
    el.innerHTML = '<svg viewBox="0 0 26 18" fill="none"><path d="M2 9Q9-2 23 3Q22 17 9 15Z" fill="'+(i%3 ? '#f8faf3' : '#859c9f')+'"/><path d="m4 10 15-5" stroke="#728a90" stroke-width=".7"/></svg>';
    field.append(el);
    return {el, x:(i*.137)%1, y:.12+(i*.193)% .69, phase:i*2.4, vx:62+i*3, rotation:i*39};
  });
  let paused = reduced.matches, frame = 0, previous = 0, elapsed = 0, force = 0, wind = 0;
  let lastX = null, lastTime = 0;
  let nextGust = 2.5, lastPointerGust = -10, letterWind = 0;
  const windHistory = [];
  spawnGust();
  const clamp = (n,a,b) => Math.min(b,Math.max(a,n));
  const hint = document.querySelector('.hint span');
  if (coarse.matches) hint.textContent = 'Chạm nhẹ để gọi một cơn gió.';
  function renderState() {
    root.classList.toggle('motion-enabled',!paused);
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.setAttribute('aria-label',paused?'Bật chuyển động':'Tạm dừng chuyển động');
    toggle.querySelector('span').textContent = paused?'Gió đang nghỉ':'Gió đang thổi';
    document.body.classList.toggle('paused',paused);
  }
  function tick(now) {
    if (paused || document.hidden) {frame=0;return;}
    const dt = Math.min((now-(previous||now))/1000,.04); previous=now; elapsed+=dt;
    force*=Math.exp(-dt*1.6);
    if(elapsed >= nextGust){spawnGust(1,.65+Math.random()*.3);nextGust=elapsed+2.5+Math.random()*.3;}
    let localGust = 0;
    for(let i=gusts.length-1;i>=0;i--){
      const g=gusts[i];g.age+=dt*g.speed;
      g.curves.forEach(curve => {
        const t=g.age-curve.delay;
        const head=clamp(t/1.15,0,1);
        const tail=clamp((t-.72)/1.23,0,1);
        const visible=Math.max(0,head-tail)*curve.length;
        curve.el.style.strokeDasharray=`${visible.toFixed(2)} ${(curve.length*2).toFixed(2)}`;
        curve.el.style.strokeDashoffset=String(-tail*curve.length);
        curve.el.style.opacity=String(visible>.3 ? Math.min(1,t/.16)*Math.min(1,(2.08-t)/.35)*(curve.name==='dark'?.94:.8) : 0);
        const drift=g.age*g.age*8;
        curve.el.setAttribute('transform',g.direction>0 ? `translate(${drift} ${-g.age*7})` : `translate(${720-drift} ${-g.age*7}) scale(-1 1)`);
      });
      localGust+=g.direction*g.strength*2.6*Math.exp(-(((g.age-1.1)/.43)**2));
      if(g.age>2.35){g.group.remove();gusts.splice(i,1);}
    }
    const target=.25+localGust+force*.4;
    wind+=(target-wind)*(1-Math.exp(-dt*5));
    letterWind+=(wind-letterWind)*(1-Math.exp(-dt*3));
    windHistory.push({time:elapsed,value:letterWind});
    while(windHistory.length>1&&windHistory[0].time<elapsed-1.5)windHistory.shift();
    root.style.setProperty('--wind',wind.toFixed(3));
    letters.forEach((letter,i) => {
      const sampleTime=elapsed-i*.022;
      const sample=windHistory.findLast(entry=>entry.time<=sampleTime) || windHistory[0];
      const local=sample.value;
      letter.style.transform=`translate(${(local*.7).toFixed(2)}px,${(-Math.abs(local)*.3).toFixed(2)}px) rotate(${(local*1.6).toFixed(2)}deg)`;
    });
    const {width,height}=fieldSize;
    particles.forEach(p => {
      // Airborne pieces keep traveling in a light breeze, with inertia under stronger gusts.
      const desired=68+wind*35+force*26;
      p.vx+=(desired-p.vx)*(1-Math.exp(-dt*1.7));
      p.x+=p.vx*dt/Math.max(width,1);
      if(p.x>1.05)p.x=-.05;if(p.x<-.06)p.x=1.04;
      const y=p.y*height+Math.sin(p.x*12+p.phase)*16+Math.sin(elapsed*2+p.phase)*4;
      p.rotation+=(p.vx*.5+Math.sin(elapsed*2+p.phase)*20)*dt;
      p.el.style.opacity=String(Math.min(1,Math.max(0,p.x/.07),Math.max(0,(1-p.x)/.07))*.65);
      p.el.style.transform=`translate(${p.x*width}px,${y}px) rotate(${p.rotation}deg) scale(${.5+(p.phase%1)*.7})`;
    });
    frame=requestAnimationFrame(tick);
  }
  function start(){previous=0;if(!frame&&!paused&&!document.hidden)frame=requestAnimationFrame(tick);}
  toggle.addEventListener('click',()=>{paused=!paused;renderState();if(paused){cancelAnimationFrame(frame);frame=0;}else start();});
  window.addEventListener('pointermove',event=>{
    if(paused||event.pointerType==='touch')return;
    const now=performance.now();
    if(lastX!==null&&now-lastTime<160){
      const velocity=(event.clientX-lastX)/Math.max(now-lastTime,8);
      force=clamp(force+velocity*.28,-6,6);
      if(Math.abs(velocity)>.3&&elapsed-lastPointerGust>.8){
        spawnGust(Math.sign(velocity),Math.min(1.8,.65+Math.abs(velocity)*.2));lastPointerGust=elapsed;
      }
    }
    lastX=event.clientX;lastTime=now;
  },{passive:true});
  window.addEventListener('pointerdown',event=>{if(!paused&&event.pointerType==='touch'){const direction=event.clientX<innerWidth/2?1:-1;force=direction*4;if(elapsed-lastPointerGust>.8){spawnGust(direction,1.3);lastPointerGust=elapsed;}}},{passive:true});
  document.querySelector('.home-link').addEventListener('pointerenter',()=>{if(!paused)force=clamp(force+1.3,-6,6);});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();});
  reduced.addEventListener('change',event=>{paused=event.matches;force=0;wind=0;letterWind=0;windHistory.length=0;root.style.setProperty('--wind','0');letters.forEach(l=>l.style.transform='');renderState();if(paused){cancelAnimationFrame(frame);frame=0;}else start();});
  document.querySelector('#go-back').addEventListener('click',event=>{
    if(document.referrer){try{if(new URL(document.referrer).origin===location.origin&&history.length>1){event.preventDefault();history.back();}}catch{}}
  });
  renderState();start();
})();
