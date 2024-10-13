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
      const { userId } = req.query;

      const studentExist = await this.findStudentByIdUseCase.execute(
        Number(userId),
      );

      console.log(studentExist);

      if (!studentExist) {
        res.status(200).json({
          idUsuario: userId,
          isExist: false,
        });
      }

      return res.status(200).json({
        idUsuario: userId,
        isExist: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
