const express = require('express');
const app = express();
const mysql = require('../../../mysql/mysql');
const funciones = require('../../../mysql/funciones');


const { Caja } = require('../../../clases/caja.js');



app.get('/caja', (req, res) => {

    let peticion = `select * from caja `;

    mysql.MysqlQuery(peticion, (err, data) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: 'Error' + err
            });
        } else {
            res.status(200).json({
                ok: true,
                message: data
            });
        }
    });
});

app.post('/caja', (req, res) => {
    let b = req.body;

    let caja = new Caja(b.doc, b.en, b.de, b.ta, b.re, b.con);
    console.log(caja);

    funciones.postcaja(caja, (err, idcaja) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: 'Error ' + err
            });
        } else {
            res.status(200).json({
                ok: true,
                message: 'Recibo Caja enviado',
                idCaja: idcaja
            });
        }
    });


});




module.exports = app;