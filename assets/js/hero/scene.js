import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const COLORS = {
  night: 0x0b0d0f,
  graphite: 0x171c20,
  steel: 0x323a40,
  paper: 0xe8e6df,
  blue: 0x3767d6,
  blueLight: 0x78a0ff,
  brass: 0xb79b63,
};

const damp = (current, target, speed, delta) => THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));

function createMarkTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, 512, 512);
  context.strokeStyle = '#8eafff';
  context.lineWidth = 14;
  context.lineCap = 'square';
  context.beginPath();
  context.moveTo(118, 170); context.lineTo(56, 256); context.lineTo(118, 342);
  context.moveTo(394, 170); context.lineTo(456, 256); context.lineTo(394, 342);
  context.moveTo(300, 112); context.lineTo(212, 400);
  context.stroke();
  context.fillStyle = '#b79b63';
  context.font = '500 22px monospace';
  context.textAlign = 'center';
  context.fillText('FF / SYSTEMS', 256, 458);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function addEdges(mesh, color = COLORS.paper, opacity = .18) {
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry, 28),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
  mesh.add(edges);
}

function createBase() {
  const group = new THREE.Group();
  const specs = [
    { size: [6.5, .16, 4.35], y: -1.82, color: 0x101417 },
    { size: [5.85, .16, 3.85], y: -1.57, color: 0x1b2024 },
    { size: [5.1, .18, 3.25], y: -1.29, color: 0x242a2f },
  ];
  specs.forEach((spec, index) => {
    const mesh = new THREE.Mesh(
      new RoundedBoxGeometry(...spec.size, 2, .055),
      new THREE.MeshStandardMaterial({ color: spec.color, metalness: .62, roughness: .3 }),
    );
    mesh.position.y = spec.y;
    addEdges(mesh, index === 2 ? COLORS.paper : COLORS.steel, index === 2 ? .22 : .14);
    group.add(mesh);
  });

  const rail = new THREE.Mesh(
    new THREE.BoxGeometry(4.6, .035, .035),
    new THREE.MeshBasicMaterial({ color: COLORS.blueLight, toneMapped: false }),
  );
  rail.position.set(0, -1.43, 1.82);
  group.add(rail);

  const runner = new THREE.Mesh(
    new THREE.SphereGeometry(.055, 14, 14),
    new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
  );
  runner.position.copy(rail.position);
  group.add(runner);
  return { group, runner };
}

function createCore(markTexture) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(2.4, 3.05, 1.72, 4, .08),
    new THREE.MeshStandardMaterial({ color: 0x11161a, metalness: .68, roughness: .26 }),
  );
  addEdges(body, 0xaeb7bd, .26);
  group.add(body);

  const mark = new THREE.Mesh(
    new THREE.PlaneGeometry(1.55, 1.55),
    new THREE.MeshBasicMaterial({ map: markTexture, transparent: true, toneMapped: false }),
  );
  mark.position.z = .866;
  group.add(mark);

  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(.045, 2.56, .035),
    new THREE.MeshBasicMaterial({ color: COLORS.brass }),
  );
  spine.position.set(-1.214, 0, .34);
  group.add(spine);
  group.position.y = .34;
  return group;
}

function createPanel({ width, height, pivot, offset, rotation, label, side = 'front' }) {
  const hinge = new THREE.Group();
  hinge.position.set(...pivot);
  hinge.rotation.set(...rotation);
  const panel = new THREE.Mesh(
    new RoundedBoxGeometry(width, height, .115, 2, .035),
    new THREE.MeshStandardMaterial({ color: 0x252b30, metalness: .5, roughness: .38 }),
  );
  panel.position.set(...offset);
  addEdges(panel, COLORS.paper, .24);
  hinge.add(panel);

  const line = new THREE.Mesh(
    new THREE.BoxGeometry(width * .56, .022, .02),
    new THREE.MeshBasicMaterial({ color: side === 'accent' ? COLORS.brass : COLORS.blueLight, toneMapped: false }),
  );
  line.position.set(offset[0], offset[1] + height * .25, offset[2] + .07);
  hinge.add(line);

  const tag = document.createElement('canvas');
  tag.width = 512; tag.height = 96;
  const context = tag.getContext('2d');
  context.fillStyle = side === 'accent' ? '#c2ab7b' : '#94b1f5';
  context.font = '500 27px monospace';
  context.textAlign = 'center';
  context.fillText(label, 256, 58);
  const texture = new THREE.CanvasTexture(tag);
  texture.colorSpace = THREE.SRGBColorSpace;
  const text = new THREE.Mesh(new THREE.PlaneGeometry(width * .74, height * .16), new THREE.MeshBasicMaterial({ map: texture, transparent: true }));
  text.position.set(offset[0], offset[1] - height * .21, offset[2] + .071);
  hinge.add(text);
  return hinge;
}

