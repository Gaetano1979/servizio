const mysql = require('./mysql');

const funciones = require('../funciones/funciones');

const queryClientes = require('./querys');



let GetClientes = () => {
    return new Promise((resolve, reject) => {
        mysql.conessione.query(queryClientes.GetTabla('clientes'), (err, clientes) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(clientes);
            }
        });

    });
};

let GetCliente = (id) => {
    return new Promise((resolve, reject) => {
        mysql.conessione.query(queryClientes.GetWhere('clientes', 'idcliente', id), (err, cliente) => {
            if (err) {
                return reject(err);
            } else {
                return resolve(cliente[0]);
            }
        });
    });
};

let GetFacturas = (cliente) => {
    return new Promise((resolve, reject) => {
        mysql.conessione.query(queryClientes.GetWhere('ventas', 'idcliente', cliente.idcliente), (err, facturas) => {
            if (err) {
                return reject(err);
            }
            if (facturas.length === 0) {
                return resolve({
                    message: `No hay Facturas por este cliente ${(cliente.cliente).trim()}`,
                    cliente: cliente
                });
            }
            let años = new Set();
            facturas.forEach(element => {
                años.add(new Date(element.fecha).getFullYear());
            });
            let anni = [...años];
            let nuevo = [];
            let anniFatturas = [];
            anni.forEach(anno => {
                // console.log(anno);
                nuevo = facturas.filter(factura => {
                    return (new Date(factura.fecha).getFullYear()) === anno;
                });
                // console.log({ anno, nuevo });
                objet = {
                    facturaN: nuevo.length,
                    anno: anno,
                    facturas: nuevo,
                };
                anniFatturas.push(objet);


            });



            return resolve({
                message: `hay ${facturas.length} facturas por este cliente ${(cliente.cliente).trim()}`,
                anni: anni,
                annifacturas: anniFatturas,
                cliente,
                facturas
            });
        });
    });
};

let GetClienteFacturas = (id) => {
    return new Promise((resolve, reject) => {
        mysql.conessione.query(queryClientes.GetWhere('clientes', 'idcliente', id), (err, cliente) => {
            if (!cliente) {
                return reject('No hay cliente con este id');
            }
            if (err) {
                return reject(err);
            } else {
                resolve(new Promise((resolve, reject) => {
                    mysql.conessione.query(queryClientes.GetWhere('ventas', 'idcliente', id), (err, facturas) => {
                        if (facturas.length === 0) {
                            return resolve({ message: 'No hay facturas presentes por el cliente', cliente: cliente[0] });
                        }
                        if (err) {
                            return reject(err);
                        }

                        return resolve({
                            message: `hay ${facturas.length} facturas por el cliente ${(cliente[0].cliente).trim()}`,
                            cliente: cliente[0],
                            facturas
                        });
                    });
                }));
            }
        });
    });

};


module.exports = {
    GetClientes,
    GetCliente,
    GetClienteFacturas,
    GetFacturas
};