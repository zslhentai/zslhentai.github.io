import * as THREE from '../vendor/three.module.min.js';
import { OrbitControls } from '../vendor/OrbitControls.js';

const mount = document.querySelector('#scene');
const loading = document.querySelector('#loading');
const errorMessage = document.querySelector('#webgl-error');
const caption = document.querySelector('#scene-caption');

const palette = {
  cream: 0xe5ddd0,
  plaster: 0xf3eee5,
  warmWhite: 0xf9f6ef,
  oak: 0xae784d,
  paleOak: 0xc99e72,
  walnut: 0x684632,
  sage: 0x778873,
  sageDark: 0x495f50,
  linen: 0xc9c0b0,
  grey: 0x929995,
  charcoal: 0x303633,
  stone: 0xaaa49b,
  clay: 0xad6d56,
  brass: 0x9b8054,
  glass: 0xc9d8d3,
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf2efe8);
scene.fog = new THREE.FogExp2(0xf2efe8, 0.013);

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (error) {
  loading.hidden = true;
  errorMessage.hidden = false;
  throw error;
}

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(mount.clientWidth, mount.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
mount.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(28, mount.clientWidth / mount.clientHeight, 0.1, 120);
camera.position.set(23, 23, 26);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.065;
controls.screenSpacePanning = true;
controls.minDistance = 12;
controls.maxDistance = 55;
controls.minPolarAngle = Math.PI * 0.18;
controls.maxPolarAngle = Math.PI * 0.47;
controls.target.set(0, 0.2, 0);
controls.update();

const materials = {
  plaster: mat(palette.plaster, 0.92),
  cream: mat(palette.cream, 0.82),
  white: mat(palette.warmWhite, 0.84),
  oak: mat(palette.oak, 0.64),
  paleOak: mat(palette.paleOak, 0.68),
  walnut: mat(palette.walnut, 0.64),
  sage: mat(palette.sage, 0.82),
  sageDark: mat(palette.sageDark, 0.7),
  linen: mat(palette.linen, 0.98),
  grey: mat(palette.grey, 0.88),
  charcoal: mat(palette.charcoal, 0.58),
  stone: mat(palette.stone, 0.44),
  clay: mat(palette.clay, 0.8),
  brass: mat(palette.brass, 0.42, 0.35),
  black: mat(0x242825, 0.48, 0.25),
  leaf: mat(0x58705b, 0.86),
  leafLight: mat(0x799078, 0.88),
  terracotta: mat(0xa66e58, 0.86),
  floorPublic: texturedMaterial(makeWoodTexture('#b88e64', '#8f6242', 512, 72), 0.72),
  floorPrivate: texturedMaterial(makeWoodTexture('#c8a47d', '#a27653', 512, 56), 0.8),
  tile: texturedMaterial(makeTileTexture('#aaa79f', 'rgba(73,76,74,.28)'), 0.62),
  bathTile: texturedMaterial(makeTileTexture('#8f9693', 'rgba(52,61,60,.34)'), 0.54),
};

function mat(color, roughness = 0.8, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function texturedMaterial(map, roughness = 0.8) {
  return new THREE.MeshStandardMaterial({ map, roughness });
}

function canvasTexture(size, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  draw(ctx, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

function makeWoodTexture(base, grain, size, bands) {
  const texture = canvasTexture(size, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = grain;
    ctx.globalAlpha = 0.23;
    for (let y = 0; y < s; y += bands) {
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x <= s; x += 9) {
        const wave = Math.sin(x * 0.035 + y) * 2.2 + Math.sin(x * 0.011) * 1.1;
        x === 0 ? ctx.moveTo(x, y + wave) : ctx.lineTo(x, y + wave);
      }
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.08)';
      ctx.fillRect(0, y + bands - 2, s, 1);
    }
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(5, 4);
  return texture;
}

function makeTileTexture(base = '#aaa79f', grout = 'rgba(73,76,74,.28)') {
  const texture = canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = grout;
    ctx.lineWidth = 3;
    for (let n = 0; n <= s; n += 128) {
      ctx.beginPath(); ctx.moveTo(n, 0); ctx.lineTo(n, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, n); ctx.lineTo(s, n); ctx.stroke();
    }
    for (let i = 0; i < 700; i++) {
      const a = Math.random() * .035;
      ctx.fillStyle = `rgba(60,58,54,${a})`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 1.2, 1.2);
    }
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 3);
  return texture;
}

function makeFabricTexture(base = '#c9c0b1', line = '#9f9688') {
  const texture = canvasTexture(256, (ctx, s) => {
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = line;
    ctx.globalAlpha = .16;
    for (let i = 0; i < s; i += 5) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, s); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(s, i); ctx.stroke();
    }
  });
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

function makeRugTexture(style) {
  return canvasTexture(512, (ctx, s) => {
    const schemes = {
      living: ['#a9a194', '#667669', '#ded8cd'],
      master: ['#c9b9a7', '#9f8069', '#e7ded3'],
      guest: ['#b3b8b5', '#727d79', '#dad7d0'],
      studio: ['#929c7f', '#53654f', '#c8c3ad'],
    };
    const [base, accent, light] = schemes[style];
    ctx.fillStyle = base; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = light;
    ctx.beginPath(); ctx.ellipse(s * .22, s * .32, s * .32, s * .2, -.35, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = accent; ctx.lineWidth = 18;
    ctx.beginPath(); ctx.arc(s * .72, s * .66, s * .32, .2, 4.7); ctx.stroke();
    ctx.globalAlpha = .2; ctx.lineWidth = 2;
    for (let y = 8; y < s; y += 10) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(s, y + Math.sin(y) * 2); ctx.stroke(); }
  });
}

