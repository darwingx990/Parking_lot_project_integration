const Vehiculo = require('./Vehiculo');     // Aqui va la clase Vehiculo.

const TIPOS_INCIDENCIA = ['RAYON', 'CHOQUE', 'ATROPELLAMIENTO', 'GOLPE_MURO'];

class Incidencia {
    #codigo;
    #vehiculo;
    #fecha;
    #hora;
    #tipoIncidencia;

    constructor(vehiculo, fecha, hora, tipoIncidencia) {
        this.#codigo         = Incidencia.#generarCodigo();
        this.#vehiculo       = vehiculo;
        this.#fecha          = fecha;
        this.#hora           = hora;
        this.#tipoIncidencia = tipoIncidencia;
    }

    static #generarCodigo() {
        const hoy = new Date();
        const anio = hoy.getFullYear();
        const mes  = String(hoy.getMonth() + 1).padStart(2, '0');
        const dia  = String(hoy.getDate()).padStart(2, '0');
        const fechaFormateada = `${anio}${mes}${dia}`;

        const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);

        return `INCD-${fechaFormateada}-${numeroAleatorio}`;
    }

    getCodigo()         { return this.#codigo; }
    getVehiculo()       { return this.#vehiculo; }
    getFecha()          { return this.#fecha; }
    getHora()           { return this.#hora; }
    getTipoIncidencia() { return this.#tipoIncidencia; }

    setVehiculo(vehiculo)             { this.#vehiculo = vehiculo; }
    setFecha(fecha)                   { this.#fecha = fecha; }
    setHora(hora)                     { this.#hora = hora; }
    setTipoIncidencia(tipoIncidencia) { this.#tipoIncidencia = tipoIncidencia; }

    toJSON() {
        return {
            codigo:         this.#codigo,
            vehiculo:       this.#vehiculo ? this.#vehiculo.toJSON() : null,
            fecha:          this.#fecha,
            hora:           this.#hora,
            tipoIncidencia: this.#tipoIncidencia
        };
    }
}

module.exports = Incidencia;
module.exports.TIPOS_INCIDENCIA = TIPOS_INCIDENCIA;