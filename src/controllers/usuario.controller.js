const usuarioService = require('../services/usuario.service');
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
  res.status(200).json(await usuarioService.listarUsuarios());
}

async function obtener(req, res) {
  res.status(200).json(await usuarioService.obtenerUsuario(leerId(req)));
}

async function crear(req, res) {
  res.status(201).json(await usuarioService.crearUsuario(req.body));
}

async function actualizar(req, res) {
  res.status(200).json(await usuarioService.actualizarUsuario(leerId(req), req.body));
}

async function eliminar(req, res) {
  await usuarioService.eliminarUsuario(leerId(req));
  res.status(204).send();
}

module.exports = { listar, obtener, crear, actualizar, eliminar };