function makeArtTexture(kind) {
  return canvasTexture(512, (ctx, s) => {
    ctx.fillStyle = '#f1ece2'; ctx.fillRect(0, 0, s, s);
    if (kind === 'living') {
      ctx.fillStyle = '#82907d'; ctx.beginPath(); ctx.moveTo(40, 385); ctx.bezierCurveTo(140, 90, 310, 90, 470, 210); ctx.lineTo(470, 430); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#b87962'; ctx.beginPath(); ctx.arc(355, 150, 68, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#303630'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(88, 440); ctx.quadraticCurveTo(250, 215, 430, 360); ctx.stroke();
    } else if (kind === 'master') {
      ctx.fillStyle = '#d6bca5'; ctx.beginPath(); ctx.arc(205, 260, 140, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#798576'; ctx.fillRect(260, 80, 105, 330);
      ctx.strokeStyle = '#765a48'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(80, 390); ctx.lineTo(430, 130); ctx.stroke();
    } else if (kind === 'guest') {
      ctx.strokeStyle = '#68716d'; ctx.lineWidth = 12; ctx.strokeRect(90, 90, 180, 260);
      ctx.fillStyle = '#aeb3af'; ctx.fillRect(235, 175, 190, 220);
      ctx.fillStyle = '#b68968'; ctx.fillRect(80, 380, 190, 38);
    } else {
      ctx.strokeStyle = '#546656'; ctx.lineWidth = 5;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath(); ctx.moveTo(256, 440); ctx.bezierCurveTo(210 - i * 8, 330, 115 + i * 25, 190 - i * 9, 90 + i * 15, 74); ctx.stroke();
      }
      ctx.fillStyle = '#b98563'; ctx.beginPath(); ctx.arc(375, 125, 45, 0, Math.PI * 2); ctx.fill();
    }
  });
}

const fabricMat = texturedMaterial(makeFabricTexture('#b9ae9e', '#827a70'), .98);
const fabricLightMat = texturedMaterial(makeFabricTexture('#d7ccbc', '#9c9285'), .98);
const glassMat = new THREE.MeshPhysicalMaterial({ color: palette.glass, transmission: .35, transparent: true, opacity: .3, roughness: .18, metalness: 0, side: THREE.DoubleSide });

const home = new THREE.Group();
home.rotation.y = -0.02;
scene.add(home);

const practicalLights = [];
const glowMaterials = [];

function practicalLight(parent, x, y, z, nightIntensity, dayIntensity = .025, color = 0xffc983, distance = 6) {
  const light = new THREE.PointLight(color, dayIntensity, distance, 2);
  light.position.set(x, y, z);
  light.userData.dayIntensity = dayIntensity;
  light.userData.nightIntensity = nightIntensity;
  parent.add(light);
  practicalLights.push(light);
  return light;
}

function glowMarker(parent, x, y, z, radius = .055) {
  const material = new THREE.MeshStandardMaterial({ color: 0xffe3b5, emissive: 0xffb45f, emissiveIntensity: 0 });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 8), material);
  mesh.position.set(x, y, z); parent.add(mesh); glowMaterials.push(material); return mesh;
}

function box(parent, x, y, z, w, h, d, material, opts = {}) {
  const geometry = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotation.y = opts.ry || 0;
  mesh.castShadow = opts.cast !== false;
  mesh.receiveShadow = opts.receive !== false;
  if (opts.name) mesh.name = opts.name;
  parent.add(mesh);
  return mesh;
}

function cyl(parent, x, y, z, radius, height, material, segments = 20, ry = 0) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, segments), material);
  mesh.position.set(x, y, z); mesh.rotation.y = ry; mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}

function groupAt(parent, x, z, ry = 0) {
  const group = new THREE.Group(); group.position.set(x, 0, z); group.rotation.y = ry; parent.add(group); return group;
}

function rug(parent, x, z, w, d, style, ry = 0) {
  const material = new THREE.MeshStandardMaterial({ map: makeRugTexture(style), roughness: 1, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), material);
  mesh.rotation.x = -Math.PI / 2; mesh.rotation.z = ry; mesh.position.set(x, .205, z); mesh.receiveShadow = true; parent.add(mesh); return mesh;
}

function floor(parent, x, z, w, d, material) { return box(parent, x, .08, z, w, .16, d, material, { cast: false }); }
function wallX(parent, x, z, length, material = materials.plaster, h = 2.75) { return box(parent, x, h / 2 + .16, z, length, h, .22, material); }
function wallZ(parent, x, z, length, material = materials.plaster, h = 2.75) { return box(parent, x, h / 2 + .16, z, .22, h, length, material); }

function windowX(parent, x, z, w, h = 1.55, sill = .72) {
  const g = groupAt(parent, x, z);
  box(g, 0, sill + h / 2, 0, w, h, .055, glassMat, { cast: false });
  box(g, 0, sill, -.035, w + .12, .075, .13, materials.charcoal);
  box(g, 0, sill + h, -.035, w + .12, .075, .13, materials.charcoal);
  box(g, -w / 2, sill + h / 2, -.035, .065, h, .13, materials.charcoal);
  box(g, w / 2, sill + h / 2, -.035, .065, h, .13, materials.charcoal);
  box(g, 0, sill + h / 2, -.035, .055, h, .1, materials.charcoal);
  box(g, 0, sill - .035, .075, w + .28, .1, .34, materials.stone);
  return g;
}

function windowZ(parent, x, z, w, h = 1.55, sill = .72) {
  const g = windowX(parent, x, z, w, h, sill); g.rotation.y = Math.PI / 2; return g;
}

function door(parent, x, z, ry = 0, open = .45, colorMat = materials.paleOak) {
  const g = groupAt(parent, x, z, ry);
  box(g, 0, 1.27, 0, .07, 2.32, .08, materials.charcoal);
  box(g, .88, 1.27, 0, .07, 2.32, .08, materials.charcoal);
  box(g, .44, 2.41, 0, .95, .07, .08, materials.charcoal);
  const pivot = new THREE.Group(); pivot.rotation.y = open; g.add(pivot);
  box(pivot, .4, 1.25, 0, .8, 2.22, .07, colorMat);
  box(pivot, .4, 1.58, -.041, .59, .018, .012, materials.walnut, { cast: false });
  box(pivot, .4, .72, -.041, .59, .018, .012, materials.walnut, { cast: false });
  cyl(pivot, .68, 1.26, -.08, .025, .055, materials.brass, 12); 
  const handle = pivot.children.at(-1); handle.rotation.x = Math.PI / 2;
  return g;
}

