import { api } from './cliente/api.js'

// Categorias

// GET /categorias
export async function getCategorias() {
    const respuesta = await api.get('/categorias');
    return respuesta.data;
}

// GET /categorias/{categoriaId}
export async function getCategoria(categoriaId){
    const respuesta = await api.get(`/categorias/${categoriaId}`);
    return respuesta.data;
}

// POST /categorias
export async function postCategoria(datos){
    const respuesta = await api.post('/categorias', datos);
    return respuesta.data;
}

// PUT /categorias/{categoriaId}
export async function putCategoria(categoriaId, datos){
    const respuesta = await api.put(`/categorias/${categoriaId}`, datos);
    return respuesta.data;
}
