import { AdminRepo } from '../../../domain/interfaces/repositories/AdminRepo';
import { pool } from '../../database/AuthDbConnection';
import { Pool } from 'pg';
import { logger } from '../../logger';

export class AdminRepository implements AdminRepo {
  async login(idUniversidad: number, user: string, password: string): Promise<string | undefined> {
    let dynamicPool: Pool | null = null;

    try {
      logger.info("Entra en metodo login");

      // Paso 1: Obtener la URL de conexión de la tabla universidades
      logger.info(`ID Universidad: ${idUniversidad}`);
      const queryUniversidad = 'SELECT * FROM universidades WHERE iduniversidad = $1';
      const resultUniversidad = await pool.query(queryUniversidad, [idUniversidad]);

      if (resultUniversidad.rows.length === 0) {
        logger.error(`No se encontró la universidad con ID: ${idUniversidad}`);
        return undefined;
      }

      const connectionDbUrl = resultUniversidad.rows[0].connectiondb;
      logger.info(`ConnectionDB: ${connectionDbUrl}`);

      // Paso 2: Crear un nuevo pool dinámico con la URL obtenida
      dynamicPool = new Pool({
        connectionString: connectionDbUrl,
        ssl: {
          rejectUnauthorized: false, // Neon requiere SSL
        },
      });

      dynamicPool.on('error', (err) => {
        logger.error('Error en el dynamicPool:', err.message);
      });

      await dynamicPool.query("SET TIME ZONE 'America/Asuncion';");
      logger.info("Se crea nuevo dynamicPool");

      // Paso 3: Verificar si el usuario existe en la tabla usuarios con rol ADMIN
      const queryUsuario = `
        SELECT nombre 
        FROM usuarios 
        WHERE rol = 'ADM' AND nombre = $1
      `;
      logger.info(`Usuario: ${user}`);
      logger.info(`SQL: ${queryUsuario}`);
      const resultUsuario = await dynamicPool.query(queryUsuario, [user]);

      logger.info("Se consulta a la DB de la universidad");
      if (resultUsuario.rows.length === 0) {
        logger.error(`Usuario administrador no encontrado: ${user}`);
        return undefined;
      }

      const usuario = resultUsuario.rows[0];

      // Paso 4: Comparar la contraseña (usando bcrypt o similar)
      // const isPasswordValid = await this.comparePasswords(password, usuario.password);
      // if (!isPasswordValid) {
      //   logger.error(`Contraseña incorrecta para el usuario: ${user}`);
      //   return undefined;
      // }

      // Paso 5: Devolver los datos del usuario y la conexión
      const data = {
        connectionDb: connectionDbUrl,
        user: usuario.nombre,
      };

      return JSON.stringify(data);
    } catch (error:any) {
      logger.error(`Error al iniciar sesión del usuario administrador: ${error.message}`);
      throw error;
    } finally {
      // Asegúrate de cerrar el dynamicPool
      if (dynamicPool) {
        await dynamicPool.end();
        logger.info("DynamicPool cerrado correctamente.");
      }
    }
  }

  // Método para comparar contraseñas (usando bcrypt como ejemplo)
  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}