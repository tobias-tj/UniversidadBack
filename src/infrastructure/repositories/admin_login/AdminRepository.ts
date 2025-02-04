import { AdminRepo } from '../../../domain/interfaces/repositories/AdminRepo';
import { pool } from '../../database/ConfigDbConnection';
import { DynamicDbQuery } from '../../database/DynamicQuery';
import { logger } from '../../logger';

export class AdminRepository implements AdminRepo {
  async login(idUniversidad: number, user: string, password: string): Promise<string | undefined> {
    let dynamicQuery: DynamicDbQuery | null = null;

    try {
      logger.info('Entra en metodo login');

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

      // Paso 2: Crear una instancia de DynamicDbQuery
      dynamicQuery = new DynamicDbQuery(connectionDbUrl);
      await dynamicQuery.initializePool();

      // Paso 3: Verificar si el usuario existe en la tabla usuarios con rol ADMIN
      const queryUsuario = `
        SELECT nombre, password 
        FROM usuarios 
        WHERE rol = 'ADM' AND nombre = $1 AND password = $2
      `;
      logger.info(`Usuario: ${user}`);
      logger.info(`SQL: ${queryUsuario}`);
      const resultUsuario = await dynamicQuery.executeQuery(queryUsuario, [user, password]);
      logger.info('Se consulta a la DB de la universidad');

      if (resultUsuario.length === 0) {
        logger.error(`Usuario administrador no encontrado: ${user}`);
        return undefined;
      }

      const usuario = resultUsuario[0];

      // Paso 4: Comparar la contraseña (usando bcrypt o similar)
      const isPasswordValid = await this.comparePasswords(password, usuario.password);
      if (!isPasswordValid) {
        logger.error('Contraseña incorrecta');
        return undefined;
      }

      // Paso 5: Devolver los datos del usuario y la conexión
      const data = {
        connectionDb: connectionDbUrl,
        user: usuario.nombre,
      };
      return JSON.stringify(data);
    } catch (error: any) {
      logger.error(`Error al iniciar sesión del usuario administrador: ${error.message}`);
      throw error;
    } finally {
      // Asegúrate de cerrar el dynamicQuery
      if (dynamicQuery) {
        await dynamicQuery.closePool();
        logger.info('DynamicQuery cerrado correctamente.');
      }
    }
  }

  // Método para comparar contraseñas (usando bcrypt como ejemplo)
  private async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const bcrypt = require('bcrypt');
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}