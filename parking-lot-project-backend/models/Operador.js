const Usuario = require('./Usuario');

class Operador extends Usuario {
    #clave;

    constructor(id, tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil, estado, clave) {
        super(id, tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil, estado);
        this.#clave = clave;
    }

    getClave() { return this.#clave; }
    setClave(clave) { this.#clave = clave; }

    toJSON() {
        const data = super.toJSON();
        data.clave = this.#clave;
        return data; 
    }
}

module.exports = Operador;
