# CONTRATO API

## Notas generales

- Todos los endpoints cuelgan del prefijo `/api`.
- **Venta, Compra y Ajuste son registros de auditoría**: no se editan (no tienen `PUT`; para corregir un error se carga un nuevo movimiento, nunca se modifica el original). Sí se pueden eliminar (`DELETE`) — como no tienen baja lógica, el `DELETE` borra la fila físicamente, pero antes revierte su efecto sobre el `stock` del producto para no dejar el inventario desincronizado.
- **Producto, Proveedor y Empleados** usan baja lógica: el `DELETE` no borra la fila, marca `activo: false`.
- **Categoría** no tiene `DELETE`: es una tabla de referencia simple, se gestiona con alta/edición nada más.
- Todos los montos (`precio`, `precio_unitario`, `descuento`, `sueldo`) son **enteros** (pesos, sin decimales) — coincide con el tipo de dato en la base.
- Formato de error estándar para cualquier endpoint que falle una validación:
  ```json
  { "error": "descripción del problema" }
  ```
  Status `400` para validaciones (ej. stock insuficiente, campo obligatorio faltante), `404` si el recurso no existe.

## PRODUCTO

### GET /api/productos

Objetivo: Obtener todos los productos de la tienda, opcionalmente filtrados.

**Query params** (todos opcionales, se pueden combinar):
- `marca` (string): búsqueda parcial por marca (`LIKE %marca%`).
- `tipo` (string: `normal` | `limitado` | `estacional`): filtra por tipo exacto.
- `categoria_id` (int): filtra por categoría exacta.

**Ejemplos**:
- `GET /api/productos` → todos los productos activos.
- `GET /api/productos?marca=coca` → productos cuya marca contenga "coca".
- `GET /api/productos?categoria_id=3&tipo=normal` → combinando dos filtros a la vez.

**Respuesta**:
```json
[
  {
    "id": 1,
    "nombre": "Coca Cola 500ml",
    "descripcion": "Gaseosa cola, botella descartable",
    "marca": "Coca Cola",
    "precio": 1200,
    "stock": 24,
    "categoria_id": 3,
    "tipo": "normal",
    "stock_minimo": 10,
    "imagen_url": "https://miapp.com/img/coca500.png",
    "activo": true
  }
]
```

### GET /api/productos/:id

Objetivo: Obtener un producto de la tienda.

**Respuesta**:
```json
{
  "id": 1,
  "nombre": "Coca Cola 500ml",
  "descripcion": "Gaseosa cola, botella descartable",
  "marca": "Coca Cola",
  "precio": 1200,
  "stock": 24,
  "categoria_id": 3,
  "tipo": "normal",
  "stock_minimo": 10,
  "imagen_url": "https://miapp.com/img/coca500.png",
  "activo": true
}
```

### POST /api/productos

Objetivo: Crear un producto en la tienda.

**Request**:
```json
{
  "nombre": "Coca Cola 500ml",
  "descripcion": "Gaseosa cola, botella descartable",
  "marca": "Coca Cola",
  "precio": 1200,
  "stock": 24,
  "categoria_id": 3,
  "tipo": "normal",
  "stock_minimo": 10,
  "imagen_url": "https://miapp.com/img/coca500.png"
}
```

### PUT /api/productos/:id

Objetivo: Modificar un producto en la tienda.

**Request**: igual al del `POST`.

### DELETE /api/productos/:id

Objetivo: Dar de baja lógica un producto de la tienda (no se borra físicamente, se marca `activo: false`).

**Respuesta**:
```json
{
  "id": 1,
  "nombre": "Coca Cola 500ml",
  "descripcion": "Gaseosa cola, botella descartable",
  "marca": "Coca Cola",
  "precio": 1200,
  "stock": 24,
  "categoria_id": 3,
  "tipo": "normal",
  "stock_minimo": 10,
  "imagen_url": "https://miapp.com/img/coca500.png",
  "activo": false
}
```

## PROVEEDOR

### GET /api/proveedores

Objetivo: Obtener todos los proveedores de la tienda, opcionalmente filtrados.

**Query params** (todos opcionales, se pueden combinar):
- `nombre` (string): búsqueda parcial por nombre (`LIKE %nombre%`).

**Ejemplos**:
- `GET /api/proveedores` → todos los proveedores activos.
- `GET /api/proveedores?nombre=julian` → proveedores cuyo nombre contenga "julian".

