class Recibo {
    constructor(idfactura, cantidad, responsable, documento, idcaja, paga_con, idcliente, fecha = new Date()) {
        this.idfactura = idfactura;
        this.cantidad = cantidad;
        this.fecha_pag = fecha;
        this.responsable = responsable;
        this.documento = documento;
        this.idcaja = idcaja;
        this.paga_con = paga_con;
        this.idcliente = idcliente;

    }
}


module.exports = {
    Recibo
};