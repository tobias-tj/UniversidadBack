import { validationResult, query } from 'express-validator';
import { logger } from '../../infrastructure/logger';
import { NextFunction, Request, Response } from 'express';
import { Login } from '../../usecases/admin_login/login';
import jwt from 'jsonwebtoken';

export class AdminController {
  constructor(private auth: Login) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      logger.info('Inicia proceso para autenticar Administrador');
      // Obtener los datos del repositorio (sin cambiar el repositorio)
      const { idUniversidad, email, password } = req.body;

      const rawData = await this.auth.execute(idUniversidad, email, password);

      if (!rawData) {
        res
          .status(401)
          .json({ errors: [{ msg: 'Credenciales inválidas', path: 'auth' }] });
        return;
      }

      // Parsear los datos del repositorio
      const { connectionDb, user } = JSON.parse(rawData);

      // Crear el JWT firmado
      const token = jwt.sign(
        { connectionDb, user },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: '1h' },
      );

      logger.info('Administrador autenticado con éxito');
      res.status(200).json({ token, user });
    } catch (error) {
      logger.error('Error al intentar autenticar administrador', { error });
      next(error);
    }
  }
}