**Respuesta**:
```json
[
  {
    "id": 1,
    "nombre": "Julian",
    "contacto": "John Doe",
    "telefono": "123456789",
    "rubro": "Coca Cola",
    "direccion": "Calle 123",
    "activo": true
  }
]
```

### GET /api/proveedores/:id

Objetivo: Obtener un proveedor de la tienda.

**Respuesta**:
```json
{
  "id": 1,
  "nombre": "Julian",
  "contacto": "John Doe",
  "telefono": "123456789",
  "rubro": "Coca Cola",
  "direccion": "Calle 123",
  "activo": true
}
```

### POST /api/proveedores

Objetivo: Crear un proveedor en la tienda.

**Request**:
```json
{
  "nombre": "Julian",
  "contacto": "John Doe",
  "telefono": "123456789",
  "rubro": "Coca Cola",
  "direccion": "Calle 123"
}
```

### PUT /api/proveedores/:id

Objetivo: Modificar un proveedor en la tienda.

**Request**: igual al del `POST`.

### DELETE /api/proveedores/:id

Objetivo: Dar de baja lógica un proveedor de la tienda (no se borra físicamente, se marca `activo: false`).

**Respuesta**: igual al `GET /api/proveedores/:id`, con `"activo": false`.

## VENTAS

_Registro de auditoría: sin `PUT` (no se edita). Tiene `DELETE`, que revierte el efecto en el stock antes de borrar._

### GET /api/ventas

Objetivo: Obtener todas las ventas de la tienda, opcionalmente filtradas.

**Query params** (todos opcionales, se pueden combinar):
- `producto_id` (int): filtra por producto.
- `empleado_id` (int): filtra por empleado que registró la venta.

**Ejemplos**:
- `GET /api/ventas` → todas las ventas.
- `GET /api/ventas?producto_id=1` → solo ventas de ese producto.
- `GET /api/ventas?empleado_id=1` → solo ventas registradas por ese empleado.

El listado viene con `JOIN` contra `producto` y `empleados`, así el frontend no tiene que pedir cada nombre por separado. Los `_id` originales se mantienen (se siguen necesitando para el formulario de alta).

**Respuesta**:
```json
[
  {
    "id": 1,
    "producto_id": 1,
    "producto_nombre": "Coca Cola 500ml",
    "empleado_id": 1,
    "empleado_nombre": "Julián Pérez",
    "cantidad": 1,
    "precio_unitario": 1200,
    "descuento": 0,
    "fecha": "2026-08-02T14:30:00Z"
  }
]
```

### GET /api/ventas/:id

Este endpoint **no** trae los nombres (solo el listado los agrega); devuelve la fila tal cual está en la tabla, para el formulario de edición.

Objetivo: Obtener una venta de la tienda.

**Respuesta**:
```json
{
  "id": 1,
  "producto_id": 1,
  "empleado_id": 1,
  "cantidad": 1,
  "precio_unitario": 1200,
  "descuento": 0,
  "fecha": "2026-08-02T14:30:00Z"
}
```

### POST /api/ventas

Objetivo: Crear una venta en la tienda. Valida que `cantidad` no supere el `stock` actual del producto; si no alcanza, devuelve `400` con el formato de error estándar.

**Request**:
```json
{
  "producto_id": 1,
  "empleado_id": 1,
  "cantidad": 1,
  "precio_unitario": 1200,
  "descuento": 0
}
```

### DELETE /api/ventas/:id

Objetivo: Eliminar una venta. Antes de borrar la fila, le devuelve la `cantidad` al `stock` del producto (`stock = stock + cantidad`).

**Respuesta**:
```json
{
  "id": 1,
  "producto_id": 1,
  "empleado_id": 1,
  "cantidad": 1,
  "precio_unitario": 1200,
  "descuento": 0,
  "fecha": "2026-08-02T14:30:00Z"
}
```

## COMPRAS

_Registro de auditoría: sin `PUT` (no se edita). Tiene `DELETE`, que revierte el efecto en el stock antes de borrar._

### GET /api/compras

Objetivo: Obtener todas las compras de la tienda, opcionalmente filtradas.

**Query params** (todos opcionales, se pueden combinar):
- `producto_id` (int): filtra por producto.
- `proveedor_id` (int): filtra por proveedor.
- `empleado_id` (int): filtra por empleado.

