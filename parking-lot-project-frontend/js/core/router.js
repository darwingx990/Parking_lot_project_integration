import { state } from './state.js';
import { Nav } from '../components/nav.js';

export const PERMISSIONS = {
    'dashboard': ['administrador', 'operador', 'usuario'],
    'celdas': ['administrador', 'operador', 'usuario'],
    'incidencias': ['administrador', 'operador'],
    'reportes': ['administrador'],
    'usuarios': ['administrador', 'operador'],
    'vehiculos': ['administrador', 'operador'],
    // Nuevos módulos (mapeados a los existentes o shells)
    'perfil': ['usuario'],
    'historial': ['usuario', 'operador'],
    'configuracion': ['administrador']
};

export const router = {
    routes: {},
    mainContainer: null,

    init(routes, containerId) {
        this.routes = routes;
        this.mainContainer = document.getElementById(containerId);
        
        // La navegación se inicializa por rol a través de DashboardMain
    },

    renderNavByRole(role) {
        const navList = document.querySelector('.sidebar-nav ul');
        if (!navList) return;

        // Inyectar nuevos items desde el componente Nav
        navList.innerHTML = Nav.getNavItems(role);

        // Re-vincular eventos de navegación
        const navItems = navList.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const moduleKey = item.dataset.module;
                this.navigate(moduleKey);
            });
        });
    },

    navigate(moduleKey) {
        // 1. Guard de Seguridad: Verificar Autenticación
        if (!state.isAuthenticated()) {
            window.location.href = 'index.html';
            return;
        }

        const userRole = state.user.rol.toLowerCase();

        // 2. Guard de Roles: Reglas centralizadas
        const allowedRoles = PERMISSIONS[moduleKey] || [];
        
        if (!allowedRoles.includes(userRole)) {
            // En lugar de un alert molesto, redirección silenciosa
            console.warn(`Acceso denegado a ${moduleKey} para el rol ${userRole}`);
            this.navigate('dashboard');
            return;
        }

        // 3. Renderizado de la Vista
        const view = this.routes[moduleKey];
        if (view && view.render) {
            state.setModule(moduleKey);
            
            // Actualizar UI activa
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.toggle('active', item.dataset.module === moduleKey);
            });

            // Actualizar Título
            const titleElem = document.getElementById('currentModuleName');
            if (titleElem) {
                titleElem.textContent = moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1);
            }

            this.mainContainer.innerHTML = '';
            view.render(this.mainContainer);
        }
    }
};
