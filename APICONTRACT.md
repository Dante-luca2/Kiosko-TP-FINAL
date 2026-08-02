# CONTRATO API

## EDNPOINTS DE API

## PRODUCTO

### GET /api/productos

Objetivo: Obtener todos los productos de la tienda, opcionalmente filtrados.

**Query params** (todos opcionales, se pueden combinar):
- `marca` (string): filtra por marca exacta.
- `tipo` (string: `normal` | `limitado` | `estacional`): filtra por tipo de producto.
- `categoria_id` (int): filtra por categoría.

**Ejemplos**:
- `GET /api/productos` → todos los productos.
- `GET /api/productos?marca=Coca Cola` → solo productos de esa marca.
- `GET /api/productos?categoria_id=3&tipo=normal` → combinando dos filtros a la vez.

**Respuesta**:

```json
[
  {
    "id": 1,
    "nombre": "Coca Cola 500ml",
    "marca": "Coca Cola",
    "categoria_id": 3,
    "tipo": "normal",
    ...
  }
]
```


### GET /api/productos/:id

Objetivo: Obtener un producto de la tienda

**Respuesta**:

```json
{
  "id": 1,
  "nombre": "Coca Cola 500ml",
  "descripcion": "Gaseosa cola, botella descartable",
  "marca": "Coca Cola",
  "precio": 1200.50,
  "stock": 24,
  "categoria_id": 3,
  "tipo": "normal",
  "stock_minimo": 10,
  "imagen_url": "https://miapp.com/img/coca500.png",
}
```

### POST /api/productos

Objetivo: Crear un producto en la tienda

**Request**:

```json
{
  "nombre": "Coca Cola 500ml",
  "descripcion": "Gaseosa cola, botella descartable",
  "marca": "Coca Cola",
  "precio": 1200.50,
  "stock": 24,
  "categoria_id": 3,
  "tipo": "normal",
  "stock_minimo": 10,
  "imagen_url": "https://miapp.com/img/coca500.png",
}
```


### PUT /api/productos/:id

Objetivo: Modificar un producto en la tienda

**Request**:

```json
{
  "nombre": "Coca Cola 500ml",
  "descripcion": "Gaseosa cola, botella descartable",
  "marca": "Coca Cola",
  "precio": 1200.50,
  "stock": 24,
  "categoria_id": 3,
  "tipo": "normal",
  "stock_minimo": 10,
  "imagen_url": "https://miapp.com/img/coca500.png",
}
```

### DELETE /api/productos/:id

Objetivo: Dar de baja lógica un producto de la tienda (no se borra físicamente, se marca `activo: false`)

**Respuesta**:

```json
{
  "id": 1,
  "nombre": "Coca Cola 500ml",
  "descripcion": "Gaseosa cola, botella descartable",
  "marca": "Coca Cola",
  "precio": 1200.50,
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
- `nombre` (string): filtra por nombre exacta.

**Ejemplos**:
- `GET /api/proveedores` → todos los proveedores.
- `GET /api/proveedores?nombre=Coca Cola` → solo proveedores de esa marca.

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
}
```

### POST /api/proveedores

Objetivo: Crear un proveedor en la tienda.

**Request**:

```json
{
    "id": 1,
    "nombre": "Julian",
    "contacto": "John Doe",
    "telefono": "123456789",
    "rubro": "Coca Cola",
    "direccion": "Calle 123",
}
```

### PUT /api/proveedores/:id

Objetivo: Modificar un proveedor en la tienda.

**Request**:

```json
{
    "id": 1,
    "nombre": "Julian",
    "contacto": "John Doe",
    "telefono": "123456789",
    "rubro": "Coca Cola",
    "direccion": "Calle 123",
}
```

### DELETE /api/proveedores/:id

Objetivo: Dar de baja lógica un proveedor de la tienda (no se borra físicamente, se marca `activo: false`).

## VENTAS

### GET /api/ventas

Objetivo: Obtener todas las ventas de la tienda, 
opcionalmente filtradas.

**Query params** (todos opcionales, se pueden combinar):
- `producto_id` (int): filtra por producto.
- `proveedor_id` (int): filtra por proveedor.

**Ejemplos**:
- `GET /api/ventas` → todas las ventas.
- `GET /api/ventas?producto_id=1` → solo ventas de ese producto.
- `GET /api/ventas?proveedor_id=1` → solo ventas de ese proveedor.

**Respuesta**:

```json
[
    {
        "id": 1,
        "producto_id": 1,
        "empleado_id": 1,
        "cantidad": 1,
        "precio_unitario": 1200.50,
        "descuento": 0,
        "fecha": "2022-01-01",
    }...
]
```

### GET /api/ventas/:id

Objetivo: Obtener una venta de la tienda.

**Respuesta**:

```json
{
    "id": 1,
    "producto_id": 1,
    "empleado_id": 1,
    "cantidad": 1,
    "precio_unitario": 1200.50,
    "descuento": 0,
    "fecha": "2022-01-01",
}
```

### POST /api/ventas

Objetivo: Crear una venta en la tienda.

