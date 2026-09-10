(() => {
  'use strict';
  const products = [
    {name:'Solar Flare', color:'#fa704c', background:'#ad381d', description:'Coral leather, a satin sheen, and a sculpted cream sole. A little sunset energy for your everyday rotation.'},
    {name:'Voltage', color:'#d6f236', background:'#4a5b16', description:'Electric lime meets a clean cream sole. Bright, unapologetic, and made for a rotation that never blends in.'},
    {name:'Ultraviolet', color:'#ac80e0', background:'#513786', description:'Lavender leather with a deeper violet attitude. Quilted panels, soft contours, and a flash of metallic detail.'},
    {name:'Desert Bone', color:'#d6bb8e', background:'#705737', description:'Warm sand tones and a cream cupsole, finished with a glint of gold. Understated color for an everyday favorite.'},
    {name:'After Hours', color:'#373d40', background:'#283238', description:'Charcoal leather, golden heel details, and a crisp cream sole. The quietest colorway still makes an entrance.'},
    {name:'Tidal', color:'#29c5ba', background:'#166c68', description:'A fresh turquoise upper meets soft quilted texture. A cool change of pace, with the same unmistakable silhouette.'}
  ];
  const stage = document.querySelector('.showcase');
  const wheel = document.querySelector('#wheel');
  const swatches = document.querySelector('.swatches');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let step = 0, current = 0, saved = null, timer = null, toastTimer;
  try { const value = localStorage.getItem('stride-favorite'); if (value !== null && /^\d$/.test(value) && Number(value)<6) saved=Number(value); } catch {}
  products.forEach((product, i) => {
    const spoke = document.createElement('div');
    spoke.className = 'spoke' + (i === 0 ? ' selected' : '');
    spoke.style.setProperty('--i', i);
    spoke.innerHTML = `<div class="shoe-position"><span class="shoe-art" style="--x:${i % 2 * 100}%;--y:${Math.floor(i / 2) * 50}%"></span></div>`;
    wheel.append(spoke);
    const button = document.createElement('button');
    button.className = 'swatch'; button.type = 'button';
    button.style.setProperty('--swatch', product.color);
    button.setAttribute('aria-label', product.name);
    button.title=product.name;
    button.setAttribute('aria-pressed', String(i===0));
    button.addEventListener('click', () => { stopAuto(); goTo(i); });
    swatches.append(button);
  });
  function updateSaved() {
    document.querySelector('#saved-count').textContent = saved === null ? '0' : '1';
    document.querySelector('#save-label').textContent = saved === current ? 'Saved to your rotation' : 'Save this colorway';
    document.querySelector('.save-button').setAttribute('aria-pressed', String(saved===current));
  }
  function render() {
    current = ((step % 6) + 6) % 6;
    const product = products[current];
    wheel.style.transform = `scaleY(.55) rotate(${step * 60}deg)`;
    wheel.style.setProperty('--rotation', `${step * 60}deg`);
    stage.style.setProperty('--scene', product.background);
    document.querySelector('meta[name="theme-color"]').content=product.background;
    [...wheel.children].forEach((spoke,i)=>spoke.classList.toggle('selected',i===current));
    [...swatches.children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));
    document.querySelector('#product-name').textContent = `${product.name} Aurora Runner`;
    document.querySelector('#description').textContent = product.description;
    document.querySelector('#current').textContent = String(current+1).padStart(2,'0');
    updateSaved();
  }
  function goTo(index) { let delta = index-current; if(delta>3)delta-=6;if(delta< -3)delta+=6;step+=delta;render(); }
  function advance(direction) { step += direction; render(); }
  document.querySelector('.previous').addEventListener('click',()=>{stopAuto();advance(-1)});
  document.querySelector('.next').addEventListener('click',()=>{stopAuto();advance(1)});
  stage.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();stopAuto();
    if(event.key==='Home')goTo(0);else if(event.key==='End')goTo(5);else advance(event.key==='ArrowRight'?1:-1);
  });
  let start = null;
  stage.addEventListener('pointerdown',event=>{if(!event.target.closest('button,a') && event.isPrimary)start={x:event.clientX,y:event.clientY,id:event.pointerId};});
  stage.addEventListener('pointerup',event=>{if(!start||start.id!==event.pointerId)return;const dx=event.clientX-start.x,dy=event.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){stopAuto();advance(dx<0?1:-1);}});
  stage.addEventListener('pointercancel',()=>start=null);
  function notify(message){const toast=document.querySelector('.toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3000);}
  document.querySelector('.save-button').addEventListener('click',()=>{
    saved = saved === current ? null : current;
    let persistent=true;
    try{if(saved===null)localStorage.removeItem('stride-favorite');else localStorage.setItem('stride-favorite',String(saved));}catch{persistent=false;}
    updateSaved();notify(saved===null?'Colorway removed from your rotation.':`${products[current].name} saved${persistent?' on this device':' for this visit'}.`);
  });
  document.querySelector('.favorite-count').addEventListener('click',()=>{stopAuto();if(saved===null)notify('Choose a colorway and save it to your rotation.');else{goTo(saved);notify(`Your saved colorway: ${products[saved].name}.`);}});
  const autoButton=document.querySelector('#motion-toggle');
  function stopAuto(){clearInterval(timer);timer=null;autoButton.setAttribute('aria-pressed','false');autoButton.querySelector('span').textContent='off';}
  autoButton.addEventListener('click',()=>{if(timer){stopAuto();return}if(reduced.matches)return;timer=setInterval(()=>advance(1),4500);autoButton.setAttribute('aria-pressed','true');autoButton.querySelector('span').textContent='on';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopAuto()});
  reduced.addEventListener('change',()=>{if(reduced.matches)stopAuto()});
  stage.addEventListener('focusin',stopAuto);
  updateSaved();
})();
