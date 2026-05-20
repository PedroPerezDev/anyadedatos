/*
  # Añadir columna edad a personas

  1. Cambios
    - `personas`: nueva columna `edad` (integer, nullable)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'personas' AND column_name = 'edad'
  ) THEN
    ALTER TABLE personas ADD COLUMN edad integer;
  END IF;
END $$;
