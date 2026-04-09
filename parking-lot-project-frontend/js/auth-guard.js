(function() {
    if (typeof api === 'undefined') {
        console.error('auth-guard.js requires api.js to be loaded first');
        return;
    }

    const user = api.getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const path = window.location.pathname.split('/').pop() || 'index.html';

    const roleAccess = {
        'administrador': [
            'index.html', 'incidencias.html', 'informes.html',
            'registro-usuarios.html', 'registroVehiculos.html', 'registro-accesos.html'
        ],
        'operador': [
            'index.html', 'incidencias.html', 'registroVehiculos.html', 'registro-accesos.html'
        ],
        'usuario': [
            'index.html'
        ]
    };

    const allowedPages = roleAccess[user.rol.toLowerCase()] || [];

    if (!allowedPages.includes(path)) {
        console.warn(`Usuario rol ${user.rol} no tiene acceso a ${path}`);
        window.location.href = 'index.html';
    }
})();