function sofa(parent, x, z, ry = 0, width = 4.05, color = fabricLightMat) {
  const g = groupAt(parent, x, z, ry);
  box(g, 0, .43, 0, width, .42, 1.32, color);
  box(g, 0, .92, -.54, width, .68, .22, color);
  box(g, -width / 2 + .12, .7, 0, .25, .66, 1.28, color);
  box(g, width / 2 - .12, .7, 0, .25, .66, 1.28, color);
  const cushions = Math.round(width / 1.3);
  for (let i = 0; i < cushions; i++) {
    const cx = -width / 2 + .7 + i * ((width - 1.4) / Math.max(1, cushions - 1));
    box(g, cx, .72, -.33, 1.05, .16, .72, color, { ry: -.02 + i * .015 });
    if (i < cushions - 1) box(g, cx + .55, .81, -.33, .018, .025, .66, materials.grey, { cast: false });
  }
  return g;
}

function loungeChair(parent, x, z, ry = 0, color = materials.sage) {
  const g = groupAt(parent, x, z, ry);
  box(g, 0, .48, 0, 1.12, .22, 1.02, color);
  box(g, 0, .92, -.42, 1.12, .78, .18, color, { ry: 0 });
  [[-.43,-.36],[.43,-.36],[-.43,.36],[.43,.36]].forEach(([lx,lz]) => box(g, lx, .22, lz, .07, .42, .07, materials.walnut));
  return g;
}

function coffeeTable(parent, x, z) {
  const g = groupAt(parent, x, z);
  cyl(g, -.58, .38, 0, .82, .11, materials.stone, 32);
  cyl(g, -.58, .19, 0, .29, .38, materials.walnut, 24);
  box(g, .82, .35, .13, 1.12, .13, .84, materials.walnut, { ry: .07 });
  box(g, .82, .17, .13, .72, .34, .5, materials.charcoal, { ry: .07 });
  box(g, .68, .47, .12, .36, .05, .25, materials.cream, { ry: .07 });
  return g;
}

function diningChair(parent, x, z, ry = 0, color = materials.sage) {
  const g = groupAt(parent, x, z, ry);
  box(g, 0, .48, 0, .72, .11, .72, color);
  box(g, 0, .9, -.31, .72, .8, .11, color);
  [[-.28,-.27],[.28,-.27],[-.28,.27],[.28,.27]].forEach(([lx,lz]) => box(g, lx, .23, lz, .06, .46, .06, materials.walnut));
  return g;
}

function diningSet(parent, x, z) {
  const g = groupAt(parent, x, z);
  box(g, 0, .78, 0, 3.4, .15, 1.62, materials.paleOak);
  box(g, -1.14, .38, 0, .16, .76, .82, materials.walnut);
  box(g, 1.14, .38, 0, .16, .76, .82, materials.walnut);
  [-1.18, 0, 1.18].forEach(px => { diningChair(g, px, -1.18, 0, px === 0 ? materials.clay : materials.sage); diningChair(g, px, 1.18, Math.PI, materials.linen); });
  cyl(g, -.35, .93, 0, .22, .27, materials.cream, 24);
  const bowl = g.children.at(-1); bowl.scale.y = .5;
  pendant(g, 0, 0, 2.45, 3);
  return g;
}

function pendant(parent, x, z, y = 2.45, count = 1) {
  const g = groupAt(parent, x, z);
  for (let i = 0; i < count; i++) {
    const px = (i - (count - 1) / 2) * .72;
    box(g, px, y + .28, 0, .025, .55, .025, materials.charcoal, { cast: false });
    const shade = new THREE.Mesh(new THREE.ConeGeometry(.24, .3, 24, 1, true), materials.brass);
    shade.position.set(px, y, 0); shade.rotation.x = Math.PI; shade.castShadow = true; g.add(shade);
    practicalLight(g, px, y - .13, 0, .78, .045, 0xffd09a, 5.2);
    glowMarker(g, px, y - .13, 0, .05);
  }
  return g;
}

function floorLamp(parent, x, z, ry = 0) {
  const g = groupAt(parent, x, z, ry);
  cyl(g, 0, .05, 0, .28, .08, materials.charcoal, 24);
  cyl(g, 0, 1.05, 0, .035, 2, materials.charcoal, 12);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(.37, .58, 24, 1, true), materials.linen);
  shade.position.set(0, 1.92, 0); shade.rotation.x = Math.PI; shade.castShadow = true; g.add(shade);
  practicalLight(g, 0, 1.72, 0, .7, .02, 0xffc988, 5.5);
  glowMarker(g, 0, 1.75, 0, .06);
  return g;
}

function plant(parent, x, z, scale = 1, potMat = materials.terracotta) {
  const g = groupAt(parent, x, z);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(.32 * scale, .24 * scale, .55 * scale, 18), potMat);
  pot.position.y = .28 * scale; pot.castShadow = true; g.add(pot);
  cyl(g, 0, .82 * scale, 0, .035 * scale, .8 * scale, materials.sageDark, 10);
  const leafGeometry = new THREE.SphereGeometry(.23 * scale, 12, 8);
  [[-.18,1.05,.02,.6,.22],[.16,1.16,-.04,-.4,.18],[-.04,1.38,.02,.1,.18],[.25,.9,.08,.75,.16],[-.28,.82,-.06,-.75,.16]].forEach(([lx,ly,lz,rz,sy], i) => {
    const leaf = new THREE.Mesh(leafGeometry, i % 2 ? materials.leafLight : materials.leaf);
    leaf.position.set(lx * scale, ly * scale, lz * scale); leaf.scale.set(1.6, sy * 4, .35); leaf.rotation.z = rz; leaf.castShadow = true; g.add(leaf);
  });
  return g;
}

