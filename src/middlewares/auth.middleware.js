const ErrorApp = require('../utils/errores');
const { verificarToken } = require('../utils/jwt');

const formatoCabecera = /^Bearer\s+(\S+)$/i;

function autenticar(req, res, next) {
  try {
    const coincidencia = formatoCabecera.exec(req.headers.authorization || '');
    if (!coincidencia) {
      throw new ErrorApp(401, 'Falta el token. Envía el header "Authorization: Bearer <token>".');
    }

    const payload = verificarToken(coincidencia[1]);
    req.usuario = { id: Number(payload.sub), nombre: payload.nombre, email: payload.email };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { autenticar };