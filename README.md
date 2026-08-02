# Kiosko-TP-FINAL

## 1. ¿En que consiste?

Este proyecto, va a consistir en ser una pagina que el usuario que sera el dueño de una tienda/kiosco, pueda controlar los movimientos que se hace de forma rapida y digital.

Tiene como objetivo, hacer lo mismo que hacen los calculos en papel y más, pero pasado a digital para que simplificar las cosas. Incluyendo cosas como recordar que productos comprar cuando excasea, tener un dinero (ficticio) que sube y baja (o lo cambias a voluntad) dependiendo de las cosas que ocurran, y marques, recordatorio de que comprar en fechas especificas, etc.

Pensada como ayuda para llevar el control de su stock y su plata sin necesidad de un sistema contable complejo. No es una tienda online: el dueño carga manualmente lo que va pasando en el local (ventas en persona, reposiciones de stock, regalos) y la aplicación calcula solo, a partir de eso, cuánto stock queda de cada producto, cuándo hay que reponer, y cuánta plata debería tener en base a lo registrado.

## 2. Frontend.

### Principal.
El usuario al iniciar la pagina, podra ingresar el dinero que tiene en la parte superior, como forma de medir tu plata con lo que va a estar ocurriendo, al momento de vender, comprar, o modificar lo tu manualmente, va a subir o bajar.

Este dinero es ficticio, no es dinero real que puedes retirar, solo es una forma de obtener el resultado de cuanto ganaste de forma rapida.

La ventaja de esto, es que en caso de que tu dinero real no coincide con tu dinero ficticio con todo lo que manejas, puedes saber si algo esta mal.

---

### Productos.
Tendra opcion de añadir productos a la lista de las cosas que tienes (colocar el nombre, ID (Automatico), precio, la marca, categoria, sub categorias, extra, imagen (opcional), disponibilidad), y luego de agregar ese producto decir la cantidad que hay actualmente.

Aqui lo que significa cada parte del producto.
1- Nombre: Como se llama el producto que tiene puesto o le pongas (ej: Oreo 3 paquetes grandes 500g)
2- ID: Una forma de identificar el producto de forma rapida al momento querer buscarlo, puesto de forma automatica con el valor mas pequeño disponible (ej: 1)
3- Precio: Cuantos pesos cuesta el producto que estas vendiendo (ej: 5200,25)
4- Marca: La marca que a creado el producto o su creador (ej: Mondelēz International)
5- Categoria: Para marcar que tipo es, si es un postre, limpieza, ropa, etc (ej: Comidas)
7- Extra: Agregar algun dato extra que tu quieras (ej: The best production)
8- Imagen: Por lo general le sacas una foto, internet o de tu PC para el producto, asi sea más facil ver lo que se esta hablando al momento de darle click, ya sea JPG, PNG, o similar.
9- Disponibidad: Estara las opciones normal, limitado, y estacional (se explica en el punto 5)

---

### Editar.

Una opcion que te permite editar, permitiendote editar:
- El precio de los productos, ya sea de forma precisa o marcar X cantidad de productos y luego agregar un % de descuento o de subida a los que marcaste.
- Modificar tu dinero ficticio para subir o bajar, modificando directamente o agregar cuanto quieres que se sume o reste. Hecho principalmente por si cuestiones externas (fuera de tu tienda) recibes o pierdes dinero o malentendidos.
- Editar algun producto, su nombre, foto, categoria, sub categoria, disponibilidad, etc.

---

### Historial.

Estara la capacidad de ver el historial de ventas y de compras, donde se guardara cada producto vendido o comprado que hagas, en una lista para ver todos los cambios que se hagan.
Historial de movimientos por producto o por período
Historial de caja (diario, semanal, mensual)
Productos más vendidos / con más mermas
Ganancia o margen estimado (venta − costo)
Listado de productos a reponer

---

## 3. Base de Datos.

### Productos
Representa cada artículo que se vende en el kiosco, con su stock, precio y datos de reposición.

| Campo | Tipo | Descripción |
| :--- | :---: | ---: |
| id | PK | ... |
| nombre | string | Nombre del producto. |
| descripcion | string | Descripción detallada del producto  |
| marca | string | Marca del producto |
| precio | decimal | Precio de venta actual (catálogo) |
| stock | int | Stock disponible en este momento. |
| categoria_id | FK -> categoria | Categoría del producto (Limpieza, Cocina, etc.).. |
| tipo | enum | normal / limitado / estacional |
| stock_minimo | int | Umbral a partir del cual se avisa que hay que reponer (aplica a productos normales). |
| imagen_url | string | Imagen opcional del producto |
| activo | boolean (default true) | Baja lógica: si es false, no se muestra |

---

### Proveedor 
Representa a quien el dueño le compra mercadería para reponer stock. 

| Campo | Tipo | Descripción |
| :--- | :---: | ---: |
| id | PK | ... |
| nombre | string | Nombre o razón social del proveedor. |
| contacto | string | Persona de contacto. |
| teléfono | string | Teléfono de contacto. |
| rubro | string | Qué tipo de productos provee (bebidas, golosinas, cigarrillos, etc.). |
| dirección | string | Dirección o zona de reparto |
| activo | boolean (default true) | Baja lógica. |

