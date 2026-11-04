/**
 * Los dos botones de la barra (idioma y tema): conecta los clics con `Idioma` y
 * `Tema`, y mantiene sus etiquetas al día. No decide nada: solo pide cambios y
 * se repinta cuando le avisan.
 */
export class ControlesPreferencias {
    static ROTULOS = {
        es: { idioma: 'Cambiar a inglés', tema: { dark: 'Cambiar a tema claro', light: 'Cambiar a tema oscuro' } },
        en: { idioma: 'Switch to Spanish', tema: { dark: 'Switch to light theme', light: 'Switch to dark theme' } }
    };

    #documento;
    #tema;
    #idioma;
    #botonIdioma = null;
    #botonTema = null;

    constructor({ documento, tema, idioma }) {
        this.#documento = documento;
        this.#tema = tema;
        this.#idioma = idioma;
    }

    iniciar() {
        this.#botonIdioma = this.#documento.getElementById('btn-idioma');
        this.#botonTema = this.#documento.getElementById('btn-tema');

        this.#botonIdioma?.addEventListener('click', () => this.#idioma.alternar());
        this.#botonTema?.addEventListener('click', () => this.#tema.alternar());

        this.#idioma.alCambiar(() => this.#actualizar());
        this.#tema.alCambiar(() => this.#actualizar());
        this.#actualizar();
    }

    #actualizar() {
        const rotulos = ControlesPreferencias.ROTULOS[this.#idioma.actual];

        if (this.#botonIdioma) {
            this.#botonIdioma.querySelector('span').textContent = this.#idioma.esIngles ? 'ES' : 'EN';
            this.#etiquetar(this.#botonIdioma, rotulos.idioma);
        }
        if (this.#botonTema) {
            this.#etiquetar(this.#botonTema, rotulos.tema[this.#tema.actual]);
        }
    }

    #etiquetar(boton, texto) {
        boton.setAttribute('aria-label', texto);
        boton.setAttribute('title', texto);
    }
}