function createAssembly(compact) {
  const group = new THREE.Group();
  const base = createBase();
  const core = createCore(createMarkTexture());
  group.add(base.group, core);

  const panels = [
    createPanel({ width: 2.5, height: 1.5, pivot: [-1.22, .65, 0], offset: [-1.24, 0, 0], rotation: [0, -.46, -.05], label: 'INTERFACE / 01' }),
    createPanel({ width: 2.35, height: 1.5, pivot: [1.22, .42, -.02], offset: [1.16, 0, 0], rotation: [0, .54, .04], label: 'SYSTEMS / 02', side: 'accent' }),
    createPanel({ width: 2.38, height: 1.36, pivot: [0, 1.86, -.2], offset: [0, .66, 0], rotation: [-.58, 0, 0], label: 'OPERATION / 03' }),
  ];
  panels.forEach((panel) => group.add(panel));

  const markers = [];
  for (let i = 0; i < (compact ? 5 : 9); i += 1) {
    const marker = new THREE.Mesh(
      new THREE.BoxGeometry(.045, .045, .045),
      new THREE.MeshBasicMaterial({ color: i % 4 === 0 ? COLORS.brass : COLORS.blueLight, toneMapped: false }),
    );
    const angle = i * 2.18;
    marker.position.set(Math.cos(angle) * (3.1 + (i % 3) * .45), -1 + (i % 4) * .9, -1.6 - (i % 2) * .7);
    marker.userData = { baseY: marker.position.y, phase: i * .8 };
    group.add(marker);
    markers.push(marker);
  }
  return { group, base, core, panels, markers };
}

function createFoldField(compact) {
  const group = new THREE.Group();
  const materialA = new THREE.MeshStandardMaterial({ color: 0x13181c, metalness: .25, roughness: .74, side: THREE.DoubleSide });
  const materialB = new THREE.MeshStandardMaterial({ color: 0x1a2025, metalness: .22, roughness: .7, side: THREE.DoubleSide });
  const columns = compact ? 5 : 8;
  const rows = compact ? 3 : 5;
  const w = 1.42;
  const h = .9;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < columns; col += 1) {
      const x = (col - columns / 2) * w;
      const y = (row - rows / 2) * h;
      const z1 = ((row + col) % 2 ? .16 : -.16);
      const z2 = ((row + col + 1) % 2 ? .16 : -.16);
      const vertices = new Float32Array([x, y, z1, x + w, y, z2, x + w, y + h, z1, x, y, z1, x + w, y + h, z1, x, y + h, z2]);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, (row + col) % 2 ? materialA : materialB);
      group.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0x53606a, transparent: true, opacity: .22 }));
      group.add(edges);
    }
  }
  group.position.set(.6, .55, -3.15);
  group.rotation.set(-.12, -.05, -.08);
  return group;
}

function createScene(compact) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COLORS.night, compact ? .062 : .044);
  const foldField = createFoldField(compact);
  const assembly = createAssembly(compact);
  assembly.group.position.set(.38, -.15, .2);
  assembly.group.rotation.y = -.18;
  scene.add(foldField, assembly.group);

  scene.add(new THREE.HemisphereLight(0xdde4f4, 0x090b0c, 1.25));
  const key = new THREE.DirectionalLight(0xf5f1e6, 3.7);
  key.position.set(-5, 7, 6);
  scene.add(key);
  const blue = new THREE.PointLight(COLORS.blue, 20, 9, 2);
  blue.position.set(4, -.4, 4);
  scene.add(blue);
  const brass = new THREE.PointLight(COLORS.brass, 9, 8, 2);
  brass.position.set(-4, 1.5, 3);
  scene.add(brass);
  return { scene, foldField, assembly, blue };
}

