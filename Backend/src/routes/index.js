const express = require('express');
const router = express.Router();

router.use('/productos', require('./producto'));
router.use('/empleados', require('./empleado'));



module.exports = router;