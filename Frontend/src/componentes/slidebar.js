export function renderNav(paginaActiva) {
    const links = [
        { href: '/src/paginas/productos/productos.html', id: 'productos', texto: 'Productos' },
        { href: '/src/paginas/ventas/ventas.html', id: 'movimientos', texto: 'Movimientos' },
        { href: '/src/paginas/proveedores/proveedores.html', id: 'proveedores', texto: 'Proveedores' },
        { href: '/src/paginas/empleados/empleados.html', id: 'empleados', texto: 'Empleados' },
        { href: '/src/paginas/categorias/categorias.html', id: 'categorias', texto: 'Categorías' },
    ];

    const items = links.map(link => `
        <a href="${link.href}" class="enlace-nav ${link.id === paginaActiva ? 'activo' : ''}">
            ${link.texto}
        </a>
    `).join('');

    return `
        <nav class="barra-lateral">
            <div class="barra-lateral-titulo">Kiosco</div>
            ${items}
        </nav>
    `;
}