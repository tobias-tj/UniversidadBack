import { ManageExamUserRepo } from '../../../domain/interfaces/repositories/ManageExamUserRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ManageExamUserRepository implements ManageExamUserRepo {
  async create(idExamen: number, idUsuario: number): Promise<boolean> {
    try {
      logger.info('Inicia proceso para guardar datos en examenesUsuarios');
      await pool.query(
        'INSERT INTO examenes_usuarios (examen_id, estudiante_id) VALUES ($1, $2)',
        [idExamen, idUsuario],
      );
      logger.info('Datos guardados correctamente para examenesUsuarios');
      return true;
    } catch (error) {
      logger.error('Error guardando datos en examenesUsuarios: ' + error);
      return false;
    }
  }
}
