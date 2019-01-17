const express = require('express');
const app = express();
const mysql = require('../../mysql/mysql');







app.use(require('./cliente/cliente.js'));

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Prima pagina'
    });
});
app.post('/', (req, res) => {
    let prova = req.body;
    let nombre = prova.nombre;
    if (!nombre) {
        res.status(400).json({
            ok: false,
            message: 'Manca il nome'
        });
    } else {
        res.status(200).json({
            ok: true,
            message: prova
        });
    }
});






module.exports = app;