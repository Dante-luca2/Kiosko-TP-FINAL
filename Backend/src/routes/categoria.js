const express = require('express');
const router = express.Router();
const { categoria: categoriaQueries, empleado: empleadoQueries } = require('../db/queries');

router.get('/', async (req, res) => {
  try {
    const categorias = await categoriaQueries.getAll();
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las categorias' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const categoria = await categoriaQueries.getById(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoria no encontrada' });
    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la categoria' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, empleado_id } = req.body;

    if (!nombre || !empleado_id) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, empleado_id' });
    }

    const empleado = await empleadoQueries.getById(empleado_id);
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    const nuevaCategoria = await categoriaQueries.create({ nombre, empleado_id });
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Ya existe una categoria con ese nombre' });
    }
    res.status(500).json({ error: 'Error al crear la categoria' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'Falta el campo obligatorio: nombre' });
    }

    const categoriaActualizada = await categoriaQueries.update(req.params.id, { nombre });
    if (!categoriaActualizada) return res.status(404).json({ error: 'Categoria no encontrada' });
    res.json(categoriaActualizada);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Ya existe una categoria con ese nombre' });
    }
    res.status(500).json({ error: 'Error al actualizar la categoria' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const categoriaEliminada = await categoriaQueries.remove(req.params.id);
    if (!categoriaEliminada) return res.status(404).json({ error: 'Categoria no encontrada' });
    res.json(categoriaEliminada);
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(400).json({ error: 'No se puede eliminar: hay productos que usan esta categoria' });
    }
    res.status(500).json({ error: 'Error al eliminar la categoria' });
  }
});

module.exports = router;