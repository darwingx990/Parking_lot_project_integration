/**
 * Carga el header compartido en todas las pÃ¡ginas.
 * Sirve tambiÃ©n como Auth Guard para rutas protegidas.
 */
document.addEventListener("DOMContentLoaded", function () {
    if (typeof api === 'undefined') {
        console.warn('API no cargada, no se puede verificar sesiÃ³n');
        return;
    }

    // Auth Guard: redirigir si no estÃ¡ autenticado
    if (!api.isAuthenticated()) {
        window.location.replace('login.html');
        return;
    }

    // Role Guard: pÃ¡ginas de administraciÃ³n
    const currentPath = window.location.pathname;
    if (currentPath.includes('registro-usuarios.html') && !api.hasRole(['administrador', 'operador'])) {
        window.location.replace('index.html');
        return;
    }

    fetch("components/header.html")
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

