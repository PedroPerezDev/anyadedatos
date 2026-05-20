/*
  # Crear tabla personas

  1. Nueva tabla
    - `personas`
      - `id` (uuid, clave primaria)
      - `nombre` (text, requerido)
      - `apellido` (text, requerido)
      - `created_at` (timestamp)

  2. Seguridad
    - RLS habilitado
    - Política de lectura pública (los datos no son sensibles)
    - Política de inserción pública
*/

CREATE TABLE IF NOT EXISTS personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL DEFAULT '',
  apellido text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede leer personas"
  ON personas FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Cualquiera puede insertar personas"
  ON personas FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