**Ejemplos**:
- `GET /api/compras` → todas las compras.
- `GET /api/compras?producto_id=1` → solo compras de ese producto.
- `GET /api/compras?proveedor_id=1` → solo compras a ese proveedor.
- `GET /api/compras?empleado_id=1` → solo compras registradas por ese empleado.

El listado viene con `JOIN` contra `producto`, `proveedor` y `empleados`, así el frontend no tiene que pedir cada nombre por separado. Los `_id` originales se mantienen (se siguen necesitando para el formulario de alta). El `JOIN` contra `proveedor` es `LEFT JOIN`: si el proveedor de una compra fue borrado, la compra sigue apareciendo en el historial con `proveedor_id: null` y `proveedor_nombre: null` en vez de desaparecer del listado.

**Respuesta**:
```json
[
  {
    "id": 1,
    "producto_id": 1,
    "producto_nombre": "Coca Cola 500ml",
    "proveedor_id": 1,
    "proveedor_nombre": "Distribuidora Norte",
    "empleado_id": 1,
    "empleado_nombre": "Julián Pérez",
    "cantidad": 1,
    "precio_unitario": 1200,
    "fecha": "2026-08-02T14:30:00Z"
  }
]
```

### GET /api/compras/:id

Este endpoint **no** trae los nombres (solo el listado los agrega); devuelve la fila tal cual está en la tabla, para el formulario de edición.

Objetivo: Obtener una compra de la tienda.

**Respuesta**:
```json
{
  "id": 1,
  "producto_id": 1,
  "proveedor_id": 1,
  "empleado_id": 1,
  "cantidad": 1,
  "precio_unitario": 1200,
  "fecha": "2026-08-02T14:30:00Z"
}
```

### POST /api/compras

Objetivo: Crear una compra en la tienda.

**Request**:
```json
{
  "producto_id": 1,
  "proveedor_id": 1,
  "empleado_id": 1,
  "cantidad": 1,
  "precio_unitario": 1200
}
```

### DELETE /api/compras/:id

Objetivo: Eliminar una compra. Antes de borrar la fila, le resta la `cantidad` al `stock` del producto (`stock = stock - cantidad`), ya que la compra lo había sumado.

**Respuesta**:
```json
{
  "id": 1,
  "producto_id": 1,
  "proveedor_id": 1,
  "empleado_id": 1,
  "cantidad": 1,
  "precio_unitario": 1200,
  "fecha": "2026-08-02T14:30:00Z"
}
```

## EMPLEADOS

### GET /api/empleados

Objetivo: Obtener todos los empleados de la tienda, opcionalmente filtrados.

**Query params** (todos opcionales, se pueden combinar):
- `nombre` (string): búsqueda parcial por nombre (`LIKE %nombre%`).

**Ejemplos**:
- `GET /api/empleados` → todos los empleados activos.
- `GET /api/empleados?nombre=julian` → empleados cuyo nombre contenga "julian".

**Respuesta**:
```json
[
  {
    "id": 1,
    "nombre_completo": "Julian Perez",
    "fecha_nacimiento": "1990-01-01",
    "dni": "123456789",
    "cargo": "Empleado",
    "contacto": "123456789",
    "correo": "julian@miapp.com",
    "sueldo": 350000,
    "activo": true
  }
]
```

### GET /api/empleados/:id

Objetivo: Obtener un empleado de la tienda.

**Respuesta**: igual estructura que el item del `GET /api/empleados`.

### POST /api/empleados

Objetivo: Crear un empleado en la tienda.

**Request**:
```json
{
  "nombre_completo": "Julian Perez",
  "fecha_nacimiento": "1990-01-01",
  "dni": "123456789",
  "cargo": "Empleado",
  "contacto": "123456789",
  "correo": "julian@miapp.com",
  "sueldo": 350000
}
```

### PUT /api/empleados/:id

Objetivo: Modificar un empleado en la tienda.

**Request**: igual al del `POST`.

### DELETE /api/empleados/:id

Objetivo: Dar de baja lógica un empleado de la tienda (no se borra físicamente, se marca `activo: false`).

**Respuesta**: igual al `GET /api/empleados/:id`, con `"activo": false`.

## CATEGORIAS

_Cada categoría guarda qué empleado la creó (`empleado_id`, obligatorio y fijo: no se puede cambiar por `PUT`). Tiene `DELETE` físico: si hay productos usando esa categoría, no se bloquea el borrado — esos productos quedan sin categoría (`categoria_id: null`), igual criterio que Compra/Proveedor (`ON DELETE SET NULL`)._

