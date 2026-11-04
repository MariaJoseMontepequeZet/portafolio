/**
 * Un texto de la página que tiene versión en inglés.
 *
 * `Traducible` es abstracta: guarda el español y el inglés y sabe elegir cuál
 * mostrar, pero no sabe DÓNDE escribirlo. Cada hija implementa `escribir()`
 * para su tipo de destino (nodo de texto, HTML, atributo, título). El traductor
 * las trata a todas igual (polimorfismo) sin preguntar de qué tipo son.
 */
export class Traducible {
    #es;
    #en;

    constructor(es, en) {
        if (new.target === Traducible) {
            throw new TypeError('Traducible es abstracta: usa una de sus hijas');
        }
        this.#es = es;
        this.#en = en;
    }

    aplicar(codigo) {
        this.escribir(codigo === 'en' ? this.#en : this.#es);
    }

    escribir() {
        throw new Error(`${this.constructor.name} debe implementar escribir()`);
    }
}

export class TextoDeNodo extends Traducible {
    #nodo;

    constructor(nodo, es, en) {
        super(es, en);
        this.#nodo = nodo;
    }

    escribir(texto) {
        this.#nodo.nodeValue = texto;
    }
}

export class HtmlDeElemento extends Traducible {
    #elemento;

    constructor(elemento, es, en) {
        super(es, en);
        this.#elemento = elemento;
    }

    escribir(html) {
        this.#elemento.innerHTML = html;
    }
}

export class AtributoDeElemento extends Traducible {
    #elemento;
    #atributo;

    constructor(elemento, atributo, es, en) {
        super(es, en);
        this.#elemento = elemento;
        this.#atributo = atributo;
    }

    escribir(valor) {
        this.#elemento.setAttribute(this.#atributo, valor);
    }
}

export class TituloDelDocumento extends Traducible {
    #documento;

    constructor(documento, es, en) {
        super(es, en);
        this.#documento = documento;
    }

    escribir(titulo) {
        this.#documento.title = titulo;
    }
}
