class Usuario {
  constructor({ id, nombre, email, passwordHash, rol }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.passwordHash = passwordHash;
    this.rol = rol;
  }

  static desdeFila(fila) {
    return new Usuario({
      id: fila.id,
      nombre: fila.nombre,
      email: fila.email,
      passwordHash: fila.password_hash,
      rol: fila.rol
    });
  }

  aPublico() {
    return { id: this.id, nombre: this.nombre, email: this.email, rol: this.rol };
  }
}

module.exports = Usuario;
