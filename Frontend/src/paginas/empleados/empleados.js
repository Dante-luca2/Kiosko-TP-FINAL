import { renderNav } from '../../componentes/slidebar.js';
import { getEmpleados, deleteEmpleado, postEmpleado, putEmpleado } from '../../servicios/empleados.js';

// EL APARTADO DEL SLIDEBAR

document.querySelector('#slidebar').innerHTML = renderNav('empleados');

// FUNCIONES DE LOS SERVICIOS

let empleados = [];

async function cargarEmpleados() {
    try {
        empleados = await getEmpleados();
        render();
    } catch (error) {
        console.error('Algo falló al pedir los empleados');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function crearEmpleado(datos) {
    try {
        await postEmpleado(datos);
        await cargarEmpleados();
        mostrarToast('Empleado creado correctamente');
    } catch (error) {
        console.error('Algo falló al crear un empleado');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function editarEmpleado(id, datos) {
    try {
        await putEmpleado(id, datos);
        await cargarEmpleados();
        mostrarToast('Empleado actualizado correctamente');
    } catch (error) {
        console.error('Algo falló al actualizar un empleado');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function eliminarEmpleado(id) {
    try {
        await deleteEmpleado(id);
        await cargarEmpleados();
        mostrarToast('Empleado eliminado correctamente');
    } catch (error) {
        console.error('Algo falló al eliminar un empleado');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}


// FUNCION QUE RENDERIZA LA TABLA DE EMPLEADOS

function render() {
    const tbody = document.querySelector('#tabla-empleados');
    tbody.innerHTML = empleados.map(elemento => `
        <tr>
            <td>${elemento.nombre_completo}${elemento.es_dueño ? ' <strong>(Dueño)</strong>' : ''}</td>
            <td>${elemento.cargo}</td>
            <td>${elemento.dni}</td>
            <td>${elemento.contacto}</td>
            <td>$${elemento.sueldo}</td>
            <td class="celda-acciones">
                <button class="boton-accion" data-id="${elemento.id}" data-accion="editar">Editar</button>
                <button class="boton-accion eliminar" data-id="${elemento.id}" data-accion="eliminar">Eliminar</button>
            </td>
        </tr>
    `).join('');
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

// EL APARTADO DE LOS MODALES (abrir / cerrar)

const modalAñadir = document.querySelector('#modal-añadir-empleado');
const modalModificar = document.querySelector('#modal-modificar-empleado');
const modalEliminar = document.querySelector('#modal-eliminar-empleado');
const mensajeEliminar = document.querySelector('#mensaje-eliminar');
const botonNuevo = document.querySelector('#boton-nuevo');
const formAñadir = document.querySelector('#form-añadir-empleado');
const formModificar = document.querySelector('#form-modificar-empleado');

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
    await eliminarEmpleado(idAEliminar);
    modalEliminar.classList.add('oculto');
    idAEliminar = null;
});

// EL APARTADO DE LOS SUBMIT DE LOS FORMULARIOS

formAñadir.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre_completo: formAñadir.elements.nombre_completo.value,
        fecha_nacimiento: formAñadir.elements.fecha_nacimiento.value,
        dni: formAñadir.elements.dni.value,
        cargo: formAñadir.elements.cargo.value,
        contacto: formAñadir.elements.contacto.value,
        correo: formAñadir.elements.correo.value,
        sueldo: formAñadir.elements.sueldo.value,
    };

    await crearEmpleado(datos);
    modalAñadir.classList.add('oculto');
});

formModificar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre_completo: formModificar.elements.nombre_completo.value,
        fecha_nacimiento: formModificar.elements.fecha_nacimiento.value,
        dni: formModificar.elements.dni.value,
        cargo: formModificar.elements.cargo.value,
        contacto: formModificar.elements.contacto.value,
        correo: formModificar.elements.correo.value,
        sueldo: formModificar.elements.sueldo.value,
    };

    await editarEmpleado(idAEditar, datos);
    modalModificar.classList.add('oculto');
});

// EL APARTADO DE ACCIONES DE LA TABLA (editar / eliminar)

document.querySelector('#tabla-empleados').addEventListener('click', (e) => {
    const boton = e.target.closest('button');
    if (!boton) return;

    const id = boton.dataset.id;

    if (boton.dataset.accion === 'eliminar') {
        const empleado = empleados.find(emp => emp.id == id);
        idAEliminar = id;
        mensajeEliminar.textContent = `Esta acción no se puede deshacer. Se va a eliminar a ${empleado.nombre_completo} del sistema.`;
        modalEliminar.classList.remove('oculto');
    }

    if (boton.dataset.accion === 'editar') {
        const empleado = empleados.find(emp => emp.id == id);
        idAEditar = id;

        formModificar.elements.nombre_completo.value = empleado.nombre_completo;
        formModificar.elements.fecha_nacimiento.value = empleado.fecha_nacimiento.slice(0, 10);
        formModificar.elements.dni.value = empleado.dni;
        formModificar.elements.cargo.value = empleado.cargo;
        formModificar.elements.contacto.value = empleado.contacto;
        formModificar.elements.correo.value = empleado.correo;
        formModificar.elements.sueldo.value = empleado.sueldo;

        modalModificar.classList.remove('oculto');
    }
});

cargarEmpleados();