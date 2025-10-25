const express = require('express');
const router = express.Router();
const inicioSesionController = require('../controllers/inicioSesionController');

router.post('/login', inicioSesionController.login);

module.exports = router;