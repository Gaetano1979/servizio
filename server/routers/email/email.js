const express = require('express');
const app = express();
// const configurazione = require('./config');
const nodemailer = require('nodemailer');
// dependencia pdf
const pdf = require('html-pdf');
// dependencia fs
const fs = require('fs');

let pathpath = require('path');

const config = require('./config');

app.post('/emailsend', (req, res) => {
    let body = req.body;

    console.log(req.body);

    res.json({
        res: body
    });
});



app.post('/emailprova', (req, res) => {

    let reciboemail = req.body;
    let recibo = {
        destinario: reciboemail.destinario,
        subject: reciboemail.subject,
        fattura: reciboemail.fattura,
        fecha_pag: reciboemail.fecha_pag,
        responsable: reciboemail.responsable,
        cliente: reciboemail.cliente,
        documento: reciboemail.documento,
        cantidad: reciboemail.cantidad,
        saldo: reciboemail.saldo
    };
    console.log(reciboemail, 'email');


    console.log(recibo);


    config.email(recibo, req, (err, email) => {
        if (err) {
            res.json({
                err,
                recibo
            });
        } else {
            res.json({
                ok: true,
                email

            });
        }
    });

});

app.post('/email', (req, res) => {
    let body = req.body;
    let recibo = {
        destinatario: body.destinatario,
        subject: body.subject,
        numero: body.numero,
        cantidad: body.cantidad,
        factura: body.factura,
        responsable: body.responsable,
        fecha: body.fecha,
        email: body.email
    };
    const transporter2 = nodemailer.createTransport({

        host: "authsmtp.securemail.pro",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "smtp@cosmeticsfromitaly.com",
            pass: "Unico@2016"
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    let prova = (recibo) => {
        console.log(recibo);
    };
    prova(recibo);

    let html = `<h1>Recibo de cobranza a nombre de <small>${recibo.destinatario}</small></h1>
    <hr>
    <p>La empresa Uni.co Commercial S.A.C envia este correo como costancia de pago </p>
    <p>
    Recibo numero ${recibo.numero}, de S./ ${recibo.cantidad} pago a cuenta por la factuta n° ${recibo.factura}
    </p>
    <p>
    el responsable de cobrar el monto es el señor ${recibo.responsable}
    </p>
    <p>
    Fecha: ${recibo.fecha}
    </p>`;
    let opcion = {
        'format': 'Letter',
        'header': {
            'heigth': '5mm',
        },
        'footer': {
            'height': '5mm'
        },

    };
    // let pathurl = pathpath.resolve(__dirname, `./pdf/${recibo.responsable}.${recibo.numero}.pdf`);
    pdf.create(html, opcion).toFile(`./server/routers/email/pdf/${recibo.responsable}.${recibo.numero}.pdf`, (err, respuesta) => {
        if (err) {
            console.log(err);

        } else {
            console.log(respuesta);

        }
    });

    const mailOption = {
        from: `"Unico Commercial S.A.C"<no_reply@cosmeticsfromitaly.com>`,
        to: recibo.email,
        cc: ['gaetano.sabino@gmail.com', 'gaetano@cosmeticsfromitaly.com'],
        subject: `Recibo de cobranza numero ${recibo.numero}`,

        html: html,
        attachments: [{
            path: `./server/routers/email/pdf/${recibo.responsable}.${recibo.numero}.pdf`
        }]
    };

    transporter2.sendMail(mailOption, (err, info) => {
        if (err) {
            res.status(500).jsonp({
                Error: 'Error',
                err
            });
        } else {
            res.status(200).jsonp({
                info,
                recibo
            });
        }
    });
});
module.exports = app;