import { ManageExamUserRepo } from '../../../domain/interfaces/repositories/ManageExamUserRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ManageExamUserRepository implements ManageExamUserRepo {
  async create(idExamen: number, idUsuario: number): Promise<number | null> {
    try {
      logger.info('Inicia proceso para guardar datos en examenesUsuarios');
      const result = await pool.query(
        'INSERT INTO examenes_usuarios (examen_id, estudiante_id) VALUES ($1, $2) RETURNING id',
        [idExamen, idUsuario],
      );
      logger.info('Datos guardados correctamente para examenesUsuarios');

      const insertedId = result.rows[0]?.id;
      return insertedId || null;
    } catch (error) {
      logger.error('Error guardando datos en examenesUsuarios: ' + error);
      return null;
    }
  }

  async createFaceId(idFace: string, idUser: number): Promise<boolean> {
    try {
      logger.info('Inicia proceso para guardar el faceId');
      console.log(idFace);
      console.log(idUser);
      await pool.query('UPDATE usuarios SET face_id = $1 WHERE id = $2', [
        idFace,
        idUser,
      ]);
      logger.info('Datos del faceId guardado correctamente');
      return true;
    } catch (error) {
      logger.error(
        'Ocurrio un error inesperado a la hora de almacenar el faceId',
      );
      return false;
    }
  }

  async createStartTime(creationId: number): Promise<boolean> {
    try {
      logger.info(
        'Inicia proceso para guardar el horario del comienzo del examen.',
      );
      await pool.query(
        'UPDATE examenes_usuarios SET inicio_examen = NOW() WHERE id = $1',
        [creationId],
      );
      logger.info('El tiempo de inicio de examen fue guardado correctamente');
      return true;
    } catch (error) {
      logger.info(
        'Ocurrió un error inesperado al intentar guardar el tiempo del inicio de examen: ' +
          error,
      );
      return false;
    }
  }

  async createFinishTime(creationId: number): Promise<boolean> {
    try {
      logger.info(
        'Inicia proceso para guardar el horario de finalizacion del examen.',
      );
      await pool.query(
        'UPDATE examenes_usuarios SET fin_examen = NOW() WHERE id = $1',
        [creationId],
      );
      logger.info(
        'El tiempo de finalizacion de examen fue guardado correctamente',
      );
      return true;
    } catch (error) {
      logger.info(
        'Ocurrió un error inesperado al intentar guardar el tiempo de finalizacion de examen: ' +
          error,
      );
      return false;
    }
  }
}
