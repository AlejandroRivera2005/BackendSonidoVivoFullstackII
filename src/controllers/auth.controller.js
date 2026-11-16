const authService = require('../services/auth.service');

async function registro(req, res) {
  const sesion = await authService.registrar(req.body);
  res.status(201).json({ mensaje: 'Cuenta creada correctamente.', ...sesion });
}

async function login(req, res) {
  const sesion = await authService.iniciarSesion(req.body);
  res.status(200).json({ mensaje: `Bienvenido/a de nuevo, ${sesion.usuario.nombre}`, ...sesion });
}

async function perfil(req, res) {
  res.status(200).json(await authService.perfil(req.usuario.id));
}

module.exports = { registro, login, perfil };