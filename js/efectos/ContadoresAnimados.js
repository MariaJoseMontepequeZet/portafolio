import { Efecto } from './Efecto.js';

/** Los números del hero cuentan de 0 hasta su valor al aparecer en pantalla. */
export class ContadoresAnimados extends Efecto {
    static DURACION_MS = 1100;

    #contadores = [];

    aplica() {
        this.#contadores = [...this.documento.querySelectorAll('[data-contador]')];
        return !this.movimiento.reducido && 'IntersectionObserver' in globalThis && this.#contadores.length > 0;
    }

    iniciar() {
        const observador = new IntersectionObserver((entradas) => {
            for (const entrada of entradas) {
                if (!entrada.isIntersecting) continue;
                this.#contar(entrada.target);
                observador.unobserve(entrada.target);
            }
        }, { threshold: 0.6 });

        this.#contadores.forEach((elemento) => observador.observe(elemento));
    }

    #contar(elemento) {
        const meta = parseInt(elemento.getAttribute('data-contador'), 10);
        let inicio = null;

        const paso = (instante) => {
            inicio ??= instante;
            const avance = Math.min((instante - inicio) / ContadoresAnimados.DURACION_MS, 1);
            elemento.textContent = Math.round(meta * (1 - Math.pow(1 - avance, 3)));
            if (avance < 1) requestAnimationFrame(paso);
        };

        elemento.textContent = '0';
        requestAnimationFrame(paso);
    }
}
