class PicoPlaca {
    #id;
    #tipoVehiculo;
    #numero;
    #dia;

    constructor(id, tipoVehiculo, numero, dia) {
        this.#id = id;
        this.#tipoVehiculo = tipoVehiculo;
        this.#numero = numero;
        this.#dia = dia;
    }

    // Getters
    getId() { return this.#id; }
    getTipoVehiculo() { return this.#tipoVehiculo; }
    getNumero() { return this.#numero; }
    getDia() { return this.#dia; }

    // Setters
    setId(id) { this.#id = id; }
    setTipoVehiculo(tipoVehiculo) { this.#tipoVehiculo = tipoVehiculo; }
    setNumero(numero) { this.#numero = numero; }
    setDia(dia) { this.#dia = dia; }

    toJSON() {
        return {
            id: this.#id,
            tipoVehiculo: this.#tipoVehiculo,
            numero: this.#numero,
            dia: this.#dia
        };
    }
}

module.exports = PicoPlaca;
