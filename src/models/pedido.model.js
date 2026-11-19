class Pedido {
  constructor({ id, usuarioId, nombre, total, cantidad, entrega, direccion, items }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.nombre = nombre;
    this.total = total;
    this.cantidad = cantidad;
    this.entrega = entrega;
    this.direccion = direccion;
    this.items = items;
  }

  static desdeFila(fila) {
    return new Pedido({
      id: fila.id,
      usuarioId: fila.usuario_id,
      nombre: fila.nombre,
      total: Number(fila.total),
      cantidad: fila.cantidad,
      entrega: fila.entrega,
      direccion: fila.direccion,
      items: (fila.items || []).map((item) => ({
        ...item,
        precioUnitario: Number(item.precioUnitario),
        subtotal: Number(item.subtotal)
      }))
    });
  }

  aPublico() {
    return {
      id: this.id,
      usuarioId: this.usuarioId,
      nombre: this.nombre,
      total: this.total,
      cantidad: this.cantidad,
      entrega: this.entrega,
      direccion: this.direccion,
      items: this.items
    };
  }
}

module.exports = Pedido;