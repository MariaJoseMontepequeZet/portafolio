/**
 * Tema de color (oscuro o claro): lo aplica al documento, lo guarda y avisa a
 * quien quiera enterarse cuando cambia. No sabe nada de botones ni de idioma.
 */
export class Tema {
    static CLAVE = 'tema';
    static VALIDOS = ['dark', 'light'];
    static COLOR_META = { dark: '#0b0a14', light: '#f7f1e6' };

    #almacen;
    #documento;
    #actual;
    #observadores = [];

    constructor({ almacen, documento, prefiereClaro = false }) {
        this.#almacen = almacen;
        this.#documento = documento;
        const guardado = almacen.leer(Tema.CLAVE);
        this.#actual = Tema.VALIDOS.includes(guardado) ? guardado : (prefiereClaro ? 'light' : 'dark');
    }

    get actual() {
        return this.#actual;
    }

    iniciar() {
        this.#aplicar();
    }

    alternar() {
        this.establecer(this.#actual === 'dark' ? 'light' : 'dark');
        this.#almacen.guardar(Tema.CLAVE, this.#actual);
    }

    establecer(nuevo) {
        if (!Tema.VALIDOS.includes(nuevo)) {
            throw new RangeError(`Tema no válido: ${nuevo}`);
        }
        this.#actual = nuevo;
        this.#aplicar();
        this.#observadores.forEach((avisar) => avisar(nuevo));
    }

    alCambiar(observador) {
        this.#observadores.push(observador);
    }

    #aplicar() {
        this.#documento.documentElement.setAttribute('data-theme', this.#actual);
        const meta = this.#documento.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', Tema.COLOR_META[this.#actual]);
    }
}
