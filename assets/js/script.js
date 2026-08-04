const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const techTrack = document.querySelector('[data-tech-track]');
const techGroup = document.querySelector('[data-tech-group]');
const hero = document.querySelector('[data-hero]');
const heroScene = document.querySelector('[data-hero-scene]');
const heroObject = document.querySelector('[data-hero-object]');
const finePointer = window.matchMedia('(pointer: fine)');

if (hero && heroObject && finePointer.matches && !reduceMotion.matches) {
  let sceneFrame;

  const updateScene = (clientX, clientY) => {
    const bounds = hero.getBoundingClientRect();
    const normalizedX = Math.max(-1, Math.min(1, ((clientX - bounds.left) / bounds.width - .5) * 2));
    const normalizedY = Math.max(-1, Math.min(1, ((clientY - bounds.top) / bounds.height - .5) * 2));

    cancelAnimationFrame(sceneFrame);
    sceneFrame = requestAnimationFrame(() => {
      heroObject.style.setProperty('--scene-x', `${normalizedX * 5}px`);
      heroObject.style.setProperty('--scene-y', `${normalizedY * 4}px`);
      heroObject.style.setProperty('--scene-rx', `${normalizedY * -1.8}deg`);
      heroObject.style.setProperty('--scene-ry', `${normalizedX * 3}deg`);
    });
  };

  const resetScene = () => {
    heroObject.classList.remove('is-interacting');
    heroObject.style.setProperty('--scene-x', '0px');
    heroObject.style.setProperty('--scene-y', '0px');
    heroObject.style.setProperty('--scene-rx', '0deg');
    heroObject.style.setProperty('--scene-ry', '0deg');
  };

  hero.addEventListener('pointerenter', () => heroObject.classList.add('is-interacting'));
  hero.addEventListener('pointermove', (event) => updateScene(event.clientX, event.clientY));
  hero.addEventListener('pointerleave', resetScene);
}

if (hero) {
  const sceneVisibilityObserver = new IntersectionObserver(([entry]) => {
    hero.classList.toggle('scene-paused', !entry.isIntersecting || document.hidden);
  }, { threshold: .02 });

  sceneVisibilityObserver.observe(hero);
  document.addEventListener('visibilitychange', () => {
    hero.classList.toggle('scene-paused', document.hidden || hero.getBoundingClientRect().bottom < 0);
  });
}

if (techTrack && techGroup && !reduceMotion.matches) {
  const clonedGroup = techGroup.cloneNode(true);
  clonedGroup.removeAttribute('data-tech-group');
  clonedGroup.setAttribute('aria-hidden', 'true');
  techTrack.append(clonedGroup);
  requestAnimationFrame(() => techTrack.classList.add('ready'));
}

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 20);
}

function closeMenu() {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
}

function toggleMenu() {
  if (!menuToggle || !nav) return;
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  nav.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
}

menuToggle?.addEventListener('click', toggleMenu);
navLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 960) closeMenu();
});

const activeSectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;
  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${visible.target.id}`;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-30% 0px -55%', threshold: [0, .15, .4] });

sections.forEach((section) => activeSectionObserver.observe(section));

const revealElements = document.querySelectorAll('.reveal-on-scroll');
if (reduceMotion.matches) {
  revealElements.forEach((element) => element.classList.add('visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -50px' });
  revealElements.forEach((element) => revealObserver.observe(element));
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
