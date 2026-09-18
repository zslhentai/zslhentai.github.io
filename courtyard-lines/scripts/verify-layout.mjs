import assert from 'node:assert/strict';
import * as THREE from '../vendor/three.module.min.js';
import {buildArchitecture,rooms,doors,SCALE,X,Z} from '../src/architecture.js';
import {buildFurniture,footprints} from '../src/furniture.js';

// Independent acceptance checks: no browser, no image/wording snapshots and no file writes.
const material=new THREE.MeshBasicMaterial();
const mats=new Proxy({}, {get:()=>material});
const home=new THREE.Group();buildArchitecture(home,mats);buildFurniture(home,mats);
const intersects=(a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];
// Inspect actual wall meshes, not just furniture registrations. This catches buried cabinetry.
home.updateMatrixWorld(true);
const walls=[];home.traverse(o=>{if(o.name==='wall')walls.push(new THREE.Box3().setFromObject(o));});
for(const f of footprints){
  const [a,b,c,d]=f.bounds;
  for(const w of walls)assert(!intersects([X(a)+.002,Z(b)+.002,X(c)-.002,Z(d)-.002],
    [w.min.x,w.min.z,w.max.x,w.max.z]),`${f.name}: intersects wall`);
}
for(const d of doors.filter(d=>!d.sliding)){
  assert(d.width*SCALE>=.70,`${d.name}: opening too narrow`);
  let delta=d.open-d.closed;while(delta>Math.PI)delta-=Math.PI*2;while(delta<-Math.PI)delta+=Math.PI*2;
  for(let i=0;i<=36;i++)for(let j=1;j<=24;j++){
    const angle=d.closed+delta*i/36,r=d.width*j/24;
    const x=d.hinge[0]+Math.cos(angle)*r,y=d.hinge[1]+Math.sin(angle)*r;
    for(const f of footprints)assert(!intersects([x-1,y-1,x+1,y+1],f.bounds),`${d.name}: swing intersects ${f.name}`);
  }
}
// These paths are required by the brief, reserved independently of model implementation.
for(const [name,b]of [
  ['entry to living',[245,382,306,725]],
  ['living to balcony',[287,733,328,784]],
  ['public to private corridor',[535,490,843,536]],
  ['suite entry to sleeping area',[859,552,918,753]],
  ['dressing aisle',[985,445,1063,548]],
])for(const f of footprints)assert(!intersects(b,f.bounds),`${name}: blocked by ${f.name}`);
for(const x of [407,453,499])for(const y of [405,548]){
  const pulledChair=[x-16,y-16,x+16,y+16];
  for(const f of footprints)assert(!intersects(pulledChair,f.bounds),`pulled dining chair: ${f.name}`);
}
for(const f of footprints.filter(f=>/床$/.test(f.name))){
  const r=rooms[f.room].rect,b=f.bounds;
  assert(b[0]>=r[0]&&b[2]<=r[2]&&b[1]>=r[1]&&b[3]<=r[3],`${f.name}: outside room`);
}
const byName=name=>footprints.find(f=>f.name===name).bounds;
const guest=byName('次卧床'),wardrobe=byName('次卧移门衣柜');
assert((guest[1]-wardrobe[3])*SCALE>=.60,'guest north bedside clearance');
assert((rooms.guest.rect[3]-guest[3])*SCALE>=.60,'guest south bedside clearance');
assert((rooms.guest.rect[2]-guest[2])*SCALE>=.60,'guest bed end clearance');
assert(footprints.filter(f=>f.name.includes('马桶')).length===2,'two toilets required');
assert(footprints.some(f=>f.name==='洗烘塔'&&f.room==='utility'),'utility separate from balcony');
assert(byName('主沙发')[2]<byName('电视柜')[0],'east-facing living composition');
console.log('PASS: registered furniture vs walls, 5 door sweeps, 5 reserved routes, 6 pulled chairs, beds, two bathrooms, utility and sofa/TV relation.');
console.log('Approximate guest clearances (m): north .63 / south .66 / foot .60; dressing aisle 1.17; corridor .93.');
console.log('Limits: proportion-based model, not a construction or accessibility certification; sliding cabinetry assumed.');
