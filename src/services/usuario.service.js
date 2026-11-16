const usuarioRepository = require('../repositories/usuario.repository');
const ErrorApp = require('../utils/errores');
const { hashearPassword } = require('../utils/hash');
const { validarRegistro, validarActualizacion } = require('../utils/validaciones');

const mensajeDuplicado = 'Ya existe un usuario registrado con este correo.';
const codigoDuplicado = '23505'; 

function errorDuplicado() {
  return new ErrorApp(409, mensajeDuplicado, { email: mensajeDuplicado });
}

async function listarUsuarios() {
  const usuarios = await usuarioRepository.listar();
  return usuarios.map((u) => u.aPublico());
}

async function obtenerUsuario(id) {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) throw new ErrorApp(404, 'Usuario no encontrado.');
  return usuario.aPublico();
}

async function crearUsuario(datos = {}) {
  const errores = validarRegistro(datos);
  if (Object.keys(errores).length > 0) {
    throw new ErrorApp(400, 'Datos inválidos.', errores);
  }

  const email = datos.email.trim().toLowerCase();
  if (await usuarioRepository.buscarPorEmail(email)) throw errorDuplicado();

  try {
    const nuevo = await usuarioRepository.crear({
      nombre: datos.nombre.trim(),
      email,
      passwordHash: hashearPassword(datos.password)
    });
    return nuevo.aPublico();
  } catch (err) {
    if (err.code === codigoDuplicado) throw errorDuplicado();
    throw err;
  }
}

async function actualizarUsuario(id, datos = {}) {
  if (!(await usuarioRepository.buscarPorId(id))) throw new ErrorApp(404, 'Usuario no encontrado.');

  const errores = validarActualizacion(datos);
  if (Object.keys(errores).length > 0) {
    throw new ErrorApp(400, 'Datos inválidos.', errores);
  }

  const cambios = {};
  if (datos.nombre !== undefined) cambios.nombre = datos.nombre.trim();
  if (datos.email !== undefined) {
    const email = datos.email.trim().toLowerCase();
    const existente = await usuarioRepository.buscarPorEmail(email);
    if (existente && existente.id !== id) throw errorDuplicado();
    cambios.email = email;
  }
  if (datos.password !== undefined) cambios.passwordHash = hashearPassword(datos.password);

  try {
    const actualizado = await usuarioRepository.actualizar(id, cambios);
    if (!actualizado) throw new ErrorApp(404, 'Usuario no encontrado.');
    return actualizado.aPublico();
  } catch (err) {
    if (err.code === codigoDuplicado) throw errorDuplicado();
    throw err;
  }
}

async function eliminarUsuario(id) {
  if (!(await usuarioRepository.eliminar(id))) throw new ErrorApp(404, 'Usuario no encontrado.');
}

module.exports = {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
};