**Request**:

```json
{
    "producto_id": 1,
    "empleado_id": 1,
    "cantidad": 1,
    "precio_unitario": 1200.50,
    "descuento": 0,
}
```

## COMPRAS

### GET /api/compras

Objetivo: Obtener todas las compras de la tienda, 
opcionalmente filtradas.

**Query params** (todos opcionales, se pueden combinar):
- `producto_id` (int): filtra por producto.
- `proveedor_id` (int): filtra por proveedor.
- `empleado_id` (int): filtra por empleado.

**Ejemplos**:
- `GET /api/compras` → todas las compras.
- `GET /api/compras?producto_id=1` → solo compras de ese producto.
- `GET /api/compras?proveedor_id=1` → solo compras de ese proveedor.
- `GET /api/compras?empleado_id=1` → solo compras de ese empleado.

**Respuesta**:

```json
[
    {
        "id": 1,
        "producto_id": 1,
        "proveedor_id": 1,
        "empleado_id": 1,
        "cantidad": 1,
        "precio_unitario": 1200.50,
        "fecha": "2022-01-01",
    }...
]
```

### GET /api/compras/:id

Objetivo: Obtener una compra de la tienda.

**Respuesta**:

```json
{
    "id": 1,
    "producto_id": 1,
    "proveedor_id": 1,
    "empleado_id": 1,
    "cantidad": 1,
    "precio_unitario": 1200.50,
    "fecha": "2022-01-01",
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
    "precio_unitario": 1200.50,
}
```

## EMPLEADOS

### GET /api/empleados

Objetivo: Obtener todos los empleados de la tienda, opcionalmente filtrados.

**Query params** (todos opcionales, se pueden combinar):
- `nombre` (string): filtra por nombre exacta.

**Ejemplos**:
- `GET /api/empleados` → todos los empleados.
- `GET /api/empleados?nombre=Julian` → solo empleados de esa marca.

**Respuesta**:

```json
[
    {
        "id": 1,
        "nombre": "Julian",
        "fecha_nacimiento": "1990-01-01",
        "dni": "123456789",
        "cargo": "Empleado",
        "contacto": "123456789",
        "correo": "julian@miapp.com",
        "sueldo": 1200.50,
    }
]
```

### GET /api/empleados/:id

Objetivo: Obtener un empleado de la tienda.

**Respuesta**:

```json
{
    "id": 1,
    "nombre": "Julian",
    "fecha_nacimiento": "1990-01-01",
    "dni": "123456789",
    "cargo": "Empleado",
    "contacto": "123456789",
    "correo": "julian@miapp.com",
    "sueldo": 1200.50,
}
```

### POST /api/empleados

Objetivo: Crear un empleado en la tienda.

**Request**:

```json
{
    "nombre": "Julian",
    "fecha_nacimiento": "1990-01-01",
    "dni": "123456789",
    "cargo": "Empleado",
    "contacto": "123456789",
    "correo": "julian@miapp.com",
    "sueldo": 1200.50,
}
```

### PUT /api/empleados/:id

Objetivo: Modificar un empleado en la tienda.

**Request**:

```json
{
    "nombre": "Julian",
    "fecha_nacimiento": "1990-01-01",
    "dni": "123456789",
    "cargo": "Empleado",
    "contacto": "123456789",
    "correo": "julian@miapp.com",
    "sueldo": 1200.50,
}
```

### DELETE /api/empleados/:id

Objetivo: Dar de baja lógica un empleado de la tienda (no se borra físicamente, se marca `activo: false`).

## CATEGORIAS

### GET /api/categorias

Objetivo: Obtener todas las categorías de la tienda, opcionalmente filtradas.

**RESPUESTA**:

```json
[
    {
        "id": 1,
        "nombre": "Coca Cola",
    }
]
```

### GET /api/categorias/:id

Objetivo: Obtener una categoría de la tienda.

**RESPUESTA**:

```json
{
    "id": 1,
    "nombre": "Coca Cola",
}
```

### POST /api/categorias

Objetivo: Crear una categoría en la tienda.

**Request**:

```json
{
    "nombre": "Coca Cola",
}
```

### PUT /api/categorias/:id

Objetivo: Modificar una categoría en la tienda.

**Request**:

```json
{
    "nombre": "Coca Cola",
}
```

## AJUSTES

### GET /api/ajustes

Objetivo: Obtener todos los ajustes de la tienda, opcionalmente filtrados.

**Query params** (todos opcionales, se pueden combinar):
- `producto_id` (int): filtra por producto.
- `empleado_id` (int): filtra por empleado.

**Ejemplos**:
- `GET /api/ajustes` → todos los ajustes.
- `GET /api/ajustes?producto_id=1` → solo ajustes de ese producto.
- `GET /api/ajustes?empleado_id=1` → solo ajustes de ese empleado.

**Respuesta**:

```json
[
    {
        "id": 1,
        "producto_id": 1,
        "empleado_id": 1,
        "cantidad": 1,
        "motivo": "No se puede vender",
        "fecha": "2022-01-01",
    }...
]
```

