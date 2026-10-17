import * as THREE from 'three';

const COLORS = {
  night: 0x080b0f,
  graphite: 0x17212b,
  steel: 0x43515e,
  blue: 0x718bc2,
  blueLight: 0x9badd2,
  brass: 0xaa946b,
  green: 0x7fa78e,
};

const STATION_COPY = [
  ['Produto', 'entender o problema'],
  ['Interface', 'tornar o uso claro'],
  ['Sistemas', 'sustentar as regras'],
  ['Operação', 'manter tudo funcionando'],
];

function buildLoopPoints(yOffset = 0, zOffset = 0) {
  return [
    [-2.82, 0.02, 0.02],
    [-2.05, 1.08, -0.3],
    [-0.82, 0.88, 0.08],
    [0, 0.02, 0.48],
    [0.88, -0.9, 0.06],
    [2.08, -1.03, -0.28],
    [2.84, 0.02, 0],
    [2.05, 1.08, 0.3],
    [0.82, 0.88, -0.08],
    [0, 0.02, -0.48],
    [-0.88, -0.9, -0.06],
    [-2.05, -1.03, 0.28],
  ].map(([x, y, z]) => new THREE.Vector3(x, y + yOffset, z + zOffset));
}

function createLoopCurve(yOffset = 0, zOffset = 0) {
  return new THREE.CatmullRomCurve3(buildLoopPoints(yOffset, zOffset), true, 'catmullrom', 0.46);
}

function createShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(128, 60, 8, 128, 60, 112);
  gradient.addColorStop(0, 'rgba(0,0,0,.58)');
  gradient.addColorStop(0.56, 'rgba(0,0,0,.24)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

function createFloorShadow() {
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(6.8, 2.25),
    new THREE.MeshBasicMaterial({ map: createShadowTexture(), transparent: true, opacity: 0.72, depthWrite: false, toneMapped: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0.32, -1.58, 0.42);
  return shadow;
}

function createFlowSegment(curve, start, end, color) {
  const points = [];
  const steps = 36;
  for (let index = 0; index <= steps; index += 1) {
    points.push(curve.getPointAt(THREE.MathUtils.lerp(start, end, index / steps) % 1));
  }
  const segmentCurve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.45);
  return new THREE.Mesh(
    new THREE.TubeGeometry(segmentCurve, 48, 0.04, 8, false),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, toneMapped: false }),
  );
}

function createStation(curve, progress, index) {
  const group = new THREE.Group();
  const point = curve.getPointAt(progress);
  const tangent = curve.getTangentAt(progress).normalize();
  group.position.copy(point);
  group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);

  const stationColor = index === 3 ? COLORS.brass : index === 0 ? COLORS.green : COLORS.blueLight;
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.205, 0.028, 10, 42),
    new THREE.MeshBasicMaterial({ color: stationColor, transparent: true, opacity: 0.92, toneMapped: false }),
  );
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.058, 14, 14),
    new THREE.MeshBasicMaterial({ color: stationColor, toneMapped: false }),
  );
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(0.118, 0.012, 8, 32),
    new THREE.MeshBasicMaterial({ color: COLORS.steel, transparent: true, opacity: 0.72 }),
  );
  group.add(ring, collar, core);

  const hitTarget = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 12, 12),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }),
  );
  hitTarget.userData.stationIndex = index;
  group.add(hitTarget);
  group.userData = { baseScale: 1, phase: index * 0.8, ring };
  return { group, hitTarget, ring };
}

function createPacket(color, progressOffset) {
  const group = new THREE.Group();
  for (let index = 0; index < 3; index += 1) {
    const point = new THREE.Mesh(
      new THREE.SphereGeometry(0.065 - index * 0.014, 12, 12),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1 - index * 0.28, toneMapped: false }),
    );
    point.userData.trailOffset = index * 0.009;
    group.add(point);
  }
  group.userData.progressOffset = progressOffset;
  return group;
}

