const pool = require('../pool');

async function getAll() {
  const { rows } = await pool.query('SELECT * FROM categoria ORDER BY id');
  return rows;
}

async function getById(id) {
  const { rows } = await pool.query('SELECT * FROM categoria WHERE id = $1', [id]);
  return rows[0];
}

async function create({ nombre }) {
  const { rows } = await pool.query(
    'INSERT INTO categoria (nombre) VALUES ($1) RETURNING *',
    [nombre]
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

module.exports = { getAll, getById, create, update };