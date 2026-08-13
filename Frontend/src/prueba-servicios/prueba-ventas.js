import { getVentas, getVenta, postVenta, deleteVenta } from '../servicios/ventas.js'

// PRUEBA DE LOS SERVICIOS DE LA API VENTAS

// Obtener todas las ventas
try {
    const ventas = await getVentas();
    console.log(ventas);
} catch (error) {
    console.error('Algo fallo al pedir las ventas');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Obtener una venta por id
try {
    const ventaPorId = await getVenta(2);
    console.log(ventaPorId);
} catch (error) {
    console.error('Algo fallo al pedir la venta por id');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Crear una venta
try {
    const ventaCreada = await postVenta({
        producto_id: 1,
        empleado_id: 1,
        cantidad: 1,
        precio_unitario: 1200,
        descuento: 0
    });
    console.log(ventaCreada);
} catch (error) {
    console.error('Algo fallo al crear una venta');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Eliminar una venta
try {
    const ventaEliminada = await deleteVenta(1);
    console.log(ventaEliminada);
} catch (error) {
    console.error('Algo fallo al eliminar una venta');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}