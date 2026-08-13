import { getProductos, getProducto, postProducto, putProducto, deleteProducto } from '../servicios/productos.js'

// PRUEBA DE LOS SERVICIOS DE LA API PRODUCTOS

// Obtener todos los productos
try {
    const productos = await getProductos();
    console.log(productos);
} catch (error) {
    console.error('Algo fallo al pedir los productos');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Obtener un producto por id
try {
    const productoPorId = await getProducto(1);
    console.log(productoPorId);
} catch (error) {
    console.error('Algo fallo al pedir el producto por id');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Crear un producto
try {
    const productoCreado = await postProducto({
        nombre: "Monster Energy Verde",
        descripcion: "Bebida energética",
        marca: "Monster Energy",
        precio: 1200,
        stock: 24,
        categoria_id: 1,
        tipo: "normal",
        stock_minimo: 10,
        imagen_url: "https://miapp.com/img/coca500.png"
    });
    console.log(productoCreado);
} catch (error) {
    console.error('Algo fallo al crear un producto');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Modificar un producto
try {
    const productoActualizado = await putProducto(1, {
        nombre: "Monster Energy Verde",
        descripcion: "Bebida energética",
        marca: "Monster Energy",
        precio: 1200,
        stock: 24,
        categoria_id: 1,
        tipo: "normal",
        stock_minimo: 10,
        imagen_url: "https://miapp.com/img/coca500.png"
    });
    console.log(productoActualizado);
} catch (error) {
    console.error('Algo fallo al modificar el producto');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Eliminar un producto
try {
    const productoEliminado = await deleteProducto(1);
    console.log(productoEliminado);
} catch (error) {
    console.error('Algo fallo al eliminar el producto');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}