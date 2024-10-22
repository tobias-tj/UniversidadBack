import { Student } from '../../../domain/entities/Student';
import { CustomError } from '../../../domain/interfaces/middleware/errorHandler';
import { StudentRepo } from '../../../domain/interfaces/repositories/StudentRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class StudentRepository implements StudentRepo {
  private student: Student[] = [];

  async findAll(): Promise<Student[]> {
    try {
      logger.info(
        'Inicia proceso para obtener todos los estudiantes registrados',
      );
      const result = await pool.query('SELECT * FROM usuarios');

      logger.info(
        'Finaliza con exito el proceso para obtener todos los estudiantes registrados',
      );
      return result.rows; // Retorna todos los estudiantes en formato array
    } catch (error) {
      logger.info('Ha ocurrido un error tratando de obtener los estudiantes.');
      throw error;
    }
  }

  async findById(id: number): Promise<Student | null> {
    try {
      logger.info('Inicia proceso para obtener un estudiante');
      const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [
        id,
      ]);

      if (result.rows.length === 0) {
        logger.info(`No se encontró el estudiante con el ID: ${id}`);
        return null;
      }

      logger.info(
        'Finaliza con exito el proceso para obtener el estudiante por el id',
      );
      return result.rows[0];
    } catch (error) {
      logger.error('Error obteniendo el estudiante por su Id');
      throw error;
    }
  }

  async create(student: Student): Promise<boolean> {
    try {
      logger.info('Inicia proceso para crear un nuevo estudiante');
      await pool.query(
        'INSERT INTO usuarios (id, nombre, email, rol) VALUES ($1, $2, $3, $4)',
        [student.id, student.fullname, student.email, student.rol],
      );
      logger.info('Estudiante creado con exito');
      return true;
    } catch (error) {
      logger.error('Error creando estudiante: ' + error);
      return false;
    }
  }
  async update(student: Student): Promise<void> {
    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let index = 1;

      // Construimos la query dinámicamente basándonos en los campos no nulos
      if (student.fullname) {
        updateFields.push(`nombre = $${index++}`);
        values.push(student.fullname);
      }
      if (student.email) {
        updateFields.push(`email = $${index++}`);
        values.push(student.email);
      }
      if (student.rol) {
        updateFields.push(`rol = $${index++}`);
        values.push(student.rol);
      }
      if (updateFields.length === 0) {
        logger.info('No hay campos para actualizar');
        const error: CustomError = new Error('No hay campos para actualizar');
        error.status = 400; // Bad Request
        error.details = 'Debe proporcionar al menos un campo para actualizar.';
        throw error;
      }

      // Agregamos el ID del estudiante para la condición WHERE
      values.push(student.id);
      const query = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = $${index}`;

      logger.info('Inicia proceso para actualizar el estudiante');

      // Verificamos si el ID del estudiante existe antes de actualizar
      const checkQuery = 'SELECT COUNT(*) FROM usuarios WHERE id = $1';
      const result = await pool.query(checkQuery, [student.id]);

      if (parseInt(result.rows[0].count) === 0) {
        logger.info(`No se encontró un estudiante con ID: ${student.id}`);
        const error: CustomError = new Error(
          `No se encontró un estudiante con ID: ${student.id}`,
        );
        error.status = 400;
        error.details = 'Debe proporcionar un ID valido.';
        throw error;
      }

      // Ejecutamos la consulta de actualización
      await pool.query(query, values);
      logger.info('Estudiante actualizado con éxito');
    } catch (error) {
      logger.error('Error actualizando estudiante: ' + error);
      throw error;
    }
  }

  async findByIdCheckout(id: number): Promise<boolean> {
    try {
      logger.info('Inicia proceso para obtener un estudiante');
      const result = await pool.query(
        'SELECT EXISTS(SELECT 1 FROM usuarios WHERE id = $1);',
        [id],
      );

      // Accede al valor booleano directamente
      const exists = result.rows[0].exists;

      if (!exists) {
        logger.info(`No se encontró el estudiante con el ID: ${id}`);
        return false;
      }

      logger.info(
        'Finaliza con éxito el proceso para obtener el estudiante por el ID',
      );
      return true;
    } catch (error) {
      logger.error('Error obteniendo el estudiante por su Id');
      throw error;
    }
  }
}
