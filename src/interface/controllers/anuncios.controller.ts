import { validationResult } from 'express-validator';
import { GetAnuncios } from '../../usecases/anuncios/GetAnuncios';
import { logger } from '../../infrastructure/logger';
import { NextFunction, Request, Response } from 'express';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { UpdateAnuncioById } from '../../usecases/anuncios/UpdateAnuncioById';

export class AnunciosController {
  constructor(
    private getTotalAnuncios: GetAnuncios,
    private updateAnuncioStatus: UpdateAnuncioById,
  ) {}

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

  async updateAnunciosById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      logger.info('Inicia proceso para cambiar status de visto del anuncio');
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(401).json({ error: 'Token no proporcionado' });
        return;
      }

      // Decodificar token
      const decoded = decodeToken(token);
      if (!decoded?.connectionDb) {
        res.status(401).json({ error: 'Token inválido' });
        return;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const anuncioStatus = await this.updateAnuncioStatus.execute(
        req.body.id,
        decoded.connectionDb,
      );
      logger.info('Anuncio actualizado con exito');
      if (anuncioStatus) {
        res.status(200).json({ data: 'Anuncio actualizado con Exito' });
      } else {
        res
          .status(200)
          .json({ data: 'No se ha encontrado el anuncio solicitado' });
      }
    } catch (error) {
      logger.error('Error actualizando el anuncio', { error });
      next(error);
    }
  }
}
