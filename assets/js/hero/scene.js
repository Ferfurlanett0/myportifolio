import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const COLORS = {
  night: 0x080b0f,
  surface: 0x10161c,
  graphite: 0x18212a,
  steel: 0x3b4854,
  paper: 0xd5dee6,
  blue: 0x4d70a8,
  blueLight: 0x91a8cf,
  brass: 0xad9568,
  green: 0x6f927d,
};

const MODULE_COPY = [
  ['Produto', 'problema e fluxo'],
  ['Interface', 'experiência clara'],
  ['Sistemas', 'regras e dados'],
  ['Operação', 'deploy e continuidade'],
];

function addEdges(mesh, color = COLORS.paper, opacity = 0.18) {
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(mesh.geometry, 28),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
  );
  mesh.add(edges);
}

function createBox(size, color = COLORS.graphite, options = {}) {
  const geometry = new RoundedBoxGeometry(...size, options.segments || 3, options.radius || 0.055);
  const material = new THREE.MeshStandardMaterial({
    color,
    metalness: options.metalness ?? 0.48,
    roughness: options.roughness ?? 0.36,
  });
  const mesh = new THREE.Mesh(geometry, material);
  if (options.edges !== false) addEdges(mesh, options.edgeColor || COLORS.paper, options.edgeOpacity ?? 0.18);
  return mesh;
}

function createAccentBar(width, color = COLORS.blueLight) {
  return new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.026, 0.025),
    new THREE.MeshBasicMaterial({ color, toneMapped: false }),
  );
}

function createStatusLight(color = COLORS.green) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 12, 12),
    new THREE.MeshBasicMaterial({ color, toneMapped: false }),
  );
}

function addHitTarget(group, size, position = [0, 0.45, 0]) {
  const target = new THREE.Mesh(
    new THREE.BoxGeometry(...size),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
  );
  target.position.set(...position);
  group.add(target);
  return target;
}

function createModuleBase(width, depth) {
  const base = createBox([width, 0.15, depth], COLORS.surface, {
    radius: 0.04,
    metalness: 0.64,
    roughness: 0.3,
    edgeOpacity: 0.2,
  });
  base.position.y = 0.075;
  return base;
}

function createProductModule() {
  const group = new THREE.Group();
  group.add(createModuleBase(1.45, 1.18));

  const sheets = new THREE.Group();
  for (let index = 0; index < 3; index += 1) {
    const sheet = createBox([0.94, 0.055, 0.7], index === 2 ? 0x1b2631 : 0x141b22, {
      radius: 0.025,
      metalness: 0.3,
      roughness: 0.58,
      edgeOpacity: index === 2 ? 0.25 : 0.11,
    });
    sheet.position.set((index - 1) * 0.08, 0.25 + index * 0.14, (1 - index) * 0.06);
    sheet.rotation.y = (index - 1) * -0.035;
    sheets.add(sheet);
  }
  const accent = createAccentBar(0.58);
  accent.position.set(0.04, 0.57, 0.365);
  sheets.add(accent);
  group.add(sheets);

  const hitTarget = addHitTarget(group, [1.6, 1.25, 1.35], [0, 0.55, 0]);
  return { group, hitTarget, articulation: sheets };
}

function createInterfaceModule() {
  const group = new THREE.Group();
  group.add(createModuleBase(1.55, 1.28));

  const screenRig = new THREE.Group();
  screenRig.position.set(0, 0.33, -0.09);
  screenRig.rotation.x = -0.08;
  const screen = createBox([1.24, 1.16, 0.12], 0x151d25, {
    radius: 0.045,
    metalness: 0.4,
    roughness: 0.42,
    edgeOpacity: 0.28,
  });
  screen.position.y = 0.58;
  screenRig.add(screen);
  const header = createAccentBar(0.72);
  header.position.set(-0.12, 0.91, 0.07);
  screenRig.add(header);
  [0.68, 0.5, 0.32].forEach((y, index) => {
    const row = new THREE.Mesh(
      new THREE.BoxGeometry(index === 1 ? 0.72 : 0.88, 0.018, 0.016),
      new THREE.MeshBasicMaterial({ color: index === 1 ? COLORS.brass : COLORS.steel, toneMapped: false }),
    );
    row.position.set(index === 1 ? -0.08 : 0, y, 0.069);
    screenRig.add(row);
  });
  group.add(screenRig);

  const hitTarget = addHitTarget(group, [1.75, 1.85, 1.45], [0, 0.84, 0]);
  return { group, hitTarget, articulation: screenRig };
}

