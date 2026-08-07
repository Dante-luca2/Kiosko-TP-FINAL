const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || 'admin',
  host: process.env.DB_HOST || 'db',
  password: process.env.DB_PASSWORD || 'secretpassword',
  database: process.env.DB_NAME || 'kiosco_db',
  port: process.env.DB_PORT || 5432,
});

app.get('/api/productos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM producto ORDER BY id ASC;');
    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al consultar los productos' });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});