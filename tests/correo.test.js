import assert from 'node:assert/strict';
import { beforeEach, afterEach, describe, it, mock } from 'node:test';
import { EscribirCorreo } from '../js/efectos/EscribirCorreo.js';

/** Elementos y ventana falsos: solo lo que usa el efecto. */
function escenario() {
    const ventana = new EventTarget();
    const gmail = { href: null, setAttribute(nombre, valor) { this[nombre] = valor; } };
    const ayuda = { hidden: true, querySelector: (selector) => (selector === '[data-gmail]' ? gmail : null) };
    const clics = [];
    const boton = {
        getAttribute: () => 'majo@ejemplo.com',
        addEventListener: (tipo, fn) => { if (tipo === 'click') clics.push(fn); }
    };
    const documento = {
        defaultView: ventana,
        querySelector: (selector) => (selector === '[data-escribir]' ? boton : selector === '[data-ayuda-correo]' ? ayuda : null)
    };
    return { ventana, gmail, ayuda, documento, hacerClic: () => clics.forEach((fn) => fn()) };
}

describe('EscribirCorreo: respaldo cuando no hay programa de correo', () => {
    beforeEach(() => mock.timers.enable({ apis: ['setTimeout'] }));
    afterEach(() => mock.timers.reset());

    it('arma el enlace de Gmail con la dirección del botón', () => {
        const { documento, gmail } = escenario();
        new EscribirCorreo({ documento }).arrancar();
        assert.equal(gmail.href, 'https://mail.google.com/mail/?view=cm&fs=1&to=majo%40ejemplo.com');
    });

    it('muestra la ayuda si la ventana sigue activa después del clic', () => {
        const { documento, ayuda, hacerClic } = escenario();
        new EscribirCorreo({ documento }).arrancar();

        hacerClic();
        assert.equal(ayuda.hidden, true, 'todavía no: se espera un momento');
        mock.timers.tick(EscribirCorreo.ESPERA_MS);
        assert.equal(ayuda.hidden, false);
    });

    it('no muestra la ayuda si el programa de correo se abrió (la ventana pierde el foco)', () => {
        const { documento, ayuda, ventana, hacerClic } = escenario();
        new EscribirCorreo({ documento }).arrancar();

        hacerClic();
        ventana.dispatchEvent(new Event('blur'));
        mock.timers.tick(EscribirCorreo.ESPERA_MS * 2);
        assert.equal(ayuda.hidden, true);
    });

    it('no hace nada en una página sin el botón', () => {
        const documento = { defaultView: new EventTarget(), querySelector: () => null };
        assert.equal(new EscribirCorreo({ documento }).aplica(), false);
    });
});
