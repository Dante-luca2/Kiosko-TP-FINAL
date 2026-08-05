
  const form = document.getElementById("formProveedores");
const lista = document.getElementById("listaProveedores");
const proveedores = [];

    form.addEventListener('submit',function (event) {
        event.preventDefault();
    
    
 const nombre = document.getElementById('nombre').value;
 const contacto = document.getElementById('contacto').value;
 const rubro = document.getElementById('rubro').value;
 const telefono = document.getElementById('telefono').value;

  const proveedor = { nombre, contacto, rubro, telefono };
  proveedores.push(proveedor);
 if(nombre === '' || contacto === '' || rubro === '' || telefono === ''){
    alert('Todos los campos son obligatorios');
    return;
 }else {
 
     const li = document.createElement("li");
  li.textContent = `Nombre: ${nombre}, Contacto: ${contacto}, Rubro: ${rubro}, Teléfono: ${telefono}`;
  lista.appendChild(li);

 }
 
form.reset();

    
})    