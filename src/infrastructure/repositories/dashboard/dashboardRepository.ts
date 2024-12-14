import { ReportResume } from '../../../domain/entities/ReportResume';
import { CustomError } from '../../../domain/interfaces/middleware/errorHandler';
import { DashboardRepo } from '../../../domain/interfaces/repositories/DashboardRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';
import { IncidentsCount } from '../../../domain/entities/IncidentsCount';

export class DashboardRepository implements DashboardRepo {
  async getStudentIncident(isCount?: boolean): Promise<ReportResume[]> {
    try {
      logger.info('Inicia proceso para obtener un estudiante');
      let sql = '';
      if (isCount === true) {
        sql =
          'SELECT COUNT(DISTINCT id_examenes_usuarios) AS unique_examen_count FROM resumen_reportes';
      } else {
        sql = 'SELECT * FROM resumen_reportes';
      }
      const result = await pool.query(sql);
      logger.info(
        'Finaliza con éxito el proceso para obtener estudiantes sin incidencias',
      );
      return result ? result.rows : [];
    } catch (error) {
      logger.error('Error obteniendo el estudiantes sin incidencias');
      throw error;
    }
  }

  async getIncidentsByExamId(id: String): Promise<ReportResume[]> {
    try {
      logger.info('Inicia proceso para obtener un estudiante');
      let sql = `SELECT * FROM resumen_reportes WHERE id_examenes_usuarios = ${id}`;
      const result = await pool.query(sql);
      logger.info(
        'Finaliza con éxito el proceso para obtener datos de estudiante por examen',
      );
      return result ? result.rows : [];
    } catch (error) {
      logger.error('Error obteniendo datos de estudiante por examen');
      throw error;
    }
  }

  async getAllStudentsIncidents(): Promise<ReportResume[]>{
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

  async getAllStudentsCount(): Promise<IncidentsCount> {
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
      if (result && result.rows.length > 0) {
        const row = result.rows[0];
        return {
          total_estudiantes: row.total_estudiantes,
          total_estudiantes_con_incidencias:
            row.total_estudiantes_con_incidencias,
          total_estudiantes_sin_incidencias:
            row.total_estudiantes_sin_incidencias,
        } as IncidentsCount;
      }
      return {
        total_estudiantes: '',
        total_estudiantes_con_incidencias: '',
        total_estudiantes_sin_incidencias: '',
      } as IncidentsCount;
    } catch (error) {
      logger.error('Error obteniendo datos de estudiante por examen');
      throw error;
    }
  }
}
