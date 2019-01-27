class Recibo {
    constructor(idfactura, entrada, responsable, documento, idcaja, paga_con, idcliente, fecha = new Date()) {
        this.idfactura = idfactura;
        this.cantidad = entrada;
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