function artPanel(parent, x, y, z, w, h, kind, ry = 0) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; parent.add(g);
  box(g, 0, 0, 0, w + .12, h + .12, .075, materials.walnut);
  const material = new THREE.MeshStandardMaterial({ map: makeArtTexture(kind), roughness: .86 });
  box(g, 0, 0, -.047, w, h, .018, material, { cast: false });
  return g;
}

function cabinet(parent, x, z, w, h, d, material = materials.paleOak, ry = 0) {
  const g = groupAt(parent, x, z, ry);
  box(g, 0, h / 2 + .16, 0, w, h, d, material);
  for (let i = 1; i < Math.round(w / 1.1); i++) box(g, -w / 2 + i * (w / Math.round(w / 1.1)), h / 2 + .16, -d / 2 - .006, .018, h - .12, .01, materials.walnut, { cast: false });
  box(g, 0, .58, -d / 2 - .008, w - .1, .018, .012, materials.walnut, { cast: false });
  return g;
}

function tvWall(parent) {
  const g = groupAt(parent, -10.82, -.8, Math.PI / 2);
  box(g, 0, 1.35, 0, 4.9, 2.35, .1, materials.cream);
  box(g, 0, 1.42, -.08, 2.35, 1.28, .08, materials.charcoal);
  box(g, 0, .5, -.34, 3.55, .52, .5, materials.paleOak);
  box(g, -1.25, .52, -.61, .5, .07, .32, materials.cream);
  box(g, -1.25, .59, -.61, .38, .07, .26, materials.clay);
  return g;
}

function bed(parent, x, z, ry = 0, width = 2.85, style = 'master') {
  const g = groupAt(parent, x, z, ry);
  const bedMat = style === 'master' ? materials.linen : style === 'guest' ? materials.grey : materials.sage;
  box(g, 0, .38, 0, width + .16, .42, 3.75, materials.paleOak);
  box(g, 0, .56, 0, width + .02, .16, 3.61, materials.cream);
  box(g, 0, .64, 0, width, .34, 3.58, fabricLightMat);
  box(g, 0, 1.12, -1.75, width + .16, 1.34, .2, bedMat);
  [-.32,.32].forEach(px => box(g, px * width, 1.12, -1.865, .025, 1.15, .012, materials.grey, { cast: false }));
  box(g, 0, .87, .22, width - .08, .18, 2.65, bedMat);
  box(g, -width * .25, .92, -1.12, width * .42, .18, .68, fabricLightMat, { ry: -.04 });
  box(g, width * .25, .92, -1.12, width * .42, .18, .68, fabricLightMat, { ry: .04 });
  box(g, .15, 1.0, .66, width * .7, .12, 1.1, style === 'master' ? materials.clay : materials.sage, { ry: -.03 });
  return g;
}

function sideTable(parent, x, z, lampColor = materials.brass) {
  const g = groupAt(parent, x, z);
  box(g, 0, .45, 0, .72, .14, .62, materials.walnut);
  box(g, -.25, .22, 0, .07, .44, .07, materials.charcoal); box(g, .25, .22, 0, .07, .44, .07, materials.charcoal);
  cyl(g, 0, .86, 0, .05, .64, lampColor, 12);
  const shade = new THREE.Mesh(new THREE.CylinderGeometry(.24, .33, .36, 20), materials.linen); shade.position.y = 1.14; shade.castShadow = true; g.add(shade);
  practicalLight(g, 0, 1.15, 0, .55, .018, 0xffc785, 4.2);
  glowMarker(g, 0, 1.17, 0, .045);
  return g;
}

function wardrobe(parent, x, z, w, ry = 0, material = materials.paleOak) {
  const g = cabinet(parent, x, z, w, 2.28, .64, material, ry);
  for (let i = 0; i < Math.round(w / .9); i++) cyl(g, -w / 2 + .45 + i * .9, 1.3, -.335, .018, .12, materials.brass, 10);
  g.children.slice(-Math.round(w / .9)).forEach(m => m.rotation.x = Math.PI / 2);
  return g;
}

function desk(parent, x, z, ry = 0, width = 2.2) {
  const g = groupAt(parent, x, z, ry);
  box(g, 0, .78, 0, width, .13, .78, materials.paleOak);
  box(g, -width / 2 + .12, .39, .18, .11, .78, .52, materials.charcoal); box(g, width / 2 - .12, .39, .18, .11, .78, .52, materials.charcoal);
  box(g, 0, 1.23, -.2, .82, .66, .05, materials.charcoal);
  box(g, 0, 1.2, -.23, .72, .54, .025, materials.black, { cast: false });
  box(g, 0, .91, -.2, .08, .22, .08, materials.charcoal);
  diningChair(g, 0, 1.0, Math.PI, materials.sage);
  return g;
}

function bookcase(parent, x, z, w = 2.8, ry = 0) {
  const g = groupAt(parent, x, z, ry);
  box(g, 0, 1.35, 0, w, 2.35, .34, materials.sageDark);
  box(g, 0, 1.35, -.19, w - .16, 2.2, .05, materials.cream, { cast: false });
  [-.65, .05, .75].forEach(y => box(g, 0, y + .66, -.34, w - .1, .08, .42, materials.sageDark));
  const colors = [materials.clay, materials.paleOak, materials.sage, materials.charcoal, materials.cream];
  let index = 0;
  [-.9, -.48, -.06, .5, .92].forEach(px => {
    const row = index % 3;
    box(g, px * (w / 2.35), .7 + row * .69, -.42, .15 + (index % 2) * .08, .5, .2, colors[index % colors.length], { ry: (index % 2 ? .04 : -.03) }); index++;
  });
  return g;
}