function createSystemsModule() {
  const group = new THREE.Group();
  group.add(createModuleBase(1.55, 1.24));

  const rack = new THREE.Group();
  for (let index = 0; index < 3; index += 1) {
    const blade = createBox([1.12, 0.28, 0.76], 0x151d24, {
      radius: 0.035,
      metalness: 0.58,
      roughness: 0.32,
      edgeOpacity: 0.2,
    });
    blade.position.set(0, 0.29 + index * 0.34, 0);
    rack.add(blade);
    const light = createStatusLight(index === 2 ? COLORS.blueLight : COLORS.green);
    light.position.set(0.42, blade.position.y, 0.39);
    light.userData.phase = index * 0.8;
    rack.add(light);
  }
  group.add(rack);

  const hitTarget = addHitTarget(group, [1.75, 1.65, 1.45], [0, 0.72, 0]);
  return { group, hitTarget, articulation: rack };
}

function createOperationModule() {
  const group = new THREE.Group();
  group.add(createModuleBase(1.48, 1.2));

  const cluster = new THREE.Group();
  const nodePositions = [[-0.38, 0.44, 0.14], [0.32, 0.75, -0.1], [0.28, 0.31, 0.2]];
  const nodeMaterial = new THREE.MeshStandardMaterial({ color: 0x172029, metalness: 0.52, roughness: 0.34 });
  nodePositions.forEach((position, index) => {
    const node = new THREE.Mesh(new THREE.IcosahedronGeometry(index === 1 ? 0.24 : 0.18, 1), nodeMaterial);
    node.position.set(...position);
    addEdges(node, index === 1 ? COLORS.brass : COLORS.blueLight, 0.38);
    cluster.add(node);
    const status = createStatusLight(index === 1 ? COLORS.brass : COLORS.green);
    status.position.copy(node.position).add(new THREE.Vector3(0, index === 1 ? 0.28 : 0.22, 0));
    status.userData.phase = 2.4 + index * 0.65;
    cluster.add(status);
  });
  [[0, 1], [1, 2], [2, 0]].forEach(([start, end]) => {
    const points = [new THREE.Vector3(...nodePositions[start]), new THREE.Vector3(...nodePositions[end])];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    cluster.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: COLORS.brass, transparent: true, opacity: 0.48 })));
  });
  group.add(cluster);

  const hitTarget = addHitTarget(group, [1.7, 1.75, 1.45], [0, 0.74, 0]);
  return { group, hitTarget, articulation: cluster };
}

function createConnector(start, end) {
  const midpoint = start.clone().lerp(end, 0.5);
  midpoint.y += 0.28;
  const curve = new THREE.CatmullRomCurve3([
    start.clone(),
    start.clone().lerp(midpoint, 0.56),
    midpoint,
    midpoint.clone().lerp(end, 0.56),
    end.clone(),
  ]);
  const group = new THREE.Group();
  const bed = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 38, 0.035, 8, false),
    new THREE.MeshStandardMaterial({ color: 0x27313b, metalness: 0.5, roughness: 0.4, transparent: true, opacity: 0.88 }),
  );
  const signal = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 38, 0.012, 6, false),
    new THREE.MeshBasicMaterial({ color: COLORS.blueLight, transparent: true, opacity: 0.7, toneMapped: false }),
  );
  group.add(bed, signal);
  return { group, curve, signal };
}

