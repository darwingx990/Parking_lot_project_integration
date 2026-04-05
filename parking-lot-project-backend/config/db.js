const postgres = require('postgres')

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno.')
}

const sql = postgres(connectionString, {
  ssl: {
    rejectUnauthorized: false
  },
  max: 10,
  idle_timeout: 20,
  connect_timeout: 30,
  keep_alive: true,
  debug: process.env.NODE_ENV !== 'production' ? console.log : false,
})

console.log('✓ Intentando conectar a PostgreSQL...')
console.log(`  Host: aws-0-us-west-2.pooler.supabase.com`)
console.log(`  Puerto: 5432`)
console.log(`  Base de datos: postgres`)

module.exports = sql