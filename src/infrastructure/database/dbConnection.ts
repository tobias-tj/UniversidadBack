import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../logger';

dotenv.config(); // Cargar las variables de entorno

// Instanciar una única vez el Pool y exportarlo
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || '',
  ssl: {
    rejectUnauthorized: false, // Neon requiere SSL
  },
});
