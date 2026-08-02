require('dotenv').config();

const express = require ('express');
const cors = require ('cors');
const pool = require('./db/pool');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    try{
        await pool.query('SELECT 1');
        res.json({status: 'ok', db: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', db: 'disconnected', detail: error.message });
  }
});

app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
