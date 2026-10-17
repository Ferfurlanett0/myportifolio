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

let shadowTexture;
function createFloorShadow(width, depth, opacity = 0.22) {
  if (!shadowTexture) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(64, 64, 8, 64, 64, 60);
    gradient.addColorStop(0, 'rgba(0,0,0,.72)');
    gradient.addColorStop(0.52, 'rgba(0,0,0,.32)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    shadowTexture = new THREE.CanvasTexture(canvas);
  }
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(width, depth),
    new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, opacity, depthWrite: false, toneMapped: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0.12, 0.012, 0.16);
  return shadow;
}

function createProductModule() {
  const group = new THREE.Group();
  group.add(createFloorShadow(1.8, 1.45), createModuleBase(1.62, 1.28));

  const sheets = new THREE.Group();
  const upright = createBox([1.06, 0.92, 0.085], 0x1a242e, {
    radius: 0.035,
    metalness: 0.34,
    roughness: 0.5,
    edgeColor: COLORS.blueLight,
    edgeOpacity: 0.26,
  });
  upright.position.set(-0.12, 0.72, -0.23);
  upright.rotation.set(-0.08, -0.14, -0.025);
  upright.material.emissive = new THREE.Color(0x0b1520);
  upright.material.emissiveIntensity = 0.52;
  sheets.add(upright);
  [0.24, 0.05, -0.14].forEach((y, index) => {
    const row = new THREE.Mesh(
      new THREE.BoxGeometry(index === 1 ? 0.57 : 0.7, 0.018, 0.014),
      new THREE.MeshBasicMaterial({ color: index === 2 ? COLORS.brass : COLORS.blueLight, transparent: true, opacity: index === 1 ? 0.55 : 0.82, toneMapped: false }),
    );
    row.position.set(-0.18, 0.72 + y, -0.183);
    row.rotation.copy(upright.rotation);
    sheets.add(row);
  });
  for (let index = 0; index < 2; index += 1) {
    const sheet = createBox([0.68, 0.045, 0.46], index ? 0x202b35 : 0x141b22, {
      radius: 0.025,
      metalness: 0.3,
      roughness: 0.58,
      edgeOpacity: index ? 0.25 : 0.13,
    });
    sheet.position.set(0.3 + index * 0.09, 0.23 + index * 0.11, 0.28 - index * 0.12);
    sheet.rotation.y = -0.12 + index * 0.07;
    sheets.add(sheet);
  }
  group.add(sheets);

  const hitTarget = addHitTarget(group, [1.85, 1.65, 1.55], [0, 0.72, 0]);
  return { group, hitTarget, articulation: sheets };
}

function createInterfaceModule() {
  const group = new THREE.Group();
  group.add(createFloorShadow(2.7, 2.1, 0.28), createModuleBase(2.42, 1.76));

  const screenRig = new THREE.Group();
  screenRig.position.set(0, 0.4, -0.13);
  screenRig.rotation.x = -0.1;
  const screen = createBox([2.02, 1.42, 0.13], 0x17222c, {
    radius: 0.06,
    metalness: 0.46,
    roughness: 0.34,
    edgeColor: COLORS.blueLight,
    edgeOpacity: 0.34,
  });
  screen.position.y = 0.72;
  screen.material.emissive = new THREE.Color(0x0b1824);
  screen.material.emissiveIntensity = 0.68;
  screenRig.add(screen);
  const header = createAccentBar(1.62);
  header.position.set(0, 1.19, 0.076);
  screenRig.add(header);
  const sidebar = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.92, 0.018),
    new THREE.MeshBasicMaterial({ color: 0x222e39, toneMapped: false }),
  );
  sidebar.position.set(-0.75, 0.68, 0.078);
  screenRig.add(sidebar);
  const cardSpecs = [
    [-0.28, 0.91, 0.48, 0.28, COLORS.blue],
    [0.37, 0.91, 0.58, 0.28, COLORS.steel],
    [-0.18, 0.52, 0.68, 0.3, 0x263540],
    [0.54, 0.52, 0.38, 0.3, COLORS.brass],
  ];
  cardSpecs.forEach(([x, y, width, height, color], index) => {
    const card = new THREE.Mesh(
      new RoundedBoxGeometry(width, height, 0.022, 2, 0.018),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: index === 3 ? 0.78 : 0.68, toneMapped: false }),
    );
    card.position.set(x, y, 0.083);
    screenRig.add(card);
  });
  group.add(screenRig);

  const hitTarget = addHitTarget(group, [2.7, 2.2, 1.95], [0, 1.02, 0]);
  return { group, hitTarget, articulation: screenRig };
}