function kitchen(parent) {
  const g = groupAt(parent, -7.95, -5.67);
  cabinet(g, 0, 0, 6.3, .88, .72, materials.sageDark, 0);
  box(g, 0, 1.1, 0, 6.44, .15, .82, materials.stone);
  [-2.25,-1.05,.15,1.35,2.55].forEach(px => box(g, px, .66, -.368, .018, .7, .012, materials.cream, { cast: false }));
  box(g, 0, .78, -.37, 6.2, .018, .012, materials.cream, { cast: false });
  // sink and faucet
  box(g, -1.15, 1.17, -.02, 1.18, .05, .54, materials.charcoal);
  cyl(g, -1.15, 1.39, -.19, .035, .42, materials.brass, 12);
  const faucet = g.children.at(-1); faucet.rotation.z = Math.PI / 2;
  // hob
  box(g, 1.45, 1.18, -.02, 1.42, .04, .58, materials.black);
  [-.42,.42].forEach(dx => [-.16,.16].forEach(dz => cyl(g, 1.45 + dx, 1.22, dz, .12, .025, materials.charcoal, 20)));
  // uppers
  cabinet(g, -2.2, -.08, 1.75, .82, .45, materials.cream, 0).position.y = 1.4;
  cabinet(g, 2.35, -.08, 1.45, .82, .45, materials.cream, 0).position.y = 1.4;
  // refrigerator and oven tower
  cabinet(g, 3.65, 0, 1.15, 2.35, .72, materials.charcoal, 0);
  box(g, 3.65, 1.1, -.37, .82, .72, .025, materials.black, { cast: false });
  box(g, 3.65, 1.5, -.385, 1.02, .025, .012, materials.grey, { cast: false });
  box(g, 3.65, .88, -.39, .72, .018, .012, materials.grey, { cast: false });
  practicalLight(g, -1.8, 1.7, .08, .42, .015, 0xffcc8f, 3.8);
  practicalLight(g, 1.4, 1.7, .08, .42, .015, 0xffcc8f, 3.8);
  // peninsula
  const peninsula = groupAt(g, 2.15, 2.05, Math.PI / 2);
  box(peninsula, 0, .54, 0, 2.6, 1.03, .72, materials.sageDark);
  box(peninsula, 0, 1.1, 0, 2.82, .12, .88, materials.stone);
  diningChair(peninsula, -.65, 1.02, Math.PI, materials.linen); diningChair(peninsula, .65, 1.02, Math.PI, materials.linen);
  return g;
}

function entryDoor(parent, x, z) {
  const g = groupAt(parent, x, z);
  box(g, -.62, 1.42, 0, .1, 2.58, .16, materials.charcoal);
  box(g, .62, 1.42, 0, .1, 2.58, .16, materials.charcoal);
  box(g, 0, 2.68, 0, 1.34, .1, .16, materials.charcoal);
  box(g, 0, 1.42, -.02, 1.16, 2.48, .12, materials.walnut);
  [-.28,.28].forEach(px => box(g, px, 1.42, -.09, .025, 2.18, .018, materials.paleOak, { cast: false }));
  box(g, 0, .78, -.09, .9, .025, .018, materials.paleOak, { cast: false });
  cyl(g, .38, 1.32, -.13, .035, .12, materials.brass, 14);
  const handle = g.children.at(-1); handle.rotation.x = Math.PI / 2;
  return g;
}

function baseboardX(parent, x, z, length) { return box(parent, x, .24, z, length, .14, .06, materials.paleOak, { cast: false }); }
function baseboardZ(parent, x, z, length) { return box(parent, x, .24, z, .06, .14, length, materials.paleOak, { cast: false }); }

function buildBathroom() {
  const g = new THREE.Group(); g.name = '卫生间'; home.add(g);
  // Shower enclosure
  box(g, 3.25, .28, 5.75, 1.25, .12, 1.55, materials.stone);
  box(g, 3.86, 1.15, 5.75, .035, 1.72, 1.55, glassMat, { cast: false });
  box(g, 3.25, 1.15, 5.0, 1.22, 1.72, .035, glassMat, { cast: false });
  cyl(g, 2.82, 1.72, 6.3, .035, .72, materials.brass, 12);
  // Toilet and compact vanity
  box(g, 4.7, .42, 5.62, .62, .48, .78, materials.white);
  box(g, 4.7, .82, 5.88, .64, .72, .26, materials.white);
  cyl(g, 4.7, .69, 5.34, .34, .1, materials.white, 24);
  cabinet(g, 5.68, 6.14, 1.08, .72, .5, materials.paleOak, 0);
  box(g, 5.68, .95, 6.14, 1.14, .12, .58, materials.stone);
  cyl(g, 5.68, 1.05, 6.1, .25, .1, materials.white, 24);
  const mirror = new THREE.Mesh(new THREE.CircleGeometry(.42, 28), glassMat);
  mirror.position.set(5.68, 1.68, 6.48); g.add(mirror);
  practicalLight(g, 4.55, 2.35, 5.72, .16, .012, 0xffc991, 3.4);
}

function slatScreen(parent, x, z, length, ry = 0) {
  const g = groupAt(parent, x, z, ry);
  const count = Math.floor(length / .23);
  for (let i = 0; i < count; i++) box(g, -length / 2 + i * .23, 1.45, 0, .065, 2.55, .16, materials.walnut);
  return g;
}

