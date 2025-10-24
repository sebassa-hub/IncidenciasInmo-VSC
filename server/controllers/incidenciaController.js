

const incidenciasModel = require('../models/incidenciasModel');

module.exports = {

    getIncidencias: (req, res)=>{
        incidenciasModel.getIncidencias((err, results) => {
            if(err){
                res.status(500).json({ error: err.message});
                return;
            }

            res.status(200).json({ data: results });
        });
    },

    getIncidenciasById: (req, res)=>{
        const { id } = req.params;
        incidenciasModel.getIncidenciasById(id, (err, results) => {
            if(err){
                res.status(500).json({ error: err.message});
                return;
            }
            if(!results || results.length === 0){
                return res.status(404).json({ message: 'Incidencia no encontrada' });
            }
            res.status(200).json({ data: results[0] });
        });
    },

    postIncidencia: (req, res) => {
    const { titulo, descripcion, estado = 'Pendiente', residente_nombre } = req.body;

    // Validar datos requeridos
    if (!titulo || !descripcion || !residente_nombre) {
        return res.status(400).json({ 
            error: "Faltan campos requeridos (titulo, descripcion, residente_nombre)" 
        });
    }

    incidenciasModel.postIncidencia(titulo, descripcion, estado, residente_nombre, (err, result) => {
        if(err){
            res.status(500).json({ error: err.message});
            return;
        }
        res.status(201).json({ 
            message: 'Incidencia creada correctamente', 
            data: { idInsertado: result }
        });
    });
},

    putIncidencia : (req, res)=>{
        const { id } = req.params;
        const { titulo, descripcion, estado, residente_nombre } = req.body;

        incidenciasModel.putIncidencia(id, titulo, descripcion, estado, residente_nombre, (err, result) => {
            if(err){
                res.status(500).json({ error: err.message});
                return;
            }
            if(result.affectedRows === 0){
                return res.status(404).json({ message: 'Incidencia no encontrada' });
            }
                res.status(200).json({ message: 'Incidencia actualizada correctamente', data: {idInsertado: id}});
        });
    },

    deleteIncidencia : (req, res)=>{
        const { id } = req.params;
        incidenciasModel.deleteIncidencia(id, (err, result) => {
            if(err){
                res.status(500).json({ error: err.message});
                return;
            }
            if(result.affectedRows === 0){
                return res.status(404).json({ message: 'Incidencia no encontrada' });
            }
            res.status(200).json({ message: 'Incidencia eliminada correctamente' });
        });
    },
}
