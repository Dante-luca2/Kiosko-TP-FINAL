  //ROLLBACK: si algo falla a mitad de la transacción (por ejemplo, el INSERT de la compra funciona pero el UPDATE del stock falla), la transacción queda abierta a medio hacer. Sin ROLLBACK, esa conexión queda "sucia" —
  //  con cambios pendientes sin confirmar — y si después se reutiliza para otra consulta (porque las conexiones se reciclan en el pool), puede arrastrar ese estado corrupto o bloquear 
  // cosas. ROLLBACK le dice a Postgres "descartá todo lo que hiciste en esta transacción, como si nunca hubiera pasado".

//client.release() en el finally: pool.connect() te presta una conexión de un pool limitado (por defecto, 10 conexiones simultáneas como mucho). Si nunca la liberás, 
// esa conexión queda "en uso" para siempre — y como esto pasa cada vez que alguien crea o borra una compra, después de 10 pedidos el pool se queda sin conexiones libres y 
// toda la app se cuelga, no solo esta ruta. El finally garantiza que se libere pase lo que pase, haya éxito o error.

//throw error después del ROLLBACK: si no lo relanzás, el error queda "tragado" ahí adentro — la ruta (routes/compra.js) nunca se entera de que algo falló, 
// y le respondería 201 Created al usuario como si la compra se hubiera guardado bien, cuando en realidad se revirtió todo. 
// Relanzarlo es lo que permite que el catch de la ruta conteste el 400/404/500 correcto.

const express = require('express');
const router = express.Router();
const { producto: productoQueries, venta: ventaQueries } = require('../db/queries');

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

    const producto = await productoQueries.getById(producto_id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    if (producto.stock < cantidad) {
      return res.status(400).json({ error: 'Stock insuficiente para realizar la venta' });
    }

    const nuevaVenta = await ventaQueries.create({ producto_id, empleado_id, cantidad, precio_unitario, descuento });
    res.status(201).json(nuevaVenta);
  } catch (error) {
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