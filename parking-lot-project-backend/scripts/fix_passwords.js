const bcrypt = require('bcrypt');
const postgres = require('postgres');
require('dotenv').config();

const sql = postgres({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: 'require'
});

async function fixPasswords() {
    try {
        console.log('Generando hash para "admin123"...');
        const hash = await bcrypt.hash('admin123', 10);
        
        console.log('Actualizando todos los usuarios en la base de datos...');
        const result = await sql`
            UPDATE "USUARIO"
            SET clave = ${hash}
            RETURNING id_usuario, numero_documento
        `;
        
        console.log(`✅ ¡Éxito! Se actualizaron ${result.length} usuarios.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error actualizando contraseñas:', error);
        process.exit(1);
    }
}

fixPasswords();
