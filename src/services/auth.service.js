const usuarioRepository = require('../repositories/usuario.repository');
const usuarioService = require('./usuario.service');
const ErrorApp = require('../utils/errores');
const { verificarPassword } = require('../utils/hash');
const { firmarToken } = require('../utils/jwt');
const { validarLogin } = require('../utils/validaciones');

function conToken(usuario) {
  const { token, expiraEn } = firmarToken(usuario);
  return { usuario, token, tipo: 'Bearer', expiraEn };
}

async function registrar(datos) {
  const usuario = await usuarioService.crearUsuario(datos);
  return conToken(usuario);
}

async function iniciarSesion(datos = {}) {
  const errores = validarLogin(datos);
  if (Object.keys(errores).length > 0) {
    throw new ErrorApp(400, 'Datos inválidos.', errores);
  }

  const usuario = await usuarioRepository.buscarPorEmail(datos.email);
  if (!usuario || !verificarPassword(datos.password, usuario.passwordHash)) {
    throw new ErrorApp(401, 'Correo o contraseña incorrectos.');
  }

  return conToken(usuario.aPublico());
}

async function perfil(id) {
  return usuarioService.obtenerUsuario(id);
}

module.exports = { registrar, iniciarSesion, perfil };