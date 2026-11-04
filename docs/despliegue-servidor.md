# Despliegue del portafolio en el servidor

El portafolio se publica con el mismo método automático que MarisolliFlix: cada vez que algo se integra en `main`, el sitio se actualiza solo. El enlace es siempre el mismo.

```
merge a main ──▶ GitHub Actions ──▶ runner propio en el servidor
                                        │
                                        ▼
                     rsync a ~/portafolio/sitio
                                        │
                                        ▼
          contenedor nginx «portafolio-web» (puerto 5000)
                                        │
                                        ▼
           Cloudflare (dominio, HTTPS y caché) ──▶ el visitante
```

El portafolio es estático: no tiene API ni base de datos, así que no hay nada que reconstruir. El contenedor nginx ya existente (`~/portafolio/docker-compose.yml`) monta la carpeta `sitio` en modo lectura y sirve lo que haya dentro; el workflow solo actualiza esa carpeta.

## Configuración única (se hace una sola vez)

### 1. Pasar la rama principal a `main`

1. En GitHub: repositorio `portafolio` → **Settings → General → Default branch** → renombrar `master` por `main`.
2. En tu computadora:

```bash
git fetch origin
git branch -m master main
git branch -u origin/main main
git remote set-head origin -a
```

Desde ahí: las ramas de trabajo van a `develop` por pull request, y de `develop` a `main` al cerrar cada entrega. El merge a `main` despliega.

### 2. Registrar un runner para este repositorio

Un runner registrado para un repositorio no sirve a otro, así que el portafolio tiene el suyo, en `~/actions-runner-portafolio`, con la etiqueta `portafolio` (debe coincidir con `runs-on: [self-hosted, portafolio]` del workflow).

1. GitHub → `portafolio` → **Settings → Actions → Runners → New self-hosted runner** → Linux.
2. En el servidor, dentro de `~/actions-runner-portafolio`: descarga y descomprime el runner, luego:

```bash
./config.sh --url https://github.com/MariaJoseMontepequeZet/portafolio \
            --token <TOKEN_QUE_MUESTRA_GITHUB> \
            --labels portafolio --name portafolio-servidor
sudo ./svc.sh install
sudo ./svc.sh start
sudo ./svc.sh status
```

3. Comprueba que en GitHub aparezca como **Idle**.

El token caduca en una hora, sirve una sola vez y no se comparte ni se guarda en el repositorio.

### 3. Vaciar la carpeta del sitio

La carpeta `~/portafolio/sitio` era un clon manual del repositorio. Se deja vacía para que el workflow sea quien la llene:

```bash
find ~/portafolio/sitio -mindepth 1 -delete
ls -la ~/portafolio/sitio
```

No hace falta tocar `docker-compose.yml` ni reiniciar el contenedor: nginx sirve lo que haya en la carpeta.

### 4. Primer despliegue

1. Integra los cambios en `main` (pull request de `develop` a `main`), o corre el workflow a mano: **Actions → Desplegar en el servidor → Run workflow**.
2. En la pestaña **Actions**, espera a que los dos pasos salgan en verde.
3. Abre el sitio con el enlace de siempre y comprueba:
   - se ven los estilos y las fuentes,
   - el tema claro/oscuro y el cambio de idioma funcionan,
   - el botón «Descargar CV» baja el PDF.

## Cada vez que cambies algo

1. Trabaja en una rama (`feat/...`, `fix/...`) y abre un pull request a `develop`.
2. Cuando `develop` esté listo, abre un pull request de `develop` a `main`.
3. Al hacer el merge, el sitio se actualiza solo. No hay que tocar el servidor.

Los cambios en `docker-compose.yml` o en la configuración de nginx **no** son automáticos.

## Si algo falla

| Síntoma | Qué revisar |
|---|---|
| El workflow queda en «Waiting for a runner» | El runner no está encendido o su etiqueta no es `portafolio`: en `~/actions-runner-portafolio`, `sudo ./svc.sh status`. |
| El paso «Copiar» falla por permisos | `~/portafolio/sitio` debe pertenecer al usuario que corre el runner (`pablo`). |
| El paso «Comprobar» falla | El contenedor `portafolio-web` no está corriendo: `docker ps` y, si hace falta, `cd ~/portafolio && docker compose up -d`. |
| Se ve la versión anterior | Caché de Cloudflare: **Caching → Purge Cache**. |
