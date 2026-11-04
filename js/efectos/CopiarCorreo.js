import { Efecto } from './Efecto.js';

/** El botón «Copiar correo» lo copia al portapapeles y avisa del resultado. */
export class CopiarCorreo extends Efecto {
    static MENSAJES = {
        es: 'Correo copiado',
        en: 'Email copied'
    };
    static MS_AVISO = 3000;

    #boton = null;
    #aviso = null;

    aplica() {
        this.#boton = this.documento.querySelector('[data-copiar]');
        this.#aviso = this.documento.querySelector('.copiado');
        return this.#boton !== null;
    }

    iniciar() {
        this.#boton.addEventListener('click', () => this.#copiar(this.#boton.getAttribute('data-copiar')));
    }

    async #copiar(correo) {
        try {
            await globalThis.navigator.clipboard.writeText(correo);
            this.#avisar(CopiarCorreo.MENSAJES[this.idioma.actual]);
        } catch {
            // sin portapapeles: se muestra el correo para copiarlo a mano
            this.#avisar(correo);
        }
    }

    #avisar(texto) {
        if (!this.#aviso) return;
        this.#aviso.textContent = texto;
        setTimeout(() => { this.#aviso.textContent = ''; }, CopiarCorreo.MS_AVISO);
    }
}
