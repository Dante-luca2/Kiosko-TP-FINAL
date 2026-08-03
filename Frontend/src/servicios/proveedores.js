import { api } from './cliente/api.js'

// Proveedores

// GET /proveedores
export async function getProveedores(filtros = {}) {
    const respuesta = await api.get('/proveedores', { params: filtros });
    return respuesta.data;
}

// GET /proveedores/{proveedorId}
export async function getProveedor(proveedorId){
    const respuesta = await api.get(`/proveedores/${proveedorId}`);
    return respuesta.data;
}

// POST /proveedores
export async function postProveedor(datos){
    const respuesta = await api.post('/proveedores', datos);
    return respuesta.data;
}

// PUT /proveedores/{proveedorId}
export async function putProveedor(proveedorId, datos){
    const respuesta = await api.put(`/proveedores/${proveedorId}`, datos);
    return respuesta.data;
}

// DELETE /proveedores/{proveedorId}
export async function deleteProveedor(proveedorId){
    const respuesta = await api.delete(`/proveedores/${proveedorId}`);
    return respuesta.data;
}