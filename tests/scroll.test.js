import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { AparicionAlScroll } from '../js/efectos/AparicionAlScroll.js';
import { LineaTiempo } from '../js/efectos/LineaTiempo.js';

/** Elemento falso con lo mínimo que tocan los efectos de scroll. */
function elementoFalso() {
    const clases = new Set();
    return {
        clases,
        classList: {
            add: (...c) => c.forEach((x) => clases.add(x)),
            remove: (...c) => c.forEach((x) => clases.delete(x)),
            contains: (c) => clases.has(c)
        },
        style: { setProperty() {}, removeProperty() {} },
        addEventListener() {}
    };
}

const entrada = (target, isIntersecting, top) => ({ target, isIntersecting, boundingClientRect: { top } });

describe('Efectos de scroll con scroll rápido', () => {
    let observadores;
    const original = globalThis.IntersectionObserver;

    beforeEach(() => {
        observadores = [];
        globalThis.IntersectionObserver = class {
            constructor(avisar) {
                this.avisar = avisar;
                this.observados = [];
                this.desconectado = false;
                observadores.push(this);
            }
            observe(el) { this.observados.push(el); }
            unobserve(el) { this.observados = this.observados.filter((x) => x !== el); }
            disconnect() { this.desconectado = true; }
        };
    });

    afterEach(() => {
        globalThis.IntersectionObserver = original;
    });

    it('AparicionAlScroll anima lo visible, muestra de golpe lo que ya quedó arriba y espera lo que está abajo', () => {
        const visible = elementoFalso();
        const arriba = elementoFalso();
        const abajo = elementoFalso();
        const documento = { querySelectorAll: () => [visible, arriba, abajo] };

        new AparicionAlScroll({ documento, movimiento: { reducido: false } }).arrancar();
        [visible, arriba, abajo].forEach((el) => assert.ok(el.clases.has('revelar'), 'empiezan ocultos'));

        observadores[0].avisar([
            entrada(visible, true, 120),
            entrada(arriba, false, -800), // el visitante bajó tan rápido que ya lo pasó
            entrada(abajo, false, 1500)
        ]);

        assert.ok(visible.clases.has('visible'), 'lo visible se anima');
        assert.ok(!arriba.clases.has('revelar') && !arriba.clases.has('visible'), 'lo que ya quedó arriba se muestra sin animar');
        assert.ok(abajo.clases.has('revelar') && !abajo.clases.has('visible'), 'lo de abajo sigue esperando');
        assert.deepEqual(observadores[0].observados, [abajo], 'solo se sigue observando lo pendiente');
    });

    it('LineaTiempo se dibuja si el visitante ya la pasó de largo', () => {
        const linea = elementoFalso();
        const documento = { querySelector: () => linea };

        new LineaTiempo({ documento, movimiento: { reducido: false } }).arrancar();
        assert.ok(linea.clases.has('sin-dibujar'));

        observadores[0].avisar([entrada(linea, false, 1200)]);
        assert.ok(linea.clases.has('sin-dibujar'), 'si aún no llega, sigue sin dibujar');

        observadores[0].avisar([entrada(linea, false, -900)]);
        assert.ok(!linea.clases.has('sin-dibujar'), 'si ya la pasó, se muestra completa');
        assert.equal(observadores[0].desconectado, true);
    });

    it('con movimiento reducido ningún efecto de scroll se activa', () => {
        const documento = { querySelectorAll: () => [elementoFalso()], querySelector: () => elementoFalso() };
        const contexto = { documento, movimiento: { reducido: true } };
        assert.equal(new AparicionAlScroll(contexto).aplica(), false);
        assert.equal(new LineaTiempo(contexto).aplica(), false);
    });
});
