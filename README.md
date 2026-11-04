# 💻 Portafolio Web · María José Montepeque Zet

Sitio web personal para presentar mi trayectoria académica, habilidades técnicas y proyectos en las áreas de **Ingeniería en Ciencias y Sistemas** y **Ciberseguridad**.

> Hecho por **María José Montepeque Zet** ✨

| | |
|---|---|
| **Sitio publicado** | https://portafoliomariajosemontepequezet.pamcing.me |
| **Despliegue** | Automático al integrar en `main` ([guía](docs/despliegue-servidor.md)) |

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Licencia MIT](https://img.shields.io/badge/Licencia-MIT-7e076e?style=flat)

---

## 📋 Tabla de contenido

- [📍 Introducción](#-introducción)
- [🔍 Secciones del sitio](#-secciones-del-sitio)
- [🛠️ Tecnologías](#️-tecnologías)
- [🎨 Sistema de estilos](#-sistema-de-estilos)
- [🌗 Tema e idioma](#-tema-e-idioma)
- [🧱 Arquitectura: POO y SOLID](#-arquitectura-poo-y-solid)
- [🔒 Seguridad y SEO](#-seguridad-y-seo)
- [⚙️ Cómo ejecutarlo](#️-cómo-ejecutarlo)
- [📂 Estructura del proyecto](#-estructura-del-proyecto)
- [🌿 Flujo de trabajo](#-flujo-de-trabajo)
- [🚀 Despliegue](#-despliegue)
- [📄 Licencia](#-licencia)

---

## 📍 Introducción

Portafolio estático construido con HTML, CSS y una pizca de JavaScript, sin frameworks ni dependencias. Centraliza mi perfil como estudiante de la **USAC**, mis certificaciones en **Ciberseguridad**, **Python** e **Inteligencia Artificial**, y mis proyectos de desarrollo.

> [!NOTE]
> Diseño con acentos violeta, disponible en **tema oscuro y claro** y en **español e inglés**.

---

## 🔍 Secciones del sitio

| Página | Contenido |
|---|---|
| **Inicio** | Presentación, enfoque profesional y resumen personal. |
| **Sobre mí** | Cuatro tarjetas con quién soy, gustos, formación e intereses IT. |
| **Habilidades** | Stack técnico agrupado por nivel (sólido, intermedio, básico), con la evidencia de cada una: los proyectos y certificaciones que la respaldan. |
| **Proyectos** | Listado de proyectos con etiquetas de tecnologías y enlace a cada repositorio. |
| **Contacto** | Enlaces a LinkedIn, GitHub y correo. |

**Características:**
- 🌗 Tema claro/oscuro con detección de la preferencia del sistema.
- 🌐 Cambio de idioma español/inglés sin recargar la página.
- 📱 Diseño responsivo con menú hamburguesa sin JavaScript.
- ♿ Enlace "saltar al contenido", `aria-current`, foco visible y `prefers-reduced-motion`.
- 🧩 Componentes reutilizables: `.tarjeta`, `.btn`, `.chip`, `.etiqueta`.
- 🖼️ Iconos SVG inline y favicon vectorial.

---

## 🛠️ Tecnologías

- **HTML5** — estructura semántica (`main`, `article`, `nav`, `footer`).
- **CSS3** — variables personalizadas, Flexbox, Grid y animaciones.
- **JavaScript** — módulos ES y clases (POO), para las preferencias de tema e idioma y los efectos de la interfaz (`js/`).
- **Google Fonts** — Inter y Space Grotesk.
- **SVG** — iconografía vectorial.

---

## 🎨 Sistema de estilos

Cada página carga `CSS/base.css` más su hoja específica. Los tokens se definen una sola vez; el tema claro los redefine bajo `[data-theme="light"]`:

```css
:root,
:root[data-theme="dark"] {
    --fondo: #0b0a14;
    --superficie: #131222;
    --primario: #8b5cf6;
    --acento: #6366f1;
    --texto: #f4f4fb;
    --texto-suave: #a6a6c1;
}

:root[data-theme="light"] {
    --fondo: #f6f5fc;
    --superficie: #ffffff;
    --primario: #6d28d9;
    --acento: #4f46e5;
    --texto: #17162b;
    --texto-suave: #4b4a68;
}
```

Los colores de los componentes salen siempre de estos tokens, de modo que un tema nuevo solo necesita un bloque más.

---

## 🌗 Tema e idioma

Ambos controles están en la barra de navegación y se guardan en `localStorage`.

- **Tema:** si no hay preferencia guardada, se usa la del sistema (`prefers-color-scheme`); sin JavaScript el sitio se muestra en oscuro.
- **Idioma:** el español es el contenido original del HTML (así funciona sin JavaScript y se indexa bien). El inglés se aplica desde `js/traducciones.js`, un diccionario cuya clave es el texto en español.

> [!IMPORTANT]
> Si cambias un texto en español dentro del HTML, actualiza también su clave en `js/traducciones.js`; de lo contrario, ese texto se quedará en español al cambiar a inglés.

---

## 🧱 Arquitectura: POO y SOLID

El JavaScript está escrito con **clases y módulos ES**. Cada clase tiene una sola responsabilidad y recibe lo que necesita por el constructor; solo `main.js` conoce las clases concretas y las conecta.

```text
main.js ──▶ crea AlmacenLocal, PreferenciaMovimiento, Tema, Idioma, Traductor
        └─▶ crea los efectos con un «contexto» { documento, movimiento, idioma }
```

**Programación orientada a objetos**

| Concepto | Dónde verlo |
|---|---|
| **Encapsulamiento** | Atributos privados (`#`) en todas las clases: `Tema.#actual`, `Idioma.#observadores`, `AlmacenLocal.#almacen`... Solo se exponen getters y métodos. |
| **Abstracción y clase abstracta** | `Efecto` y `Traducible` no se pueden instanciar (`new.target`); definen el contrato que cumplen sus hijas. |
| **Herencia** | 9 efectos extienden `Efecto` (`AparicionAlScroll`, `TerminalHero`, `FiltroProyectos`...). 4 clases extienden `Traducible` (`TextoDeNodo`, `HtmlDeElemento`, `AtributoDeElemento`, `TituloDelDocumento`). |
| **Polimorfismo** | `Traductor` llama `aplicar()` a cualquier `Traducible` sin saber su tipo, y `main.js` llama `arrancar()` a cualquier `Efecto`; cada hija responde a su manera. |
| **Método plantilla** | `Efecto.arrancar()` pregunta `aplica()` y luego llama `iniciar()`; las hijas solo sobrescriben esos dos. |
| **Patrón observador** | `Tema.alCambiar()` e `Idioma.alCambiar()` avisan a quien se suscriba (botones, traductor, terminal, filtro). |

**Principios SOLID**

| Principio | Cómo se cumple |
|---|---|
| **S** · Responsabilidad única | `Tema` solo gestiona el tema; `Idioma` solo el idioma; `Traductor` solo escribe textos; `ControlesPreferencias` solo conecta los botones; cada efecto hace una sola cosa. |
| **O** · Abierto/cerrado | Un efecto nuevo es una clase nueva (hija de `Efecto`) y una línea en la lista de `main.js`; no se toca ninguna otra clase. Un destino de traducción nuevo es otra hija de `Traducible`. |
| **L** · Sustitución de Liskov | Cualquier `Efecto` puede ocupar el lugar de otro en la lista, y cualquier `Traducible` en el del suyo: ninguna hija rompe el contrato de su base. |
| **I** · Segregación de interfaces | Las clases exponen interfaces pequeñas: los efectos solo ven `documento`, `movimiento` e `idioma`; el idioma solo ofrece `actual`, `esIngles` y `alCambiar()`. |
| **D** · Inversión de dependencias | Nada busca globales por su cuenta: el almacén, el documento, el diccionario y el idioma se **inyectan** por el constructor. Por eso las pruebas usan objetos falsos en lugar del navegador. |

Las **26 pruebas** (`npm test`) cubren el almacén, el tema, el idioma, el traductor, la jerarquía `Traducible`, la clase abstracta `Efecto` y los efectos de scroll, todo sin abrir un navegador.

> [!NOTE]
> `js/tema-inicial.js` es lo único que no está en un módulo: los módulos se ejecutan diferidos, y el tema debe aplicarse antes del primer pintado para evitar un parpadeo. Repite a propósito un par de líneas de `Tema`.

---

## 🔒 Seguridad y SEO

- **Cabeceras de seguridad** (en `servidor/nginx.conf`): `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` y `Permissions-Policy`. Por eso el código no usa estilos ni scripts en línea.
- **Página 404 propia** (`404.html`) y sin versión del servidor a la vista.
- **Open Graph y Twitter Card** en todas las páginas, con una imagen de 1200×630 (`imagenes/og.jpg`), para que el enlace se vea bien en LinkedIn y WhatsApp. Si cambias la imagen, sube el número de `?v=1` en las etiquetas `og:image`.
- `sitemap.xml`, `robots.txt` y URL canónica en cada página.

---

## ⚙️ Cómo ejecutarlo

**Requisitos:** un navegador moderno. Para editar, se recomienda Visual Studio Code.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/MariaJoseMontepequeZet/Portafolio.git
   cd Portafolio
   ```
2. Sirve la carpeta con cualquier servidor estático (los módulos ES no funcionan abriendo el archivo con doble clic):
   ```bash
   python -m http.server 8000
   ```
   y abre http://localhost:8000.
3. Para correr las pruebas (necesitan Node.js 20 o superior, sin instalar nada más):
   ```bash
   npm test
   ```

---

## 📂 Estructura del proyecto

```text
Portafolio/
├── index.html, sobremi.html, habilidades.html, proyectos.html, contactame.html
├── 404.html              # página de error con el diseño del sitio
├── sitemap.xml, robots.txt
├── CSS/
│   ├── base.css          # tokens, layout, navbar y componentes
│   └── *.css             # una hoja por página
├── js/
│   ├── tema-inicial.js   # aplica el tema antes del primer pintado (evita el parpadeo)
│   ├── main.js           # raíz de composición: crea los objetos y los conecta
│   ├── nucleo/           # AlmacenLocal, PreferenciaMovimiento
│   ├── preferencias/     # Tema, Idioma, Traductor, Traducible, ControlesPreferencias
│   ├── efectos/          # Efecto (abstracta) y sus 9 hijas
│   └── datos/            # traducciones-en.js (diccionario español → inglés)
├── tests/                # pruebas con node:test
├── servidor/nginx.conf   # configuración de nginx del servidor (referencia)
├── docs/                 # guía de despliegue
└── imagenes/             # logo, fotos, portadas, iconos de habilidades e imagen para compartir (og.jpg)
```

> Los nombres de archivo en `imagenes/` van en minúsculas: los servidores Linux (Netlify, GitHub Pages) distinguen mayúsculas.

---

## 🌿 Flujo de trabajo

- `main`: versión publicada. Un merge a `main` despliega el sitio.
- `develop`: integración de cambios.
- `feat/*`, `fix/*`, `docs/*`, `refactor/*`: ramas de trabajo que se integran con *pull request* hacia `develop`, usando la plantilla de `.github/pull_request_template.md`.

Los commits siguen *Conventional Commits* con emoji (por ejemplo, `feat: :lipstick: ...`).

---

## 🚀 Despliegue

El sitio vive en un servidor propio con Docker: un contenedor nginx sirve la carpeta `~/portafolio/sitio` y Cloudflare pone delante el dominio, el HTTPS y la caché. El enlace es siempre el mismo: https://portafoliomariajosemontepequezet.pamcing.me

**Despliegue automático:** `.github/workflows/desplegar.yml` se ejecuta al hacer push a `main`. Un runner propio instalado en el servidor copia el sitio a `~/portafolio/sitio` y comprueba que responda. Como el portafolio es estático, no hay nada que reconstruir.

La configuración inicial (runner y carpeta del sitio) está paso a paso en [`docs/despliegue-servidor.md`](docs/despliegue-servidor.md). Lo que **no** es automático: los cambios en `docker-compose.yml` o en nginx, y la caché de Cloudflare.

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE).