function createLoopObject(compact) {
  const root = new THREE.Group();
  const loop = new THREE.Group();
  root.add(loop);

  const primaryCurve = createLoopCurve();
  const accentCurve = createLoopCurve(0.15, -0.025);
  const body = new THREE.Mesh(
    new THREE.TubeGeometry(primaryCurve, compact ? 120 : 176, 0.13, compact ? 8 : 12, true),
    new THREE.MeshPhysicalMaterial({
      color: COLORS.graphite,
      metalness: 0.84,
      roughness: 0.22,
      clearcoat: 0.78,
      clearcoatRoughness: 0.26,
      emissive: 0x07101a,
      emissiveIntensity: 0.62,
    }),
  );
  const accentRail = new THREE.Mesh(
    new THREE.TubeGeometry(accentCurve, compact ? 120 : 176, 0.034, 8, true),
    new THREE.MeshBasicMaterial({ color: COLORS.blueLight, transparent: true, opacity: 0.76, toneMapped: false }),
  );
  const blueSegment = createFlowSegment(accentCurve, 0.06, 0.22, COLORS.blue);
  const brassSegment = createFlowSegment(accentCurve, 0.56, 0.72, COLORS.brass);
  loop.add(body, accentRail, blueSegment, brassSegment);

  const stationProgress = [0.06, 0.3, 0.56, 0.8];
  const stations = stationProgress.map((progress, index) => createStation(accentCurve, progress, index));
  stations.forEach((station) => loop.add(station.group));

  const packets = [createPacket(COLORS.blueLight, 0), createPacket(COLORS.brass, 0.5)];
  packets.forEach((packet) => loop.add(packet));

  const shadow = createFloorShadow();
  root.add(shadow);
  return {
    root,
    loop,
    body,
    accentRail,
    segments: [blueSegment, brassSegment],
    primaryCurve,
    accentCurve,
    stations,
    packets,
    hitTargets: stations.map((station) => station.hitTarget),
  };
}

function createScene(compact) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COLORS.night, compact ? 0.058 : 0.043);
  const sculpture = createLoopObject(compact);
  sculpture.root.position.set(0.02, 0.08, 0);
  sculpture.loop.rotation.set(-0.08, -0.12, -0.025);
  scene.add(sculpture.root);

  scene.add(new THREE.HemisphereLight(0xdfe6ef, 0x07090c, 1.55));
  const key = new THREE.DirectionalLight(0xf0ede5, 4.4);
  key.position.set(-4.5, 6.5, 6);
  scene.add(key);
  const blue = new THREE.PointLight(COLORS.blue, 19, 9, 2);
  blue.position.set(3.8, 1.5, 4.2);
  scene.add(blue);
  const brass = new THREE.PointLight(COLORS.brass, 9, 8, 2);
  brass.position.set(-3.3, -0.2, 3.2);
  scene.add(brass);
  return { scene, sculpture, blue };
}

