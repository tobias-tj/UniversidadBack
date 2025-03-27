import bcrypt from 'bcrypt';
import { AdminRepo } from '../../../domain/interfaces/repositories/AdminRepo';
import { pool } from '../../database/ConfigDbConnection';
import { DynamicDbQuery } from '../../database/DynamicQuery';
import { logger } from '../../logger';

export class AdminRepository implements AdminRepo {
  async login(
    idUniversidad: number,
    email: string,
    password: string,
  ): Promise<string | undefined> {
    let dynamicQuery: DynamicDbQuery | null = null;

    try {
      logger.info('Entra en metodo login');

      // Paso 1: Obtener la URL de conexión de la tabla universidades
      logger.info(`ID Universidad: ${idUniversidad}`);
      const queryUniversidad =
        'SELECT * FROM universidades WHERE iduniversidad = $1';
      const resultUniversidad = await pool.query(queryUniversidad, [
        idUniversidad,
      ]);

      if (resultUniversidad.rows.length === 0) {
        logger.error(`No se encontró la universidad con ID: ${idUniversidad}`);
        return undefined;
      }

      const connectionDbUrl = resultUniversidad.rows[0].connectiondb;
      dynamicQuery = new DynamicDbQuery(connectionDbUrl);

      await dynamicQuery.initializePool();

      // Paso 2: Buscar al usuario ADMIN (sin comparar password aún)
      const queryUsuario = `
         SELECT nombre, password 
         FROM usuarios 
         WHERE rol = 'ADM' AND email = $1
       `;
      const resultUsuario = await dynamicQuery.executeQuery(queryUsuario, [
        email,
      ]);

      if (resultUsuario.length === 0) {
        logger.error(`Usuario administrador no encontrado: ${email}`);
        return undefined;
      }

      const usuario = resultUsuario[0];

      // Paso 3: Comparar contraseña hasheada con bcrypt
      const isPasswordValid = await bcrypt.compare(password, usuario.password);
      if (!isPasswordValid) {
        logger.error('Contraseña incorrecta');
        return undefined;
      }

      // Paso 4: Devolver datos seguros
      const data = {
        connectionDb: connectionDbUrl,
        user: usuario.nombre,
      };
      return JSON.stringify(data);
    } catch (error: any) {
      logger.error(
        `Error al iniciar sesión del usuario administrador: ${error.message}`,
      );
      throw error;
    } finally {
      if (dynamicQuery) {
        await dynamicQuery.closePool();
        logger.info('DynamicQuery cerrado correctamente.');
      }
    }
  }
}
