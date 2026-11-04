import { Efecto } from './Efecto.js';

/**
 * La mini terminal del hero escribe su mensaje letra por letra y lo cambia de
 * idioma cuando el visitante cambia el idioma de la página.
 */
export class TerminalHero extends Efecto {
    static TEXTOS = {
        es: '> analizando logs... ✔ sin amenazas',
        en: '> analyzing logs... ✔ no threats detected'
    };
    static MS_POR_LETRA = 55;

    #cuerpo = null;
    #temporizador = null;

    aplica() {
        this.#cuerpo = this.documento.querySelector('[data-terminal]');
        return this.#cuerpo !== null;
    }

    iniciar() {
        this.#mostrar(!this.movimiento.reducido);
        this.idioma.alCambiar(() => this.#mostrar(false));
    }

    #mostrar(animar) {
        clearTimeout(this.#temporizador);
        const texto = TerminalHero.TEXTOS[this.idioma.actual];
        this.#cuerpo.classList.remove('escribiendo');

        if (!animar) {
            this.#cuerpo.textContent = texto;
            return;
        }
        this.#cuerpo.textContent = '';
        this.#cuerpo.classList.add('escribiendo');
        this.#escribir(texto, 0);
    }

    #escribir(texto, letras) {
        this.#cuerpo.textContent = texto.slice(0, letras + 1);
        if (letras + 1 < texto.length) {
            this.#temporizador = setTimeout(() => this.#escribir(texto, letras + 1), TerminalHero.MS_POR_LETRA);
        } else {
            this.#cuerpo.classList.remove('escribiendo');
        }
    }
}
