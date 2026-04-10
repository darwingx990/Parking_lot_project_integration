export const Nav = {
    getNavItems(role) {
        const menus = {
            administrador: [
                { module: 'dashboard', icon: '📊', label: 'Dashboard' },
                { module: 'usuarios', icon: '👥', label: 'Gestión de Usuarios' },
                { module: 'celdas', icon: '🅿️', label: 'Gestión de Celdas' },
                { module: 'reportes', icon: '📋', label: 'Reportes' },
                { module: 'configuracion', icon: '⚙️', label: 'Configuración' }
            ],
            operador: [
                { module: 'celdas', icon: '🅿️', label: 'Gestión de Celdas' },
                { module: 'vehiculos', icon: '🚗', label: 'Registro de Vehículos' },
                { module: 'incidencias', icon: '📋', label: 'Historial de Movimientos' }
            ],
            usuario: [
                { module: 'perfil', icon: '🪪', label: 'Mi Identificación' },
                { module: 'celdas', icon: '🅿️', label: 'Mis Celdas Asignadas' },
                { module: 'historial', icon: '📅', label: 'Mi Historial' }
            ]
        };

        const items = menus[role.toLowerCase()] || menus.usuario;
        
        return items.map(item => `
            <li class="nav-item" data-module="${item.module}" style="animation: fadeIn 0.4s ease forwards; opacity: 0;">
                <i class="icon-${item.module}">${item.icon}</i> ${item.label}
            </li>
        `).join('');
    }
};
