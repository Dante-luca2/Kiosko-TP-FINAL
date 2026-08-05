const pool = require('../pool');

async function getAll({ producto_id, empleado_id } = {}) {
  const condiciones = [];
  const valores = [];

  if (producto_id) {
    valores.push(producto_id);
    condiciones.push(`producto_id = $${valores.length}`);
  }
  if (empleado_id) {
    valores.push(empleado_id);
    condiciones.push(`empleado_id = $${valores.length}`);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const query = `SELECT * FROM ajuste ${where} ORDER BY fecha DESC`;
  const { rows } = await pool.query(query, valores);
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query('SELECT * FROM ajuste WHERE id = $1', [id]);
  return rows[0];
}

async function create({ producto_id, empleado_id, cantidad, motivo }) {
  const { rows } = await pool.query(
    `INSERT INTO ajuste (producto_id, empleado_id, cantidad, motivo)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [producto_id, empleado_id, cantidad, motivo]
  );

  await pool.query('UPDATE producto SET stock = stock + $1 WHERE id = $2', [cantidad, producto_id]);

  return rows[0];
}

async function remove(id) {
  const { rows: ajusteRows } = await pool.query('SELECT * FROM ajuste WHERE id = $1', [id]);
  const ajuste = ajusteRows[0];
  if (!ajuste) return null;

  await pool.query('UPDATE producto SET stock = stock - $1 WHERE id = $2', [ajuste.cantidad, ajuste.producto_id]);
  await pool.query('DELETE FROM ajuste WHERE id = $1', [id]);

  return ajuste;
}

module.exports = { getAll, getById, create, remove };