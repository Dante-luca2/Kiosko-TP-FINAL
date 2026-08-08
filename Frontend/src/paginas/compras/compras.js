import { renderNav } from '../../componentes/slidebar.js';
import { getCompras, postCompra } from '../../servicios/compras.js';
import { getProductos } from '../../servicios/productos.js';
import { getProveedores } from '../../servicios/proveedores.js';
import { getEmpleados } from '../../servicios/empleados.js';

// EL APARTADO DEL SLIDEBAR

document.querySelector('#slidebar').innerHTML = renderNav('movimientos');

// EL APARTADO DE DATOS BASE (para poblar los selects del formulario)

let compras = [];

async function cargarDatos() {
    try {
        const [productos, proveedores, empleados] = await Promise.all([
            getProductos(),
            getProveedores(),
            getEmpleados(),
        ]);

        poblarSelect('#select-producto', productos, 'nombre');
        poblarSelect('#select-proveedor', proveedores, 'nombre');
        poblarSelect('#select-empleado', empleados, 'nombre_completo');

        await cargarCompras();
    } catch (error) {
        console.error('Algo falló al pedir los datos base');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

function poblarSelect(selector, lista, campoNombre) {
    const select = document.querySelector(selector);
    select.innerHTML = lista.map(elemento => `
        <option value="${elemento.id}">${elemento[campoNombre]}</option>
    `).join('');
}

// EL APARTADO DE LA TABLA DE COMPRAS

async function cargarCompras() {
    try {
        compras = await getCompras();
        render();
    } catch (error) {
        console.error('Algo falló al pedir las compras');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function crearCompra(datos) {
    try {
        await postCompra(datos);
        await cargarCompras();
        mostrarToast('Compra creada correctamente');
    } catch (error) {
        console.error('Algo falló al crear una compra');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
        mostrarToast('No se pudo crear la compra', 'error');
    }
}

function render() {
    const tbody = document.querySelector('#tabla-compras');
    tbody.innerHTML = compras.map(elemento => `
        <tr>
            <td>${elemento.producto_nombre}</td>
            <td>${elemento.proveedor_nombre}</td>
            <td>${elemento.empleado_nombre}</td>
            <td>${elemento.cantidad}</td>
            <td>$${elemento.precio_unitario}</td>
            <td>$${elemento.cantidad * elemento.precio_unitario}</td>
            <td>${new Date(elemento.fecha).toLocaleDateString('es-AR')}</td>
        </tr>
    `).join('');
}

// EL APARTADO DEL TOAST

function mostrarToast(mensaje, tipo = 'exito') {
    const toast = document.querySelector('#toast');
    const icono = tipo === 'exito' ? '✓' : '✕';
    toast.textContent = `${icono} ${mensaje}`;
    toast.className = `toast ${tipo}`;

    setTimeout(() => {
        toast.classList.add('oculto');
    }, 3000);
}

// EL APARTADO DEL MODAL DE CREACIÓN DE COMPRAS

const modalAñadir = document.querySelector('#modal-registrar-compra');
const formAñadir = document.querySelector('#form-registrar-compra');
const botonNuevo = document.querySelector('#boton-nuevo');

botonNuevo.addEventListener('click', () => {
    formAñadir.reset();
    modalAñadir.classList.remove('oculto');
});

document.querySelector('#cerrar-modal-compra').addEventListener('click', () => {
    modalAñadir.classList.add('oculto');
});
document.querySelector('#cancelar-modal-compra').addEventListener('click', () => {
    modalAñadir.classList.add('oculto');
});

formAñadir.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        producto_id: formAñadir.elements.producto_id.value,
        proveedor_id: formAñadir.elements.proveedor_id.value,
        empleado_id: formAñadir.elements.empleado_id.value,
        cantidad: formAñadir.elements.cantidad.value,
        precio_unitario: formAñadir.elements.precio_unitario.value,
    };

    await crearCompra(datos);
    modalAñadir.classList.add('oculto');
});

cargarDatos();