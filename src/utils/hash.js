const crypto = require('crypto');

function sha256(texto) {
  return crypto.createHash('sha256').update(texto).digest('hex');
}

function hashearPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${sha256(salt + password)}`;
}

function verificarPassword(password, almacenado) {
  const [salt, hashGuardado] = String(almacenado || '').split(':');
  if (!salt || !hashGuardado) return false;

  const calculado = Buffer.from(sha256(salt + password), 'hex');
  const esperado = Buffer.from(hashGuardado, 'hex');
  if (calculado.length !== esperado.length) return false;

  return crypto.timingSafeEqual(calculado, esperado);
}

module.exports = { sha256, hashearPassword, verificarPassword };