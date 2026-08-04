const sceneElement = document.querySelector('[data-hero-scene]');
const canvas = document.querySelector('[data-hero-canvas]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactViewport = window.matchMedia('(max-width: 480px)');
const saveData = navigator.connection?.saveData === true;

async function startHeroScene() {
  if (!sceneElement || !canvas || compactViewport.matches || saveData) return;

  try {
    const { mountHeroScene } = await import('./scene.js?v=20260804-1');
    await mountHeroScene({ canvas, sceneElement, reduceMotion });
  } catch (error) {
    sceneElement.classList.remove('is-webgl-ready');
    console.warn('A experiência 3D não pôde ser iniciada; exibindo a arte estática.', error);
  }
}

startHeroScene();
