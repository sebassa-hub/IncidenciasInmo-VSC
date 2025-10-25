const db = require('../config/dbconfig');

class Incidencias {

    //obtener incidencias
    getIncidencias(callback) {
        const sql = "select id, titulo, descripcion, estado, fecha_creacion, residente_nombre from incidencia";
        db.query(sql, callback);
    }

    //obtener incidencia por id
    getIncidenciasById(id, callback) {
        const sql = "select id, titulo, descripcion, estado, fecha_creacion, residente_nombre from incidencia where id = ?";
        db.query(sql, [id], callback);
    }

    //crear incidencia
    postIncidencia(titulo, descripcion, estado, residente_nombre, callback) {
        const sql = "insert into incidencia (titulo, descripcion, estado, residente_nombre) values (?, ?, ?, ?)";
        db.query(sql, [titulo, descripcion, estado, residente_nombre], (err, result) => {
            if(err){
                return callback(err,null);
            }
            callback(null, result.insertId);
        });
    }

    //actualizar incidencia
    putIncidencia(id ,titulo, descripcion, estado, residente_nombre, callback) {
        const sql = "update incidencia set titulo = ?, descripcion = ?, estado = ?, residente_nombre = ? where id = ?";
        db.query(sql, [titulo, descripcion, estado, residente_nombre, id], callback);
    }

    //eliminar incidencia
    deleteIncidencia(id, callback) {
        const sql = "delete from incidencia where id = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = new Incidencias();