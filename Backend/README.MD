# Backend — Kiosko TP Final

API REST para la gestión interna de un kiosco: stock de productos, proveedores, empleados, categorías y los tres tipos de movimiento que afectan el inventario (ventas, compras y ajustes). No es una tienda online — la carga la hace el dueño o sus empleados a medida que pasan cosas en el local, y el backend se encarga de mantener el stock sincronizado a partir de esos movimientos.

## Stack

- **Node.js + Express 5** — framework HTTP, define las rutas de la API.
- **PostgreSQL** (vía `pg`, sin ORM) — todas las queries son SQL crudo con parámetros (`$1`, `$2`, ...).
- **multer** — middleware para subir imágenes de producto (`multipart/form-data`).
- **cors** — habilita que el frontend (en otro puerto/origen) pueda llamar a la API.
- **dotenv** — carga variables de entorno desde `.env`.
- **nodemon** (solo dev) — reinicia el servidor al detectar cambios.

## Estructura

```
Backend/
├── src/
│   ├── index.js              # arranque del server, healthcheck, monta /api y /uploads
│   ├── db/
│   │   ├── pool.js           # instancia del pool de conexión a PostgreSQL
│   │   └── queries/          # una función por entidad: getAll, getById, create, update, softDelete/remove
│   ├── routes/                # un router por entidad: valida input, llama a queries/, arma la respuesta HTTP
│   └── middlewares/
│       └── upload.js          # configuración de multer (destino, filtro de tipo, límite de tamaño)
├── uploads/                    # imágenes de producto ya subidas (servidas como estáticos)
├── .env.example
├── dockerfile
├── nodemon.json
└── package.json
```

No hay capa de "controllers" separada: cada archivo en `routes/` cumple ese rol — recibe el `req`, valida, llama a la función correspondiente de `db/queries/` y devuelve la respuesta. `db/queries/` es la única capa que le habla a la base de datos.

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

