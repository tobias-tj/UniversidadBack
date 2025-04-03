import { ManageExamIncidentRepo } from '../../../domain/interfaces/repositories/ManageExamIncidentRepo';
import { pool } from '../../database/dbConnection';
import { DynamicDbQuery } from '../../database/DynamicQuery';
import { logger } from '../../logger';

export class ManageExamIncidentRepository implements ManageExamIncidentRepo {
  async createIncident(
    createId: number,
    incidentType: string,
    time: Date,
    img: string,
    connectionDb: string,
  ): Promise<void> {
    let dynamicQuery: DynamicDbQuery | null = null;
    try {
      logger.info(
        'Inicia proceso para registrar un incidente en la relación de examen y estudiante.',
      );
      // Crear conexión dinámica
      dynamicQuery = new DynamicDbQuery(connectionDb);
      await dynamicQuery.initializePool();

      const query = `
        INSERT INTO reportes (created_id, tipo_incidencia, fecha_captura, imagenes_base64) 
      VALUES ($1, $2, $3, $4)
      `;
      await dynamicQuery.executeQuery(query, [
        createId,
        incidentType,
        time,
        img,
      ]);

      logger.info('Incidente registrado exitosamente.');
    } catch (error) {
      logger.error('Error al registrar el incidente:', error);
      throw new Error('No se pudo registrar el incidente.');
    } finally {
      if (dynamicQuery) {
        await dynamicQuery.closePool();
        logger.info('DynamicQuery cerrado correctamente.');
      }
    }
  }
}
