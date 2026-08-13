import { renderNav } from '../../componentes/slidebar.js';
import { getCompras, postCompra, deleteCompra } from '../../servicios/compras.js';
import { getProductos } from '../../servicios/productos.js';
import { getProveedores } from '../../servicios/proveedores.js';
import { getEmpleados } from '../../servicios/empleados.js';

// EL APARTADO DEL SLIDEBAR

document.querySelector('#slidebar').innerHTML = renderNav('movimientos');

let compras = [];

// EL APARTADO DE CARGA DE DATOS (productos, proveedores, empleados y compras)

async function cargarDatos() {
    try {
        const [productos, proveedores, empleados] = await Promise.all([
            getProductos(),
            getProveedores(),
            getEmpleados(),
        ]);

        cargarSelect('#select-producto', productos, 'nombre');
        cargarSelect('#select-proveedor', proveedores, 'nombre');
        cargarSelect('#select-empleado', empleados, 'nombre_completo');

        cargarSelect('#select-producto-busqueda', productos, 'nombre', 'Todos los productos');
        cargarSelect('#select-proveedor-busqueda', proveedores, 'nombre', 'Todos los proveedores');
        cargarSelect('#select-empleado-busqueda', empleados, 'nombre_completo', 'Todos los empleados');

        await cargarCompras();
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

async function buscarCompra(filtros) {
    try {
        compras = await getCompras(filtros);
        render();
    } catch (error) {
        console.error('Algo falló al buscar compras');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

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

// EL APARTADO DE CREAR Y ELIMINAR (llamadas al backend)

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

async function eliminarCompra(id) {
    try {
        await deleteCompra(id);
        await cargarCompras();
        mostrarToast('Compra eliminada correctamente');
    } catch (error) {
        console.error('Algo falló al eliminar una compra');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
        mostrarToast(error.response?.data?.error || 'No se pudo eliminar la compra', 'error');
    }
}

// EL APARTADO DE LA BARRA DE BUSQUEDA

document.querySelector('#boton-busqueda').addEventListener('click', () => {
    const filtros = {
        producto_id: document.querySelector('#select-producto-busqueda').value,
        proveedor_id: document.querySelector('#select-proveedor-busqueda').value,
        empleado_id: document.querySelector('#select-empleado-busqueda').value,
    };
    buscarCompra(filtros);
});

// EL APARTADO DE RENDERIZAR LA TABLA

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

// EL APARTADO DEL MODAL DE CREAR COMPRA (eventos)

const modalAñadir = document.querySelector('#modal-registrar-compra');
const formAñadir = document.querySelector('#form-registrar-compra');
const botonNuevo = document.querySelector('#boton-nuevo');

botonNuevo.addEventListener('click', () => {
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

// EL APARTADO DEL MODAL DE CONFIRMAR ELIMINAR (eventos)

const modalEliminar = document.querySelector('#modal-eliminar-compra');
const mensajeEliminar = document.querySelector('#mensaje-eliminar-compra');
let idAEliminar = null;

document.querySelector('#tabla-compras').addEventListener('click', (e) => {
    const boton = e.target.closest('button');
    if (!boton) return;

    idAEliminar = boton.dataset.id;
    const compra = compras.find(c => c.id == idAEliminar);
    mensajeEliminar.textContent = `Esta acción no se puede deshacer. Se va a eliminar la compra de ${compra.producto_nombre} registrada el ${new Date(compra.fecha).toLocaleDateString('es-AR')}.`;
    modalEliminar.classList.remove('oculto');
});

document.querySelector('#cancelar-eliminar-compra').addEventListener('click', () => {
    modalEliminar.classList.add('oculto');
    idAEliminar = null;
});

document.querySelector('#confirmar-eliminar-compra').addEventListener('click', async () => {
    await eliminarCompra(idAEliminar);
    modalEliminar.classList.add('oculto');
    idAEliminar = null;
});

// INICIO

cargarDatos();