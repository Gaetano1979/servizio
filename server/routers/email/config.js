const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
// dependencia fs
const fs = require('fs');
const path = require('path');
const img = path.resolve(__dirname, '../../../img/unico/logoUnico.png');




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
    fs.exists(img, (esiste) => {
        if (esiste) {
            console.log('il file esiste');

        } else {
            console.log('il file no esiste');

        }
    });


    // const html = `<body>
    // <h1>Estimado <small>${recibo.cliente}</small> </h1>
    // <hr>
    // <p>La empresa Uni.co Commercial envia este correo como costancia de pago </p>
    // <p>
    // Recibo numero ${recibo.documento}, de S./  ${recibo.cantidad} pago a cuanta de la factuta n° ${recibo.fattura}
    // </p>
    // <p>
    // responsable de cobrar el monto indicado arriva el segnor ${recibo.responsable}
    // </p>
    // <p>
    // Fecha: ${recibo.fecha_pag}
    // </p>    
    // </body>`;
    const html = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Recibo de cobranza</title>
    <style>
        
        body {
            margin: 20px;
            padding: 0;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-style: oblique;
            background: rgba(241, 241, 241, 241);
            -webkit-print-color-adjust: exact;
            box-sizing: border-box;
        }
        
        .lista {
            display: flex;
            flex-direction: row;
            margin-bottom: 5px;
        }
        
        img {
            width: 40px;
            height: 40px;
        }
        
        h2 {
            text-align: center;
            border-bottom: solid 0.2px black;
            margin-left: 5px;
            margin-top: 5px;
        }
        
        .testa {
            display: -webkit-flex;
        }
        
        .left {
            text-align: right;
            width: 50%;
            right: 0;
        }
        
        .right {
            width: 50%;
        }
        
        ul {
            margin-top: 0;
            padding-left: 5px;
            list-style-type: none;
        }
        
        .recibo {
            min-height: 300px;
            margin-top: 2%;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
<div class="lista"><img src=${img}>
    <ul>
        <li>Unico Commercial S.A.C.</li>
        <li>Calle Universitaria 524</li>
        <li>Lima</li>
        <li>San Miguel</li>
        <li>Ruc: 20557749196</li>

    </ul>
</div>

<div>
    <h2>Recibo de Cobranza</h2>
</div>
<div class="testa">
    <ul class="right">
        <li>Vendedor: ${recibo.responsable}</li>
        <li>Districto: ${recibo.zona}</li>
        <li>Cliente: ${recibo.cliente}</li>
    </ul>
    <table class="left">
        <tr>
            <th>Recibo de cobranza</th>
        </tr>
        <tr>
            <td>${recibo.documento}</td>
        </tr>
    </table>
    

</div>
<div class="recibo">
    <table>
        <tr>
            <th>Factura</th>
            <th>Saldo</th>
            <th>Deposito</th>
            <th>Nuevo Saldo</th>
        </tr>
        <tr>
            <td>${recibo.fattura}</td>
            <td>${recibo.saldo}</td>
            <td>${recibo.cantidad}</td>
            <td>${recibo.saldo - recibo.cantidad}</td>
        </tr>
    </table>
</div>
<div>
    <label for="">Observacione</label>
    <p>${recibo.observaciones}</p>
</div>



</body>

</html>`;

    // let opcion = {
    //     'format': 'Letter',
    //     'header': {
    //         'heigth': '5mm',
    //     },
    //     'footer': {
    //         'height': '5mm'
    //     },
    // };

    pdf.create(html).toFile(path.resolve(__dirname, `../../routers/email/pdf/${recibo.responsable}.${recibo.documento}.pdf`), (err, respuesta) => {
        if (err) {
            console.log(err);

        } else {
            console.log(respuesta);

        }
    });
    let email = path.resolve(__dirname, `../../routers/email/pdf/${recibo.responsable}.${recibo.documento}.pdf`);
    const mailOption = {
        from: `"Uni.co Commercial S.A.C" <no_reply@cosmeticsfromitaly.com>`,
        to: `${recibo.destinario}`,
        subject: `${recibo.subject}`,
        text: 'prova envio',
        html: html,
        attachments: [{
            path: email
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