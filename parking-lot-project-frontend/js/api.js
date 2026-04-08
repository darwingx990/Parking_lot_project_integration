const API_BASE_URL = 'http://localhost:3000/api';

const api = {
    baseURL: API_BASE_URL,

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    getToken() {
        return localStorage.getItem('parkingToken');
    },

    setToken(token) {
        localStorage.setItem('parkingToken', token);
    },

    getCurrentUser() {
        const userStr = localStorage.getItem('parkingUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    setCurrentUser(user) {
        localStorage.setItem('parkingUser', JSON.stringify(user));
    },

    logout() {
        localStorage.removeItem('parkingUser');
        localStorage.removeItem('parkingToken');
    },

    isAuthenticated() {
        return this.getCurrentUser() !== null;
    },

    hasRole(roles) {
        const user = this.getCurrentUser();
        if (!user) return false;
        if (typeof roles === 'string') roles = [roles];
        return roles.includes(user.rol);
    },

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en la solicitud');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    async patch(endpoint, body = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    },

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },

    async login(numeroDocumento, clave, tipoLogin = null) {
        const response = await this.post('/auth/login', { numeroDocumento, clave, tipoLogin });

        if (!response || !response.usuario) {
            throw new Error('Respuesta inválida del servidor');
        }

        // Guardar token JWT
        if (response.token) {
            this.setToken(response.token);
        }

        const userData = {
            id: response.usuario.id,
            tipoDocumento: response.usuario.tipoDocumento,
            numeroDocumento: response.usuario.numeroDocumento,
            primerNombre: response.usuario.primerNombre,
            segundoNombre: response.usuario.segundoNombre,
            primerApellido: response.usuario.primerApellido,
            segundoApellido: response.usuario.segundoApellido,
            nombre: `${response.usuario.primerNombre} ${response.usuario.primerApellido}`,
            direccionCorreo: response.usuario.direccionCorreo,
            numeroCelular: response.usuario.numeroCelular,
            fotoPerfil: response.usuario.fotoPerfil,
            rol: response.usuario.perfil || response.usuario.rol || 'usuario',
            perfil: response.usuario.perfil,
            perfilId: response.usuario.perfilId
        };

        this.setCurrentUser(userData);
        return userData;
    },

    perfil: {
        async get(id) {
            return api.get(`/perfil/${id}`);
        },

        async update(id, data) {
            return api.put(`/perfil/${id}`, data);
        },

        async cambiarClave(id, claveActual, claveNueva) {
            return api.put(`/perfil/${id}/clave`, { claveActual, claveNueva });
        }
    },

    usuarios: {
        async getAll() {
            return api.get('/usuarios');
        },

        async getById(id) {
            return api.get(`/usuarios/${id}`);
        },

        async getByDocumento(numeroDocumento) {
            return api.get(`/usuarios/documento/${numeroDocumento}`);
        },

        async create(data) {
            return api.post('/usuarios', data);
        },

        async update(id, data) {
            return api.put(`/usuarios/${id}`, data);
        },

        async delete(id) {
            return api.delete(`/usuarios/${id}`);
        }
    },

    vehiculos: {
        async getAll() {
            return api.get('/vehiculo');
        },

        async getById(id) {
            return api.get(`/vehiculo/${id}`);
        },

        async getByUsuario(usuarioId) {
            return api.get(`/vehiculo/usuario/${usuarioId}`);
        },

        async getByPlaca(placa) {
            return api.get(`/vehiculo/placa/${placa}`);
        },

        async create(data) {
            return api.post('/vehiculo', data);
        },

        async update(id, data) {
            return api.put(`/vehiculo/${id}`, data);
        },

        async delete(id) {
            return api.delete(`/vehiculo/${id}`);
        }
    },

    accesoSalidas: {
        async getAll() {
            return api.get('/acceso-salida');
        },

        async getById(id) {
            return api.get(`/acceso-salida/${id}`);
        },

        async getByVehiculo(vehiculoId) {
            return api.get(`/acceso-salida/vehiculo/${vehiculoId}`);
        },

        async getByFechaRango(fechaInicio, fechaFin) {
            return api.get(`/acceso-salida/fecha/${fechaInicio}/${fechaFin}`);
        },

        async create(data) {
            return api.post('/acceso-salida', data);
        },

        async update(id, data) {
            return api.put(`/acceso-salida/${id}`, data);
        },

        async delete(id) {
            return api.delete(`/acceso-salida/${id}`);
        }
    },

    getEstado: {
        async getAll() {
            return api.get('/get-estado');
        },

        async getById(id) {
            return api.get(`/get-estado/${id}`);
        },

        async getByTipo(tipo) {
            return api.get(`/get-estado/tipo/${tipo}`);
        },

        async getByEstado(estado) {
            return api.get(`/get-estado/estado/${estado}`);
        },

        async getFirstFree(tipo) {
            return api.get(`/get-estado/libre/${tipo}`);
        },

        async create(data) {
            return api.post('/get-estado', data);
        },

        async update(id, data) {
            return api.put(`/get-estado/${id}`, data);
        },

        async ocupar(id) {
            return api.patch(`/get-estado/${id}/ocupar`);
        },

        async liberar(id) {
            return api.patch(`/get-estado/${id}/liberar`);
        },

        async delete(id) {
            return api.delete(`/get-estado/${id}`);
        }
    },

    historialParqueo: {
        async getAll() {
            return api.get('/historial-parqueo');
        },

        async getByVehiculo(vehiculoId) {
            return api.get(`/historial-parqueo/vehiculo/${vehiculoId}`);
        },

        async getByCelda(celdaId) {
            return api.get(`/historial-parqueo/celda/${celdaId}`);
        },

        async getByCeldaYVehiculo(celdaId, vehiculoId) {
            return api.get(`/historial-parqueo/${celdaId}/${vehiculoId}`);
        },

        async create(data) {
            return api.post('/historial-parqueo', data);
        },

        async update(celdaId, vehiculoId, data) {
            return api.put(`/historial-parqueo/${celdaId}/${vehiculoId}`, data);
        },

        async delete(celdaId, vehiculoId) {
            return api.delete(`/historial-parqueo/${celdaId}/${vehiculoId}`);
        }
    },

    incidencias: {
        async getAll() {
            return api.get('/incidencia');
        },

        async getById(id) {
            return api.get(`/incidencia/${id}`);
        },

        async getByNombre(nombre) {
            return api.get(`/incidencia/nombre/${nombre}`);
        },

        async create(data) {
            return api.post('/incidencia', data);
        },

        async update(id, data) {
            return api.put(`/incidencia/${id}`, data);
        },

        async delete(id) {
            return api.delete(`/incidencia/${id}`);
        }
    },

    reportesIncidencia: {
        async getAll() {
            return api.get('/reportes-incidencia');
        },

        async getByVehiculo(vehiculoId) {
            return api.get(`/reportes-incidencia/vehiculo/${vehiculoId}`);
        },

        async getByVehiculoYIncidencia(vehiculoId, incidenciaId) {
            return api.get(`/reportes-incidencia/${vehiculoId}/${incidenciaId}`);
        },

        async create(data) {
            return api.post('/reportes-incidencia', data);
        },

        async update(vehiculoId, incidenciaId, data) {
            return api.put(`/reportes-incidencia/${vehiculoId}/${incidenciaId}`, data);
        },

        async delete(vehiculoId, incidenciaId) {
            return api.delete(`/reportes-incidencia/${vehiculoId}/${incidenciaId}`);
        }
    },

    picoPlaca: {
        async getAll() {
            return api.get('/pico-placa');
        },

        async getById(id) {
            return api.get(`/pico-placa/${id}`);
        },

        async create(data) {
            return api.post('/pico-placa', data);
        },

        async update(id, data) {
            return api.put(`/pico-placa/${id}`, data);
        },

        async delete(id) {
            return api.delete(`/pico-placa/${id}`);
        },

        async verificarRestriccion(tipoVehiculo, placa) {
            const reglas = await this.getAll();
            const today = new Date();
            const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const diaActual = diasSemana[today.getDay()];
            const ultimoDigito = placa.slice(-1);

            return reglas.find(r =>
                r.tipoVehiculo === tipoVehiculo &&
                r.dia === diaActual &&
                r.numero === ultimoDigito
            );
        }
    },

    administradores: {
        async getAll() {
            return api.get('/administradores');
        },

        async getById(id) {
            return api.get(`/administradores/${id}`);
        },

        async create(data) {
            return api.post('/administradores', data);
        },

        async update(id, data) {
            return api.put(`/administradores/${id}`, data);
        },

        async delete(id) {
            return api.delete(`/administradores/${id}`);
        }
    },

    operadores: {
        async getAll() {
            return api.get('/operadores');
        },

        async getById(id) {
            return api.get(`/operadores/${id}`);
        },

        async create(data) {
            return api.post('/operadores', data);
        },

        async update(id, data) {
            return api.put(`/operadores/${id}`, data);
        },

        async delete(id) {
            return api.delete(`/operadores/${id}`);
        }
    },

    reportes: {
        async getUsuarios() {
            return api.get('/reportes/usuarios');
        },

        async getVehiculos() {
            return api.get('/reportes/vehiculos');
        },

        async getEntradas(fecha) {
            const url = fecha ? `/reportes/entradas?fecha=${fecha}` : '/reportes/entradas';
            return api.get(url);
        },

        async getSalidas(fecha) {
            const url = fecha ? `/reportes/salidas?fecha=${fecha}` : '/reportes/salidas';
            return api.get(url);
        },

        async getIncidencias() {
            return api.get('/reportes/incidencias');
        },

        async getPicoPlacaDia(fecha) {
            return api.get(`/reportes/pico-placa/dia/${fecha}`);
        },

        async getCeldasOcupacion(fecha) {
            const url = fecha ? `/reportes/celdas/ocupacion?fecha=${fecha}` : '/reportes/celdas/ocupacion';
            return api.get(url);
        },

        async getCeldasMasUsadas(inicio, fin) {
            const url = inicio && fin ? `/reportes/celdasmas-usadas?inicio=${inicio}&fin=${fin}` : '/reportes/celdasmas-usadas';
            return api.get(url);
        },

        async getVehiculosMasUsados(inicio, fin) {
            const url = inicio && fin ? `/reportes/vehiculos-mas-usados?inicio=${inicio}&fin=${fin}` : '/reportes/vehiculos-mas-usados';
            return api.get(url);
        },

        async getHorariosPico(inicio, fin) {
            const url = inicio && fin ? `/reportes/horarios-pico?inicio=${inicio}&fin=${fin}` : '/reportes/horarios-pico';
            return api.get(url);
        }
    }
};

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
        <span class="notification-message">${message}</span>
    `;

    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-family: 'DM Sans', sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        }
        .notification-success {
            background: #D1FAE5;
            color: #065F46;
            border-left: 4px solid #059669;
        }
        .notification-error {
            background: #FEE2E2;
            color: #991B1B;
            border-left: 4px solid #DC2626;
        }
        .notification-info {
            background: #EDE9FE;
            color: #5B21B6;
            border-left: 4px solid #6D28D9;
        }
        .notification-icon {
            font-size: 18px;
            font-weight: bold;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;

    if (!document.querySelector('style[data-notification]')) {
        style.setAttribute('data-notification', 'true');
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateOnly(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-CO');
}

window.api = api;
window.showNotification = showNotification;
window.formatDate = formatDate;
window.formatDateOnly = formatDateOnly;
