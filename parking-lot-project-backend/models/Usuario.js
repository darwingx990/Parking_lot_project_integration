class Usuario {
    #id;
    #tipoDocumento;
    #numeroDocumento;
    #primerNombre;
    #segundoNombre;
    #primerApellido;
    #segundoApellido;
    #direccionCorreo;
    #numeroCelular;
    #fotoPerfil;
    #estado;

    constructor(id, tipoDocumento, numeroDocumento, primerNombre, segundoNombre, primerApellido, segundoApellido, direccionCorreo, numeroCelular, fotoPerfil, estado) {
        this.#id = id;
        this.#tipoDocumento = tipoDocumento;
        this.#numeroDocumento = numeroDocumento;
        this.#primerNombre = primerNombre;
        this.#segundoNombre = segundoNombre;
        this.#primerApellido = primerApellido;
        this.#segundoApellido = segundoApellido;
        this.#direccionCorreo = direccionCorreo;
        this.#numeroCelular = numeroCelular;
        this.#fotoPerfil = fotoPerfil;
        this.#estado = estado;
    }

    getId() { return this.#id; }
    getTipoDocumento() { return this.#tipoDocumento; }
    getNumeroDocumento() { return this.#numeroDocumento; }
    getPrimerNombre() { return this.#primerNombre; }
    getSegundoNombre() { return this.#segundoNombre; }
    getPrimerApellido() { return this.#primerApellido; }
    getSegundoApellido() { return this.#segundoApellido; }
    getDireccionCorreo() { return this.#direccionCorreo; }
    getNumeroCelular() { return this.#numeroCelular; }
    getFotoPerfil() { return this.#fotoPerfil; }
    getEstado() { return this.#estado; }

    setId(id) { this.#id = id; }
    setTipoDocumento(tipoDocumento) { this.#tipoDocumento = tipoDocumento; }
    setNumeroDocumento(numeroDocumento) { this.#numeroDocumento = numeroDocumento; }
    setPrimerNombre(primerNombre) { this.#primerNombre = primerNombre; }
    setSegundoNombre(segundoNombre) { this.#segundoNombre = segundoNombre; }
    setPrimerApellido(primerApellido) { this.#primerApellido = primerApellido; }
    setSegundoApellido(segundoApellido) { this.#segundoApellido = segundoApellido; }
    setDireccionCorreo(direccionCorreo) { this.#direccionCorreo = direccionCorreo; }
    setNumeroCelular(numeroCelular) { this.#numeroCelular = numeroCelular; }
    setFotoPerfil(fotoPerfil) { this.#fotoPerfil = fotoPerfil; }
    setEstado(estado) { this.#estado = estado; }

    toJSON() {
        return {
            id: this.#id,
            tipoDocumento: this.#tipoDocumento,
            numeroDocumento: this.#numeroDocumento,
            primerNombre: this.#primerNombre,
            segundoNombre: this.#segundoNombre,
            primerApellido: this.#primerApellido,
            segundoApellido: this.#segundoApellido,
            direccionCorreo: this.#direccionCorreo,
            numeroCelular: this.#numeroCelular,
            fotoPerfil: this.#fotoPerfil,
            estado: this.#estado
        };
    }
}

module.exports = Usuario;
