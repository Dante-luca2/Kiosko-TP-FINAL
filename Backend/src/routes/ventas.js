const express = require('express');
const router = express.Router();
const { venta: ventaQueries } = require('../db/queries');

router.get('/', async (req, res) => {
  try {
    const { producto_id, empleado_id } = req.query;
    const ventas = await ventaQueries.getAll({ producto_id, empleado_id });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const venta = await ventaQueries.getById(req.params.id);
    if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la venta' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { producto_id, empleado_id, cantidad, precio_unitario, descuento = 0 } = req.body;

    if (!producto_id || !empleado_id || !cantidad || precio_unitario === undefined) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: producto_id, empleado_id, cantidad, precio_unitario' });
    }
    if (cantidad <= 0) {
      return res.status(400).json({ error: 'cantidad debe ser mayor a 0' });
    }
    if (precio_unitario < 0 || descuento < 0) {
      return res.status(400).json({ error: 'precio_unitario y descuento no pueden ser negativos' });
    }

    const nuevaVenta = await ventaQueries.create({ producto_id, empleado_id, cantidad, precio_unitario, descuento });
    res.status(201).json(nuevaVenta);
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: 'Error al crear la venta' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const ventaEliminada = await ventaQueries.remove(req.params.id);
    if (!ventaEliminada) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(ventaEliminada);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la venta' });
  }
});

module.exports = router;