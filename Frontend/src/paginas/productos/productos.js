import { renderNav } from '../../componentes/slidebar.js';
import { getProductos, deleteProducto, postProducto, putProducto } from '../../servicios/productos.js';

// EL APARTADO DEL SLIDEBAR

document.querySelector('#slidebar').innerHTML = renderNav('productos');

// FUNCIONES DE LOS SERVICIOS

let producto = [];

async function cargarProductos() {
    try {
        producto = await getProductos();
        render();
    } catch (error) {
        console.error('Algo falló al cargar los productos');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function crearProducto(datos) {
    try {
        await postProducto(datos);
        await cargarProductos();
        mostrarToast('Producto creado correctamente');
    } catch (error) {
        console.error('Algo falló al cargar el producto');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function editarProducto(id, datos) {
    try {
        await putProducto(id, datos);
        await cargarProductos();
        mostrarToast('Producto editado correctamente');
    } catch (error) {
        console.error('Algo falló al editar el producto');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function eliminarProducto(id) {
    try {
        await deleteProducto(id);
        await cargarProductos();
        mostrarToast('Producto eliminado correctamente');
    } catch (error) {
        console.error('Algo falló al eliminar el producto');
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

// FUNCION QUE RENDERIZA LA TABLA DE PRODUCTOS

function render() {
    const tbody = document.querySelector('#tabla-producto');
    tbody.innerHTML = producto.map(elemento => `
        <tr>
            <td>${elemento.nombre}</td>
            <td>${elemento.descripcion}</td>
            <td>${elemento.marca}</td>
            <td>$${elemento.precio}</td>
            <td>${elemento.stock}</td>
            <td>${elemento.categoria_id}</td>
            <td>${elemento.tipo}</td>
            <td>${elemento.stock_minimo}</td>
            <td class="celda-acciones">
                <button class="boton-accion" data-id="${elemento.id}" data-accion="editar">Editar</button>
                <button class="boton-accion eliminar" data-id="${elemento.id}" data-accion="eliminar">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// EL APARTADO DE LOS MODALES (abrir / cerrar)

const modalAñadir = document.querySelector('#modal-añadir-producto');
const modalModificar = document.querySelector('#modal-modificar-producto');
const modalEliminar = document.querySelector('#modal-eliminar-producto');
const mensajeEliminar = document.querySelector('#mensaje-eliminar');
const botonNuevo = document.querySelector('#boton-nuevo');
const formAñadir = document.querySelector('#form-añadir-producto');
const formModificar = document.querySelector('#form-modificar-producto');

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
    await eliminarProducto(idAEliminar);
    modalEliminar.classList.add('oculto');
    idAEliminar = null;
});

// EL APARTADO DE LOS SUBMIT DE LOS FORMULARIOS


formAñadir.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: formAñadir.elements.nombre.value,
        descripcion: formAñadir.elements.descripcion.value,
        marca: formAñadir.elements.marca.value,
        precio: formAñadir.elements.precio.value,
        stock: formAñadir.elements.stock.value,
        categoria_id: formAñadir.elements.categoria_id.value,
        tipo: formAñadir.elements.tipo.value,
        stock_minimo: formAñadir.elements.stock_minimo.value,
    };

    await crearProducto(datos);
    modalAñadir.classList.add('oculto');
});
formModificar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: formModificar.elements.nombre.value,
        descripcion: formModificar.elements.descripcion.value,
        marca: formModificar.elements.marca.value,
        precio: formModificar.elements.precio.value,
        stock: formModificar.elements.stock.value,
        categoria_id: formModificar.elements.categoria_id.value,
        tipo: formModificar.elements.tipo.value,
        stock_minimo: formModificar.elements.stock_minimo.value,
    };

    await editarProducto(idAEditar, datos);
    modalModificar.classList.add('oculto');
});

// EL APARTADO DE ACCIONES DE LA TABLA (editar / eliminar)

document.querySelector('#tabla-producto').addEventListener('click', (e) => {
    const boton = e.target.closest('button');
    if (!boton) return;

    const id = boton.dataset.id;

    if (boton.dataset.accion === 'eliminar') {
        const productos = producto.find(emp => emp.id == id);
        idAEliminar = id;
        mensajeEliminar.textContent = `Esta acción no se puede deshacer. Se va a eliminar a ${producto.nombre} del sistema.`;
        modalEliminar.classList.remove('oculto');
    }

    if (boton.dataset.accion === 'editar') {
        const productos = producto.find(emp => emp.id == id);
        idAEditar = id;
        formModificar.elements.nombre.value = productos.nombre;
        formModificar.elements.descripcion.value = productos.descripcion;
        formModificar.elements.marca.value = productos.marca;
        formModificar.elements.precio.value = productos.precio;
        formModificar.elements.stock.value = productos.stock;
        formModificar.elements.categoria_id.value = productos.categoria_id;
        formModificar.elements.tipo.value = productos.tipo;
        formModificar.elements.stock_minimo.value = productos.stock_minimo;

        modalModificar.classList.remove('oculto');
    }
});

cargarProductos();