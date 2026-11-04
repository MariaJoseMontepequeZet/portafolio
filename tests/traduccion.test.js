import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TRADUCCIONES_EN } from '../js/datos/traducciones-en.js';
import {
    AtributoDeElemento, HtmlDeElemento, TextoDeNodo, TituloDelDocumento, Traducible
} from '../js/preferencias/Traducible.js';
import { Traductor } from '../js/preferencias/Traductor.js';

describe('Traducible (clase abstracta y polimorfismo)', () => {
    it('no se puede instanciar directamente', () => {
        assert.throws(() => new Traducible('hola', 'hello'), TypeError);
    });

    it('todas las hijas se usan igual y escriben en su propio destino', () => {
        const nodo = { nodeValue: '' };
        const elemento = { innerHTML: '' };
        const atributos = {};
        const conAtributo = { setAttribute: (nombre, valor) => { atributos[nombre] = valor; } };
        const documento = { title: '' };

        const traducibles = [
            new TextoDeNodo(nodo, 'Inicio', 'Home'),
            new HtmlDeElemento(elemento, '<b>Hola</b>', '<b>Hello</b>'),
            new AtributoDeElemento(conAtributo, 'alt', 'Foto', 'Photo'),
            new TituloDelDocumento(documento, 'Portafolio', 'Portfolio')
        ];

        traducibles.forEach((t) => t.aplicar('en'));
        assert.equal(nodo.nodeValue, 'Home');
        assert.equal(elemento.innerHTML, '<b>Hello</b>');
        assert.equal(atributos.alt, 'Photo');
        assert.equal(documento.title, 'Portfolio');

        traducibles.forEach((t) => t.aplicar('es'));
        assert.equal(nodo.nodeValue, 'Inicio');
        assert.equal(documento.title, 'Portafolio');
    });

    it('una hija que no implementa escribir() falla con un error claro', () => {
        class Incompleta extends Traducible {}
        assert.throws(() => new Incompleta('a', 'b').aplicar('en'), /debe implementar escribir/);
    });
});

describe('Traductor', () => {
    it('normaliza espacios y saltos de línea', () => {
        assert.equal(Traductor.normalizar('  Hola \n   mundo  '), 'Hola mundo');
    });

    it('recolecta los textos del documento y los traduce de ida y vuelta', () => {
        const texto = { nodeType: 3, nodeValue: '\n   Inicio  ' };
        const intraducible = { nodeType: 3, nodeValue: 'Esto no está en el diccionario' };
        const cuerpo = { nodeType: 1, tagName: 'BODY', innerHTML: '', childNodes: [texto, intraducible] };
        const documento = {
            body: cuerpo,
            title: 'Proyectos · María José Montepeque Zet',
            querySelectorAll: () => [],
            querySelector: () => null
        };

        const traductor = new Traductor(TRADUCCIONES_EN, documento);
        traductor.recolectar();

        traductor.aplicar('en');
        assert.equal(texto.nodeValue, '\n   Home  ', 'conserva los espacios de los bordes');
        assert.equal(intraducible.nodeValue, 'Esto no está en el diccionario');
        assert.equal(documento.title, 'Projects · María José Montepeque Zet');

        traductor.aplicar('es');
        assert.equal(texto.nodeValue, '\n   Inicio  ');
        assert.equal(documento.title, 'Proyectos · María José Montepeque Zet');
    });

    it('recibe el diccionario por el constructor (inyección de dependencias)', () => {
        const nodo = { nodeType: 3, nodeValue: 'Hola' };
        const documento = {
            body: { nodeType: 1, tagName: 'BODY', innerHTML: '', childNodes: [nodo] },
            title: '',
            querySelectorAll: () => [],
            querySelector: () => null
        };
        const traductor = new Traductor({ Hola: 'Hi' }, documento);
        traductor.recolectar();
        traductor.aplicar('en');
        assert.equal(nodo.nodeValue, 'Hi');
    });
});
