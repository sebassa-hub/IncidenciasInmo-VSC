const propietariosModel = require('../models/propietariosModel');

module.exports = {
    getPropietarios: (req, res) => {
        propietariosModel.getPropietarios((err, results) => {
            if(err){
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(200).json({ data: results });
        });
    }
};