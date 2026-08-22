// ============ Montex — skript webu ============

// --- Pevná hlavička pri scrollovaní ---
const header = document.querySelector('.site-header');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('solid');
  else header.classList.remove('solid');
};
window.addEventListener('scroll', onScroll);
onScroll();

// --- Mobilné menu ---
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const closeBtn = document.querySelector('.mobile-nav .close-btn');
if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => mobileNav.classList.add('open'));
  closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileNav.classList.remove('open'))
  );
}

// --- Zobrazovanie prvkov pri scrollovaní ---
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

// --- Počítadlo štatistík ---
const counters = document.querySelectorAll('[data-count]');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target % 1 === 0 ? Math.floor(target * eased) : (target * eased).toFixed(1);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach(el => countIO.observe(el));

// --- Kontaktný formulár → odoslanie cez WhatsApp ---
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('c-name').value.trim();
    const phone = document.getElementById('c-phone').value.trim();
    const service = document.getElementById('c-service').value;
    const message = document.getElementById('c-message').value.trim();

    if (!name || !phone) {
      alert('Prosím, vyplňte aspoň meno a telefónne číslo.');
      return;
    }

    const waNumber = '421944267418'; // Montex WhatsApp / telefón
    const text = `Dobrý deň Montex,%0AMeno: ${encodeURIComponent(name)}%0ATelefón: ${encodeURIComponent(phone)}%0APožadovaná služba: ${encodeURIComponent(service)}%0ADetaily: ${encodeURIComponent(message)}`;
    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');
    contactForm.reset();
  });
}

// --- Rok v pätičke ---
document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

// --- Cookie lišta (GDPR) ---
const cookieBar = document.getElementById('cookie-bar');
if (cookieBar) {
  const consent = localStorage.getItem('montex-cookie-consent');
  if (!consent) {
    setTimeout(() => cookieBar.classList.add('show'), 800);
  }
  const hide = (value) => {
    localStorage.setItem('montex-cookie-consent', value);
    cookieBar.classList.remove('show');
  };
  document.getElementById('cookie-accept')?.addEventListener('click', () => hide('accepted'));
  document.getElementById('cookie-decline')?.addEventListener('click', () => hide('declined'));
}
