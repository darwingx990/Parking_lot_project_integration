import { state } from '../core/state.js';
import { router, PERMISSIONS } from '../core/router.js';
import { DashboardHome } from './DashboardHome.js';
import { CeldasGrid } from './CeldasGrid.js';
import { UsuariosView } from './UsuariosView.js';
import { VehiculosView } from './VehiculosView.js';
import { IncidenciasTable } from './IncidenciasTable.js';
import { ReportsDashboard } from './ReportsDashboard.js';
import { PerfilView } from './PerfilView.js';
import { HistorialView } from './HistorialView.js';

export const DashboardMain = {
    init() {
        // 1. Verificación de Sesión (Redirección temprana)
        if (!state.isAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }

        // 2. Mapeo de Rutas y Vistas
        const routes = {
            dashboard: DashboardHome,
            celdas: CeldasGrid,
            usuarios: UsuariosView,
            vehiculos: VehiculosView,
            incidencias: IncidenciasTable,
            reportes: ReportsDashboard,
            perfil: PerfilView,
            historial: HistorialView
        };

        // 3. Inicializar UI de Usuario
        this.setupUserUI();

        // 4. Inicializar Enrutador
        router.init(routes, 'mainContent');

        // 5. Configurar Botón de Logout
        document.getElementById('logoutBtn').onclick = () => state.logout();

        // 6. Generar menú por rol dinámicamente
        router.renderNavByRole(state.user.rol);

        // 7. Navegar a la página por defecto (Usuario regular va a celdas)
        const userRole = state.user.rol.toLowerCase();
        const defaultRoute = userRole === 'usuario' ? 'celdas' : 'dashboard';
        router.navigate(defaultRoute);
    },

    setupUserUI() {
        const userNameElem = document.getElementById('userName');
        const userRoleElem = document.getElementById('userRole');

        if (userNameElem) userNameElem.textContent = state.user.nombre;
        if (userRoleElem) {
            userRoleElem.textContent = state.user.rol;
            userRoleElem.className = `user-role badge ${state.user.rol}`;
        }

        // Toggle Sidebar
        const toggleBtn = document.getElementById('toggleSidebar');
        const sidebar = document.getElementById('sidebar');
        if (toggleBtn && sidebar) {
            toggleBtn.onclick = () => sidebar.classList.toggle('collapsed');
        }
    }
};

// Auto-inicio
document.addEventListener('DOMContentLoaded', () => DashboardMain.init());
