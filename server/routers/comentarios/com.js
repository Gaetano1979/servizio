const express = require('express');
const app = express();
const mysql = require('../../../mysql/mysql');
const query = require('../../../mysql/querys');
const fun = require('../../../mysql/cliente');

const comentarios = require('../../../mysql/comentarios');

app.get('/comentarios', (req, res) => {
    fun.GetTablas('comentarios').then(resul => {
        res.status(200).json(resul);
    }).catch(error => {
        res.status(400).json(error);
    });
});
app.get('/comentarios/:id', (req, res) => {
    let id = req.params.id;

    fun.GetWhere('comentarios', 'idcliente', id).then(resultado => {
        res.status(200).json(resultado);
    }).catch(err => {
        res.status(400).json(err);
    });
});

app.post('/comentarios/:id', (req, res) => {
    let id = req.params.id;
    let com = req.body;
    let comentario = {
        comentario: com.comentario,
        idcliente: id,
        fecha_comentario: com.fecha,
        idrecibo: com.idrecibo,
        idfactura: com.idfactura
    };
    let query = `
    insert into comentarios set ?`;

    mysql.conessione.query(`${query}`, comentario, (err, resultado) => {

        console.log(com);

        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        } else {
            res.status(200).json({
                ok: true,
                resultado,
                comentario
            });
        }
    });
});
module.exports = app;