const nodemailer = require('nodemailer');

let email = (recibo, callback) => {
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
    const mailOption = {
        from: `"Uni.co Commercial S.A.C" <no_reply@cosmeticsfromitaly.com>`,
        to: `${recibo.destinario}`,
        subject: `${recibo.subject}`,
        html: `<h1>proviamo a mandare ${recibo.destinario}</h1>
                <hr>
                <p>La empresa Uni.co Commercial envia este correo como costancia de pago </p>
                <p>
                Recibo numero ${recibo.numero}, de S./  ${recibo.cantidad} pago a cuanta de la factuta n° ${recibo.factura}
                </p>
                <p>
                responsable de cobrar el monto indicado arriva el segnor ${recibo.responsable}
                </p>
                <p>
                Fecha: ${recibo.fecha}
                </p>`
    };
    transporter2.sendMail(mailOption, (err, info) => {
        if (err) {
            return callback('err: ', err);
        } else {
            return callback(null, info);
        }
    });

};

// let email1 = {
//     from: prova.from,
//     to: prova.to,
//     subject: prova.subject,
//     // text: prova.text
//     html: `<h1 style="text-center">Prova de html</h1>
//             <hr>
//             <p>Adesso possiamo metter un messagio </p>`,
//     dsn: {
//         id: 'some random message specific id',
//         return: 'headers',
//         notify: ['failure', 'delay'],
//         recipient: prova.from
//     },
//     attachments: [{
//         path: './pdf/prova.pdf'
//     }]
// };

module.exports = {
    email
};