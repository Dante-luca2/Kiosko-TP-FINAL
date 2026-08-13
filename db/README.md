# Kiosco — Sistema de gestión de inventario y caja
## Descripción

Herramienta de uso interno para el dueño de un kiosco, pensada como ayuda para llevar el control de su stock, sus empleados y su plata sin necesidad de un sistema contable complejo. No es una tienda online: el dueño o sus empleados cargan manualmente lo que va pasando en el local (ventas en persona, reposiciones de stock, ajustes de inventario) y la aplicación calcula sola, a partir de eso, cuánto stock queda de cada producto, cuándo hay que reponer, y cuánta plata debería tener en base a lo registrado.

## Entidades de la base de datos

### Categoría

| Campo | Tipo | Descripción |
|---|---|---|
| nombre | string | Nombre de la categoría (bebidas, snacks, limpieza, etc.). |

### Proveedor

| Campo | Tipo | Descripción |
|---|---|---|
| nombre | string | Nombre o razón social del proveedor. |
| contacto | string | Persona de contacto. |
| telefono | string | Teléfono de contacto. |
| rubro | string | Qué tipo de productos provee (bebidas, golosinas, cigarrillos, etc.). |
| direccion | string | Dirección o zona de reparto. |
| activo | boolean | Baja lógica: si es false, no se lista, pero conserva su historial de compras. |

### Empleados

| Campo | Tipo | Descripción |
|---|---|---|
| nombre_completo | string | Nombre de la persona. |
| fecha_nacimiento | date | Fecha de nacimiento. |
| dni | string (unique) | Documento de identidad. |
| cargo | string | Rol dentro del kiosco (dueño, empleado, etc.). |
| contacto | string | Teléfono del empleado. |
| correo | string (unique) | Correo electrónico. |
| sueldo | int | Sueldo mensual. |
| activo | boolean | Baja lógica. |

### Producto

| Campo | Tipo | Descripción |
|---|---|---|
| nombre | string | Nombre del producto. |
| descripcion | string | Descripción detallada del producto. |
| marca | string | Marca del producto. |
| precio | int | Precio de venta actual (catálogo, no el efectivamente cobrado en cada venta). |
| stock | int | Stock disponible en este momento. |
| categoria_id | FK → Categoría | Categoría del producto. |
| tipo | string (normal / limitado / estacional) | Define cómo se comporta la alerta de reposición. |
| stock_minimo | int | Umbral a partir del cual se avisa que hay que reponer (aplica a productos normales). |
| imagen_url | string | Imagen opcional del producto. |
| activo | boolean | Baja lógica: si es false, no se muestra, pero conserva su historial. |

### Venta

| Campo | Tipo | Descripción |
|---|---|---|
| producto_id | FK → Producto | Producto vendido. |
| empleado_id | FK → Empleados | Quien registró la venta. |
| cantidad | int | Unidades vendidas. |
| precio_unitario | int | Precio real cobrado. |
| descuento | int | Descuento aplicado, si hubo. |
| fecha | datetime | Momento de la venta. |

### Compra

| Campo | Tipo | Descripción |
|---|---|---|
| producto_id | FK → Producto | Producto repuesto. |
| proveedor_id | FK → Proveedor (nullable) | A quién se le compró. |
| empleado_id | FK → Empleados | Quien registró la compra. |
| cantidad | int | Unidades ingresadas. |
| precio_unitario | int | Costo pagado por unidad. |
| fecha | datetime | Momento de la compra. |

### Ajuste

| Campo | Tipo | Descripción |
|---|---|---|
| producto_id | FK → Producto | Producto cuyo stock corrige. |
| empleado_id | FK → Empleados | Empleado que hizo el ajuste. |
| cantidad | int (puede ser negativo) | Diferencia entre el stock físico y el calculado. |
| motivo | string (obligatorio) | Por qué se hizo el ajuste. |
| fecha | datetime | Momento del ajuste. |

## Relaciones

- **Categoría 1—N Producto**: una categoría agrupa muchos productos.
- **Producto 1—N Venta / Compra / Ajuste**: un producto puede aparecer en muchas ventas, reposiciones y correcciones de stock. No se puede eliminar un producto con movimientos asociados (`ON DELETE RESTRICT`).
- **Proveedor 1—N Compra**: un proveedor puede aparecer en muchas compras (Venta y Ajuste no tienen proveedor asociado). Si se elimina un proveedor, sus compras pasadas quedan en el historial sin proveedor asociado (`ON DELETE SET NULL`).
- **Empleados 1—N Venta / Compra / Ajuste**: un empleado (o el dueño) puede registrar muchas ventas, compras y ajustes.

## Reglas de negocio

- No se puede registrar una venta ni un ajuste negativo por más cantidad de la que hay en stock actual del producto.
- El tipo del producto define cuándo se dispara el aviso de reposición:
  - **normal**: avisa cuando `stock ≤ stock_minimo`.
  - **limitado**: si se agota, avisa que se agotó, pero no insiste en que hay que reponer.
  - **estacional**: solo avisa reponer en fechas particulares (ej. productos navideños).
- La plata del kiosco no es un campo fijo: se calcula sumando el efecto de todos los movimientos — venta suma, compra resta, ajuste no mueve la plata (es una corrección de stock, no un movimiento de caja).
- El `precio_unitario` de una Venta o Compra puede ser distinto al precio de catálogo del producto (por descuento o variación del costo pagado), sin alterar el precio oficial guardado en Producto.
- Cada Compra se asocia a un Proveedor, para saber después a quién comprarle de nuevo o comparar precios entre proveedores.
- El motivo de un Ajuste es obligatorio: es el único dato que explica por qué cambió el stock sin que haya sido venta ni compra.
- Un Producto o Proveedor dado de baja (`activo = false`) deja de listarse, pero conserva su historial de movimientos asociados (baja lógica, nunca se borra físicamente).
- El stock de Producto se actualiza automáticamente desde el backend al registrar una Venta, Compra o Ajuste — no es un valor que se carga a mano.



