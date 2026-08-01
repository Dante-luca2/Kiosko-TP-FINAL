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

