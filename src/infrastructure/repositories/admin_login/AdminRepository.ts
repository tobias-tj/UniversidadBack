import { AdminRepo } from '../../../domain/interfaces/repositories/AdminRepo';
import { pool } from '../../database/dbConnection';
import { logger } from '../../logger';

export class AdminRepository implements AdminRepo {


  async login(idUniversidad: number, user: string, password: string): Promise<String | undefined> {
    try {
      const query = 'SELECT connectiondb FROM universidades WHERE id_universidad = $1 ';
      const values = [idUniversidad];
      const result = await pool.query(query, values);

      if (result) {
          const query2 = "SELECT user FROM usuarios WHERE rol = 'ADMIN' AND username = $1 AND password = $2"
          const valores = [user, password];
          const JWTResult = await pool.query(query2, valores);
          const data = {
            connectionDb: result.rows,
            user: user,
          }
          if(JWTResult){
            return JSON.stringify(data);
          }
      }else{
        logger.error("Usuario Administrador no encontrado, AdminRepository")
      }
    } catch (error) {
      logger.error('Error logeando usuario administrador');
      throw error;
    }
  }

}
