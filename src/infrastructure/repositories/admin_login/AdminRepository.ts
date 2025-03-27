import bcrypt from 'bcrypt';
import { AdminRepo } from '../../../domain/interfaces/repositories/AdminRepo';
import { DynamicDbQuery } from '../../database/DynamicQuery';
import { logger } from '../../logger';
import { pool } from '../../database/ConfigDbConnection';
import { UniversityList } from '../../../domain/entities/UniversityList';

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
        'SELECT connectiondb FROM universidades WHERE iduniversidad = $1';
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

  async updatePassword(): Promise<void> {
    const userId = 0; // ID del usuario a actualizar
    const hardcodedPassword = ''; // Contraseña en duro que será hasheada
    const SALT_ROUNDS = 12; // Número de rondas para el hashing

    try {
      logger.info(
        `Iniciando actualización de contraseña para usuario ID: ${userId}`,
      );

      // 1. Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(hardcodedPassword, SALT_ROUNDS);

      // 2. Actualizar en la base de datos principal (pool)
      const updateQuery = `
            UPDATE usuarios 
            SET password = $1 
            WHERE id = $2
        `;

      await pool.query(updateQuery, [hashedPassword, userId]);

      logger.info(
        `Contraseña actualizada correctamente para usuario ID: ${userId}`,
      );
    } catch (error: any) {
      logger.error(`Error al actualizar contraseña: ${error.message}`);
      throw new Error('No se pudo actualizar la contraseña');
    }
  }

  async getUniversity(): Promise<UniversityList[]> {
    try {
      logger.info(
        'Inicia proceso para obtener la lista de universidades asociadas',
      );
      const query = `SELECT iduniversidad, nombreuniversidad FROM universidades`;
      const result = await pool.query(query);
      console.log('Ingresando para ver las universidades', result);
      logger.info(
        'Finaliza con éxito el proceso para obtener las universidades',
      );

      return result.rows || [];
    } catch (error) {
      logger.error('Error obteniendo las universidades', { error });
      throw new Error('Error obteniendo las universidades');
    }
  }
}
