const express = require('express');
const router = express.Router();

router.use('/productos', require('./producto'));
router.use('/empleados', require('./empleado'));

router.use('/compras', require('./compra'));
router.use('/ventas', require('./ventas'));


module.exports = router;