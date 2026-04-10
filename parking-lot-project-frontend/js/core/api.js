import { state } from './state.js';

const BASE_URL = 'http://localhost:3000/api';

export const apiClient = {
    async fetch(endpoint, options = {}) {
        const token = state.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers
        };

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            // Manejo de expiración de sesión
            if (response.status === 401) {
                console.error('Sesión expirada o credenciales inválidas');
                if (token) {
                    state.logout();
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'No autorizado');
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error en la petición');
            }

            return response.json();
        } catch (error) {
            console.error(`API Error [${endpoint}]:`, error);
            throw error;
        }
    },

    auth: {
        login: (credentials) => apiClient.fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
    },

    usuarios: {
        getAll: () => apiClient.fetch('/usuarios'),
        getById: (id) => apiClient.fetch(`/usuarios/${id}`),
        create: (data) => apiClient.fetch('/usuarios', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => apiClient.fetch(`/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => apiClient.fetch(`/usuarios/${id}`, { method: 'DELETE' }),
    },

    celdas: {
        getAll: () => apiClient.fetch('/get-estado'),
        getById: (id) => apiClient.fetch(`/get-estado/${id}`),
        ocupar: (id) => apiClient.fetch(`/get-estado/${id}/ocupar`, { method: 'PATCH' }),
        liberar: (id) => apiClient.fetch(`/get-estado/${id}/liberar`, { method: 'PATCH' }),
        create: (data) => apiClient.fetch('/get-estado', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    },

    vehiculos: {
        getAll: () => apiClient.fetch('/vehiculo'),
        getById: (id) => apiClient.fetch(`/vehiculo/${id}`),
        getByPlaca: (placa) => apiClient.fetch(`/vehiculo/placa/${placa}`),
        getByUsuario: (usuarioId) => apiClient.fetch(`/vehiculo/usuario/${usuarioId}`),
        create: (data) => apiClient.fetch('/vehiculo', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => apiClient.fetch(`/vehiculo/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => apiClient.fetch(`/vehiculo/${id}`, { method: 'DELETE' }),
    },

    incidencias: {
        getAll: () => apiClient.fetch('/incidencia'),
        getById: (id) => apiClient.fetch(`/incidencia/${id}`),
        create: (data) => apiClient.fetch('/incidencia', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => apiClient.fetch(`/incidencia/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => apiClient.fetch(`/incidencia/${id}`, { method: 'DELETE' }),
    },

    reportesIncidencia: {
        getAll: () => apiClient.fetch('/reportes-incidencia'),
        create: (data) => apiClient.fetch('/reportes-incidencia', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        delete: (vehiculoId, incidenciaId) => apiClient.fetch(`/reportes-incidencia/${vehiculoId}/${incidenciaId}`, { method: 'DELETE' }),
    },

    accesoSalida: {
        getAll: () => apiClient.fetch('/acceso-salida'),
        getById: (id) => apiClient.fetch(`/acceso-salida/${id}`),
        create: (data) => apiClient.fetch('/acceso-salida', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    },

    historial: {
        getAll: () => apiClient.fetch('/historial-parqueo'),
        getByVehiculo: (vehiculoId) => apiClient.fetch(`/historial-parqueo/vehiculo/${vehiculoId}`),
        create: (data) => apiClient.fetch('/historial-parqueo', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    },

    picoPlaca: {
        getAll: () => apiClient.fetch('/pico-placa'),
        create: (data) => apiClient.fetch('/pico-placa', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => apiClient.fetch(`/pico-placa/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        delete: (id) => apiClient.fetch(`/pico-placa/${id}`, { method: 'DELETE' }),
    }
};
