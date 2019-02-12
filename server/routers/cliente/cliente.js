const express = require('express');
const app = express();
const mysql = require('../../../mysql/mysql');
const prova = require('../../../mysql/pruebasdos');
const prova1 = require('../../../mysql/pruebas');





// ruta de todos los clientes
app.get('/cliente', (req, res) => {

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
});
// ruta del cliente con id especifico
app.get('/cliente/:id', (req, res) => {
    let id = req.params.id;
    prova.MysqlGetDatosCliente2(id, (err, data) => {
        if (err) {
            res.json({
                err
            });
        } else {
            res.json({
                data
            });
        }
    });
});
app.get('/clienteTot', (req, res) => {
    prova.prova1((err, resultado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        } else {
            return res.status(200).json({
                ok: true,
                data: resultado
            });
        }

    });
});
app.put('/cliente', (req, res) => {
    let cliente = req.body.cliente;
    // let prova = cliente.split(",");
    clienteArray = [...cliente]
        // clienteArray = [cliente[0], cliente[1], cliente[2], cliente[3], cliente[4], cliente[5], cliente[6], cliente[7], cliente[8], cliente[9]];
    prova1.update(clienteArray, (err, resultado) => {
        if (err) {
            res.status(400).json('Error ', err);
        } else {
            res.status(200).json({
                resultado,
                clienteArray
            });

        }
    });
    // res.jsonp({
    //     cliente
    // });


});




module.exports = app;