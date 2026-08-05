import { api } from './cliente/api.js'

// Ajustes

// GET /ajustes
export async function getAjustes(filtros = {}) {
    const respuesta = await api.get('/ajustes', { params: filtros });
    return respuesta.data;
}

// GET /ajustes/{ajusteId}
export async function getAjuste(ajusteId){
    const respuesta = await api.get(`/ajustes/${ajusteId}`);
    return respuesta.data;
}

// POST /ajustes
export async function postAjuste(datos){
    const respuesta = await api.post('/ajustes', datos);
    return respuesta.data;
}

// DELETE /ajustes/{ajusteId}
export async function deleteAjuste(ajusteId){
    const respuesta = await api.delete(`/ajustes/${ajusteId}`);
    return respuesta.data;
}