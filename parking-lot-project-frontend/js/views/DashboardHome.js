import { state } from '../core/state.js';
import { apiClient } from '../core/api.js';
import { Toast } from '../components/toast.js';
import { mockDashboardData } from '../data/mockDashboardData.js';
import { DashboardWidgets } from '../components/dashboardWidgets.js';

export const DashboardHome = {
    isLive: false,

    render(container) {
        container.innerHTML = `
            <div class="welcome-section">
                <div class="welcome-text">
                    <h1>Hola, ${state.user.nombre} 👋</h1>
                    <p>Panel de Control Administrativo | BioParking V2.0</p>
                </div>
            </div>
            
            <div id="dashboardContent">
                ${DashboardWidgets.renderGrid()}
            </div>
        `;

        this.initControls();
        this.loadData();
        this.addStyles();
    },

    initControls() {
        const toggle = document.getElementById('modeToggle');
        const label = document.getElementById('toggleLabel');
        if (!toggle) return;

        toggle.checked = this.isLive;
        label.textContent = this.isLive ? '🟢 Live' : '🔴 Mock';

        toggle.onchange = (e) => {
            this.isLive = e.target.checked;
            label.textContent = this.isLive ? '🟢 Live' : '🔴 Mock';
            this.loadData();
        };
    },

    async loadData() {
        if (!this.isLive) {
            // Modo Mock: Delay artificial para mostrar skeletons
            setTimeout(() => {
                DashboardWidgets.updateWidgets(mockDashboardData);
            }, 600);
            return;
        }

        try {
            // Modo Live: Fetch real
            const celdas = await apiClient.celdas.getAll();
            
            // Transformar celdas en métricas
            const data = {
                celdasTotales: celdas.length,
                celdasDisponibles: celdas.filter(c => c.estado === 'Libre' || c.estado === 'Disponible').length,
                vehiculosActivos: celdas.filter(c => c.estado === 'Ocupado').length,
                // Valores que el backend actual no entrega en este endpoint, usamos mock para completar UI
                ingresosDia: mockDashboardData.ingresosDia,
                tiempoPromedio: mockDashboardData.tiempoPromedio,
                alertas: mockDashboardData.alertas
            };

            DashboardWidgets.updateWidgets(data);

        } catch (error) {
            console.error('Dashboard Live Error:', error);
            Toast.show('Error cargando datos reales. Reventiendo a Mock.', 'error');
            this.isLive = false;
            document.getElementById('modeToggle').checked = false;
            document.getElementById('toggleLabel').textContent = '🔴 Mock';
            DashboardWidgets.updateWidgets(mockDashboardData);
        }
    },

    addStyles() {
        if (document.getElementById('dashboard-refactor-styles')) return;
        const style = document.createElement('style');
        style.id = 'dashboard-refactor-styles';
        style.textContent = `
            .dashboard-controls {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 20px;
            }
            .toggle-container {
                display: flex;
                align-items: center;
                gap: 12px;
                background: rgba(255,255,255,0.7);
                padding: 10px 20px;
                border-radius: 50px;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255,255,255,0.3);
                font-weight: 700;
                font-size: 0.9rem;
            }
            .widgets-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            .widget-card {
                background: white;
                padding: 25px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 20px;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                transition: transform 0.3s ease;
                border-left: 5px solid transparent;
            }
            .widget-card:hover { transform: translateY(-5px); }
            .widget-icon {
                width: 55px;
                height: 55px;
                border-radius: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.8rem;
            }
            .widget-info { display: flex; flex-direction: column; }
            .widget-label { font-size: 0.85rem; color: #64748b; font-weight: 600; }
            .widget-value { font-size: 1.6rem; font-weight: 800; color: #1e293b; }

            /* Switch Styles */
            .switch { position: relative; display: inline-block; width: 44px; height: 22px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
            .slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: #10b981; }
            input:checked + .slider:before { transform: translateX(22px); }

            /* Colors */
            .bg-blue { background: #dbeafe; } .border-blue { border-left-color: #2563eb; }
            .bg-green { background: #dcfce7; } .border-green { border-left-color: #10b981; }
            .bg-orange { background: #ffedd5; } .border-orange { border-left-color: #f59e0b; }
            .bg-indigo { background: #e0e7ff; } .border-indigo { border-left-color: #4f46e5; }
            .bg-purple { background: #f3e8ff; } .border-purple { border-left-color: #9333ea; }
            .bg-teal { background: #ccfbf1; } .border-teal { border-left-color: #0d9488; }

            /* Skeletons */
            @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border: none; }
            .skeleton-icon { width: 55px; height: 55px; background: #e0e0e0; border-radius: 15px; }
            .skeleton-line { height: 12px; background: #e0e0e0; border-radius: 4px; margin-bottom: 8px; }
            .skeleton-line.short { width: 40%; }
            .skeleton-line.long { width: 70%; }

            /* Alerts */
            .alerts-card { padding: 25px; }
            .alert-item { padding: 15px 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: flex-start; gap: 10px; }
            .alert-item:last-child { border-bottom: none; }
            .alert-item.pico_placa { border-left: 4px solid #f59e0b; padding-left: 10px; }
            .alert-item.error { border-left: 4px solid #ef4444; padding-left: 10px; }
            .alert-item p { font-size: 0.9rem; font-weight: 500; color: #334155; }
            .alert-item small { color: #94a3b8; }
        `;
        document.head.appendChild(style);
    }
};
