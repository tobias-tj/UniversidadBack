import { ReportResume } from '../../../domain/entities/ReportResume';
import { CustomError } from '../../../domain/interfaces/middleware/errorHandler';
import { DashboardRepo } from '../../../domain/interfaces/repositories/DashboardRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';
import { IncidentsCount } from '../../../domain/entities/IncidentsCount';
import { newStudent } from '../../../domain/entities/newStudent';
import { DynamicDbQuery } from '../../database/DynamicQuery';

export class DashboardRepository implements DashboardRepo {
  async getStudentIncident(
    connectionDb: string,
    isCount?: boolean,
  ): Promise<newStudent[]> {
    let dynamicQuery: DynamicDbQuery | null = null;

    try {
      logger.info('Inicia proceso para obtener un estudiante');
      // Crear conexión dinámica
      dynamicQuery = new DynamicDbQuery(connectionDb);
      await dynamicQuery.initializePool();

      let sql = '';
      if (isCount === true) {
        sql =
          'SELECT COUNT(DISTINCT id_examenes_usuarios) AS unique_examen_count FROM resumen_reportes';
      } else {
        sql = `select 
                u.nombre, 
                u.id as ci, 
                u.email as correo 
                from usuarios u 
                where u.rol = 'EST'
                order by u.id desc;`;
      }
      const rows = await dynamicQuery.executeQuery(sql);
      logger.info(
        'Finaliza con éxito el proceso para obtener estudiantes sin incidencias',
      );
      return rows ? rows : [];
    } catch (error) {
      logger.error('Error obteniendo el estudiantes sin incidencias');
      throw error;
    }
  }

  async getIncidentsByStudentId(
    connectionDb: string,
    id: String,
  ): Promise<ReportResume[]> {
    let dynamicQuery: DynamicDbQuery | null = null;
    try {
      logger.info('Inicia proceso para obtener un estudiante');
      // Crear conexión dinámica
      dynamicQuery = new DynamicDbQuery(connectionDb);
      await dynamicQuery.initializePool();
      // let sql = `SELECT * FROM resumen_reportes WHERE id_examenes_usuarios = ${id}`;
      let sql = `select
      eu.examen_id,
      e.descripcion ,
      e.fecha ,
      eu.id as idrelacion,
      sum(rr.score) as puntos
      from examenes_usuarios eu 
      join usuarios u 
      on u.id  = eu.estudiante_id 
      join examenes e 
      on e.id = eu.examen_id 
      join resumen_reportes rr 
      on eu.id = rr.id_examenes_usuarios
      where u.id=${id}
      group by 
      eu.examen_id, e.descripcion, e.fecha,  eu.id;`;
      const rows = await dynamicQuery.executeQuery(sql);
      logger.info(
        'Finaliza con éxito el proceso para obtener datos de estudiante por examen',
      );
      return rows ? rows : [];
    } catch (error) {
      logger.error('Error obteniendo datos de estudiante por examen');
      throw error;
    }
  }

  // Averiguar porque estos dos de aqui son iguales
  async getAllStudentsIncidents(): Promise<ReportResume[]> {
    try {
      logger.info('Inicia proceso para obtener un estudiante');
      const query = `
      SELECT 
    COUNT(DISTINCT e.id) AS total_estudiantes,
    COUNT(DISTINCT rr.id_examenes_usuarios) AS total_estudiantes_con_incidencias,
    COUNT(DISTINCT e.id) - COUNT(DISTINCT rr.id_examenes_usuarios) AS total_estudiantes_sin_incidencias
FROM 
    examenes e
LEFT JOIN 
    examenes_usuarios eu ON e.id = eu.examen_id
LEFT JOIN 
    resumen_reportes rr ON eu.id = rr.id_examenes_usuarios
    `;
      const result = await pool.query(query);
      logger.info(
        'Finaliza con éxito el proceso para obtener datos de estudiante por examen',
      );
      return result ? result.rows : [];
    } catch (error) {
      logger.error('Error obteniendo datos de estudiante por examen');
      throw error;
    }
  }

  async getAllStudentsCount(connectionDb: string): Promise<IncidentsCount> {
    let dynamicQuery: DynamicDbQuery | null = null;

    try {
      logger.info('Inicia proceso para obtener un estudiante');
      // Crear conexión dinámica
      dynamicQuery = new DynamicDbQuery(connectionDb);
      await dynamicQuery.initializePool();

      const query = `
  WITH total_estudiantes_cte AS (
  SELECT COUNT(*) AS total_estudiantes
  FROM usuarios
  ),
  estudiantes_rindieron_cte AS (
      SELECT DISTINCT estudiante_id
      FROM examenes_usuarios
  ),
  estudiantes_con_incidencias_cte AS (
      SELECT DISTINCT eu.estudiante_id
      FROM examenes_usuarios eu
      INNER JOIN resumen_reportes rr ON eu.id = rr.id_examenes_usuarios
  )
  SELECT 
      (SELECT total_estudiantes FROM total_estudiantes_cte) AS total_estudiantes,
      COUNT(DISTINCT eci.estudiante_id) AS total_estudiantes_con_incidencias,
      COUNT(DISTINCT er.estudiante_id) - COUNT(DISTINCT eci.estudiante_id) AS total_estudiantes_sin_incidencias
  FROM 
      estudiantes_rindieron_cte er
  LEFT JOIN 
      estudiantes_con_incidencias_cte eci ON er.estudiante_id = eci.estudiante_id;
    `;
      const rows = await dynamicQuery.executeQuery(query);

      if (!rows || rows.length === 0) {
        logger.warn('La consulta no devolvió resultados');
        return {
          total_estudiantes: '',
          total_estudiantes_con_incidencias: '',
          total_estudiantes_sin_incidencias: '',
        } as IncidentsCount;
      }

      const row = rows[0];
      const response: IncidentsCount = {
        total_estudiantes: row.total_estudiantes || 0,
        total_estudiantes_con_incidencias:
          row.total_estudiantes_con_incidencias || 0,
        total_estudiantes_sin_incidencias:
          row.total_estudiantes_sin_incidencias || 0,
      };

      logger.info('Proceso completado con éxito. Resultados:', response);
      return response;
    } catch (error) {
      logger.error('Error obteniendo datos de estudiante por examen');
      throw error;
    } finally {
      if (dynamicQuery) {
        await dynamicQuery.closePool();
      }
    }
  }
}
