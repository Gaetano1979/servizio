const Mysql = require('mysql');

let conessione = Mysql.createConnection({
    host: 'ls-4ced6077d7519bffb5de949e2bae2dcbe3615210.c5s20s1vsvjo.eu-central-1.rds.amazonaws.com',
    password: 'gaetano1979',
    user: 'dbmasteruser',
    database: 'sistematic_net'
});
let MysqlAperto = () => {
    conessione.connect((err) => {
        if (err) {
            return console.log(err);
        } else {
            console.log('Conessione eseguita con successo', conessione.config.database);
            console.log('Estado conesssione en conessioneaperta', conessione.state);
        }
    });
};
let MysqlChiuso = () => {
    conessione.end((err) => {
        if (err) {
            return console.log(err);
        } else {
            console.log('Conessione chiusa  con successo');
            console.log('Estado conesssione en conessionechiusa', conessione.state);
        }
    });
};
let MysqlQuery = (query, callback) => {
    MysqlAperto();
    conessione.query(query, (err, resultado) => {
        // console.log(query);
        if (err) {
            // console.log(err);
            return callback(err);
        }
        if (resultado.length === 0) {
            return callback('Registro no encontrado');

        } else {
            console.log('resultados enviados');
            return callback(null, resultado);
        }
    });
    MysqlChiuso();
};



module.exports = {
    conessione,
    MysqlAperto,
    MysqlChiuso,
    MysqlQuery
};