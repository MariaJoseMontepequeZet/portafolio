/**
 * Guarda y lee preferencias del visitante sin romper la página si el
 * almacenamiento no está disponible (modo privado, datos bloqueados...).
 * Recibe el almacén por el constructor, así se puede sustituir en las pruebas.
 */
export class AlmacenLocal {
    #almacen;

    constructor(almacen) {
        this.#almacen = almacen ?? AlmacenLocal.#delNavegador();
    }

    static #delNavegador() {
        try {
            return globalThis.localStorage ?? null;
        } catch {
            return null;
        }
    }

    leer(clave) {
        try {
            return this.#almacen?.getItem(clave) ?? null;
        } catch {
            return null;
        }
    }

    guardar(clave, valor) {
        try {
            this.#almacen?.setItem(clave, valor);
        } catch {
            /* almacenamiento no disponible: la preferencia vale solo esta visita */
        }
    }
}