---

### Venta 
Registra cada venta realizada en el local: genera egreso de stock e ingreso esperado de caja. 

| Campo | Tipo | Descripción |
| :--- | :---: | ---: |
| id | PK | ... |
| producto_id | FK -> Producto | Producto vendido. |
| empleado_id | FK -> Empleados | Quien registró la venta. |
| cantidad | int | Unidades vendidas. |
| precio_unitario | decimal | Precio real cobrado. |
| descuento | decimal | Descuento aplicado, si hubo. |
| fecha | datetime | Momento de la venta. |

---

### Compra
Registra cada reposición de mercadería comprada a un proveedor: genera ingreso de stock y egreso de caja. 

| Campo | Tipo | Descripción |
| :--- | :---: | ---: |
| id | PK | ... |
| producto_id | FK -> Proveedor | Producto repuesto. |
| empleado_id | FK -> Empleados | Quien registró la compra. |
| cantidad | int | Unidades ingresadas. |
| precio_unitario | decimal | Costo pagado por unidad. |
| fecha | datetime | Momento de la compra. |

---

### Empleados
Representa a las personas que operan el sistema (empleados y dueño) usada para datos de nómina y para identificar quién registró cada movimiento. 

| Campo | Tipo | Descripción |
| :--- | :---: | ---: |
| id | PK | ... |
| nombre_completo | string | Nombre de la persona. |
| fecha_nacimiento | date | Nombre de la persona. |
| dni | string, unique, not null | Documentación de identidad. |
| cargo | string | Rol dentro del kiosco. |
| contacto | int | Telefono del empleado. |
| correo | string unique | Correo Electrónico. |
| sueldo | int default(0) | Sueldo mensual. |
| activo | boolean (default true) | Baja lógica. |

---

### Categoría
Agrupa los productos por tipo (bebidas, snacks, limpieza, etc.) para organizar el catálogo.

| Campo | Tipo | Descripción |
| :--- | :---: | ---: |
| id | PK | Es el ID de la tabla |
| nombre | string | Es como se llama el producto. |

---

### Ajuste

| Campo | Tipo | Descripción |
| :--- | :---: | ---: |
| id | PK | ... |
| producto_id | FK -> Producto | Producto cuyo stock corrige. |
| cantidad | int (puede ser negativo) | Diferencia entre el stock físico y el calculado. |
| motivo | string, obligatorio | Por qué se hizo el ajuste |
| fecha | datetime | Momento del ajuste |

---

## 4. Relaciones
Categoría 1—N Producto: una categoría agrupa muchos productos.
Producto 1—N Venta: un producto puede aparecer en muchas ventas.
Producto 1—N Compra: un producto puede aparecer en muchas reposiciones.
Producto 1—N Ajuste: un producto puede tener muchas correcciones de stock a lo largo del tiempo.
Proveedor 1—N Compra: un proveedor puede aparecer en muchas compras (Venta y Ajuste no tienen proveedor asociado).
Empleados 1—N Venta: un empleado (o el dueño) puede registrar muchas ventas.
Empleados 1—N Compra: un empleado (o el dueño) puede registrar muchas compras.

## 5. Reglas de negocio.
No se puede registrar una venta ni un ajuste negativo por más cantidad de la que hay en stock actual del producto.
El tipo del producto define cuándo se dispara el aviso de reposición:
- Normal: avisa cuando stock ≤ stock_minimo.
- Limitado: si se agota, avisa que se agotó, pero no insiste en que hay que reponer.
- Estacional: solo avisa reponer en fechas particulares (ej. productos navideños).

La plata del kiosco no es un campo fijo: se calcula sumando el efecto de todos los movimientos — venta suma, compra resta, ajuste no mueve la plata (es una corrección de stock, no un movimiento de caja).
El precio_unitario de una Venta o Compra puede ser distinto al precio de catálogo del producto (por descuento o variación del costo pagado), sin alterar el precio oficial guardado en Producto.
Cada Compra se asocia a un Proveedor, para saber después a quién comprarle de nuevo o comparar precios entre proveedores.
El motivo de un Ajuste es obligatorio: es el único dato que explica por qué cambió el stock sin que haya sido venta ni compra.
Un Producto o Proveedor dado de baja (activo = false) deja de listarse, pero conserva su historial de movimientos asociados (baja lógica, nunca se borra físicamente).
El stock de Producto se actualiza automáticamente desde el backend al registrar una Venta, Compra o Ajuste — no es un valor que se carga a mano.

## 6. Páginas del frontend (CSR contra el backend)
Productos: listado con stock actual y alertas de reposición, filtro por categoría, alta/edición/baja lógica.
Categorías: alta/edición/baja de categorías, para organizar el catálogo de productos.
Proveedores: listado, alta/edición/baja lógica.
Empleados: listado, alta/edición/baja lógica, con el dato de quién es el dueño.
Registrar movimiento: una pantalla (o tres, según cómo se organice) para cargar una Venta, una Compra o un Ajuste, seleccionando quién lo está registrando (empleado o dueño).
Historial de movimientos: consulta combinada de Venta + Compra + Ajuste, filtrable por producto o por período.
Reportes: productos más vendidos, ganancia/margen estimado, historial de caja por período, listado de productos a reponer.

