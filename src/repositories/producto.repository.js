const { pool } = require('../config/db');
const Producto = require('../models/producto.model');

const columnas = 'id, nombre, precio, categoria, stock, descripcion, imagen, precio_anterior';

const columnasEditables = {
  nombre: 'nombre',
  precio: 'precio',
  categoria: 'categoria',
  stock: 'stock',
  descripcion: 'descripcion',
  imagen: 'imagen',
  precioAnterior: 'precio_anterior'
};

async function listar() {
  const { rows } = await pool.query(`SELECT ${columnas} FROM productos ORDER BY id`);
  return rows.map(Producto.desdeFila);
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`SELECT ${columnas} FROM productos WHERE id = $1`, [id]);
  return rows[0] ? Producto.desdeFila(rows[0]) : null;
}

async function crear({ nombre, precio, categoria, stock, descripcion, imagen, precioAnterior }) {
  const { rows } = await pool.query(
    `INSERT INTO productos (nombre, precio, categoria, stock, descripcion, imagen, precio_anterior)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${columnas}`,
    [nombre, precio, categoria, stock, descripcion, imagen, precioAnterior ?? null]
  );
  return Producto.desdeFila(rows[0]);
}

async function actualizar(id, cambios) {
  const campos = Object.keys(cambios).filter((campo) => campo in columnasEditables);
  if (campos.length === 0) return buscarPorId(id);

  const asignaciones = campos.map((campo, i) => `${columnasEditables[campo]} = $${i + 1}`);
  const valores = campos.map((campo) => cambios[campo]);

  const { rows } = await pool.query(
    `UPDATE productos SET ${asignaciones.join(', ')}
     WHERE id = $${campos.length + 1}
     RETURNING ${columnas}`,
    [...valores, id]
  );
  return rows[0] ? Producto.desdeFila(rows[0]) : null;
}

async function eliminar(id) {
  const { rowCount } = await pool.query('DELETE FROM productos WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar };