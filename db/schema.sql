CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(60)  NOT NULL,
  email         VARCHAR(254) NOT NULL,
  password_hash VARCHAR(97)  NOT NULL,
  creado_en     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS usuarios_email_unico ON usuarios (LOWER(email));