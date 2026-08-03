const express = require('express');
const router = express.Router();

router.use('/productos', require('./producto'));



module.exports = router;