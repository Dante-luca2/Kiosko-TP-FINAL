const pool = require('../pool'); 

async function getAll({marca, tipo, categoria_id} = {}) {
    const condiciones = ['producto.activo = true'];
    const valores = [];

    if(marca){
        valores.push(`%${marca}%`);   // $ = cualquier cosa antes o después
        condiciones.push (`producto.marca ILIKE $${valores.length}`); // ILIKE es como LIKE pero sin importar mayúsculas/minúsculas (LIKE es el operador de SQL para buscar texto que "se parece" a un patrón, 
        // en vez de tener que ser exactamente igual)
    }
    // ahora valores.length es 1
    // arma "marca ILIKE $1"

    if (tipo) {
    valores.push(tipo);
    condiciones.push(`producto.tipo = $${valores.length}`);
  }
  if (categoria_id) {
    valores.push(categoria_id);
    condiciones.push(`producto.categoria_id = $${valores.length}`);
  }

  const query = `
    SELECT producto.*, categoria.nombre AS categoria_nombre
    FROM producto
    JOIN categoria ON producto.categoria_id = categoria.id
    WHERE ${condiciones.join(' AND ')}
    ORDER BY producto.id
  `;
  const { rows } = await pool.query(query, valores);
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query(
    `SELECT producto.*, categoria.nombre AS categoria_nombre
     FROM producto
     JOIN categoria ON producto.categoria_id = categoria.id
     WHERE producto.id = $1`,
    [id]
  );
  return rows[0];
}

async function create(data) {
  const { nombre, descripcion, marca, precio, stock, categoria_id, tipo, stock_minimo, imagen_url } = data;
  const { rows } = await pool.query(
    `INSERT INTO producto (nombre, descripcion, marca, precio, stock, categoria_id, tipo, stock_minimo, imagen_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [nombre, descripcion, marca, precio, stock, categoria_id, tipo, stock_minimo, imagen_url]
  );
  return rows[0];
}

async function update(id, data) {
  const { nombre, descripcion, marca, precio, stock, categoria_id, tipo, stock_minimo, imagen_url } = data;
  const { rows } = await pool.query(
    `UPDATE producto
     SET nombre = $1, descripcion = $2, marca = $3, precio = $4, stock = $5,
         categoria_id = $6, tipo = $7, stock_minimo = $8, imagen_url = $9
     WHERE id = $10
     RETURNING *`,
    [nombre, descripcion, marca, precio, stock, categoria_id, tipo, stock_minimo, imagen_url, id]
  );
  return rows[0];
}

async function softDelete(id) {
  const { rows } = await pool.query(
    'UPDATE producto SET activo = false WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0];
}

module.exports = { getAll, getById, create, update, softDelete };