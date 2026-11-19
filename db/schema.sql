CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(60)  NOT NULL,
  email         VARCHAR(254) NOT NULL,
  password_hash VARCHAR(97)  NOT NULL,
  creado_en     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_unico ON usuarios (LOWER(email));

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  precio BIGINT NOT NULL CHECK (precio >= 0),
  categoria VARCHAR(80) NOT NULL,
  stock INTEGER NOT NULL CHECK (stock >= 0),
  descripcion TEXT NOT NULL,
  imagen VARCHAR(500) NOT NULL,
  precio_anterior BIGINT CHECK (precio_anterior >= 0),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL CHECK (usuario_id > 0),
  nombre VARCHAR(120) NOT NULL,
  total BIGINT NOT NULL CHECK (total >= 0),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS pedidos_usuario_id_idx ON pedidos (usuario_id);

ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS entrega VARCHAR(10) NOT NULL DEFAULT 'retiro';
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS direccion VARCHAR(500);

CREATE TABLE IF NOT EXISTS pedido_detalles (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
  nombre_producto VARCHAR(120) NOT NULL,
  precio_unitario BIGINT NOT NULL CHECK (precio_unitario >= 0),
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  subtotal BIGINT NOT NULL CHECK (subtotal >= 0)
);
CREATE INDEX IF NOT EXISTS pedido_detalles_pedido_idx ON pedido_detalles (pedido_id);
CREATE INDEX IF NOT EXISTS pedido_detalles_producto_idx ON pedido_detalles (producto_id);