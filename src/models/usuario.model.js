class Usuario {
  constructor({ id, nombre, email, passwordHash }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.passwordHash = passwordHash;
  }

  static desdeFila(fila) {
    return new Usuario({
      id: fila.id,
      nombre: fila.nombre,
      email: fila.email,
      passwordHash: fila.password_hash
    });
  }

  aPublico() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email
    };
  }
}

module.exports = Usuario;