import { Efecto } from './Efecto.js';

/**
 * Las tarjetas y secciones entran con un fundido cuando aparecen en pantalla.
 *
 * Si el visitante baja tan rápido que un elemento queda ARRIBA de la pantalla
 * sin haberse animado, se muestra de inmediato y sin animación: nunca se queda
 * invisible.
 */
export class AparicionAlScroll extends Efecto {
    static SELECTOR = '.pilar, .proyecto, .perfil, .cert, .hito, .grid-habilidades .tarjeta, .resumen-grid p, .contacto-enlace';
    static MS_ENTRE_ELEMENTOS = 70;

    aplica() {
        return !this.movimiento.reducido && 'IntersectionObserver' in globalThis;
    }

    iniciar() {
        const observador = new IntersectionObserver((entradas) => {
            let orden = 0;
            for (const entrada of entradas) {
                const yaPasado = !entrada.isIntersecting && entrada.boundingClientRect.top < 0;
                if (!entrada.isIntersecting && !yaPasado) continue;

                if (yaPasado) this.#mostrarSinAnimar(entrada.target);
                else this.#revelar(entrada.target, orden++);
                observador.unobserve(entrada.target);
            }
        }, { rootMargin: '0px 0px 10% 0px', threshold: 0.05 });

        this.documento.querySelectorAll(AparicionAlScroll.SELECTOR).forEach((elemento) => {
            elemento.classList.add('revelar');
            observador.observe(elemento);
        });
    }

    #revelar(elemento, orden) {
        elemento.style.setProperty('--retraso', `${(orden % 4) * AparicionAlScroll.MS_ENTRE_ELEMENTOS}ms`);
        elemento.classList.add('visible');
        // al terminar se quitan las clases para no interferir con el hover
        elemento.addEventListener('animationend', () => this.#mostrarSinAnimar(elemento), { once: true });
    }

    #mostrarSinAnimar(elemento) {
        elemento.classList.remove('revelar', 'visible');
        elemento.style.removeProperty('--retraso');
    }
}
