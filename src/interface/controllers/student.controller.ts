import { NextFunction, Request, Response } from 'express';
import { GetAllEstudiantes } from '../../usecases/students/GetAllEstudiantes';
import { CustomError } from '../../domain/interfaces/middleware/errorHandler';

export class StudentController {
  constructor(private getAllEstudiantes: GetAllEstudiantes) {}

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const estudiantes = await this.getAllEstudiantes.execute();
      res.json(estudiantes);

      if (!estudiantes || estudiantes.length === 0) {
        const error: CustomError = new Error(
          'No se ha encontrado estudiantes!',
        );
        error.status = 404;
        return next(error);
      }
    } catch (error) {
      next(error);
    }
  }
}
