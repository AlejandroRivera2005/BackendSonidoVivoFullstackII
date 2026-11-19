function manejarErrores(err, req, res, next) {
  const status = err.status || (err.code === '23503' ? 409 : 500);

  if (status >= 500) {
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }

  const mensaje = err.code === '23503'
    ? 'No se puede eliminar un producto asociado a pedidos.'
    : (err.type === 'entity.parse.failed' ? 'El cuerpo de la petición no es un JSON válido.' : err.message);
  const cuerpo = { error: mensaje };
  if (err.detalles) cuerpo.detalles = err.detalles;
  res.status(status).json(cuerpo);
}

module.exports = manejarErrores;