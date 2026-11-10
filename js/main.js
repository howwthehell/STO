const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

/* шапка и мобильное меню */
const header = $('.header'), burger = $('.burger'), nav = $('.nav');
const onScroll = () => header.classList.toggle('solid', scrollY > 40 || document.body.classList.contains('inner'));
addEventListener('scroll', onScroll, { passive: true }); onScroll();
const closeMenu = () => { nav.classList.remove('open'); burger.classList.remove('open'); };
burger.addEventListener('click', () => { nav.classList.toggle('open'); burger.classList.toggle('open'); });
$$('.nav a').forEach(a => a.addEventListener('click', closeMenu));

/* карточки услуг строятся из js/services.js */
const grid = $('#grid');
if (grid) grid.innerHTML = SERVICES.map(s => `
  <a href="service.html?id=${s.id}" class="card reveal">
    <div class="pic"><img src="${s.img}" alt="${s.title}" loading="lazy"></div>
    <div class="body"><h3>${s.title}</h3><p>${s.lead}</p><span class="more">читать больше ›</span></div>
  </a>`).join('');

/* плавное появление блоков */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

/* слайдер команды */
const track = $('.track');
if (track) {
  const slides = $$('.slide'), dotsBox = $('.dots');
  let cur = 0, timer, x0 = null;
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.setAttribute('aria-label', 'Фото ' + (i + 1));
    d.onclick = () => go(i);
    dotsBox.appendChild(d);
  });
  const info = $('#team-info');
  function showInfo(i) { // описание меняется вместе с фото
    const d = slides[i].dataset; info.classList.add('swap');
    setTimeout(() => { $('#t-role').textContent = d.role; $('#t-name').textContent = d.name; $('#t-edu').textContent = d.edu; info.classList.remove('swap'); }, 250);
  }
  function go(i) {
    cur = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${cur * 100}%)`;
    $$('.dots button').forEach((d, k) => d.classList.toggle('on', k === cur));
  showInfo(cur);
    clearInterval(timer); timer = setInterval(() => go(cur + 1), 6000);
  }
  $('.prev').onclick = () => go(cur - 1);
  $('.next').onclick = () => go(cur + 1);
  track.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });
  go(0);
}

/* вопросы и ответы */
$$('.faq-q').forEach(btn => btn.addEventListener('click', () => {
  const item = btn.parentElement, wasOpen = item.classList.contains('open');
  $$('.faq-item').forEach(i => { i.classList.remove('open'); i.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); });
  if (!wasOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
}));

/* отзывы: лента с автопрокруткой и стрелками */
const rt = $('.rev-track');
if (rt) {
  const step = () => rt.firstElementChild.offsetWidth + 24;
  let hover = false;
  $('.rprev').onclick = () => rt.scrollBy({ left: -step() });
  $('.rnext').onclick = () => rt.scrollBy({ left: step() });
  rt.onmouseenter = () => hover = true; rt.onmouseleave = () => hover = false;
  setInterval(() => {
    if (hover) return;
    const end = rt.scrollLeft + rt.clientWidth >= rt.scrollWidth - 4;
    end ? rt.scrollTo({ left: 0 }) : rt.scrollBy({ left: step() });
  }, 5000);
}