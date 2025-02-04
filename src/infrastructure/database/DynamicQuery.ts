import { Pool } from 'pg';
import { logger } from '../logger';

export class DynamicDbQuery {
  private pool: Pool | null = null;

  constructor(private connectionString: string) {}

  /**
   * Initializes the dynamic pool with the provided connection string.
   */
  async initializePool(): Promise<void> {
    try {
      this.pool = new Pool({
        connectionString: this.connectionString,
        ssl: {
          rejectUnauthorized: false, // Adjust SSL settings as needed
        },
      });

      this.pool.on('error', (err) => {
        logger.error('Error en el dynamicPool:', err.message);
      });

      await this.pool.query("SET TIME ZONE 'America/Asuncion';");
      logger.info('Dynamic pool initialized successfully.');
    } catch (error: any) {
      logger.error(`Error initializing dynamic pool: ${error.message}`);
      throw error;
    }
  }

  /**
   * Executes a query on the dynamic pool.
   * @param query - The SQL query to execute.
   * @param values - The parameters for the query.
   * @returns The result of the query.
   */
  async executeQuery(query: string, values: any[] = []): Promise<any> {
    if (!this.pool) {
      throw new Error('Dynamic pool is not initialized.');
    }

    try {
      logger.info(`Executing query: ${query}`);
      const result = await this.pool.query(query, values);
      return result.rows;
    } catch (error: any) {
      logger.error(`Error executing query: ${error.message}`);
      throw error;
    }
  }

  /**
   * Closes the dynamic pool.
   */
  async closePool(): Promise<void> {
    if (this.pool) {
      try {
        await this.pool.end();
        logger.info('Dynamic pool closed successfully.');
      } catch (error: any) {
        logger.error(`Error closing dynamic pool: ${error.message}`);
      }
    }
  }
}