import { apiClient } from '../core/api.js';
import { Toast } from '../components/toast.js';
import { Modal } from '../components/modal.js';

export const IncidenciasTable = {
    allIncidencias: [],
    tiposIncidencia: [],

    async render(container) {
        container.innerHTML = `
            <div class="module-header">
                <div class="header-content">
                    <h2>Gestión de Incidencias</h2>
                    <p>Registro y seguimiento de novedades en el parqueadero.</p>
                </div>
                <button id="addIncidenciaBtn" class="btn-primary">Reportar Novedad</button>
            </div>

            <div class="table-controls">
                <div class="search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="incidenciaSearch" class="search-input" placeholder="Filtrar por placa o tipo...">
                </div>
            </div>
            
            <div class="card table-wrapper overflow-x">
                <table class="premium-table-v2">
                    <thead>
                        <tr>
                            <th>Fecha y Hora</th>
                            <th>Tipo de Incidencia</th>
                            <th>Vehículo (Placa)</th>
                            <th style="text-align: right;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="incidenciasBody">
                        <tr><td colspan="4" class="loader">Cargando datos...</td></tr>
                    </tbody>
                </table>
            </div>
        `;

        await this.loadIncidencias();
        this.initEvents();
    },

    async loadIncidencias() {
        const body = document.getElementById('incidenciasBody');
        try {
            // Cargar tipos de incidencia y reportes
            const [tipos, reportes] = await Promise.all([
                apiClient.incidencias.getAll(),
                apiClient.reportesIncidencia.getAll()
            ]);
            this.tiposIncidencia = tipos;
            this.allIncidencias = reportes;
            this.renderTable(this.allIncidencias);
        } catch (error) {
            body.innerHTML = '<tr><td colspan="4" class="error-state">Error al conectar con el servidor.</td></tr>';
        }
    },

    renderTable(data) {
        const body = document.getElementById('incidenciasBody');
        if (!body) return;

        if (data.length === 0) {
            body.innerHTML = '<tr><td colspan="4" class="empty-state">No hay incidencias registradas.</td></tr>';
            return;
        }

        body.innerHTML = '';
        data.forEach(inc => {
            const row = document.createElement('tr');
            const dateObj = new Date(inc.fechaHora);
            const dateStr = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            row.innerHTML = `
                <td>
                    <div style="font-weight: 700;">${dateStr}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${timeStr}</div>
                </td>
                <td><span class="status-chip info">${inc.incidenciaNombre || '---'}</span></td>
                <td><span class="placa-badge" style="background: #e2e8f0; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px 6px; font-family: monospace; font-weight: bold;">${inc.vehiculoPlaca || '---'}</span></td>
                <td style="text-align: right;">
                    <button class="btn-action delete delete-reporte" title="Eliminar" data-vid="${inc.vehiculoId}" data-iid="${inc.incidenciaId}">🗑️</button>
                </td>
            `;
            body.appendChild(row);
        });

        body.querySelectorAll('.delete-reporte').forEach(btn => {
            btn.onclick = async () => {
                try {
                    await apiClient.reportesIncidencia.delete(btn.dataset.vid, btn.dataset.iid);
                    Toast.show('Reporte eliminado', 'success');
                    await this.loadIncidencias();
                } catch (err) {
                    Toast.show(err.message, 'error');
                }
            };
        });
    },

    initEvents() {
        const searchInput = document.getElementById('incidenciaSearch');
        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = this.allIncidencias.filter(inc => 
                (inc.vehiculoPlaca && inc.vehiculoPlaca.toLowerCase().includes(term)) ||
                (inc.incidenciaNombre && inc.incidenciaNombre.toLowerCase().includes(term))
            );
            this.renderTable(filtered);
        };

        const btn = document.getElementById('addIncidenciaBtn');
        if (btn) btn.onclick = () => this.showReportModal();
    },

    showReportModal() {
        const tipoOptions = this.tiposIncidencia.map(t => 
            `<option value="${t.id}">${t.nombre}</option>`
        ).join('');

        Modal.show({
            title: 'Reportar Nueva Incidencia',
            content: `
                <form id="newIncidenciaForm" class="modal-form">
                    <div class="input-group">
                        <label>Tipo de Incidencia</label>
                        <select id="m-tipo" class="modal-input">
                            ${tipoOptions || '<option value="">Sin tipos disponibles</option>'}
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Placa del Vehículo</label>
                        <input type="text" id="m-placa" placeholder="Ej: ABC123" class="modal-input" required>
                    </div>
                </form>
            `,
            confirmText: 'Guardar Reporte',
            onConfirm: async () => {
                const incidenciaId = parseInt(document.getElementById('m-tipo').value);
                const placa = document.getElementById('m-placa').value;

                if (!incidenciaId || !placa) {
                    Toast.show('Todos los campos son obligatorios', 'error');
                    return;
                }

                // Buscar vehículo por placa
                let vehiculoId;
                try {
                    const vehiculo = await apiClient.vehiculos.getByPlaca(placa);
                    vehiculoId = vehiculo.id;
                } catch (err) {
                    Toast.show('Vehículo no encontrado con esa placa', 'error');
                    return;
                }

                try {
                    await apiClient.reportesIncidencia.create({
                        vehiculoId,
                        incidenciaId,
                        fechaHora: new Date().toISOString()
                    });
                    Toast.show('Incidencia registrada con éxito', 'success');
                    await this.loadIncidencias();
                } catch (err) {
                    Toast.show('Error al guardar la incidencia', 'error');
                }
            }
        });
    }
};
