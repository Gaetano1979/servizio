const express = require('express');
const app = express();

// dependencia pdf
const pdf = require('html-pdf');
// dependencia fs
const fs = require('fs');

const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'gaetano.sabino@gmail.com',
        pass: 'Francy@2015'
    }
});
const transporter1 = nodemailer.createTransport({
    service: 'register',
    auth: {
        user: 'gaetano@cosmeticsfromitaly.com',
        pass: 'Unico@2016'
    }
});

const mailOption = {
    from: 'Remitente',
    to: 'gaetano@cosmeticsfromitaly.com',
    subject: 'prova nodamail',
    // text: 'Prva envio correo con node'
};
const transporter2 = nodemailer.createTransport({
    host: "authsmtp.securemail.pro",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: "gaetano@cosmeticsfromitaly.com",
        pass: "Unico@2016"
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: true
    }
});

let message = {
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'Message',
    text: 'I hope this message gets read!',
    dsn: {
        id: 'some random message specific id',
        return: 'headers',
        notify: ['failure', 'delay'],
        recipient: 'sender@example.com'
    }
};




app.post('/email', (req, res) => {

    let prova = req.body;
    let cliente = prova.cliente;
    // let provapdf =
    //     `<body style="">
    //         <div style="text-align: center">
    //             <h1 style="color:blue">Prova Recibo</h1>
    //         </div>
    //         <div>
    //             <h4>Cliente</h4>
    //         </div>
    //     </body>`;
    let html = fs.readFileSync('./html/prova.html', 'utf8');
    let opcion = {
        'format': 'Letter',
        'header': {
            'heigth': '60px',
        },
        'footer': {
            'height': '22mm'
        },

    };
    pdf.create(html, opcion).toFile('./pdf/prova.pdf', (err, respuesta) => {
        if (err) {
            console.log(err);

        } else {
            console.log(respuesta);

        }
    });


    let email = {
        from: prova.from,
        to: prova.to,
        subject: prova.subject,
        // text: prova.text
        html: `<h1 style="text-center">Prova de html</h1>
                <hr>
                <p>Adesso possiamo metter un messagio </p>`,
        dsn: {
            id: 'some random message specific id',
            return: 'headers',
            notify: ['failure', 'delay'],
            recipient: prova.from
        },
        attachments: [{
            path: './pdf/prova.pdf'
        }]
    };

    // verify connection configuration
    transporter2.verify(function(error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });


    transporter2.sendMail(email, (err, info) => {
        if (err) {
            console.log(err);
            res.status(500).jsonp(err.message);
        } else {
            console.log('Email enviado');
            res.status(200).jsonp(info);
        }
    });
});


module.exports = app;