/*
 * Efectos de la interfaz: aparición al hacer scroll, contadores, terminal del
 * hero, filtro de proyectos y copiar correo.
 * Todo el movimiento se omite si el visitante pide reducir animaciones; el
 * contenido sigue visible y funcional sin JavaScript.
 */
(function () {
    var raiz = document.documentElement;
    var sinMovimiento = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    function en() {
        return raiz.lang === 'en';
    }

    /* ---------- Aparición al hacer scroll ---------- */
    function revelar() {
        if (sinMovimiento || !('IntersectionObserver' in window)) return;

        var objetivos = document.querySelectorAll('.pilar, .proyecto, .perfil, .cert, .hito, .grid-habilidades .tarjeta, .resumen-grid p, .contacto-enlace');
        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (e) {
                if (!e.isIntersecting) return;
                var el = e.target;
                el.classList.add('visible');
                // al terminar se quitan las clases para no interferir con el hover
                el.addEventListener('animationend', function () {
                    el.classList.remove('revelar', 'visible');
                    el.style.removeProperty('--retraso');
                }, { once: true });
                observador.unobserve(el);
            });
        }, { threshold: 0.12 });

        objetivos.forEach(function (el, i) {
            el.classList.add('revelar');
            el.style.setProperty('--retraso', (i % 4) * 90 + 'ms');
            observador.observe(el);
        });
    }

    /* ---------- Contadores ---------- */
    function contadores() {
        var els = document.querySelectorAll('[data-contador]');
        if (sinMovimiento || !('IntersectionObserver' in window)) return;

        var observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (e) {
                if (!e.isIntersecting) return;
                var el = e.target;
                var meta = parseInt(el.getAttribute('data-contador'), 10);
                var inicio = null;
                function paso(t) {
                    if (inicio === null) inicio = t;
                    var avance = Math.min((t - inicio) / 1100, 1);
                    el.textContent = Math.round(meta * (1 - Math.pow(1 - avance, 3)));
                    if (avance < 1) requestAnimationFrame(paso);
                }
                el.textContent = '0';
                requestAnimationFrame(paso);
                observador.unobserve(el);
            });
        }, { threshold: 0.6 });

        els.forEach(function (el) { observador.observe(el); });
    }

    /* ---------- Terminal del hero ---------- */
    function terminal() {
        var cuerpo = document.querySelector('[data-terminal]');
        if (!cuerpo) return;

        var texto = en() ? '> analyzing logs... ✔ no threats detected' : '> analizando logs... ✔ sin amenazas';
        cuerpo.textContent = texto;
        if (sinMovimiento) return;

        cuerpo.textContent = '';
        cuerpo.classList.add('escribiendo');
        var i = 0;
        (function escribir() {
            cuerpo.textContent = texto.slice(0, ++i);
            if (i < texto.length) setTimeout(escribir, 55);
            else cuerpo.classList.remove('escribiendo');
        })();
    }

    /* ---------- Filtro de proyectos ---------- */
    function filtro() {
        var rejilla = document.querySelector('.grid-proyectos');
        if (!rejilla) return;

        var tarjetas = Array.prototype.slice.call(rejilla.querySelectorAll('.proyecto'));
        var etiquetas = [];
        tarjetas.forEach(function (t) {
            var tags = Array.prototype.map.call(t.querySelectorAll('.chip:not(.chip-estado)'), function (c) { return c.textContent.trim(); });
            t.setAttribute('data-tags', tags.join('|'));
            tags.forEach(function (tag) { if (etiquetas.indexOf(tag) === -1) etiquetas.push(tag); });
        });

        var barra = document.createElement('div');
        barra.className = 'filtro';
        barra.setAttribute('role', 'group');
        barra.setAttribute('aria-label', en() ? 'Filter by technology' : 'Filtrar por tecnología');

        var botones = [];
        function crear(valor, rotulo) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'filtro-btn';
            b.setAttribute('data-valor', valor);
            b.textContent = rotulo;
            botones.push(b);
            barra.appendChild(b);
            return b;
        }

        var todos = crear('', en() ? 'All' : 'Todos');
        etiquetas.forEach(function (tag) { crear(tag, tag); });

        function aplicar(valor) {
            botones.forEach(function (b) {
                b.setAttribute('aria-pressed', String(b.getAttribute('data-valor') === valor));
            });
            tarjetas.forEach(function (t) {
                var visible = !valor || t.getAttribute('data-tags').split('|').indexOf(valor) !== -1;
                t.hidden = !visible;
                if (visible && !sinMovimiento) {
                    t.classList.remove('filtrado');
                    void t.offsetWidth; // reinicia la animación
                    t.classList.add('filtrado');
                }
            });
        }

        barra.addEventListener('click', function (e) {
            var b = e.target.closest('.filtro-btn');
            if (b) aplicar(b.getAttribute('data-valor'));
        });

        rejilla.parentNode.insertBefore(barra, rejilla);
        aplicar('');

        // el rótulo "Todos" sigue al idioma
        new MutationObserver(function () {
            todos.textContent = en() ? 'All' : 'Todos';
            barra.setAttribute('aria-label', en() ? 'Filter by technology' : 'Filtrar por tecnología');
        }).observe(raiz, { attributes: true, attributeFilter: ['lang'] });
    }

    /* ---------- Copiar correo ---------- */
    function copiar() {
        var btn = document.querySelector('[data-copiar]');
        if (!btn) return;
        var aviso = document.querySelector('.copiado');

        btn.addEventListener('click', function () {
            var correo = btn.getAttribute('data-copiar');
            function listo(ok) {
                if (!aviso) return;
                aviso.textContent = ok ? (en() ? 'Email copied' : 'Correo copiado') : correo;
                setTimeout(function () { aviso.textContent = ''; }, 3000);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(correo).then(function () { listo(true); }, function () { listo(false); });
            } else {
                listo(false);
            }
        });
    }


    /* ---------- Detalle de proyecto ---------- */
    var ROTULOS = {
        es: { descripcion: 'Descripción', estructura: 'Estructura', modulos: 'Módulos', cerrar: 'Cerrar' },
        en: { descripcion: 'Description', estructura: 'Structure', modulos: 'Modules', cerrar: 'Close' }
    };

    function detalle() {
        var botones = document.querySelectorAll('[data-detalle]');
        if (!botones.length) return;
        if (typeof HTMLDialogElement === 'undefined') {
            botones.forEach(function (b) { b.hidden = true; });
            return;
        }

        var dialogo = document.createElement('dialog');
        dialogo.className = 'detalle';
        dialogo.setAttribute('aria-labelledby', 'detalle-titulo');
        dialogo.innerHTML =
            '<div class="detalle-cabecera"><h2 id="detalle-titulo"></h2>' +
            '<button type="button" class="detalle-cerrar">✕</button></div>' +
            '<div class="detalle-pestanas"></div>' +
            '<div class="detalle-cuerpo" tabindex="0"></div>';
        document.body.appendChild(dialogo);

        var titulo = dialogo.querySelector('#detalle-titulo');
        var cerrar = dialogo.querySelector('.detalle-cerrar');
        var pestanas = dialogo.querySelector('.detalle-pestanas');
        var cuerpo = dialogo.querySelector('.detalle-cuerpo');
        var temporizador;

        cerrar.addEventListener('click', function () { dialogo.close(); });
        dialogo.addEventListener('click', function (e) { if (e.target === dialogo) dialogo.close(); });
        dialogo.addEventListener('close', function () { clearTimeout(temporizador); });

        function mostrar(datos, nombre, btn) {
            clearTimeout(temporizador);
            pestanas.querySelectorAll('button').forEach(function (b) {
                b.setAttribute('aria-pressed', String(b === btn));
            });
            cuerpo.innerHTML = datos.querySelector('[data-panel="' + nombre + '"]').innerHTML;

            // el árbol de carpetas se escribe solo
            var pre = cuerpo.querySelector('pre');
            if (pre && !sinMovimiento) {
                var completo = pre.textContent;
                var n = 0;
                pre.style.minHeight = pre.offsetHeight + 'px';
                pre.textContent = '';
                (function escribir() {
                    n = Math.min(n + 3, completo.length);
                    pre.textContent = completo.slice(0, n);
                    if (n < completo.length) temporizador = setTimeout(escribir, 14);
                })();
            }
        }

        botones.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var datos = document.getElementById('detalle-' + btn.getAttribute('data-detalle'));
                var r = ROTULOS[en() ? 'en' : 'es'];
                titulo.textContent = btn.closest('.proyecto').querySelector('h2').textContent;
                cerrar.setAttribute('aria-label', r.cerrar);
                pestanas.innerHTML = '';
                ['descripcion', 'estructura', 'modulos'].forEach(function (nombre) {
                    var b = document.createElement('button');
                    b.type = 'button';
                    b.className = 'filtro-btn';
                    b.textContent = r[nombre];
                    b.addEventListener('click', function () { mostrar(datos, nombre, b); });
                    pestanas.appendChild(b);
                });
                mostrar(datos, 'descripcion', pestanas.firstChild);
                dialogo.showModal();
            });
        });
    }

    /* ---------- Línea de tiempo ---------- */
    function lineaTiempo() {
        var linea = document.querySelector('.linea-tiempo');
        if (!linea || sinMovimiento || !('IntersectionObserver' in window)) return;
        linea.classList.add('sin-dibujar');
        var obs = new IntersectionObserver(function (entradas) {
            if (!entradas[0].isIntersecting) return;
            linea.classList.remove('sin-dibujar');
            obs.disconnect();
        }, { threshold: 0.2 });
        obs.observe(linea);
    }


    /* ---------- Foco de luz bajo el cursor en las tarjetas ---------- */
    function foco() {
        if (sinMovimiento) return;
        document.addEventListener('pointermove', function (e) {
            var t = e.target.closest && e.target.closest('.tarjeta');
            if (!t) return;
            var r = t.getBoundingClientRect();
            t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            t.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
    }

    /* ---------- Transición suave al cambiar de tema ---------- */
    function tema() {
        var btn = document.getElementById('btn-tema');
        if (!btn || sinMovimiento) return;
        btn.addEventListener('click', function () {
            raiz.classList.add('cambiando-tema');
            btn.classList.remove('girar');
            void btn.offsetWidth;
            btn.classList.add('girar');
            setTimeout(function () { raiz.classList.remove('cambiando-tema'); }, 500);
        });
    }

    function iniciar() {
        revelar();
        contadores();
        terminal();
        filtro();
        copiar();
        detalle();
        lineaTiempo();
        foco();
        tema();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
