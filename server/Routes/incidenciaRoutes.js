const express = require('express');
const router = express.Router();
const incidenciaController = require('../controllers/incidenciaController'); 

router.get('/', incidenciaController.getIncidencias);
router.get('/:id', incidenciaController.getIncidenciasById);
router.post('/', incidenciaController.postIncidencia);
router.put('/:id', incidenciaController.putIncidencia);
router.delete('/:id', incidenciaController.deleteIncidencia);

module.exports = router;