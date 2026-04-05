class AccesoSalidas {
    #id;
    #movimiento;
    #fechaHora;
    #puerta;
    #tiempoEstadia;
    #vehiculoId;

    constructor(id, movimiento, fechaHora, puerta, tiempoEstadia, vehiculoId) {
        this.#id = id;
        this.#movimiento = movimiento;
        this.#fechaHora = fechaHora;
        this.#puerta = puerta;
        this.#tiempoEstadia = tiempoEstadia;
        this.#vehiculoId = vehiculoId;
    }

    getId() { return this.#id; }
    getMovimiento() { return this.#movimiento; }
    getFechaHora() { return this.#fechaHora; }
    getPuerta() { return this.#puerta; }
    getTiempoEstadia() { return this.#tiempoEstadia; }
    getVehiculoId() { return this.#vehiculoId; }

    setId(id) { this.#id = id; }
    setMovimiento(movimiento) { this.#movimiento = movimiento; }
    setFechaHora(fechaHora) { this.#fechaHora = fechaHora; }
    setPuerta(puerta) { this.#puerta = puerta; }
    setTiempoEstadia(tiempoEstadia) { this.#tiempoEstadia = tiempoEstadia; }
    setVehiculoId(vehiculoId) { this.#vehiculoId = vehiculoId; }

    toJSON() {
        return {
            id: this.#id,
            movimiento: this.#movimiento,
            fechaHora: this.#fechaHora,
            puerta: this.#puerta,
            tiempoEstadia: this.#tiempoEstadia,
            vehiculoId: this.#vehiculoId
        };
    }
}

module.exports = AccesoSalidas;

