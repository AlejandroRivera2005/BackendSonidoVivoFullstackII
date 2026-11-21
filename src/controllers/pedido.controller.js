const pedidoService = require('../services/pedido.service');
const ErrorApp = require('../utils/errores');

const idMaximo = 2147483647;

function leerId(req) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1 || id > idMaximo) {
    throw new ErrorApp(400, 'El id debe ser un entero positivo.');
  }
  return id;
}

async function listar(req, res) {
  res.status(200).json(await pedidoService.listarPedidos());
}

async function obtener(req, res) {
  const pedido = await pedidoService.obtenerPedido(leerId(req));
  if (req.usuario.rol !== 'admin' && pedido.usuarioId !== req.usuario.id) {
    throw new ErrorApp(403, 'No puedes consultar este pedido.');
  }
  res.status(200).json(pedido);
}

async function mios(req, res) {
  res.status(200).json(await pedidoService.listarPedidosDeUsuario(req.usuario.id));
}

async function crear(req, res) {
  res.status(201).json(await pedidoService.crearPedido({ ...req.body, usuarioId: req.usuario.id }));
}

async function actualizar(req, res) {
  res.status(200).json(await pedidoService.actualizarPedido(leerId(req), req.body));
}

async function eliminar(req, res) {
  await pedidoService.eliminarPedido(leerId(req));
  res.status(204).send();
}

module.exports = { listar, mios, obtener, crear, actualizar, eliminar };