### GET /api/categorias

Objetivo: Obtener todas las categorías de la tienda. El listado viene con `JOIN` contra `empleados`, así el frontend no tiene que pedir el nombre por separado.

**Respuesta**:
```json
[
  { "id": 1, "nombre": "Bebidas", "empleado_id": 1, "empleado_nombre": "Dante Ortega" }
]
```

### GET /api/categorias/:id

Objetivo: Obtener una categoría de la tienda. Este endpoint **no** trae `empleado_nombre` (solo el listado lo agrega); devuelve la fila tal cual está en la tabla.

**Respuesta**:
```json
{ "id": 1, "nombre": "Bebidas", "empleado_id": 1 }
```

### POST /api/categorias

Objetivo: Crear una categoría en la tienda. `empleado_id` es obligatorio: identifica quién la creó, y valida que el empleado exista (`404` si no).

**Request**:
```json
{ "nombre": "Bebidas", "empleado_id": 1 }
```

### PUT /api/categorias/:id

Objetivo: Modificar el `nombre` de una categoría. `empleado_id` no se puede modificar (es un dato de auditoría de quién la creó, se fija al crearla).

**Request**:
```json
{ "nombre": "Bebidas" }
```

### DELETE /api/categorias/:id

Objetivo: Eliminar físicamente una categoría. Los productos que la usaban quedan con `categoria_id: null` (sin categoría) — no hace falta reasignarlos antes de borrar.

**Respuesta**:
```json
{ "id": 1, "nombre": "Bebidas", "empleado_id": 1 }
```

## AJUSTES

_Registro de auditoría: sin `PUT` (no se edita). Tiene `DELETE`, que revierte el efecto en el stock antes de borrar._

### GET /api/ajustes

Objetivo: Obtener todos los ajustes de la tienda, opcionalmente filtrados.

**Query params** (todos opcionales, se pueden combinar):
- `producto_id` (int): filtra por producto.
- `empleado_id` (int): filtra por empleado.

**Ejemplos**:
- `GET /api/ajustes` → todos los ajustes.
- `GET /api/ajustes?producto_id=1` → solo ajustes de ese producto.
- `GET /api/ajustes?empleado_id=1` → solo ajustes hechos por ese empleado.

El listado viene con `JOIN` contra `producto` y `empleados`, así el frontend no tiene que pedir cada nombre por separado. Los `_id` originales se mantienen (se siguen necesitando para el formulario de alta).

**Respuesta**:
```json
[
  {
    "id": 1,
    "producto_id": 1,
    "producto_nombre": "Edición limitada de figuritas",
    "empleado_id": 1,
    "empleado_nombre": "Dante Ortega",
    "cantidad": -1,
    "motivo": "Producto dañado, se descarta del stock",
    "fecha": "2026-08-02T14:30:00Z"
  }
]
```

### GET /api/ajustes/:id

Este endpoint **no** trae los nombres (solo el listado los agrega); devuelve la fila tal cual está en la tabla, para el formulario de edición.

Objetivo: Obtener un ajuste de la tienda.

**Respuesta**:
```json
{
  "id": 1,
  "producto_id": 1,
  "empleado_id": 1,
  "cantidad": -1,
  "motivo": "Producto dañado, se descarta del stock",
  "fecha": "2026-08-02T14:30:00Z"
}
```

### POST /api/ajustes

Objetivo: Crear un ajuste en la tienda. Si `cantidad` es negativa, valida que no supere el `stock` actual del producto; si no alcanza, devuelve `400` con el formato de error estándar. `motivo` es obligatorio.

**Request**:
```json
{
  "producto_id": 1,
  "empleado_id": 1,
  "cantidad": -1,
  "motivo": "Producto dañado, se descarta del stock"
}
```

### DELETE /api/ajustes/:id

Objetivo: Eliminar un ajuste. Antes de borrar la fila, revierte su efecto sobre el `stock` del producto (`stock = stock - cantidad`, deshaciendo la corrección que había aplicado).

**Respuesta**:
```json
{
  "id": 1,
  "producto_id": 1,
  "empleado_id": 1,
  "cantidad": -1,
  "motivo": "Producto dañado, se descarta del stock",
  "fecha": "2026-08-02T14:30:00Z"
}
```