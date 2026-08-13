const pool = require('../pool');

async function getAll() {
  const query = `
    SELECT
      categoria.id,
      categoria.nombre,
      categoria.empleado_id,
      empleados.nombre_completo AS empleado_nombre
    FROM categoria
    JOIN empleados ON categoria.empleado_id = empleados.id
    ORDER BY categoria.id
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query('SELECT * FROM categoria WHERE id = $1', [id]);
  return rows[0];
}

async function create({ nombre, empleado_id }) {
  const { rows } = await pool.query(
    'INSERT INTO categoria (nombre, empleado_id) VALUES ($1, $2) RETURNING *',
    [nombre, empleado_id]
  );
  return rows[0];
}

async function update(id, { nombre }) {
  const { rows } = await pool.query(
    'UPDATE categoria SET nombre = $1 WHERE id = $2 RETURNING *',
    [nombre, id]
  );
  return rows[0];
}

async function remove(id) {
  const { rows } = await pool.query('DELETE FROM categoria WHERE id = $1 RETURNING *', [id]);
  return rows[0];
}

module.exports = { getAll, getById, create, update, remove };