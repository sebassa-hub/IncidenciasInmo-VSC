

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
        const { titulo, descripcion, residente_id } = req.body;

        // Validar datos requeridos
        if (!titulo || !descripcion || !residente_id) {
            return res.status(400).json({ 
                success: false,
                error: "Faltan campos requeridos" 
            });
        }

        incidenciasModel.postIncidencia(titulo, descripcion, residente_id, (err, result) => {
            if(err){
                res.status(500).json({ 
                    success: false,
                    error: err.message
                });
                return;
            }
            res.status(201).json({ 
                success: true,
                message: 'Incidencia creada correctamente', 
                data: { idInsertado: result }
            });
        });
    },

    putIncidencia : (req, res)=>{
        const { id } = req.params;
        const { 
            titulo, 
            descripcion, 
            estado,
            residente_id,
            empleado_asignado_id,
            empresa_proveedora_id 
        } = req.body;

        if (!titulo || !descripcion || !estado) {
            return res.status(400).json({ 
                error: "Faltan campos requeridos (titulo, descripcion, estado)" 
            });
        }

        const data = {
            titulo,
            descripcion,
            estado,
            residente_id: residente_id || null,
            empleado_asignado_id: empleado_asignado_id || null,
            empresa_proveedora_id: empresa_proveedora_id || null
        };

        incidenciasModel.putIncidencia(id, data, (err, result) => {
            if(err){
                res.status(500).json({ error: err.message});
                return;
            }
            if(result.affectedRows === 0){
                return res.status(404).json({ message: 'Incidencia no encontrada' });
            }
            res.status(200).json({ 
                message: 'Incidencia actualizada correctamente', 
                data: { idActualizado: id }
            });
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
