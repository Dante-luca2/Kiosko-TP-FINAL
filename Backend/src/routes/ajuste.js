const express = require('express');
const router = express.Router();
const { producto: productoQueries, ajuste: ajusteQueries } = require('../db/queries');

router.get('/', async (req, res) => {
  try {
    const { producto_id, empleado_id } = req.query;
    const ajustes = await ajusteQueries.getAll({ producto_id, empleado_id });
    res.json(ajustes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los ajustes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ajuste = await ajusteQueries.getById(req.params.id);
    if (!ajuste) return res.status(404).json({ error: 'Ajuste no encontrado' });
    res.json(ajuste);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el ajuste' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { producto_id, empleado_id, cantidad, motivo } = req.body;

    if (!producto_id || !empleado_id || cantidad === undefined || !motivo) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: producto_id, empleado_id, cantidad, motivo' });
    }
    if (cantidad === 0) {
      return res.status(400).json({ error: 'cantidad no puede ser 0' });
    }

    const producto = await productoQueries.getById(producto_id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    if (cantidad < 0 && producto.stock + cantidad < 0) {
      return res.status(400).json({ error: 'Stock insuficiente para aplicar el ajuste' });
    }

    const nuevoAjuste = await ajusteQueries.create({ producto_id, empleado_id, cantidad, motivo });
    res.status(201).json(nuevoAjuste);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el ajuste' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const ajuste = await ajusteQueries.getById(req.params.id);
    if (!ajuste) return res.status(404).json({ error: 'Ajuste no encontrado' });

    const producto = await productoQueries.getById(ajuste.producto_id);
    if (producto.stock - ajuste.cantidad < 0) {
      return res.status(400).json({ error: 'No se puede eliminar: el stock del producto quedaria negativo' });
    }

    const ajusteEliminado = await ajusteQueries.remove(req.params.id);
    res.json(ajusteEliminado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el ajuste' });
  }
});

module.exports = router;