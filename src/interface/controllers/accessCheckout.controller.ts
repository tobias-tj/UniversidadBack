import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { logger } from '../../infrastructure/logger';
import { GetStudentByIdCheckout } from '../../usecases/students/GetStudenByIdCheckout';
import { NextFunction, Request, Response } from 'express';

export class AccessCheckoutController {
  constructor(private findStudentByIdUseCase: GetStudentByIdCheckout) {}

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

      // Ahora puedes decodificar el token y obtener los datos que necesitas
      const decoded = decodeToken(token); // Utiliza tu función de decodificación aquí

      console.log(decoded);

      const studentExist = await this.findStudentByIdUseCase.execute(
        Number(decoded?.userId),
      );

      // console.log(studentExist);

      if (!studentExist) {
        res.status(200).json({
          isExist: false,
          moddleUrl: decoded!.moodleUrl,
        });
      }

      return res.status(200).json({
        isExist: true,
        moddleUrl: decoded!.moodleUrl,
      });
    } catch (error) {
      logger.info("Entro en tryCatch de AccessCheckout")
      next(error);
    }
  }
}
