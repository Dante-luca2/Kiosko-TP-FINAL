import { api } from './cliente/api.js'

// Empleados

// GET /empleados
export async function getEmpleados(filtros = {}) {
    const respuesta = await api.get('/empleados', { params: filtros });
    return respuesta.data;
}

// GET /empleados/{empleadoId}
export async function getEmpleado(empleadoId){
    const respuesta = await api.get(`/empleados/${empleadoId}`);
    return respuesta.data;
}

// POST /empleados
export async function postEmpleado(datos){
    const respuesta = await api.post('/empleados', datos);
    return respuesta.data;
}

// PUT /empleados/{empleadoId}
export async function putEmpleado(empleadoId, datos){
    const respuesta = await api.put(`/empleados/${empleadoId}`, datos);
    return respuesta.data;
}

// DELETE /empleados/{empleadoId}
export async function deleteEmpleado(empleadoId){
    const respuesta = await api.delete(`/empleados/${empleadoId}`);
    return respuesta.data;
}