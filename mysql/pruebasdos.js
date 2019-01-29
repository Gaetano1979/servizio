const Mysql = require('mysql');

const mysql = require('./mysql');




let prova1 = (callback) => {
    mysql.conessione.query(`select * from clientes`, (err, cliente) => {
        if (err) return callback(err);
        mysql.conessione.query(`select * from pagos`, (err, pagos) => {
            if (err) return callback(err);
            if (pagos.length === 0) return callback('No hay cobranza por este cliente');
            mysql.conessione.query(`select * from ventas`, (err, fatturas) => {
                if (err) return callback(err);
                if (fatturas.length === 0) return callback('No hay fatturas por este cliente');
                mysql.conessione.query(`select * from notas`, (err, notas) => {
                    let resToto = [];
                    let res;
                    cliente.forEach(cl => {
                        let patot = 0;
                        let fatt = [];
                        let pag = [];
                        let tot = 0;
                        let iniz = 0;
                        let _totNotas = 0;
                        let notcl = [];
                        pagos.find(pa => {
                            if (pa.idcliente === cl.idcliente) {
                                patot += pa.cantidad;
                                pag.push({
                                    id: pa.idpago,
                                    res: pa.responsable,
                                    can: pa.cantidad,
                                    idfatt: pa.idfactura
                                });
                            }
                        });
                        fatturas.find(fa => {
                            if (fa.idcliente === cl.idcliente) {
                                tot += fa.total;
                                iniz += fa.inicial;
                                fatt.push({
                                    id: fa.idfactura,
                                    doc: fa.documento,
                                    fecha: fa.fecha,
                                    tot: fa.total,
                                    inicial: fa.inicial
                                });
                            }
                        });
                        notas.find(no => {
                            if (no.idcliente == cl.idcliente) {
                                _totNotas += Number((no.total).toFixed(2));
                                notcl.push({
                                    fattura: no.factura,
                                    numero_nota: no.documento,
                                    monto_nota_credito: Number((no.total).toFixed(2))
                                });

                            }
                        });

                        res = {
                            id: cl.idcliente,
                            saldo: Number((tot - iniz - patot - _totNotas).toFixed(2)),
                            comp_tot: Number(tot.toFixed(2)),
                            pagoTot: Number(patot.toFixed(2)),
                            inicial: Number(iniz.toFixed(2)),
                            cliente: cl.cliente,
                            ciudad: cl.ciudad,
                            zona: cl.zona,
                            direccion: cl.direccion,
                            fatturas: fatt,
                            pagamenti: pag,
                            notas: notcl

                        };
                        resToto.push(res);
                        // console.log('=======================');
                    });
                    return callback(null, resToto);
                });
            });
        });
    });
};

let MysqlGetDatosCliente2 = (id, callback) => {

    mysql.conessione.query(`select * from ventas where idcliente=${id} `, (err, fatturas_cliente) => {
        if (fatturas_cliente === 0) {
            return callback('no hay ventas por este cliente');
        } else {

            mysql.conessione.query(`select * from pagos where idcliente=${id} `, (err, pagamenti_cliente) => {
                if (err) {
                    return callback('Error ', err);
                } else {
                    mysql.conessione.query(`select * from notas where idcliente=${id}`, (err, notas) => {

                        let arrDoc = [];
                        let Doc;

                        fatturas_cliente.forEach(element => {
                            let pagamenti = 0;
                            let recibos = [];
                            let nota_cre = [];
                            let totNotas = 0;

                            pagamenti_cliente.find(pagos => {

                                if (pagos.idfactura === element.idfactura) {
                                    pagamenti += pagos.cantidad;
                                    let ob = {
                                        id: pagos.idpago,
                                        pago: pagos.cantidad,
                                        resposable: pagos.responsable,
                                        fecha: pagos.fecha_pag,
                                        recibo: pagos.documento
                                    };
                                    recibos.push(ob);
                                }
                            });
                            notas.find(not => {
                                if (not.factura == element.documento) {
                                    let _totNota = (not.total).toFixed(2);
                                    totNotas += _totNota;

                                    let notas = {
                                        numero_nota: not.documento,
                                        total_nota: _totNota,
                                        fattura_n: not.factura
                                    };
                                    nota_cre.push(notas);
                                }
                            });
                            let SaldoTot = (element.total - pagamenti - element.inicial - totNotas);
                            Doc = {
                                Saldo: Number(SaldoTot.toFixed(2)),
                                Id_Factura: element.idfactura,
                                Cancelado: Number(pagamenti.toFixed(2)),
                                Total_Factura: element.total,
                                Total_Notas: Number(totNotas),
                                Tipo: element.tipodoc,
                                Documento: element.documento,
                                Fecha_factura: element.fecha,
                                Recibos: recibos,
                                Notas: nota_cre,
                                Inicial: element.inicial
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
        }
    });
};

module.exports = {
    prova1,
    MysqlGetDatosCliente2
};