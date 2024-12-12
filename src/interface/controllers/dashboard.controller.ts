import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../../infrastructure/logger';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { StudentFindAll } from '../../usecases/students/StudentFindAll';
import { GetStudentIncident } from '../../usecases/students/getStudentIncident';

export class dashboardController {
  constructor(
    private studentFindAll: StudentFindAll,
    private StudentIncident: GetStudentIncident
  ) {}

  async getAllStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const studentList = await this.studentFindAll.execute();
      logger.info('Estudiantes encontrados' + studentList);
      return res.status(200).json({
        message: 'Estudiantes encontrados',
        data: studentList
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const studentList = await this.StudentIncident.execute();
      logger.info('Estudiantes encontrados' + studentList);
      return res.status(200).json({
        message: 'Estudiantes encontrados',
        data: studentList
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentClean(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const studentList = await this.studentFindAll.execute();
      logger.info('Estudiantes encontrados' + studentList);
      return res.status(200).json({
        message: 'Estudiantes encontrados',
        data: studentList
      });
    } catch (error) {
      next(error);
    }
  }

}