const user = {
    tipoDocumento: "CC",
    numeroDocumento: "1111",
    primerNombre: "Test",
    primerApellido: "Admin",
    direccionCorreo: "test@admin.com",
    numeroCelular: "123456",
    clave: "password",
    estado: "activo",
    perfilId: 1
};

fetch('http://localhost:3000/api/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
})
.then(r => r.json())
.then(data => console.log('Response:', data))
.catch(console.error);
