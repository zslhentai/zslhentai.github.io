import * as THREE from '../vendor/three.module.min.js';
export function createMaterials(){const mat=(color,roughness=.85)=>new THREE.MeshStandardMaterial({color,roughness});
  const texture=draw=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=512;draw(canvas.getContext('2d'));
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=4;return t;};
  const wood=texture(c=>{
    const shades=['#a78360','#b08c68','#a28261','#ad8965'];
    for(let row=0;row<8;row++){const y=row*64;c.fillStyle=shades[row%4];c.fillRect(0,y,512,64);
      c.fillStyle='rgba(66,48,30,.26)';c.fillRect(0,y,512,1.5);c.fillRect((row*197)%512,y,1.4,64);
      c.strokeStyle='rgba(85,61,40,.10)';c.lineWidth=.7;
      for(let j=0;j<5;j++){c.beginPath();for(let x=0;x<=512;x+=16){const yy=y+8+j*10+Math.sin(x*.017+row+j)*1.6;x?c.lineTo(x,yy):c.moveTo(x,yy);}c.stroke();}
    }
  });wood.repeat.set(.48,.48);
  const tileMap=texture(c=>{c.fillStyle='#929c97';c.fillRect(0,0,512,512);c.strokeStyle='#76827e';c.lineWidth=2;
    for(let n=0;n<=512;n+=128){c.beginPath();c.moveTo(n,0);c.lineTo(n,512);c.moveTo(0,n);c.lineTo(512,n);c.stroke();}});
  const textile=texture(c=>{c.fillStyle='#d2c7b2';c.fillRect(0,0,512,512);c.strokeStyle='rgba(108,97,78,.11)';c.lineWidth=1;
    for(let y=0;y<512;y+=8){c.beginPath();c.moveTo(0,y);c.lineTo(512,y);c.stroke();}});
  const floor=mat(0xffffff);floor.map=wood;const tile=mat(0xffffff,.68);tile.map=tileMap;const rug=mat(0xffffff,1);rug.map=textile;
  return {wall:mat(0xe4dfd3),cap:mat(0xb9b7a8),floor,tile,rug,balcony:mat(0xb8ad99),
    oak:mat(0x97714e),door:mat(0xb29979),metal:mat(0x444e4b),walnut:mat(0x624d3e),joint:mat(0x493f35),
    fabric:mat(0x999b87),linen:mat(0xdbd2c0),bedding:mat(0x8a9591),sage:mat(0x687f70),
    stone:mat(0xc8c0af,.55),appliance:mat(0xc3c8c3,.45),white:mat(0xece9df,.32),basin:mat(0x99afad,.4),
    screen:mat(0x293335,.3),shower:mat(0x9ca7a1,.55),
    glow:new THREE.MeshStandardMaterial({color:0xffe4bd,emissive:0xffbd74,emissiveIntensity:.12,roughness:.5}),
    glass:new THREE.MeshStandardMaterial({color:0xb3cfce,transparent:true,opacity:.2,roughness:.25,depthWrite:false,side:THREE.DoubleSide})};
}
