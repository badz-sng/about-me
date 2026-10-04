const menu = document.querySelector('.menu-btn');
const navigation = document.querySelector('.nav-links');
menu.hidden = false;
navigation.classList.add('enhanced');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
const themeButton = document.getElementById('theme-toggle');
const themeButtons = [themeButton, document.getElementById('floating-theme-toggle')];
function setTheme(theme) {
  document.body.dataset.theme = theme;
  document.documentElement.dataset.theme = theme;
  const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;
  themeButtons.forEach((button) => {
    button.setAttribute('aria-label', label);
    button.innerHTML = `<i class="ti ti-${theme === 'dark' ? 'sun' : 'moon'}" aria-hidden="true"></i>` +
      (button.id === 'floating-theme-toggle' ? `<span class="floating-label">${label}</span>` : '');
  });
}
let savedTheme;
try { savedTheme = localStorage.getItem('portfolio-theme'); } catch {}
setTheme(savedTheme === 'light' ? 'light' : 'dark');
let themeTransitionRunning = false;
themeButtons.forEach((button) => button.addEventListener('click', async (event) => {
  if (themeTransitionRunning) return;
  const theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
  const applyTheme = () => {
    setTheme(theme);
    try { localStorage.setItem('portfolio-theme', theme); } catch {}
  };
  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    applyTheme();
    return;
  }
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = bounds.left + bounds.width / 2;
  const y = bounds.top + bounds.height / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  themeTransitionRunning = true;
  let transition;
  try {
    transition = document.startViewTransition(applyTheme);
    await transition.ready;
    await document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(.22, 1, .36, 1)', pseudoElement: '::view-transition-new(root)' }
    ).finished;
    await transition.finished;
  } catch {
    transition?.skipTransition();
    applyTheme();
  } finally {
    themeTransitionRunning = false;
  }
}));
const lightbox = document.getElementById('lightbox');
if (lightbox) {
  document.querySelector('.image-trigger').addEventListener('click', () => lightbox.showModal());
  document.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}
const quoteForm = document.getElementById('quote-form');
const quoteTotal = document.getElementById('quote-total');
const quoteBreakdown = document.getElementById('quote-breakdown');
const quoteInquiry = document.getElementById('quote-inquiry');
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
function updateQuote() {
  const rate = 10;
  const hours = document.getElementById('quote-hours').valueAsNumber;
  if (!quoteForm.checkValidity() || !Number.isFinite(rate * hours)) {
    quoteTotal.value = '—';
    quoteBreakdown.textContent = 'Enter valid whole hours to calculate.';
    quoteInquiry.href = 'mailto:emmanuel.fullstack.dev@gmail.com';
    return;
  }
  const service = document.getElementById('quote-service').value;
  const total = money.format(rate * hours);
  quoteTotal.value = total;
  quoteBreakdown.textContent = `${money.format(rate)} / hour × ${hours} hours`;
  quoteInquiry.href = `mailto:emmanuel.fullstack.dev@gmail.com?subject=${encodeURIComponent(`Project inquiry: ${service}`)}&body=${encodeURIComponent(`Hi Emmanuel,\n\nI'd like to discuss ${service}.\nPlanning estimate: ${total} (${hours} hours at ${money.format(rate)}/hour).\nThis estimate uses your US$10 hourly rate and is subject to confirmed scope.\n\nProject scope:\nTimeline:\n`)}`;
}
quoteForm?.addEventListener('submit', (event) => { event.preventDefault(); updateQuote(); });
quoteForm?.addEventListener('input', updateQuote);
quoteForm?.addEventListener('change', updateQuote);

const backToTop = document.getElementById('back-to-top');
const impression = document.getElementById('impression-dialog');
backToTop.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  const deadline = performance.now() + 5000;
  function showWhenAtTop() {
    if (window.scrollY <= 8) {
      if (!impression.open) impression.showModal();
    } else if (performance.now() < deadline) {
      requestAnimationFrame(showWhenAtTop);
    }
  }
  requestAnimationFrame(showWhenAtTop);
});
document.querySelector('.impression-close').addEventListener('click', () => impression.close());
impression.addEventListener('click', (event) => {
  if (event.target === impression) impression.close();
});
document.getElementById('impression-contact').addEventListener('click', () => {
  impression.close();
  const contact = document.getElementById('contact');
  if (contact) {
    contact.setAttribute('tabindex', '-1');
    contact.focus({ preventScroll: true });
  }
});
const githubChart = document.getElementById('github-chart');
if (githubChart) {
  function showChartError() {
    document.getElementById('github-chart-error').hidden = false;
    document.querySelector('.github-chart-scroll').hidden = true;
  }
  githubChart.addEventListener('error', showChartError);
  if (githubChart.complete && githubChart.naturalWidth === 0) showChartError();
}
// The rail follows content within the current page; top navigation changes pages.
const sectionLinks = [...document.querySelectorAll('.section-rail a')];
const visibleSections = new Set();
let preferredSection = window.location.hash;
function activateSection(hash) {
  sectionLinks.forEach((link) => {
    if (link.hash === hash) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
if (sectionLinks.some((link) => link.hash === preferredSection)) activateSection(preferredSection);
sectionLinks.forEach((link) => link.addEventListener('click', () => {
  preferredSection = link.hash;
  activateSection(link.hash);
}));
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const hash = `#${entry.target.id}`;
    if (entry.isIntersecting) visibleSections.add(hash);
    else visibleSections.delete(hash);
  });
  const current = visibleSections.has(preferredSection)
    ? preferredSection
    : sectionLinks.find((link) => visibleSections.has(link.hash))?.hash;
  if (current) {
    preferredSection = current;
    activateSection(current);
  }
}, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
sectionLinks.forEach((link) => sectionObserver.observe(document.querySelector(link.hash)));

const floatingControls = document.getElementById('floating-controls');
const navigationObserver = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting && floatingControls.contains(document.activeElement)) {
    themeButton.focus({ preventScroll: true });
  }
  floatingControls.hidden = entry.isIntersecting;
}, { threshold: 0 });
navigationObserver.observe(document.getElementById('primary-navigation'));

// Allow subpixel rounding at the viewport edge; the hidden button retains its layout space.
const scrollStart = document.getElementById('scroll-start');
const footer = document.querySelector('footer');
let wholeFooterVisible = false;
let hasScrolledFromTop = false;
const footerObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.target === footer) wholeFooterVisible = entry.isIntersecting && entry.intersectionRatio >= 0.99;
    if (entry.target === scrollStart) hasScrolledFromTop = !entry.isIntersecting;
  });
  backToTop.hidden = !(wholeFooterVisible && hasScrolledFromTop);
}, { threshold: [0, 0.99] });
footerObserver.observe(footer);
footerObserver.observe(scrollStart);
