import { Efecto } from './Efecto.js';

/**
 * Al cambiar el tema, los colores se funden y el ícono del botón gira. Se
 * suscribe al tema: no depende de qué botón o gesto lo cambió.
 */
export class TransicionTema extends Efecto {
    static MS_FUNDIDO = 500;

    #tema;

    constructor(contexto, tema) {
        super(contexto);
        this.#tema = tema;
    }

    aplica() {
        return !this.movimiento.reducido;
    }

    iniciar() {
        this.#tema.alCambiar(() => {
            this.#fundirColores();
            this.#girarBoton();
        });
    }

    #fundirColores() {
        const raiz = this.documento.documentElement;
        raiz.classList.add('cambiando-tema');
        setTimeout(() => raiz.classList.remove('cambiando-tema'), TransicionTema.MS_FUNDIDO);
    }

    #girarBoton() {
        const boton = this.documento.getElementById('btn-tema');
        if (!boton) return;
        boton.classList.remove('girar');
        void boton.offsetWidth; // reinicia la animación
        boton.classList.add('girar');
    }
}
