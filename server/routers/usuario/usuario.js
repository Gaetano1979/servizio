const express = require('express');
const app = express();
const mysql = require('../../../mysql/mysql');
const funciones = require('../../../mysql/funciones');

const { Usuario } = require('../../../clases/usuario.js');


app.get('/usuario', (req, res) => {

    funciones.getUsuario(`select * from usuario`, (err, usuarios) => {
        if (err) {
            res.status(400).json({
                err
            });
        } else {

            res.status(200).json({
                usuarios
            });
        }
    });
});

app.post('/usuario', (req, res) => {
    let b = req.body;
    let usuario = new Usuario(b.nombre, b.apellido, b.roule, b.fecha);
    funciones.postUsuario(usuario, (err, result) => {
        if (err) {
            return res.status(400).json({
                err
            });
        } else {
            res.status(200).json({
                result
            });
        }
    });
});





module.exports = app;