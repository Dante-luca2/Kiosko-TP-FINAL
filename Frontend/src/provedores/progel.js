  const proveedores = [
      { nombre: "Juan Pérez", contacto: "juan@correo.com", rubro: "Tecnología", telefono: "123456789" },
      { nombre: "María López", contacto: "maria@correo.com", rubro: "Alimentos", telefono: "987654321" },
      { nombre: "Carlos Gómez", contacto: "carlos@correo.com", rubro: "Transporte", telefono: "456789123" }
    ];

    // Seleccionamos el <ul> por su id
    const lista = document.getElementById('listaProveedores');

    // Recorremos el arreglo y mostramos la info
    proveedores.forEach(proveedor => {
      const li = document.createElement('li');
      li.textContent = `Nombre: ${proveedor.nombre}, Contacto: ${proveedor.contacto}, Rubro: ${proveedor.rubro}, Teléfono: ${proveedor.telefono}`;
      lista.appendChild(li);
    });