/**
 * Carga el header compartido en todas las páginas.
 * Inserta el contenido de header.html al inicio del <body>.
 */
document.addEventListener("DOMContentLoaded", function () {
    if (typeof api === 'undefined') {
        console.warn('API no cargada, saltando header');
        return;
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
                
                // Inicializar lógica del header después de la inserción
                initializeHeader();
            }
        })
        .catch(function (error) {
            console.error("Error al cargar el header:", error);
        });
});

function initializeHeader() {
    updateHeaderAuth();
    updateHeaderNav();
}

function updateHeaderAuth() {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;

    const user = api.getCurrentUser();

    if (user) {
        authSection.innerHTML = `
            <div class="user-menu">
                <div class="user-info">
                    <span class="user-name">${user.nombre}</span>
                    <span class="user-role">${user.rol}</span>
                </div>
                <button class="btn-logout" id="header-logout-btn">Cerrar sesión</button>
            </div>
        `;
        
        // Agregar evento al botón de logout dinámicamente
        document.getElementById('header-logout-btn').addEventListener('click', logout);
    } else {
        authSection.innerHTML = '<a href="login.html" id="login-link">Iniciar sesión</a>';
    }
}

function updateHeaderNav() {
    const submenu = document.getElementById('dynamic-submenu');
    if (!submenu) return;

    const user = api.getCurrentUser();
    if (!user) {
        submenu.innerHTML = '<li><a href="index.html">Disponibilidad</a></li>';
        return;
    }

    const rol = user.rol.toLowerCase();
    let links = '';

    if (rol === 'administrador') {
        links += '<li><a href="incidencias.html">Incidencias</a></li>';
        links += '<li><a href="informes.html">Informes</a></li>';
        links += '<li><a href="registro-usuarios.html">Usuarios</a></li>';
        links += '<li><a href="registroVehiculos.html">Vehículos</a></li>';
        links += '<li><a href="registro-accesos.html">Accesos</a></li>';
        links += '<li><a href="index.html">Disponibilidad</a></li>';
    } else if (rol === 'operador') {
        links += '<li><a href="incidencias.html">Incidencias</a></li>';
        links += '<li><a href="registroVehiculos.html">Vehículos</a></li>';
        links += '<li><a href="registro-accesos.html">Accesos</a></li>';
        links += '<li><a href="index.html">Disponibilidad</a></li>';
    } else {
        links += '<li><a href="index.html">Disponibilidad</a></li>';
    }

    submenu.innerHTML = links;
}

function logout() {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        api.logout();
        if (typeof showNotification === 'function') {
            showNotification('Sesión cerrada correctamente', 'info');
        }
        window.location.href = 'login.html';
    }
}
