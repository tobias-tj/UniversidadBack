import { validationResult } from 'express-validator';
import { GetAnuncios } from '../../usecases/anuncios/GetAnuncios';
import { logger } from '../../infrastructure/logger';
import { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';

export class AnunciosController {
  constructor(private getTotalAnuncios: GetAnuncios) {}

  async getAllAnuncios(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const onlyUnread = req.query.onlyUnread === 'true'; // Extraer la bandera como booleano
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      // Decodificar token
      const decoded = decodeToken(token);
      if (!decoded?.connectionDb) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      // Obtener anuncios según la bandera
      const anunciosList = await this.getTotalAnuncios.execute(
        decoded.connectionDb,
        onlyUnread, // Pasar la bandera al servicio
      );

      console.log(anunciosList);
      logger.info('Termina proceso para obtener anuncios');

      // Conteo de anuncios
      const totalNotifications = anunciosList.length;
      const unreadNotifications = anunciosList.filter(
        (anuncio: any) => !anuncio.read,
      ).length;

      if (!anunciosList.length) {
        logger.info('No se encontraron anuncios');
        res.status(204).send(); // No Content
        return;
      }

      // Respuesta con datos y conteo
      res.status(200).json({
        data: anunciosList,
        count: {
          totalNotifications,
          unreadNotifications,
        },
      });
    } catch (error) {
      logger.error('Error en el controlador de anuncios', { error });
      next(error);
    }
  }
}