function buildArchitecture() {
  // Continuous base and distinct flooring zones
  box(home, -2.65, -.07, .2, 18.4, .18, 14.1, materials.charcoal, { cast: false });
  box(home, 9.2, -.07, -1.1, 5.3, .18, 11.5, materials.charcoal, { cast: false });
  floor(home, -4.5, -1.0, 14.1, 11.0, materials.floorPublic);
  floor(home, -6.8, 5.76, 9.55, 2.28, materials.tile);
  floor(home, .28, 5.7, 4.2, 2.44, materials.tile);
  floor(home, 7.25, -3.92, 8.9, 5.25, materials.floorPrivate);
  floor(home, 5.02, 1.12, 4.25, 4.28, materials.floorPrivate);
  floor(home, 9.45, 1.75, 4.25, 5.55, materials.floorPrivate);
  floor(home, 4.42, 5.7, 4.08, 2.44, materials.bathTile);
  floor(home, 4.42, 3.88, 4.08, 1.16, materials.floorPrivate);

  // North and side shell, kept open toward the viewer as an architectural cutaway
  wallX(home, -8.4, -6.58, 6.7); wallX(home, -2.2, -6.58, 4.9);
  wallX(home, 5.3, -6.58, 4.1); wallX(home, 10.25, -6.58, 2.5);
  wallZ(home, -11.63, -3.05, 7.0); wallZ(home, -11.63, 2.65, 3.3);
  wallZ(home, 11.63, -4.3, 4.55); wallZ(home, 11.63, 1.72, 5.05);

  // Public/private spine: public rooms stay west; the private hall begins at the north opening.
  wallZ(home, 2.38, -5.15, 2.65);
  wallZ(home, 2.38, -2.1, 3.0);
  wallZ(home, 2.38, 1.4, 3.6);
  wallZ(home, 2.38, 5.7, 2.44);

  // Private corridor: a short cross-hall leaves the public core, then feeds all three rooms.
  wallX(home, 4.48, -1.08, 4.15);
  wallX(home, 9.67, -1.08, 3.92);
  door(home, 6.65, -1.18, 0, -.58);
  wallZ(home, 6.45, 1.08, 4.1);
  wallZ(home, 7.78, .51, 3.18); wallZ(home, 7.78, 3.765, 1.43);
  door(home, 7.88, 2.15, -Math.PI / 2, -.62);
  wallX(home, 3.64, 3.3, 2.52);
  door(home, 4.92, 3.2, 0, -.58);
  wallX(home, 6.18, 3.3, .54);
  wallX(home, 9.72, 4.48, 3.82);

  // Compact bathroom is deliberately off the secondary hall, outside the arrival sightline.
  wallX(home, 3.69, 4.48, 2.62);
  door(home, 5.02, 4.38, 0, .56);
  wallX(home, 6.22, 4.48, .46);
  wallZ(home, 6.45, 5.7, 2.44);
  wallX(home, 4.42, 6.92, 4.08);

  // The entrance now lands directly in a small foyer facing the open public core.
  wallZ(home, -1.85, 5.7, 2.44);
  wallX(home, -1.15, 6.92, 1.4); wallX(home, 1.65, 6.92, 1.4);
  entryDoor(home, .25, 6.82);
  floor(home, .25, 7.22, 2.15, .55, materials.stone);
  box(home, .25, .24, 6.44, 1.25, .03, .5, materials.charcoal, { cast: false });

  // The balcony is a shallow living-room extension, separated from the foyer rather than an exterior corridor.
  box(home, -6.8, .22, 4.55, 9.4, .11, .14, materials.brass);
  for (let x = -11.35; x <= -2.25; x += 1.05) box(home, x, .69, 6.86, .045, .95, .045, materials.charcoal);
  box(home, -6.8, .67, 6.86, 9.45, .08, .08, materials.charcoal);
  box(home, -6.8, .68, 6.82, 9.38, .78, .025, glassMat, { cast: false });
  box(home, -2.02, .69, 5.75, .08, .95, 2.25, materials.charcoal);
  box(home, -2.06, .68, 5.75, .025, .78, 2.15, glassMat, { cast: false });
  // Sliding-door frame between living room and balcony.
  box(home, -6.8, 1.48, 4.48, 9.4, .1, .12, materials.charcoal);
  [-11.48,-6.8,-2.12].forEach(x => box(home, x, 1.45, 4.48, .08, 2.5, .12, materials.charcoal));
  box(home, -6.8, 1.46, 4.5, 9.2, 2.38, .025, glassMat, { cast: false });

  // Exterior windows
  windowX(home, -7.9, -6.7, 3.7); windowX(home, -2.0, -6.7, 3.35);
  windowX(home, 5.25, -6.7, 2.8); windowX(home, 10.2, -6.7, 1.65);
  windowZ(home, 11.74, -3.95, 2.6); windowZ(home, 11.74, 1.65, 2.7);
  baseboardX(home, -7.2, -6.45, 8.2); baseboardX(home, 7.05, -6.45, 8.65);
  baseboardZ(home, 2.49, -2.2, 7.8); baseboardX(home, 7.08, -1.2, 8.8);
  baseboardX(home, 4.42, 3.42, 4.0);
}

function buildLivingDining() {
  const publicGroup = new THREE.Group(); publicGroup.name = '客餐厅'; home.add(publicGroup);
  rug(publicGroup, -6.25, .3, 5.9, 4.0, 'living', 0);
  sofa(publicGroup, -5.4, 1.22, Math.PI, 4.5);
  loungeChair(publicGroup, -8.65, .05, Math.PI / 2.8, materials.sage);
  coffeeTable(publicGroup, -6.15, -.25);
  floorLamp(publicGroup, -3.05, 1.28, -.3);
  plant(publicGroup, -9.85, 1.35, .95);
  tvWall(publicGroup);
  artPanel(publicGroup, -5.2, 1.65, -6.73, 2.65, 1.34, 'living', 0);
  cabinet(publicGroup, 2.0, 1.85, 2.15, .82, .55, materials.walnut, Math.PI / 2);
  plant(publicGroup, -2.2, 3.42, .58, materials.stone);

  diningSet(publicGroup, -.75, -.9);
  cabinet(publicGroup, .02, -5.86, 2.7, .82, .56, materials.paleOak, 0);
  artPanel(publicGroup, .02, 1.75, -6.73, 1.8, .95, 'guest', 0);
  kitchen(publicGroup);
  pendant(publicGroup, -5.5, -4.85, 2.37, 2);
}

