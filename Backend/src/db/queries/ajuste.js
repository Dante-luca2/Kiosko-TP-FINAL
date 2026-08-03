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
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `INSERT INTO ajuste (producto_id, empleado_id, cantidad, motivo)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [producto_id, empleado_id, cantidad, motivo]
    );

    await client.query('UPDATE producto SET stock = stock + $1 WHERE id = $2', [cantidad, producto_id]);

    await client.query('COMMIT');
    return rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function remove(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { rows: ajusteRows } = await client.query('SELECT * FROM ajuste WHERE id = $1', [id]);
    const ajuste = ajusteRows[0];
    if (!ajuste) {
      await client.query('ROLLBACK');
      return null;
    }

    await client.query('UPDATE producto SET stock = stock - $1 WHERE id = $2', [ajuste.cantidad, ajuste.producto_id]);
    await client.query('DELETE FROM ajuste WHERE id = $1', [id]);

    await client.query('COMMIT');
    return ajuste;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { getAll, getById, create, remove };