import { validationResult, query } from 'express-validator';
import { logger } from '../../infrastructure/logger';
import { NextFunction, Request, Response } from 'express';
import { Login } from '../../usecases/admin_login/login';

export class AdminController {
  constructor(
    private auth: Login
  ) {}

  async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      logger.info('Inicia proceso para autenticar Administrador');
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
      const JWT = await this.auth.execute(req.query.idUniversidad as unknown as number, req.query.user as string, req.query.password as string);
      logger.info('Administrador autenticado con exito');
      if (JWT) {
        res.status(200).json({ data: JWT });
      } else {
        res
          .status(200)
          .json({ data: 'No se ha encontrado el usuario' });
      }
    } catch (error) {
      logger.error('Error al intentar autenticar administrador', { error });
      next(error);
    }
  }
}
