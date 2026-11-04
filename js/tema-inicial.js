/*
 * Aplica el tema guardado antes del primer pintado, para evitar el parpadeo.
 * Es lo único que corre fuera de los módulos: los módulos se ejecutan diferidos,
 * cuando la página ya se pintó. La lógica completa vive en preferencias/Tema.js.
 */
(function () {
    var tema = null;
    try { tema = localStorage.getItem('tema'); } catch (e) { /* almacenamiento no disponible */ }
    if (tema !== 'light' && tema !== 'dark') {
        tema = window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', tema);
})();
