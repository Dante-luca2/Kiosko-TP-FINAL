# Kiosco — Sistema de gestión de inventario y caja


## Descripción

Herramienta de uso interno para el dueño de un kiosco, pensada como ayuda para llevar el control de su stock y su plata sin necesidad de un sistema contable complejo. No es una tienda online: el dueño carga manualmente lo que va pasando en el local (ventas en persona, reposiciones de stock, regalos) y la aplicación calcula solo, a partir de eso, cuánto stock queda de cada producto, cuándo hay que reponer, y cuánta plata debería tener en base a lo registrado.

## Entidades de la base de datos

### Producto

| Campo | Tipo | Descripción |
|---|---|---|
| nombre | string | Nombre del producto. |
| precio | int | Precio de venta actual (precio de catálogo, no el efectivamente cobrado en cada venta). |
| cantidad_actual | int | Stock disponible en este momento. |
| tipo | string (normal / limitado / estacional) | Define cómo se comporta la alerta de reposición. |
| stock_minimo | int | Umbral a partir del cual se avisa que hay que reponer (aplica a productos normales). |
| imagen_url | string | Imagen opcional del producto. |

### Proveedor

| Campo | Tipo | Descripción |
|---|---|---|
| nombre | string | Nombre o razón social del proveedor. |
| contacto | string | Persona de contacto. |
| telefono | string | Teléfono de contacto. |
| rubro | string | Qué tipo de productos provee (bebidas, golosinas, cigarrillos, etc.). |
| direccion | string | Dirección o zona de reparto. |

### Movimiento

| Campo | Tipo | Descripción |
|---|---|---|
| producto_id | FK → Producto | Producto afectado por el movimiento. |
| proveedor_id | FK → Proveedor (nullable) | Proveedor de origen; solo aplica cuando tipo = compra. |
| tipo | string (venta / compra / regalo / ajuste) | Determina cómo se calculan stock y caja. |
| cantidad | int | Unidades que entran o salen de stock. |
| precio_unitario | int | Precio real al que se vendió o compró esa unidad (puede diferir del precio de catálogo). |
| descuento | int | Descuento aplicado sobre el precio de catálogo, si lo hubo. |
| fecha | datetime | Momento en que se registró el movimiento. |

## Relaciones

- **Producto 1—N Movimiento**: un producto puede tener muchos movimientos asociados (cada venta, compra, regalo o ajuste que lo involucre). Si un producto tiene movimientos, no se puede eliminar (`ON DELETE RESTRICT`), para no perder historial.
- **Proveedor 1—N Movimiento**: un proveedor puede aparecer en muchos movimientos de tipo compra (los que no son compra dejan este campo vacío). Si se elimina un proveedor, sus movimientos pasados quedan en el historial sin proveedor asociado (`ON DELETE SET NULL`).

## Reglas de negocio

- No se puede registrar una venta o un regalo por más cantidad de la que hay en stock (`cantidad_actual` del producto).
- El tipo del producto define cuándo se dispara el aviso de reposición:
  - **normal**: avisa cuando `cantidad_actual ≤ stock_minimo`.
  - **limitado**: si se agota, avisa que se agotó, pero no insiste en que hay que reponer.
  - **estacional**: solo avisa reponer en fechas particulares (ej. productos navideños).
- La plata hipotética del kiosco no es un campo fijo: se calcula sumando el efecto de todos los movimientos (venta suma, compra resta, regalo no mueve la plata, ajuste se define caso a caso).
- El `precio_unitario` de un movimiento puede ser menor al precio de catálogo del producto si hubo descuento, sin alterar el precio oficial guardado en Producto.
- Cada compra puede asociarse a un proveedor, para saber después a quién comprarle de nuevo o comparar precios entre proveedores.

## Páginas del frontend (CSR contra el backend)

- **Productos**: listado con stock actual, alertas de reposición, alta/edición/baja.
- **Movimientos / Historial**: registrar ventas, compras, regalos y ajustes; ver el historial completo.
- **Proveedores**: alta/edición/baja de proveedores.

## Tecnologías

- **Frontend**: HTML, CSS y JavaScript plano (sin frameworks), consumiendo la API vía `fetch`.
- **Backend**: Node.js + Express, con `cors` y `dotenv`.
- **Base de datos**: PostgreSQL.
- **Contenedores**: Docker + Docker Compose (servicios separados para frontend, backend y base de datos).

## Estructura del proyecto

```
Kiosko-TP-FINAL/
├── Backend/
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
├── Frontend/
│   ├── index.html
│   ├── styles.css
│   ├── *.js
│   └── Dockerfile
├── db/
│   └── init.sql
├── docker-compose.yml
├── .env.example
└── README.md
```

## Cómo levantar el proyecto

### Con Docker Compose (recomendado)

1. Clonar el repositorio.
2. Copiar `.env.example` a `.env` en la raíz del proyecto, y `Backend/.env.example` a `Backend/.env`, completando los valores (deben coincidir entre ambos archivos en `DB_USER`, `DB_PASSWORD` y `DB_NAME`).
3. Desde la raíz del proyecto, ejecutar:
   ```bash
   docker compose up --build
   ```
4. Acceder a:
   - Frontend: `http://localhost:8080`
   - Backend (API): `http://localhost:3000`

También se puede levantar cada servicio por separado, por ejemplo:
```bash
docker compose up backend
docker compose up frontend
```

### Sin Docker (desarrollo local)

**Backend:**
```bash
cd Backend
npm install
npm run dev
```

**Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

En este caso se necesita una instancia de PostgreSQL corriendo localmente, con las credenciales configuradas en `Backend/.env` (usando `DB_HOST=localhost`).

## Capturas de pantalla

_Pendiente: agregar capturas del sitio funcionando una vez completado el desarrollo del frontend y backend._

## Integrantes

- Nombre Apellido
- Nombre Apellido
- Nombre Apellido

