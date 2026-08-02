# Kiosko-TP-FINAL

## 1. ¿En que consiste?

Este proyecto, va a consistir en ser una pagina que el usuario que sera el dueño de una tienda/kiosco, pueda controlar los movimientos que se hace de forma rapida y digital.

Tiene como objetivo, hacer lo mismo que hacen los calculos en papel, pero pasado a digital para que simplificar las cosas. Incluyendo cosas como recordar que productos comprar cuando excasea, tener un dinero (ficticio) que sube y baja (o lo cambias a voluntad) dependiendo de las cosas que ocurran, y marques, recordatorio de que comprar en fechas especificas, etc.

## 2. Frontend.

El usuario al iniciar la pagina, podra ingresar el dinero que tiene en la parte superior, como forma de medir tu plata con lo que va a estar ocurriendo, al momento de vender, comprar, o modificar lo tu manualmente, va a subir o bajar.

Este dinero es ficticio, no es dinero real que puedes retirar, solo es una forma de obtener el resultado de cuanto ganaste de forma rapida.

La ventaja de esto, es que en caso de que tu dinero real no coincide con tu dinero ficticio con todo lo que manejas, puedes saber si algo esta mal.

---

Tendra opcion de añadir productos a la lista de las cosas que tienes (colocar el nombre, ID (Automatico), precio, la marca, categoria, sub categorias, extra, imagen (opcional), disponibilidad), y luego de agregar ese producto decir la cantidad que hay actualmente.

Aqui lo que significa cada parte del producto.
1- Nombre: Como se llama el producto que tiene puesto o le pongas (ej: Oreo 3 paquetes grandes 500g)
2- ID: Una forma de identificar el producto de forma rapida al momento querer buscarlo, puesto de forma automatica con el valor mas pequeño disponible (ej: 1)
3- Precio: Cuantos pesos cuesta el producto que estas vendiendo (ej: 5200,25)
4- Marca: La marca que a creado el producto o su creador (ej: Mondelēz International)
5- Categoria: Para marcar que tipo es, si es un postre, limpieza, ropa, etc (ej: Comidas)
6- Sub Categoria: Lo mismo pero más especifico de que es en general (ej: Galletitas)
7- Extra: Agregar algun dato extra que tu quieras (ej: The best production)
8- Imagen: Por lo general le sacas una foto, internet o de tu PC para el producto, asi sea más facil ver lo que se esta hablando al momento de darle click, ya sea JPG, PNG, o similar.
9- Disponibidad: Estara las opciones normal, limitado, y estacional.
Normal: Un producto que siempre vas a querer en tu estanteria cada vez que se esta por acabar.
Limitado: Para productos que solo hay X cantidad y apenas se acaba no va a volver a estar.
Estacional Normal: Productos que solo estan disponibles en X y Y fecha, por ejemplo, cuando este cerca la navidad, se avise de que se debe comprar estos productos, y funciona igual que el normal.
Estacional Limitado: Lo mismo que limitado pero que estara en X fecha unicamente.

La cantidad de productos, es poniendo cuantos tienes de ese producto actualmente antes de comenzar a vender.
Si la disponibilidad que pusiste es normal, se te va a pedir apartir de que cantidad para abajo, se te avise cuando debes comprar más para evitar que te quedes sin ese producto.
Si es limitado, solo se te pedira cuantos tienes.
Estacional normal, colocar la fecha de inicio y de fin, más cuanto tienes que tener cuando llegue esa fecha. Al llegar esa fecha o cerca se te llega una notificación donde se te avisa de que falta ese producto por comprar, y solo cuando termina esa fecha limite, pasa a ser limitado (se acaba sin que te avise).
Si pusiste estacional limitado, es lo mismo pero solo pones la fecha de inicio (no puedes poner fin), te avisa de comprar ese producto cuando llegue el dia, y una vez que lo obtienes, se vuelve limitado al instante.

---

Una opcion que te permite editar, permitiendote editar:
- El precio de los productos, ya sea de forma precisa o marcar X cantidad de productos y luego agregar un % de descuento o de subida a los que marcaste.
- Modificar tu dinero ficticio para subir o bajar, modificando directamente o agregar cuanto quieres que se sume o reste. Hecho principalmente por si cuestiones externas (fuera de tu tienda) recibes o pierdes dinero o malentendidos.
- Editar algun producto, su nombre, foto, categoria, sub categoria, disponibilidad, etc.

---

Estara el historial de ventas y de compras.
Donde se guardara cada producto vendido o comprado que hagas, en una lista para ver todos los cambios que se hagan.