const express = require('express');
const router = express.Router();
const empresasController = require('../controllers/empresasController');

router.get('/', empresasController.getEmpresas);

module.exports = router;