// const configurazione = require('./config');
const nodemailer = require('nodemailer');


const express = require('express');
const app = express();

app.post('/email', (req, res) => {
    let body = req.body;
    let recibo = {
        destinario: body.destinario,
        subject: body.subject,
        numero: body.numero,
        cantidad: body.cantidad,
        factura: body.factura,
        responsable: body.responsable,
        fecha: body.fecha


    };
    const transporter2 = nodemailer.createTransport({
        host: "authsmtp.securemail.pro",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "no_reply@cosmeticsfromitaly.com",
            pass: "Unico@2016"
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: true
        }
    });
    // const mailOption = {
    //     from: `${recibo.from}`,
    //     to: `${recibo.to}`,
    //     subject: `${recibo.subject}`,
    //     html: `<h1>proviamo a mandare ${recibo.to}</h1>
    //             <hr>
    //             <p>La empresa Uni.co Commercial envia este correo como costancia de pago </p>
    //             <p>
    //             Recibo numero ${recibo.numero}, de S./  ${recibo.cantidad} pago a cuanta de la factuta n° ${recibo.factura}
    //             </p>
    //             <p>
    //             responsable de cobrar el monto indicado arriva el segnor ${recibo.responsable}
    //             </p>
    //             <p>
    //             Fecha: ${recibo.fecha}
    //             </p>`
    // };
    const mailOption = {
        from: `"Unico Commercial S.A.C"<no_reply@cosmeticsfromitaly.com>`,
        to: body.to,
        subject: body.subject,
        text: body.text,
        html: `<h1>proviamo a mandare ${body.to}</h1>
                    <hr>
                    <p>La empresa Uni.co Commercial envia este correo como costancia de pago </p>
                    <p>
                    Recibo numero ${body.numero}, de S./  ${body.cantidad} pago a cuanta de la factuta n° ${body.factura}
                    </p>
                    <p>
                    responsable de cobrar el monto indicado arriva el segnor ${body.responsable}
                    </p>
                    <p>
                    Fecha: ${body.fecha}
                    </p>`
    };
    transporter2.sendMail(mailOption, (err, info) => {
        if (err) {
            res.status(500).jsonp({
                Error: 'Error',
                err
            });
        } else {
            res.status(200).jsonp({
                info
            });
        }
    });



});












module.exports = app;