export async function mountHeroScene({ canvas, sceneElement, reduceMotion }) {
  const compact = window.matchMedia('(max-width: 900px)').matches;
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !compact, powerPreference: 'high-performance' });
  renderer.setClearColor(COLORS.night, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : lowPower ? 1.35 : 1.65));

  const camera = new THREE.PerspectiveCamera(compact ? 35 : 31, 1, .1, 50);
  camera.position.set(compact ? 4.2 : 4.6, compact ? 3.25 : 3.6, compact ? 13.5 : 12.4);
  camera.lookAt(.3, -.05, 0);
  const graph = createScene(compact);
  const target = new THREE.Vector2();
  const current = new THREE.Vector2();
  const hero = sceneElement.closest('[data-hero]');
  const stateLabel = document.querySelector('[data-render-state]');
  let scrollProgress = 0;
  let frame = 0;
  let previous = performance.now();
  let visible = true;
  let disposed = false;

  function resize() {
    const { width, height } = sceneElement.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (reduceMotion.matches) renderer.render(graph.scene, camera);
  }

  function update(elapsed, delta) {
    current.x = damp(current.x, target.x, 5.2, delta);
    current.y = damp(current.y, target.y, 5.2, delta);
    const restY = -.18 + scrollProgress * .18;
    graph.assembly.group.rotation.y = damp(graph.assembly.group.rotation.y, restY + current.x * .14, 3.6, delta);
    graph.assembly.group.rotation.x = damp(graph.assembly.group.rotation.x, current.y * -.08 - scrollProgress * .05, 3.6, delta);
    graph.assembly.group.position.x = damp(graph.assembly.group.position.x, .38 + current.x * .14, 3.2, delta);
    graph.foldField.rotation.y = damp(graph.foldField.rotation.y, -.05 - current.x * .04, 2.4, delta);
    graph.foldField.position.x = damp(graph.foldField.position.x, .6 - current.x * .12, 2.4, delta);
    graph.blue.position.x = 4 + current.x * 2.4;
    graph.blue.position.y = -.4 - current.y * 1.4;
    graph.assembly.base.runner.position.x = Math.sin(elapsed * .72) * 2.22;
    graph.assembly.markers.forEach((marker) => { marker.position.y = marker.userData.baseY + Math.sin(elapsed * .45 + marker.userData.phase) * .08; });
    if (!reduceMotion.matches) {
      graph.assembly.core.position.y = Math.sin(elapsed * .62) * .035;
      graph.assembly.panels[0].rotation.y += Math.sin(elapsed * .44) * .0003;
      graph.assembly.panels[1].rotation.y -= Math.sin(elapsed * .4) * .0003;
    }
  }

  function tick(now) {
    if (disposed || !visible || document.hidden || reduceMotion.matches) { frame = 0; return; }
    const delta = Math.min((now - previous) / 1000, .05);
    previous = now;
    update(now / 1000, delta);
    renderer.render(graph.scene, camera);
    frame = requestAnimationFrame(tick);
  }

  function start() { if (!frame && !disposed && visible && !document.hidden && !reduceMotion.matches) { previous = performance.now(); frame = requestAnimationFrame(tick); } }
  function stop() { if (frame) cancelAnimationFrame(frame); frame = 0; }

  function onPointer(event) {
    const bounds = hero.getBoundingClientRect();
    target.set(THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - .5) * 2, -1, 1), THREE.MathUtils.clamp(((event.clientY - bounds.top) / bounds.height - .5) * 2, -1, 1));
  }

  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion.matches) {
    hero.addEventListener('pointermove', onPointer, { passive: true });
    hero.addEventListener('pointerleave', () => target.set(0, 0));
  }
  window.addEventListener('portfolio:hero-progress', (event) => { scrollProgress = event.detail; });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(sceneElement);
  const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) start(); else stop(); }, { threshold: .02 });
  visibilityObserver.observe(sceneElement);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); disposed = true; stop(); sceneElement.classList.remove('is-webgl-ready'); sceneElement.classList.add('is-static-fallback'); if (stateLabel) stateLabel.textContent = 'Representação estática'; }, { once: true });

  resize();
  renderer.render(graph.scene, camera);
  sceneElement.classList.add('is-webgl-ready');
  if (stateLabel) stateLabel.textContent = 'Renderização em tempo real';

  if (!reduceMotion.matches && window.gsap) {
    const { gsap } = window;
    gsap.from(graph.assembly.group.scale, { x: .72, y: .72, z: .72, duration: 1.35, ease: 'expo.out' });
    gsap.from(graph.assembly.group.position, { y: -.8, duration: 1.35, ease: 'expo.out' });
    gsap.from(graph.assembly.panels[0].rotation, { y: -1.7, duration: 1.55, delay: .1, ease: 'expo.out' });
    gsap.from(graph.assembly.panels[1].rotation, { y: 1.7, duration: 1.55, delay: .16, ease: 'expo.out' });
    gsap.from(graph.assembly.panels[2].rotation, { x: -1.7, duration: 1.55, delay: .22, ease: 'expo.out' });
  }
  if (reduceMotion.matches) renderer.render(graph.scene, camera); else start();
}
