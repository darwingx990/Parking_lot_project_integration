import { state } from '../core/state.js';
import { apiClient } from '../core/api.js';
import { Toast } from '../components/toast.js';

export const HistorialView = {
    async render(container) {
        container.innerHTML = `
            <div class="module-header">
                <h2>📅 Mi Historial</h2>
                <p>Consulta tus registros de entrada y salida del parqueadero.</p>
            </div>
            
            <div class="card history-card">
                <div class="overflow-x">
                    <table class="premium-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Movimiento</th>
                                <th>Puerta</th>
                                <th>Vehículo (Placa)</th>
                                <th>Tiempo Estadía</th>
                            </tr>
                        </thead>
                        <tbody id="historialBody">
                            <tr><td colspan="5" class="loader">Cargando historial...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        await this.loadHistorial();
    },

    async loadHistorial() {
        const body = document.getElementById('historialBody');
        try {
            const registros = await apiClient.accesoSalida.getAll();
            
            if (!registros || registros.length === 0) {
                body.innerHTML = '<tr><td colspan="5" class="empty-state">No hay registros en el historial.</td></tr>';
                return;
            }

            body.innerHTML = '';
            registros.forEach(reg => {
                const row = document.createElement('tr');
                const fecha = new Date(reg.fechaHora);
                const fechaStr = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                const horaStr = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                const isEntrada = reg.movimiento === 'Entrada';
                
                row.innerHTML = `
                    <td>
                        <div style="font-weight: 700;">${fechaStr}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${horaStr}</div>
                    </td>
                    <td><span class="badge ${isEntrada ? 'success' : 'danger'}">${reg.movimiento}</span></td>
                    <td>${reg.puerta || '---'}</td>
                    <td><span style="font-family: monospace; font-weight: bold;">${reg.vehiculoPlaca || '---'}</span></td>
                    <td>${reg.tiempoEstadia ? `${Math.round(reg.tiempoEstadia / 60)} min` : '---'}</td>
                `;
                body.appendChild(row);
            });
        } catch (error) {
            body.innerHTML = '<tr><td colspan="5" class="error-state">Error al cargar el historial.</td></tr>';
            Toast.show('Error al cargar historial', 'error');
        }
    }
};
