# App Master–Detail (React Native + Expo)

Aplicación móvil multiplataforma que implementa navegación Master–Detail con tres pantallas y datos servidos desde PostgreSQL (sin información quemada):

- **Vista Principal:** entrada con título y botón para ir al Maestro.
- **Vista Maestro:** lista dinámica de productos traída vía API REST.
- **Vista Detalle:** ficha del producto seleccionado (consulta por id si no recibe el objeto).

## Requisitos previos

- Node.js 18+ y npm.
- Expo CLI (`npm install -g expo-cli`, opcional pero útil).

## Ejecutar la app

```bash
npm install
# Inicia el servidor y elige plataforma:
npm run start        # abre menú Expo
npm run android      # lanza app en emulador/dispositivo Android
npm run ios          # iOS (requiere Mac + simulador)
npm run web          # versión web
```

### Configurar base de datos (PostgreSQL)

1. Copia el entorno y rellena la URL de la base (no subas tu `.env` al repo):
   ```bash
   cp .env.example .env
   # edita DATABASE_URL con tu contraseña real:
   # postgresql://doadmin:<PASSWORD>@movil-2-do-user-28304087-0.i.db.ondigitalocean.com:25060/defaultdb?sslmode=require
   ```
2. Crear tabla y datos seed:
   ```bash
   npm run db:init
   ```
3. Levantar la API REST (Express + pg):
   ```bash
   npm run api   # http://localhost:4000
   ```
4. En `.env`, ajusta `EXPO_PUBLIC_API_URL` para que el cliente acceda a la API:
   - Emulador: `http://localhost:4000`
   - Dispositivo real en la misma red: `http://<TU_IP_LOCAL>:4000`

### PWA lista para usar

- La carpeta `public/` incluye `manifest.json`, icono y favicon.
- Corre `npm run web` y abre `http://localhost:8081` (Expo Web). En el navegador verás el prompt “Install App”/“Add to Home Screen” (según navegador).
- Para generar estático listo para deploy, ejecuta:  
  ```bash
  npm run web:build   # genera web-build con manifest y service worker
  ```

## Estructura relevante

- `App.js`: configura el Stack Navigator y rutas.
- `src/screens/MainPage.js`: Vista Principal.
- `src/screens/MasterPage.js`: Vista Maestro que consume `/products` desde la API.
- `src/screens/DetailPage.js`: Vista Detalle; si no recibe el objeto, consulta `/products/:id`.
- `server/index.js`: API REST (Express + PostgreSQL).
- `scripts/init-db.js`: crea tabla `products` y seed inicial.
- `.env.example`: plantilla de variables (`DATABASE_URL`, `EXPO_PUBLIC_API_URL`).

## Explicación del patrón Master–Detail

Separa la experiencia en dos zonas: **Maestro** (lista o panel) y **Detalle** (contenido del elemento seleccionado). El usuario explora en el Maestro y, al elegir un ítem, se muestra su información completa en el Detalle. En móviles suele representarse como navegación jerárquica (Stack: Lista → Detalle). En tablets/escritorio puede verse en paralelo (split view). Beneficios: claridad de jerarquía, reutilización de la lista, y navegación consistente.

## Ejemplos reales que usan Master–Detail

- Aplicaciones de correo (Gmail, Outlook): lista de correos → detalle del correo.
- Apps de notas (Evernote, Apple Notes): lista de notas → nota seleccionada.
- Apps de tareas (Microsoft To Do, Todoist): lista de tareas → detalle/edición de tarea.
- Apps de tienda (Amazon, Mercado Libre): listado de productos → ficha de producto.

## Preguntas frecuentes

- **¿Qué clase o mecanismo se usa para acceder a funcionalidades nativas como GPS?**  
  En React Native se usan **Native Modules** expuestos a JavaScript. En Expo, la opción directa es el paquete `expo-location` (API `Location`). En un proyecto bare se usa `@react-native-community/geolocation` o se implementa un módulo nativo propio expuesto con `NativeModules`.

- **¿Qué componente usar si necesito ejecutar lógica nativa sin compartir código?**  
  Crea un **módulo nativo** (Android: clase Java/Kotlin con anotaciones ReactPackage; iOS: Objective-C/Swift con `RCT_EXPORT_MODULE`). Luego se expone vía `NativeModules` o un TurboModule para consumirlo desde JS.

- **¿Cuántas tablas mínimas se requieren en un proceso de facturación para implementar maestro–detalle?**  
  Mínimo dos: una tabla **Factura (Maestra)** con el encabezado (cliente, fecha, total, estado) y una tabla **Detalle de líneas** con cada concepto (producto/servicio, cantidad, precio, impuestos) relacionada por la clave de la factura. Opcionalmente se añade una tabla de **Clientes** y de **Productos**, pero el esquema maestro–detalle se cumple con esas dos.