function createBackplane(compact) {
  const group = new THREE.Group();
  const platform = createBox([compact ? 6.9 : 8.25, 0.16, 3.25], 0x0f151b, {
    radius: 0.055,
    metalness: 0.62,
    roughness: 0.34,
    edgeColor: COLORS.steel,
    edgeOpacity: 0.22,
  });
  platform.position.y = -0.08;
  group.add(platform);
  for (let index = -1; index <= 1; index += 1) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(compact ? 5.9 : 7.15, 0.018, 0.018),
      new THREE.MeshBasicMaterial({ color: index === 1 ? COLORS.brass : COLORS.steel, transparent: true, opacity: index === 1 ? 0.54 : 0.36 }),
    );
    rail.position.set(0, 0.015, index * 0.78);
    group.add(rail);
  }
  return { group, platform };
}

function createSignalField(compact) {
  const count = compact ? 18 : 30;
  const geometry = new THREE.BoxGeometry(0.035, 0.035, 0.035);
  const material = new THREE.MeshBasicMaterial({ color: COLORS.blueLight, transparent: true, opacity: 0.44, toneMapped: false });
  const field = new THREE.InstancedMesh(geometry, material, count);
  const matrix = new THREE.Matrix4();
  for (let index = 0; index < count; index += 1) {
    const x = ((index * 2.31) % 9) - 4.5;
    const y = ((index * 1.17) % 3.2) - 1.15;
    const z = -1.45 - ((index * 0.91) % 2.8);
    matrix.makeTranslation(x, y, z);
    field.setMatrixAt(index, matrix);
  }
  field.instanceMatrix.needsUpdate = true;
  return field;
}

function createArchitecture(compact) {
  const scrollRig = new THREE.Group();
  const interactionRig = new THREE.Group();
  const architecture = new THREE.Group();
  scrollRig.add(interactionRig);
  interactionRig.add(architecture);

  const backplane = createBackplane(compact);
  architecture.add(backplane.group);

  const factories = [createProductModule, createInterfaceModule, createSystemsModule, createOperationModule];
  const positions = compact
    ? [[-2.55, 0, 0.92], [-0.84, 0, 0.3], [0.9, 0, -0.31], [2.58, 0, -0.94]]
    : [[-2.95, 0, 1.02], [-0.96, 0, 0.34], [1.08, 0, -0.37], [3.05, 0, -1.06]];
  const modules = factories.map((factory, index) => {
    const module = factory();
    module.group.position.set(...positions[index]);
    module.group.userData.baseY = 0;
    module.group.userData.index = index;
    module.hitTarget.userData.moduleIndex = index;
    module.articulationBaseY = module.articulation.rotation.y;
    architecture.add(module.group);
    return module;
  });

  const connectors = [];
  for (let index = 0; index < positions.length - 1; index += 1) {
    const start = new THREE.Vector3(positions[index][0] + 0.62, 0.18, positions[index][2]);
    const end = new THREE.Vector3(positions[index + 1][0] - 0.62, 0.18, positions[index + 1][2]);
    const connector = createConnector(start, end);
    architecture.add(connector.group);
    connectors.push(connector);
  }

  const packetMaterial = new THREE.MeshBasicMaterial({ color: 0xe0e8ef, toneMapped: false });
  const packets = [];
  connectors.forEach((connector, connectorIndex) => {
    for (let packetIndex = 0; packetIndex < 2; packetIndex += 1) {
      const packet = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), packetMaterial);
      packet.userData = { connectorIndex, offset: packetIndex * 0.5 + connectorIndex * 0.17 };
      architecture.add(packet);
      packets.push(packet);
    }
  });

  const signalField = createSignalField(compact);
  interactionRig.add(signalField);
  return {
    scrollRig,
    interactionRig,
    architecture,
    backplane,
    modules,
    connectors,
    packets,
    signalField,
    hitTargets: modules.map((module) => module.hitTarget),
  };
}

