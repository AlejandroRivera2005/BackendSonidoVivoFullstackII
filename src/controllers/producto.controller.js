const productoService = require('../services/producto.service');
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
  res.status(200).json(await productoService.listarProductos());
}

async function obtener(req, res) {
  res.status(200).json(await productoService.obtenerProducto(leerId(req)));
}

async function crear(req, res) {
  res.status(201).json(await productoService.crearProducto(req.body));
}

async function actualizar(req, res) {
  res.status(200).json(await productoService.actualizarProducto(leerId(req), req.body));
}

async function eliminar(req, res) {
  await productoService.eliminarProducto(leerId(req));
  res.status(204).send();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };