import { renderNav } from '../../componentes/slidebar.js';
import { getproveedores, deleteproveedores, postproveedores, putproveedores } from '../../servicios/proveedores.js';

// EL APARTADO DEL SLIDEBAR

document.querySelector('#slidebar').innerHTML = renderNav('proveedores');

// FUNCIONES DE LOS SERVICIOS

let proveedores = [];

async function cargarproveedores() {
    try {
        proveedores = await getproveedores();
        render();
    } catch (error) {
        console.error('Algo falló al pedir los proveedores');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function crearproveedor(datos) {
    try {
        await postproveedores(datos);
        await cargarproveedores();
        mostrarToast('Proveedor agregado  correctamente');
    } catch (error) {
        console.error('Algo falló al agregar al  proveedor');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function editarproveedor(id, datos) {
    try {
        await putproveedores(id, datos);
        await cargarproveedores();
        mostrarToast('Proveedor actualizado correctamente');
    } catch (error) {
        console.error('Algo falló al actualizar un proveedor');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function eliminarproveedor(id) {
    try {
        await deleteproveedores(id);
        await cargarproveedores();
        mostrarToast('Proveedor eliminado correctamente');
    } catch (error) {
        console.error('Algo falló al eliminar un proveedor');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
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

// FUNCION QUE RENDERIZA LA TABLA DE PROVEEDORES

function render() {
    const tbody = document.querySelector('#tabla-proveedores tbody');
    tbody.innerHTML = proveedores.map(elemento => `
        <tr>
            <td>${elemento.nombre}${elemento.es_dueño ? ' <strong>(Dueño)</strong>' : ''}</td>
            <td>${elemento.contacto}</td>
            <td>${elemento.telefono}</td>
            <td>${elemento.rubro}</td>
            <td>${elemento.direccion}</td>
            <td class="celda-acciones">
                <button class="boton-accion" data-id="${elemento.id}" data-accion="editar">Editar</button>
                <button class="boton-accion eliminar" data-id="${elemento.id}" data-accion="eliminar">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// EL APARTADO DE LOS MODALES (abrir / cerrar)

const modalAñadir = document.querySelector('#modal-añadir-proveedor');
const modalModificar = document.querySelector('#modal-modificar-proveedor');
const modalEliminar = document.querySelector('#modal-eliminar-proveedor');
const mensajeEliminar = document.querySelector('#mensaje-eliminar');
const botonNuevo = document.querySelector('#boton-nuevo');
const formAñadir = document.querySelector('#form-añadir-proveedor');
const formModificar = document.querySelector('#form-modificar-proveedor');

let idAEditar = null;
let idAEliminar = null;

botonNuevo.addEventListener('click', () => {
    formAñadir.reset();
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
    await eliminarproveedor(idAEliminar);
    modalEliminar.classList.add('oculto');
    idAEliminar = null;
});

// EL APARTADO DE LOS SUBMIT DE LOS FORMULARIOS

formAñadir.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: formAñadir.elements.nombre.value,
        contacto: formAñadir.elements.contacto.value,
        telefono: formAñadir.elements.telefono.value,
        rubro: formAñadir.elements.rubro.value,
        direccion: formAñadir.elements.direccion.value,
    };

    await crearproveedor(datos);
    modalAñadir.classList.add('oculto');
});

formModificar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: formModificar.elements.nombre.value,
        contacto: formModificar.elements.contacto.value,
        telefono: formModificar.elements.telefono.value,
        rubro: formModificar.elements.rubro.value,
        direccion: formModificar.elements.direccion.value,
    };

    await editarproveedor(idAEditar, datos);
    modalModificar.classList.add('oculto');
});

// EL APARTADO DE ACCIONES DE LA TABLA (editar / eliminar)

document.querySelector('#tabla-proveedores').addEventListener('click', (e) => {
    const boton = e.target.closest('button');
    if (!boton) return;

    const id = boton.dataset.id;

    if (boton.dataset.accion === 'eliminar') {
        const proveedor = proveedores.find(prov => prov.id == id);
        idAEliminar = id;
        mensajeEliminar.textContent = `Esta acción no se puede deshacer. Se va a eliminar a ${proveedor.nombre} del sistema.`;
        modalEliminar.classList.remove('oculto');
    }

    if (boton.dataset.accion === 'editar') {
        const proveedor = proveedores.find(prov => prov.id == id);
        idAEditar = id;

        formModificar.elements.nombre.value = proveedor.nombre;
        formModificar.elements.contacto.value = proveedor.contacto;
        formModificar.elements.telefono.value = proveedor.telefono;
        formModificar.elements.rubro.value = proveedor.rubro;
        formModificar.elements.direccion.value = proveedor.direccion;

        modalModificar.classList.remove('oculto');
    }
});

cargarproveedores();