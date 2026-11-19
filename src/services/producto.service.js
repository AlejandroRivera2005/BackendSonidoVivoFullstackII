const productoRepository = require('../repositories/producto.repository');
const ErrorApp = require('../utils/errores');

const camposObligatorios = ['nombre', 'precio', 'categoria', 'stock', 'descripcion', 'imagen'];
const validadores = {
  nombre: (valor) => typeof valor !== 'string' || !valor.trim() || valor.length > 120,
  precio: (valor) => !Number.isSafeInteger(valor) || valor < 0,
  categoria: (valor) => typeof valor !== 'string' || !valor.trim() || valor.length > 80,
  stock: (valor) => !Number.isInteger(valor) || valor < 0 || valor > 2147483647,
  descripcion: (valor) => typeof valor !== 'string' || !valor.trim(),
  imagen: (valor) => typeof valor !== 'string' || !valor.trim() || valor.length > 500,
  precioAnterior: (valor) => valor !== null && (!Number.isSafeInteger(valor) || valor < 0)
};

function validarProducto(datos, creacion) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    throw new ErrorApp(400, 'El cuerpo debe ser un objeto JSON.');
  }

  const errores = {};
  for (const campo of Object.keys(datos)) {
    if (!(campo in validadores)) errores[campo] = 'Campo no permitido.';
    else if (validadores[campo](datos[campo])) errores[campo] = 'Valor inválido.';
  }
  if (creacion) {
    for (const campo of camposObligatorios) {
      if (datos[campo] === undefined) errores[campo] = 'Campo obligatorio.';
    }
  }
  if (Object.keys(errores).length > 0) throw new ErrorApp(400, 'Datos inválidos.', errores);

  return Object.fromEntries(Object.entries(datos).map(([campo, valor]) => [
    campo, typeof valor === 'string' ? valor.trim() : valor
  ]));
}

async function listarProductos() {
  const productos = await productoRepository.listar();
  return productos.map((producto) => producto.aPublico());
}

async function obtenerProducto(id) {
  const producto = await productoRepository.buscarPorId(id);
  if (!producto) throw new ErrorApp(404, 'Producto no encontrado.');
  return producto.aPublico();
}

async function crearProducto(datos = {}) {
  const nuevo = await productoRepository.crear(validarProducto(datos, true));
  return nuevo.aPublico();
}

async function actualizarProducto(id, datos = {}) {
  if (!(await productoRepository.buscarPorId(id))) throw new ErrorApp(404, 'Producto no encontrado.');
  const cambios = validarProducto(datos, false);
  const actualizado = await productoRepository.actualizar(id, cambios);
  if (!actualizado) throw new ErrorApp(404, 'Producto no encontrado.');
  return actualizado.aPublico();
}

async function eliminarProducto(id) {
  if (!(await productoRepository.eliminar(id))) throw new ErrorApp(404, 'Producto no encontrado.');
}

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto
};