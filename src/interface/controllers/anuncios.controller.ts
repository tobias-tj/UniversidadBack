import { validationResult } from 'express-validator';
import { GetAnuncios } from '../../usecases/anuncios/GetAnuncios';
import { logger } from '../../infrastructure/logger';
import { NextFunction, Request, Response } from 'express';
import { CreateAnuncio } from '../../usecases/anuncios/CreateAnuncio';
import { UpdateAnuncioById } from '../../usecases/anuncios/UpdateAnuncioById';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';

export class AnunciosController {
  constructor(
    private getTotalAnuncios: GetAnuncios,
    private createAnuncio: CreateAnuncio,
    private updateAnuncioStatus: UpdateAnuncioById,
  ) {}

  async getAllAnuncios(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      // Decodificar token
      const decoded = decodeToken(token);
      if (!decoded?.connectionDb) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      const anunciosList = await this.getTotalAnuncios.execute(
        decoded.connectionDb,
      );
      console.log(anunciosList);
      logger.info('Termina proceso para obtener anuncios');

      if (!anunciosList.length) {
        logger.info('No se encontraron anuncios sin ver');
        res.status(204).send(); // No Content
        return;
      }

      res.status(200).json({ data: anunciosList });
    } catch (error) {
      logger.error('Error en el controlador de anuncios', { error });
      next(error);
    }
  }

  // CreateAnuncios Sacar de Produccion.
  async createAnuncios(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      logger.info('Inicia proceso para crear un anuncio');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const anuncio = await this.createAnuncio.execute(req.body);
      logger.info('Anuncio creado con éxito');
      if (anuncio) {
        res.status(201).json({ data: 'Anuncio creado con Exito' });
      }
    } catch (error) {
      logger.error('Error creando anuncio', { error });
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
