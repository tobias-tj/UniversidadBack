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

// Configurar la zona horaria en cada nueva conexión
pool.on('connect', async (client) => {
  await client.query("SET TIME ZONE 'America/Asuncion';");
});
