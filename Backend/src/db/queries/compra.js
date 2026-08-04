const pool = require('../pool');

async function getAll({ producto_id, proveedor_id, empleado_id } = {}) {
  const condiciones = [];
  const valores = [];

  if (producto_id) {
    valores.push(producto_id);
    condiciones.push(`producto_id = $${valores.length}`);
  }
  if (proveedor_id) {
    valores.push(proveedor_id);
    condiciones.push(`proveedor_id = $${valores.length}`);
  }
  if (empleado_id) {
    valores.push(empleado_id);
    condiciones.push(`empleado_id = $${valores.length}`);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const query = `SELECT * FROM compra ${where} ORDER BY fecha DESC`;
  const { rows } = await pool.query(query, valores);
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query('SELECT * FROM compra WHERE id = $1', [id]);
  return rows[0];
}

async function create({ producto_id, proveedor_id, empleado_id, cantidad, precio_unitario }) {
  const { rows } = await pool.query(
    `INSERT INTO compra (producto_id, proveedor_id, empleado_id, cantidad, precio_unitario)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [producto_id, proveedor_id, empleado_id, cantidad, precio_unitario]
  );

  await pool.query('UPDATE producto SET stock = stock + $1 WHERE id = $2', [cantidad, producto_id]);

  return rows[0];
}

async function remove(id) {
  const { rows: compraRows } = await pool.query('SELECT * FROM compra WHERE id = $1', [id]);
  const compra = compraRows[0];
  if (!compra) return null;

  await pool.query('UPDATE producto SET stock = stock - $1 WHERE id = $2', [compra.cantidad, compra.producto_id]);
  await pool.query('DELETE FROM compra WHERE id = $1', [id]);

  return compra;
}

module.exports = { getAll, getById, create, remove };