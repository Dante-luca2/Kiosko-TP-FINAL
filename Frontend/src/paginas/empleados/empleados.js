import { renderNav } from '../../componentes/slidebar.js';
import { getEmpleados, deleteEmpleado } from '../../servicios/empleados.js';

document.querySelector('#slidebar').innerHTML = renderNav('empleados');

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

function render() {
    const tbody = document.querySelector('#tabla-empleados');
    tbody.innerHTML = empleados.map(e => `
        <tr>
            <td>${e.nombre_completo}${e.es_dueño ? ' <strong>(Dueño)</strong>' : ''}</td>
            <td>${e.cargo}</td>
            <td>${e.dni}</td>
            <td>${e.contacto}</td>
            <td>$${e.sueldo}</td>
            <td class="celda-acciones">
                <button class="boton-accion" data-id="${e.id}" data-accion="editar">Editar</button>
                <button class="boton-accion eliminar" data-id="${e.id}" data-accion="eliminar">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

document.querySelector('#tabla-empleados').addEventListener('click', async (e) => {
    const boton = e.target.closest('button');
    if (!boton) return;

    const id = boton.dataset.id;

    if (boton.dataset.accion === 'eliminar') {
        try {
            await deleteEmpleado(id);
            empleados = empleados.filter(emp => emp.id != id);
            render();
        } catch (error) {
            console.error('Algo falló al eliminar el empleado');
            console.error('Status:', error.response?.status);
            console.error('Mensaje:', error.response?.data);
        }
    }

    if (boton.dataset.accion === 'editar') {
        console.log('Falta armar el formulario de edición para el empleado', id);
    }
});

cargarEmpleados();