import { ReportById } from '../../../domain/entities/ReportById';
import { ReportDay } from '../../../domain/entities/ReportDay';
import { ReportMonth } from '../../../domain/entities/ReportMonth';
import { ReportsRepo } from '../../../domain/interfaces/repositories/ReportsRepo';
import { mapearDatosReport } from '../../../mappers/ReportDayMapper';
import { reportMapperById } from '../../../mappers/ReportMapper';
import { mapearDatosReportMonth } from '../../../mappers/ReportMonthMapper';
import { pool } from '../../database/dbConnection';
import { DynamicDbQuery } from '../../database/DynamicQuery';
import { logger } from '../../logger';

export class ReportRepository implements ReportsRepo {
  async getAllReportByIdRelation(
    idRelacion: number,
    connectionDb: string,
  ): Promise<ReportById[]> {
    let dynamicQuery: DynamicDbQuery | null = null;

    try {
      logger.info(
        'Inicia proceso para obtener todos los reportes según idRelacion',
      );
      // Crear conexión dinámica
      dynamicQuery = new DynamicDbQuery(connectionDb);
      await dynamicQuery.initializePool();

      const query = `
           SELECT 
            r.dominio_referencia,
            r.fecha_captura,
            r.score,
            COALESCE(
              (
                  SELECT ARRAY_AGG(rp.imagenes_base64)
                  FROM reportes rp
                  WHERE rp.created_id = r.id_examenes_usuarios
              ), '{}'::TEXT[]
              ) AS imagenes_base64
            FROM resumen_reportes r
            WHERE r.id_examenes_usuarios = $1
            LIMIT 20;
          `;
      const rows = await dynamicQuery.executeQuery(query, [idRelacion]);

      if (rows && rows.length > 0) {
        return rows.map(reportMapperById);
      }

      logger.warn(
        `No se encontraron reportes para el idRelacion: ${idRelacion}`,
      );
      return [];
    } catch (error) {
      logger.error(
        'Error obteniendo el total de reportes para este idRelacion',
        error,
      );
      throw error;
    } finally {
      if (dynamicQuery) {
        await dynamicQuery.closePool();
        logger.info('DynamicQuery cerrado correctamente.');
      }
    }
  }

  async getAllReportPerDay(days: string): Promise<any> {
    try {
      logger.info('Inicia proceso para obtener count de reportes');

      const query = `
              SELECT 
    SUM(CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END) AS examenes_con_reportes,
    SUM(CASE WHEN r.id IS NULL THEN 1 ELSE 0 END) AS examenes_sin_reportes
FROM examenes_usuarios e
LEFT JOIN reportes r ON e.id = r.created_id
WHERE r.fecha_captura >= NOW() - INTERVAL '${days} days';
          `;
      const result = await pool.query(query);

      if (result && result.rows.length > 0) {
        return result.rows;
      }
    } catch (error) {
      logger.error('Error obteniendo el total de reportes', error);
      throw error;
    }
  }

  async getReportDays(connectionDb: string): Promise<ReportDay> {
    let dynamicQuery: DynamicDbQuery | null = null;
    try {
      logger.info('Inicia proceso para obtener los reportes por dia');
      // Crear conexión dinámica
      dynamicQuery = new DynamicDbQuery(connectionDb);
      await dynamicQuery.initializePool();

      const query = `
          SELECT 
              TO_CHAR(dia, 'FMDay') AS dia_semana,
              TO_CHAR(dia, 'DD/MM/YYYY') AS fecha,
              COUNT(DISTINCT r.created_id) AS examenes_con_reportes,
              COUNT(e.id) - COUNT(DISTINCT r.created_id) AS examenes_sin_reportes
          FROM (
              SELECT generate_series(
                  CURRENT_DATE - INTERVAL '6 days',
                  CURRENT_DATE,
                  INTERVAL '1 day'
              )::date AS dia
          ) dias
          LEFT JOIN examenes_usuarios e 
              ON e.inicio_examen::date = dias.dia
          LEFT JOIN reportes r 
              ON r.created_id = e.id
          GROUP BY dia
          ORDER BY dia;
        `;

      const result = await dynamicQuery.executeQuery(query);
      if (!result || result.length === 0) {
        logger.warn('No se encontraron datos de reportes en la última semana.');
        return new ReportDay([]);
      }

      const reportDays = mapearDatosReport(result);

      return reportDays;
    } catch (error) {
      logger.error('Error obteniendo los dias con sus incidencias', error);
      throw error;
    }
  }

  async getReportMonths(connectionDb: string): Promise<ReportMonth> {
    let dynamicQuery: DynamicDbQuery | null = null;
    try {
      logger.info('Inicia proceso para obtener los reportes por mes');
      // Crear conexión dinámica
      dynamicQuery = new DynamicDbQuery(connectionDb);
      await dynamicQuery.initializePool();
      const query = `
        SELECT 
          TO_CHAR(mes.mes, 'TMMonth') AS mes,
          TO_CHAR(mes.mes, 'MM/YYYY') AS mes_anio,
          COUNT(r.id) AS examenes_con_reportes,
          COUNT(eu.id) - COUNT(r.id) AS examenes_sin_reportes
        FROM (
          SELECT date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' * gs.i AS mes
          FROM generate_series(0, 11) AS gs(i)
        ) mes
        LEFT JOIN examenes_usuarios eu
          ON date_trunc('month', eu.inicio_examen) = mes.mes
        LEFT JOIN reportes r
          ON r.created_id = eu.id
        GROUP BY mes.mes
        ORDER BY mes.mes;
      `;

      const result = await dynamicQuery.executeQuery(query);
      if (!result || result.length === 0) {
        logger.warn(
          'No se encontraron datos de reportes en los últimos 12 meses.',
        );
        return new ReportMonth([]);
      }

      const reportMonths = mapearDatosReportMonth(result);

      return reportMonths;
    } catch (error) {
      logger.error('Error obteniendo los meses con sus incidencias', error);
      throw error;
    }
  }
}
