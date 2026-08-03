const express = require('express');
const router = express.Router();

router.use('/productos', require('./producto'));
router.use('/compras', require('./compra'));



module.exports = router;