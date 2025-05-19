import bcrypt from 'bcrypt';
import { AdminRepo } from '../../../domain/interfaces/repositories/AdminRepo';
import { pool } from '../../database/ConfigDbConnection';
import { DynamicDbQuery } from '../../database/DynamicQuery';
import { logger } from '../../logger';
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
        'SELECT connectiondb, proctor_type FROM universidades WHERE iduniversidad = $1';
      const resultUniversidad = await pool.query(queryUniversidad, [
        idUniversidad,
      ]);

      if (resultUniversidad.rows.length === 0) {
        logger.error(`No se encontró la universidad con ID: ${idUniversidad}`);
        return undefined;
      }

      const connectionDbUrl = resultUniversidad.rows[0].connectiondb;
      const proctorType = resultUniversidad.rows[0].proctor_type;
      logger.info('Se encontro proctorType-->', proctorType);

      // Paso 2: Crear una instancia de DynamicDbQuery
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
        proctorType: proctorType,
      };
      return JSON.stringify(data);
    } catch (error: any) {
      logger.error(
        `Error al iniciar sesión del usuario administrador: ${error.message}`,
      );
      throw error;
    } finally {
      // Asegúrate de cerrar el dynamicQuery
      if (dynamicQuery) {
        await dynamicQuery.closePool();
        logger.info('DynamicQuery cerrado correctamente.');
      }
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
