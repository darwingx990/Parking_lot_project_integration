class ReporteIncidencia {
    #vehiculoId;
    #incidenciaId;
    #fechaHora;

    constructor(vehiculoId, incidenciaId, fechaHora) {
        this.#vehiculoId = vehiculoId;
        this.#incidenciaId = incidenciaId;
        this.#fechaHora = fechaHora;
    }

    getVehiculoId() { return this.#vehiculoId; }
    getIncidenciaId() { return this.#incidenciaId; }
    getFechaHora() { return this.#fechaHora; }

    setVehiculoId(vehiculoId) { this.#vehiculoId = vehiculoId; }
    setIncidenciaId(incidenciaId) { this.#incidenciaId = incidenciaId; }
    setFechaHora(fechaHora) { this.#fechaHora = fechaHora; }

    toJSON() {
        return {
            vehiculoId: this.#vehiculoId,
            incidenciaId: this.#incidenciaId,
            fechaHora: this.#fechaHora
        };
    }
}

module.exports = ReporteIncidencia;
