/**
 * Idioma de la interfaz (es o en): lo aplica al documento, lo guarda y avisa a
 * los observadores cuando cambia. Quien necesite el idioma (efectos, traductor,
 * botones) se suscribe aquí en vez de leer el atributo `lang` por su cuenta.
 */
export class Idioma {
    static CLAVE = 'idioma';
    static SOPORTADOS = ['es', 'en'];

    #almacen;
    #documento;
    #actual;
    #observadores = [];

    constructor({ almacen, documento, preferido = 'es' }) {
        this.#almacen = almacen;
        this.#documento = documento;
        const guardado = almacen.leer(Idioma.CLAVE);
        const delNavegador = preferido.slice(0, 2).toLowerCase() === 'en' ? 'en' : 'es';
        this.#actual = Idioma.SOPORTADOS.includes(guardado) ? guardado : delNavegador;
    }

    get actual() {
        return this.#actual;
    }

    get esIngles() {
        return this.#actual === 'en';
    }

    iniciar() {
        this.establecer(this.#actual);
    }

    alternar() {
        this.establecer(this.esIngles ? 'es' : 'en');
        this.#almacen.guardar(Idioma.CLAVE, this.#actual);
    }

    establecer(codigo) {
        if (!Idioma.SOPORTADOS.includes(codigo)) {
            throw new RangeError(`Idioma no soportado: ${codigo}`);
        }
        this.#actual = codigo;
        this.#documento.documentElement.lang = codigo;
        this.#observadores.forEach((avisar) => avisar(codigo));
    }

    alCambiar(observador) {
        this.#observadores.push(observador);
    }
}
