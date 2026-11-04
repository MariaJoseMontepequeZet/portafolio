import { AtributoDeElemento, HtmlDeElemento, TextoDeNodo, TituloDelDocumento } from './Traducible.js';

/**
 * Recorre la página una vez, reúne todo lo que tiene traducción y luego lo
 * escribe en el idioma que le pidan. No decide el idioma ni lo guarda: eso es
 * de `Idioma`. El diccionario llega por el constructor.
 *
 * El español es el contenido original del HTML; el inglés sale del diccionario,
 * cuya clave es el texto en español con los espacios colapsados.
 */
export class Traductor {
    static OMITIDOS = ['SCRIPT', 'SVG', 'svg'];

    #diccionario;
    #documento;
    #traducibles = [];

    constructor(diccionario, documento) {
        this.#diccionario = diccionario;
        this.#documento = documento;
    }

    static normalizar(texto) {
        return texto.replace(/\s+/g, ' ').trim();
    }

    recolectar() {
        this.#recorrer(this.#documento.body);
        this.#recolectarAtributos();
        this.#recolectarMeta();
        const titulo = this.#buscar(this.#documento.title);
        if (titulo) {
            this.#traducibles.push(new TituloDelDocumento(this.#documento, this.#documento.title, titulo));
        }
    }

    aplicar(codigo) {
        this.#traducibles.forEach((traducible) => traducible.aplicar(codigo));
    }

    #buscar(texto) {
        return this.#diccionario[Traductor.normalizar(texto)];
    }

    #recorrer(nodo) {
        if (nodo.nodeType === 3) {
            this.#recolectarTexto(nodo);
            return;
        }
        if (nodo.nodeType !== 1 || Traductor.OMITIDOS.includes(nodo.tagName)) return;

        const html = nodo.innerHTML;
        const traduccion = html && this.#buscar(html);
        if (traduccion) {
            this.#traducibles.push(new HtmlDeElemento(nodo, html, traduccion));
            return;
        }
        for (const hijo of nodo.childNodes) this.#recorrer(hijo);
    }

    #recolectarTexto(nodo) {
        const original = nodo.nodeValue;
        const traduccion = this.#buscar(original);
        if (!traduccion) return;
        // se conservan los espacios de los bordes para no pegar palabras
        const inicio = original.match(/^\s*/)[0];
        const fin = original.match(/\s*$/)[0];
        this.#traducibles.push(new TextoDeNodo(nodo, original, inicio + traduccion + fin));
    }

    #recolectarAtributos() {
        for (const elemento of this.#documento.querySelectorAll('[aria-label], [alt]')) {
            for (const atributo of ['aria-label', 'alt']) {
                this.#recolectarAtributo(elemento, atributo);
            }
        }
    }

    #recolectarMeta() {
        const descripcion = this.#documento.querySelector('meta[name="description"]');
        if (descripcion) this.#recolectarAtributo(descripcion, 'content');
    }

    #recolectarAtributo(elemento, atributo) {
        const valor = elemento.getAttribute(atributo);
        const traduccion = valor && this.#buscar(valor);
        if (traduccion) {
            this.#traducibles.push(new AtributoDeElemento(elemento, atributo, valor, traduccion));
        }
    }
}
