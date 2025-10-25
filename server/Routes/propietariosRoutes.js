const express = require('express');
const router = express.Router();
const propietariosController = require('../controllers/propietariosController');

router.get('/', propietariosController.getPropietarios);

module.exports = router;