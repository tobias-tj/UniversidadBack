import { Exam } from '../../../domain/entities/Exam';
import { ExamCount } from '../../../domain/entities/ExamCount';
import { ExamRepo } from '../../../domain/interfaces/repositories/ExamRepo';
import { pool } from '../../database/dbConnection';
import { DynamicDbQuery } from '../../database/DynamicQuery';
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

  // Obtener de una vez todos los count que tengan que ver con TotalExamenes, TotalExamenesIncident y TotalExamenesClean
  async getAllTotalExamCount(connectionDb: string): Promise<ExamCount> {
    let dynamicQuery: DynamicDbQuery | null = null;
    try {
      logger.info(
        'Inicia proceso para obtener el total de examenes, con incidencias y limpios',
      );

      // Crear conexión dinámica
      dynamicQuery = new DynamicDbQuery(connectionDb);
      await dynamicQuery.initializePool();

      const query = `
         WITH total_examenes_cte AS (
      SELECT COUNT(*) AS total_examenes
      FROM examenes
      )
      SELECT 
          (SELECT total_examenes FROM total_examenes_cte) AS total_examenes,
          COUNT(DISTINCT rr.id_examenes_usuarios) AS total_examenes_con_incidencias,
          (SELECT total_examenes FROM total_examenes_cte) - COUNT(DISTINCT rr.id_examenes_usuarios) AS total_examenes_sin_incidencias
      FROM 
          examenes e
      LEFT JOIN 
          examenes_usuarios eu ON e.id = eu.examen_id
      LEFT JOIN 
          resumen_reportes rr ON eu.id = rr.id_examenes_usuarios;
      `;
      const rows = await dynamicQuery.executeQuery(query);
      logger.info(
        'Finaliza con exitos el proceso para obtener el total de examenes de los diferentes tipos',
      );
      if (rows && rows.length > 0) {
        const row = rows[0];
        return {
          total_examenes: row.total_examenes,
          total_examenes_con_incidencias: row.total_examenes_con_incidencias,
          total_examenes_sin_incidencias: row.total_examenes_sin_incidencias,
        } as ExamCount;
      }
      return {
        total_examenes: '',
        total_examenes_con_incidencias: '',
        total_examenes_sin_incidencias: '',
      } as ExamCount;
    } catch (error) {
      logger.error('Error obteniendo total de examenes de diferentes tipos');
      throw error;
    }
  }

  //-- para obtener usuarios por examenes
  async getListStudentByExamId(
    examId: number,
    connectionDb: string,
  ): Promise<any[]> {
    try {
      let dynamicQuery: DynamicDbQuery | null = null;

      dynamicQuery = new DynamicDbQuery(connectionDb);
      await dynamicQuery.initializePool();

      const rows = await dynamicQuery.executeQuery(
        `
        select
        u.nombre,
        u.id ,
        e.fecha ,
        eu.id as idrelacion,
        e.descripcion,
        eu.examen_id as examenid,
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
        u.id , e.fecha, eu.id, e.descripcion, eu.examen_id;
      `,
        [examId],
      );
      return rows ?? [];
    } catch (error) {
      logger.error(
        'Error obteniendo exámenes por el id del examen con incidencias: ' +
          error,
      );
      throw error;
    }
  }

  async getAllListExamInfo(connectionDb: string): Promise<any[]> {
    try {
      let dynamicQuery: DynamicDbQuery | null = null;

      dynamicQuery = new DynamicDbQuery(connectionDb);
      await dynamicQuery.initializePool();

      const rows = await dynamicQuery.executeQuery(
        `
        SELECT 
          id, 
          descripcion, 
          fecha
        FROM 
          examenes;
        `,
      );

      return rows ?? [];
    } catch (error) {
      logger.error('Error obteniendo exámenes: ' + error);
      throw error;
    }
  }
}
