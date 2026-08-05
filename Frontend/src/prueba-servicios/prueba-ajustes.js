import { getAjustes, getAjuste, postAjuste, deleteAjuste } from '../servicios/ajustes.js'

// PRUEBA DE LOS SERVICIOS DE LA API AJUSTES

// Obtener todos los ajustes
try {
    const ajustes = await getAjustes();
    console.log(ajustes);
} catch (error) {
    console.error('Algo fallo al pedir los ajustes');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Obtener un ajuste por id
try {
    const ajustePorId = await getAjuste(1);
    console.log(ajustePorId);
} catch (error) {
    console.error('Algo fallo al pedir el ajuste por id');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Crear un ajuste
try {
    const ajusteCreado = await postAjuste({
        producto_id: 1,
        empleado_id: 1,
        cantidad: 10,
        motivo: "Producto añadido.",
    });
    console.log(ajusteCreado);
} catch (error) {
    console.error('Algo fallo al crear un ajuste');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Eliminar un ajuste
try {
    const ajusteEliminado = await deleteAjuste(1);
    console.log(ajusteEliminado);
} catch (error) {
    console.error('Algo fallo al eliminar el ajuste');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}