function createScene(compact) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COLORS.night, compact ? 0.058 : 0.045);
  const graph = createArchitecture(compact);
  graph.interactionRig.rotation.set(-0.07, -0.12, -0.035);
  graph.scrollRig.position.set(-0.22, -0.12, 0);
  scene.add(graph.scrollRig);

  scene.add(new THREE.HemisphereLight(0xdce4ee, 0x080a0c, 1.68));
  const key = new THREE.DirectionalLight(0xf1eee5, 4.1);
  key.position.set(-5, 7, 6);
  scene.add(key);
  const blue = new THREE.PointLight(COLORS.blue, 17, 10, 2);
  blue.position.set(3.8, 1.2, 4.4);
  scene.add(blue);
  const brass = new THREE.PointLight(COLORS.brass, 8, 8, 2);
  brass.position.set(-4.2, 2, 3.2);
  scene.add(brass);
  return { scene, graph, blue };
}

export async function mountHeroScene({ canvas, sceneElement, reduceMotion }) {
  const compact = window.matchMedia('(max-width: 900px)').matches;
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !compact, powerPreference: 'high-performance' });
  renderer.setClearColor(COLORS.night, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : lowPower ? 1.35 : 1.65));

  const camera = new THREE.PerspectiveCamera(compact ? 34 : 31, 1, 0.1, 50);
  camera.position.set(compact ? 4.1 : 4.2, compact ? 3.2 : 3.3, compact ? 12.5 : 10.9);
  camera.lookAt(0.15, 0.22, 0);
  const { scene, graph, blue } = createScene(compact);
  const hero = sceneElement.closest('[data-hero]');
  const stateLabel = document.querySelector('[data-render-state]');
  const focusLabel = document.querySelector('[data-scene-focus]');
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(4, 4);
  let activeModule = -1;
  let scrollProgress = 0;
  let frame = 0;
  let previous = performance.now();
  let visible = true;
  let disposed = false;
  let introComplete = reduceMotion.matches;

  const gsap = window.gsap;
  const canAnimate = !reduceMotion.matches && gsap;
  const rotateX = canAnimate ? gsap.quickTo(graph.interactionRig.rotation, 'x', { duration: 0.7, ease: 'power3.out' }) : null;
  const rotateY = canAnimate ? gsap.quickTo(graph.interactionRig.rotation, 'y', { duration: 0.7, ease: 'power3.out' }) : null;
  const rotateZ = canAnimate ? gsap.quickTo(graph.interactionRig.rotation, 'z', { duration: 0.8, ease: 'power3.out' }) : null;
  const moveX = canAnimate ? gsap.quickTo(graph.interactionRig.position, 'x', { duration: 0.8, ease: 'power3.out' }) : null;

  function resize() {
    const { width, height } = sceneElement.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (reduceMotion.matches) renderer.render(scene, camera);
  }

  function setActiveModule(index) {
    if (activeModule === index) return;
    activeModule = index;
    sceneElement.classList.toggle('is-inspecting', index >= 0);
    if (focusLabel) {
      focusLabel.textContent = index >= 0
        ? `${MODULE_COPY[index][0]} — ${MODULE_COPY[index][1]}`
        : 'Produto → interface → sistemas → operação';
    }
    graph.modules.forEach((module, moduleIndex) => {
      const active = moduleIndex === index;
      const targetY = active ? 0.3 : module.group.userData.baseY;
      const targetScale = active ? 1.055 : 1;
      const articulationY = module.articulationBaseY + (active ? (moduleIndex % 2 ? -0.08 : 0.08) : 0);
      if (canAnimate) {
        gsap.to(module.group.position, { y: targetY, duration: 0.46, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(module.group.scale, { x: targetScale, y: targetScale, z: targetScale, duration: 0.46, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(module.articulation.rotation, { y: articulationY, duration: 0.52, ease: 'power3.out', overwrite: 'auto' });
      } else {
        module.group.position.y = targetY;
        module.group.scale.setScalar(targetScale);
        module.articulation.rotation.y = articulationY;
      }
    });
  }

  function inspectPointer() {
    if (!introComplete || pointer.x > 2) return;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(graph.hitTargets, false);
    setActiveModule(hits.length ? hits[0].object.userData.moduleIndex : -1);
  }

  function update(elapsed) {
    graph.packets.forEach((packet) => {
      const rate = activeModule >= 0 ? 0.115 : 0.082;
      const progress = (elapsed * rate + packet.userData.offset) % 1;
      packet.position.copy(graph.connectors[packet.userData.connectorIndex].curve.getPointAt(progress));
    });
    graph.modules.forEach((module, moduleIndex) => {
      module.group.traverse((child) => {
        if (child.isMesh && child.geometry?.type === 'SphereGeometry' && child.userData.phase !== undefined) {
          const pulse = 0.82 + Math.sin(elapsed * 2.2 + child.userData.phase) * 0.18;
          child.scale.setScalar(pulse);
        }
      });
      if (activeModule < 0) module.articulation.position.y = Math.sin(elapsed * 0.65 + moduleIndex * 0.8) * 0.018;
    });
    graph.scrollRig.rotation.y = scrollProgress * 0.09;
    graph.scrollRig.position.y = -0.12 - scrollProgress * 0.16;
    blue.position.x = 3.8 + Math.sin(elapsed * 0.32) * 0.65;
    inspectPointer();
  }

  function tick(now) {
    if (disposed || !visible || document.hidden || reduceMotion.matches) {
      frame = 0;
      return;
    }
    previous = now;
    update(now / 1000);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (!frame && !disposed && visible && !document.hidden && !reduceMotion.matches) {
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    }
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function onPointer(event) {
    const bounds = sceneElement.getBoundingClientRect();
    const x = THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1, -1, 1);
    const y = THREE.MathUtils.clamp(-(((event.clientY - bounds.top) / bounds.height) * 2 - 1), -1, 1);
    pointer.set(x, y);
    if (canAnimate) {
      rotateX(-0.07 + y * 0.12);
      rotateY(-0.12 + x * 0.24);
      rotateZ(-0.035 - x * 0.025);
      moveX(x * 0.18);
    }
  }

  function onPointerLeave() {
    pointer.set(4, 4);
    setActiveModule(-1);
    if (canAnimate) {
      rotateX(-0.07);
      rotateY(-0.12);
      rotateZ(-0.035);
      moveX(0);
    }
  }

  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion.matches) {
    sceneElement.addEventListener('pointermove', onPointer, { passive: true });
    sceneElement.addEventListener('pointerleave', onPointerLeave);
  }
  window.addEventListener('portfolio:hero-progress', (event) => { scrollProgress = event.detail; });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(sceneElement);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start(); else stop();
  }, { threshold: 0.02 });
  visibilityObserver.observe(sceneElement);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    disposed = true;
    stop();
    sceneElement.classList.remove('is-webgl-ready');
    sceneElement.classList.add('is-static-fallback');
    if (stateLabel) stateLabel.textContent = 'Representação estática';
  }, { once: true });

  resize();
  renderer.render(scene, camera);
  sceneElement.classList.add('is-webgl-ready');

  if (canAnimate) {
    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onStart: () => { if (stateLabel) stateLabel.textContent = 'Inicializando arquitetura'; },
      onComplete: () => {
        introComplete = true;
        if (stateLabel) stateLabel.textContent = 'Renderização em tempo real';
      },
    });
    timeline
      .from(graph.backplane.group.scale, { x: 0.76, z: 0.76, duration: 0.95 })
      .from(graph.backplane.group.position, { y: -0.34, duration: 0.95 }, '<')
      .from(graph.connectors.map((connector) => connector.signal.material), { opacity: 0, duration: 0.65, stagger: 0.09 }, 0.28)
      .from(graph.modules.map((module) => module.group.position), { y: -0.72, duration: 0.92, stagger: 0.09 }, 0.34)
      .from(graph.modules.map((module) => module.group.scale), { x: 0.72, y: 0.72, z: 0.72, duration: 0.92, stagger: 0.09 }, 0.34)
      .from(graph.packets.map((packet) => packet.scale), { x: 0, y: 0, z: 0, duration: 0.4, stagger: 0.05 }, 0.78);
  } else {
    introComplete = true;
    if (stateLabel) stateLabel.textContent = 'Representação estática';
  }

  if (reduceMotion.matches) renderer.render(scene, camera); else start();
}
