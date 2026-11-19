class Producto {
  constructor({ id, nombre, precio, categoria, stock, descripcion, imagen, precioAnterior }) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.stock = stock;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.precioAnterior = precioAnterior;
  }

  static desdeFila(fila) {
    return new Producto({
      id: fila.id,
      nombre: fila.nombre,
      precio: Number(fila.precio),
      categoria: fila.categoria,
      stock: fila.stock,
      descripcion: fila.descripcion,
      imagen: fila.imagen,
      precioAnterior: fila.precio_anterior === null ? null : Number(fila.precio_anterior)
    });
  }

  aPublico() {
    return {
      id: this.id,
      nombre: this.nombre,
      precio: this.precio,
      categoria: this.categoria,
      stock: this.stock,
      descripcion: this.descripcion,
      imagen: this.imagen,
      precioAnterior: this.precioAnterior
    };
  }
}

module.exports = Producto;
