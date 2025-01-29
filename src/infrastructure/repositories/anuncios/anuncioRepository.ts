import { AnuncioCreate } from '../../../domain/entities/AnuncioCreate';
import { Anuncios } from '../../../domain/entities/Anuncios';
import { AnuncioRepo } from '../../../domain/interfaces/repositories/AnuncioRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class AnuncioRepository implements AnuncioRepo {
  async getAnuncios(): Promise<Anuncios[]> {
    try {
      logger.info('Inicia proceso para obtener los anuncios');
      const query = `SELECT * FROM Anuncios`;
      const result = await pool.query(query);
      console.log('Ingresando para ver los anuncios', result);
      logger.info('Finaliza con éxito el proceso para obtener los anuncios');

      return result.rows || [];
    } catch (error) {
      logger.error('Error obteniendo los anuncios', { error });
      throw new Error('Error obteniendo los anuncios desde la base de datos');
    }
  }

  async createAnuncio(data: AnuncioCreate): Promise<boolean> {
    try {
      logger.info('Inicia proceso para crear un anuncio');
      console.log(data);

      const query = `
          INSERT INTO anuncios (titulo, descripcion, visto, fecha)
          VALUES ($1, $2, $3, NOW())`; // Aquí usamos NOW() directamente como valor
      const values = [data.title, data.description, data.visto || false];
      await pool.query(query, values);
      logger.info('Anuncio creado con éxito');
      return true;
    } catch (error) {
      logger.error('Error creando el anuncio', { error });
      throw new Error('Error creando el anuncio en la base de datos');
    }
  }

  async updateAnuncioById(id: number): Promise<boolean> {
    try {
      logger.info(`Inicia proceso para actualizar el anuncio con ID: ${id}`);

      const query = `
            UPDATE anuncios
            SET visto = true
            WHERE id = $1`;
      const values = [id];

      const result = await pool.query(query, values);

      if (result.rowCount === 0) {
        logger.warn(`No se encontró ningún anuncio con ID: ${id}`);
        return false;
      }

      logger.info(`Anuncio con ID: ${id} actualizado con éxito`);
      return true;
    } catch (error) {
      logger.error('Error actualizando el anuncio', { error });
      throw new Error('Error actualizando el anuncio en la base de datos');
    }
  }
}
