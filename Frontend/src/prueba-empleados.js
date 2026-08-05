import { getEmpleados, getEmpleado, postEmpleado, putEmpleado, deleteEmpleado } from './servicios/empleados.js'

// PRUEBA DE LOS SERVICIOS DE LA API EMPLEADOS

// Obtener todos los empleados
try {
    const empleados = await getEmpleados();
    console.log(empleados);
} catch (error) {
    console.error('Algo fallo al pedir los empleados');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Obtener un empleado por id
try {
    const empleadoPorId = await getEmpleado(1);
    console.log(empleadoPorId);
} catch (error) {
    console.error('Algo fallo al pedir el empleado por id');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Crear un empleado
try {
    const empleadoCreado = await postEmpleado({
        nombre_completo: 'Nombre Completo',
        fecha_nacimiento: '2000-01-01',
        dni: '1111111111',
        cargo: 'Jefe',
        contacto: '123456789',
        correo: 'correo@ejemplo.com',
        sueldo: 1000,
    });
    console.log(empleadoCreado);
} catch (error) {
    console.error('Algo fallo al crear un empleado');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Actualizar un empleado
try {
    const empleadoActualizado = await putEmpleado(1, {
        nombre_completo: 'Nombre Actualizado',
        fecha_nacimiento: '2001-01-01',
        dni: '2222222222',
        cargo: 'Jefe',
        contacto: '123456789',
        correo: 'correo@ejemplo.com',
        sueldo: 2000,
    });
    console.log(empleadoActualizado);
} catch (error) {
    console.error('Algo fallo al actualizar un empleado');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Eliminar un empleado
try {
    const empleadoEliminado = await deleteEmpleado(1);
    console.log(empleadoEliminado);
} catch (error) {
    console.error('Algo fallo al eliminar un empleado');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}