import * as THREE from '../vendor/three.module.min.js';

// Sole plan source: user's September 17 drawing (1312 × 1199 px).
// Uniform tracing scale, NOT surveyed dimensions: written dimensions disagree.
// North = -Z. No coordinates from the previous residential model are retained.
export const SCALE = .015;
export const X = px => (px - 644) * SCALE;
export const Z = py => (py - 542) * SCALE;
export const CUT = 1.25;
const unitBox = new THREE.BoxGeometry(1,1,1);
export function block(parent,x,y,z,w,h,d,material,name='') {
  const mesh=new THREE.Mesh(unitBox,material);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);
  mesh.castShadow=h>.08;mesh.receiveShadow=true;mesh.name=name;parent.add(mesh);return mesh;
}
export function rect(parent,x1,y1,x2,y2,h,material,elevation=0,name='') {
  return block(parent,X((x1+x2)/2),elevation+h/2,Z((y1+y2)/2),(x2-x1)*SCALE,h,(y2-y1)*SCALE,material,name);
}
export const outline=[[170,311],[292,311],[292,239],[655,239],[655,286],[1117,286],
  [1117,781],[658,781],[658,845],[222,845],[222,497],[170,497]];
export const rooms={
  entry:{label:'玄关',rect:[184,324,308,522],target:[265,423]},
  living:{label:'客餐厅',rect:[310,398,641,726],target:[475,548]},
  kitchen:{label:'厨房',rect:[325,257,514,389],target:[420,320]},
  utility:{label:'家政',rect:[529,257,638,397],target:[571,325]},
  bath:{label:'公卫',rect:[653,305,738,470],target:[695,386]},
  studio:{label:'书房',rect:[773,305,928,470],target:[847,386]},
  corridor:{label:'私区走廊',rect:[641,480,842,542],target:[744,512]},
  guest:{label:'次卧',rect:[669,560,838,766],target:[753,665]},
  master:{label:'主卧',rect:[860,549,1100,765],target:[978,638]},
  dressing:{label:'衣帽区',rect:[858,438,1100,549],target:[995,494]},
  ensuite:{label:'主卫',rect:[950,305,1100,424],target:[1030,359]},
  balcony:{label:'景观阳台',rect:[240,748,642,829],target:[444,788]},
};
// Door leaves are sectioned at the same height as the walls; clear opening is real-scale.
export const doors=[
  {name:'入户',hinge:[230,319],width:60,closed:0,open:Math.PI/2,connects:['outside','entry']},
  {name:'公卫',hinge:[738,475],width:48,closed:Math.PI,open:-Math.PI/2,connects:['corridor','bath']},
  {name:'书房',hinge:[774,476],width:47,closed:0,open:-Math.PI/2,connects:['corridor','studio']},
  {name:'次卧',hinge:[837,548],width:51,closed:Math.PI,open:Math.PI/2,connects:['corridor','guest']},
  {name:'主卧套房',hinge:[850,485],width:58,closed:Math.PI/2,open:0,connects:['corridor','dressing']},
  {name:'主卫移门',hinge:[986,431],width:47,sliding:true,closed:0,connects:['dressing','ensuite']},
];
export function buildArchitecture(parent,m) {
  const group=new THREE.Group();group.name='新户型建筑剖切';parent.add(group);
  const shape=new THREE.Shape(outline.map(([x,y])=>new THREE.Vector2(X(x),-Z(y))));
  const slab=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.20,bevelEnabled:false}),m.floor);
  slab.rotation.x=-Math.PI/2;slab.position.y=-.20;slab.receiveShadow=true;group.add(slab);
  for(const key of ['kitchen','utility','bath','ensuite','balcony'])rect(group,...rooms[key].rect,.025,key==='balcony'?m.balcony:m.tile,0,key+'-floor');
  rect(group,184,324,308,489,.025,m.tile);rect(group,238,489,308,529,.025,m.tile);
  const walls=[
    [178,319,228,319,16],[178,319,178,489,16],[178,489,230,489,16],
    [230,489,230,837,16],[650,745,650,783,16],[650,827,650,837,16],
    [650,773,693,773,16],[820,773,889,773,16],[1060,773,1109,773,16],
    [1109,295,1109,485,16],[1109,540,1109,773,16],
    [1024,295,1109,295,16],[884,295,974,295,16],[731,295,772,295,16],
    [647,295,682,295,16],[647,248,647,295,16],[599,248,647,248,18],
    [459,248,529,248,18],[301,248,352,248,18],[290,319,316,319,16],
    [316,248,316,389,16],[520,248,520,385,14],[316,385,359,385,9],
    [480,385,520,385,9],[595,385,647,385,14],
    [646,295,646,475,14],[745,295,745,475,14],[646,475,690,475,12],
    [766,295,766,475,14],[766,475,774,475,12],[821,475,936,475,12],[937,295,937,475,16],
    [937,431,986,431,12],[1033,431,1109,431,12],
    [658,548,786,548,16],[837,548,849,548,16],[658,548,658,773,16],[849,548,849,773,16],
    [850,475,850,485,12],[850,543,850,548,12],
    [230,737,281,737,16],[332,737,365,737,10],[613,737,658,737,16],
  ];
  for(const [x1,y1,x2,y2,t]of walls){const w=Math.max(t,Math.abs(x2-x1)),d=Math.max(t,Math.abs(y2-y1));
    const b=[(x1+x2-w)/2,(y1+y2-d)/2,(x1+x2+w)/2,(y1+y2+d)/2];
    rect(group,...b,CUT,m.wall,0,'wall');rect(group,...b,.035,m.cap,CUT,'wall-cap');}
  function window(x1,y1,x2,y2,sill=.65,height=.9){
    const horizontal=y1===y2,length=Math.hypot(x2-x1,y2-y1)*SCALE,x=X((x1+x2)/2),z=Z((y1+y2)/2);
    block(group,x,sill/2,z,horizontal?length:.14,sill,horizontal?.14:length,m.wall,'window-sill');
    block(group,x,sill+height/2,z,horizontal?length:.025,height,horizontal?.025:length,m.glass,'glass');
    for(const yy of [sill,sill+height])block(group,x,yy,z,horizontal?length:.055,.045,horizontal?.055:length,m.metal);
    const n=Math.max(2,Math.ceil(length/.9));for(let i=0;i<=n;i++)block(group,x+(horizontal?(i/n-.5)*length:0),sill+height/2,z+(horizontal?0:(i/n-.5)*length),.045,height,.045,m.metal);
  }
  [[352,248,459,248],[529,248,599,248],[682,295,731,295],[772,295,884,295],
    [974,295,1024,295],[1109,485,1109,540],[693,773,820,773],[889,773,1060,773]].forEach(v=>window(...v));
  window(240,837,642,837,.12,.95);window(650,783,650,827,.12,.95);window(365,737,613,737,.03,1.72);
  // Shower screen with an actual access gap; not a sealed internal cell.
  rect(group,653,357,694,361,1.55,m.glass);
  doors.forEach(d=>{const width=d.width*SCALE,hinge=new THREE.Group();hinge.position.set(X(d.hinge[0]),0,Z(d.hinge[1]));group.add(hinge);
    if(d.sliding)block(hinge,width*1.4,.61,0,width,1.22,.055,m.door,d.name);
    else{const leaf=block(hinge,Math.cos(d.open)*width/2,.61,Math.sin(d.open)*width/2,width,1.22,.055,m.door,d.name);leaf.rotation.y=-d.open;
      block(hinge,Math.cos(d.open)*width*.86,.96,Math.sin(d.open)*width*.86+.045,.065,.035,.06,m.metal);}
    block(hinge,0,CUT/2,0,.06,CUT,.1,m.oak);});
  block(group,X(284),.63,Z(763),.055,1.26,.77,m.glass,'阳台平开门');
  return group;
}
