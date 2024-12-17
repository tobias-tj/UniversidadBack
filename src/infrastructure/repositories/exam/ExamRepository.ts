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

  async getExamCount(): Promise<number> {
    try {
      const result = await pool.query(
        'SELECT COUNT(*) AS total FROM examenes;',
      );
      return parseInt(result.rows[0].total, 10);
    } catch (error) {
      logger.error('Error obteniendo la cantidad total de exámenes: ' + error);
      throw error;
    }
  }

  async filterExams(filters: any) {
    // Inicializar arrays para condiciones y valores
    const conditions: string[] = [];
    const values: any[] = [];

    // Agregar filtros por rango de fechas
    if (filters.fechaInicio) {
      conditions.push(`fecha >= $${values.length + 1}`);
      values.push(filters.fechaInicio);
    }

    if (filters.fechaFin) {
      conditions.push(`fecha <= $${values.length + 1}`);
      values.push(filters.fechaFin);
    }

    // Agregar búsqueda por descripción
    if (filters.search) {
      conditions.push(`descripcion ILIKE $${values.length + 1}`);
      values.push(`%${filters.search}%`);
    }

    // Construir consulta dinámica
    const query = `
      SELECT * 
      FROM examenes 
      ${conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''} 
      ORDER BY ${filters.sortBy || 'fecha'} ${filters.order === 'desc' ? 'DESC' : 'ASC'}
    `;

    // Imprimir la consulta generada para depuración
    console.log('Generated Query:', query);
    console.log('Query Values:', values);

    // Ejecutar consulta
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      logger.error('Error filtrando exámenes: ' + error);
      throw error;
    }
  }

  async getCleanExamsCount(): Promise<number> {
    try {
      // Consulta para obtener la cantidad de exámenes sin incidencias
      const countResult = await pool.query(`
        SELECT COUNT(*) AS total
        FROM examenes e
        LEFT JOIN examenes_usuarios eu ON e.id = eu.examen_id
        LEFT JOIN resumen_reportes rr ON eu.id = rr.id_examenes_usuarios
        WHERE rr.id IS NULL;
      `);
      return parseInt(countResult.rows[0].total, 10);
    } catch (error) {
      logger.error(
        'Error obteniendo la cantidad de exámenes limpios: ' + error,
      );
      throw error;
    }
  }

  async getExamsWithIncidents(): Promise<any[]> {
    try {
      const result = await pool.query(`
        SELECT e.id, e.descripcion, e.fecha, COUNT(rr.id) AS incidencias
        FROM examenes e
        LEFT JOIN examenes_usuarios eu ON e.id = eu.examen_id
        LEFT JOIN resumen_reportes rr ON eu.id = rr.id_examenes_usuarios
        WHERE rr.id IS NOT NULL
        GROUP BY e.id, e.descripcion, e.fecha
        ORDER BY e.id ASC;
      `);
      return result.rows;
    } catch (error) {
      logger.error('Error obteniendo exámenes con incidencias: ' + error);
      throw error;
    }
  }

  // este deberia de ser getListStudentByExamId
  //-- para obtener usuarios por examenes
  async getListStudentByExamId(examId: number): Promise<any[]> {
    try {
      const result = await pool.query(
        `
        select
        u.nombre,
        u.id ,
        e.fecha ,
        sum(rr.score) as puntos
        from examenes_usuarios eu 
        join usuarios u 
        on u.id  = eu.estudiante_id 
        join examenes e 
        on e.id = eu.examen_id 
        join resumen_reportes rr 
        on eu.id = rr.id_examenes_usuarios
        where e.id= $1
        group by 
        u.nombre,
        u.id , e.fecha;
      `,
        [examId],
      );
      return result.rows;
    } catch (error) {
      logger.error(
        'Error obteniendo exámenes por el id del examen con incidencias: ' +
          error,
      );
      throw error;
    }
  }

  async getAllListExamInfo(): Promise<any[]> {
    try {
      const result = await pool.query(
        `
        SELECT 
          id, 
          descripcion, 
          fecha
        FROM 
          examenes;
        `,
      );

      return result.rows;
    } catch (error) {
      logger.error('Error obteniendo exámenes: ' + error);
      throw error;
    }
  }
}
