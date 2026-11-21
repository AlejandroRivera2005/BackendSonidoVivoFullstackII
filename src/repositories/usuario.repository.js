const { pool } = require('../config/db');
const Usuario = require('../models/usuario.model');

const columnas = 'id, nombre, email, password_hash, rol';

const columnasEditables = {
  nombre: 'nombre',
  email: 'email',
  passwordHash: 'password_hash'
};

async function listar() {
  const { rows } = await pool.query(`SELECT ${columnas} FROM usuarios ORDER BY id`);
  return rows.map(Usuario.desdeFila);
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`SELECT ${columnas} FROM usuarios WHERE id = $1`, [id]);
  return rows[0] ? Usuario.desdeFila(rows[0]) : null;
}

async function buscarPorEmail(email) {
  const buscado = String(email ?? '').trim().toLowerCase();
  const { rows } = await pool.query(
    `SELECT ${columnas} FROM usuarios WHERE LOWER(email) = $1`,
    [buscado]
  );
  return rows[0] ? Usuario.desdeFila(rows[0]) : null;
}

async function crear({ nombre, email, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING ${columnas}`,
    [nombre, email, passwordHash]
  );
  return Usuario.desdeFila(rows[0]);
}

async function actualizar(id, cambios) {
  const campos = Object.keys(cambios).filter((campo) => campo in columnasEditables);
  if (campos.length === 0) return buscarPorId(id);

  const asignaciones = campos.map((campo, i) => `${columnasEditables[campo]} = $${i + 1}`);
  const valores = campos.map((campo) => cambios[campo]);

  const { rows } = await pool.query(
    `UPDATE usuarios SET ${asignaciones.join(', ')}
     WHERE id = $${campos.length + 1}
     RETURNING ${columnas}`,
    [...valores, id]
  );
  return rows[0] ? Usuario.desdeFila(rows[0]) : null;
}

async function eliminar(id) {
  const { rowCount } = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { listar, buscarPorId, buscarPorEmail, crear, actualizar, eliminar };