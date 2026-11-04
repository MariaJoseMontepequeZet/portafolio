/**
 * Responde una sola pregunta: ¿el visitante pidió reducir las animaciones?
 * Los efectos la consultan en lugar de leer el navegador por su cuenta.
 */
export class PreferenciaMovimiento {
    #reducido;

    constructor(consulta = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')) {
        this.#reducido = Boolean(consulta?.matches);
    }

    get reducido() {
        return this.#reducido;
    }
}
