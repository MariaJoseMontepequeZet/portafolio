/**
 * Ventana (`<dialog>`) con el detalle de un proyecto en pestañas: descripción,
 * estructura y módulos. Solo sabe mostrar los paneles que le entregan; no
 * conoce los proyectos ni de dónde salen los datos. Muestra únicamente las
 * pestañas que el proyecto tiene (un proyecto privado, por ejemplo, puede no
 * tener «estructura»).
 */
export class DialogoDetalle {
    static PESTANAS = ['descripcion', 'estructura', 'modulos'];
    static ROTULOS = {
        es: { descripcion: 'Descripción', estructura: 'Estructura', modulos: 'Módulos', cerrar: 'Cerrar' },
        en: { descripcion: 'Description', estructura: 'Structure', modulos: 'Modules', cerrar: 'Close' }
    };
    static MS_POR_PASO = 14;
    static LETRAS_POR_PASO = 3;

    #documento;
    #movimiento;
    #idioma;
    #dialogo;
    #titulo;
    #cerrar;
    #pestanas;
    #cuerpo;
    #temporizador = null;

    constructor({ documento, movimiento, idioma }) {
        this.#documento = documento;
        this.#movimiento = movimiento;
        this.#idioma = idioma;
        this.#construir();
    }

    /** Pestañas para las que `datos` trae un panel, en el orden de PESTANAS. */
    static pestanasDisponibles(datos) {
        return DialogoDetalle.PESTANAS.filter((nombre) => datos.querySelector(`[data-panel="${nombre}"]`) !== null);
    }

    abrir(titulo, datos) {
        const rotulos = DialogoDetalle.ROTULOS[this.#idioma.actual];
        this.#titulo.textContent = titulo;
        this.#cerrar.setAttribute('aria-label', rotulos.cerrar);

        this.#pestanas.replaceChildren();
        const disponibles = DialogoDetalle.pestanasDisponibles(datos);
        for (const nombre of disponibles) {
            const boton = this.#documento.createElement('button');
            boton.type = 'button';
            boton.className = 'filtro-btn';
            boton.textContent = rotulos[nombre];
            boton.addEventListener('click', () => this.#mostrar(datos, nombre, boton));
            this.#pestanas.appendChild(boton);
        }
        this.#mostrar(datos, disponibles[0], this.#pestanas.firstChild);
        this.#dialogo.showModal();
    }

    #construir() {
        const dialogo = this.#documento.createElement('dialog');
        dialogo.className = 'detalle';
        dialogo.setAttribute('aria-labelledby', 'detalle-titulo');
        dialogo.innerHTML =
            '<div class="detalle-cabecera"><h2 id="detalle-titulo"></h2>' +
            '<button type="button" class="detalle-cerrar">✕</button></div>' +
            '<div class="detalle-pestanas"></div>' +
            '<div class="detalle-cuerpo" tabindex="0"></div>';
        this.#documento.body.appendChild(dialogo);

        this.#dialogo = dialogo;
        this.#titulo = dialogo.querySelector('#detalle-titulo');
        this.#cerrar = dialogo.querySelector('.detalle-cerrar');
        this.#pestanas = dialogo.querySelector('.detalle-pestanas');
        this.#cuerpo = dialogo.querySelector('.detalle-cuerpo');

        this.#cerrar.addEventListener('click', () => dialogo.close());
        dialogo.addEventListener('click', (evento) => { if (evento.target === dialogo) dialogo.close(); });
        dialogo.addEventListener('close', () => clearTimeout(this.#temporizador));
    }

    #mostrar(datos, nombre, pestana) {
        clearTimeout(this.#temporizador);
        for (const boton of this.#pestanas.querySelectorAll('button')) {
            boton.setAttribute('aria-pressed', String(boton === pestana));
        }
        this.#cuerpo.innerHTML = datos.querySelector(`[data-panel="${nombre}"]`).innerHTML;

        const arbol = this.#cuerpo.querySelector('pre');
        if (arbol && !this.#movimiento.reducido) this.#escribirArbol(arbol);
    }

    /** El árbol de carpetas se escribe solo, como en una terminal. */
    #escribirArbol(arbol) {
        const completo = arbol.textContent;
        arbol.style.minHeight = `${arbol.offsetHeight}px`;
        arbol.textContent = '';

        const paso = (letras) => {
            const hasta = Math.min(letras + DialogoDetalle.LETRAS_POR_PASO, completo.length);
            arbol.textContent = completo.slice(0, hasta);
            if (hasta < completo.length) {
                this.#temporizador = setTimeout(() => paso(hasta), DialogoDetalle.MS_POR_PASO);
            }
        };
        paso(0);
    }
}
