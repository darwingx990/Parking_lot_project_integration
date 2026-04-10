export const DashboardWidgets = {
    renderGrid() {
        return `
            <div class="dashboard-controls">
                <div class="toggle-container">
                    <span id="toggleLabel">🔴 Mock</span>
                    <label class="switch">
                        <input type="checkbox" id="modeToggle">
                        <span class="slider round"></span>
                    </label>
                    <span>🟢 Live</span>
                </div>
            </div>
            
            <div class="widgets-grid">
                ${this.renderSkeleton(6)}
            </div>

            <div class="dashboard-footer-grid">
                <div class="card alerts-card">
                    <h3>🔔 Alertas Recientes</h3>
                    <div id="alertsContainer">
                        ${this.renderAlertSkeleton(3)}
                    </div>
                </div>
            </div>
        `;
    },

    renderSkeleton(count) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
                <div class="widget-card skeleton">
                    <div class="skeleton-icon"></div>
                    <div class="skeleton-text">
                        <div class="skeleton-line short"></div>
                        <div class="skeleton-line long"></div>
                    </div>
                </div>
            `;
        }
        return html;
    },

    renderAlertSkeleton(count) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `<div class="alert-item skeleton-line"></div>`;
        }
        return html;
    },

    updateWidgets(data) {
        const grid = document.querySelector('.widgets-grid');
        if (!grid) return;

        const widgets = [
            { label: 'Celdas Totales', value: data.celdasTotales, icon: '🅿️', color: 'blue' },
            { label: 'Celdas Disponibles', value: data.celdasDisponibles, icon: '✅', color: 'green' },
            { label: 'Vehículos Activos', value: data.vehiculosActivos, icon: '🚗', color: 'orange' },
            { label: 'Ingresos del Día', value: `$${data.ingresosDia.toLocaleString()}`, icon: '📈', color: 'indigo' },
            { label: 'Tiempo Promedio', value: `${data.tiempoPromedio} min`, icon: '⏱️', color: 'purple' },
            { label: 'Ocupación', value: `${Math.round((data.vehiculosActivos/data.celdasTotales)*100)}%`, icon: '📊', color: 'teal' }
        ];

        grid.innerHTML = widgets.map(w => `
            <div class="widget-card border-${w.color}">
                <div class="widget-icon bg-${w.color}">${w.icon}</div>
                <div class="widget-info">
                    <span class="widget-label">${w.label}</span>
                    <span class="widget-value">${w.value}</span>
                </div>
            </div>
        `).join('');

        this.updateAlerts(data.alertas || []);
    },

    updateAlerts(alertas) {
        const container = document.getElementById('alertsContainer');
        if (!container) return;

        container.innerHTML = alertas.map(a => `
            <div class="alert-item ${a.tipo}">
                <div class="alert-content">
                    <p>${a.mensaje}</p>
                    <small>${a.fecha}</small>
                </div>
            </div>
        `).join('') || '<p class="empty">Sin alertas recientes</p>';
    }
};