function buildMaster() {
  const g = new THREE.Group(); g.name = '主卧'; home.add(g);
  rug(g, 7.15, -3.95, 4.4, 3.65, 'master');
  bed(g, 6.9, -4.15, 0, 3.05, 'master');
  sideTable(g, 4.8, -5.08); sideTable(g, 9.0, -5.08);
  wardrobe(g, 10.95, -3.66, 3.25, Math.PI / 2, materials.paleOak);
  artPanel(g, 6.9, 1.75, -6.73, 1.7, 1.0, 'master', 0);
  const vanity = groupAt(g, 3.45, -2.2, Math.PI / 2);
  box(vanity, 0, .78, 0, 1.75, .12, .58, materials.paleOak);
  box(vanity, -.7, .38, 0, .08, .76, .42, materials.charcoal); box(vanity, .7, .38, 0, .08, .76, .42, materials.charcoal);
  const mirror = new THREE.Mesh(new THREE.CircleGeometry(.55, 32), glassMat); mirror.position.set(0, 1.55, -.33); mirror.rotation.y = Math.PI; vanity.add(mirror);
  diningChair(vanity, 0, .83, Math.PI, materials.clay);
  loungeChair(g, 10.35, -1.85, -Math.PI / 3, materials.clay);
  plant(g, 3.55, -5.7, .62, materials.stone);
}

function buildGuest() {
  const g = new THREE.Group(); g.name = '次卧'; home.add(g);
  rug(g, 9.45, 1.45, 3.4, 3.85, 'guest');
  bed(g, 10.0, 1.58, Math.PI / 2, 2.25, 'guest');
  sideTable(g, 10.85, -.35, materials.brass);
  wardrobe(g, 10.25, 3.95, 2.55, 0, materials.grey);
  desk(g, 8.45, -.05, Math.PI / 2, 1.65);
  artPanel(g, 11.76, 1.66, 2.3, 1.08, .92, 'guest', Math.PI / 2);
  plant(g, 7.7, 3.75, .5, materials.cream);
}

function buildStudio() {
  const g = new THREE.Group(); g.name = '书房'; home.add(g);
  rug(g, 4.9, 1.7, 3.35, 3.65, 'studio');
  bookcase(g, 3.85, -0.72, 2.45, Math.PI);
  desk(g, 5.2, -.15, 0, 2.05);
  loungeChair(g, 3.72, 2.6, Math.PI * .72, materials.sageDark);
  const daybed = groupAt(g, 5.65, 3.72, 0);
  box(daybed, 0, .4, 0, 2.55, .5, 1.12, materials.paleOak);
  box(daybed, 0, .72, 0, 2.38, .22, .98, fabricLightMat);
  box(daybed, -1.08, .91, 0, .28, .48, .9, materials.sage);
  box(daybed, .48, .86, 0, .8, .18, .72, materials.clay, { ry: .04 });
  artPanel(g, 2.22, 1.68, 2.1, 1.02, 1.2, 'studio', Math.PI / 2);
  plant(g, 6.45, 2.45, .7, materials.stone);
}

function buildBalconyAndEntry() {
  const g = new THREE.Group(); g.name = '阳台与入户'; home.add(g);
  // Balcony lounge and planting rhythm
  const bench = groupAt(g, -7.55, 5.62);
  box(bench, 0, .43, 0, 2.9, .52, .8, materials.paleOak);
  box(bench, 0, .74, .27, 2.72, .22, .38, materials.sage);
  box(bench, -1.12, .89, .18, .35, .42, .62, materials.clay);
  cyl(g, -5.28, .4, 5.72, .44, .72, materials.stone, 26);
  cyl(g, -5.28, .78, 5.72, .16, .12, materials.cream, 22);
  plant(g, -10.55, 5.7, .68, materials.charcoal); plant(g, -2.55, 5.72, .55, materials.terracotta);
  [-10.7,-2.55].forEach(x => {
    cyl(g, x, .28, 6.35, .11, .42, materials.charcoal, 14);
    practicalLight(g, x, .55, 6.35, .22, 0, 0xffc98a, 2.6);
    glowMarker(g, x, .55, 6.35, .045);
  });
  // Compact foyer storage and seat sit beside the new public-facing entrance.
  cabinet(g, 1.95, 5.64, 2.0, 2.24, .52, materials.sageDark, Math.PI / 2);
  const entryBench = groupAt(g, -1.05, 5.55);
  box(entryBench, 0, .45, 0, 1.4, .18, .55, materials.paleOak);
  box(entryBench, -.55, .23, 0, .08, .46, .46, materials.charcoal); box(entryBench, .55, .23, 0, .08, .46, .46, materials.charcoal);
  box(entryBench, 0, .61, 0, 1.26, .13, .46, materials.linen);
  const mirror = new THREE.Mesh(new THREE.CircleGeometry(.48, 32), glassMat); mirror.position.set(-1.68, 1.62, 5.55); mirror.rotation.y = Math.PI / 2; home.add(mirror);
}

buildArchitecture();
buildLivingDining();
buildMaster();
buildGuest();
buildStudio();
buildBalconyAndEntry();
buildBathroom();

// Studio-style lighting, plus warm pools over the public room.
const hemisphere = new THREE.HemisphereLight(0xfff7e8, 0x66716b, 1.25);
scene.add(hemisphere);
const sun = new THREE.DirectionalLight(0xffedcf, 4.15);
sun.position.set(-12, 24, 18); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -20; sun.shadow.camera.right = 20; sun.shadow.camera.top = 18; sun.shadow.camera.bottom = -18; sun.shadow.camera.far = 60; sun.shadow.bias = -.0003;
sun.shadow.radius = 2.4;
scene.add(sun);
const balconyLight = new THREE.DirectionalLight(0xffe4bd, 1.05);
balconyLight.position.set(-10, 12, 14); balconyLight.target.position.set(-5, 0, 0); scene.add(balconyLight, balconyLight.target);
const fill = new THREE.DirectionalLight(0xc4d2ca, .38); fill.position.set(18, 10, -16); scene.add(fill);
const ambientWarm = new THREE.PointLight(0xffd1a0, .42, 14, 2); ambientWarm.position.set(-4.5, 4.6, .5); scene.add(ambientWarm);
practicalLight(scene, -5.2, 2.55, .15, 1.85, .025, 0xffc67e, 8.6);
practicalLight(scene, -6.35, 2.0, 1.35, .9, .015, 0xffc17a, 5.8);
practicalLight(scene, 7.05, 2.3, -4.15, .36, 0, 0xffc98a, 5.2);
practicalLight(scene, 9.55, 2.3, 1.3, .22, 0, 0xffcd91, 4.8);
practicalLight(scene, 4.85, 2.35, 1.45, .22, 0, 0xffcc8e, 4.8);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ color: 0x30332f, opacity: .17 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -.18; ground.receiveShadow = true; scene.add(ground);

