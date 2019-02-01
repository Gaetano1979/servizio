const Mysql = require('mysql');

const mysql = require('./mysql');


// recibimos id cliente
let Mysql_prova = (id, callback) => {

    mysql.conessione.query(`select * from ventas where idcliente=${id} `, (err, fatturas_cliente) => {
        if (fatturas_cliente.length == 0) {
            return callback(`no hay ventas por el cliente con ${id}`);
        } else {
            // recibo todo las facturas del cliente
            // console.log(fatturas_cliente, 'fatturas');
            let Total_Cliente = 0;
            fatturas_cliente.forEach(element => {
                Total_Cliente += element.total;
                // console.log('total', total);

            });
            // console.log('Total Cliente', Total_Cliente);



            mysql.conessione.query(`select * from pagos where idcliente=${id} `, (err, pagamenti_cliente) => {

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
                Total_Saldo = 0;
                arrDoc.forEach(element => {
                    Total_Saldo += element.Saldo;

                });
                // console.log('Saldo_Total', Total_Saldo);



                if (pagamenti_cliente.length === 0) {
                    return callback('no hay cobranza por este cliente');
                } else {
                    return callback(null, {

                        fat_tot_cliente: Total_Cliente,
                        saldoAcombrar: Total_Saldo,
                        arrDoc
                    });

                }
            });
        }
    });
};

let prova1 = (callback) => {
    mysql.conessione.query(`select * from clientes`, (err, cliente) => {
        if (err) return callback(err);
        mysql.conessione.query(`select * from pagos`, (err, pagos) => {
            if (err) return callback(err);
            // if (pagos.length === 0) return callback('No hay cobranza por este cliente');
            mysql.conessione.query(`select * from ventas`, (err, fatturas) => {
                if (err) return callback(err);
                if (fatturas.length === 0) return callback('No hay fatturas por este cliente');

                let resToto = [];
                let res;
                cliente.forEach(cl => {
                    let patot = 0;
                    let fatt = [];
                    let pag = [];
                    let tot = 0;
                    let iniz = 0;
                    pagos.find(pa => {
                        if (pa.idcliente === cl.idcliente) {
                            patot += pa.cantidad;
                            pag.push({
                                id: pa.idpago,
                                res: pa.responsable,
                                can: pa.cantidad,
                                fatt: pa.idfactura
                            });
                        }
                    });
                    fatturas.find(fa => {
                        if (fa.idcliente === cl.idcliente) {
                            tot += fa.total;
                            iniz += fa.inicial;
                            fatt.push({
                                id: fa.idfactura,
                                fecha: fa.fecha,
                                tot: fa.total,
                                inicial: fa.inicial
                            });
                        }
                    });

                    res = {
                        id: cl.idcliente,
                        saldo: Number((tot - iniz - patot).toFixed(2)),
                        comp_tot: Number(tot.toFixed(2)),
                        pagoTot: Number(patot.toFixed(2)),
                        inicial: Number(iniz.toFixed(2)),
                        cliente: cl.cliente,
                        ciudad: cl.ciudad,
                        zona: cl.zona,
                        direccion: cl.direccion,
                        telefono: cl.telefono1,
                        telefono_ax: cl.telefono2,
                        cellulare: cl.celular,
                        correo: cl.email,
                        vendedor: cl.vendedor,
                        Ruc: cl.ruc,
                        Dni: cl.dni,
                        fatturas: fatt,
                        pagamenti: pag
                    };
                    resToto.push(res);
                    // console.log('=======================');
                });
                return callback(null, resToto);
            });
        });
    });
};

let buscar = (termino, callback) => {
    mysql.conessione.query(`select * from clientes where cliente like '%${termino}%'`, (err, nome) => {
        if (err)
            return callback('Error ', err);

        mysql.conessione.query(`select * from pagos where documento like '%${termino}%' `, (err, pago) => {

            if (err)
                return callback('Error ', err);


            mysql.conessione.query(`select * from ventas where documento like '%${termino}%'`, (err, fattura) => {

                if (err) {
                    return callback('Error ', err);
                } else {
                    return callback(null, {
                        nome,
                        fattura,
                        pago
                    });
                }
            });
        });

    });
};

let update = (modifica, callback) => {

    mysql.conessione.query(`UPDATE usuario SET nombre=?,apellido=? where idusuario=?`, [modifica[0], modifica[1], modifica[2]], (err, result) => {
        if (err) {
            return callback('Error ', err);
        } else {
            return callback(null, result);
        }

    });
}




let prova = ['Silverio', "", 22];
update(prova, (err, result) => {
    console.log(prova);


    if (err) {
        console.log({
            err,
            prova
        });


    } else {
        console.log({
            message: 'Update riuscito',
            result
        });

    }
});

module.exports = {
    prova1,
    buscar
};