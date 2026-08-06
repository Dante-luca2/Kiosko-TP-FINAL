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