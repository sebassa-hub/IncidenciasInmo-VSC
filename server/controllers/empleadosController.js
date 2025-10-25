const empleadosModel = require('../models/empleadosModel');

module.exports = {
    getEmpleados: (req, res) => {
        empleadosModel.getEmpleados((err, results) => {
            if(err){
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json({ data: results });
        });
    }
};