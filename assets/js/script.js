const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const navLinks = [...document.querySelectorAll('.main-nav a')];
const sections = [...document.querySelectorAll('main section[id]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 18);
}

function closeMenu() {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.setAttribute('aria-label', open ? 'Abrir menu' : 'Fechar menu');
  nav?.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 900) closeMenu(); });
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

const activeSectionObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => {
    const active = link.getAttribute('href') === `#${visible.target.id}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-28% 0px -62%', threshold: [0, .1, .35] });

sections.forEach((section) => activeSectionObserver.observe(section));
const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

if (!reduceMotion.matches && window.gsap && window.ScrollTrigger) {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  const compactMotion = window.matchMedia('(max-width: 900px)').matches;

  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro
    .from('.availability', { y: 10, opacity: 0, duration: .42 })
    .from('.hero h1', { y: compactMotion ? 26 : 42, opacity: 0, filter: compactMotion ? 'none' : 'blur(6px)', duration: compactMotion ? .62 : .82 }, '-=.28')
    .from('.hero-description', { y: 16, opacity: 0, duration: .52 }, '-=.5')
    .from('.hero-actions, .hero-links', { y: 12, opacity: 0, duration: .46, stagger: .06 }, '-=.38')
    .from('[data-hero-visual]', { scale: .96, opacity: 0, filter: compactMotion ? 'none' : 'blur(7px)', duration: .78 }, '-=.68')
    .from('.discipline-rail > div', { y: 12, opacity: 0, duration: .42, stagger: .045 }, '-=.52');

  gsap.utils.toArray('[data-case-study]').forEach((study) => {
    const visual = study.querySelector('[data-case-visual]');
    const copy = study.querySelector('.case-copy');
    gsap.from(visual, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.15,
      ease: 'expo.out',
      scrollTrigger: { trigger: study, start: 'top 78%', once: true },
    });
    gsap.from(copy, {
      y: 44,
      opacity: 0,
      duration: .9,
      ease: 'expo.out',
      scrollTrigger: { trigger: study, start: 'top 72%', once: true },
    });
  });

  gsap.from('.project-row', {
    y: 26,
    opacity: 0,
    duration: .7,
    stagger: .1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.project-register', start: 'top 82%', once: true },
  });

  gsap.from('.capability-row', {
    clipPath: 'inset(0 100% 0 0)',
    duration: .85,
    stagger: .09,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.capability-matrix', start: 'top 78%', once: true },
  });

  gsap.from('.experience-list article', {
    y: 24,
    opacity: 0,
    duration: .75,
    stagger: .08,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.experience-list', start: 'top 80%', once: true },
  });

  ScrollTrigger.create({
    trigger: '[data-hero]',
    start: 'top top',
    end: 'bottom top',
    scrub: .5,
    onUpdate: ({ progress }) => window.dispatchEvent(new CustomEvent('portfolio:hero-progress', { detail: progress })),
  });
}
