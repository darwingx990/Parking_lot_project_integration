import { apiClient } from '../core/api.js';
import { Toast } from '../components/toast.js';
import { Modal } from '../components/modal.js';

export const VehiculosView = {
    allVehiculos: [],

    async render(container) {
        container.innerHTML = `
            <div class="module-header">
                <div class="header-content">
                    <h2>Gestión de Vehículos</h2>
                    <p>Inventario de vehículos registrados en el sistema.</p>
                </div>
                <button id="addVehiculoBtn" class="btn-primary">Registrar Vehículo</button>
            </div>

            <div class="table-controls">
                <div class="search-container">
                    <span class="search-icon">🔍</span>
                    <input type="text" id="vehiculoSearch" class="search-input" placeholder="Buscar por placa, marca o modelo...">
                </div>
            </div>
            
            <div class="card table-wrapper overflow-x">
                <table class="premium-table-v2">
                    <thead>
                        <tr>
                            <th>Identificación (Placa)</th>
                            <th>Marca y Modelo</th>
                            <th>Color</th>
                            <th>Propietario</th>
                            <th style="text-align: right;">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="vehiculosBody">
                        <tr><td colspan="5" class="loader">Cargando vehículos...</td></tr>
                    </tbody>
                </table>
            </div>
        `;

        await this.loadVehiculos();
        this.initEvents();
    },

    async loadVehiculos() {
        const body = document.getElementById('vehiculosBody');
        try {
            this.allVehiculos = await apiClient.vehiculos.getAll();
            this.renderTable(this.allVehiculos);
        } catch (error) {
            body.innerHTML = '<tr><td colspan="5" class="error-state">Error al cargar vehículos.</td></tr>';
        }
    },

    renderTable(vehiculos) {
        const body = document.getElementById('vehiculosBody');
        if (!body) return;

        if (vehiculos.length === 0) {
            body.innerHTML = '<tr><td colspan="5" class="empty-state">No hay vehículos registrados.</td></tr>';
            return;
        }

        body.innerHTML = '';
        vehiculos.forEach(v => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="placa-badge" style="background:#fbbf24; border: 2px solid #000; color:black; padding: 4px 10px; border-radius:4px; font-weight:800; transform: skewX(-5deg); display:inline-block;">${v.placa}</span></td>
                <td>
                    <div style="font-weight: 600;">${v.marca}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${v.modelo}</div>
                </td>
                <td><span class="status-chip info" style="font-size: 0.7rem;">${v.color}</span></td>
                <td><span style="font-weight:500;">${v.usuarioNombre || '---'}</span></td>
                <td style="text-align: right;">
                    <button class="btn-action" title="Ver Historial">📋</button>
                    <button class="btn-action" title="Editar">✏️</button>
                    <button class="btn-action delete delete-vehiculo" title="Eliminar" data-id="${v.id}">🗑️</button>
                </td>
            `;
            body.appendChild(row);
        });

        // Bind delete buttons
        body.querySelectorAll('.delete-vehiculo').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.dataset.id;
                try {
                    await apiClient.vehiculos.delete(id);
                    Toast.show('Vehículo eliminado', 'success');
                    await this.loadVehiculos();
                } catch (err) {
                    Toast.show(err.message, 'error');
                }
            };
        });
    },

    initEvents() {
        const searchInput = document.getElementById('vehiculoSearch');
        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = this.allVehiculos.filter(v => 
                v.placa.toLowerCase().includes(term) ||
                v.marca.toLowerCase().includes(term) ||
                v.modelo.toLowerCase().includes(term) ||
                (v.usuarioNombre && v.usuarioNombre.toLowerCase().includes(term))
            );
            this.renderTable(filtered);
        };

        const btn = document.getElementById('addVehiculoBtn');
        if (btn) btn.onclick = () => this.showAddModal();
    },

    showAddModal() {
        Modal.show({
            title: 'Registrar Vehículo',
            content: `
                <form id="newVehiculoForm" class="modal-form">
                    <div class="input-group">
                        <label>Placa</label>
                        <input type="text" id="v-placa" placeholder="ABC123" class="modal-input" required>
                    </div>
                    <div class="input-group">
                        <label>Color</label>
                        <input type="text" id="v-color" placeholder="Ej: Rojo" class="modal-input" required>
                    </div>
                    <div class="input-group">
                        <label>Marca</label>
                        <input type="text" id="v-marca" placeholder="Ej: Toyota" class="modal-input" required>
                    </div>
                    <div class="input-group">
                        <label>Modelo (Año)</label>
                        <input type="text" id="v-modelo" placeholder="Ej: 2024" class="modal-input" required>
                    </div>
                    <div class="input-group">
                        <label>Tipo</label>
                        <select id="v-tipo" class="modal-input">
                            <option value="Carro">Carro</option>
                            <option value="Moto">Moto</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label>Documento del Propietario</label>
                        <input type="text" id="v-propietario" placeholder="Número de documento" class="modal-input" required>
                    </div>
                </form>
            `,
            confirmText: 'Guardar Vehículo',
            onConfirm: async () => {
                const propietarioDoc = document.getElementById('v-propietario').value;
                
                // Buscar usuario por documento para obtener su ID
                let usuarioId;
                try {
                    const usuario = await apiClient.fetch(`/usuarios/documento/${propietarioDoc}`);
                    usuarioId = usuario.id || usuario.id_usuario;
                } catch (err) {
                    Toast.show('Propietario no encontrado con ese documento', 'error');
                    return;
                }

                const data = {
                    placa: document.getElementById('v-placa').value,
                    color: document.getElementById('v-color').value,
                    marca: document.getElementById('v-marca').value,
                    modelo: document.getElementById('v-modelo').value,
                    tipo: document.getElementById('v-tipo').value,
                    usuarioId: usuarioId
                };

                try {
                    await apiClient.vehiculos.create(data);
                    Toast.show('Vehículo registrado con éxito', 'success');
                    await this.loadVehiculos();
                } catch (err) {
                    Toast.show(err.message, 'error');
                }
            }
        });
    }
};
