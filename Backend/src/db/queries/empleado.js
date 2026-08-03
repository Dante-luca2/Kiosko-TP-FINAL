const pool = require('../pool');

async function getAll({ nombre } = {}) {
  const condiciones = ['activo = true'];
  const valores = [];

  if (nombre) {
    valores.push(`%${nombre}%`);
    condiciones.push(`nombre_completo ILIKE $${valores.length}`);
  }

  const query = `SELECT * FROM empleados WHERE ${condiciones.join(' AND ')} ORDER BY id`;
  const { rows } = await pool.query(query, valores);
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query('SELECT * FROM empleados WHERE id = $1', [id]);
  return rows[0];
}

async function create(data) {
  const { nombre_completo, fecha_nacimiento, dni, cargo, contacto, correo, sueldo } = data;
  const { rows } = await pool.query(
    `INSERT INTO empleados (nombre_completo, fecha_nacimiento, dni, cargo, contacto, correo, sueldo)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [nombre_completo, fecha_nacimiento, dni, cargo, contacto, correo, sueldo ?? 0]
  );
  return rows[0];
}

async function update(id, data) {
  const { nombre_completo, fecha_nacimiento, dni, cargo, contacto, correo, sueldo } = data;
  const { rows } = await pool.query(
    `UPDATE empleados
     SET nombre_completo = $1, fecha_nacimiento = $2, dni = $3, cargo = $4,
         contacto = $5, correo = $6, sueldo = $7
     WHERE id = $8
     RETURNING *`,
    [nombre_completo, fecha_nacimiento, dni, cargo, contacto, correo, sueldo ?? 0, id]
  );
  return rows[0];
}

async function softDelete(id) {
  const { rows } = await pool.query(
    'UPDATE empleados SET activo = false WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0];
}

module.exports = { getAll, getById, create, update, softDelete };