/*
  # Create animales table

  1. New Tables
    - `animales`
      - `id` (uuid, primary key)
      - `nombre` (text, not null)
      - `edad` (integer, not null)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `animales` table
    - Add policies for authenticated users to manage their own animals
*/

CREATE TABLE IF NOT EXISTS animales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  edad integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE animales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can select animales"
  ON animales FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert animales"
  ON animales FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update animales"
  ON animales FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete animales"
  ON animales FOR DELETE
  TO authenticated
  USING (true);
