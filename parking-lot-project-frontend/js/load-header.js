/**
 * Carga el header compartido en todas las páginas.
 * Verifica autenticación y permisos según el rol.
 */

function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
}

const pagePermissions = {
    'index.html': ['usuario', 'operador', 'administrador'],
    'perfil.html': ['usuario', 'operador', 'administrador'],
    'login.html': [],
    'olvidaste_contraseña.html': [],
    'registro-usuarios.html': ['administrador'],
    'registroVehiculos.html': ['administrador'],
    'registro-accesos.html': ['operador', 'administrador'],
    'incidencias.html': ['operador', 'administrador'],
    'informes.html': ['administrador']
};

function checkPageAccess() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const requiredRoles = pagePermissions[currentPage] || ['usuario', 'operador', 'administrador'];
    
    const user = api.getCurrentUser();
    
    if (requiredRoles.length === 0) {
        return true;
    }
    
    if (!user) {
        showNotification('Debes iniciar sesión para acceder', 'error');
        window.location.href = 'login.html';
        return false;
    }
    
    const userRol = user.rol || 'usuario';
    
    if (!requiredRoles.includes(userRol)) {
        showNotification('No tienes acceso a esta página', 'error');
        
        if (userRol === 'administrador') {
            window.location.href = 'registro-usuarios.html';
        } else if (userRol === 'operador') {
            window.location.href = 'registro-accesos.html';
        } else {
            window.location.href = 'index.html';
        }
        return false;
    }
    
    return true;
}

document.addEventListener("DOMContentLoaded", function () {
    if (typeof api === 'undefined') {
        console.warn('API no cargada, saltando header');
        return;
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    if (currentPage !== 'login.html' && !currentPage.startsWith('olvidaste')) {
        if (!checkPageAccess()) {
            return;
        }
    }

    fetch("header.html")
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            var headerContainer = document.createElement("div");
            headerContainer.innerHTML = html;

            var headerElement = headerContainer.firstElementChild;
            if (headerElement) {
                document.body.insertBefore(
                    headerElement,
                    document.body.firstChild
                );
            }
        })
        .catch(function (error) {
            console.error("Error al cargar el header:", error);
        });
});