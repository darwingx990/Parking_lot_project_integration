require('dotenv').config();
const sql = require('./config/db');

async function test() {
    try {
        const users = await sql`SELECT numero_documento, clave FROM "USUARIO" LIMIT 5`;
        console.log(users);
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
test();
