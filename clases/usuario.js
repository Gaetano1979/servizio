class Usuario {
    constructor(nombre, apellido, roule = 'Admin', fecha = new Date()) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.roule = roule;
        this.fecha = fecha;
    }

}


module.exports = {
    Usuario
};