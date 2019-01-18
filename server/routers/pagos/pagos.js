const express = require('express');
const app = express();
const mysql = require('../../../mysql/mysql');
const funciones = require('../../../mysql/funciones');

const { Recibo } = require('../../../clases/recibos');
const { Caja } = require('../../../clases/caja');




app.get('/pagos', (req, res) => {

    let peticion = `select * from pagos `;

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

app.get('/pagos/:id', (req, res) => {
    let id = req.params.id;
    funciones.getTot(id, (err, factura) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: 'Error' + err
            });
        } else {
            res.status(200).json({
                ok: true,
                data: factura
            });
        }
    });
});

app.post('/pagos/:id', (req, res) => {
    let id = req.params.id;
    let b = req.body;
    // let caja = new Caja(b.doc, b.en, b.de, b.ta, b.re, b.con);

    funciones.getTot(id, (err, factura) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error' + err
            });
        }

        if (factura.Saldo_Factura <= 0) {
            return res.status(200).json({
                message: 'No hay Saldo',
                Saldo: factura.Saldo_Factura
            });
        } else {
            let caja = new Caja(b.doc, b.fac, b.cli, b.en, b.de, b.ta, b.re, b.con);


            funciones.postcaja(caja, factura.Saldo_Factura, (err, idcaja) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error ' + err
                    });
                }
                let recibo = new Recibo(id, b.en, b.respo, b.doc, idcaja, b.paga, factura.idcliente);
                funciones.postRecibo(recibo, idcaja, (err, reciboenviado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error ' + err
                        });
                    } else {
                        res.status(200).json({
                            ok: true,
                            message: 'Recibo enviado',
                            reciboenviado
                        });
                    }
                });
            });
        }

    });
});




module.exports = app;