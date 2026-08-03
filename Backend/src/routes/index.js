const express = require('express');
const router = express.Router();

router.use('/productos', require('./producto'));
router.use('/categorias', require('./categoria'));



module.exports = router;