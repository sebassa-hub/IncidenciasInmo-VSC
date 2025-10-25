const db = require('../config/dbconfig');

module.exports = {
    getEmpresas: (callback) => {
        const sql = "SELECT IdEmpresaProveedora, RazonSocial, RUC FROM empresaproveedora ORDER BY RazonSocial";
        db.query(sql, callback);
    }
};