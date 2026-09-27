import * as THREE from '../vendor/three.module.min.js';
export function createMaterials(){const mat=(color,roughness=.85)=>new THREE.MeshStandardMaterial({color,roughness});
  const texture=(draw,isColor=true)=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=512;draw(canvas.getContext('2d'));
    const t=new THREE.CanvasTexture(canvas);if(isColor)t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t;};
  const wood=texture(c=>{
    const shades=['#947557','#a0805f','#8f7154','#9b7958'];
    for(let row=0;row<8;row++){const y=row*64;c.fillStyle=shades[row%4];c.fillRect(0,y,512,64);
      c.fillStyle='rgba(57,42,29,.30)';c.fillRect(0,y,512,1.5);
      for(const x of [(row*197)%512,(row*197+318)%512])c.fillRect(x,y,1.25,64);
      c.strokeStyle='rgba(72,52,36,.12)';c.lineWidth=.75;
      for(let j=0;j<4;j++){c.beginPath();for(let x=0;x<=512;x+=16){const yy=y+11+j*12+Math.sin(x*.016+row+j)*1.35;x?c.lineTo(x,yy):c.moveTo(x,yy);}c.stroke();}
    }
  });wood.repeat.set(.44,.56);
  const woodRoughness=texture(c=>{c.fillStyle='#b8b8b8';c.fillRect(0,0,512,512);
    for(let row=0;row<8;row++){const y=row*64;c.fillStyle=row%3===0?'#a9a9a9':'#c0c0c0';c.fillRect(0,y,512,64);
      c.fillStyle='rgba(82,82,82,.28)';c.fillRect(0,y,512,2);}},false);woodRoughness.repeat.copy(wood.repeat);
  const tileMap=texture(c=>{c.fillStyle='#929c97';c.fillRect(0,0,512,512);c.strokeStyle='#76827e';c.lineWidth=2;
    for(let n=0;n<=512;n+=128){c.beginPath();c.moveTo(n,0);c.lineTo(n,512);c.moveTo(0,n);c.lineTo(512,n);c.stroke();}});
  const textile=texture(c=>{c.fillStyle='#d2c7b2';c.fillRect(0,0,512,512);c.strokeStyle='rgba(108,97,78,.11)';c.lineWidth=1;
    for(let y=0;y<512;y+=8){c.beginPath();c.moveTo(0,y);c.lineTo(512,y);c.stroke();}});
  const floor=mat(0xffffff,.72);floor.map=wood;floor.roughnessMap=woodRoughness;
  const tile=mat(0xffffff,.78);tile.map=tileMap;const rug=mat(0xffffff,1);rug.map=textile;
  return {wall:mat(0xded9ce,.92),cap:mat(0xaaa99f,.86),trim:mat(0xc8c1b4,.84),skirting:mat(0xc3bcae,.9),floor,tile,rug,balcony:mat(0xaaa18f,.88),
    oak:mat(0x98704d,.76),door:mat(0xa98563,.78),metal:mat(0x3c4744,.34),walnut:mat(0x5b4436,.72),joint:mat(0x44392f,.8),
    fabric:mat(0x8d907e,1),linen:mat(0xd6ccbb,.96),bedding:mat(0x7d8985,.9),sage:mat(0x60786b,.94),
    paper:mat(0xc7b798,.92),clay:mat(0xa86f52,.88),leaf:mat(0x466b56,.96),
    stone:mat(0xbdb4a4,.48),appliance:mat(0xb9bfbb,.42),white:mat(0xe9e4da,.4),basin:mat(0x91a9a5,.38),
    screen:mat(0x293335,.3),shower:mat(0x9ca7a1,.55),
    glow:new THREE.MeshStandardMaterial({color:0xffe4bd,emissive:0xffbd74,emissiveIntensity:.12,roughness:.5}),
    glass:new THREE.MeshStandardMaterial({color:0xb3cfce,transparent:true,opacity:.2,roughness:.25,depthWrite:false,side:THREE.DoubleSide})};
}
