import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../../infrastructure/logger';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { GetStudentResumeReport } from '../../usecases/students/GetStudentResumeReport';
import { GetAllReportByIdRelation } from '../../usecases/report/GetAllReportByIdRelation';

export class ResumeReportController {
  constructor(
    private StudentResumeReport: GetStudentResumeReport,
    private ResumeReportByIdRelation: GetAllReportByIdRelation,
  ) {}

  async getStudentIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const idUser = Number.parseInt(req.query.idUsuario as string);
      const idUniversidad = Number.parseInt(req.query.idUniversidad as string);
      const FechaInicio = req.query.startDate as string;
      const FechaFinal = req.query.finalDate as string;

      let studentList;
      studentList = await this.StudentResumeReport.execute(
        idUniversidad,
        idUser,
        FechaInicio,
        FechaFinal,
      );
      return res.status(200).json({
        data: studentList,
      });
    } catch (error) {
      next(error);
    }
  }

  async generateReportByIdRelation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
      }

      const idRelacion = Number.parseInt(req.query.idrelacion as string);

      const reportList =
        await this.ResumeReportByIdRelation.execute(idRelacion);

      return res.status(200).json({
        message: 'Report Generado Correctamente',
        data: reportList,
      });
    } catch (error) {
      next(error);
    }
  }
}
