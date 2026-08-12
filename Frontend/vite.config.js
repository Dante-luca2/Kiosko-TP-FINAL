import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        productos: resolve(__dirname, 'src/paginas/productos/productos.html'),
        compras: resolve(__dirname, 'src/paginas/compras/compras.html'),
        ventas: resolve(__dirname, 'src/paginas/ventas/ventas.html'),
        ajustes: resolve(__dirname, 'src/paginas/ajustes/ajustes.html'),
        empleados: resolve(__dirname, 'src/paginas/empleados/empleados.html'),
        categorias: resolve(__dirname, 'src/paginas/categorias/categorias.html'),
        proveedores: resolve(__dirname, 'src/paginas/proveedores/proveedores.html'),
      }
    }
  }
})
