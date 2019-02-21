const Mysql = require('mysql');
const mysql = require('./mysql');



let Comentarios = (query, callback) => {
    mysql.conessione.query(query, (err, resultado) => {
        if (resultado.length === 0) {
            return callback('no hay comentarios');
        }
        if (err) {
            return callback('Error ', err);
        } else {
            return callback(null, resultado);
        }
    });
};
let PostComentarios = (query, comentario, callback) => {
    mysql.conessione.query(query, comentario, (err, resultado) => {
        if (err) {
            return callback('Error ', err);
        } else {
            return callback(null, resultado);
        }
    });
};

module.exports = {
    Comentarios,
    PostComentarios
};