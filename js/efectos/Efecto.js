/**
 * Base abstracta de todos los efectos de la interfaz.
 *
 * Define el contrato (método plantilla): `arrancar()` pregunta si el efecto
 * tiene algo que hacer en esta página (`aplica()`) y, si es así, lo inicia
 * (`iniciar()`). Cada hija solo sobrescribe esos dos métodos, así que se puede
 * sustituir una por otra sin que quien las arranca se entere.
 *
 * Las dependencias (documento, preferencia de movimiento e idioma) llegan en el
 * `contexto`: el efecto nunca toca globales del navegador por su cuenta.
 */
export class Efecto {
    #contexto;

    constructor(contexto) {
        if (new.target === Efecto) {
            throw new TypeError('Efecto es abstracta: usa una de sus hijas');
        }
        this.#contexto = contexto;
    }

    get documento() {
        return this.#contexto.documento;
    }

    get movimiento() {
        return this.#contexto.movimiento;
    }

    get idioma() {
        return this.#contexto.idioma;
    }

    /** ¿Hay algo que hacer en esta página? Por defecto sí. */
    aplica() {
        return true;
    }

    iniciar() {
        throw new Error(`${this.constructor.name} debe implementar iniciar()`);
    }

    arrancar() {
        if (this.aplica()) this.iniciar();
    }
}
