import { apiClient } from '../core/api.js';
import { Toast } from '../components/toast.js';
import { mockDashboardData } from '../data/mockDashboardData.js';

export const ReportsDashboard = {
    isLive: false,

    async render(container) {
        container.innerHTML = `
            <div class="module-header">
                <div class="header-content">
                    <h2>Reportes Administrativos</h2>
                    <p>Visualización de métricas de ocupación, gestión y seguridad.</p>
                </div>
                <div class="header-actions">
                    <div class="toggle-container" style="margin-right: 20px;">
                        <span id="toggleRepLabel">🔴 Mock</span>
                        <label class="switch">
                            <input type="checkbox" id="modeRepToggle">
                            <span class="slider round"></span>
                        </label>
                        <span>🟢 Live</span>
                    </div>
                    <button id="exportExcel" class="btn-secondary">Exportar XLS</button>
                    <button id="printReport" class="btn-secondary">Imprimir</button>
                </div>
            </div>

            <div class="reports-container">
                <div class="metrics-grid" id="reportsMetrics">
                    <div class="card metric-card skeleton"></div>
                    <div class="card metric-card skeleton"></div>
                    <div class="card metric-card skeleton"></div>
                </div>

                <div class="card chart-section">
                    <h3>Ocupación por Día de la Semana</h3>
                    <div class="chart-wrapper">
                        <div class="custom-chart" id="occupancyChart">
                            ${this.renderChartSkeleton()}
                        </div>
                    </div>
                </div>

                <div class="card recent-activity">
                    <h3>Actividad de Accesos (Entradas/Salidas)</h3>
                    <div class="overflow-x">
                        <table class="premium-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Vehículo</th>
                                    <th>Tipo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody id="reportsBody">
                                <tr><td colspan="5" class="loader">Cargando registros...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        this.initControls();
        this.loadData();
        this.addStyles();
    },

    initControls() {
        const toggle = document.getElementById('modeRepToggle');
        const label = document.getElementById('toggleRepLabel');
        if (!toggle) return;

        toggle.checked = this.isLive;
        label.textContent = this.isLive ? '🟢 Live' : '🔴 Mock';

        toggle.onchange = (e) => {
            this.isLive = e.target.checked;
            label.textContent = this.isLive ? '🟢 Live' : '🔴 Mock';
            this.loadData();
        };

        document.getElementById('exportExcel').onclick = () => Toast.show('Preparando reporte Excel...', 'info');
        document.getElementById('printReport').onclick = () => window.print();
    },

    renderChartSkeleton() {
        return Array(7).fill(0).map(() => `
            <div class="chart-bar-group">
                <div class="chart-bar skeleton" style="height: 20%"></div>
                <span class="chart-label">...</span>
            </div>
        `).join('');
    },

    async loadData() {
        if (!this.isLive) {
            setTimeout(() => {
                this.updateUI(mockDashboardData.reportes);
            }, 500);
            return;
        }

        try {
            // Intentar fetch real
            const tableData = await apiClient.accesoSalida.getAll();
            
            // Mapear datos de acceso-salida al formato de la tabla
            const actividadReciente = tableData.map(item => ({
                id: item.id,
                fecha: item.fechaHora,
                vehiculo_id: item.vehiculoPlaca || item.vehiculoId,
                tipo_acceso: item.movimiento
            }));

            const data = {
                ...mockDashboardData.reportes,
                actividadReciente
            };

            this.updateUI(data);

        } catch (error) {
            console.error('Reports Live Error:', error);
            Toast.show('Error en conexión Live. Reventiendo a Mock.', 'error');
            this.isLive = false;
            document.getElementById('modeRepToggle').checked = false;
            document.getElementById('toggleRepLabel').textContent = '🔴 Mock';
            this.updateUI(mockDashboardData.reportes);
        }
    },

    updateUI(data) {
        this.updateMetrics(data);
        this.updateCharts(data.ocupacionSemanal);
        this.updateTable(data.actividadReciente);
    },

    updateMetrics(data) {
        const metricsContainer = document.getElementById('reportsMetrics');
        if (!metricsContainer) return;

        metricsContainer.innerHTML = `
            <div class="card metric-card">
                <span class="m-label">Ingresos del Mes</span>
                <span class="m-value">$${data.ingresosMensuales.toLocaleString()}</span>
                <span class="m-diff positive">+12% vs mes anterior</span>
            </div>
            <div class="card metric-card">
                <span class="m-label">Incidentes Reportados</span>
                <span class="m-value">${data.incidentesMes}</span>
                <span class="m-diff ${data.incidentesMes > 10 ? 'negative' : 'positive'}">
                    ${data.incidentesMes > 10 ? 'Alerta: Elevado' : 'Bajo control'}
                </span>
            </div>
            <div class="card metric-card">
                <span class="m-label">Celdas Promedio</span>
                <span class="m-value">${Math.max(...data.ocupacionSemanal)}% Max</span>
                <span class="m-diff">Pico Semanal</span>
            </div>
        `;
    },

    updateCharts(ocupacion) {
        const chart = document.getElementById('occupancyChart');
        if (!chart) return;

        const days = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
        
        chart.innerHTML = ocupacion.map((val, i) => `
            <div class="chart-bar-group">
                <div class="chart-bar" style="height: 0%; transition: height 1s ease-out;" data-height="${val}%">
                    <span class="bar-tooltip">${val}%</span>
                </div>
                <span class="chart-label">${days[i]}</span>
            </div>
        `).join('');

        // Trigger animation after render
        setTimeout(() => {
            chart.querySelectorAll('.chart-bar').forEach(bar => {
                bar.style.height = bar.dataset.height;
            });
        }, 50);
    },

    updateTable(actividad) {
        const body = document.getElementById('reportsBody');
        if (!body) return;

        if (actividad.length === 0) {
            body.innerHTML = '<tr><td colspan="5" class="empty-state">No hay registros recientes.</td></tr>';
            return;
        }

        body.innerHTML = actividad.slice(0, 10).map(item => `
            <tr>
                <td>#${item.id}</td>
                <td>${new Date(item.fecha).toLocaleString()}</td>
                <td><span class="placa-badge">${item.vehiculo_id || '---'}</span></td>
                <td>${item.tipo_acceso}</td>
                <td><span class="badge success">Completado</span></td>
            </tr>
        `).join('');
    },

    addStyles() {
        if (document.getElementById('report-v2-1-styles')) return;
        const style = document.createElement('style');
        style.id = 'report-v2-1-styles';
        style.textContent = `
            .reports-container { display: flex; flex-direction: column; gap: 25px; }
            .metric-card { transition: transform 0.3s ease; }
            .metric-card:hover { transform: translateY(-3px); }
            
            .chart-bar { position: relative; background: var(--accent); border-radius: 8px 8px 0 0; }
            .bar-tooltip {
                position: absolute;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--bg-dark);
                color: white;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 0.7rem;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
            }
            .chart-bar:hover .bar-tooltip { opacity: 1; }

            .m-diff.negative { color: var(--error-color); }

            /* Toggle Fix */
            .header-actions { display: flex; align-items: center; gap: 15px; }
            .toggle-container {
                display: flex;
                align-items: center;
                gap: 10px;
                background: white;
                padding: 8px 15px;
                border-radius: 50px;
                border: 1px solid #e2e8f0;
                font-size: 0.85rem;
                font-weight: 700;
            }
            .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
            .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: var(--success); }
            input:checked + .slider:before { transform: translateX(20px); }
            
            /* Skeletons */
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: shimmer 1.5s infinite;
            }
            @keyframes shimmer { 
                0% { background-position: -200% 0; } 
                100% { background-position: 200% 0; } 
            }
        `;
        document.head.appendChild(style);
    }
};
