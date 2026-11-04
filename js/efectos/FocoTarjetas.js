import { Efecto } from './Efecto.js';

/** Un foco de luz sigue al cursor sobre cada tarjeta (lo pinta el CSS). */
export class FocoTarjetas extends Efecto {
    aplica() {
        return !this.movimiento.reducido;
    }

    iniciar() {
        this.documento.addEventListener('pointermove', (evento) => {
            const tarjeta = evento.target.closest?.('.tarjeta');
            if (!tarjeta) return;
            const caja = tarjeta.getBoundingClientRect();
            tarjeta.style.setProperty('--mx', `${evento.clientX - caja.left}px`);
            tarjeta.style.setProperty('--my', `${evento.clientY - caja.top}px`);
        }, { passive: true });
    }
}
