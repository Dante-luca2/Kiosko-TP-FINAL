import { getProveedores, getProveedor, postProveedor, putProveedor, deleteProveedor } from '../servicios/proveedores.js'

// PRUEBA DE LOS SERVICIOS DE LA API PROVEEDORES

// Obtener todos los proveedores
try {
    const proveedores = await getProveedores();
    console.log(proveedores);
} catch (error) {
    console.error('Algo fallo al pedir los proveedores');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Obtener un proveedor por id
try {
    const proveedorPorId = await getProveedor(1);
    console.log(proveedorPorId);
} catch (error) {
    console.error('Algo fallo al pedir el proveedor por id');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Crear un proveedor
try {
    const proveedorCreado = await postProveedor({
        nombre: 'Zapitos',
        contacto: '123456789',
        telefono: '123456789',
        rubro: '123456789',
        direccion: 'Calle 123'
    });
    console.log(proveedorCreado);
} catch (error) {
    console.error('Algo fallo al crear un proveedor');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Actualizar un proveedor
try {
    const proveedorActualizado = await putProveedor(1, {
        nombre: 'CHAPO',
        contacto: 'DANTE ORTEGA SAMUEL DE LUKE',
        telefono: '123456789',
        rubro: '123456789',
        direccion: 'Calle 123'
    });
    console.log(proveedorActualizado);
} catch (error) {
    console.error('Algo fallo al actualizar un proveedor');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Eliminar un proveedor
try {
    const proveedorEliminado = await deleteProveedor(1);
    console.log(proveedorEliminado);
} catch (error) {
    console.error('Algo fallo al eliminar un proveedor');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}