const express = require('express');
const router = express.Router();

router.use('/productos', require('./producto'));
router.use('/ajustes', require('./ajuste'));



module.exports = router;