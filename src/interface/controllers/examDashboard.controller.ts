import { Request, Response, NextFunction } from 'express';
import { ExamRepository } from '../../infrastructure/repositories/exam/ExamRepository';
import { validationResult } from 'express-validator';
import { logger } from '../../infrastructure/logger';
import { decodeToken } from '../../domain/interfaces/middleware/jwtMiddleware';

const examRepo = new ExamRepository();

export class ExamDashboardController {
  async getAllExams(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await examRepo.getExamCount();
      res.status(200).json({ count });
    } catch (error) {
      next(error);
    }
  }

  async getExamIncidentFilter(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const exams = await examRepo.filterExams(filters);
      res.status(200).json(exams);
    } catch (error) {
      next(error);
    }
  }

  async getExamClean(req: Request, res: Response, next: NextFunction) {
    try {
      const cleanExamsCount = await examRepo.getCleanExamsCount();
      return res.status(200).json({ count: cleanExamsCount });
    } catch (error) {
      next(error);
    }
  }

  async getExamIncident(req: Request, res: Response, next: NextFunction) {
    try {
      const { countOnly } = req.query;
      const exams = await examRepo.getExamsWithIncidents();

      if (countOnly === 'true') {
        return res.status(200).json({ count: exams.length });
      }

      res.status(200).json(exams);
    } catch (error) {
      next(error);
    }
  }

  async getAllTotalExamCount(req: Request, res: Response, next: NextFunction) {
    try {
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

      const examListTotal = await examRepo.getAllTotalExamCount(
        decoded.connectionDb,
      );
      logger.info('Termina el proceso para obtener total examenes');
      return res.status(200).json({
        data: examListTotal,
      });
    } catch (error) {
      next(error);
    }
  }

  async getListStudentIncidentByExamId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      // Decodificar token
      const decoded = decodeToken(token);
      if (!decoded?.connectionDb) {
        return res.status(401).json({ error: 'Token inválido' });
      }

      const { examId } = req.params;
      const exams = await examRepo.getListStudentByExamId(
        Number(examId),
        decoded.connectionDb,
      );

      if (!exams.length) {
        return res.status(200).json({
          exams,
          message: 'No se han registrado incidentes para este examen',
        });
      }

      res.status(200).json(exams);
    } catch (error) {
      next(error);
    }
  }

  async getAllListExamInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
      }

      // Decodificar token
      const decoded = decodeToken(token);
      if (!decoded?.connectionDb) {
        return res.status(401).json({ error: 'Token inválido' });
      }
      const {
        page = '1',
        limit = '10',
        search = '',
        sortBy = 'fecha',
        order = 'desc',
      } = req.query;

      const filters = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        search: String(search),
        sortBy: String(sortBy),
        order: String(order),
      };

      const { data, totalCount } = await examRepo.getAllListExamInfo(
        decoded.connectionDb,
        filters,
      );
      res.status(200).json({ data, totalCount });
    } catch (error) {
      next(error);
    }
  }
}
