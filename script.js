// ===== HERO SLIDER =====
(function () {
  const slides = document.querySelectorAll('.slide');
  const dotsContainer = document.getElementById('sliderDots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;
  let timer;

  // Créer les dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.slider-dot');

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startTimer() { timer = setInterval(() => goTo(current + 1), 5500); }
  function resetTimer()  { clearInterval(timer); startTimer(); }

  // Pause au survol
  const hero = document.getElementById('hero');
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', startTimer);

  // Swipe tactile
  let touchStartX = 0;
  hero.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
  });

  startTimer();
})();

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ===== STATS COUNTER =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const id = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString('fr-FR');
    if (start >= target) clearInterval(id);
  }, 16);
}

const statsSection = document.getElementById('stats');
let statsAnimated = false;
new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    document.querySelectorAll('.stat-number').forEach(el => {
      animateCounter(el, parseInt(el.dataset.target));
    });
  }
}, { threshold: 0.2 }).observe(statsSection);

// ===== CARD ENTRANCE ANIMATIONS =====
// Utilise un compteur global pour que le stagger soit correct sur Vercel
const cards = document.querySelectorAll('.card, .contact-card');
let cardVisibleCount = 0;

const cardObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = (cardVisibleCount % 6) * 90;
      cardVisibleCount++;
      setTimeout(() => {
        entry.target.classList.add('card-visible');
      }, delay);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

cards.forEach(card => {
  card.classList.add('card-hidden');
  cardObserver.observe(card);
});

// ===== DEVIS FORM =====
const devisForm  = document.getElementById('devisForm');
const formSuccess = document.getElementById('formSuccess');

devisForm.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;

  devisForm.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) { field.classList.add('error'); valid = false; }
  });

  if (!valid) return;

  const btn = devisForm.querySelector('.btn-submit');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

  setTimeout(() => {
    btn.style.display = 'none';
    formSuccess.classList.add('show');
    devisForm.reset();
  }, 1400);
});

devisForm.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('error'));
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});
