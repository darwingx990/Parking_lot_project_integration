class Vehiculo {
    #id;
    #placa;
    #color;
    #modelo;
    #marca;
    #tipo;
    #usuarioId;

    constructor(id, placa, color, modelo, marca, tipo, usuarioId) {
        this.#id = id;
        this.#placa = placa;
        this.#color = color;
        this.#modelo = modelo;
        this.#marca = marca;
        this.#tipo = tipo;
        this.#usuarioId = usuarioId;
    }

    getId() { return this.#id; }
    getPlaca() { return this.#placa; }
    getColor() { return this.#color; }
    getModelo() { return this.#modelo; }
    getMarca() { return this.#marca; }
    getTipo() { return this.#tipo; }
    getUsuarioId() { return this.#usuarioId; }

    setId(id) { this.#id = id; }
    setPlaca(placa) { this.#placa = placa; }
    setColor(color) { this.#color = color; }
    setModelo(modelo) { this.#modelo = modelo; }
    setMarca(marca) { this.#marca = marca; }
    setTipo(tipo) { this.#tipo = tipo; }
    setUsuarioId(usuarioId) { this.#usuarioId = usuarioId; }

    toJSON() {
        return {
            id: this.#id,
            placa: this.#placa,
            color: this.#color,
            modelo: this.#modelo,
            marca: this.#marca,
            tipo: this.#tipo,
            usuarioId: this.#usuarioId
        };
    }
}

module.exports = Vehiculo;






