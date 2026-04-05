class GetEstado {
    #id;
    #tipo;
    #estado;

    constructor(id, tipo, estado) {
        this.#id = id;
        this.#tipo = tipo;
        this.#estado = estado;
    }

    getId() { return this.#id; }
    getTipo() { return this.#tipo; }
    getEstado() { return this.#estado; }

    setId(id) { this.#id = id; }
    setTipo(tipo) { this.#tipo = tipo; }
    setEstado(estado) { this.#estado = estado; }

    toJSON() {
        return {
            id: this.#id,
            tipo: this.#tipo,
            estado: this.#estado
        };
    }
}

module.exports = GetEstado;