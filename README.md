# 💻 Portafolio Web · María José Montepeque Zet

Sitio web personal para presentar mi trayectoria académica, habilidades técnicas y proyectos en las áreas de **Ingeniería en Ciencias y Sistemas** y **Ciberseguridad**.

> Hecho por **María José Montepeque Zet** ✨

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
- [⚙️ Cómo ejecutarlo](#️-cómo-ejecutarlo)
- [📂 Estructura del proyecto](#-estructura-del-proyecto)
- [🌿 Flujo de trabajo](#-flujo-de-trabajo)
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
| **Habilidades** | Stack técnico agrupado por categorías: desarrollo, backend, bases de datos, DevOps, IA y herramientas. |
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
- **JavaScript** — solo para el cambio de tema e idioma (`js/`).
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

## ⚙️ Cómo ejecutarlo

**Requisitos:** un navegador moderno. Para editar, se recomienda Visual Studio Code.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/MariaJoseMontepequeZet/Portafolio.git
   cd Portafolio
   ```
2. Abre `index.html` en el navegador, o sirve la carpeta con cualquier servidor estático:
   ```bash
   python -m http.server 8000
   ```

---

## 📂 Estructura del proyecto

```text
Portafolio/
├── index.html
├── sobremi.html
├── habilidades.html
├── proyectos.html
├── contactame.html
├── CSS/
│   ├── base.css          # tokens, layout, navbar y componentes
│   └── *.css             # una hoja por página
├── js/
│   ├── preferencias.js   # tema e idioma
│   └── traducciones.js   # diccionario español → inglés
└── imagenes/             # logo, ilustraciones, proyectos e iconos de habilidades
```

> Los nombres de archivo en `imagenes/` van en minúsculas: los servidores Linux (Netlify, GitHub Pages) distinguen mayúsculas.

---

## 🌿 Flujo de trabajo

- `master`: versión publicada.
- `develop`: integración de cambios.
- `feat/*`, `fix/*`, `docs/*`, `refactor/*`: ramas de trabajo que se integran con *pull request*.

Los commits siguen *Conventional Commits* con emoji (por ejemplo, `feat: :lipstick: ...`).

---

## 📄 Licencia

Distribuido bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE).
