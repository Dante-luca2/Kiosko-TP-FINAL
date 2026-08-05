const pool = require('../pool');

async function getAll({ nombre } = {}) {
    const condiciones = ['activo = true'];
    const valores = [];

    if (nombre) {
        valores.push(`%${nombre}%`);   // $ = cualquier cosa antes o después
        condiciones.push (`nombre ILIKE $${valores.length}`); // ILIKE es como LIKE pero sin importar mayúsculas/minúsculas (LIKE es el operador de SQL para buscar texto que "se parece" a un patrón, 
        // en vez de tener que ser exactamente igual)
    }

    const query = `SELECT * FROM proveedor WHERE ${condiciones.join(' AND ')} ORDER BY id`;
    const { rows } = await pool.query(query, valores);
    return rows;
}

async function getById(id) {
    const { rows } = await pool.query('SELECT * FROM proveedor WHERE id = $1', [id]);
    return rows[0];
}

async function create(data) {
    const { nombre, contacto, telefono, rubro, direccion } = data;
    const { rows } = await pool.query(
        'INSERT INTO proveedor (nombre, contacto, telefono, rubro, direccion) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nombre, contacto, telefono, rubro, direccion]
    );
    return rows[0];
}

async function update(id, data) {
    const { nombre, contacto, telefono, rubro, direccion } = data;
    const { rows } = await pool.query(
        'UPDATE proveedor SET nombre = $1, contacto = $2, telefono = $3, rubro = $4, direccion = $5 WHERE id = $6 RETURNING *',
        [nombre, contacto, telefono, rubro, direccion, id]
    );
    return rows[0];
}

async function softDelete(id) {
    const { rows } = await pool.query(
        'UPDATE proveedor SET activo = false WHERE id = $1 RETURNING *',
        [id]
    );
    return rows[0];
}

module.exports = { getAll, getById, create, update, softDelete };
