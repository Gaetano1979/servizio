const express = require('express');
const app = express();
const mysql = require('../../../mysql/mysql');



app.get('/cliente', (req, res) => {
    // let con = mysql.MysqlAperto();

    let peticion = `select * from clientes `;

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

    // mysql.MysqlChiuso();
});




module.exports = app;