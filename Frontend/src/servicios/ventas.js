import { api } from './cliente/api.js'

// Ventas

// GET /ventas
export async function getVentas(filtros = {}) {
    const respuesta = await api.get('/ventas', { params: filtros });
    return respuesta.data;
}

// GET /ventas/{ventaId}
export async function getVenta(ventaId){
    const respuesta = await api.get(`/ventas/${ventaId}`);
    return respuesta.data;
}

// POST /ventas
export async function postVenta(datos){
    const respuesta = await api.post('/ventas', datos);
    return respuesta.data;
}

// DELETE /ventas/{ventaId}
export async function deleteVenta(ventaId){
    const respuesta = await api.delete(`/ventas/${ventaId}`);
    return respuesta.data;
}
