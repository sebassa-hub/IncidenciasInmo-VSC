const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const incidenciasRoutes = require('./Routes/incidenciaRoutes');

const app = express();
const port = 3002;

// Habilitar CORS
app.use(cors());

app.use(bodyParser.json());

///Rutas
app.use('/api/incidencias', incidenciasRoutes);

//iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});