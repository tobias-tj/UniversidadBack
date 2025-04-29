import {
  decodeToken,
  generateToken,
} from '../../domain/interfaces/middleware/jwtMiddleware';
import { logger } from '../../infrastructure/logger';
import { GetStudentByIdCheckout } from '../../usecases/students/GetStudenByIdCheckout';
import { NextFunction, Request, Response } from 'express';
import { Login } from '../../usecases/admin_login/login';

export class AccessCheckoutController {
  constructor(
    private findStudentByIdUseCase: GetStudentByIdCheckout,
    private auth: Login,
  ) {}

  async handleAccessCheckoutProcess(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // Obtener el token del encabezado de autorización
      const authHeader = req.headers.authorization;

      const token =
        authHeader && authHeader.startsWith('Bearer ')
          ? authHeader.substring(7) // Eliminar 'Bearer ' y obtener el token
          : null;

      if (!token) {
        return res.status(401);
      }

      const decoded = decodeToken(token);

      console.log(decoded);

      if (
        !decoded?.idUniversidad ||
        !decoded?.emailAdmin ||
        !decoded?.passAdmin
      ) {
        return res
          .status(401)
          .json({ error: 'Error autenticando Token, faltan datos' });
      }

      const authData = await this.auth.execute(
        decoded.idUniversidad,
        decoded.emailAdmin,
        decoded.passAdmin,
      );

      if (!authData) {
        return res.status(401).json({
          errors: [
            {
              msg: 'Credenciales inválidas o falta connectionDb',
              path: 'auth',
            },
          ],
        });
      }

      const { connectionDb, user, proctorType } = JSON.parse(authData);

      console.warn(connectionDb);

      // Crear un nuevo token con los datos originales más la nuaeva información
      const newTokenData = {
        ...decoded,
        connectionDb: connectionDb,
      };

      // Generar un nuevo token con los datos completos
      const newToken = generateToken(newTokenData);

      const studentExist = await this.findStudentByIdUseCase.execute(
        Number(decoded?.userId),
        connectionDb,
      );

      if (!studentExist) {
        res.status(200).json({
          isExist: false,
          moddleUrl: decoded!.moodleUrl,
          token: newToken,
          proctorType: proctorType,
        });
      }

      return res.status(200).json({
        isExist: true,
        moddleUrl: decoded!.moodleUrl,
        token: newToken,
        proctorType: proctorType,
      });
    } catch (error) {
      logger.info('Entro en tryCatch de AccessCheckout');
      next(error);
    }
  }
}
