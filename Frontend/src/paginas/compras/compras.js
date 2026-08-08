import { renderNav } from '../../componentes/slidebar.js';
import { getCompras, postCompra, deleteCompra } from '../../servicios/compras.js';

// EL APARTADO DEL SLIDEBAR

document.querySelector('#slidebar').innerHTML = renderNav('movimientos');

let compras = [];

async function cargarCompras(){
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
    }
}

// FUNCION QUE RENDERIZA LA TABLA DE COMPRAS

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