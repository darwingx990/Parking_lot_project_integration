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
            }
        })
        .catch(function (error) {
            console.error("Error al cargar el header:", error);
        });
});
