import { Exam } from '../../../domain/entities/Exam';
import { ExamRepo } from '../../../domain/interfaces/ExamRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ExamRepository implements ExamRepo {
  async create(exam: Exam): Promise<Exam> {
    try {
      logger.info('Inicia proceso para crear el examen del estudiante');
      const result = await pool.query(
        'INSERT INTO examenes (descripcion, fecha, estado, form_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [exam.descripcion, exam.fecha, exam.estado, exam.formUrl],
      );
      logger.info('Examen Guardado Correctamente!');
      return result.rows[0];
    } catch (error) {
      logger.error('Error creando el examen: ' + error);
      throw error;
    }
  }
}
