import { renderNav } from '../../componentes/slidebar.js';
import { getCategorias, postCategoria, putCategoria, deleteCategoria } from '../../servicios/categorias.js';
import { getEmpleados } from '../../servicios/empleados.js';

// EL APARTADO DEL SLIDEBAR

document.querySelector('#slidebar').innerHTML = renderNav('categorias');

// FUNCIONES DE LOS SERVICIOS

let categorias = [];
let empleados = [];

async function cargarCategorias() {
    try {
        categorias = await getCategorias();
        render();
    } catch (error) {
        console.error('Algo falló al pedir las categorías');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function cargarEmpleados() {
    try {
        empleados = await getEmpleados();
        const select = document.querySelector('#select-empleado');
        select.innerHTML = empleados.map(emp => `
            <option value="${emp.id}">${emp.nombre_completo}</option>
        `).join('');
    } catch (error) {
        console.error('Algo falló al pedir los empleados');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function crearCategoria(datos) {
    try {
        await postCategoria(datos);
        await cargarCategorias();
        mostrarToast('Categoría creada correctamente');
    } catch (error) {
        console.error('Algo falló al crear una categoría');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
        mostrarToast(error.response?.data?.error ?? 'No se pudo crear la categoría', 'error');
    }
}

async function editarCategoria(id, datos) {
    try {
        await putCategoria(id, datos);
        await cargarCategorias();
        mostrarToast('Categoría actualizada correctamente');
    } catch (error) {
        console.error('Algo falló al actualizar una categoría');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
        mostrarToast(error.response?.data?.error ?? 'No se pudo actualizar la categoría', 'error');
    }
}

async function eliminarCategoria(id) {
    try {
        await deleteCategoria(id);
        await cargarCategorias();
        mostrarToast('Categoría eliminada correctamente');
    } catch (error) {
        console.error('Algo falló al eliminar una categoría');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
        mostrarToast(error.response?.data?.error ?? 'No se pudo eliminar la categoría', 'error');
    }
}

// FUNCION MOSTRAR MENSAJE AL TOAST

function mostrarToast(mensaje, tipo = 'exito') {
    const toast = document.querySelector('#toast');
    const icono = tipo === 'exito' ? '✓' : '✕';
    toast.textContent = `${icono} ${mensaje}`;
    toast.className = `toast ${tipo}`;

    setTimeout(() => {
        toast.classList.add('oculto');
    }, 3000);
}

// FUNCION QUE RENDERIZA LA TABLA DE CATEGORIAS

function render() {
    const tbody = document.querySelector('#tabla-categorias');
    tbody.innerHTML = categorias.map(elemento => `
        <tr>
            <td>${elemento.nombre}</td>
            <td>${elemento.empleado_nombre}</td>
            <td class="celda-acciones">
                <button class="boton-accion" data-id="${elemento.id}" data-accion="editar">Editar</button>
                <button class="boton-accion eliminar" data-id="${elemento.id}" data-accion="eliminar">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// EL APARTADO DE LOS MODALES (abrir / cerrar)

const modalAñadir = document.querySelector('#modal-añadir-categoria');
const modalModificar = document.querySelector('#modal-modificar-categoria');
const modalEliminar = document.querySelector('#modal-eliminar-categoria');
const mensajeEliminar = document.querySelector('#mensaje-eliminar');
const botonNuevo = document.querySelector('#boton-nuevo');
const formAñadir = document.querySelector('#form-añadir-categoria');
const formModificar = document.querySelector('#form-modificar-categoria');

let idAEditar = null;
let idAEliminar = null;

botonNuevo.addEventListener('click', async () => {
    formAñadir.reset();
    await cargarEmpleados();
    modalAñadir.classList.remove('oculto');
});

document.querySelector('#cerrar-modal-añadir').addEventListener('click', () => {
    modalAñadir.classList.add('oculto');
});
document.querySelector('#cancelar-modal-añadir').addEventListener('click', () => {
    modalAñadir.classList.add('oculto');
});

document.querySelector('#cerrar-modal-modificar').addEventListener('click', () => {
    modalModificar.classList.add('oculto');
});
document.querySelector('#cancelar-modal-modificar').addEventListener('click', () => {
    modalModificar.classList.add('oculto');
});

document.querySelector('#cancelar-eliminar').addEventListener('click', () => {
    modalEliminar.classList.add('oculto');
    idAEliminar = null;
});

document.querySelector('#confirmar-eliminar').addEventListener('click', async () => {
    await eliminarCategoria(idAEliminar);
    modalEliminar.classList.add('oculto');
    idAEliminar = null;
});

// EL APARTADO DE LOS SUBMIT DE LOS FORMULARIOS

formAñadir.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: formAñadir.elements.nombre.value,
        empleado_id: formAñadir.elements.empleado_id.value,
    };

    await crearCategoria(datos);
    modalAñadir.classList.add('oculto');
});

formModificar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: formModificar.elements.nombre.value,
    };

    await editarCategoria(idAEditar, datos);
    modalModificar.classList.add('oculto');
});

// EL APARTADO DE ACCIONES DE LA TABLA (editar / eliminar)

document.querySelector('#tabla-categorias').addEventListener('click', (e) => {
    const boton = e.target.closest('button');
    if (!boton) return;

    const id = boton.dataset.id;

    if (boton.dataset.accion === 'eliminar') {
        const categoria = categorias.find(cat => cat.id == id);
        idAEliminar = id;
        mensajeEliminar.textContent = `Esta acción no se puede deshacer. Se va a eliminar la categoría "${categoria.nombre}".`;
        modalEliminar.classList.remove('oculto');
    }

    if (boton.dataset.accion === 'editar') {
        const categoria = categorias.find(cat => cat.id == id);
        idAEditar = id;

        formModificar.elements.nombre.value = categoria.nombre;

        modalModificar.classList.remove('oculto');
    }
});

cargarCategorias();