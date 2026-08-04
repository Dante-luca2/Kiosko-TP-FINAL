const express = require('express');
const router = express.Router();

const { proveedor: proveedorQueries } = require('../db/queries');

router.get('/', async (req, res) => {
    try {
        const { nombre } = req.query;
        const proveedores = await proveedorQueries.getAll({ nombre });
        res.json(proveedores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los proveedores' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const proveedor = await proveedorQueries.getById(req.params.id);
        if (!proveedor) return res.status(404).json({ error: 'Proveedor no encontrado' });
        res.json(proveedor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el proveedor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nombre, contact, telefono, rubro, direccion } = req.body;
        if (!nombre || !contact || !telefono || !rubro || !direccion) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, contact, telefono, rubro, direccion' });
        }
        const nuevoProveedor = await proveedorQueries.create(req.body);
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el proveedor' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { nombre, contact, telefono, rubro, direccion } = req.body;
        if (!nombre || !contact || !telefono || !rubro || !direccion) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, contact, telefono, rubro, direccion' });
        }
        const proveedorActualizado = await proveedorQueries.update(req.params.id, req.body);
        if (!proveedorActualizado) return res.status(404).json({ error: 'Proveedor no encontrado' });
        res.json(proveedorActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el proveedor' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const proveedorEliminado = await proveedorQueries.softDelete(req.params.id);
        if (!proveedorEliminado) return res.status(404).json({ error: 'Proveedor no encontrado' });
        res.json(proveedorEliminado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el proveedor' });
    }
});

module.exports = router;
