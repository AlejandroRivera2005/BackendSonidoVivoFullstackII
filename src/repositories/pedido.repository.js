const { pool } = require('../config/db');
const Pedido = require('../models/pedido.model');
const ErrorApp = require('../utils/errores');

const columnas = `p.id, p.usuario_id, p.nombre, p.total, p.cantidad, p.entrega, p.direccion,
  COALESCE((SELECT json_agg(json_build_object(
    'productoId', d.producto_id,
    'nombre', d.nombre_producto,
    'precioUnitario', d.precio_unitario,
    'cantidad', d.cantidad,
    'subtotal', d.subtotal
  ) ORDER BY d.id) FROM pedido_detalles d WHERE d.pedido_id = p.id), '[]'::json) AS items`;

const columnasEditables = {
  entrega: 'entrega',
  direccion: 'direccion'
};

async function listar() {
  const { rows } = await pool.query(`SELECT ${columnas} FROM pedidos p ORDER BY p.id`);
  return rows.map(Pedido.desdeFila);
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`SELECT ${columnas} FROM pedidos p WHERE p.id = $1`, [id]);
  return rows[0] ? Pedido.desdeFila(rows[0]) : null;
}

async function crear({ usuarioId, items, entrega, direccion }) {
  const cliente = await pool.connect();
  try {
    await cliente.query('BEGIN');

    const cantidades = new Map();
    for (const item of items) {
      const acumulado = (cantidades.get(item.productoId) || 0) + item.cantidad;
      if (!Number.isSafeInteger(acumulado) || acumulado > 2147483647) {
        throw new ErrorApp(400, 'Cantidad fuera de rango.');
      }
      cantidades.set(item.productoId, acumulado);
    }

    const detalles = [];
    let total = 0;
    let cantidad = 0;

    for (const productoId of [...cantidades.keys()].sort((a, b) => a - b)) {
      const unidades = cantidades.get(productoId);
      const { rows } = await cliente.query(
        'SELECT id, nombre, precio, stock FROM productos WHERE id = $1 FOR UPDATE',
        [productoId]
      );
      const producto = rows[0];
      if (!producto) throw new ErrorApp(404, `Producto ${productoId} no encontrado.`);
      if (producto.stock < unidades) {
        throw new ErrorApp(409, `Stock insuficiente para ${producto.nombre}.`);
      }

      const precio = Number(producto.precio);
      const subtotal = precio * unidades;
      if (!Number.isSafeInteger(subtotal) || !Number.isSafeInteger(total + subtotal)) {
        throw new ErrorApp(400, 'El total excede el rango permitido.');
      }
      if (cantidad + unidades > 2147483647) {
        throw new ErrorApp(400, 'Cantidad total fuera de rango.');
      }

      total += subtotal;
      cantidad += unidades;
      detalles.push({ productoId, nombre: producto.nombre, precio, unidades, subtotal });
    }

    const nombre = detalles.map((detalle) => `${detalle.nombre} x${detalle.unidades}`).join(', ').slice(0, 120);
    const { rows } = await cliente.query(
      `INSERT INTO pedidos (usuario_id, nombre, total, cantidad, entrega, direccion)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [usuarioId, nombre, total, cantidad, entrega, direccion ?? null]
    );
    const pedidoId = rows[0].id;

    for (const detalle of detalles) {
      await cliente.query(
        `INSERT INTO pedido_detalles
         (pedido_id, producto_id, nombre_producto, precio_unitario, cantidad, subtotal)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [pedidoId, detalle.productoId, detalle.nombre, detalle.precio, detalle.unidades, detalle.subtotal]
      );
      await cliente.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [detalle.unidades, detalle.productoId]
      );
    }

    await cliente.query('COMMIT');
    return buscarPorId(pedidoId);
  } catch (err) {
    await cliente.query('ROLLBACK');
    throw err;
  } finally {
    cliente.release();
  }
}

async function actualizar(id, cambios) {
  const campos = Object.keys(cambios).filter((campo) => campo in columnasEditables);
  if (campos.length === 0) return buscarPorId(id);

  const asignaciones = campos.map((campo, i) => `${columnasEditables[campo]} = $${i + 1}`);
  const valores = campos.map((campo) => cambios[campo]);
  const { rows } = await pool.query(
    `UPDATE pedidos SET ${asignaciones.join(', ')}
     WHERE id = $${campos.length + 1} RETURNING id`,
    [...valores, id]
  );
  return rows[0] ? buscarPorId(id) : null;
}

async function eliminar(id) {
  const { rowCount } = await pool.query('DELETE FROM pedidos WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { listar, buscarPorId, crear, actualizar, eliminar };