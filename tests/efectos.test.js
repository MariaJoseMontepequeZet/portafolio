import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ContadoresAnimados } from '../js/efectos/ContadoresAnimados.js';
import { Efecto } from '../js/efectos/Efecto.js';
import { FocoTarjetas } from '../js/efectos/FocoTarjetas.js';
import { TerminalHero } from '../js/efectos/TerminalHero.js';

const idiomaFalso = (actual) => ({ actual, esIngles: actual === 'en', alCambiar() {} });

describe('Efecto (clase abstracta y método plantilla)', () => {
    it('no se puede instanciar directamente', () => {
        assert.throws(() => new Efecto({}), TypeError);
    });

    it('una hija que no implementa iniciar() falla con un error claro', () => {
        class Incompleto extends Efecto {}
        assert.throws(() => new Incompleto({}).iniciar(), /debe implementar iniciar/);
    });

    it('arrancar() solo inicia el efecto si aplica() lo permite', () => {
        const llamadas = [];
        class Activo extends Efecto { iniciar() { llamadas.push('activo'); } }
        class Inactivo extends Efecto {
            aplica() { return false; }
            iniciar() { llamadas.push('inactivo'); }
        }
        [new Activo({}), new Inactivo({})].forEach((efecto) => efecto.arrancar());
        assert.deepEqual(llamadas, ['activo']);
    });
});

describe('Efectos concretos con dependencias falsas', () => {
    it('TerminalHero escribe el mensaje completo si se redujo el movimiento', () => {
        const cuerpo = { textContent: '', classList: { add() {}, remove() {} } };
        const documento = { querySelector: () => cuerpo };
        const contexto = { documento, movimiento: { reducido: true }, idioma: idiomaFalso('en') };

        new TerminalHero(contexto).arrancar();

        assert.equal(cuerpo.textContent, TerminalHero.TEXTOS.en);
    });

    it('TerminalHero cambia el mensaje cuando cambia el idioma', () => {
        const cuerpo = { textContent: '', classList: { add() {}, remove() {} } };
        const observadores = [];
        const idioma = { actual: 'es', alCambiar: (fn) => observadores.push(fn) };
        const contexto = { documento: { querySelector: () => cuerpo }, movimiento: { reducido: true }, idioma };

        new TerminalHero(contexto).arrancar();
        assert.equal(cuerpo.textContent, TerminalHero.TEXTOS.es);

        idioma.actual = 'en';
        observadores.forEach((avisar) => avisar('en'));
        assert.equal(cuerpo.textContent, TerminalHero.TEXTOS.en);
    });

    it('TerminalHero no hace nada si la página no tiene terminal', () => {
        const documento = { querySelector: () => null };
        const efecto = new TerminalHero({ documento, movimiento: { reducido: true }, idioma: idiomaFalso('es') });
        assert.equal(efecto.aplica(), false);
    });

    it('los efectos animados no se activan con movimiento reducido', () => {
        const documento = { querySelectorAll: () => [1] };
        const contexto = { documento, movimiento: { reducido: true }, idioma: idiomaFalso('es') };
        assert.equal(new ContadoresAnimados(contexto).aplica(), false);
        assert.equal(new FocoTarjetas(contexto).aplica(), false);
    });
});
