const express = require('express');
const app = express();
const mysql = require('../../mysql/mysql');






app.use(require('./pagos/pagos.js'));
app.use(require('./cliente/cliente.js'));
app.use(require('./caja/caja.js'));
app.use(require('./usuario/usuario.js'));





app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Prima pagina'
    });
});


module.exports = app;