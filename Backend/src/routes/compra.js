const express = require('express');
const router = express.Router();
const { producto: productoQueries, compra: compraQueries } = require('../db/queries');

router.get('/', async (req, res) => {
  try {
    const { producto_id, proveedor_id, empleado_id } = req.query;
    const compras = await compraQueries.getAll({ producto_id, proveedor_id, empleado_id });
    res.json(compras);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las compras' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const compra = await compraQueries.getById(req.params.id);
    if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });
    res.json(compra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la compra' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { producto_id, proveedor_id, empleado_id, cantidad, precio_unitario } = req.body;

    if (!producto_id || !proveedor_id || !empleado_id || !cantidad || precio_unitario === undefined) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: producto_id, proveedor_id, empleado_id, cantidad, precio_unitario' });
    }
    if (cantidad <= 0) {
      return res.status(400).json({ error: 'cantidad debe ser mayor a 0' });
    }
    if (precio_unitario < 0) {
      return res.status(400).json({ error: 'precio_unitario no puede ser negativo' });
    }

    const producto = await productoQueries.getById(producto_id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const nuevaCompra = await compraQueries.create({ producto_id, proveedor_id, empleado_id, cantidad, precio_unitario });
    res.status(201).json(nuevaCompra);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la compra' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const compra = await compraQueries.getById(req.params.id);
    if (!compra) return res.status(404).json({ error: 'Compra no encontrada' });

    const producto = await productoQueries.getById(compra.producto_id);
    if (producto.stock - compra.cantidad < 0) {
      return res.status(400).json({ error: 'No se puede eliminar: el stock del producto quedaria negativo' });
    }

    const compraEliminada = await compraQueries.remove(req.params.id);
    res.json(compraEliminada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la compra' });
  }
});

module.exports = router;