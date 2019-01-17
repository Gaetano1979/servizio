require('./config/config');

const express = require('express');
const app = express();

const body_parser = require('body-parser');

const cors = require('cors');


app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());

app.use(cors());

app.use(require('./routers/index'));

app.listen(process.env.PORT, () => {
    console.log(`Servidor Servicio Unico corriendo en el Puerto: ${process.env.PORT}`);

});