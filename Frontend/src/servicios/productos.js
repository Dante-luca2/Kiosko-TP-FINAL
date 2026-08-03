import { api } from './cliente/api.js'

// Productos

// GET /productos
export async function getProductos(filtros = {}) {
    const respuesta = await api.get('/productos', { params: filtros });
    return respuesta.data;
}

// GET /productos/{productoId}
export async function getProducto(productoId){
    const respuesta = await api.get(`/productos/${productoId}`);
    return respuesta.data;
}

// POST /productos
export async function postProducto(datos){
    const respuesta = await api.post('/productos', datos);
    return respuesta.data;
}

// PUT /productos/{productoId}
export async function putProducto(productoId, datos){
    const respuesta = await api.put(`/productos/${productoId}`, datos);
    return respuesta.data;
}

// DELETE /productos/{productoId}
export async function deleteProducto(productoId){
    const respuesta = await api.delete(`/productos/${productoId}`);
    return respuesta.data;    
}