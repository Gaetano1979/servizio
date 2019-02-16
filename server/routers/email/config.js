const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
// dependencia fs
const fs = require('fs');


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


let email = (recibo, req, callback) => {


    const html = `<body>
    <h1>Estimado <small>${recibo.cliente}</small> </h1>
    <hr>
    <p>La empresa Uni.co Commercial envia este correo como costancia de pago </p>
    <p>
    Recibo numero ${recibo.documento}, de S./  ${recibo.cantidad} pago a cuanta de la factuta n° ${recibo.fattura}
    </p>
    <p>
    responsable de cobrar el monto indicado arriva el segnor ${recibo.responsable}
    </p>
    <p>
    Fecha: ${recibo.fecha_pag}
    </p>    
    </body>`;

    let opcion = {
        'format': 'Letter',
        'header': {
            'heigth': '5mm',
        },
        'footer': {
            'height': '5mm'
        },
    };

    pdf.create(html, opcion).toFile(`./server/routers/email/pdf/${recibo.responsable}.${recibo.documento}.pdf`, (err, respuesta) => {
        if (err) {
            console.log(err);

        } else {
            console.log(respuesta);

        }
    });
    const mailOption = {
        from: `"Uni.co Commercial S.A.C" <no_reply@cosmeticsfromitaly.com>`,
        to: `${recibo.destinario}`,
        subject: `${recibo.subject}`,
        text: 'prova envio',
        html: html,
        attachments: [{
            path: `./server/routers/email/pdf/${recibo.responsable}.${recibo.documento}.pdf`
        }]
    };

    transporter2.sendMail(mailOption, (err, info) => {
        if (err) {
            return callback(err);
        } else {
            return callback(null, info);
        }
    });

};

module.exports = {
    email,
    transporter2
};