import * as THREE from '../vendor/three.module.min.js';
import {X,Z,SCALE,block,rect} from './architecture.js';

// Furniture footprints use the NEW drawing's pixel coordinates, converted by SCALE.
// Cabinet fronts, passage reservations and door swings remain independently auditable.
export const footprints=[];
export function buildFurniture(parent,m){
  footprints.length=0;
  const g=new THREE.Group();g.name='新户型核心家具';parent.add(g);
  const interactive={};
  const hitMaterial=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,colorWrite:false});
  const record=(name,room,b)=>footprints.push({name,room,bounds:b});
  function cabinet(name,room,b,height=1.75,front='south',mat=m.oak){
    const [a,b1,c,d]=b;record(name,room,b);rect(g,a,b1,c,d,height,mat,.06,name);
    const horizontal=['south','north'].includes(front),length=(horizontal?c-a:d-b1)*SCALE;
    const divisions=Math.max(1,Math.round(length/.48));
    for(let i=1;i<divisions;i++){
      const x=horizontal?a+(c-a)*i/divisions:front==='east'?c+.15:a-.15;
      const y=horizontal?front==='south'?d+.15:b1-.15:b1+(d-b1)*i/divisions;
      block(g,X(x),height/2+.07,Z(y),horizontal?.012:.014,height-.08,horizontal?.014:.012,m.joint);
    }
    const handleY=Math.min(height*.58,1.05)+.06;
    for(let i=0;i<divisions;i++){const x=horizontal?a+(c-a)*(i+.5)/divisions:front==='east'?c+.35:a-.35;
      const y=horizontal?front==='south'?d+.35:b1-.35:b1+(d-b1)*(i+.5)/divisions;
      block(g,X(x),handleY,Z(y),horizontal?.075:.018,.018,horizontal?.018:.075,m.metal);}
    rect(g,a,b1,c,d,.035,height>1.2?mat:m.stone,height+.06);
  }
  function cylinder(x,y,z,r,h,mat){const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,20),mat);mesh.position.set(X(x),y,Z(z));mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;}
  const detailCylinderGeometry=new THREE.CylinderGeometry(1,1,1,12);
  const leafGeometry=new THREE.SphereGeometry(1,7,5);
  function detailCylinder(x,y,z,r,h,mat){const mesh=new THREE.Mesh(detailCylinderGeometry,mat);mesh.position.set(X(x),y,Z(z));mesh.scale.set(r,h,r);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;}
  const book=(x,z,w,d,y,mat=m.paper)=>rect(g,x,z,x+w,z+d,.025,mat,y);
  function plant(x,z,size=1){detailCylinder(x,.13*size,z,.12*size,.24*size,m.clay);block(g,X(x),.38*size,Z(z),.025*size,.52*size,.025*size,m.walnut);
    for(const [dx,dy,dz,s]of [[-7,.58,-2,.17],[5,.68,1,.19],[-2,.79,5,.16]]){const leaf=new THREE.Mesh(leafGeometry,m.leaf);
      leaf.position.set(X(x+dx*size),dy*size,Z(z+dz*size));leaf.scale.set(.72*s,s,.50*s);leaf.rotation.z=dx*.035;leaf.castShadow=true;g.add(leaf);}}
  function chair(x,y,rotation=0){
    const c=new THREE.Group();c.position.set(X(x),0,Z(y));c.rotation.y=rotation;g.add(c);
    block(c,0,.46,0,.46,.09,.47,m.fabric);block(c,0,.73,-.21,.46,.51,.055,m.sage);
    for(const xx of [-.17,.17])for(const zz of [-.17,.17])block(c,xx,.23,zz,.035,.46,.035,m.walnut);
  }
  function bed(name,room,b,head){
    record(name,room,b);const [a,b1,c,d]=b;
    rect(g,a,b1,c,d,.25,m.oak,.08,name);rect(g,a+1,b1+1,c-1,d-1,.18,m.linen,.33);
    const east=head==='east';rect(g,east?c-3:a,b1,east?c:a+3,d,.95,m.sage,.06);
    rect(g,east?a+3:a+34,b1+3,east?c-34:c-3,d-3,.055,m.bedding,.52);
    rect(g,east?a+4:a+36,b1+6,east?a+34:c-4,d-6,.032,m.sage,.585);
    const mid=(b1+d)/2;
    for(const [y1,y2]of [[b1+6,mid-3],[mid+3,d-6]]){
      rect(g,east?c-31:a+5,y1,east?c-6:a+30,y2,.12,m.linen,.55);
      rect(g,east?c-27:a+9,y1+3,east?c-8:a+28,y2-3,.025,m.white,.675);
    }
  }
  function basin(a,b,c,d,{interactiveFaucet=false}={}){rect(g,a,b,c,d,.065,m.white,.86);rect(g,a+4,b+4,c-4,d-4,.009,m.basin,.896);
    const cx=(a+c)/2,stem=block(g,X(cx),1.015,Z(b+3),.025,.19,.025,m.metal,'水龙头');
    block(g,X(cx),1.1,Z(b+7),.025,.025,.15,m.metal,'水龙头出水嘴');
    block(g,X(cx+4),1.045,Z(b+2),.055,.018,.025,m.metal,'水龙头把手');
    if(interactiveFaucet){
      const waterMat=new THREE.MeshBasicMaterial({color:0xc7e8ed,transparent:true,opacity:.52,depthWrite:false});
      const water=cylinder(cx,.995,b+12,.018,.205,waterMat);water.name='厨房水流';water.visible=false;water.scale.y=.02;
      const hit=block(g,X(cx),1.04,Z(b+8),.58,.55,.58,hitMaterial,'厨房水龙头触控区');hit.castShadow=hit.receiveShadow=false;
      interactive.faucet={object:stem,hit,water};
    }}
  function toilet(name,room,b,head){
    record(name,room,b);const [a,b1,c,d]=b,west=head==='west';
    rect(g,west?a:c-9,b1,west?a+9:c,d,.69,m.white,.03,name);
    const cx=west?a+23:c-23,cy=(b1+d)/2;
    const base=cylinder(cx,.23,cy,.18,.38,m.white);base.scale.x=1.3;
    const bowl=cylinder(cx,.44,cy,.23,.08,m.white);bowl.scale.x=1.35;
    const seat=cylinder(cx,.485,cy,.165,.013,m.basin);seat.scale.x=1.38;
  }
  function shower(name,room,b){record(name,room,b);rect(g,...b,.025,m.shower,.026,name);
    const [a,b1,c,d]=b;block(g,X(c-5),1.35,Z(b1+8),.025,.7,.025,m.metal);
    block(g,X(c-5),1.7,Z(b1+13),.15,.025,.22,m.metal);
    rect(g,a+8,d-5,c-8,d-4,.008,m.metal,.056);}

  // Entry: the open entry leaf uses x230..290/y319..379; storage stays west of it.
  cabinet('玄关鞋衣柜','entry',[189,333,216,451],1.82,'east');
  cabinet('随手物抽屉','entry',[189,453,238,477],.4,'south');
  rect(g,190,454,237,476,.06,m.fabric,.48,'换鞋坐垫');
  for(const y of [371,388,405])block(g,X(216)+.025,1.45,Z(y),.08,.045,.035,m.metal,'挂衣钩');
  cabinet('归家窄柜','entry',[293,264,307,310],1.65,'west');

  // Public room: sofa faces EAST, toward the TV on the guest-bedroom shared wall.
  rect(g,353,569,592,723,.012,m.rug,.026,'客厅织物地毯');
  record('主沙发','living',[368,575,430,715]);
  rect(g,368,575,430,715,.30,m.fabric,.12,'主沙发');
  rect(g,368,575,380,715,.72,m.fabric,.13);rect(g,368,575,430,586,.58,m.fabric,.13);
  record('贵妃侧座','living',[368,703,466,718]);rect(g,368,703,466,718,.45,m.fabric,.13,'贵妃侧座');
  for(let i=0;i<3;i++){rect(g,382,588+i*38,427,623+i*38,.12,m.linen,.43);
    rect(g,374,589+i*38,391,621+i*38,.40,m.sage,.47);
    rect(g,390,623+i*38,425,624+i*38,.018,m.joint,.555);}
  const cushionA=rect(g,387,593,409,615,.17,m.bedding,.60);cushionA.rotation.y=.16;
  const cushionB=rect(g,386,676,408,698,.17,m.linen,.60);cushionB.rotation.y=-.12;
  record('茶几','living',[470,614,508,666]);cabinet('茶几底座','living',[478,622,500,658],.29,'east',m.walnut);
  rect(g,470,614,508,666,.055,m.stone,.35,'茶几台面');
  rect(g,476,625,501,654,.018,m.walnut,.407,'茶几托盘');book(480,630,13,18,.427,m.paper);book(482,632,13,18,.454,m.sage);
  detailCylinder(497,.465,644,.045,.09,m.white);
  cabinet('电视柜','living',[626,562,644,717],.4,'west',m.walnut);
  block(g,X(645)+.018,.96,Z(635),.07,.9,1.78,m.metal,'电视边框');
  const tvCanvas=typeof document==='undefined'?null:document.createElement('canvas');if(tvCanvas){tvCanvas.width=512;tvCanvas.height=256;}
  const tvContext=tvCanvas?.getContext('2d')||null,tvTexture=tvCanvas?new THREE.CanvasTexture(tvCanvas):null;if(tvTexture)tvTexture.colorSpace=THREE.SRGBColorSpace;
  const tvMaterial=new THREE.MeshStandardMaterial({color:0x182123,roughness:.3,map:tvTexture,emissive:0x000000,emissiveIntensity:0});
  const television=block(g,X(645)-.022,.96,Z(635),.04,.8,1.65,tvMaterial,'电视朝西');
  interactive.television={object:television,material:tvMaterial,context:tvContext,texture:tvTexture};
  plant(605,696,.95);
  // Dining: six chairs (three per side), no island blocking the kitchen exit.
  record('六人餐桌','living',[389,448,518,505]);
  rect(g,389,448,518,505,.07,m.stone,.73,'六人餐桌');
  for(const x of [403,501])rect(g,x,456,x+6,497,.72,m.walnut);
  for(const x of [407,453,499]){chair(x,432);chair(x,521,Math.PI);}
  for(const x of [408,453,498])for(const z of [462,491])detailCylinder(x,.818,z,.09,.018,m.white);
  for(const [x,z]of [[419,466],[464,487],[509,466]])detailCylinder(x,.85,z,.035,.075,m.clay);
  detailCylinder(453,.88,477,.075,.16,m.clay);block(g,X(453),1.03,Z(477),.025,.24,.025,m.leaf);

  // Kitchen sequence: west fridge → north sink → north preparation → east hob → south serving.
  cabinet('西侧厨房地柜','kitchen',[327,263,366,332],.8,'east');
  cabinet('北侧连续操作台','kitchen',[367,263,511,297],.8,'south');
  cabinet('东侧灶台与出菜台','kitchen',[478,298,511,380],.8,'west');
  cabinet('冰箱','kitchen',[327,334,366,378],1.85,'east',m.appliance);
  block(g,X(366)+.012,1.31,Z(356),.014,.018,.62,m.joint,'冰箱门缝');
  basin(375,267,408,291,{interactiveFaucet:true});
  rect(g,416,267,469,292,.013,m.oak,.907,'备餐台');
  rect(g,426,269,451,288,.018,m.paper,.923,'切配板');
  for(const [x,z,h]of [[461,274,.10],[468,274,.14],[474,274,.09]])detailCylinder(x,.94+h/2,z,.035,h,h>.11?m.clay:m.white);
  rect(g,482,309,507,342,.016,m.screen,.907,'灶台');
  for(const y of [318,334])cylinder(494,.93,y,.105,.012,m.metal);
  rect(g,483,350,507,378,.012,m.stone,.91,'出菜台');

  // Utility: stacked machines face west, with a separate tall cleaning cupboard and robot dock.
  record('洗烘塔','utility',[600,264,638,310]);
  rect(g,600,264,638,310,1.66,m.appliance,.04,'洗烘塔');
  for(const yy of [.47,1.28]){const drum=cylinder(598,yy,287,.19,.025,m.screen);drum.rotation.z=Math.PI/2;
    block(g,X(598),yy+.27,Z(278),.025,.055,.15,m.metal);}
  cabinet('家政工具柜','utility',[602,318,638,375],1.85,'west');
  rect(g,590,345,601,374,.35,m.walnut,0,'扫地机基站');
  cylinder(583,.065,361,.16,.11,m.appliance);

  // Guest: head WEST; sliding wardrobe frees the north bedside aisle.
  bed('次卧床','guest',[671,632,798,722],'west');
  cabinet('次卧移门衣柜','guest',[674,560,775,590],1.8,'south');
  cabinet('次卧床头柜','guest',[674,601,702,625],.44);
  // No undersized extra desk: study serves work, and this preserves foot clearance.

  // Studio: workstation WEST, book storage NORTH, a 2.0 m daybed EAST.
  record('书桌','studio',[780,314,813,413]);rect(g,780,314,813,413,.045,m.oak,.73,'书桌台面');
  rect(g,781,315,812,338,.7,m.oak,.03,'书桌端部抽屉');
  for(const x of [782,810])rect(g,x,408,x+2,411,.73,m.metal);
  book(787,350,18,26,.78,m.paper);book(788,388,17,13,.78,m.sage);book(789,389,17,13,.807,m.paper);
  detailCylinder(804,.835,326,.04,.10,m.clay);
  chair(834,372,-Math.PI/2);
  cabinet('书柜','studio',[822,309,866,331],1.65,'south',m.walnut);
  record('留宿沙发床','studio',[875,310,925,445]);
  rect(g,875,310,925,445,.27,m.oak,.06);rect(g,876,312,923,443,.17,m.linen,.33,'沙发床');
  rect(g,918,312,926,443,.65,m.sage,.08);rect(g,879,315,914,337,.11,m.fabric,.52);
  // Flat reading surface, not an unexplained centre cabinet.
  cylinder(852,.48,407,.23,.06,m.oak);cylinder(852,.25,407,.055,.45,m.metal);

  // Main suite: west access lane, facing sliding wardrobes, east-headed bed.
  cabinet('衣帽西柜','dressing',[951,442,979,548],1.85,'east');
  cabinet('衣帽东柜','dressing',[1070,442,1098,548],1.85,'west');
  bed('主卧床','master',[967,603,1095,723],'east');
  cabinet('主卧北床头柜','master',[1068,562,1095,590],.43);
  cabinet('主卧南床头柜','master',[1068,734,1095,759],.43);
  book(1070,738,15,12,.535,m.paper);book(1071,739,15,12,.562,m.sage);detailCylinder(1090,.585,746,.035,.075,m.white);
  record('主卧床尾凳','master',[928,617,949,710]);rect(g,928,617,949,710,.38,m.oak,.06,'床尾凳');rect(g,928,617,949,710,.055,m.fabric,.44);

  // Both bathrooms: devices and shower entrances, not decorative placeholder blocks.
  shower('公卫淋浴','bath',[654,307,736,353]);
  toilet('公卫马桶','bath',[655,370,697,400],'west');
  cabinet('公卫洗手柜','bath',[654,423,683,461],.8,'east');basin(655,425,682,459);
  shower('主卫淋浴','ensuite',[1035,306,1098,377]);
  rect(g,1033,306,1036,336,1.65,m.glass);rect(g,1055,376,1098,379,1.65,m.glass);
  toilet('主卫马桶','ensuite',[1050,391,1098,420],'east');
  cabinet('主卫双盆柜','ensuite',[951,310,982,418],.8,'east');
  basin(953,317,980,354);basin(953,369,980,406);

  // Landscape balcony stays a landscape balcony; all laundry is in the north utility.
  rect(g,389,793,496,820,.37,m.oak,.05,'阳台长凳');rect(g,391,794,494,819,.06,m.sage,.42);
  plant(276,807,1.15);plant(542,812,.90);plant(606,808,1.08);
  block(g,X(455),1.34,Z(384)+.045,1.02,.68,.05,m.walnut,'餐厅装饰画框');
  block(g,X(455),1.34,Z(384)+.075,.91,.57,.025,m.paper,'餐厅装饰画');
  block(g,X(455),1.34,Z(384)+.092,.34,.10,.012,m.sage,'餐厅装饰画色块');
  // Living-room curtains begin open; their invisible hit area stays easy to tap on mobile.
  const curtainMaterial=new THREE.MeshStandardMaterial({color:0xc8c0b2,roughness:1});
  const curtainLeft=block(g,X(376),.88,Z(731),.34,1.66,.12,curtainMaterial,'客厅左窗帘');
  const curtainRight=block(g,X(602),.88,Z(731),.34,1.66,.12,curtainMaterial,'客厅右窗帘');
  const curtainHit=block(g,X(489),.88,Z(731),3.72,1.72,.28,hitMaterial,'客厅窗帘触控区');curtainHit.castShadow=curtainHit.receiveShadow=false;
  block(g,X(489),1.77,Z(728),3.82,.14,.18,m.wall,'客厅窗帘盒');
  interactive.curtain={object:curtainLeft,hit:curtainHit,left:curtainLeft,right:curtainRight};

  // Visible fixtures; interactive bulbs clone the shared material so states stay independent.
  const fixtures=[[500,625,2.35,'living'],[454,477,2.35],[1081,576,1.03],[1081,747,1.03],[688,612,1.04],[797,323,1.05,'study']];
  const tableShadeGeometry=new THREE.CylinderGeometry(.08,.15,.16,14),pendantShadeGeometry=new THREE.CylinderGeometry(.23,.13,.15,18);
  for(const [x,y,h,key]of fixtures){
    cylinder(x,h-.20,y,.016,.38,m.metal);const bulb=cylinder(x,h,y,.10,.10,key?m.glow.clone():m.glow);bulb.name=key==='living'?'客厅主灯':key==='study'?'书房台灯':'住宅灯具';
    if(h<1.5){cylinder(x,.64,y,.13,.035,m.metal);const shade=new THREE.Mesh(tableShadeGeometry,key==='study'?m.sage:m.linen);shade.position.set(X(x),h+.05,Z(y));shade.castShadow=true;g.add(shade);}
    if(key){const hit=block(g,X(x),h-.02,Z(y),.55,.55,.55,hitMaterial,key+'-light-hit');hit.castShadow=hit.receiveShadow=false;interactive[key+'Light']={object:bulb,hit,bulb};}
  }
  const pendantShade=new THREE.Mesh(pendantShadeGeometry,m.linen);pendantShade.position.set(X(454),2.29,Z(477));pendantShade.castShadow=true;g.add(pendantShade);
  const livingShade=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.075,18),m.linen);livingShade.position.set(X(500),2.34,Z(625));livingShade.castShadow=true;g.add(livingShade);
  block(g,X(453),2.73,Z(477),.012,.60,.012,m.metal,'餐灯吊线');
  rect(g,479,298,481,378,.025,m.glow,1.36,'厨房工作灯');
  rect(g,396,819,489,820,.025,m.glow,.20,'阳台低位灯');
  for(const [x,y]of [[613,545],[758,470]])block(g,X(x),.82,Z(y),.035,.12,.09,m.white,'墙面开关');
  return {group:g,interactive};
}
