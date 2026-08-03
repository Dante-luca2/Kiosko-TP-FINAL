const express = require('express');
const router = express.Router();

router.use('/productos', require('./producto'));
router.use('/compras', require('./compras'));



module.exports = router;