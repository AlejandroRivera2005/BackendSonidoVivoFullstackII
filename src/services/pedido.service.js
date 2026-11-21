const pedidoRepository = require('../repositories/pedido.repository');
const ErrorApp = require('../utils/errores');

const idMaximo = 2147483647;

function validarPedido(datos, creacion) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    throw new ErrorApp(400, 'El cuerpo debe ser un objeto JSON.');
  }

  const camposPermitidos = creacion
    ? ['usuarioId', 'items', 'productoId', 'cantidad', 'entrega', 'direccion']
    : ['entrega', 'direccion'];
  for (const campo of Object.keys(datos)) {
    if (!camposPermitidos.includes(campo)) throw new ErrorApp(400, `Campo no permitido: ${campo}.`);
  }

  const cambios = { ...datos };
  if (creacion) {
    if (!Number.isInteger(datos.usuarioId) || datos.usuarioId < 1 || datos.usuarioId > idMaximo) {
      throw new ErrorApp(400, 'usuarioId debe ser un entero positivo.');
    }
    if (datos.items !== undefined && (datos.productoId !== undefined || datos.cantidad !== undefined)) {
      throw new ErrorApp(400, 'Utilice items o productoId/cantidad, no ambos.');
    }

    const items = datos.items ?? (datos.productoId !== undefined
      ? [{ productoId: datos.productoId, cantidad: datos.cantidad }]
      : null);
    if (!Array.isArray(items) || items.length === 0) {
      throw new ErrorApp(400, 'Debe indicar items o productoId y cantidad.');
    }
    for (const item of items) {
      if (!item || typeof item !== 'object' || Array.isArray(item) ||
          !Number.isInteger(item.productoId) || item.productoId < 1 || item.productoId > idMaximo ||
          !Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > idMaximo) {
        throw new ErrorApp(400, 'Cada item requiere productoId y cantidad enteros positivos.');
      }
    }
    cambios.items = items;
    delete cambios.productoId;
    delete cambios.cantidad;
    if (cambios.entrega === undefined) cambios.entrega = 'retiro';
  }

  if (cambios.entrega !== undefined && !['retiro', 'envio'].includes(cambios.entrega)) {
    throw new ErrorApp(400, 'entrega debe ser retiro o envio.');
  }
  if (cambios.direccion !== undefined && cambios.direccion !== null &&
      (typeof cambios.direccion !== 'string' || !cambios.direccion.trim() || cambios.direccion.length > 500)) {
    throw new ErrorApp(400, 'direccion inválida.');
  }
  if (typeof cambios.direccion === 'string') cambios.direccion = cambios.direccion.trim();
  if (cambios.entrega === 'envio' && !cambios.direccion) {
    throw new ErrorApp(400, 'El envío requiere direccion.');
  }
  if (cambios.entrega === 'retiro' && cambios.direccion) {
    throw new ErrorApp(400, 'Retiro no requiere direccion.');
  }
  return cambios;
}

async function listarPedidos() {
  const pedidos = await pedidoRepository.listar();
  return pedidos.map((pedido) => pedido.aPublico());
}

async function listarPedidosDeUsuario(usuarioId) {
  const pedidos = await pedidoRepository.listarPorUsuario(usuarioId);
  return pedidos.map((pedido) => pedido.aPublico());
}

async function obtenerPedido(id) {
  const pedido = await pedidoRepository.buscarPorId(id);
  if (!pedido) throw new ErrorApp(404, 'Pedido no encontrado.');
  return pedido.aPublico();
}

async function crearPedido(datos = {}) {
  const nuevo = await pedidoRepository.crear(validarPedido(datos, true));
  return nuevo.aPublico();
}

async function actualizarPedido(id, datos = {}) {
  const actual = await pedidoRepository.buscarPorId(id);
  if (!actual) throw new ErrorApp(404, 'Pedido no encontrado.');

  const cambios = validarPedido(datos, false);
  const entrega = cambios.entrega ?? actual.entrega;
  const direccion = cambios.direccion === undefined ? actual.direccion : cambios.direccion;
  if (entrega === 'envio' && !direccion) throw new ErrorApp(400, 'El envío requiere direccion.');
  if (entrega === 'retiro' && direccion) cambios.direccion = null;

  const actualizado = await pedidoRepository.actualizar(id, cambios);
  if (!actualizado) throw new ErrorApp(404, 'Pedido no encontrado.');
  return actualizado.aPublico();
}

async function eliminarPedido(id) {
  if (!(await pedidoRepository.eliminar(id))) throw new ErrorApp(404, 'Pedido no encontrado.');
}

module.exports = {
  listarPedidos,
  listarPedidosDeUsuario,
  obtenerPedido,
  crearPedido,
  actualizarPedido,
  eliminarPedido
};