function createSystemsModule() {
  const group = new THREE.Group();
  group.add(createFloorShadow(1.95, 1.6), createModuleBase(1.72, 1.36));

  const rack = new THREE.Group();
  const frame = createBox([1.28, 1.52, 0.9], 0x111920, {
    radius: 0.055,
    metalness: 0.64,
    roughness: 0.28,
    edgeColor: COLORS.steel,
    edgeOpacity: 0.28,
  });
  frame.position.y = 0.88;
  frame.material.emissive = new THREE.Color(0x09121a);
  frame.material.emissiveIntensity = 0.52;
  rack.add(frame);
  for (let index = 0; index < 4; index += 1) {
    const blade = createBox([1.05, 0.22, 0.12], index === 3 ? 0x223140 : 0x1a242d, {
      radius: 0.035,
      metalness: 0.45,
      roughness: 0.38,
      edgeOpacity: 0.14,
    });
    blade.position.set(0, 0.39 + index * 0.32, 0.46);
    rack.add(blade);
    const light = createStatusLight(index === 2 ? COLORS.blueLight : COLORS.green);
    light.position.set(0.39, blade.position.y, 0.535);
    light.userData.phase = index * 0.8;
    rack.add(light);
  }
  group.add(rack);

  const hitTarget = addHitTarget(group, [1.95, 2.05, 1.65], [0, 0.92, 0]);
  return { group, hitTarget, articulation: rack };
}

function createOperationModule() {
  const group = new THREE.Group();
  group.add(createFloorShadow(2.1, 1.65), createModuleBase(1.9, 1.38));

  const cluster = new THREE.Group();
  const nodePositions = [[-0.48, 0.36, 0.12], [0, 0.58, -0.08], [0.48, 0.44, 0.1]];
  const nodeMaterial = new THREE.MeshStandardMaterial({ color: 0x1a242d, metalness: 0.62, roughness: 0.3, emissive: 0x09131b, emissiveIntensity: 0.5 });
  nodePositions.forEach((position, index) => {
    const node = new THREE.Mesh(new THREE.CylinderGeometry(index === 1 ? 0.25 : 0.21, index === 1 ? 0.3 : 0.25, index === 1 ? 0.72 : 0.5, 8), nodeMaterial);
    node.position.set(...position);
    addEdges(node, index === 1 ? COLORS.brass : COLORS.blueLight, 0.3);
    cluster.add(node);
    const status = createStatusLight(index === 1 ? COLORS.brass : COLORS.green);
    status.position.copy(node.position).add(new THREE.Vector3(0, index === 1 ? 0.41 : 0.3, 0));
    status.userData.phase = 2.4 + index * 0.65;
    cluster.add(status);
  });
  [[0, 1], [1, 2], [2, 0]].forEach(([start, end]) => {
    const points = [new THREE.Vector3(...nodePositions[start]), new THREE.Vector3(...nodePositions[end])];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    cluster.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: COLORS.brass, transparent: true, opacity: 0.48 })));
  });
  group.add(cluster);

  const hitTarget = addHitTarget(group, [2.1, 1.65, 1.65], [0, 0.68, 0]);
  return { group, hitTarget, articulation: cluster };
}

function createConnector(start, end) {
  const midpoint = start.clone().lerp(end, 0.5);
  midpoint.y += 0.18;
  const curve = new THREE.CatmullRomCurve3([
    start.clone(),
    start.clone().lerp(midpoint, 0.56),
    midpoint,
    midpoint.clone().lerp(end, 0.56),
    end.clone(),
  ]);
  const group = new THREE.Group();
  const bed = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 38, 0.026, 8, false),
    new THREE.MeshStandardMaterial({ color: 0x2d3944, metalness: 0.5, roughness: 0.4, transparent: true, opacity: 0.76 }),
  );
  const signal = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 38, 0.008, 6, false),
    new THREE.MeshBasicMaterial({ color: COLORS.blueLight, transparent: true, opacity: 0.74, toneMapped: false }),
  );
  group.add(bed, signal);
  return { group, curve, signal };
}

function createBackplane(compact) {
  const group = new THREE.Group();
  const underlay = createBox([compact ? 6.4 : 7.25, 0.14, 3.9], 0x090d11, {
    radius: 0.12,
    metalness: 0.72,
    roughness: 0.3,
    edgeColor: COLORS.steel,
    edgeOpacity: 0.12,
  });
  underlay.position.set(0.18, -0.2, 0.18);
  group.add(underlay);
  const platform = createBox([compact ? 6.15 : 6.95, 0.18, 3.62], 0x111920, {
    radius: 0.1,
    metalness: 0.62,
    roughness: 0.34,
    edgeColor: COLORS.steel,
    edgeOpacity: 0.25,
  });
  platform.position.y = -0.06;
  group.add(platform);
  const stage = createBox([2.92, 0.16, 2.18], 0x17212a, {
    radius: 0.08,
    metalness: 0.58,
    roughness: 0.32,
    edgeColor: COLORS.blueLight,
    edgeOpacity: 0.3,
  });
  stage.position.set(-0.3, 0.11, 0.12);
  stage.material.emissive = new THREE.Color(0x07111b);
  stage.material.emissiveIntensity = 0.48;
  group.add(stage);
  const blueRail = createAccentBar(2.25, COLORS.blueLight);
  blueRail.position.set(-0.35, 0.205, 1.19);
  group.add(blueRail);
  const brassRail = createAccentBar(1.05, COLORS.brass);
  brassRail.position.set(2.55, 0.055, -1.05);
  group.add(brassRail);
  return { group, platform };
}

