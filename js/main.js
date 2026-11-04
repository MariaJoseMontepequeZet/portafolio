/*
 * Raíz de composición: el ÚNICO lugar que conoce las clases concretas y las
 * conecta entre sí. Aquí se crean las dependencias (almacén, tema, idioma...) y
 * se inyectan donde hacen falta; ninguna clase las busca por su cuenta.
 *
 * Para agregar un efecto nuevo: crear su clase (hija de Efecto) y sumarla a la
 * lista `efectos`. Nada más cambia.
 */
import { TRADUCCIONES_EN } from './datos/traducciones-en.js';
import { AparicionAlScroll } from './efectos/AparicionAlScroll.js';
import { ContadoresAnimados } from './efectos/ContadoresAnimados.js';
import { CopiarCorreo } from './efectos/CopiarCorreo.js';
import { DetalleProyecto } from './efectos/DetalleProyecto.js';
import { EscribirCorreo } from './efectos/EscribirCorreo.js';
import { FiltroProyectos } from './efectos/FiltroProyectos.js';
import { FocoTarjetas } from './efectos/FocoTarjetas.js';
import { LineaTiempo } from './efectos/LineaTiempo.js';
import { TerminalHero } from './efectos/TerminalHero.js';
import { TransicionTema } from './efectos/TransicionTema.js';
import { AlmacenLocal } from './nucleo/AlmacenLocal.js';
import { PreferenciaMovimiento } from './nucleo/PreferenciaMovimiento.js';
import { ControlesPreferencias } from './preferencias/ControlesPreferencias.js';
import { Idioma } from './preferencias/Idioma.js';
import { Tema } from './preferencias/Tema.js';
import { Traductor } from './preferencias/Traductor.js';

function iniciar() {
    const documento = document;
    const almacen = new AlmacenLocal();
    const movimiento = new PreferenciaMovimiento();

    const tema = new Tema({
        almacen,
        documento,
        prefiereClaro: matchMedia('(prefers-color-scheme: light)').matches
    });
    const idioma = new Idioma({ almacen, documento, preferido: navigator.language });
    const traductor = new Traductor(TRADUCCIONES_EN, documento);

    // preferencias: primero el tema y los textos, para que los efectos ya vean el idioma final
    tema.iniciar();
    traductor.recolectar();
    idioma.alCambiar((codigo) => traductor.aplicar(codigo));
    new ControlesPreferencias({ documento, tema, idioma }).iniciar();
    idioma.iniciar();

    const contexto = { documento, movimiento, idioma };
    const efectos = [
        new AparicionAlScroll(contexto),
        new ContadoresAnimados(contexto),
        new TerminalHero(contexto),
        new FiltroProyectos(contexto),
        new CopiarCorreo(contexto),
        new EscribirCorreo(contexto),
        new DetalleProyecto(contexto),
        new LineaTiempo(contexto),
        new FocoTarjetas(contexto),
        new TransicionTema(contexto, tema)
    ];
    efectos.forEach((efecto) => efecto.arrancar());
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
} else {
    iniciar();
}
