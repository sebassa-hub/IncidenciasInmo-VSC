const db = require('../config/dbconfig');

module.exports = {
    getPropietarios: (callback) => {
        const sql = "SELECT IdPropietario, Nombre, Documento FROM propietario ORDER BY Nombre";
        db.query(sql, callback);
    }
};