// import './bootstrap';

import Alpine from 'alpinejs';

window.Alpine = Alpine;

Alpine.start();

/* ============================ */
/* hide scrollbar default */
/* ============================ */
document.querySelectorAll('.scrollbar-auto').forEach((el) => {
    let timer;

    el.addEventListener('scroll', () => {
        el.classList.add('scrolling');

        clearTimeout(timer);

        timer = setTimeout(() => {
            el.classList.remove('scrolling');
        }, 800);
    });
});