class Usuario {
    constructor(nombre, apellido, roule = 'Admin') {
        this.nombre = nombre;
        this.apellido = apellido;
        this.roule = roule;
    }

}


module.exports = {
    Usuario
};