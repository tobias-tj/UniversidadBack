import { Student } from '../../domain/entities/Student';
import { StudentRepo } from '../../domain/interfaces/StudentRepo';
import { pool } from '../database/dbConnection';
import { logger } from '../logger';

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
  async findById(id: number): Promise<Student> {
    const student = this.student.find((student) => student.id === id);
    return student!;
  }
  async create(student: Student): Promise<Student> {
    this.student.push(student);
    return student;
  }
  async update(student: Student): Promise<void> {
    const index = this.student.findIndex((b) => b.id === student.id);
    if (index !== -1) {
      this.student[index] = student;
    }
  }
}
