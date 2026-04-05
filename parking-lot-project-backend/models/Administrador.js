const Usuario = require('./Usuario');

class Administrador extends Usuario {
    #clave;

    constructor(id, tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil, estado, clave) {
        super(id, tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil, estado);
        this.#clave = clave;
    }

    getClave() { return this.#clave; }
    setClave(clave) { this.#clave = clave; }

    toJSON() {
        const data = super.toJSON();
        data.clave = this.#clave; // Dependiendo de la lógica de negocio, a veces no se retorna la clave en el JSON
        return data; 
    }
}

module.exports = Administrador;
