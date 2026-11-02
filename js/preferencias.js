/*
 * Preferencias del visitante: tema (claro/oscuro) e idioma (es/en).
 * Se guardan en localStorage; sin preferencia guardada se usa la del sistema.
 * El español es el contenido original del HTML; el inglés sale de TRADUCCIONES_EN.
 */
(function () {
    var raiz = document.documentElement;
    var EN = window.TRADUCCIONES_EN || {};
    var META_COLOR = { dark: '#0b0a14', light: '#f6f5fc' };
    var UI = {
        es: { idioma: 'Cambiar a inglés', tema: { dark: 'Cambiar a tema claro', light: 'Cambiar a tema oscuro' } },
        en: { idioma: 'Switch to Spanish', tema: { dark: 'Switch to light theme', light: 'Switch to dark theme' } }
    };

    function leer(clave) {
        try { return localStorage.getItem(clave); } catch (e) { return null; }
    }

    function guardar(clave, valor) {
        try { localStorage.setItem(clave, valor); } catch (e) { /* almacenamiento no disponible */ }
    }

    function normalizar(texto) {
        return texto.replace(/\s+/g, ' ').trim();
    }

    /* ---------- Tema ---------- */
    var tema = leer('tema');
    if (tema !== 'light' && tema !== 'dark') {
        tema = window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function aplicarTema(nuevo) {
        tema = nuevo;
        raiz.setAttribute('data-theme', tema);
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', META_COLOR[tema]);
    }

    aplicarTema(tema); // antes del primer pintado, para evitar el parpadeo

    /* ---------- Idioma ---------- */
    var idioma = leer('idioma');
    if (idioma !== 'es' && idioma !== 'en') {
        idioma = (navigator.language || 'es').slice(0, 2).toLowerCase() === 'en' ? 'en' : 'es';
    }

    var registros = []; // { poner(texto), es, en }

    function registrar(es, poner) {
        var en = EN[normalizar(es)];
        if (en) registros.push({ es: es, en: en, poner: poner });
    }

    function recorrer(nodo) {
        if (nodo.nodeType === 3) {
            var original = nodo.nodeValue;
            var en = EN[normalizar(original)];
            if (en) {
                var ini = original.match(/^\s*/)[0];
                var fin = original.match(/\s*$/)[0];
                registros.push({ es: original, en: ini + en + fin, poner: function (t) { nodo.nodeValue = t; } });
            }
            return;
        }
        if (nodo.nodeType !== 1 || nodo.tagName === 'SCRIPT' || nodo.tagName === 'SVG' || nodo.tagName === 'svg') return;

        var html = nodo.innerHTML;
        if (html && EN[normalizar(html)]) {
            registrar(html, function (t) { nodo.innerHTML = t; });
            return;
        }
        for (var i = 0; i < nodo.childNodes.length; i++) recorrer(nodo.childNodes[i]);
    }

    function recolectar() {
        recorrer(document.body);

        document.querySelectorAll('[aria-label], [alt]').forEach(function (el) {
            ['aria-label', 'alt'].forEach(function (attr) {
                var valor = el.getAttribute(attr);
                if (valor) registrar(valor, function (t) { el.setAttribute(attr, t); });
            });
        });

        var descripcion = document.querySelector('meta[name="description"]');
        if (descripcion) {
            registrar(descripcion.getAttribute('content'), function (t) { descripcion.setAttribute('content', t); });
        }
        registrar(document.title, function (t) { document.title = t; });
    }

    function aplicarIdioma(nuevo) {
        idioma = nuevo;
        raiz.lang = idioma;
        registros.forEach(function (r) { r.poner(idioma === 'en' ? r.en : r.es); });
        actualizarBotones();
    }

    /* ---------- Botones ---------- */
    var btnIdioma, btnTema;

    function actualizarBotones() {
        if (btnIdioma) {
            btnIdioma.querySelector('span').textContent = idioma === 'en' ? 'ES' : 'EN';
            btnIdioma.setAttribute('aria-label', UI[idioma].idioma);
            btnIdioma.setAttribute('title', UI[idioma].idioma);
        }
        if (btnTema) {
            btnTema.setAttribute('aria-label', UI[idioma].tema[tema]);
            btnTema.setAttribute('title', UI[idioma].tema[tema]);
        }
    }

    function iniciar() {
        btnIdioma = document.getElementById('btn-idioma');
        btnTema = document.getElementById('btn-tema');
        recolectar();

        if (btnIdioma) btnIdioma.addEventListener('click', function () {
            aplicarIdioma(idioma === 'en' ? 'es' : 'en');
            guardar('idioma', idioma);
        });
        if (btnTema) btnTema.addEventListener('click', function () {
            aplicarTema(tema === 'dark' ? 'light' : 'dark');
            guardar('tema', tema);
            actualizarBotones();
        });

        aplicarIdioma(idioma);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
