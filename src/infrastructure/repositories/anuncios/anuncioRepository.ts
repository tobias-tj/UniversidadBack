import { AnuncioCreate } from '../../../domain/entities/AnuncioCreate';
import { Anuncios } from '../../../domain/entities/Anuncios';
import { AnuncioRepo } from '../../../domain/interfaces/repositories/AnuncioRepo';
import { pool } from '../../database/dbConnection';
import { DynamicDbQuery } from '../../database/DynamicQuery';
import { logger } from '../../logger';

export class AnuncioRepository implements AnuncioRepo {
  async getAnuncios(
    connectionDb: string,
    onlyUnread: boolean,
  ): Promise<Anuncios[]> {
    let dynamicQuery: DynamicDbQuery | null = null;
    try {
      logger.info('Inicia proceso para obtener los anuncios');

      dynamicQuery = new DynamicDbQuery(connectionDb);
      await dynamicQuery.initializePool();

      let query = 'SELECT * FROM Anuncios';
      if (onlyUnread) {
        query += ' WHERE visto = false';
      }

      const rows = await dynamicQuery.executeQuery(query);
      logger.info('Finaliza con éxito el proceso para obtener los anuncios');

      return rows || [];
    } catch (error) {
      logger.error('Error obteniendo los anuncios', { error });
      throw new Error('Error obteniendo los anuncios desde la base de datos');
    } finally {
      if (dynamicQuery) {
        await dynamicQuery.closePool();
        logger.info('DynamicQuery cerrado correctamente.');
      }
    }
  }
}
