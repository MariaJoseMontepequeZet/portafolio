## Descripción

<!-- ¿Qué cambia este PR y por qué? -->

## Tipo de cambio

- [ ] Nueva funcionalidad
- [ ] Corrección de error
- [ ] Estilos / UI
- [ ] Contenido (textos, proyectos, certificaciones)
- [ ] Documentación
- [ ] Refactor

## Página(s) afectada(s)

- [ ] Inicio
- [ ] Sobre mí
- [ ] Habilidades
- [ ] Proyectos
- [ ] Contacto

## Checklist obligatorio

### Tecnología
- [ ] Solo HTML, CSS y JavaScript puro (sin frameworks ni librerías de UI).
- [ ] Sin estilos ni scripts en línea (`style="..."`, `onclick="..."`, `<script>` con código), para poder aplicar una política de contenido (CSP) estricta más adelante.
- [ ] Si se agregó un recurso externo (fuentes, scripts, iframes), se comprobó que carga en el sitio publicado.

### Contenido
- [ ] Si cambió un texto en español, se actualizó su clave en `js/datos/traducciones-en.js`.
- [ ] Las imágenes tienen `alt` descriptivo (o vacío si son decorativas).
- [ ] Los nombres de archivo en `imagenes/` van en minúsculas.

### Interfaz
- [ ] Se ve bien en tema claro y oscuro.
- [ ] Es responsive (probado en móvil y escritorio).
- [ ] Las animaciones respetan `prefers-reduced-motion`.
- [ ] No hay errores en la consola del navegador.

### Calidad
- [ ] El PR apunta a la rama `develop` (no directamente a `main`).
- [ ] Los commits tienen mensajes claros y descriptivos.
- [ ] Se actualizó el README si el cambio lo requiere.

## Cómo probarlo

1. <!-- pasos para verificar el cambio -->

## Capturas de pantalla

<!-- Adjunta capturas en escritorio y móvil, en tema claro y oscuro, si el cambio afecta la UI -->
