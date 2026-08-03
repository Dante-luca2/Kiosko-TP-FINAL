const express = require('express');
const router = express.Router();

router.use('/productos', require('./producto'));
router.use('/ventas', require('./venta'));


module.exports = router;