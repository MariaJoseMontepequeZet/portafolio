import { Efecto } from './Efecto.js';

/**
 * El botón «Escribirme» abre el programa de correo con un enlace `mailto:`.
 * Muchas computadoras no tienen ninguno configurado y entonces el clic no hace
 * nada, así que este efecto vigila si algo se abrió: si la ventana sigue
 * activa poco después del clic, muestra un aviso con un enlace para escribir
 * desde Gmail (la opción de copiar la dirección ya está junto al botón).
 */
export class EscribirCorreo extends Efecto {
    static ESPERA_MS = 1200;

    #boton = null;
    #ayuda = null;
    #temporizador = null;

    aplica() {
        this.#boton = this.documento.querySelector('[data-escribir]');
        this.#ayuda = this.documento.querySelector('[data-ayuda-correo]');
        return this.#boton !== null && this.#ayuda !== null;
    }

    iniciar() {
        const correo = this.#boton.getAttribute('data-escribir');
        const gmail = this.#ayuda.querySelector('[data-gmail]');
        if (gmail) gmail.setAttribute('href', `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(correo)}`);

        this.#boton.addEventListener('click', () => this.#vigilar());
    }

    #vigilar() {
        const ventana = this.documento.defaultView;
        clearTimeout(this.#temporizador);
        this.#ayuda.hidden = true;

        // si el programa de correo se abre, la ventana pierde el foco
        const seAbrio = () => clearTimeout(this.#temporizador);
        ventana.addEventListener('blur', seAbrio, { once: true });

        this.#temporizador = setTimeout(() => {
            ventana.removeEventListener('blur', seAbrio);
            this.#ayuda.hidden = false;
        }, EscribirCorreo.ESPERA_MS);
    }
}
