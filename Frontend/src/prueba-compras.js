import { getCompras, getCompra, postCompra, deleteCompra } from './servicios/compras.js'

// PRUEBA DE LOS SERVICIOS DE LA API COMPRAS

// Obtener todos las compras
try {
    const compras = await getCompras();
    console.log(compras);
} catch (error) {
    console.error('Algo fallo al pedir las compras');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Obtener una compra por id
try {
    const compraPorId = await getCompra(1);
    console.log(compraPorId);
} catch (error) {
    console.error('Algo fallo al pedir la compra por id');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Crear una compra
let compraCreada;
try {
  compraCreada = await postCompra({
    producto_id: 1,
    proveedor_id: 1,
    empleado_id: 1,
    cantidad: 1,
    precio_unitario: 1200
  });
  console.log(compraCreada);
} catch (error) {
  console.error('Algo fallo al crear una compra');
  console.error('Status:', error.response?.status);
  console.error('Mensaje:', error.response?.data);
}

// Eliminar la compra recien creada
try {
  const compraEliminada = await deleteCompra(compraCreada.id);
  console.log(compraEliminada);
} catch (error) {
  console.error('Algo fallo al eliminar la compra');
  console.error('Status:', error.response?.status);
  console.error('Mensaje:', error.response?.data);
}