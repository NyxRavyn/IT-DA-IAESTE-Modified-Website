// Mobile menu
const menu = document.querySelector('.menu'), nav = document.querySelector('nav');
menu?.addEventListener('click', () => { const o = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', o) });
// Department gates: tap to flip on touch devices
document.querySelectorAll('.gate').forEach(g => g.addEventListener('click', () => g.classList.toggle('flip')));
// World map: dotted continents + animated arcs from Jaipur
const svg = document.getElementById('map');
if (svg) {
    const W = 1000, H = 500, P = (lo, la) => [(lo + 180) / 360 * W, (90 - la) / 180 * H];
    const land = [
        [[-168, 66], [-140, 70], [-95, 72], [-60, 60], [-55, 48], [-80, 25], [-97, 16], [-82, 8], [-105, 22], [-125, 40]],
        [[-80, 10], [-60, 10], [-35, -6], [-40, -22], [-58, -38], [-68, -55], [-75, -40], [-72, -18], [-81, -5]],
        [[-10, 36], [-9, 44], [5, 58], [30, 70], [100, 76], [180, 68], [165, 58], [140, 45], [122, 30], [110, 20], [105, 10], [98, 8], [90, 22], [78, 8], [72, 20], [58, 24], [43, 13], [35, 30], [28, 36], [10, 38]],
        [[-17, 21], [-5, 36], [32, 31], [43, 12], [51, 11], [40, -15], [33, -27], [19, -35], [12, -17], [8, 4], [-17, 14]],
        [[114, -22], [130, -12], [153, -26], [146, -39], [115, -34]]];
    const inside = (x, y, p) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { const [a, b] = p[i], [d, e] = p[j]; if ((b > y) != (e > y) && x < (d - a) * (y - b) / (e - b) + a) c = !c } return c };
    let s = '';
    for (let la = 80; la > -58; la -= 3)for (let lo = -170; lo < 180; lo += 3)if (land.some(p => inside(lo, la, p))) { const [x, y] = P(lo, la); s += `<circle class="dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.9"/>` }
    const home = P(75.8, 26.9);
    const dest = [['Japan', 139.7, 35.7], ['Tunisia', 10, 34], ['Iran', 51, 35.7], ['Palestine', 35, 31.9], ['France', 2, 46], ['Austria', 14, 48], ['Brazil', -47, -15]];
    dest.forEach(([n, lo, la], i) => {
        const [x, y] = P(lo, la), mx = (x + home[0]) / 2, my = Math.min(y, home[1]) - Math.abs(x - home[0]) * .28 - 20;
        s += `<path class="arc" pathLength="1" style="animation-delay:${i * .25}s" d="M${home[0]} ${home[1]} Q${mx} ${my} ${x} ${y}"/><circle class="pin" cx="${x}" cy="${y}" r="4"/><text x="${x + 7}" y="${y + 16}">${n}</text>`
    });
    s += `<circle class="home" cx="${home[0]}" cy="${home[1]}" r="7"/><text x="${home[0] + 10}" y="${home[1] + 22}">Jaipur</text>`;
    svg.innerHTML = s
}
// Counters
document.querySelectorAll('[data-n]').forEach(el => {
    const n = +el.dataset.n, t0 = performance.now();
    const tick = t => { const k = Math.min((t - t0) / 1600, 1); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick) };
    matchMedia('(prefers-reduced-motion:reduce)').matches ? el.textContent = n : requestAnimationFrame(tick)
});

// Gallery carousel (works with any number of slides)
const track = document.getElementById('track');
if (track) {
    const slides = [...track.children], dots = document.getElementById('dots');
    const go = i => track.scrollTo({ left: slides[(i + slides.length) % slides.length].offsetLeft - track.offsetLeft, behavior: 'smooth' });
    const cur = () => Math.round(track.scrollLeft / (slides[0].offsetWidth + 16));
    slides.forEach((_, i) => { const b = document.createElement('button'); b.setAttribute('aria-label', 'Go to photo ' + (i + 1)); b.onclick = () => go(i); dots.append(b) });
    const sync = () => [...dots.children].forEach((b, i) => b.setAttribute('aria-current', i === cur()));
    track.addEventListener('scroll', sync, { passive: true }); sync();
    document.querySelector('.carousel .prev').onclick = () => go(cur() - 1);
    document.querySelector('.carousel .next').onclick = () => go(cur() + 1);
    track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(cur() + 1); if (e.key === 'ArrowLeft') go(cur() - 1) })
}