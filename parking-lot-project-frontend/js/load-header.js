/**
 * Carga el header compartido en todas las páginas.
 * Inserta el contenido de header.html al inicio del <body>.
 */
document.addEventListener("DOMContentLoaded", function () {
    fetch("header.html")
        .then(function (response) {
            return response.text();
        })
        .then(function (html) {
            var headerContainer = document.createElement("div");
            headerContainer.innerHTML = html;

            // Insertar el header al inicio del body
            document.body.insertBefore(
                headerContainer.firstElementChild,
                document.body.firstChild
            );
        })
        .catch(function (error) {
            console.error("Error al cargar el header:", error);
        });
});
