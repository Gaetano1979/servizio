const express = require('express');
const app = express();
const mysql = require('../../../mysql/mysql');
const funciones = require('../../../mysql/funciones');

const { Recibo } = require('../../../clases/recibos');
const { Caja } = require('../../../clases/caja');



// ruta get todos los pagos
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

// ruta get pagos por id factura
app.get('/pagos/:id', (req, res) => {
    let id = req.params.id;
    funciones.getTot(id, (err, factura) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error ' + err
            });
        } else {
            res.status(200).json({
                ok: true,
                data: factura
            });
        }
    });
});

app.post('/check/:id', (req, res) => {
    let cuerpo = req.body;
    let recibo = {
        cantidad: cuerpo.cantidad,
        documento: cuerpo.documento,
        responsable: cuerpo.responsable,
        paga_con: cuerpo.paga_con,
        idcaja: cuerpo.idcaja

    };
    funciones.checkRecibo(recibo, (err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
                recibo
            });
        } else {
            return res.status(200).json({
                ok: true,
                data,
                recibo
            });
        }
    });


});
// ruta post por ingresar un recibo nuevo 
app.post('/pagos/:id', (req, res) => {
    // recibe id factura
    let id = req.params.id;
    let b = req.body;
    let prova = {
        documento: b.documento,
        cantidad: b.cantidad,
        responsable: b.responsable,
        paga_con: b.paga_con,
    };

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
        }
        let idcliente = factura.idcliente;
        let fat = factura.documento;
        funciones.getNombre(idcliente, (err, nombre) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error' + err
                });
            }


            let caja = new Caja(prova.documento, fat, nombre, prova.cantidad, "", "", "", 0);
            console.log('caja', caja);

            funciones.postcaja(caja, factura.Saldo_Factura, (err, idcaja) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error ' + err
                    });
                }
                let recibo = new Recibo(id, prova.cantidad, prova.responsable, prova.documento, idcaja, prova.paga_con, factura.idcliente);
                console.log('recibo', recibo);

                funciones.postRecibo(recibo, idcaja, (err, reciboenviado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            message: 'Error ' + err,
                            idcaja,
                            caja,
                            recibo
                        });
                    } else {
                        res.status(200).json({
                            ok: true,
                            message: 'Recibo enviado',
                            recibo,
                            caja,
                            reciboenviado
                        });
                    }
                });
            });
        });


    });
});
module.exports = app;