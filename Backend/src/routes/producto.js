const express = require('express');
const router = express.Router();
const { producto: productoQueries } = require('../db/queries');
const upload = require('../middlewares/upload');

const TIPOS_VALIDOS = ['normal', 'limitado', 'estacional'];

router.get('/', async (req, res) => {
  try {
    const { marca, tipo, categoria_id } = req.query;
    const productos = await productoQueries.getAll({ marca, tipo, categoria_id });
    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const producto = await productoQueries.getById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, precio, stock, tipo } = req.body;

    if (!nombre || precio === undefined || stock === undefined || !tipo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, precio, stock, tipo' });
    }
    if (!TIPOS_VALIDOS.includes(tipo)) {
      return res.status(400).json({ error: `tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}` });
    }
    if (Number(precio) < 0 || Number(stock) < 0) {
      return res.status(400).json({ error: 'precio y stock no pueden ser negativos' });
    }

    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevoProducto = await productoQueries.create({ ...req.body, imagen_url });
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});

router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, precio, stock, tipo } = req.body;

    if (!nombre || precio === undefined || stock === undefined || !tipo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, precio, stock, tipo' });
    }
    if (!TIPOS_VALIDOS.includes(tipo)) {
      return res.status(400).json({ error: `tipo debe ser uno de: ${TIPOS_VALIDOS.join(', ')}` });
    }
    if (Number(precio) < 0 || Number(stock) < 0) {
      return res.status(400).json({ error: 'precio y stock no pueden ser negativos' });
    }

    const imagen_url = req.file ? `/uploads/${req.file.filename}` : req.body.imagen_url || null;

    const productoActualizado = await productoQueries.update(req.params.id, { ...req.body, imagen_url });
    if (!productoActualizado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(productoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const productoEliminado = await productoQueries.softDelete(req.params.id);
    if (!productoEliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(productoEliminado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;