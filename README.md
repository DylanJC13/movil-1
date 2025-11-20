# Master–Detail PWA (React + Vite + Express)

Aplicación web progresiva que implementa el patrón Master–Detail consumiendo datos en tiempo real desde PostgreSQL (DigitalOcean). La UI está construida con React/Vite y se sirve como PWA; el backend Express expone la API y también entrega los archivos estáticos listos para subir a App Platform.

- **Vista Principal:** landing con CTA hacia el catálogo.
- **Vista Maestro:** listado dinámico de productos leído desde la base.
- **Vista Detalle:** ficha completa del elemento seleccionado (puede cargar por id directo).
- **Formulario de alta:** desde la propia PWA puedes crear productos; se insertan en PostgreSQL vía API.

## Requisitos previos

- Node.js 18+ y npm.
- Base PostgreSQL accesible (incluye script `npm run db:init` para crear tabla `products` + seed).

## Configuración inicial

1. Variables de entorno (servidor):
   ```bash
   cp .env.example .env
   # Ajusta DB_PASSWORD (y demás campos si tu instancia difiere)
   ```
2. Dependencias:
   ```bash
   npm install              # instala servidor y, vía postinstall, /client
   ```
3. Base de datos (crea tabla + datos demo):
   ```bash
   npm run db:init
   ```

## Desarrollo local

```bash
npm run dev
```

El comando levanta:
- API Express en `http://localhost:4000` (`/api/products`, `/api/products/:id`, `/api/health`).
- Vite dev server en `http://localhost:5173` con proxy a `/api`.

## Build y ejecución (producción)

```bash
# Genera la PWA en client/dist
npm run build

# Levanta el servidor Express sirviendo API + estáticos
npm start
```

En producción el backend devuelve automáticamente los archivos compilados (ruta `/`), manteniendo los endpoints REST bajo `/api`.

## Despliegue en DigitalOcean App Platform

1. **Repositorio:** apunta DO App Platform a este repo.
2. **Build Command:** `npm run build`
3. **Run Command:** `npm start`
4. **Variables/Secrets:** agrega las claves del `.env` (PORT opcional, DB_HOST/DB_PORT/DB_DATABASE/DB_USER/DB_PASSWORD/DB_SSL).
5. **Base de datos:** el mismo servicio Node maneja el API y sirve la PWA, por lo que solo necesitas un componente (Web Service) en App Platform.

La app queda lista como PWA: incluye Manifest, Service Worker (via `vite-plugin-pwa`) e iconos, por lo que navegadores compatibles mostrarán “Install App / Add to Home Screen”.

## Estructura relevante

- `server/index.js`: API Express + static serving.
- `scripts/init-db.js`: crea tabla `products` (id, name, category, price, stock, description) y seed inicial cuando está vacía.
- `client/`: Vite + React + `vite-plugin-pwa`.
  - `client/src/pages/`: Main, Master y Detail.
  - `client/src/services/api.js`: cliente fetch configurable (`VITE_API_URL`, o `/api` por defecto).
  - `client/vite.config.js`: configuración PWA + proxy en dev.

## Endpoints

- `GET /api/health`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (body JSON: `name`, `category`, `price`, `stock`, `description?`)

Todos devuelven/consumen JSON. El esquema maestro/detalle reside completamente en la base PostgreSQL.

## Preguntas frecuentes

- **¿Qué es el patrón Master–Detail?**  
  Divide la experiencia en un panel maestro (lista) y un panel de detalle (contenido del elemento elegido). Facilita navegar colecciones grandes y mantiene contexto.

- **Ejemplos reales que lo usan:**  
  Gmail/Outlook (carpetas → correo), Apple Notes/Evernote (lista → nota), Amazon/Mercado Libre (catálogo → ficha), Microsoft To Do/Todoist (listas → tarea).

- **¿Cómo acceder a funcionalidades nativas como GPS?**  
  En entornos web/PWA se usan APIs del navegador (`navigator.geolocation`). Si migras a una app nativa (React Native/MAUI/etc.) necesitas exponer módulos nativos (Swift/Kotlin) o usar plugins como `expo-location`.

- **¿Qué componente usar para lógica nativa sin compartir código?**  
  En una app nativa se crea un **Native Module** (Android: `ReactPackage`, iOS: `RCT_EXPORT_MODULE`). En web puro tendrías que exponer endpoints o usar Web APIs específicas.

- **¿Cuántas tablas mínimas requiere un proceso maestro–detalle de facturación?**  
  Dos: tabla `facturas` (maestro) y tabla `lineas_factura` (detalle) relacionadas por la clave de la factura. Desde allí puedes sumar catálogos (clientes/productos) según la necesidad.
