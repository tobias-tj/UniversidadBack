import { validationResult, query } from 'express-validator';
import { logger } from '../../infrastructure/logger';
import { NextFunction, Request, Response } from 'express';
import { Login } from '../../usecases/admin_login/login';
import jwt from 'jsonwebtoken';
import { UpdatePassword } from '../../usecases/admin_login/updatePassword';
import { SECRET_KEY } from '../../domain/interfaces/middleware/jwtMiddleware';
import { GetUniversityList } from '../../usecases/admin_login/GetUniversityList';

export class AdminController {
  constructor(
    private auth: Login,
    private updatePass: UpdatePassword,
    private getUniList: GetUniversityList,
  ) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      logger.info('Inicia proceso para autenticar Administrador');
      // Obtener los datos del repositorio (sin cambiar el repositorio)
      const { idUniversidad, email, password } = req.body;

      logger.info(idUniversidad);
      logger.info(email);
      logger.info(password);

      const rawData = await this.auth.execute(idUniversidad, email, password);
      if (!rawData) {
        res
          .status(401)
          .json({ errors: [{ msg: 'Credenciales inválidas', path: 'auth' }] });
        return;
      }

      // Parsear los datos del repositorio
      const { connectionDb, user } = JSON.parse(rawData);

      logger.info('Connexion encontrada-->', connectionDb);

      // Crear el JWT firmado
      const token = jwt.sign(
        { connectionDb, user, idUniversidad },
        SECRET_KEY || '',
        {
          expiresIn: '4h',
        },
      );

      logger.info('Administrador autenticado con éxito');
      res.status(200).json({ token, user });
    } catch (error) {
      logger.error('Error al intentar autenticar administrador', { error });
      next(error);
    }
  }

  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      await this.updatePass.execute();
      res.status(200).json('Password cambiado exitosamente');
    } catch (error) {
      logger.error('Error al intentar autenticar administrador', { error });
      next(error);
    }
  }

  async getUniversity(req: Request, res: Response, next: NextFunction) {
    try {
      const universityList = await this.getUniList.execute();
      logger.info('Termina proceso para obtener universidades clientes');

      if (!universityList.length) {
        logger.info('No se encontraron universidades');
        res.status(200).send();
        return;
      }
      res.status(200).json({ data: universityList });
    } catch (error) {
      logger.error('Error al intentar obtener la lista de universidades', {
        error,
      });
      next(error);
    }
  }
}
