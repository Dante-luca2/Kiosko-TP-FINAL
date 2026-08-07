  const proveedores = [
  { nombre: "Juan Pérez", contacto: "juan@correo.com", rubro: "Tecnología", telefono: "123456789" },
  { nombre: "María López", contacto: "maria@correo.com", rubro: "Alimentos", telefono: "987654321" },
  { nombre: "Carlos Gómez", contacto: "carlos@correo.com", rubro: "Transporte", telefono: "456789123" }
];

const lista = document.getElementById('listaProveedores');
const inputBusqueda = document.getElementById('busqueda');

// Función para mostrar proveedores filtrados
function mostrarProveedores(filtro = "") {
  lista.innerHTML = ""; // limpiar lista
  proveedores
    .filter(p => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
    .forEach(proveedor => {
      const li = document.createElement('li');
      li.textContent = `Nombre: ${proveedor.nombre}, Contacto: ${proveedor.contacto}, Rubro: ${proveedor.rubro}, Teléfono: ${proveedor.telefono}`;
      lista.appendChild(li);
    });
}

// Mostrar todos al inicio
mostrarProveedores();

// Escuchar cambios en el input
inputBusqueda.addEventListener('input', (e) => {
  mostrarProveedores(e.target.value);
});