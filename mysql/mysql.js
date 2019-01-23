const Mysql = require('mysql');

let conessione = Mysql.createConnection({
    host: 'ls-4ced6077d7519bffb5de949e2bae2dcbe3615210.c5s20s1vsvjo.eu-central-1.rds.amazonaws.com',
    password: 'gaetano1979',
    user: 'dbmasteruser',
    database: 'sistematic_net'
});
let MysqlAperto = () => {
    conessione.connect((err) => {
        if (err) {
            return console.log(err);
        } else {
            console.log('Conessione eseguita con successo', conessione.config.database);
            console.log('Estado conesssione en conessioneaperta', conessione.state);
        }
    });
};
let MysqlChiuso = () => {
    conessione.end((err) => {
        if (err) {
            return console.log(err);
        } else {
            console.log('Conessione chiusa  con successo');
            console.log('Estado conesssione en conessionechiusa', conessione.state);
        }
    });
};
let MysqlQuery = (query, callback) => {
    // MysqlAperto();
    conessione.query(query, (err, resultado) => {
        if (err) {
            return callback(err);
        }
        if (resultado.length === 0) {
            return callback('Registro no encontrado');
        } else {
            console.log('resultados enviados');
            return callback(null, resultado);
        }
    });
    // MysqlChiuso();
};
let MysqlGetDatosCliente = (id, callback) => {

    conessione.query(`select * from ventas where idcliente=${id} `, (err, fatturas_cliente) => {
        if (fatturas_cliente == 0) {
            return callback('no hay ventas por este cliente');
        } else {

            conessione.query(`select * from pagos where idcliente=${id} `, (err, pagamenti_cliente) => {

                let arrDoc = [];
                let Doc;

                fatturas_cliente.forEach(element => {
                    let pagamenti = 0;
                    let recibos = [];

                    pagamenti_cliente.find(pagos => {

                        if (pagos.idfactura === element.idfactura) {
                            pagamenti += pagos.cantidad;
                            let ob = {
                                pago: pagos.cantidad,
                                resposable: pagos.responsable,
                                fecha: pagos.fecha_pag,
                                recibo: pagos.documento
                            };
                            recibos.push(ob);
                        }
                    });
                    Doc = {
                        Id_Factura: element.idfactura,
                        Tipo: element.tipodoc,
                        Documento: element.documento,
                        Fecha_factura: element.fecha,
                        Recibos: recibos,
                        Cancelado: pagamenti,
                        Total_Factura: element.total,
                        Saldo: (element.total - pagamenti)
                    };
                    arrDoc.push(Doc);
                });

                if (pagamenti_cliente.length === 0) {
                    return callback('no hay cobranza por este cliente');
                } else {
                    return callback(null, arrDoc);

                }
            });
        }
    });
};



module.exports = {
    conessione,
    MysqlAperto,
    MysqlChiuso,
    MysqlQuery,
    MysqlGetDatosCliente
};