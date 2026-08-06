const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite peticiones desde el archivo HTML local
app.use(express.json());

// Conexión a la base de datos configurada en Docker
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'kiosco_db',
  password: 'secretpassword',
  port: 5432,
});

// Ruta API para obtener todos los productos
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
  console.log('Servidor corriendo en http://localhost:3000');
});