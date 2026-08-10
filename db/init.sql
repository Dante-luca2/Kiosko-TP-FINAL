--Orden de creación: categoria, proveedor y empleados van primero porque no dependen de nadie; producto depende de categoria; y venta/compra/ajuste van al final 
--porque dependen de producto, proveedor y empleados.


-- PROVEEDOR

CREATE TABLE proveedor (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(30),
    rubro VARCHAR(50),
    direccion VARCHAR(150),
    activo BOOLEAN NOT NULL DEFAULT TRUE 
);


-- EMPLEADOS

CREATE TABLE empleados (
    id SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    fecha_nacimiento DATE,
    dni VARCHAR(20) NOT NULL UNIQUE,
    cargo VARCHAR(50),
    contacto VARCHAR(30),
    correo VARCHAR(150) UNIQUE,
    sueldo INT NOT NULL DEFAULT 0 CHECK (sueldo >= 0),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- CATEGORÍA

CREATE TABLE categoria (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    empleado_id INT NOT NULL REFERENCES empleados(id) ON DELETE RESTRICT
);


-- PRODUCTO

CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500),
    marca VARCHAR(100),
    precio INT NOT NULL CHECK (precio >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    categoria_id INT REFERENCES categoria(id) ON DELETE RESTRICT,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('normal', 'limitado', 'estacional')),
    stock_minimo INT NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    imagen_url VARCHAR(255),
    activo BOOLEAN NOT NULL DEFAULT TRUE
);


-- VENTA

CREATE TABLE venta (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
    empleado_id INT NOT NULL REFERENCES empleados(id) ON DELETE RESTRICT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario INT NOT NULL CHECK (precio_unitario >= 0),
    descuento INT NOT NULL DEFAULT 0 CHECK (descuento >= 0),
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- COMPRA

CREATE TABLE compra (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
    proveedor_id INT REFERENCES proveedor(id) ON DELETE SET NULL,
    empleado_id INT NOT NULL REFERENCES empleados(id) ON DELETE RESTRICT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario INT NOT NULL CHECK (precio_unitario >= 0),
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AJUSTE

CREATE TABLE ajuste (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
    empleado_id INT NOT NULL REFERENCES empleados(id) ON DELETE RESTRICT,
    cantidad INT NOT NULL CHECK (cantidad <> 0),
    motivo VARCHAR(255) NOT NULL,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- DATOS DE PRUEBA (opcional, para poder mostrar la app funcionando)



INSERT INTO proveedor (nombre, contacto, telefono, rubro, direccion) VALUES
    ('Distribuidora Norte', 'Juan Pérez', '11-4444-5555', 'Golosinas', 'Av. Siempre Viva 123'),
    ('Bebidas del Sur', 'Marta Gómez', '11-2222-3333', 'Bebidas', 'Calle Falsa 456');

INSERT INTO empleados (nombre_completo, fecha_nacimiento, dni, cargo, contacto, correo, sueldo) VALUES
    ('Dante Ortega', '2000-05-10', '40111222', 'Dueño', '11-5555-6666', 'dante@kiosco.com', 0),
    ('Ana López', '1998-03-22', '39222333', 'Empleada', '11-7777-8888', 'ana@kiosco.com', 350000);

INSERT INTO categoria (nombre, empleado_id) VALUES
    ('Golosinas', 1), ('Bebidas', 1), ('Cigarrillos', 1), ('Almacén', 1);

INSERT INTO producto (nombre, descripcion, marca, precio, stock, categoria_id, tipo, stock_minimo) VALUES
    ('Alfajor Triple', 'Alfajor de chocolate relleno', 'Havanna', 800, 15, 1, 'normal', 5),
    ('Gaseosa 500ml', 'Gaseosa cola', 'Coca-Cola', 1500, 3, 2, 'normal', 10),
    ('Sidra fin de año', 'Sidra dulce', 'Real', 3500, 8, 2, 'estacional', 0),
    ('Edición limitada de figuritas', 'Álbum mundial', 'Panini', 2000, 1, 1, 'limitado', 0);

INSERT INTO venta (producto_id, empleado_id, cantidad, precio_unitario, descuento) VALUES
    (1, 2, 5, 800, 0),
    (2, 2, 2, 1500, 100);

INSERT INTO compra (producto_id, proveedor_id, empleado_id, cantidad, precio_unitario) VALUES
    (1, 1, 1, 20, 700),
    (2, 2, 1, 10, 1300);

INSERT INTO ajuste (producto_id, empleado_id, cantidad, motivo) VALUES
    (4, 1, -1, 'Producto dañado, se descarta del stock');