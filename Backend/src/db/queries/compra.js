const pool = require('../pool');

async function getAll({ producto_id, proveedor_id, empleado_id } = {}) {
  const condiciones = [];
  const valores = [];

  if (producto_id) {
    valores.push(producto_id);
    condiciones.push(`compra.producto_id = $${valores.length}`);
  }
  if (proveedor_id) {
    valores.push(proveedor_id);
    condiciones.push(`compra.proveedor_id = $${valores.length}`);
  }
  if (empleado_id) {
    valores.push(empleado_id);
    condiciones.push(`compra.empleado_id = $${valores.length}`);
  }

  const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
  const query = `
    SELECT
      compra.id,
      compra.producto_id,
      producto.nombre AS producto_nombre,
      compra.proveedor_id,
      proveedor.nombre AS proveedor_nombre,
      compra.empleado_id,
      empleados.nombre_completo AS empleado_nombre,
      compra.cantidad,
      compra.precio_unitario,
      compra.fecha
    FROM compra
    JOIN producto ON compra.producto_id = producto.id
    LEFT JOIN proveedor ON compra.proveedor_id = proveedor.id 
    JOIN empleados ON compra.empleado_id = empleados.id
    ${where}
    ORDER BY compra.fecha DESC
  `;
  const { rows } = await pool.query(query, valores);
  return rows;
}

// Es LEFT JOIN en proveedor, Con JOIN normal (INNER), cualquier compra cuyo proveedor haya sido eliminado desaparecería directo del listado en vez de mostrarse con 
// proveedor_nombre: null. 
// producto y empleados sí pueden ser JOIN normal porque esos FK son NOT NULL + ON DELETE RESTRICT (nunca van a faltar).

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