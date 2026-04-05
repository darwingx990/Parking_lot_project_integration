class HistorialParqueo {
    #celdaId;
    #vehiculoId;
    #fechaHora;

    constructor(celdaId, vehiculoId, fechaHora) {
        this.#celdaId = celdaId;
        this.#vehiculoId = vehiculoId;
        this.#fechaHora = fechaHora;
    }

    getCeldaId() { return this.#celdaId; }
    getVehiculoId() { return this.#vehiculoId; }
    getFechaHora() { return this.#fechaHora; }

    setCeldaId(celdaId) { this.#celdaId = celdaId; }
    setVehiculoId(vehiculoId) { this.#vehiculoId = vehiculoId; }
    setFechaHora(fechaHora) { this.#fechaHora = fechaHora; }

    toJSON() {
        return {
            celdaId: this.#celdaId,
            vehiculoId: this.#vehiculoId,
            fechaHora: this.#fechaHora
        };
    }
}

module.exports = HistorialParqueo;