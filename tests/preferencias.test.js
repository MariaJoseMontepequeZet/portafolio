import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AlmacenLocal } from '../js/nucleo/AlmacenLocal.js';
import { Idioma } from '../js/preferencias/Idioma.js';
import { Tema } from '../js/preferencias/Tema.js';

/** Almacén falso en memoria: se inyecta en lugar de localStorage. */
function almacenFalso(inicial = {}) {
    const datos = new Map(Object.entries(inicial));
    return {
        leer: (clave) => datos.get(clave) ?? null,
        guardar: (clave, valor) => datos.set(clave, valor),
        datos
    };
}

/** Documento falso con lo mínimo que usan Tema e Idioma. */
function documentoFalso() {
    const atributos = {};
    const meta = { contenido: '', setAttribute(nombre, valor) { this.contenido = valor; } };
    return {
        documentElement: { lang: '', setAttribute: (nombre, valor) => { atributos[nombre] = valor; } },
        querySelector: (selector) => (selector.includes('theme-color') ? meta : null),
        atributos,
        meta
    };
}

describe('AlmacenLocal', () => {
    it('lee y guarda en el almacén inyectado', () => {
        const base = new Map();
        const almacen = new AlmacenLocal({ getItem: (k) => base.get(k) ?? null, setItem: (k, v) => base.set(k, v) });
        almacen.guardar('tema', 'light');
        assert.equal(almacen.leer('tema'), 'light');
    });

    it('no rompe si el almacenamiento falla', () => {
        const roto = {
            getItem() { throw new Error('bloqueado'); },
            setItem() { throw new Error('bloqueado'); }
        };
        const almacen = new AlmacenLocal(roto);
        assert.equal(almacen.leer('tema'), null);
        assert.doesNotThrow(() => almacen.guardar('tema', 'dark'));
    });
});

describe('Tema', () => {
    it('usa la preferencia guardada por encima de la del sistema', () => {
        const tema = new Tema({ almacen: almacenFalso({ tema: 'dark' }), documento: documentoFalso(), prefiereClaro: true });
        assert.equal(tema.actual, 'dark');
    });

    it('usa la preferencia del sistema si no hay nada guardado', () => {
        const claro = new Tema({ almacen: almacenFalso(), documento: documentoFalso(), prefiereClaro: true });
        const oscuro = new Tema({ almacen: almacenFalso(), documento: documentoFalso(), prefiereClaro: false });
        assert.equal(claro.actual, 'light');
        assert.equal(oscuro.actual, 'dark');
    });

    it('al alternar aplica, guarda y avisa a los observadores', () => {
        const almacen = almacenFalso({ tema: 'dark' });
        const documento = documentoFalso();
        const tema = new Tema({ almacen, documento });
        const avisos = [];
        tema.alCambiar((nuevo) => avisos.push(nuevo));

        tema.alternar();

        assert.equal(tema.actual, 'light');
        assert.equal(documento.atributos['data-theme'], 'light');
        assert.equal(documento.meta.contenido, Tema.COLOR_META.light);
        assert.equal(almacen.datos.get('tema'), 'light');
        assert.deepEqual(avisos, ['light']);
    });

    it('rechaza un tema que no existe', () => {
        const tema = new Tema({ almacen: almacenFalso(), documento: documentoFalso() });
        assert.throws(() => tema.establecer('morado'), RangeError);
    });
});

describe('Idioma', () => {
    it('toma el idioma del navegador si no hay uno guardado', () => {
        const ingles = new Idioma({ almacen: almacenFalso(), documento: documentoFalso(), preferido: 'en-US' });
        const otro = new Idioma({ almacen: almacenFalso(), documento: documentoFalso(), preferido: 'fr-FR' });
        assert.equal(ingles.actual, 'en');
        assert.equal(otro.actual, 'es');
    });

    it('prefiere el idioma guardado', () => {
        const idioma = new Idioma({ almacen: almacenFalso({ idioma: 'es' }), documento: documentoFalso(), preferido: 'en' });
        assert.equal(idioma.actual, 'es');
    });

    it('al alternar cambia el atributo lang, guarda y avisa', () => {
        const almacen = almacenFalso({ idioma: 'es' });
        const documento = documentoFalso();
        const idioma = new Idioma({ almacen, documento });
        const avisos = [];
        idioma.alCambiar((codigo) => avisos.push(codigo));

        idioma.alternar();

        assert.equal(idioma.esIngles, true);
        assert.equal(documento.documentElement.lang, 'en');
        assert.equal(almacen.datos.get('idioma'), 'en');
        assert.deepEqual(avisos, ['en']);
    });

    it('rechaza un idioma no soportado', () => {
        const idioma = new Idioma({ almacen: almacenFalso(), documento: documentoFalso() });
        assert.throws(() => idioma.establecer('fr'), RangeError);
    });
});
