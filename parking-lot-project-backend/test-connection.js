require('dotenv').config()
const postgres = require('postgres')

console.log('Probando conexión...')
console.log('DATABASE_URL from env:', process.env.DATABASE_URL ? 'EXISTS' : 'MISSING')

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('Error: DATABASE_URL no está definida')
  process.exit(1)
}

console.log('Connection string:', connectionString.substring(0, 50) + '...')

async function test() {
  try {
    const sql = postgres(connectionString, {
      ssl: { rejectUnauthorized: false },
      connect_timeout: 10,
    })
    
    console.log('Ejecutando query...')
    const result = await sql`SELECT 1 as test`
    console.log('¡Conexión exitosa!', result)
    await sql.end()
  } catch (error) {
    console.error('Error de conexión:', error.code)
    console.error('Mensaje:', error.message)
    console.error('Nombre:', error.name)
  }
}

test()
