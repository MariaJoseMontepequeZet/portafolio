# Despliegue del portafolio en el servidor

El portafolio se publica en **https://portafoliomariajosemontepequezet.pamcing.me** con el mismo servidor y el mismo método que MarisolliFlix. El enlace es siempre el mismo y el sitio se actualiza solo cada vez que algo se integra en `main`.

```
merge a main ──▶ GitHub Actions ──▶ runner propio en el servidor
                                        │
                                        ▼
                     rsync a ~/marisolliflix/portafolio
                                        │
                                        ▼
                  Caddy (contenedor web) sirve la carpeta
                                        │
                                        ▼
              Cloudflare (HTTPS y caché) ──▶ el visitante
```

El portafolio es estático: no tiene API ni base de datos, así que no hay nada que reconstruir. Caddy sirve los archivos tal como llegan.

## Configuración única (se hace una sola vez)

### 1. Pasar la rama principal a `main`

El workflow escucha `main`, igual que MarisolliFlix.

1. En GitHub, abre el repositorio `portafolio` → **Settings → General → Default branch**.
2. Pulsa el lápiz, renombra `master` por `main` y confirma. GitHub redirige los enlaces y los pull requests abiertos.
3. En tu computadora:

```bash
git fetch origin
git branch -m master main
git branch -u origin/main main
git remote set-head origin -a
```

A partir de ahí: las ramas de trabajo van a `develop` por pull request, y de `develop` a `main` al cerrar cada entrega. El merge a `main` despliega.

### 2. Registrar un runner para este repositorio

Un runner registrado para un repositorio no sirve a otro, así que el portafolio necesita el suyo. Puede vivir en el mismo servidor, en otra carpeta.

1. En GitHub: repositorio `portafolio` → **Settings → Actions → Runners → New self-hosted runner** → Linux.
2. GitHub muestra los comandos con un token. En el servidor, con el **mismo usuario** que usa el runner de MarisolliFlix (así `~` es la misma carpeta):

```bash
mkdir ~/actions-runner-portafolio && cd ~/actions-runner-portafolio
# copia aquí los comandos de descarga y extracción que muestra GitHub, luego:
./config.sh --url https://github.com/MariaJoseMontepequeZet/portafolio \
            --token <TOKEN_QUE_MUESTRA_GITHUB> \
            --labels portafolio --name portafolio-servidor
sudo ./svc.sh install
sudo ./svc.sh start
```

La etiqueta `portafolio` debe coincidir con `runs-on: [self-hosted, portafolio]` del workflow. El token caduca en una hora y no se guarda en el repositorio.

### 3. Crear la carpeta del sitio

```bash
mkdir -p ~/marisolliflix/portafolio
```

### 4. Agregar el sitio a Caddy

Edita en `~/marisolliflix` el `docker-compose.yml` y el Caddyfile. Ajusta los nombres a los que ya uses en el servicio `web`.

En `docker-compose.yml`, dentro del servicio `web`, agrega el volumen:

```yaml
    volumes:
      - ./portafolio:/srv/portafolio:ro
```

En el Caddyfile, agrega un bloque de sitio:

```caddyfile
portafoliomariajosemontepequezet.pamcing.me {
    root * /srv/portafolio
    encode zstd gzip
    file_server

    header {
        Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }
}
```

La política permite Google Fonts, porque el portafolio usa Inter y Space Grotesk desde ahí. Si algún día las fuentes se sirven desde el propio sitio, se pueden quitar `https://fonts.googleapis.com` y `https://fonts.gstatic.com`.

Si tu Caddy ya está detrás de Cloudflare con otro formato (por ejemplo `:80` o un túnel), copia el estilo del bloque de MarisolliFlix y cambia solo el dominio, la carpeta y la CSP.

Aplica el cambio:

```bash
cd ~/marisolliflix
docker compose up -d web
docker compose exec web caddy reload --config /etc/caddy/Caddyfile
```

### 5. Cloudflare

Crea el subdominio igual que el de MarisolliFlix: un registro `CNAME` o `A` para `portafoliomariajosemontepequezet`, apuntando al mismo destino que `marisolliflix`, con el proxy activado (nube naranja). Si usas un túnel de Cloudflare, agrega el nombre de host público con el mismo servicio de destino.

### 6. Primer despliegue

1. Integra los cambios en `main` (pull request de `develop` a `main`), o corre el workflow a mano: **Actions → Desplegar en el servidor → Run workflow**.
2. Abre la pestaña **Actions** y espera a que los dos pasos salgan en verde.
3. Entra a https://portafoliomariajosemontepequezet.pamcing.me y comprueba:
   - se ven los estilos y las fuentes,
   - el tema claro/oscuro y el cambio de idioma funcionan,
   - el botón «Descargar CV» baja el PDF,
   - la consola del navegador no muestra errores de CSP.

## Cada vez que cambies algo

1. Trabaja en una rama (`feat/...`, `fix/...`) y abre un pull request a `develop`.
2. Cuando `develop` esté listo, abre un pull request de `develop` a `main`.
3. Al hacer el merge, el sitio se actualiza solo. No hay que tocar el servidor.

## Si algo falla

| Síntoma | Qué revisar |
|---|---|
| El workflow queda en «Waiting for a runner» | El runner no está encendido o su etiqueta no es `portafolio`: en el servidor, `sudo ./svc.sh status` dentro de `~/actions-runner-portafolio`. |
| El paso «Copiar» falla por permisos | La carpeta `~/marisolliflix/portafolio` debe pertenecer al mismo usuario que corre el runner. |
| El paso «Comprobar» falla | El dominio aún no apunta al servidor, o Caddy no tiene el bloque nuevo: revisa el paso 4 y el DNS. |
| Se ve el sitio sin fuentes o sin estilos | La CSP del Caddyfile bloquea algo: abre la consola del navegador y permite el recurso que mencione. |
| Se ve la versión anterior | Caché de Cloudflare: **Caching → Purge Cache** o *Purge Everything*. |
