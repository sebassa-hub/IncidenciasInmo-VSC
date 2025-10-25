const empresasModel = require('../models/empresasModel');

module.exports = {
    getEmpresas: (req, res) => {
        empresasModel.getEmpresas((err, results) => {
            if(err){
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json({ data: results });
        });
    }
};