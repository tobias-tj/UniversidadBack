import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../../infrastructure/logger';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';
import { StudentFindAll } from '../../usecases/students/StudentFindAll';
import { GetStudentIncident } from '../../usecases/dashboard/getStudentIncident';
import { GetIncidentsByStudentId } from '../../usecases/dashboard/GetIncidentsByStudentId';
import { GetAllStudentsIncidentCount } from '../../usecases/dashboard/GetAllStudentsIncidentCount';

export class dashboardController {
  constructor(
    private StudentIncident: GetStudentIncident,
    private StudentIncidentByExamId: GetIncidentsByStudentId,
    private studentCount: GetAllStudentsIncidentCount,
  ) {}

  async getStudentIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const isCount = req.query.isCount as string;
      let studentList;
      if (isCount) {
        studentList = await this.StudentIncident.execute(true);
      } else {
        studentList = await this.StudentIncident.execute();
      }
      return res.status(200).json({
        data: studentList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentsIncidentByStudentId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const errors = validationResult(req);
      logger.info(
        'Inicia proceso de obtener estudiantes con incidencias por StudentId',
      );
      const studentId = req.query.id as string;
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const studentList = await this.StudentIncidentByExamId.execute(studentId);
      logger.info(
        'Termina proceso de obtener estudiantes con incidencias por StudentId',
      );
      return res.status(200).json({
        data: studentList,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllStudentsCount(req: Request, res: Response, next: NextFunction) {
    try {
      logger.info('Inicia proceso de obtener estudiantes');

      // Extraer y validar token
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      // Decodificar token
      const decoded = decodeToken(token);
      if (!decoded?.connectionDb) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      // Ejecutar caso de uso con la conexión del token
      const studentList = await this.studentCount.execute(decoded.connectionDb);

      logger.info('Termina proceso de obtener estudiantes');
      return res.status(200).json({ data: studentList });
    } catch (error) {
      logger.error('Error en getAllStudentsCount:', error);
      next(error);
    }
  }
}
