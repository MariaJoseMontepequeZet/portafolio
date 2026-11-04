import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DialogoDetalle } from '../js/efectos/DialogoDetalle.js';

/** Datos falsos: solo «tiene» los paneles que se le indican. */
const datosCon = (...paneles) => ({
    querySelector: (selector) => {
        const nombre = selector.match(/data-panel="(.+)"/)?.[1];
        return paneles.includes(nombre) ? {} : null;
    }
});

describe('DialogoDetalle: pestañas según el proyecto', () => {
    it('muestra las tres pestañas cuando el proyecto trae los tres paneles', () => {
        const datos = datosCon('descripcion', 'estructura', 'modulos');
        assert.deepEqual(DialogoDetalle.pestanasDisponibles(datos), ['descripcion', 'estructura', 'modulos']);
    });

    it('omite la estructura de un proyecto privado que no la tiene', () => {
        const datos = datosCon('descripcion', 'modulos');
        assert.deepEqual(DialogoDetalle.pestanasDisponibles(datos), ['descripcion', 'modulos']);
    });

    it('respeta siempre el mismo orden, sin importar cómo lleguen los paneles', () => {
        const datos = datosCon('modulos', 'descripcion');
        assert.deepEqual(DialogoDetalle.pestanasDisponibles(datos), ['descripcion', 'modulos']);
    });

    it('devuelve una lista vacía si no hay ningún panel', () => {
        assert.deepEqual(DialogoDetalle.pestanasDisponibles(datosCon()), []);
    });
});
