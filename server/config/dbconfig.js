const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'admicondominioconceptolife',
    port : 3306
});

db.connect(err => {
    if (err) {
        throw err;
    }
    
    console.log('MySQL Conectado');
});

module.exports = db;