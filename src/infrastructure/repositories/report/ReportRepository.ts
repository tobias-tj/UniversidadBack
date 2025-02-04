import { ReportById } from '../../../domain/entities/ReportById';
import { ReportsRepo } from '../../../domain/interfaces/repositories/ReportsRepo';
import { reportMapperById } from '../../../mappers/ReportMapper';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ReportRepository implements ReportsRepo {
  async getAllReportByIdRelation(idRelacion: number): Promise<ReportById[]> {
    try {
      logger.info(
        'Inicia proceso para obtener todos los reportes según idRelacion',
      );

      const query = `
            SELECT 
                dominio_referencia,
                fecha_captura,
                imagenes_base64,
                score
            FROM 
                resumen_reportes
            WHERE 
                id_examenes_usuarios = $1;
          `;
      const result = await pool.query(query, [idRelacion]);

      if (result && result.rows.length > 0) {
        return result.rows.map(reportMapperById);
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
    }
  }

  async getAllReportPerDay(days:string): Promise<any> {
    try {
      logger.info(
        'Inicia proceso para obtener todos los reportes según idRelacion',
      );

      const query = `
              SELECT 
    SUM(CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END) AS examenes_con_reportes,
    SUM(CASE WHEN r.id IS NULL THEN 1 ELSE 0 END) AS examenes_sin_reportes
FROM examenes_usuarios e
LEFT JOIN reportes r ON e.id = r.created_id
WHERE r.fecha_captura >= NOW() - INTERVAL $1; 
          `;
      const result = await pool.query(query, [days]);

      if (result && result.rows.length > 0) {
        return result.rows;
      }

    } catch (error) {
      logger.error(
        'Error obteniendo el total de reportes',
        error,
      );
      throw error;
    }
  }
}
