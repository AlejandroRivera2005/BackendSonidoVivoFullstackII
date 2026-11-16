const regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mensajes = {
  nombreObligatorio: 'El nombre es obligatorio.',
  nombreLargo: 'El nombre no puede superar los 60 caracteres.',
  caracteresInvalidos: 'El texto contiene caracteres no permitidos.',
  emailObligatorio: 'El correo electrónico es obligatorio.',
  emailInvalido: 'Ingresa un correo electrónico válido.',
  emailLargo: 'El correo no puede superar los 254 caracteres.',
  passwordObligatoria: 'La contraseña es obligatoria.',
  passwordCorta: 'La contraseña debe tener al menos 6 caracteres.',
  passwordLarga: 'La contraseña no puede superar los 100 caracteres.'
};

const esVacio = (valor) => !String(valor ?? '').trim();

const tieneNulo = (texto) => texto.includes('\u0000');

function validarNombre(nombre) {
  if (typeof nombre !== 'string' || esVacio(nombre)) return mensajes.nombreObligatorio;
  if (nombre.trim().length > 60) return mensajes.nombreLargo;
  if (tieneNulo(nombre)) return mensajes.caracteresInvalidos;
  return '';
}

function validarEmail(email) {
  if (typeof email !== 'string' || esVacio(email)) return mensajes.emailObligatorio;
  if (email.trim().length > 254) return mensajes.emailLargo;
  if (!regex_email.test(email.trim())) return mensajes.emailInvalido;
  if (tieneNulo(email)) return mensajes.caracteresInvalidos;
  return '';
}

function validarPassword(password) {
  if (typeof password !== 'string' || esVacio(password)) return mensajes.passwordObligatoria;
  if (password.length < 6) return mensajes.passwordCorta;
  if (password.length > 100) return mensajes.passwordLarga;
  return '';
}

const limpiarErrores = (errores) =>
  Object.fromEntries(Object.entries(errores).filter(([, msg]) => msg));

function validarRegistro({ nombre, email, password } = {}) {
  return limpiarErrores({
    nombre: validarNombre(nombre),
    email: validarEmail(email),
    password: validarPassword(password)
  });
}

function validarActualizacion(datos = {}) {
  const errores = {};
  if (datos.nombre !== undefined) errores.nombre = validarNombre(datos.nombre);
  if (datos.email !== undefined) errores.email = validarEmail(datos.email);
  if (datos.password !== undefined) errores.password = validarPassword(datos.password);
  return limpiarErrores(errores);
}

function validarLogin({ email, password } = {}) {
  return limpiarErrores({
    email: validarEmail(email),
    password: typeof password !== 'string' || esVacio(password) ? mensajes.passwordObligatoria : ''
  });
}

module.exports = { mensajes, validarRegistro, validarActualizacion, validarLogin };