| Variable | Descripción |
|---|---|
| `DB_HOST` | Host de PostgreSQL (`localhost` en local, el nombre del servicio si es Docker Compose). |
| `DB_PORT` | Puerto de PostgreSQL (`5432` por defecto). |
| `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Credenciales y nombre de la base. Deben coincidir con las que se usaron para crear la base (`db/init.sql`). |
| `PORT` | Puerto donde escucha el backend (`3000` por defecto). |

## Cómo correrlo

**Sin Docker** (necesita una instancia de PostgreSQL corriendo local con la base ya creada a partir de `db/init.sql`):

```bash
cd Backend
npm install
npm run dev      # con nodemon, recarga en caliente
# o
npm start        # producción, node plano
```

**Con Docker Compose**, desde la raíz del repo: `docker compose up --build`. Ver el `README.md` de la raíz para el detalle completo.

## Healthcheck

`GET /health` — no está bajo `/api`. Hace `SELECT 1` contra la base y devuelve si el backend y la conexión a PostgreSQL están vivos:

```json
{ "status": "ok", "db": "connected" }
```

Útil para probar rápido si el problema es el backend o la base, sin tener que pegarle a un endpoint de negocio.

## Convenciones generales de la API

- Todo cuelga de `/api` (`/api/productos`, `/api/proveedores`, etc.), definido centralmente en `src/routes/index.js`.
- Formato de error estándar en cualquier validación fallida:
  ```json
  { "error": "descripción del problema" }
  ```
  `400` para errores de validación (falta un campo, stock insuficiente, etc.), `404` si el recurso no existe, `500` si algo inesperado explota (error de conexión, bug).
- Todos los montos (`precio`, `precio_unitario`, `descuento`, `sueldo`) son **enteros** — coincide con el tipo de columna en PostgreSQL (pesos, sin decimales).
- **Producto, Proveedor y Empleados** usan baja lógica: `DELETE` no borra la fila, marca `activo = false`. Así conservan su historial de movimientos asociados.
- **Venta, Compra y Ajuste** son registros de auditoría: no tienen `PUT` (para corregir un error se carga un movimiento nuevo, nunca se edita el original). Si tienen `DELETE`, que antes de borrar revierte el efecto que ese movimiento tuvo sobre el `stock` del producto.
- **Categoría** no tiene `DELETE` lógico: se borra físicamente, y por el `ON DELETE SET NULL` de la foreign key, los productos que la usaban quedan con `categoria_id: null` en vez de bloquear el borrado.
- No hay autenticación ni autorización — es una herramienta interna de un solo local, se asume que solo el dueño/empleados con acceso al sistema lo usan. No hay control de quién puede hacer qué más allá de registrar el `empleado_id` como dato de auditoría en cada movimiento.

El contrato completo de cada endpoint (query params, body, response) está en `APICONTRACT.md` en la raíz del repo — este README no lo repite entero, resume el porqué de las reglas y cómo está implementado.

## Modelo de datos

Orden de creación en `db/init.sql`: `categoria`, `proveedor` y `empleados` primero (no dependen de nadie) → `producto` (depende de `categoria`) → `venta`/`compra`/`ajuste` al final (dependen de `producto`, `proveedor` y `empleados`).

| Tabla | Baja | Foreign keys | Notas |
|---|---|---|---|
| `proveedor` | lógica (`activo`) | — | |
| `empleados` | lógica (`activo`) | — | `dni` y `correo` son `UNIQUE`. |
| `categoria` | física (sin lógica) | `empleado_id → empleados` (`RESTRICT`) | `nombre` es `UNIQUE`; `empleado_id` es de auditoría, no se puede editar. |
| `producto` | lógica (`activo`) | `categoria_id → categoria` (`SET NULL`) | `CHECK` de `precio >= 0`, `stock >= 0`, `tipo IN ('normal','limitado','estacional')`. |
| `venta` | — (no tiene `activo`) | `producto_id → producto` (`RESTRICT`), `empleado_id → empleados` (`RESTRICT`) | `CHECK cantidad > 0`. |
| `compra` | — | `producto_id → producto` (`RESTRICT`), `proveedor_id → proveedor` (`SET NULL`), `empleado_id → empleados` (`RESTRICT`) | `proveedor_id` es nullable a propósito. |
| `ajuste` | — | `producto_id → producto` (`RESTRICT`), `empleado_id → empleados` (`RESTRICT`) | `CHECK cantidad <> 0`; `motivo` obligatorio. |

`RESTRICT` en `producto`/`empleados` desde los movimientos existe para que nunca se pueda borrar físicamente un producto o empleado que ya tiene historial — coherente con que esas dos entidades usan baja lógica en vez de `DELETE` real.

## Efecto de cada movimiento sobre el stock

Esto pasa dentro de la query de `create`/`remove` de cada uno (no es responsabilidad de la ruta, la ruta solo valida antes de llamar):

| Movimiento | Al crear | Al eliminar |
|---|---|---|
| Venta | `stock = stock - cantidad` | `stock = stock + cantidad` (se revierte) |
| Compra | `stock = stock + cantidad` | `stock = stock - cantidad` (se revierte) |
| Ajuste | `stock = stock + cantidad` (cantidad puede ser negativa) | `stock = stock - cantidad` (se revierte) |

Antes de crear una Venta o un Ajuste negativo, la ruta valida que `producto.stock` alcance; antes de eliminar una Compra o un Ajuste, valida que revertirlo no deje el stock en negativo.

**Importante:** el `INSERT`/`DELETE` del movimiento y el `UPDATE` del stock son dos queries separadas (no están envueltas en una transacción `BEGIN`/`COMMIT`). Si la segunda falla después de que la primera ya se ejecutó, el stock puede quedar desincronizado del historial. Es una limitación conocida, no una decisión de diseño — ver sección de mejoras.

## Subida de imágenes (`middlewares/upload.js`)

- Usa `multer` con `diskStorage`: guarda el archivo en `Backend/uploads/`, con nombre `timestamp-random.extension` para evitar colisiones.
- `fileFilter` solo acepta `image/jpeg`, `image/png`, `image/webp`, `image/gif` — cualquier otro mimetype es rechazado antes de guardarse.
- Límite de tamaño: 5 MB (`limits.fileSize`).
- Se aplica como `upload.single('imagen')` en `POST` y `PUT` de `/api/productos` — el campo del formulario tiene que llamarse `imagen`.
- Las imágenes se sirven como estáticos desde `/uploads/...` (montado en `index.js` con `express.static`), y la URL relativa (`/uploads/archivo.jpg`) es lo que se guarda en `producto.imagen_url`.

## Manejo de errores

No hay un error-handling middleware centralizado: cada ruta tiene su propio `try/catch` y arma su propio mensaje de error y status code. Express 5 reenviaría automáticamente una excepción no capturada de un handler `async` a un manejador de errores por defecto, pero acá se captura manualmente en cada ruta para poder devolver mensajes específicos (`"Producto no encontrado"`, `"Stock insuficiente"`, etc.) en vez de un error genérico.

## Seguridad — estado actual

- Las queries usan parámetros (`$1`, `$2`, ...) en vez de concatenar strings, lo que evita inyección SQL.
- `cors()` está configurado sin restricciones (acepta cualquier origen) — aceptable para un TP/uso interno, no para producción real.
- No hay autenticación, autorización, ni rate limiting.
- Los archivos subidos se validan por `mimetype` declarado por el cliente (no por contenido real del archivo), y el límite de tamaño es a nivel de multer.

## Limitaciones conocidas / posibles mejoras

- Las operaciones que tocan dos tablas (movimiento + stock del producto) no usan transacciones — riesgo de inconsistencia si la segunda query falla.
- No hay manejo de concurrencia: dos ventas simultáneas del mismo producto podrían, en teoría, pisarse (no hay locking explícito tipo `SELECT ... FOR UPDATE`).
- No hay tests automatizados (`npm test` es un placeholder).
- No hay logging estructurado, solo `console.error`.
