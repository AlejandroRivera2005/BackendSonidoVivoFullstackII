const ErrorApp = require('../utils/errores');
const { verificarToken } = require('../utils/jwt');
const usuarioRepository = require('../repositories/usuario.repository');

const formatoCabecera = /^Bearer\s+(\S+)$/i;

async function autenticar(req, res, next) {
  try {
    const coincidencia = formatoCabecera.exec(req.headers.authorization || '');
    if (!coincidencia) throw new ErrorApp(401, 'Falta token JWT.');

    const payload = verificarToken(coincidencia[1]);
    const id = Number(payload.sub);
    if (!Number.isSafeInteger(id) || id <= 0) throw new ErrorApp(401, 'Token inválido.');

    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) throw new ErrorApp(401, 'La cuenta ya no existe.');
    req.usuario = usuario.aPublico();
    next();
  } catch (error) {
    next(error);
  }
}

function soloAdmin(req, res, next) {
  if (!req.usuario || req.usuario.rol !== 'admin') {
    return next(new ErrorApp(403, 'Acceso exclusivo para administradores.'));
  }
  next();
}

module.exports = { autenticar, soloAdmin };