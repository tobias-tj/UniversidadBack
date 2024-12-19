import { ManageExamIncidentRepo } from '../../../domain/interfaces/repositories/ManageExamIncidentRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class ManageExamIncidentRepository implements ManageExamIncidentRepo {
  async createIncident(
    createId: number,
    incidentType: string,
    time: Date,
    screen: string,
  ): Promise<void> {
    try {
      logger.info(
        'Inicia proceso para registrar un incidente en la relación de examen y estudiante.',
      );

      const query = `
        INSERT INTO reportes (created_id, tipo_incidencia, fecha_captura, nueva_imagen_base64) 
      VALUES ($1, $2, $3, $4)
      `;
      await pool.query(query, [createId, incidentType, time, screen]);

      logger.info('Incidente registrado exitosamente.');
    } catch (error) {
      logger.error('Error al registrar el incidente:', error);
      throw new Error('No se pudo registrar el incidente.');
    }
  }
}
