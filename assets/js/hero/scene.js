import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const COLORS = {
  background: 0x030712,
  cyan: 0x00d9ff,
  blue: 0x168cff,
  indigo: 0x4f46e5,
  violet: 0x8b5cf6,
  purple: 0xc13cff,
};

const damp = (current, target, smoothing, delta) => THREE.MathUtils.lerp(
  current,
  target,
  1 - Math.exp(-smoothing * delta),
);

const yieldToMain = () => new Promise((resolve) => requestAnimationFrame(resolve));

function createSeededRandom(seed = 1937) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createRadialTexture(size = 128) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(.18, 'rgba(255,255,255,.9)');
  gradient.addColorStop(.48, 'rgba(255,255,255,.2)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createCodeTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(70, 0, 440, 0);
  gradient.addColorStop(0, '#00e5ff');
  gradient.addColorStop(.46, '#2784ff');
  gradient.addColorStop(1, '#a83cff');

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '800 154px ui-monospace, SFMono-Regular, Consolas, monospace';
  context.shadowColor = 'rgba(44, 125, 255, .86)';
  context.shadowBlur = 6;
  context.fillStyle = gradient;
  context.fillText('</>', canvas.width / 2, canvas.height / 2 + 4);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function createGlyphTexture(label, startColor = '#00d9ff', endColor = '#7c3aed') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(48, 0, 208, 0);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '800 76px ui-monospace, SFMono-Regular, Consolas, monospace';
  context.shadowColor = 'rgba(37, 99, 235, .5)';
  context.shadowBlur = 12;
  context.fillStyle = gradient;
  context.fillText(label, 128, 132);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createGlowSprite(texture, color, opacity, scale) {
  const material = new THREE.SpriteMaterial({
    map: texture,
    color,
    opacity,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

function createPlatform({ allowShadows, glowTexture }) {
  const group = new THREE.Group();
  group.name = 'developer-platform';

  const layers = [
    { size: [6.45, .38, 4.5], y: -1.72, radius: .16, color: 0x060b16, metalness: .48, roughness: .34 },
    { size: [6.08, .29, 4.14], y: -1.42, radius: .13, color: 0x0a1221, metalness: .46, roughness: .31 },
    { size: [5.26, .26, 3.54], y: -1.08, radius: .12, color: 0x111b2f, metalness: .42, roughness: .3 },
  ];

  layers.forEach((layer, index) => {
    const geometry = new RoundedBoxGeometry(...layer.size, 3, layer.radius);
    const material = new THREE.MeshStandardMaterial({
      color: layer.color,
      metalness: layer.metalness,
      roughness: layer.roughness,
      emissive: index === 1 ? 0x07152f : 0x02050d,
      emissiveIntensity: index === 1 ? .24 : .08,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = layer.y;
    mesh.receiveShadow = allowShadows;
    mesh.castShadow = allowShadows && index > 0;
    group.add(mesh);

    const edgeGeometry = new THREE.EdgesGeometry(geometry, 32);
    const edges = new THREE.LineSegments(edgeGeometry, new THREE.LineBasicMaterial({
      color: index === 2 ? 0x7ca8dc : 0x385689,
      transparent: true,
      opacity: index === 2 ? .24 : .13,
      blending: THREE.AdditiveBlending,
    }));
    edges.position.copy(mesh.position);
    group.add(edges);
  });

  const contactMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    map: glowTexture,
    opacity: .72,
    transparent: true,
    depthWrite: false,
  });
  const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(4.05, 3.35), contactMaterial);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(0, -.935, 0);
  contactShadow.renderOrder = 1;
  group.add(contactShadow);

  const underGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 5.35),
    new THREE.MeshBasicMaterial({
      color: COLORS.indigo,
      map: glowTexture,
      opacity: .34,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  underGlow.rotation.x = -Math.PI / 2;
  underGlow.position.y = -1.94;
  group.add(underGlow);

  const tracePositions = new Float32Array([
    -2.15, -.94, .82, -1.18, -.94, .82,
    -2.15, -.94, .82, -2.15, -.94, .2,
    2.15, -.94, -.72, 1.12, -.94, -.72,
    2.15, -.94, -.72, 2.15, -.94, -.12,
    -.72, -.94, 1.1, -.25, -.94, 1.1,
    .7, -.94, -1.08, .25, -.94, -1.08,
  ]);
  const traceGeometry = new THREE.BufferGeometry();
  traceGeometry.setAttribute('position', new THREE.BufferAttribute(tracePositions, 3));
  const traces = new THREE.LineSegments(traceGeometry, new THREE.LineBasicMaterial({
    color: COLORS.blue,
    transparent: true,
    opacity: .42,
    blending: THREE.AdditiveBlending,
  }));
  group.add(traces);

  const ledCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.82, -1.565, 1.92),
    new THREE.Vector3(-1.35, -1.565, 2.035),
    new THREE.Vector3(0, -1.565, 2.06),
    new THREE.Vector3(1.35, -1.565, 2.035),
    new THREE.Vector3(2.82, -1.565, 1.92),
    new THREE.Vector3(3.01, -1.565, .88),
    new THREE.Vector3(3.01, -1.565, -.88),
    new THREE.Vector3(2.82, -1.565, -1.92),
    new THREE.Vector3(0, -1.565, -2.06),
    new THREE.Vector3(-2.82, -1.565, -1.92),
    new THREE.Vector3(-3.01, -1.565, -.88),
    new THREE.Vector3(-3.01, -1.565, .88),
  ], true, 'catmullrom', .2);

  const ledUniforms = { uTime: { value: 0 } };
  const vertexShader = `
    varying float vProgress;
    varying float vColorMix;
    void main() {
      vProgress = uv.x;
      vColorMix = clamp(position.x / 6.1 + 0.5, 0.0, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  const fragmentShader = `
    uniform float uTime;
    varying float vProgress;
    varying float vColorMix;

    vec3 gradientColor(float t) {
      vec3 cyan = vec3(0.0, 0.86, 1.0);
      vec3 blue = vec3(0.08, 0.42, 1.0);
      vec3 violet = vec3(0.61, 0.20, 1.0);
      return t < 0.56
        ? mix(cyan, blue, smoothstep(0.0, 0.56, t))
        : mix(blue, violet, smoothstep(0.56, 1.0, t));
    }

    void main() {
      float headA = fract(uTime * 0.255);
      float headB = fract(uTime * 0.255 + 0.5);
      float distanceA = min(abs(vProgress - headA), 1.0 - abs(vProgress - headA));
      float distanceB = min(abs(vProgress - headB), 1.0 - abs(vProgress - headB));
      float current = 1.0 - smoothstep(0.018, 0.125, min(distanceA, distanceB));
      vec3 color = gradientColor(vColorMix);
      gl_FragColor = vec4(color * (1.18 + current * 2.9), 0.96);
    }
  `;

  const ledGeometry = new THREE.TubeGeometry(ledCurve, 128, .034, 6, true);
  const ledMaterial = new THREE.ShaderMaterial({
    uniforms: ledUniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  });
  const led = new THREE.Mesh(ledGeometry, ledMaterial);
  led.renderOrder = 3;
  group.add(led);

  const ledGlowUniforms = { uTime: { value: 0 } };
  const ledGlow = new THREE.Mesh(
    new THREE.TubeGeometry(ledCurve, 128, .09, 6, true),
    new THREE.ShaderMaterial({
      uniforms: ledGlowUniforms,
      vertexShader,
      fragmentShader: fragmentShader.replace('0.96);', '0.18);').replace('2.9)', '1.2)'),
      transparent: true,
      opacity: .2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  ledGlow.renderOrder = 2;
  group.add(ledGlow);

  const energyOrb = new THREE.Mesh(
    new THREE.SphereGeometry(.075, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xdffcff, toneMapped: false }),
  );
  const energyLight = new THREE.PointLight(COLORS.cyan, 28, 2.4, 2);
  energyOrb.add(energyLight);
  group.add(energyOrb);

  return {
    group,
    ledCurve,
    ledUniforms,
    ledGlowUniforms,
    energyOrb,
    contactMaterial,
  };
}

function createDeveloperCube({ allowShadows, glowTexture }) {
  const group = new THREE.Group();
  group.name = 'developer-cube';

  const geometry = new RoundedBoxGeometry(2.78, 2.78, 2.78, 4, .13);
  const material = new THREE.MeshStandardMaterial({
    color: 0x080e1b,
    roughness: .31,
    metalness: .38,
    emissive: 0x020918,
    emissiveIntensity: .36,
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = allowShadows;
  cube.receiveShadow = allowShadows;
  group.add(cube);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 34),
    new THREE.LineBasicMaterial({
      color: 0x85aee8,
      transparent: true,
      opacity: .24,
      blending: THREE.AdditiveBlending,
    }),
  );
  group.add(edges);

  const codeTexture = createCodeTexture();
  const symbolGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.18, 1.36),
    new THREE.MeshBasicMaterial({
      map: codeTexture,
      transparent: true,
      opacity: .06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  symbolGlow.position.z = 1.402;
  symbolGlow.scale.set(1.07, 1.07, 1);
  symbolGlow.renderOrder = 5;
  group.add(symbolGlow);

  const symbol = new THREE.Mesh(
    new THREE.PlaneGeometry(2.04, 1.28),
    new THREE.MeshBasicMaterial({
      map: codeTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  symbol.position.z = 1.408;
  symbol.renderOrder = 6;
  group.add(symbol);

  group.position.y = .45;
  return { group, material };
}

function createParticleField({ compact, lowPower }) {
  const random = createSeededRandom(4201);
  const count = compact ? 20 : lowPower ? 30 : 48;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const sizes = new Float32Array(count);
  const palette = [COLORS.cyan, COLORS.blue, COLORS.indigo, COLORS.violet];

  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (random() - .5) * 15.5;
    positions[index * 3 + 1] = -1.35 + random() * 6.2;
    positions[index * 3 + 2] = -5.8 + random() * 10;

    const color = new THREE.Color(palette[Math.floor(random() * palette.length)]);
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
    phases[index] = random() * Math.PI * 2;
    sizes[index] = .65 + random() * .85;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const uniforms = { uTime: { value: 0 } };
  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: `
      uniform float uTime;
      attribute float aPhase;
      attribute float aSize;
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        vec3 animated = position;
        animated.y += sin(uTime * 0.72 + aPhase) * 0.1;
        animated.x += cos(uTime * 0.42 + aPhase) * 0.055;
        vec4 viewPosition = modelViewMatrix * vec4(animated, 1.0);
        gl_Position = projectionMatrix * viewPosition;
        gl_PointSize = aSize * (44.0 / max(1.0, -viewPosition.z));
        vColor = color;
        vTwinkle = 0.48 + 0.52 * sin(uTime * 1.35 + aPhase);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        float alpha = (1.0 - smoothstep(0.05, 0.5, distanceToCenter)) * (0.42 + vTwinkle * 0.58);
        gl_FragColor = vec4(vColor * (1.15 + vTwinkle), alpha);
      }
    `,
  });

  return { points: new THREE.Points(geometry, material), uniforms };
}

function createEnvironment({ compact, glowTexture }) {
  const random = createSeededRandom(7331);
  const group = new THREE.Group();
  group.name = 'technology-environment';

  const grid = new THREE.GridHelper(26, 30, COLORS.blue, 0x142c61);
  grid.position.y = -1.95;
  grid.material.transparent = true;
  grid.material.opacity = .18;
  grid.material.blending = THREE.AdditiveBlending;
  group.add(grid);

  const pathCount = compact ? 14 : 32;
  const pathPositions = [];
  const pathColors = [];
  const paths = [];
  const nodePositions = [];
  const cyan = new THREE.Color(COLORS.blue);
  const violet = new THREE.Color(COLORS.violet);

  for (let index = 0; index < pathCount; index += 1) {
    const start = new THREE.Vector3(
      Math.round((random() - .5) * 17) * .5,
      -1.89 + random() * .035,
      Math.round((random() - .5) * 13) * .5,
    );
    const corner = new THREE.Vector3(
      start.x + (random() > .5 ? 1 : -1) * (1 + Math.floor(random() * 4)) * .55,
      start.y,
      start.z,
    );
    const end = new THREE.Vector3(
      corner.x,
      start.y,
      start.z + (random() > .5 ? 1 : -1) * (1 + Math.floor(random() * 4)) * .55,
    );
    paths.push(new THREE.CatmullRomCurve3([start, corner, end], false, 'catmullrom', .02));
    nodePositions.push(start, corner, end);

    [start, corner, corner, end].forEach((point, pointIndex) => {
      pathPositions.push(point.x, point.y, point.z);
      const mix = (index / pathCount + pointIndex * .08) % 1;
      const color = cyan.clone().lerp(violet, mix * .72);
      pathColors.push(color.r, color.g, color.b);
    });
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pathPositions, 3));
  lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(pathColors, 3));
  const network = new THREE.LineSegments(lineGeometry, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: .24,
    blending: THREE.AdditiveBlending,
  }));
  group.add(network);

  const wallPositions = [];
  const wallColors = [];
  const wallNodes = [];
  const wallCurves = [];
  const wallPathCount = compact ? 16 : 36;
  for (let index = 0; index < wallPathCount; index += 1) {
    const start = new THREE.Vector3(
      Math.round((random() - .5) * 17) * .55,
      -.7 + Math.round(random() * 10) * .48,
      -4.25 - random() * .8,
    );
    const corner = new THREE.Vector3(
      start.x + (random() > .5 ? 1 : -1) * (1 + Math.floor(random() * 4)) * .58,
      start.y,
      start.z,
    );
    const end = new THREE.Vector3(
      corner.x,
      corner.y + (random() > .5 ? 1 : -1) * (1 + Math.floor(random() * 3)) * .5,
      corner.z,
    );
    wallCurves.push(new THREE.CatmullRomCurve3([start, corner, end], false, 'catmullrom', .02));
    wallNodes.push(start, corner, end);
    [start, corner, corner, end].forEach((point, pointIndex) => {
      wallPositions.push(point.x, point.y, point.z);
      const color = cyan.clone().lerp(violet, ((index + pointIndex) % 9) / 14);
      wallColors.push(color.r, color.g, color.b);
    });
  }
  const wallGeometry = new THREE.BufferGeometry();
  wallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(wallPositions, 3));
  wallGeometry.setAttribute('color', new THREE.Float32BufferAttribute(wallColors, 3));
  group.add(new THREE.LineSegments(wallGeometry, new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: .2,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })));

  const wallNodeGeometry = new THREE.BufferGeometry().setFromPoints(wallNodes);
  group.add(new THREE.Points(wallNodeGeometry, new THREE.PointsMaterial({
    color: COLORS.blue,
    size: compact ? .09 : .12,
    map: glowTexture,
    transparent: true,
    opacity: .68,
    alphaTest: .01,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })));

  const nodeGeometry = new THREE.BufferGeometry().setFromPoints(nodePositions);
  const nodeColors = new Float32Array(nodePositions.length * 3);
  nodePositions.forEach((_, index) => {
    const color = index % 7 === 0 ? violet : cyan;
    nodeColors[index * 3] = color.r;
    nodeColors[index * 3 + 1] = color.g;
    nodeColors[index * 3 + 2] = color.b;
  });
  nodeGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
  const nodes = new THREE.Points(nodeGeometry, new THREE.PointsMaterial({
    size: compact ? .1 : .12,
    map: glowTexture,
    vertexColors: true,
    transparent: true,
    opacity: .86,
    alphaTest: .01,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  }));
  group.add(nodes);

  const beaconPositions = [];
  const beaconTops = [];
  const beaconCount = compact ? 4 : 8;
  for (let index = 0; index < beaconCount; index += 1) {
    const anchor = nodePositions[Math.floor(random() * nodePositions.length)].clone();
    const top = anchor.clone();
    top.y += .55 + random() * 1.5;
    beaconPositions.push(anchor.x, anchor.y, anchor.z, top.x, top.y, top.z);
    beaconTops.push(top);
  }
  const beaconGeometry = new THREE.BufferGeometry();
  beaconGeometry.setAttribute('position', new THREE.Float32BufferAttribute(beaconPositions, 3));
  const beacons = new THREE.LineSegments(beaconGeometry, new THREE.LineBasicMaterial({
    color: COLORS.blue,
    transparent: true,
    opacity: .48,
    blending: THREE.AdditiveBlending,
  }));
  group.add(beacons);

  const beaconTopGeometry = new THREE.BufferGeometry().setFromPoints(beaconTops);
  const beaconTopMaterial = new THREE.PointsMaterial({
    color: COLORS.cyan,
    size: .19,
    map: glowTexture,
    transparent: true,
    alphaTest: .01,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  group.add(new THREE.Points(beaconTopGeometry, beaconTopMaterial));

  const flowDots = paths.slice(0, compact ? 3 : 7).map((curve, index) => {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(.055 + (index % 2) * .018, 10, 10),
      new THREE.MeshBasicMaterial({
        color: index % 3 === 2 ? COLORS.violet : COLORS.cyan,
        toneMapped: false,
      }),
    );
    dot.userData = {
      curve,
      offset: index / 7,
      speed: .075 + index * .009,
    };
    group.add(dot);
    return dot;
  });

  wallCurves.slice(0, compact ? 2 : 6).forEach((curve, index) => {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(.05 + (index % 2) * .015, 10, 10),
      new THREE.MeshBasicMaterial({
        color: index % 3 === 2 ? COLORS.violet : COLORS.blue,
        toneMapped: false,
      }),
    );
    dot.userData = {
      curve,
      offset: (index + 1) / 7,
      speed: .052 + index * .008,
    };
    group.add(dot);
    flowDots.push(dot);
  });

  const ambientCyan = createGlowSprite(glowTexture, COLORS.blue, .18, 8.8);
  ambientCyan.position.set(.8, -.15, -2.4);
  group.add(ambientCyan);
  const ambientViolet = createGlowSprite(glowTexture, COLORS.violet, .11, 6.4);
  ambientViolet.position.set(4.4, -.6, -1.7);
  group.add(ambientViolet);

  return { group, flowDots, nodes, beacons };
}

function createDecorations({ compact, lowPower, glowTexture }) {
  const group = new THREE.Group();
  group.name = 'floating-objects';
  const cubeData = [
    { position: [-4.6, 1.4, -1.8], scale: .72, speed: .62, phase: .2 },
    { position: [4.9, 2.1, -2.7], scale: .84, speed: .48, phase: 2.1 },
    { position: [2.9, 4.2, -3.3], scale: 1.16, speed: .42, phase: 3.2 },
    { position: [-5.5, -.25, 1.2], scale: .5, speed: .71, phase: 4.4 },
    { position: [5.8, -.7, .35], scale: .58, speed: .55, phase: 1.4 },
    { position: [-2.7, 3.25, -3.9], scale: .42, speed: .84, phase: 5.3 },
    { position: [2.5, -.95, 2.75], scale: .38, speed: .9, phase: 2.8 },
  ];
  const visibleCubes = compact ? cubeData.slice(0, 4) : lowPower ? cubeData.slice(0, 5) : cubeData;
  const cubeGeometry = new RoundedBoxGeometry(.72, .72, .72, 3, .07);
  const cubeEdgesGeometry = new THREE.EdgesGeometry(cubeGeometry, 34);
  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x111c31,
    metalness: .4,
    roughness: .38,
    emissive: 0x071229,
    emissiveIntensity: .62,
    transparent: true,
    opacity: .86,
  });

  const cubes = visibleCubes.map((data, index) => {
    const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial.clone());
    mesh.position.set(...data.position);
    mesh.scale.setScalar(data.scale);
    mesh.rotation.set(index * .18, index * .32, index * -.12);
    mesh.userData = {
      baseY: data.position[1],
      speed: data.speed,
      phase: data.phase,
      rotationSpeed: .12 + index * .025,
    };
    mesh.add(new THREE.LineSegments(
      cubeEdgesGeometry,
      new THREE.LineBasicMaterial({
        color: index % 3 === 1 ? COLORS.violet : COLORS.blue,
        transparent: true,
        opacity: .24,
        blending: THREE.AdditiveBlending,
      }),
    ));
    group.add(mesh);
    return mesh;
  });

  const iconData = compact ? [] : [
    { label: '</>', position: [-3.35, -.05, 1.9], scale: .72, phase: .4, colors: ['#00d9ff', '#2563eb'] },
    { label: 'PY', position: [4.15, 1.0, -1.1], scale: .62, phase: 2.4, colors: ['#38bdf8', '#8b5cf6'] },
    { label: 'DB', position: [-1.7, 3.55, -3.0], scale: .68, phase: 4.1, colors: ['#2563eb', '#a855f7'] },
  ];
  const icons = iconData.map((data) => {
    const texture = createGlyphTexture(data.label, ...data.colors);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: .34,
      depthWrite: false,
      toneMapped: false,
    }));
    sprite.position.set(...data.position);
    sprite.scale.set(data.scale, data.scale, 1);
    sprite.userData = { baseY: data.position[1], phase: data.phase };

    const halo = createGlowSprite(glowTexture, COLORS.blue, .1, data.scale * 2.1);
    halo.position.copy(sprite.position);
    halo.position.z -= .04;
    group.add(halo, sprite);
    return sprite;
  });

  return { group, cubes, icons };
}

async function createSceneGraph({ compact, lowPower, allowShadows }) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COLORS.background, compact ? .044 : .033);
  const glowTexture = createRadialTexture();

  const environment = createEnvironment({ compact, glowTexture });
  await yieldToMain();
  const particles = createParticleField({ compact, lowPower });
  await yieldToMain();
  const decorations = createDecorations({ compact, lowPower, glowTexture });
  await yieldToMain();
  const platform = createPlatform({ allowShadows, glowTexture });
  await yieldToMain();
  const developerCube = createDeveloperCube({ allowShadows, glowTexture });
  await yieldToMain();

  const world = new THREE.Group();
  world.name = 'central-developer-object';
  world.position.set(.62, -.7, .15);
  world.rotation.y = -.12;
  world.add(platform.group, developerCube.group);

  scene.add(environment.group, particles.points, decorations.group, world);

  scene.add(new THREE.HemisphereLight(0x8baeff, 0x02040b, .72));
  const keyLight = new THREE.DirectionalLight(0xb8d9ff, 2.35);
  keyLight.position.set(-4.8, 7.2, 5.5);
  keyLight.castShadow = allowShadows;
  if (allowShadows) {
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -5;
    keyLight.shadow.camera.right = 5;
    keyLight.shadow.camera.top = 5;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -.0005;
  }
  scene.add(keyLight);

  const cyanFill = new THREE.PointLight(COLORS.cyan, 20, 10, 2);
  cyanFill.position.set(-3.5, -.9, 3.6);
  scene.add(cyanFill);
  const violetRim = new THREE.PointLight(COLORS.violet, 32, 11, 2);
  violetRim.position.set(4.6, -.45, 1.2);
  scene.add(violetRim);
  const topFill = new THREE.PointLight(0x6f8dff, 18, 11, 2);
  topFill.position.set(1.2, 5.4, -1.8);
  scene.add(topFill);

  return {
    scene,
    world,
    environment,
    particles,
    decorations,
    platform,
    developerCube,
  };
}

export async function mountHeroScene({ canvas, sceneElement, reduceMotion }) {
  const compact = window.matchMedia('(max-width: 960px)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  const allowShadows = false;
  const context = canvas.getContext('webgl2', {
    alpha: true,
    antialias: !compact,
    depth: true,
    stencil: false,
    powerPreference: 'high-performance',
  });

  if (!context) throw new Error('WebGL2 indisponível');

  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: !compact,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(COLORS.background, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = false;

  const camera = new THREE.PerspectiveCamera(compact ? 36 : 33.5, 1, .1, 60);
  camera.position.set(compact ? 4.85 : 4.65, compact ? 3.5 : 3.75, compact ? 12.2 : 11.85);
  camera.lookAt(.62, -.15, 0);

  const graph = await createSceneGraph({ compact, lowPower, allowShadows });
  if (renderer.compileAsync) await renderer.compileAsync(graph.scene, camera);
  const panels = [...sceneElement.querySelectorAll('[data-scene-panel]')];
  const pointerTarget = new THREE.Vector2();
  const pointerCurrent = new THREE.Vector2();
  const hero = sceneElement.closest('[data-hero]');
  let sceneVisible = true;
  let frameId = 0;
  let previousTime = performance.now();
  let disposed = false;

  function resize() {
    const { width, height } = sceneElement.getBoundingClientRect();
    if (!width || !height) return;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, compact ? 1.2 : lowPower ? 1.35 : 1.6);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (reduceMotion.matches) render(0, 0);
  }

  function updateScene(elapsed, delta) {
    pointerCurrent.x = damp(pointerCurrent.x, pointerTarget.x, 5.2, delta);
    pointerCurrent.y = damp(pointerCurrent.y, pointerTarget.y, 5.2, delta);

    const idleYaw = Math.sin(elapsed * .43) * .017;
    const idlePitch = Math.cos(elapsed * .37) * .009;
    graph.world.rotation.y = damp(graph.world.rotation.y, -.12 + pointerCurrent.x * .087 + idleYaw, 3.5, delta);
    graph.world.rotation.x = damp(graph.world.rotation.x, pointerCurrent.y * -.055 + idlePitch, 3.5, delta);
    graph.world.position.x = damp(graph.world.position.x, .62 + pointerCurrent.x * .13, 4, delta);
    graph.world.position.y = damp(graph.world.position.y, -.7 + pointerCurrent.y * .08, 4, delta);

    graph.environment.group.rotation.y = damp(graph.environment.group.rotation.y, pointerCurrent.x * -.012, 2.4, delta);
    graph.environment.group.position.x = damp(graph.environment.group.position.x, pointerCurrent.x * -.055, 2.4, delta);
    graph.decorations.group.rotation.y = damp(graph.decorations.group.rotation.y, pointerCurrent.x * -.035, 2.8, delta);
    graph.particles.points.position.x = damp(graph.particles.points.position.x, pointerCurrent.x * -.08, 2.2, delta);

    const cubeFloat = (Math.sin(elapsed * 1.22) + 1) * (compact ? .0325 : .0525);
    graph.developerCube.group.position.y = .45 + cubeFloat;
    graph.developerCube.group.rotation.y = Math.sin(elapsed * .68) * .025;
    graph.developerCube.group.rotation.x = Math.cos(elapsed * .54) * .012;
    graph.developerCube.group.rotation.z = Math.sin(elapsed * .47) * .008;
    graph.platform.contactMaterial.opacity = .66 - cubeFloat * 1.35;

    graph.platform.ledUniforms.uTime.value = elapsed;
    graph.platform.ledGlowUniforms.uTime.value = elapsed;
    graph.platform.energyOrb.position.copy(graph.platform.ledCurve.getPointAt((elapsed * .255) % 1));
    graph.particles.uniforms.uTime.value = elapsed;

    graph.environment.flowDots.forEach((dot) => {
      const { curve, offset, speed } = dot.userData;
      dot.position.copy(curve.getPointAt((elapsed * speed + offset) % 1));
      const pulse = .72 + Math.sin(elapsed * 2.2 + offset * 8) * .26;
      dot.scale.setScalar(pulse);
    });
    graph.environment.nodes.material.opacity = .68 + Math.sin(elapsed * 1.15) * .16;
    graph.environment.beacons.material.opacity = .38 + (Math.sin(elapsed * .82) + 1) * .11;

    graph.decorations.cubes.forEach((cube, index) => {
      const { baseY, speed, phase, rotationSpeed } = cube.userData;
      cube.position.y = baseY + Math.sin(elapsed * speed + phase) * (.1 + index * .012);
      cube.rotation.x += delta * rotationSpeed * .65;
      cube.rotation.y += delta * rotationSpeed;
    });
    graph.decorations.icons.forEach((icon) => {
      icon.position.y = icon.userData.baseY + Math.sin(elapsed * .7 + icon.userData.phase) * .1;
      icon.material.opacity = .34 + (Math.sin(elapsed * .9 + icon.userData.phase) + 1) * .08;
    });

    panels.forEach((panel) => {
      const depth = Number(panel.dataset.depth || 0);
      panel.style.setProperty('--panel-x', `${pointerCurrent.x * depth * 11}px`);
      panel.style.setProperty('--panel-y', `${pointerCurrent.y * depth * 7}px`);
    });
  }

  function render(elapsed, delta) {
    updateScene(elapsed, delta);
    renderer.render(graph.scene, camera);
  }

  function tick(now) {
    if (disposed || !sceneVisible || document.hidden || reduceMotion.matches) {
      frameId = 0;
      return;
    }
    const delta = Math.min((now - previousTime) / 1000, .05);
    previousTime = now;
    render(now / 1000, delta);
    frameId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (frameId || disposed || !sceneVisible || document.hidden || reduceMotion.matches) return;
    previousTime = performance.now();
    frameId = requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (!frameId) return;
    cancelAnimationFrame(frameId);
    frameId = 0;
  }

  function updatePointer(event) {
    const bounds = hero.getBoundingClientRect();
    pointerTarget.x = THREE.MathUtils.clamp(((event.clientX - bounds.left) / bounds.width - .5) * 2, -1, 1);
    pointerTarget.y = THREE.MathUtils.clamp(((event.clientY - bounds.top) / bounds.height - .5) * 2, -1, 1);
  }

  function resetPointer() {
    pointerTarget.set(0, 0);
  }

  if (finePointer && !reduceMotion.matches) {
    hero.addEventListener('pointermove', updatePointer, { passive: true });
    hero.addEventListener('pointerleave', resetPointer);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(sceneElement);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    sceneVisible = entry.isIntersecting;
    hero?.classList.toggle('scene-paused', !sceneVisible);
    if (sceneVisible) startLoop();
    else stopLoop();
  }, { threshold: .02 });
  visibilityObserver.observe(sceneElement);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopLoop();
    else startLoop();
  });

  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    disposed = true;
    stopLoop();
    sceneElement.classList.remove('is-webgl-ready');
  }, { once: true });

  resize();
  render(0, 0);
  sceneElement.classList.add('is-webgl-ready');
  if (!reduceMotion.matches) startLoop();
}
