
-- PRODUCTO

CREATE TABLE producto (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio INT NOT NULL CHECK (precio >= 0),
    cantidad_actual INT NOT NULL DEFAULT 0 CHECK (cantidad_actual >= 0),
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('normal', 'limitado', 'estacional')),
    stock_minimo INT NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    imagen_url VARCHAR(255),
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- PROVEEDOR

CREATE TABLE proveedor (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contacto VARCHAR(100),
    telefono VARCHAR(30),
    rubro VARCHAR(50),
    direccion VARCHAR(150)
);


-- MOVIMIENTO

CREATE TABLE movimiento (
    id SERIAL PRIMARY KEY,
    producto_id INT NOT NULL REFERENCES producto(id) ON DELETE RESTRICT,
    proveedor_id INT REFERENCES proveedor(id) ON DELETE SET NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('venta', 'compra', 'regalo', 'ajuste')),
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario INT NOT NULL CHECK (precio_unitario >= 0),
    descuento INT NOT NULL DEFAULT 0 CHECK (descuento >= 0),
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--ESTO SE USARIA SI TUVIERAMOS MILLONES O MILES DE REGISTROS, ESTO SERVIRIA PARA ACELERAR LAS COSAS, EN VES DE ENTRAR Y REVISAR TODA LA TABLA LO QUE HACE EL INDICE ES Q BUSCA 
--ESPECIFICAMENTE ESA COLUMNA SI HUBIERAMOS UTILIZADO UN WHERE PARA TRAER ALGO EN PARTICULAR, EJEMPLO: WHERE producto_id = 3 (SIN INDEX REVISARIA TODA LA TABLA Q TENDRIA MILES DE REGISTROS).

--CREATE INDEX idx_movimiento_producto ON movimiento(producto_id);
--CREATE INDEX idx_movimiento_proveedor ON movimiento(proveedor_id);


-- DATOS DE PRUEBA (opcional)

INSERT INTO proveedor (nombre, contacto, telefono, rubro, direccion) VALUES
    ('Distribuidora Norte', 'Juan Pérez', '11-4444-5555', 'Golosinas', 'Av. Siempre Viva 123'),
    ('Bebidas del Sur', 'Marta Gómez', '11-2222-3333', 'Bebidas', 'Calle Falsa 456');

INSERT INTO producto (nombre, precio, cantidad_actual, tipo, stock_minimo) VALUES
    ('Alfajor Triple', 800, 15, 'normal', 5),
    ('Gaseosa 500ml', 1500, 3, 'normal', 10),
    ('Sidra fin de año', 3500, 8, 'estacional', 0),
    ('Edición limitada de figuritas', 2000, 1, 'limitado', 0);

INSERT INTO movimiento (producto_id, proveedor_id, tipo, cantidad, precio_unitario, descuento) VALUES
    (1, 1, 'compra', 20, 700, 0),
    (1, NULL, 'venta', 5, 800, 0),
    (2, 2, 'compra', 10, 1300, 0),
    (4, NULL, 'regalo', 1, 0, 0);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;