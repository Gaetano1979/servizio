const express = require('express');
const app = express();
const mysql = require('../../../mysql/mysql');
const prova = require('../../../mysql/pruebas');

app.get('/buscar', (req, res) => {
    let termino = req.header.termino;
    mysql.conessione.query(`select * from clientes where cliente like '%${termino}%'`, (err, resultado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        } else {
            return res.status(200).json({
                ok: true,
                resultado
            });
        }

    });
});










module.exports = app;