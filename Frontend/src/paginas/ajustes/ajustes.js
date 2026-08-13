import { renderNav } from '../../componentes/slidebar.js';
import { getAjustes, postAjuste, deleteAjuste } from '../../servicios/ajustes.js';
import { getProductos } from '../../servicios/productos.js';
import { getEmpleados } from '../../servicios/empleados.js';

// EL APARTADO DEL SLIDEBAR

document.querySelector('#slidebar').innerHTML = renderNav('movimientos');

let ajustes = [];

// EL APARTADO DE CARGA DE DATOS (productos, empleados y ajustes)

async function cargarDatos() {
    try {
        const [productos, empleados] = await Promise.all([
            getProductos(),
            getEmpleados(),
        ]);

        cargarSelect('#select-producto', productos, 'nombre');
        cargarSelect('#select-empleado', empleados, 'nombre_completo');

        cargarSelect('#select-producto-busqueda', productos, 'nombre', 'Todos los productos');
        cargarSelect('#select-empleado-busqueda', empleados, 'nombre_completo', 'Todos los empleados');

        await cargarAjustes();
    } catch (error) {
        console.error('Algo falló al pedir los datos base');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

function cargarSelect(selector, lista, campoNombre, etiquetaTodos = null) {
    const select = document.querySelector(selector);
    const opciones = lista.map(elemento => `<option value="${elemento.id}">${elemento[campoNombre]}</option>`).join('');
    select.innerHTML = etiquetaTodos ? `<option value="">${etiquetaTodos}</option>${opciones}` : opciones;
}

async function buscarAjuste(filtros) {
    try {
        ajustes = await getAjustes(filtros);
        render();
    } catch (error) {
        console.error('Algo falló al buscar ajustes');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function cargarAjustes() {
    try {
        ajustes = await getAjustes();
        render();
    } catch (error) {
        console.error('Algo falló al pedir los ajustes');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

// EL APARTADO DE CREAR Y ELIMINAR (llamadas al backend)

async function crearAjuste(datos) {
    try {
        await postAjuste(datos);
        await cargarAjustes();
        mostrarToast('Ajuste creado correctamente');
    } catch (error) {
        console.error('Algo falló al crear un ajuste');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
        mostrarToast('No se pudo crear el ajuste', 'error');
    }
}

async function eliminarAjuste(id) {
    try {
        await deleteAjuste(id);
        await cargarAjustes();
        mostrarToast('Ajuste eliminado correctamente');
    } catch (error) {
        console.error('Algo falló al eliminar un ajuste');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
        mostrarToast('No se pudo eliminar el ajuste', 'error');
    }
}

// EL APARTADO DE LA BARRA DE BUSQUEDA

document.querySelector('#boton-busqueda').addEventListener('click', () => {
    const filtros = {
        producto_id: document.querySelector('#select-producto-busqueda').value,
        empleado_id: document.querySelector('#select-empleado-busqueda').value,
    };
    buscarAjuste(filtros);
});

// EL APARTADO DE RENDERIZAR LA TABLA

function render() {
    const tbody = document.querySelector('#tabla-ajustes');
    tbody.innerHTML = ajustes.map(elemento => `
        <tr>
            <td>${elemento.producto_nombre}</td>
            <td>${elemento.empleado_nombre}</td>
            <td>${elemento.cantidad}</td>
            <td>${elemento.motivo}</td>
            <td>${new Date(elemento.fecha).toLocaleDateString('es-AR')}</td>
            <td class="celda-acciones">
                <button class="boton-accion eliminar" data-id="${elemento.id}">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// EL APARTADO DE LOS MENSAJES TOAST

function mostrarToast(mensaje, tipo = 'exito') {
    const toast = document.querySelector('#toast');
    const icono = tipo === 'exito' ? '✓' : '✕';
    toast.textContent = `${icono} ${mensaje}`;
    toast.className = `toast ${tipo}`;

    setTimeout(() => {
        toast.classList.add('oculto');
    }, 3000);
}

// EL APARTADO DEL MODAL DE CREAR AJUSTE (eventos)

const modalAñadir = document.querySelector('#modal-registrar-ajuste');
const formAñadir = document.querySelector('#form-registrar-ajuste');
const botonNuevo = document.querySelector('#boton-nuevo');

botonNuevo.addEventListener('click', () => {
    modalAñadir.classList.remove('oculto');
});

document.querySelector('#cerrar-modal-ajuste').addEventListener('click', () => {
    modalAñadir.classList.add('oculto');
});

document.querySelector('#cancelar-modal-ajuste').addEventListener('click', () => {
    modalAñadir.classList.add('oculto');
});

formAñadir.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        producto_id: formAñadir.elements.producto_id.value,
        empleado_id: formAñadir.elements.empleado_id.value,
        cantidad: formAñadir.elements.cantidad.value,
        motivo: formAñadir.elements.motivo.value,
    };

    await crearAjuste(datos);
    modalAñadir.classList.add('oculto');
});

// EL APARTADO DEL MODAL DE CONFIRMAR ELIMINAR (eventos)

const modalEliminar = document.querySelector('#modal-eliminar-ajuste');
const mensajeEliminar = document.querySelector('#mensaje-eliminar-ajuste');
let idAEliminar = null;

document.querySelector('#tabla-ajustes').addEventListener('click', (e) => {
    const boton = e.target.closest('button');
    if (!boton) return;

    idAEliminar = boton.dataset.id;
    const ajuste = ajustes.find(a => a.id == idAEliminar);
    mensajeEliminar.textContent = `Esta acción no se puede deshacer. Se va a eliminar el ajuste de ${ajuste.producto_nombre} (${ajuste.cantidad}) registrado el ${new Date(ajuste.fecha).toLocaleDateString('es-AR')}.`;
    modalEliminar.classList.remove('oculto');
});

document.querySelector('#cancelar-eliminar-ajuste').addEventListener('click', () => {
    modalEliminar.classList.add('oculto');
    idAEliminar = null;
});

document.querySelector('#confirmar-eliminar-ajuste').addEventListener('click', async () => {
    await eliminarAjuste(idAEliminar);
    modalEliminar.classList.add('oculto');
    idAEliminar = null;
});

// INICIO

cargarDatos();