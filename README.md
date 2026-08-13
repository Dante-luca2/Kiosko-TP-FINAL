# Kiosko TP Final

Trabajo Práctico — Introducción al Desarrollo de Software.

## Descripción

Herramienta de uso interno para el dueño de un kiosco, pensada para llevar el control de su stock, sus empleados y su plata sin necesidad de un sistema contable complejo. No es una tienda online: el dueño o sus empleados cargan manualmente lo que va pasando en el local (ventas en persona, reposiciones de stock, correcciones de inventario) y la aplicación calcula sola, a partir de eso, cuánto stock queda de cada producto, cuándo hay que reponer y qué pasó con cada movimiento.

El proyecto modela un proceso real con reglas de negocio concretas — no es solo un CRUD de tablas:

- El **tipo** de un producto (`normal` / `limitado` / `estacional`) define cuándo se avisa que hay que reponerlo.
- Ninguna venta ni ajuste negativo puede dejar el stock de un producto por debajo de cero.
- Venta, Compra y Ajuste son **registros de auditoría**: no se editan una vez cargados (para corregir un error se carga un movimiento nuevo, nunca se modifica el original), y al eliminarlos se revierte automáticamente su efecto sobre el stock.
- Producto, Proveedor y Empleados usan **baja lógica**: al eliminarlos no desaparecen de la base, se marcan `activo: false` para conservar su historial de movimientos.

## Integrantes

- Dante Luca Ortega
- Tomas Valentin Muruchi
- German Barrionuevo


## Uso de Inteligencia Artificial

Durante el desarrollo se usaron asistentes de IA (Claude, y asistentes de código integrados al editor) como apoyo para: redactar y mantener actualizado `APICONTRACT.md`, generar documentación (este README, el README de `db/`), y para debuggear puntualmente errores de integración entre frontend y backend (por ejemplo, imports rotos por rutas de archivos mal ubicadas). El código resultante fue revisado y es comprendido por el equipo — cualquier integrante puede explicar, modificar y debuggear cualquier parte del proyecto.

## Entidades de la base de datos

| Entidad | Baja | Descripción |
|---|---|---|
| Categoría | física | Organiza el catálogo de productos. Guarda qué empleado la creó. |
| Proveedor | lógica | A quién se le compra mercadería. |
| Empleados | lógica | Quién trabaja en el kiosco (incluye al dueño). |
| Producto | lógica | Lo que se vende, con su stock y umbral de reposición. |
| Venta | auditoría (sin `PUT`) | Un producto que salió del local por venta. Descuenta stock. |
| Compra | auditoría (sin `PUT`) | Reposición de stock comprada a un proveedor. Suma stock. |
| Ajuste | auditoría (sin `PUT`) | Corrección manual de stock (rotura, pérdida, recuento), con motivo obligatorio. |

Relaciones (todas por foreign key):

- Categoría 1—N Producto (`producto.categoria_id`, `ON DELETE SET NULL`).
- Proveedor 1—N Compra (`compra.proveedor_id`, `ON DELETE SET NULL`).
- Empleados 1—N Venta / Compra / Ajuste / Categoría (`ON DELETE RESTRICT`).
- Producto 1—N Venta / Compra / Ajuste (`ON DELETE RESTRICT`).

El detalle completo de campos por entidad está en [`db/README.md`](./db/README.md), y el contrato completo de cada endpoint (query params, body, respuestas) en [`APICONTRACT.md`](./APICONTRACT.md).

## Páginas del frontend (CSR contra el backend)

- **Productos**: listado con stock y alertas de reposición, filtro por marca/tipo/categoría, alta/edición/baja lógica.
- **Categorías**: alta/edición/baja de categorías.
- **Proveedores**: listado, alta/edición/baja lógica.
- **Empleados**: listado, alta/edición/baja lógica.
- **Movimientos → Compras**: registrar una reposición de stock, asociada a producto, proveedor y empleado.
- **Movimientos → Ventas**: registrar una venta, con descuento opcional.
- **Movimientos → Ajustes**: registrar una corrección de stock con motivo obligatorio.

## Tecnologías

- **Frontend**: HTML, CSS y JavaScript plano (sin frameworks), consumiendo la API vía `axios`.
- **Backend**: Node.js + Express 5, con `cors`, `dotenv` y `multer` (subida de imágenes de producto).
- **Base de datos**: PostgreSQL, acceso directo con `pg` (sin ORM).
- **Contenedores**: Docker + Docker Compose (servicios separados para frontend, backend y base de datos).

Más detalle de la implementación del backend en [`Backend/README.md`](./Backend/README.md).

## Cómo levantar el proyecto

### Con Docker Compose (recomendado)

1. Clonar el repositorio.
2. Copiar `.env.example` a `.env` en la raíz del proyecto, y `Backend/.env.example` a `Backend/.env`, completando los valores (`DB_USER`, `DB_PASSWORD` y `DB_NAME` deben coincidir entre ambos archivos).
3. Desde la raíz del proyecto:
   ```bash
   docker compose up --build
   ```
4. Acceder a:
   - Frontend: `http://localhost:8080`
   - Backend (API): `http://localhost:3000`
   - Healthcheck del backend: `http://localhost:3000/health`

Cada servicio también se puede levantar por separado, por ejemplo:
```bash
docker compose up backend
docker compose up frontend
```

### Sin Docker (desarrollo local)

Necesita una instancia de PostgreSQL propia corriendo (con la base creada a partir de `db/init.sql`) y sus credenciales en `Backend/.env` (usando `DB_HOST=localhost`).

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

## Estructura del proyecto

```
Kiosko-TP-FINAL/
├── Backend/
│   ├── src/            # rutas, queries a la base y middlewares
│   ├── package.json
│   ├── dockerfile
│   └── .env.example
├── Frontend/
│   ├── src/
│   │   ├── paginas/     # una carpeta por página (productos, categorias, proveedores, empleados, compras, ventas, ajustes)
│   │   ├── servicios/   # un archivo por entidad, llamadas a la API vía axios
│   │   └── componentes/ # barra lateral compartida entre páginas
│   ├── estilos.css
│   └── dockerfile
├── db/
│   ├── init.sql         # esquema + datos de prueba
│   └── README.md        # detalle de entidades y reglas de negocio
├── APICONTRACT.md        # contrato de cada endpoint de la API
├── docker-compose.yml
├── .env.example
└── README.md
```

## Capturas de pantalla

_Pendiente: agregar capturas de cada página (Productos, Categorías, Proveedores, Empleados, Compras, Ventas, Ajustes) con datos cargados, antes de la entrega._