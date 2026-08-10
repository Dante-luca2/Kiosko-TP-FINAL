import { renderNav } from '../../componentes/slidebar.js';
import { getVentas, postVenta, deleteVenta } from '../../servicios/ventas.js';
import { getProductos } from '../../servicios/productos.js';
import { getEmpleados } from '../../servicios/empleados.js';

// EL APARTADO DEL SLIDEBAR

document.querySelector('#slidebar').innerHTML = renderNav('movimientos');

let ventas = [];

// EL APARTADO DE CARGA DE DATOS (productos, empleados y ventas)

async function cargarDatos() {
    try {
        const [productos, empleados] = await Promise.all([
            getProductos(),
            getEmpleados(),
        ]);

        cargarSelect('#select-producto', productos, 'nombre');
        cargarSelect('#select-empleado', empleados, 'nombre_completo');

        await cargarVentas();
    } catch (error) {
        console.error('Algo falló al pedir los datos base');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

function cargarSelect(selector, lista, campoNombre) {
    const select = document.querySelector(selector);
    select.innerHTML = lista.map(elemento => `
        <option value="${elemento.id}">${elemento[campoNombre]}</option>
    `).join('');
}

async function cargarVentas() {
    try {
        ventas = await getVentas();
        render();
    } catch (error) {
        console.error('Algo falló al pedir las ventas');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

// EL APARTADO DE CREAR Y ELIMINAR (llamadas al backend)

async function crearVenta(datos) {
    try {
        await postVenta(datos);
        await cargarVentas();
        mostrarToast('Venta registrada correctamente');
    } catch (error) {
        console.error('Algo falló al crear una venta');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
        mostrarToast('No se pudo registrar la venta', 'error');
    }
}

async function eliminarVenta(id) {
    try {
        await deleteVenta(id);
        await cargarVentas();
        mostrarToast('Venta eliminada correctamente');
    } catch (error) {
        console.error('Algo falló al eliminar una venta');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
        mostrarToast('No se pudo eliminar la venta', 'error');
    }
}

// EL APARTADO DE RENDERIZAR LA TABLA

function render() {
    const tbody = document.querySelector('#tabla-ventas');
    tbody.innerHTML = ventas.map(elemento => `
        <tr>
            <td>${elemento.producto_nombre}</td>
            <td>${elemento.empleado_nombre}</td>
            <td>${elemento.cantidad}</td>
            <td>$${elemento.precio_unitario}</td>
            <td>$${elemento.descuento}</td>
            <td>$${(elemento.cantidad * elemento.precio_unitario) - elemento.descuento}</td>
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

// EL APARTADO DEL MODAL DE REGISTRAR VENTA (eventos)

const modalRegistrar = document.querySelector('#modal-registrar-venta');
const formRegistrar = document.querySelector('#form-registrar-venta');
const botonNuevo = document.querySelector('#boton-nuevo');

botonNuevo.addEventListener('click', () => {
    formRegistrar.reset();
    modalRegistrar.classList.remove('oculto');
});

document.querySelector('#cerrar-modal-venta').addEventListener('click', () => {
    modalRegistrar.classList.add('oculto');
});
document.querySelector('#cancelar-modal-venta').addEventListener('click', () => {
    modalRegistrar.classList.add('oculto');
});

formRegistrar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        producto_id: formRegistrar.elements.producto_id.value,
        empleado_id: formRegistrar.elements.empleado_id.value,
        cantidad: formRegistrar.elements.cantidad.value,
        precio_unitario: formRegistrar.elements.precio_unitario.value,
        descuento: formRegistrar.elements.descuento.value,
    };

    await crearVenta(datos);
    modalRegistrar.classList.add('oculto');
});

// EL APARTADO DEL MODAL DE CONFIRMAR ELIMINAR (eventos)

const modalEliminar = document.querySelector('#modal-eliminar-venta');
const mensajeEliminar = document.querySelector('#mensaje-eliminar-venta');
let idAEliminar = null;

document.querySelector('#tabla-ventas').addEventListener('click', (e) => {
    const boton = e.target.closest('button');
    if (!boton) return;

    idAEliminar = boton.dataset.id;
    const venta = ventas.find(v => v.id == idAEliminar);
    mensajeEliminar.textContent = `Esta acción no se puede deshacer. Se va a eliminar la venta de ${venta.producto_nombre} registrada el ${new Date(venta.fecha).toLocaleDateString('es-AR')}.`;
    modalEliminar.classList.remove('oculto');
});

document.querySelector('#cancelar-eliminar-venta').addEventListener('click', () => {
    modalEliminar.classList.add('oculto');
    idAEliminar = null;
});

document.querySelector('#confirmar-eliminar-venta').addEventListener('click', async () => {
    await eliminarVenta(idAEliminar);
    modalEliminar.classList.add('oculto');
    idAEliminar = null;
});

// INICIO

cargarDatos();