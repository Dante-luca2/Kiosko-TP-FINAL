const express = require('express');
const router = express.Router();
const { empleado: empleadoQueries } = require('../db/queries');

router.get('/', async (req, res) => {
  try {
    const { nombre } = req.query;
    const empleados = await empleadoQueries.getAll({ nombre });
    res.json(empleados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los empleados' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const empleado = await empleadoQueries.getById(req.params.id);
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(empleado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el empleado' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre_completo, dni } = req.body;

    if (!nombre_completo || !dni) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre_completo, dni' });
    }

    const nuevoEmpleado = await empleadoQueries.create(req.body);
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Ya existe un empleado con ese DNI o correo' });
    }
    res.status(500).json({ error: 'Error al crear el empleado' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nombre_completo, dni } = req.body;

    if (!nombre_completo || !dni) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre_completo, dni' });
    }

    const empleadoActualizado = await empleadoQueries.update(req.params.id, req.body);
    if (!empleadoActualizado) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(empleadoActualizado);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Ya existe un empleado con ese DNI o correo' });
    }
    res.status(500).json({ error: 'Error al actualizar el empleado' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const empleadoEliminado = await empleadoQueries.softDelete(req.params.id);
    if (!empleadoEliminado) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(empleadoEliminado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el empleado' });
  }
});

module.exports = router;