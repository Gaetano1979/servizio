class Caja {
    constructor(documento, docfactura, nomcliente, entrada, destino, tarjeta, ref, salida = 0, fecha = new Date()) {
        this.documento = documento;
        this.fecha = fecha;
        this.concepto = `Pago a Cuenta Fact N°${docfactura} de ${nomcliente}`;
        this.entrada = entrada;
        this.salida = salida;
        this.moneda = "S/";
        this.turno = 1;
        this.local = 1;
        this.num_caja = 1;
        this.usuario = 'Admin';
        this.destino_origen = destino;
        this.tarjeta = tarjeta;
        this.ref_tarjeta = ref;
    }
}


module.exports = {
    Caja
};