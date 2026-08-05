import { getCategorias, getCategoria, postCategoria, putCategoria } from './servicios/categorias.js'

// PRUEBA DE LOS SERVICIOS DE LA API CATEGORIAS

// Obtener todos las categorias
try {
    const categorias = await getCategorias();
    console.log(categorias);
} catch (error) {
    console.error('Algo fallo al pedir las categorias');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Obtener una categoria por id
try {
    const categoriaPorId = await getCategoria(1);
    console.log(categoriaPorId);
} catch (error) {
    console.error('Algo fallo al pedir la categoria por id');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Crear una categoria
try {
    const categoriaCreada = await postCategoria({
        nombre: 'ZAPITOS'
    });
    console.log(categoriaCreada);
} catch (error) {
    console.error('Algo fallo al crear una categoria');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}

// Actualizar una categoria
try {
    const categoriaActualizada = await putCategoria(1, {
        nombre: 'Snacks'
    });
    console.log(categoriaActualizada);
} catch (error) {
    console.error('Algo fallo al actualizar una categoria');
    console.error('Status:', error.response?.status);
    console.error('Mensaje:', error.response?.data);
}