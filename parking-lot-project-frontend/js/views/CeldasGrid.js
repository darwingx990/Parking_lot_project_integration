import { apiClient } from '../core/api.js';
import { Toast } from '../components/toast.js';
import { Modal } from '../components/modal.js';
import { Validators } from '../utils/Validators.js';

export const CeldasGrid = {
    async render(container) {
        container.innerHTML = `
            <div class="module-header">
                <div class="header-content">
                    <h2>Gestión de Celdas</h2>
                    <p>Monitoreo en tiempo real de los espacios de parqueo.</p>
                </div>
                <div class="legend">
                    <span class="legend-item"><span class="box-available"></span> Libre</span>
                    <span class="legend-item"><span class="box-occupied"></span> Ocupado</span>
                </div>
            </div>
            
            <div id="celdasGrid" class="grid-container premium-grid">
                <div class="loader">Cargando celdas...</div>
            </div>
        `;

        this.loadCeldas();
        this.addStyles();
    },

    async loadCeldas() {
        const grid = document.getElementById('celdasGrid');
        try {
            const celdas = await apiClient.celdas.getAll();
            grid.innerHTML = '';

            celdas.forEach(celda => {
                const card = document.createElement('div');
                const isLibre = celda.estado === 'Libre' || celda.estado === 'Disponible';
                
                card.className = `celda-card ${isLibre ? 'Disponible' : 'Ocupado'}`;
                card.innerHTML = `
                    <div class="celda-header">
                        <span class="celda-code">#${celda.id}</span>
                        <span class="celda-icon">${celda.tipo === 'Carro' ? '🚗' : '🏍️'}</span>
                    </div>
                    <div class="celda-body">
                        <strong>${celda.tipo}</strong>
                        <p>${isLibre ? 'Libre' : 'Ocupado'}</p>
                    </div>
                `;
                
                card.onclick = () => this.handleCeldaAction(celda);
                grid.appendChild(card);
            });
        } catch (error) {
            grid.innerHTML = `<div class="error-state">No se pudieron cargar las celdas.</div>`;
            Toast.show('Error al cargar celdas', 'error');
        }
    },

    async handleCeldaAction(celda) {
        const isLibre = celda.estado === 'Libre' || celda.estado === 'Disponible';

        if (isLibre) {
            // Requerimiento REQ-CLD-03: Asociar vehículo
            Modal.show({
                title: `Ocupar Celda #${celda.id}`,
                content: `
                    <p>Ingresa la placa del vehículo que ocupará esta celda:</p>
                    <input type="text" id="vehiculo-placa" placeholder="ABC-123" class="modal-input" style="width:100%; padding:10px; margin-top:10px; border:1px solid #ddd; border-radius:8px;">
                `,
                confirmText: 'Confirmar Entrada',
                onConfirm: async () => {
                    const placa = document.getElementById('vehiculo-placa').value;
                    if (!placa) {
                        Toast.show('La placa es obligatoria', 'error');
                        return;
                    }

                    // REQ-INEX-4: Impedir entrada si incumple Pico y Placa
                    const validation = await Validators.checkPicoPlaca(placa);
                    if (validation.restricted) {
                        Toast.show(validation.message, 'error');
                        return;
                    }

                    try {
                        await apiClient.celdas.ocupar(celda.id);
                        Toast.show(`Celda #${celda.id} ocupada correctamente`, 'success');
                        this.loadCeldas();
                    } catch (err) {
                        Toast.show('Error al ocupar celda', 'error');
                    }
                }
            });
        } else {
            Modal.show({
                title: `Liberar Celda #${celda.id}`,
                content: `¿Estás seguro que deseas liberar este espacio?`,
                confirmText: 'Liberar',
                onConfirm: async () => {
                    try {
                        await apiClient.celdas.liberar(celda.id);
                        Toast.show(`Celda #${celda.id} liberada`, 'success');
                        this.loadCeldas();
                    } catch (err) {
                        Toast.show('Error al liberar celda', 'error');
                    }
                }
            });
        }
    },

    addStyles() {
        if (document.getElementById('celdas-styles')) return;
        const style = document.createElement('style');
        style.id = 'celdas-styles';
        style.textContent = `
            .premium-grid {
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                gap: 20px;
                padding-top: 20px;
            }
            .legend { display: flex; gap: 20px; font-size: 0.9rem; }
            .legend-item { display: flex; align-items: center; gap: 8px; }
            .box-available, .box-occupied { width: 12px; height: 12px; border-radius: 3px; }
            .box-available { background: var(--success); }
            .box-occupied { background: var(--danger); }
            
            .celda-card {
                background: white;
                box-shadow: var(--shadow);
                border: none;
                padding: 20px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                min-height: 120px;
                border-top: 4px solid transparent;
            }
            .celda-card.Disponible { border-top-color: var(--success); }
            .celda-card.Ocupado { border-top-color: var(--danger); opacity: 0.8; }
            
            .celda-header { display: flex; justify-content: space-between; align-items: flex-start; }
            .celda-code { font-weight: 800; color: var(--text-muted); font-size: 0.8rem; }
            .celda-icon { font-size: 1.5rem; }
            .celda-body p { font-size: 0.9rem; color: var(--text-muted); margin-top: 5px; }
        `;
        document.head.appendChild(style);
    }
};
