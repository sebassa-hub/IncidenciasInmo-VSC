const db = require('../config/dbconfig');

module.exports = {
    getEmpleados: (callback) => {
        const sql = "SELECT IdEmpleado, Nombres, Apellidos, Cargo FROM empleado WHERE Estado = '1' ORDER BY Nombres";
        db.query(sql, callback);
    }
};