import { DialogoDetalle } from './DialogoDetalle.js';
import { Efecto } from './Efecto.js';

/**
 * Conecta los botones «Ver detalle» de cada proyecto con el diálogo. Los datos
 * de cada proyecto viven ocultos en el HTML (`#detalle-<id>`).
 */
export class DetalleProyecto extends Efecto {
    #botones = [];

    aplica() {
        this.#botones = [...this.documento.querySelectorAll('[data-detalle]')];
        return this.#botones.length > 0;
    }

    iniciar() {
        if (typeof HTMLDialogElement === 'undefined') {
            // sin <dialog> no hay donde mostrar el detalle: se ocultan los botones
            this.#botones.forEach((boton) => { boton.hidden = true; });
            return;
        }

        const dialogo = new DialogoDetalle({
            documento: this.documento,
            movimiento: this.movimiento,
            idioma: this.idioma
        });

        for (const boton of this.#botones) {
            boton.addEventListener('click', () => {
                const datos = this.documento.getElementById(`detalle-${boton.getAttribute('data-detalle')}`);
                const titulo = boton.closest('.proyecto').querySelector('h2').textContent;
                dialogo.abrir(titulo, datos);
            });
        }
    }
}
