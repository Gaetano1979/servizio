const mysql = require('./mysql');

const { Recibo } = require('../clases/recibos');
const { Caja } = require('../clases/caja');


let get_factura = (id, callback) => {
    let query = `select *from ventas where ventas.idfactura=${id}`;
    if (!id) {
        return callback('Erorr en el Id');
    }
    mysql.conessione.query(query, (err, factura) => {
        if (factura.length === 0) return callback(`No hay una factura con este id`);
        if (err) {
            return callback('Error', err);
        } else {

            return callback(null, {
                idfactura: factura[0].idfactura,
                documento: factura[0].documento,
                fecha: factura[0].fecha,
                idcliente: factura[0].idcliente,
                total: factura[0].total
            });
        }
    });
};
let deleteUsuario = (id, callback) => {

    mysql.conessione.query(`delete from usuario where idusuario=${id} `, (err, data) => {
        if (err) {
            return callback('Error ', err);
        } else {
            return callback(null, data);
        }
    });
};
let get_recibos = (idfattura, callback) => {
    let query = `select *from pagos where pagos.idfactura=${idfattura}`;
    mysql.conessione.query(query, (err, recibos) => {

        if (err) {
            return callback('Error', err);
        } else {

            return callback(null, recibos);
        }
    });
};

let getTot = (id, callback) => {
    get_factura(id, (err, factura) => {
        if (!factura) return callback(`No hay factura con  este id: ${id}`);

        if (err) {
            return callback('error', err);
        }

        get_recibos(factura.idfactura, (err, recibos) => {

            if (err) {
                return callback('error', err);
            } else {
                let arr = recibos;
                let monto = 0;
                let totalrecibos = [];
                arr.forEach(element => {
                    monto += element.cantidad;
                });
                totalrecibos.push(monto);

                let Saldo = factura.total - monto;
                return callback(null, {
                    idcliente: factura.idcliente,
                    fecha_documento: factura.fecha,
                    documento: factura.documento,
                    Totale_Fattura: factura.total,
                    Totale_Recibos: Number(monto.toFixed(2)),
                    Saldo_Factura: Number(Saldo.toFixed(2)),
                    recibos: recibos
                });
            }

        });
    });
};

let postcaja = (caja, saldo, callback) => {
    if (!caja) {
        return callback('Ingresar caja');
    }
    if (caja.entrada > saldo) {
        return callback('Deposito mayor al saldo');
    } else {

        // if (err) return callback('Error', err);
        mysql.conessione.query(`insert into caja set ?`, caja, (err, idcaja) => {
            if (err) {
                return callback('Error post Caja', err);
            } else {
                return callback(null, idcaja.insertId);
            }
        });
    }
    console.log('saldo', saldo);
    console.log('caja.entrada', caja.entrada);
};

let postRecibo = (recibo, idcaja, callback) => {
    if (!recibo) return callback('ingresar recibo');
    if (!idcaja) return callback('Manca el Id de la caja');
    mysql.conessione.query(`insert into pagos set ?`, recibo, (err, data) => {
        if (err) {
            return callback('Error post recibo', err);
        } else {
            return callback(null, data);
        }
    });
};

let getNombre = (id, callback) => {
    if (!id) return callback('Ingresar Id');
    mysql.conessione.query(`select * from clientes where idcliente=${id}`, (err, cliente) => {
        if (err) {
            return callback('Error get nombre', err);
        } else {
            return callback(null, cliente[0].cliente);
        }

    });
};

let getUsuario = (query, callback) => {
    mysql.conessione.query(query, (err, usuario) => {
        if (!usuario) return callback('No hemos recibidos Usuarios');
        if (err) {
            return callback('Error ', err);
        } else {
            return callback(null, usuario);
        }
    });
};

let postUsuario = (usuario, callback) => {

    mysql.conessione.query(`insert into usuario set ?`, usuario, (err, result) => {
        if (err) {
            return callback('Error ', err);
        } else {
            return callback(null, result);
        }
    });

};


module.exports = {
    get_factura,
    get_recibos,
    getTot,
    postcaja,
    postRecibo,
    getNombre,
    getUsuario,
    postUsuario,
    deleteUsuario
};