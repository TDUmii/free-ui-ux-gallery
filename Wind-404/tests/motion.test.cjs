const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

// Exercise the real controller under both system preferences without changing OS settings.
function boot(reducedInitially) {
  class Element {
    constructor(text = '') {
      this.textContent = text;
      this.children = [];
      this.events = {};
      this.attributes = {};
      this.dataset = {};
      this.style = {setProperty(name, value) { this[name] = value; }};
      const classes = new Set();
      this.classList = {
        add: name => classes.add(name),
        contains: name => classes.has(name),
        toggle: (name, on) => on ? classes.add(name) : classes.delete(name)
      };
      this.clientWidth = 1000;
      this.clientHeight = 700;
    }
    append(...items) { this.children.push(...items); }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name]; }
    getTotalLength() { return 500; }
    addEventListener(name, callback) { this.events[name] = callback; }
    querySelector() { return this.label ||= new Element(); }
    remove() { this.removed = true; }
    getBoundingClientRect() { throw Error('Animation must use cached dimensions'); }
  }
  const root = new Element();
  const body = new Element();
  const nodes = Object.fromEntries(['.motion-toggle','.leaves','.scene','.hint span','.home-link','#go-back'].map(key => [key,new Element()]));
  const line = new Element('Wind blows');
  const media = {matches:reducedInitially,addEventListener(name, callback) { this.change = callback; }};
  const document = {
    documentElement:root,body,hidden:false,referrer:'',events:{},
    querySelector:selector => nodes[selector],
    querySelectorAll:() => [line],
    createElement:() => new Element(),
    createElementNS:() => new Element(),
    addEventListener(name, callback) { this.events[name] = callback; }
  };
  const frames = new Map();
  let nextFrame = 0;
  let now = 0;
  let resize;
  const context = {
    document,window:{addEventListener() {}},performance:{now:() => now},
    matchMedia:query => query.includes('reduced-motion') ? media : {matches:false},
    ResizeObserver:class { constructor(callback) {resize=callback;} observe() {} },
    requestAnimationFrame:callback => { frames.set(++nextFrame,callback); return nextFrame; },
    cancelAnimationFrame:id => frames.delete(id),innerWidth:1000,
    URL,history:{length:1},location:{origin:'http://localhost'}
  };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../js/wind.js'),'utf8'),context);
  return {
    root,body,nodes,frames,
    click:() => nodes['.motion-toggle'].events.click(),
    preference:matches => {media.matches=matches;media.change({matches});},
    visibility:hidden => {document.hidden=hidden;document.events.visibilitychange();},
    resize:() => resize([{contentRect:{width:390,height:600}}]),
    step:() => {const batch=[...frames.values()];frames.clear();now+=17;batch.forEach(fn => fn(now));}
  };
}

test('reduced motion starts still; explicit resume enables the complete motion state', () => {
  const page=boot(true);
  assert.equal(page.frames.size,0);
  assert.equal(page.root.classList.contains('motion-enabled'),false);
  assert.equal(page.nodes['.motion-toggle'].getAttribute('aria-pressed'),'true');
  page.click();
  assert.equal(page.root.classList.contains('motion-enabled'),true);
  assert.equal(page.frames.size,1);
  page.step();
  page.click();
  assert.equal(page.root.classList.contains('motion-enabled'),false);
  assert.equal(page.frames.size,0);
});

test('system preference changes reset motion and never duplicate animation loops', () => {
  const page=boot(false);
  page.step();
  page.preference(true);
  assert.equal(page.frames.size,0);
  assert.equal(page.root.style['--wind'],'0');
  page.preference(false);
  page.preference(false);
  assert.equal(page.frames.size,1);
  for(let i=0;i<100;i++)page.step();
  assert.ok(Number.isFinite(Number(page.root.style['--wind'])));
});

test('hidden tabs stop scheduling; resized animation avoids synchronous layout reads', () => {
  const page=boot(false);
  page.resize();
  for(let i=0;i<20;i++)page.step();
  page.visibility(true);
  assert.equal(page.frames.size,0);
  page.visibility(false);
  assert.equal(page.frames.size,1);
  page.step();
});
