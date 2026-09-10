const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL || 'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 const root=path.resolve(__dirname,'..');const out=path.join(root,'.impeccable/review');fs.mkdirSync(out,{recursive:true});
 await page.goto('http://127.0.0.1:4175/Sneaker-Wheel/');await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});
 for(let i=1;i<=6;i++){await page.getByRole('button',{name:'Next colorway',exact:true}).click();await page.waitForTimeout(1100);assert.equal(await page.locator('#current').textContent(),String(i%6+1).padStart(2,'0'));assert.equal(await page.locator('.swatch[aria-pressed=true]').count(),1);}
 await page.getByRole('button',{name:'Ultraviolet',exact:true}).click();await page.waitForTimeout(1100);
 await page.screenshot({path:path.join(out,'desktop-purple.png'),fullPage:true});
 await page.locator('.save-button').click();assert.equal(await page.locator('#saved-count').textContent(),'1');await page.reload();await page.getByRole('button',{name:'Show saved colorway'}).click();assert.match(await page.locator('h1').textContent(),/Ultraviolet/);
 await page.locator('.showcase').focus();await page.keyboard.press('End');assert.equal(await page.locator('#current').textContent(),'06');await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#current').textContent(),'01');
 await page.setViewportSize({width:390,height:844});await page.locator('.next').focus();await page.waitForTimeout(3200);await page.screenshot({path:path.join(out,'mobile.png'),fullPage:true});
 const mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,panel:document.querySelector('.product-panel').getBoundingClientRect().toJSON(),controls:document.querySelector('.wheel-controls').getBoundingClientRect().toJSON()}));assert.equal(mobile.overflow,false);assert(mobile.panel.bottom<mobile.controls.top);
 await page.locator('.showcase').dispatchEvent('pointerdown',{clientX:300,clientY:180,pointerId:1,isPrimary:true});await page.locator('.showcase').dispatchEvent('pointerup',{clientX:90,clientY:185,pointerId:1,isPrimary:true});assert.equal(await page.locator('#current').textContent(),'02');
 await page.setViewportSize({width:320,height:740});await page.waitForTimeout(1100);await page.screenshot({path:path.join(out,'mobile-320.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.emulateMedia({reducedMotion:'reduce'});await page.locator('.next').click();assert.equal(await page.locator('#current').textContent(),'03');assert.equal(await page.locator('#motion-toggle').isVisible(),false);
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(__dirname,'browser-qa.json'),JSON.stringify({passed:true,errors,mobile,checks:['six-color wrap','swatches','save and reload','keyboard','swipe events','mobile overflow','reduced motion']},null,2));
 await browser.close();console.log('PASS: color loop, swatches, persisted favorite, keyboard, swipe events, responsive layout, reduced motion, zero resource/runtime errors.');
})().catch(e=>{console.error(e);process.exit(1)});
