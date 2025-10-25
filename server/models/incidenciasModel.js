const db = require('../config/dbconfig');

class Incidencias {

    //obtener incidencias
    getIncidencias(callback) {
    const sql = `
        SELECT 
            id, 
            titulo, 
            descripcion, 
            estado, 
            fecha_creacion, 
            residente_id,
            residente_nombre,
            empleado_asignado_id,
            empleado_nombre,
            empresa_proveedora_id,
            empresa_proveedora_nombre,
            tipo_asignacion,
            fecha_asignacion
        FROM incidencia
        ORDER BY fecha_creacion DESC
    `;
    db.query(sql, callback);
}

    //obtener incidencia por id
    getIncidenciasById(id, callback) {
        const sql = `
        SELECT 
            id, 
            titulo, 
            descripcion, 
            estado, 
            fecha_creacion,
            residente_id,
            residente_nombre,
            empleado_asignado_id,
            empleado_nombre,
            empresa_proveedora_id,
            empresa_proveedora_nombre,
            tipo_asignacion,
            fecha_asignacion
        FROM incidencia 
        WHERE id = ?
        `;
        db.query(sql, [id], callback);
    }

    //crear incidencia
    postIncidencia(titulo, descripcion, residente_id, callback){
        const sql = "INSERT INTO incidencia (titulo, descripcion, estado, residente_id) VALUES (?, ?, 'Pendiente', ?)";
        db.query(sql, [titulo, descripcion, residente_id], (err, result) => {
            if(err){
                return callback(err, null);
            }
            callback(null, result.insertId);
        });
    }

    //actualizar incidencia
    putIncidencia(id ,data, callback) {
        const sql = `
        UPDATE incidencia 
        SET 
            titulo = ?,
            descripcion = ?,
            estado = ?,
            residente_id = ?,
            empleado_asignado_id = ?,
            empresa_proveedora_id = ?
        WHERE id = ?
        `;
        const values = [
            data.titulo,
            data.descripcion,
            data.estado,
            data.residente_id || null,
            data.empleado_asignado_id || null,
            data.empresa_proveedora_id || null,
            id
        ];
        
        db.query(sql, values, callback);
    }

    //eliminar incidencia
    deleteIncidencia(id, callback) {
        const sql = "delete from incidencia where id = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = new Incidencias();