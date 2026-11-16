const crypto = require('crypto');
const ErrorApp = require('./errores');
const { leerConfigJwt } = require('../config/jwt');

const algoritmo = 'HS256';
const mensajeInvalido = 'Token inválido.';
const mensajeExpirado = 'La sesión expiró. Inicia sesión nuevamente.';

const aBase64Url = (texto) => Buffer.from(texto).toString('base64url');
const desdeBase64Url = (texto) => Buffer.from(texto, 'base64url').toString('utf8');

function firmaDe(contenido, secreto) {
  return crypto.createHmac('sha256', secreto).update(contenido).digest('base64url');
}

function leerJson(texto) {
  try {
    const valor = JSON.parse(desdeBase64Url(texto));
    return valor && typeof valor === 'object' ? valor : null;
  } catch {
    return null;
  }
}


function firmarToken(usuario) {
  const { secreto, expira } = leerConfigJwt();
  const ahora = Math.floor(Date.now() / 1000);

  const cabecera = aBase64Url(JSON.stringify({ alg: algoritmo, typ: 'JWT' }));
  const payload = aBase64Url(
    JSON.stringify({
      sub: String(usuario.id),
      nombre: usuario.nombre,
      email: usuario.email,
      iat: ahora,
      exp: ahora + expira
    })
  );

  const contenido = `${cabecera}.${payload}`;
  return { token: `${contenido}.${firmaDe(contenido, secreto)}`, expiraEn: expira };
}

function verificarToken(token) {
  const { secreto } = leerConfigJwt();

  const partes = String(token || '').split('.');
  if (partes.length !== 3) throw new ErrorApp(401, mensajeInvalido);
  const [cabeceraB64, payloadB64, firmaRecibida] = partes;

  const cabecera = leerJson(cabeceraB64);
  if (!cabecera || cabecera.alg !== algoritmo) throw new ErrorApp(401, mensajeInvalido);

  const esperada = Buffer.from(firmaDe(`${cabeceraB64}.${payloadB64}`, secreto));
  const recibida = Buffer.from(firmaRecibida);
  if (esperada.length !== recibida.length || !crypto.timingSafeEqual(esperada, recibida)) {
    throw new ErrorApp(401, mensajeInvalido);
  }

  const payload = leerJson(payloadB64);
  if (!payload || typeof payload.exp !== 'number' || !payload.sub) {
    throw new ErrorApp(401, mensajeInvalido);
  }
  if (payload.exp <= Math.floor(Date.now() / 1000)) throw new ErrorApp(401, mensajeExpirado);

  return payload;
}

module.exports = { firmarToken, verificarToken };