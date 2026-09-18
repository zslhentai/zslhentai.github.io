import * as THREE from '../vendor/three.module.min.js';
import { OrbitControls } from '../vendor/OrbitControls.js';
import { buildArchitecture,X,Z } from './architecture.js';
import { createMaterials } from './materials.js';
import { buildFurniture } from './furniture.js';
const mount=document.querySelector('#scene');
const scene=new THREE.Scene();scene.background=new THREE.Color(0xf2efe8);
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});}
catch(error){document.querySelector('#loading').hidden=true;document.querySelector('#webgl-error').hidden=false;throw error;}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;mount.appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(34,1,.1,120);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;
controls.minDistance=5;controls.maxDistance=55;controls.maxPolarAngle=Math.PI*.44;
const home=new THREE.Group();scene.add(home);const materials=createMaterials();buildArchitecture(home,materials);
if(new URLSearchParams(location.search).get('stage')!=='structure')buildFurniture(home,materials);
const hemisphere=new THREE.HemisphereLight(0xfff4df,0x86908c,1.65);scene.add(hemisphere);
const sun=new THREE.DirectionalLight(0xffeed6,2.35);sun.position.set(-8,18,12);sun.castShadow=true;
sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-11,right:11,top:9,bottom:-9,far:45});sun.shadow.normalBias=.035;scene.add(sun);
const warmLights=[[454,477,2.25,17],[424,318,2.15,7],[1035,646,1.8,7],[715,650,1.8,4],[840,360,1.8,4]].map(([x,z,y,power])=>{
  const light=new THREE.PointLight(0xffc58a,0,7,2);light.position.set(X(x),y,Z(z));light.userData.night=power;scene.add(light);return light;});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.14}));
ground.rotation.x=-Math.PI/2;ground.position.y=-.205;ground.receiveShadow=true;scene.add(ground);
let selected='overview',dirty=true;
const captions={overview:'全景 · 三室两厅双卫，公私有序',living:'客餐厅 · 向东会客，向南见光',master:'主卧 · 睡眠、衣帽与主卫',guest:'次卧 · 南向独立卧室',studio:'书房 · 工作与临时留宿',balcony:'阳台 · 与客厅直接相连',entry:'玄关 · 完整归家路径'};
const viewBounds={overview:[170,239,1117,845],living:[235,248,658,742],master:[848,286,1117,781],
  guest:[650,540,857,783],studio:[758,286,945,481],balcony:[229,730,661,845],entry:[170,300,326,538]};
// Fit each preset to the actual viewport. Only camera position and target change.
function moveToView(key='overview'){
  selected=key;const [a,b,c,d]=viewBounds[key],target=new THREE.Vector3(X((a+c)/2),.45,Z((b+d)/2));
  const plan=new URLSearchParams(location.search).get('view')==='plan';
  const direction=new THREE.Vector3(...(plan?[0,1,.0001]:[-.20,.88,.43])).normalize();
  const right=new THREE.Vector3(direction.z,0,-direction.x).normalize(),up=new THREE.Vector3().crossVectors(direction,right);
  const tanY=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),tanX=tanY*camera.aspect;
  let distance=0;for(const x of [X(a),X(c)])for(const z of [Z(b),Z(d)])for(const y of [-.2,2.95]){
    const v=new THREE.Vector3(x,y,z).sub(target);distance=Math.max(distance,Math.abs(v.dot(right))/tanX+v.dot(direction),Math.abs(v.dot(up))/tanY+v.dot(direction));}
  controls.target.copy(target);camera.position.copy(target).addScaledVector(direction,distance*1.12);
  controls.update();document.querySelector('#scene-caption').textContent=captions[key];
  dirty=true;
  document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===key);b.setAttribute('aria-pressed',String(b.dataset.view===key));});
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>moveToView(b.dataset.view)));
document.querySelector('#reset').addEventListener('click',()=>moveToView());
for(const [id,factor]of [['zoom-in',.85],['zoom-out',1.15]])document.querySelector('#'+id).addEventListener('click',()=>{camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target);controls.update();});
let night=false;const modeToggle=document.querySelector('#mode-toggle');
modeToggle.addEventListener('click',()=>{night=!night;document.body.classList.toggle('night',night);
  modeToggle.setAttribute('aria-pressed',String(night));modeToggle.setAttribute('aria-label',night?'切换为白天模式':'切换为夜间模式');modeToggle.title=modeToggle.getAttribute('aria-label');
  // Atomic switch: no per-frame lighting/exposure/shadow tween.
  scene.background.set(night?0x202a31:0xf2efe8);hemisphere.intensity=night?.85:1.65;sun.intensity=night?.55:2.35;
  sun.color.set(night?0xd4deed:0xffeed6);warmLights.forEach(l=>l.intensity=night?l.userData.night:0);
  materials.glow.emissiveIntensity=night?2.3:.12;renderer.toneMappingExposure=night?1.15:1;renderer.shadowMap.needsUpdate=true;dirty=true;});
const help=document.querySelector('#help-dialog');document.querySelector('#help-button').addEventListener('click',()=>help.showModal());
document.querySelector('#help-close').addEventListener('click',()=>help.close());help.addEventListener('click',e=>{if(e.target===help)help.close();});
new ResizeObserver(()=>{const w=mount.clientWidth,h=mount.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();moveToView(selected);}).observe(mount);
controls.addEventListener('change',()=>dirty=true);let first=true;
function render(){requestAnimationFrame(render);controls.update();if(!dirty)return;renderer.render(scene,camera);dirty=false;
  if(first){first=false;document.querySelector('#loading').classList.add('is-hidden');}
  mount.dataset.renderStats=JSON.stringify({calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,
    geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,dpr:renderer.getPixelRatio(),shadowLights:1,mode:night?'night':'day',view:selected});
}render();
