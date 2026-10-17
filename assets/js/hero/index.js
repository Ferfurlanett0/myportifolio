const sceneElement = document.querySelector('[data-hero-scene]');
const canvas = document.querySelector('[data-hero-canvas]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactViewport = window.matchMedia('(max-width: 480px)');
const saveData = navigator.connection?.saveData === true;

async function startHeroScene() {
  if (!sceneElement || !canvas) return;

  if (compactViewport.matches || saveData) {
    sceneElement.classList.add('is-static-fallback');
    const stateLabel = document.querySelector('[data-render-state]');
    if (stateLabel) stateLabel.textContent = 'Representação estática';
    return;
  }

  try {
    const { mountHeroScene } = await import('./scene.js?v=20261017-3');
    await mountHeroScene({ canvas, sceneElement, reduceMotion });
  } catch (error) {
    sceneElement.classList.remove('is-webgl-ready');
    sceneElement.classList.add('is-static-fallback');
    const stateLabel = document.querySelector('[data-render-state]');
    if (stateLabel) stateLabel.textContent = 'Representação estática';
    console.warn('A experiência 3D não pôde ser iniciada; exibindo a representação estática.', error);
  }
}

startHeroScene();