function createSignalField(compact) {
  const count = compact ? 10 : 16;
  const geometry = new THREE.BoxGeometry(0.035, 0.035, 0.035);
  const material = new THREE.MeshBasicMaterial({ color: COLORS.blueLight, transparent: true, opacity: 0.28, toneMapped: false });
  const field = new THREE.InstancedMesh(geometry, material, count);
  const matrix = new THREE.Matrix4();
  for (let index = 0; index < count; index += 1) {
    const x = ((index * 2.31) % 7.4) - 3.7;
    const y = ((index * 1.17) % 2.7) - 0.65;
    const z = -1.7 - ((index * 0.91) % 2.2);
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
    ? [[-2.15, 0.08, 0.72], [-0.32, 0.16, 0.22], [1.72, 0.06, 0.62], [2.35, 0.05, -0.82]]
    : [[-2.35, 0.08, 0.78], [-0.36, 0.18, 0.22], [1.78, 0.06, 0.64], [2.55, 0.05, -0.86]];
  const modules = factories.map((factory, index) => {
    const module = factory();
    module.group.position.set(...positions[index]);
    module.group.userData.baseY = positions[index][1];
    module.group.userData.index = index;
    module.hitTarget.userData.moduleIndex = index;
    module.articulationBaseY = module.articulation.rotation.y;
    architecture.add(module.group);
    return module;
  });

  const connectorPoints = [
    [[-1.63, 0.31, 0.64], [-1.43, 0.34, 0.39]],
    [[0.74, 0.36, 0.34], [1.12, 0.31, 0.57]],
    [[2.02, 0.3, 0.14], [2.4, 0.26, -0.34]],
  ];
  const connectors = connectorPoints.map(([startPoint, endPoint]) => {
    const start = new THREE.Vector3(...startPoint);
    const end = new THREE.Vector3(...endPoint);
    const connector = createConnector(start, end);
    architecture.add(connector.group);
    return connector;
  });

  const packets = [];
  connectors.forEach((connector, connectorIndex) => {
    const packet = new THREE.Mesh(
      new THREE.SphereGeometry(0.042, 12, 12),
      new THREE.MeshBasicMaterial({ color: connectorIndex === 2 ? COLORS.brass : COLORS.blueLight, toneMapped: false }),
    );
    packet.userData = { connectorIndex, offset: connectorIndex * 0.21 };
    architecture.add(packet);
    packets.push(packet);
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
  graph.interactionRig.rotation.set(-0.11, -0.16, -0.02);
  graph.scrollRig.position.set(-0.14, -0.12, 0);
  scene.add(graph.scrollRig);

  scene.add(new THREE.HemisphereLight(0xdce4ee, 0x080a0c, 1.68));
  const key = new THREE.DirectionalLight(0xf1eee5, 4.1);
  key.position.set(-5, 7, 6);
  scene.add(key);
  const blue = new THREE.PointLight(COLORS.blue, 21, 10, 2);
  blue.position.set(3.4, 1.45, 4.4);
  scene.add(blue);
  const brass = new THREE.PointLight(COLORS.brass, 10, 8, 2);
  brass.position.set(-3.7, 2.25, 3.4);
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
  camera.position.set(compact ? 4.25 : 4.55, compact ? 3.45 : 3.65, compact ? 12.3 : 11.2);
  camera.lookAt(0.02, 0.34, 0);
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
  const rotateX = canAnimate ? gsap.quickTo(graph.interactionRig.rotation, 'x', { duration: 0.48, ease: 'power3.out' }) : null;
  const rotateY = canAnimate ? gsap.quickTo(graph.interactionRig.rotation, 'y', { duration: 0.48, ease: 'power3.out' }) : null;
  const rotateZ = canAnimate ? gsap.quickTo(graph.interactionRig.rotation, 'z', { duration: 0.58, ease: 'power3.out' }) : null;
  const moveX = canAnimate ? gsap.quickTo(graph.interactionRig.position, 'x', { duration: 0.58, ease: 'power3.out' }) : null;

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
      const targetY = active ? module.group.userData.baseY + 0.24 : module.group.userData.baseY;
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
      rotateX(-0.11 - y * 0.13);
      rotateY(-0.16 + x * 0.26);
      rotateZ(-0.02 - x * 0.02);
      moveX(x * 0.16);
    }
  }

  function onPointerLeave() {
    pointer.set(4, 4);
    setActiveModule(-1);
    if (canAnimate) {
      rotateX(-0.11);
      rotateY(-0.16);
      rotateZ(-0.02);
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
