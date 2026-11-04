import { Efecto } from './Efecto.js';

/** Chips para filtrar los proyectos por tecnología. */
export class FiltroProyectos extends Efecto {
    static ROTULOS = {
        es: { todos: 'Todos', grupo: 'Filtrar por tecnología' },
        en: { todos: 'All', grupo: 'Filter by technology' }
    };

    #rejilla = null;
    #tarjetas = [];
    #botones = [];
    #barra = null;
    #botonTodos = null;

    aplica() {
        this.#rejilla = this.documento.querySelector('.grid-proyectos');
        return this.#rejilla !== null;
    }

    iniciar() {
        this.#tarjetas = [...this.#rejilla.querySelectorAll('.proyecto')];
        const etiquetas = this.#etiquetarTarjetas();

        this.#barra = this.#crearBarra(etiquetas);
        this.#rejilla.parentNode.insertBefore(this.#barra, this.#rejilla);
        this.#barra.addEventListener('click', (evento) => {
            const boton = evento.target.closest('.filtro-btn');
            if (boton) this.#filtrar(boton.getAttribute('data-valor'));
        });

        this.#filtrar('');
        this.idioma.alCambiar(() => this.#rotular());
    }

    /** Guarda las etiquetas de cada tarjeta y devuelve la lista sin repetidos. */
    #etiquetarTarjetas() {
        const todas = new Set();
        for (const tarjeta of this.#tarjetas) {
            const etiquetas = [...tarjeta.querySelectorAll('.chip:not(.chip-estado)')].map((chip) => chip.textContent.trim());
            tarjeta.setAttribute('data-tags', etiquetas.join('|'));
            etiquetas.forEach((etiqueta) => todas.add(etiqueta));
        }
        return [...todas];
    }

    #crearBarra(etiquetas) {
        const barra = this.documento.createElement('div');
        barra.className = 'filtro';
        barra.setAttribute('role', 'group');

        this.#botonTodos = this.#crearBoton('');
        barra.appendChild(this.#botonTodos);
        for (const etiqueta of etiquetas) {
            const boton = this.#crearBoton(etiqueta);
            boton.textContent = etiqueta;
            barra.appendChild(boton);
        }
        this.#barra = barra;
        this.#rotular();
        return barra;
    }

    #crearBoton(valor) {
        const boton = this.documento.createElement('button');
        boton.type = 'button';
        boton.className = 'filtro-btn';
        boton.setAttribute('data-valor', valor);
        this.#botones.push(boton);
        return boton;
    }

    #rotular() {
        const rotulos = FiltroProyectos.ROTULOS[this.idioma.actual];
        this.#botonTodos.textContent = rotulos.todos;
        this.#barra.setAttribute('aria-label', rotulos.grupo);
    }

    #filtrar(valor) {
        for (const boton of this.#botones) {
            boton.setAttribute('aria-pressed', String(boton.getAttribute('data-valor') === valor));
        }
        for (const tarjeta of this.#tarjetas) {
            const visible = !valor || tarjeta.getAttribute('data-tags').split('|').includes(valor);
            tarjeta.hidden = !visible;
            if (visible && !this.movimiento.reducido) this.#animar(tarjeta);
        }
    }

    #animar(tarjeta) {
        tarjeta.classList.remove('filtrado');
        void tarjeta.offsetWidth; // reinicia la animación
        tarjeta.classList.add('filtrado');
    }
}
