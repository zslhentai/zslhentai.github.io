import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as THREE from '../vendor/three.module.min.js';

// Run the production coordinator with a fake renderer/DOM: checks scheduling,
// not WebGL appearance or device frame rate. No browser dependency required.
const frames=new Map(),elements=new Map();let nextFrame=0,draws=0,controls,resize,interaction;
const element=key=>{
  if(!elements.has(key))elements.set(key,{
    dataset:{view:key},clientWidth:390,clientHeight:352,listeners:{},
    classList:{add(){},toggle(){}},appendChild(){},setAttribute(){},getAttribute(){return '';},
    addEventListener(type,fn){this.listeners[type]=fn;},showModal(){},close(){},
  });
  return elements.get(key);
};
const views=['overview','living','master','guest','studio','balcony','entry'].map(element);
const document={hidden:false,body:element('body'),listeners:{},
  querySelector:element,querySelectorAll:()=>views,
  addEventListener(type,fn){this.listeners[type]=fn;},
};
class Renderer{
  constructor(){this.domElement=element('canvas');this.shadowMap={};this.info={render:{calls:1,triangles:1},memory:{geometries:1,textures:1}};}
  setPixelRatio(value){this.dpr=value;}getPixelRatio(){return this.dpr;}
  setSize(){}render(){draws++;}
}
class Controls{
  constructor(){controls=this;this.target=new THREE.Vector3();this.listeners={};this.remaining=0;}
  addEventListener(type,fn){this.listeners[type]=fn;}
  update(){if(this.remaining>0){this.remaining--;this.listeners.change?.();}}
}
vm.runInNewContext(readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,''),{
  THREE:{...THREE,WebGLRenderer:Renderer},OrbitControls:Controls,document,
  buildArchitecture(){},buildFurniture(){throw new Error('structure fixture must not build furniture');},
  createMaterials:()=>({glow:{}}),X:x=>(x-644)*.015,Z:z=>(z-542)*.015,
  createInteractionController:options=>(interaction={...options,remaining:0,
    update(){if(!this.remaining)return false;this.remaining--;return true;},setState(){options.invalidate();}}),
  URLSearchParams,location:{search:'?stage=structure'},innerWidth:390,devicePixelRatio:3,
  ResizeObserver:class{constructor(fn){resize=fn;}observe(){resize();}},
  requestAnimationFrame:fn=>{const id=++nextFrame;frames.set(id,fn);return id;},
  cancelAnimationFrame:id=>frames.delete(id),
});
function flush(){let count=0;while(frames.size){assert(count++<100,'render loop failed to sleep');const [id,fn]=frames.entries().next().value;frames.delete(id);fn(count*16);}return count;}
assert(flush()>0,'initial render');assert(draws>0,'initial draw');
const initial=draws;assert.equal(flush(),0,'idle must have no animation frame callbacks');
element('#mode-toggle').listeners.click();assert.equal(frames.size,1,'night toggle schedules one frame');flush();assert(draws>initial,'night redraw');
assert.equal(JSON.parse(element('#scene').dataset.renderStats).mode,'night');
controls.remaining=4;controls.listeners.change();assert(flush()>1,'damping needs successive frames');assert.equal(controls.remaining,0);
interaction.remaining=5;interaction.invalidate();assert(flush()>1,'short interaction animation');assert.equal(interaction.remaining,0);
resize();assert.equal(frames.size,1,'resize schedules redraw');flush();
interaction.invalidate();document.hidden=true;document.listeners.visibilitychange();assert.equal(frames.size,0,'hidden tab cancels queued frame');
interaction.invalidate();assert.equal(frames.size,0,'hidden tab must stay asleep');
document.hidden=false;document.listeners.visibilitychange();assert.equal(frames.size,1,'returning tab wakes');flush();
assert.equal(frames.size,0,'settled night scene stays asleep');
console.log('PASS: production render scheduling: initial/night, idle sleep, damping, animation, resize, hidden-tab cancellation and wake.');
console.log('Limit: fake DOM/renderer; does not measure WebGL visuals, touch input or real GPU performance.');
