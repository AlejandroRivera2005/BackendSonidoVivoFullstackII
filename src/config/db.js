const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'sonidovivo',
  user: process.env.DB_USER || 'sonidovivo',
  password: process.env.DB_PASSWORD,
  max: 10
});

pool.on('error', (err) => {
  console.error('Error inesperado en la conexión a PostgreSQL:', err.message);
});

async function inicializar() {
  const sql = fs.readFileSync(path.join(__dirname, '../../db/schema.sql'), 'utf8');
  await pool.query(sql);
}

module.exports = { pool, inicializar };