export async function mountHeroScene({ canvas, sceneElement, reduceMotion }) {
  const compact = window.matchMedia('(max-width: 900px)').matches;
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !compact, powerPreference: 'high-performance' });
  renderer.setClearColor(COLORS.night, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.2 : lowPower ? 1.35 : 1.65));

  const camera = new THREE.PerspectiveCamera(compact ? 36 : 34, 1, 0.1, 40);
  camera.position.set(compact ? 0.5 : 0.62, compact ? 0.72 : 0.84, compact ? 9.7 : 8.7);
  camera.lookAt(0, 0.02, 0);
  const { scene, sculpture, blue } = createScene(compact);
  const hero = sceneElement.closest('[data-hero]');
  const stateLabel = document.querySelector('[data-render-state]');
  const focusLabel = document.querySelector('[data-scene-focus]');
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(4, 4);
  const gsap = window.gsap;
  const canAnimate = Boolean(!reduceMotion.matches && gsap);
  let activeStation = -1;
  let scrollProgress = 0;
  let frame = 0;
  let visible = true;
  let disposed = false;
  let introComplete = reduceMotion.matches;

  const rotateX = canAnimate ? gsap.quickTo(sculpture.loop.rotation, 'x', { duration: 0.46, ease: 'power3.out' }) : null;
  const rotateY = canAnimate ? gsap.quickTo(sculpture.loop.rotation, 'y', { duration: 0.46, ease: 'power3.out' }) : null;
  const rotateZ = canAnimate ? gsap.quickTo(sculpture.loop.rotation, 'z', { duration: 0.58, ease: 'power3.out' }) : null;
  const moveX = canAnimate ? gsap.quickTo(sculpture.loop.position, 'x', { duration: 0.55, ease: 'power3.out' }) : null;

  function resize() {
    const { width, height } = sceneElement.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (reduceMotion.matches) renderer.render(scene, camera);
  }

  function setActiveStation(index) {
    if (activeStation === index) return;
    activeStation = index;
    sceneElement.classList.toggle('is-inspecting', index >= 0);
    if (focusLabel) {
      focusLabel.textContent = index >= 0
        ? `${STATION_COPY[index][0]} — ${STATION_COPY[index][1]}`
        : 'Produto → interface → sistemas → operação';
    }
    sculpture.stations.forEach((station, stationIndex) => {
      const active = stationIndex === index;
      const scale = active ? 1.42 : 1;
      if (canAnimate) {
        gsap.to(station.group.scale, { x: scale, y: scale, z: scale, duration: 0.28, ease: 'power3.out', overwrite: 'auto' });
        gsap.to(station.ring.material, { opacity: active ? 1 : 0.92, duration: 0.2, overwrite: 'auto' });
      } else {
        station.group.scale.setScalar(scale);
      }
    });
  }

  function inspectPointer() {
    if (!introComplete || pointer.x > 2) return;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(sculpture.hitTargets, false);
    setActiveStation(hits.length ? hits[0].object.userData.stationIndex : -1);
  }

  function update(elapsed) {
    const flowRate = activeStation >= 0 ? 0.09 : 0.062;
    sculpture.packets.forEach((packet) => {
      const baseProgress = (elapsed * flowRate + packet.userData.progressOffset) % 1;
      packet.children.forEach((point) => {
        const progress = (baseProgress - point.userData.trailOffset + 1) % 1;
        point.position.copy(sculpture.accentCurve.getPointAt(progress));
      });
    });
    sculpture.root.position.y = 0.08 - scrollProgress * 0.13 + Math.sin(elapsed * 0.48) * 0.028;
    sculpture.loop.position.y = Math.sin(elapsed * 0.34) * 0.018;
    blue.position.x = 3.8 + Math.sin(elapsed * 0.28) * 0.55;
    sculpture.stations.forEach((station, index) => {
      if (index !== activeStation) {
        const pulse = 1 + Math.sin(elapsed * 1.15 + station.group.userData.phase) * 0.025;
        station.group.scale.setScalar(pulse);
      }
    });
    inspectPointer();
  }

  function tick(now) {
    if (disposed || !visible || document.hidden || reduceMotion.matches) {
      frame = 0;
      return;
    }
    update(now / 1000);
    renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  }

  function start() {
    if (!frame && !disposed && visible && !document.hidden && !reduceMotion.matches) frame = requestAnimationFrame(tick);
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
      rotateX(-0.08 - y * 0.13);
      rotateY(-0.12 + x * 0.24);
      rotateZ(-0.025 - x * 0.035);
      moveX(x * 0.13);
    }
  }

  function onPointerLeave() {
    pointer.set(4, 4);
    setActiveStation(-1);
    if (canAnimate) {
      rotateX(-0.08);
      rotateY(-0.12);
      rotateZ(-0.025);
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
    gsap.timeline({
      defaults: { ease: 'expo.out' },
      onStart: () => { if (stateLabel) stateLabel.textContent = 'Construindo fluxo'; },
      onComplete: () => {
        introComplete = true;
        if (stateLabel) stateLabel.textContent = 'Fluxo em tempo real';
      },
    })
      .from(sculpture.loop.scale, { x: 0.72, y: 0.72, z: 0.72, duration: 0.88 })
      .from(sculpture.loop.rotation, { z: -0.3, duration: 0.9 }, '<')
      .from(sculpture.stations.map((station) => station.group.scale), { x: 0.2, y: 0.2, z: 0.2, duration: 0.48, stagger: 0.07 }, 0.34)
      .from(sculpture.packets.map((packet) => packet.scale), { x: 0, y: 0, z: 0, duration: 0.36, stagger: 0.08 }, 0.58);
  } else {
    introComplete = true;
    if (stateLabel) stateLabel.textContent = 'Representação estática';
  }

  if (reduceMotion.matches) renderer.render(scene, camera); else start();
}
