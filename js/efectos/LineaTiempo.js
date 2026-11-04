import { Efecto } from './Efecto.js';

/**
 * La línea de la trayectoria se dibuja al llegar a ella con el scroll. Si el
 * visitante ya la pasó de largo, se muestra completa.
 */
export class LineaTiempo extends Efecto {
    #linea = null;

    aplica() {
        this.#linea = this.documento.querySelector('.linea-tiempo');
        return this.#linea !== null && !this.movimiento.reducido && 'IntersectionObserver' in globalThis;
    }

    iniciar() {
        this.#linea.classList.add('sin-dibujar');
        const observador = new IntersectionObserver((entradas) => {
            const entrada = entradas[0];
            const yaPasada = !entrada.isIntersecting && entrada.boundingClientRect.top < 0;
            if (!entrada.isIntersecting && !yaPasada) return;
            this.#linea.classList.remove('sin-dibujar');
            observador.disconnect();
        }, { threshold: 0.2 });
        observador.observe(this.#linea);
    }
}
