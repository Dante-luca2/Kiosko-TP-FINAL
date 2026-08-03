import { getProductos } from './servicios/productos.js'

const productos = await getProductos();
console.log(productos);