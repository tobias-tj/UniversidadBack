import { Router, Request, Response, NextFunction } from 'express';
import { AnuncioRepository } from '../../infrastructure/repositories/anuncios/anuncioRepository';
import { AnunciosController } from '../controllers/anuncios.controller';
import { GetAnuncios } from '../../usecases/anuncios/GetAnuncios';

const router = Router();

const anuncioRepository = new AnuncioRepository();
const getAnuncio = new GetAnuncios(anuncioRepository);

const anunciosController = new AnunciosController(getAnuncio);

router.get(
  '/getAllAnuncios',
  (req: Request, res: Response, next: NextFunction) =>
    anunciosController.getAllAnuncios(req, res, next),
);

export { router as anunciosRoutes };
