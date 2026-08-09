const pool = require('../pool');

async function getAll({ producto_id, empleado_id } = {}) {
  const condiciones = [];
  const valores = [];

  if (producto_id) {
    valores.push(producto_id);
    condiciones.push(`venta.producto_id = $${valores.length}`);
  }
  if (empleado_id) {
    valores.push(empleado_id);
    condiciones.push(`venta.empleado_id = $${valores.length}`);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const query = `
    SELECT
      venta.id,
      venta.producto_id,
      producto.nombre AS producto_nombre,
      venta.empleado_id,
      empleados.nombre_completo AS empleado_nombre,
      venta.cantidad,
      venta.precio_unitario,
      venta.descuento,
      venta.fecha
    FROM venta
    JOIN producto ON venta.producto_id = producto.id
    JOIN empleados ON venta.empleado_id = empleados.id
    ${where}
    ORDER BY venta.fecha DESC
  `;
  const { rows } = await pool.query(query, valores);
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query('SELECT * FROM venta WHERE id = $1', [id]);
  return rows[0];
}

async function create({ producto_id, empleado_id, cantidad, precio_unitario, descuento = 0 }) {
  const { rows } = await pool.query(
    `INSERT INTO venta (producto_id, empleado_id, cantidad, precio_unitario, descuento)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [producto_id, empleado_id, cantidad, precio_unitario, descuento]
  );

  await pool.query('UPDATE producto SET stock = stock - $1 WHERE id = $2', [cantidad, producto_id]);

  return rows[0];
}

async function remove(id) {
  const { rows: ventaRows } = await pool.query('SELECT * FROM venta WHERE id = $1', [id]);
  const venta = ventaRows[0];
  if (!venta) return null;

  await pool.query('UPDATE producto SET stock = stock + $1 WHERE id = $2', [venta.cantidad, venta.producto_id]);
  await pool.query('DELETE FROM venta WHERE id = $1', [id]);

  return venta;
}

module.exports = { getAll, getById, create, remove };