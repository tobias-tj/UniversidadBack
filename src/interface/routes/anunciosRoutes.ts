import { Router, Request, Response, NextFunction } from 'express';
import { AnuncioRepository } from '../../infrastructure/repositories/anuncios/anuncioRepository';
import { AnunciosController } from '../controllers/anuncios.controller';
import { GetAnuncios } from '../../usecases/anuncios/GetAnuncios';
import { createAnuncioValidation } from '../../domain/interfaces/middleware/createAnuncioValidation';
import { CreateAnuncio } from '../../usecases/anuncios/CreateAnuncio';
import { updateAnunciosByIdValidation } from '../../domain/interfaces/middleware/updateAnuncioByIdValidation';
import { UpdateAnuncioById } from '../../usecases/anuncios/UpdateAnuncioById';

const router = Router();

const anuncioRepository = new AnuncioRepository();
const getAnuncio = new GetAnuncios(anuncioRepository);
const createAnuncio = new CreateAnuncio(anuncioRepository);
const updateAnuncio = new UpdateAnuncioById(anuncioRepository);

const anunciosController = new AnunciosController(
  getAnuncio,
  createAnuncio,
  updateAnuncio,
);

router.get(
  '/getAllAnuncios',
  (req: Request, res: Response, next: NextFunction) =>
    anunciosController.getAllAnuncios(req, res, next),
);

router.post(
  '/createAnuncio',
  [...createAnuncioValidation],
  (req: Request, res: Response, next: NextFunction) =>
    anunciosController.createAnuncios(req, res, next),
);

router.patch(
  '/updateStatusAnuncio',
  [...updateAnunciosByIdValidation],
  (req: Request, res: Response, next: NextFunction) =>
    anunciosController.updateAnunciosById(req, res, next),
);

export { router as anunciosRoutes };
