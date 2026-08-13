import { api } from './cliente/api.js'

// Productos

// Arma la URL completa de una imagen a partir de la ruta relativa que guarda la BD (ej: "/uploads/123.jpg")
export function urlCompleta(imagenUrl) {
    if (!imagenUrl) return '';
    const origen = api.defaults.baseURL.replace(/\/api\/?$/, ''); // "http://localhost:3000"
    return `${origen}${imagenUrl}`;
}

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

// Convierte un objeto de datos (+ archivo opcional) a FormData
function construirFormData(datos, archivo) {
    const formData = new FormData();
    Object.entries(datos).forEach(([clave, valor]) => {
        if (valor !== undefined && valor !== null) {
            formData.append(clave, valor);
        }
    });
    if (archivo) {
        formData.append('imagen', archivo);
    }
    return formData;
}

// POST /productos
export async function postProducto(datos, archivo){
    const formData = construirFormData(datos, archivo);
    const respuesta = await api.post('/productos', formData);
    return respuesta.data;
}

// PUT /productos/{productoId}
export async function putProducto(productoId, datos, archivo){
    const formData = construirFormData(datos, archivo);
    const respuesta = await api.put(`/productos/${productoId}`, formData);
    return respuesta.data;
}

// DELETE /productos/{productoId}
export async function deleteProducto(productoId){
    const respuesta = await api.delete(`/productos/${productoId}`);
    return respuesta.data;    
}