const views = {
  overview: { position: [23, 23, 26], target: [0, .2, 0], caption: '全景 · 开放的公共核心与安静的卧室侧翼' },
  living: { position: [-1.5, 10.2, 18.8], target: [-5.2, .45, -.25], caption: '客餐厅 · 连续的起居、用餐与半开放厨房' },
  master: { position: [7.8, 14.2, 5.2], target: [7.1, .5, -3.85], caption: '主卧 · 暖木、织物与一处安静的梳妆角' },
  guest: { position: [9.6, 11.8, 10.8], target: [9.45, .45, 1.45], caption: '次卧 · 清爽灰调与紧凑的临窗工作位' },
  studio: { position: [4.75, 11.8, 10.2], target: [4.8, .55, 1.6], caption: '书房 · 阅读、工作与留宿共享一室' },
  balcony: { position: [7.5, 8.1, 19.5], target: [-4.7, .45, 5.55], caption: '阳台 · 连接客厅的绿意与午后坐席' },
};

let cameraTween = null;
function moveToView(key, immediate = false) {
  const view = views[key] || views.overview;
  const fromPosition = camera.position.clone();
  const fromTarget = controls.target.clone();
  const toPosition = new THREE.Vector3(...view.position);
  const toTarget = new THREE.Vector3(...view.target);
  cameraTween = { start: performance.now(), duration: immediate ? 1 : 1050, fromPosition, fromTarget, toPosition, toTarget };
  caption.textContent = view.caption;
  document.querySelectorAll('.view-button').forEach(button => button.classList.toggle('active', button.dataset.view === key));
}

function easeInOutCubic(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

document.querySelectorAll('.view-button').forEach(button => button.addEventListener('click', () => moveToView(button.dataset.view)));
document.querySelector('#reset').addEventListener('click', () => moveToView('overview'));
document.querySelector('#zoom-in').addEventListener('click', () => {
  camera.position.lerp(controls.target, .12); controls.update();
});
document.querySelector('#zoom-out').addEventListener('click', () => {
  const direction = camera.position.clone().sub(controls.target).multiplyScalar(1.12); camera.position.copy(controls.target).add(direction); controls.update();
});

const modeToggle = document.querySelector('#mode-toggle');
let targetModeMix = 0;
let modeMix = 0;
modeToggle.addEventListener('click', () => {
  const night = targetModeMix < .5;
  targetModeMix = night ? 1 : 0;
  document.body.classList.toggle('night', night);
  modeToggle.setAttribute('aria-pressed', String(night));
  modeToggle.setAttribute('aria-label', night ? '切换为白天模式' : '切换为夜间模式');
  modeToggle.title = night ? '切换为白天模式' : '切换为夜间模式';
});

const help = document.querySelector('#help-dialog');
document.querySelector('#help-button').addEventListener('click', () => help.showModal());
document.querySelector('#help-close').addEventListener('click', () => help.close());
help.addEventListener('click', event => { if (event.target === help) help.close(); });

function resize() {
  const width = mount.clientWidth;
  const height = mount.clientHeight;
  if (!width || !height) return;
  camera.aspect = width / height;
  camera.zoom = window.innerWidth <= 760 ? .72 : 1;
  camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
}
window.addEventListener('resize', resize);
new ResizeObserver(resize).observe(mount);

let firstFrame = true;
let previousFrame = performance.now();
const dayBackground = new THREE.Color(0xf2efe8);
const nightBackground = new THREE.Color(0x101b22);
function animate(now) {
  requestAnimationFrame(animate);
  const delta = Math.min(.05, Math.max(0, (now - previousFrame) / 1000));
  previousFrame = now;
  modeMix += (targetModeMix - modeMix) * (1 - Math.exp(-delta * 2.8));
  scene.background.copy(dayBackground).lerp(nightBackground, modeMix);
  scene.fog.color.copy(dayBackground).lerp(nightBackground, modeMix);
  scene.fog.density = THREE.MathUtils.lerp(.012, .0165, modeMix);
  hemisphere.intensity = THREE.MathUtils.lerp(1.25, .17, modeMix);
  sun.intensity = THREE.MathUtils.lerp(4.15, .025, modeMix);
  balconyLight.intensity = THREE.MathUtils.lerp(1.05, .015, modeMix);
  fill.intensity = THREE.MathUtils.lerp(.38, .07, modeMix);
  ambientWarm.intensity = THREE.MathUtils.lerp(.42, .14, modeMix);
  renderer.toneMappingExposure = THREE.MathUtils.lerp(1.04, .96, modeMix);
  ground.material.opacity = THREE.MathUtils.lerp(.17, .28, modeMix);
  practicalLights.forEach(light => { light.intensity = THREE.MathUtils.lerp(light.userData.dayIntensity, light.userData.nightIntensity, modeMix); });
  glowMaterials.forEach(material => { material.emissiveIntensity = THREE.MathUtils.lerp(0, 2.1, modeMix); });
  if (cameraTween) {
    const t = Math.min(1, (now - cameraTween.start) / cameraTween.duration);
    const eased = easeInOutCubic(t);
    camera.position.lerpVectors(cameraTween.fromPosition, cameraTween.toPosition, eased);
    controls.target.lerpVectors(cameraTween.fromTarget, cameraTween.toTarget, eased);
    if (t >= 1) cameraTween = null;
  }
  controls.update();
  renderer.render(scene, camera);
  if (firstFrame) {
    firstFrame = false;
    requestAnimationFrame(() => loading.classList.add('is-hidden'));
  }
}
requestAnimationFrame(animate);

