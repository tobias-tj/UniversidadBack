import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../../infrastructure/logger';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { StudentFindAll } from '../../usecases/students/StudentFindAll';
import { GetStudentIncident } from '../../usecases/dashboard/getStudentIncident';
import { GetIncidentsByExamId } from '../../usecases/dashboard/GetIncidentsByExamId';
import { GetAllStudentsCount } from '../../usecases/dashboard/GetAllStudentsIncidentCount';

export class dashboardController {
  constructor(
    private StudentIncident: GetStudentIncident,
    private StudentIncidentByExamId: GetIncidentsByExamId,
    private studentCount: GetAllStudentsCount

  ) {}

  async getStudentIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const isCount = req.query.isCount as string;
      let studentList;
      if(isCount){
      studentList = await this.StudentIncident.execute(true);
      }else{
      studentList = await this.StudentIncident.execute();}
      return res.status(200).json({
        data: studentList
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentsIncidentByExamId(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      logger.info('Inicia proceso de obtener estudiantes con incidencias por ExamId');
      const ExamId = req.query.id as string;
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const studentList = await this.StudentIncidentByExamId.execute(ExamId);
      logger.info('Termina proceso de obtener estudiantes con incidencias por ExamId');
      return res.status(200).json({
        data: studentList
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllStudentsCount(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      logger.info('Inicia proceso de obtener estudiantes con incidencias por ExamId');
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const studentList = await this.studentCount.execute();
      logger.info('Termina proceso de obtener estudiantes con incidencias por ExamId');
      return res.status(200).json({
        data: studentList
      });
    } catch (error) {
      next(error);
    }
  }


}