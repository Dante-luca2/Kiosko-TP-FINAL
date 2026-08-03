import { api } from './cliente/api.js'

// Compras

// GET /compras
export async function getCompras(filtros = {}) {
    const respuesta = await api.get('/compras', { params: filtros });
    return respuesta.data;
}

// GET /compras/{compraId}
export async function getCompra(compraId){
    const respuesta = await api.get(`/compras/${compraId}`);
    return respuesta.data;
}

// POST /compras
export async function postCompra(datos){
    const respuesta = await api.post('/compras', datos);
    return respuesta.data;
}

// DELETE /compras/{compraId}
export async function deleteCompra(compraId){
    const respuesta = await api.delete(`/compras/${compraId}`);
    return respuesta.data;
}