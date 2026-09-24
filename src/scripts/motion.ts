import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Progresión segura: en el HTML/CSS todo parte visible. Este script, si corre y el visitante no pidió
// menos movimiento, oculta primero (gsap.set) y anima después. Sin JS o con `prefers-reduced-motion`,
// el contenido nunca queda invisible.
//
// Se usa scroll nativo (más `scroll-behavior: smooth` en CSS) en vez de una librería de scroll suave
// tipo Lenis: Lenis entra en conflicto con la cabecera `position: sticky` (fricción documentada entre
// ambos), y ScrollTrigger funciona igual de bien sobre scroll nativo.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

gsap.registerPlugin(ScrollTrigger);

// Las fuentes web (Unbounded/Jost) pueden cambiar la altura del documento al cargar, y con ella las
// posiciones de disparo de ScrollTrigger (una sección puede quedar "más abajo" de lo calculado y no
// disparar nunca). Por eso los triggers se crean una sola vez, después de que las fuentes están listas,
// en vez de calcularlos ya y refrescarlos más tarde. Las imágenes no necesitan este cuidado: todas
// declaran `width`/`height`, así que no corren el layout al cargar.
if (!prefersReducedMotion) {
  document.fonts.ready.then(() => {
    // Hero: las formas geométricas se ensamblan al cargar (el hilo visual del isotipo, ver docs/BRAND.md).
    // Cada forma define su propia opacidad final en CSS (son un tinte de fondo sutil, no bloques sólidos);
    // se captura antes de que gsap.set la sobreescriba, para no terminar animando siempre a opacity:1.
    const heroShapes = document.querySelectorAll<HTMLElement>('[data-hero-shape]');
    if (heroShapes.length) {
      const finalOpacity = new Map<HTMLElement, string>(
        Array.from(heroShapes, (el) => [el, getComputedStyle(el).opacity]),
      );
      gsap.set(heroShapes, { opacity: 0, scale: 0.5, rotate: (i) => (i % 2 === 0 ? -14 : 14) });
      gsap.to(heroShapes, {
        opacity: (_i, target: HTMLElement) => finalOpacity.get(target) ?? '1',
        scale: 1,
        rotate: 0,
        duration: 1.1,
        ease: 'back.out(1.6)',
        stagger: 0.12,
        delay: 0.15,
      });
    }

    const heroText = document.querySelectorAll<HTMLElement>('[data-hero-text]');
    if (heroText.length) {
      gsap.set(heroText, { opacity: 0, y: 18 });
      gsap.to(heroText, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.08, delay: 0.35 });
    }

    // Secciones: aparecen al hacer scroll.
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.set(el, { opacity: 0, y: 28 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    // Grupos de tarjetas: entran en cascada.
    document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((group) => {
      const items = Array.from(group.children);
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: 22 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.08,
        scrollTrigger: { trigger: group, start: 'top 85%' },
      });
    });
  });
}

// "Hoy en Spazio": marca el día actual en cualquier elemento con data-day="0..5" (lunes a sábado).
// No depende de las animaciones ni de JS opcional del resto del script.
const jsDay = new Date().getDay(); // 0 = domingo
const todayIndex = jsDay === 0 ? -1 : jsDay - 1; // -1 = domingo, la academia no abre
document.querySelectorAll<HTMLElement>(`[data-day="${todayIndex}"]`).forEach((el) => {
  el.dataset.today = 'true';
});
