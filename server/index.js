const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const incidenciasRoutes = require('./Routes/incidenciaRoutes');
const propietariosRoutes = require('./routes/propietariosRoutes');
const empleadosRoutes = require('./routes/empleadosRoutes');
const empresasRoutes = require('./routes/empresasRoutes');


const app = express();
const port = 3002;

// Habilitar CORS
app.use(cors());

app.use(bodyParser.json());

///Rutas
app.use('/api/incidencias', incidenciasRoutes);
app.use('/api/propietarios', propietariosRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/empresas', empresasRoutes);

//iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});