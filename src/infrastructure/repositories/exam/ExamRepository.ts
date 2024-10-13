import { Exam } from '../../../domain/entities/Exam';
import { ExamRepo } from '../../../domain/interfaces/repositories/ExamRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ExamRepository implements ExamRepo {
  async create(exam: Exam): Promise<boolean> {
    try {
      logger.info('Inicia proceso para crear el examen del estudiante');
      await pool.query(
        'INSERT INTO examenes (id, descripcion, fecha, estado) VALUES ($1, $2, $3, $4)',
        [exam.id, exam.courseName, exam.fecha, exam.estado],
      );
      logger.info('Examen Guardado Correctamente!');
      return true;
    } catch (error) {
      logger.error('Error creando el examen: ' + error);
      return false;
    }
  }

  async findById(id: number): Promise<Exam | null> {
    try {
      logger.info('Inicia proceso para obtener un Examen');
      const result = await pool.query('SELECT * FROM examenes WHERE id = $1', [
        id,
      ]);

      if (result.rows.length === 0) {
        logger.info(`No se encontro el examen con el ID: ${id}`);
        return null;
      }

      logger.info(
        'Finaliza con exito el proceso para obtener el examen por el id',
      );

      return result.rows[0];
    } catch (error) {
      logger.info('Error obteniendo el examen');
      throw error;
    }
  }
}
