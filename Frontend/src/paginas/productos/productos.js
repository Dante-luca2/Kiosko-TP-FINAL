import { renderNav } from '../../componentes/slidebar.js';
import { getProductos, deleteProducto, postProducto, putProducto, urlCompleta } from '../../servicios/productos.js';
import { getCategorias } from '../../servicios/categorias.js';

// EL APARTADO DEL SLIDEBAR

document.querySelector('#slidebar').innerHTML = renderNav('productos');

// FUNCIONES DE LOS SERVICIOS

let producto = [];
let categorias = [];

async function cargarCategorias() {
    try {
        categorias = await getCategorias();
        const opciones = categorias.map(cat => `<option value="${cat.id}">${cat.nombre}</option>`).join('');
        document.querySelector('#select-categoria-añadir').innerHTML = opciones;
        document.querySelector('#select-categoria-modificar').innerHTML = opciones;
    } catch (error) {
        console.error('Algo falló al cargar las categorías');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

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

async function crearProducto(datos, archivo) {
    try {
        await postProducto(datos, archivo);
        await cargarProductos();
        mostrarToast('Producto creado correctamente');
    } catch (error) {
        console.error('Algo falló al cargar el producto');
        console.error('Status:', error.response?.status);
        console.error('Mensaje:', error.response?.data);
    }
}

async function editarProducto(id, datos, archivo) {
    try {
        await putProducto(id, datos, archivo);
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
            <td>${elemento.categoria_nombre}</td>
            <td>${elemento.tipo}</td>
            <td>${elemento.stock_minimo}</td>
            <td>
                ${elemento.imagen_url
                    ? `<button class="boton-accion" data-id="${elemento.id}" data-accion="ver-imagen">Ver imagen</button>`
                    : `<span>Sin imagen</span>`}
            </td>
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
const modalVerImagen = document.querySelector('#modal-ver-imagen');
const imagenGrande = document.querySelector('#imagen-grande');
const mensajeEliminar = document.querySelector('#mensaje-eliminar');
const botonNuevo = document.querySelector('#boton-nuevo');
const formAñadir = document.querySelector('#form-añadir-producto');
const formModificar = document.querySelector('#form-modificar-producto');

let idAEditar = null;
let idAEliminar = null;

botonNuevo.addEventListener('click', async () => {
    formAñadir.reset();
    document.querySelector('#nombre-archivo-añadir').textContent = 'Ningún archivo seleccionado';
    await cargarCategorias();
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

document.querySelector('#cerrar-modal-imagen').addEventListener('click', () => {
    modalVerImagen.classList.add('oculto');
    imagenGrande.src = '';
});

// EL APARTADO DEL NOMBRE DE ARCHIVO ELEGIDO (Imagen)

document.querySelector('#imagen-añadir').addEventListener('change', (e) => {
    const nombreArchivo = e.target.files[0]?.name || 'Ningún archivo seleccionado';
    document.querySelector('#nombre-archivo-añadir').textContent = nombreArchivo;
});

document.querySelector('#imagen-modificar').addEventListener('change', (e) => {
    const nombreArchivo = e.target.files[0]?.name || 'Ningún archivo seleccionado';
    document.querySelector('#nombre-archivo-modificar').textContent = nombreArchivo;
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
    const archivo = formAñadir.elements.imagen.files[0] || null;

    await crearProducto(datos, archivo);
    modalAñadir.classList.add('oculto');
});

formModificar.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombre: formModificar.elements.nombre.value,
        descripcion: formModificar.elements.descripcion.value,
        marca: formModificar.elements.marca.value,
        precio: formModificar.elements.precio.value,
        categoria_id: formModificar.elements.categoria_id.value,
        tipo: formModificar.elements.tipo.value,
        stock_minimo: formModificar.elements.stock_minimo.value,
        imagen_url: formModificar.elements.imagen_url.value, // se mantiene si no hay imagen nueva
    };
    const archivo = formModificar.elements.imagen.files[0] || null;

    await editarProducto(idAEditar, datos, archivo);
    modalModificar.classList.add('oculto');
});

// EL APARTADO DE ACCIONES DE LA TABLA (editar / eliminar / ver imagen)

document.querySelector('#tabla-producto').addEventListener('click', (e) => {
    const boton = e.target.closest('button');
    if (!boton) return;

    const id = boton.dataset.id;

    if (boton.dataset.accion === 'eliminar') {
        const productoEncontrado = producto.find(p => p.id == id);
        idAEliminar = id;
        mensajeEliminar.textContent = `Esta acción no se puede deshacer. Se va a eliminar a ${productoEncontrado.nombre} del sistema.`;
        modalEliminar.classList.remove('oculto');
    }

    if (boton.dataset.accion === 'editar') {
        const productoEncontrado = producto.find(p => p.id == id);
        idAEditar = id;
        formModificar.reset();
        cargarCategorias().then(() => {
            formModificar.elements.categoria_id.value = productoEncontrado.categoria_id;
        });
        formModificar.elements.nombre.value = productoEncontrado.nombre;
        formModificar.elements.descripcion.value = productoEncontrado.descripcion;
        formModificar.elements.marca.value = productoEncontrado.marca;
        formModificar.elements.precio.value = productoEncontrado.precio;
        document.querySelector('#stock-actual-info').textContent = productoEncontrado.stock;
        formModificar.elements.tipo.value = productoEncontrado.tipo;
        formModificar.elements.stock_minimo.value = productoEncontrado.stock_minimo;
        formModificar.elements.imagen_url.value = productoEncontrado.imagen_url || '';
        document.querySelector('#nombre-archivo-modificar').textContent = productoEncontrado.imagen_url
            ? `Imagen actual: ${productoEncontrado.imagen_url.split('/').pop()}`
            : 'Ningún archivo seleccionado';

        modalModificar.classList.remove('oculto');
    }

    if (boton.dataset.accion === 'ver-imagen') {
        const productoEncontrado = producto.find(p => p.id == id);
        imagenGrande.src = urlCompleta(productoEncontrado.imagen_url);
        modalVerImagen.classList.remove('oculto');
    }
});

cargarProductos();